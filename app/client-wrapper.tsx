"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/lib/currency-context";
import { Toaster } from "@/components/ui/toaster";
import type { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </CurrencyProvider>
  );
}
