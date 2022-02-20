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
    colorToBiomeMap[biomeColor] = biomeType;
  }
  return colorToBiomeMap;
};

const getColorString = (x, y, imageArray) => {
  const pixel = imageArray.pick(x, y, null);
  return pixel.get(0) + ',' + pixel.get(1) + ',' + pixel.get(2);
};

const detailMapToGeoJSON = async (directoryPath) => {
  const imageArray = await getImageArray(`${directoryPath}/image.png`);
  const colorsToBiomes = getColorToBiomeMap(`${directoryPath}/biome_color_key.txt`);

  const features = [];
  const visited = ndarray(new Uint8Array(imageArray.shape[0] * imageArray.shape[1]), [
    imageArray.shape[0],
    imageArray.shape[1],
  ]);

  for (let i = 0; i < visited.shape[0]; ++i) {
    for (let j = 0; j < visited.shape[1]; ++j) {
      visited.set(i, j, false);
    }
  }

  for (let i = 0; i < visited.shape[0]; ++i) {
    for (let j = 0; j < visited.shape[1]; ++j) {
      if (!visited.get(i, j)) {
        const colorString = getColorString(i, j, imageArray);
        const coordinatesInBiome = [];
        const queue = [];
        queue.push({ x: i, y: j });
        while (!_.isEmpty(queue)) {
          const p = queue.shift();
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              const [nx, ny] = [p.x + dx, p.y + dy];
              if (isOutOfBounds(nx, ny, imageArray)) continue;
              if (!visited.get(nx, ny) && getColorString(nx, ny, imageArray) === colorString) {
                visited.set(nx, ny, true);
                queue.push({ x: nx, y: ny });
              }
            }
          }
          coordinatesInBiome.push(p);
        }

        const outline = getOutlineOfArea(_.first(coordinatesInBiome), imageArray);
        const pointToCoord = (p) => [p.x, p.y];
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [outline.map(pointToCoord)],
          },
          properties: {
            biome: colorsToBiomes[colorString],
          },
        };
        features.push(feature);
      }
    }
  }

  const countCoords = (sum, feature) => sum + feature.geometry.coordinates[0].length;
  const points = features.reduce(countCoords, 0);
  const optimizedFeatures = features.map((feature) => ({
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: removeRedudantCoordsFromPolygon(feature.geometry.coordinates),
    },
  }));

  const optimizedPoints = optimizedFeatures.reduce(countCoords, 0);
  const saved = points - optimizedPoints;
  console.log(`Points: ${points}, optimized down to: ${optimizedPoints}. (${saved} eliminated)`);

  console.log(`Features length: ${features.length}`);
  return { type: 'FeatureCollection', features: optimizedFeatures };
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
  const outline = [];
  const peek = (current, d) => {
    const targetX = current.x + d.x;
    const targetY = current.y + d.y;
    if (isOutOfBounds(targetX, targetY, imageArray)) return '0';

    return (
      imageArray.get(targetX, targetY, 0) +
      ',' +
      imageArray.get(targetX, targetY, 1) +
      ',' +
      imageArray.get(targetX, targetY, 2)
    );
  };

  let current = startPos;
  let delta = { x: 0, y: -1 };
  const areaColor = getColorString(current.x, current.y, imageArray);

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
    // Check if current is colinear with last two points in outline.
    // If so, shift last point before pushing current.
    // if (outline.length > 2 && isOnSegment(outline.slice(-3))) {
    //   outline.splice(outline.length - 2, 1);
    // }

    delta = turnRight(delta);
    delta = turnRight(delta);
    while (peek(current, delta) === areaColor) {
      delta = turnRight(delta);
    }
  } while (current.x !== outline[0].x || current.y !== outline[0].y);

  return outline;
};

const removeRedudantCoordsFromPolygon = (polygon) => {
  const coords = polygon[0];
  const isOnAxisAlignedLine = (triple) => {
    const [p, q, r] = triple;
    if ((p[0] === q[0] && q[0] === r[0]) || (p[1] === q[1] && q[1] === r[1])) {
      return true;
    }
    return false;
  };
  for (let i = 0; i < coords.length - 4; ++i) {
    if (isOnAxisAlignedLine(coords.slice(i, i + 3))) {
      coords.splice(i + 1, 1);
    }
  }
  return [coords];
};
const isPointInPolygon = (point, polygon) => {
  // Either:
  // Do this, but for polygon in polygon, restarting every time a degenerate case appears.
  // OR:
  // Go back to storing solid regions.
  // Check if neighbourhood of entire outline of polygon is only 2 colors.
  // In that case, pick a pixel of the outer color and search through all regions for that pixel.
  const ray = [];
  let count = 0;
  for (let i = point[0]; i > 0; --i) {
    const raypos = [i, point[1]];
    ray.push(raypos);
    const intersection = _.indexOf(polygon, raypos);
    if (intersection > 0) {
      if (
        _.indexOf(polygon, [i + 1, point[1]]) >= 0 &&
        _.indexOf(polygon, [i - 1, point[1]]) >= 0
      ) {
        continue; // dont count middle of intersecting segments. Theres a bug here.
      } else if (
        polygon[intersection - 1] &&
        polygon[intersection + 1] &&
        ((polygon[intersection - 1][1] > point[1] && polygon[intersection + 1][1] > point[1]) ||
          (polygon[intersection - 1][1] < point[1] && polygon[intersection + 1][1] < point[1]))
      ) {
        continue;
      } else {
        count++;
      }
    }
  }
  if (count % 2 === 1) {
    console.log('INSIDE');
  }

  // Now check how many elements in ray exist in polygon.
  // For every such one, we need to investigate the neighbourhood.
  // If the ray is on top of a segment of the polygon (more than one in a row?)
  // : only count once.
  // If the ray intersects a corner, count twice.
  // (a corner would have neighbours in polygon with either only higher or lower y components. Since were always casting in x-direction.)
  return count;
};

const isContainedByOtherRegion = (thisRegion, imageArray) => {
  return true;
};

const containsOtherRegion = (thisRegion, otherRegion) => {
  // Check if
  return true;
};

module.exports = { getOutlineOfArea, turnLeft, turnRight, detailMapToGeoJSON };
