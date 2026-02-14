import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const BRAND_CONTEXT = `You are the AI voice of PUTYAHEARTINIT (PYHI) — a premium streetwear brand and cultural movement founded by Stevie Harts out of Atlanta.

Brand voice: Warm, authentic, motivational, culturally aware. Mix street culture with heart. Never corporate or stiff. Use short, punchy sentences. Occasional slang is OK but stay classy.

Key brand pillars:
- "Live. Love. Build." — the brand mantra
- Community over competition
- Heart-first entrepreneurship
- Music, fashion, and culture intersect
- NIL partnerships with college athletes
- Services: brand consulting, content creation, event curation

Products: Premium streetwear (hoodies, tees, hats, accessories)
Shop: putyaheartinit.com
Music: Stevie Harts on all platforms
Book: "The Book of Stevie" — chapters on purpose, love, legacy

Keep responses concise (2-3 sentences max for DMs/texts, slightly longer for emails).`

/**
 * Classify intent from an inbound message
 */
export async function classifyIntent(message) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Classify the intent of this message to the PUTYAHEARTINIT brand. Return ONLY one of these categories:
- PRICING (asking about product prices, costs, shipping)
- DROP_DATE (asking about new releases, restocks, upcoming drops)
- COLLAB (wanting to collaborate, partner, model, ambassador)
- ORDER_STATUS (asking about an existing order)
- GENERAL (greeting, compliment, general question)
- SUPPORT (complaint, issue, return request)
- NIL (asking about NIL partnerships, athlete deals)
- SPAM (clearly spam or irrelevant)`
        },
        { role: 'user', content: message }
      ],
      temperature: 0,
      max_tokens: 20,
    })
    return response.choices[0].message.content.trim()
  } catch (err) {
    console.error('Intent classification error:', err.message)
    return 'GENERAL'
  }
}

/**
 * Generate a brand-voice reply to a message
 */
export async function generateReply(message, intent, channel = 'dm') {
  const channelInstructions = {
    dm: 'This is an Instagram DM. Keep it casual and short (1-3 sentences). Use emojis sparingly.',
    sms: 'This is a text message. Keep it very short (1-2 sentences). Include a link only if relevant.',
    email: 'This is an email reply. Can be slightly longer (2-4 sentences). Professional but warm.',
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${BRAND_CONTEXT}\n\n${channelInstructions[channel]}\n\nThe message intent is: ${intent}\n\nIf intent is COLLAB or NIL, ask them to email sweetheartsatl.agency@gmail.com or DM @putyaheartinit on Instagram for details.\nIf intent is ORDER_STATUS, direct them to check their email for tracking or reply with their order number.\nIf intent is SPAM, reply with a polite "Thanks for reaching out!" and nothing more.`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 150,
    })
    return response.choices[0].message.content.trim()
  } catch (err) {
    console.error('Reply generation error:', err.message)
    return "Thanks for reaching out! We'll get back to you soon. In the meantime, check out putyaheartinit.com"
  }
}

/**
 * Generate a subject line for an email
 */
export async function generateSubject(context) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${BRAND_CONTEXT}\n\nGenerate a compelling email subject line. Short, punchy, brand-aligned. No emojis in subject. Return ONLY the subject line text.`
        },
        { role: 'user', content: `Generate a subject line for: ${context}` }
      ],
      temperature: 0.8,
      max_tokens: 30,
    })
    return response.choices[0].message.content.trim()
  } catch {
    return 'PYHI — Something for You'
  }
}
