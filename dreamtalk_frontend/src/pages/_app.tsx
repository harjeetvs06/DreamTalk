import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import gsap from 'gsap'

function PageTransitionLayout({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current)
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power1.out' }
        )
      }
    }

    // Run transition on initial mount
    handleRouteChangeComplete()

    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    const handleRouteChangeStart = () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, { opacity: 0, duration: 0.15, ease: 'power1.in' })
      }
    }
    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router])

  return <div ref={containerRef}>{children}</div>
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PageTransitionLayout>
        <Component {...pageProps} />
      </PageTransitionLayout>
    </AuthProvider>
  )
}