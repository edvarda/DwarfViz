import { CivPopulation } from './CivPopulation/CivPopulation.js';

const People = ({ entityPopulation }) => {
  return <CivPopulation entityPopulation={entityPopulation} width={450} height={250} />;
};

export default People;