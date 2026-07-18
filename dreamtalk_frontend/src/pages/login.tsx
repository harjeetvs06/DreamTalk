/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as THREE from 'three';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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
            color: 0x2563eb,
            backgroundColor: 0x0a0a0a,
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={vantaRef} className="relative min-h-screen flex items-center justify-center p-6 bg-black">
      {/* Subtle overlay to lower Vanta opacity and keep it non-distracting */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-dream-rest p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight text-center">Sign In</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">Access your digital twins and active conversations.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md shadow-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:shadow-dream-focus text-[#111111] bg-[#FAFAFA] text-sm transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2.5 rounded-md focus:outline-none focus:shadow-dream-focus text-[#111111] bg-[#FAFAFA] text-sm transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-md text-sm transition-colors focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-black/5 text-center">
          <p className="text-xs text-gray-500">
            Do not have an account?{' '}
            <Link href="/signup" className="text-[#2563EB] hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
