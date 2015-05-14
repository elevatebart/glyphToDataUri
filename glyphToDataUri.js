/**
 * Created by bledoux on 5/14/2015.
 */

(function(){
    "use strict";
    var glyphPathsLoaded = false,
        glyphPrefix = "glyphicons-";

    function get(url){
        var xmlhttp, promise = {}, asCallbacks = [], i;
        promise.callback = function(fun){
            asCallbacks.push(fun);
            return promise;
        };
        if (window.XMLHttpRequest){
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }else{// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                for(i=0;asCallbacks.length;i++) {
                    asCallbacks[i](xmlhttp.responseText);
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        return promise;
    }

    window.loadGlyphiconsSvgs = function(svgUrl){
        //Load the glyphicons paths
        if (!glyphPathsLoaded) {
            get(svgUrl).callback(function(data) {
                var div = document.createElement("div");
                div.style.position = 'absolute';
                div.style.top = '-99999px';
                data = data.replace("id=\"", "id=\"" + glyphPrefix);
                div.innerHTML = data;
                document.body.appendChild(div);
                ed.maps.Google.glyphPathsLoaded = true;
            });
        }
    };
});