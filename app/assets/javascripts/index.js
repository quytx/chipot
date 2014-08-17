$(function() {

    var latitude = 41.8337329;
    var longitude = -87.7321555;

    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 12
    };

    var map = initialize(mapOptions);

    // Search 
    var infowindow = new google.maps.InfoWindow();
    var markers = [];

    function makeInfoWindowEvent(map, infowindow, contentString, marker) {
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
    };

    function makeReportEvent(map, infowindow, event) {
        infowindow.setContent(event.latLng.lat()+","+event.latLng.lng());
        infowindow.setPosition(event.latLng);
        infowindow.open(map); 
    };

    $.ajax({
        url: "/potholes.json",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].completion_date == null) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                        map: map,
                        icon: '/assets/red_MarkerA.png'
                    });
                } else {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                        map: map,
                        icon: '/assets/green_MarkerA.png'
                    });

                }

                makeInfoWindowEvent(map, infowindow, "test" + i, marker);

                markers.push(marker);
            }
        },
        dataType: "json"
    });

    google.maps.event.addListener(map, 'click', function(event) {
        infowindow.close();
        makeReportEvent(map, infowindow, event);
    });

    function search(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        var target = document.getElementById('pac-input');
        var geocoder = new google.maps.Geocoder();
        if (code == 13) { //Enter keycode                        
            e.preventDefault();
            geocoder.geocode(
                {'address': target.value}, 
                function(results, status) { 
                    if (status == google.maps.GeocoderStatus.OK) { 
                        var loc = results[0].geometry.location;
                        map.setZoom(17);
                        map.panTo(new google.maps.LatLng(loc.lat(), loc.lng()));
                    } 
                    else {
                        alert("Not found: " + status); 
                    } 
                }
            );

        }
    };

    $("#pac-input").bind("keypress", {}, search);

});
