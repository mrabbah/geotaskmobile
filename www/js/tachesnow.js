$(document).ready(function() {
    //initvoirtache();
    chargerMesTaches();
});
$(document).on("pageshow", function(event) {
    initvoirtache();
});
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
//            printJson(data);
            var list = $("#listMesTaches").listview();
            $(list).empty();
            $.each(data, function(key, value) {
                compteur++;
                $(list).append('<li data-role="list-divider">'+value.dateDebutPrevue+'<span class="ui-li-count">'+value.horaire+'</span></li><li><a class="viewtache" id="'+value.idtache+'" href="javascript:void(0)"><h2>'+value.nom+'</h2><p><strong>'+value.description+'</strong></p><p>'+value.adresse+'</p><p class="ui-li-aside"><strong>'+value.gsm+'</strong></p></a></li>');                
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
};
function initvoirtache() {

    $("ul").on('click', '.viewtache', function() {
        window.localStorage.setItem("idtache", $(this).attr("id"));
        $.mobile.changePage('tache.html', 'slide-up', false);
    });
}
;