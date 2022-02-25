import { CivPopulation } from './CivPopulation/CivPopulation.js';
import Sunburst from './Sunburst.js';
const People = ({ entityPopulation }) => {
  return (
    <>
      <CivPopulation entityPopulation={entityPopulation} width={450} height={250} />
      <Sunburst />
    </>
  );
};

export default People;
