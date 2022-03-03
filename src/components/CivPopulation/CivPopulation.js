import './stylesCiv.css';
import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  axisBottom,
  axisLeft,
  select,
  stack,
  schemeSet2,
} from 'd3';
import React, { useEffect, useRef } from 'react';
import { useWorldData } from '../../hooks/useWorldData';
import _ from 'lodash';

export const Marks = ({ data, xScale, yScale, xValue, yValue, innerHeight }) => {
  const barHeight = (popObject) => _.sum(Object.values(popObject).map((x) => +x));
  return (
    <g>
      {Object.keys(data).map((raceName) => {
        console.log('rectmap', data[raceName]);
        console.log('val', barHeight(data[raceName]), yScale(barHeight(data[raceName])));
        return (
          <rect
            key={raceName}
            x={xScale(raceName)}
            y={innerHeight - yScale(barHeight(data[raceName]))}
            width={xScale.bandwidth()}
            height={yScale(barHeight(data[raceName]))}
            className={'bar'}
          />
        );
      })}
    </g>
  );
};

const CivPopulationReact = ({ width, height }) => {
  const {
    state: { entityPopulations },
  } = useWorldData();
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  const margin = { top: 35, right: 10, bottom: 20, left: 50 };
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
      const pop = race.split(':')[1];
      if (population[race_name] === undefined) {
        population[race_name] = {};
        races.push(race_name);
      }
      population[race_name][civ.civ_id] = pop;
    });
  });
  let data = [];
  for (const [race, civ_pops] of Object.entries(population)) {
    data.push(Object.assign({}, { race: race }, civ_pops));
  }

  const xScale = scaleBand().domain(races).range([0, innerWidth]).padding([0.2]);
  const yScale = scaleLinear().domain([0, 7000]).range([innerHeight, 0]);
  const color = scaleOrdinal().domain(races).range(schemeSet2);

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
        <g ref={xAxisRef} transform={`translate(0,${innerHeight})`} />
        <g ref={yAxisRef} />
        <Marks
          data={population}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          innerHeight={innerHeight}
        />
      </g>
    </svg>
  );
};

const CivPopulation = ({ width, height }) => {
  const svgRef = useRef(null);
  const {
    state: { entityPopulations },
  } = useWorldData();

  //prepare our data
  console.log('entityPop', entityPopulations);
  let population = {};
  let civilizations = [];
  let races = [];
  entityPopulations.forEach((civ) => {
    civilizations.push(civ.civ_id);
    civ.races.forEach((race) => {
      const race_name = race.split(':')[0];
      const pop = race.split(':')[1];
      if (population[race_name] === undefined) {
        population[race_name] = {};
        races.push(race_name);
      }
      population[race_name][civ.civ_id] = pop;
    });
  });

  let data = [];
  for (const [race, civ_pops] of Object.entries(population)) {
    data.push(Object.assign({}, { race: race }, civ_pops));
  }
  console.log('data', data);

  // let raceCivPop = function (race, civ_id) {
  //   if (population[race][civ_id] === undefined) return 0;
  //   else return population[race][civ_id];
  // };

  console.log('civilizations', civilizations);
  console.log('races', races);
  console.log('population', population);

  function renderGraph() {
    const svg = select(svgRef.current);
    svg.selectAll('g').remove(); // remove 'g' elements from each svg to ensure that if we pass another data set, text and legends are removed from the previously rendered SVG to avoid left behind elements
    //svg.attr('width', width).attr('height', height);

    const margin = { top: 35, right: 10, bottom: 20, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const chartTitle = 'Entity race population';

    svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let subgroups = civilizations;
    let groups = races;

    const xScale = scaleBand().domain(groups).range([0, innerWidth]).padding([0.2]);
    const yScale = scaleLinear().domain([0, 7000]).range([innerHeight, 0]);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .call(axisBottom(xScale).tickSizeOuter(0));

    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',0)')
      .call(axisLeft(yScale));

    // color palette = one color per subgroup
    var color = scaleOrdinal().domain(groups).range(schemeSet2);

    //stack the data? --> stack per subgroup
    var stackedData = stack().keys(subgroups)(data);

    console.log('stackedData', stackedData);
    // Show the bars
    svg
      .append('g')
      // selected a new, empty  g element
      .selectAll('g') // empty selection inside a new g element
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter() // if the data has 14 entries, we have like 14 ghost elements.
      .append('g') // this is where we create 14 new g elements
      .attr('fill', function (d) {
        return color(d.race);
      }) //this isnt working, would want a color per race bar
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return xScale(d.data.race);
      })
      .attr('y', function (d) {
        return yScale(d[1]);
      })
      .attr('height', function (d) {
        return yScale(d[0]) - yScale(d[1]);
      })
      .attr('width', xScale.bandwidth())
      .attr('stroke', 'grey');
  }

  useEffect(() => {
    renderGraph();
  }, [entityPopulations]);

  return (
    <>
      <svg ref={svgRef} style={{ border: '3px solid blue' }} />
    </>
  );
};

export { CivPopulationReact, CivPopulation };
