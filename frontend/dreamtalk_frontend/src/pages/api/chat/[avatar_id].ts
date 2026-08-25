/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { avatar_id } = req.query;
  const { user_id, message } = req.body;

  if (!user_id || !avatar_id || !message) {
    return res.status(400).json({ error: 'Missing required parameters user_id, avatar_id, or message' });
  }

  const brainUrl = process.env.BRAIN_MODULE_URL;
  if (!brainUrl) {
    // Return a clean stub response when the brain module is not live
    const responses = [
      "I hear what you are saying. Let's explore this further.",
      "That is a clear point. How do you plan to act on it?",
      "I understand. Let me know what you want to focus on next.",
      "We should look at this from a few different angles."
    ];
    const emotions = ['neutral', 'joy', 'surprise', 'analytical'];
    const randomIdx = Math.floor(Math.random() * responses.length);
    
    return res.status(200).json({
      response: `[Stub] ${responses[randomIdx]}`,
      emotion: emotions[randomIdx]
    });
  }

  try {
    const response = await fetch(`${brainUrl.replace(/\/$/, '')}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, avatar_id, user_input: message }),
    });

    if (!response.ok) {
      throw new Error(`Brain module returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error in api/chat proxy:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
