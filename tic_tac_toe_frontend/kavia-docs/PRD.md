# Tic Tac Toe React Frontend – Product Requirements Document (PRD)

## Overview
The Tic Tac Toe React frontend is a modern, accessible web application that allows a user to play the classic game either against a friend (hot-seat) or a built-in AI opponent. The UI follows the Ocean Professional style guide with a minimal, polished look and clear focus states. The application uses a reducer-based state management pattern, provides a GxP-aligned audit trail for state change events, and ships with unit and integration tests targeting at least 80% coverage. An optional audit panel is visible in test/development when enabled via environment variables.

## Goals and Non-Goals
### Product Goals
- Provide an intuitive, accessible, and responsive Tic Tac Toe experience.
- Support Friend and AI modes with correct rules enforcement and deterministic AI behavior.
- Implement a GxP-aligned audit trail capturing all state-changing actions with timestamps, user attribution, and before/after snapshots.
- Deliver a test-ready frontend with unit and integration coverage of at least 80%.
- Adhere to the Ocean Professional style for visual consistency.

### Non-Goals (Out-of-Scope)
- Persistent storage of audit logs or game history. Current audit is in-memory.
- Authentication, real RBAC, or electronic signatures. Placeholders exist to integrate later.
- Server APIs, backends, or databases. This is a standalone frontend.
- Networked multiplayer; Friend mode is hot-seat on one device.
- Complex AI strategies; the AI is intentionally simple and deterministic.

## User Personas and Stories
### Personas
- Casual Player: Wants to play quickly in a browser, alone or with a friend.
- QA/Compliance Reviewer: Needs visibility into audit trail during testing and verification.
- Developer: Requires clear state management, rules, and tests for maintainability.

### User Stories
- REQ-TTT-001 Rules: As a player, I want correct rule enforcement and clear end-of-game results so I can trust the game outcome.
- REQ-TTT-002 AI: As a player, I want a simple AI opponent so I can play solo.
- REQ-TTT-003 Audit: As a compliance stakeholder, I need an audit trail for state changes to review data integrity.
- REQ-TTT-004 State/Actions: As a player, I want to start/reset games, make moves, and switch modes under valid conditions.
- REQ-TTT-005 UI: As a player, I want an interactive UI that guides me through playing in Friend or AI mode with appropriate feedback.

## Functional Requirements
- Gameplay
  - Render a 3×3 board with accessible, focusable cells.
  - Allow players to start a game, make moves in turn, and reset the game.
  - Enforce rules: detect wins, draws, and block illegal moves.
  - Friend mode: both X and O are human players.
  - AI mode: human is X; AI always plays O with deterministic selection (center, corners, sides).
- State Management
  - Use a reducer to manage state transitions with explicit action types:
    - START_GAME, MAKE_MOVE(index), AI_MOVE, SET_MODE('Friend'|'AI'), RESET, SET_THEME('light'|'dark'), ERROR_RAISED({message, metadata})
  - Prevent moves after the game has ended.
  - Prevent illegal or out-of-range indices and occupied cell selections.
  - In AI mode, prevent human moves during AI turn.
- UI/UX
  - Ocean Professional theme with light/dark toggle.
  - StatusBar shows current player, mode, result, and errors, with polite ARIA live regions.
  - Controls for mode selection, start, and reset. Confirm mode changes during active games.
  - Optional AuditPanel visible when REACT_APP_TEST or REACT_APP_Test is true.
- Audit (GxP-aligned scaffolding)
  - Create audit event for each state-changing action capturing:
    - id, ISO timestamp, userId (default anonymous-session), actor, actionType, before, after, metadata, reason (optional).
  - Append audit events immutably to an in-memory log.
- Accessibility
  - Board and cell components provide ARIA roles and keyboard navigation (Enter/Space).
  - Errors are announced with role="alert"; status updates use aria-live="polite".

