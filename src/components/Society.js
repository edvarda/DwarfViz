import { Card, Row, Col } from 'react-bootstrap';
import ItemLink from './ItemLink';
import { useDwarfViz } from '../hooks/useDwarfViz';
import { CivPopulation, CivPopulationReact } from './CivPopulation/CivPopulation.js';
import { useWorldData } from '../hooks/useWorldData';
import { CivPopulation } from './CivPopulation/CivPopulation.js';
import CirclePacking from './CirclePacking';

const Society = () => {
  const {
    state: { entities, historicalFigures },
    selectedItems: { entity: selectedEntity },
    selectItem,
  } = useDwarfViz();
  return (
    <>
      <Row className={'d-flex flex-row'}>
        <Col className={'d-flex flex-wrap'}>
          {selectedEntity && (
            <Card style={{ width: '18rem' }} className={'m-1'}>
              <Card.Body>
                <Card.Title>{selectedEntity.name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                  Type: {selectedEntity.type}{' '}
                </Card.Subtitle>
                <Card.Text>Race: {selectedEntity.race}</Card.Text>
                <div>
                  <h2>Associated Historical Figures</h2>
                  <ul>
                    {selectedEntity.hf_ids.map((hf_id) => {
                      const hf = historicalFigures.find((x) => x.id === hf_id);
                      return (
                        <li key={hf_id}>
                          <ItemLink
                            handleClick={selectItem.historicalFigure}
                            type={'peopleLink'}
                            id={hf.id}
                          >
                            {hf.name}
                          </ItemLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col>
          <CivPopulation width={550} height={250} className={'barchart'} />
          <CirclePacking width={500} height={500} />
        </Col>
      </Row>
    </>
  );
};

export default Society;
