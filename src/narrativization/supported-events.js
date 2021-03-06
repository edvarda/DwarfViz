import { useDwarfViz } from '../hooks/useDwarfViz';
import { SiteLink, EntityLink, HfLink } from '../components/ItemLink.js';
import {
  formatName,
  format,
  formatJob,
  formatTime,
  getWorkTitle,
  getEntityName,
  getRace,
  pluralRace,
  adverbify,
  ordinal,
  getPronouns,
  a_an,
} from './description-utils';

const Artifact_created_desc = ({ he, dwarfViz }) => {
  const { find } = useDwarfViz();
  var eventDesc = '';

  var creator = find.hf(he.creator_hf_id);
  var artifact = find.artifact(he.artifact_id);
  var site = find.site(he.site_id);

  creator.name = creator.name !== null ? formatName(creator.name) : 'an unknown person';

  // item_types can contain underscores, item_subtypes do not
  var itemType =
    artifact.item_subtype !== null ? artifact.item_subtype : format(artifact.item_type);
  itemType = artifact.item_mat !== null ? artifact.item_mat + ' ' + itemType : itemType;

  if (he.name_only) {
    // artifact wasn't created, it just got named (for having a long kill list)
    eventDesc = (
      <>
        <HfLink id={creator.id}/> named {a_an(itemType)} 
        {getPronouns(creator.caste).their} {itemType} '{artifact.name}'
      </>
    );
    if (he.site_id > -1 && site.name !== null) {
      eventDesc = (
        <>
          <HfLink id={creator.id}/> named {a_an(itemType)} 
          {getPronouns(creator.caste).their} {itemType} '{artifact.name}' in <SiteLink id={site.id}/>
        </>
      );
    }
  } else {
    eventDesc = (
      <>
        <HfLink id={creator.id}/> created {a_an(itemType)}
      </>
    );
    if (artifact.name !== null) {
      eventDesc = (
        <>
          <HfLink id={creator.id}/> created {a_an(itemType)} called '{artifact.name}'
        </>
      );
    }
    if (he.site_id > -1 && site.name !== null) {
      eventDesc = (
        <>
          <HfLink id={creator.id}/> created {a_an(itemType)} called '{artifact.name}' in <SiteLink id={site.id}/>
        </>
      );
    }
  }

  return eventDesc;
}

// function written_content_composed_desc(he, dwarfViz) {
//   var eventDesc = '';

//   var author = dwarfViz.find.hf(he.hf_id); //load historical figure data
//   if (author.name === null) {
//     author.name = 'an unknown person';
//   } else {
//     author.name = formatName(author.name);
//   }

//   var work = await load_ref_data(`written_contents/${he.wc_id}`);

//   // var test1 = getWorkTitle(work, "title");
//   // var test2 = getWorkTitle(work, "titleForm");
//   var workPart = getWorkTitle(work, 'titleFormStyle');

//   return `${author.name} wrote ${workPart}.`;
// }

const Add_hf_entity_link_desc = ({ he }) => {
  const { find } = useDwarfViz();
  var hf = find.hf(he.hf_id); //load historical figure data
  hf.name = formatName(hf.name);
  var appointer = find.hf(he.appointer_hf_id); //load historical figure data
  var hfActionPromisedTo = find.hf(he.promise_to_hf_id); //load historical figure data
  var civ = find.entity(he.civ_id);

  var eventDesc = '';

  switch (he.link_type) {
    case 'prisoner':
      eventDesc = 
        <>
          <HfLink id={hf.id} /> was imprisoned by<EntityLink id={civ.id}/>
        </>
      break;
    case 'enemy':
      eventDesc =
        <>
          <HfLink id={hf.id}/> became an enemy of <EntityLink id={civ.id}/>
        </>
      break;
    case 'member':
      eventDesc =
        <>
          <HfLink id={hf.id}/> became a member of <EntityLink id={civ.id}/>
        </>
      break;
    case 'former member':
      eventDesc =
        <>
          <HfLink id={hf.id}/> became a former member of <EntityLink id={civ.id}/>
        </>
      break;
    case 'slave':
      eventDesc =
        <>
          <HfLink id={hf.id}/> was enslaved by <EntityLink id={civ.id}/>
        </>
      break;
    case 'position':
      if (he.position !== undefined) {
        eventDesc = 
          <>
            <HfLink id={hf.id}/> was given the position of {he.position} within <EntityLink id={civ.id}/>
          </>
      } else {
        eventDesc =
          <>
            <HfLink id={hf.id}/> was given a new position within <EntityLink id={civ.id}/>
          </>
      }
      break;
    case 'squad':
      eventDesc =
        <>
          <HfLink id={hf.id}/> became a member of <EntityLink id={civ.id}/>
        </>
      break;
    default:
      console.error('unhandled link type: ' + he.link_type);
      break;
  }
  return eventDesc;
};

