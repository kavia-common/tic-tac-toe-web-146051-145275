/**
 * Cell component representing a single tic-tac-toe square.
 * Accessibility: role="button", tabIndex, keyboard handler (Enter/Space).
 */
export default function Cell({ value, onClick, index, disabled }) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(index);
    }
  };
  return (
    <button
      type="button"
      className="cell"
      onClick={() => !disabled && onClick(index)}
      onKeyDown={handleKeyDown}
      aria-label={`cell ${index} ${value ? 'occupied by ' + value : 'empty'}`}
      aria-disabled={disabled}
      disabled={disabled}
    >
      {value}
    </button>
  );
}
