/**
 * ============================================================================
 * REQUIREMENT TRACEABILITY
 * ============================================================================
 * Requirement ID: REQ-TTT-001
 * User Story: As a player, I want game rules that correctly determine wins/draws.
 * Acceptance Criteria:
 *  - Winning lines are correctly recognized for X and O.
 *  - Draw is detected when the board is full with no winner.
 *  - Ongoing game returns null.
 * GxP Impact: NO - Pure deterministic computation.
 * Risk Level: LOW
 * Validation Protocol: VP-TTT-001
 * ============================================================================
 * ============================================================================
 * IMPORTS AND DEPENDENCIES
 * ============================================================================
 * None - pure functions module.
 * ============================================================================
 */

/**
 * WIN_LINES define all 8 winning combinations over a 3x3 board.
 */
export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
export function computeResult(board) {
  /**
   * /** Determine game result.
   * Function: computeResult
   * Purpose: Evaluate board and return 'X' | 'O' | 'Draw' | null
   * GxP Critical: No
   * Parameters:
   *  - board: string[] length 9 with values 'X'|'O'|'' (validated to length 9)
   * Returns: 'X'|'O'|'Draw'|null
   * Throws: none (invalid input handled defensively returning null)
   * Audit: Not applicable (pure calculation)
   */
  if (!Array.isArray(board) || board.length !== 9) return null;

  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  const hasEmpty = board.some((c) => !c);
  if (!hasEmpty) return 'Draw';
  return null;
}
