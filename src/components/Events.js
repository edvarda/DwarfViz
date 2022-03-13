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
      <div className={'view-element'}>
        {
          <BrushableTimeline
            width={800}
            height={250}
            setYearRange={setYearRange}
            historicalEvents={events}
          />
        }
      </div>
      <div className={'view-element'}>
        <EventsList yearRange={yearRange} historicalEvents={events} />
      </div>
    </>
  );
};

export default Events;
