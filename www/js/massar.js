$(document).ready(function() {

    $.mobile.loading('show', {
        text: 'Chargement...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    document.addEventListener("deviceready", onDeviceReady, false);

    $.mobile.loading('hide');
});

(function shortPullPagePullImplementation($) {
    "use strict";
    var pullDownGeneratedCount = 0,
    pullUpGeneratedCount = 0,
    listSelector = "div.short-pull-demo-page ul.ui-listview",
    lastItemSelector = listSelector + " > li:last-child";

    function gotPullDownData(event, data) {
        var i,
                newContent = "";
        for (i = 0; i < 3; i += 1) {
            newContent = "<li>Pulldown-generated row lkjlk lkj lkjlkj lkmlk jmkljmlkj mlkjmlkjm lkjmlk mlkjmlkjm " + (++pullDownGeneratedCount) + "</li>" + newContent;
        }
        $(listSelector).prepend(newContent).listview("refresh");
        //data.iscrollview("option", {hScroll: true});
        data.iscrollview.refresh();
    }

    function onPullDown(event, data) {
        setTimeout(function fakeRetrieveDataTimeout() {
            gotPullDownData(event, data);
        },
                1500);
    }

    $(document).delegate("div.short-pull-demo-page", "pageinit",
            function bindShortPullPagePullCallbacks(event) {
                $(".iscroll-wrapper", this).bind({
                    iscroll_onpulldown: onPullDown
                });
            });

}(jQuery));

var watchID = null;
var marker;
var g_Map;
var origine;
var map;
var notificationService;

function onDeviceReady() {
    $.mobile.loading('show', {
        text: 'Chargement des données...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    checkConnection();
    checkGps();
    initdata();
    initauthentification();
    //initspeech();
    initchargementequipe();
    initchargementcontact();
    initchargementmestaches();
    initchargementtachesaffectes();
    initvoirtache();
    initvoircontact();
    initvoirmembre();
    initactionstache();
    initmap();
    $.mobile.loading('hide');
}
;
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
function settingConfigFail(message) {
//    alert("fail set config: " + message);
}

function displayError(message) {
//    alert("starting service fail : " + message);
    //alert("We have an error to service : " + data.ErrorMessage);
}
;
function displayResult(message) {
//    alert("starting service success : " + message);
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
        $.mobile.changePage($('#login'), 'slide-up', false);
    }
}
;
function initauthentification() {
    $("#formlogin").submit(function(event) {
        $.mobile.loading('show', {
            text: 'Authentification...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        event.preventDefault();
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
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password},
        success: function(data) {
            if (data >= 0) {
                window.localStorage.setItem("iduser", data);
                window.localStorage.setItem("login", login);
                window.localStorage.setItem("password", password);
                window.localStorage.setItem("ipserver", ipserver);
                lunchNotificationService();
                chargerMesTaches();
                $.mobile.changePage($('#accueil'), 'slide-up', false);
                if (watchID == null) {
                    initGps();
                }
            } else {
                alert('Login et/ou mot de passe incorrect(s)');
                $.mobile.changePage($('#login'), 'slide-up', false);
            }
        },
        error: function(xhr, status, error) {

            //var err = eval("(" + xhr.responseText + ")");
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
            $.mobile.changePage($('#login'), 'slide-up', false);
        }
    });
}
;
function silentauthentification(login, password, ipserver) {
    var url = "http://" + ipserver + "/mobile/authentifier";
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password},
        success: function(data) {
            if (data >= 0) {
                lunchNotificationService();
                chargerMesTaches();
                $.mobile.changePage($('#accueil'), 'slide-up', false);
                if (watchID == null) {
                    initGps();
                }
            } else {
                window.localStorage.clear();
                $.mobile.changePage($('#login'), 'slide-up', false);
            }
        },
        error: function(xhr, status, error) {
            alert("Erreur lors de la connexion, veillez réesayer ultérieurement");
            $.mobile.changePage($('#login'), 'slide-up', false);
        }
    });
}
;
function initchargementcontact() {
    $(".contacts").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });

        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var url = "http://" + ipserver + "/mobile/listContacts";

        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser},
            dataType: 'json',
            success: function(data) {
                var list = $("#listContacts").listview();
                $(list).empty();
                $.each(data, function(key, value) {
                    $(list).append('<li data-theme=""> <a href="#contact" id="' + value.id + '" class="viewcontact" data-transition="slide">' + value.nom + ' ' + value.societe + '<span class="ui-li-count">' + value.gsm + '</span></a></li>');
                });
                $(list).listview("refresh");
                $.mobile.loading('hide');
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Error !: " + "Problème connexion réseaux");
            }
        });
    });
}
;
function initchargementequipe() {
    $(".equipe").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });

        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var url = "http://" + ipserver + "/mobile/listUsers";

        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser},
            dataType: 'json',
            success: function(data) {
                var list = $("#listMembres").listview();
                $(list).empty();
                $.each(data, function(key, value) {
                    $(list).append('<li data-theme=""> <a href="#membre" id="' + value.id + '" class="viewmembre" data-transition="slide">' + value.nom + ' ' + value.prenom + '<span class="ui-li-count">' + value.gsm + '</span></a></li>');
                });
                $(list).listview("refresh");
                $.mobile.loading('hide');
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Error !: " + "Problème connexion réseaux");
            }
        });
    });
}
;

