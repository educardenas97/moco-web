import { LegalQueryForm } from "@/components/legal-query-form"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-preference">
      <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
        <div className="w-full mx-auto max-w-5xl py-6 md:py-12">
          <header className="mb-8 md:mb-12 space-y-4">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
              Legal-Bot Py
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Realiza consultas sobre temas tributarios y legales referentes a la legislación paraguaya
            </p>
          </header>
          <LegalQueryForm />
        </div>
      </main>
    </ThemeProvider>
  )
}
