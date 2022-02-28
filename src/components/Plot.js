import TreeMap from './TreeMap.js';
import BrushableTimeline from './BrushableTimeline/BrushableTimeline.js'
const Plot = ({ data }) => {
  return (
    <svg width="412" height="412">
    <g>
      
        <BrushableTimeline
          data={data}
          width={412}
          height={360}
          //setBrushExtent={setBrushExtent}
          //xValue={xValue}
        />
    </g>
    </svg>
  );
};

export default Plot;
