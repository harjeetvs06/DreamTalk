export async function sendChatMessage(avatarId: string, userId: string, message: string) {
  const res = await fetch(`/api/chat/${avatarId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, message }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Chat error: status ${res.status}`);
  }

  return res.json(); // Expected return: { response: string, emotion: string }
}

export async function uploadVoiceSample(avatarId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`/api/voice/${avatarId}`, {
    method: 'POST',
    body: formData, // Browser sets multipart boundary automatically
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Voice upload error: status ${res.status}`);
  }

  return res.json(); // Expected return: { success: boolean, voice_sample_url: string, ... }
}

export async function synthesizeSpeech(text: string, voiceId?: string): Promise<Blob> {
  const res = await fetch('/api/tts/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...(voiceId ? { voice_id: voiceId } : {}) }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Speech synthesis error: status ${res.status}`);
  }

  return res.blob();
}

export async function uploadFaceSample(avatarId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`/api/avatar/${avatarId}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Face upload error: status ${res.status}`);
  }

  return res.json(); // Expected return: { success: boolean, face_sample_url: string, ... }
}
