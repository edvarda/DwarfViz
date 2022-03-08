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

// function artifact_created_desc(he, dwarfViz) {
//   var eventDesc = '';

//   var creator = dwarfViz.find.hf(he.creator_hf_id);
//   var artifact = await load_ref_data(`artifacts/${he.artifact_id}`);
//   var site = dwarfViz.find.site(he.site_id);

//   creator.name = creator.name !== null ? formatName(creator.name) : 'an unknown person';

//   // item_types can contain underscores, item_subtypes do not
//   var itemType =
//     artifact.item_subtype !== null ? artifact.item_subtype : format(artifact.item_type);
//   itemType = artifact.item_mat !== null ? artifact.item_mat + ' ' + itemType : itemType;

//   if (he.name_only) {
//     // artifact wasn't created, it just got named (for having a long kill list)
//     eventDesc += `${creator.name} named ${getPronouns(creator.caste).their} ${itemType} '${
//       artifact.name
//     }'`;
//     if (he.site_id > -1 && site.name !== null) eventDesc += ` in ${site.name}`;
//   } else {
//     eventDesc += `${creator.name} created ${a_an(itemType)}`;
//     if (artifact.name !== null) eventDesc += ` called '${artifact.name}'`;
//     if (he.site_id > -1 && site.name !== null) eventDesc += ` in ${site.name}`;
//   }

//   return eventDesc + '.';
// }

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

function add_hf_entity_link_desc(he, dwarfViz) {
  var hf = dwarfViz.find.hf(he.hf_id); //load historical figure data
  hf.name = formatName(hf.name);
  var appointer = dwarfViz.find.hf(he.appointer_hf_id); //load historical figure data
  var hfActionPromisedTo = dwarfViz.find.hf(he.promise_to_hf_id); //load historical figure data
  var civ = dwarfViz.find.entity(he.civ_id);

  var eventDesc = '';

  switch (he.link_type) {
    case 'prisoner':
      eventDesc += `${hf.name} was imprisoned by ${getEntityName(civ, 'nameRace')}`;
      break;
    case 'enemy':
      eventDesc += `${hf.name} became an enemy of ${getEntityName(civ, 'nameRace')}.`;
      break;
    case 'member':
      eventDesc += `${hf.name} became a member of ${getEntityName(civ, 'nameRace')}.`;
      break;
    case 'former member':
      eventDesc += `${hf.name} became a former member of ${getEntityName(civ, 'nameRace')}.`;
      break;
    case 'slave':
      eventDesc += `${hf.name} was enslaved by ${getEntityName(civ, 'nameRace')}`;
      break;
    case 'position':
      if (he.position !== undefined) {
        eventDesc += `${hf.name} was given the position of ${he.position} within ${getEntityName(
          civ,
          'nameRace',
        )}.`;
      } else {
        eventDesc += `${hf.name} was given a new position within ${getEntityName(
          civ,
          'nameRace',
        )}.`;
      }
      break;
    case 'squad':
      eventDesc += `${hf.name} became a member of ${getEntityName(civ, 'nameRace')}`;
      break;
    default:
      console.error('unhandled link type: ' + he.link_type);
      break;
  }
  return eventDesc;
}

