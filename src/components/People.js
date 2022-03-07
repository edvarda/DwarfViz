import { Card, Row, Col } from 'react-bootstrap';

import ItemLink from './ItemLink.js';
import { useDwarfViz } from '../hooks/useDwarfViz';
import FamilyTree from './FamilyTree.js';
import RelationshipGraph from './RelationshipGraph.js';
import RelatedEntities from './RelatedEntities.js';

const People = () => {
  const {
    state: { historicalFigures, entities, sites },
    selectItem,
    selectedItems: { historicalFigure: selectedFigure },
  } = useDwarfViz();

  return (
    <>
      <Row className={'d-flex flex-row'}>
        <Col className={'d-flex flex-wrap'}>
          {selectedFigure && (
            <Card style={{ width: '18rem' }} className={'m-1'}>
              <Card.Body>
                <Card.Title>{selectedFigure.name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                  Race: {selectedFigure.race}
                </Card.Subtitle>
                <Card.Text>Caste: {selectedFigure.caste} </Card.Text>
                <Card.Text>Id: {selectedFigure.id} </Card.Text>
                <Card.Text>Birth year: {selectedFigure.birth_year}</Card.Text>
                <div>
                  <h2>Linked entities</h2>
                  <ul>
                    {selectedFigure.entity_link.map((entityLink) => (
                      <li key={entityLink.entity_id + 'entity'}>
                        {`Linked as ${entityLink.link_type} to: `}
                        <ItemLink
                          handleClick={selectItem.entity}
                          type={'societyLink'}
                          id={entityLink.entity_id}
                        >
                          {entities.find((x) => x.id === entityLink.entity_id).name}
                        </ItemLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2>Linked sites</h2>
                  <ul>
                    {selectedFigure.site_link.map((siteLink) => (
                      <li key={siteLink.site_id}>
                        {`Linked as ${siteLink.link_type} to: `}
                        <ItemLink
                          handleClick={selectItem.site}
                          type={'societyLink'}
                          id={siteLink.site_id}
                        >
                          {sites.find((x) => x.id === siteLink.site_id).name}
                        </ItemLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2>Associated Historical Figures</h2>
                  <ul>
                    {selectedFigure.links.map((link) => {
                      const hf = historicalFigures.find((x) => x.id === link.hf_id_other);
                      return (
                        <li key={link.hf_id_other + 'other'}>
                          {`${link.link_type}: `}
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
        <Col className={''}>
          {selectedFigure && <FamilyTree width={400} height={300} />}
          {selectedFigure && <RelationshipGraph width={400} height={400} />}
          {selectedFigure && <RelatedEntities width={400} height={400} />}
        </Col>
      </Row>
    </>
  );
};

export default People;
