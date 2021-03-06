//---------------------------------------------------------------
//utility function to capitalize proper names correctly
function formatName(name) {
  var i, j, str, lowers, uppers;
  str = name.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = [
    'A',
    'An',
    'The',
    'And',
    'But',
    'Or',
    'For',
    'Nor',
    'As',
    'At',
    'By',
    'For',
    'From',
    'In',
    'Into',
    'Near',
    'Of',
    'On',
    'Onto',
    'To',
    'With',
  ];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function (txt) {
      return txt.toLowerCase();
    });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());

  return str;
}
//---------------------------------------------------------------
//replace underscores with spaces (relevant for many db entities, like jobs, item_types, etc)
function format(str) {
  return str.replace(/_/g, ' ');
}
//---------------------------------------------------------------
function formatJob(job) {
  var formattedJob;

  switch (job) {
    default:
      formattedJob = job.replace(/_/g, ' ');
  }

  return formattedJob;
}
//---------------------------------------------------------------

//---------------------------------------------------------------
//processes time from seconds72 to something nice
//There are 12 months in a Dwarf Fortress year, exactly 28 days in each month, 24 hours in each day, 60 minutes in each hour, and 60 seconds in each minute. Divide seconds by 72 to get the seconds72 value. There are 1,200 seconds72 in a day. There are 403,200 seconds72 in a Dwarf Fortress year.
function formatTime(historicalEvent) {
  if (historicalEvent.displayTime !== undefined) {
    return historicalEvent.displayTime;
  }

  var displayTime = {
    year: 'a time before time',
    month: undefined,
    dwarfMonth: undefined,
    day: undefined,
    season: undefined,
    fullDate: 'a time before time',
    dwarfFullDate: 'a time before time',
  };

  //if it's a known year...
  if (historicalEvent.year >= 0) {
    displayTime.year = historicalEvent.year;
    displayTime.fullDate = `some time in the year ${historicalEvent.year}`;
    displayTime.dwarfFullDate = `some time in the year ${historicalEvent.year}`;
  }
  //if we have both...
  if (historicalEvent.year >= 0 && historicalEvent.seconds72 > -1) {
    displayTime.year = historicalEvent.year;
    var seasonFull = '';
    var temp = historicalEvent.seconds72 % 100800;
    if (temp <= 33600) {
      seasonFull += 'early ';
    } else if (temp <= 67200) {
      seasonFull += 'mid';
    } else if (temp <= 100800) {
      seasonFull += 'late ';
    }
    var season = historicalEvent.seconds72 % 403200;
    if (season < 100800) {
      seasonFull += 'spring';
    } else if (season < 201600) {
      seasonFull += 'summer';
    } else if (season < 302400) {
      seasonFull += 'autumn';
    } else if (season < 403200) {
      seasonFull += 'winter';
    }

    displayTime.season = seasonFull;

    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    var dwarfMonths = [
      'Granite',
      'Slate',
      'Felsite',
      'Hematite',
      'Malachite',
      'Galena',
      'Limestone',
      'Sandstone',
      'Timber',
      'Moonstone',
      'Opal',
      'Obsidian',
    ];

    var monthIndex = 1 + Math.ceil(historicalEvent.seconds72 / (28 * 1200));
    displayTime.month = months[monthIndex];
    displayTime.dwarfMonth = dwarfMonths[monthIndex];
    displayTime.day = 1 + (historicalEvent.seconds72 % (28 * 1200)) / 1200;

    displayTime.fullDate = `${displayTime.month} ${ordinal(displayTime.day)}, ${displayTime.year}`;
    displayTime.dwarfFullDate = `${displayTime.dwarfMonth} ${ordinal(displayTime.day)}, ${
      displayTime.year
    }`;
  }

  historicalEvent.displayTime = displayTime;

  return displayTime;
}
//---------------------------------------------------------------
//formatting function that returns titles with failovers for missing data in a variety of fields
//ie if a "long title" is requested but there isn't data to support it, it will return a short title
// type: title, titleForm, titleFormStyle
function getWorkTitle(work, type) {
  //type = title: The Ignited Copper
  //type = titleForm: The Ignited Copper, a musical composition
  //type = titleFormStyle: Unholinesses: Suddenly The Wind Knows Afterward, a floridly disjointed poem

  var titleType = {
    title: 'an unknown work',
    titleForm: '',
    titleFormStyle: '',
  };

  if (work.title != null) {
    titleType.title = '<em>' + work.title + '</em>';
  }

  if (type === 'title') {
    return titleType.title;
  }
  //----------------------
  //type = titleForm: The Ignited Copper, a musical composition
  //if (work.title === null && work.form === null) { titleType.titleForm = "an unknown work"; }
  //if (work.title != null && work.form === null) { titleType.titleForm = titleType.title; }
  if (work.form === null) {
    titleType.titleForm = titleType.title;
  }

  var form = '';

  switch (work.form) {
    case 'autobiography':
      form = 'autobiography';
      break;
    case 'biography':
      form = 'biography';
      break;
    case 'chronicle':
      form = 'chronicle';
      break;
    case 'dialog':
      form = 'dialog';
      break;
    case 'essay':
      form = 'essay';
      break;
    case 'guide':
      form = 'guide';
      break;
    case 'letter':
      form = 'letter';
      break;
    case 'manual':
      form = 'manual';
      break;
    case 'novel':
      form = 'novel';
      break;
    case 'play':
      form = 'play';
      break;
    case 'poem':
      form = 'poem';
      break;
    case 'short story':
      form = 'short story';
      break;
    case 'musical composition':
      form = 'musical composition';
      break;
    case 'choreography':
      form = 'choreography';
      break;
    case 'cultural history':
      form = 'cultural history';
      break;
    case 'star chart':
      form = 'star chart';
      break;
    case 'comparative biography':
      form = 'comparative biography';
      break;
    case 'cultural comparison':
      form = 'cultural comparison';
      break;
    case 'atlas':
      form = 'atlas';
      break;
    case 'treatise on technological evolution':
      form = 'treatise on technological evolution';
      break;
    case 'alternate history':
      form = 'alternate history';
      break;
    case 'star catalogue':
      form = 'star catalogue';
      break;
    case 'dictionary':
      form = 'dictionary';
      break;
    case 'genealogy':
      form = 'genealogy';
      break;
    case 'encyclopedia':
      form = 'encyclopedia';
      break;
    case 'biographical dictionary':
      form = 'biographical dictionary';
      break;
    default:
      form = 'an unknown form';
      console.error('unknown form ' + work.form);
      break;
  }

  if (work.title === null && work.form != null) {
    titleType.titleForm = `an untitled ${form}`;
  }
  if (work.title != null && work.form != null) {
    titleType.titleForm = `${titleType.title}, ${a_an(form)}`;
  }

  if (type === 'titleForm') {
    return titleType.titleForm;
  }
  //--------------
  //type = titleFormStyle: Unholinesses: Suddenly The Wind Knows Afterward, a floridly disjointed poem
  if (work.title === null && work.form === null && work.style.length === 0) {
    titleType.titleFormStyle = 'an unknown work';
  }
  if (work.title === null && work.form != null && work.style.length === 0) {
    titleType.titleFormStyle = `an untitled ${form}`;
  }
  if (work.title != null && work.form === null && work.style.length === 0) {
    titleType.titleFormStyle = titleType.title;
  }
  if (work.title != null && work.form != null && work.style.length === 0) {
    titleType.titleFormStyle = titleType.titleForm;
  }

  var style = '';

  for (var x = 0; x < work.style.length; x++) {
    switch (work.style[x].label) {
      case 'self indulgent':
        work.style[x].label = 'self-indulgent';
        break;
      case 'rant':
        work.style[x].label = 'ranting';
        break;
      default:
        break;
    }
  }

  if (work.style.length === 1) {
    style = work.style[0].label;
  }
  if (work.style.length > 1) {
    style = adverbify(work.style[0].label) + ' ' + work.style[1].label;
  }

  if (work.title === null && work.form === null && work.style.length > 0) {
    titleType.titleFormStyle = `${a_an(style)} untitled work`;
  }
  if (work.title === null && work.form != null && work.style.length > 0) {
    titleType.titleFormStyle = `${a_an(style)} untitled ${form}`;
  }
  if (work.title != null && work.form === null && work.style.length > 0) {
    titleType.titleFormStyle = `${titleType.title}, ${a_an(style)} work`;
  }
  if (work.title != null && work.form != null && work.style.length > 0) {
    titleType.titleFormStyle = `${titleType.title}, ${a_an(style)} ${form}`;
  }

  return titleType.titleFormStyle;
}
//---------------------------------------------------------------
//type = null or "name": The Scorching of Thieves
//type = "nameRace": The Scorching of Thieves, a serpent man guild
//type = "nameVerbose": The Scorching of Thieves, a serpent man woodcutter's guild
function getEntityName(entity, type) {
  var name;
  var nameRace;
  var nameVerbose;

  if (entity.name !== null) {
    name = entity.name;
  } else {
    name = 'an unnamed organization';
  }

  var orgName;
  var orgNameVerbose;

  switch (entity.type_) {
    case 'civilization':
      orgName = 'civilization';
      break;
    case 'religion':
      orgName = 'religion';
      break;
    case 'sitegovernment': //TODO: of what site?
      orgName = 'governing body';
      orgNameVerbose = '';
      break;
    case 'nomadicgroup':
      orgName = 'nomadic group';
      break;
    case 'outcast':
      orgName = 'group of outcasts';
      break;
    case 'migratinggroup':
      orgName = 'migrating group';
      break;
    case 'performancetroupe':
      orgName = 'performance troupe';
      break;
    case 'guild':
      orgName = 'guild';
      break;
    case 'militaryunit':
      orgName = 'military unit';
      break;
    case 'merchantcompany':
      orgName = 'merchant company';
      break;
    case undefined:
      orgName = 'group of people';
      break;
    default:
      console.error('unhandled entity type: ' + entity.type_);
      orgName = 'group of people';
      break;
  }
  if (entity.name === null) {
    name = `an unnamed ${orgName}`;
  } else {
    name = entity.name;
  }

  //if no type was provided, or type is "name", return it
  if (type === undefined || type === 'name') {
    return name;
  }
  //---------------------------
  //type = "nameRace": The Scorching of Thieves, a serpent man guild
  var race = getRace(entity.race);
  
  if (type === 'nameRace') {
    if (entity.name !== null && entity.race !== null && entity.type_ !== null) {
      nameRace = `${name}, ${a_an(race)} ${orgName}`;
    }
    if (entity.name !== null && entity.race !== null && entity.type_ === null) {
      nameRace = `${name}, a group of ${pluralRace(race)}`;
    }
    if (entity.name !== null && entity.race === null && entity.type_ !== null) {
      nameRace = `${name}, ${a_an(orgName)}`;
    }
    if (entity.name === null && entity.race !== null && entity.type_ !== null) {
      nameRace = `an unnamed ${race} ${orgName}`;
    }
    if (entity.name === null && entity.race !== null && entity.type_ === null) {
      nameRace = `an unnamed group of ${pluralRace(race)}`;
    }
    if (entity.name === null && entity.race === null && entity.type_ !== null) {
      nameRace = `an unnamed ${orgName}`;
    }

    return nameRace;
  }
  //--------------------------
  //type = "nameVerbose": The Scorching of Thieves, a serpent man woodcutter's guild
  //TODO
}
//---------------------------------------------------------------
//returns the race or "unknown race"
function getRace(race) {
  switch (race) {
    case 'olm_man':
      return 'olm man';
      break;
    case 'cave_fish_man':
      return 'cave fish man';
      break;
    case 'cave_swallow_man':
      return 'cave swallow man';
      break;
    case 'serpent_man':
      return 'serpent man';
      break;
    case 'bat_man':
      return 'bat man';
      break;
    case 'reptile_man':
      return 'reptile man';
      break;
    case 'amphibian_man':
      return 'amphibian man';
      break;
    case 'dwarf':
      return 'dwarf';
      break;
    case 'elf':
      return 'elf';
      break;
    case 'goblin':
      return 'goblin';
      break;
    case 'human':
      return 'human';
      break;
    case 'kobold':
      return 'kobold';
      break;
    case null:  // Dirty fix, some races can apparently be null (e.g. year 91 has one), causes crash otherwise
      return 'unknown race';
      break;
    default:
      if (race !== undefined) {
        console.error('unhandled race: ' + race);
      }
      if (race !== undefined && race.includes('_')) {
        return race.replace(/_/g, ' ');
      } else {
        return 'person of unknown race';
      }
      break;
  }
}

