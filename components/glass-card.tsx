import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl",
        "ring-1 ring-inset ring-white/5",
        className,
      )}
    >
      {children}
    </section>
  )
}
