// PUTYAHEARTINIT — Single Voting API
// Uses Vercel KV (Redis) for shared persistent vote storage

import { createClient } from '@vercel/kv';

// Auto-detect KV env vars (Vercel names them based on your store name)
function getKV() {
  // Try standard names first
  const url = process.env.KV_REST_API_URL || process.env.KV_URL
    || process.env.REDIS_REST_API_URL || process.env.REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.KV_REST_TOKEN
    || process.env.REDIS_REST_API_TOKEN || process.env.REDIS_TOKEN;

  // Also check for any env var ending in _REST_API_URL
  if (!url || !token) {
    const envKeys = Object.keys(process.env);
    const urlKey = envKeys.find(k => k.endsWith('_REST_API_URL') || k.endsWith('_URL') && k.includes('KV'));
    const tokenKey = envKeys.find(k => k.endsWith('_REST_API_TOKEN') || k.endsWith('_TOKEN') && k.includes('KV'));
    if (urlKey && tokenKey) {
      return createClient({ url: process.env[urlKey], token: process.env[tokenKey] });
    }
  }

  if (!url || !token) {
    return null;
  }

  return createClient({ url, token });
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const kv = getKV();

  if (!kv) {
    // List available env vars (names only, not values) for debugging
    const kvVars = Object.keys(process.env).filter(k =>
      k.includes('KV') || k.includes('REDIS') || k.includes('UPSTASH')
    );
    return res.status(500).json({
      error: 'KV not configured',
      hint: 'No KV environment variables found. Make sure KV store is connected to this project.',
      available_kv_vars: kvVars
    });
  }

  // GET — return current votes + voter log
  if (req.method === 'GET') {
    try {
      const votes = await kv.get('mftw_votes') || [0, 0, 0, 0, 0, 0];
      const voters = await kv.get('mftw_voters') || [];
      return res.status(200).json({ votes, voters });
    } catch (err) {
      console.error('KV read error:', err);
      return res.status(500).json({ error: 'Failed to load votes', detail: err.message });
    }
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

    try {
      // Get current votes
      const votes = await kv.get('mftw_votes') || [0, 0, 0, 0, 0, 0];
      votes[trackIndex]++;
      await kv.set('mftw_votes', votes);

      // Add to voter log
      const voters = await kv.get('mftw_voters') || [];
      voters.push({
        name: voterName.trim(),
        trackIndex,
        timestamp: Date.now()
      });
      await kv.set('mftw_voters', voters);

      return res.status(200).json({ success: true, votes, voters });
    } catch (err) {
      console.error('KV write error:', err);
      return res.status(500).json({ error: 'Failed to save vote', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
