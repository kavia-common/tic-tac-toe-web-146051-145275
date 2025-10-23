# Tic Tac Toe React Frontend – Architecture

## System Overview
This application is a client-side React app that renders a Tic Tac Toe game with two modes: Friend and AI. It employs useReducer for state management, domain modules for rules, AI, and audit logging, and presents a component-based UI conforming to the Ocean Professional style. All state-changing actions are funneled through the reducer, enabling centralized validation and audit logging. Tests cover unit logic (rules, AI, reducer, audit) and user flows (integration tests for Friend and AI modes).

## Component Architecture (Textual Diagram)
- App (src/App.js)
  - Responsibilities: App shell, theme toggle, layout shell.
  - Children:
    - GameController
- GameController (src/components/GameController.jsx)
  - Responsibilities: Initialize reducer state, dispatch actions, orchestrate gameplay, trigger AI on AI turns, propagate errors.
  - Children:
    - StatusBar
    - Controls
    - Board
    - AuditPanel (conditionally rendered via environment flags)
- StatusBar (src/components/StatusBar.jsx)
  - Responsibilities: Display current status, mode, result, and errors with aria-live.
- Controls (src/components/Controls.jsx)
  - Responsibilities: Mode selection, Start, Reset; confirm mid-game mode changes.
- Board (src/components/Board.jsx)
  - Responsibilities: Render 3×3 grid; delegate cell interactions.
  - Children:
    - Cell (9 instances)
- Cell (src/components/Cell.jsx)
  - Responsibilities: Accessible button for a single cell; keyboard handling (Enter/Space).
- AuditPanel (src/components/AuditPanel.jsx)
  - Responsibilities: Show recent audit events when enabled by REACT_APP_TEST/REACT_APP_Test.

## Data and State Management
- Reducer File: src/game/state.js
- State Shape (initialStateFactory):
  - board: string[9]
  - currentPlayer: 'X' | 'O'
  - result: 'X' | 'O' | 'Draw' | null
  - mode: 'Friend' | 'AI'
  - startedAt: ISO string | null
  - endedAt: ISO string | null
  - lastActionAt: ISO string
  - auditLog: Array<AuditEvent>
  - theme: 'light' | 'dark'
  - error: string | null
  - userContext: { userId: string, roles: string[] }
  - aiThinking: boolean
- Actions:
  - START_GAME, MAKE_MOVE(index), AI_MOVE, SET_MODE('Friend'|'AI'), RESET, SET_THEME('light'|'dark'), ERROR_RAISED({message, metadata})
- Reducer Behavior:
  - Validates indices, occupancy, game completion, and mode rules.
  - Applies moves, updates result via rules.computeResult.
  - Enforces AI move constraints and blocks AI actions in Friend mode.
  - Generates audit events for all state-changing actions via auditEventFactory and appendAudit.
  - setError helper normalizes error handling and audit logging.

## Game Rules and AI
- Rules Module: src/game/rules.js
  - computeResult(board): returns 'X' | 'O' | 'Draw' | null
  - WIN_LINES: all winning line combinations
- AI Module: src/game/ai.js
  - chooseMove(state): deterministic preference order center → corners → sides; returns -1 if no legal move
- AI Turn Handling:
  - GameController monitors state and dispatches AI_MOVE after a short delay when mode is AI and current player is 'O'.
  - Reducer validates AI_MOVE, applies selection, and sets result if applicable.

## Audit Trail Design (GxP-Aligned)
- Audit Module: src/game/audit.js
  - auditEventFactory(userContext, actor, actionType, before, after, metadata, reason?)
  - appendAudit(auditLog, event)
  - getDefaultUserContext()
- Audit Scope:
  - Every state-changing action handled by the reducer generates an audit event:
    - id, timestamp (ISO), userId, actor, actionType, before, after, metadata, reason
  - Actor is typically "GameReducer"; userId defaults to "anonymous-session".
  - Events are appended immutably to in-memory auditLog. For production persistence, a downstream storage adapter can be added later.
- Audit Visibility:
  - AuditPanel conditionally renders the latest events when REACT_APP_TEST or REACT_APP_Test is true.

## Error Handling
- UI dispatchers in GameController wrap dispatch calls in try/catch and dispatch ERROR_RAISED with friendly messages and technical metadata.
- Reducer setError creates a consistent error message in state and emits a corresponding audit event with metadata details.
- StatusBar displays errors with role="alert", while general status uses aria-live="polite".

## Access Control Placeholders
- The reducer enforces mode-based constraints (e.g., block human moves during AI turns).
- userContext contains userId and roles; default is { userId: 'anonymous-session', roles: ['player'] }.
- Real RBAC, permission checks, and electronic signature capture are out of scope but can be integrated by augmenting userContext and adding new guarded actions.

## Environment Variables
- REACT_APP_TEST / REACT_APP_Test:
  - "true" enables AuditPanel for test/development.
  - Any other value hides the panel (default for production).
- Theme is managed in state and DOM attribute "data-theme" via App; no env variables needed for theme.

## Ocean Professional Style Guide Integration
- Colors and elevation are implemented in src/App.css with variables:
  - primary #2563EB, secondary #F59E0B, background #f9fafb, surface #ffffff, text #111827, error #EF4444
- Components use rounded corners, subtle shadows, and focus rings.
- Responsive adjustments ensure the board scales on smaller screens.

## Testing Strategy
- Unit Tests:
  - Rules: src/game/__tests__/rules.test.js
  - AI: src/game/__tests__/ai.test.js
  - Audit: src/game/__tests__/audit.test.js
  - Reducer: src/game/__tests__/state.reducer.test.js
- Integration Tests:
  - Friend mode: src/__tests__/integration.friendMode.test.jsx
  - AI mode: src/__tests__/integration.aiMode.test.jsx (uses fake timers to advance AI delay)
- Coverage Target:
  - >=80% total coverage, focusing on reducer branches, rules outcomes, and AI decision paths.
- Determinism:
  - AI behavior is deterministic and timer-based delay is controlled with jest fake timers.
- Accessibility Verification:
  - Tests query UI by roles and accessible names (e.g., buttons for cells, status text, and aria-live regions).

## Traceability Mapping
- REQ-TTT-001 → src/game/rules.js → src/game/__tests__/rules.test.js
- REQ-TTT-002 → src/game/ai.js → src/game/__tests__/ai.test.js; src/__tests__/integration.aiMode.test.jsx
- REQ-TTT-003 → src/game/audit.js; integration in src/game/state.js → src/game/__tests__/audit.test.js
- REQ-TTT-004 → src/game/state.js (reducer/actions) → src/game/__tests__/state.reducer.test.js
- REQ-TTT-005 → src/components/*, src/components/GameController.jsx → src/__tests__/integration.friendMode.test.jsx, src/__tests__/integration.aiMode.test.jsx

## Release Readiness Checklist
- Inputs validated in reducer; illegal moves blocked.
- Audit trail generated for all state-changing actions.
- Unit and integration tests passing locally and in CI; coverage ≥80%.
- UI errors are user-friendly; technical details present in audit metadata.
- Documentation complete (PRD and Architecture).
- Ocean Professional styling verified visually.

## Extensibility Notes
- Persistence: Add a storage adapter to persist auditLog and game sessions.
- Auth/RBAC: Replace getDefaultUserContext with real auth and role checks; add protected actions and signature flows for critical operations.
- AI: Swap chooseMove with more advanced AI while preserving reducer contract and tests.
- Internationalization: Introduce i18n for UI strings and messages.

