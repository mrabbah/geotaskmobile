$(document).ready(function() {
    initactionschat();
    chargerMessages(0);
});
$(document).on("pageshow", function(event) {
    $("#panelChat").panel("open");
    $(".iscroll-wrapper").iscrollview("refresh");
    /*$( "#dialogImage" ).on({
        popupbeforeposition: function() {
            var maxHeight = $( window ).height() - 60 + "px";
            $( "#dialogImage img" ).css( "max-height", maxHeight );
        }
    });*/
});
function chargerMessages(offset) {    
    var login = window.localStorage.getItem("login");
    var password = window.localStorage.getItem("password");
    var ipserver = window.localStorage.getItem("ipserver");
    var iduser = window.localStorage.getItem("iduser");
    var idtache = window.localStorage.getItem("idtache");
    
    var url = "http://" + ipserver + "/mobile/getMessagesTache";
    $.mobile.loading('show', {
        text: 'Chargement...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    $.ajax({
        type: "POST",
        url: url,
        data: {login: login, password: password, iduser: iduser, idtache: idtache, offset : offset},
        dataType: 'json',
        success: function(data) {            
            var list = $("#listMessages").listview();
            //$(list).empty();            
            $.each(data, function(key, value) {                
                if (value.type == 'TEXT') {
                    $(list).prepend('<li data-role="list-divider">'+value.utilisateur+'<span class="ui-li-count">'+value.dateMessage+'</span></li><li><a href="javascript:void(0)"><p><strong>'+value.texte+'</strong></p><p class="ui-li-aside"><strong>'+value.heureMessage+'</strong></p></a></li>');
                } else if (value.type == 'VIDEO') {
                    checkFileExiste(value.id, value.filename);                                                      
                    //var url = 'http://' + ipserver + '/mobile/download?idMessage=' + value.id ;
                    //$(list).prepend('<li data-role="list-divider">'+value.utilisateur+'<span class="ui-li-count">'+value.dateMessage+'</span></li><li><a onclick="window.open(\''+ url +'\', \'_system\');" href="javascript:void(0)"><p><strong>VIDEO (Cliquer pour visualiser)</strong></p><p class="ui-li-aside"><strong>'+value.heureMessage+'</strong></p></a></li>');
                    $(list).prepend('<li data-role="list-divider">'+value.utilisateur+'<span class="ui-li-count">'+value.dateMessage+'</span></li><li><a href="javascript:void(0)" class="showVideo" id="'+ value.id +'" filename="'+ value.filename+'"><p><strong>Vidéo (Appuie durant quelques seconds pour afficher)</strong></p><p class="ui-li-aside"><strong>'+value.heureMessage+'</strong></p></a></li>');
                } else if (value.type == 'AUDIO') {
                    checkFileExiste(value.id, value.filename);
                    $(list).prepend('<li data-role="list-divider">'+value.utilisateur+'<span class="ui-li-count">'+value.dateMessage+'</span></li><li><a href="javascript:void(0)" id="'+ value.id +'" class="playAudio" filename="'+ value.filename+'"><p><strong>AUDIO (Appuie durant quelques seconds pour lire)</strong></p><p class="ui-li-aside"><strong>'+value.heureMessage+'</strong></p></a></li>');
                } else if (value.type == 'IMAGE') {
                    checkFileExiste(value.id, value.filename);
                    //var url = 'http://' + ipserver + '/mobile/download?idMessage=' + value.id ;
                    //$(list).prepend('<li data-role="list-divider">'+value.utilisateur+'<span class="ui-li-count">'+value.dateMessage+'</span></li><li><a href="javascript:void(0)" ><p><img src="' + url + '" widht="100px" height="100px" alt="IMAGE..."/></p><p class="ui-li-aside"><strong>'+value.heureMessage+'</strong>PM</p></a></li>');                    
                    $(list).prepend('<li data-role="list-divider">'+value.utilisateur+'<span class="ui-li-count">'+value.dateMessage+'</span></li><li><a href="javascript:void(0)" class="showImage" id="'+ value.id + '" filename="'+ value.filename+'"><p><strong>Image (Appuie durant quelques seconds pour zoomer)</strong></p><p class="ui-li-aside"><strong>'+value.heureMessage+'</strong></p></a></li>');
                } else if (value.type == 'BINAIRE') {
                    //checkFileExiste(value.id, value.filename);
                    var url = 'http://' + ipserver + '/mobile/download?idMessage=' + value.id ;
                    $(list).prepend('<li data-role="list-divider">'+value.utilisateur+'<span class="ui-li-count">'+value.dateMessage+'</span></li><li><a onclick="window.open(\''+ url +'\', \'_system\');" href="javascript:void(0)"><p><strong>Fichier binaire (Cliquer pour télécharger)</strong></p><p class="ui-li-aside"><strong>'+value.heureMessage+'</strong></p></a></li>');
                }
            });
            $(list).listview("refresh");
            //$(".iscroll-wrapper").iscrollview("refresh");
            $.mobile.loading('hide');
            var compteur = parseInt(offset) + 5;
            window.localStorage.setItem("offset", compteur);
        },
        error: function(msg) {
            $.mobile.loading('hide');
            alert("Problème lors du contact du serveur");
        }
    });
}
function initactionschat() {    
    $( "#dialogImage" ).on( "popupbeforeposition", function( e, data ) {
        //alert('before');
      /*delete data.x;
      delete data.y;
      data.positionTo = "window";*/
      var maxHeight = $( window ).height() - 60 + "px";

      $( "#dialogImage img" ).css( "max-height", maxHeight );
    });
    //filename
    $("ul").on('taphold', '.showVideo', function(event) {
        //$(this).attr("id")
        popupVideo($(this).attr("id"),$(this).attr("filename"));
        //event.stopPropagation();
    });
    $("ul").on('taphold', '.showImage', function(event) {
        //$(this).attr("id")
        popupImage($(this).attr("id"),$(this).attr("filename"));
        //event.stopPropagation();
    });
    $("ul").on('taphold', '.playAudio', function(event) {
        //$(this).attr("id")
        playAudio($(this).attr("id"),$(this).attr("filename"));
        //event.stopPropagation();
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
        var login = window.localStorage.getItem("login");
        var password = window.localStorage.getItem("password");
        var ipserver = window.localStorage.getItem("ipserver");
        var iduser = window.localStorage.getItem("iduser");
        var idtache = window.localStorage.getItem("idtache");
        var url = "http://" + ipserver + "/mobile/envoyerMessage";
        var message = $("#messagetext").val();
        if (message.length == 0) {
            alert('Merci de rentrer votre message dans la zone texte!');
        } else {
            $.mobile.loading('show', {
                text: 'Chargement...',
                textVisible: true,
                theme: 'z',
                html: ""
            });
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
        }
        /*var d = new Date();
         var curr_date = d.getDate();
         var curr_month = d.getMonth() + 1; //Months are zero based
         var curr_year = d.getFullYear();
         var curr_heure = d.getHours();
         var curr_minute = d.getMinutes();
         var date = curr_date + "/" + curr_month + "/" + curr_year + " " + curr_heure + ":" + curr_minute;*/
    });
}
;
(function shortPullPagePullImplementation($) {
    "use strict";
    var pullDownGeneratedCount = 0,
            pullUpGeneratedCount = 0,
            listSelector = "div.short-pull-demo-page ul.ui-listview",
            lastItemSelector = listSelector + " > li:last-child";

    function gotPullDownData(event, data) {
        /*var i,
                newContent = "";
        for (i = 0; i < 3; i += 1) {
            newContent = "<li>Pulldown-generated row lkjlk lkj lkjlkj lkmlk jmkljmlkj mlkjmlkjm lkjmlk mlkjmlkjm " + (++pullDownGeneratedCount) + "</li>" + newContent;
        }
        $(listSelector).prepend(newContent).listview("refresh");
        //data.iscrollview("option", {hScroll: true});
        data.iscrollview.refresh();*/        
    }

    function onPullDown(event, data) {
        var offset = window.localStorage.getItem("offset");
        chargerMessages(offset);
        data.iscrollview.refresh();
    }

    $(document).delegate("div.short-pull-demo-page", "pageinit",
            function bindShortPullPagePullCallbacks(event) {
                $(".iscroll-wrapper", this).bind({
                    iscroll_onpulldown: onPullDown
                });
            });

}(jQuery));

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
    //var msg = 'An error occurred during capture: ' + error.code;
    //navigator.notification.alert(msg, null, 'Problème!');
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
    $.mobile.loading('show', {
        text: 'Chargement...',
        textVisible: true,
        theme: 'z',
        html: ""
    });
    ft.upload(path,
            url,
            function(result) {
                $.mobile.loading('hide');
                var msg = 'Message envoyé avec succès: ';
                navigator.notification.alert(msg, null, 'Sucèes!');
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                $.mobile.loading('hide');
                var msg = 'Erreur lors de l\'upload du ficiher: ' + error.code;
                navigator.notification.alert(msg, null, 'Problème!');
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            {fileKey: 'file', fileName: name, mimeType: type});
            
}
;

