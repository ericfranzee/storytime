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
import { metadata } from "./metadata";
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast"
import { CurrencyProvider } from "@/lib/currency-context"


const inter = Inter({ subsets: ["latin"] })

import PricingPage from "./pricing/page"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" {...metadata}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CurrencyProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            <HeroSection />
            <main className="flex-grow container mx-auto py-8 px-4">
              <StoryToVideo />
              {children}
              <ApiSection />
              <PricingPage />
            </main>
            <Footer />
            <BackToTopButton />
            <Toaster />
          </ThemeProvider>
        </CurrencyProvider>
        <script src="https://js.paystack.co/v2/inline.js"></script>
      </body>
    </html>
  )
}
