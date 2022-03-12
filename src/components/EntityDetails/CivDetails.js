import { link } from 'd3';
import { select } from 'd3';
import { useDwarfViz } from '../../hooks/useDwarfViz';

const CivDetails = () => {
  const {
    data: { entities, entityPopulations },
    societyView: { selectedItem: selectedEntity },
  } = useDwarfViz();
  let parentCiv = undefined;
  if (selectedEntity.type == 'civilization') parentCiv = selectedEntity;
  else {
    let evalEntity = selectedEntity;
    while (parentCiv == undefined) {
      if (evalEntity.entity_link.length == 0) break;
      for (const link of evalEntity.entity_link) {
        if (link.type == 'PARENT') {
          const parent = entities.find((ent) => ent.id == link.target);
          if (parent.type == 'civilization') parentCiv = parent;
          else evalEntity = parent;
        }
      }
    }
  }
  if (parentCiv != undefined) {
    const entPop = entityPopulations.find((e) => e.civ_id == parentCiv.id);
    let text =
      entPop != undefined ? (
        <p>
          Race: {parentCiv.race}
          <br />
          Population: {entPop.races[0].split(':')[1]}
        </p>
      ) : (
        <p>Race: {parentCiv.race}</p>
      );

    return (
      <div style={{ border: '1px solid lightGrey', padding: '15px', borderRadius: '5px' }}>
        <h2 style={{ fontSize: '1.3em' }}>{parentCiv.name}</h2>
        <h3 className='mb-2 text-muted' style={{ fontSize: '1.15em' }}>
          Type: {parentCiv.type}{' '}
        </h3>
        {text}
      </div>
    );
  } else return null;
};

export default CivDetails;
