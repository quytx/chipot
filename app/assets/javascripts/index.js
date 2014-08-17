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
    var marker = "";
    var unfilled_markers = [];
    var filled_markers = [];
    var geocoder = new google.maps.Geocoder();

    function makeInfoWindowEvent(map, infowindow, contentString, marker) {
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
    };

    function makeReportEvent(map, infowindow, event) {
        var lat = parseFloat(event.latLng.lat());
        var lng = parseFloat(event.latLng.lng());
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            var address = String("'"+results[0].formatted_address+"'");
            console.log(address);
            var dropDownForm = "<form id='reportSubmit'>\
                                    <input type='hidden' name='latitude' value=" + lat + ">\
                                    <input type='hidden' name='longitude' value=" + lng + ">\
                                    <input type='hidden' name='address' value=" + address + ">\
                                    <select name='attribute'>\
                                      <option value='CURB'>Curb Lane</option>\
                                      <option value='CROSS'>Crosswalk</option>\
                                      <option value='INTERSEC'>Intersection</option>\
                                      <option value='TRAFFIC'>Traffic Lane</option>\
                                    </select><br>\
                                    <input type='submit' value='Submit'>\
                                </form>"
            infowindow.setContent("Submit a pothole report!" + dropDownForm);
            infowindow.setPosition(event.latLng);
            infowindow.open(map);
        });
    };

    $('#map-canvas').on('submit', '#reportSubmit', function(event) {
        event.preventDefault();
        var form = $(this).serializeArray();

        $.post("/submitReport", form, function(response){
            console.log(response);
        })
            
    })

    $.ajax({
        url: "/potholes.json",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].completion_date === null) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                        map: map,
                        icon: '/assets/red_MarkerA.png',
                        optimized: false
                    });
                    makeInfoWindowEvent(map, infowindow, "Reported on: " + data[i].creation_date + "<br>" + "Street Address: " + data[i].street_address, marker);
                    unfilled_markers.push(marker);
                } else {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                        map: map,
                        icon: '/assets/green_MarkerA.png',
                        optimized: false
                    });
                    makeInfoWindowEvent(map, infowindow, "Reported on: " + data[i].creation_date + "<br>" + "Completed Date: " + data[i].completion_date + "<br>" + "Street Address: " + data[i].street_address, marker);
                    filled_markers.push(marker);
                }
            }
        },
        dataType: "json"
    });

    $(document).ajaxSuccess(function() {});

    google.maps.event.addListener(map, 'click', function(event) {
        infowindow.close();
        makeReportEvent(map, infowindow, event);
    });



    $("#filled").on('click', function() {
        if ($("#filled").prop("checked")) {
            for (var i = 0; i < filled_markers.length; ++i) {
                filled_markers[i].setVisible(false);
            }
        } else {
            for (var i = 0; i < filled_markers.length; ++i) {
                filled_markers[i].setVisible(true);
            }
        }

    });

    function search(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        var target = document.getElementById('pac-input');
        if (code == 13) { //Enter keycode
            e.preventDefault();
            geocoder.geocode({
                    'address': target.value
                },
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var loc = results[0].geometry.location;
                        map.setZoom(17);
                        map.panTo(new google.maps.LatLng(loc.lat(), loc.lng()));
                    } else {
                        alert("Not found: " + status);
                    }
                }
            );

        }
    };

    $("#pac-input").bind("keypress", {}, search);

});
