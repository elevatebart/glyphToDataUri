/**
 * Created by bledoux on 5/14/2015.
 */

var glyph = glyph || {};

(function () {
    "use strict";

    var glyphPathsLoaded = false,
        hasBBoxCapacity = false,
        glyphPrefix = "glyphicons-",
        glyphPathsURI = {};

    //Simplify the Ajax Call
    function get(url) {
        var xmlhttp, promise = {}, asCallbacks = [], i;
        promise.next = function (fun) {
            asCallbacks.push(fun);
            return promise;
        };
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                for (i = 0; i < asCallbacks.length; i++) {
                    asCallbacks[i](xmlhttp.responseText);
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        return promise;
    }

    glyph.loadSvgPaths = function (svgUrl) {
        var promise = {}, callback;
        promise.loaded = function (fun) {
            if (!glyphPathsLoaded) {
                callback = fun;
            } else {
                fun();
            }
            return promise;
        };

        //Load the glyphicons paths
        if (!glyphPathsLoaded) {
            get(svgUrl).next(function (data) {
                var div = document.createElement("div"), i;
                div.style.position = 'absolute';
                div.style.top = '-99999px';
                data = data.replace(/ id="/g, ' id=\"' + glyphPrefix);
                div.innerHTML = data;
                document.body.appendChild(div);
                //Check if what we need is available
                for (i = 0; i < div.childNodes.length; i++) {
                    if (div.childNodes[i].nodeName === "svg") {
                        if (typeof div.childNodes[i].getBBox === "function") {
                            hasBBoxCapacity = true;
                        }
                        break;
                    }
                }

                glyphPathsLoaded = true;
                callback();
            });
        }
        return promise;
    };

    glyph.enabled = function () {
        return glyphPathsLoaded && hasBBoxCapacity;
    };

    glyph.toDataUri = function (glyphId, color, options) {
        if (!(glyphPathsLoaded && hasBBoxCapacity)) {
            if (console) {
                console.error("glyph.loadSvgPaths has to be finished before calling toDataUri");
            }
            return false;
        }
        options = options || {};
        var width = options.width || 24,
            height = options.height || 24;

        //check if cache has the value
        if (glyphPathsURI[glyphId] && glyphPathsURI[glyphId][color]) {
            return glyphPathsURI[glyphId][color];
        }
        var outer = document.createElement("div");

        //beacuse some icons are weirdly named
        glyphId = glyphPrefix + glyphId.replace("_", "_x5F_");
        var glyphObject = document.getElementById(glyphId);
        if (glyphObject === null) {
            glyphObject = document.getElementById(glyphId + "_1_");
        }

        if (glyphObject === null) {
            glyphObject = document.getElementById(glyphId + "_2_");
        }
        //hack ends

        if (glyphObject === null) {
            return false;
        }

        var glyphClone = glyphObject.cloneNode(true);

        var box = glyphObject.getBBox();

        glyphClone.setAttribute('fill', color);

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.appendChild(glyphClone);

        svg.setAttribute("version", "1.1");
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");

        svg.setAttribute("width", (width * 2).toString());
        svg.setAttribute("height", (height * 2).toString());
        svg.setAttribute("viewBox", box.x + " " + box.y + " " + width + " " + height);

        outer.appendChild(svg);

        var uri = 'data:image/svg+xml;base64,' + window.btoa(outer.innerHTML);

        //cache it
        glyphPathsURI[glyphId] = glyphPathsURI[glyphId] || {};
        glyphPathsURI[glyphId][color] = uri;

        //return calculated uri
        return uri;
    };
})();