function initchargementtachesaffectes() {
    $(".taches").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });

        chargerTachesAffectees();
    });
}
;
function initchargementmestaches() {
    $(".accueil").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });

        chargerMesTaches();
    });
}
;
function chargerMesTaches() {
    $.mobile.loading('show', {
        text: 'Chargement des données...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var url = "http://" + ipserver + "/mobile/mesTaches";
    //alert('call mesTaches ' + login + ' ' + password + ' ' + iduser + ' ' + url);
    var compteur = 0;
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password, iduser: iduser},
        dataType: 'json',
        success: function(data) {
            var list = $("#listMesTaches").listview();
            $(list).empty();
            $.each(data, function(key, value) {
                compteur++;
                if (value.tache.priorite == 'NORMALE') {
                    $(list).append('<li data-theme=""> <a href="#tache" id="' + value.tache.id + '" class="viewtache" data-transition="slide">' + value.tache.description + '<span class="ui-li-count">' + value.tache.priorite + '</span></a></li>');
                } else if (value.tache.priorite == 'IMPORTANTE') {
                    $(list).append('<li data-theme="b"> <a href="#tache" id="' + value.tache.id + '" class="viewtache" data-transition="slide">' + value.tache.description + '<span class="ui-li-count">' + value.tache.priorite + '</span></a></li>');
                } else {
                    $(list).append('<li data-theme="e"> <a href="#tache" id="' + value.tache.id + '" class="viewtache" data-transition="slide">' + value.tache.description + '<span class="ui-li-count">' + value.tache.priorite + '</span></a></li>');
                }
            });
            $(list).listview("refresh");
            if (compteur > 0) {
                $("#mestachesdiv").show();
                $("#mestachesmessagediv").hide();
            } else {
                $("#mestachesmessagediv").show();
                $("#mestachesdiv").hide();
            }
            $.mobile.loading('hide');
        },
        error: function(msg) {
            $.mobile.loading('hide');
            alert("Erreur !: " + "Problème connexion réseaux ");
        }
    });
}
function chargerTachesAffectees() {
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var url = "http://" + ipserver + "/mobile/mesTachesAffectees";
    var compteur = 0;
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password, iduser: iduser},
        dataType: 'json',
        success: function(data) {
            var list = $("#listeTachesAffectees").listview();
            $(list).empty();
            $.each(data, function(key, value) {
                compteur++;
                if (value.priorite == 'NORMALE') {
                    $(list).append('<li data-theme=""> <a href="#tache" id="' + value.id + '" class="viewtache" data-transition="slide">' + value.description + '<span class="ui-li-count">' + value.priorite + '</span></a></li>');
                } else if (value.priorite == 'IMPORTANTE') {
                    $(list).append('<li data-theme="b"> <a href="#tache" id="' + value.id + '" class="viewtache" data-transition="slide">' + value.description + '<span class="ui-li-count">' + value.priorite + '</span></a></li>');
                } else {
                    $(list).append('<li data-theme="e"> <a href="#tache" id="' + value.id + '" class="viewtache" data-transition="slide">' + value.description + '<span class="ui-li-count">' + value.priorite + '</span></a></li>');
                }

            });
            $(list).listview("refresh");
            if (compteur > 0) {
                $("#tacheaffecteesdiv").show();
                $("#tacheaffecteesmessagediv").hide();
            } else {
                $("#tacheaffecteesmessagediv").show();
                $("#tacheaffecteesdiv").hide();
            }
            $.mobile.loading('hide');
        },
        error: function(msg) {
            $.mobile.loading('hide');
            alert("Error !: " + "Problème connexion réseaux");
        }
    });
}
;
function initvoirtache() {

    $("ul").on('click', '.viewtache', function() {
        $("#googlemapsjs1").hide();
        $("#cacheriteneraire").hide();
        $("#chercheriteneraire").show();
        $('#directions').hide();
        var idtache = $(this).attr("id");
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var url = "http://" + ipserver + "/mobile/getTache";

        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache},
            dataType: 'json',
            success: function(data) {
//                alert(syntaxHighlight(data));              
                window.localStorage.setItem("idtache", data.idtache);
                window.localStorage.setItem("idcontact", data.idcontact);
                window.localStorage.setItem("latLng", data.latLng);

                $.mobile.loading('hide');
                $("#descriptiontache").html(data.description);
                //$("#prioritetache").html(data.priorite);
                //$("#statustache").html(data.status);
                //$("#datetache").html(getDate(data.status));
                $("#adressetache").html(data.adresse);
                $("#nomcontact").html(data.nom);
                $("#gsmcontact1").html(data.gsm);
                $("#gsmcontact2").html(data.gsm);
                $("#tranchehoraire").html(data.horaire);
                //$("#appelercontact").attr("href", "tel:" + data.gsm);
                window.localStorage.setItem("gsm", data.gsm);

                if (tache.status == 'EN COURS') {
                    $("#liacceptermission").show();
                    $("#lideclinermission").show();
                    $("#lideclinercourse").show();
                    $("#licomencermission").hide();
                } else if (tache.status == 'TERMINEE') {
                    $("#liacceptermission").hide();
                    $("#lideclinermission").hide();
                    $("#licomencermission").hide();
                    $("#lideclinercourse").hide();
                } else if (tache.status == 'ANULEE') {
                    $("#liacceptermission").show();
                    $("#lideclinermission").hide();
                    $("#licomencermission").show();
                } else if (tache.status == 'ARRIVE') {
                    $("#liacceptermission").hide();
                    $("#lideclinermission").show();
                    $("#licomencermission").show();
                    $("#lideclinercourse").show();
                }

            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Error !: " + "Problème connexion réseaux");
            }
        });
    });
}
;
function initvoircontact() {

    $("ul").on('click', '.viewcontact', function() {
        var idcontact = $(this).attr("id");
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var url = "http://" + ipserver + "/mobile/getContact";

        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idcontact: idcontact},
            dataType: 'json',
            success: function(data) {
                window.localStorage.setItem("idcontact", data.id);
                window.localStorage.setItem("latLng", data.latLng);
                $.mobile.loading('hide');
                $("#contactnomprenom").html(data.nom);
                $("#contactgsm").html(data.gsm);
                $("#contactadresse").html(data.adresse);
                $("#callcontactbis").attr("href", "tel:" + data.gsm);
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Error !: " + "Problème connexion réseaux");
            }
        });
    });
}
;
function initvoirmembre() {

    $("ul").on('click', '.viewmembre', function() {
        var idmembre = $(this).attr("id");
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var url = "http://" + ipserver + "/mobile/getMembre";

        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idmembre: idmembre},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                $("#membrenomprenom").html(data.nom + " " + data.prenom);
                $("#membregsm").html(data.gsm);
                $("#membreemail").html(data.email);
                $("#callmembre").attr("href", "tel:" + data.gsm);
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Error !: " + "Problème connexion réseaux");
            }
        });
    });
}
;
function initGps() {
    //chaque trois minute
    var options = {frequency: 60000, enableHighAccuracy: false, maximumAge: 600000, timeout: 30000};
    watchID = navigator.geolocation.watchPosition(onSuccessWatchGPS, onErrorWatchGPS, options);
}
;

