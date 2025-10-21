import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Controls - Mode selector, Start New Game button, and status display.
 * @param {object} props
 * @param {"PVP"|"AI"} props.mode - Current game mode.
 * @param {function} props.setMode - Setter to change mode.
 * @param {function} props.onNewGame - Handler to start a new game.
 * @param {string} props.status - Status text to display.
 */
function Controls({ mode = 'PVP', setMode = () => {}, onNewGame = () => {}, status = '' }) {
  const statusClass =
    status.includes('wins')
      ? 'is-win'
      : status === 'draw'
      ? 'is-draw'
      : 'is-playing';

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
        >
          <option value="PVP">Player vs Player</option>
          <option value="AI">Player vs AI</option>
        </select>
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
        aria-live="polite"
      >
        {status}
      </div>
    </div>
  );
}

export default Controls;
