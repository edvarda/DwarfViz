import BrushableTimeline from './BrushableTimeline/BrushableTimeline.js';
import EventsList from './EventsList/EventsList.js';
import { useState } from 'react';
import { useDwarfViz } from '../hooks/useDwarfViz.js';
const Events = () => {
  const [yearRange, setYearRange] = useState();
  const {
    data: { historicalEvents },
    getActiveView,
  } = useDwarfViz();

  const events = getActiveView().selectedItem
    ? getActiveView().selectedItem.relatedEvents
    : historicalEvents;

  return (
    <>
      <svg width='100%' height='35%'>
        <g>
          {
            <BrushableTimeline
              width={1400}
              height={250}
              setYearRange={setYearRange}
              historicalEvents={events}
            />
          }
        </g>
      </svg>

      <EventsList
        width={1400}
        height={0}
        yearRange={yearRange}
        historicalEvents={events}
      ></EventsList>
    </>
  );
};

export default Events;
