import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// On Vercel, skip database (no persistent filesystem)
const isVercel = process.env.VERCEL === '1'
let db = null

if (!isVercel) {
  db = new Database(join(__dirname, 'pyhi.db'))
  db.pragma('journal_mode = WAL')
  
  // ─── Schema ───
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      name TEXT,
      source TEXT DEFAULT 'website',
      subscribed INTEGER DEFAULT 1,
      sms_opted_in INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS emails_sent (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER,
      template TEXT,
      subject TEXT,
      status TEXT DEFAULT 'sent',
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS sms_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER,
      message TEXT,
      direction TEXT DEFAULT 'outbound',
      status TEXT DEFAULT 'sent',
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS ig_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ig_user_id TEXT,
      message TEXT,
      direction TEXT DEFAULT 'inbound',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS drip_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER,
      template TEXT,
      send_at DATETIME,
      sent INTEGER DEFAULT 0,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );
  `)
}

// Mock functions for Vercel
const mockPrepare = () => ({
  run: () => ({ lastInsertRowid: 1, changes: 1 }),
  get: () => ({ id: 1, count: 0 }),
  all: () => []
})

export const insertContact = db ? db.prepare(`
  INSERT OR IGNORE INTO contacts (email, phone, name, source) VALUES (@email, @phone, @name, @source)
`) : mockPrepare()

export const getContactByEmail = db ? db.prepare(
  'SELECT * FROM contacts WHERE email = ?'
) : mockPrepare()

export const getContactByPhone = db ? db.prepare(
  'SELECT * FROM contacts WHERE phone = ?'
) : mockPrepare()

export const getAllContacts = db ? db.prepare(
  'SELECT * FROM contacts WHERE subscribed = 1 ORDER BY created_at DESC'
) : mockPrepare()

export const logEmail = db ? db.prepare(`
  INSERT INTO emails_sent (contact_id, template, subject, status) VALUES (@contact_id, @template, @subject, @status)
`) : mockPrepare()

export const logSms = db ? db.prepare(`
  INSERT INTO sms_log (contact_id, message, direction, status) VALUES (@contact_id, @message, @direction, @status)
`) : mockPrepare()

export const logIgMessage = db ? db.prepare(`
  INSERT INTO ig_messages (ig_user_id, message, direction) VALUES (@ig_user_id, @message, @direction)
`) : mockPrepare()

export const enqueueDrip = db ? db.prepare(`
  INSERT INTO drip_queue (contact_id, template, send_at) VALUES (@contact_id, @template, @send_at)
`) : mockPrepare()

export const getPendingDrips = db ? db.prepare(`
  SELECT d.*, c.email, c.name
  FROM drip_queue d
  JOIN contacts c ON d.contact_id = c.id
  WHERE d.sent = 0 AND d.send_at <= datetime('now')
`) : mockPrepare()

export const markDripSent = db ? db.prepare(
  'UPDATE drip_queue SET sent = 1 WHERE id = ?'
) : mockPrepare()

export const unsubscribeContact = db ? db.prepare(
  'UPDATE contacts SET subscribed = 0 WHERE email = ?'
) : mockPrepare()

export function getStats() {
  if (!db) return { contacts: 0, emails: 0, sms: 0, igMessages: 0 }
  
  const contacts = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE subscribed = 1').get()
  const emails = db.prepare('SELECT COUNT(*) as count FROM emails_sent').get()
  const sms = db.prepare('SELECT COUNT(*) as count FROM sms_log').get()
  const igMessages = db.prepare('SELECT COUNT(*) as count FROM ig_messages').get()

  return {
    contacts: contacts.count,
    emails: emails.count,
    sms: sms.count,
    igMessages: igMessages.count,
  }
}

export function processDripQueue() {
  if (!db) return
  // Drip queue processing...
}
