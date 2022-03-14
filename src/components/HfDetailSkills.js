import { useDwarfViz } from '../hooks/useDwarfViz';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const HfDetailSkills = ({ hf }) => {
  const { data } = useDwarfViz();
  const topSkills = hf.skills.sort((a, b) => a.total_ip > b.total_ip).slice(-3);
  const numericals = ["", "Second", "Third"]
  let num = 0;
  const hfSkillsDetailsDefinition = {
    header: `Skills`,
    rows: topSkills.map((link) => {
      return {
        displayName: numericals[num++] + " Best Skill",
        accessor: () => _.startCase(_.lowerCase(link.skill)),
      };
    }),
  };
  return <ItemDetails itemDetailsDefinition={hfSkillsDetailsDefinition} item={hf} />;
};

export default HfDetailSkills;
