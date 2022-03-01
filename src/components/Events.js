import BrushableTimeline from './BrushableTimeline/BrushableTimeline.js';
const Events = () => {
  return (
    <svg width='412' height='412'>
      <g>
        <BrushableTimeline
          width={412}
          height={360}
          //setBrushExtent={setBrushExtent}
          //xValue={xValue}
        />
      </g>
    </svg>
  );
};

export default Events;
