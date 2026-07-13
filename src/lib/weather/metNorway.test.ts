import { beforeEach, describe, expect, it, vi } from 'vitest'

const storage = vi.hoisted(() => new Map<string, string>())

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async (key: string) => storage.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      storage.set(key, value)
    }),
    removeItem: vi.fn(async (key: string) => {
      storage.delete(key)
    }),
    getAllKeys: vi.fn(async () => [...storage.keys()]),
    multiRemove: vi.fn(async (keys: string[]) => {
      keys.forEach((key) => storage.delete(key))
    }),
  },
}))

import { createMetNorwayWeatherClient } from './metNorway'
import { WeatherError } from './types'

const responseBody = {
  properties: {
    meta: { updated_at: '2026-07-13T06:00:00Z' },
    timeseries: [
      {
        time: '2026-07-13T07:00:00Z',
        data: {
          instant: {
            details: {
              air_temperature: 31.2,
              relative_humidity: 72,
              air_pressure_at_sea_level: 1004.5,
              cloud_area_fraction: 81,
              wind_speed: 2.4,
              wind_from_direction: 135,
            },
          },
          next_1_hours: {
            summary: { symbol_code: 'rainshowers_day' },
            details: { precipitation_amount: 1.3 },
          },
        },
      },
    ],
  },
}

function metResponse(expires = 'Mon, 13 Jul 2099 08:00:00 GMT') {
  return new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: {
      expires,
      'last-modified': 'Mon, 13 Jul 2026 06:00:00 GMT',
    },
  })
}

describe('MET Norway weather client', () => {
  beforeEach(() => storage.clear())

  it('normalizes the compact forecast and reuses fresh cache', async () => {
    const fetchImpl = vi.fn(async (..._args: Parameters<typeof fetch>) => metResponse())
    const client = createMetNorwayWeatherClient({
      userAgent: 'CanChi/1.4 https://example.com/contact',
      fetchImpl: fetchImpl as typeof fetch,
    })

    const location = { latitude: 21.028511, longitude: 105.804817 }
    const first = await client.getForecast(location)
    const second = await client.getForecast(location)

    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(fetchImpl.mock.calls[0][0]).toContain('lat=21.0285&lon=105.8048')
    expect(first.current).toMatchObject({
      temperatureC: 31.2,
      humidityPercent: 72,
      symbolCode: 'rainshowers_day',
      precipitationMm: 1.3,
      forecastPeriodHours: 1,
    })
    expect(second).toEqual(first)
  })

  it('returns stale cached data when refresh fails', async () => {
    const fetchImpl = vi
      .fn<() => Promise<Response>>()
      .mockResolvedValueOnce(metResponse('Mon, 13 Jul 2020 08:00:00 GMT'))
      .mockRejectedValueOnce(new Error('offline'))
    const client = createMetNorwayWeatherClient({
      userAgent: 'CanChi/1.4 support@example.com',
      fallbackCacheMs: -1,
      fetchImpl,
    })
    const location = { latitude: 10.7769, longitude: 106.7009 }

    expect((await client.getForecast(location)).isStale).toBe(false)
    expect((await client.getForecast(location)).isStale).toBe(true)
  })

  it('rejects an anonymous User-Agent', () => {
    expect(() => createMetNorwayWeatherClient({ userAgent: 'CanChi' })).toThrowError(
      WeatherError,
    )
  })
})
