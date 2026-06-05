// src/components/Shared.jsx
import React from 'react';

export function ScoreBadge({ score }) {
  if (!score) return <span className="text-muted">—</span>;
  const cls = score === 1 ? 'score-1' : score === 3 ? 'score-3' : 'score-5';
  const label = score === 1 ? 'Skor 1 — Red Flag' : score === 3 ? 'Skor 3 — Average' : 'Skor 5 — Future Senior PM';
  return <span className={cls}>{label}</span>;
}

export function DirectionBadge({ direction }) {
  if (!direction) return <span className="dir-neutral">—</span>;
  if (direction === 'pm_fit') return <span className="dir-pm">PM-fit</span>;
  if (direction === 'product_lean') return <span className="dir-product">Product-lean</span>;
  return <span className="dir-neutral">Netral</span>;
}

export function StageBadge({ stage }) {
  return <span className={`badge badge-s${stage}`}>Stage {stage}</span>;
}

export function KlasterBadge({ klaster }) {
  return <span className="badge badge-blue">Klaster {klaster}</span>;
}

export function StatusBadge({ status }) {
  if (status === 'active') return <span className="badge badge-green">Aktif</span>;
  if (status === 'completed') return <span className="badge badge-navy">Selesai</span>;
  if (status === 'closed') return <span className="badge badge-grey">Ditutup</span>;
  return <span className="badge badge-grey">{status}</span>;
}

export function DecisionBadge({ decision }) {
  const map = {
    hire: { cls: 'badge-green', label: '✓ Hire' },
    hire_with_dev: { cls: 'badge-blue', label: 'Hire + Dev' },
    caution: { cls: 'badge-amber', label: 'Hati-hati' },
    no: { cls: 'badge-red', label: 'No' },
    hold: { cls: 'badge-grey', label: 'Hold' },
  };
  const d = map[decision];
  if (!d) return null;
  return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

export function Avatar({ name, size = 'md' }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  return <div className={`avatar ${size === 'lg' ? 'avatar-lg' : ''}`}>{initials}</div>;
}

export function Spinner({ text = 'Memuat...' }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
      <h3>{title}</h3>
      {desc && <p className="text-muted">{desc}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Alert({ type = 'info', children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

export function Modal({ title, onClose, children, maxWidth = 520 }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-icon btn-sm" onClick={onClose} aria-label="Tutup">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FlagBadge({ flag }) {
  if (!flag) return null;
  if (flag === 'red_flag') return <span className="flag-pill">⚠ Red Flag</span>;
  if (flag === 'needs_probe') return <span className="probe-pill">🔍 Perlu digali</span>;
  return null;
}
