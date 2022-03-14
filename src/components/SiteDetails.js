import { useDwarfViz } from '../hooks/useDwarfViz';
import { EntityLink, HfLink } from './ItemLink.js';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const SiteDetails = ({ site }) => {
  const { data } = useDwarfViz();

  const siteDetailsDefinition = {
    header: `Site: ${_.startCase(site.name)}`,
    rows: [
      { displayName: 'Type', accessor: (site) => _.startCase(site.type) },
      { displayName: 'Region', accessor: (site) => `[${site.coord.x},${site.coord.y}]` },
      { displayName: 'Civilization', 
        accessor: (site) => site.civ_id ? <EntityLink entityId={site.civ_id} /> : null},
      { displayName: 'Current owner', 
        accessor: (site) => site.cur_owner_id ?  <HfLink hfId={site.cur_owner_id} /> : null},
    ],
  };
  return <ItemDetails itemDetailsDefinition={siteDetailsDefinition} item={site} />;
};

export default SiteDetails;
