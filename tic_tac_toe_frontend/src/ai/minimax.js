//
// Simple depth-scored minimax with early win/block heuristic for 3x3 Tic Tac Toe
//

/**
 * Check if there is a winner in the given board.
 * @param {Array<string|null>} board - 9-length board.
 * @returns {{winner: "X"|"O"|null, line: number[]|null, isDraw: boolean}}
 */
function evaluateBoard(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c], isDraw: false };
    }
  }
  const isDraw = board.every((v) => v !== null);
  return { winner: null, line: null, isDraw };
}

/**
 * Get all empty indices on the board.
 * @param {Array<string|null>} board
 * @returns {number[]}
 */
function getAvailableMoves(board) {
  const moves = [];
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

/**
 * Try to find an immediate winning move for player.
 * @param {Array<string|null>} board
 * @param {"X"|"O"} player
 * @returns {number|null}
 */
function findImmediateWin(board, player) {
  const avail = getAvailableMoves(board);
  for (const idx of avail) {
    const next = [...board];
    next[idx] = player;
    const { winner } = evaluateBoard(next);
    if (winner === player) return idx;
  }
  return null;
}

/**
 * Depth-scored minimax.
 * Scores:
 *  - AI win:  +10 - depth
 *  - AI loss: -10 + depth
 *  - Draw:     0
 *
 * @param {Array<string|null>} board
 * @param {"X"|"O"} aiPlayer
 * @param {"X"|"O"} humanPlayer
 * @param {number} depth
 * @param {"X"|"O"} current
 * @returns {{ score: number, move: number|null }}
 */
function minimax(board, aiPlayer, humanPlayer, depth, current) {
  const { winner, isDraw } = evaluateBoard(board);
  if (winner === aiPlayer) return { score: 10 - depth, move: null };
  if (winner === humanPlayer) return { score: -10 + depth, move: null };
  if (isDraw) return { score: 0, move: null };

  const available = getAvailableMoves(board);

  // Initialize best with extreme values depending on whose turn it is
  let best = {
    score: current === aiPlayer ? -Infinity : Infinity,
    move: available[0] ?? null,
  };

  for (const move of available) {
    const next = [...board];
    next[move] = current;

    const result = minimax(
      next,
      aiPlayer,
      humanPlayer,
      depth + 1,
      current === "X" ? "O" : "X"
    );

    if (current === aiPlayer) {
      // Maximize
      if (result.score > best.score) {
        best = { score: result.score, move };
      }
    } else {
      // Minimize
      if (result.score < best.score) {
        best = { score: result.score, move };
      }
    }
  }

  return best;
}

// PUBLIC_INTERFACE
export function getBestMove(board, aiPlayer, humanPlayer) {
  /** This function returns the best move index for the aiPlayer using
   * a depth-scored minimax, with short-circuit handling for immediate wins
   * or immediate blocks to improve practical play and performance.
   *
   * @param {Array<string|null>} board - The current 9-cell board.
   * @param {"X"|"O"} aiPlayer - The AI's mark.
   * @param {"X"|"O"} humanPlayer - The human's mark.
   * @returns {number|null} - The best move index or null if no moves available.
   */
  // Early guard: game already finished
  const { winner, isDraw } = evaluateBoard(board);
  if (winner || isDraw) return null;

  // 1) Immediate win?
  const winNow = findImmediateWin(board, aiPlayer);
  if (winNow !== null) return winNow;

  // 2) Immediate block?
  const blockNow = findImmediateWin(board, humanPlayer);
  if (blockNow !== null) return blockNow;

  // 3) Otherwise run minimax
  const result = minimax(board, aiPlayer, humanPlayer, 0, aiPlayer);
  return result.move;
}

export default getBestMove;
