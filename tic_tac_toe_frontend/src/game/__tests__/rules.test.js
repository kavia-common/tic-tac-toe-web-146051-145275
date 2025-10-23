import { computeResult, WIN_LINES } from '../../game/rules';

describe('rules.computeResult', () => {
  test('returns null for empty board', () => {
    expect(computeResult(Array(9).fill(''))).toBeNull();
  });

  test('detects wins for all lines', () => {
    WIN_LINES.forEach(([a,b,c]) => {
      const b1 = Array(9).fill('');
      b1[a] = b1[b] = b1[c] = 'X';
      expect(computeResult(b1)).toBe('X');
      const b2 = Array(9).fill('');
      b2[a] = b2[b] = b2[c] = 'O';
      expect(computeResult(b2)).toBe('O');
    });
  });

  test('detects draw', () => {
    const board = ['X','O','X','X','O','O','O','X','X'];
    expect(computeResult(board)).toBe('Draw');
  });
});
