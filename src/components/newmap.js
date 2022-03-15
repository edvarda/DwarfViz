import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useMemo } from 'react';
import _ from 'lodash';
import { useDwarfViz } from '../hooks/useDwarfViz';
import useTooltip from '../hooks/useTooltip';
import { useColorLegend } from './useColorLegend';

const mapSize = {
  width: 528,
  height: 528,
  bounds: [
    [0, 0],
    [527, 527],
  ],
};

const Map = () => {
  const { siteTooltip } = useTooltip();
  const {
    data: { mapImageURL, sites, regions, regionsGeoJSON },
    selectSite,
    placesView: { selectedItem: selectedSite },
  } = useDwarfViz();
  const mapRef = useRef(null);
  const geoJSONRef = useRef(null);
  const geoJSONSitesRef = useRef(null);
  const siteTypes = useMemo(() => _.uniq(sites.map((x) => x.type)), [sites]);
  const { colorScale, ColorLegend } = useColorLegend(siteTypes);

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
          ...site,
          regionId: +regions.find((region) =>
            region.coords.find((coord) => coord.x === site.coord.x && coord.y === site.coord.y),
          ).id,
        },
      }));
    return features;
  };

  const site = (type) => ({
    radius: 7,
    color: colorScale(type),
    className: 'map-site',
  });

  const siteSelected = {
    className: 'map-site-selected',
  };

  const biome = {
    className: 'map-biome',
  };

  const biomeHighlight = {
    fillOpacity: 0,
    stroke: true,
    className: 'map-biome-highlight',
  };

  const hoverRegionStyle = {
    stroke: true,
    color: 'black',
    weight: 1,
    opacity: 1,
  };

  useEffect(() => {
    // create map
    mapRef.current = L.map('map', {
      center: [mapSize.width / 2, mapSize.height / 2],
      zoomSnap: 0,
      attributionControl: false,
      zoomControl: false,
      crs: L.CRS.Simple,
      maxBounds: mapSize.bounds,
      layers: [L.imageOverlay(mapImageURL, mapSize.bounds)],
    });

    geoJSONRef.current = L.geoJSON(regionsGeoJSON, {
      style: biome,
      onEachFeature: (feature, thisLayer) => {
        thisLayer.on({
          mouseover: (e) => {
            geoJSONRef.current.resetStyle();
            geoJSONRef.current.eachLayer((layer) => {
              if (layer.feature.properties.regionId === feature.properties.regionId) {
                layer.setStyle(biomeHighlight);
              }
            });
          },
        });
      },
    }).addTo(mapRef.current);

    geoJSONSitesRef.current = L.geoJSON(sitesAsGeoJSONFeatures(sites), {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, site(feature.properties.type)),
      onEachFeature: (feature, thisLayer) => {
        thisLayer.bindTooltip(
          `<div class="dwarfviz-tooltip">${siteTooltip(feature.properties)}</div>`,
          { interactive: true },
        );
        if (selectedSite && feature.properties.id === selectedSite.id) {
          thisLayer.setStyle(siteSelected);
        }
        thisLayer.on({
          mouseover: (e) => {
            geoJSONRef.current.eachLayer((layer) => {
              if (+layer.feature.properties.regionId === feature.properties.regionId) {
                layer.setStyle(hoverRegionStyle);
              } else {
                layer.setStyle(hoverRegionStyle);
              }
            });
          },
          click: (e) => {
            selectSite(e.target.feature.properties.id);
          },
        });
      },
    }).addTo(mapRef.current);

    mapRef.current.fitBounds(mapSize.bounds);

    return () => {
      mapRef.current.remove();
    };
  }, [mapImageURL, mapSize, regionsGeoJSON, regions]);

  return (
    <div className={'map-container'}>
      <div id='map' style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default Map;
