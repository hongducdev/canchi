export type WeatherInstant = {
  time: string
  temperatureC: number
  humidityPercent?: number
  pressureHpa?: number
  cloudCoverPercent?: number
  windSpeedMps?: number
  windDirectionDeg?: number
  symbolCode?: string
  precipitationMm?: number
  /** Duration represented by symbolCode and precipitationMm. */
  forecastPeriodHours?: 1 | 6 | 12
}

export type WeatherForecast = {
  latitude: number
  longitude: number
  altitudeM?: number
  updatedAt: string
  expiresAt: string
  current: WeatherInstant
  /** Forecast timeline; later entries can use 6 or 12-hour periods. */
  timeline: WeatherInstant[]
  source: 'MET Norway'
  /** True when cached data is returned after expiry or because refresh failed. */
  isStale: boolean
}

export type WeatherLocation = {
  latitude: number
  longitude: number
  altitudeM?: number
}

export type MetNorwayWeatherClientOptions = {
  /**
   * A unique, contactable identifier required by MET Norway, for example:
   * "CanChi/1.0 https://example.com/contact".
   */
  userAgent: string
  /** Used only when MET Norway does not return a valid Expires header. */
  fallbackCacheMs?: number
  fetchImpl?: typeof fetch
}

export type GetWeatherOptions = {
  /** Return cached data even after it expires, without making a network call. */
  cacheOnly?: boolean
}

export class WeatherError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'INVALID_LOCATION'
      | 'INVALID_CONFIGURATION'
      | 'NO_CACHED_DATA'
      | 'NETWORK'
      | 'API'
      | 'INVALID_RESPONSE',
    readonly status?: number,
    options?: { cause?: unknown },
  ) {
    super(message)
    this.name = 'WeatherError'
    if (options?.cause !== undefined) {
      this.cause = options.cause
    }
  }
}
