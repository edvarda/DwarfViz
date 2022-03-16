import { useDwarfViz } from '../hooks/useDwarfViz';
import _ from 'lodash';
const WorldInfo = () => {
  const {
    data: { worldsInfo },
  } = useDwarfViz();
  const world = worldsInfo[0];
  return (
    <ul className='worldInfo'>
      <li>
        <div className='prop'>Name:</div>
        <div className='value'>{_.startCase(world.name)}</div>
      </li>
      <li>
        <div className='prop'>Translated name:</div>
        <div className='value'>{_.startCase(world.alternative_name)}</div>
      </li>
      <li>
        <div className='prop'>Years of recorded history:</div>
        <div className='value'>{_.startCase(world.year)}</div>
      </li>
    </ul>
  );
};

export default WorldInfo;
