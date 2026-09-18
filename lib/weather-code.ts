import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react"

type WeatherInfo = {
  label: string
  Icon: LucideIcon
}

export function weatherFromCode(code: number): WeatherInfo {
  if (code === 0) return { label: "快晴", Icon: Sun }
  if (code === 1) return { label: "晴れ", Icon: Sun }
  if (code === 2) return { label: "薄曇り", Icon: CloudSun }
  if (code === 3) return { label: "曇り", Icon: Cloud }
  if (code === 45 || code === 48) return { label: "霧", Icon: CloudFog }
  if (code >= 51 && code <= 57) return { label: "霧雨", Icon: CloudDrizzle }
  if (code >= 61 && code <= 67) return { label: "雨", Icon: CloudRain }
  if (code >= 71 && code <= 77) return { label: "雪", Icon: CloudSnow }
  if (code >= 80 && code <= 82) return { label: "にわか雨", Icon: CloudRain }
  if (code >= 85 && code <= 86) return { label: "にわか雪", Icon: CloudSnow }
  if (code >= 95) return { label: "雷雨", Icon: CloudLightning }
  return { label: "曇り", Icon: Cloud }
}
