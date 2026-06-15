import logoImg from '@/Logo/Logo.png'

export default function Footer() {
  return (
    <footer
      className="relative w-full py-12 px-6 text-center flex flex-col items-center gap-4"
      style={{ background: 'transparent' }}
    >
      <img
        src={logoImg}
        alt="ELEV8 Logo"
        className="w-14 h-14 rounded-full object-cover ring-2 ring-white/20 opacity-70"
      />
      <p
        className="text-xs uppercase tracking-[0.08em]"
        style={{ color: 'rgba(240, 237, 229, 0.4)', fontFamily: 'var(--font-primary)' }}
      >
        © 2025 ELEV8 Renewable Energy. All rights reserved.
      </p>
    </footer>
  )
}
