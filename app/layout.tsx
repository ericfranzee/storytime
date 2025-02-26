import "./globals.css"
import { Inter } from "next/font/google"
import '@fortawesome/fontawesome-free/css/all.min.css';
import type { Metadata } from 'next'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import ClientWrapper from './client-wrapper'
import RootLayoutWrapper from './root-layout-wrapper'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Storytime - Turn Stories into Videos',
  description: 'Transform your stories into engaging videos with AI-powered storytelling',
  openGraph: {
    title: 'Storytime - Turn Stories into Videos',
    description: 'Transform your stories into engaging videos with AI-powered storytelling',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: 'your-google-verification-code',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} relative antialiased`}>
        <ErrorBoundary>
          <ClientWrapper>
            <RootLayoutWrapper>
              {children}
            </RootLayoutWrapper>
          </ClientWrapper>
        </ErrorBoundary>
      </body>
    </html>
  )
}
