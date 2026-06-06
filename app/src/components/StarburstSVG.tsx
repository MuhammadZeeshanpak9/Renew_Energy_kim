import { useEffect, useRef, useId } from 'react'
import gsap from 'gsap'

interface StarburstSVGProps {
  size?: 'monumental' | 'compact'
  intensity?: 'full' | 'subtle'
}

export default function StarburstSVG({ size = 'monumental', intensity = 'full' }: StarburstSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const uniqueId = useId()
  const hasAnimated = useRef(false)

  const isMonumental = size === 'monumental'
  const isFull = intensity === 'full'

  const spokeCount = isFull ? 48 : 24
  const outerRayCount = isFull ? 24 : 12
  const spinDuration = isFull ? 180 : 360
  const pulseDuration = isFull ? 2.5 : 5
  const rayPulseDuration = isFull ? 2 : 4
  const corePulseDuration = isFull ? 4 : 8
  const ringPulseDuration = isFull ? 3 : 6

  const svgSize = isMonumental ? 600 : 120
  const center = svgSize / 2
  const spokeStart = isMonumental ? 90 : 18
  const coreRadius = isMonumental ? 24 : 5
  const ring1Radius = isMonumental ? 40 : 8
  const ring2Radius = isMonumental ? 55 : 11
  const outerRayLength = isMonumental ? 40 : 8
  const outerRayStart = isMonumental ? 50 : 10

  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = i * (360 / spokeCount)
    const delay = i * (isFull ? 0.15 : 0.3)
    return { angle, delay, id: i }
  })

  const outerRays = Array.from({ length: outerRayCount }, (_, i) => {
    const angle = i * (360 / outerRayCount)
    const delay = i * (isFull ? 0.2 : 0.4)
    return { angle, delay, id: i }
  })

  const gradId = `coreGrad-${uniqueId}`
  const rayGradId = `rayGrad-${uniqueId}`
  const glowId = `glow-${uniqueId}`

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const svg = svgRef.current
    if (!svg) return

    const ctx = gsap.context(() => {
      const coreOrb = svg.querySelector(`#coreOrb-${uniqueId}`)
      const spokeElements = svg.querySelectorAll(`#spokes-${uniqueId} line`)
      const rayElements = svg.querySelectorAll(`#outerRays-${uniqueId} line`)

      const tl = gsap.timeline({ delay: 0.3 })

      if (coreOrb) {
        tl.fromTo(
          coreOrb,
          { scale: 0, opacity: 0, transformOrigin: `${center}px ${center}px` },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
        )
      }

      if (spokeElements.length > 0) {
        tl.fromTo(
          spokeElements,
          { scaleY: 0, opacity: 0, transformOrigin: `${center}px ${center}px` },
          { scaleY: 1, opacity: 0.6, stagger: 0.02, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        )
      }

      if (rayElements.length > 0) {
        tl.fromTo(
          rayElements,
          { opacity: 0 },
          { opacity: 0.5, stagger: 0.03, duration: 0.4 },
          '-=0.3'
        )
      }

      tl.add(() => {
        svg.classList.add('animations-active')
      })
    }, svg)

    return () => ctx.revert()
  }, [uniqueId, center])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className={`${isMonumental ? 'w-[300px] h-[300px] lg:w-[600px] lg:h-[600px]' : 'w-[120px] h-[120px]'} starburst-svg`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0ede5" />
          <stop offset="40%" stopColor="rgba(230,200,120,0.6)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0.15)" />
        </radialGradient>
        <linearGradient id={rayGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(240,237,229,0.85)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0.35)" />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Spokes container - slow rotation */}
      <g
        id={`spokes-${uniqueId}`}
        style={{
          transformOrigin: `${center}px ${center}px`,
          animation: `slowSpin ${spinDuration}s linear infinite`,
          animationPlayState: 'paused',
        }}
      >
        {spokes.map((spoke) => (
          <line
            key={`spoke-${spoke.id}`}
            x1={center}
            y1={center}
            x2={center}
            y2={spokeStart}
            stroke={`url(#${rayGradId})`}
            strokeWidth={isMonumental ? 2 : 1}
            strokeLinecap="round"
            style={{
              transform: `rotate(${spoke.angle}deg)`,
              transformOrigin: `${center}px ${center}px`,
              animation: `spokePulse ${pulseDuration}s ease-in-out infinite`,
              animationDelay: `${spoke.delay}s`,
              animationPlayState: 'paused',
            }}
          />
        ))}
      </g>

      {/* Outer rays container - counter rotation */}
      <g
        id={`outerRays-${uniqueId}`}
        style={{
          transformOrigin: `${center}px ${center}px`,
          animation: `slowSpin ${spinDuration}s linear infinite reverse`,
          animationPlayState: 'paused',
        }}
      >
        {outerRays.map((ray) => (
          <line
            key={`ray-${ray.id}`}
            x1={center}
            y1={outerRayStart}
            x2={center}
            y2={outerRayStart - outerRayLength}
            stroke="rgba(230,200,120,0.6)"
            strokeWidth={isMonumental ? 1.5 : 0.75}
            strokeLinecap="round"
            style={{
              transform: `rotate(${ray.angle}deg)`,
              transformOrigin: `${center}px ${center}px`,
              animation: `outerRayPulse ${rayPulseDuration}s ease-in-out infinite`,
              animationDelay: `${ray.delay}s`,
              animationPlayState: 'paused',
            }}
          />
        ))}
      </g>

      {/* Core orb container - no rotation */}
      <g
        id={`coreOrb-${uniqueId}`}
        style={{
          transformOrigin: `${center}px ${center}px`,
          animationPlayState: 'paused',
        }}
      >
        <circle
          cx={center}
          cy={center}
          r={coreRadius}
          fill={`url(#${gradId})`}
          filter={`url(#${glowId})`}
          style={{
            animation: `corePulse ${corePulseDuration}s ease-in-out infinite`,
            animationPlayState: 'paused',
          }}
        />
        <circle
          cx={center}
          cy={center}
          r={ring1Radius}
          fill="none"
          stroke="rgba(201,168,76,0.25)"
          strokeWidth={isMonumental ? 1 : 0.5}
          style={{
            animation: `ringPulse ${ringPulseDuration}s ease-in-out infinite`,
            animationDelay: '0s',
            animationPlayState: 'paused',
          }}
        />
        <circle
          cx={center}
          cy={center}
          r={ring2Radius}
          fill="none"
          stroke="rgba(140,200,160,0.2)"
          strokeWidth={isMonumental ? 0.5 : 0.25}
          style={{
            animation: `ringPulse ${ringPulseDuration}s ease-in-out infinite`,
            animationDelay: `${ringPulseDuration * 0.5}s`,
            animationPlayState: 'paused',
          }}
        />
      </g>

      <style>{`
        .starburst-svg.animations-active [style*="animationPlayState: paused"] {
          animation-play-state: running !important;
        }
      `}</style>
    </svg>
  )
}
