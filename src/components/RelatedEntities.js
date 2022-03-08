import * as d3 from 'd3';
import { useDwarfViz } from '../hooks/useDwarfViz.js';

const RelatedEntities = ({ width, height }) => {
  const {
    data: { entities },
    peopleView: { selectedItem: selectedFigure },
    selectEntity,
  } = useDwarfViz();

  const getRelatedEntities = (hf) => {
    return hf.entity_link.map((link) => ({
      type: link.link_type,
      other: entities.find((x) => x.id === link.entity_id),
    }));
  };

  const radius = width / 2;
  const margin = 50;
  const cluster = d3.cluster().size([360, radius - margin]);

  const newData = {
    name: selectedFigure.name,
    children: getRelatedEntities(selectedFigure),
  };

  const root = d3.hierarchy(newData, (d) => d.children);
  cluster(root);

  const linksGenerator = d3
    .linkRadial()
    .angle((d) => (d.x / 180) * Math.PI)
    .radius((d) => d.y);

  console.log(newData);
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${radius},${radius})`}>
        {root.links().map((link) => (
          <path stroke={'#ccc'} fill={'none'} d={linksGenerator(link)}></path>
        ))}
        {root.descendants().map((d) =>
          d.depth === 0 ? (
            <g transform={`rotate(${d.x - 90})translate(${d.y})`}>
              <circle r={7} fill={'red'} stroke={'black'} strokeWidth={2}></circle>
              <text transform={`rotate(${-(d.x - 90)})`} textAnchor={'middle'} x={0} y={20}>
                {`${d.data.name}`}
              </text>
            </g>
          ) : (
            <g
              transform={`rotate(${d.x - 90})translate(${d.y})`}
              onClick={() => selectEntity(d.data.other.id)}
            >
              <circle r={7} fill={'red'} stroke={'black'} strokeWidth={2}></circle>
              <text transform={`rotate(${-(d.x - 90)})`} textAnchor={'middle'} x={0} y={20}>
                {`${d.data.type} of ${d.data.other.name}`}
              </text>
            </g>
          ),
        )}
      </g>
    </svg>
  );
};

export default RelatedEntities;
