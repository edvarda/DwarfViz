import { MapContainer, ImageOverlay, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';

const Map = ({ mapImage, data }) => {
  const [mapSize, setMapSize] = useState(null);
  useEffect(() => {
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
  }, [mapImage]);

  const lineStyle = {
    color: 'black',
    weight: 1,
    fillColor: 'transparent',
    opacity: 1,
  };
  const hoverStyle = {
    color: 'black',
    fillColor: '#ff7800',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.5,
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
          <GeoJSON
            data={data}
            style={(f) => {
              return lineStyle;
            }}
            onEachFeature={(feature, layer) => {
              layer.on({
                mouseover: (e) => {
                  layer.setStyle(hoverStyle);
                },
                mouseout: (e) => {
                  layer.setStyle(lineStyle);
                },
              });
            }}
          />
          <ImageOverlay bounds={mapSize.bounds} url={mapImage} />
        </MapContainer>
      )}
    </>
  );
};

export default Map;