function change_hf_job_desc(he, dwarfViz) {
  var hf = dwarfViz.find.hf(he.hf_id); //load data for the historical figure (he.hf_id)

  var eventDesc = ''; //create a blank string

  he.new_job = formatJob(he.new_job); //run formatter on job (in description-utils)
  he.old_job = formatJob(he.old_job); //run formatter on job (in description-utils)

  if (he.new_job !== 'standard' && he.old_job !== 'standard') {
    //create text
    eventDesc += `${hf.name} stopped being ${a_an(he.old_job)} and became ${a_an(he.new_job)}`;
  } else if (he.new_job !== 'standard') {
    eventDesc += `${hf.name} became ${a_an(he.new_job)}`;
  } else {
    eventDesc += `${hf.name} stopped being a ${a_an(he.old_job)}`;
  }

  eventDesc += '.';

  return eventDesc;
}
//---------------------------------------------------------------
function change_hf_state_desc(he, dwarfViz) {
  var site = dwarfViz.find.site(he.site_id); //load data for the event's site (he.site_id)
  var hf = dwarfViz.find.hf(he.hf_id); //load data for the historical figure (he.hf_id)
  var region = dwarfViz.find.region(he.region_id); //load data for the historical figure (he.hf_id)

  var eventDesc = '';

  switch (he.state) {
    case 'settled':
      site
        ? (eventDesc += `${hf.name} settled in ${site.name}`)
        : (eventDesc += `${hf.name} settled in ${region.name}`);
      break;
    case 'wandering':
      eventDesc += `${hf.name} began wandering the world`; //TODO: why?
      break;
    case 'scouting':
      eventDesc += `${hf.name} began scouting around ${site.name}`; //TODO: scouting where? why?
      break;
    case 'snatcher':
      eventDesc += `${hf.name} started looking for someone to abduct`; //TODO: why?
      break;
    case 'refugee':
      eventDesc += `${hf.name} became a refugee`; //TODO: of what conflict? Why?
      break;
    case 'thief':
      eventDesc += `${hf.name} became a thief`;
      break;
    case 'hunting':
      eventDesc += `${hf.name} starting hunting for game around ${site.name}`; //TODO: biome-specific?
      break;
    default:
      eventDesc += `${hf.name} changed their state in some unknown way`;
      break;
  }

  eventDesc += '.';

  return eventDesc;
}

