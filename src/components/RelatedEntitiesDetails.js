import { EntityLink } from './ItemLink.js';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const RelatedEntitiesDetails = ({ hf }) => {
  const relatedEntitiesDetailsDefinition = {
    header: `Related entities`,
    rows: hf.entity_link.map((link) => {
      return {
        displayName: <EntityLink id={link.entity_id} />,
        accessor: () => _.startCase(link.link_type),
      };
    }),
  };
  return <ItemDetails itemDetailsDefinition={relatedEntitiesDetailsDefinition} item={hf} />;
};

export default RelatedEntitiesDetails;
