import ItemDetails from '../ItemDetails.js';
import { HfLink } from '../ItemLink.js';
import _ from 'lodash';

const EntityPositionDetails = ({ entity }) => {
  const entityPositionsDefinition = {
    header: `Entity positions`,
    rows: _.flatten(
      entity.entity_position.map((position) => {
        const assignments = entity.entity_position_assignment.filter(
          (x) => x.position_id === position.local_id && x.hf_id,
        );
        if (_.isEmpty(assignments)) {
          return [
            {
              displayName: _.startCase(position.name),
              accessor: () => 'Unassigned',
            },
          ];
        } else {
          return assignments.map((assignment) => ({
            displayName: _.startCase(position.name),
            accessor: () => <HfLink id={assignment.hf_id} />,
          }));
        }
      }),
    ),
  };

  if (entity.entity_position.length === 0) {
    return null;
  }
  return <ItemDetails itemDetailsDefinition={entityPositionsDefinition} item={entity} />;
};

export { EntityPositionDetails };
