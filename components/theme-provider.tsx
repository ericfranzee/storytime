"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <div className="w-full h-full">
      <NextThemesProvider attribute="class" defaultTheme="system" disableTransitionOnChange {...props}>
        {children}
      </NextThemesProvider>
    </div>
  )
}
