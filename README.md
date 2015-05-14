# glyphToDataUri
bridge between glyphicons and google maps

Since google mpas accept only images and simple paths as markers, one should not be able to use glyphicons on a google maps implementation.
Google maps markers images can find their source in images url and in complete innline URIs.

Therefore generating a URI from a glyph allow as follows

    
    var self = this,
        latitude, longitude, myMarker, markerSource, marker;

    longitude = mapItem.longitude;
    latitude = mapItem.latitude;
    markerSource = mapItem.ImgSrc || this.defaultMarker.ImgSrc;

    if (typeof longitude !== 'undefined' && typeof latitude !== 'undefined') {
        myMarker = {
            position: new google.maps.LatLng(latitude, longitude),
            map: this.gmObject
        };
        if (typeof markerSource !== 'string') {
            if (mapItem.glyph && true) {
                markerSource = glyphToDataUri(mapItem.glyph, mapItem.color);
            }
        }
        if (typeof markerSource === 'string'){
            myMarker.icon = {
                url: markerSource,
                scaledSize: new google.maps.Size(24, 24)
            };
        }
        marker = new google.maps.Marker(myMarker);
        self.attachInfo(mapItem, marker);
        self.currentMarker = marker;
        return marker;
    }