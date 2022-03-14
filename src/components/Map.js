import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useDwarfViz } from '../hooks/useDwarfViz';
import useTooltip from '../hooks/useTooltip';

const point = {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 5,
};

const pointHover = {
  color: 'red',
  fillColor: '#51f',
  fillOpacity: 1,
  radius: 8,
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

const Map = ({ mapImage, mapSize, data, regions, dim }) => {
  const { siteTooltip, regionTooltip } = useTooltip();
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
        properties: site,
      }));
    return features;
  };

  const {
    data: { sites },
    selectSite,
  } = useDwarfViz();
  const mapRef = useRef(null);
  const geoJSONRef = useRef(null);
  const geoJSONSitesRef = useRef(null);
  useEffect(() => {
    // create map
    mapRef.current = L.map('map', {
      center: [mapSize.width / 2, mapSize.height / 2],
      zoomSnap: 0,
      attributionControl: false,
      zoomControl: false,
      crs: L.CRS.Simple,
      maxBounds: mapSize.bounds,
      layers: [L.imageOverlay(mapImage, mapSize.bounds)],
    });

    geoJSONRef.current = L.geoJSON(data, {
      style: style,
      onEachFeature: (feature, thisLayer) => {
        const regionWithBiome = {
          ...regions.find((x) => x.id === +feature.properties.regionId),
          biomeString: feature.properties.biomeInfo.biomeString,
        };
        thisLayer.bindTooltip(
          `<div class="dwarfviz-tooltip">${regionTooltip(regionWithBiome)}</div>`,
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
        thisLayer.bindTooltip(
          `<div class="dwarfviz-tooltip">${siteTooltip(feature.properties)}</div>`,
          { interactive: true },
        );
        thisLayer.on({
          mouseover: (e) => {
            e.target.setStyle(pointHover);
          },
          mouseout: (e) => e.target.setStyle(point),
          click: (e) => {
            selectSite(e.target.feature.properties.id);
          },
        });
      },
    }).addTo(mapRef.current);
    setTimeout(function () {
      mapRef.current.fitBounds(mapSize.bounds);
    }, 500);
    return () => {
      mapRef.current.remove();
    };
  }, [mapImage, mapSize, data, regions]);

  return (
    <div className={'map-container'}>
      <div id='map' style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default Map;
