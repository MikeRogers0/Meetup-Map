var map;
var eventsURL;
var updateLatLngTimeout;

  // Save Form, apart from dates.
function saveFormData(){
  $(".new_map_filter_form .session-store").each(function(){
    localStorage[$(this).attr("name")] = $(this).val();
  });
  
}

function restoreFormData(){
  // Start with local storage
  $(".new_map_filter_form .session-store").each(function(){
    if( typeof(localStorage[$(this).attr("name")]) != "undefined"){
      $(this).val( localStorage[$(this).attr("name")] );
    }
  });

  // Then the URL.
  if( document.location.hash.length > 5 ) {
    var locations = document.location.hash.replace("#", "");
    locations = locations.split(",")

    var latitude = locations[0];
    var longitude = locations[1];

    $('[name="map_filter_form[latitude]"]').val( latitude );
    $('[name="map_filter_form[longitude]"]').val( longitude );
  }

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
  saveFormData();

  var latitude = parseInt(map.getCenter().lat() * 10000) / 10000;
  var longitude = parseInt(map.getCenter().lng() * 10000) / 10000;

  history.replaceState({
    latitude: latitude,
    longitude: longitude
  }, "LocationChange", "#"+latitude+","+longitude+"");

  // Update the KML files
  var keys = $(".new_map_filter_form .form-control, .new_map_filter_form .session-store").serialize();

  console.log(eventsURL + "?" + keys);
  // Add the cache breaker
  loadKmlLayer(eventsURL + "?" + keys );
  //loadKmlLayer(eventsURL + "?" + keys + "&" + (new Date() * 1) );
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

var kmlLayers = [];

function clearOverlays() {
 while(kmlLayers.length > 0) { 
   kmlLayers.pop().setMap(null);
 }
}

function loadKmlLayer(src) {
  var kmlLayer = new google.maps.KmlLayer(src, {
    suppressInfoWindows: false,
    preserveViewport: true,
    map: map
  });

  kmlLayers.push(kmlLayer);

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
      },function(e){
        alert(e.message);
        $(".locate-me").attr("disabled", false);
      },{timeout:10000});
    } else {
      alert("No Geo support in your browser");
    }
    return false;
  });

  $(".new_map_filter_form").on("submit", function(e){
    clearOverlays();
    filterUpdate();
    return false;
  });

});
