"use client"

import { CircleIcon as CircleNotch } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: number
  className?: string
}

export function Loader({ size = 24, className }: LoaderProps) {
  return <CircleNotch size={size} className={cn("animate-spin", className)} />
}
