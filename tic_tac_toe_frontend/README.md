# Tic Tac Toe – Ocean Professional

A compliant, test-ready Tic Tac Toe web app with Friend and AI modes, Ocean Professional styling, state management via reducer, and GxP-aligned audit scaffolding.

## Quick Start
- Install: npm install
- Dev: npm start
- Test: npm test
- Build: npm run build

## Environment Variables
- REACT_APP_TEST=true enables the AuditPanel for test/development visibility. For production, omit or set to false.

## Components
- App: Theme toggle and layout shell.
- GameController: Orchestrates state and actions using useReducer.
- Board/Cell: Accessible grid with ARIA roles and keyboard support.
- StatusBar: Shows turn/mode/result/errors.
- Controls: Mode selector (Friend/AI), Start, Reset with mid-game change confirmation.
- AuditPanel: Optional audit trail viewer (REACT_APP_TEST).

## State and Actions
- initialStateFactory: { board[9], currentPlayer 'X', result null, mode 'Friend', startedAt, endedAt null, lastActionAt, auditLog[], theme, error, userContext, aiThinking }.
- Actions:
  - START_GAME, MAKE_MOVE(index), AI_MOVE, SET_MODE('Friend'|'AI'), RESET, SET_THEME('light'|'dark'), ERROR_RAISED({message,metadata}).
- Business rules:
  - Friend: both players act on their turns.
  - AI: Human is X only; AI acts as O; prevent player during AI turn.
  - Prevent AI actions in Friend mode; prevent illegal/occupied moves; stop moves after result.

## Rules and AI
- rules.computeResult(board) → 'X' | 'O' | 'Draw' | null with WIN_LINES.
- ai.chooseMove(state) picks center, then corners, then sides; returns -1 if none.

## Audit Strategy (GxP-aligned)
- auditEventFactory(userContext, actor, actionType, before, after, metadata, reason) ⇒ {id, timestamp ISO, userId, ...}.
- In-memory append via appendAudit.
- Reducer logs an audit event for every state change.
- Error handling: UI dispatches ERROR_RAISED with friendly message; technical details in metadata.

UserContext: default userId 'anonymous-session' with role placeholders (player). Hook up real auth later.

## Styling – Ocean Professional
- Palette: primary #2563EB, secondary #F59E0B, background #f9fafb, surface #ffffff, text #111827, error #EF4444.
- Rounded corners, subtle shadows, focus rings, transitions.

## Accessibility
- ARIA roles on board/cells; keyboard navigation (Enter/Space).
- status messages use aria-live=polite; errors use role=alert.

## Testing
- Unit tests: rules, reducer, AI, audit.
- Integration tests: Friend and AI modes using React Testing Library.
- Coverage target: >=80%.

Run:
- npm test
- CI: tests are deterministic; AI delay mocked via fake timers.

## GxP Compliance Summary
- Data Integrity: Attributable (userId), Contemporaneous (ISO timestamps), Complete (before/after, metadata), Consistent (reducer rules).
- Error Handling: try/catch in UI, ERROR_RAISED action; technical details recorded.
- Access Controls: role placeholders and mode-based restrictions. Expand with real RBAC as needed.
- Electronic Signature: out of scope for this demo; hook points available at action dispatchers.

## Acceptance Criteria Mapping
- Components and reducer: src/components/*, src/game/state.js
- Rules and AI: src/game/rules.js, src/game/ai.js
- Audit: src/game/audit.js integrated in reducer
- Tests: src/game/__tests__/* and src/__tests__/*
- Styles: src/App.css, src/index.css

