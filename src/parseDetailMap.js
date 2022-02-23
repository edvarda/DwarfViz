const rgbHex = require('rgb-hex');
const promisify = require('util').promisify;
const getPixelsPromise = promisify(require('get-pixels'));
const ndarray = require('ndarray');
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

const getColorToBiomeInfo = (biomeColorKeyFilePath) => {
  const parseBiomeString = (biomeString) => {
    const [biomeType, ...additionalProps] = biomeString.split(' ').reverse();
    const biomeInfo = {
      biomeType,
      // regionType: biomeTypeToRegion[biomeType]
    };
    switch (biomeType) {
      case 'mountain':
        break;
      case 'ocean':
        biomeInfo.climate = additionalProps[0];
        break;
      case 'lake':
        biomeInfo.salinity = additionalProps[0];
        biomeInfo.climate = additionalProps[1];
        break;
      case 'glacier':
        break;
      case 'tundra':
        break;
      case 'swamp':
        if (additionalProps[0] === 'mangrove') {
          biomeInfo.biomeSubtype = 'mangrove';
        } else {
          biomeInfo.salinity = additionalProps[0];
          biomeInfo.climate = additionalProps[1];
        }
        break;
      case 'marsh':
        biomeInfo.salinity = additionalProps[0];
        biomeInfo.climate = additionalProps[1];
        break;
      case 'forest':
        if (additionalProps[0] === 'taiga') {
          biomeInfo.biomeSubtype = 'taiga';
        } else if (additionalProps.length === 2) {
          biomeInfo.biomeSubtype = additionalProps[0];
          biomeInfo.climate = additionalProps[1];
        } else {
          biomeInfo.biomeSubtype = additionalProps[0];
          biomeInfo.humidity = additionalProps[1];
          biomeInfo.climate = additionalProps[2];
        }
        break;
      case 'grassland':
        biomeInfo.climate = additionalProps[0];
        break;
      case 'savannah':
        biomeInfo.climate = additionalProps[0];
        break;
      case 'shrubland':
        biomeInfo.climate = additionalProps[0];
        break;
      case 'desert':
        biomeInfo.biomeSubtype = additionalProps[0];
        break;
      default:
        break;
    }
    return biomeInfo;
  };
  const biomeTypesAndColors = getJSON(biomeColorKeyFilePath)
    .split('\n')
    .filter((line) => !!line)
    .map(_.trim)
    .map((line) => {
      let [biomeString, colorString] = line.split('(');
      return [biomeString.trim(), rgbHex(colorString)];
    });
  const colorToBiomeInfo = {};
  for (const [biomeString, biomeColor] of biomeTypesAndColors) {
    colorToBiomeInfo[biomeColor] = parseBiomeString(biomeString);
  }
  return colorToBiomeInfo;
};

const getColor = (x, y, imageArray) => {
  const pixel = imageArray.pick(x, y, null);
  return rgbHex(pixel.get(0), pixel.get(1), pixel.get(2));
};

