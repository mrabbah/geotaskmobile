package com.rabbahsoft.commun.backgroundservice;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import android.app.Service;
import android.widget.Toast;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.TaskStackBuilder;
import android.content.IntentFilter;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationCompat.InboxStyle;
import android.app.PendingIntent;
import android.content.Context;
import static android.content.Context.MODE_PRIVATE;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.media.RingtoneManager;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import java.io.IOException;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONTokener;

import com.rabbahsoft.geotask.*;
import android.os.IBinder;


public class MessageNotificationService extends Service {

    private final static String TAG = MessageNotificationService.class.getSimpleName();

    private String login;
    private String password;
    private String iduser;
    private String ipserver;
    private String packageName;

    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    //Notification 
    NotificationManager mNotificationManager;
    int notificationID = 100;
    private int number = 0;
    MessaginDataSource dataSource;

    /*
     * Called befor service onStart method is called.All Initialization part
     * goes here
     */
    @Override
    public void onCreate() {
        Log.i("info", "Message Notification service onCreate");
        dataSource = MessaginDataSource.getInstance(this);
    }

    /*
     * You need to write the code to be executed on service start. Sometime due
     * to memory congestion DVM kill the running service but it can be restarted
     * when the memory is enough to run the service again.
     */
    @Override
    public void onStart(Intent intent, int startId) {
        try {
            Log.i("info", "Chargement des messages chat");
        int start = Service.START_STICKY;
        getConfig();
        Log.i("MessageNotificationService", "Appel du service : " + login + " " + password + " " + iduser + " " + ipserver);
        /*Toast.makeText(this, "Appel du service : " ,
         Toast.LENGTH_SHORT).show();*/

        if (ipserver != null) {
            PostDataTask pd = new PostDataTask(dataSource);
            String url = "http://" + ipserver + "/mobile/getLastMessages";
            pd.execute(url,login, password, iduser);	
        } else {
            Log.i("MessageNotificationService", "IP Server NULL, waiting authentification action");
        }
        } catch(Exception ex) {
            Log.e("MessageNotificationService", CommonUtils.getErrorMessage("Global Exception", ex));
        }
        
    }
    
    private class PostDataTask extends AsyncTask<String, Void, String> {
		
        private MessaginDataSource dataSource;

        public PostDataTask(MessaginDataSource dataSource) {
                this.dataSource = dataSource;
        }
		
	@Override
	protected String doInBackground(String... params) {
            try {
            Log.i("PostDataTask", "GET LAST MESSAGES BACKGROUD HTTP POST");
			
            dataSource.open();
            try {
                Message message = dataSource.getLastMessage();
                String url = params[0];
                String login = params[1];
                String password = params[2];
                String iduser = params[3];
                String idmessage = null;
                if (message != null) {
                    idmessage = Long.toString(message.getIdMessage());
                }
                HttpClient httpclient = new DefaultHttpClient();
                HttpPost httppost = new HttpPost(url);
                List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(4);
                nameValuePairs.add(new BasicNameValuePair("login", login));
                nameValuePairs.add(new BasicNameValuePair("password", password));
                nameValuePairs.add(new BasicNameValuePair("iduser", iduser));
//            nameValuePairs.add(new BasicNameValuePair("idcontact", this.iduser));
                nameValuePairs.add(new BasicNameValuePair("idmessage", idmessage));
                httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
                Log.d("PostDataTask", "Appel du service distant url : " + url);
                HttpResponse response = httpclient.execute(httppost);
                Log.d("PostDataTask", "Getting status line");
                StatusLine statusLine = response.getStatusLine();
                Log.d("PostDataTask", "HTTP STATUS = " + 
                        statusLine.getStatusCode() + " HTTP STATUS OK = " + HttpStatus.SC_OK);
                if (statusLine.getStatusCode() == HttpStatus.SC_OK) {
                    Log.i("PostDataTask", "Server Responded OK");
                    BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent(), "UTF-8"));
                    StringBuilder builder = new StringBuilder();
                    for (String line = null; (line = reader.readLine()) != null;) {
                        builder.append(line).append("\n");
                    }
                    JSONTokener tokener = new JSONTokener(builder.toString());
                    JSONArray finalResult = new JSONArray(tokener);
                    int compteur = 0;
                    int nbResult = finalResult.length();
                    Log.d("PostDataTask", "Nb new message : " + nbResult);
                    while (compteur < nbResult) {
                        JSONObject row = finalResult.getJSONObject(compteur);
                        compteur++;
                        /*Iterator iter = row.keys();
                         while(iter.hasNext()){
                         String key = (String)iter.next();
                         String value = row.getString(key);
                         Log.d("com.rabbahsoft.geotask", key + " : " + value);
                         }*/
                        JSONObject user = row.getJSONObject("utilisateur");
                        JSONObject tache = row.getJSONObject("tache");
                        //Log.i("com.rabbahsoft.geotask", "--------" + user.getString("nom") + "---------------");
                        long idMessage = row.getLong("id");
                        //Log.i("com.rabbahsoft.geotask", "idMessage = " + idMessage);
                        long idTache = tache.getLong("id");
                        long idUtilisateur = user.getLong("id");
                        String texte = row.getString("texte");
                        //Log.i("com.rabbahsoft.geotask", "texte = " + texte);
                        String filename = row.getString("filename");
                        //Log.i("com.rabbahsoft.geotask", "filename = " + filename);
                        String fullPath = row.getString("fullPath");
                        //Log.i("com.rabbahsoft.geotask", "fullPath = " + fullPath);
                        String type = row.getString("type");
                        //Log.i("com.rabbahsoft.geotask", "type = " + type);
                        Date dateMessage = sdf.parse(row.getString("dateMessage").replaceAll("T", " ").replaceAll("Z", ""));//new Date(row.getString("dateMessage"));
                        //Log.i("com.rabbahsoft.geotask", "dateMessage = " + dateMessage);
                        Log.d("MessageNotificationService", "Message " + compteur + ": " + idMessage + "-" + idTache + "-" + idUtilisateur + "-"
                                + texte + "-" + filename + "-" + type);
                        Message newMessage = dataSource.create(idMessage, idTache, idUtilisateur, texte, filename, fullPath,
                                type, dateMessage, false);

                        if (Long.valueOf(iduser) != idUtilisateur) {
                            String title = "Nouveau message tâche N° : " + idTache;
                            String text = "";
                            if (type.equals("TEXT")) {
                                text = texte;
                            } else if (type.equals("IMAGE")) {
                                text = "Consulter l'image";
                            } else if (type.equals("VIDEO")) {
                                text = "Consulter la vidéo";
                            } else {
                                text = "Fichier binaire transmis";
                            }
                            String ticher = "Nouveau message tâche N° : " + idTache;
                            playNotif(title, text, ticher);
                        }
                    }

                } else {
                    Log.e("PostDataTask", "Server respend not ok : " + statusLine.getReasonPhrase());
                    response.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
               
            } catch (ClientProtocolException e) {
                //failCompteur++;
                Log.e("PostDataTask", CommonUtils.getErrorMessage("ClientProtocolException", e));
                //checkConnectionError();
            } catch (IOException e) {
                //failCompteur++;
                Log.e("PostDataTask", CommonUtils.getErrorMessage("IOException", e));
                //checkConnectionError();
            } catch (Exception ex) {
                //failCompteur++;
                Log.e("PostDataTask", CommonUtils.getErrorMessage("Exception", ex));
                //checkConnectionError();
            } finally {
                dataSource.close();
            }
            } catch(Exception ex) {
                Log.e("PostDataTask", CommonUtils.getErrorMessage("Exception", ex));
            }
            return "finish getting last messages";
    }
		
