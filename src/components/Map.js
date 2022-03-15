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
  const siteTypes = useMemo(() => _.uniq(sites.map((x) => x.type)).slice(1), [sites]);
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

  const viewBg = '#edebe3';
  const backgroundColor = '#868374';
  const bodyColor = '#212529';
  const shadowColor = '#4d4b49';

  const site = (type) => ({
    radius: 10,
    color: 'white',
    weight: 3,
    opacity: 1,
    fill: true,
    fillColor: colorScale(type),
    fillOpacity: 1,
  });

  const siteHover = (type) => ({
    radius: 13,
    color: 'white',
    weight: 4,
    opacity: 1,
    fill: true,
    fillColor: colorScale(type),
    fillOpacity: 1,
  });

  const siteSelected = (type) => ({
    radius: 16,
    stroke: true,
    color: 'black',
    weight: 5,
    fill: true,
    fillColor: colorScale(type),
    fillOpacity: 1,
  });

  const biome = {
    className: 'map-biome',
    color: bodyColor,
    weight: 2,
    opacity: 1,
    fill: true,
    fillColor: backgroundColor,
    fillOpacity: 0.5,
  };

  const biomeHighlight = {
    color: bodyColor,
    weight: 2,
    opacity: 1,
    fill: true,
    fillColor: backgroundColor,
    fillOpacity: 0.2,
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
          mouseout: (e) => {
            geoJSONRef.current.resetStyle();
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
          thisLayer.setStyle(siteSelected(feature.properties.type));
        }
        thisLayer.on({
          mouseover: (e) => {
            e.target.setStyle(siteHover(e.target.feature.properties.type));
          },
          mouseout: (e) => {
            e.target.setStyle(site(e.target.feature.properties.type));
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
  }, [mapImageURL, mapSize, regionsGeoJSON, regions, selectedSite]);

  return (
    <div className={'map-container'}>
      <div id='map' style={{ width: '100%', height: 'auto' }} />
    </div>
  );
  // <>
  //   <div className={'map-container'}>
  //     <div id='map' style={{ width: '100%', height: 'auto' }} />
  //   </div>
  //   <div style={{ width: '20%', height: 'auto', paddingLeft: '1em' }}>
  //     <ColorLegend height={400} />
  //   </div>
  // </>
};

export default Map;
