import { useState, useEffect } from 'react';
import config from '../dwarfviz.config';
import axios from 'axios';
const { useStaticData, storytellerURL } = config;

export const useWorldData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [state, setState] = useState({});

  useEffect(() => {
    const getStaticData = async () => {
      return {
        regionsGeoJSON: await import('../data/regions.geo.json'),
        regions: await import('../data/regions.json'),
        mapImageURL: await (await import('../data/image.png')).default,
        writtenContents: await (await import('../data/written_contents.json')).data,
        danceForms: await (await import('../data/dance_forms.json')).data,
        poeticForms: await (await import('../data/poetic_forms.json')).data,
        musicalForms: await (await import('../data/musical_forms.json')).data,
        entityPop: await (await import('../data/entity_populations.json')).data,
        historicalEvents: await (await import('../data/historical_events.json')).data,
        worldsInfo: await (await import('../data/worlds_info.json')).data,
      };
    };
    const fetchRemoteData = async () => {
      try {
        return {
          regionsGeoJSON: await import('../data/regions.geo.json'),
          regions: (await axios.get(`${storytellerURL}/regions`)).data,
          mapImageURL: `${storytellerURL}/map_images/0/image.png`,
          // TODO: Make written contents actually get all available, not just first 500
          writtenContents: (await axios.get(`${storytellerURL}/written_contents?per_page=500`))
            .data,
          danceForms: (await axios.get(`${storytellerURL}/written_contents?per_page=500`)).data,
          poeticForms: (await axios.get(`${storytellerURL}/written_contents?per_page=500`)).data,
          musicalForms: (await axios.get(`${storytellerURL}/written_contents?per_page=500`)).data,
        };
      } catch (error) {
        setIsError(true);
        return getStaticData();
      }
    };
    const loadData = async () => {
      setIsLoading(true);
      if (useStaticData) {
        const initialData = await getStaticData();
        setState(initialData);
      } else {
        const initialData = await fetchRemoteData();
        setState(initialData);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);
  return [state, isLoading, isError];
};
