# glyphToDataUri
This code is a bridge between glyphicons and google maps

Since google mpas accept only images and simple paths as markers, one should not be able to use glyphicons on a google maps implementation.
Google maps markers images can find their source in images url and in complete innline URIs.

Therefore generating a URI from a glyph allow if used as follows to keep the scalability and coloration of the glyphicons even on maps. 

    var mapItem = {
        longitude:22,
        lattitude:5,
        glyph:"thumbs_up",
        color:"#123456"
    };
    
    glyph.loadSvgPaths("img/glyphicons.svg").loaded(function(){
        var latitude, longitude, myMarker, markerSource, marker;
    
        longitude = mapItem.longitude;
        latitude = mapItem.latitude;
        markerSource = mapItem.ImgSrc;
    
        if (typeof longitude !== 'undefined' && typeof latitude !== 'undefined') {
            myMarker = {
                position: new google.maps.LatLng(latitude, longitude),
                map: this.gmObject
            };
            if (typeof markerSource !== 'string') {
                if (mapItem.glyph && true) {
                    markerSource = glyph.toDataUri(mapItem.glyph, mapItem.color);
                }
            }
            if (typeof markerSource === 'string'){
                myMarker.icon = {
                    url: markerSource,
                    scaledSize: new google.maps.Size(24, 24)
                };
            }
            marker = new google.maps.Marker(myMarker);
            return marker;
        }
    });
