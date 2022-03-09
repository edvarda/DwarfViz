import { Card, Row, Col } from 'react-bootstrap';
import Map from './Map';
import ItemLink from './ItemLink';
import { useDwarfViz, VIEWS } from '../hooks/useDwarfViz';
import HistoryControls from './HistoryControls.js';

const Places = () => {
  const {
    data: { mapImageURL, entities, regions, regionsGeoJSON },
    selectEntity,
    placesView: { selectedItem: selectedSite },
  } = useDwarfViz();

  const owningEntity = (selectedSite) => entities.find((x) => x.id === selectedSite.civ_id);
  return (
    <>
      <Row>
        <Row>
          <Col>
            <HistoryControls view={VIEWS.PLACES} />
          </Col>
        </Row>
        <Col className={'d-flex flex-wrap'}>
          {selectedSite && (
            <Card style={{ width: '40rem' }} className={'m-1'}>
              <Card.Body>
                <Card.Title>{selectedSite.name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>Type: {selectedSite.type}</Card.Subtitle>
                <Card.Text>Number of structures: {selectedSite.structures.length} </Card.Text>
                {owningEntity(selectedSite) && (
                  <div>
                    Belongs to {owningEntity(selectedSite).type}:{' '}
                    <ItemLink
                      handleClick={selectEntity}
                      type={'societyLink'}
                      id={selectedSite.civ_id}
                    >
                      {owningEntity(selectedSite).name}
                    </ItemLink>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col>
          <Map
            mapImage={mapImageURL}
            mapSize={{
              width: 528,
              height: 528,
              bounds: [
                [0, 0],
                [527, 527],
              ],
            }}
            data={regionsGeoJSON}
            regions={regions}
          />
        </Col>
      </Row>
    </>
  );
};

export default Places;
