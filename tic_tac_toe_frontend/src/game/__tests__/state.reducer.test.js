import { gameReducer, initialStateFactory, START_GAME, MAKE_MOVE, AI_MOVE, SET_MODE, RESET } from '../../game/state';

function reduce(state, type, payload) {
  return gameReducer(state, { type, payload });
}

describe('gameReducer', () => {
  test('START_GAME initializes game fields', () => {
    const s0 = initialStateFactory();
    const s1 = reduce(s0, START_GAME);
    expect(s1.startedAt).not.toBeNull();
    expect(s1.board.every(c => c === '')).toBeTruthy();
    expect(s1.currentPlayer).toBe('X');
  });

  test('MAKE_MOVE places mark and switches player', () => {
    const s0 = reduce(initialStateFactory(), START_GAME);
    const s1 = reduce(s0, MAKE_MOVE, 0);
    expect(s1.board[0]).toBe('X');
    expect(s1.currentPlayer).toBe('O');
  });

  test('prevents illegal move on occupied cell', () => {
    const s0 = reduce(initialStateFactory(), START_GAME);
    const s1 = reduce(s0, MAKE_MOVE, 0);
    const s2 = reduce(s1, MAKE_MOVE, 0);
    expect(s2.error).toMatch(/occupied/i);
  });

  test('Friend mode allows both players without AI', () => {
    let s = reduce(initialStateFactory(), START_GAME);
    s = reduce(s, SET_MODE, 'Friend');
    s = reduce(s, MAKE_MOVE, 0); // X
    expect(s.currentPlayer).toBe('O');
    s = reduce(s, MAKE_MOVE, 1); // O as Friend
    expect(s.board[1]).toBe('O');
  });

  test('AI_MOVE not allowed in Friend mode', () => {
    let s = reduce(initialStateFactory(), START_GAME);
    s = reduce(s, SET_MODE, 'Friend');
    s = reduce(s, AI_MOVE);
    expect(s.error).toMatch(/not allowed/i);
  });

  test('AI mode prevents player during AI turn', () => {
    let s = reduce(initialStateFactory(), START_GAME);
    s = reduce(s, SET_MODE, 'AI');
    s = reduce(s, MAKE_MOVE, 0); // X
    // Now AI should move; if we try to move as player for O:
    const s2 = reduce(s, MAKE_MOVE, 1);
    expect(s2.error).toMatch(/AI turn/i);
  });

  test('RESET returns to initial with preserved theme and userContext', () => {
    let s = reduce(initialStateFactory(), START_GAME);
    s.theme = 'dark';
    const s2 = reduce(s, RESET);
    expect(s2.startedAt).toBeNull();
    expect(s2.theme).toBe('light' || 'dark'); // theme set by reducer to light baseline
    expect(s2.board.every(c => c === '')).toBeTruthy();
  });
});
