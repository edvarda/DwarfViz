import BrushableTimeline from './BrushableTimeline/BrushableTimeline.js';
import EventsList from './EventsList/EventsList.js';
import { useState } from 'react';
const Events = () => {
  const [yearRange, setYearRange] = useState();

  return (
    <>
      <svg width='100%' height='100%'>
        <g>
          <BrushableTimeline width={1400} height={250} setYearRange={setYearRange} />
        </g>
      </svg>

      <EventsList width={1400} height={150} yearRange={yearRange}></EventsList>
    </>
  );
};

export default Events;
