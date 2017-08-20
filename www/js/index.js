$(document).ready(function() {

    $.mobile.loading('show', {
        text: 'Chargement...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady() {
    $.mobile.loading('hide');
    checkConnection();
    checkGps();
    initdata();        
}
;
function checkConnection() {
    var networkState = navigator.connection.type;
    if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
        alert("Vous n'êtes pas connecté à internet, veillez vérifier votre connexion");
    }

}
;
function checkGps() {
    navigator.geolocation.getCurrentPosition(onSuccessCheckGps, onErrorCheckGps);

}
;
// onSuccess Geolocation
//
function onSuccessCheckGps(position) {
    //Nothing to do
    window.localStorage.setItem("myLatLng", position.coords.latitude + ',' + position.coords.longitude);
}
;
// onError Callback receives a PositionError object
//
function onErrorCheckGps(error) {
//    alert('code: ' + error.code + '\n' +
//            'message: ' + error.message + '\n');
    alert("Veillez vérifiez si votre GPS est activé");
}
;
function initdata() {
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    if (login != null && password != null && ipserver != null) {
        silentauthentification(login, password, ipserver);
    } else {
        $.mobile.changePage('login.html', 'slide-up', false);
    }
}
;
function silentauthentification(login, password, ipserver) {
    $.mobile.loading('show', {
        text: 'Chargement...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    var url = "http://" + ipserver + "/mobile/authentifier";
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password},
        success: function(data) {
            $.mobile.loading('hide');
            if (data >= 0) {
                $.mobile.changePage('tachesnow.html', 'slide-up', false);
                /*if (watchID == null) {
                    initGps();
                }*/
            } else {
                window.localStorage.clear();
                $.mobile.changePage('login.html', 'slide-up', false);
            }
        },
        error: function(xhr, status, error) {
            $.mobile.loading('hide');
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
            //$.mobile.changePage($('#login'), 'slide-up', false);
        }
    });
}
;