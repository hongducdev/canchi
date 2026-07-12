package com.canchi.app

import org.junit.Assert.assertEquals
import org.junit.Test

class LauncherIconUpdaterTest {
  @Test
  fun formatsLauncherAliasWithTwoDigitDay() {
    assertEquals(
      "com.canchi.app.LauncherDay07",
      LauncherIconUpdater.aliasName("com.canchi.app", 7),
    )
  }

  @Test
  fun clampsDayToAvailableLauncherIcons() {
    assertEquals(1, LauncherIconUpdater.normalizeDay(0))
    assertEquals(30, LauncherIconUpdater.normalizeDay(31))
  }
}
