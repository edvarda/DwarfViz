import { useDwarfViz } from '../../hooks/useDwarfViz';
import { EntityLink } from '../ItemLink.js';

import _ from 'lodash';

const EntityDetails = ({ entity }) => {
  const { data } = useDwarfViz();

  const entityDetailsDefinition = {
    header: _.startCase(entity.name),
    rows: [
      { displayName: 'Name', accessor: (entity) => _.startCase(entity.name) },
      { displayName: 'Type', accessor: (entity) => _.startCase(entity.type) },
      { displayName: 'Profession', accessor: (entity) => _.startCase(entity.profession) },
      {
        displayName: 'Race',
        accessor: (entity) => (entity.race ? _.startCase(entity.race) : null),
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

  const { header, rows } = entityDetailsDefinition;
  const nonEmptyRows = rows.filter((row) => !!row.accessor(entity));
  return (
    <div className='detailsView'>
      <h2>{header}</h2>
      <ul>
        {nonEmptyRows.map((row) => {
          return (
            <li>
              <div className='propName'>{row.displayName}:</div>
              <div className='value'>{row.accessor(entity)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ChildEntityDetails = ({ entity }) => {
  if (entity.type !== 'civilization') {
    return <EntityDetails entity={entity} />;
  } else return null;
};

const CivDetails = ({ entity }) => {
  const {
    data: { entities, entityPopulations },
  } = useDwarfViz();
  let parentCiv = undefined;
  if (entity.type === 'civilization') parentCiv = entity;
  else {
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
  }
  if (parentCiv != undefined) {
    return <EntityDetails entity={parentCiv} />;
  } else return null;
};

export { CivDetails, ChildEntityDetails };
