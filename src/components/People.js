import { Card, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import { EntityLink, SiteLink, HfLink } from './ItemLink.js';
import { useDwarfViz } from '../hooks/useDwarfViz';
import FamilyTree from './FamilyTree.js';
import RelationshipGraph from './RelationshipGraph.js';
import RelatedEntities from './RelatedEntities.js';
import HistoryControls from './HistoryControls.js';

const People = () => {
  const {
    data: { historicalFigures, entities, sites },
    peopleView: { selectedItem: selectedFigure },
    VIEWS,
  } = useDwarfViz();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  console.log('People selected', selectedFigure);
  return (
    <>
      <Row className={'d-flex flex-row'}>
        <Row>
          <Col>
            <HistoryControls view={VIEWS.PEOPLE} />
          </Col>
        </Row>
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
                        <EntityLink entityId={entityLink.entity_id} />
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
                        <SiteLink siteId={siteLink.site_id} />
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
                          <HfLink hfId={hf.id} />
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
          {/* {selectedFigure && <RelatedEntities width={400} height={400} />} */}
        </Col>
      </Row>
    </>
  );
};

export default People;
