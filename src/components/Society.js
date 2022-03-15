import { Row, Col, Container } from 'react-bootstrap';
import { Events } from './';
import { useDwarfViz } from '../hooks/useDwarfViz';
import CivPopulation from './CivPopulation/CivPopulation.js';
import CirclePacking from './CirclePacking';
import { EntityDetails } from './EntityDetails';
import HistoryControls from './HistoryControls.js';
import ReactTooltip from 'react-tooltip';
import { useEffect } from 'react';
import _ from 'lodash';

const Society = () => {
  const {
    societyView: { selectedItem: selectedEntity, isActive: isViewActive },
    VIEWS,
  } = useDwarfViz();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <div className='view-title'>
        <h2>Society</h2>
      </div>
      <div className={'view-content'}>
        {isViewActive && (
          <Container fluid>
            <Row>
              <Col>
                <HistoryControls view={VIEWS.SOCIETY} />
              </Col>
            </Row>

            <Row>
              <Col className={'col-sm-7'}>
                <div className='view-element'>
                  <CirclePacking />
                </div>
                <div className='view-element' style={{ width: '675px' }}>
                  <CivPopulation width={650} height={300} className={'barchart'} />
                </div>
              </Col>
              <Col className={'col-sm-4'}>
                {selectedEntity ? (
                  <>
                    <h1>{_.startCase(selectedEntity.name)}</h1>
                    <EntityDetails entity={selectedEntity} />
                  </>
                ) : (
                  <div className={'view-element noSelection'}>
                    Select an entity from the Circle graph
                  </div>
                )}
              </Col>
            </Row>
            <Row>{selectedEntity && <Events />}</Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default Society;
