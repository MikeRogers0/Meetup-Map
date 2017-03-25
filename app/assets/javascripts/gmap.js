var map;
function initGMap() {
  var gmapElm = document.getElementById('gmap');
  map = new google.maps.Map(gmapElm, {
    center: {lat: 51.5074, lng: 0.1278},
    zoom: 10
  });

  loadKmlLayer(gmapElm.attributes["data-kml"].value, map);
}

function loadKmlLayer(src, map) {
  var kmlLayer = new google.maps.KmlLayer(src, {
    suppressInfoWindows: false,
    preserveViewport: true,
    map: map
  });
  //google.maps.event.addListener(kmlLayer, 'click', function(event) {
    //var content = event.featureData.infoWindowHtml;
  //});
}
