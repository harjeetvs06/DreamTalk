/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disables parsing so we can pipe/stream the face video file upload
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { avatar_id } = req.query;
  const avatarUrl = process.env.AVATAR_MODULE_URL;

  if (!avatarUrl) {
    // Return placeholder response if the Face/video module is not live yet
    return res.status(200).json({
      success: true,
      face_sample_url: `https://storage.dreamtalk.local/faces/${avatar_id}.mp4`,
      message: 'Face video sample uploaded and processed successfully (stubbed).'
    });
  }

  try {
    const response = await fetch(`${avatarUrl.replace(/\/$/, '')}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || '',
      },
      body: req as any,
      duplex: 'half',
    } as any);

    if (!response.ok) {
      throw new Error(`Avatar module returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error in api/avatar proxy:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
