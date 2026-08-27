import type { NextApiRequest, NextApiResponse } from 'next';

const MAX_TEXT_LENGTH = 5_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const voiceModuleUrl = process.env.VOICE_MODULE_URL;
  if (!voiceModuleUrl) {
    return res.status(500).json({ error: 'VOICE_MODULE_URL is not configured.' });
  }

  const { text, voice_id: requestedVoiceId } = req.body ?? {};
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'A non-empty text value is required.' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer.` });
  }

  // Keep the selected ElevenLabs ID on the server. A request-level value is
  // supported for a future per-avatar voice setting, but the configured value
  // takes precedence so users cannot select arbitrary account voices.
  const configuredVoiceId = process.env.TTS_VOICE_ID;
  const voiceId = configuredVoiceId || (typeof requestedVoiceId === 'string' ? requestedVoiceId : undefined);

  try {
    const response = await fetch(`${voiceModuleUrl.replace(/\/$/, '')}/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), ...(voiceId ? { voice_id: voiceId } : {}) }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Voice module returned status ${response.status}: ${detail}`);
    }

    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(audio);
  } catch (error) {
    console.error('Error synthesizing ElevenLabs speech:', error);
    return res.status(502).json({
      error: error instanceof Error ? error.message : 'Unable to synthesize speech.',
    });
  }
}
