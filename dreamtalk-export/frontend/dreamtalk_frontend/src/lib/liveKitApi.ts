export interface LiveKitSession {
  status: string;
  token: string;
  serverUrl: string;
  room_name: string;
}

export async function getAvatarSession(avatarId: string, userId: string): Promise<LiveKitSession> {
  const res = await fetch('/api/avatar/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar_id: avatarId, user_id: userId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Avatar session error: status ${res.status}`);
  }

  return res.json();
}
