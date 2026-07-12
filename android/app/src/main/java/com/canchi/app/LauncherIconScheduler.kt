package com.canchi.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import java.util.Calendar
import java.util.TimeZone

object LauncherIconScheduler {
  private const val REQUEST_CODE = 522
  private const val UPDATE_HOUR = 0
  private const val UPDATE_MINUTE = 5

  fun scheduleNext(context: Context) {
    val alarmManager = context.getSystemService(AlarmManager::class.java)
    alarmManager.setAndAllowWhileIdle(
      AlarmManager.RTC_WAKEUP,
      nextUpdateAt(System.currentTimeMillis(), TimeZone.getDefault()),
      updateIntent(context),
    )
  }

  fun nextUpdateAt(
    nowMillis: Long,
    timeZone: TimeZone,
  ): Long {
    val next =
      Calendar.getInstance(timeZone).apply {
        timeInMillis = nowMillis
        set(Calendar.HOUR_OF_DAY, UPDATE_HOUR)
        set(Calendar.MINUTE, UPDATE_MINUTE)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
        if (timeInMillis <= nowMillis) {
          add(Calendar.DAY_OF_MONTH, 1)
        }
      }
    return next.timeInMillis
  }

  private fun updateIntent(context: Context): PendingIntent {
    val intent =
      Intent(context, LauncherIconUpdateReceiver::class.java).apply {
        action = LauncherIconUpdateReceiver.ACTION_UPDATE
      }
    return PendingIntent.getBroadcast(
      context,
      REQUEST_CODE,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }
}
