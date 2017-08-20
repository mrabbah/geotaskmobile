/**
 * Constructor
 */
function ChatNotification() {
  //this._callback;
}

ChatNotification.prototype.setConfig = function(options, successCallback, errorCallback) {  
	cordova.exec(successCallback, 
		errorCallback, 
		"ChatNotificationPlugin", 
		"setConfig",
		[options]
	);
};

ChatNotification.prototype.startService = function(successCallback, errorCallback) {  
	cordova.exec(successCallback, 
		errorCallback, 
		"ChatNotificationPlugin", 
		"startService",
		[]
	);
};

var chatNotification = new ChatNotification();
module.exports = chatNotification;

// Make plugin work under window.plugins
if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.chatNotification) {
    window.plugins.chatNotification = chatNotification;
}