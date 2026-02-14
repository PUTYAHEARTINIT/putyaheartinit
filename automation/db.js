import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'pyhi.db'))

// Enable WAL mode for better concurrent performance
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
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS emails_sent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER NOT NULL,
    template TEXT NOT NULL,
    subject TEXT,
    status TEXT DEFAULT 'sent',
    sent_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
  );

  CREATE TABLE IF NOT EXISTS sms_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    direction TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ig_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT NOT NULL,
    message TEXT,
    reply TEXT,
    intent TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS drip_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER NOT NULL,
    template TEXT NOT NULL,
    send_at TEXT NOT NULL,
    sent INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
  );
`)

// ─── Prepared Statements ───
export const insertContact = db.prepare(`
  INSERT INTO contacts (email, phone, name, source)
  VALUES (@email, @phone, @name, @source)
  ON CONFLICT(email) DO UPDATE SET
    phone = COALESCE(@phone, contacts.phone),
    name = COALESCE(@name, contacts.name),
    updated_at = datetime('now')
`)

export const getContactByEmail = db.prepare(
  'SELECT * FROM contacts WHERE email = ?'
)

export const getContactByPhone = db.prepare(
  'SELECT * FROM contacts WHERE phone = ?'
)

export const getAllContacts = db.prepare(
  'SELECT * FROM contacts WHERE subscribed = 1 ORDER BY created_at DESC'
)

export const logEmail = db.prepare(`
  INSERT INTO emails_sent (contact_id, template, subject, status)
  VALUES (@contact_id, @template, @subject, @status)
`)

export const logSms = db.prepare(`
  INSERT INTO sms_log (phone, direction, body, status)
  VALUES (@phone, @direction, @body, @status)
`)

export const logIgMessage = db.prepare(`
  INSERT INTO ig_messages (sender_id, message, reply, intent)
  VALUES (@sender_id, @message, @reply, @intent)
`)

export const enqueueDrip = db.prepare(`
  INSERT INTO drip_queue (contact_id, template, send_at)
  VALUES (@contact_id, @template, @send_at)
`)

export const getPendingDrips = db.prepare(`
  SELECT dq.*, c.email, c.name FROM drip_queue dq
  JOIN contacts c ON c.id = dq.contact_id
  WHERE dq.sent = 0 AND dq.send_at <= datetime('now')
`)

export const markDripSent = db.prepare(
  'UPDATE drip_queue SET sent = 1 WHERE id = ?'
)

export const unsubscribeContact = db.prepare(
  'UPDATE contacts SET subscribed = 0, updated_at = datetime(\'now\') WHERE email = ?'
)

export const getStats = () => {
  const contacts = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE subscribed = 1').get()
  const emails = db.prepare('SELECT COUNT(*) as count FROM emails_sent').get()
  const sms = db.prepare('SELECT COUNT(*) as count FROM sms_log').get()
  const igMessages = db.prepare('SELECT COUNT(*) as count FROM ig_messages').get()
  return {
    totalContacts: contacts.count,
    totalEmailsSent: emails.count,
    totalSms: sms.count,
    totalIgMessages: igMessages.count,
  }
}

export default db