function playAudio(idMessage, filename) {
    var store = cordova.file.dataDirectory
    var nomFichier = "" + idMessage + "-" + filename;        
    var url = store + nomFichier;  
    /*var ipserver = window.localStorage.getItem("ipserver");
    var url = 'http://' + ipserver + '/mobile/download?idMessage=' + idMessage ;*/    
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function () { console.log("playAudio():Audio Success"); },
        // error callback
        function (err) { console.log("playAudio():Audio Error: " + err); }
    );

    // Play audio
    //my_media.setVolume(1);
    my_media.play();

};

function popupImage(idMessage, filename) {
    var store = cordova.file.dataDirectory
    var nomFichier = "" + idMessage + "-" + filename;        
    var url = store + nomFichier;  
    /*var ipserver = window.localStorage.getItem("ipserver");
    var url = 'http://' + ipserver + '/mobile/download?idMessage=' + idMessage ;    */
    $("#imageZoom").attr("src", url);
    $("#dialogImage").popup({ corners: false , overlayTheme: "a", positionTo : "window", theme : "d"});
    //, transition : "flip"
    $("#dialogImage").popup( "open" );
    
};
function popupVideo(idMessage, filename) {
    var store = cordova.file.dataDirectory
    var nomFichier = "" + idMessage + "-" + filename;        
    var url = store + nomFichier;  
    /*var ipserver = window.localStorage.getItem("ipserver");
    var url = 'http://' + ipserver + '/mobile/download?idMessage=' + idMessage ;*/
    //VideoPlayer.play(url);
    $("#videoReader").attr("src", url);
    $("#popupVideo").popup({ corners: false , overlayTheme: "a", positionTo : "window", theme : "d"});
    //, transition : "flip"
    $("#popupVideo").popup( "open" );    
};
function downloadFile(idMessage, filename) {
    //alert('id=' + idMessage);
    //alert('filename = ' + filename);
    //var idMessage = window.localStorage.getItem("idMessage");
    //var filename = window.localStorage.getItem("filename");
    var ipserver = window.localStorage.getItem("ipserver");
    //alert("telechargement du fichier " + filename);
    var url = 'http://' + ipserver + '/mobile/download?idMessage=' + idMessage ;
    var fileTransfer = new FileTransfer();
    var store = cordova.file.dataDirectory
    var nomFichier = "" + idMessage + "-" + filename;
    var fullpath = store + nomFichier;
    $.mobile.loading('show', {
                text: 'Téléchargement des messages...',
                textVisible: true,
                theme: 'z',
                html: ""
            });
    fileTransfer.download(url, fullpath, 
        function(entry) {
            //alert('telechargement ok : ' + filename);
            $.mobile.loading('hide');
        }, 
        function(err) {
            //alert('erreur telechargement');
            $.mobile.loading('hide');
        });   
};

function checkFileExiste(idMessage, filename) {
    var store = cordova.file.dataDirectory
    var nomFichier = "" + idMessage + "-" + filename;    
    //alert(nomFichier);
    var fullpath = store + nomFichier;    
    window.localStorage.setItem("idMessage", idMessage);
    window.localStorage.setItem("filename", filename);
    //Check for the file. 
    //alert('verification existance fichier : ' + fullpath);
    window.resolveLocalFileSystemURL(fullpath, function(entry) {/*alert('Fichier trouver');*/}, downloadFile(idMessage, filename));
};
