import { useDwarfViz } from '../hooks/useDwarfViz';
import _ from 'lodash';
const WorldInfo = () => {
  const {
    data: { worldsInfo, historicalEvents, historicalFigures },
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
      <li>
        <div className='prop'>Number of historical figures:</div>
        <div className='value'>{_.startCase(historicalFigures.length)}</div>
      </li>
      <li>
        <div className='prop'>Number of historical events:</div>
        <div className='value'>{_.startCase(historicalEvents.length)}</div>
      </li>
    </ul>
  );
};

export default WorldInfo;
