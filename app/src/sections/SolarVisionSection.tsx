import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '@/hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

const warmWhite = '#f0f4ff'
const silver = 'rgba(240, 244, 255, 0.72)'
const ash = 'rgba(240, 244, 255, 0.45)'
const gold = '#00e1ff'

export default function SolarVisionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useScrollReveal<HTMLDivElement>({ childSelector: '.reveal-item' })
  const statRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    if (!section || !image) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        }
      )

      gsap.to(image.querySelector('img'), {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })

      statRefs.current.forEach((statEl) => {
        if (!statEl) return
        const finalValue = statEl.dataset.value
        if (!finalValue) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: parseInt(finalValue), duration: 1.5, ease: 'power2.out',
          scrollTrigger: { trigger: statEl, start: 'top 85%', once: true },
          onUpdate: () => { if (statEl) statEl.textContent = Math.round(obj.val).toString() },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="vision"
      className="relative w-full overflow-hidden"
      style={{ background: 'transparent', padding: '160px 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div ref={imageRef} className="w-full lg:w-[55%] relative" style={{ height: '60vh', maxHeight: '600px' }}>
            <img
              src="/images/cosmic-energy.png"
              alt="Cosmic energy collector in deep space"
              className="w-full h-full object-cover scale-110"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
                mixBlendMode: 'screen'
              }}
              loading="lazy"
            />
          </div>

          <div ref={textRef} className="w-full lg:w-[45%] relative">
            <div
              className="hidden lg:block absolute left-0 top-[10%] w-[1px] h-[80%]"
              style={{ background: 'rgba(0,225,255,0.2)' }}
            />

            <div className="lg:pl-12">
              <span className="reveal-item block text-xs uppercase tracking-[0.1em] mb-6" style={{ color: gold, fontFamily: 'var(--font-primary)' }}>
                COSMIC ENERGY
              </span>

              <h2 className="reveal-item text-[32px] lg:text-[56px] font-light tracking-[-0.02em] leading-[1.1] mb-6" style={{ color: warmWhite, fontFamily: 'var(--font-primary)' }}>
                Light of the Universe
              </h2>

              <p className="reveal-item text-base leading-relaxed max-w-[400px] mb-12" style={{ color: silver, fontFamily: 'var(--font-primary)' }}>
                Our advanced cosmic energy collectors capture the brilliant light of the universe. Intelligent tracking harnesses the power of ethereal starlight, maximizing output beyond our galaxy.
              </p>

              <div className="reveal-item flex gap-12">
                <div>
                  <span ref={(el) => { statRefs.current[0] = el }} data-value="47" className="text-[36px]" style={{ color: warmWhite, fontFamily: 'var(--font-mono)' }}>0</span>
                  <span className="text-[36px]" style={{ color: gold, fontFamily: 'var(--font-mono)' }}>%</span>
                  <span className="block text-xs uppercase tracking-[0.08em] mt-1" style={{ color: ash, fontFamily: 'var(--font-primary)' }}>Efficiency Gain</span>
                </div>
                <div>
                  <span className="text-[36px]" style={{ color: warmWhite, fontFamily: 'var(--font-mono)' }}>∞</span>
                  <span className="block text-xs uppercase tracking-[0.08em] mt-1" style={{ color: ash, fontFamily: 'var(--font-primary)' }}>Energy Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
