import { useDwarfViz } from '../../hooks/useDwarfViz';

const ChildEntityDetails = () => {
  const {
    data: { entities, entityPopulations },
    societyView: { selectedItem: selectedEntity },
  } = useDwarfViz();
  if (selectedEntity.type != 'civilization') {
    return (
        <div style={{border:"1px solid lightGrey",padding:'15px',borderRadius:'5px'}}>
            <h2 style={{fontSize:'1.3em'}}>{selectedEntity.name}</h2>
            <h3 className='mb-2 text-muted' style={{fontSize:'1.15em'}}>Type: {selectedEntity.type} </h3>
            <p>Race: {selectedEntity.race != null ? selectedEntity.race : 'No Race'}</p>
        </div>
    );
  }
  else return null;
};

export default ChildEntityDetails;
