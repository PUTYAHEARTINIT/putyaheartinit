// PUTYAHEARTINIT — Back Office API
// CRUD for all modules via Supabase

const SUPABASE_URL = 'https://lcmdahdtphckrgsgssrb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbWRhaGR0cGhja3Jnc2dzc3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MDg0OTcsImV4cCI6MjA5MTE4NDQ5N30.0u-pwdqtZ7qt5xpCS43MixknUiRAOFIdZgvqISN-xrI';

const VALID_TABLES = [
  'projects','tasks','splits','vault_entries','contacts','revenue_entries',
  'goals','calendar_events','streaming_stats','social_stats','shows',
  'sync_pitches','brand_deals','d2c_orders','team_members','fans'
];

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' ? 'return=representation' :
                options.method === 'PATCH' ? 'return=representation' :
                options.method === 'DELETE' ? 'return=representation' : '',
      ...options.headers
    }
  });
  if (options.method === 'DELETE' && res.status === 204) return [];
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { table, id, action } = req.query || {};

  if (!table || !VALID_TABLES.includes(table)) {
    return res.status(400).json({ error: 'Invalid table', valid: VALID_TABLES });
  }

  // GET — list all rows (with optional filters via query params)
  if (req.method === 'GET') {
    try {
      let path = `${table}?select=*&order=created_at.desc`;
      if (id) path = `${table}?id=eq.${id}&select=*`;
      const data = await supaFetch(path);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch', detail: err.message });
    }
  }

  // POST — insert new row
  if (req.method === 'POST') {
    try {
      const data = await supaFetch(table, {
        method: 'POST',
        body: JSON.stringify(req.body)
      });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to insert', detail: err.message });
    }
  }

  // PATCH — update row by id
  if (req.method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'id required for update' });
    try {
      const data = await supaFetch(`${table}?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(req.body)
      });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update', detail: err.message });
    }
  }

  // DELETE — delete row by id
  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'id required for delete' });
    try {
      await supaFetch(`${table}?id=eq.${id}`, { method: 'DELETE' });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
