import { useDwarfViz } from '../hooks/useDwarfViz';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const HfDetails = ({ hf }) => {
  const { data } = useDwarfViz();

  const hfDetailsDefinition = {
    header: _.startCase(hf.name),
    rows: [
      { displayName: 'Name', accessor: (hf) => _.startCase(hf.name) },
      // TODO add diety status
      { displayName: 'Race', accessor: (hf) => _.startCase(hf.race) },
      {
        displayName: 'Gender',
        accessor: (hf) => (hf.caste && hf.caste !== 'deafult' ? _.startCase(hf.caste) : null),
      },
      {
        displayName: 'Born',
        accessor: (hf) => (hf.birth_year > 0 ? `year ${hf.birth_year}` : 'in the before times'),
      },
      {
        displayName: 'Died',
        accessor: (hf) => (hf.death_year > 0 ? `year ${hf.death_year}` : null),
      },
      { displayName: 'Profession', accessor: (hf) => _.startCase(hf.associated_type) },
      { displayName: 'Life goal', accessor: (hf) => _.capitalize(hf.goal) },
    ],
  };
  return <ItemDetails itemDetailsDefinition={hfDetailsDefinition} item={hf} />;
};

export default HfDetails;
