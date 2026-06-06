import { Sun, Wind, Battery } from 'lucide-react'
import StarburstSVG from '@/components/StarburstSVG'
import InfoCard from '@/components/InfoCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const warmWhite = '#f0f4ff'
const silver = 'rgba(240, 244, 255, 0.72)'
const gold = '#00e1ff'

const cardData = [
  {
    icon: Sun,
    title: 'Cosmic Intelligence',
    description: 'Self-optimizing arrays that adapt to universal weather patterns in real time.',
  },
  {
    icon: Wind,
    title: 'Ethereal Harmony',
    description: 'Turbines that communicate to maximize collective energy output.',
  },
  {
    icon: Battery,
    title: 'Universal Storage',
    description: 'Next-generation batteries storing cosmic energy for when it is needed most.',
  },
]

export default function EcosystemSection() {
  const titleRef = useScrollReveal<HTMLDivElement>({ childSelector: '.reveal-item' })
  const cardsRef = useScrollReveal<HTMLDivElement>({ childSelector: '.info-card-item', stagger: 0.15, y: 30 })

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'transparent', padding: '160px 0' }}
    >
      <div className="max-w-[800px] mx-auto px-6 lg:px-20 text-center">
        <div className="flex justify-center mb-12">
          <StarburstSVG size="compact" intensity="subtle" />
        </div>

        <div ref={titleRef}>
          <span
            className="reveal-item block text-xs uppercase tracking-[0.1em] mb-6"
            style={{ color: gold, fontFamily: 'var(--font-primary)' }}
          >
            THE ECOSYSTEM
          </span>

          <h2
            className="reveal-item text-[32px] lg:text-[56px] font-light tracking-[-0.02em] leading-[1.1] mb-6"
            style={{ color: warmWhite, fontFamily: 'var(--font-primary)' }}
          >
            An Integrated Future
          </h2>

          <p
            className="reveal-item text-lg lg:text-xl leading-relaxed"
            style={{ color: silver, fontFamily: 'var(--font-primary)' }}
          >
            ELEV8 is building more than individual energy projects. We are creating an interconnected cosmic ecosystem where stellar, ethereal wind, and storage work as one intelligent network — responsive, resilient, and universal.
          </p>
        </div>

        <div ref={cardsRef} className="flex flex-col lg:flex-row gap-6 mt-16">
          {cardData.map((c, idx) => (
            <div key={idx} className="info-card-item flex-1">
              <InfoCard icon={c.icon} title={c.title} description={c.description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
