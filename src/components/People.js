import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Row, Col, Container } from 'react-bootstrap';

import { useDwarfViz } from '../hooks/useDwarfViz';
import HfDetails from './HfDetails';
import RelatedEntitiesDetails from './RelatedEntitiesDetails';
import HfDetailSkills from './HfDetailSkills';
import FamilyTree from './FamilyTree.js';
import RelationshipGraph from './RelationshipGraph.js';
import HistoryControls from './HistoryControls.js';
import _ from 'lodash';
import { Events } from './';

const People = () => {
  const {
    peopleView: { selectedItem: selectedFigure, isActive: isViewActive },
    VIEWS,
    selectHF,
    setActiveView,
  } = useDwarfViz();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <div className='view-title' onClick={() => setActiveView('peopleView')}>
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
                      <h1>{_.startCase(selectedFigure.name)}</h1>

                      <HfDetails hf={selectedFigure} />

                      <HfDetailSkills hf={selectedFigure} />

                      <RelatedEntitiesDetails hf={selectedFigure} />
                    </Col>
                    <Col className={'col-sm-6'}>
                      <div className={'view-element'}>{selectedFigure && <FamilyTree />}</div>
                      <div className={'view-element'}>
                        {selectedFigure && <RelationshipGraph />}
                      </div>
                    </Col>
                    {/* <Col className={'col-sm-4'}>
                    </Col> */}
                  </Row>
                  <Row>
                    <Events />
                  </Row>
                </>
              ) : (
                <Col>
                  <div className={'view-element noSelection'}>
                    {`Select a historical figure from `}
                    <span className='site-link' onClick={() => setActiveView('placesView')}>
                      Places
                    </span>
                    {` or `}
                    <span
                      className='entity-link'
                      onClick={() => {
                        setActiveView('societyView');
                      }}
                    >
                      Society
                    </span>
                  </div>
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
