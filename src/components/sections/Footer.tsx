export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '24px 0',
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: 'var(--text-3)',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span>Yash Dhumane · Void Architect build</span>
        <span>© 2026 · self-hosted, of course</span>
      </div>
    </footer>
  );
}
