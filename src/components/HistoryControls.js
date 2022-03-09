import { useHistory } from '../hooks/useDwarfViz';
const HistoryControls = ({ viewName }) => {
  const { goBack, hasBack, goForward, hasForward } = useHistory(viewName);
  return (
    <div>
      <button onClick={() => goBack()} disabled={!hasBack}>
        Back
      </button>
      <button onClick={() => goForward()} disabled={!hasForward}>
        Forward
      </button>
    </div>
  );
};
export default HistoryControls;
