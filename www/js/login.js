$(document).ready(function() {
    initauthentification();
});

var notificationService;

function lunchNotificationService() {
//    alert('lunchNotificationService');
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var options = {
        "login": login,
        "password": password,
        "ipserver": ipserver,
        "iduser": iduser
    };
    chatNotification.setConfig(options, settingConfigSuccess, settingConfigFail);
    /*var serviceName = 'com.rabbahsoft.commun.backgroundservice.MessageNotificationService';
     var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
     notificationService = factory.create(serviceName);
     getStatus();*/
}
;
function settingConfigSuccess(result) {
//    alert("success set config");
//    alert("result.message = " + result.message);
//    alert("result.package = " + result.package);
    chatNotification.startService(displayResult, displayError);
}
;
function initauthentification() {
    $("#submit").click(function() {        
        //event.preventDefault();
        var login = $("#lgn").val();
        var password = $("#password").val();
        var ipserver = $("#ip").val();

        if (login.length == 0) {
            alert('Login est requis');
        } else if (password.length == 0) {
            alert('Mote de passe est requis');
        } else if (ipserver.length == 0) {
            alert('Adresse IP du serveur est requise');
        } else {
            authentification(login, password, ipserver);
        }
    });
}
;

function authentification(login, password, ipserver) {
    var url = "http://" + ipserver + "/mobile/authentifier";
    $.mobile.loading('show', {
            text: 'Authentification...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password},
        success: function(data) {
            $.mobile.loading('hide');
            if (data >= 0) {
                window.localStorage.setItem("iduser", data);
                window.localStorage.setItem("login", login);
                window.localStorage.setItem("password", password);
                window.localStorage.setItem("ipserver", ipserver);
                lunchNotificationService();
                //chargerMesTaches();
                $.mobile.changePage('tachesnow.html', 'slide-up', false);
                /*if (watchID == null) {
                    initGps();
                }*/
            } else {
                alert('Login et/ou mot de passe incorrect(s)');
                //$.mobile.changePage($('#login'), 'slide-up', false);
            }
        },
        error: function(xhr, status, error) {
            $.mobile.loading('hide');
            //var err = eval("(" + xhr.responseText + ")");
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
            //$.mobile.changePage($('#login'), 'slide-up', false);
        }
    });
}
;

function settingConfigFail(message) {
//    alert("fail set config: " + message);
}
;
function displayError(message) {
//    alert("starting service fail : " + message);
    //alert("We have an error to service : " + data.ErrorMessage);
}
;
function displayResult(message) {
//    alert("starting service success : " + message);
}
;