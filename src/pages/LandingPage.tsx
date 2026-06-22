import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import SupportedLanguages from '@/components/landing/SupportedLanguages';
import CallToAction from '@/components/landing/CallToAction';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="languages">
          <SupportedLanguages />
        </div>
        <CallToAction />
      </main>
      <LandingFooter />
    </div>
  );
}
