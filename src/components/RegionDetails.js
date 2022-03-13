import { useDwarfViz } from '../hooks/useDwarfViz';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const regionTilesToSquareKm = (regiontiles) => regiontiles * 3.4;

const RegionDetails = ({ region }) => {
  const { data } = useDwarfViz();

  const regionDetailsDefinition = {
    header: `Region: ${_.startCase(region.name)}`,
    rows: [
      { displayName: 'Name', accessor: (region) => _.startCase(region.name) },
      { displayName: 'Type', accessor: (region) => _.startCase(region.type) },
      {
        displayName: 'Size',
        accessor: (region) => `~${regionTilesToSquareKm(region.coords.length).toFixed(2)} km²`,
      },
      { displayName: 'Evilness', accessor: (region) => _.capitalize(region.evilness) },
      { displayName: 'Hovered biome', accessor: (region) => _.capitalize(region.biomeString) },
    ],
  };
  return <ItemDetails itemDetailsDefinition={regionDetailsDefinition} item={region} />;
};

export default RegionDetails;
