import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Cell - Represents a single Tic Tac Toe grid cell as a button.
 * @param {object} props
 * @param {string|null} props.value - The value to display in the cell ("X", "O", or null).
 * @param {function} props.onClick - Click handler for the cell.
 * @param {boolean} props.disabled - Whether the cell is disabled.
 * @param {string} props.ariaLabel - Accessible label for screen readers.
 * @param {string} [props.extraClassName] - Optional extra class (e.g., 'is-win') to visually highlight state.
 */
function Cell({ value, onClick, disabled = false, ariaLabel = 'Cell', extraClassName = '' }) {
  const classes = ['ttt-cell', extraClassName].filter(Boolean).join(' ');
  const pressed = value ? true : false;

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      data-testid="ttt-cell"
    >
      {value || ''}
    </button>
  );
}

export default Cell;
