import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Resend } from 'resend'
import twilio from 'twilio'

import {
  insertContact, getContactByEmail, getContactByPhone,
  getAllContacts, logEmail, logSms, logIgMessage,
  enqueueDrip, getPendingDrips, markDripSent,
  unsubscribeContact, getStats,
} from './db.js'
import { classifyIntent, generateReply } from './ai.js'
import { templates } from './email-templates.js'

const app = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ───
app.use(helmet())
app.use(cors({ origin: '*' })) // tighten in production
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, slow down.' },
})
app.use('/api/', limiter)

// ─── Service Clients ───
function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'PUTYAHEARTINIT <onboarding@resend.dev>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sweetheartsatl.agency@gmail.com'
const ADMIN_PHONE = process.env.ADMIN_PHONE || null

// ─── Helper: Send Email ───
async function sendEmail(to, subject, html) {
  const resend = getResend()
  if (!resend) {
    console.log(`[EMAIL-MOCK] To: ${to} | Subject: ${subject}`)
    return { id: 'mock-' + Date.now() }
  }
  const result = await resend.emails.send({ from: FROM_EMAIL, to, subject, html })
  return result
}

// ─── Helper: Send SMS ───
async function sendSms(to, body) {
  const client = getTwilioClient()
  if (!client) {
    console.log(`[SMS-MOCK] To: ${to} | Body: ${body}`)
    return { sid: 'mock-' + Date.now() }
  }
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    })
    console.log(`[SMS-SENT] To: ${to} | SID: ${message.sid}`)
    return message
  } catch (error) {
    console.error(`[SMS-ERROR] To: ${to} | Error: ${error.message}`)
    throw error
  }
}

// ════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  const stats = getStats()
  res.json({
    status: 'alive',
    brand: 'PUTYAHEARTINIT',
    services: {
      email: !!process.env.RESEND_API_KEY,
      sms: !!process.env.TWILIO_ACCOUNT_SID,
      ai: !!process.env.OPENAI_API_KEY,
      instagram: !!process.env.META_PAGE_ACCESS_TOKEN,
    },
    ...stats,
  })
})

// ════════════════════════════════════════
// EMAIL / FORM SUBMISSIONS
// ════════════════════════════════════════

/**
 * POST /api/subscribe
 * Landing page form submissions (waitlist + CTA)
 */
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, name, source } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    // Upsert contact
    const result = insertContact.run({
      email: email.toLowerCase().trim(),
      phone: null,
      name: name || null,
      source: source || 'website',
    })

    const contact = getContactByEmail.get(email.toLowerCase().trim())

    // Send welcome email
    const welcome = templates.welcome(name)
    await sendEmail(email, welcome.subject, welcome.html)
    logEmail.run({
      contact_id: contact.id,
      template: 'welcome',
      subject: welcome.subject,
      status: 'sent',
    })

    // Enqueue drip sequence
    const now = new Date()
    const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    const day7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

    enqueueDrip.run({ contact_id: contact.id, template: 'brand_story', send_at: day3 })
    enqueueDrip.run({ contact_id: contact.id, template: 'exclusive_offer', send_at: day7 })

    // Notify admin via email
    await sendEmail(
      ADMIN_EMAIL,
      `New PYHI Subscriber: ${email}`,
      `<p>New subscriber: <strong>${email}</strong>${name ? ` (${name})` : ''}</p><p>Source: ${source || 'website'}</p>`
    )

    // Notify admin via SMS
    if (ADMIN_PHONE) {
      await sendSms(
        ADMIN_PHONE,
        `🎯 New PUTYAHEARTINIT subscriber!\n${email}${name ? ` (${name})` : ''}\nSource: ${source || 'website'}`
      )
    }

    console.log(`[SUBSCRIBE] ${email} — welcome sent, drip queued, admin notified`)
    res.json({ success: true, message: "You're in! Check your inbox." })
  } catch (error) {
    console.error('[SUBSCRIBE ERROR]', error)
    res.status(500).json({ error: 'Something went wrong. Try again.' })
  }
})

/**
 * GET /api/unsubscribe?email=...
 */
app.get('/api/unsubscribe', (req, res) => {
  const { email } = req.query
  if (email) {
    unsubscribeContact.run(email.toLowerCase().trim())
  }
  res.send(`
    <html><body style="background:#0B1026;color:#E8E0D5;font-family:sans-serif;text-align:center;padding:80px;">
      <h2>You've been unsubscribed</h2>
      <p>We're sorry to see you go. You won't receive any more emails from PYHI.</p>
    </body></html>
  `)
})

// ════════════════════════════════════════
// SMS (TWILIO)
// ════════════════════════════════════════

/**
 * POST /api/sms/webhook — Twilio inbound SMS webhook
 * Twilio sends POST with From, To, Body
 */
