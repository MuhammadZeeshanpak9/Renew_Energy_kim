import { useCountdown } from '@/hooks/useCountdown'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const warmWhite = '#f0f4ff'
const silver = 'rgba(240, 244, 255, 0.72)'
const ash = 'rgba(240, 244, 255, 0.45)'
const gold = '#00e1ff'

export default function CountdownSection() {
  const countdown = useCountdown()
  const sectionRef = useScrollReveal<HTMLElement>({ y: 0 })
  const contentRef = useScrollReveal<HTMLDivElement>({ childSelector: '.reveal-item' })

  return (
    <section
      ref={sectionRef}
      id="countdown"
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Drifting light lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute h-[1px] w-full"
            style={{
              background: 'rgba(0,225,255,0.04)',
              top: `${30 + i * 25}%`,
              animation: `drift ${60 + i * 20}s linear infinite`,
              animationDelay: `${i * -20}s`,
            }}
          />
        ))}
      </div>

      <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center px-6">
        <span
          className="reveal-item text-xs uppercase tracking-[0.15em] mb-12"
          style={{ color: gold, fontFamily: 'var(--font-primary)' }}
        >
          COMING 2026
        </span>

        {countdown.isLive ? (
          <div
            className="reveal-item text-[48px] lg:text-[80px] font-normal tracking-[0.04em]"
            style={{ color: warmWhite, fontFamily: 'var(--font-mono)' }}
          >
            WE&apos;RE LIVE
          </div>
        ) : (
          <div className="reveal-item flex items-start gap-3 lg:gap-5">
            {/* Days */}
            <div className="flex flex-col items-center">
              <span className="text-[48px] lg:text-[80px] font-normal leading-none" style={{ color: warmWhite, fontFamily: 'var(--font-mono)' }}>
                {countdown.days}
              </span>
              <span className="text-xs uppercase tracking-[0.08em] mt-3" style={{ color: ash, fontFamily: 'var(--font-primary)' }}>
                DAYS
              </span>
            </div>

            <span className="text-[48px] lg:text-[80px] font-normal leading-none self-start" style={{ color: ash, fontFamily: 'var(--font-mono)', marginTop: '-4px' }}>:</span>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-[48px] lg:text-[80px] font-normal leading-none" style={{ color: warmWhite, fontFamily: 'var(--font-mono)' }}>
                {countdown.hours}
              </span>
              <span className="text-xs uppercase tracking-[0.08em] mt-3" style={{ color: ash, fontFamily: 'var(--font-primary)' }}>
                HOURS
              </span>
            </div>

            <span className="text-[48px] lg:text-[80px] font-normal leading-none self-start" style={{ color: ash, fontFamily: 'var(--font-mono)', marginTop: '-4px' }}>:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-[48px] lg:text-[80px] font-normal leading-none" style={{ color: warmWhite, fontFamily: 'var(--font-mono)' }}>
                {countdown.minutes}
              </span>
              <span className="text-xs uppercase tracking-[0.08em] mt-3" style={{ color: ash, fontFamily: 'var(--font-primary)' }}>
                MINUTES
              </span>
            </div>

            <span className="text-[48px] lg:text-[80px] font-normal leading-none self-start" style={{ color: ash, fontFamily: 'var(--font-mono)', marginTop: '-4px' }}>:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className="text-[48px] lg:text-[80px] font-normal leading-none" style={{ color: warmWhite, fontFamily: 'var(--font-mono)' }}>
                {countdown.seconds}
              </span>
              <span className="text-xs uppercase tracking-[0.08em] mt-3" style={{ color: ash, fontFamily: 'var(--font-primary)' }}>
                SECONDS
              </span>
            </div>
          </div>
        )}

        <p
          className="reveal-item mt-8 text-lg lg:text-xl leading-relaxed max-w-[400px]"
          style={{ color: silver, fontFamily: 'var(--font-primary)' }}
        >
          The future of universal energy is nearly here.
        </p>
      </div>
    </section>
  )
}
