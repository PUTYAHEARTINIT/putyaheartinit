// PUTYAHEARTINIT — Visit Tracker API
// Logs every visit to the voting page gate

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join('/tmp', 'pyhi-visits.json');

function loadData() {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return { visits: [] };
}

function saveData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
}

let cached = null;
function getData() {
  if (!cached) cached = loadData();
  return cached;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST — log a visit
  if (req.method === 'POST') {
    const { event, referrer, userAgent, screenSize } = req.body || {};
    const data = getData();

    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';

    data.visits.push({
      event: event || 'gate_view',
      ip: ip.split(',')[0].trim(),
      referrer: referrer || 'direct',
      userAgent: userAgent || '',
      screenSize: screenSize || '',
      timestamp: Date.now()
    });

    saveData(data);
    cached = data;

    return res.status(200).json({ success: true });
  }

  // GET — return all visits
  if (req.method === 'GET') {
    const data = getData();
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