app.post('/api/sms/webhook', async (req, res) => {
  try {
    const { From: from, Body: body } = req.body

    console.log(`[SMS IN] From: ${from} | Body: ${body}`)
    logSms.run({ phone: from, direction: 'inbound', body, status: 'received' })

    // Handle STOP/unsubscribe
    if (body.trim().toUpperCase() === 'STOP') {
      logSms.run({ phone: from, direction: 'outbound', body: 'Unsubscribed. Reply START to re-subscribe.', status: 'sent' })
      res.type('text/xml').send('<Response><Message>You\'ve been unsubscribed. Reply START to opt back in.</Message></Response>')
      return
    }

    // Handle START/re-subscribe
    if (body.trim().toUpperCase() === 'START') {
      res.type('text/xml').send('<Response><Message>Welcome back to PYHI! You\'re subscribed again. Live. Love. Build.</Message></Response>')
      return
    }

    // AI-powered response
    const intent = await classifyIntent(body)
    const reply = await generateReply(body, intent, 'sms')

    logSms.run({ phone: from, direction: 'outbound', body: reply, status: 'sent' })

    // Respond via TwiML
    res.type('text/xml').send(`<Response><Message>${reply}</Message></Response>`)
  } catch (error) {
    console.error('[SMS WEBHOOK ERROR]', error)
    res.type('text/xml').send('<Response><Message>Thanks for reaching out! Visit putyaheartinit.com</Message></Response>')
  }
})

/**
 * POST /api/sms/send — Send an outbound SMS
 */
app.post('/api/sms/send', async (req, res) => {
  try {
    const { to, message } = req.body

    if (!to || !message) {
      return res.status(400).json({ error: 'to and message required' })
    }

    const result = await sendSms(to, message)
    logSms.run({ phone: to, direction: 'outbound', body: message, status: 'sent' })

    res.json({ success: true, sid: result.sid })
  } catch (error) {
    console.error('[SMS SEND ERROR]', error)
    res.status(500).json({ error: 'Failed to send SMS' })
  }
})

/**
 * POST /api/sms/broadcast — Send SMS to all opted-in contacts
 */
app.post('/api/sms/broadcast', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'message required' })

    const contacts = getAllContacts.all().filter(c => c.sms_opted_in && c.phone)
    let sent = 0

    for (const contact of contacts) {
      try {
        await sendSms(contact.phone, message)
        logSms.run({ phone: contact.phone, direction: 'outbound', body: message, status: 'sent' })
        sent++
      } catch (err) {
        console.error(`Failed SMS to ${contact.phone}:`, err.message)
      }
    }

    res.json({ success: true, sent, total: contacts.length })
  } catch (error) {
    console.error('[SMS BROADCAST ERROR]', error)
    res.status(500).json({ error: 'Broadcast failed' })
  }
})

// ════════════════════════════════════════
// INSTAGRAM DM (META WEBHOOK)
// ════════════════════════════════════════

/**
 * GET /api/instagram/webhook — Meta verification
 */
app.get('/api/instagram/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    console.log('[IG] Webhook verified')
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

/**
 * POST /api/instagram/webhook — Inbound DM handler
 */
app.post('/api/instagram/webhook', async (req, res) => {
  try {
    const { entry } = req.body

    // Always respond 200 quickly to Meta
    res.sendStatus(200)

    if (!entry) return

    for (const e of entry) {
      const messaging = e.messaging || []
      for (const event of messaging) {
        if (event.message && event.message.text) {
          const senderId = event.sender.id
          const messageText = event.message.text

          console.log(`[IG DM] From: ${senderId} | Message: ${messageText}`)

          // Classify and respond
          const intent = await classifyIntent(messageText)
          const reply = await generateReply(messageText, intent, 'dm')

          // Log
          logIgMessage.run({
            sender_id: senderId,
            message: messageText,
            reply,
            intent,
          })

          // Send reply via Meta API
          await sendInstagramReply(senderId, reply)
        }
      }
    }
  } catch (error) {
    console.error('[IG WEBHOOK ERROR]', error)
  }
})

async function sendInstagramReply(recipientId, message) {
  const token = process.env.META_PAGE_ACCESS_TOKEN
  if (!token) {
    console.log(`[IG-MOCK] To: ${recipientId} | Reply: ${message}`)
    return
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/me/messages?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
        }),
      }
    )
    const data = await response.json()
    if (data.error) console.error('[IG SEND ERROR]', data.error)
  } catch (err) {
    console.error('[IG SEND FETCH ERROR]', err.message)
  }
}

// ════════════════════════════════════════
// DRIP SEQUENCE PROCESSOR
// ════════════════════════════════════════

async function processDripQueue() {
  const pending = getPendingDrips.all()

  for (const drip of pending) {
    try {
      const template = templates[drip.template]
      if (!template) {
        console.error(`Unknown template: ${drip.template}`)
        markDripSent.run(drip.id)
        continue
      }

      const { subject, html } = template(drip.name)
      await sendEmail(drip.email, subject, html)

      logEmail.run({
        contact_id: drip.contact_id,
        template: drip.template,
        subject,
        status: 'sent',
      })

      markDripSent.run(drip.id)
      console.log(`[DRIP] Sent "${drip.template}" to ${drip.email}`)
    } catch (err) {
      console.error(`[DRIP ERROR] ${drip.email}:`, err.message)
    }
  }
}

