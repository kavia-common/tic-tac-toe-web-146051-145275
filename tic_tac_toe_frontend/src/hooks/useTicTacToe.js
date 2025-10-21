import { useCallback, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useTicTacToe - Hook managing the full Tic Tac Toe game state.
 * Manages:
 * - board: Array(9) of "X" | "O" | null
 * - currentPlayer: "X" | "O"
 * - mode: "PVP" | "AI" (AI logic to be implemented later; current step supports PVP fully)
 * - status: string - "in-progress", "draw", "X_wins", "O_wins" (displayed as readable text in UI)
 * - winningLine: indices [a,b,c] when a winner is found
 *
 * Exposes:
 * - setMode(mode)
 * - startNewGame()
 * - handleCellClick(index)
 */
export function useTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [mode, setMode] = useState('PVP'); // 'PVP' | 'AI'
  const [winningLine, setWinningLine] = useState(null); // [a,b,c] or null

  // Compute winner and draw
  const evaluateBoard = useCallback((b) => {
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
    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a], line: [a, c, d] };
      }
    }
    const isDraw = b.every((v) => v !== null);
    return { winner: null, line: null, isDraw };
  }, []);

  // Derive gameOver and status text based on board evaluation
  const { gameOver, status } = useMemo(() => {
    const { winner, isDraw } = evaluateBoard(board);
    if (winner === 'X') {
      return { gameOver: true, status: 'X_wins' };
    }
    if (winner === 'O') {
      return { gameOver: true, status: 'O_wins' };
    }
    if (isDraw) {
      return { gameOver: true, status: 'draw' };
    }
    return { gameOver: false, status: `in-progress (Current: ${currentPlayer})` };
  }, [board, currentPlayer, evaluateBoard]);

  const syncWinningLine = useCallback(
    (b) => {
      const res = evaluateBoard(b);
      if (res.line) {
        setWinningLine(res.line);
      } else {
        setWinningLine(null);
      }
    },
    [evaluateBoard]
  );

  // PUBLIC_INTERFACE
  const startNewGame = useCallback(() => {
    const fresh = Array(9).fill(null);
    setBoard(fresh);
    setCurrentPlayer('X');
    setWinningLine(null);
  }, []);

  // PUBLIC_INTERFACE
  const handleCellClick = useCallback(
    (index) => {
      // Ignore if occupied or game over
      if (board[index] !== null) return;
      const { winner, isDraw } = evaluateBoard(board);
      if (winner || isDraw) return;

      // Place current player's mark
      const nextBoard = [...board];
      nextBoard[index] = currentPlayer;
      setBoard(nextBoard);

      // Update winning line if needed
      const res = evaluateBoard(nextBoard);
      if (res.line) {
        setWinningLine(res.line);
      } else {
        setWinningLine(null);
      }

      // Toggle current player if game continues
      if (!res.winner && !res.isDraw) {
        setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'));
      }
    },
    [board, currentPlayer, evaluateBoard]
  );

  return {
    board,
    currentPlayer,
    mode,
    status,
    setMode,
    startNewGame,
    handleCellClick,
    gameOver,
    winningLine,
  };
}

export default useTicTacToe;
