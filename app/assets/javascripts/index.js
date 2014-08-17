$(function() {

    var latitude = 41.8337329;
    var longitude = -87.7321555;

    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 12
    };

    
    var chartData;
    var dates = ["2014-08-10", "2014-08-11", "2014-08-12", "2014-08-13", "2014-08-14", "2014-08-15"];        

    convertToX = function(date) {
        return dates.indexOf(date);
    }

    resetChart = function(numDates) {
        chartData = [];
        for (var i = 0; i < numDates; i++) {
            chartData.push({ x: i, report: 0, patch: 0 });
        }
    }

    insertData = function(hole, data) {
        completeX = convertToX(hole.completion_date);
        createdX = convertToX(hole.creation_date);
        var numComplete = 0;
        var numCreate = 0;
        if (completeX > -1 && completeX < dates.length) {
            numComplete = ++data[completeX].patch;
        } 
        if (createdX > -1 && createdX < dates.length) {
            numCreate = ++data[createdX].report;
        }
        return [numCreate, numComplete]; 
    }


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
            infowindow.setContent(results[0].formatted_address);
            infowindow.setPosition(event.latLng);
            infowindow.open(map);
        });
    };

    $.ajax({
        url: "/potholes.json",
        success: function(data) {
            resetChart(dates.length);
            var yMax = 0; 
            var y2Max = 0;
            for (var i = 0; i < data.length; i++) {
                var counts = insertData(data[i], chartData);
                yMax = Math.max(yMax, counts[0]);
                y2Max = Math.max(y2Max, counts[1]);
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
            angular.element(document.getElementById('chart')).scope().$apply(function(scope){
                scope.options.axes.labelFunction = function(value) { return dates[value] };
                scope.options.axes.y.max = Math.max(yMax, y2Max);
                scope.options.axes.y2.max = Math.max(yMax, y2Max);
                scope.data = chartData;
            });
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
