import { Card } from 'react-bootstrap';
import { useDwarfViz } from '../../hooks/useDwarfViz';

const EntityDetails = () => {
    const {
        state: { entities, entityPopulations },
        selectedItems: { entity: selectedEntity },
    } = useDwarfViz();
    const entPop = entityPopulations.find((e) => e.civ_id == selectedEntity.id);
    let text = (entPop != undefined 
        ? <Card.Text>Race: {selectedEntity.race}<br/>Population: {entPop.races[0].split(':')[1]}</Card.Text>
        : <Card.Text>Race: {selectedEntity.race}</Card.Text>)
    return (
        <>
            <Card.Title>{selectedEntity.name}</Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
                Type: {selectedEntity.type}{' '}
            </Card.Subtitle>
            {text}
        </>
    );
}

export { EntityDetails };