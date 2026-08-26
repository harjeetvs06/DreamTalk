/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as THREE from 'three';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  // Load Vanta.js NET background dynamically on client side
  useEffect(() => {
    let effect: any = null;
    const initVanta = async () => {
      try {
        const vantaModule = await import('vanta/dist/vanta.net.min');
        const NET = vantaModule.default;
        if (vantaRef.current && !effect) {
          effect = NET({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xc8f02d,
            backgroundColor: 0x0a0b0a,
            points: 10.00,
            maxDistance: 20.00,
            spacing: 16.00,
          });
        }
      } catch (err) {
        console.error('Error loading Vanta.js:', err);
      }
    };

    initVanta();

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Account created. You can now sign in.');
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={vantaRef} className="relative min-h-screen flex items-center justify-center p-6 bg-[#0A0B0A]">
      {/* Subtle dark overlay to keep background non-distracting */}
      <div className="absolute inset-0 bg-[#0A0B0A]/60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#161715] rounded-3xl p-8 md:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-[#F5F5F0] font-heading tracking-tight">Create Account</h1>
          <p className="text-sm text-[#9CA39A] mt-1">Register to start building and interacting with your digital twins.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-950/50 text-red-400 text-sm rounded-2xl border-0">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-[#C8F02D]/15 text-[#C8F02D] text-sm rounded-2xl border-0">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9CA39A] uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8F02D] text-[#F5F5F0] bg-[#0A0B0A] text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA39A] uppercase tracking-wider mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8F02D] text-[#F5F5F0] bg-[#0A0B0A] text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 py-3.5 px-6 text-sm group disabled:opacity-50"
          >
            <span>{loading ? 'Registering...' : 'Register'}</span>
            <span className="ml-1.5 transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
          </button>

        </form>

        <div className="mt-6 pt-6 border-t border-[#1F211E] text-center">
          <p className="text-xs text-[#9CA39A]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#C8F02D] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


