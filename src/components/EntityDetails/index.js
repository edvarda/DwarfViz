import { useDwarfViz } from '../../hooks/useDwarfViz';
import { EntityLink } from '../ItemLink.js';
import ItemDetails from '../ItemDetails.js';
import { Col } from 'react-bootstrap';

import _ from 'lodash';

const GetEntityDetails = ({ entity }) => {
  const { data } = useDwarfViz();

  const entityDetailsDefinition = {
    header: _.startCase(entity.name),
    rows: [
      //{ displayName: 'Name', accessor: (entity) => _.startCase(entity.name) },
      { displayName: 'Type', accessor: (entity) => _.startCase(entity.type) },
      { displayName: 'Profession', accessor: (entity) => _.startCase(entity.profession) },
      {
        displayName: 'Race',
        accessor: (entity) => (entity.race ? _.startCase(entity.race) : null),
      },
      {
        displayName: 'Population',
        accessor: (entity) =>
          entity.type === 'civilization'
            ? data.entityPopulations.find((ent) => ent.civ_id == entity.id).races[0].split(':')[1]
            : null,
      },
      {
        displayName: 'Governed by',
        accessor: (entity) => {
          const parentEntityLink = entity.entity_link.find((link) => link.type === 'PARENT');
          const parentEntity = parentEntityLink
            ? data.entities.find((x) => x.id === parentEntityLink.target)
            : null;
          if (parentEntity) return <EntityLink entityId={parentEntity.id} />;
        },
      },
      {
        displayName: 'Governs',
        accessor: (entity) => {
          const numberOfChildEntities = entity.entity_link.filter((link) => link.type === 'CHILD');
          if (numberOfChildEntities.length > 0) return `${numberOfChildEntities.length} entities`;
        },
      },
    ],
  };

  return <ItemDetails itemDetailsDefinition={entityDetailsDefinition} item={entity} />;
};

const EntityDetails = ({ entity }) => {
  const {
    data: { entities, entityPopulations },
  } = useDwarfViz();
  if (entity.type === 'civilization') {
    //Selected a civilization
    return (
      <Col>
        <GetEntityDetails entity={entity} />
      </Col>
    );
  } else {
    let parentCiv = undefined;
    let evalEntity = entity;
    while (parentCiv === undefined) {
      if (evalEntity.entity_link.length == 0) break;
      for (const link of evalEntity.entity_link) {
        if (link.type === 'PARENT') {
          const parent = entities.find((ent) => ent.id == link.target);
          if (parent.type === 'civilization') parentCiv = parent;
          else evalEntity = parent;
        }
      }
    }
    if (parentCiv != undefined) {
      //Selected an entity that belongs to a civilization
      return (
        <Col>
          <GetEntityDetails entity={parentCiv} />
          <GetEntityDetails entity={entity} />
        </Col>
      );
    } else
      return (
        //Selected an entity without parent civilization
        <Col>
          <GetEntityDetails entity={entity} />
        </Col>
      );
  }
};

export { EntityDetails };
