import Footer from '@/components/Footer'
import  FAQ  from '@/components/landingComp/FAQ'
import Features from '@/components/landingComp/Features'
import Hero from '@/components/landingComp/Hero'
import HowItWorks from '@/components/landingComp/HowItWorks'
import SeamlessIntegrations from '@/components/landingComp/Integration'
import { navItems } from '@/components/site/nav'
import { FloatingNav } from '@/components/ui/floating-navbar'


function LandingV2() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <FloatingNav navItems={navItems} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <SeamlessIntegrations />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default LandingV2