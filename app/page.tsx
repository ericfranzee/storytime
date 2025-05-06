'use client';
import HeroSection from "@/components/HeroSection"
import BenefitsSection from "@/components/BenefitsSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import DemoSection from "@/components/DemoSection"
import StoryToVideo from "@/components/story-to-video"
import SuccessStoriesSection from "@/components/SuccessStoriesSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import ApiSection from "@/components/ApiSection"
import PricingPage from "./pricing/page"
import ClientWrapper from './client-wrapper';
import PageTransition from '@/components/animations/PageTransition';
import BlogSection from "@/components/BlogSection"

export default function Home() {
  return (
    <ClientWrapper>
      <PageTransition>
        <HeroSection />
        <main className="flex-grow container mx-auto py-8 px-4">
          <BenefitsSection />
          <HowItWorksSection />
          <DemoSection />
          <StoryToVideo />
          <SuccessStoriesSection />
          <TestimonialsSection />
          <ApiSection />
          <PricingPage />
          <BlogSection />
        </main>
      </PageTransition>
    </ClientWrapper>
  )
}

