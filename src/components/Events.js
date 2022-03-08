import BrushableTimeline from './BrushableTimeline/BrushableTimeline.js';
import EventsList from './EventsList/EventsList.js';
import { useState } from 'react';
import { useDwarfViz } from '../hooks/useDwarfViz.js';
const Events = () => {
  const [yearRange, setYearRange] = useState();
  const {
    state: { historicalEvents },
    selectedItems,
    activeView,
  } = useDwarfViz();
  let events = historicalEvents;
  switch (activeView) {
    case 'Places':
      if (selectedItems.site) events = selectedItems.site.relatedEvents;
      break;
    case 'Society':
      if (selectedItems.entity) events = selectedItems.entity.relatedEvents;
      break;
    case 'People':
      if (selectedItems.historicalFigure) events = selectedItems.historicalFigure.relatedEvents;
      break;
    default:
      break;
  }
  console.log('events:', events);

  return (
    <>
      <svg width='100%' height='60%'>
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
