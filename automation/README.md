# PYHI Automation Engine

AI-powered automation for PUTYAHEARTINIT — handles email sequences, SMS replies, and Instagram DM auto-responses.

## Quick Start

```bash
cd ~/putyaheartinit/automation
./start.sh
```

This launches:
- **Automation API** → `http://localhost:3001`
- **n8n Dashboard** → `http://localhost:5678`

## Architecture

```
Landing Page Forms ──POST──→ /api/subscribe ──→ Welcome Email + Drip Sequence
Twilio SMS ──webhook──→ /api/sms/webhook ──→ AI Intent → Brand Voice Reply
Instagram DMs ──Meta webhook──→ /api/instagram/webhook ──→ AI Reply via Graph API
```

## Setup

1. Copy `.env.example` to `.env`
2. Add your API keys:

| Service | Key | Get it at |
|---------|-----|-----------|
| Resend | `RESEND_API_KEY` | resend.com |
| Twilio | `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` | twilio.com/console |
| OpenAI | `OPENAI_API_KEY` | platform.openai.com |
| Meta | `META_PAGE_ACCESS_TOKEN` | developers.facebook.com |

3. Run `npm install`
4. Run `./start.sh`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/subscribe` | Email signup (forms) |
| GET | `/api/unsubscribe` | Email unsubscribe |
| POST | `/api/sms/webhook` | Twilio inbound SMS |
| POST | `/api/sms/send` | Send single SMS |
| POST | `/api/sms/broadcast` | SMS to all contacts |
| GET/POST | `/api/instagram/webhook` | Meta DM webhook |
| POST | `/api/email/broadcast` | Email all subscribers |
| GET | `/api/contacts` | List all contacts |
| GET | `/api/stats` | Dashboard stats |
| GET | `/api/health` | Service health check |

## Email Drip Sequence

When someone subscribes:
- **Day 0**: Welcome email ("You're In — Welcome to the Movement")
- **Day 3**: Brand story ("The Story Behind the Heart")
- **Day 7**: Exclusive 15% off with code `HEART15`

## n8n Workflows

Import from `./workflows/`:
- `pyhi-email-drip.json` — Monitors drip queue
- `pyhi-sms-ai-responder.json` — Routes Twilio SMS
- `pyhi-ig-dm-responder.json` — Routes Instagram DMs

## SMS Commands

Users can text:
- **STOP** → Unsubscribe from SMS
- **START** → Re-subscribe
- Anything else → AI-generated brand voice response

## AI Intent Classification

Inbound messages (SMS + Instagram) are classified into:
- `PRICING` → Product/shipping cost info
- `DROP_DATE` → New release info
- `COLLAB` → Partnership/ambassador inquiries
- `ORDER_STATUS` → Order tracking
- `NIL` → NIL partnership questions
- `GENERAL` → Greetings, compliments
- `SUPPORT` → Issues, returns
- `SPAM` → Filtered

## Database

SQLite database (`pyhi.db`) stores:
- Contacts (email, phone, subscription status)
- Email send log
- SMS log (inbound + outbound)
- Instagram message log
- Drip queue
