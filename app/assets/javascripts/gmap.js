var map;
var eventsURL;
var updateLatLngTimeout;

function restoreFormData(){
  $(".new_map_filter_form .form-control").each(function(){
    if( typeof(localStorage[$(this).attr("name")]) != "undefined"){
      $(this).val( localStorage[$(this).attr("name")] );
    }
  });
}
restoreFormData();

function updateLatLng(){
  var latitude = parseInt(map.getCenter().lat() * 10000) / 10000;
  var longitude = parseInt(map.getCenter().lng() * 10000) / 10000;

  $('[name="map_filter_form[latitude]"]').val( latitude );
  $('[name="map_filter_form[longitude]"]').val( longitude );

  filterUpdate();
}

function gmapDragEnd(){
  clearTimeout(updateLatLngTimeout);
  updateLatLngTimeout = setTimeout(function(){
    updateLatLng();
  }, 200);
}

function filterUpdate(){
  // Save Form, apart from dates.
  $(".new_map_filter_form .form-control").each(function(){
    localStorage[$(this).attr("name")] = $(this).val();
  });
  
  // Update the KML files
  var keys = $(".new_map_filter_form .form-control").serialize();

  console.log(eventsURL + "?" + keys);
  loadKmlLayer(eventsURL + "?" + keys);
}

function initGMap() {
  restoreFormData();

  var latitude = parseFloat( $('[name="map_filter_form[latitude]"]').val() );
  var longitude = parseFloat( $('[name="map_filter_form[longitude]"]').val() );

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
