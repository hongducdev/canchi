import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  GetWeatherOptions,
  MetNorwayWeatherClientOptions,
  WeatherError,
  WeatherForecast,
  WeatherInstant,
  WeatherLocation,
} from './types'

const ENDPOINT = 'https://api.met.no/weatherapi/locationforecast/2.0/compact'
const CACHE_PREFIX = 'weather_met_no_v1'
const DEFAULT_CACHE_MS = 30 * 60 * 1000

export const MET_NORWAY_ATTRIBUTION = {
  label: 'Dữ liệu thời tiết: MET Norway',
  url: 'https://www.met.no/',
  licenseLabel: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
} as const

type MetNoDetails = {
  air_temperature?: number
  relative_humidity?: number
  air_pressure_at_sea_level?: number
  cloud_area_fraction?: number
  wind_speed?: number
  wind_from_direction?: number
  precipitation_amount?: number
}

type MetNoPeriod = {
  summary?: { symbol_code?: string }
  details?: MetNoDetails
}

type MetNoTimeseries = {
  time?: string
  data?: {
    instant?: { details?: MetNoDetails }
    next_1_hours?: MetNoPeriod
    next_6_hours?: MetNoPeriod
    next_12_hours?: MetNoPeriod
  }
}

type MetNoResponse = {
  properties?: {
    meta?: { updated_at?: string }
    timeseries?: MetNoTimeseries[]
  }
}

type CacheEntry = {
  forecast: WeatherForecast
  expiresAt: string
  lastModified?: string
}

function truncateCoordinate(value: number): number {
  return Math.trunc(value * 10_000) / 10_000
}

function normalizeLocation(location: WeatherLocation): WeatherLocation {
  const { latitude, longitude, altitudeM } = location
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180 ||
    (altitudeM !== undefined && !Number.isFinite(altitudeM))
  ) {
    throw new WeatherError('Tọa độ thời tiết không hợp lệ.', 'INVALID_LOCATION')
  }

  return {
    latitude: truncateCoordinate(latitude),
    longitude: truncateCoordinate(longitude),
    altitudeM: altitudeM === undefined ? undefined : Math.round(altitudeM),
  }
}

function cacheKey(location: WeatherLocation): string {
  const altitude = location.altitudeM ?? 'auto'
  return `${CACHE_PREFIX}:${location.latitude.toFixed(4)}:${location.longitude.toFixed(4)}:${altitude}`
}

function requestUrl(location: WeatherLocation): string {
  const query = [
    `lat=${location.latitude.toFixed(4)}`,
    `lon=${location.longitude.toFixed(4)}`,
  ]
  if (location.altitudeM !== undefined) {
    query.push(`altitude=${location.altitudeM}`)
  }
  return `${ENDPOINT}?${query.join('&')}`
}

function choosePeriod(
  item: MetNoTimeseries,
): { period: MetNoPeriod; hours: 1 | 6 | 12 } | undefined {
  if (item.data?.next_1_hours) return { period: item.data.next_1_hours, hours: 1 }
  if (item.data?.next_6_hours) return { period: item.data.next_6_hours, hours: 6 }
  if (item.data?.next_12_hours) return { period: item.data.next_12_hours, hours: 12 }
  return undefined
}

function parseInstant(item: MetNoTimeseries): WeatherInstant | null {
  const time = item.time
  const instant = item.data?.instant?.details
  if (!time || !instant || !Number.isFinite(instant.air_temperature)) return null

  const selectedPeriod = choosePeriod(item)
  const period = selectedPeriod?.period
  return {
    time,
    temperatureC: instant.air_temperature as number,
    humidityPercent: instant.relative_humidity,
    pressureHpa: instant.air_pressure_at_sea_level,
    cloudCoverPercent: instant.cloud_area_fraction,
    windSpeedMps: instant.wind_speed,
    windDirectionDeg: instant.wind_from_direction,
    symbolCode: period?.summary?.symbol_code,
    precipitationMm: period?.details?.precipitation_amount,
    forecastPeriodHours: selectedPeriod?.hours,
  }
}

