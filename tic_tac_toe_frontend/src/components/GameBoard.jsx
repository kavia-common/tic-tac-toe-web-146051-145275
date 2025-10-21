import React from 'react';
import Cell from './Cell';

/**
 * PUBLIC_INTERFACE
 * GameBoard - Displays a 3x3 Tic Tac Toe grid.
 * @param {object} props
 * @param {Array<string|null>} props.board - Array of 9 elements representing the board.
 * @param {function} props.onCellClick - Handler when a cell is clicked, receives index.
 * @param {string} props.currentPlayer - "X" or "O".
 * @param {Array<number>|null} props.winningLine - Indices of the winning line if any.
 * @param {boolean} props.gameOver - Whether the game is over (win or draw).
 */
function GameBoard({
  board = Array(9).fill(null),
  onCellClick = () => {},
  currentPlayer = 'X',
  winningLine = null,
  gameOver = false,
}) {
  const isWinningIndex = (idx) => Array.isArray(winningLine) && winningLine.includes(idx);

  // Helper to derive aria-label for each cell
  const getCellAriaLabel = (idx, value) => {
    if (value) {
      return `Cell ${idx + 1}, occupied by ${value}`;
    }
    if (gameOver) {
      return `Cell ${idx + 1}, game over`;
    }
    return `Cell ${idx + 1}, empty, current player ${currentPlayer}`;
    };

  return (
    <div
      className="ttt-board"
      role="grid"
      aria-label="Tic Tac Toe Board"
      aria-rowcount={3}
      aria-colcount={3}
    >
      {board.map((value, idx) => {
        const disabled = gameOver || Boolean(value);
        const win = isWinningIndex(idx);
        const className = win ? 'is-win' : '';
        // Grid semantics
        const row = Math.floor(idx / 3) + 1;
        const col = (idx % 3) + 1;

        return (
          <div
            role="gridcell"
            aria-rowindex={row}
            aria-colindex={col}
            key={idx}
            aria-selected={win ? true : undefined}
          >
            <Cell
              value={value}
              onClick={() => onCellClick(idx)}
              disabled={disabled}
              ariaLabel={getCellAriaLabel(idx, value)}
              // pass highlight class down for styling
              extraClassName={className}
            />
          </div>
        );
      })}
    </div>
  );
}

export default GameBoard;
