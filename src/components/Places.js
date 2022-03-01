import { Card, Row, Col } from 'react-bootstrap';
import Map from './Map';
import ItemLink from './ItemLink';
import { useWorldData } from '../hooks/useWorldData';

const Places = () => {
  const {
    state: { mapImageURL, entities, regions, regionsGeoJSON },
    selectItem,
    selectedItems: { site: selectedSite },
  } = useWorldData();
  return (
    <>
      <Row>
        <Col className={'d-flex flex-wrap'}>
          {selectedSite && (
            <Card style={{ width: '40rem' }} className={'m-1'}>
              <Card.Body>
                <Card.Title>{selectedSite.name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>Type: {selectedSite.type}</Card.Subtitle>
                <Card.Text>Number of structures: {selectedSite.structures.length} </Card.Text>
                <div>
                  Belongs to civilization:{' '}
                  <ItemLink
                    handleClick={selectItem.entity}
                    type={'societyLink'}
                    id={selectedSite.civ_id}
                  >
                    {entities.find((x) => x.id === selectedSite.civ_id).name}
                  </ItemLink>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

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
    </>
  );
};

export default Places;
