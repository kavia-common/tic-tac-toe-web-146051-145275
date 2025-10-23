import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';

function startAIGame() {
  render(<App />);
  const select = screen.getByLabelText(/Game mode/i);
  fireEvent.change(select, { target: { value: 'AI' } });
  fireEvent.click(screen.getByRole('button', { name: /Start/i }));
}

describe('Integration - AI Mode', () => {
  jest.useFakeTimers();

  test('AI plays center if available after player move', () => {
    startAIGame();
    const cells = screen.getAllByRole('button', { name: /cell/i });
    fireEvent.click(cells[0]); // player X at 0
    // advance timers for AI delay
    act(() => { jest.advanceTimersByTime(160); });
    expect(cells[4].textContent).toBe('O');
  });
});