const Change_hf_job_desc = ({ he }) => {
  const { find } = useDwarfViz();
  var hf = find.hf(he.hf_id); //load data for the historical figure (he.hf_id)

  var eventDesc = ''; //create a blank string

  he.new_job = formatJob(he.new_job); //run formatter on job (in description-utils)
  he.old_job = formatJob(he.old_job); //run formatter on job (in description-utils)

  if (he.new_job !== 'standard' && he.old_job !== 'standard') {
    //create text
    eventDesc =
      <>
        <HfLink id={hf.id}/> stopped being {a_an(he.old_job)} and became {a_an(he.new_job)}
      </>
  } else if (he.new_job !== 'standard') {
    eventDesc =
      <>
        <HfLink id={hf.id}/> became {a_an(he.new_job)}
      </>
  } else {
    eventDesc =
      <>
        <HfLink id={hf.id}/> stopped being a {a_an(he.old_job)}
      </>
  }

  return eventDesc;
};
//---------------------------------------------------------------
const Change_hf_state_desc = ({ he }) => {
  const { find } = useDwarfViz();
  var site = find.site(he.site_id); //load data for the event's site (he.site_id)
  var hf = find.hf(he.hf_id); //load data for the historical figure (he.hf_id)
  var region = find.region(he.region_id); //load data for the historical figure (he.hf_id)

  var eventDesc = '';

  switch (he.state) {
    case 'settled':
      site
        ? (
          eventDesc =
            <>
              <HfLink id={hf.id}/> settled in <SiteLink id={site.id}/>
            </>
        )
        : (
          eventDesc =
            <>
              <HfLink id={hf.id}/> settled in {region.name}
            </>
        );
      break;
    case 'wandering':
      eventDesc =
        <>
          <HfLink id={hf.id}/> began wandering the world
        </>//TODO: why?
      break;
    case 'scouting':
      eventDesc =
        <>
          <HfLink id={hf.id}/> began scouting around {site.name} 
        </>//TODO: why?
      break;
    case 'snatcher':
      eventDesc =
        <>
          <HfLink id={hf.id}/> started looking for someone to abduct
        </>//TODO: why?
      break;
    case 'refugee':
      eventDesc =
        <>
          <HfLink id={hf.id}/> became a refugee
        </>
      break;//TODO: of what conflict? Why?
    case 'thief':
      eventDesc =
        <>
          <HfLink id={hf.id}/> became a thief
        </>
      break;
    case 'hunting':
      eventDesc =
        <>
          <HfLink id={hf.id}/> starting hunting for game around {site.name}
        </>
      break;//TODO: biome-specific?
    default:
      eventDesc =
        <>
          <HfLink id={hf.id}/> changed their state in some unknown way
        </>
      break;
  }

  return eventDesc;
};

