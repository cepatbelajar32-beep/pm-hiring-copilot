// src/components/CandidateProfile.jsx
import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { getEvaluations, getProfile, saveProfile } from '../lib/supabase';
import { generateCandidateProfile } from '../lib/claude';
import { DirectionBadge, ScoreBadge, Avatar, Spinner, Alert } from './Shared';
import { BANK } from '../data/bank';

const MATRIX_LABELS = {
  hire: { label: '✓ HIRE — Target Pipeline', cls: 'matrix-hire' },
  hire_with_dev: { label: 'HIRE dengan Pengembangan', cls: 'matrix-hire-dev' },
  caution: { label: 'Hati-hati — Risiko Grooming', cls: 'matrix-caution' },
  no: { label: 'NO', cls: 'matrix-no' },
};

export default function CandidateProfile({ candidate, onBack }) {
  const [evals, setEvals] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [e, p] = await Promise.all([
          getEvaluations(candidate.id),
          getProfile(candidate.id)
        ]);
        setEvals(e);
        setProfile(p);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [candidate.id]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const result = await generateCandidateProfile(candidate, evals, BANK);
      await saveProfile(candidate.id, result);
      setProfile(result);
    } catch (e) {
      alert('Gagal generate profil: ' + e.message);
    } finally { setGenerating(false); }
  }

  if (loading) return <Spinner />;

  const radarData = [
    { subject: 'Cognitive (A)', value: profile?.klaster_a || 0, fullMark: 5 },
    { subject: 'Orchestration (B)', value: profile?.klaster_b || 0, fullMark: 5 },
    { subject: 'Character (C)', value: profile?.klaster_c || 0, fullMark: 5 },
    { subject: 'Foundational (D)', value: profile?.klaster_d || 0, fullMark: 5 },
  ];

  const matrix = profile?.matrix_position ? MATRIX_LABELS[profile.matrix_position] : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-sm" onClick={onBack}>← Kembali</button>
        <Avatar name={candidate.name} size="lg" />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{candidate.name}</div>
          <div className="text-muted">{candidate.email}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <DirectionBadge direction={profile?.direction || candidate.direction} />
        </div>
      </div>

      {!profile ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <h3 style={{ marginBottom: 8 }}>Profil belum di-generate</h3>
          <p className="text-muted" style={{ marginBottom: 20 }}>
            AI akan menganalisis semua {evals.length} evaluasi dan membuat profil kandidat lengkap.
          </p>
          {evals.length === 0 ? (
            <Alert type="warn">Belum ada evaluasi untuk kandidat ini. Lakukan evaluasi di menu Evaluasi AI terlebih dahulu.</Alert>
          ) : (
            <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
              {generating ? <><div className="spinner" /> Generating...</> : '✨ Generate Profil Kandidat'}
            </button>
          )}
        </div>
      ) : (
        <>
          <Alert type="info">
            Ini adalah analisis AI — bukan keputusan final. Semua rekomendasi harus dipertimbangkan bersama konteks oleh panel.
          </Alert>

          <div className="grid-2" style={{ marginBottom: 16 }}>
            {/* Radar Chart */}
            <div className="card">
              <div className="card-title">Profil Klaster</div>
              <div className="radar-container" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#4B5563' }} />
                    <Radar name="Kandidat" dataKey="value" stroke="#2E75B6" fill="#2E75B6" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip formatter={(val) => [val.toFixed(1), 'Skor']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                {[
                  { label: 'Cognitive (A)', val: profile.klaster_a, color: '#2E75B6', desc: 'Pembeda utama' },
                  { label: 'Orchestration (B)', val: profile.klaster_b, color: '#548235', desc: 'Pembeda utama' },
                  { label: 'Character (C)', val: profile.klaster_c, color: '#BF8F00', desc: 'Groomable' },
                  { label: 'Foundational (D)', val: profile.klaster_d, color: '#C00000', desc: 'Gerbang wajib' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>{k.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: k.color }}>{k.val?.toFixed(1) || '—'}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{k.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direction + Matrix */}
            <div>
              <div className="card" style={{ marginBottom: 12 }}>
                <div className="card-title">Arah PM-fit</div>
                <div style={{ marginBottom: 8 }}>
                  <DirectionBadge direction={profile.direction} />
                </div>
                {profile.direction_evidence && (
                  <div style={{ fontSize: 13, color: '#4B5563', fontStyle: 'italic', borderLeft: '3px solid #2E75B6', paddingLeft: 10 }}>
                    {profile.direction_evidence}
                  </div>
                )}
              </div>

              {matrix && (
                <div className="card" style={{ marginBottom: 12 }}>
                  <div className="card-title">Rekomendasi AI (bukan keputusan final)</div>
                  <div className={`matrix-cell ${matrix.cls}`} style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                    {matrix.label}
                  </div>
                  {profile.ai_recommendation_note && (
                    <div style={{ fontSize: 13, color: '#4B5563' }}>{profile.ai_recommendation_note}</div>
                  )}
                </div>
              )}

              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#548235', marginBottom: 6 }}>Kekuatan</div>
                    {(profile.strengths || []).map((s, i) => (
                      <div key={i} style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
                        <span style={{ color: '#548235', flexShrink: 0 }}>✓</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#C00000', marginBottom: 6 }}>Gap / Perlu Perhatian</div>
                    {(profile.gaps || []).map((g, i) => (
                      <div key={i} style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
                        <span style={{ color: '#BF8F00', flexShrink: 0 }}>△</span>
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluasi Detail */}
          <div className="card">
            <div className="card-title">Detail Evaluasi per UC</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>UC</th>
                    <th>Stage</th>
                    <th>Skor AI</th>
                    <th>Skor Final</th>
                    <th>Arah</th>
                    <th>Status</th>
                    <th>Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {evals.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#2E75B6', fontWeight: 600 }}>{e.uc_id}</td>
                      <td><span className={`badge badge-s${e.stage}`}>Stage {e.stage}</span></td>
                      <td><ScoreBadge score={e.ai_score} /></td>
                      <td>
                        {e.is_confirmed
                          ? <ScoreBadge score={e.final_score} />
                          : <span className="draft-pill">Draft</span>}
                      </td>
                      <td><DirectionBadge direction={e.ai_direction} /></td>
                      <td>
                        {e.is_confirmed
                          ? <span className="confirmed-pill">Dikonfirmasi</span>
                          : <span className="draft-pill">Menunggu</span>}
                      </td>
                      <td style={{ fontSize: 12, color: '#4B5563', maxWidth: 200 }}>{e.ai_reasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn" onClick={handleGenerate} disabled={generating}>
              {generating ? <><div className="spinner" /> Regenerating...</> : '↻ Regenerate Profil'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
