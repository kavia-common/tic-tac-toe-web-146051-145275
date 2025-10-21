import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Controls - Mode selector, Start New Game button, and status display.
 * @param {object} props
 * @param {"PVP"|"AI"} props.mode - Current game mode.
 * @param {function} props.setMode - Setter to change mode.
 * @param {function} props.onNewGame - Handler to start a new game.
 * @param {string} props.status - Status text to display.
 * @param {boolean} [props.gameOver] - Whether the game is currently over (used to refine a11y).
 */
function Controls({
  mode = 'PVP',
  setMode = () => {},
  onNewGame = () => {},
  status = '',
  gameOver = false,
}) {
  const isWin = status.includes('wins');
  const isDraw = status === 'draw';
  const statusClass = isWin ? 'is-win' : isDraw ? 'is-draw' : 'is-playing';

  // Choose aria-live politeness based on importance: assertive on final states
  const ariaLive = isWin || isDraw ? 'assertive' : 'polite';
  const ariaAtomic = true;

  return (
    <div className="ttt-controls">
      <div className="ttt-mode">
        <label htmlFor="mode">
          Mode:
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          aria-label="Select game mode"
          aria-describedby="mode-help"
          // Keep mode selectable even when over, but prevent accidental changes during screen reader announcements if desired
          disabled={false}
        >
          <option value="PVP">Player vs Player</option>
          <option value="AI">Player vs AI</option>
        </select>
        <span id="mode-help" style={{ position: 'absolute', left: '-9999px' }}>
          Choose between Player versus Player or Player versus AI.
        </span>
      </div>

      <button
        type="button"
        onClick={onNewGame}
        className="btn btn-primary"
        aria-label="Start New Game"
      >
        Start New Game
      </button>

      <div
        className={`ttt-status ${statusClass}`}
        role="status"
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
      >
        {status}
      </div>
    </div>
  );
}

export default Controls;
