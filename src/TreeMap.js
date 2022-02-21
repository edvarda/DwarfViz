import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

// Reference for data well-suited for treemaps (this code borrows heavily from it): https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json
// Great written treemap resource: https://medium.com/swlh/create-a-treemap-with-wrapping-text-using-d3-and-react-5ba0216c48ce
export const TreeMap = ({ writtenContents, poeticForms, musicalForms, danceForms, width, height }) => {
    const svgRef = useRef(null);
    const legendRef = useRef(null);
    const tooltipRef = useRef(null);
    // console.log(writtenContents);
    function renderTreemap(){
        const svg = d3.select(svgRef.current);
        svg.selectAll('g').remove();    // remove 'g' elements from each svg to ensure that if we pass another data set, text and legends are removed from the previously rendered SVG to avoid left behind elements
        const legendContainer = d3.select(legendRef.current);
        legendContainer.selectAll('g').remove();
        const tooltip = d3.select(tooltipRef.current);
        svg.attr('width', width).attr('height', height);
        // Before we do any treemapping, handle the data, convert to suitable format
        // Save the amount of occurences of each form of each type of art
        var poetryDict = new Object(); 
        var artworks = [];
        var musicDict = new Object(); 
        var danceDict  = new Object(); 
        console.log(writtenContents);
        for (let i = 0; i < writtenContents.length; i++){
            let formId = writtenContents[i].form_id;
            let formType = writtenContents[i].form;
            if (formId !== null){
                let formName = "";
                if (formType === "musical composition"){
                    formName = musicalForms[formId].name;
                // This intializes a dictionary using numeric values first time, next times increments by 1 - counts occurences
                    musicDict[formName] = (musicDict[formName] || 0) + 1;
                }
                else if (formType === "poem"){
                    formName = poeticForms[formId].name;
                    poetryDict[formName] = (poetryDict[formName] || 0) + 1;
                }
                else if (formType === "choreography"){
                    formName = danceForms[formId].name;
                    danceDict[formName] = (danceDict[formName] || 0) + 1;
                }
                // Create artwork object
                var artwork = {
                    title: writtenContents[i].title,
                    author: writtenContents[i].author,
                    style: writtenContents[i]?.style?.[0]?.label,
                    category: formType,
                    formName: formName,
                    formId: formId
                };
                artworks.push(artwork);
            }
        }
        // Now we have know many works there are of each form of art - first turn into proper objects that can be used later
        let root = [danceDict, musicDict, poetryDict];
        let rootNames = ["choreography", "musical composition", "poem"];
        var obj = {name:"Forms of art"};
        obj['children']=[];
        for (let i = 0; i < root.length; i++){
            var forms = [];
            for (const formName in root[i]) {
                var internalObj = {
                    name: formName,
                    value: root[i][formName],    // stores count
                    category: rootNames[i],
                    // store list of artworks associated with this form
                    artworks: artworks.filter(artwork => artwork.category === rootNames[i] && artwork.formName === formName)
                }
                forms.push(internalObj);
            }
            // create object nested in children of forms of art
            obj['children'][i] = {};
            obj['children'][i]['children'] = forms;
            obj['children'][i]['name'] = rootNames[i];
        }
        let hierarchy = d3.hierarchy(obj, (node) => {
            return node['children']
        }).sum((node) => {
            return node['value']
        }).sort((node1, node2) => {
            return node2['value'] - node1['value']
        });
        let createTreeMap = d3.treemap()
            .size([width,height]).padding(1);

        createTreeMap(hierarchy);
        
        let artworkTiles = hierarchy.leaves();
        console.log(artworkTiles);
        let block = svg.selectAll('g')
            .data(artworkTiles)
            .enter()
            .append('g')
            .attr('transform', (artwork) => {
                return 'translate(' + artwork['x0'] + ', ' + artwork['y0'] + ')'
            })

        
        const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader));
        block
            .append('rect')
            .attr('class', 'treemapTile')
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('fill', (d) => colorScale(d.data.category))  // d.data.name, category or value
            .on('mouseover', (artform) => {                       // mouseover effect for interaction with tiles
                tooltip.transition()
                    .style('visibility', 'visible')
                let data = artform['target']['__data__']['data'];
                let value = data['value']
                tooltip.html(
                    value + ' works of art.' + '<hr />' + data['name']
                )
    
                tooltip.attr('data-value', value)
            })
            .on('mouseout', (artwork) => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            });
        
        const fontSize = 12;

        block.append('text')
            .text((d) => `${d.data.name +'\n'} ${d.data.value}`)
            .attr('data-width', (d) => d.x1 - d.x0)
            .attr('font-size', `${fontSize}px`)
            .attr('x',3)
            .attr('y', fontSize)
            .call(wrapText);

        function wrapText(selection) {
            selection.each(function () {
                const node = d3.select(this);
                const rectWidth = +node.attr('data-width');
                let word;
                const words = node.text().split(' ').reverse();
                let line = [];
                const x = node.attr('x');
                const y = node.attr('y');
                let tspan = node.text('').append('tspan').attr('x', x).attr('y', y);
                let lineNumber = 0;
                while ( words.length > 1) {
                    word = words.pop();
                    line.push(word);
                    tspan.text(line.join(' '));
                    const tspanLength = tspan.node().getComputedTextLength();
                    if (tspanLength > rectWidth && line.length !== 1) {
                        line.pop();
                        tspan.text(line.join(' '));
                        line = [word];
                        tspan = addTspan(word);
                    }
                }
    
                addTspan(words.pop());
    
                function addTspan(text) {
                    lineNumber += 1;
                    return (
                        node
                            .append('tspan')
                            .attr('x', x)
                            .attr('y', y)
                            .attr('dy', `${lineNumber * fontSize}px`)
                            .text(text));
                }
            });
        }

        let categories = artworkTiles.map((node) => node.data.category);
        categories = categories.filter(
            (category, index, self) => self.indexOf(category) === index,
        );

        legendContainer.attr('width', width).attr('height', height / 4);

        const legend = legendContainer.selectAll('g').data(categories).join('g');

        legend
            .append('rect')
            .attr('width', fontSize)
            .attr('height', fontSize)
            .attr('x', fontSize)
            .attr('y', (_, i) => fontSize * 2 * i)
            .attr('fill', (d) => colorScale(d));
        
        legend
            .append('text')
            .attr('transform', `translate(0, ${fontSize})`)
            .attr('x', fontSize * 3)
            .attr('y', (_, i) => fontSize * 2 * i)
            .style('font-size', fontSize)
            .text((d) => d);
    }

    

    useEffect(() => {
        renderTreemap();
      }, [writtenContents, poeticForms, musicalForms, danceForms]);
    


    return (
        <div>
        <svg ref={svgRef} />
        <svg ref={legendRef}/>
        <div ref={tooltipRef}></div>
        </div>
    );

};
