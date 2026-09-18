"use client"

import useSWR from "swr"
import { Newspaper } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type NewsItem = {
  title: string
  link: string
  pubDate: string
  source: string
}

function timeAgo(pubDate: string): string {
  if (!pubDate) return ""
  const then = new Date(pubDate).getTime()
  if (Number.isNaN(then)) return ""
  const diff = Math.max(0, Date.now() - then)
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "たった今"
  if (mins < 60) return `${mins}分前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}時間前`
  return `${Math.floor(hours / 24)}日前`
}

export function NewsCard() {
  const { data, isLoading } = useSWR<{ items: NewsItem[] }>("/api/news", fetcher, {
    refreshInterval: 300_000,
  })

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2 text-white/60">
        <Newspaper className="size-4 text-cyan-400" />
        <span className="text-sm font-medium tracking-wide">ニュース</span>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {isLoading && <p className="animate-pulse text-white/40">読み込み中…</p>}
        {!isLoading && (!data || data.items.length === 0) && (
          <p className="text-white/40">ニュースを取得できませんでした</p>
        )}
        {data?.items.map((item, i) => (
          <a
            key={`${item.link}-${i}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
          >
            <span className="mt-0.5 font-mono text-xs text-cyan-400/60 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">
              <span className="line-clamp-2 text-sm leading-snug text-white/85 group-hover:text-white">
                {item.title}
              </span>
              {(item.source || item.pubDate) && (
                <span className="mt-0.5 block truncate text-xs text-white/40">
                  {[item.source, timeAgo(item.pubDate)].filter(Boolean).join(" · ")}
                </span>
              )}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
