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
  // Add the cache breaker
  loadKmlLayer(eventsURL + "?" + keys + "&" + (new Date() * 1) );
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

var kmlLayer = null

function loadKmlLayer(src) {
  kmlLayer = new google.maps.KmlLayer(src, {
    suppressInfoWindows: false,
    preserveViewport: true,
    map: map
  });

  google.maps.event.addListener(kmlLayer, 'click', function(event) {
    var d = $("<div />").html(event.featureData.infoWindowHtml);
    var localTime = moment.utc(d.find('font').text()).toDate();
    d.find('font').text(localTime);

    event.featureData.infoWindowHtml = d.html();
  });
}

$(document).ready(function(){

  $(".locate-me").on("click", function(e){
    if (navigator.geolocation) {
      $(".locate-me").attr("disabled", true);
      navigator.geolocation.getCurrentPosition(function(position){
        map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
        map.setZoom(12);
        updateLatLng();
        $(".locate-me").attr("disabled", false);
      });
    } else {
      alert("No Geo support in your browser");
    }
    return false;
  });

  $(".new_map_filter_form").on("submit", function(e){
    if(kmlLayer != null){
      kmlLayer.setMap(null);
    }

    filterUpdate();
    return false;
  });

});
