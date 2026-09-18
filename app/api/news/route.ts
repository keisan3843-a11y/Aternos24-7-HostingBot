import { NextResponse } from "next/server"

export const revalidate = 300

type NewsItem = {
  title: string
  link: string
  pubDate: string
  source: string
}

const DEFAULT_FEED = "https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja"

function decodeEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .trim()
}

function pick(tag: string, block: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))
  return match ? decodeEntities(match[1]) : ""
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const feed = searchParams.get("feed")?.trim() || DEFAULT_FEED

  try {
    const res = await fetch(feed, {
      headers: { "User-Agent": "Mozilla/5.0 SmartDisplay" },
      next: { revalidate: 300 },
    })
    const xml = await res.text()

    const channelTitle = pick("title", xml.split("<item>")[0] ?? "")
    const items: NewsItem[] = []
    const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []

    for (const block of blocks.slice(0, 12)) {
      const title = pick("title", block)
      const link = pick("link", block)
      if (!title) continue
      items.push({
        title,
        link,
        pubDate: pick("pubDate", block),
        source: pick("source", block) || channelTitle,
      })
    }

    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ error: "ニュースの取得に失敗しました", items: [] }, { status: 500 })
  }
}
