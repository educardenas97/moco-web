/**
 * Layout raíz de la aplicación Legal-Bot Py
 * Define la estructura base HTML, metadatos, fuentes y proveedores de tema
 */
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Inter, Roboto } from 'next/font/google'

// Configuración de fuente Inter para texto general
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Configuración de fuente Roboto para elementos específicos
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

// Metadatos de la aplicación para SEO y características de la PWA
export const metadata: Metadata = {
  title: 'Legal-Bot Py',
  description: 'Tu asistente legal inteligente',
  generator: 'Next.js',
  applicationName: 'legal-bot',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${roboto.variable}`}>
      <body className="font-sans antialiased">
        {/* Proveedor de tema para modo claro/oscuro */}
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
