$(function() {

  $('#start-draw').on('click', function(e) {        
    var size = "size=" + "640x480&";        
    if (map.streetView.pano === null) {            
      alert('Please switch to Street View first!');        
    } else {        
      var pano = "pano=" + map.streetView.location.pano + "&";        
      var heading = "heading=" + map.streetView.pov.heading + "&";        
      var pitch = "pitch=" + map.streetView.pov.pitch + "&";         // var zoom = "zoom=" + map.streetView.location.pov.zoom + "&";

      var url = "http://maps.googleapis.com/maps/api/streetview?" + size + pano + heading + pitch;        
      $('#street-view-image').attr("src", url);        
      $('.metro').hide();        
      $('.draw').show();        
    }    
  });

  var sketchPad = createSketchpad();

  startDrawing(sketchPad);

  // Default lat and long for map on load
  var latitude = 41.881487;
  var longitude = -87.631219;

  // Set options for base google map
  var mapOptions = {
    center: new google.maps.LatLng(latitude, longitude),
    zoom: 12
  };

  // Set options for marker clusterer map
  var clusterOptions = {
    gridSize: 70,
    maxZoom: 14
  };

  var chartData;
  var dates;

  convertToX = function(date, dates) {
    return dates.indexOf(date);
  };

  resetChart = function(numDates) {
    chartData = [];
    for (var i = 0; i < numDates; i++) {
      chartData.push({
        x: i,
        report: 0,
        patch: 0
      });
    }
  };

  insertData = function(hole, data, dates) {
    if (hole.completion_date !== null) {
      completeX = convertToX(hole.completion_date, dates);
    }
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
  };


  var map = initialize(mapOptions);

  var mc = new MarkerClusterer(map, [], clusterOptions);





  // function MyOverlay(options) {
  //   this.setValues(options);
  //   this.markerLayer = $('<div />').addClass('overlay');
  // }

  // // MyOverlay is derived from google.maps.OverlayView
  // MyOverlay.prototype = new google.maps.OverlayView();

  // MyOverlay.prototype.onAdd = function() {
  //   var $pane = $(this.getPanes().overlayImage); // Pane 4
  //   $pane.append(this.markerLayer);
  // };

  // MyOverlay.prototype.onRemove = function() {
  //   this.markerLayer.remove();
  // };

  // MyOverlay.prototype.draw = function() {
  //   var projection = this.getProjection();
  //   var zoom = this.getMap().getZoom();
  //   var fragment = document.createDocumentFragment();

  //   this.markerLayer.empty(); // Empty any previous rendered markers

  //   // Now append the entire fragment from memory onto the DOM
  //   this.markerLayer.append(fragment);
  // };


  // var OverlayMap = new MyOverlay({
  //   map: map
  // });


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
                <form id='reportSubmit' enctype='multipart/form-data'>\
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
                  <label for='description'>Write a description of the pothole below (optional):</label>\
                  <textarea name='description' cols='40' rows='4' maxLength='500' placeholder='Description here...'></textarea>\
                  <label for='picture'>Upload an image of this pothole (optional):</label>\
                  <input type='file' name='picture'>\
                  <label for='phone'>Phone # to receive text updates about your request (optional):</label>\
                  <input type='text' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' name='phone' placeholder='###-###-####'>\
                  <br>\
                  <br><input type='submit' value='Submit'>\
                </form>"

      infowindow.setContent(dropDownForm);
      infowindow.setPosition(event.latLng);
      infowindow.open(map);
    });
  }

  $('#map-canvas').on('submit', '#reportSubmit', function(event) {
    event.preventDefault();
    infowindow.setContent("<img align='center' src='/assets/loading.gif'>");
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

    return between.map(function(date) {
      return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    });
  };

  //Using sprites
  var red = new google.maps.MarkerImage("/assets/sprite.png", new google.maps.Size(16, 16), new google.maps.Point(0, 0));
  var green = new google.maps.MarkerImage("/assets/sprite.png", new google.maps.Size(16, 16), new google.maps.Point(0, 26));

  puttingtheMarkers = function(data, dates) {
    console.log(data);
    temp = [];
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        var val = data[key];
        temp.push(val);
      }
    }
    console.log(temp);
    var merged = [];
    merged = merged.concat.apply(merged, temp);
    data = merged;
    console.log(data);

    if (data === null || data.length === 0) {
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
            // icon: '/assets/red_MarkerA.png',
            icon: red,
            optimized: true
          });
          makeInfoWindowEvent(map, infowindow, "Reported on: " + data[i].creation_date + "<br>" + "Street Address: " + data[i].street_address, marker);
          unfilled_markers.push(marker);
        } else {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
            map: map,
            // icon: '/assets/green_MarkerA.png',
            icon: green,
            optimized: true
          });
          makeInfoWindowEvent(map, infowindow, "Reported on: " + data[i].creation_date + "<br>" + "Completed Date: " + data[i].completion_date + "<br>" + "Street Address: " + data[i].street_address, marker);
          filled_markers.push(marker);
        }
      }

      mc.addMarkers(unfilled_markers.concat(filled_markers));

      angular.element(document.getElementById('chart')).scope().$apply(function(scope) {
        scope.dates = dates.map(function(date) {
          return date.substring(5, 10);
        });
        scope.options.axes.y.max = Math.max(yMax, y2Max);
        scope.options.axes.y2.max = Math.max(yMax, y2Max);
        scope.data = chartData;
      });
    }
  };



  getPotholesByDate = function(startDate, endDate) {
    var dates = getDatesBetween(startDate, endDate);
    filled_markers = [];
    unfilled_markers = [];
    mc.clearMarkers();

    $.ajax({
      url: "/potholes.json",
      data: {
        all_dates: dates
      },
      success: function(data) {
        puttingtheMarkers(data, dates);
      },
      dataType: "json"
    });
  };



  // Remove all markers from map if you zoom out too far, put them back when zoomed back in
  // google.maps.event.addListener(map, 'zoom_changed', function(){
  //   if (map.zoom < 7) {
  //     mc.clearMarkers();
  //   } else if (map.zoom >= 7 && mc.a.length === 0) {
  //     mc.addMarkers(unfilled_markers.concat(filled_markers));
  //   }
  // });

  // Open report form when map is clicked if zoomed in far enough
  // If report form is already open, close it on next map click
  google.maps.event.addListener(map, 'click', function(event) {
    if (map.zoom > 14 && infowindow.getContent()) {
      infowindow.close();
      infowindow.setContent("");
    } else if (map.zoom > 14) {
      makeReportEvent(map, infowindow, event);
    } else {
      infowindow.close();
    }
  });

  $("#date-pick").on('submit', function(event) {
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
