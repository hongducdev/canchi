import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getForecast: vi.fn(),
  getForegroundPermissionsAsync: vi.fn(),
  requestForegroundPermissionsAsync: vi.fn(),
  hasServicesEnabledAsync: vi.fn(),
  getCurrentPositionAsync: vi.fn(),
}))
const storage = vi.hoisted(() => new Map<string, string>())

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(async (key: string) => storage.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn(async (key: string) => storage.delete(key)),
  },
}))

vi.mock('expo-location', () => ({
  Accuracy: { Balanced: 3 },
  PermissionStatus: { GRANTED: 'granted' },
  getForegroundPermissionsAsync: mocks.getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync: mocks.requestForegroundPermissionsAsync,
  hasServicesEnabledAsync: mocks.hasServicesEnabledAsync,
  getCurrentPositionAsync: mocks.getCurrentPositionAsync,
}))

vi.mock('./metNorway', () => ({
  createMetNorwayWeatherClient: () => ({ getForecast: mocks.getForecast }),
}))

import { getDeviceWeather, getWidgetWeather, HANOI_WEATHER_LOCATION } from './deviceWeather'

const forecast = { source: 'MET Norway' }

describe('device weather location', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    storage.clear()
    mocks.getForecast.mockResolvedValue(forecast)
    mocks.hasServicesEnabledAsync.mockResolvedValue(true)
  })

  it('uses the current position when foreground permission is granted', async () => {
    mocks.getForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' })
    mocks.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 10.77, longitude: 106.69, altitude: 12 },
    })

    const result = await getDeviceWeather()

    expect(result.locationSource).toBe('current')
    expect(result.location).toEqual({ latitude: 10.77, longitude: 106.69, altitudeM: 12 })
    expect(mocks.requestForegroundPermissionsAsync).not.toHaveBeenCalled()
    expect(mocks.getForecast).toHaveBeenCalledWith(result.location)
  })

  it('requests permission then falls back to Hanoi when denied', async () => {
    mocks.getForegroundPermissionsAsync.mockResolvedValue({ status: 'undetermined' })
    mocks.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' })

    const result = await getDeviceWeather()

    expect(result).toMatchObject({
      location: HANOI_WEATHER_LOCATION,
      locationLabel: 'Hà Nội, Việt Nam',
      locationSource: 'hanoi',
      fallbackReason: 'permission_denied',
    })
    expect(mocks.getForecast).toHaveBeenCalledWith(HANOI_WEATHER_LOCATION)
  })

  it('falls back to Hanoi when location services are disabled', async () => {
    mocks.getForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' })
    mocks.hasServicesEnabledAsync.mockResolvedValue(false)

    const result = await getDeviceWeather()

    expect(result.locationSource).toBe('hanoi')
    expect(result.fallbackReason).toBe('location_services_disabled')
    expect(mocks.getCurrentPositionAsync).not.toHaveBeenCalled()
  })

  it('reuses the granted current location for widgets without another prompt', async () => {
    mocks.getForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' })
    mocks.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 10.77, longitude: 106.69, altitude: null },
    })
    await getDeviceWeather()
    mocks.getForecast.mockClear()

    const result = await getWidgetWeather()

    expect(result.locationSource).toBe('current')
    expect(result.location).toEqual({ latitude: 10.77, longitude: 106.69 })
    expect(mocks.requestForegroundPermissionsAsync).not.toHaveBeenCalled()
    expect(mocks.getForecast).toHaveBeenCalledWith(result.location)
  })

  it('uses Hanoi for widgets when foreground permission is not granted', async () => {
    mocks.getForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' })

    const result = await getWidgetWeather()

    expect(result.locationSource).toBe('hanoi')
    expect(mocks.requestForegroundPermissionsAsync).not.toHaveBeenCalled()
    expect(mocks.getForecast).toHaveBeenCalledWith(HANOI_WEATHER_LOCATION)
  })
})
