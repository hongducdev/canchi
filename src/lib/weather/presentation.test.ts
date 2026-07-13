import { describe, expect, it } from 'vitest'

import { getWeatherPresentation } from './presentation'

describe('getWeatherPresentation', () => {
  it('groups MET Norway day and night variants for widget rendering', () => {
    expect(getWeatherPresentation('clearsky_day')).toEqual({
      kind: 'clear',
      label: 'Trời quang',
    })
    expect(getWeatherPresentation('partlycloudy_night').kind).toBe('partlyCloudy')
    expect(getWeatherPresentation('heavyrainshowersandthunder_day').kind).toBe('thunder')
  })
})
