// PUTYAHEARTINIT — Single Voting API
// Persistent storage via Supabase (PostgreSQL)

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lcmdahdtphckrgsgssrb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbWRhaGR0cGhja3Jnc2dzc3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MDg0OTcsImV4cCI6MjA5MTE4NDQ5N30.0u-pwdqtZ7qt5xpCS43MixknUiRAOFIdZgvqISN-xrI';

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' ? 'return=representation' : '',
      ...options.headers
    }
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — return vote counts + voter log
  if (req.method === 'GET') {
    try {
      const allVotes = await supaFetch('votes?select=*&order=created_at.desc');

      // Build vote counts
      const counts = [0, 0, 0, 0, 0, 0];
      const voters = [];
      allVotes.forEach(v => {
        if (v.track_index >= 0 && v.track_index <= 5) counts[v.track_index]++;
        voters.push({
          name: v.voter_name,
          trackIndex: v.track_index,
          timestamp: new Date(v.created_at).getTime()
        });
      });

      return res.status(200).json({ votes: counts, voters });
    } catch (err) {
      console.error('DB read error:', err);
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
      await supaFetch('votes', {
        method: 'POST',
        body: JSON.stringify({ voter_name: voterName.trim(), track_index: trackIndex })
      });

      // Return updated counts
      const allVotes = await supaFetch('votes?select=*&order=created_at.desc');
      const counts = [0, 0, 0, 0, 0, 0];
      const voters = [];
      allVotes.forEach(v => {
        if (v.track_index >= 0 && v.track_index <= 5) counts[v.track_index]++;
        voters.push({
          name: v.voter_name,
          trackIndex: v.track_index,
          timestamp: new Date(v.created_at).getTime()
        });
      });

      return res.status(200).json({ success: true, votes: counts, voters });
    } catch (err) {
      console.error('DB write error:', err);
      return res.status(500).json({ error: 'Failed to save vote' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
