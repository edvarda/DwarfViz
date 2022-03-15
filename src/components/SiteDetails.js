import { useDwarfViz } from '../hooks/useDwarfViz';
import { EntityLink, HfLink } from './ItemLink.js';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const SiteDetails = ({ site }) => {
  const { data } = useDwarfViz();

  const siteDetailsDefinition = {
    header: `${_.startCase('details')}`,
    rows: [
      { displayName: 'Type', accessor: (site) => _.startCase(site.type) },
      { displayName: 'Region', accessor: (site) => `[${site.coord.x},${site.coord.y}]` },
      {
        displayName: 'Builder',
        accessor: (site) => {
          const site_creation = data.historicalEvents.find(
            (he) => he.type === 'created_site' && he.site_id == site.id,
          );
          const builder_hf = site_creation ? site_creation.builder_hf_id : null;
          return builder_hf ? <HfLink id={builder_hf} /> : null;
        },
      },
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
