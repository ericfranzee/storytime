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

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Story to Video Generator",
  description: "Transform your stories into captivating videos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <HeroSection />
          <main className="flex-grow container mx-auto py-8 px-4">
            <StoryToVideo />
            {children}
            <ApiSection />
          </main>
          <Footer />
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
