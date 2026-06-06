import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Wind, Zap, Leaf } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

const warmWhite = '#f0f4ff'
const silver = 'rgba(240, 244, 255, 0.72)'
const gold = '#00e1ff'

const features = [
  { icon: Wind, text: 'Cosmic wind deployment' },
  { icon: Zap, text: 'Universal grid-scale storage' },
  { icon: Leaf, text: 'Zero-emission ethereal operations' },
]

export default function WindInfrastructureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useScrollReveal<HTMLDivElement>({ childSelector: '.reveal-item' })
  const featuresRef = useScrollReveal<HTMLDivElement>({ childSelector: '.feature-item', stagger: 0.1 })

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    if (!section || !image) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        }
      )

      gsap.to(image.querySelector('img'), {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: 'transparent', padding: '160px 0' }}
    >
      {/* Cosmic atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,225,255,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          <div ref={textRef} className="w-full lg:w-[45%]">
            <span className="reveal-item block text-xs uppercase tracking-[0.1em] mb-6" style={{ color: gold, fontFamily: 'var(--font-primary)' }}>
              ETHEREAL INFRASTRUCTURE
            </span>

            <h2 className="reveal-item text-[32px] lg:text-[56px] font-light tracking-[-0.02em] leading-[1.1] mb-6" style={{ color: warmWhite, fontFamily: 'var(--font-primary)' }}>
              Cosmic Winds That Power Worlds
            </h2>

            <p className="reveal-item text-base leading-relaxed max-w-[400px] mb-10" style={{ color: silver, fontFamily: 'var(--font-primary)' }}>
              Ethereal wind farms engineered to capture cosmic winds across the universe. Our majestic turbines operate silently amidst glowing stardust, integrating seamlessly into nebula landscapes.
            </p>

            <div ref={featuresRef} className="flex flex-col gap-6">
              {features.map((feature, i) => (
                <div key={i} className="feature-item flex items-center gap-4">
                  <feature.icon className="w-4 h-4 flex-shrink-0" style={{ color: gold }} strokeWidth={1.5} />
                  <span className="text-base" style={{ color: silver, fontFamily: 'var(--font-primary)' }}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div ref={imageRef} className="w-full lg:w-[55%] relative" style={{ height: '60vh', maxHeight: '600px' }}>
            <img
              src="/images/cosmic-wind.png"
              alt="Ethereal wind turbines in a cosmic nebula"
              className="w-full h-full object-cover scale-110"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                mixBlendMode: 'screen'
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
