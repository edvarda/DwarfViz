import {
  change_hf_job_desc,
  change_hf_state_desc,
  hf_died_desc,
  hf_relationship_desc,
  creature_devoured_desc,
  // written_content_composed_desc,
  add_hf_entity_link_desc,
  hf_simple_battle_event_desc,
  // artifact_created_desc,
} from './supported-events';

//---------------------------------------------------------------
//main templating function that kicks off processing based on event type
//check here for info: https://github.com/Kromtec/LegendsViewer/tree/master/LegendsViewer/Legends/Events
function historical_event_desc(historicalEvent, dwarfViz) {
  // Add year
  var eventDesc = `In the year ${historicalEvent.year}, `;
  // Look at the type and select the right string
  switch (historicalEvent.type) {
    case 'change_hf_job':
      eventDesc += change_hf_job_desc(historicalEvent, dwarfViz);
      break;
    case 'change_hf_state':
      eventDesc += change_hf_state_desc(historicalEvent, dwarfViz);
      break;
    case 'hf_died':
      eventDesc += hf_died_desc(historicalEvent, dwarfViz);
      break;
    case 'hf_relationship':
      eventDesc += hf_relationship_desc(historicalEvent, dwarfViz);
      break;
    case 'creature_devoured':
      eventDesc += creature_devoured_desc(historicalEvent, dwarfViz);
      break;
    // case 'written_content_composed':
    //   eventDesc +=  written_content_composed_desc(historicalEvent, dwarfViz);
    //   break;
    case 'add_hf_entity_link':
      eventDesc += add_hf_entity_link_desc(historicalEvent, dwarfViz);
      break;
    case 'hf_simple_battle_event':
      eventDesc += hf_simple_battle_event_desc(historicalEvent, dwarfViz);
      break;
    // case 'artifact_created':
    //   eventDesc +=  artifact_created_desc(historicalEvent, dwarfViz);
    //   break;
    default:
      eventDesc += `Unknown Event: ${historicalEvent.type}`;
      break;
  }

  return eventDesc;
}

export { historical_event_desc };
