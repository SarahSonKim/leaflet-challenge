// Create the map object with center and zoom level
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Add a tile layer (the background map image) to our map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // URL to get the earthquake data
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Function to determine marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }
  
  // Function to determine marker color based on depth
  function markerColor(depth) {
    if (depth > 90) return "#ff5f65"; // red
    if (depth > 70) return "#fca35d"; // orange-red
    if (depth > 50) return "#fdb72a"; // orange
    if (depth > 30) return "#f7db11"; // yellow-orange
    if (depth > 10) return "#dcf400"; // yellow
    return "#a3f600"; // green
  }
  
  // Fetch the earthquake data
  d3.json(url).then(function(data) {
    // Add GeoJSON layer to the map
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          "Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2] + " km"
        );
      }
    }).addTo(myMap);
  
    // Create a legend
    var legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
        depthLevels = [-10, 10, 30, 50, 70, 90],
        colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"]; // colors from greenish to reddish

  
      for (var i = 0; i < depthLevels.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  });
  