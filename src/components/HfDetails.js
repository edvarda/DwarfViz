import { useDwarfViz } from '../hooks/useDwarfViz';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const HfDetails = ({ hf }) => {
  const { data, artifacts, find } = useDwarfViz();

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
      { displayName: 'Pet', accessor: (hf) => hf.journey_pet[0] ? _.startCase(hf.journey_pet[0]) : null },
      { displayName: 'Deity', accessor: (hf) => _.capitalize(hf.deity) },
      { displayName: 'Sphere', accessor: (hf) => _.capitalize(hf.sphere[0]) },
      { displayName: 'Owns Artifact', accessor: (hf) => hf.holds_artifact ? _.startCase(find.artifact(hf.holds_artifact).name) : null },
      { displayName: 'Animated String', accessor: (hf) => hf.animated_string ? _.startCase(hf.animated_string) : null },
      // Following are technically lists
      { displayName: 'Skills', accessor: (hf) => hf.skills[0] ? (hf.skills.map(x => (x.skill)).join(", ")) : null },

    ],
  };
  return <ItemDetails itemDetailsDefinition={hfDetailsDefinition} item={hf} />;
};

export default HfDetails;