function parseForecast(
  body: MetNoResponse,
  location: WeatherLocation,
  expiresAt: string,
): WeatherForecast {
  const timeline = (body.properties?.timeseries ?? [])
    .map(parseInstant)
    .filter((item): item is WeatherInstant => item !== null)

  if (timeline.length === 0) {
    throw new WeatherError(
      'MET Norway trả về dữ liệu thời tiết không hợp lệ.',
      'INVALID_RESPONSE',
    )
  }

  return {
    latitude: location.latitude,
    longitude: location.longitude,
    altitudeM: location.altitudeM,
    updatedAt: body.properties?.meta?.updated_at ?? new Date().toISOString(),
    expiresAt,
    current: timeline[0],
    timeline,
    source: 'MET Norway',
    isStale: false,
  }
}

async function readCache(key: string): Promise<CacheEntry | null> {
  try {
    const stored = await AsyncStorage.getItem(key)
    if (!stored) return null
    return JSON.parse(stored) as CacheEntry
  } catch {
    return null
  }
}

async function writeCache(key: string, entry: CacheEntry): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // A cache failure must not discard a valid live forecast.
  }
}

function expiryFromHeader(header: string | null, fallbackCacheMs: number): string {
  const parsed = header ? Date.parse(header) : Number.NaN
  const timestamp = Number.isFinite(parsed) && parsed > Date.now()
    ? parsed
    : Date.now() + fallbackCacheMs
  return new Date(timestamp).toISOString()
}

export function createMetNorwayWeatherClient(options: MetNorwayWeatherClientOptions) {
  const userAgent = options.userAgent.trim()
  if (!userAgent || !/https?:\/\/|@/.test(userAgent)) {
    throw new WeatherError(
      'MET Norway yêu cầu User-Agent có tên ứng dụng và thông tin liên hệ.',
      'INVALID_CONFIGURATION',
    )
  }

  const fetchImpl = options.fetchImpl ?? fetch
  const fallbackCacheMs = options.fallbackCacheMs ?? DEFAULT_CACHE_MS

  async function getForecast(
    requestedLocation: WeatherLocation,
    requestOptions: GetWeatherOptions = {},
  ): Promise<WeatherForecast> {
    const location = normalizeLocation(requestedLocation)
    const key = cacheKey(location)
    const cached = await readCache(key)

    if (requestOptions.cacheOnly) {
      if (cached) {
        return {
          ...cached.forecast,
          isStale: Date.parse(cached.expiresAt) <= Date.now(),
        }
      }
      throw new WeatherError('Chưa có dữ liệu thời tiết đã lưu.', 'NO_CACHED_DATA')
    }

    if (
      cached &&
      Date.parse(cached.expiresAt) > Date.now()
    ) {
      return cached.forecast
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': userAgent,
    }
    if (cached?.lastModified) headers['If-Modified-Since'] = cached.lastModified

    try {
      const response = await fetchImpl(requestUrl(location), { headers })
      const expiresAt = expiryFromHeader(response.headers.get('expires'), fallbackCacheMs)

      if (response.status === 304 && cached) {
        const refreshed: CacheEntry = {
          ...cached,
          expiresAt,
          forecast: { ...cached.forecast, expiresAt },
        }
        await writeCache(key, refreshed)
        return refreshed.forecast
      }

      if (!response.ok) {
        throw new WeatherError(
          `Không thể lấy thời tiết từ MET Norway (HTTP ${response.status}).`,
          'API',
          response.status,
        )
      }

      const body = (await response.json()) as MetNoResponse
      const forecast = parseForecast(body, location, expiresAt)
      const entry: CacheEntry = {
        forecast,
        expiresAt,
        lastModified: response.headers.get('last-modified') ?? undefined,
      }
      await writeCache(key, entry)
      return forecast
    } catch (error) {
      // Weather remains useful offline: return the last successful forecast when available.
      if (cached) return { ...cached.forecast, isStale: true }
      if (error instanceof WeatherError) throw error
      throw new WeatherError('Không thể kết nối dịch vụ thời tiết.', 'NETWORK', undefined, {
        cause: error,
      })
    }
  }

  async function clearCache(location?: WeatherLocation): Promise<void> {
    if (location) {
      await AsyncStorage.removeItem(cacheKey(normalizeLocation(location)))
      return
    }
    const keys = await AsyncStorage.getAllKeys()
    const weatherKeys = keys.filter((key) => key.startsWith(`${CACHE_PREFIX}:`))
    if (weatherKeys.length > 0) await AsyncStorage.multiRemove(weatherKeys)
  }

  return { getForecast, clearCache }
}
