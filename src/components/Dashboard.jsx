import React, { useState } from 'react';
import { Avatar, StatusBadge, DirectionBadge, DecisionBadge, Spinner, EmptyState, Modal } from './Shared';
import { createBatch, createCandidate, deleteCandidate } from '../lib/supabase';
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
  const [name, setName]    = useState('');
  const [loading, setLoad] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoad(true);
    try {
      await createBatch(
        name.trim(),
        ACTIVE_INDEX.stage1.map(i => BANK.stage1[i].id),
        ACTIVE_INDEX.stage2.map(i => BANK.stage2[i].id),
        BANK.stage3[ACTIVE_INDEX.stage3].id,
        ACTIVE_INDEX.stage4.map(i => BANK.stage4[i].id)
      );
      onCreated(); onClose();
    } catch (e) { alert('Gagal membuat batch: ' + e.message); }
    finally { setLoad(false); }
  }

  return (
    <Modal title="Buat Batch Baru" onClose={onClose}>
      <div className="field">
        <label>Nama batch</label>
        <input type="text" placeholder="Contoh: Batch 2025-Q3" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} autoFocus />
      </div>
      <div style={{ background:'#F9FAFB', borderRadius:10, padding:'12px 14px', marginBottom:18, fontSize:14, color:'#4B5563', lineHeight:1.6 }}>
        <strong style={{ color:'#111827' }}>UC per batch:</strong><br />
        Stage 1: 5 UC · Stage 2: 7 UC · Stage 3: 1 tugas + refleksi · Stage 4: 7 UC
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button className="btn" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !name.trim()}>
          {loading ? <><div className="spinner"/> Membuat...</> : 'Buat Batch'}
        </button>
      </div>
    </Modal>
  );
}

