import React, { useState, useEffect } from 'react';
import './App.css';
import { useTicTacToe } from './hooks/useTicTacToe';
import Controls from './components/Controls';
import GameBoard from './components/GameBoard';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // game hook for state and handlers
  const {
    board,
    currentPlayer,
    mode,
    status,
    setMode,
    startNewGame,
    handleCellClick,
    gameOver,
    winningLine,
  } = useTicTacToe();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Render a human-friendly status line for the header
  const headerStatus = (() => {
    if (status === 'X_wins') return 'X wins!';
    if (status === 'O_wins') return 'O wins!';
    if (status === 'draw') return 'Draw';
    // status includes current player info already for in-progress
    return status;
  })();

  return (
    <div className="App">
      <header className="App-header" style={{ padding: '24px' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <h1 className="tui-title">Tic Tac Toe</h1>
        <p className="tui-subtitle">{`Mode: ${mode} — ${headerStatus}`}</p>

        <Controls
          mode={mode}
          setMode={setMode}
          onNewGame={startNewGame}
          status={headerStatus}
          gameOver={gameOver}
        />

        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          currentPlayer={currentPlayer}
          winningLine={winningLine}
          gameOver={gameOver}
        />

        <div className="tui-subtitle" style={{ marginTop: '16px' }}>
          Current theme: <strong>{theme}</strong>
        </div>
      </header>
    </div>
  );
}

export default App;
