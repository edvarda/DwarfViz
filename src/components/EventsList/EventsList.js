import {
  brushX,
  select,
  scaleLinear,
  max,
  sum,
  timeFormat,
  extent,
  bin,
  interpolateRgb,
  nice,
} from 'd3';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useDwarfViz } from '../../hooks/useDwarfViz';

import Table from './Table.js';
import styles from './Table.module.css';

const EventsList = ({ width, height, yearRange, historicalEvents }) => {
  const maxSlice = 144;
  const {
    data: { worldsInfo },
  } = useDwarfViz();

  const filteredEvents = yearRange
    ? historicalEvents
        .filter((d) => {
          const date = d['year'];
          return date > yearRange[0] && date < yearRange[1];
        })
        .slice(0, maxSlice)
    : historicalEvents.slice(0, maxSlice);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Table data={filteredEvents} rowsPerPage={12} />
      </div>
    </div>
  );
};

export default EventsList;
