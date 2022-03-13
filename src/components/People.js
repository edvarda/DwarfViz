import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Row, Col, Container } from 'react-bootstrap';

import { useDwarfViz } from '../hooks/useDwarfViz';
import HfDetails from './HfDetails';
import FamilyTree from './FamilyTree.js';
import RelationshipGraph from './RelationshipGraph.js';
import HistoryControls from './HistoryControls.js';
import { Events } from './';

const People = () => {
  const {
    peopleView: { selectedItem: selectedFigure, isActive: isViewActive },
    VIEWS,
  } = useDwarfViz();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <div className='view-title'>
        <h2>People</h2>
      </div>
      <div className={'view-content'}>
        {isViewActive && (
          <Container fluid>
            <Row>
              <Row>
                <Col>
                  <HistoryControls view={VIEWS.PEOPLE} />
                </Col>
              </Row>
              {selectedFigure ? (
                <>
                  <Row>
                    <Col className={'col-sm-6'}>
                      <div className={'view-element'}>
                        {selectedFigure && <HfDetails hf={selectedFigure} />}
                      </div>
                    </Col>
                    <Col className={'col-sm-6'}>
                      <div className={'view-element'}>
                        {selectedFigure && <FamilyTree width={400} height={300} />}
                      </div>
                      <div className={'view-element'}>
                        {selectedFigure && <RelationshipGraph width={400} height={400} />}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Events />
                  </Row>
                </>
              ) : (
                <Col>
                  <div className={'view-element noSelection'}>No person selected</div>
                </Col>
              )}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default People;
