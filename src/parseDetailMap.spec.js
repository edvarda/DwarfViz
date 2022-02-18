import { getOutlineOfArea } from './parseDetailMap.js';
import ndarray from 'ndarray';

let data, visited;
describe('getOutlineOfArea', () => {
  beforeEach(() => {
    data = ndarray(new Float32Array(25), [5, 5]);
    const y = data.hi(4, 4).lo(1, 1);
    visited = [];
    for (let i = 0; i < data.shape[0]; ++i) {
      visited[i] = [];
    }
    for (let i = 0; i < y.shape[0]; ++i) {
      for (let j = 0; j < y.shape[1]; ++j) {
        y.set(i, j, 1);
      }
    }
    //Now:
    //    x = 0 0 0 0 0
    //        0 1 1 1 0
    //        0 1 1 1 0
    //        0 1 1 1 0
    //        0 0 0 0 0
  });
  it('returns the correct outline for a simple square', () => {
    const { outline } = getOutlineOfArea([1, 1], data, visited);
    expect(outline).toEqual([
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [3, 3],
      [2, 3],
      [1, 3],
      [1, 2],
    ]);
  });
  it('properly updates the visited-matrix', () => {
    const expectedVisited = [];

    for (var i = 0; i < data.shape[0]; ++i) {
      expectedVisited[i] = [];
      for (var j = 0; j < data.shape[1]; ++j) {
        if (data.get(i, j) === 1) expectedVisited[i][j] = true;
      }
    }
    expectedVisited[2][2] = false;

    const { visited: visitedMutated } = getOutlineOfArea([1, 1], data, visited);
    expect(visitedMutated).toEqual(expectedVisited);
  });
});