// onSuccess Geolocation
//
function onSuccessWatchGPS(position) {


    var latLng = position.coords.latitude + ',' + position.coords.longitude;
    window.localStorage.setItem("myLatLng", latLng);

    if (typeof map != 'undefined') {
        var origine = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var idcontact = window.localStorage.getItem("idcontact");
        if (typeof idcontact != 'undefined') {
            var latLngClient = window.localStorage.getItem("latLng");
            var destination_tab = latLngClient.split(',');
            var destination = new google.maps.LatLng(destination_tab[0], destination_tab[1]);

            $('#googlemapsjs1').gmap('displayDirections', {'origin': origine, 'destination': destination, 'travelMode': google.maps.DirectionsTravelMode.DRIVING}, {'panel': document.getElementById('directions')}, function(result, status) {
                if (status === 'OK') {
                    //navigator.tts.speak(result.routes[0].legs[0].start_address);  
                    $('#directions').show();
                } else {
                    $('#directions').hide();
                }
            });

        }
    }


}

// clear the watch that was started earlier
//
//function clearWatch() {
//    if (watchID != null) {
//        navigator.geolocation.clearWatch(watchID);
//        watchID = null;
//    }
//}

function onErrorWatchGPS(error) {
    //Chercher position par internet
    navigator.geolocation.getCurrentPosition(onSuccessWatchGPS, onErrorNetworGps);
}

