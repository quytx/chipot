$(function() {

    var latitude = 41.8337329;
    var longitude = -87.7321555;

    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 12
    };

    var map = initialize(mapOptions);

    $.ajax({
      url: "/potholes.json",
      success: function(data) {
        for (var i = 0; i < data.length; i++) {
            newMarker(map, data[i].latitude, data[i].longitude, "");
        }
      },
      dataType: "json"
    });
});