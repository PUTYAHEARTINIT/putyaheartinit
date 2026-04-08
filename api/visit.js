// PUTYAHEARTINIT — Visit Tracker API
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

  // POST — log a visit
  if (req.method === 'POST') {
    const { event, referrer, userAgent, screenSize } = req.body || {};
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';

    try {
      await supaFetch('visits', {
        method: 'POST',
        body: JSON.stringify({
          event: event || 'gate_view',
          ip: ip.split(',')[0].trim(),
          referrer: referrer || 'direct',
          user_agent: userAgent || '',
          screen_size: screenSize || ''
        })
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Visit log error:', err);
      return res.status(500).json({ error: 'Failed to log visit' });
    }
  }

  // GET — return all visits
  if (req.method === 'GET') {
    try {
      const visits = await supaFetch('visits?select=*&order=created_at.desc&limit=200');
      return res.status(200).json({
        visits: visits.map(v => ({
          event: v.event,
          ip: v.ip,
          referrer: v.referrer,
          userAgent: v.user_agent,
          screenSize: v.screen_size,
          timestamp: new Date(v.created_at).getTime()
        }))
      });
    } catch (err) {
      console.error('Visit read error:', err);
      return res.status(500).json({ error: 'Failed to load visits' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
