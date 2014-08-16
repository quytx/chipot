var latitude = 41.8337329;
var longitude = -87.7321555;

function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 10
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    }
google.maps.event.addDomListener(window, 'load', initialize);