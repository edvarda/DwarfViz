import { MapContainer, ImageOverlay, GeoJSON } from 'react-leaflet';
import L, { geoJSON } from 'leaflet';
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
  const geojsonMarkerOptions = {
    radius: 1,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };
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
  const lineStyleError = {
    color: 'red',
    weight: 4,
    opacity: 1,
  };

  const testData = ((data) => ({ ...data, features: data.features.slice(0, 2) }))(data);
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
              if (f.properties.isContained) {
                console.log(f);
                return lineStyleError;
              }
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
            // pointToLayer={(feature, latlng) => {
            //   return L.circleMarker(latlng, geojsonMarkerOptions);
            // }}
          />
          <ImageOverlay bounds={mapSize.bounds} url={mapImage} />
        </MapContainer>
      )}
    </>
  );
};

export default Map;
