package com.canchi.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class LauncherIconUpdateReceiver : BroadcastReceiver() {
  override fun onReceive(
    context: Context,
    intent: Intent,
  ) {
    runCatching { LauncherIconUpdater.updateToToday(context) }
    runCatching { LauncherIconScheduler.scheduleNext(context) }
  }

  companion object {
    const val ACTION_UPDATE = "com.canchi.app.action.UPDATE_LAUNCHER_ICON"
  }
}
