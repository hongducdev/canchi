package com.canchi.app

import java.util.Calendar
import java.util.TimeZone
import org.junit.Assert.assertEquals
import org.junit.Test

class LauncherIconSchedulerTest {
  private val timeZone = TimeZone.getTimeZone("Asia/Ho_Chi_Minh")

  @Test
  fun schedulesForFiveMinutesAfterMidnightWhenThatTimeIsStillAhead() {
    val now = timeAt(2026, Calendar.JULY, 12, 0, 4)

    val nextUpdate = LauncherIconScheduler.nextUpdateAt(now, timeZone)

    assertEquals(timeAt(2026, Calendar.JULY, 12, 0, 5), nextUpdate)
  }

  @Test
  fun schedulesForTheNextDayWhenTodaysUpdateTimeHasPassed() {
    val now = timeAt(2026, Calendar.JULY, 12, 0, 6)

    val nextUpdate = LauncherIconScheduler.nextUpdateAt(now, timeZone)

    assertEquals(timeAt(2026, Calendar.JULY, 13, 0, 5), nextUpdate)
  }

  private fun timeAt(
    year: Int,
    month: Int,
    day: Int,
    hour: Int,
    minute: Int,
  ): Long =
    Calendar.getInstance(timeZone)
      .apply {
        clear()
        set(year, month, day, hour, minute, 0)
      }
      .timeInMillis
}
