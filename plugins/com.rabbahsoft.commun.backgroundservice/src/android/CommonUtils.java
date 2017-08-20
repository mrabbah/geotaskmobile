package com.rabbahsoft.commun.backgroundservice;

public class CommonUtils {

	public static final int CONNECTION_FAILURE_RESOLUTION_REQUEST = 30000;
	public static final int ALARM_MANAGER_INTERVAL = 1 * 10 * 1000; //10 seconds
	
        public static String getErrorMessage(String exceptionName, Exception ex) {
            ex.printStackTrace();
            return (ex.getMessage() == null)?exceptionName:ex.getMessage();
        }
}
