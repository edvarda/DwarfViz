import axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';
import config from '../dwarfviz.config';
const { useStaticData, storytellerURL } = config;

const ACTIONS = {
  START_FETCH: 'START_FETCH',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_DATA: 'SET_DATA',
  SELECT_SITE: 'SELECT_SITE',
  SELECT_ENTITY: 'SELECT_ENTITY',
  SELECT_HISTORICAL_FIGURE: 'SELECT_HISTORICAL_FIGURE',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
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
      mapImageURL: await (await import('../data/image.png')).default,
      regions: (await import('../data/regions.json')).data,
      historicalFigures: (await import('../data/historicalFigures.json')).data,
      sites: (await import('../data/sites.json')).data,
      entities: (await import('../data/entities.json')).data,
      entityPopulations: (await import('../data/entityPopulations.json')).data,
      worldsInfo: (await import('../data/worldsInfo.json')).data,
      historicalEvents: (await import('../data/historicalEvents.json')).data,
      artifacts: (await import('../data/artifacts.json')).data,
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
      artifacts: await fetchFromStoryteller('artifacts'),
      mapImageURL: `${storytellerURL}/map_images/2/image.png`,
    });
    const loadData = async () => {
      dispatch({ type: ACTIONS.START_FETCH });
      try {
        const data = useStaticData ? await fetchStaticData() : await fetchRemoteData();
        dispatch({ type: ACTIONS.FETCH_SUCCESS });
        dispatch({ type: ACTIONS.SET_DATA, payload: data });
      } catch (error) {
        console.log(error);
        dispatch({ type: ACTIONS.FETCH_ERROR });
        return;
      }
    };
    loadData();
  }, []);

  const stateReducer = (state, action) => {
    const isSelected = (viewName, itemId) =>
      state[viewName].selectedItem && state[viewName].selectedItem.id === itemId;

    const getSelectedItem = (View) =>
      action.payload.id
        ? {
            ...state.data[View.itemType].find((x) => x.id === action.payload.id),
            relatedEvents: action.payload.relatedEvents,
          }
        : null;

    const getNewHistory = (View) => {
      let history = state[View.name].history;
      let historyPager = state[View.name].historyPager;
      // Append to history
      if (action.payload.id && !action.payload.isHistoryAction) {
        history = history.slice(0, historyPager + 1); // Drop everything in front of pager if pager is not at end before appending.
        history.push({
          ...action,
          payload: { ...action.payload, isHistoryAction: true },
        });
        historyPager = history.length - 1;
      } else if (action.payload.id === null) {
        historyPager = history.length;
      } else {
        historyPager += action.payload.movePager;
      }
      return { history, historyPager };
    };

    switch (action.type) {
      case ACTIONS.START_FETCH:
        return { ...state, isLoading: true };
      case ACTIONS.FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
        };
      case ACTIONS.FETCH_ERROR:
        return { ...state, isError: true, isLoading: false };
      case ACTIONS.SET_DATA:
        return { ...state, data: action.payload, isDataLoaded: true };
      case ACTIONS.SELECT_SITE:
        if (isSelected(VIEWS.PLACES.name, action.payload.id)) {
          return state;
        }
        return {
          ...state,
          placesView: {
            ...state.placesView,
            isActive: true,
            ...getNewHistory(VIEWS.PLACES),
            selectedItem: getSelectedItem(VIEWS.PLACES),
          },
          societyView: { ...state.societyView, isActive: false },
          peopleView: { ...state.peopleView, isActive: false },
        };
      case ACTIONS.SELECT_ENTITY:
        if (isSelected(VIEWS.SOCIETY.name, action.payload.id)) {
          return state;
        }
        return {
          ...state,
          societyView: {
            ...state.societyView,
            isActive: true,
            ...getNewHistory(VIEWS.SOCIETY),
            selectedItem: getSelectedItem(VIEWS.SOCIETY),
          },
          peopleView: { ...state.peopleView, isActive: false },
          placesView: { ...state.placesView, isActive: false },
        };
      case ACTIONS.SELECT_HISTORICAL_FIGURE:
        if (isSelected(VIEWS.PEOPLE.name, action.payload.id)) {
          return state;
        }
        return {
          ...state,
          peopleView: {
            ...state.peopleView,
            isActive: true,
            ...getNewHistory(VIEWS.PEOPLE),
            selectedItem: getSelectedItem(VIEWS.PEOPLE),
          },
          societyView: { ...state.societyView, isActive: false },
          placesView: { ...state.placesView, isActive: false },
        };
      case ACTIONS.SET_ACTIVE_VIEW:
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
    placesView: { selectedItem: null, history: [], historyPager: -1, isActive: true },
    societyView: { selectedItem: null, history: [], historyPager: -1, isActive: false },
    peopleView: { selectedItem: null, history: [], historyPager: -1, isActive: false },
  };

  const selectItem = async (View, id) => {
    if (id !== null) {
      dispatch({ type: ACTIONS.START_FETCH });
      try {
        const relatedEvents = await fetchFromStoryteller(View.eventEndpoint, id);
        dispatch({ type: ACTIONS.FETCH_SUCCESS });
        dispatch({ type: View.actionType, payload: { id, relatedEvents: relatedEvents } });
      } catch (error) {
        console.log(error);
        dispatch({ type: ACTIONS.FETCH_ERROR });
        return;
      }
    } else {
      dispatch({ type: View.actionType, payload: { id: null } });
    }
  };

  const selectSite = (siteId) => {
    selectItem(VIEWS.PLACES, siteId);
  };

  const selectEntity = (entityId) => {
    selectItem(VIEWS.SOCIETY, entityId);
  };

  const selectHF = (hfId) => {
    selectItem(VIEWS.PEOPLE, hfId);
  };

  const VIEWS = {
    PEOPLE: {
      itemType: 'historicalFigures',
      eventEndpoint: 'link_he_hf',
      name: 'peopleView',
      actionType: ACTIONS.SELECT_HISTORICAL_FIGURE,
      selectItem: selectHF,
    },
    SOCIETY: {
      itemType: 'entities',
      eventEndpoint: 'link_he_entity',
      name: 'societyView',
      actionType: ACTIONS.SELECT_ENTITY,
      selectItem: selectEntity,
    },
    PLACES: {
      itemType: 'sites',
      eventEndpoint: 'link_he_site',
      name: 'placesView',
      actionType: ACTIONS.SELECT_SITE,
      selectItem: selectSite,
    },
  };

  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {}, [state.placesView, state.societyView, state.peopleView]);

  return (
    <WorldDataContext.Provider
      value={{ VIEWS, state, dispatch, selectSite, selectEntity, selectHF }}
    >
      {children}
    </WorldDataContext.Provider>
  );
};

const useDwarfViz = () => {
  const { VIEWS, state, dispatch, selectSite, selectEntity, selectHF } =
    useContext(WorldDataContext);

  const find = {
    hf: (id) => data.historicalFigures.find((x) => x.id === id),
    entity: (id) => data.entities.find((x) => x.id === id),
    site: (id) => data.sites.find((x) => x.id === id),
    region: (id) => data.regions.find((x) => x.id === id),
    artifact: (id) => data.artifacts.find((x) => x.id === id),
  };

  const setActiveView = (viewName) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: viewName });
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
    VIEWS,
  };
};

export { WorldDataContext, WorldDataProvider, useDwarfViz };
