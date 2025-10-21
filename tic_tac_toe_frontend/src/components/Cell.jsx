import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Cell - Represents a single Tic Tac Toe grid cell as a button.
 * @param {object} props
 * @param {string|null} props.value - The value to display in the cell ("X", "O", or null).
 * @param {function} props.onClick - Click handler for the cell.
 * @param {boolean} props.disabled - Whether the cell is disabled.
 * @param {string} props.ariaLabel - Accessible label for screen readers.
 */
function Cell({ value, onClick, disabled = false, ariaLabel = 'Cell' }) {
  return (
    <button
      type="button"
      className="ttt-cell"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid="ttt-cell"
      style={{
        width: '80px',
        height: '80px',
        fontSize: '28px',
        fontWeight: '700',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease, transform 0.05s ease',
      }}
    >
      {value || ''}
    </button>
  );
}

export default Cell;
