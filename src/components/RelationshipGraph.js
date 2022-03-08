import * as d3 from 'd3';
import { useDwarfViz } from '../hooks/useDwarfViz.js';
import linkTypes from './LinkTypes.js';
import ItemLink from './ItemLink.js';
import _ from 'lodash';

const data = {
  children: [
    {
      name: 'boss1',
      children: [
        {
          name: 'mister_a',
          colname: 'level3',
        },
        {
          name: 'mister_b',
          colname: 'level3',
        },
        {
          name: 'mister_c',
          colname: 'level3',
        },
        {
          name: 'mister_d',
          colname: 'level3',
        },
      ],
      colname: 'level2',
    },
    {
      name: 'boss2',
      children: [
        {
          name: 'mister_e',
          colname: 'level3',
        },
        {
          name: 'mister_f',
          colname: 'level3',
        },
        {
          name: 'mister_g',
          colname: 'level3',
        },
        {
          name: 'mister_h',
          colname: 'level3',
        },
      ],
      colname: 'level2',
    },
  ],
  name: 'CEO',
};

const RelationshipGraph = ({ width, height }) => {
  const {
    state: { historicalFigures },
    selectedItems: { historicalFigure: selectedFigure },
    selectHF,
  } = useDwarfViz();

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
          other: historicalFigures.find((x) => x.id === link.hf_id_other),
        }));

    const fromVagueRelationships = (hf) =>
      hf.vague_relationship.map((relation) => {
        const { hf_id, hf_id_other, ...relationshipTypes } = relation;
        const [type] = Object.entries(relationshipTypes).find(
          ([type, isOfType]) => isOfType === true,
        );
        return {
          type: _.capitalize(type.replace('_', ' ')),
          other: historicalFigures.find((x) => x.id === hf_id_other),
        };
      });

    const fromRelationshipProfile = (hf) =>
      hf.relationship_profile_hf.map((relation) => {
        const [type] = Object.entries(relation).find(
          ([value, key]) => value.includes('rep_') && value !== null,
        );
        return {
          type: type.substring(3),
          other: historicalFigures.find((x) => x.id === relation.hf_id_other),
        };
      });

    // Get links with types not in family tree
    // Get vague relationships with prop not null
    // Get relationship_profile with any rep_* not null
    // Set id of other hf. Name. Nature of relation.
    return [...fromLinks(hf), ...fromVagueRelationships(hf), ...fromRelationshipProfile(hf)];
  };

  const radius = width / 2;
  const margin = 50;
  const cluster = d3.cluster().size([360, radius - margin]);

  const newData = {
    name: selectedFigure.name,
    children: getRelationships(selectedFigure),
  };

  console.log('data', newData);
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
            onClick={() => selectHF(d.data.other.id)}
          >
            <circle r={7} fill={'red'} stroke={'black'} strokeWidth={2}></circle>
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
