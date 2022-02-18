const promisify = require('util').promisify;
const getPixelsPromise = promisify(require('get-pixels'));
const _ = require('lodash');
const fs = require('fs');

const getImageArray = async (imageFilePath) => {
  const pixelsArray = await getPixelsPromise(imageFilePath);
  return pixelsArray.step(1, -1); // Flip array up/down to correspond to leaflet coordinate ordering.
};

const getJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
};

const getColorToBiomeMap = (biomeColorKeyFilePath) => {
  const biomeTypesAndColors = getJSON(biomeColorKeyFilePath)
    .split('\n')
    .filter((line) => !!line)
    .map(_.trim)
    .map((line) => {
      const startParenIndex = line.indexOf('(');
      return [
        line.slice(0, startParenIndex).trim(),
        line.slice(startParenIndex + 1, line.length - 1),
      ];
    });
  const colorToBiomeMap = {};
  for (const [biomeType, biomeColor] of biomeTypesAndColors) {
    colorToBiomeMap[biomeColor] = { type: biomeType };
  }
  return colorToBiomeMap;
};

const regionToGeoJson = ({ type, outline }) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'MultiPoint',
      coordinates: outline,
    },
    properties: {
      biome: type,
    },
  };
};

const getBiomeToCoordsMap = (imageArray, colorToBiomeMap) => {
  for (const color in colorToBiomeMap) {
    colorToBiomeMap[color].coordsList = [];
    colorToBiomeMap[color].coordsMatrix = [];
    for (let i = 0; i < imageArray.shape[0]; i++) {
      colorToBiomeMap[color].coordsMatrix[i] = [];
    }
  }

  for (let i = 0; i < imageArray.shape[0]; i++) {
    for (let j = 0; j < imageArray.shape[1]; j++) {
      const pixel = imageArray.pick(i, j, null);
      const colorString = pixel.get(0) + ',' + pixel.get(1) + ',' + pixel.get(2);
      if (!colorToBiomeMap[colorString].coordsMatrix[i]) {
        colorToBiomeMap[colorString].coordsMatrix[i] = [];
      }
      colorToBiomeMap[colorString].coordsMatrix[i][j] = true;
      colorToBiomeMap[colorString].coordsList.push([i, j]);
    }
  }
  return _.values(colorToBiomeMap);
};

const detailMapToGeoJSON = async (directoryPath) => {
  const imageArray = await getImageArray(`${directoryPath}/image.png`);
  const colorsToBiomes = getColorToBiomeMap(`${directoryPath}/biome_color_key.txt`);
  const biomesToCoords = getBiomeToCoordsMap(imageArray, colorsToBiomes);

  const biomesSeparatedIntoRegions = biomesToCoords.map((biome) => {
    const coordsByRegion = [];
    const outlinesByRegion = [];
    const visited = [];
    for (let i = 0; i < imageArray.shape[0]; i++) {
      visited[i] = [];
    }
    const getNeighbours = (x, y) => {
      const unvisitedNeighbours = [];
      const allNeighbours = [];
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const [nx, ny] = [x + i, y + j];
          if (i === 0 && j === 0) continue;
          if (nx < 0 || nx >= imageArray.shape[0] || ny < 0 || ny >= imageArray.shape[1]) continue;
          if (!visited[nx][ny] && biome.coordsMatrix[nx] && biome.coordsMatrix[nx][ny]) {
            visited[nx][ny] = true;
            unvisitedNeighbours.push([nx, ny]);
          }
          if (biome.coordsMatrix[nx] && biome.coordsMatrix[nx][ny]) {
            allNeighbours.push([nx, ny]);
          }
        }
      }
      return [allNeighbours, unvisitedNeighbours];
    };
    const queue = [];
    while (!_.isEmpty(biome.coordsList)) {
      const region = [];
      const regionOutline = [];
      let newStart;
      do {
        newStart = biome.coordsList.shift();
      } while (visited[newStart[0]][newStart[1]] && !_.isEmpty(biome.coordsList));
      if (visited[newStart[0]][newStart[1]]) break;
      visited[newStart[0]][newStart[1]] = true;
      queue.push(newStart);
      while (!_.isEmpty(queue)) {
        const coord = queue.shift();
        const [allNeighbours, unvisitedNeighbours] = getNeighbours(coord[0], coord[1]);
        if (allNeighbours.length < 6) regionOutline.push(coord); // Part of outline
        region.push(coord); // Part of outline
        queue.push(...unvisitedNeighbours);
      }
      coordsByRegion.push(region);
      outlinesByRegion.push(regionOutline);
    }
    return { type: biome.type, coords: coordsByRegion, outlines: outlinesByRegion };
  });

  const geoJSONFeatures = [];
  for (const biome of biomesSeparatedIntoRegions) {
    const regionAsGeoJSON = regionToGeoJson({
      type: biome.type,
      outline: _.flatten(biome.outlines),
    });
    geoJSONFeatures.push(regionAsGeoJSON);
    for (let i = 0; i < biome.outlines.length; i++) {}
  }
  return { type: 'FeatureCollection', features: geoJSONFeatures };
};

const getNeighbours = () => {};

const getOutlineOfArea = (startPos, data, visited) => {
  const outline = [];
  let delta = { dx: 1, dy: 0 };

  // mark startPos as visited ?
  // look for neighbours with
  //        0 0 0 0 0 0 0
  //        0 0 0 1 1 0 0
  //        0 0 1 X X 1 0
  //        0 1 1 1 1 1 0
  //        0 0 0 0 0 0 0
  //take a point (x,y) to start, take a direction (dx,dy)=(1,0) to start
  // take color C of point (x,y) which will be the color to trace
  // run x+=dx,y+=dy until at (x+dx,y+dy) you have another color and are on a boundary
  // peek at (x+dx,y+dy), if it is not the same color C, you are hitting a boundary: turn left and goto 4.
  // x+=dx, y+=dy, i.e. take a step
  // record (x,y) as part of the boundary
  // if ( x==xstart && y==ystart ) you're done
  // turn right and goto 4.
  // turn left means: (dx',dy') = (dy,-dx), revolutions++

  // turn right means: (dx',dy') = (-dy,dx), revolutions--
  return { outline, visited };
};

module.exports = { getOutlineOfArea, detailMapToGeoJSON };
