/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

// Proxies to avatar-module's POST /api/avatar/session (port 8001 by default).
// That service mints a LiveKit token; worker.py (a separate long-running
// process) auto-joins the same room and streams the Beyond Presence avatar
// video + does STT/TTS via ElevenLabs. This route just brokers the token —
// the actual WebRTC connection happens directly from the browser to LiveKit.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { avatar_id, user_id } = req.body;

  if (!avatar_id || !user_id) {
    return res.status(400).json({ error: 'Missing required parameters avatar_id or user_id' });
  }

  const avatarModuleUrl = process.env.AVATAR_MODULE_URL;
  if (!avatarModuleUrl) {
    return res.status(500).json({
      error: 'AVATAR_MODULE_URL is not configured. Set it in .env to the avatar-module\'s address (default port 8001).',
    });
  }

  const roomName = `room-${avatar_id}-${Date.now()}`;

  try {
    const response = await fetch(`${avatarModuleUrl.replace(/\/$/, '')}/api/avatar/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar_id, room_name: roomName, user_id }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Avatar module returned status ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    return res.status(200).json(data); // { status, token, serverUrl, room_name }
  } catch (error: any) {
    console.error('Error in api/avatar/session proxy:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
