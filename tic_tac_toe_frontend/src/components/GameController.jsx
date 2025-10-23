/**
 * ============================================================================
 * REQUIREMENT TRACEABILITY
 * ============================================================================
 * Requirement ID: REQ-TTT-005
 * User Story: As a player, I want an interactive UI to play Tic Tac Toe with Friend/AI modes.
 * Acceptance Criteria:
 *  - useReducer with actions and audit logging
 *  - Disallow moves per mode rules
 *  - Display status, board, controls, optional audit panel
 *  - Error handling with friendly messages and technical audit details
 * GxP Impact: YES - UI triggers audited state changes; access control placeholders.
 * Risk Level: MEDIUM
 * Validation Protocol: VP-TTT-005
 * ============================================================================
 */

import { useEffect, useReducer } from 'react';
import Board from './Board';
import StatusBar from './StatusBar';
import Controls from './Controls';
import AuditPanel from './AuditPanel';
import { initialStateFactory, gameReducer, START_GAME, MAKE_MOVE, AI_MOVE, SET_MODE, RESET } from '../game/state';

export default function GameController() {
  const [state, dispatch] = useReducer(gameReducer, null, initialStateFactory);

  // Handle AI turn after human moves in AI mode
  useEffect(() => {
    if (state.mode === 'AI' && !state.result && state.currentPlayer === 'O') {
      // Simulate small delay for UX
      const t = setTimeout(() => {
        try {
          dispatch({ type: AI_MOVE });
        } catch (e) {
          dispatch({
            type: 'ERROR_RAISED',
            payload: { message: 'AI failed to move.', metadata: { error: String(e) } },
          });
        }
      }, 150);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [state.mode, state.result, state.currentPlayer]);

  const handleStart = () => {
    try {
      dispatch({ type: START_GAME });
    } catch (e) {
      dispatch({ type: 'ERROR_RAISED', payload: { message: 'Failed to start game.', metadata: { error: String(e) } } });
    }
  };

  const handleReset = () => {
    try {
      dispatch({ type: RESET });
    } catch (e) {
      dispatch({ type: 'ERROR_RAISED', payload: { message: 'Failed to reset.', metadata: { error: String(e) } } });
    }
  };

  const handleModeChange = (newMode) => {
    try {
      dispatch({ type: SET_MODE, payload: newMode });
    } catch (e) {
      dispatch({ type: 'ERROR_RAISED', payload: { message: 'Failed to change mode.', metadata: { error: String(e) } } });
    }
  };

  const handleCellClick = (index) => {
    try {
      dispatch({ type: MAKE_MOVE, payload: index });
    } catch (e) {
      dispatch({ type: 'ERROR_RAISED', payload: { message: 'Move failed.', metadata: { error: String(e), index } } });
    }
  };

  const disableBoard = !!state.result || (state.mode === 'AI' && state.currentPlayer === 'O');

  return (
    <div className="game-container">
      <StatusBar
        currentPlayer={state.currentPlayer}
        mode={state.mode}
        result={state.result}
        error={state.error}
        aiThinking={state.mode === 'AI' && state.currentPlayer === 'O'}
      />
      <Controls
        mode={state.mode}
        onModeChange={handleModeChange}
        onStart={handleStart}
        onReset={handleReset}
        canChangeMode={!state.startedAt || !!state.result}
      />
      <Board board={state.board} onCellClick={handleCellClick} disabled={disableBoard} />
      <AuditPanel auditLog={state.auditLog} />
    </div>
  );
}
