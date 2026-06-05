import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { getEvaluations, getProfile, saveProfile } from '../lib/supabase';
import { generateCandidateProfile } from '../lib/claude';
import { DirectionBadge, ScoreBadge, Avatar, Spinner, Alert } from './Shared';
import { BANK } from '../data/bank';

const MATRIX = {
  hire:         { label: '✓ HIRE — Target Pipeline',      cls: 'matrix-hire' },
  hire_with_dev:{ label: 'HIRE dengan Pengembangan',       cls: 'matrix-hire-dev' },
  caution:      { label: 'Hati-hati — Risiko Grooming',   cls: 'matrix-caution' },
  no:           { label: 'NO — Tidak Direkomendasikan',    cls: 'matrix-no' },
};

export default function CandidateProfile({ candidate, onBack }) {
  const [evals, setEvals]         = useState([]);
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [generating, setGen]      = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [e, p] = await Promise.all([getEvaluations(candidate.id), getProfile(candidate.id)]);
        setEvals(e || []);
        setProfile(p || null);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [candidate.id]);

  async function handleGenerate() {
    setGen(true);
    try {
      const result = await generateCandidateProfile(candidate, evals, BANK);
      await saveProfile(candidate.id, result);
      setProfile(result);
    } catch (e) { alert('Gagal generate profil: ' + e.message); }
    finally { setGen(false); }
  }

  if (loading) return <Spinner />;

  // Bug fix: pastikan nilai klaster selalu number, fallback 0
  const safeNum = v => parseFloat(v) || 0;

  const radarData = [
    { subject: 'Cognitive (A)',      value: safeNum(profile?.klaster_a), fullMark: 5 },
    { subject: 'Orchestration (B)', value: safeNum(profile?.klaster_b), fullMark: 5 },
    { subject: 'Character (C)',      value: safeNum(profile?.klaster_c), fullMark: 5 },
    { subject: 'Foundational (D)',   value: safeNum(profile?.klaster_d), fullMark: 5 },
  ];

  const matrix = MATRIX[profile?.matrix_position];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <button className="btn btn-sm" onClick={onBack}>← Kembali</button>
        <div className="avatar avatar-lg">{candidate.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{candidate.name}</div>
          <div style={{ fontSize: 14, color: '#9CA3AF' }}>{candidate.email}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <DirectionBadge direction={profile?.direction || candidate.direction} />
        </div>
      </div>

      {!profile ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>📊</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#111827' }}>Profil belum di-generate</h3>
          <p className="text-muted" style={{ marginBottom: 22 }}>
            AI akan menganalisis {evals.length} evaluasi dan membuat profil lengkap kandidat ini.
          </p>
          {evals.length === 0
            ? <Alert type="warn">Belum ada evaluasi. Lakukan evaluasi di menu Evaluasi AI terlebih dahulu.</Alert>
            : <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                {generating ? <><div className="spinner"/> Generating...</> : '✨ Generate Profil Kandidat'}
              </button>}
        </div>
      ) : (
        <>
          <Alert type="info">
            Analisis AI — bukan keputusan final. Semua rekomendasi harus dipertimbangkan bersama oleh panel.
          </Alert>

          <div className="grid-2" style={{ marginBottom: 18 }}>
            {/* Radar */}
            <div className="card">
              <div className="card-title">Profil Kompetensi (Klaster A–D)</div>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#4B5563' }} />
                    <Radar name="Kandidat" dataKey="value" stroke="#2E75B6" fill="#2E75B6" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip formatter={v => [safeNum(v).toFixed(1), 'Skor']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                {[
                  { label: 'Cognitive (A)',      val: profile.klaster_a, color: '#2E75B6', desc: 'Pembeda utama' },
                  { label: 'Orchestration (B)', val: profile.klaster_b, color: '#548235', desc: 'Pembeda utama' },
                  { label: 'Character (C)',      val: profile.klaster_c, color: '#BF8F00', desc: 'Groomable' },
                  { label: 'Foundational (D)',   val: profile.klaster_d, color: '#C00000', desc: 'Gerbang wajib' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 3, fontWeight: 500 }}>{k.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: k.color, letterSpacing: '-0.02em' }}>
                      {safeNum(k.val).toFixed(1)}
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{k.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arah + Matrix + Kekuatan */}
            <div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="card-title">Arah PM-fit</div>
                <div style={{ marginBottom: 10 }}>
                  <DirectionBadge direction={profile.direction} />
                </div>
                {profile.direction_evidence && (
                  <div style={{ fontSize: 14, color: '#4B5563', fontStyle: 'italic', borderLeft: '3px solid #2E75B6', paddingLeft: 12, lineHeight: 1.6 }}>
                    {profile.direction_evidence}
                  </div>
                )}
              </div>

              {matrix && (
                <div className="card" style={{ marginBottom: 14 }}>
                  <div className="card-title">Rekomendasi AI</div>
                  <div className={`matrix-cell ${matrix.cls}`} style={{ marginBottom: 10 }}>{matrix.label}</div>
                  {profile.ai_recommendation_note && (
                    <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>{profile.ai_recommendation_note}</div>
                  )}
                </div>
              )}

              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#548235', marginBottom: 8 }}>Kekuatan</div>
                    {(profile.strengths || []).map((s, i) => (
                      <div key={i} style={{ fontSize: 14, display: 'flex', gap: 7, marginBottom: 6, lineHeight: 1.5 }}>
                        <span style={{ color: '#548235', flexShrink: 0, fontWeight: 700 }}>✓</span><span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#C00000', marginBottom: 8 }}>Gap / Perlu Perhatian</div>
                    {(profile.gaps || []).map((g, i) => (
                      <div key={i} style={{ fontSize: 14, display: 'flex', gap: 7, marginBottom: 6, lineHeight: 1.5 }}>
                        <span style={{ color: '#BF8F00', flexShrink: 0, fontWeight: 700 }}>△</span><span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail tabel */}
          <div className="card">
            <div className="card-title">Detail Evaluasi per UC</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>UC</th><th>Stage</th><th>Skor AI</th><th>Skor Final</th>
                    <th>Arah</th><th>Status</th><th>Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {evals.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontFamily:'DM Mono,monospace', fontSize:13, color:'#2E75B6', fontWeight:700 }}>{e.uc_id}</td>
                      <td><span className={`badge-s${e.stage}`}>Stage {e.stage}</span></td>
                      <td><ScoreBadge score={e.ai_score} /></td>
                      <td>{e.is_confirmed ? <ScoreBadge score={e.final_score} /> : <span className="draft-pill">Draft</span>}</td>
                      <td><DirectionBadge direction={e.ai_direction} /></td>
                      <td>{e.is_confirmed ? <span className="confirmed-pill">Dikonfirmasi</span> : <span className="draft-pill">Menunggu</span>}</td>
                      <td style={{ fontSize:13, color:'#4B5563', maxWidth:220 }}>{e.ai_reasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
            <button className="btn" onClick={handleGenerate} disabled={generating}>
              {generating ? <><div className="spinner"/> Regenerating...</> : '↻ Regenerate Profil'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
