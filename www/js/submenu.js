$(document).on("pageshow", function(event) {
    initsubmenuaction();    
});

function initsubmenuaction() {
    $(".taches").click(function() {
        $.mobile.changePage('tachesaffectees.html', 'slide-up', false);
    });
    $(".accueil").click(function() {
        $.mobile.changePage('tachesnow.html', 'slide-up', false);
    });
    $(".contacts").click(function() {
        $.mobile.changePage('tachesterminees.html', 'slide-up', false);
    });
    /*$(".equipe").click(function() {
        $.mobile.changePage('equipe.html', 'slide-up', false);
    }); */   
}
;

