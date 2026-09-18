"use client"

import { useEffect, useState } from "react"

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

export function Clock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = now ? String(now.getHours()).padStart(2, "0") : "--"
  const mm = now ? String(now.getMinutes()).padStart(2, "0") : "--"
  const ss = now ? String(now.getSeconds()).padStart(2, "0") : "--"

  const dateLabel = now
    ? `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 (${WEEKDAYS[now.getDay()]})`
    : ""

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-baseline gap-2 font-mono tabular-nums leading-none tracking-tight">
        <span className="text-white text-[18vw] sm:text-[15vw] lg:text-[12vw]">{hh}</span>
        <span className="text-white/30 text-[14vw] sm:text-[11vw] lg:text-[9vw] animate-pulse">:</span>
        <span className="text-white text-[18vw] sm:text-[15vw] lg:text-[12vw]">{mm}</span>
        <span className="mb-[2vw] text-cyan-400/80 text-[6vw] sm:text-[5vw] lg:text-[4vw]">{ss}</span>
      </div>
      <p className="mt-2 text-xl font-light tracking-[0.3em] text-white/70 sm:text-2xl">
        {dateLabel}
      </p>
    </div>
  )
}
