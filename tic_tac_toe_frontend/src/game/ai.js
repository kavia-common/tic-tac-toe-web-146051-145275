/**
 * ============================================================================
 * REQUIREMENT TRACEABILITY
 * ============================================================================
 * Requirement ID: REQ-TTT-002
 * User Story: As a player, I want to play against a simple AI opponent.
 * Acceptance Criteria:
 *  - AI selects center if available, then corners, then sides.
 *  - AI never selects an occupied cell.
 *  - Returns -1 if no legal move.
 * GxP Impact: NO - Non-critical UX feature.
 * Risk Level: LOW
 * Validation Protocol: VP-TTT-002
 * ============================================================================
 */

// Preference indices
const CENTER = [4];
const CORNERS = [0, 2, 6, 8];
const SIDES = [1, 3, 5, 7];

// PUBLIC_INTERFACE
export function chooseMove(state) {
  /**
   * /** Choose AI move index based on board state.
   * Function: chooseMove
   * Purpose: Deterministic selection of next move for AI.
   * GxP Critical: No
   * Parameters:
   *  - state: { board: string[9] }
   * Returns: number index 0..8 or -1 if none available
   * Throws: none
   * Audit: selection is deterministic and logged by reducer when applied
   */
  const board = state?.board || [];
  if (!Array.isArray(board) || board.length !== 9) return -1;

  const firstEmpty = (indices) => indices.find((i) => !board[i] && i >= 0 && i < 9);

  return (
    firstEmpty(CENTER) ??
    firstEmpty(CORNERS) ??
    firstEmpty(SIDES) ??
    -1
  );
}
