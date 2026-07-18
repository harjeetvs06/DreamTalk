import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace('/dashboard');
    }
  }, [session, loading, router]);

  if (loading || session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#111111] font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#2563EB]/25">
      {/* Header */}
      <header className="py-6 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight">DreamTalk</span>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-[#111111] hover:underline">
              Log In
            </Link>
            <Link
              href="/signup"
              className="py-2 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md text-sm transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto pt-16 pb-20 px-6 md:px-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111111] max-w-4xl mx-auto leading-tight md:leading-none">
          Create a digital twin of yourself that remembers and talks back.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
          Clone your voice, sync gesture models, and config personal traits. DreamTalk interfaces your avatar twin into live conversations.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto py-3.5 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-md text-base transition-colors shadow-sm text-center"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto py-3.5 px-8 bg-[#FAFAFA] hover:bg-gray-100 text-[#111111] font-semibold rounded-md text-base transition-colors shadow-dream-rest text-center"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Product Screenshot Mockup Section */}
      <section className="max-w-6xl mx-auto pb-24 px-6 md:px-12">
        <div className="bg-[#FAFAFA] rounded-lg shadow-dream-rest p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mock Left: Avatar Profile */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-dream-rest flex flex-col justify-between h-96">
            <div>
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-gray-400">AL</span>
              </div>
              <h3 className="text-xl font-bold text-[#111111]">Alex</h3>
              <p className="text-sm text-gray-500 mt-1">Software Architect</p>
              
              <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Relationship</span>
                  <span className="font-semibold">Advisor</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Tone</span>
                  <span className="font-semibold">casual</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" /> Sync Active
              </span>
              <div className="bg-[#F97316] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Mood: analytical
              </div>
            </div>
          </div>

          {/* Mock Right: Chat History */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-dream-rest flex flex-col justify-between h-96">
            <div className="space-y-4 overflow-y-auto pr-2">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-gray-100 rounded-lg rounded-bl-none px-4 py-2.5 text-sm text-[#111111]">
                  {"I analyzed the system architecture you sent. Let's focus on decoupling data layers."}
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#2563EB] text-white rounded-lg rounded-br-none px-4 py-2.5 text-sm">
                  Sounds good, what about security schemas?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-gray-100 rounded-lg rounded-bl-none px-4 py-2.5 text-sm text-[#111111]">
                  We should apply Row Level Security to prevent unauthorized access.
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex gap-3">
              <div className="flex-1 bg-[#FAFAFA] rounded-md px-3 py-2 text-sm text-gray-400">
                Message digital twin...
              </div>
              <div className="bg-[#2563EB] text-white rounded-md px-4 py-2 text-sm font-semibold">
                Send
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="bg-[#FAFAFA] py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-[#111111] mb-12">
            Core Interface Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-8 shadow-dream-rest">
              <div className="text-[#2563EB] mb-6">
                {/* Large Icon: w-8 h-8 (32px) */}
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3">Context Memory</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                The twin retains complete histories of past interactions, references details you previously mapped, and builds conversational cohesion.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-8 shadow-dream-rest">
              <div className="text-[#2563EB] mb-6">
                {/* Large Icon: w-8 h-8 (32px) */}
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3">Mood Alignment</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Undergoes emotion state adjustments during chat updates. The orange indicators display active emotional outputs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-8 shadow-dream-rest">
              <div className="text-[#2563EB] mb-6">
                {/* Large Icon: w-8 h-8 (32px) */}
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3">Interface Sync</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Connects audio recordings and visual video clips directly. Clones speech models and face movements to map your twin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <span>&copy; 2026 DreamTalk Platform. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-gray-600">Privacy Policy</span>
            <span className="cursor-pointer hover:text-gray-600">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}