/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { avatar_id, room_name, user_id } = req.body;

  if (!avatar_id || !room_name || !user_id) {
    return res.status(400).json({ error: 'Missing required parameters avatar_id, room_name, or user_id' });
  }

  const avatarUrl = process.env.AVATAR_MODULE_URL;
  if (!avatarUrl) {
    return res.status(500).json({ error: 'AVATAR_MODULE_URL is not configured' });
  }

  try {
    const response = await fetch(`${avatarUrl.replace(/\/$/, '')}/api/avatar/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar_id, room_name, user_id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `Avatar module returned status ${response.status}`);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error in api/avatar/session proxy:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
