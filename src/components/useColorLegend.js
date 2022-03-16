import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

const useColorLegend = (keys) => {
  const createInitialState = (array) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item]: true,
      };
    }, initialValue);
  };
  const svgRef = useRef(null);

  const [categories, setCategories] = useState(createInitialState(keys));
  const colors = d3.schemeCategory10.slice(0, keys.length);
  const colorScale = d3.scaleOrdinal().domain(Object.keys(categories)).range(colors);

  const toggleCategory = (category) =>
    setCategories({ ...categories, [category]: !categories[category] });

  const ColorLegend = ({ height }) => {
    const margin = { top: 40, left: 10 };
    const [width, setWidth] = useState(0);
    const tickSpacing = 35;
    const tickSize = 8;
    const tickTextOffset = 20;

    useEffect(() => {
      const width = svgRef.current.parentElement.getBoundingClientRect().width;
      setWidth(width);
    }, []);

    return (
      <svg className={'colorLegend'} width={width} height={height} ref={svgRef}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {colorScale.domain().map((domainValue, i) => {
            return (
              <g
                className={`tick ${categories[domainValue] ? `active` : ``}`}
                transform={`translate(0,${i * tickSpacing})`}
              >
                <circle
                  fill={colorScale(domainValue)}
                  stroke={colorScale(domainValue)}
                  r={tickSize}
                  onClick={() => toggleCategory(domainValue)}
                />

                <text x={tickTextOffset} dy='.32em'>
                  {_.startCase(domainValue)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return { colorScale, categories, ColorLegend };
};

export { useColorLegend };
