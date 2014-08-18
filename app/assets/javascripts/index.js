$(function() {

    var latitude = 41.881487;
    var longitude = -87.631219;

    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 12
    };


    var chartData;
    var dates;        

    convertToX = function(date, dates) {
        return dates.indexOf(date);
    }

    resetChart = function(numDates) {
        chartData = [];
        for (var i = 0; i < numDates; i++) {
            chartData.push({ x: i, report: 0, patch: 0 });
        }
    }

    insertData = function(hole, data, dates) {
        completeX = convertToX(hole.completion_date, dates);
        createdX = convertToX(hole.creation_date, dates);
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

    function clearMarkers() {
      for (var i = 0; i < unfilled_markers.length; i++) {
        unfilled_markers[i].setMap(null);
      }
      for (var i = 0; i < filled_markers.length; i++) {
        filled_markers[i].setMap(null);
      }
    }

    function makeReportEvent(map, infowindow, event) {
        var lat = parseFloat(event.latLng.lat());
        var lng = parseFloat(event.latLng.lng());
        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({
            'latLng': latlng
        }, function(results, status) {
            var address = String("'" + results[0].formatted_address + "'");
            var dropDownForm = "<h4>Submit a report for this location</h4>\
                                <form id='reportSubmit'>\
                                    <input type='hidden' name='latitude' value=" + lat + ">\
                                    <input type='hidden' name='longitude' value=" + lng + ">\
                                    <input type='hidden' name='address' value=" + address + ">\
                                    <label for='attribute'>Where is the pothole located? </label>\
                                    <select name='attribute'>\
                                      <option value='CURB'>Curb Lane</option>\
                                      <option value='CROSS'>Crosswalk</option>\
                                      <option value='INTERSEC'>Intersection</option>\
                                      <option value='TRAFFIC'>Traffic Lane</option>\
                                    </select>\
                                    <br>\
                                    <br><input type='submit' value='Submit'>\
                                </form>"
            infowindow.setContent(dropDownForm);
            infowindow.setPosition(event.latLng);
            infowindow.open(map);
        });
    };

    $('#map-canvas').on('submit', '#reportSubmit', function(event) {
        event.preventDefault();
        var form = $(this).serializeArray();

        $.post('/submitReport', form, function(data, textStatus, xhr) {
            if (xhr.status === 200) {
                infowindow.setContent("Your request has been submitted");
                setTimeout(function() {
                    infowindow.close();
                }, 3000);
            } else {
                infowindow.setContent("Unable to process your request");
                setTimeout(function() {
                    infowindow.close();
                }, 4000);
            }
        }, 'json');

    });

    getDatesBetween = function(startDate, endDate) {
        var start = new Date(startDate);
        var end = new Date(endDate);
        var between = [];
        while (start <= end) {
            start.setDate(start.getDate() + 1);
            between.push(new Date(start));
        }

        return between.map(function(date){ 
            return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        });
    }

    getPotholesByDate = function(startDate, endDate) {
        var dates = getDatesBetween(startDate, endDate);

        $.ajax({
        url: "/potholes.json",
        data: {all_dates: dates},
        success: function(data) {
            if (data == null || data.length == 0) {
                alert("There is no data for this period. Please choose another date");
            } else {
                clearMarkers();
                resetChart(dates.length);
                var yMax = 0;
                var y2Max = 0;
                for (var i = 0; i < data.length; i++) {
                    var counts = insertData(data[i], chartData, dates);
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
                    scope.dates = dates.map(function(date){
                        return date.substring(5, 10);
                    });
                    scope.options.axes.y.max = Math.max(yMax, y2Max);
                    scope.options.axes.y2.max = Math.max(yMax, y2Max);
                    scope.data = chartData;
                });
            }    
        },
        dataType: "json"
    });
    }

    
    $(document).ajaxSuccess(function() {});

    google.maps.event.addListener(map, 'click', function(event) {
        infowindow.close();
        makeReportEvent(map, infowindow, event);
    });

    $("#date-pick").on('submit', function(event){
        event.preventDefault();
        getPotholesByDate($('#start-date').val(), $('#end-date').val());
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
