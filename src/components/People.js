import { Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import { useDwarfViz } from '../hooks/useDwarfViz';
import HfDetails from './HfDetails';
import FamilyTree from './FamilyTree.js';
import RelationshipGraph from './RelationshipGraph.js';
import HistoryControls from './HistoryControls.js';

const People = () => {
  const {
    peopleView: { selectedItem: selectedFigure },
    VIEWS,
  } = useDwarfViz();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <Row className={'d-flex flex-row'}>
        <Row>
          <Col>
            <HistoryControls view={VIEWS.PEOPLE} />
          </Col>
        </Row>
        <Col className={'d-flex flex-wrap'}>
          {selectedFigure && <HfDetails hf={selectedFigure} />}
        </Col>
        <Col className={''}>
          {selectedFigure && <FamilyTree width={400} height={300} />}
          {selectedFigure && <RelationshipGraph width={400} height={400} />}
        </Col>
      </Row>
    </>
  );
};

export default People;
