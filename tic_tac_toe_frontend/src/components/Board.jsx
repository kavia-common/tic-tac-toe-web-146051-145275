/**
 * Board component for a 3x3 grid.
 */
import Cell from './Cell';

export default function Board({ board, onCellClick, disabled }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {board.map((v, i) => (
        <div key={i} role="gridcell" className="grid-cell">
          <Cell value={v} index={i} onClick={onCellClick} disabled={disabled || !!v} />
        </div>
      ))}
    </div>
  );
}
