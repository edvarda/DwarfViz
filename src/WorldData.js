import { useState, useEffect } from 'react';
import config from './dwarfviz.config';
import axios from 'axios';
const { useStaticData, storytellerURL } = config;

export const useWorldData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [state, setState] = useState({});

  useEffect(() => {
    const getStaticData = async () => {
      return {
        regions: await import('./data/regions.json'),
        mapImageURL: await (await import('./data/image.png')).default,
      };
    };
    const fetchRemoteData = async () => {
      try {
        return {
          regions: (await axios.get(`${storytellerURL}/regions`)).data,
          mapImageURL: `${storytellerURL}/map_images/0/image.png`,
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
  return { state, isLoading, isError };
};
