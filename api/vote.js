// PUTYAHEARTINIT — Single Voting API
// Uses Vercel KV (Redis) for shared persistent vote storage

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — return current votes + voter log
  if (req.method === 'GET') {
    try {
      const votes = await kv.get('mftw_votes') || [0, 0, 0, 0, 0, 0];
      const voters = await kv.get('mftw_voters') || [];
      return res.status(200).json({ votes, voters });
    } catch (err) {
      console.error('KV read error:', err);
      return res.status(500).json({ error: 'Failed to load votes' });
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
      return res.status(500).json({ error: 'Failed to save vote' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
