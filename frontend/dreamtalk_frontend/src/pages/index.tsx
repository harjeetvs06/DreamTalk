import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import HeroCursorEffect from '@/components/HeroCursorEffect';

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
      <div className="min-h-screen bg-[#0A0B0A] flex items-center justify-center">
        <div className="text-[#F5F5F0] font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  const marqueeText = "DIGITAL TWINS • VOICE CLONING • REAL-TIME INTERFACE • EMOTIONAL ALIGNMENT • ZERO LATENCY • PERSISTENT MEMORY • ";

  return (
    <div className="min-h-screen bg-[#0A0B0A] text-[#F5F5F0] font-sans selection:bg-[#C8F02D]/30 selection:text-[#C8F02D]">
      {/* Header */}
      <header className="py-6 px-6 md:px-12 bg-[#0A0B0A]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight font-heading text-[#F5F5F0]">
            DreamTalk
          </span>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-[#9CA39A] hover:text-[#F5F5F0] transition-colors">
              Log In
            </Link>
            <Link
              href="/signup"
              className="btn-primary py-2.5 px-6 text-sm group"
            >
              <span>Get Started</span>
              <span className="ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden max-w-6xl mx-auto pt-16 pb-20 px-6 md:px-12 text-center rounded-3xl my-4">
        {/* Antigravity-style Interactive Canvas Cursor Glow & Particle Effect */}
        <HeroCursorEffect />

        <div className="relative z-10">
          <div className="text-xs uppercase tracking-widest text-[#9CA39A] font-medium mb-4">
            ( Conversational Twin Infrastructure )
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-[#F5F5F0] max-w-5xl mx-auto leading-none font-heading">
            Create your digital twin.
          </h1>
          <p className="text-base md:text-xl text-[#9CA39A] mt-8 max-w-2xl mx-auto leading-relaxed">
            Configure a voice-cloned digital twin with persistent memory and real-time response capability.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="btn-primary w-full sm:w-auto py-4 px-9 text-base group"
            >
              <span>Get Started</span>
              <span className="ml-2 text-lg transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/login"
              className="btn-secondary w-full sm:w-auto py-4 px-9 text-base group"
            >
              <span>Log In</span>
              <span className="ml-2 text-lg transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>



      {/* Horizontally Scrolling Marquee Section Transition */}
      <div className="w-full bg-[#161715] py-4 overflow-hidden select-none my-8">
        <div className="animate-marquee whitespace-nowrap text-xs md:text-sm font-mono tracking-widest text-[#9CA39A]">
          <span>{marqueeText.repeat(4)}</span>
          <span>{marqueeText.repeat(4)}</span>
        </div>
      </div>

      {/* Core Capabilities Section (Numbered 01, 02, 03 List) */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#9CA39A] font-medium block mb-2">
            ( Capabilities )
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F0] font-heading">
            Core Systems
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 01 Capability */}
          <div className="bg-[#161715] hover:bg-[#1F211E] rounded-3xl p-8 transition-colors">
            <span className="text-4xl font-extrabold text-[#C8F02D] font-heading block mb-4">
              01
            </span>
            <h3 className="text-xl font-bold text-[#F5F5F0] font-heading mb-3">
              Context Memory
            </h3>
            <p className="text-sm text-[#9CA39A] leading-relaxed">
              Retains complete interaction histories, tracks mapped personal details, and maintains persistent conversation state across sessions.
            </p>
          </div>

          {/* 02 Capability */}
          <div className="bg-[#161715] hover:bg-[#1F211E] rounded-3xl p-8 transition-colors">
            <span className="text-4xl font-extrabold text-[#C8F02D] font-heading block mb-4">
              02
            </span>
            <h3 className="text-xl font-bold text-[#F5F5F0] font-heading mb-3">
              Emotional Alignment
            </h3>
            <p className="text-sm text-[#9CA39A] leading-relaxed">
              Evaluates real-time emotional state adjustments during chat updates. Active mood outputs are displayed via dedicated indicators.
            </p>
          </div>

          {/* 03 Capability */}
          <div className="bg-[#161715] hover:bg-[#1F211E] rounded-3xl p-8 transition-colors">
            <span className="text-4xl font-extrabold text-[#C8F02D] font-heading block mb-4">
              03
            </span>
            <h3 className="text-xl font-bold text-[#F5F5F0] font-heading mb-3">
              Multimodal Sync
            </h3>
            <p className="text-sm text-[#9CA39A] leading-relaxed">
              Connects speech synthesis and facial gesture models directly to render authentic real-time avatar interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Real Product UI Mockup Section */}
      <section className="max-w-6xl mx-auto pb-24 px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#9CA39A] font-medium block mb-2">
            ( Product Interface )
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F5F0] font-heading">
            Live Chat Workspace
          </h2>
        </div>

        <div className="bg-[#161715] rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mock Left: Avatar Profile Card */}
          <div className="lg:col-span-1 bg-[#0A0B0A] rounded-2xl p-6 flex flex-col justify-between h-96">
            <div>
              <div className="h-20 w-20 bg-[#161715] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[#C8F02D] font-heading">AL</span>
              </div>
              <h3 className="text-xl font-bold text-[#F5F5F0] font-heading">Alex</h3>
              <p className="text-sm text-[#9CA39A] mt-1">Software Architect</p>
              
              <div className="mt-6 space-y-3 pt-4 border-t border-[#1F211E]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA39A] font-medium">Relationship</span>
                  <span className="font-semibold text-[#F5F5F0]">Advisor</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA39A] font-medium">Tone</span>
                  <span className="font-semibold text-[#F5F5F0]">casual</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1F211E]">
              <span className="text-[#C8F02D] text-xs font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#C8F02D] inline-block animate-pulse" /> Sync Active
              </span>
              <div className="bg-[#F97316] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Mood: analytical
              </div>
            </div>
          </div>

          {/* Mock Right: Chat Thread */}
          <div className="lg:col-span-2 bg-[#0A0B0A] rounded-2xl p-6 flex flex-col justify-between h-96">
            <div className="space-y-4 overflow-y-auto pr-2">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-[#161715] text-[#F5F5F0] rounded-2xl rounded-bl-none px-4 py-2.5 text-sm">
                  I analyzed the system architecture. Let us focus on decoupling the data layers.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#C8F02D] text-[#0A0B0A] font-medium rounded-2xl rounded-br-none px-4 py-2.5 text-sm">
                  Sounds good, what about security schemas?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-[#161715] text-[#F5F5F0] rounded-2xl rounded-bl-none px-4 py-2.5 text-sm">
                  We should apply Row Level Security policies to enforce user data boundaries.
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <div className="flex-1 bg-[#161715] rounded-full px-5 py-3 text-sm text-[#9CA39A]">
                Message digital twin...
              </div>
              <div className="bg-[#C8F02D] text-[#0A0B0A] rounded-full px-6 py-3 text-sm font-bold flex items-center justify-center">
                Send
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Clean Call To Action Section (Navbar Digital Style CTA) */}
      <section className="max-w-6xl mx-auto pb-24 px-6 md:px-12">
        <div className="bg-[#161715] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden group">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C8F02D] font-mono font-semibold block mb-3">
              ( Start Building Now )
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F5F5F0] font-heading leading-tight">
              Ready to deploy your digital twin?
            </h2>
            <p className="text-base md:text-lg text-[#9CA39A] mt-4 mb-8 leading-relaxed">
              Configure personalized memory matrices, upload voice samples, and launch real-time interactive avatars in minutes.
            </p>
            <div className="flex justify-center">
              <Link
                href="/signup"
                className="btn-primary py-4 px-10 text-base group"
              >
                <span>Get Started Free</span>
                <span className="ml-2 text-lg transition-transform duration-300 ease-out group-hover:translate-x-1.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Multi-Column Footer Section (Image 1: Navbar Digital Grid) */}
      <footer className="bg-[#0A0B0A] pt-16 pb-12 border-t border-[#161715]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 pb-16">
          {/* Brand Info Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-[#C8F02D] rounded-lg flex items-center justify-center text-[#0A0B0A] font-extrabold text-sm font-heading">
                DT
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#F5F5F0] font-heading">
                DreamTalk
              </span>
            </div>
            <p className="text-xs text-[#9CA39A] leading-relaxed max-w-xs pt-1">
              Voice-cloned digital twins. Persistent context memory. Real-time emotional alignment and multimodal gesture response.
            </p>
          </div>

          {/* Navigation Pages Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#9CA39A] font-mono font-semibold">
              PAGES
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA39A]">
              <li><Link href="/" className="hover:text-[#F5F5F0] transition-colors">Home</Link></li>
              <li><Link href="/signup" className="hover:text-[#F5F5F0] transition-colors">Create Twin</Link></li>
              <li><Link href="/login" className="hover:text-[#F5F5F0] transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#F5F5F0] transition-colors">Dashboard</Link></li>
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">Pricing</span></li>
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">Documentation</span></li>
            </ul>
          </div>

          {/* Core Systems Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#9CA39A] font-mono font-semibold">
              SYSTEMS
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA39A]">
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">Context Memory</span></li>
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">Voice Synthesis</span></li>
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">Face Model Sync</span></li>
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">Emotional State</span></li>
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">Security Policies</span></li>
              <li><span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">API Reference</span></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#9CA39A] font-mono font-semibold">
              GET IN TOUCH
            </h4>
            <ul className="space-y-3 text-xs text-[#9CA39A]">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#C8F02D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">support@dreamtalk.ai</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#C8F02D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hover:text-[#F5F5F0] cursor-pointer transition-colors">+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#C8F02D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Massive Display Text Banner (Image 2: Antigravity Giant Text) */}
        <div className="w-full border-t border-b border-[#161715] py-8 md:py-12 overflow-hidden select-none">
          <h1 className="text-[13vw] sm:text-[14vw] font-extrabold text-[#F5F5F0] text-center leading-none tracking-tighter font-heading opacity-90 hover:opacity-100 hover:text-[#C8F02D] transition-all duration-500 cursor-default">
            DREAMTALK
          </h1>
        </div>

        {/* Sub-Footer Copyright Bar */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA39A] gap-4">
          <span>&copy; 2026 DreamTalk Infrastructure. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-[#F5F5F0] transition-colors">About DreamTalk</span>
            <span className="cursor-pointer hover:text-[#F5F5F0] transition-colors">Products</span>
            <span className="cursor-pointer hover:text-[#F5F5F0] transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-[#F5F5F0] transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}