/**
 * ============================================================================
 * REQUIREMENT TRACEABILITY
 * ============================================================================
 * Requirement ID: REQ-TTT-003
 * User Story: As a compliance stakeholder, I need an audit trail for state changes.
 * Acceptance Criteria:
 *  - Event captures id, timestamp (ISO), userId, actor, actionType.
 *  - Includes before/after (diff-friendly snapshot), metadata, and optional reason.
 *  - Reducer integrates event logging for every state-changing action.
 * GxP Impact: YES - Data integrity (ALCOA+) logging.
 * Risk Level: MEDIUM
 * Validation Protocol: VP-TTT-003
 * ============================================================================
 */

// PUBLIC_INTERFACE
export function auditEventFactory(userContext, actor, action, before, after, metadata = {}, reason = '') {
  /**
   * /** Create an audit event object.
   * Function: auditEventFactory
   * Purpose: Produces a normalized audit event payload.
   * GxP Critical: Yes
   * Parameters:
   *  - userContext: { userId: string, roles?: string[] }
   *  - actor: string (component/actor name)
   *  - action: string (e.g., START_GAME, MAKE_MOVE, ERROR_RAISED)
   *  - before: any (snapshot)
   *  - after: any (snapshot)
   *  - metadata: object (technical details)
   *  - reason: string (optional justification)
   * Returns: { id, timestamp, userId, actor, actionType, before, after, metadata, reason }
   * Throws: none
   * Audit: Not applicable (this is the audit object)
   */
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const timestamp = new Date().toISOString();
  const userId = userContext?.userId || 'anonymous-session';
  return {
    id,
    timestamp,
    userId,
    actor,
    actionType: action,
    before,
    after,
    metadata,
    reason,
  };
}

// PUBLIC_INTERFACE
export function appendAudit(auditLog, event) {
  /**
   * /** Append an audit event to an in-memory audit array.
   * Function: appendAudit
   * Purpose: Push an event ensuring immutability.
   * GxP Critical: Yes
   * Parameters:
   *  - auditLog: array
   *  - event: object (from auditEventFactory)
   * Returns: new array with appended event
   * Throws: none
   * Audit: Not applicable (side-effect free)
   */
  const base = Array.isArray(auditLog) ? auditLog : [];
  return [...base, event];
}

// PUBLIC_INTERFACE
export function getDefaultUserContext() {
  /**
   * /** Provide default user context with role placeholders.
   * Function: getDefaultUserContext
   * Purpose: Supplies a basic context for audit and access control placeholders.
   * GxP Critical: Yes (attributable user id)
   * Parameters: none
   * Returns: { userId: string, roles: string[] }
   * Throws: none
   */
  return {
    userId: 'anonymous-session',
    roles: ['player'],
  };
}
