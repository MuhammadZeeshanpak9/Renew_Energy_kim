import { type LucideIcon } from 'lucide-react'

interface InfoCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border p-8 backdrop-blur-xl transition-all duration-300 hover:border-[rgba(201,168,76,0.35)] hover:bg-[rgba(255,255,255,0.1)]"
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* Glass sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(140,200,160,0.06) 100%)',
        }}
      />

      <div className="relative z-10">
        <Icon
          className="w-6 h-6 mb-4"
          style={{ color: 'var(--solar-gold)' }}
          strokeWidth={1.5}
        />
        <h3
          className="text-xl font-light tracking-tight mb-3"
          style={{ color: 'var(--starlight)', fontFamily: 'var(--font-primary)' }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--silver)', fontFamily: 'var(--font-primary)' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
