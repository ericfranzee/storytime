import "./globals.css";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { Inter } from "next/font/google";
import '@fortawesome/fontawesome-free/css/all.min.css';
import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ClientWrapper from './client-wrapper';
import { ModalProvider } from '@/lib/modal-context'; // Import ModalProvider
import RootLayoutWrapper from './root-layout-wrapper';
import { CurrencyProvider } from "@/lib/currency-context";
import { settingsService } from '@/lib/firebase/settings-service'; // Import settings service

const inter = Inter({ subsets: ["latin"] });

// Default values
const DEFAULT_APP_NAME = 'Storytime - Turn Stories into Videos';
const DEFAULT_DESCRIPTION = 'Transform your stories into engaging videos with AI-powered storytelling';
const DEFAULT_FAVICON = '/favicon.png'; // Default favicon path

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingsService.getSiteSettings();
  const appName = settings?.appName || DEFAULT_APP_NAME;
  // Use default description for now, could be added to settings later
  const description = DEFAULT_DESCRIPTION; 

  return {
    title: appName,
    description: description,
    openGraph: {
      title: appName,
      description: description, // Keep this one
    // Remove the duplicate description below
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
    verification: {
      google: 'your-google-verification-code', // Keep or make dynamic if needed
    }
  };
}


export default async function RootLayout({ // Make the component async
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch settings again for the layout itself (favicon)
  // Metadata generation runs separately
  const settings = await settingsService.getSiteSettings();
  const faviconUrl = settings?.favicon || DEFAULT_FAVICON;

  return (
    <html lang="en">
      <head>
        {/* Use dynamic favicon */}
        <link rel="icon" href={faviconUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} relative antialiased`}>
        <ErrorBoundary>
          <CurrencyProvider>
            <ClientWrapper>
              <RootLayoutWrapper>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </RootLayoutWrapper>
            </ClientWrapper>
          </CurrencyProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