const detailMapToGeoJSON = async (directoryPath) => {
  const imageArray = await getImageArray(`${directoryPath}/image.png`);
  const colorToBiomeInfo = getColorToBiomeInfo(`${directoryPath}/biome_color_key.txt`);

  const features = [];
  const visited = ndarray(new Uint8Array(imageArray.shape[0] * imageArray.shape[1]), [
    imageArray.shape[0],
    imageArray.shape[1],
  ]);

  for (let i = 0; i < visited.shape[0]; ++i) {
    for (let j = 0; j < visited.shape[1]; ++j) {}
  }

  for (let i = 0; i < visited.shape[0]; ++i) {
    for (let j = 0; j < visited.shape[1]; ++j) {
      if (!visited.get(i, j)) {
        const biomeColor = getColor(i, j, imageArray);
        const neighbourColors = new Set();
        const coordinatesInBiome = [];
        const queue = [];
        queue.push({ x: i, y: j });
        while (!_.isEmpty(queue)) {
          const p = queue.shift();
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              const [nx, ny] = [p.x + dx, p.y + dy];
              if (isOutOfBounds(nx, ny, imageArray)) {
                neighbourColors.add('borderRegion');
                continue;
              }
              if (!visited.get(nx, ny) && getColor(nx, ny, imageArray) === biomeColor) {
                visited.set(nx, ny, true);
                queue.push({ x: nx, y: ny });
              } else if (getColor(nx, ny, imageArray) !== biomeColor) {
                neighbourColors.add(getColor(nx, ny, imageArray));
              }
            }
          }
          coordinatesInBiome.push(p);
        }
        const outline = getOutlineOfArea(_.first(coordinatesInBiome), imageArray);
        const pointToCoord = (p) => [p.x, p.y];
        const biomeInfo = colorToBiomeInfo[biomeColor];
        const feature = {
          type: 'Feature',
          allPoints: coordinatesInBiome,
          geometry: {
            type: 'Polygon',
            coordinates: [outline.map(pointToCoord)],
          },
          properties: {
            biomeInfo,
            area: coordinatesInBiome.length,
            isContained: neighbourColors.size === 1,
          },
        };
        features.push(feature);
      }
    }
  }

  //TODO check orientation of region coords
  features.push({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [10, 10],
          [10, 11],
          [11, 11],
          [11, 10],
        ],
      ],
    },
    properties: {},
  });

  for (let feature of features.filter((f) => f.properties.isContained === true)) {
    let startPos;
    for (let coord of feature.geometry.coordinates[0]) {
      if (
        // Find a coordinate directly left of outside region
        getColor(coord[0], coord[1], imageArray) !== getColor(coord[0], coord[1] + 1, imageArray)
      ) {
        startPos = { x: coord[0], y: coord[1] + 1 };
        break;
      }
    }
    const outline = getOutlineOfArea(startPos, imageArray);
    for (let i = 0; i < features.length; ++i) {
      const f = features[i];
      const outlinePoint = outline[0];
      if (f.allPoints.find((p) => p.x === outlinePoint.x && p.y === outlinePoint.y)) {
        f.geometry.coordinates.push(outline.reverse().map((p) => [p.x, p.y]));
        break;
      }
    }
  }

  for (let f of features) {
    f.geometry.coordinates = removeRedudantCoordsFromPolygon(f.geometry.coordinates);
    console.log(f.properties.biomeInfo, f.properties.area);
  }
  return {
    type: 'FeatureCollection',
    features: features.map((f) => {
      const { allPoints, ...feature } = f;
      return feature;
    }),
  };
};

const turnLeft = (d) => ({
  x: d.x - d.y !== 0 ? (d.x - d.y) / Math.abs(d.x - d.y) : 0,
  y: d.x + d.y !== 0 ? (d.x + d.y) / Math.abs(d.x + d.y) : 0,
});
const turnRight = (d) => ({
  x: d.x + d.y !== 0 ? (d.x + d.y) / Math.abs(d.x + d.y) : 0,
  y: d.y - d.x !== 0 ? (d.y - d.x) / Math.abs(d.y - d.x) : 0,
});

const advance = (current, d) => ({ x: current.x + d.x, y: current.y + d.y });

const isOutOfBounds = (x, y, imageArray) =>
  x < 0 || x >= imageArray.shape[0] || y < 0 || y >= imageArray.shape[1];

const getOutlineOfArea = (startPos, imageArray) => {
  const areaColor = getColor(startPos.x, startPos.y, imageArray);
  const outline = [];
  const peek = (current, d) => {
    const targetX = current.x + d.x;
    const targetY = current.y + d.y;
    if (isOutOfBounds(targetX, targetY, imageArray)) return '0';
    return getColor(targetX, targetY, imageArray);
  };

  let current = startPos;
  let delta = { x: 0, y: -1 };

  outline.push(current);
  let boundariesAroundStart = 0;
  for (let i = 0; i < 8; ++i) {
    if (peek(current, delta) !== areaColor) boundariesAroundStart++;
    delta = turnLeft(delta);
  }
  if (boundariesAroundStart === 8) {
    return outline;
  }

  delta = { x: 0, y: -1 };

  while (peek(current, delta) === areaColor) {
    current = advance(current, delta);
  }

  do {
    while (peek(current, delta) !== areaColor) {
      delta = turnLeft(delta); //Turn left if boundary in delta direction
    }
    current = advance(current, delta); // Take a step in delta direction
    outline.push(current);
    delta = turnRight(delta);
    delta = turnRight(delta);
    while (peek(current, delta) === areaColor) {
      delta = turnRight(delta);
    }
  } while (current.x !== outline[0].x || current.y !== outline[0].y);

  return outline;
};

const removeRedudantCoordsFromPolygon = (polygon) => {
  const isOnAxisAlignedLine = (triple) => {
    const [p, q, r] = triple;
    if ((p[0] === q[0] && q[0] === r[0]) || (p[1] === q[1] && q[1] === r[1])) {
      return true;
    }
  };
  for (const outline in polygon) {
    for (let i = 0; i < outline.length - 4; ++i) {
      if (isOnAxisAlignedLine(outline.slice(i, i + 3))) {
        outline.splice(i + 1, 1);
      }
    }
  }
  return polygon;
};

module.exports = { getOutlineOfArea, turnLeft, turnRight, detailMapToGeoJSON };