## Non-Functional Requirements
- Performance: Instantaneous UI response; AI selection is deterministic with a small artificial delay (~150ms) for UX.
- Reliability: Deterministic rule evaluation and AI choice functions; defensive checks on inputs.
- Security: Access control placeholders in reducer; no persistent PII; environment flag gates the audit viewer.
- Maintainability: Clear separation of concerns (rules, AI, audit, state, components) with unit tests.
- Testability: >=80% coverage, deterministic tests with fake timers for AI delay.
- Compliance: GxP-aligned audit scaffolding for attributable, contemporaneous, complete, and consistent logging.

## Acceptance Criteria
- Rules correctly determine winners and draws and return null during in-progress games.
- AI selects center if available; otherwise corners; otherwise sides; returns -1 when the board is full.
- Reducer enforces:
  - No moves after a result is set.
  - No illegal indices or moves to occupied cells.
  - In AI mode, human cannot move when it is AI’s turn; AI not allowed in Friend mode.
  - Mode change mid-game is blocked by default unless UI confirms and dispatches change.
- UI renders StatusBar, Board/Cell, Controls, AuditPanel (only when audit is enabled via env).
- Errors are user-friendly in the UI and technical details are present in audit metadata.
- Unit tests and integration tests pass with >=80% coverage.

## Scope
- In-scope: Reducer-managed state, Friend and AI modes, rule evaluation, audit trail in-memory, Ocean Professional styling, accessibility, test suite.
- Out-of-scope: Persistence, authentication/authorization integration, signatures, backend services, advanced AI, multi-user networking.

## Risks and Assumptions
- Risks
  - Misinterpretation of GxP expectations: mitigated by aligning to ALCOA+ principles and providing extensible scaffolding.
  - Overreliance on environment flags: mitigated by defaulting to no audit panel in production.
- Assumptions
  - The application runs entirely client-side in a secure environment.
  - User identity is anonymous by default until integrated with real auth.
  - Audit logs do not persist beyond the session.

## Release Criteria
- Functional completeness per acceptance criteria with passing unit and integration tests.
- Test coverage of at least 80%.
- No critical or high-severity lint or test issues.
- Documentation complete: PRD and Architecture document with traceability.
- Audit trail generation validated in unit tests; optional AuditPanel guarded by env flags.
- Visual conformance to Ocean Professional style.

## GxP Alignment Summary (ALCOA+)
- Attributable: userId captured (anonymous-session by default) for all state changes.
- Legible: code with inline documentation and clear structure; documentation provided.
- Contemporaneous: audit timestamps are ISO and generated at time of change.
- Original: audit events produced and stored in session memory; provenance evident via before/after.
- Accurate: reducer validates inputs and business rules; tests verify correctness.
- Complete: audit includes actor, actionType, metadata, and optional reason.
- Consistent: all state changes go through reducer with uniform audit logging.
- Enduring: in-memory by design for this demo; extension to persistence planned for future.
- Available: UI access control placeholders and environment gating for sensitive views.

## Environment Variables
- REACT_APP_TEST, REACT_APP_Test
  - When set to "true", enables the in-app AuditPanel for visibility during test/development.
  - In production, omit or set to false.

## Traceability Mapping (Requirement → Implementation → Tests)
- REQ-TTT-001 (Rules) → src/game/rules.js (computeResult, WIN_LINES) → src/game/__tests__/rules.test.js
- REQ-TTT-002 (AI) → src/game/ai.js (chooseMove) → src/game/__tests__/ai.test.js; src/__tests__/integration.aiMode.test.jsx
- REQ-TTT-003 (Audit) → src/game/audit.js; integration in src/game/state.js → src/game/__tests__/audit.test.js
- REQ-TTT-004 (State/Actions) → src/game/state.js (reducer, actions) → src/game/__tests__/state.reducer.test.js
- REQ-TTT-005 (UI) → src/components/*, src/components/GameController.jsx → src/__tests__/integration.friendMode.test.jsx, src/__tests__/integration.aiMode.test.jsx

## References
- Ocean Professional styling: src/App.css, src/index.css
- Entry point and app shell: src/App.js, src/index.js

