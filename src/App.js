// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import Evaluasi from './components/Evaluasi';
import BankSoal from './components/BankSoal';
import CandidateProfile from './components/CandidateProfile';
import { getBatches, getCandidates } from './lib/supabase';

// ── Icons ─────────────────────────────────────────────
const Icon = {
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  database: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  robot: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4M8 4h8M6 12h.01M18 12h.01M9 16h6"/><path d="M12 2v2"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  refresh: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
};

// ── Sidebar ───────────────────────────────────────────
function Sidebar({ view, onNav, onRefresh, loading }) {
  const navItems = [
    { key: 'dashboard', icon: Icon.home, label: 'Dashboard' },
    { key: 'bank', icon: Icon.database, label: 'Bank Soal' },
    { key: 'evaluasi', icon: Icon.robot, label: 'Evaluasi AI' },
    { key: 'profile', icon: Icon.user, label: 'Profil Kandidat' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>PM Hiring <span>Co-Pilot</span></h1>
        <p>Junior IT PM · Leadership Track</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Menu</div>
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-item ${view === item.key ? 'active' : ''}`}
              onClick={() => onNav(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Sistem</div>
          <button className="nav-item" onClick={onRefresh} disabled={loading}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: loading ? 0.5 : 1 }}>
              {Icon.refresh}
              {loading ? 'Memuat...' : 'Refresh Data'}
            </span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div>AI sebagai pembantu</div>
        <div style={{ marginTop: 2, color: 'rgba(255,255,255,0.3)' }}>Skor final = keputusan penilai</div>
      </div>
    </aside>
  );
}

// ── Page Header ───────────────────────────────────────
function PageHeader({ view, candidate }) {
  const titles = {
    dashboard: { title: 'Dashboard', desc: 'Kelola batch rekrutmen dan kandidat' },
    bank: { title: 'Bank Soal', desc: '40 UC tersimpan statis — AI tidak generate ulang' },
    evaluasi: { title: 'Evaluasi AI', desc: 'Draft penilaian AI + konfirmasi penilai' },
    profile: { title: 'Profil Kandidat', desc: 'Analisis komprehensif per kandidat' },
  };
  const current = titles[view] || titles.dashboard;

  return (
    <div className="page-header">
      <div>
        <h2>{current.title}{candidate ? ` — ${candidate.name}` : ''}</h2>
        <p>{current.desc}</p>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('dashboard');
  const [batches, setBatches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, c] = await Promise.all([getBatches(), getCandidates()]);
      setBatches(b);
      setCandidates(c);
    } catch (e) {
      setError('Koneksi Supabase gagal. Pastikan schema SQL sudah dijalankan di Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function handleSelectCandidate(c) {
    setSelectedCandidate(c);
    setView('evaluasi');
  }

  function handleNav(newView) {
    setView(newView);
    if (newView !== 'evaluasi' && newView !== 'profile') {
      setSelectedCandidate(null);
    }
  }

  function renderPage() {
    if (error) {
      return (
        <div style={{ padding: 24 }}>
          <div style={{ background: '#FBE4E4', color: '#C00000', padding: 16, borderRadius: 10, borderLeft: '4px solid #C00000' }}>
            <strong>Koneksi gagal</strong><br />
            {error}
          </div>
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            batches={batches}
            candidates={candidates}
            loading={loading}
            onRefresh={loadData}
            onSelectCandidate={handleSelectCandidate}
          />
        );
      case 'bank':
        return <BankSoal />;
      case 'evaluasi':
        return (
          <Evaluasi
            candidate={selectedCandidate}
            candidates={candidates}
            onSelectCandidate={handleSelectCandidate}
            onBack={() => setSelectedCandidate(null)}
          />
        );
      case 'profile':
        return selectedCandidate ? (
          <CandidateProfile
            candidate={selectedCandidate}
            onBack={() => setSelectedCandidate(null)}
          />
        ) : (
          <div>
            <div style={{ marginBottom: 16, color: '#4B5563', fontSize: 13 }}>Pilih kandidat untuk melihat profil:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {candidates.map(c => (
                <div
                  key={c.id}
                  className="card card-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCandidate(c)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EBF4FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0C447C' }}>
                      {c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>Stage {c.current_stage}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`badge badge-s${c.current_stage}`}>Stage {c.current_stage}</span>
                    {c.direction && (
                      <span className={c.direction === 'pm_fit' ? 'dir-pm' : c.direction === 'product_lean' ? 'dir-product' : 'dir-neutral'}>
                        {c.direction === 'pm_fit' ? 'PM-fit' : c.direction === 'product_lean' ? 'Product-lean' : 'Netral'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        onNav={handleNav}
        onRefresh={loadData}
        loading={loading}
      />
      <div className="main-content">
        <PageHeader view={view} candidate={selectedCandidate} />
        <div className="page-body">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
