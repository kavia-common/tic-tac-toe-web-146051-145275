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

  return (
    <div
      className="ttt-board"
      role="grid"
      aria-label="Tic Tac Toe Board"
    >
      {board.map((value, idx) => (
        <div role="gridcell" key={idx}>
          <Cell
            value={value}
            onClick={() => onCellClick(idx)}
            disabled={gameOver || Boolean(value)}
            ariaLabel={`Cell ${idx + 1}, ${value ? `occupied by ${value}` : `current player ${currentPlayer}`}`}
          />
          {isWinningIndex(idx) ? (
            <span aria-hidden="true" style={{ display: 'none' }}>win</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