// onError Callback receives a PositionError object
//
function onErrorNetworGps(error) {
    //rien à faire
}
;
function initactionstache() {
    $(".correctposition").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var options = {enableHighAccuracy: true, timeout: 10000};
        navigator.geolocation.getCurrentPosition(onSuccessCorrectPositionContact, onErrorCorrectPositionContact, options);

    });

    //appelercontact
    $("#appelercontact").click(function() {
        var gsm = window.localStorage.getItem("gsm");
        window.open('tel:' + gsm, '_system');
    });
    //envoyermessage
//    $("#envoyermessage").click(function() {
////        alert('ouverture du popup');
////        $( "#ecriremessage" ).popup({ opened: function() { alert('opened') } });
////        //$( "#ecriremessage" ).popup({ overlayTheme: "a" , positionTo : "window"});
//        $("#panel1").panel( "close" );
//    });
//    cacheriteneraire
    $("#cacheriteneraire").click(function() {
        $("#googlemapsjs1").hide();
        $("#cacheriteneraire").hide();
        $("#chercheriteneraire").show();
        $('#directions').hide();
    });
    //chercheriteneraire    
    $("#chercheriteneraire").click(function() {        
        $("#googlemapsjs1").show();
        $("#chercheriteneraire").hide();
        $("#cacheriteneraire").show();
        var myLatLng = window.localStorage.getItem("myLatLng");
        if (typeof map == 'undefined') {
            map = $('#googlemapsjs1').gmap({'center': myLatLng, 'zoom': 10, 'callback': function() {
                }});
        }

        origine_tab = myLatLng.split(",");
        destination_tab = window.localStorage.getItem("latLng").split(",");
        var origine = new google.maps.LatLng(origine_tab[0], origine_tab[1]);
        var destination = new google.maps.LatLng(destination_tab[0], destination_tab[1]);
        $('#googlemapsjs1').gmap('refresh');
        $('#googlemapsjs1').gmap('displayDirections', {'origin': origine, 'destination': destination, 'travelMode': google.maps.DirectionsTravelMode.DRIVING}, {'panel': document.getElementById('directions')}, function(result, status) {
            if (status === 'OK') {
                //navigator.tts.speak(result.routes[0].legs[0].start_address);
                $('#directions').show();
            } else {
                $('#directions').hide();
            }
        });
        $("#panel1").panel("close");
    });
    $("#arriver").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });

        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/accepterTache";
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_heure = d.getHours();
        var curr_minute = d.getMinutes();
        var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;
        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache, date: date},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                $("#liacceptermission").hide();
                $("#lideclinermission").show();
                $("#licomencermission").show();
                $("#lideclinercourse").show();
                alert("Le changement a été efféctué avec succès");
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Problème lors de l'attribution de la tâche");
            }
        });
    });
    $("#declinermission").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/refuserTache";
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_heure = d.getHours();
        var curr_minute = d.getMinutes();
        var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;
        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache, date: date},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                $("#liacceptermission").hide();
                $("#lideclinermission").hide();
                $("#licomencermission").hide();
                $("#lideclinercourse").hide();
                alert("L'administration est notifiée de votre refus");
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Problème lors du refus de la tâche");
            }
        });
    });
    $("#declinercourse").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/refuserCourse";
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_heure = d.getHours();
        var curr_minute = d.getMinutes();
        var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;
        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache, date: date},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                $("#liacceptermission").hide();
                $("#lideclinermission").hide();
                $("#lideclinercourse").hide();
                $("#licomencermission").hide();
                alert("L'administration est notifiée de votre refus");
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Problème lors du refus de la tâche");
            }
        });
    });
    $("#comencermission").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/commencerTache";
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_heure = d.getHours();
        var curr_minute = d.getMinutes();
        var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;
        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache, date: date},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                alert("Félicitation vous venez de terminer votre mission");
                $("#liacceptermission").hide();
                $("#lideclinermission").hide();
                $("#licomencermission").hide();
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Problème lors du contact du serveur");
            }
        });
    });
    $("#terminermission").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/acheverTache";
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var curr_heure = d.getHours();
        var curr_minute = d.getMinutes();
        var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;
        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache, date: date},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                alert("Félicitation vous venez de terminer votre mission");
                $("#literminermission").hide();
                $("#licomencermission").hide();
                $("#lideclinermission").hide();
                $("#liacceptermission").hide();
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Problème lors du contact du serveur");
            }
        });
    });

    $("#voirmessages").click(function() {
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/getMessagesTache";

        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache},
            dataType: 'json',
            success: function(data) {
                var list = $("#listMessages").listview();
                $(list).empty();
                $.each(data, function(key, value) {
                    if (value.type == 'TEXT') {
                        $(list).append('<li data-theme="">' + value.texte + ' ' + value.dateMessage + '</li>');
                    } else if (value.type == 'VIDEO') {
                        $(list).append('<li data-theme=""><video width="320" height="240" controls><source src="http://' + ipserver + '/mobile/download?idMessage=' + value.id + '"></video></li>');
                    } else if (value.type == 'AUDIO') {
                        $(list).append('<li data-theme=""><audio controls><source src="http://' + ipserver + '/mobile/download?idMessage=' + value.id + '">Votre navigateur ne supporte pas la lecture d\'audio veillez utilisez Chrome Browser</audio></li>');
                    }
                });
                $(list).listview("refresh");
                $.mobile.loading('hide');
            },
            error: function(msg) {
                $.mobile.loading('hide');
                alert("Problème lors du contact du serveur");
            }
        });
    });
    $("#envoyeraudio").click(function() {
        navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});

    });
    $("#envoyervideo").click(function() {
        navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});

    });
    $("#envoyerimage").click(function() {
        navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
    });

    $("#envoyermessagetext").click(function() {
        $("#panelChat").panel("close");
        $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/envoyerMessage";
        var message = $("#messagetext").val();
        /*var d = new Date();
         var curr_date = d.getDate();
         var curr_month = d.getMonth() + 1; //Months are zero based
         var curr_year = d.getFullYear();
         var curr_heure = d.getHours();
         var curr_minute = d.getMinutes();
         var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;*/
        $.ajax({
            type: "POST",
            url: url,
            data: {login: login, password: password, iduser: iduser, idtache: idtache, message: message},
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                var msg = 'Votre message est bien envoyé: ';
                $("#ecriremessage").hide();
                navigator.notification.alert(msg, null, 'Sucèes!');
            },
            error: function(msg) {
                $.mobile.loading('hide');
                var message = 'Problème lors du contact du serveur :' + msg;
                $("#ecriremessage").hide();
                navigator.notification.alert(message, null, 'Problème!');
            }
        });
    });

}
;

