package com.canchi.app

import android.content.ComponentName
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class LauncherIconModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "LauncherIcon"

  @ReactMethod
  fun setDayIcon(day: Int, promise: Promise) {
    try {
      val clamped = day.coerceIn(1, 30)
      val pm = reactContext.packageManager
      val packageName = reactContext.packageName
      for (d in 1..30) {
        val alias = String.format("%s.LauncherDay%02d", packageName, d)
        val component = ComponentName(packageName, alias)
        val state =
          if (d == clamped) {
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED
          } else {
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED
          }
        pm.setComponentEnabledSetting(
          component,
          state,
          PackageManager.DONT_KILL_APP,
        )
      }
      promise.resolve(clamped)
    } catch (e: Exception) {
      promise.reject("LAUNCHER_ICON", e.message, e)
    }
  }
}
