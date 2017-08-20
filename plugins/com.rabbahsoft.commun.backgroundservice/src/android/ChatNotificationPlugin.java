package com.rabbahsoft.commun.backgroundservice;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.Log;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

import android.os.Build;

import android.preference.PreferenceManager;
import android.content.SharedPreferences;
import android.content.Intent;

@SuppressWarnings("deprecation")
@SuppressLint("NewApi")
public class ChatNotificationPlugin extends CordovaPlugin {

    private static final String ACTION_SET_CONFIG = "setConfig";
    private static final String ACTION_START = "startService";
    private final String pluginName = "ChatNotificationPlugin";

    @Override
    public boolean execute(final String action, final JSONArray data, final CallbackContext callbackContext) {
        Log.i(pluginName, "ChatNotificationPlugin called with options: " + data);
        if (action.equals(ACTION_SET_CONFIG)) {
            String login, password, iduser, ipserver;
            try {
                JSONObject obj = data.getJSONObject(0);
                login = obj.getString("login");
                password = obj.getString("password");
                iduser = obj.getString("iduser");
                ipserver = obj.getString("ipserver");
                this.setConfig(login, password, iduser, ipserver, callbackContext);
            } catch (JSONException jex) {
                //Log.e(pluginName, CommonUtils.getErrorMessage("JSONException", jex));
                callbackContext.error("Error while parsing options : " + jex.getMessage());
            }
            return true;
        } else if (action.equals(ACTION_START)) {
            this.startService(callbackContext);
            return true;
        }
        return false;
    }

    private void setConfig(String login, String password, String iduser, String ipserver, CallbackContext callbackContext) {
        try {
            Context context = this.cordova.getActivity().getApplicationContext();
            SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(context).edit();
            editor.putString("login", login);
            editor.putString("password", password);
            editor.putString("ipserver", ipserver);
            editor.putString("iduser", iduser);
            String packagename = context.getPackageName();
            Log.i("ChatNotificationPlugin", "package name = " + packagename);
            editor.putString("package", packagename);
            editor.apply();
            JSONObject result = new JSONObject();
            result.put("message", "Configuration set successfully");
            result.put("package", packagename);
            callbackContext.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error("Error during configuration setting : " + e.getMessage());
        }

    }

    private void startService(CallbackContext callbackContext) {
        try {
            Intent i = new Intent();
            i.setClassName("com.rabbahsoft.commun.backgroundservice",
                    "com.rabbahsoft.commun.backgroundservice.MessageNotificationService");
            Context context = this.cordova.getActivity().getApplicationContext();
            context.startService(i);
            callbackContext.success("service com.rabbahsoft.commun.backgroundservice started successfully");
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error("Error during starting service : " + e.getMessage());
        }
    }

}
