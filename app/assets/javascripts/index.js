$(function() {

    var latitude = 41.8337329;
    var longitude = -87.7321555;

    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 12
    };

    var map = initialize(mapOptions);

    var marker1 = newMarker(map, latitude, longitude, "Quy's Home");
    var marker2 = newMarker(map, latitude + 1, longitude - 1, "Quy's Home");
    var marker3 = newMarker(map, latitude + 2, longitude - 1, "Quy's Home");
});