import {
  getOutlineOfArea,
  turnLeft,
  turnRight,
  localTileCoordToRegionTile,
} from './parseDetailMap.js';
import ndarray from 'ndarray';

let data, visited;
describe('getOutlineOfArea', () => {
  beforeEach(() => {
    data = ndarray(new Float32Array(75), [5, 5, 3]);
    const y = data.hi(4, 4).lo(1, 1);
    for (let i = 0; i < data.shape[0]; ++i) {
      for (let j = 0; j < data.shape[1]; ++j) {
        for (let k = 0; k < data.shape[2]; ++k) {
          data.set(i, j, k, 16);
        }
      }
    }
    for (let i = 0; i < y.shape[0]; ++i) {
      for (let j = 0; j < y.shape[1]; ++j) {
        for (let k = 0; k < y.shape[2]; ++k) {
          y.set(i, j, k, 32);
        }
      }
    }
    //Now:
    //    x = 5 5 5 5 5
    //        5 2 2 2 5
    //        5 2 2 2 5
    //        5 2 2 2 5
    //        5 5 5 5 5
  });
  it('returns the correct outline for a simple square', () => {
    const outline = getOutlineOfArea({ x: 1, y: 1 }, data);
    expect(outline).toEqual([
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
    ]);
  });
});

describe('turn left and turn right', () => {
  it('rotates the coordinate 45 degrees but keeps the components in the domain [1,0,-1]', () => {
    expect(turnLeft({ x: 1, y: 1 })).toEqual({ x: 0, y: 1 });
    expect(turnRight({ x: 1, y: 1 })).toEqual({ x: 1, y: 0 });

    expect(turnLeft({ x: -1, y: 0 })).toEqual({ x: -1, y: -1 });
    expect(turnRight({ x: -1, y: 0 })).toEqual({ x: -1, y: 1 });

    let down = { x: 0, y: -1 };
    expect(turnRight(turnLeft(down))).toEqual(down);
    expect(turnLeft(turnRight(down))).toEqual(down);
  });
});
