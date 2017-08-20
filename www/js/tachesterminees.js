$(document).ready(function() {           
    chargerTachesTerminees()  
});


function chargerTachesTerminees() {
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var url = "http://" + ipserver + "/mobile/mesTachesTerminees";
    var compteur = 0;
    $.mobile.loading('show', {
            text: 'Chargement...',
            textVisible: true,
            theme: 'z',
            html: ""
        });
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password, iduser: iduser},
        dataType: 'json',
        success: function(data) {
            var list = $("#listeTachesTerminees").listview();
            $(list).empty();
            $.each(data, function(key, value) {
                compteur++;            
                $(list).append('<li data-role="list-divider" data-theme="a">'+value.dateDebutPrevue+'<span class="ui-li-count">'+value.horaire+'</span></li><li><a class="viewtache" id="'+value.idtache+'" href="javascript:void(0)"><h2>'+value.nom+'</h2><p><strong>'+value.description+'</strong></p><p>'+value.adresse+'</p><p class="ui-li-aside"><strong>'+value.gsm+'</strong></p></a></li>');                
            });
            $(list).listview("refresh");
            if (compteur > 0) {
                $("#tachetermineesdiv").show();
                $("#tachetermineesmessagediv").hide();
            } else {
                $("#tachetermineesmessagediv").show();
                $("#tachetermineesdiv").hide();
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
