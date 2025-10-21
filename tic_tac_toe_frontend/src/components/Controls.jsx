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
  return (
    <div
      className="ttt-controls"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '16px',
      }}
    >
      <div
        className="ttt-mode"
        style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
      >
        <label htmlFor="mode" style={{ fontWeight: 600 }}>
          Mode:
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          aria-label="Select game mode"
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="PVP">Player vs Player</option>
          <option value="AI">Player vs AI</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onNewGame}
        className="btn btn-large"
        aria-label="Start New Game"
        style={{
          padding: '10px 16px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: 'var(--button-bg)',
          color: 'var(--button-text)',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        Start New Game
      </button>

      <div
        className="ttt-status"
        aria-live="polite"
        style={{ color: 'var(--text-primary)' }}
      >
        {status}
      </div>
    </div>
  );
}

export default Controls;
