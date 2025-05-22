import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'legal-bot',
  description: 'Tu asistente legal inteligente',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          attribute="data-theme" 
          defaultTheme="system" 
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
