import useHistory from '../hooks/useHistory';

const HistoryControls = ({ view }) => {
  const { goBack, hasBack, goForward, hasForward, clearSelection, hasSelection } = useHistory(view);
  return (
    <div>
      <button onClick={() => goBack()} disabled={!hasBack}>
        Back
      </button>
      <button onClick={() => goForward()} disabled={!hasForward}>
        Forward
      </button>
      <button onClick={() => clearSelection()} disabled={!hasSelection}>
        Clear selection
      </button>
    </div>
  );
};
export default HistoryControls;
