import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';
import config from '../dwarfviz.config';
const { useStaticData, storytellerURL } = config;
const Actions = {
  START_FETCH: 'START_FETCH',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_DATA: 'SET_DATA',
  SELECT_SITE: 'SELECT_SITE',
  SELECT_ENTITY: 'SELECT_ENTITY',
  SELECT_HISTORICAL_FIGURE: 'SELECT_HISTORICAL_FIGURE',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
};

const Views = {
  PEOPLE: {
    itemType: 'historicalFigure',
    eventEndpoint: 'link_he_hf',
    name: 'peopleView',
    actionType: Actions.SELECT_HISTORICAL_FIGURE,
  },
  SOCIETY: {
    itemType: 'entity',
    eventEndpoint: 'link_he_entity',
    name: 'societyView',
    actionType: Actions.SELECT_ENTITY,
  },
  PLACES: {
    itemType: 'site',
    eventEndpoint: 'link_he_site',
    name: 'placesView',
    actionType: Actions.SELECT_SITE,
  },
};

const fetchFromStoryteller = async (endpoint, resourceId = null) => {
  const items = [];
  let response;
  let nextPage = 0;
  try {
    do {
      let url = resourceId
        ? `${storytellerURL}/${endpoint}/${resourceId}?per_page=500&page=${nextPage}`
        : `${storytellerURL}/${endpoint}?per_page=500&page=${nextPage}`;
      response = (await axios.get(url)).data;
      items.push(...response.data);
      nextPage = 1 + response.page_nr;
    } while (response.links.next !== null);
  } catch (error) {
    throw error;
  }
  return items;
};

const WorldDataContext = createContext(null);

const WorldDataProvider = ({ children }) => {
  useEffect(() => {
    const fetchStaticData = async () => ({
      regionsGeoJSON: await import('../data/regions.geo.json'),
      regions: await import('../data/regions.json'),
      mapImageURL: await (await import('../data/image.png')).default,
      entityPop: await (await import('../data/entity_populations.json')).data,
      historicalEvents: await (await import('../data/historical_events.json')).data,
      worldsInfo: await (await import('../data/worlds_info.json')).data,
    });
    const fetchRemoteData = async () => ({
      regionsGeoJSON: await import('../data/regions.geo.json'),
      regions: await fetchFromStoryteller('regions'),
      historicalFigures: await fetchFromStoryteller('historical_figures'),
      sites: await fetchFromStoryteller('sites'),
      entities: await fetchFromStoryteller('entities'),
      entityPopulations: await fetchFromStoryteller('entity_populations'),
      worldsInfo: await fetchFromStoryteller('worlds_info'),
      historicalEvents: await fetchFromStoryteller('historical_events'),
      mapImageURL: `${storytellerURL}/map_images/2/image.png`,
    });
    const loadData = async () => {
      dispatch({ type: Actions.START_FETCH });
      try {
        const data = useStaticData ? await fetchStaticData() : await fetchRemoteData();
        dispatch({ type: Actions.FETCH_SUCCESS });
        dispatch({ type: Actions.SET_DATA, payload: data });
      } catch (error) {
        console.log(error);
        dispatch({ type: Actions.FETCH_ERROR });
        return;
      }
    };
    loadData();
  }, []);

  const stateReducer = (state, action) => {
    console.log('ACTION:', action);
    console.log('State', state);
    switch (action.type) {
      case Actions.START_FETCH:
        return { ...state, isLoading: true };
      case Actions.FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
        };
      case Actions.FETCH_ERROR:
        return { ...state, isError: true, isLoading: false };
      case Actions.SET_DATA:
        return { ...state, data: action.payload, isDataLoaded: true };
      case Actions.SELECT_SITE:
        if (
          state.placesView.selectedItem &&
          state.placesView.selectedItem.id === action.payload.id
        ) {
          return state;
        }
        return {
          ...state,
          placesView: {
            ...state.placesView,
            isActive: true,
            selectedItem: {
              ...state.data.sites.find((x) => x.id === action.payload.id),
              relatedEvents: action.payload.relatedEvents,
            },
          },
          societyView: { ...state.societyView, isActive: false },
          peopleView: { ...state.peopleView, isActive: false },
        };
      case Actions.SELECT_ENTITY:
        if (
          state.societyView.selectedItem &&
          state.societyView.selectedItem.id === action.payload.id
        ) {
          return state;
        }
        return {
          ...state,
          societyView: {
            ...state.societyView,
            isActive: true,
            selectedItem: {
              ...state.data.entities.find((x) => x.id === action.payload.id),
              relatedEvents: action.payload.relatedEvents,
            },
          },
          peopleView: { ...state.peopleView, isActive: false },
          placesView: { ...state.placesView, isActive: false },
        };
      case Actions.SELECT_HISTORICAL_FIGURE:
        if (
          state.peopleView.selectedItem &&
          state.peopleView.selectedItem.id === action.payload.id
        ) {
          return state;
        }
        return {
          ...state,
          peopleView: {
            ...state.peopleView,
            isActive: true,
            selectedItem: {
              ...state.data.historicalFigures.find((x) => x.id === action.payload.id),
              relatedEvents: action.payload.relatedEvents,
            },
          },
          societyView: { ...state.societyView, isActive: false },
          placesView: { ...state.placesView, isActive: false },
        };
      case Actions.SET_ACTIVE_VIEW:
        if (state[action.payload].isActive) return state; // View already active, don't mutate state
        return {
          ...state,
          placesView: { ...state.placesView, isActive: action.payload === 'placesView' },
          peopleView: { ...state.peopleView, isActive: action.payload === 'peopleView' },
          societyView: { ...state.societyView, isActive: action.payload === 'societyView' },
        };
      default:
        return state;
    }
  };

  const initialState = {
    data: null,
    isLoading: false,
    isError: false,
    isDataLoaded: false,
    placesView: { selectedItem: null, history: [], isActive: true },
    societyView: { selectedItem: null, history: [], isActive: false },
    peopleView: { selectedItem: null, history: [], isActive: false },
  };

  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {}, [state.placesView, state.societyView, state.peopleView]);

  return (
    <WorldDataContext.Provider value={[state, dispatch]}>{children}</WorldDataContext.Provider>
  );
};

