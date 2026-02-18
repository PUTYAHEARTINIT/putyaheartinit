// PUTYAHEARTINIT Passion Quiz API
// Calls Claude to generate a personalized passion profile

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, answers } = req.body || {};
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Missing quiz answers' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Format answers for Claude
  const answersText = answers
    .map((a, i) => `Q${i + 1} [${a.category}]: "${a.question}"\nAnswer: "${a.answer}"`)
    .join('\n\n');

  const prompt = `You are the PUTYAHEARTINIT Passion AI, created by Stevie Harts. PUTYAHEARTINIT is a movement built on the belief that when you align your heart with your purpose, nothing can stop you.

Someone just completed the PYHI Passion Finder quiz. Here are their 15 answers:

${answersText}

Based on these answers, generate a deeply personal, inspiring passion profile in the PUTYAHEARTINIT voice — street-smart, soulful, direct, motivational. No corporate speak. Speak to them like a big brother or mentor who sees exactly who they are.

Return ONLY a valid JSON object with these exact fields:

{
  "personality_type": "A PYHI title in 2-4 words, ALL CAPS, like THE VISIONARY BUILDER or THE CULTURAL ARCHITECT or THE HEART-LED CREATOR",
  "tagline": "One powerful sentence that captures who they are. Speak directly to them.",
  "description": "2-3 sentences about their nature, gifts, and what makes them unique. Direct, personal, no fluff.",
  "paths": [
    {
      "title": "Career or passion path name (2-4 words)",
      "description": "What this path is and what they'd do in it (1-2 sentences)",
      "why_it_fits": "One specific reason this fits THEM based on their answers (start with 'Because...' or 'Your...')"
    },
    {
      "title": "Second path",
      "description": "Description",
      "why_it_fits": "Why it fits"
    },
    {
      "title": "Third path",
      "description": "Description",
      "why_it_fits": "Why it fits"
    }
  ],
  "pyhi_recommendation": "Which PYHI offering fits them best (The Book / The Creative Studio / The Community / The NIL Program) and one sentence on exactly why. Be specific.",
  "share_text": "A 1-sentence Instagram-ready caption they can copy and post. Include 'putyaheartinit.com' at the end."
}

Return only the JSON. No markdown code blocks. No explanation. Just the JSON.`;

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error('Claude API error:', err);
      return res.status(502).json({ error: 'AI generation failed' });
    }

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content?.[0]?.text || '';

    // Parse JSON from Claude's response
    let profile;
    try {
      profile = JSON.parse(rawText);
    } catch {
      // Try to extract JSON if Claude added any surrounding text
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        profile = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse Claude response');
      }
    }

    // Store the lead (fire and forget — don't block the response)
    storeQuizLead(email, profile).catch(console.error);

    return res.status(200).json(profile);

  } catch (err) {
    console.error('Quiz API error:', err);
    return res.status(500).json({ error: 'Failed to generate profile' });
  }
}

// Store email + result for lead tracking
async function storeQuizLead(email, profile) {
  if (!email) return;
  try {
    const automationApi = process.env.AUTOMATION_API || 'https://putyaheartinit-automation.vercel.app';
    await fetch(`${automationApi}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source: 'passion_quiz',
        tags: ['quiz', profile?.personality_type || 'unknown'],
        metadata: { personality_type: profile?.personality_type }
      })
    });
  } catch {
    // Non-critical — don't throw
  }
}
