export type WeatherVisualKind =
  | 'clear'
  | 'fair'
  | 'partlyCloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'sleet'
  | 'snow'
  | 'thunder'
  | 'unknown'

export type WeatherPresentation = {
  kind: WeatherVisualKind
  label: string
}

export function getWeatherPresentation(symbolCode?: string): WeatherPresentation {
  const code = (symbolCode ?? '').replace(/_(day|night|polartwilight)$/, '')
  if (code.includes('thunder')) return { kind: 'thunder', label: 'Mưa giông' }
  if (code.includes('sleet')) return { kind: 'sleet', label: 'Mưa tuyết' }
  if (code.includes('snow')) return { kind: 'snow', label: 'Có tuyết' }
  if (code.includes('rain')) {
    return { kind: 'rain', label: code.includes('showers') ? 'Mưa rào' : 'Có mưa' }
  }
  if (code.includes('fog')) return { kind: 'fog', label: 'Sương mù' }
  if (code.includes('partlycloudy')) return { kind: 'partlyCloudy', label: 'Có mây' }
  if (code.includes('cloudy')) return { kind: 'cloudy', label: 'Nhiều mây' }
  if (code.includes('fair')) return { kind: 'fair', label: 'Ít mây' }
  if (code.includes('clearsky')) return { kind: 'clear', label: 'Trời quang' }
  return { kind: 'unknown', label: 'Thời tiết hiện tại' }
}
