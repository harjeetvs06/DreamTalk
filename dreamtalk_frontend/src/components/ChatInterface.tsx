import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

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
      <div
        className="max-w-[70%] px-4 py-2.5 rounded-lg text-sm leading-relaxed"
      >
        <div
          className={`${
            isUser
              ? 'bg-[#2563EB] text-white rounded-br-none'
              : 'bg-gray-100 text-[#111111] rounded-bl-none'
          } px-4 py-2.5 rounded-lg`}
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

  // Auto scroll to bottom when messages list updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] shadow-dream-rest rounded-lg bg-white overflow-hidden">
      {/* Scrollable Message Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 bg-white"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Begin the conversation. Type a message below.
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        
        {sending && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-500 rounded-lg rounded-bl-none px-4 py-2.5 text-xs font-medium flex items-center space-x-1 animate-pulse">
              <span>Syncing response</span>
              <span className="dot-animation">...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-black/5 p-3 md:p-4 bg-[#FAFAFA] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          placeholder="Message digital twin..."
          className="flex-1 px-3 py-2.5 rounded-md focus:outline-none focus:shadow-dream-focus text-[#111111] bg-white text-sm disabled:opacity-50 transition-shadow"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-md text-sm transition-colors focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
}
