import { Row, Col, Container } from 'react-bootstrap';
import { HfLink } from './ItemLink';
import { Events } from './';
import { useDwarfViz } from '../hooks/useDwarfViz';
import CivPopulation from './CivPopulation/CivPopulation.js';
import CirclePacking from './CirclePacking';
import { EntityDetails } from './EntityDetails';
import HistoryControls from './HistoryControls.js';
import ReactTooltip from 'react-tooltip';
import { useEffect } from 'react';

const Society = () => {
  const {
    data: { historicalFigures },
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
              <Col className={'col-sm-4'}>
                <div className='view-element'>
                  <CirclePacking width={500} height={500} />
                </div>
              </Col>
              <Col className={'col-sm-6'}>
                {selectedEntity ? (
                  <div className='view-element'>
                    <EntityDetails entity={selectedEntity} />
                  </div>
                ) : (
                  <div className={'view-element noSelection'}>No entity selected</div>
                )}
              </Col>
            </Row>
            <Row>
              <Col className={'col-sm-4'}>
                <div className='view-element'>
                  <CivPopulation width={500} height={250} className={'barchart'} />
                </div>
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
