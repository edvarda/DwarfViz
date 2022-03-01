import { brushX, select, scaleLinear, max, sum, timeFormat, extent, bin, interpolateRgb } from 'd3';

import { useState, useRef, useMemo, useEffect } from 'react';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const d3 = { max };

const margin = {
  top: 20,
  right: 30,
  bottom: 20,
  left: 50,
};

const xAxisLabelOffset = 40;
const yAxisLabelOffset = 40;
const xAxisLabel = 'Year';
const yAxisLabel = 'Events';

const yValue = (d) => 1; // +1 per event
const xValue = (d) => d['year'];

const BrushableTimeline = ({ data, width, height }) => {
  const [brushExtent, setBrushExtent] = useState();
  const brushRef = useRef();

  console.log(data.worldsInfo);
  console.log(data.historicalEvents);
  const maxYears = data.worldsInfo[0].year;
  const xValueExtent = [-1, ...Array(maxYears).keys()]; // -1, 0, 1, 2, 3,... up to maxYears (e.g. 125)

  const eventData = data.historicalEvents;
  const filteredData = brushExtent
    ? eventData.filter((d) => {
        const date = xValue(d);
        return date > brushExtent[0] && date < brushExtent[1];
      })
    : eventData;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xScale = useMemo(
    () =>
      scaleLinear()
        //.domain(extent(filteredData, xValue))
        .domain(extent(xValueExtent))
        .range([0, innerWidth]),
    [filteredData, xValueExtent, innerWidth],
  );

  const binnedData = useMemo(() => {
    const [start, stop] = xScale.domain();
    return bin()
      .value(xValue)
      .domain(xScale.domain())
      .thresholds(50)(eventData) // 50 -> Makes ~50 "bins" -> actual number depends on input size, we always get evenly spaced result
      .map((array) => ({
        y: sum(array, yValue),
        x0: array.x0,
        x1: array.x1,
      }));
  }, [xValue, xScale, eventData, yValue]);

  // Colorscale is used to interpolate color histogram bar rects depending on how many events occured
  const colorScale = (d) =>
    scaleLinear()
      .domain([
        0,
        d3.max(binnedData, function (d) {
          return d['y'];
        }),
      ])
      .range(['red', 'blue'])
      .interpolate(interpolateRgb.gamma(2.2))(d);

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, d3.max(binnedData, (d) => d.y)])
        .range([innerHeight, 0])
        .nice(),
    [binnedData, innerHeight],
  );

  useEffect(() => {
    const brush = brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);
    brush(select(brushRef.current));
    brush.on('brush end', (event) => {
      setBrushExtent(event.selection && event.selection.map(xScale.invert));
    });
  }, [innerWidth, innerHeight]);

  return (
    <>
      <rect width={width} height={height} fill='white' />
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AxisBottom xScale={xScale} innerHeight={innerHeight} tickOffset={10} />
        <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={8} />
        <text
          className='axis-label'
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor='middle'
        >
          {xAxisLabel}
        </text>
        <text
          className='axis-label'
          textAnchor='middle'
          transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>
        <Marks
          binnedData={binnedData}
          xScale={xScale}
          yScale={yScale}
          tooltipFormat={(d) => d}
          innerHeight={innerHeight}
          colorScale={colorScale}
        />
        <g ref={brushRef} />
      </g>
    </>
  );
};

export default BrushableTimeline;
