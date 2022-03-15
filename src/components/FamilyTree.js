import * as d3 from 'd3';
import { useState, useCallback, useEffect } from 'react';
import { useDwarfViz } from '../hooks/useDwarfViz.js';
import './GraphStyles.scss';
import LinkTypes from './LinkTypes.js';
import useTooltip from '../hooks/useTooltip.js';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';

const MaleGlyph = ({ x, y }) => (
  <path
    transform={`translate(${x - 24},${y - 24}) scale(2)`}
    className={'genderGlyph'}
    d='M9.5,11c1.93,0,3.5,1.57,3.5,3.5S11.43,18,9.5,18S6,16.43,6,14.5S7.57,11,9.5,11z M9.5,9C6.46,9,4,11.46,4,14.5 S6.46,20,9.5,20s5.5-2.46,5.5-5.5c0-1.16-0.36-2.23-0.97-3.12L18,7.42V10h2V4h-6v2h2.58l-3.97,3.97C11.73,9.36,10.66,9,9.5,9z'
  />
);

const FemaleGlyph = ({ x, y }) => (
  <path
    transform={`translate(${x - 24},${y - 24})  scale(2)`}
    className={'genderGlyph'}
    d='M17.5,9.5C17.5,6.46,15.04,4,12,4S6.5,6.46,6.5,9.5c0,2.7,1.94,4.93,4.5,5.4V17H9v2h2v2h2v-2h2v-2h-2v-2.1 C15.56,14.43,17.5,12.2,17.5,9.5z M8.5,9.5C8.5,7.57,10.07,6,12,6s3.5,1.57,3.5,3.5S13.93,13,12,13S8.5,11.43,8.5,9.5z'
  />
);

const Marks = ({ width, familyTree, selectedFigure }) => {
  const { find } = useDwarfViz();

  const height = width;

  const { hfTooltip } = useTooltip();
  const { selectHF } = useDwarfViz();
  const scale = () => d3.scaleBand().rangeRound([0, width]).align(0.5);

  const parents = {
    scale: scale().domain(familyTree.parents.map((x) => x.id)),
    yPos: height / 6,
  };
  const root = { scale: scale().domain(familyTree.root.map((x) => x.id)), yPos: height / 2 };
  const children = {
    scale: scale().domain(familyTree.children.map((x) => x.id)),
    yPos: (height / 6) * 5,
  };

  const linksGenerator = d3.linkVertical();

  const getRadius = (bandwidth) =>
    bandwidth < (height / 3) * 0.2 ? bandwidth * 0.7 : (height / 3) * 0.2;

  const getCx = (scale, id) => scale(id) + scale.bandwidth() / 2;
  const Node = ({ person, scale, yPos }) => (
    <>
      <circle
        className={person.isRoot ? 'selected' : ''}
        key={'familyTree' + person.id}
        cx={getCx(scale, person.id)}
        r={getRadius(scale.bandwidth())}
        onClick={() => selectHF(person.id)}
        cy={yPos}
        data-tip={hfTooltip(person)}
      />
      {person.caste === 'female' ? (
        <FemaleGlyph x={getCx(scale, person.id)} y={yPos} />
      ) : (
        <MaleGlyph x={getCx(scale, person.id)} y={yPos} />
      )}

      <text
        className={'link-label'}
        x={scale(person.id) + scale.bandwidth() / 2}
        y={yPos - getRadius(scale.bandwidth()) * 1.2}
        textAnchor={'middle'}
      >
        {`${_.startCase(person.familyLabel)}`}
      </text>

      {person.name.split(' ').map((namePart, i) => (
        <text
          className={'node-label'}
          x={scale(person.id) + scale.bandwidth() / 2}
          y={yPos + 1.6 * getRadius(scale.bandwidth())}
          dy={`${i}rem`}
          textAnchor={'middle'}
        >
          {`${_.startCase(namePart)}`}
        </text>
      ))}
    </>
  );

  const getParent = (child) => {
    const parentId = child.links.find(
      (link) =>
        ['mother', 'father'].includes(link.link_type) && link.hf_id_other !== selectedFigure.id,
    ).hf_id_other;
    return find.hf(parentId);
  };
  const hasParentInTree = (child) => {
    const parent = getParent(child);
    return parent ? !!familyTree.root.find((partner) => partner.id === parent.id) : false;
  };

  const links = () => [
    ...familyTree.parents.map((parent) => ({
      label: parent.familyLabel,
      source: [getCx(parents.scale, parent.id), parents.yPos],
      target: [getCx(root.scale, familyTree.root[0].id), root.yPos],
    })),
    ...familyTree.children.map((child) => ({
      label: child.familyLabel,
      target: [getCx(root.scale, familyTree.root[0].id), root.yPos],
      source: [getCx(children.scale, child.id), children.yPos],
    })),
    ...familyTree.children
      .filter((child) => hasParentInTree(child))
      .map((child) => ({
        target: [getCx(root.scale, getParent(child).id), root.yPos],
        source: [getCx(children.scale, child.id), children.yPos],
      })),
  ];

  return (
    <g className={'marks'}>
      {links().map((link) => (
        <>
          <path d={linksGenerator(link)}></path>
        </>
      ))}
      {familyTree.parents.map((person, i, arr) => (
        <Node person={person} scale={parents.scale} yPos={parents.yPos} />
      ))}
      {familyTree.root.map((person, i, arr) => (
        <Node person={person} scale={root.scale} yPos={root.yPos} />
      ))}
      {familyTree.children.map((person, i, arr) => (
        <Node person={person} scale={children.scale} yPos={children.yPos} />
      ))}
    </g>
  );
};

const FamilyTree = () => {
  const {
    data: { historicalFigures },
    peopleView: { selectedItem: selectedFigure },
  } = useDwarfViz();

  const getOtherFigureFromLink = (link) => ({
    ...historicalFigures.find((x) => x.id === link.hf_id_other),
    familyLabel: link.link_type,
  });

  const constructFamilyTree = (selectedFigure) => {
    return {
      children: selectedFigure.links
        .filter((link) => LinkTypes.child.includes(link.link_type))
        .map(getOtherFigureFromLink),
      parents: selectedFigure.links
        .filter((link) => LinkTypes.parent.includes(link.link_type))
        .map(getOtherFigureFromLink),
      root: [
        { ...selectedFigure, isRoot: true },
        ...selectedFigure.links
          .filter((link) => LinkTypes.partner.includes(link.link_type))
          .map(getOtherFigureFromLink),
      ],
    };
  };

  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const widthCallback = useCallback((node) => {
    if (node !== null) {
      setTimeout(function () {
        const width = node.parentElement.getBoundingClientRect().width;
        setWidth(width);
        setHeight(width);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const marginBottom = 25;
  return (
    <svg className={'graph-viz'} ref={widthCallback} width={width} height={height}>
      <g transform={`translate(0,${-marginBottom})`}>
        {width > 0 && (
          <Marks
            width={width}
            familyTree={constructFamilyTree(selectedFigure)}
            selectedFigure={selectedFigure}
          />
        )}
      </g>
    </svg>
  );
};

export default FamilyTree;
