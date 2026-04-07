// PUTYAHEARTINIT — Single Voting API
// Uses in-memory + /tmp file storage for persistence within serverless instance
// For a 10-day voting window this works well

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join('/tmp', 'pyhi-votes.json');

function loadData() {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return { votes: [0, 0, 0, 0, 0, 0], voters: [] };
}

function saveData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
}

// Keep in memory for fast reads within same instance
let cached = null;

function getData() {
  if (!cached) cached = loadData();
  return cached;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — return current votes + voter log
  if (req.method === 'GET') {
    const data = getData();
    return res.status(200).json(data);
  }

  // POST — cast a vote
  if (req.method === 'POST') {
    const { trackIndex, voterName } = req.body || {};

    if (typeof trackIndex !== 'number' || trackIndex < 0 || trackIndex > 5) {
      return res.status(400).json({ error: 'Invalid track index' });
    }
    if (!voterName || typeof voterName !== 'string') {
      return res.status(400).json({ error: 'Name required' });
    }

    const data = getData();
    data.votes[trackIndex]++;
    data.voters.push({
      name: voterName.trim(),
      trackIndex,
      timestamp: Date.now()
    });

    saveData(data);
    cached = data;

    return res.status(200).json({ success: true, votes: data.votes, voters: data.voters });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
