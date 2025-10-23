import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

function startFriendGame() {
  render(<App />);
  const select = screen.getByLabelText(/Game mode/i);
  fireEvent.change(select, { target: { value: 'Friend' } });
  fireEvent.click(screen.getByRole('button', { name: /Start/i }));
}

describe('Integration - Friend Mode', () => {
  test('two players alternate and can finish a game', () => {
    startFriendGame();
    const cells = screen.getAllByRole('button', { name: /cell/i });
    // X moves
    fireEvent.click(cells[0]);
    // O moves
    fireEvent.click(cells[1]);
    // X moves
    fireEvent.click(cells[4]);
    // O moves
    fireEvent.click(cells[2]);
    // X winning move
    fireEvent.click(cells[8]);
    expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  });
});
