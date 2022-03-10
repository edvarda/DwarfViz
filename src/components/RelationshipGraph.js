import * as d3 from 'd3';
import { useDwarfViz } from '../hooks/useDwarfViz.js';
import linkTypes from './LinkTypes.js';
import _ from 'lodash';
import useTooltip from '../hooks/useTooltip.js';

const RelationshipGraph = ({ width, height }) => {
  const {
    data: { historicalFigures },
    peopleView: { selectedItem: selectedFigure },
    selectHF,
  } = useDwarfViz();
  const { hfTooltip } = useTooltip();

  const getRelationships = (hf) => {
    const fromLinks = (hf) =>
      hf.links
        .filter((link) =>
          [...linkTypes.religion, ...linkTypes.apprentice, ...linkTypes.master].includes(
            link.link_type,
          ),
        )
        .map((link) => ({
          type: link.link_type,
          hf: historicalFigures.find((x) => x.id === link.hf_id_other),
        }));

    const fromVagueRelationships = (hf) =>
      hf.vague_relationship.map((relation) => {
        const { hf_id, hf_id_other, ...relationshipTypes } = relation;
        const [type] = Object.entries(relationshipTypes).find(
          ([type, isOfType]) => isOfType === true,
        );
        return {
          type: _.capitalize(type.replace('_', ' ')),
          hf: historicalFigures.find((x) => x.id === hf_id_other),
        };
      });

    const fromRelationshipProfile = (hf) =>
      hf.relationship_profile_hf.map((relation) => {
        const [type] = Object.entries(relation).find(
          ([value, key]) => value.includes('rep_') && value !== null,
        );
        return {
          type: type.substring(3),
          hf: historicalFigures.find((x) => x.id === relation.hf_id_other),
        };
      });
    return [...fromLinks(hf), ...fromVagueRelationships(hf), ...fromRelationshipProfile(hf)];
  };

  const radius = width / 2;
  const margin = 50;
  const cluster = d3.cluster().size([360, radius - margin]);

  const newData = {
    name: selectedFigure.name,
    hf: selectedFigure,
    children: getRelationships(selectedFigure),
  };

  const root = d3.hierarchy(newData, (d) => d.children);
  cluster(root);

  const linksGenerator = d3
    .linkRadial()
    .angle((d) => (d.x / 180) * Math.PI)
    .radius((d) => d.y);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${radius},${radius})`}>
        {root.links().map((link) => (
          <path stroke={'#ccc'} fill={'none'} d={linksGenerator(link)}></path>
        ))}
        {root.descendants().map((d) => (
          <g
            transform={`rotate(${d.x - 90})translate(${d.y})`}
            onClick={() => selectHF(d.data.hf.id)}
          >
            <circle
              r={7}
              fill={'red'}
              stroke={'black'}
              strokeWidth={2}
              data-tip={hfTooltip(d.data.hf)}
            ></circle>
            <text transform={`rotate(${-(d.x - 90)})`} textAnchor={'middle'} x={0} y={20}>
              {d.data.type}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default RelationshipGraph;
