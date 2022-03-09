import { Card } from 'react-bootstrap';
import { useDwarfViz } from '../../hooks/useDwarfViz';

const EntityDetails = () => {
  const {
    data: { entities, entityPopulations },
    societyView: { selectedItem: selectedEntity },
  } = useDwarfViz();
  const entPop = entityPopulations.find((e) => e.civ_id == selectedEntity.id);
  let text =
    entPop != undefined ? (
      <p>
        Race: {selectedEntity.race}
        <br />
        Population: {entPop.races[0].split(':')[1]}
      </p>
    ) : (
      <p>Race: {selectedEntity.race}</p>
    );
  return (
    <div style={{border:"1px solid lightGrey",padding:'15px',borderRadius:'5px'}}>
      <h2 style={{fontSize:'1.3em'}}>{selectedEntity.name}</h2>
      <h3 className='mb-2 text-muted' style={{fontSize:'1.15em'}}>Type: {selectedEntity.type} </h3>
      {text}
    </div>
  );
};

export default EntityDetails;
