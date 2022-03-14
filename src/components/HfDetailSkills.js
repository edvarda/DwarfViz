import { useDwarfViz } from '../hooks/useDwarfViz';
import ItemDetails from './ItemDetails.js';
import _ from 'lodash';

const HfDetailSkills = ({ hf }) => {
  const { data } = useDwarfViz();
  const topSkills = hf.skills.sort((a, b) => a.total_ip > b.total_ip).slice(-3);
  const numericals = ["", "Second", "Third"]
  console.log(hf.skills)
  let num = 0;
  const hfSkillsDetailsDefinition = {
    header: `Top Skills`,
    rows: topSkills.map((link) => {
      return {
        displayName: _.startCase(_.lowerCase(link.skill)),
        accessor: () => GetSkillLevel(link),
      };
    }),
  };
  return <ItemDetails itemDetailsDefinition={hfSkillsDetailsDefinition} item={hf} />;
};

const GetSkillLevel = (skill) => {
  const skillLevels = [
    {skill: "None/Dabbling", xp:1},
    {skill: "Novice", xp:500},
    {skill: "Adequate", xp:1100},
    {skill: "Competent", xp:1800},
    {skill: "Skilled", xp:2600},
    {skill: "Proficient", xp:3500},
    {skill: "Talented", xp:4500},
    {skill: "Adept", xp:5600},
    {skill: "Expert", xp:6800},
    {skill: "Professional", xp:8100},
    {skill: "Accomplished", xp:9500},
    {skill: "Great", xp:11000},
    {skill: "Master", xp:12600},
    {skill: "High Master", xp:14300},
    {skill: "Grand Master", xp:16100},
    {skill: "Legendary", xp:18000},
  ]
  console.log(skill)
  console.log(skillLevels)
  for (let i = skillLevels.length-1; i > 0; i--){
    if (skill.total_ip > skillLevels[i].xp) {
      return skillLevels[i].skill;
    }
  }
}

export default HfDetailSkills;
