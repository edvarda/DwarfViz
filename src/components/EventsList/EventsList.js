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
import { useWorldData } from '../../hooks/useWorldData';

import Table from "./Table.js";
import styles from "./Table.module.css";

const d3 = { max };

const margin = {
  top: 10,
  right: 0,
  bottom: 0,
  left: 65,
};

const EventsList = ({ width, height, yearRange }) => {
  const {
    state: { worldsInfo, historicalEvents },
  } = useWorldData();

  const filteredEvents = yearRange
    ? historicalEvents
        .filter((d) => {
          const date = d['year'];
          return date > yearRange[0] && date < yearRange[1];
        })
        .slice(0, 100)
    : historicalEvents.slice(0,100);


  return (
    // <div className={styles.container}>
    //   <div className={styles.wrapper}>
        <Table data={filteredEvents} rowsPerPage={12} />
    //   </div>
    // </div>
  );
};

export default EventsList;
