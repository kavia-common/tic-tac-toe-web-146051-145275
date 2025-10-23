/**
 * Status bar shows current player, mode, result, and error messages.
 */
export default function StatusBar({ currentPlayer, mode, result, error, aiThinking }) {
  const status = result
    ? result === 'Draw'
      ? 'Result: Draw'
      : `Winner: ${result}`
    : `Turn: ${currentPlayer}`;
  return (
    <div className="status-bar" aria-live="polite">
      <div className="status-main">{status}</div>
      <div className="status-sub">Mode: {mode}{aiThinking ? ' • AI thinking...' : ''}</div>
      {error ? <div className="status-error" role="alert">{error}</div> : null}
    </div>
  );
}
