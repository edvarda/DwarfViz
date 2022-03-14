import { useDwarfViz } from '../hooks/useDwarfViz';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const HfDetailSkills = ({ hf }) => {
  const { data } = useDwarfViz();

  const hfSkillsDetailsDefinition = {
    header: `Skills`,
    rows: hf.skills.map((link) => {
      return {
        displayName: link.skill,
        accessor: () => _.startCase(link.skill),
      };
    }),
  };
  return <ItemDetails itemDetailsDefinition={hfSkillsDetailsDefinition} item={hf} />;
};

export default HfDetailSkills;
