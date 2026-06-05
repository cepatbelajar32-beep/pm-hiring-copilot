import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import Evaluasi from './components/Evaluasi';
import BankSoal from './components/BankSoal';
import CandidateProfile from './components/CandidateProfile';
import Changelog from './components/Changelog';
import { getBatches, getCandidates } from './lib/supabase';

const Icon = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  database: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  robot: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4M8 4h8M6 12h.01M18 12h.01M9 16h6"/><path d="M12 2v2"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  changelog: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
};

function Sidebar({ view, onNav, open, onClose }) {
  const navItems = [
    { key: 'dashboard', icon: Icon.home, label: 'Dashboard' },
    { key: 'bank', icon: Icon.database, label: 'Bank Soal' },
    { key: 'evaluasi', icon: Icon.robot, label: 'Evaluasi AI' },
    { key: 'profile', icon: Icon.user, label: 'Profil Kandidat' },
    { key: 'changelog', icon: Icon.changelog, label: 'Changelog' },
  ];



  function handleNav(key) {
    onNav(key);
    onClose();
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>PM Hiring <span>Co-Pilot</span></h1>
          <p>Junior IT PM · Leadership Track</p>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menu Utama</div>
            {navItems.map(item => (
              <button
                key={item.key}
                className={`nav-item ${view === item.key ? 'active' : ''}`}
                onClick={() => handleNav(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

        </nav>
        <div className="sidebar-footer">
          <div style={{ fontWeight: 600, marginBottom: 2 }}>AI sebagai pembantu</div>
          <div>Skor final = keputusan penilai</div>
        </div>
      </aside>
    </>
  );
}

function PageHeader({ view, candidate, onMenuToggle }) {
  const titles = {
    dashboard: { title: 'Dashboard', desc: 'Kelola batch rekrutmen dan kandidat' },
    bank: { title: 'Bank Soal', desc: '40 UC tersimpan statis — AI tidak generate ulang soal' },
    evaluasi: { title: 'Evaluasi AI', desc: 'Draft penilaian AI + konfirmasi penilai manusia' },
    profile: { title: 'Profil Kandidat', desc: 'Analisis komprehensif berdasarkan semua evaluasi' },
    changelog: { title: 'Changelog', desc: 'Riwayat pembaruan aplikasi dan prinsip arsitektur' },
  };
  const current = titles[view] || titles.dashboard;

  return (
    <div className="page-header">
      <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Buka menu">
        {Icon.menu}
      </button>
      <div>
        <h2>{current.title}{candidate ? ` — ${candidate.name}` : ''}</h2>
        <p>{current.desc}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [batches, setBatches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, c] = await Promise.all([getBatches(), getCandidates()]);
      setBatches(b || []);
      setCandidates(c || []);
    } catch (e) {
      setError('Koneksi Supabase gagal. Pastikan schema SQL sudah dijalankan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function handleSelectCandidate(c) {
    setSelectedCandidate(c);
    setView('evaluasi');
    setSidebarOpen(false);
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
        <div style={{ background: '#FBE4E4', color: '#C00000', padding: 20, borderRadius: 12, borderLeft: '4px solid #C00000', fontSize: 15 }}>
          <strong>Koneksi gagal</strong><br />{error}
        </div>
      );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard batches={batches} candidates={candidates} loading={loading} onRefresh={loadData} onSelectCandidate={handleSelectCandidate} />;
      case 'bank':
        return <BankSoal />;
      case 'evaluasi':
        return <Evaluasi candidate={selectedCandidate} candidates={candidates} onSelectCandidate={handleSelectCandidate} onBack={() => setSelectedCandidate(null)} />;
      case 'profile':
        if (selectedCandidate) {
          return <CandidateProfile candidate={selectedCandidate} onBack={() => setSelectedCandidate(null)} />;
        }
        return (
          <div>
            <p className="text-muted mb-2">Pilih kandidat untuk melihat profil lengkap:</p>
            {candidates.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px 24px', color: '#9CA3AF' }}>
                Belum ada kandidat. Tambahkan dari Dashboard.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {candidates.map(c => (
                  <div key={c.id} className="card card-sm" style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedCandidate(c)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div className="avatar">{c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: '#9CA3AF' }}>{c.email}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      <span className={`badge-s${c.current_stage}`}>Stage {c.current_stage}</span>
                      {c.direction && (
                        <span className={c.direction === 'pm_fit' ? 'dir-pm' : c.direction === 'product_lean' ? 'dir-product' : 'dir-neutral'}>
                          {c.direction === 'pm_fit' ? 'PM-fit' : c.direction === 'product_lean' ? 'Product-lean' : 'Netral'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'changelog':
        return <Changelog />;
      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        onNav={handleNav}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <PageHeader view={view} candidate={selectedCandidate} onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
