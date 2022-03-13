import useHistory from '../hooks/useHistory';

const HistoryControls = ({ view }) => {
  const { goBack, hasBack, goForward, hasForward, clearSelection, hasSelection } = useHistory(view);
  return (
    <div>
      <button className={'history-button'} onClick={() => goBack()} disabled={!hasBack}>
        {`<`}
      </button>
      <button className={'history-button'} onClick={() => goForward()} disabled={!hasForward}>
        {`>`}
      </button>

      <button
        className={'history-button'}
        onClick={() => clearSelection()}
        disabled={!hasSelection}
      >
        Deselect
      </button>
    </div>
  );
};
export default HistoryControls;
