import React, { useState, useEffect } from 'react';
import './App.css';
import GameController from './components/GameController';

// PUBLIC_INTERFACE
function App() {
  /**
   * /** App root component with theme management and GameController.
   * GxP Critical: Yes (UI controls trigger audited state changes)
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle light/dark theme */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="app-header-top">
        <h1 className="title">Tic Tac Toe</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main className="main-surface">
        <GameController />
      </main>
      <footer className="footer">Ocean Professional • Demo</footer>
    </div>
  );
}

export default App;
