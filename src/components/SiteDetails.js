import { useDwarfViz } from '../hooks/useDwarfViz';
import { EntityLink } from './ItemLink.js';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const SiteDetails = ({ site }) => {
  const { data } = useDwarfViz();

  const siteDetailsDefinition = {
    header: `Site: ${_.startCase(site.name)}`,
    rows: [
      { displayName: 'Type', accessor: (site) => _.startCase(site.type) },
      { displayName: 'Region', accessor: (site) => `[${site.coord.x},${site.coord.y}]` },
      {
        displayName: 'Civilization',
        accessor: (site) => (site.civ_id ? <EntityLink id={site.civ_id} /> : null),
      },
      {
        displayName: 'Current owner',
        accessor: (site) => (site.cur_owner_id ? <EntityLink id={site.cur_owner_id} /> : null),
      },
      {
        displayName: 'Properties',
        accessor: (site) => (site && site.site_properties ? GetPropertyDetails(site) : null),
      },
    ],
  };
  return <ItemDetails itemDetailsDefinition={siteDetailsDefinition} item={site} />;
};

const GetPropertyDetails = (site) => {
  // Example: if there are 2 houses on a site, res = "2 Houses"
  let res = '';
  var properties = new Object();
  for (let x = 0; x < site.site_properties.length; x++) {
    properties[site.site_properties[x].type] = (properties[site.site_properties[x].type] || 0) + 1;
  }
  for (const [key, value] of Object.entries(properties)) {
    res = res.concat(value, ' ', _.upperFirst(key), 's ');
  }
  return res;
};

export default SiteDetails;
