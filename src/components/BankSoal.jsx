// src/components/BankSoal.jsx
import React, { useState } from 'react';
import { BANK, ACTIVE_INDEX } from '../data/bank';

const STAGE_LABELS = { 1: 'Stage 1 — Aplikasi', 2: 'Stage 2 — SJT', 3: 'Stage 3 — Case Study', 4: 'Stage 4 — Panel' };
const STAGE_ACTIVE = { 1: 5, 2: 7, 3: '1 + refleksi', 4: 7 };

export default function BankSoal() {
  const [activeStage, setActiveStage] = useState(1);
  const [expandedUC, setExpandedUC] = useState(null);

  const banks = [BANK.stage1, BANK.stage2, BANK.stage3, BANK.stage4];
  const currentBank = banks[activeStage - 1];
  const activeIdx = activeStage === 3
    ? [0, 9]
    : ACTIVE_INDEX[`stage${activeStage}`];

  return (
    <div>
      <div style={{ background: '#EBF4FA', borderRadius: 10, padding: '14px 16px', marginBottom: 20, borderLeft: '4px solid #2E75B6' }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#0C447C', marginBottom: 4 }}>
          Bank soal statis — 40 UC total
        </div>
        <div style={{ fontSize: 13, color: '#1F3864' }}>
          AI tidak men-generate ulang soal. Seluruh 40 UC tersimpan permanen sebagai data statis. 
          Rotasi dilakukan per batch — per batch, subset aktif dipilih dari bank ini.
        </div>
      </div>

      {/* Stage summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className="metric-card"
            style={{ cursor: 'pointer', borderBottom: activeStage === s ? '3px solid #2E75B6' : '3px solid transparent', transition: 'all 0.15s' }}
            onClick={() => setActiveStage(s)}
          >
            <div className="metric-val" style={{ fontSize: 22, color: activeStage === s ? '#2E75B6' : undefined }}>
              {banks[s - 1].length}
            </div>
            <div className="metric-label">Stage {s}</div>
            <div className="metric-sub">{STAGE_ACTIVE[s]} aktif/batch</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[1, 2, 3, 4].map(s => (
          <button key={s} className={`tab-btn ${activeStage === s ? 'active' : ''}`} onClick={() => setActiveStage(s)}>
            {STAGE_LABELS[s]} ({banks[s - 1].length} UC)
          </button>
        ))}
      </div>

      {/* UC List */}
      {currentBank.map((uc, i) => {
        const isActive = activeIdx.includes(i);
        const isExpanded = expandedUC === uc.id;

        return (
          <div
            key={uc.id}
            className="uc-card"
            style={{
              opacity: isActive ? 1 : 0.6,
              borderLeft: `3px solid ${isActive ? '#2E75B6' : '#E5E7EB'}`,
              cursor: 'pointer',
            }}
            onClick={() => setExpandedUC(isExpanded ? null : uc.id)}
          >
            <div className="uc-header">
              <span className="uc-code">{uc.id}</span>
              <span className="uc-title">{uc.title}</span>
              <span className="badge badge-blue" style={{ marginLeft: 4 }}>Klaster {uc.klaster}</span>
              {uc.mechanism && <span className="badge badge-purple">{uc.mechanism}</span>}
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: isActive ? '#E2EFDA' : '#F3F4F6',
                  color: isActive ? '#548235' : '#9CA3AF',
                }}
              >
                {isActive ? '● Aktif batch ini' : '○ Cadangan'}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: isExpanded ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0 }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginBottom: isExpanded ? 0 : 0 }}>
              "{uc.prompt.split('\n')[0].slice(0, 100)}{uc.prompt.length > 100 ? '...' : ''}"
            </div>

            {isExpanded && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#4B5563', marginBottom: 6 }}>Prompt lengkap:</div>
                <div className="uc-prompt">{uc.prompt}</div>

                {uc.trap && (
                  <div className="uc-trap">
                    <strong>Trap clause:</strong> {uc.trap}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                  <div style={{ background: '#E2EFDA', borderRadius: 8, padding: '10px 12px', fontSize: 13 }}>
                    <strong style={{ color: '#548235', display: 'block', marginBottom: 4 }}>Yang dicari (Skor 5):</strong>
                    <span style={{ color: '#374151' }}>{uc.cari}</span>
                  </div>
                  <div style={{ background: '#FBE4E4', borderRadius: 8, padding: '10px 12px', fontSize: 13 }}>
                    <strong style={{ color: '#C00000', display: 'block', marginBottom: 4 }}>Yang diwaspadai (Skor 1):</strong>
                    <span style={{ color: '#374151' }}>{uc.waspadai}</span>
                  </div>
                </div>

                {uc.signal && (
                  <div style={{ background: '#EBF4FA', borderRadius: 8, padding: '10px 12px', marginTop: 10, fontSize: 13 }}>
                    <strong style={{ color: '#2E75B6', display: 'block', marginBottom: 4 }}>Sinyal PM vs Product:</strong>
                    <span style={{ color: '#374151' }}>{uc.signal}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
