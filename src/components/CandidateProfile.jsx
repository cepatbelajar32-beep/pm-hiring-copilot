import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { getEvaluations, getProfile, saveProfile, updateFinalDecision, getConsistencyResult } from '../lib/supabase';
import { calcRecommendation, RECOMMENDATION_CONFIG } from '../lib/recommendation';
import { generateCandidateProfile } from '../lib/claude';
import { DirectionBadge, ScoreBadge, Avatar, Spinner, Alert } from './Shared';
import { BANK } from '../data/bank';


// ── UCTooltip ─────────────────────────────────────────
function UCTooltip({ ucId }) {
  const [show, setShow] = React.useState(false);
  const allUCs = [...BANK.stage1, ...BANK.stage2, ...BANK.stage3, ...BANK.stage4];
  const uc = allUCs.find(u => u.id === ucId);
  if (!ucId) return null;
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#2E75B6',
        background: '#EBF4FA', padding: '2px 7px', borderRadius: 4, cursor: 'default',
        borderBottom: '1px dashed #2E75B6' }}>
        {ucId}
      </span>
      {show && uc && (
        <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 4, zIndex: 100,
          background: '#1F2937', color: 'white', fontSize: 12, padding: '5px 10px', borderRadius: 6,
          whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          {uc.title}
          <div style={{ color: '#9CA3AF', fontSize: 11 }}>Klaster {uc.klaster}</div>
        </div>
      )}
    </span>
  );
}

