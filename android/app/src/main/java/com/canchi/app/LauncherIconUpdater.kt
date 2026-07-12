package com.canchi.app

import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager
import java.util.Calendar
import java.util.Locale

object LauncherIconUpdater {
  fun updateToToday(context: Context) {
    val today = Calendar.getInstance()
    val lunarDay =
      LunarCalendar.lunarDay(
        today.get(Calendar.DAY_OF_MONTH),
        today.get(Calendar.MONTH) + 1,
        today.get(Calendar.YEAR),
      )
    updateToDay(context, lunarDay)
  }

  fun updateToDay(
    context: Context,
    day: Int,
  ) {
    val selectedDay = normalizeDay(day)
    val packageManager = context.packageManager
    val packageName = context.packageName

    setAliasState(packageManager, packageName, selectedDay, enabled = true)
    for (candidate in 1..30) {
      if (candidate != selectedDay) {
        setAliasState(packageManager, packageName, candidate, enabled = false)
      }
    }
  }

  fun normalizeDay(day: Int): Int = day.coerceIn(1, 30)

  fun aliasName(
    packageName: String,
    day: Int,
  ): String =
    String.format(
      Locale.US,
      "%s.LauncherDay%02d",
      packageName,
      normalizeDay(day),
    )

  private fun setAliasState(
    packageManager: PackageManager,
    packageName: String,
    day: Int,
    enabled: Boolean,
  ) {
    val component = ComponentName(packageName, aliasName(packageName, day))
    val desiredState =
      if (enabled) {
        PackageManager.COMPONENT_ENABLED_STATE_ENABLED
      } else {
        PackageManager.COMPONENT_ENABLED_STATE_DISABLED
      }
    if (packageManager.getComponentEnabledSetting(component) == desiredState) {
      return
    }
    packageManager.setComponentEnabledSetting(
      component,
      desiredState,
      PackageManager.DONT_KILL_APP,
    )
  }
}
