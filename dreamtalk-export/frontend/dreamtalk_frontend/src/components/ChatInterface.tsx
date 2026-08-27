import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { synthesizeSpeech } from '@/lib/brainApi';

export interface Message {
  id: string;
  sender: 'user' | 'avatar';
  text: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  sending: boolean;
}

// Child component for a single chat bubble, so we animate it on mount via GSAP
function MessageBubble({ message }: { message: Message }) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bubbleRef.current) {
      // Message fade + slide-up (8px) on arrival
      gsap.fromTo(
        bubbleRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }
      );
    }
  }, []);

  const isUser = message.sender === 'user';

  return (
    <div
      ref={bubbleRef}
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[75%] leading-relaxed">
        <div
          className={`${
            isUser
              ? 'bg-[#C8F02D] text-[#0A0B0A] font-medium rounded-br-none'
              : 'bg-[#0A0B0A] text-[#F5F5F0] rounded-bl-none'
          } px-5 py-3 rounded-2xl text-sm`}
        >
          <p className="whitespace-pre-line">{message.text}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface({ messages, onSendMessage, sending }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Auto scroll to bottom when messages list updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch ElevenLabs audio through our server-side proxy instead of using the
  // browser's arbitrary default speech-synthesis voice.
  useEffect(() => {
    const newMsgs = messages.slice(prevLenRef.current);
    const avatarMessage = newMsgs.find((message) => message.sender === 'avatar');
    prevLenRef.current = messages.length;

    if (!avatarMessage) return;

    let cancelled = false;
    void synthesizeSpeech(avatarMessage.text)
      .then((audioBlob) => {
        if (cancelled) return;

        audioRef.current?.pause();
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);

        const audioUrl = URL.createObjectURL(audioBlob);
        audioUrlRef.current = audioUrl;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        return audio.play();
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to play ElevenLabs audio:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [messages]);

  // Stop audio and free its temporary object URL when the chat is closed.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full flex-1 rounded-3xl bg-[#161715] overflow-hidden">
      {/* Scrollable Message Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#161715]"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#9CA39A] text-sm">
            Begin the conversation. Type a message below.
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        
        {sending && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#0A0B0A] text-[#9CA39A] rounded-full px-4 py-2 text-xs font-medium flex items-center space-x-1 animate-pulse">
              <span>Syncing response</span>
              <span className="dot-animation">...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 md:p-4 bg-[#0A0B0A] flex items-center gap-3 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          placeholder="Message digital twin..."
          className="flex-1 px-5 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8F02D] text-[#F5F5F0] bg-[#161715] text-sm disabled:opacity-50 transition-all placeholder:text-[#9CA39A]"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="btn-primary py-3.5 px-7 text-sm group disabled:bg-[#1F211E] disabled:text-[#9CA39A] disabled:scale-100"
        >
          <span>Send</span>
          <span className="ml-1 transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
        </button>
      </form>
    </div>
  );
}