// ── Render teks dengan UC tooltip otomatis ────────────
function TextWithUCTooltips({ text }) {
  if (!text) return null;
  const parts = text.split(/(UC_\d_\d+)/g);
  return (
    <span>
      {parts.map((part, i) =>
        /^UC_\d_\d+$/.test(part)
          ? <UCTooltip key={i} ucId={part} />
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

const MATRIX = {
  hire:         { label: '✓ HIRE — Target Pipeline',      cls: 'matrix-hire' },
  hire_with_dev:{ label: 'HIRE dengan Pengembangan',       cls: 'matrix-hire-dev' },
  caution:      { label: 'Hati-hati — Risiko Grooming',   cls: 'matrix-caution' },
  no:           { label: 'NO — Tidak Direkomendasikan',    cls: 'matrix-no' },
};

export default function CandidateProfile({ candidate, onBack, onRefresh }) {
  const [evals, setEvals]         = useState([]);
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [generating, setGen]      = useState(false);
  const [consistencyResult, setConsistencyResult] = useState(null);
  const [overrideDecision, setOverride] = useState(null); // override penilai
  const [savingDecision, setSaving]     = useState(false);
  const [decisionSaved, setDecisionSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [e, p, cr] = await Promise.all([
          getEvaluations(candidate.id),
          getProfile(candidate.id),
          getConsistencyResult(candidate.id),
        ]);
        setEvals(e || []);
        setProfile(p || null);
        setConsistencyResult(cr || null);
        if (candidate.final_decision) setOverride(candidate.final_decision);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [candidate.id]);

  async function handleSaveDecision() {
    if (!overrideDecision) return;
    setSaving(true);
    try {
      const directionMap = {
        hire: 'pm_fit', hire_with_dev: 'pm_fit',
        caution: 'neutral', no: 'product_lean'
      };
      await updateFinalDecision(candidate.id, directionMap[overrideDecision] || 'neutral', overrideDecision);
      setDecisionSaved(true);
      onRefresh && onRefresh(); // Update Dashboard
      setTimeout(() => setDecisionSaved(false), 3000);
    } catch(e) { alert('Gagal simpan keputusan: ' + e.message); }
    finally { setSaving(false); }
  }

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

  const safeNum = v => parseFloat(v) || 0;

  // Hitung klaster langsung dari evals (sumber kebenaran tunggal — sama dengan Analisis Akhir)
  const klasterScores = { A:[], B:[], C:[], D:[] };
  evals.forEach(e => {
    const allUCs = [...BANK.stage1, ...BANK.stage2, ...BANK.stage3, ...BANK.stage4];
    const uc = allUCs.find(u => u.id === e.uc_id);
    const score = e.final_score || e.ai_score;
    if (uc && score) {
      const klasters = (uc.klaster || '').split('/');
      klasters.forEach(k => { if (klasterScores[k.trim()]) klasterScores[k.trim()].push(Number(score)); });
    }
  });
  const avgKlaster = arr => arr.length ? (arr.reduce((a,b) => a+b,0) / arr.length) : 0;
  const klasterA = avgKlaster(klasterScores.A);
  const klasterB = avgKlaster(klasterScores.B);
  const klasterC = avgKlaster(klasterScores.C);
  const klasterD = avgKlaster(klasterScores.D);

  const radarData = [
    { subject: 'Cognitive (A)',      value: safeNum(klasterA.toFixed(1)), fullMark: 5 },
    { subject: 'Orchestration (B)', value: safeNum(klasterB.toFixed(1)), fullMark: 5 },
    { subject: 'Character (C)',      value: safeNum(klasterC.toFixed(1)), fullMark: 5 },
    { subject: 'Foundational (D)',   value: safeNum(klasterD.toFixed(1)), fullMark: 5 },
  ];

  // Rekomendasi dari logika terpusat — bukan dari AI
  const autoRec = calcRecommendation(evals, BANK, consistencyResult, candidate?.direction);
  const matrix = RECOMMENDATION_CONFIG[autoRec.recommendation];

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
                  { label: 'Cognitive (A)',      val: klasterA.toFixed(1), color: '#2E75B6', desc: 'Pembeda utama' },
                  { label: 'Orchestration (B)', val: klasterB.toFixed(1), color: '#548235', desc: 'Pembeda utama' },
                  { label: 'Character (C)',      val: klasterC.toFixed(1), color: '#BF8F00', desc: 'Groomable' },
                  { label: 'Foundational (D)',   val: klasterD.toFixed(1), color: '#C00000', desc: 'Gerbang wajib' },
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
                    <TextWithUCTooltips text={profile.direction_evidence} />
                  </div>
                )}
              </div>

              <div className="card" style={{ marginBottom: 14 }}>
                <div className="card-title">Rekomendasi Sistem</div>
                <div style={{ background: matrix.bg, border: `2px solid ${matrix.border}`,
                  borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: matrix.color, marginBottom: 4 }}>
                    {matrix.label}
                  </div>
                  <div style={{ fontSize: 13, color: matrix.color }}>{matrix.desc}</div>
                </div>
                {/* Alasan rekomendasi */}
                {autoRec.reasons[autoRec.recommendation].length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {autoRec.reasons[autoRec.recommendation].map((r,i) => (
                      <div key={i} style={{ fontSize: 12, color: '#374151', display:'flex', gap:6, marginBottom:4 }}>
                        <span style={{ color: matrix.color, flexShrink:0 }}>✓</span><span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Warning tambahan — hanya tampil kalau recommendations lebih baik tapi ada hal yang perlu diperhatikan */}
                {autoRec.recommendation === 'hire' && (autoRec.reasons.caution.length > 0 || autoRec.reasons.no.length > 0) && (
                  <div style={{ background:'#FBF3D5', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                    <div style={{ fontSize:11, color:'#633806', fontWeight:600, marginBottom:4 }}>Perlu diperhatikan:</div>
                    {[...autoRec.reasons.caution, ...autoRec.reasons.no].map((r,i) => (
                      <div key={i} style={{ fontSize:12, color:'#633806', display:'flex', gap:6, marginBottom:3 }}>
                        <span style={{ flexShrink:0 }}>△</span><span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
                {autoRec.recommendation === 'hire_with_dev' && autoRec.reasons.no.length > 0 && (
                  <div style={{ background:'#FBE4E4', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                    <div style={{ fontSize:11, color:'#C00000', fontWeight:600, marginBottom:4 }}>Perlu diperhatikan:</div>
                    {autoRec.reasons.no.map((r,i) => (
                      <div key={i} style={{ fontSize:12, color:'#C00000', display:'flex', gap:6, marginBottom:3 }}>
                        <span style={{ flexShrink:0 }}>△</span><span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
                {autoRec.gateFailures.length > 0 && (
                  <div style={{ fontSize:12, color:'#C00000', fontWeight:600, marginBottom:8 }}>
                    ⚠ Gerbang mati: {autoRec.gateFailures.join(', ')} — dapat di-override panel
                  </div>
                )}
                {profile?.ai_recommendation_note && (
                  <div style={{ fontSize: 13, color: '#6B7280', fontStyle:'italic',
                    borderTop:'1px solid #E5E7EB', paddingTop:8, lineHeight:1.6 }}>
                    <strong style={{ fontStyle:'normal', color:'#374151' }}>Narasi AI:</strong>{' '}
                    <TextWithUCTooltips text={profile.ai_recommendation_note} />
                  </div>
                )}
              </div>

              {/* Override keputusan penilai */}
              <div className="card" style={{ marginBottom: 14, border: overrideDecision ? '2px solid #548235' : '1px solid #E5E7EB' }}>
                <div className="card-title">Keputusan Panel</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 1.5 }}>
                  Override rekomendasi AI berdasarkan pertimbangan panel. Keputusan ini akan tampil di Dashboard.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {[
                    { key: 'hire', label: '✓ HIRE', bg: '#E2EFDA', color: '#27500A', border: '#548235' },
                    { key: 'hire_with_dev', label: 'HIRE + Pengembangan', bg: '#EBF4FA', color: '#0C447C', border: '#2E75B6' },
                    { key: 'caution', label: '⚠ Hati-hati', bg: '#FBF3D5', color: '#633806', border: '#BF8F00' },
                    { key: 'no', label: '✗ NO', bg: '#FBE4E4', color: '#791F1F', border: '#C00000' },
                  ].map(opt => {
                    const isLocked = !!(candidate.final_decision || decisionSaved);
                    const isSelected = overrideDecision === opt.key;
                    return (
                      <button key={opt.key}
                        onClick={() => !isLocked && setOverride(opt.key)}
                        disabled={isLocked}
                        style={{
                          padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                          cursor: isLocked ? 'default' : 'pointer', transition: 'all .15s',
                          background: isSelected ? opt.bg : 'var(--color-background-secondary)',
                          color: isSelected ? opt.color : '#9CA3AF',
                          border: isSelected ? `2px solid ${opt.border}` : '1px solid #E5E7EB',
                          opacity: isLocked && !isSelected ? 0.4 : 1,
                        }}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {!decisionSaved && !candidate.final_decision ? (
                    <button className="btn btn-primary" onClick={handleSaveDecision}
                      disabled={!overrideDecision || savingDecision}>
                      {savingDecision ? <><div className="spinner"/> Menyimpan...</> : 'Simpan Keputusan'}
                    </button>
                  ) : (
                    <span style={{ fontSize: 13, color: '#548235', fontWeight: 600,
                      background: '#E2EFDA', padding: '6px 14px', borderRadius: 8, border: '1px solid #548235' }}>
                      ✓ Keputusan sudah dikunci
                    </span>
                  )}
                  {decisionSaved && !candidate.final_decision && (
                    <span style={{ fontSize: 13, color: '#548235', fontWeight: 600 }}>✓ Tersimpan — Dashboard terupdate</span>
                  )}
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#548235', marginBottom: 8 }}>Kekuatan</div>
                    {(profile.strengths || []).map((s, i) => (
                      <div key={i} style={{ fontSize: 14, display: 'flex', gap: 7, marginBottom: 6, lineHeight: 1.5 }}>
                        <span style={{ color: '#548235', flexShrink: 0, fontWeight: 700 }}>✓</span><TextWithUCTooltips text={s} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#C00000', marginBottom: 8 }}>Gap / Perlu Perhatian</div>
                    {(profile.gaps || []).map((g, i) => (
                      <div key={i} style={{ fontSize: 14, display: 'flex', gap: 7, marginBottom: 6, lineHeight: 1.5 }}>
                        <span style={{ color: '#BF8F00', flexShrink: 0, fontWeight: 700 }}>△</span><TextWithUCTooltips text={g} />
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
                      <td><UCTooltip ucId={e.uc_id} /></td>
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
