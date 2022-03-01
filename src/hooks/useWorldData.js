import { useState, useReducer, useEffect, useContext, createContext } from 'react';
import config from '../dwarfviz.config';
import axios from 'axios';
const { useStaticData, storytellerURL } = config;

const fetchFromStoryteller = async (endpoint) => {
  const items = [];
  let response;
  let nextPage = 0;
  do {
    response = (await axios.get(`${storytellerURL}/${endpoint}?per_page=500&page=${nextPage}`))
      .data;
    items.push(...response.data);
    nextPage = 1 + response.page_nr;
  } while (response.links.next !== null);
  return items;
};

const WorldDataContext = createContext(null);

const WorldDataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [state, setState] = useState({});

  useEffect(() => {
    const getStaticData = async () => {
      return {
        regionsGeoJSON: await import('../data/regions.geo.json'),
        regions: await import('../data/regions.json'),
        mapImageURL: await (await import('../data/image.png')).default,
        entityPop: await (await import('../data/entity_populations.json')).data,
        historicalEvents: await (await import('../data/historical_events.json')).data,
        worldsInfo: await (await import('../data/worlds_info.json')).data,
      };
    };
    const fetchRemoteData = async () => {
      try {
        return {
          regionsGeoJSON: await import('../data/regions.geo.json'),
          regions: await fetchFromStoryteller('regions'),
          historicalFigures: await fetchFromStoryteller('historical_figures'),
          sites: await fetchFromStoryteller('sites'),
          entities: await fetchFromStoryteller('entities'),
          entityPopulations: await fetchFromStoryteller('entity_populations'),
          worldsInfo: await fetchFromStoryteller('worlds_info'),
          historicalEvents: await fetchFromStoryteller('historical_events'),
          mapImageURL: `${storytellerURL}/map_images/2/image.png`,
        };
      } catch (error) {
        setIsError(true);
        console.log(error);
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

  const selectionReducer = (selectState, action) => {
    switch (action.type) {
      case 'SELECT_SITE':
        return { ...selectState, site: state.sites.find((x) => x.id === action.payload) };
      case 'SELECT_ENTITY':
        return { ...selectState, entity: state.entities.find((x) => x.id === action.payload) };
      case 'SELECT_HISTORICAL_FIGURE':
        return {
          ...selectState,
          historicalFigure: state.historicalFigures.find((x) => x.id === action.payload),
        };
      default:
        return state;
    }
  };

  const [selectedItems, dispatch] = useReducer(selectionReducer, {
    site: null,
    entity: null,
    historicalFigure: null,
  });

  const selectItem = {
    site: (siteId) => dispatch({ type: 'SELECT_SITE', payload: siteId }),
    entity: (entityId) => dispatch({ type: 'SELECT_ENTITY', payload: entityId }),
    historicalFigure: (hfId) => dispatch({ type: 'SELECT_HISTORICAL_FIGURE', payload: hfId }),
  };

  return (
    <WorldDataContext.Provider value={[state, isLoading, isError, selectedItems, selectItem]}>
      {children}
    </WorldDataContext.Provider>
  );
};

const useWorldData = () => {
  const [state, isLoading, isError, selectedItems, selectItem] = useContext(WorldDataContext);
  return { state, isLoading, isError, selectedItems, selectItem };
};

export { WorldDataProvider, useWorldData };
