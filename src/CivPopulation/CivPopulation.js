import './stylesCiv.css';
import { scaleBand, scaleLinear, max , selectm, format, axisBottom, axisLeft, select} from 'd3';
import React, { useEffect, useRef } from 'react';

export const CivPopulation = ({entityPopulation, width, height}) => {
    const svgRef = useRef(null);

    //prepare our data 
    console.log(entityPopulation);
    const aggregateObject = entityPopulation.reduce((aggregateObject, nextValue) => {
        aggregateObject[nextValue.races[0].split(':')[0]] =
          (aggregateObject[nextValue.races[0].split(':')[0]] || 0) + +nextValue.races[0].split(':')[1];
        return aggregateObject;
    }, {});
    console.log(aggregateObject);
    const processedData = Object.entries(aggregateObject).map(([race, population]) => ({ race, population }));
    console.log(processedData);

    function renderGraph(){
        const svg = select(svgRef.current);
        svg.selectAll('g').remove();    // remove 'g' elements from each svg to ensure that if we pass another data set, text and legends are removed from the previously rendered SVG to avoid left behind elements
        svg.attr('width', width).attr('height', height);

        const xValue = d => d.population;
        const yValue = d => d.race.replace(/_/g, ' ');

        const margin = { top: 35, right: 20, bottom: 20, left: 100 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const chartTitle = 'Entity race population'
        
        const xScale = scaleLinear()
            .domain([0, max(processedData.map(xValue))])
            .range([0, innerWidth]);
        
        console.log(processedData.map(yValue));
        const yScale = scaleBand()
            .domain(processedData.map(yValue))
            .range([0, innerHeight])
            .padding(0.1);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const xAxisTickFormat = number =>
            format('.2s')(number)
                .replace('G', 'B');

        const xAxis = axisBottom(xScale)
            .tickFormat(xAxisTickFormat)
            .tickSize(-innerHeight);

        g.append('g')
            .call(axisLeft(yScale))
            .selectAll('.domain, .tick line')
              .remove();
          
        const xAxisG = g.append('g').call(xAxis)
            .attr('transform', `translate(0,${innerHeight})`);
          
        xAxisG.select('.domain').remove();
          
        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 65)
            .attr('x', innerWidth / 2)
            .attr('fill', 'black')
            .text('Population');
        
        g.selectAll('rect').data(processedData)
            .enter().append('rect')
            .attr('class', 'popBar')
            .attr('y', d => yScale(yValue(d)))
            .attr('width', d => xScale(xValue(d)))
            .attr('height', yScale.bandwidth());
        
        g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .text(chartTitle);
    }

    useEffect(() => {
        renderGraph();
    }, [entityPopulation]);

    return (
        <svg ref={svgRef} style={{border: "3px solid blue"}}/>
    );
    
};