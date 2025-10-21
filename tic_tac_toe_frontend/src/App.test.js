import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe heading and status region', () => {
  render(<App />);

  // Main title should be present
  const title = screen.getByRole('heading', { name: /tic tac toe/i });
  expect(title).toBeInTheDocument();

  // Status region should be present and use role="status"
  const status = screen.getByRole('status');
  expect(status).toBeInTheDocument();

  // Optionally, ensure the "Start New Game" button is present for basic smoke coverage
  const newGameBtn = screen.getByRole('button', { name: /start new game/i });
  expect(newGameBtn).toBeInTheDocument();

  // Optional: mode selector accessible via label
  const modeSelect = screen.getByLabelText(/select game mode/i);
  expect(modeSelect).toBeInTheDocument();
});
