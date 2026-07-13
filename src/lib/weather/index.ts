export { createMetNorwayWeatherClient, MET_NORWAY_ATTRIBUTION } from './metNorway'
export { getWeatherPresentation } from './presentation'
export type { WeatherPresentation, WeatherVisualKind } from './presentation'
export {
  CAN_CHI_MET_NO_USER_AGENT,
  getDeviceWeather,
  getWidgetWeather,
  HANOI_WEATHER_LOCATION,
  weatherClient,
} from './deviceWeather'
export type {
  DeviceWeatherOptions,
  DeviceWeatherResult,
  WeatherLocationSource,
} from './deviceWeather'
export {
  GetWeatherOptions,
  MetNorwayWeatherClientOptions,
  WeatherError,
  WeatherForecast,
  WeatherInstant,
  WeatherLocation,
} from './types'