//---------------------------------------------------------------
//TODO: get name of where they died...is subregion_id the same as a region id???
const Hf_died_desc = ({ he }) => {
  const { find } = useDwarfViz();
  var hf = find.hf(he.hf_id); //load historical figure data
  if (hf.name !== null) {
    hf.name = formatName(hf.name);
  } else {
    hf.name = 'a mysterious stranger';
  }
  hf.name = formatName(hf.name);
  hf.pronouns = getPronouns(hf.caste);

  let eventDesc;

  if (he.slayer_hf_id > 0 || he.slayer_race !== undefined) {
    //if hf was killed...

    var slayer = {};
    if (he.slayer_hf_id > -1) {
      slayer = find.hf(he.slayer_hf_id); //load slayer data
      if (slayer.name === null) {
        slayer.name = `an unknown ${he.slayer_race.toLowerCase()}`;
      } else {
        slayer.name = formatName(slayer.name);
      }
    } else {
      if (he.slayer_race !== undefined) {
        slayer.name = `an unknown ${he.slayer_race.toLowerCase()}`;
      } else {
        slayer.name = `an unknown person`;
      }
      slayer.caste = 'nb';
    }

    slayer.pronouns = getPronouns(slayer.caste);

    switch (
      he.death_cause //TODO: find out if it would be good to put race in here (undead, monster, etc)
    ) {
      case 'dragons_fire':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was incinerated by a blast of fire from <HfLink id={slayer.id} />
          </>
        );
        break;
      case 'burned':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was burned to death by <HfLink id={slayer.id} />
            's fire.
          </>
        );
        break;
      case 'murdered':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was cruelly murdered by <HfLink id={slayer.id} />
          </>
        );
        break;
      case 'murder':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was cruelly murdered by <HfLink id={slayer.id} />
          </>
        );
        break;
      case 'shot':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was shot by <HfLink id={slayer.id} />
          </>
        );
        break;
      case 'struck_down':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was struck down by <HfLink id={slayer.id} />
          </>
        );
        break;
      case 'executed_buried_alive':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was buried alive by <HfLink id={slayer.id} /> for 
            {hf.pronouns.their} crimes
          </>
        );
        break;
      case 'executed_burned_alive':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was burned alive by <HfLink id={slayer.id} /> for 
            {hf.pronouns.their} crimes
          </>
        );
        break;
      case 'executed_crucified':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was crucified by <HfLink id={slayer.id} /> for 
            {hf.pronouns.their} crimes
          </>
        );
        break;
      case 'executed_drowned':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was drowned by <HfLink id={slayer.id} /> for {hf.pronouns.their}{' '}
            crimes
          </>
        );
        break;
      case 'executed_fed_to_beasts':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was fed to beasts by <HfLink id={slayer.id} /> for 
            {hf.pronouns.their} crimes
          </>
        );
        break;
      case 'executed_hacked_to_pieces':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was hacked to pieces by <HfLink id={slayer.id} /> for 
            {hf.pronouns.their} crimes
          </>
        );
        break;
      case 'executed_beheaded':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was buried alive for {hf.pronouns.their} crimes
          </>
        );
        break;
      case 'drained_blood':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was drained of {hf.pronouns.their} blood by{' '}
            <HfLink id={slayer.id} />
          </>
        );
        break;
      case 'collapsed':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> collapsed, succumbing to wounds inflicted by{' '}
            <HfLink id={slayer.id} />
          </>
        );
        break;
      case 'scared_to_death':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was scared to death by <HfLink id={slayer.id} />
          </>
        );
        break;
      default:
        console.error('unhandled death type: ' + he.death_cause + ' for ' + he.id);
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was slain by <HfLink id={slayer.id} />.
          </>
        );
        break;
    }

    // if (he.SlayerItemID >= 0) {
    //   eventDesc += ' using a (' + he.SlayerItemID + ')'; //TODO: how do we get the item name???
    // } else if (he.SlayerShooterItemID >= 0) {
    //   eventDesc += ' with a shot from a (' + he.SlayerShooterItemID + ')';
    // } else {
    //   eventDesc += '.';
    // }
  } else {
    //if they died some other way...

    switch (he.death_cause) {
      case 'thirst':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> died of thirst
          </>
        );
        break;
      case 'old_age':
        if (hf.birth_year !== -1 && hf.death_year !== -1) {
          eventDesc = (
            <>
              <HfLink id={hf.id} /> died naturally at the ripe age of 
              {Math.abs(hf.death_year - hf.birth_year)}
            </>
          );
        } else {
          eventDesc = (
            <>
              <HfLink id={hf.id} /> died naturally of old age
            </>
          );
        }
        break;
      case 'suffocated':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> suffocated
          </>
        );
        break;
      case 'bled':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> bled to death
          </>
        ); //TODO: get wounds caused by
        break;
      case 'cold':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> froze to death
          </>
        );
        break;
      case 'crushed_by_a_bridge':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was crushed by a lowering drawbridge
          </>
        ); //TODO: get site of drawbridge
        break;
      case 'drowned':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> drowned
          </>
        ); //TODO: get name of water body
        break;
      case 'starved':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> starved to death
          </>
        );
        break;
      case 'infection':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> succumbed to infection
          </>
        ); //TODO: find out if being treated / what disease if possible?
        break;
      case 'collided_with_an_obstacle':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> died after smashing into something
          </>
        );
        break;
      case 'put_to_rest':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was laid to rest
          </>
        );
        break;
      case 'starved_quit':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> starved to death
          </>
        );
        break;
      case 'trap':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was killed by a clever trap
          </>
        );
        break;
      case 'cave_in':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was crushed by falling rocks
          </>
        ); //TODO: find out if in fortress or not
        break;
      case 'in_a_cage':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> died confined in a cage
          </>
        );
        break;
      case 'frozen_in_water':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> died after being encased in ice
          </>
        );
        break;
      case 'scuttled':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was scuttled
          </>
        );
        break;
      case 'struck_down':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was struck down
          </>
        );
        break;
      case 'execution_generic':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> was summarily executed
          </>
        );
        break;
      case 'leapt_from_height':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> fell fatally from a great height
          </>
        );
        break;
      case 'drown_alt2':
        eventDesc = (
          <>
            <HfLink id={hf.id} /> drowned surreptitiously
          </>
        );
        break;
      default:
        console.error('unhandled death type: ' + he.death_cause + ' for ' + he.id);
        eventDesc = (
          <>
            <HfLink id={hf.id} /> died of some unknown cause
          </>
        );
        break;
    }

    // eventDesc += '.';
  }
  return eventDesc;
};

