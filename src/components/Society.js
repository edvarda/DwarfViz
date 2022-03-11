import { Card, Row, Col } from 'react-bootstrap';
import { HfLink } from './ItemLink';
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
    societyView: { selectedItem: selectedEntity },
    VIEWS,
  } = useDwarfViz();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <Row className={'d-flex flex-row'}>
        <Row>
          {selectedEntity && (
            <EntityDetails entity={selectedEntity}/>
          )}
          <Col>
            <HistoryControls view={VIEWS.SOCIETY} />
          </Col>
        </Row>
        <Col className={'d-flex flex-wrap'}>
          {selectedEntity && (
            <>
              <Card style={{ width: '18rem' }} className={'m-1'}>
                <Card.Body>
                  <div>
                    <h2>Associated Historical Figures</h2>
                    <ul>
                      {selectedEntity.hf_ids.map((hf_id) => {
                        const hf = historicalFigures.find((x) => x.id === hf_id);
                        return (
                          <li key={hf_id}>
                            <HfLink hfId={hf.id} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
        <Col>
          <CivPopulation width={500} height={250} className={'barchart'} />
          <CirclePacking width={500} height={500} />
        </Col>
      </Row>
    </>
  );
};

export default Society;
