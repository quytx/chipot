function initialize(mapOptions) {
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    var searchBox = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(searchBox);

    return map;
}


function newMarker(map, lat, lon, title) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
        title: title
    });
    return marker;
}

