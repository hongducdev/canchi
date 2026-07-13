import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'

import { createMetNorwayWeatherClient } from './metNorway'
import { WeatherForecast, WeatherLocation } from './types'

export const HANOI_WEATHER_LOCATION: WeatherLocation = {
  latitude: 21.0285,
  longitude: 105.8542,
}

export const CAN_CHI_MET_NO_USER_AGENT = 'CanChi/1.4 hongducyb123@gmail.com'
const WIDGET_LOCATION_KEY = 'weather_widget_location_v1'

export type WeatherLocationSource = 'current' | 'hanoi'

export type DeviceWeatherResult = {
  forecast: WeatherForecast
  location: WeatherLocation
  locationLabel: 'Vị trí hiện tại' | 'Hà Nội, Việt Nam'
  locationSource: WeatherLocationSource
  fallbackReason?: 'permission_denied' | 'location_services_disabled' | 'location_unavailable'
}

export type DeviceWeatherOptions = {
  /** Accuracy balanced for city-level weather while limiting battery usage. */
  accuracy?: Location.Accuracy
}

export const weatherClient = createMetNorwayWeatherClient({
  userAgent: CAN_CHI_MET_NO_USER_AGENT,
})

async function saveWidgetLocation(
  source: WeatherLocationSource,
  location: WeatherLocation,
): Promise<void> {
  try {
    if (source === 'current') {
      await AsyncStorage.setItem(WIDGET_LOCATION_KEY, JSON.stringify(location))
    } else {
      await AsyncStorage.removeItem(WIDGET_LOCATION_KEY)
    }
  } catch {
    // Weather fetching should still work when location persistence is unavailable.
  }
}

async function readWidgetLocation(): Promise<WeatherLocation | null> {
  try {
    const permission = await Location.getForegroundPermissionsAsync()
    if (permission.status !== Location.PermissionStatus.GRANTED) {
      await AsyncStorage.removeItem(WIDGET_LOCATION_KEY)
      return null
    }
    const stored = await AsyncStorage.getItem(WIDGET_LOCATION_KEY)
    if (!stored) return null
    const location = JSON.parse(stored) as WeatherLocation
    if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return null
    return location
  } catch {
    return null
  }
}

async function resolveWeatherLocation(
  accuracy: Location.Accuracy,
): Promise<Omit<DeviceWeatherResult, 'forecast'>> {
  let permission: Location.LocationPermissionResponse
  try {
    permission = await Location.getForegroundPermissionsAsync()
    if (permission.status !== Location.PermissionStatus.GRANTED) {
      permission = await Location.requestForegroundPermissionsAsync()
    }
  } catch {
    return hanoiFallback('location_unavailable')
  }

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    return hanoiFallback('permission_denied')
  }

  try {
    if (!(await Location.hasServicesEnabledAsync())) {
      return hanoiFallback('location_services_disabled')
    }

    const position = await Location.getCurrentPositionAsync({ accuracy })
    const { latitude, longitude, altitude } = position.coords
    return {
      location: {
        latitude,
        longitude,
        altitudeM: altitude ?? undefined,
      },
      locationLabel: 'Vị trí hiện tại',
      locationSource: 'current',
    }
  } catch {
    return hanoiFallback('location_unavailable')
  }
}

function hanoiFallback(
  fallbackReason: NonNullable<DeviceWeatherResult['fallbackReason']>,
): Omit<DeviceWeatherResult, 'forecast'> {
  return {
    location: HANOI_WEATHER_LOCATION,
    locationLabel: 'Hà Nội, Việt Nam',
    locationSource: 'hanoi',
    fallbackReason,
  }
}

/**
 * Requests foreground location permission and fetches local weather. When a
 * current position cannot be obtained, Hanoi is used without failing the flow.
 */
export async function getDeviceWeather(
  options: DeviceWeatherOptions = {},
): Promise<DeviceWeatherResult> {
  const resolved = await resolveWeatherLocation(
    options.accuracy ?? Location.Accuracy.Balanced,
  )
  await saveWidgetLocation(resolved.locationSource, resolved.location)
  const forecast = await weatherClient.getForecast(resolved.location)
  return { ...resolved, forecast }
}

/** Fetches widget weather without prompting for location permission. */
export async function getWidgetWeather(): Promise<DeviceWeatherResult> {
  const savedLocation = await readWidgetLocation()
  const location = savedLocation ?? HANOI_WEATHER_LOCATION
  const current = savedLocation !== null
  const forecast = await weatherClient.getForecast(location)
  return {
    forecast,
    location,
    locationLabel: current ? 'Vị trí hiện tại' : 'Hà Nội, Việt Nam',
    locationSource: current ? 'current' : 'hanoi',
  }
}
