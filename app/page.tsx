import { Clock } from "@/components/clock"
import { WeatherCard } from "@/components/weather-card"
import { NewsCard } from "@/components/news-card"
import { CalendarEmbed } from "@/components/calendar-embed"
import { YoutubeCard } from "@/components/youtube-card"
import { GlassCard } from "@/components/glass-card"

export default function DashboardPage() {
  return (
    <main className="relative min-h-dvh bg-black text-white lg:h-dvh lg:overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(34,211,238,0.10), transparent 60%)," +
            "radial-gradient(50% 50% at 100% 100%, rgba(99,102,241,0.10), transparent 55%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-[1920px] flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:h-full lg:p-8">
        {/* Clock */}
        <section className="flex shrink-0 items-center justify-center py-4 lg:flex-[0_0_20%] lg:py-0">
          <Clock />
        </section>

        {/* Widgets: stacked & scrollable on small screens, fills remaining height on large screens */}
        <div className="grid flex-1 grid-cols-1 gap-4 sm:gap-6 lg:min-h-0 lg:grid-cols-12 lg:grid-rows-[minmax(0,1.15fr)_minmax(0,1.6fr)]">
          <GlassCard className="min-h-[16rem] lg:col-span-3 lg:row-span-1 lg:min-h-0">
            <WeatherCard city="Tokyo" />
          </GlassCard>

          <GlassCard className="min-h-[20rem] lg:col-span-5 lg:row-span-1 lg:min-h-0">
            <CalendarEmbed />
          </GlassCard>

          <GlassCard className="min-h-[20rem] lg:col-span-4 lg:row-span-1 lg:min-h-0">
            <NewsCard />
          </GlassCard>

          <GlassCard className="min-h-[16rem] lg:col-span-12 lg:row-span-1 lg:min-h-0">
            <YoutubeCard />
          </GlassCard>
        </div>
      </div>
    </main>
  )
}
