import { useDwarfViz } from '../../hooks/useDwarfViz';
import { SiteLink } from '../ItemLink.js';
import ItemDetails from '../ItemDetails.js';
import _ from 'lodash';

const GovernedSitesDetails = ({ entity }) => {
  const {
    data: { sites },
  } = useDwarfViz();

  const governedSitesDetailsDefinition = {
    header: `Governed sites`,
    rows: sites
      .filter((site) => site.civ_id === entity.id)
      .map((site) => {
        return {
          displayName: _.startCase(site.type),
          accessor: () => <SiteLink id={site.id} />,
        };
      }),
  };
  return <ItemDetails itemDetailsDefinition={governedSitesDetailsDefinition} item={entity} />;
};

export { GovernedSitesDetails };
