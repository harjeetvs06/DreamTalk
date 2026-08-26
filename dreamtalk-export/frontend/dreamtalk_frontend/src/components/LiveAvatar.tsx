import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  Track,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  ConnectionState,
} from 'livekit-client';
import { getAvatarSession } from '@/lib/liveKitApi';

interface LiveAvatarProps {
  avatarId: string;
  userId: string;
  avatarName: string;
}

type CallState = 'idle' | 'connecting' | 'connected' | 'error';

// Renders the Beyond Presence avatar video streamed over LiveKit and
// publishes the user's mic into the room, so worker.py's agent (STT -> brain
// module -> TTS -> Beyond Presence) can hear and respond. This is the piece
// the chat page was missing entirely - it never opened a LiveKit connection,
// so there was never a video track to show.
export default function LiveAvatar({ avatarId, userId, avatarName }: LiveAvatarProps) {
  const [callState, setCallState] = useState<CallState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [micEnabled, setMicEnabled] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const roomRef = useRef<Room | null>(null);

  const attachTrack = useCallback((track: RemoteTrack) => {
    if (track.kind === Track.Kind.Video && videoRef.current) {
      track.attach(videoRef.current);
    } else if (track.kind === Track.Kind.Audio && audioRef.current) {
      track.attach(audioRef.current);
    }
  }, []);

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    setCallState('idle');
  }, []);

  const connect = useCallback(async () => {
    setCallState('connecting');
    setErrorMsg('');

    try {
      const session = await getAvatarSession(avatarId, userId);
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
        // The Beyond Presence avatar joins as its own participant (not the
        // human user), so any subscribed track here is the avatar's video/audio.
        attachTrack(track);
        void participant;
      });

      room.on(RoomEvent.Disconnected, () => {
        setCallState('idle');
      });

      room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        if (state === ConnectionState.Connected) setCallState('connected');
        if (state === ConnectionState.Disconnected) setCallState('idle');
      });

      await room.connect(session.serverUrl, session.token);
      await room.localParticipant.setMicrophoneEnabled(true);
      setMicEnabled(true);
      setCallState('connected');
    } catch (err) {
      console.error('Failed to start avatar session:', err);
      setErrorMsg(
        err instanceof Error ? err.message : 'Could not connect to the avatar session.'
      );
      setCallState('error');
      roomRef.current?.disconnect();
      roomRef.current = null;
    }
  }, [avatarId, userId, attachTrack]);

  const toggleMic = useCallback(async () => {
    if (!roomRef.current) return;
    const next = !micEnabled;
    await roomRef.current.localParticipant.setMicrophoneEnabled(next);
    setMicEnabled(next);
  }, [micEnabled]);

  // Clean up the room connection when the chat page unmounts (e.g. user
  // navigates away mid-call).
  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
      roomRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-32 bg-[#0A0B0A] rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${callState === 'connected' ? 'block' : 'hidden'}`}
      />
      <audio ref={audioRef} autoPlay />

      {callState !== 'connected' && (
        <span className="text-4xl font-extrabold text-[#C8F02D] font-heading">
          {avatarName.slice(0, 2).toUpperCase()}
        </span>
      )}

      <div className="absolute bottom-2 right-2 flex gap-2">
        {callState === 'idle' && (
          <button
            onClick={connect}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-[#C8F02D] text-[#0A0B0A] hover:brightness-95"
          >
            Start Voice Call
          </button>
        )}
        {callState === 'connecting' && (
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-[#1F211E] text-[#9CA39A] animate-pulse">
            Connecting...
          </span>
        )}
        {callState === 'connected' && (
          <>
            <button
              onClick={toggleMic}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                micEnabled ? 'bg-[#1F211E] text-[#F5F5F0]' : 'bg-red-950/70 text-red-300'
              }`}
            >
              {micEnabled ? 'Mic On' : 'Mic Off'}
            </button>
            <button
              onClick={disconnect}
              className="text-xs px-3 py-1.5 rounded-full font-semibold bg-red-950/70 text-red-300"
            >
              End Call
            </button>
          </>
        )}
        {callState === 'error' && (
          <button
            onClick={connect}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-red-950/70 text-red-300"
          >
            Retry
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="absolute top-2 left-2 right-2 text-[10px] text-red-400 bg-red-950/60 rounded-lg px-2 py-1">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
