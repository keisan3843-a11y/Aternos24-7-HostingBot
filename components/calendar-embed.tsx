import { CalendarDays } from "lucide-react"

const DEFAULT_SRC =
  "https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FTokyo&mode=AGENDA&showTitle=0&showPrint=0&showCalendars=0&showTz=0&bgcolor=%23000000"

export function CalendarEmbed({ src = DEFAULT_SRC }: { src?: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2 text-white/60">
        <CalendarDays className="size-4 text-cyan-400" />
        <span className="text-sm font-medium tracking-wide">カレンダー</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10">
        <iframe
          src={src}
          title="Google カレンダー"
          className="size-full [color-scheme:dark]"
          style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg)" }}
          loading="lazy"
        />
      </div>
    </div>
  )
}
