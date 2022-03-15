import { useRef, useEffect, useMemo, useState } from 'react';
import { useDwarfViz } from '../hooks/useDwarfViz';
import { Row, Col } from 'react-bootstrap';
import useTooltip from '../hooks/useTooltip';
import ReactTooltip from 'react-tooltip';
import * as d3 from 'd3';
import _ from 'lodash';
import { useColorLegend } from './useColorLegend';

const CirclePacking = () => {
  const {
    data: { entities },
    societyView: { selectedItem: selectedEntity },
    selectEntity,
    find,
  } = useDwarfViz();
  const { entityTooltip } = useTooltip();
  const svgRef = useRef(null);
  const circles = useRef(null);
  const labels = useRef(null);
  const zoomRef = useRef();
  const [size, setSize] = useState(null);
  const entityTypes = useMemo(() => _.uniq(entities.map((x) => x.type)), [entities]);
  const { colorScale, ColorLegend } = useColorLegend(entityTypes);

  const color = d3
    .scaleLinear()
    .domain([1, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  const data = useMemo(() => {
    const getChildren = (entity) =>
      entity.entity_link.filter((x) => x.type === 'CHILD').map((link) => find.entity(link.target));

    const getSubTree = (entity) => {
      return {
        entity,
        children: [...getChildren(entity).map((child) => getSubTree(child))],
      };
    };

    const isRootLevelEntity = (entity) =>
      _.every(entity.entity_link, (link) => link.type !== 'PARENT');

    const races = ['dwarf', 'elf', 'human', 'goblin', null];
    return {
      children: [
        ...entities
          .filter((e) => isRootLevelEntity(e) && races.includes(e.race))
          .map((e) => getSubTree(e)),
      ],
    };
  }, [entities]);

  useEffect(() => {
    if (!size) return;
    const { width, height } = size;

    const pack = (data) =>
      d3.pack().size([width, height]).padding(3)(
        d3
          .hierarchy(data)
          .sum((d) => {
            return 1;
          })
          .sort(function (a, b) {
            return b.value - a.value;
          }),
      );
    const root = pack(data);

    let focus = root;
    let view;

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
      .style('display', 'block')
      .style('cursor', 'pointer')
      .on('click', () => zoom(root))
      .append('g');

    const node = svg
      .selectAll('circle')
      .data(root.descendants().slice(1))
      .join('circle')
      .attr('fill', (d) =>
        colorScale.domain().includes(d.data.entity.type)
          ? colorScale(d.data.entity.type)
          : color(d.depth),
      )
      .attr('data-tip', (d) => {
        if (d.data.entity) {
          return entityTooltip(d.data.entity);
        }
      })
      .on('mouseover', function () {
        d3.select(this).attr('stroke', '#000');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', null);
      })
      .on('click', (event, d) => {
        if (focus !== d) {
          zoom(d);
        }
        event.stopPropagation();
        return;
      });

    const label = svg
      .selectAll('text')
      .data(root.descendants().slice(1))
      .join('text')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .text((d) => (d.data.entity.race ? d.data.entity.race : ''))
      .style('font-size', (d) => `${d.r * 0.7}px`)
      .style('fill-opacity', (d) => (d.parent === root ? 1 : 0))
      .style('display', (d) => (d.parent === root ? 'inline' : 'none'));

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr('r', (d) => d.r * k);
    }

    function zoom(d) {
      focus = d;
      let zoomDistance = d.depth === 0 ? 1 : d.depth * 1.8;
      const transition = svg
        .transition()
        .duration(750)
        .tween('zoom', (d) => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 * zoomDistance]);
          return (t) => zoomTo(i(t));
        })
        .end()
        .then(() => {
          if (d.data.entity) {
            selectEntity(d.data.entity.id);
          }
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

    view = [root.x, root.y, root.r * 2];

    if (selectedEntity) {
      const d = root
        .descendants()
        .slice(1)
        .find((d) => d.data.entity.id === selectedEntity.id);
      zoom(d);
    } else {
      zoomTo(view);
    }

    ReactTooltip.rebuild();

    return () => svg.node();
  }, [size, data]);

  useEffect(() => {
    setSize({
      width: svgRef.current.parentElement.offsetWidth,
      height: svgRef.current.parentElement.offsetWidth,
    });
  }, [svgRef]);

  return (
    <Row>
      <Col className='col-sm-9'>
        <svg className={'circlePacking'} ref={svgRef} />
      </Col>
      <Col className='col-sm-3'>
        <ColorLegend height={size ? size.height : 0} />
      </Col>
    </Row>
  );
};

export default CirclePacking;
