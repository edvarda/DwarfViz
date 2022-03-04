import './stylesCiv.css';
import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scaleSequential,
  axisBottom,
  axisLeft,
  select,
  stack,
  schemeSet2,
  color,
  interpolateViridis
} from 'd3';
import React, { useEffect, useRef } from 'react';
import { useWorldData } from '../../hooks/useWorldData';
import _ from 'lodash';

export const Marks = ({ data, xScale, yScale, xValue, yValue, innerHeight, color }) => {
  const totalPop = (popObject) => _.sum(Object.values(popObject));
  const rectPileArray = (raceName) => {
    const civPops = data[raceName];
    let rectArray = []
    let previousHeight = 0;
    //console.log('race: ', raceName, color(raceName))
    for (const [id, civ_pop] of Object.entries(civPops)) {
      //console.log('val', civ_pop, yScale(civ_pop))
      rectArray.push(
        <rect
          key={id}
          x={xScale(raceName)}
          y={yScale(civ_pop)-previousHeight}
          width={xScale.bandwidth()}
          height={innerHeight-yScale(civ_pop)}
          stroke={'grey'}
          className={'bar'}
          fill={color(raceName)}
        />
      );
      previousHeight+=innerHeight-yScale(civ_pop);
    }
    return rectArray;
  }
  return (
    <g>
      {Object.keys(data).map((raceName) => {
        return (
          <g>
            {rectPileArray(raceName)}
          </g>
        );
      })}
    </g>
  );
};

const CivPopulation = ({ width, height }) => {
  const {
    state: { entityPopulations },
  } = useWorldData();
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  const margin = { top: 35, right: 10, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  //Data transform
  let population = {};
  let civilizations = [];
  let races = [];
  entityPopulations.forEach((civ) => {
    civilizations.push(civ.civ_id);
    civ.races.forEach((race) => {
      const race_name = race.split(':')[0];
      const pop = +race.split(':')[1];
      if (population[race_name] === undefined) {
        population[race_name] = {};
        races.push(race_name);
      }
      population[race_name][civ.civ_id] = pop;
    });
  });
  console.log(races)
  console.log(population);

  let maxRacePop=0;
  for (const race_pops of Object.values(population)) {
    let totalPop = 0;
    for (const civ_pop of Object.values(race_pops)) {
      totalPop+=civ_pop;
    }
    if (totalPop > maxRacePop) maxRacePop = totalPop;
  }

  const xScale = scaleBand().domain(races).range([0, innerWidth]).padding([0.2]);
  const yScale = scaleLinear().domain([0, maxRacePop]).range([innerHeight, 0]).nice();
  const color = scaleLinear().domain(races).range(schemeSet2);
  const colorScale = scaleSequential().domain(races).interpolator(interpolateViridis);

  useEffect(() => {
    const xAxisG = select(xAxisRef.current);
    const xAxis = axisBottom(xScale).tickSizeOuter(0);
    xAxisG.call(xAxis);

    const yAxisG = select(yAxisRef.current);
    const yAxis = axisLeft(yScale);
    yAxisG.call(yAxis);
  });

  const xValue = (d) => d;
  const yValue = (d) => d;

  return (
    <svg style={{ border: '3px solid red' }} width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g ref={xAxisRef} transform={`translate(0,${innerHeight})`}></g>
        <g ref={yAxisRef} />
        <Marks
          data={population}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          innerHeight={innerHeight}
          color={colorScale}
        />
      </g>
    </svg>
  );
};

export { CivPopulation };
