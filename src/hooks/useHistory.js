import { useContext } from 'react';

import { WorldDataContext } from './useDwarfViz';

const useHistory = (view) => {
  const { state, dispatch, selectItem } = useContext(WorldDataContext);

  const { history, historyPager, selectedItem } = state[view.name];

  const hasBack = !!history[historyPager - 1];
  const hasForward = !!history[historyPager + 1];
  const hasSelection = !!selectedItem;

  const goBack = () => {
    if (hasBack) {
      const historyAction = history[historyPager - 1];
      dispatch({ ...historyAction, payload: { ...historyAction.payload, movePager: -1 } });
    }
  };
  const goForward = () => {
    if (hasForward) {
      const historyAction = history[historyPager + 1];
      dispatch({ ...historyAction, payload: { ...historyAction.payload, movePager: 1 } });
    }
  };

  const clearSelection = () => {
    view.selectItem(null);
  };

  return { goBack, goForward, clearSelection, hasBack, hasForward, hasSelection };
};

export default useHistory;