//---------------------------------------------------------------
const Creature_devoured_desc = ({ he }) => {
  const { find } = useDwarfViz();
  var victim = find.hf(he.victim); //load historical figure data
  var eater = find.hf(he.eater_hf_id); //load historical figure data

  var eventDesc = '';
  if (victim === undefined) {
    victim = { name: 'A creature' };
  }
  if (eater === undefined) {
    eater = { name: 'a creature' };
  }
  eventDesc = (
    <>
      <HfLink id={victim.id} /> was devoured by <HfLink id={eater.id} />
    </>
  );
  return eventDesc;
};

const Hf_relationship_desc = ({ he }) => {
  const { find } = useDwarfViz();
  var source_hf = find.hf(he.source_hf_id); //load historical figure data
  var target_hf = find.hf(he.target_hf_id);

  // await source_hf;
  // await target_hf;

  if (source_hf.name !== null) {
    source_hf.name = formatName(source_hf.name);
  } else {
    source_hf.name = 'a mysterious stranger';
  }
  if (target_hf.name !== null) {
    target_hf.name = formatName(target_hf.name);
  } else {
    target_hf.name = 'a mysterious stranger';
  }

  source_hf.pronouns = getPronouns(source_hf.caste);
  target_hf.pronouns = getPronouns(target_hf.caste);

  var eventDesc = '';

  switch (he.relationship) {
    case 'mother':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became the proud mother of <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'father':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became the proud father of <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'spouse':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id}/> were married
        </>
      );
      break;
    //TODO: is adoption a thing? Check if birth year matches event year?
    case 'child':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became the child of <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'deity':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became a fervant worshipper of <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'lover':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> became lovers
        </>
      );
      if (
        source_hf.name === 'a mysterious stranger' &&
        target_hf.name === 'a mysterious stranger'
      ) {
        eventDesc = 'two people unknown to history became lovers.';
      }
      break;
    case 'former_lover':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> broke off their romantic entanglement
        </>
      );
      break;
    case 'prisoner':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> was imprisoned by <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'imprisoner':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> imprisoned <HfLink id={target_hf.id} />
        </>
      );
      break;
    //TODO: would be great to check for skill increases (if possible) after this to find out what they were apprenticed for?
    case 'master':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became <HfLink id={target_hf.id}/>'s master
        </>
      );
      break;
    case 'apprentice':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became <HfLink id={target_hf.id} />'s apprentice
        </>
      );
      break;
    case 'companion':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became a trusty companion of <HfLink id={target_hf.id} />
        </>
      );
      break;
    //TODO: would be great to find out if there are different reasons these end, and update accordingly
    case 'former_master':
      eventDesc = (
        <>
          <HfLink id={target_hf.id} /> ended {target_hf.pronouns.their} apprenticeship under <HfLink id={source_hf.id} />
        </>
      );
      break;
    case 'former_apprentice':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> ended {source_hf.pronouns.their} apprenticeship under <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'pet_owner':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> adopted <HfLink id={target_hf.id} /> as a pet
        </>
      );
      //eventDesc = `${source_hf.name} adopted ${target_hf.name} as a pet.`;
      break;
    case 'former_spouse':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> divorced their partner <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'deceased_spouse':
      var term;
      if (source_hf.caste === 'male') {
        eventDesc = (
          <>
            <HfLink id={source_hf.id} /> became a widower
          </>
        );
      } else if (source_hf.caste === 'female') {
        eventDesc = (
          <>
            <HfLink id={source_hf.id} />was widowed
          </>
        );
      } else {
        eventDesc = (
          <>
            <HfLink id={source_hf.id} />'s partner died
          </>
        );
      }
      break;
    //-----all cases below are "vague relationships"...not sure what that means??
    case 'war_buddy':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> became war buddies
        </>
      );
      break;
    case 'athlete_buddy':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> bonded over feats of athleticism
        </>
      );
      break;
    case 'childhood_friend':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> became childhood friends
        </>
      );
      break;
    case 'persecution_grudge':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> came to hate <HfLink id={target_hf.id} /> due to {target_hf.pronouns.their} unending persecution
        </>
      );
      break;
    case 'supernatural_grudge':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> formed a supernatural grudge against <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'religious_persecution_grudge':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> came to hate <HfLink id={target_hf.id} /> due to {target_hf.pronouns.their} relentless religious persecution
        </>
      );
      break;
    case 'artistic_buddy':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} />'s common interest in art kindled to friendship
        </>
      );
      break;
    case 'jealous_obsession':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> became jealously obsessed with <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'grudge':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> formed a grudge against <HfLink id={target_hf.id} />
        </>
      );
      break;
    case 'jealous_relationship_grudge':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} />, jealous of <HfLink id={target_hf.id} />'s relationships, formed a grudge against {target_hf.pronouns.them}
        </>
      );
      break;
    case 'scholar_buddy':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> bonded over their common interest in scholarly matters
        </>
      );
      break;
    case 'business_rival':
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> became fierce business rivals
        </>
      );
      break;
    case 'atheletic_rival': //this is misspelled but is the correct key value
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> and <HfLink id={target_hf.id} /> became heated athletic rivals
        </>
      );
      break;
    default:
      console.error("unhandled relationship type '" + he.relationship);
      eventDesc = (
        <>
          <HfLink id={source_hf.id} /> formed some kind of relationship with <HfLink id={target_hf.id} />
        </>
      );
      break;
  }

  return eventDesc;
};

