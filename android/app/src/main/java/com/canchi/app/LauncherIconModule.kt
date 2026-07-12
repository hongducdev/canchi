package com.canchi.app

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
      val selectedDay = LauncherIconUpdater.normalizeDay(day)
      LauncherIconUpdater.updateToDay(reactContext, selectedDay)
      LauncherIconScheduler.scheduleNext(reactContext)
      promise.resolve(selectedDay)
    } catch (e: Exception) {
      promise.reject("LAUNCHER_ICON", e.message, e)
    }
  }
}