//---------------------------------------------------------------
//TODO: get name of where they died...is subregion_id the same as a region id???
function hf_died_desc(he, dwarfViz) {
  var hf = dwarfViz.find.hf(he.hf_id); //load historical figure data
  hf.name = formatName(hf.name);
  hf.pronouns = getPronouns(hf.caste);

  if (he.slayer_hf_id > 0 || he.slayer_race !== undefined) {
    //if hf was killed...

    var slayer = {};
    if (he.slayer_hf_id > -1) {
      slayer = dwarfViz.find.hf(he.slayer_hf_id); //load slayer data
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

    var eventDesc = '';
    switch (
      he.death_cause //TODO: find out if it would be good to put race in here (undead, monster, etc)
    ) {
      case 'dragons_fire':
        eventDesc = `${hf.name} was incinerated by a blast of fire from ${slayer.name}.`;
        break;
      case 'burned':
        eventDesc = `${hf.name} was burned to death by ${slayer.name}'s fire.`;
        break;
      case 'murdered':
        eventDesc = `${hf.name} was cruelly murdered by ${slayer.name}`;
        break;
      case 'murder':
        eventDesc = `${hf.name} was cruelly murdered by ${slayer.name}`;
        break;
      case 'shot':
        eventDesc = `${hf.name} was shot by ${slayer.name}`;
        break;
      case 'struck_down':
        eventDesc = `${hf.name} was struck down by ${slayer.name}`;
        break;
      case 'executed_buried_alive':
        eventDesc = `${hf.name} was buried alive by ${slayer.name} for ${hf.pronouns.their} crimes`;
        break;
      case 'executed_burned_alive':
        eventDesc = `${hf.name} was burned alive by ${slayer.name} for ${hf.pronouns.their} crimes`;
        break;
      case 'executed_crucified':
        eventDesc = `${hf.name} was crucified by ${slayer.name} for ${hf.pronouns.their} crimes`;
        break;
      case 'executed_drowned':
        eventDesc = `${hf.name} was drowned by ${slayer.name} for ${hf.pronouns.their} crimes`;
        break;
      case 'executed_fed_to_beasts':
        eventDesc = `${hf.name} was fed to beasts by ${slayer.name} for ${hf.pronouns.their} crimes`;
        break;
      case 'executed_hacked_to_pieces':
        eventDesc = `${hf.name} was hacked to pieces by ${slayer.name} for ${hf.pronouns.their} crimes`;
        break;
      case 'executed_beheaded':
        eventDesc = `${hf.name} was buried alive for ${hf.pronouns.their} crimes`;
        break;
      case 'drained_blood':
        eventDesc = `${hf.name} was drained of ${hf.pronouns.their} blood by ${slayer.name}`;
        break;
      case 'collapsed':
        eventDesc = `${hf.name} collapsed, succumbing to wounds inflicted by ${slayer.name}`;
        break;
      case 'scared_to_death':
        eventDesc = `${hf.name} was scared to death by  ${slayer.name}`;
        break;
      default:
        console.error('unhandled death type: ' + he.death_cause + ' for ' + he.id);
        eventDesc = `${hf.name} was slain by ${slayer.name}.`;
        break;
    }

    if (he.SlayerItemID >= 0) {
      eventDesc += ' using a (' + he.SlayerItemID + ')'; //TODO: how do we get the item name???
    } else if (he.SlayerShooterItemID >= 0) {
      eventDesc += ' with a shot from a (' + he.SlayerShooterItemID + ')';
    } else {
      eventDesc += '.';
    }
  } else {
    //if they died some other way...

    switch (he.death_cause) {
      case 'thirst':
        eventDesc = `${hf.name} died of thirst`;
        break;
      case 'old_age':
        if (hf.birth_year !== -1 && hf.death_year !== -1) {
          eventDesc = `${hf.name} died naturally at the ripe age of ${Math.abs(
            hf.death_year - hf.birth_year,
          )}`;
        } else {
          eventDesc = `${hf.name} died naturally of old age`;
        }
        break;
      case 'suffocated':
        eventDesc = `${hf.name} suffocated`;
        break;
      case 'bled':
        eventDesc = `${hf.name} bled to death`; //TODO: get wounds caused by
        break;
      case 'cold':
        eventDesc = `${hf.name} froze to death`;
        break;
      case 'crushed_by_a_bridge':
        eventDesc = `${hf.name} was crushed by a lowering drawbridge`; //TODO: get site of drawbridge
        break;
      case 'drowned':
        eventDesc = `${hf.name} drowned`; //TODO: get name of water body
        break;
      case 'starved':
        eventDesc = `${hf.name} starved to death`;
        break;
      case 'infection':
        eventDesc = `${hf.name} succumbed to infection`; //TODO: find out if being treated / what disease if possible?
        break;
      case 'collided_with_an_obstacle':
        eventDesc = `${hf.name} died after smashing into something`;
        break;
      case 'put_to_rest':
        eventDesc = `${hf.name} was laid to rest`;
        break;
      case 'starved_quit':
        eventDesc = `${hf.name} starved to death`;
        break;
      case 'trap':
        eventDesc = `${hf.name} was killed by a clever trap`;
        break;
      case 'cave_in':
        eventDesc = `${hf.name} was crushed by falling rocks`; //TODO: find out if in fortress or not
        break;
      case 'in_a_cage':
        eventDesc = `${hf.name} died confined in a cage`;
        break;
      case 'frozen_in_water':
        eventDesc = `${hf.name} died after being encased in ice `;
        break;
      case 'scuttled':
        eventDesc = `${hf.name} was scuttled`;
        break;
      case 'struck_down':
        eventDesc = `${hf.name} was struck down`;
        break;
      default:
        console.error('unhandled death type: ' + he.death_cause + ' for ' + he.id);
        eventDesc = `${hf.name} died of some unknown cause`;
        break;
    }

    eventDesc += '.';
  }

  return eventDesc;
}

//---------------------------------------------------------------
function creature_devoured_desc(he, dwarfViz) {
  var victim = dwarfViz.find.hf(he.victim); //load historical figure data
  var eater = dwarfViz.find.hf(he.eater_hf_id); //load historical figure data

  var eventDesc = '';
  if (victim === undefined){
    victim = {name: "Unknown"}
  }
  if (eater === undefined){
    eater = {name: "Unknown"}
  }

  eventDesc += `${victim.name} was devoured by ${eater.name}.`;

  return eventDesc;
}

function hf_relationship_desc(he, dwarfViz) {
  var source_hf = dwarfViz.find.hf(he.source_hf_id); //load historical figure data
  var target_hf = dwarfViz.find.hf(he.target_hf_id);

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
      eventDesc = `${source_hf.name} became the proud mother of ${target_hf.name}.`;
      break;
    case 'father':
      eventDesc = `${source_hf.name} became the proud father of ${target_hf.name}.`;
      break;
    case 'spouse':
      eventDesc = `${source_hf.name} and ${target_hf.name} were married.`;
      break;
    //TODO: is adoption a thing? Check if birth year matches event year?
    case 'child':
      eventDesc = `${source_hf.name} became the child of ${target_hf.name}.`;
      break;
    case 'deity':
      eventDesc = `${source_hf.name} became a fervant worshipper of ${target_hf.name}.`;
      break;
    case 'lover':
      eventDesc = `${source_hf.name} and ${target_hf.name} became lovers.`;
      if (
        source_hf.name === 'a mysterious stranger' &&
        target_hf.name === 'a mysterious stranger'
      ) {
        eventDesc = 'two people unknown to history became lovers.';
      }
      break;
    case 'former_lover':
      eventDesc = `${source_hf.name} and ${target_hf.name} broke off their romantic entanglement.`;
      break;
    case 'prisoner':
      eventDesc = `${source_hf.name} was imprisoned by ${target_hf.name}.`;
      break;
    case 'imprisoner':
      eventDesc = `${source_hf.name} imprisoned ${target_hf.name}.`;
      break;
    //TODO: would be great to check for skill increases (if possible) after this to find out what they were apprenticed for?
    case 'master':
      eventDesc = `${source_hf.name} became ${target_hf.name}'s master.`;
      break;
    case 'apprentice':
      eventDesc = `${source_hf.name} became ${target_hf.name}'s apprentice.`;
      break;
    case 'companion':
      eventDesc = `${source_hf.name} became a trusty companion of ${target_hf.name}.`;
      break;
    //TODO: would be great to find out if there are different reasons these end, and update accordingly
    case 'former_master':
      eventDesc = `${target_hf.name} ended ${target_hf.pronouns.their} apprenticeship under ${source_hf.name}.`;
      break;
    case 'former_apprentice':
      eventDesc = `${source_hf.name} ended ${source_hf.pronouns.their} apprenticeship under ${target_hf.name}.`;
      break;
    case 'pet_owner':
      eventDesc = `${source_hf.name} adopted ${target_hf.name} as a pet.`;
      break;
    case 'former_spouse':
      eventDesc = `${source_hf.name} divorced their partner ${target_hf.name}.`;
      break;
    case 'deceased_spouse':
      var term;
      if (source_hf.caste === 'male') {
        eventDesc = `${source_hf.name} became a widower.`;
      } else if (source_hf.caste === 'female') {
        eventDesc = `${source_hf.name} was widowed.`;
      } else {
        eventDesc = `${source_hf.name}'s partner died.`;
      }
      break;
    //-----all cases below are "vague relationships"...not sure what that means??
    case 'war_buddy':
      eventDesc = `${source_hf.name} and ${target_hf.name} became war buddies.`;
      break;
    case 'athlete_buddy':
      eventDesc = `${source_hf.name} and ${target_hf.name} bonded over feats of athleticism.`;
      break;
    case 'childhood_friend':
      eventDesc = `${source_hf.name} and ${target_hf.name} became childhood friends.`;
      break;
    case 'persecution_grudge':
      eventDesc = `${source_hf.name} came to hate ${target_hf.name} due to ${target_hf.pronouns.their} unending persecution.`;
      break;
    case 'supernatural_grudge':
      eventDesc = `${source_hf.name} formed a supernatural grudge against ${target_hf.name}.`;
      break;
    case 'religious_persecution_grudge':
      eventDesc = `${source_hf.name} came to hate ${target_hf.name} due to ${target_hf.pronouns.their} relentless religious persecution.`;
      break;
    case 'artistic_buddy':
      eventDesc = `${source_hf.name} and ${target_hf.name}'s common interest in art kindled to friendship.`;
      break;
    case 'jealous_obsession':
      eventDesc = `${source_hf.name} became jealously obsessed with ${target_hf.name}.`;
      break;
    case 'grudge':
      eventDesc = `${source_hf.name} formed a grudge against ${target_hf.name}.`;
      break;
    case 'jealous_relationship_grudge':
      eventDesc = `${source_hf.name}, jealous of ${target_hf.name}'s relationships, formed a grudge against ${target_hf.pronouns.them}.`;
      break;
    case 'scholar_buddy':
      eventDesc = `${source_hf.name} and ${target_hf.name} bonded over their common interest in scholarly matters.`;
      break;
    case 'business_rival':
      eventDesc = `${source_hf.name} and ${target_hf.name} became fierce business rivals.`;
      break;
    case 'atheletic_rival': //this is misspelled but is the correct key value
      eventDesc = `${source_hf.name} and ${target_hf.name} became heated athletic rivals.`;
      break;
    default:
      console.error("unhandled relationship type '" + he.relationship);
      eventDesc = `${source_hf.name} formed some kind of relationship with ${target_hf.name}`;
      break;
  }

  return eventDesc;
}

