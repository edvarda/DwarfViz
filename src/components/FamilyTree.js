import * as d3 from 'd3';
import { useDwarfViz } from '../hooks/useDwarfViz.js';
import './FamilyTree.scss';
import LinkTypes from './LinkTypes.js';

const Marks = ({ width, height, familyTree }) => {
  const { selectHF } = useDwarfViz();
  console.log(familyTree);
  const parentScale = d3
    .scaleBand()
    .domain(familyTree.parents.map((x) => x.id))
    .rangeRound([0, width])
    .align(0.5);

  const rootScale = d3
    .scaleBand()
    .domain(familyTree.root.map((x) => x.id))
    .rangeRound([0, width])
    .align(0.5);

  const childrenScale = d3
    .scaleBand()
    .domain(familyTree.children.map((x) => x.id))
    .rangeRound([0, width])
    .align(0.5);

  const getRadius = (bandwidth) =>
    bandwidth < (height / 3) * 0.2 ? bandwidth * 0.7 : (height / 3) * 0.2;

  return (
    <g className={'marks'}>
      {familyTree.parents.map((person, i, arr) => (
        <>
          <circle
            key={'familyTree' + person.id}
            cx={parentScale(person.id) + parentScale.bandwidth() / 2}
            r={getRadius(parentScale.bandwidth())}
            onClick={() => selectHF(person.id)}
            cy={height / 6}
          />
          <text
            x={parentScale(person.id) + parentScale.bandwidth() / 2}
            y={height / 6 + getRadius(parentScale.bandwidth())}
            textAnchor={'middle'}
          >{`${person.familyLabel}`}</text>
        </>
      ))}
      {familyTree.root.map((person, i, arr) => (
        <>
          <circle
            key={'familyTree' + person.id}
            cx={rootScale(person.id) + rootScale.bandwidth() / 2}
            r={getRadius(rootScale.bandwidth())}
            onClick={() => selectHF(person.id)}
            cy={height / 2}
          />
          <text
            x={rootScale(person.id) + rootScale.bandwidth() / 2}
            y={height / 2 + getRadius(rootScale.bandwidth())}
            textAnchor={'middle'}
          >{`${person.familyLabel}`}</text>
        </>
      ))}
      {familyTree.children.map((person, i, arr) => (
        <>
          <circle
            key={'familyTree' + person.id}
            cx={childrenScale(person.id) + childrenScale.bandwidth() / 2}
            r={getRadius(childrenScale.bandwidth())}
            onClick={() => selectHF(person.id)}
            cy={(height / 6) * 5}
          />
          <text
            x={childrenScale(person.id) + childrenScale.bandwidth() / 2}
            y={(height / 6) * 5 + getRadius(childrenScale.bandwidth())}
            textAnchor={'middle'}
          >{`${person.familyLabel}`}</text>
        </>
      ))}
    </g>
  );
};

const Levels = ({ width, height }) => {
  return (
    <g>
      <rect className={'parentLevel'} y={0} height={height / 3} width={width} />
      <rect className={'rootLevel'} y={height / 3} height={height / 3} width={width} />
      <rect className={'childLevel'} y={2 * (height / 3)} height={height / 3} width={width} />
    </g>
  );
};

const FamilyTree = ({ width, height }) => {
  const {
    state: { historicalFigures },
    selectedItems: { historicalFigure: selectedFigure },
  } = useDwarfViz();

  const getOtherFigureFromLink = (link) => ({
    ...historicalFigures.find((x) => x.id === link.hf_id_other),
    familyLabel: link.link_type,
  });
  const constructFamilyTree = (selectedFigure) => ({
    children: selectedFigure.links
      .filter((link) => LinkTypes.child.includes(link.link_type))
      .map(getOtherFigureFromLink),
    parents: selectedFigure.links
      .filter((link) => LinkTypes.parent.includes(link.link_type))
      .map(getOtherFigureFromLink),
    root: [
      selectedFigure,
      ...selectedFigure.links
        .filter((link) => LinkTypes.partner.includes(link.link_type))
        .map(getOtherFigureFromLink),
    ],
  });
  console.log(selectedFigure);
  const familyTree = constructFamilyTree(selectedFigure);
  return (
    <svg width={width} height={height}>
      <Levels width={width} height={height} />
      <Marks width={width} height={height} familyTree={familyTree} />
      <g id='parentGroup'></g>
      <g id='rootGroup'></g>
      <g id='childrenGroup'></g>
    </svg>
  );
};

export default FamilyTree;