function onSuccessCorrectPositionContact(position) {
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var idcontact = window.localStorage.getItem("idcontact");
    var url = "http://" + ipserver + "/mobile/corrigerPositionContact";
    var latLng = position.coords.latitude + ',' + position.coords.longitude;
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password, iduser: iduser, idcontact: idcontact, latLng: latLng},
        dataType: 'json',
        success: function(data) {
            $.mobile.loading('hide');
            alert("Position corrigée avec succès")
        },
        error: function(msg) {
            $.mobile.loading('hide');
            alert("Problème connexion réseau");
        }
    });
}
;
function onErrorCorrectPositionContact(error) {
    //Utiliser la position en cache
    if (error.code === PositionError.PERMISSION_DENIED) {
        alert('Erreur : PERMISSION_DENIED, utilisation de la position en cache');
    } else if (error.code === PositionError.POSITION_UNAVAILABLE) {
        alert('Erreur : POSITION_UNAVAILABLE, utilisation de la position en cache');
    } else if (error.code === PositionError.TIMEOUT) {
        alert('Erreur : TIMEOUT, utilisation de la position en cache');
    }
    //navigator.geolocation.getCurrentPosition(onSuccessCorrectPositionContact, onErrorCorrect2PositionContact);

    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var idcontact = window.localStorage.getItem("idcontact");
    var url = "http://" + ipserver + "/mobile/corrigerPositionContact";
    var latLng = window.localStorage.getItem("myLatLng");
    alert('appel de ' + url + " ltlg : " + latLng);
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password, iduser: iduser, idcontact: idcontact, latLng: latLng},
        dataType: 'json',
        success: function(data) {
            $.mobile.loading('hide');
            alert("Position corrigée avec succès")
        },
        error: function(msg) {
            $.mobile.loading('hide');
            alert("Problème connexion réseau");
        }
    });
}
;
function onErrorCorrect2PositionContact(error) {
    $.mobile.loading('hide');
    alert("Erreur obtention position actuelle");
}
;

