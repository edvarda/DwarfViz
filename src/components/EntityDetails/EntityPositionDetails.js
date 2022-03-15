import { useDwarfViz } from '../../hooks/useDwarfViz';
import { HfLink } from '../ItemLink.js';
import _ from 'lodash';

const EntityPositionDetails = ({ entity }) => {
  const { data } = useDwarfViz();

  const getEntries = (position) => {
    const hfs_in_position = entity.entity_position_assignment.filter(
      (ass) => ass.position_id == position.local_id,
    );
    if (hfs_in_position.length == 0) {
      return (
        <li>
          <div className='propName'>{_.startCase(position.name)}:</div>
          <div className='value'>Unassigned</div>
        </li>
      );
    } else {
      const group = hfs_in_position.map((hf_in_pos) => {
        return (
          <li>
            <div className='propName'>{_.startCase(position.name)}:</div>
            <div className='value'>
              {hf_in_pos.hf_id ? <HfLink id={hf_in_pos.hf_id} /> : 'Unknown individual'}
            </div>
          </li>
        );
      });
      return <>{group}</>;
    }
  };

  if (entity.entity_position.length === 0) {
    return null;
  }
  return (
    <div className='detailsView'>
      <h3>Entity Positions</h3>
      <ul>{entity.entity_position.map(getEntries)}</ul>
    </div>
  );
};

export { EntityPositionDetails };
