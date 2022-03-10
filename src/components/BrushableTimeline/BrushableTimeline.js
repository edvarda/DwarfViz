import { brushX, select, scaleLinear, max, extent, bin, interpolateRgb, sum } from 'd3';

import { useRef, useMemo, useEffect, useState } from 'react';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';
import { useDwarfViz } from '../../hooks/useDwarfViz';

const d3 = { max };

const margin = {
  top: 10,
  right: 0,
  bottom: 0,
  left: 65,
};

const xAxisLabelOffset = 40;
const yAxisLabelOffset = 50;
const xAxisLabel = 'Year';
const yAxisLabel = 'Events';

const yValue = (d) => +1; // +1 per event
const xValue = (d) => d['year'];

const BrushableTimeline = ({ width, height, setYearRange, historicalEvents }) => {
  const {
    data: { worldsInfo },
  } = useDwarfViz();
  //const [brushExtent, setYearRange] = useState();

  const maxYears = worldsInfo[0].year;
  const xValueExtent = useMemo(() => {
    return [-1, ...Array(maxYears + 1).keys()];
  }, [maxYears]); // -1, 0, 1, 2, 3,... up to maxYears (e.g. 125)

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xScale = useMemo(
    () => scaleLinear().domain(extent(xValueExtent)).range([0, innerWidth]),
    [xValueExtent, innerWidth],
  );
  const [xStart, xStop] = xScale.domain();
  const binnedData = useMemo(() => {
    return bin()
      .value(xValue)
      .domain(xScale.domain())
      .thresholds(xStop)(historicalEvents) // 50 instead of xStop -> Makes ~50 "bins" -> actual number depends on input size, we always get evenly spaced result
      .map((array) => ({
        y: sum(array, yValue),
        x0: array.x0,
        x1: array.x1,
      }));
  }, [xScale, historicalEvents, xStop]);

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
        .clamp(true)
        .domain([0, d3.max([d3.max(binnedData, (d) => d.y),1])])
        .range([innerHeight, 0])
        .nice(),
    [binnedData, innerHeight],
  );
  
  const brushRef = useRef();
  useEffect(() => {
    const brush = brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);
    brush(select(brushRef.current));
    brush.on('brush end', (event) => {
      if (event.selection && event.sourceEvent) {
        const yearSelection = event.selection.map(xScale.invert);
        setYearRange(yearSelection);
      } else {
        // This makes it so that upon deselecting the timeline, every year is shown again
        setYearRange();
      }
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
          style={{ fontWeight: 'bold' }}
        >
          {xAxisLabel}
        </text>
        <text
          className='axis-label'
          textAnchor='middle'
          transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
          style={{ fontWeight: 'bold' }}
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
