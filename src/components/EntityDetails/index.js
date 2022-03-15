import { useDwarfViz } from '../../hooks/useDwarfViz';
import { GovernedSitesDetails } from './GovernedSitesDetails.js';
import { EntityPositionDetails } from './EntityPositionDetails.js';
import { EntityLink, HfLink, SiteLink } from '../ItemLink.js';
import ItemDetails from '../ItemDetails.js';

import _ from 'lodash';

const BasicEntityDetails = ({ entity }) => {
  const { data } = useDwarfViz();

  const getLeader = (entity) => {
    let pos = { id: null, name: null };
    for (const position of Object.values(entity.entity_position)) {
      pos = position ? { id: position.local_id, name: position.name } : { id: null, name: null };
      break;
    }
    if (pos.id != null) {
      if (
        entity.entity_position_assignment.filter((ass) => ass.position_id == pos.id).length == 1
      ) {
        return pos;
      }
    }
    return { id: null, name: null };
  };

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
        displayName: `Leader (${getLeader(entity).name})`,
        accessor: (entity) => {
          const localId = getLeader(entity).id;
          if (localId === null) return null;
          const leaderAssignment = entity.entity_position_assignment.find(
            (pers) => pers.position_id == localId,
          );
          if (leaderAssignment != undefined) {
            return leaderAssignment.hf_id ? (
              <HfLink id={leaderAssignment.hf_id} />
            ) : (
              'Unknown individual'
            );
          } else return 'Unoccupied';
        },
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
          if (parentEntity) return <EntityLink id={parentEntity.id} />;
        },
      },
      {
        displayName: 'Governs',
        accessor: (entity) => {
          const numberOfChildEntities = entity.entity_link.filter((link) => link.type === 'CHILD');
          if (numberOfChildEntities.length > 0) return `${numberOfChildEntities.length} entities`;
        },
      },
      {
        displayName: 'Owns sites',
        accessor: (entity) => {
          let list_elements = [];
          for (const site of data.sites.filter((s) => s.cur_owner_id == entity.id)) {
            list_elements.push(
              <li className='ownSiteList'>
                <SiteLink id={site.id} />
              </li>,
            );
          }
          return list_elements.length > 0 ? <ul>{list_elements}</ul> : null;
        },
      },
    ],
  };

  return <ItemDetails itemDetailsDefinition={entityDetailsDefinition} item={entity} />;
};

const EntityDetails = ({ entity }) => {
  const {
    data: { entities },
  } = useDwarfViz();

  let parentCiv = undefined;
  let parentEntities = [entity];
  while (parentCiv === undefined && parentEntities.length > 0) {
    let evalEntity = parentEntities.pop();
    if (evalEntity.entity_link.length == 0) break;
    for (const link of evalEntity.entity_link) {
      if (link.type === 'PARENT') {
        const parent = entities.find((ent) => ent.id == link.target);
        if (parent.type === 'civilization') {
          parentCiv = parent;
          break;
        } else parentEntities.push(parent);
      }
    }
  }

  return (
    <>
      {parentCiv && (
        <div className='view-element'>
          <BasicEntityDetails entity={parentCiv} />
        </div>
      )}
      <div className='view-element'>
        <BasicEntityDetails entity={entity} />
      </div>
      <div className='view-element'>
        <EntityPositionDetails entity={entity} />
      </div>
      <div className='view-element'>
        <GovernedSitesDetails entity={entity} />
      </div>
    </>
  );
};

export { EntityDetails };
