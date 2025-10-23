/**
 * ============================================================================
 * REQUIREMENT TRACEABILITY
 * ============================================================================
 * Requirement ID: REQ-TTT-004
 * User Story: As a player, I want to start/reset games, make moves, and play in Friend/AI modes.
 * Acceptance Criteria:
 *  - Reducer-based state with actions and validation.
 *  - Disallow illegal moves and enforce modes.
 *  - Log audit events for all state-changing actions.
 * GxP Impact: YES - Audit logging and validation.
 * Risk Level: MEDIUM
 * Validation Protocol: VP-TTT-004
 * ============================================================================
 */

import { computeResult } from './rules';
import { auditEventFactory, appendAudit, getDefaultUserContext } from './audit';
import { chooseMove } from './ai';

// Action constants
export const START_GAME = 'START_GAME';
export const MAKE_MOVE = 'MAKE_MOVE';
export const AI_MOVE = 'AI_MOVE';
export const SET_MODE = 'SET_MODE';
export const RESET = 'RESET';
export const SET_THEME = 'SET_THEME';
export const ERROR_RAISED = 'ERROR_RAISED';

// PUBLIC_INTERFACE
export function initialStateFactory() {
  /**
   * /** Create initial game state object.
   * Function: initialStateFactory
   * Purpose: Provide clean initial state for new game session.
   * GxP Critical: Yes (baseline for audit)
   * Parameters: none
   * Returns: GameState
   * Throws: none
   */
  const now = new Date().toISOString();
  return {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    result: null,
    mode: 'Friend', // Friend | AI
    startedAt: null,
    endedAt: null,
    lastActionAt: now,
    auditLog: [],
    theme: 'light',
    error: null,
    userContext: getDefaultUserContext(),
    aiThinking: false,
  };
}

function nextPlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

function withAudit(state, actor, action, before, after, metadata = {}, reason = '') {
  const event = auditEventFactory(state.userContext, actor, action, before, after, metadata, reason);
  return { ...state, auditLog: appendAudit(state.auditLog, event) };
}

function setError(state, message, metadata) {
  const before = { ...state };
  const after = { ...state, error: message, lastActionAt: new Date().toISOString() };
  let s = { ...after };
  s = withAudit({ ...before, auditLog: state.auditLog }, 'GameReducer', ERROR_RAISED, before, after, metadata);
  return s;
}

// PUBLIC_INTERFACE
export function gameReducer(state, action) {
  /**
   * /** Main reducer enforcing game business rules.
   * Function: gameReducer
   * Purpose: Handle actions and ensure consistent, validated state with audit.
   * GxP Critical: Yes
   * Parameters:
   *  - state: GameState
   *  - action: { type: string, payload?: any }
   * Returns: GameState
   * Throws: none (errors returned via ERROR_RAISED state)
   */
  const nowISO = new Date().toISOString();
  try {
    switch (action.type) {
      case START_GAME: {
        const before = state;
        const after = {
          ...state,
          board: Array(9).fill(''),
          currentPlayer: 'X',
          result: null,
          startedAt: nowISO,
          endedAt: null,
          lastActionAt: nowISO,
          error: null,
          aiThinking: false,
        };
        return withAudit(after, 'GameReducer', START_GAME, before, after, { mode: after.mode });
      }
      case SET_MODE: {
        const newMode = action.payload === 'AI' ? 'AI' : 'Friend';
        if (state.startedAt && !state.result && state.mode !== newMode) {
          // Mode change mid-game requires confirmation at UI; reject by default
          return setError(state, 'Cannot change mode mid-game without confirmation.', { requestedMode: newMode });
        }
        const before = state;
        const after = { ...state, mode: newMode, lastActionAt: nowISO };
        return withAudit(after, 'GameReducer', SET_MODE, before, after, { requestedMode: newMode });
      }
      case RESET: {
        const before = state;
        const after = {
          ...initialStateFactory(),
          theme: state.theme,
          userContext: state.userContext,
        };
        return withAudit(after, 'GameReducer', RESET, before, after, {});
      }
      case SET_THEME: {
        const theme = action.payload === 'dark' ? 'dark' : 'light';
        const before = state;
        const after = { ...state, theme, lastActionAt: nowISO };
        return withAudit(after, 'GameReducer', SET_THEME, before, after, { theme });
      }
      case MAKE_MOVE: {
        const index = action.payload;
        // Basic validations
        if (state.result) {
          return setError(state, 'Game already ended.', { attemptedIndex: index });
        }
        if (typeof index !== 'number' || index < 0 || index > 8) {
          return setError(state, 'Invalid move position.', { attemptedIndex: index });
        }
        if (state.board[index]) {
          return setError(state, 'Cell already occupied.', { attemptedIndex: index });
        }
        // Access control placeholders
        if (state.mode === 'AI' && state.currentPlayer === 'O') {
          return setError(state, 'It is AI turn, please wait.', { attemptedIndex: index });
        }

        const before = state;
        const newBoard = [...state.board];
        newBoard[index] = state.currentPlayer;
        const result = computeResult(newBoard);
        const after = {
          ...state,
          board: newBoard,
          currentPlayer: result ? state.currentPlayer : nextPlayer(state.currentPlayer),
          result,
          lastActionAt: nowISO,
          endedAt: result ? nowISO : null,
          error: null,
        };
        return withAudit(after, 'GameReducer', MAKE_MOVE, before, after, { index, player: state.currentPlayer });
      }
      case AI_MOVE: {
        if (state.mode !== 'AI') {
          return setError(state, 'AI move not allowed in Friend mode.', { action: 'AI_MOVE' });
        }
        if (state.result) {
          return setError(state, 'Game already ended.', { action: 'AI_MOVE' });
        }
        if (state.currentPlayer !== 'O') {
          return setError(state, 'Not AI turn.', { action: 'AI_MOVE', currentPlayer: state.currentPlayer });
        }
        const choice = chooseMove(state);
        if (choice === -1 || state.board[choice]) {
          // No legal moves; finalize draw if needed
          const res = computeResult(state.board) || 'Draw';
          const before = state;
          const after = {
            ...state,
            result: res,
            endedAt: nowISO,
            lastActionAt: nowISO,
            aiThinking: false,
          };
          return withAudit(after, 'GameReducer', AI_MOVE, before, after, { reason: 'no-legal-move' });
        }
        const before = state;
        const newBoard = [...state.board];
        newBoard[choice] = 'O';
        const result = computeResult(newBoard);
        const after = {
          ...state,
          board: newBoard,
          currentPlayer: result ? 'O' : 'X',
          result,
          lastActionAt: nowISO,
          endedAt: result ? nowISO : null,
          error: null,
          aiThinking: false,
        };
        return withAudit(after, 'GameReducer', AI_MOVE, before, after, { index: choice, player: 'O' });
      }
      case ERROR_RAISED: {
        // Allow external error handler to log errors consistently
        return setError(state, action.payload?.message || 'Unknown error', action.payload?.metadata || {});
      }
      default:
        return state;
    }
  } catch (e) {
    return setError(state, 'Unexpected error occurred.', { error: String(e), actionType: action?.type });
  }
}
