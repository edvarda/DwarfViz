import React, { useEffect } from 'react';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Dothings = ({ bounds }) => {
  const map = useMap();
  // map.fitBounds(bounds);
  return <></>;
};

const Map = ({ imagePath }) => {
  const img = new Image();
  img.src = imagePath;
  const size = { width: img.width, height: img.height };
  console.log(size);
  const bounds = [
    [0, 0],
    [size.width, size.width],
  ];
  return (
    <MapContainer
      style={{ width: size.width, height: size.width }}
      center={[size.width / 2, size.height / 2]}
      zoom={0}
      attributionControl={false}
      zoomControl={false}
      crs={L.CRS.Simple}
      maxBounds={bounds}
    >
      <Dothings bounds={bounds} />
      <ImageOverlay bounds={bounds} url={imagePath} />
    </MapContainer>
  );
};

export default Map;
