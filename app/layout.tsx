"use client";

import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import StoryToVideo from "@/components/story-to-video"
import ApiSection from "@/components/ApiSection"
import Footer from "@/components/Footer"
import type React from "react" // Added import for React
import '@fortawesome/fontawesome-free/css/all.min.css';
import BackToTopButton from "@/components/BackToTopButton";
import { Toaster } from "@/components/ui/toaster"
import { CurrencyProvider } from "@/lib/currency-context"
import TestimonialsSection from "@/components/TestimonialsSection"
import DemoSection from "@/components/DemoSection"
import BenefitsSection from "@/components/BenefitsSection"
import SuccessStoriesSection from "@/components/SuccessStoriesSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation' // Add this import
import { metadata } from './metadata'
import PricingPage from "./pricing/page"

const inter = Inter({ subsets: ["latin"] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname(); // Use this instead of window.location.pathname

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} relative antialiased`}>
        <div id="modal-root" />
        
        <div className="flex min-h-screen flex-col">
          <CurrencyProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname} // Use pathname instead of window.location.pathname
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Header />
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
                    {children}
                  </main>
                  <Footer />
                </motion.div>
              </AnimatePresence>
              <BackToTopButton />
              <Toaster />
            </ThemeProvider>
          </CurrencyProvider>
        </div>
        <script src="https://js.paystack.co/v2/inline.js"></script>
      </body>
    </html>
  )
}
