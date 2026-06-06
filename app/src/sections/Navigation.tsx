import { useState, useEffect, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import { useCountdown } from '@/hooks/useCountdown'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const countdown = useCountdown()

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > window.innerHeight * 0.5)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const textColor = 'rgba(240, 237, 229, 0.72)'
  const hoverColor = '#f0ede5'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: isScrolled ? 'rgba(5, 0, 26, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="flex items-center justify-between h-[72px] px-6 lg:px-20 max-w-[1400px] mx-auto">
          {/* Wordmark */}
          <div
            className="text-lg font-medium tracking-[0.12em] uppercase cursor-pointer"
            style={{ color: '#f0ede5', fontFamily: 'var(--font-primary)' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ELEV8
          </div>

          {/* Desktop links + compact countdown */}
          <div className="hidden md:flex items-center gap-8">
            {isScrolled && !countdown.isLive && (
              <div
                className="flex items-center gap-2 text-xs tracking-[0.04em] transition-opacity duration-500"
                style={{ fontFamily: 'var(--font-mono)', color: 'rgba(240,237,229,0.55)' }}
              >
                <span style={{ color: '#f0ede5' }}>{countdown.days}</span><span>d</span>
                <span style={{ color: '#f0ede5' }}>{countdown.hours}</span><span>h</span>
                <span style={{ color: '#f0ede5' }}>{countdown.minutes}</span><span>m</span>
              </div>
            )}
            <button
              onClick={() => scrollTo('vision')}
              className="text-sm transition-colors duration-300"
              style={{ color: textColor, fontFamily: 'var(--font-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
            >
              Our Vision
            </button>
            <button
              onClick={() => scrollTo('signup')}
              className="text-sm transition-colors duration-300"
              style={{ color: textColor, fontFamily: 'var(--font-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
            >
              Stay Updated
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            style={{ color: '#f0ede5' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: 'rgba(5, 0, 26, 0.97)', backdropFilter: 'blur(20px)' }}
        >
          <button
            onClick={() => scrollTo('vision')}
            className="text-3xl font-light tracking-tight"
            style={{ color: '#f0ede5', fontFamily: 'var(--font-primary)' }}
          >
            Our Vision
          </button>
          <button
            onClick={() => scrollTo('signup')}
            className="text-3xl font-light tracking-tight"
            style={{ color: '#f0ede5', fontFamily: 'var(--font-primary)' }}
          >
            Stay Updated
          </button>
        </div>
      )}
    </>
  )
}
