import Navigation from '@/sections/Navigation'
import HeroSection from '@/sections/HeroSection'
import CountdownSection from '@/sections/CountdownSection'
import SolarVisionSection from '@/sections/SolarVisionSection'
import WindInfrastructureSection from '@/sections/WindInfrastructureSection'
import EcosystemSection from '@/sections/EcosystemSection'
import EmailSignupSection from '@/sections/EmailSignupSection'
import Footer from '@/sections/Footer'
import ThemeBackground from '@/components/ThemeBackground'

export default function Home() {
  return (
    <div>
      {/* Full animated nature-energy ecosystem background */}
      <ThemeBackground />

      {/* Fixed navigation */}
      <Navigation />

      {/* Page sections - transparent backgrounds to show ecosystem */}
      <main className="relative" style={{ zIndex: 1 }}>
        <HeroSection />
        <CountdownSection />
        <SolarVisionSection />
        <WindInfrastructureSection />
        <EcosystemSection />
        <EmailSignupSection />
      </main>

      <Footer />
    </div>
  )
}
