import { scaleBand, scaleLinear, max } from 'd3';
import _ from 'lodash';

const colors = [
  '#00876c',
  '#549a73',
  '#83ad80',
  '#abc093',
  '#d1d4ab',
  '#f2e8c8',
  '#e9cc9f',
  '#e5ae7d',
  '#e18d63',
  '#dc6855',
  '#d43d51',
];

const width = 500;
const height = 500;
const margin = { top: 20, right: 20, bottom: 20, left: 100 };

export const StackedBarChart = ({ data }) => {
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  const aggregateObject = data.reduce((aggregateObject, nextValue) => {
    aggregateObject[nextValue.type] =
      (aggregateObject[nextValue.type] || 0) + nextValue.coords.length;
    return aggregateObject;
  }, {});
  const processedData = Object.entries(aggregateObject).map(([type, area]) => ({ type, area }));

  const yScale = scaleLinear()
    .domain([0, max(processedData.map((d) => d.area))])
    .range([0, innerHeight]);

  const xScale = scaleBand()
    .domain(processedData.map((d) => d.type))
    .range([0, innerWidth]);

  console.log(processedData);
  console.log(yScale.ticks());
  console.log(xScale.domain());
  return (
    <svg width={width} height={height} style={{ border: `3px solid ${colors[0]}` }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {xScale.domain().map((category) => (
          <text
            key={category}
            style={{ textAnchor: 'middle' }}
            y={innerHeight}
            dy='1em'
            x={xScale(category) + xScale.bandwidth() / 2}
          >
            {category}
          </text>
        ))}
        {yScale.ticks().map((tickValue) => (
          <g key={tickValue} transform={`translate(0,${innerHeight - yScale(tickValue)})`}>
            <line x2={innerWidth} stroke='black' />
            <text style={{ textAnchor: 'end' }} dx={'-.5em'}>
              {tickValue}
            </text>
          </g>
        ))}
        {processedData.map((d, i) => (
          <rect
            key={d.type}
            x={xScale(d.type)}
            y={innerHeight - yScale(d.area)}
            width={xScale.bandwidth()}
            height={yScale(d.area)}
            fill={colors[i]}
          />
        ))}
      </g>
    </svg>
  );
};
