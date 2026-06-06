import { useState, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { CheckCircle, Linkedin, Twitter, Instagram } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

type FormState = 'idle' | 'submitting' | 'success'

const warmWhite = '#f0f4ff'
const silver = 'rgba(240, 244, 255, 0.72)'
const ash = 'rgba(240, 244, 255, 0.45)'
const gold = '#00e1ff'
const forestDeep = '#05001a'

export default function EmailSignupSection() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [email, setEmail] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const contentRef = useScrollReveal<HTMLDivElement>({ childSelector: '.reveal-item' })

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setFormState('submitting')

    setTimeout(() => {
      setFormState('success')

      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            if (successRef.current) {
              gsap.fromTo(
                successRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
              )
            }
          },
        })
      }
    }, 800)
  }, [email])

  return (
    <section
      id="signup"
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Golden glow behind form */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,225,255,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div ref={contentRef} className="relative z-10 w-full max-w-[480px] px-6 text-center">
        <span
          className="reveal-item block text-xs uppercase tracking-[0.1em] mb-6"
          style={{ color: gold, fontFamily: 'var(--font-primary)' }}
        >
          STAY CONNECTED
        </span>

        <h2
          className="reveal-item text-[32px] lg:text-[56px] font-light tracking-[-0.02em] leading-[1.1]"
          style={{ color: warmWhite, fontFamily: 'var(--font-primary)' }}
        >
          Be the First to Know
        </h2>

        <p
          className="reveal-item mt-5 text-base leading-relaxed"
          style={{ color: silver, fontFamily: 'var(--font-primary)' }}
        >
          Join our waitlist for early access to ELEV8 updates, breakthrough announcements, and exclusive insights into the future of renewable energy.
        </p>

        <div className="reveal-item mt-10">
          {formState !== 'success' && (
            <div ref={formRef}>
              <form onSubmit={handleSubmit} className="w-full">
                <input
                  type="email"
                  required
                  aria-label="Email address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === 'submitting'}
                  className="w-full h-14 px-5 rounded-lg outline-none transition-all duration-300 disabled:opacity-50 placeholder:text-[rgba(240,237,229,0.35)]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: warmWhite,
                    fontFamily: 'var(--font-primary)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,225,255,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                />
                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full h-14 mt-4 rounded-lg font-medium text-base transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #00e1ff 0%, #00ffff 100%)',
                    color: forestDeep,
                    fontFamily: 'var(--font-primary)',
                  }}
                >
                  {formState === 'submitting' ? 'Joining...' : 'Join the Waitlist'}
                </button>
              </form>
            </div>
          )}

          {formState === 'success' && (
            <div ref={successRef} className="flex flex-col items-center gap-4" style={{ opacity: 0 }} aria-live="polite">
              <CheckCircle className="w-8 h-8" style={{ color: gold }} strokeWidth={1.5} />
              <p
                className="text-lg"
                style={{ color: warmWhite, fontFamily: 'var(--font-primary)' }}
              >
                You&apos;re on the list.
              </p>
              <p
                className="text-base"
                style={{ color: ash, fontFamily: 'var(--font-primary)' }}
              >
                We&apos;ll be in touch soon.
              </p>
            </div>
          )}
        </div>

        {/* Social links */}
        <div className="reveal-item flex items-center justify-center gap-8 mt-12">
          {[
            { Icon: Linkedin, label: 'LinkedIn' },
            { Icon: Twitter, label: 'X (Twitter)' },
            { Icon: Instagram, label: 'Instagram' },
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="transition-all duration-300 hover:scale-110"
              style={{ color: ash }}
              onMouseEnter={(e) => (e.currentTarget.style.color = warmWhite)}
              onMouseLeave={(e) => (e.currentTarget.style.color = ash)}
            >
              <Icon size={20} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
