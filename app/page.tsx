import { LegalQueryForm } from "@/components/legal-query-form"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-preference">
      <main className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                Consulta Tributaria Paraguay
              </h1>
            </div>
            <p className="mt-2 text-muted-foreground">
              Realiza consultas sobre temas tributarios y legales referentes a la legislación paraguaya
            </p>
          </header>
          <LegalQueryForm />
        </div>
      </main>
    </ThemeProvider>
  )
}
