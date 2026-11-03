export const styles = {
  wrapper: { position: 'relative' },

  bell: (open) => ({
    width: '38px', height: '38px', borderRadius: '10px',
    border: `1px solid ${open ? '#99f6e4' : '#e8ecf0'}`,
    background: open ? '#f0fdfa' : 'white',
    color: open ? '#0d9488' : '#64748b',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', position: 'relative', transition: 'all 0.15s',
  }),

  badge: {
    position: 'absolute', top: '-5px', right: '-5px',
    minWidth: '17px', height: '17px', padding: '0 4px', boxSizing: 'border-box',
    borderRadius: '999px', background: '#0d9488', color: '#fff',
    fontSize: '10px', fontWeight: '700', lineHeight: '17px',
    textAlign: 'center', border: '1.5px solid white',
  },

  panel: {
    position: 'absolute', right: 0, top: '46px', width: '340px',
    maxWidth: 'calc(100vw - 32px)', background: '#ffffff',
    border: '1px solid #e2e8f0', borderRadius: '16px',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
    zIndex: 100, overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 16px', borderBottom: '1px solid #f1f5f9',
  },
  panelTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a' },
  linkButton: {
    background: 'none', border: 'none', color: '#0d9488',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
  },
  list: { maxHeight: '360px', overflowY: 'auto' },
  stateBox: { padding: '28px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' },

  item: (read, first) => ({
    padding: '12px 16px',
    borderTop: first ? 'none' : '1px solid #f1f5f9',
    background: read ? '#ffffff' : '#f0fdfa',
    display: 'flex', gap: '10px', alignItems: 'flex-start',
  }),
  itemDot: (read) => ({
    width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0,
    background: read ? 'transparent' : '#0d9488',
  }),
  itemTitle: { fontSize: '13px', fontWeight: '600', color: '#0f172a' },
  itemMessage: { fontSize: '12.5px', color: '#64748b', marginTop: '2px' },
  itemTime: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' },
}