const Hf_simple_battle_event_desc = ({ he }) => {
  const { find } = useDwarfViz();
  var group1 = find.hf(he.group_1_hf_id); //load historical figure data
  group1.name = formatName(group1.name);
  var group2 = find.hf(he.group_2_hf_id); //load historical figure data
  group2.name = formatName(group2.name);

  var eventDesc = '';

  switch (he.subtype) {
    case 'attacked':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> attacked <HfLink id={group2.id} />
        </>
      );
      break;
    case 'scuffle':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> scuffled with <HfLink id={group2.id} />
        </>
      );
      break;
    case 'confront':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> confronted <HfLink id={group2.id} />
        </>
      );
      break;
    case '2 lost after receiving wounds':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> defeated <HfLink id={group2.id} />, inflicting serious wounds upon {getPronouns(group2.caste).them}
        </>
      );
      break;
    case '2 lost after giving wounds':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> defeated <HfLink id={group2.id} />, but was wounded badly in the fight
        </>
      );
      break;
    case '2 lost after mutual wounds':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> defeated <HfLink id={group2.id} />, after serious wounds were inflicted on both
        </>
      );
      break;
    case 'happen upon':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> happened upon <HfLink id={group2.id} />
        </>
      );
      break;
    case 'ambushed':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> ambushed <HfLink id={group2.id} />
        </>
      );
      break;
    case 'corner':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> cornered <HfLink id={group2.id} />
        </>
      );
      break;
    case 'surprised':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> surprised <HfLink id={group2.id} />
        </>
      );
      break;
    case 'got into a brawl':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> got into a brawl with <HfLink id={group2.id} />
        </>
      );
      break;
    case 'subdued':
      eventDesc = (
        <>
          <HfLink id={group1.id} /> subdued <HfLink id={group2.id} />
        </>
      );
      break;
    default:
      console.error('Unknown battle subtype: ' + he.subtype);
      eventDesc = (
        <>
          <HfLink id={group1.id} /> encountered <HfLink id={group2.id} />
        </>
      );
      break;
  }
  return eventDesc;
};

export {
  Artifact_created_desc,
  // written_content_composed_desc,
  Add_hf_entity_link_desc,
  Change_hf_job_desc,
  Change_hf_state_desc,
  Hf_died_desc,
  Creature_devoured_desc,
  Hf_relationship_desc,
  Hf_simple_battle_event_desc,
};
