package com.canchi.app

import kotlin.math.PI
import kotlin.math.floor
import kotlin.math.sin

/**
 * Vietnamese lunar calendar conversion used when React Native is not running.
 * This mirrors src/lib/lunar.ts and uses Vietnam's UTC+7 lunar calendar.
 */
object LunarCalendar {
  private const val TIME_ZONE = 7.0

  fun lunarDay(day: Int, month: Int, year: Int): Int {
    val dayNumber = julianDay(day, month, year)
    val k = floor((dayNumber - 2415021.076998695) / 29.530588853).toInt()
    var monthStart = newMoonDay(k + 1)
    if (monthStart > dayNumber) {
      monthStart = newMoonDay(k)
    }
    return dayNumber - monthStart + 1
  }

  private fun julianDay(day: Int, month: Int, year: Int): Int {
    val a = floor((14 - month) / 12.0).toInt()
    val y = year + 4800 - a
    val m = month + 12 * a - 3
    var result =
      day +
        floor((153 * m + 2) / 5.0).toInt() +
        365 * y +
        floor(y / 4.0).toInt() -
        floor(y / 100.0).toInt() +
        floor(y / 400.0).toInt() -
        32045
    if (result < 2299161) {
      result =
        day +
          floor((153 * m + 2) / 5.0).toInt() +
          365 * y +
          floor(y / 4.0).toInt() -
          32083
    }
    return result
  }

  private fun newMoonDay(k: Int): Int =
    floor(newMoon(k) + 0.5 + TIME_ZONE / 24.0).toInt()

  private fun newMoon(k: Int): Double {
    val t = k / 1236.85
    val t2 = t * t
    val t3 = t2 * t
    val degreesToRadians = PI / 180.0
    var julianDate =
      2415020.75933 +
        29.53058868 * k +
        0.0001178 * t2 -
        0.000000155 * t3
    julianDate +=
      0.00033 * sin((166.56 + 132.87 * t - 0.009173 * t2) * degreesToRadians)

    val meanAnomalySun =
      359.2242 +
        29.10535608 * k -
        0.0000333 * t2 -
        0.00000347 * t3
    val meanAnomalyMoon =
      306.0253 +
        385.81691806 * k +
        0.0107306 * t2 +
        0.00001236 * t3
    val latitudeArgument =
      21.2964 +
        390.67050646 * k -
        0.0016528 * t2 -
        0.00000239 * t3

    var correction =
      (0.1734 - 0.000393 * t) * sin(meanAnomalySun * degreesToRadians) +
        0.0021 * sin(2 * degreesToRadians * meanAnomalySun)
    correction -= 0.4068 * sin(meanAnomalyMoon * degreesToRadians)
    correction += 0.0161 * sin(2 * degreesToRadians * meanAnomalyMoon)
    correction -= 0.0004 * sin(3 * degreesToRadians * meanAnomalyMoon)
    correction += 0.0104 * sin(2 * degreesToRadians * latitudeArgument)
    correction -=
      0.0051 * sin(degreesToRadians * (meanAnomalySun + meanAnomalyMoon))
    correction -=
      0.0074 * sin(degreesToRadians * (meanAnomalySun - meanAnomalyMoon))
    correction +=
      0.0004 * sin(degreesToRadians * (2 * latitudeArgument + meanAnomalySun))
    correction -=
      0.0004 * sin(degreesToRadians * (2 * latitudeArgument - meanAnomalySun))
    correction -=
      0.0006 * sin(degreesToRadians * (2 * latitudeArgument + meanAnomalyMoon))
    correction +=
      0.001 * sin(degreesToRadians * (2 * latitudeArgument - meanAnomalyMoon))
    correction +=
      0.0005 * sin(degreesToRadians * (2 * meanAnomalyMoon + meanAnomalySun))

    val deltaTime =
      if (t < -11) {
        0.001 +
          0.000839 * t +
          0.0001603 * t2 -
          0.000000464 * t3 +
          0.0000000214 * t * t3
      } else {
        -0.000278 + 0.0002658 * t + 0.000262 * t2
      }
    return julianDate + correction - deltaTime
  }
}
