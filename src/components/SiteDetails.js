import { useDwarfViz } from '../hooks/useDwarfViz';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const SiteDetails = ({ site }) => {
  const { data } = useDwarfViz();

  const siteDetailsDefinition = {
    header: _.startCase(site.name),
    rows: [
      { displayName: 'Type', accessor: (site) => _.startCase(site.type) },
      { displayName: 'Region', accessor: (site) => `[${site.coord.x},${site.coord.y}]` },
      { displayName: 'Civilization', accessor: (site) => site.civ_id },
      { displayName: 'Current owner', accessor: (site) => site.cur_owner_id },
    ],
  };
  return <ItemDetails itemDetailsDefinition={siteDetailsDefinition} item={site} />;
};

export default SiteDetails;