// Called when capture operation is finished
//
function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }
}
;

// Called if something bad happens.
//
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Problème!');
}
;

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name,
            type = mediaFile.type;

    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var idtache = window.localStorage.getItem("idtache");
    var url = "http://" + ipserver + "/mobile/upload?iduser=" + iduser + "&idtache=" + idtache + "&login=" + login + "&idtache=" + password;
    ft.upload(path,
            url,
            function(result) {
                var msg = 'Message envoyé avec succès: ';
                navigator.notification.alert(msg, null, 'Sucèes!');
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                var msg = 'Erreur lors de l\'upload du ficiher: ' + error.code;
                navigator.notification.alert(msg, null, 'Problème!');
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            {fileKey: 'file', fileName: name, mimeType: type});
}
;
function checkMessages() {
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var idcontact = window.localStorage.getItem("idcontact");
    var idmessage = window.localStorage.getItem("idmessage");
    var url = "http://" + ipserver + "/mobile/getLastMessages";
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password, iduser: iduser, idcontact: idcontact, idmessage: idmessage},
        dataType: 'json',
        success: function(data) {
            var compte = 0;
            $.each(data, function(key, value) {
                compte = compte + 1;
                window.localStorage.setItem("idmessage", value.id);
                if (value.type == 'TEXT') {
                    navigator.notification.alert(
                            value.texte, // message
                            'Nouveau message'
                            );
                }

            });
            if (compte > 0) {
                navigator.notification.beep(3);
                navigator.notification.vibrate(2000);
            }
        },
        error: function(msg) {
            //alert("Problème connexion réseau");
        }
    });
}
;
function initmap() {
    g_Map = $('#googlemapsjs1');
}
;
function initspeech() {
    navigator.tts.startup(startupSpeechWin, failSpeech);
}
;
function startupSpeechWin(result) {
    // When result is equal to STARTED we are ready to play
    console.log("Result " + result);
    //TTS.STARTED==2 use this once so is answered
    if (result == 2) {
        navigator.tts.getLanguage(winSpeech, failSpeech);
        navigator.tts.speak("Bonjour");
    }
}
;
function winSpeech() {
    //alert('win');
}
;
function failSpeech() {
    //alert('fail');
}
;
function getDate(date) {
    if (date !== null) {
        date = new Date(date);
        var dayNumber = date.getDate() + "";
        var month = (date.getMonth() + 1) + "";
        if (dayNumber.length === 1) {
            dayNumber = "0" + dayNumber;
        }
        if (month.length === 1) {
            month = "0" + month;
        }
        var dateFormat = dayNumber + '-' + month + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        return dateFormat;
    }
    else {
        return "";
    }
}
;
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
;
