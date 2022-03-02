import { brushX, select, scaleLinear, max, sum, timeFormat, extent, bin, interpolateRgb, nice } from 'd3';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useWorldData } from '../../hooks/useWorldData';
//import { useTable } from 'react-table'

const d3 = { max };

const margin = {
  top: 10,
  right: 0,
  bottom: 0,
  left: 65,
};


const EventsList = ({ data, width, height, yearRange }) => {
    const {
        state: { worldsInfo, historicalEvents },
    } = useWorldData();

    const filteredData = yearRange
    ? historicalEvents.filter((d) => {
        const date = d['year'];
        return date > yearRange[0] && date < yearRange[1];
      }).slice(0,100)
    : historicalEvents;


    //console.log(listItems)
    return (
        <>
            <ul>
                { filteredData.map((d) => <li key={d.id}>{d.type} {d.year}</li>) }
            </ul>
            <rect width={100} height={100} y={500} fill='green' />
        </>
        
  );
};

export default EventsList;
