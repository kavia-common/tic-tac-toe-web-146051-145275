/**
 * Controls for selecting mode and managing game lifecycle.
 */
export default function Controls({ mode, onModeChange, onStart, onReset, canChangeMode }) {
  const handleModeChange = (e) => {
    const newMode = e.target.value;
    if (!canChangeMode && newMode !== mode) {
      const proceed = window.confirm('Change mode during an active game? Progress may be lost.');
      if (!proceed) return;
    }
    onModeChange(newMode);
  };

  return (
    <div className="controls">
      <div className="mode-select">
        <label htmlFor="mode">Mode</label>
        <select id="mode" value={mode} onChange={handleModeChange} aria-label="Game mode selection">
          <option value="Friend">Friend</option>
          <option value="AI">AI</option>
        </select>
      </div>
      <div className="control-buttons">
        <button className="btn primary" type="button" onClick={onStart}>Start</button>
        <button className="btn secondary" type="button" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}
