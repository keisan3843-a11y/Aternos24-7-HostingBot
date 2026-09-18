"use client"

import { useEffect, useRef } from "react"

const PLAYLIST_ID = "PLfXDKKnId75o"
const FIXED_VOLUME = 50

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

function loadYouTubeApi(): Promise<any> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT)
      return
    }

    const existing = document.getElementById("youtube-iframe-api")
    if (!existing) {
      const tag = document.createElement("script")
      tag.id = "youtube-iframe-api"
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    }

    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve(window.YT)
    }
  })
}

export function YoutubeCard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    const enforceVolume = (player: any) => {
      if (!player) return
      player.unMute?.()
      player.setVolume?.(FIXED_VOLUME)
    }

    loadYouTubeApi().then((YT) => {
      if (cancelled || !containerRef.current) return

      playerRef.current = new YT.Player(containerRef.current, {
        width: "100%",
        height: "100%",
        playerVars: {
          listType: "playlist",
          list: PLAYLIST_ID,
          loop: 1,
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e: any) => enforceVolume(e.target),
          onStateChange: (e: any) => enforceVolume(e.target),
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
  }, [])

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">プレイリスト</h2>
        <span className="text-xs text-white/40">ループ再生 / 音量 {FIXED_VOLUME}</span>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="relative aspect-video h-full max-h-full w-auto max-w-full overflow-hidden rounded-xl bg-black/40 shadow-[0_0_60px_-15px_rgba(34,211,238,0.35)] ring-1 ring-white/10">
          <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </div>
  )
}
