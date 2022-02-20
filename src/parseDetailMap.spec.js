import { getOutlineOfArea, turnLeft, turnRight } from './parseDetailMap.js';
import ndarray from 'ndarray';

let data, visited;
describe('getOutlineOfArea', () => {
  beforeEach(() => {
    data = ndarray(new Float32Array(25), [5, 5]);
    const y = data.hi(4, 4).lo(1, 1);
    for (let i = 0; i < data.shape[0]; ++i) {
      for (let j = 0; j < data.shape[1]; ++j) {
        data.set(i, j, 5);
      }
    }
    for (let i = 0; i < y.shape[0]; ++i) {
      for (let j = 0; j < y.shape[1]; ++j) {
        y.set(i, j, 2);
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
    const outline = getOutlineOfArea([1, 1], data, visited);
    expect(outline).toEqual([
      [2, 1],
      [3, 1],
      [3, 2],
      [3, 3],
      [2, 3],
      [1, 3],
      [1, 2],
      [1, 1],
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
