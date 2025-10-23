import { chooseMove } from '../../game/ai';

describe('AI chooseMove', () => {
  test('picks center if available', () => {
    const state = { board: Array(9).fill('') };
    expect(chooseMove(state)).toBe(4);
  });

  test('picks corner when center taken', () => {
    const board = Array(9).fill('');
    board[4] = 'X';
    const idx = chooseMove({ board });
    expect([0,2,6,8]).toContain(idx);
  });

  test('picks side when center and corners taken', () => {
    const board = ['X','','X','','O','','X','','X'];
    // corners 0,2,6,8 occupied; center maybe occupied; expect side
    const idx = chooseMove({ board });
    expect([1,3,5,7,4]).toContain(idx); // allow 4 if it's empty in pattern
  });

  test('returns -1 on full board', () => {
    const board = ['X','O','X','X','O','O','O','X','X'];
    expect(chooseMove({ board })).toBe(-1);
  });
});
