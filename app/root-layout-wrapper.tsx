'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BackToTop } from "@/components/ui/back-to-top";
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ModalProvider } from '@/lib/modal-context';

export default function RootLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ModalProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <Footer />
        <BackToTop />
      </div>
    </ModalProvider>
  );
}
