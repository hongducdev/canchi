package com.canchi.app

import org.junit.Assert.assertEquals
import org.junit.Test

class LunarCalendarTest {
  @Test
  fun convertsKnownTetDatesToFirstLunarDay() {
    assertEquals(1, LunarCalendar.lunarDay(10, 2, 2024))
    assertEquals(1, LunarCalendar.lunarDay(29, 1, 2025))
    assertEquals(1, LunarCalendar.lunarDay(17, 2, 2026))
  }

  @Test
  fun matchesTheExistingVietnameseCalendarExample() {
    assertEquals(26, LunarCalendar.lunarDay(10, 7, 2026))
  }
}
