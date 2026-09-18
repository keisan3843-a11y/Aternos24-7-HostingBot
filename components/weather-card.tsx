"use client"

import useSWR from "swr"
import { MapPin, Droplets, Wind } from "lucide-react"
import { weatherFromCode } from "@/lib/weather-code"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

type WeatherData = {
  location: { name: string; region: string }
  current: {
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
  error?: string
}

export function WeatherCard({ city = "Tokyo" }: { city?: string }) {
  const { data, isLoading } = useSWR<WeatherData>(
    `/api/weather?city=${encodeURIComponent(city)}`,
    fetcher,
    { refreshInterval: 600_000 },
  )

  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center text-white/40">
        <span className="animate-pulse text-lg">天気を読み込み中…</span>
      </div>
    )
  }

  if (data.error || !data.current) {
    return (
      <div className="flex h-full items-center justify-center text-white/40">
        <span>天気を取得できませんでした</span>
      </div>
    )
  }

  const { label, Icon } = weatherFromCode(data.current.weather_code)

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2 text-white/60">
        <MapPin className="size-4 text-cyan-400" />
        <span className="text-sm tracking-wide">
          {data.location.name}
          {data.location.region ? `・${data.location.region}` : ""}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <Icon className="size-20 shrink-0 text-cyan-300" strokeWidth={1.25} />
        <div>
          <div className="flex items-start leading-none">
            <span className="font-mono text-7xl font-light tabular-nums text-white">
              {Math.round(data.current.temperature_2m)}
            </span>
            <span className="mt-1 text-3xl text-white/50">°</span>
          </div>
          <p className="mt-1 text-lg text-white/70">{label}</p>
        </div>
      </div>

      <div className="flex gap-6 text-sm text-white/60">
        <span className="inline-flex items-center gap-1.5">
          <Droplets className="size-4 text-cyan-400/80" />
          {data.current.relative_humidity_2m}%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wind className="size-4 text-cyan-400/80" />
          {Math.round(data.current.wind_speed_10m)} km/h
        </span>
        <span className="text-white/40">
          体感 {Math.round(data.current.apparent_temperature)}°
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
        {data.daily.time.slice(1, 5).map((t, i) => {
          const idx = i + 1
          const day = weatherFromCode(data.daily.weather_code[idx])
          const d = new Date(t)
          return (
            <div key={t} className="flex flex-col items-center gap-1">
              <span className="text-xs text-white/50">{WEEKDAYS[d.getDay()]}</span>
              <day.Icon className="size-6 text-cyan-300/80" strokeWidth={1.5} />
              <span className="font-mono text-sm tabular-nums text-white/80">
                {Math.round(data.daily.temperature_2m_max[idx])}°
              </span>
              <span className="font-mono text-xs tabular-nums text-white/40">
                {Math.round(data.daily.temperature_2m_min[idx])}°
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
