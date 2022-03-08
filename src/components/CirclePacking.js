import { useRef, useEffect } from 'react';
import { useDwarfViz } from '../hooks/useDwarfViz';
import cssColors from '../App.scss';
import * as d3 from 'd3';
import _ from 'lodash';

const CirclePacking = ({ width, height }) => {
  const {
    state: { entities, historicalFigures },
    selectedItems: { entity: selectedEntity },
    selectHF,
    selectEntity,
  } = useDwarfViz();
  const svgRef = useRef(null);

  const getChildEntities = (civ_entity) =>
    entities.filter((x) =>
      civ_entity.entity_link.find((link) => link.target === x.id && link.type === 'CHILD'),
    );

  const getCivSubtree = (civ) => {
    const subtree = _.uniq(getChildEntities(civ).map((childEntity) => childEntity.type)).map(
      (entity_type) => ({
        name: entity_type,
        type: 'Type of child-entity',
        children: [
          ...getChildEntities(civ)
            .filter((entity) => entity_type === entity.type)
            .map((entity) => ({
              name: entity.name,
              type: 'Entity',
              isEntity: true,
              id: entity.id,
              children: entity.entity_position.map((position) => ({
                name: position.name,
                type: 'Social Position',
                value: 1,
                assignment: entity.entity_position_assignment.find(
                  (assignment) => position.local_id === assignment.position_id,
                ),
              })),
            })),
        ],
      }),
    );
    return subtree;
  };

  const data = {
    name: 'root',
    children: [
      {
        name: 'Social entities',
        type: 'Social entities',
        children: ['dwarf', 'elf', 'human', 'goblin', 'kobold'].map((raceName) => ({
          type: 'Race',
          name: raceName,
          children: [
            ...entities
              .filter((x) => x.type === 'civilization' && raceName === x.race)
              .map((civ) => ({
                type: 'Civilization',
                name: civ.name,
                isEntity: true,
                id: civ.id,
                children: [...getCivSubtree(civ)],
              })),
          ],
        })),
      },
    ],
  };

  const color = d3
    .scaleLinear()
    .domain([1, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  const pack = (data) =>
    d3.pack().size([width, height]).padding(3)(
      d3
        .hierarchy(data)
        .sum((d) => {
          return d.value;
        })
        .sort(function (a, b) {
          return b.value - a.value;
        }),
    );

  const zoomFunctionRef = useRef();

  useEffect(() => {
    const root = pack(data);
    let focus = root;
    let view;

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
      .style('display', 'block')
      .style('margin', '0 -14px')
      .style('cursor', 'pointer')
      .on('click', () => zoom(root));

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(root.descendants().slice(1))
      .join('circle')
      .attr('fill', (d) => (d.children ? color(d.depth) : cssColors.peopleColor))
      // .attr('pointer-events', (d) => (!d.children ? 'none' : null))
      .on('mouseover', function () {
        d3.select(this).attr('stroke', '#000');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', null);
      })
      .on('click', (event, d) => {
        if (!d.children && d.data.assignment) {
          selectHF(d.data.assignment.hf_id);
        } else if (focus !== d) {
          zoom(d);
        }
        event.stopPropagation();
        return;
      });

    const label = svg
      .append('g')
      .style('font', '2em leto')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(root.descendants())
      .join('text')
      .style('fill-opacity', (d) => (d.parent === root ? 1 : 0))
      .style('display', (d) => (d.parent === root ? 'inline' : 'none'))
      .text((d) => d.data.name);

    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr('r', (d) => d.r * k);
    }

    // Can sent
    function zoom(d) {
      // const focus0 = focus;
      if (((d.data.isEntity ?? false) && !selectedEntity) || selectedEntity.id !== d.data.id) {
        selectEntity(d.data.id);
      }

      focus = d;

      const transition = svg
        .transition()
        .duration(750)
        .tween('zoom', (d) => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return (t) => zoomTo(i(t));
        });

      label
        .filter(function (d) {
          return d.parent === focus || this.style.display === 'inline';
        })
        .transition(transition)
        .style('fill-opacity', (d) => (d.parent === focus ? 1 : 0))
        .on('start', function (d) {
          if (d.parent === focus) this.style.display = 'inline';
        })
        .on('end', function (d) {
          if (d.parent !== focus) this.style.display = 'none';
        });
    }

    zoomFunctionRef.current = (entityId) => {
      const target = root.find((d) => (d.data.isEntity ?? false) && d.data.id === entityId);
      zoom(target);
    };

    return svg.node();
  }, []);

  useEffect(() => {
    console.log('selected new entity');
    if (selectedEntity) zoomFunctionRef.current(selectedEntity.id);
  }, [selectedEntity]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default CirclePacking;
