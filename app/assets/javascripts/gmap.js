var map;
var eventsURL;

function gmapDragEnd(){
  var latitude = parseInt(map.getCenter().lat() * 10000) / 10000;
  var longitude = parseInt(map.getCenter().lng() * 10000) / 10000;

  $('[name="map_filter_form[latitude]"]').val( latitude );
  $('[name="map_filter_form[longitude]"]').val( longitude );

  filterUpdate();
}

function filterUpdate(){
  // Save Form, apart from dates.
  
  // Update the KML files
  var keys = $(".new_map_filter_form .form-control").serialize();

  loadKmlLayer(eventsURL + "?" + keys);
}

function initGMap() {
  var latitude = 51.5074;
  var longitude = 0.1278;

  var gmapElm = document.getElementById('gmap');
  map = new google.maps.Map(gmapElm, {
    center: {lat: latitude, lng: longitude},
    zoom: 10
  });

  eventsURL = gmapElm.attributes["data-kml-url"].value;

  map.addListener('dragend', gmapDragEnd);

  filterUpdate();
}

function loadKmlLayer(src) {
  var kmlLayer = new google.maps.KmlLayer(src, {
    suppressInfoWindows: false,
    preserveViewport: true,
    map: map
  });
}
