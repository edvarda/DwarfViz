import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';

const Map = ({ mapImage }) => {
  const [mapSize, setMapSize] = useState(null);
  const img = new Image();
  img.src = mapImage;
  img.onload = function () {
    setMapSize({
      width: this.width,
      height: this.height,
      bounds: [
        [0, 0],
        [this.width, this.height],
      ],
    });
  };
  return (
    <>
      {mapSize && (
        <MapContainer
          style={{ width: mapSize.width, height: mapSize.width }}
          center={[mapSize.width / 2, mapSize.height / 2]}
          zoom={0}
          attributionControl={false}
          zoomControl={false}
          crs={L.CRS.Simple}
          maxBounds={mapSize.bounds}
        >
          <ImageOverlay bounds={mapSize.bounds} url={mapImage} />
        </MapContainer>
      )}
    </>
  );
};

export default Map;
