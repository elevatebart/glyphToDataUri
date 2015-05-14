/**
 * Created by bledoux on 5/14/2015.
 */

(function(){
    "use strict";

    var glyphPathsLoaded = false,
        glyphPrefix = "glyphicons-",
        glyphPathsURI = {};

    function get(url){
        var xmlhttp, promise = {}, asCallbacks = [], i;
        promise.next = function(fun){
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

    window.loadGlyphiconsSvgPaths = function(svgUrl){
        var promise = {}, asCallbacks = [], i;
        promise.next = function(fun){
            asCallbacks.push(fun);
            return promise;
        };

        //Load the glyphicons paths
        if (!glyphPathsLoaded) {
            get(svgUrl).next(function(data) {
                var div = document.createElement("div");
                div.style.position = 'absolute';
                div.style.top = '-99999px';
                data = data.replace("id=\"", "id=\"" + glyphPrefix);
                div.innerHTML = data;
                document.body.appendChild(div);
                glyphPathsLoaded = true;
                for(i=0;asCallbacks.length;i++) {
                    asCallbacks[i]();
                }
            });
        }
        return promise;
    };

    window.glyphToDataUri = function(glyphId, color) {
        //check if cache has the value
        if(glyphPathsURI[glyphId] && glyphPathsURI[glyphId][color]){
            return glyphPathsURI[glyphId][color];
        }
        var outer = document.createElement("div");
        var glyphObject = document.getElementById(glyphId);

        //beacuse some icons are weirdly named
        glyphId = glyphPrefix + glyphId.replace("_", "_x5F_");
        if(glyphObject === null){
            glyphObject = document.getElementById(glyphId + "_1_");
        }

        if(glyphObject === null){
            glyphObject = document.getElementById(glyphId + "_2_");
        }
        //hack ends

        if(glyphObject === null){
            return false;
        }

        var glyphClone = glyphObject.cloneNode(true);

        var box = glyphObject.getBBox();

        glyphClone.setAttribute('fill', color);

        var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.appendChild(glyphClone);

        svg.setAttribute("version", "1.1");
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");

        svg.setAttribute("width", "48");
        svg.setAttribute("height", "48");
        svg.setAttribute("viewBox", box.x + " " + box.y + " 24 24");

        outer.appendChild(svg);

        var uri = 'data:image/svg+xml;base64,' + window.btoa(outer.innerHTML);

        //cache it
        glyphPathsURI[glyphId] = glyphPathsURI[glyphId] || {};
        glyphPathsURI[glyphId][color] = uri;

        //return calculated uri
        return uri;
    }
});