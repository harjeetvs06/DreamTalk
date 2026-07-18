/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disables parsing so we can pipe/stream the audio file upload
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { avatar_id } = req.query;
  const voiceUrl = process.env.VOICE_MODULE_URL;

  if (!voiceUrl) {
    // Return placeholder response if the Voice module is not live yet
    return res.status(200).json({
      success: true,
      voice_sample_url: `https://storage.dreamtalk.local/voices/${avatar_id}.mp3`,
      message: 'Voice sample uploaded and processed successfully (stubbed).'
    });
  }

  try {
    const response = await fetch(`${voiceUrl.replace(/\/$/, '')}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || '',
      },
      body: req as any, // Stream the raw request body (contains file data)
      duplex: 'half',
    } as any);

    if (!response.ok) {
      throw new Error(`Voice module returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error in api/voice proxy:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
