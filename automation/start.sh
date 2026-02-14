#!/bin/bash
# ═══════════════════════════════════════════════
# PUTYAHEARTINIT Automation Engine — Startup
# ═══════════════════════════════════════════════

cd "$(dirname "$0")"

echo "╔══════════════════════════════════════════╗"
echo "║   PYHI AUTOMATION — Starting Up...       ║"
echo "╚══════════════════════════════════════════╝"

# Check for .env
if [ ! -f .env ]; then
  echo "⚠ No .env file found. Copying from .env.example..."
  cp .env.example .env
  echo "→ Edit .env with your API keys before using live services."
fi

# Check for node_modules
if [ ! -d node_modules ]; then
  echo "→ Installing dependencies..."
  npm install
fi

echo ""
echo "Starting services..."
echo "  → Automation API on http://localhost:3001"
echo "  → n8n Dashboard on http://localhost:5678"
echo ""

# Start both services
npx concurrently \
  --names "API,N8N" \
  --prefix-colors "cyan,magenta" \
  "node --watch server.js" \
  "n8n start"
