/**
 * Audit panel shows recent audit events, enabled via REACT_APP_TEST flag.
 */
export default function AuditPanel({ auditLog }) {
  const show = String(process.env.REACT_APP_TEST || process.env.REACT_APP_Test || '').toLowerCase() === 'true';
  if (!show) return null;

  return (
    <div className="audit-panel">
      <h3>Audit Trail (latest 10)</h3>
      <ul>
        {[...auditLog].slice(-10).reverse().map((e) => (
          <li key={e.id}>
            <div><strong>{e.actionType}</strong> • {e.timestamp}</div>
            <div className="small">user: {e.userId} • actor: {e.actor}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
