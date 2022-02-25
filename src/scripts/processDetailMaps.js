const parseDetailMap = require('./parseDetailMap.js');
const { detailMapToGeoJSON } = parseDetailMap;
const fs = require('fs');

const writeJSON = (json, outputPath) => {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(json, null, null), 'utf8');
    console.log(`Wrote GeoJSON to ${outputPath}`);
  } catch (err) {
    console.error('Error writing JSON: ', err);
  }
};

try {
  const directoryPath = process.argv.slice(2)[0];
  const jsonPromise = detailMapToGeoJSON(directoryPath);
  jsonPromise.then((json) => {
    writeJSON(json, `${directoryPath}/regions.geo.json`);
  });
} catch (error) {
  console.log(error);
}