const useDwarfViz = () => {
  const [state, dispatch] = useContext(WorldDataContext);

  const selectSite = (siteId) => {
    console.log('select site', siteId);
    selectItem(Views.PLACES, siteId);
  };

  const selectEntity = (entityId) => {
    console.log('select entity', entityId);
    selectItem(Views.SOCIETY, entityId);
  };

  const selectHF = (hfId) => {
    console.log('select hf', hfId);
    selectItem(Views.PEOPLE, hfId);
  };

  const selectItem = async (View, id) => {
    console.log('in selectItem', View, state[View.name], state);
    if (id !== null) {
      dispatch({ type: Actions.START_FETCH });
      try {
        const relatedEvents = await fetchFromStoryteller(View.eventEndpoint, id);
        dispatch({ type: Actions.FETCH_SUCCESS });
        dispatch({ type: View.actionType, payload: { id, relatedEvents: relatedEvents } });
      } catch (error) {
        console.log(error);
        dispatch({ type: Actions.FETCH_ERROR });
        return;
      }
    }
  };

  const find = {
    hf: (id) => data.historicalFigures.find((x) => x.id === id),
    entity: (id) => data.entities.find((x) => x.id === id),
    site: (id) => data.sites.find((x) => x.id === id),
    region: (id) => data.regions.find((x) => x.id === id),
  };

  const setActiveView = (viewName) => {
    dispatch({ type: Actions.SET_ACTIVE_VIEW, payload: viewName });
  };
  const getActiveView = () => [placesView, societyView, peopleView].find((view) => view.isActive);

  const { data, isLoading, isDataLoaded, isError, placesView, societyView, peopleView } = state;
  return {
    data,
    isLoading,
    isDataLoaded,
    isError,
    placesView,
    societyView,
    peopleView,
    find,
    getActiveView,
    setActiveView,
    selectSite,
    selectEntity,
    selectHF,
  };
};

export { WorldDataProvider, useDwarfViz };
