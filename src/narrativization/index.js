import {
  Change_hf_job_desc,
  Change_hf_state_desc,
  Hf_died_desc,
  Hf_relationship_desc,
  Creature_devoured_desc,
  // written_content_composed_desc,
  Add_hf_entity_link_desc,
  Hf_simple_battle_event_desc,
  // artifact_created_desc,
} from './supported-events';

const Narrate = ({ historicalEvent }) => {
  // Look at the type and select the right string
  switch (historicalEvent.type) {
    case 'change_hf_job':
      return (
        <>
          In the year {historicalEvent.year} <Change_hf_job_desc he={historicalEvent} />
        </>
      );

    case 'change_hf_state':
      return (
        <>
          In the year {historicalEvent.year} <Change_hf_state_desc he={historicalEvent} />
        </>
      );

    case 'hf_died':
      return (
        <>
          In the year {historicalEvent.year} <Hf_died_desc he={historicalEvent} />
        </>
      );

    case 'hf_relationship':
      return (
        <>
          In the year {historicalEvent.year} <Hf_relationship_desc he={historicalEvent} />
        </>
      );

    case 'creature_devoured':
      return (
        <>
          In the year {historicalEvent.year} <Creature_devoured_desc he={historicalEvent} />
        </>
      );

    // case 'written_content_composed':
    // return (
    //   <>
    //     // In the year {historicalEvent.year}{' '}
    //     <written_content_composed_desc he={historicalEvent} />
    //   </>
    // );
    //   break;
    case 'add_hf_entity_link':
      return (
        <>
          In the year {historicalEvent.year} <Add_hf_entity_link_desc he={historicalEvent} />
        </>
      );
    case 'hf_simple_battle_event':
      return (
        <>
          In the year {historicalEvent.year} <Hf_simple_battle_event_desc he={historicalEvent} />
        </>
      );
    // case 'artifact_created':
    // return (
    //   <>
    //     // In the year {historicalEvent.year} <artifact_created_desc he={historicalEvent} />
    //   </>
    // );
    //   break;
    default:
      return (
        <>
          In the year {historicalEvent.year} `Unknown Event: {historicalEvent.type}`
        </>
      );
  }
};

export default Narrate;
