$(document).ready(function() {
    initGps();
    initactionstache();
    initmap();
    init();
});
var watchID = null;
var marker;
var g_Map;
var origine;
var map;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function init() {
    $("#googlemapsjs1").hide();
    $("#licacheriteneraire").hide();
    $("#lichercheriteneraire").show();
    $('#directions').hide();
    var idtache = window.localStorage.getItem("idtache");
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

}
;
function initmap() {
    g_Map = $('#googlemapsjs1');
    directionsDisplay = new google.maps.DirectionsRenderer();
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
                /*if (status === 'OK') {
                    //navigator.tts.speak(result.routes[0].legs[0].start_address);  
                    $('#directions').show();
                } else {
                    $('#directions').hide();
                }*/
            });

        }
    }


}
;
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
;
// onError Callback receives a PositionError object
//
function onErrorNetworGps(error) {
    //rien à faire
}
;
function initactionstache() {
    //startchat
    $("#startchat").click(function() {
        $.mobile.changePage('chat.html', 'flip', false);
    });
    
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
        $("#licacheriteneraire").hide();
        $("#lichercheriteneraire").show();
        $('#directions').hide();
    });
    //chercheriteneraire    
    $("#chercheriteneraire").click(function() {
        $("#googlemapsjs1").show();
        $("#lichercheriteneraire").hide();
        $("#licacheriteneraire").show();
        var myLatLng = window.localStorage.getItem("myLatLng");
        /*if (typeof map == 'undefined') {
            map = $('#googlemapsjs1').gmap({'center': myLatLng, 'zoom': 10, 'callback': function() {
                }});
        }*/
        //alert('origine : ' + myLatLng + ' <----> destination : ' + window.localStorage.getItem("latLng"));
        origine_tab = myLatLng.split(",");
        destination_tab = window.localStorage.getItem("latLng").split(",");
        var origine = new google.maps.LatLng(origine_tab[0], origine_tab[1]);
        var destination = new google.maps.LatLng(destination_tab[0], destination_tab[1]);
        $('#googlemapsjs1').gmap('refresh');
        /*directionsDisplay.setMap(map);
        var request = {
            origin:origine,
            destination:destination,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
            }
          });*/
        $('#googlemapsjs1').gmap('displayDirections', {'origin': origine, 'destination': destination, 'travelMode': google.maps.DirectionsTravelMode.DRIVING}, {'panel': document.getElementById('directions')}, function(result, status) {
            //alert('status = ' + status);
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
