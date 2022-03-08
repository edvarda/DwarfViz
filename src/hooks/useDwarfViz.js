import { useState, useEffect, useContext, useReducer, createContext } from 'react';
import config from '../dwarfviz.config';
import axios from 'axios';
const { useStaticData, storytellerURL } = config;

const fetchFromStoryteller = async (endpoint, resourceId = null) => {
  const items = [];
  let response;
  let nextPage = 0;
  do {
    let url = resourceId
      ? `${storytellerURL}/${endpoint}/${resourceId}?per_page=500&page=${nextPage}`
      : `${storytellerURL}/${endpoint}?per_page=500&page=${nextPage}`;
    response = (await axios.get(url)).data;
    items.push(...response.data);
    nextPage = 1 + response.page_nr;
  } while (response.links.next !== null);
  return items;
};

const WorldDataContext = createContext(null);

const WorldDataProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [activeView, setActiveView] = useState('Places');
  const [newSelectionAction, setNewSelectionAction] = useState(null);

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

  // Add history in here
  const selectionReducer = (selectState, action) => {
    switch (action.type) {
      case 'SELECT_SITE':
        return {
          ...selectState,
          site: {
            ...state.sites.find((x) => x.id === action.payload.id),
            relatedEvents: action.payload.events,
          },
        };
      case 'SELECT_ENTITY':
        return {
          ...selectState,
          entity: {
            ...state.entities.find((x) => x.id === action.payload.id),
            relatedEvents: action.payload.events,
          },
        };
      case 'SELECT_HISTORICAL_FIGURE':
        return {
          ...selectState,
          historicalFigure: {
            ...state.historicalFigures.find((x) => x.id === action.payload.id),
            relatedEvents: action.payload.events,
          },
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

  const selectSite = (siteId) => {
    console.log('selectedItemsin select', selectedItems);
    if (!selectedItems.site || siteId !== selectedItems.site.id)
      setNewSelectionAction({ type: 'SELECT_SITE', payload: siteId });
    setActiveView('Places');
  };

  const selectEntity = (entityId) => {
    console.log('selectedItemsin select', selectedItems);
    if (!selectedItems.entity || entityId !== selectedItems.entity.id)
      setNewSelectionAction({ type: 'SELECT_ENTITY', payload: entityId });
    setActiveView('Society');
  };

  const selectHF = (hfId) => {
    console.log('selectedItemsin select', selectedItems);
    if (!selectedItems.historicalFigure || hfId !== selectedItems.historicalFigure.id)
      setNewSelectionAction({ type: 'SELECT_HISTORICAL_FIGURE', payload: hfId });
    setActiveView('People');
  };

  useEffect(() => {
    const handleNewSelectionAction = async (endpoint, action) => {
      const events = await fetchFromStoryteller(endpoint, action.payload);
      dispatch({ ...action, payload: { id: action.payload, events } });
      setNewSelectionAction(null);
    };

    if (newSelectionAction === null) return;
    let endpoint;
    switch (newSelectionAction.type) {
      case 'SELECT_SITE':
        endpoint = 'link_he_site';
        break;
      case 'SELECT_ENTITY':
        endpoint = 'link_he_entity';
        break;
      case 'SELECT_HISTORICAL_FIGURE':
        endpoint = 'link_he_hf';
        break;
      default:
        break;
    }
    handleNewSelectionAction(endpoint, newSelectionAction);
  }, [newSelectionAction]);

  return (
    <WorldDataContext.Provider
      value={[
        state,
        isLoading,
        isError,
        activeView,
        selectedItems,
        setActiveView,
        selectSite,
        selectEntity,
        selectHF,
      ]}
    >
      {children}
    </WorldDataContext.Provider>
  );
};

const useDwarfViz = () => {
  const [
    state,
    isLoading,
    isError,
    activeView,
    selectedItems,
    setActiveView,
    selectSite,
    selectEntity,
    selectHF,
  ] = useContext(WorldDataContext);

  const find = {
    hf: (id) => state.historicalFigures.find((x) => x.id === id),
    entity: (id) => state.entities.find((x) => x.id === id),
    site: (id) => state.sites.find((x) => x.id === id),
    region: (id) => state.regions.find((x) => x.id === id),
  };

  return {
    state,
    isLoading,
    isError,
    activeView,
    setActiveView,
    selectedItems,
    selectSite,
    selectEntity,
    selectHF,
    find,
  };
};

export { WorldDataProvider, useDwarfViz };
