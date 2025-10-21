import { useCallback, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useTicTacToe - Hook managing the Tic Tac Toe game state (initial scaffolding).
 * Returns state and handlers with stubbed logic to be completed later.
 */
export function useTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [mode, setMode] = useState('PVP'); // 'PVP' | 'AI'
  const [gameOver, setGameOver] = useState(false);

  // Basic status string (to be enhanced with win/draw detection later)
  const status = useMemo(() => {
    if (gameOver) return 'Game Over';
    return `Current player: ${currentPlayer}`;
  }, [currentPlayer, gameOver]);

  const startNewGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
  }, []);

  const handleCellClick = useCallback(
    (index) => {
      // Stub: if game over or occupied, do nothing
      if (gameOver || board[index]) return;

      // Basic place value and toggle player; win/draw logic will be added later
      setBoard((prev) => {
        const next = [...prev];
        next[index] = currentPlayer;
        return next;
      });
      setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'));
    },
    [board, currentPlayer, gameOver]
  );

  // No winning detection yet; placeholder for shape consistency
  const winningLine = null;

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
