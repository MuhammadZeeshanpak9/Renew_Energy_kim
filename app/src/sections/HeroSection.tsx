import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StarburstSVG from '@/components/StarburstSVG'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      gsap.to(content, {
        scale: 0.85,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '80% top',
          scrub: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const scrollToSignup = () => {
    const el = document.getElementById('signup')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const warmWhite = '#f0f4ff'
  const silver = 'rgba(240, 244, 255, 0.72)'
  const forestDeep = '#05001a'

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Cosmic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 35%, rgba(5,0,26,0.6) 100%)',
          zIndex: 1,
        }}
      />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <StarburstSVG size="monumental" intensity="full" />

        <h1
          className="mt-12 text-[40px] lg:text-[72px] font-light tracking-[-0.02em] leading-[1.05]"
          style={{ color: warmWhite, fontFamily: 'var(--font-primary)' }}
        >
          ELEV8 Renewable Energy
        </h1>

        <p
          className="mt-5 text-lg lg:text-xl leading-relaxed max-w-[480px]"
          style={{ color: silver, fontFamily: 'var(--font-primary)' }}
        >
          Harnessing the light of the universe.
        </p>

        <button
          onClick={scrollToSignup}
          className="mt-10 px-9 py-3.5 rounded-full font-medium text-base transition-all duration-300 hover:scale-[1.04]"
          style={{
            background: 'linear-gradient(135deg, #00e1ff 0%, #00ffff 100%)',
            color: forestDeep,
            fontFamily: 'var(--font-primary)',
          }}
        >
          Join the Waitlist
        </button>
      </div>
    </section>
  )
}
