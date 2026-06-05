// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { Avatar, StatusBadge, DirectionBadge, DecisionBadge, Spinner, EmptyState, Modal } from './Shared';
import { createBatch, createCandidate } from '../lib/supabase';
import { BANK, ACTIVE_INDEX } from '../data/bank';

function MetricCard({ value, label, sub, color }) {
  return (
    <div className="metric-card">
      <div className="metric-val" style={color ? { color } : {}}>{value}</div>
      <div className="metric-label">{label}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function BatchModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createBatch(
        name.trim(),
        ACTIVE_INDEX.stage1.map(i => BANK.stage1[i].id),
        ACTIVE_INDEX.stage2.map(i => BANK.stage2[i].id),
        BANK.stage3[ACTIVE_INDEX.stage3].id,
        ACTIVE_INDEX.stage4.map(i => BANK.stage4[i].id)
      );
      onCreated();
      onClose();
    } catch (e) {
      alert('Gagal membuat batch: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Buat Batch Baru" onClose={onClose}>
      <div className="field">
        <label>Nama batch</label>
        <input
          type="text"
          placeholder="Contoh: Batch 2025-Q3"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          autoFocus
        />
      </div>
      <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '12px', marginBottom: 16, fontSize: 13, color: '#4B5563' }}>
        <strong style={{ color: '#111827' }}>UC yang akan dipakai:</strong><br />
        Stage 1: 5 UC · Stage 2: 7 UC · Stage 3: 1 tugas + refleksi · Stage 4: 7 UC
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !name.trim()}>
          {loading ? <><div className="spinner" /> Membuat...</> : 'Buat Batch'}
        </button>
      </div>
    </Modal>
  );
}

function CandidateModal({ batches, onClose, onCreated }) {
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !email.trim() || !batchId) return;
    setLoading(true);
    try {
      await createCandidate(batchId, name.trim(), email.trim());
      onCreated();
      onClose();
    } catch (e) {
      alert('Gagal menambahkan kandidat: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Tambah Kandidat" onClose={onClose}>
      <div className="field">
        <label>Batch</label>
        <select value={batchId} onChange={e => setBatchId(e.target.value)}>
          {batches.filter(b => b.status === 'active').map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Nama lengkap</label>
        <input type="text" placeholder="Nama kandidat" value={name} onChange={e => setName(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" placeholder="email@domain.com" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !name || !email || !batchId}>
          {loading ? <><div className="spinner" /> Menambahkan...</> : 'Tambah Kandidat'}
        </button>
      </div>
    </Modal>
  );
}

export default function Dashboard({ batches, candidates, loading, onRefresh, onSelectCandidate }) {
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showCandModal, setShowCandModal] = useState(false);

  const totalCandidates = candidates.length;
  const active = candidates.filter(c => c.status === 'active').length;
  const pmFit = candidates.filter(c => c.direction === 'pm_fit').length;
  const hires = candidates.filter(c => c.final_decision === 'hire').length;

  if (loading) return <Spinner text="Memuat dashboard..." />;

  return (
    <div>
      {/* Metrics */}
      <div className="grid-4 mb-3">
        <MetricCard value={batches.length} label="Total Batch" />
        <MetricCard value={totalCandidates} label="Total Kandidat" />
        <MetricCard value={active} label="Kandidat Aktif" color="#2E75B6" />
        <MetricCard value={hires} label="Hire" color="#548235" />
      </div>

      <div className="grid-2">
        {/* Batches */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <div className="card-title" style={{ margin: 0 }}>Batch Rekrutmen</div>
            <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowBatchModal(true)}>
              + Batch Baru
            </button>
          </div>
          {batches.length === 0 ? (
            <EmptyState
              icon={<path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z M8 11h8M8 15h5" />}
              title="Belum ada batch"
              desc="Buat batch pertama untuk memulai rekrutmen"
            />
          ) : batches.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EBF4FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" strokeWidth="2">
                  <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{b.name}</div>
                <div className="text-xs text-muted">{new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <StatusBadge status={b.status} />
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                {candidates.filter(c => c.batch_id === b.id).length} kandidat
              </div>
            </div>
          ))}
        </div>

        {/* Candidates */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <div className="card-title" style={{ margin: 0 }}>Kandidat</div>
            <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }}
              onClick={() => batches.filter(b => b.status === 'active').length > 0 ? setShowCandModal(true) : alert('Buat batch aktif terlebih dahulu.')}
            >
              + Kandidat
            </button>
          </div>
          {candidates.length === 0 ? (
            <EmptyState
              icon={<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />}
              title="Belum ada kandidat"
              desc="Tambahkan kandidat ke batch yang aktif"
            />
          ) : candidates.slice(0, 7).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
              <Avatar name={c.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div className="text-xs text-muted">Stage {c.current_stage} · {c.email}</div>
              </div>
              <DirectionBadge direction={c.direction} />
              {c.final_decision && <DecisionBadge decision={c.final_decision} />}
              <button className="btn btn-xs btn-blue" onClick={() => onSelectCandidate(c)}>Evaluasi</button>
            </div>
          ))}
          {candidates.length > 7 && (
            <div className="text-muted" style={{ textAlign: 'center', paddingTop: 10, fontSize: 12 }}>
              +{candidates.length - 7} kandidat lainnya
            </div>
          )}
        </div>
      </div>

      {/* Summary table */}
      {candidates.length > 0 && (
        <div className="card">
          <div className="card-title">Ringkasan Semua Kandidat</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kandidat</th>
                  <th>Batch</th>
                  <th>Stage</th>
                  <th>Arah</th>
                  <th>Keputusan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => {
                  const batch = batches.find(b => b.id === c.batch_id);
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar name={c.name} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{c.name}</div>
                            <div className="text-xs text-muted">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-sm">{batch?.name || '—'}</span></td>
                      <td><span className={`badge badge-s${c.current_stage}`}>Stage {c.current_stage}</span></td>
                      <td><DirectionBadge direction={c.direction} /></td>
                      <td>{c.final_decision ? <DecisionBadge decision={c.final_decision} /> : <span className="text-muted">—</span>}</td>
                      <td>
                        <button className="btn btn-xs btn-blue" onClick={() => onSelectCandidate(c)}>
                          Evaluasi
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showBatchModal && (
        <BatchModal onClose={() => setShowBatchModal(false)} onCreated={onRefresh} />
      )}
      {showCandModal && (
        <CandidateModal
          batches={batches} onClose={() => setShowCandModal(false)} onCreated={onRefresh}
        />
      )}
    </div>
  );
}