		/**
		 * Uses the logging framework to display the output of the fetch
		 * operation in the log fragment.
		 */
		@Override
		protected void onPostExecute(String result) {
			Log.i("info", result);
		}
	}
	
        protected JSONObject getConfig() {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
            this.login = prefs.getString("login", null);
            this.password = prefs.getString("password", null);
            this.ipserver = prefs.getString("ipserver", null);
            this.iduser = prefs.getString("iduser", null);
            this.packageName = prefs.getString("package", null);
            JSONObject result = new JSONObject();

            try {
                result.put("login", this.login);
                result.put("password", this.password);
                result.put("ipserver", this.ipserver);
                result.put("iduser", this.iduser);
                result.put("package", this.packageName);

            } catch (JSONException e) {
            }

            return result;
        }

    private String getDateTime() {
        // get date time in custom format
        SimpleDateFormat sdf = new SimpleDateFormat("[yyyy/MM/dd - HH:mm:ss]");
        return sdf.format(new Date());
    }

    private void playNotif(String title, String text, String ticher) {
        try {
            NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this);
            mBuilder.setContentTitle(title);
            mBuilder.setContentText(text);
            mBuilder.setTicker(ticher);
            mBuilder.setSmallIcon(R.drawable.icon);
            mBuilder.setNumber(++number);
            long[] pattern = {0, 100, 200, 300};
            mBuilder.setVibrate(pattern);
            //mBuilder.setVibrate(Notification.DEFAULT_VIBRATE);
            //Uri alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            /*Class rClass = Class.forName(this.packageName + ".R");
            Field raw = = rClass.getField("raw");
            Field beep = raw.getClass().getField("beep");
            Uri alarmSound = Uri.parse("android.resource://"
                    + this.packageName + "/" + beep);*/
            Uri alarmSound = Uri.parse("android.resource://"
                    + this.packageName + "/" + R.raw.beep);
            mBuilder.setSound(alarmSound);
            /*Class cordovaClass = Class.forName(this.packageName + ".CordovaApp");
            Intent resultIntent = new Intent(this, cordovaClass);*/
            Intent resultIntent = new Intent(this, CordovaApp.class);
            
            TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
            stackBuilder.addParentStack(CordovaApp.class);
            
            /* Adds the Intent that starts the Activity to the top of the stack */
            stackBuilder.addNextIntent(resultIntent);
            PendingIntent resultPendingIntent
                    = stackBuilder.getPendingIntent(
                            0,
                            PendingIntent.FLAG_UPDATE_CURRENT
                    );
            
            mBuilder.setContentIntent(resultPendingIntent);
            
            mNotificationManager
                    = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            
            /* notificationID allows you to update the notification later on. */
            mNotificationManager.notify(notificationID, mBuilder.build());
        } catch (SecurityException ex) {
            Log.e(MessageNotificationService.class.getName(), CommonUtils.getErrorMessage("SecurityException", ex));
        }
    }

    @Override
	public IBinder onBind(Intent intent) {
		return null;
	}
}
