import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getBestMove from '../ai/minimax';

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

  // Track timeout to avoid overlapping AI moves on rapid updates
  const aiTimeoutRef = useRef(null);

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
    // Clear any pending AI move when starting fresh
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
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

  // Auto-play AI move when in AI mode and it's AI's turn
  useEffect(() => {
    // Guard: only in AI mode and game still in progress
    if (mode !== 'AI') return;
    const { winner, isDraw } = evaluateBoard(board);
    if (winner || isDraw) return;

    // Decide which mark is AI. For simplicity, AI plays as 'O' (human starts as 'X')
    const aiMark = 'O';
    const humanMark = 'X';

    if (currentPlayer !== aiMark) return;

    // Avoid scheduling multiple timeouts
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }

    aiTimeoutRef.current = setTimeout(() => {
      // Re-check game state at the time of execution to avoid stale moves
      const check = evaluateBoard(board);
      if (check.winner || check.isDraw) {
        aiTimeoutRef.current = null;
        return;
      }

      const move = getBestMove(board, aiMark, humanMark);
      if (move === null || board[move] !== null) {
        aiTimeoutRef.current = null;
        return;
      }

      const next = [...board];
      next[move] = aiMark;
      setBoard(next);

      const post = evaluateBoard(next);
      if (post.line) {
        setWinningLine(post.line);
      } else {
        setWinningLine(null);
      }

      if (!post.winner && !post.isDraw) {
        setCurrentPlayer(humanMark);
      }
      aiTimeoutRef.current = null;
    }, 300);

    // Cleanup on dependency changes/unmount
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [mode, board, currentPlayer, evaluateBoard]);

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