function hf_simple_battle_event_desc(he, dwarfViz) {
  var group1 = dwarfViz.find.hf(he.group_1_hf_id); //load historical figure data
  group1.name = formatName(group1.name);
  var group2 = dwarfViz.find.hf(he.group_2_hf_id); //load historical figure data
  group2.name = formatName(group2.name);

  var eventDesc = '';

  switch (he.subtype) {
    case 'attacked':
      eventDesc += `${group1.name} attacked ${group2.name}`;
      break;
    case 'scuffle':
      eventDesc += `${group1.name} scuffled with ${group2.name}`;
      break;
    case 'confront':
      eventDesc += `${group1.name} confronted ${group2.name}`;
      break;
    case '2 lost after receiving wounds':
      eventDesc += `${group1.name} defeated ${group2.name}, inflicting serious wounds upon ${
        getPronouns(group2.caste).them
      }`;
      break;
    case '2 lost after giving wounds':
      eventDesc += `${group1.name} defeated ${group2.name}, but was wounded badly in the fight`;
      break;
    case '2 lost after mutual wounds':
      eventDesc += `${group1.name} defeated ${group2.name}, after serious wounds were inflicted on both`;
      break;
    case 'happen upon':
      eventDesc += `${group1.name} happened upon ${group2.name}`;
      break;
    case 'ambushed':
      eventDesc += `${group1.name} ambushed ${group2.name}`;
      break;
    case 'corner':
      eventDesc += `${group1.name} cornered ${group2.name}`;
      break;
    case 'surprised':
      eventDesc += `${group1.name} surprised ${group2.name}`;
      break;
    case 'got into a brawl':
      eventDesc += `${group1.name} got into a brawl with ${group2.name}`;
      break;
    case 'subdued':
      eventDesc += `${group1.name} subdued ${group2.name}`;
      break;
    default:
      console.error('Unknown battle subtype: ' + he.subtype);
      eventDesc += `${group1.name} encountered ${group2.name}`;
      break;
  }

  eventDesc += '.';
  return eventDesc;
}

export {
  // artifact_created_desc,
  // written_content_composed_desc,
  add_hf_entity_link_desc,
  change_hf_job_desc,
  change_hf_state_desc,
  hf_died_desc,
  creature_devoured_desc,
  hf_relationship_desc,
  hf_simple_battle_event_desc,
};
