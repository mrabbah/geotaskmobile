$(document).ready(function() {

    $.mobile.loading('show', {
        text: 'Chargement...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    //document.addEventListener("deviceready", onDeviceReady, false);
    //TODO
    initchargementequipe();
    initvoirmembre();
    $.mobile.loading('hide');
});
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