// Run drip processor every 5 minutes
setInterval(processDripQueue, 5 * 60 * 1000)

// ════════════════════════════════════════
// ADMIN / DASHBOARD ENDPOINTS
// ════════════════════════════════════════

app.get('/api/contacts', (req, res) => {
  const contacts = getAllContacts.all()
  res.json({ contacts, total: contacts.length })
})

app.get('/api/stats', (req, res) => {
  res.json(getStats())
})

/**
 * POST /api/email/broadcast — Send email to all subscribers
 */
app.post('/api/email/broadcast', async (req, res) => {
  try {
    const { subject, html, template, templateData } = req.body

    if (!subject && !template) {
      return res.status(400).json({ error: 'subject+html or template required' })
    }

    const contacts = getAllContacts.all()
    let sent = 0
    let emailSubject = subject
    let emailHtml = html

    // Use template if specified
    if (template && templates[template]) {
      const tmpl = templates[template](templateData)
      emailSubject = tmpl.subject
      emailHtml = tmpl.html
    }

    for (const contact of contacts) {
      try {
        await sendEmail(contact.email, emailSubject, emailHtml)
        logEmail.run({
          contact_id: contact.id,
          template: template || 'broadcast',
          subject: emailSubject,
          status: 'sent',
        })
        sent++
      } catch (err) {
        console.error(`Failed email to ${contact.email}:`, err.message)
      }
    }

    res.json({ success: true, sent, total: contacts.length })
  } catch (error) {
    console.error('[EMAIL BROADCAST ERROR]', error)
    res.status(500).json({ error: 'Broadcast failed' })
  }
})

// ════════════════════════════════════════
// STRIPE WEBHOOKS
// ════════════════════════════════════════

/**
 * POST /api/stripe/webhook — Stripe payment events
 * Handles checkout.session.completed, payment_intent.succeeded, etc.
 */
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const event = req.body

    // Handle the event
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const session = event.data.object

      const customerEmail = session.customer_details?.email || session.receipt_email
      const customerName = session.customer_details?.name
      const amount = (session.amount_total || session.amount) / 100
      const productName = session.metadata?.product_name || 'Product'

      // Notify admin via email
      await sendEmail(
        ADMIN_EMAIL,
        `💰 New PUTYAHEARTINIT Purchase!`,
        `<h2>New Order Received</h2>
         <p><strong>Customer:</strong> ${customerName || 'N/A'} (${customerEmail})</p>
         <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
         <p><strong>Product:</strong> ${productName}</p>
         <p><strong>Payment ID:</strong> ${session.id}</p>`
      )

      // Notify admin via SMS
      if (ADMIN_PHONE) {
        await sendSms(
          ADMIN_PHONE,
          `💰 NEW SALE!\n$${amount.toFixed(2)} - ${productName}\nCustomer: ${customerEmail}`
        )
      }

      // Send thank you email to customer
      if (customerEmail) {
        await sendEmail(
          customerEmail,
          'Thank You for Your PUTYAHEARTINIT Order! 🖤',
          `<div style="background:#0a0a0a;color:#F0EDE6;font-family:Arial,sans-serif;padding:40px;">
            <h1 style="font-family:'Bebas Neue',sans-serif;letter-spacing:4px;color:#fff;">THANK YOU</h1>
            <p>Hey ${customerName || 'there'},</p>
            <p>Your order has been received and is being processed. We'll send you tracking info soon.</p>
            <p><strong>Order Total:</strong> $${amount.toFixed(2)}</p>
            <p style="margin-top:40px;">Put ya heart in it,<br><strong>PUTYAHEARTINIT Team</strong></p>
          </div>`
        )
      }

      console.log(`[STRIPE] Purchase: ${customerEmail} - $${amount}`)
    }

    res.json({received: true})
  } catch (error) {
    console.error('[STRIPE WEBHOOK ERROR]', error)
    res.status(500).json({error: 'Webhook error'})
  }
})

// ════════════════════════════════════════
// START SERVER (local only)
// ════════════════════════════════════════

// Only start server if not on Vercel
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║   PUTYAHEARTINIT AUTOMATION ENGINE       ║
║   Running on http://localhost:${PORT}        ║
║                                          ║
║   Endpoints:                             ║
║   POST /api/subscribe     (forms)        ║
║   POST /api/stripe/webhook (purchases)   ║
║   POST /api/sms/webhook   (Twilio in)    ║
║   POST /api/sms/send      (SMS out)      ║
║   POST /api/sms/broadcast (SMS blast)    ║
║   POST /api/instagram/webhook (IG DMs)   ║
║   POST /api/email/broadcast (email blast)║
║   GET  /api/contacts      (admin)        ║
║   GET  /api/stats         (dashboard)    ║
║   GET  /api/health        (status)       ║
╚══════════════════════════════════════════╝
    `)

    // Initial drip check
    processDripQueue()
  })
} else {
  // On Vercel, just run drip queue check once
  processDripQueue()
}

// Export for Vercel
export default app;
