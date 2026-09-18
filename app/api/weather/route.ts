import { NextResponse } from "next/server"

export const revalidate = 600

type GeoResult = {
  latitude: number
  longitude: number
  name: string
  admin1?: string
  country?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")?.trim() || "Tokyo"

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city,
      )}&count=1&language=ja&format=json`,
      { next: { revalidate: 86400 } },
    )
    const geo = (await geoRes.json()) as { results?: GeoResult[] }
    const place = geo.results?.[0]

    if (!place) {
      return NextResponse.json({ error: "都市が見つかりませんでした" }, { status: 404 })
    }

    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=5`,
      { next: { revalidate: 600 } },
    )
    const forecast = await forecastRes.json()

    return NextResponse.json({
      location: {
        name: place.name,
        region: place.admin1 ?? "",
        country: place.country ?? "",
      },
      current: forecast.current,
      daily: forecast.daily,
    })
  } catch {
    return NextResponse.json({ error: "天気の取得に失敗しました" }, { status: 500 })
  }
}
