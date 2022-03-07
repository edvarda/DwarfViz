import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useDwarfViz } from '../hooks/useDwarfViz';

const point = {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 3,
};

const pointHover = {
  color: 'black',
  fillColor: '#f03',
  fillOpacity: 1,
  radius: 5,
};

const style = {
  stroke: true,
  fill: 'black',
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
  const sitesAsGeoJSONFeatures = (sites) => {
    const getCenterpointOfRect = ({ x1, x2, y1, y2 }) => [
      (x1 + x2) / 2,
      mapSize.height - (y1 + y2) / 2,
    ];
    const features = sites
      .filter((x) => !!x.rectangle)
      .map((site) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getCenterpointOfRect(site.rectangle),
        },
        properties: {
          name: site.name,
          id: site.id,
        },
      }));
    return features;
  };

  const {
    state: { sites },
    selectItem,
  } = useDwarfViz();
  const mapRef = useRef(null);
  const geoJSONRef = useRef(null);
  const geoJSONSitesRef = useRef(null);
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
        });
      },
    }).addTo(mapRef.current);

    geoJSONSitesRef.current = L.geoJSON(sitesAsGeoJSONFeatures(sites), {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, point),
      onEachFeature: (feature, thisLayer) => {
        thisLayer.bindTooltip(`<div>Site: ${feature.properties.name}</div>`, { interactive: true });
        thisLayer.on({
          mouseover: (e) => {
            e.target.setStyle(pointHover);
          },
          mouseout: (e) => e.target.setStyle(point),
          click: (e) => {
            console.log('select');
            selectItem.site(e.target.feature.properties.id);
          },
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
