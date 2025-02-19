"use client"

import { createContext, useState, useContext, ReactNode } from 'react';

interface CurrencyContextType {
  currency: 'USD' | 'NGN';
  setCurrency: (currency: 'USD' | 'NGN') => void;
  conversionRate: number; // Conversion rate from USD to the selected currency
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const conversionRate = currency === 'NGN' ? 1500 : 1; // 1 USD = 1500 NGN

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    conversionRate,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
