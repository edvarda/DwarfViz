import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import _ from 'lodash';

const style = {
  stroke: true,
  color: 'black',
  weight: 1,
  opacity: 1,
};
const hoverStyle = {
  stroke: true,
  color: 'black',
  weight: 3,
  opacity: 1,
};
const hoverRegionStyle = {
  stroke: true,
  color: 'black',
  weight: 1,
  opacity: 1,
};
const fade = {
  stroke: true,
  color: 'gray',
  fillColor: 'gray',
  fillOpacity: 0.7,
  weight: 1,
  opacity: 1,
};

const Map = ({ mapImage, mapSize, data, regions }) => {
  const mapRef = useRef(null);
  const geoJSONRef = useRef(null);
  useEffect(() => {
    // create map
    mapRef.current = L.map('map', {
      center: [mapSize.width / 2, mapSize.height / 2],
      zoom: 0,
      attributionControl: false,
      zoomControl: true,
      crs: L.CRS.Simple,
      maxBounds: mapSize.bounds,
      layers: [L.imageOverlay(mapImage, mapSize.bounds)],
    });

    geoJSONRef.current = L.geoJSON(data, {
      style: style,
      onEachFeature: (feature, thisLayer) => {
        const region = regions.find((x) => x.id === +feature.properties.regionId);
        thisLayer.bindTooltip(
          `<div>Biome: ${feature.properties.biomeInfo.biomeString}<br />Region: ${region.name}</div>`,
          { interactive: true },
        );
        thisLayer.on({
          mouseover: (e) => {
            geoJSONRef.current.resetStyle();
            geoJSONRef.current.eachLayer((layer) => {
              if (layer.feature.properties.regionId === feature.properties.regionId) {
                layer.setStyle(hoverRegionStyle);
              } else {
                layer.setStyle(fade);
              }
            });
            e.target.setStyle(hoverStyle);
          },
          // mouseout: (e) => geoJSONRef.current.resetStyle(),
        });
      },
    }).addTo(mapRef.current);
    return () => {
      mapRef.current.remove();
    };
  }, [mapImage, mapSize, data, regions]);

  useEffect(() => {}, []);

  return <div id='map' style={{ height: mapSize.height, width: mapSize.width }} />;
};

export default Map;
