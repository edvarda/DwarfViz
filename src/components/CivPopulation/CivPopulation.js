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
  interpolateViridis,
  schemePaired,
} from 'd3';
import React, { useEffect, useRef } from 'react';
import ItemLink from '../ItemLink.js';
import { useDwarfViz } from '../../hooks/useDwarfViz';
import useTooltip from '../../hooks/useTooltip.js';
import _ from 'lodash';

const Marks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  innerHeight,
  hue,
  maxCivPop,
  entities,
  selectEntity,
}) => {
  const totalPop = (popObject) => _.sum(Object.values(popObject));
  const civName = (civ_id) => {
    const nameTag = entities.find((ent) => ent.id == civ_id).name;
    return nameTag != null ? nameTag : 'Unnamed';
  };
  const { entityTooltip } = useTooltip();
  const rectPileArray = (raceName) => {
    const civPops = data[raceName];
    const sortedKeys = Object.keys(civPops).sort((el1, el2) => civPops[el2] - civPops[el1]);
    let rectArray = [];
    let previousHeight = 0;
    //console.log('race: ', raceName, color(raceName))
    //for (const [id, civ_pop] of Object.entries(civPops)) {
    for (const id of sortedKeys) {
      const civ_pop = civPops[id];
      //console.log('val', civ_pop, yScale(civ_pop))
      rectArray.push(
        <rect
          key={id}
          x={xScale(raceName)}
          y={yScale(civ_pop) - previousHeight}
          width={xScale.bandwidth()}
          height={innerHeight - yScale(civ_pop)}
          stroke={'grey'}
          className={'bar'}
          fill={`hsl(${hue(raceName)},${25 + (civ_pop / maxCivPop) * 75}%,${
            80 - (civ_pop / maxCivPop) * 15
          }%)`}
          //onClick={() => {console.log(id); console.log(entities.find((ent) => ent.id == id)); selectEntity(id)}}
          data-tip={entityTooltip(entities.find((ent) => ent.id == id))}
        />,
      );
      previousHeight += innerHeight - yScale(civ_pop);
    }
    return rectArray;
  };
  return (
    <g>
      {Object.keys(data).map((raceName, i) => {
        return <g key={`$stackedBarRect#${i}`}>{rectPileArray(raceName)}</g>;
      })}
    </g>
  );
};

const CivPopulation = ({ width, height }) => {
  const {
    data: { entityPopulations, entities },
    selectEntity,
  } = useDwarfViz();

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
  // console.log(races);
  // console.log(population);

  let maxRacePop = 0;
  let maxCivPopulation = 0;
  for (const race_pops of Object.values(population)) {
    let totalPop = 0;
    for (const civ_pop of Object.values(race_pops)) {
      totalPop += civ_pop;
      if (civ_pop > maxCivPopulation) maxCivPopulation = civ_pop;
    }
    if (totalPop > maxRacePop) maxRacePop = totalPop;
  }
  // console.log(maxCivPopulation)

  const xScale = scaleBand().domain(races).range([0, innerWidth]).padding([0.2]);
  const yScale = scaleLinear().domain([0, maxRacePop]).range([innerHeight, 0]).nice();
  const color = scaleLinear().domain(races).range(['#63a6d6', '#124488']);
  const colorScale = scaleBand().domain(races).range([0, 360]);

  useEffect(() => {
    const xAxisG = select(xAxisRef.current);
    const xAxis = axisBottom(xScale).tickSizeOuter(0);
    xAxisG.call(xAxis);
    xAxisG.selectAll('.tick text').call(wrap, xScale.bandwidth());

    const yAxisG = select(yAxisRef.current);
    yAxisG.append('text').text('Population');
    const yAxis = axisLeft(yScale);
    yAxisG.call(yAxis);
  });

  function wrap(text, width) {
    text.each(function () {
      var text = select(this),
        words = text.text().split(/\s+|_/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 0.8, // ems
        x = 1,
        y = text.attr('y'),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', dy + 'em');
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(''));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(''));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }

  const xValue = (d) => d;
  const yValue = (d) => d;

  const TootlipFactory = ({ text }) => <div>{text}</div>;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <text className='title' y='-10'>Civilization population by race</text>
        <g ref={xAxisRef} transform={`translate(0,${innerHeight})`}></g>
        <g ref={yAxisRef} ></g>
        <Marks
          data={population}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          innerHeight={innerHeight}
          hue={colorScale}
          maxCivPop={maxCivPopulation}
          entities={entities}
          selectEntity={selectEntity}
        />
      </g>
    </svg>
  );
};

export default CivPopulation;
