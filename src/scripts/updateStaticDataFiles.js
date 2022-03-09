const fs = require('fs');
const axios = require('axios');
const storytellerURL = 'http://192.168.0.10:20350/api';

const fetchFromStoryteller = async (endpoint, resourceId = null) => {
  const items = [];
  let response;
  let nextPage = 0;
  try {
    do {
      let url = resourceId
        ? `${storytellerURL}/${endpoint}/${resourceId}?per_page=500&page=${nextPage}`
        : `${storytellerURL}/${endpoint}?per_page=500&page=${nextPage}`;
      response = (await axios.get(url)).data;
      items.push(...response.data);
      nextPage = 1 + response.page_nr;
    } while (response.links.next !== null);
  } catch (error) {
    throw error;
  }
  return items;
};

const writeStaticDataFile = (tableName, data) => {
  const writeJSON = (json, outputPath) => {
    try {
      fs.writeFileSync(outputPath, JSON.stringify({ data: json }, null, null), 'utf8');
      console.log(`Wrote ${tableName} to ${outputPath}`);
    } catch (err) {
      console.error(`Error writing ${tableName}: `, err);
    }
  };
  writeJSON(data, `./src/data/${tableName}.json`);
};

const dataTablesToEndpointNames = {
  regions: 'regions',
  historicalFigures: 'historical_figures',
  sites: 'sites',
  entities: 'entities',
  entityPopulations: 'entity_populations',
  worldsInfo: 'worlds_info',
  historicalEvents: 'historical_events',
};

for (const key in dataTablesToEndpointNames) {
  fetchFromStoryteller(dataTablesToEndpointNames[key]).then((data) =>
    writeStaticDataFile(key, data),
  );
}
