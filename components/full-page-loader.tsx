"use client"

import { Loader } from "@/components/loader"

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-8 rounded-2xl shadow-xl flex flex-col items-center transform animate-fadeInUp">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader size={28} className="text-primary" />
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-foreground">Procesando consulta tributaria...</p>
        <p className="text-sm text-muted-foreground mt-2">Esto puede tomar unos momentos</p>
      </div>
    </div>
  )
}
