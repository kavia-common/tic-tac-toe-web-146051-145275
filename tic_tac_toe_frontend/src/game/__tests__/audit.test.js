import { auditEventFactory, appendAudit, getDefaultUserContext } from '../../game/audit';

describe('audit', () => {
  test('factory produces complete event', () => {
    const ctx = getDefaultUserContext();
    const e = auditEventFactory(ctx, 'tester', 'START_GAME', {a:1}, {a:2}, {info:'x'}, 'reason');
    expect(e.id).toBeDefined();
    expect(e.timestamp).toBeDefined();
    expect(e.userId).toBe('anonymous-session');
    expect(e.actor).toBe('tester');
    expect(e.actionType).toBe('START_GAME');
    expect(e.before).toEqual({a:1});
    expect(e.after).toEqual({a:2});
    expect(e.metadata).toEqual({info:'x'});
    expect(e.reason).toBe('reason');
  });

  test('appendAudit appends immutably', () => {
    const a1 = appendAudit([], { id: '1' });
    expect(a1).toHaveLength(1);
    const a2 = appendAudit(a1, { id: '2' });
    expect(a2).toHaveLength(2);
    expect(a1).toHaveLength(1);
  });
});
