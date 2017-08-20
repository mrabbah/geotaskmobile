$(document).ready(function() {           
    chargerTachesAffectees()  
});


function chargerTachesAffectees() {
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var url = "http://" + ipserver + "/mobile/mesTachesAffectees";
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
            var list = $("#listeTachesAffectees").listview();
            $(list).empty();
            $.each(data, function(key, value) {
                compteur++;
                /*if (value.priorite == 'NORMALE') {
                    $(list).append('<li data-theme=""> <a href="#tache" id="' + value.id + '" class="viewtache" data-transition="slide">' + value.description + '<span class="ui-li-count">' + value.priorite + '</span></a></li>');
                } else if (value.priorite == 'IMPORTANTE') {
                    $(list).append('<li data-theme="b"> <a href="#tache" id="' + value.id + '" class="viewtache" data-transition="slide">' + value.description + '<span class="ui-li-count">' + value.priorite + '</span></a></li>');
                } else {
                    $(list).append('<li data-theme="e"> <a href="#tache" id="' + value.id + '" class="viewtache" data-transition="slide">' + value.description + '<span class="ui-li-count">' + value.priorite + '</span></a></li>');
                }*/
                $(list).append('<li data-role="list-divider" data-theme="b">'+value.dateDebutPrevue+'<span class="ui-li-count">'+value.horaire+'</span></li><li><a class="viewtache" id="'+value.idtache+'" href="javascript:void(0)"><h2>'+value.nom+'</h2><p><strong>'+value.description+'</strong></p><p>'+value.adresse+'</p><p class="ui-li-aside"><strong>'+value.gsm+'</strong></p></a></li>');                
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
