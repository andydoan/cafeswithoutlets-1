
// GEOLOCATION STUFF
export const setMapToGeolocation = ({ map, location = {} }) => {
  const pos = {
    lat: location.position.latitude,
    lng: location.position.longitude
  };
  map.setCenter(pos);

}

// MARKERS STUFF
export const clearMarker = (marker = { setmap: _.noop }) => {
  marker.setMap(null)
};

export const clearMarkers = (markers = []) => {
  markers.forEach((marker) => clearMarker(marker));
};

export const createMarkers = ({ map, data = [], callback = _.noop }) => {
  const markers = data.map((obj) => {
    const pos = {
      lat: obj.latitude,
      lng: obj.longitude
    };
    return new google.maps.Marker({
      position: pos,
      map: map
    });
  });

  return markers;
}
