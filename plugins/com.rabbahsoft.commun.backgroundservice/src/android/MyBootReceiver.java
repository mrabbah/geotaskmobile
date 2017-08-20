package com.rabbahsoft.commun.backgroundservice;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

public class MyBootReceiver extends BroadcastReceiver {

	
	@Override
	public void onReceive(Context context, Intent intent) {
		Log.i("MyBootReceiver Chat notification", intent.getAction());
		Intent messageNotificationIntent = new Intent(context, MessageNotificationService.class);
		PendingIntent pendingMessageNotificationIntent = PendingIntent.getService(context, 1, messageNotificationIntent, 0);
        AlarmManager messageNotificationAlarmManager = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        messageNotificationAlarmManager.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
                1 * 1000, CommonUtils.ALARM_MANAGER_INTERVAL, pendingMessageNotificationIntent);
		Log.i("info", "Starting chat notification services at boot time");
        //context.startService(i); 
                //.setInexactRepeating

	}

}