function pluralRace(race) {
  switch (race) {
    case 'dwarf':
      return 'dwarves';
      break;
    case 'elf':
      return 'elves';
      break;
    default:
      if (race.substr(-3, race.length - 1) === 'man') {
        return race.substring(0, race.length - 2) + 'n';
      }
  }
}

//---------------------------------------------------------------
//returns the adjective form of the adverb (used for style descriptions)
function adverbify(adjective) {
  switch (adjective) {
    case 'meandering':
      return 'meanderingly';
    case 'cheerful':
      return 'cheerfully';
    case 'melancholy':
      return 'melancholically';
    case 'mechanical':
      return 'mechanically';
    case 'serious':
      return 'earnestly';
    case 'disjointed':
      return 'disjointedly';
    case 'florid':
      return 'floridly';
    case 'forceful':
      return 'forcefully';
    case 'humorous':
      return 'humorously';
    case 'puerile':
      return 'immaturely';
    case 'self-indulgent': //this is the type "self indulgent" but we format it before this function to "self-indulgent"
      return 'self-indulgently';
    case 'compassionate':
      return 'compassionately';
    case 'vicious':
      return 'viciously';
    case 'concise':
      return 'concisely';
    case 'sardonic':
      return 'sardonically';
    case 'witty':
      return 'wittily';
    case 'ranting': //this is the type "rant" but we format it before this function to "ranting"
      return 'bombastically';
    case 'tender':
      return 'tenderly';
    default:
      console.error('unhandled adverbification for ' + adjective);
      return adjective + 'ly';
  }
}
//---------------------------------------------------------------
//--adds "th", "st" to numbers
function ordinal(n) {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
//---------------------------------------------------------------
function getPronouns(caste) {
  //They went to their doctor themself to see if it was theirs
  switch (caste) {
    case 'male':
      return {
        they: 'he',
        them: 'him',
        their: 'his',
        theirs: 'his',
        themself: 'himself',
      };
      break;
    case 'female':
      return {
        they: 'she',
        them: 'her',
        their: 'her',
        theirs: 'hers',
        themself: 'herself',
      };
      break;
    default:
      return {
        they: 'they',
        them: 'them',
        their: 'their',
        theirs: 'theirs',
        themself: 'themself',
      };
  }
}
//---------------------------------------------------------------
function a_an(word) {
  if (word.toLowerCase().endsWith('s') || word.toLowerCase() === 'armor') {
    return 'some ' + word;
  } else if (
    word.toLowerCase().startsWith('a') ||
    word.toLowerCase().startsWith('e') ||
    word.toLowerCase().startsWith('i') ||
    word.toLowerCase().startsWith('o') ||
    word.toLowerCase().startsWith('u')
  ) {
    return 'an ' + word;
  } else {
    return 'a ' + word;
  }
}

export {
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
};
