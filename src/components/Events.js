import BrushableTimeline from './BrushableTimeline/BrushableTimeline.js';
import EventsList from './EventsList/EventsList.js';
import { useState } from 'react';
import { useDwarfViz } from '../hooks/useDwarfViz.js';
import _ from 'lodash';

const Events = () => {
  const [yearRange, setYearRange] = useState();
  const {
    data: { historicalEvents },
    getActiveView,
  } = useDwarfViz();

  const events = getActiveView().selectedItem
    ? getActiveView().selectedItem.relatedEvents
    : historicalEvents;

  return events.length > 0 ? (
    <>
      <div className={'view-element'}>
        {<BrushableTimeline setYearRange={setYearRange} historicalEvents={events} />}
      </div>
      <div className={'view-element'}>
        <EventsList yearRange={yearRange} historicalEvents={events} />
      </div>
    </>
  ) : (
    <div className={'view-element noSelection'}>
      {`${_.startCase(getActiveView().selectedItem.name)} has no associated events`}
    </div>
  );
};

export default Events;