function CandidateModal({ batches, onClose, onCreated }) {
  const activeBatches = batches.filter(b => b.status === 'active');
  const [batchId, setBatch] = useState(activeBatches[0]?.id || '');
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [loading, setLoad]  = useState(false);

  async function handleCreate() {
    if (!name.trim() || !email.trim() || !batchId) return;
    setLoad(true);
    try {
      await createCandidate(batchId, name.trim(), email.trim());
      onCreated(); onClose();
    } catch (e) { alert('Gagal menambahkan kandidat: ' + e.message); }
    finally { setLoad(false); }
  }

  return (
    <Modal title="Tambah Kandidat" onClose={onClose}>
      <div className="field">
        <label>Batch</label>
        <select value={batchId} onChange={e => setBatch(e.target.value)}>
          {activeBatches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Nama lengkap</label>
        <input type="text" placeholder="Nama kandidat" value={name}
          onChange={e => setName(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" placeholder="email@domain.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} />
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button className="btn" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !name || !email || !batchId}>
          {loading ? <><div className="spinner"/> Menambahkan...</> : 'Tambah Kandidat'}
        </button>
      </div>
    </Modal>
  );
}

// ── Konfirmasi hapus ──────────────────────────────────
function DeleteModal({ candidate, onClose, onDeleted }) {
  const [loading, setLoad] = useState(false);

  async function handleDelete() {
    setLoad(true);
    try {
      await deleteCandidate(candidate.id);
      onDeleted();
      onClose();
    } catch (e) { alert('Gagal menghapus: ' + e.message); }
    finally { setLoad(false); }
  }

  return (
    <Modal title="Hapus Kandidat" onClose={onClose}>
      <div style={{ background:'#FBE4E4', borderRadius:10, padding:'14px 16px', marginBottom:20, borderLeft:'4px solid #C00000' }}>
        <div style={{ fontWeight:700, fontSize:15, color:'#C00000', marginBottom:4 }}>Tindakan ini tidak dapat dibatalkan</div>
        <div style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>
          Semua data <strong>{candidate.name}</strong> akan dihapus permanen — termasuk semua jawaban, evaluasi AI, skor yang sudah dikonfirmasi, dan interview script.
        </div>
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button className="btn" onClick={onClose}>Batal</button>
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          {loading ? <><div className="spinner"/> Menghapus...</> : '🗑 Hapus Permanen'}
        </button>
      </div>
    </Modal>
  );
}

export default function Dashboard({ batches, candidates, loading, onRefresh, onSelectCandidate }) {
  const [showBatch, setShowBatch]           = useState(false);
  const [showCand, setShowCand]             = useState(false);
  const [deleteTarget, setDeleteTarget]     = useState(null);

  const hires  = candidates.filter(c => c.final_decision === 'hire').length;
  const active = candidates.filter(c => c.status === 'active').length;

  if (loading) return <Spinner text="Memuat dashboard..." />;

  return (
    <div>
      {/* Metrics */}
      <div className="grid-4 mb-3">
        <MetricCard value={batches.length}    label="Total Batch" />
        <MetricCard value={candidates.length} label="Total Kandidat" />
        <MetricCard value={active}            label="Kandidat Aktif" color="#2E75B6" />
        <MetricCard value={hires}             label="Hire" color="#548235" />
      </div>

      <div className="grid-2">
        {/* Batches */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', marginBottom:16 }}>
            <div className="card-title" style={{ margin:0 }}>Batch Rekrutmen</div>
            <button className="btn btn-sm btn-primary" style={{ marginLeft:'auto' }}
              onClick={() => setShowBatch(true)}>+ Batch Baru</button>
          </div>
          {batches.length === 0
            ? <EmptyState
                icon={<path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z M8 11h8M8 15h5"/>}
                title="Belum ada batch" desc="Buat batch pertama untuk mulai rekrutmen" />
            : batches.map(b => (
              <div key={b.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #E5E7EB' }}>
                <div style={{ width:36, height:36, borderRadius:8, background:'#EBF4FA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" strokeWidth="2">
                    <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                  </svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:15, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.name}</div>
                  <div style={{ fontSize:13, color:'#9CA3AF' }}>{new Date(b.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</div>
                </div>
                <StatusBadge status={b.status} />
                <div style={{ fontSize:13, color:'#9CA3AF', whiteSpace:'nowrap' }}>
                  {candidates.filter(c => c.batch_id === b.id).length} kandidat
                </div>
              </div>
            ))}
        </div>

        {/* Candidates */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', marginBottom:16 }}>
            <div className="card-title" style={{ margin:0 }}>Kandidat</div>
            <button className="btn btn-sm btn-primary" style={{ marginLeft:'auto' }}
              onClick={() => batches.filter(b=>b.status==='active').length > 0
                ? setShowCand(true)
                : alert('Buat batch aktif terlebih dahulu.')}>
              + Kandidat
            </button>
          </div>
          {candidates.length === 0
            ? <EmptyState
                icon={<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>}
                title="Belum ada kandidat" desc="Tambahkan kandidat ke batch yang aktif" />
            : candidates.slice(0, 7).map(c => (
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #E5E7EB' }}>
                <Avatar name={c.name} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:15, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize:13, color:'#9CA3AF' }}>Stage {c.current_stage} · {c.email}</div>
                </div>
                <DirectionBadge direction={c.direction} />
                {c.final_decision && <DecisionBadge decision={c.final_decision} />}
                <button className="btn btn-xs btn-blue" onClick={() => onSelectCandidate(c)}>Evaluasi</button>
                <button className="btn btn-xs btn-danger" onClick={() => setDeleteTarget(c)} title="Hapus kandidat"
                  style={{ padding:'4px 8px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))}
          {candidates.length > 7 && (
            <div style={{ textAlign:'center', paddingTop:12, fontSize:13, color:'#9CA3AF' }}>
              +{candidates.length - 7} kandidat lainnya · lihat di tabel bawah
            </div>
          )}
        </div>
      </div>

      {/* Full table */}
      {candidates.length > 0 && (
        <div className="card">
          <div className="card-title">Semua Kandidat</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kandidat</th><th>Batch</th><th>Stage</th>
                  <th>Arah</th><th>Keputusan</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => {
                  const batch = batches.find(b => b.id === c.batch_id);
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <Avatar name={c.name} />
                          <div>
                            <div style={{ fontWeight:700, fontSize:15 }}>{c.name}</div>
                            <div style={{ fontSize:13, color:'#9CA3AF' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize:14 }}>{batch?.name || '—'}</td>
                      <td><span className={`badge-s${c.current_stage}`}>Stage {c.current_stage}</span></td>
                      <td><DirectionBadge direction={c.direction} /></td>
                      <td>{c.final_decision
                        ? <DecisionBadge decision={c.final_decision}/>
                        : <span style={{ color:'#D1D5DB' }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn btn-xs btn-blue" onClick={() => onSelectCandidate(c)}>Evaluasi</button>
                          <button className="btn btn-xs btn-danger" onClick={() => setDeleteTarget(c)}
                            style={{ padding:'4px 10px' }}>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showBatch && <BatchModal onClose={() => setShowBatch(false)} onCreated={onRefresh} />}
      {showCand  && <CandidateModal batches={batches} onClose={() => setShowCand(false)} onCreated={onRefresh} />}
      {deleteTarget && (
        <DeleteModal
          candidate={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={onRefresh}
        />
      )}
    </div>
  );
}
