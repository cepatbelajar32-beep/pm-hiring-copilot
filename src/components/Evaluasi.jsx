import React, { useState, useEffect, useCallback } from 'react';
import { ScoreBadge, DirectionBadge, Avatar, Spinner, FlagBadge, Alert } from './Shared';
import {
  getAnswers, getEvaluations, saveAnswer, saveEvaluation,
  confirmEvaluationByUC, updateCandidateStage, saveInterviewScript, getLatestScript,
  saveConsistencyResult, getConsistencyResult, updateFinalDecision, getCandidateById,
  saveStage4UCs, getStage4UCs
} from '../lib/supabase';
import { evaluateAnswer, generateInterviewScript, analyzeConsistency } from '../lib/claude';
import { getActiveUCs, getActiveUCsFromBatch, BANK } from '../data/bank';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

// ── Tooltip istilah IT ────────────────────────────────
const GLOSSARY = {
  'UC_3_10': 'Wajib di semua varian Stage 3',
};

// ── CalibrationWarning ────────────────────────────────
const WARNING_STYLES = {
  context:  { bg:'#EBF4FA', border:'#2E75B6', icon:'⚠', label_color:'#0C447C', text_color:'#1F3864' },
  scale:    { bg:'#FBF3D5', border:'#BF8F00', icon:'📏', label_color:'#633806', text_color:'#4B3500' },
  score3ok: { bg:'#E2EFDA', border:'#548235', icon:'✓', label_color:'#27500A', text_color:'#1F3A0A' },
  delivery: { bg:'#EEEDFE', border:'#534AB7', icon:'🎯', label_color:'#3C3489', text_color:'#26215C' },
};
function CalibrationWarning({ w }) {
  const style = WARNING_STYLES[w.type] || WARNING_STYLES.context;
  return (
    <div style={{ background:style.bg, border:`1px solid ${style.border}`, borderLeft:`4px solid ${style.border}`,
      borderRadius:8, padding:'10px 14px', marginTop:10, marginBottom:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
        <span style={{ fontSize:14 }}>{style.icon}</span>
        <span style={{ fontSize:11, fontWeight:800, color:style.label_color, textTransform:'uppercase', letterSpacing:'0.07em' }}>
          Kalibrasi Penilai — {w.label}
        </span>
      </div>
      <div style={{ fontSize:13, color:style.text_color, lineHeight:1.6 }}>{w.text}</div>
    </div>
  );
}

// ── UCTooltip — hover untuk lihat nama UC ────────────
function UCTooltip({ ucId }) {
  const [show, setShow] = useState(false);
  const allUCs = [...BANK.stage1, ...BANK.stage2, ...BANK.stage3, ...BANK.stage4];
  const uc = allUCs.find(u => u.id === ucId);
  return (
    <span style={{ position:'relative', display:'inline-block' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:'#2E75B6',
        background:'#EBF4FA', padding:'2px 7px', borderRadius:4, cursor:'default', borderBottom:'1px dashed #2E75B6' }}>
        {ucId}
      </span>
      {show && uc && (
        <div style={{ position:'absolute', bottom:'100%', left:0, marginBottom:4, zIndex:100,
          background:'#1F2937', color:'white', fontSize:12, padding:'5px 10px', borderRadius:6,
          whiteSpace:'nowrap', pointerEvents:'none', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
          {uc.title}
          <div style={{ color:'#9CA3AF', fontSize:11 }}>Klaster {uc.klaster}</div>
        </div>
      )}
    </span>
  );
}

// ── UCCard ────────────────────────────────────────────
function UCCard({ uc, stage, candidateId, existingAnswer, existingEval, onEvalSaved, onAIStart, onAIDone }) {
  const [answer, setAnswer]           = useState('');
  const [aiDraft, setAiDraft]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [confirming, setConfirming]   = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved]   = useState(false);
  const [overrideScore, setOverride]  = useState(null);
  const [reviewerNote, setNote]       = useState('');
  const [confirmed, setConfirmed]     = useState(false);

  useEffect(() => {
    if (existingAnswer?.answer_text) setAnswer(existingAnswer.answer_text);
    if (existingEval) {
      setAiDraft(existingEval);
      setConfirmed(existingEval.is_confirmed || false);
      if (existingEval.reviewer_note) setNote(existingEval.reviewer_note);
      if (existingEval.final_score) setOverride(existingEval.final_score);
    }
  }, [existingEval?.id, existingAnswer?.id]);

  useEffect(() => {
    if (draftSaved) {
      const t = setTimeout(() => setDraftSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [draftSaved]);

  async function handleEvaluate() {
    if (!answer.trim()) { alert('Isi jawaban kandidat terlebih dahulu.'); return; }
    setLoading(true);
    onAIStart && onAIStart();
    try {
      const savedAnswer = await saveAnswer(candidateId, stage, uc.id, answer);
      const result = await evaluateAnswer(uc, answer);
      await saveEvaluation(savedAnswer.id, candidateId, uc.id, stage, result);
      setAiDraft({ ...result, ai_score:result.score, ai_reasoning:result.reasoning,
        ai_evidence:result.evidence, ai_direction:result.direction, ai_flag:result.flag });
      setOverride(result.score);
      setConfirmed(false);
    } catch(e) { alert('Evaluasi gagal: ' + e.message); }
    finally { setLoading(false); onAIDone && onAIDone(); }
  }

  async function handleSaveDraft() {
    if (!aiDraft) { alert('Lakukan evaluasi AI terlebih dahulu.'); return; }
    const scoreToSave = overrideScore || aiDraft.ai_score || aiDraft.score;
    setSavingDraft(true);
    try {
      if (answer.trim()) await saveAnswer(candidateId, stage, uc.id, answer);
      const { supabase } = await import('../lib/supabase');
      await supabase.from('evaluations').update({ final_score: Number(scoreToSave), reviewer_note: reviewerNote })
        .eq('candidate_id', candidateId).eq('uc_id', uc.id);
      setDraftSaved(true);
    } catch(e) { alert('Gagal simpan draft: ' + e.message); }
    finally { setSavingDraft(false); }
  }

  async function handleConfirm() {
    if (!aiDraft) return;
    const scoreToSave = overrideScore || aiDraft.ai_score || aiDraft.score;
    setConfirming(true);
    try {
      await confirmEvaluationByUC(candidateId, uc.id, Number(scoreToSave), reviewerNote, 'Panel');
      setConfirmed(true);
      setAiDraft(prev => ({ ...prev, final_score:Number(scoreToSave), is_confirmed:true }));
      onEvalSaved && onEvalSaved();
    } catch(e) { alert('Konfirmasi gagal: ' + e.message); }
    finally { setConfirming(false); }
  }

  const aiScore = aiDraft?.ai_score || aiDraft?.score;
  const currentDisplayScore = overrideScore || aiScore || 3;

  return (
    <div className="uc-card uc-active">
      <div className="uc-header">
        <span className="uc-code">{uc.id}</span>
        <span className="uc-title">{uc.title}</span>
        {uc.mechanism && <span className="badge badge-purple">{uc.mechanism}</span>}
        <span className="badge badge-blue">Klaster {uc.klaster}</span>
        {uc.id === 'UC_3_10' && <span className="badge badge-amber">Wajib</span>}
        {confirmed && <span className="confirmed-pill" style={{ marginLeft:'auto' }}>✓ Dikonfirmasi — Skor {aiDraft?.final_score}</span>}
      </div>

      {uc.context_note && (
        <div style={{ background:'#F0F9FF', border:'1px solid #BAE6FD', borderLeft:'4px solid #0EA5E9',
          borderRadius:8, padding:'10px 14px', marginBottom:10, fontSize:13, color:'#0C4A6E', lineHeight:1.65 }}>
          <div style={{ fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, color:'#0369A1' }}>
            📋 Konteks untuk kandidat
          </div>
          {uc.context_note}
        </div>
      )}

      <div className="uc-prompt">{uc.prompt}</div>

      {uc.trap && <div className="uc-trap"><strong>Situasi tersembunyi (untuk penilai):</strong> {uc.trap}</div>}

      <div className="uc-meta">
        <span className="uc-cari"><strong>Cari:</strong> {uc.cari}</span>
        <span className="uc-waspadai"><strong>Waspadai:</strong> {uc.waspadai}</span>
        {uc.signal && <span style={{ color:'#2E75B6' }}><strong>Sinyal:</strong> {uc.signal}</span>}
      </div>

      {uc.calibration_warning && <CalibrationWarning w={uc.calibration_warning} />}

      <div className="field" style={{ marginTop:14 }}>
        <label>Jawaban kandidat</label>
        <textarea value={answer} onChange={e => setAnswer(e.target.value)}
          placeholder="Paste atau ketik jawaban kandidat di sini..." rows={5} disabled={confirmed} />
      </div>

      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
        <button className="btn btn-blue btn-sm" onClick={handleEvaluate}
          disabled={loading || confirmed || !answer.trim()}>
          {loading ? <><div className="spinner"/> Mengevaluasi...</> : '🤖 Evaluasi dengan AI'}
        </button>
        {aiDraft && !confirmed && <span className="draft-pill">Draft AI — belum dikonfirmasi</span>}
      </div>

      {aiDraft && (
        <div className="ai-draft">
          <div className="ai-draft-header">
            <span className="ai-draft-label">Draft AI</span>
            <ScoreBadge score={aiScore} />
            <DirectionBadge direction={aiDraft.ai_direction || aiDraft.direction} />
            <FlagBadge flag={aiDraft.ai_flag || aiDraft.flag} />
          </div>
          <div className="ai-reasoning"><strong>Reasoning:</strong> {aiDraft.ai_reasoning || aiDraft.reasoning}</div>
          <div className="ai-evidence"><strong>Evidence:</strong> "{aiDraft.ai_evidence || aiDraft.evidence}"</div>
          {aiDraft.flag_note && <div className="ai-flag-note"><strong>Catatan panel:</strong> {aiDraft.flag_note}</div>}

          {(aiDraft.individuality_note) && (
            <div style={{ background:'#EBF4FA', border:'1px solid #2E75B6', borderLeft:'3px solid #2E75B6',
              borderRadius:8, padding:'10px 14px', marginTop:8, fontSize:13, color:'#1F3864' }}>
              <strong>👥 Pola penggunaan "kami":</strong> {aiDraft.individuality_note}
            </div>
          )}
          {aiDraft.authenticity_flag && (
            <div style={{ background:'#FBF3D5', border:'1px solid #BF8F00', borderLeft:'3px solid #BF8F00',
              borderRadius:8, padding:'10px 14px', marginTop:8, fontSize:13, color:'#4B3500' }}>
              <strong>
                {aiDraft.authenticity_flag === 'possible_ai_generated' ? '🤖 Kemungkinan ditulis AI:' :
                 aiDraft.authenticity_flag === 'possible_exaggeration' ? '📢 Kemungkinan dibesar-besarkan:' :
                 '⚠ Detail tidak konsisten:'}
              </strong>{' '}{aiDraft.authenticity_note}
            </div>
          )}

          {!confirmed && (
            <div style={{ marginTop:14, padding:'16px 18px', background:'white', borderRadius:10, border:'1px solid #E5E7EB' }}>
              <div style={{ fontSize:12, fontWeight:800, color:'#374151', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                Penilaian Penilai
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'12px 16px', alignItems:'start', marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:'#4B5563', marginBottom:6, display:'block' }}>Skor final:</label>
                  <select value={currentDisplayScore} onChange={e => setOverride(parseInt(e.target.value, 10))}
                    style={{ padding:'9px 12px', fontSize:14, borderRadius:8, border:'1px solid #D1D5DB', fontFamily:'inherit', background:'white', color:'#111827', cursor:'pointer' }}>
                    <option value={1}>1 — Sinyal mengkhawatirkan</option>
                    <option value={3}>3 — Rata-rata fresh grad</option>
                    <option value={5}>5 — Calon Senior PM</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:'#4B5563', marginBottom:6, display:'block' }}>Catatan penilai:</label>
                  <textarea value={reviewerNote} onChange={e => setNote(e.target.value)}
                    placeholder="Alasan override, observasi, atau hal yang perlu digali..." rows={3}
                    style={{ padding:'9px 12px', fontSize:14, borderRadius:8, border:'1px solid #D1D5DB', width:'100%', fontFamily:'inherit', resize:'vertical', lineHeight:1.55 }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                <button className="btn btn-sm" onClick={handleSaveDraft} disabled={savingDraft} style={{ borderColor:'#D1D5DB' }}>
                  {savingDraft ? <><div className="spinner"/> Menyimpan...</> : '💾 Simpan Draft'}
                </button>
                {draftSaved && (
                  <span style={{ fontSize:13, color:'#548235', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    Draft tersimpan
                  </span>
                )}
                <button className="btn btn-green" onClick={handleConfirm} disabled={confirming} style={{ marginLeft:'auto' }}>
                  {confirming ? <><div className="spinner"/> Mengonfirmasi...</> : '✓ Konfirmasi Skor Final'}
                </button>
              </div>
              <div style={{ fontSize:12, color:'#9CA3AF', marginTop:10, lineHeight:1.5 }}>
                <strong>Simpan Draft</strong> = bisa diubah lagi. <strong>Konfirmasi Skor Final</strong> = dikunci permanen.
              </div>
            </div>
          )}

          {confirmed && aiDraft.reviewer_note && (
            <div style={{ marginTop:12, padding:'10px 14px', background:'#E2EFDA', borderRadius:8, fontSize:14, color:'#374151' }}>
              <strong style={{ color:'#548235' }}>Catatan penilai:</strong> {aiDraft.reviewer_note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Persiapan Panel (Generate Script) ────────────────
function PersiapanPanel({ candidate, batch, evals, script, onScriptGenerated, onAIStart, onAIDone }) {
  const [loading, setLoading]   = useState(false);

  async function handleGenerate() {
    if (evals.length === 0) { alert('Evaluasi minimal 1 UC terlebih dahulu.'); return; }
    setLoading(true);
    onAIStart && onAIStart();
    try {
      const result = await generateInterviewScript(candidate, evals, BANK.stage4);
      console.log('Generate script result:', result);

      if (!result || !result.selected_ucs || !Array.isArray(result.selected_ucs)) {
        throw new Error('Format response tidak valid — selected_ucs tidak ditemukan: ' + JSON.stringify(result));
      }
      if (!result.questions || !Array.isArray(result.questions)) {
        throw new Error('Format response tidak valid — questions tidak ditemukan');
      }

      // Simpan UC terpilih ke kandidat di Supabase
      await saveStage4UCs(candidate.id, result.selected_ucs);
      // Simpan ke Supabase (non-fatal)
      try {
        await saveInterviewScript(candidate.id, result);
      } catch(saveErr) {
        console.warn('saveInterviewScript gagal:', saveErr.message);
      }
      onScriptGenerated && onScriptGenerated(result.selected_ucs, result);
    } catch(e) {
      console.error('Generate script error:', e);
      alert('Gagal generate script: ' + e.message);
    }
    finally { setLoading(false); onAIDone && onAIDone(); }
  }

  return (
    <div>
      <div className="card" style={{ borderColor:'#2E75B6', borderWidth:2, marginBottom:16 }}>
        <div className="card-title" style={{ color:'#2E75B6' }}>Generate Interview Script Stage 4</div>
        <Alert type="info">
          AI menganalisis semua evaluasi Stage 1–3 dan merekomendasikan 7 UC Stage 4 yang paling relevan,
          beserta probe yang dipersonalisasi berdasarkan gap yang terdeteksi.
          UC yang dipilih akan menjadi soal aktif Stage 4 untuk kandidat ini.
        </Alert>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:12, flexWrap:'wrap' }}>
          <button className="btn btn-blue" onClick={handleGenerate} disabled={loading}>
            {loading ? <><div className="spinner"/> Generating...</> : '✨ Generate Script Stage 4'}
          </button>
          <span style={{ fontSize:13, color:'#9CA3AF' }}>
            Kalau tidak di-generate, Stage 4 akan menggunakan 7 UC default dari rotation set batch ini.
          </span>
        </div>

        {script && (
          <>
            <div className="divider" />
            <Alert type="success">Script berhasil di-generate — UC Stage 4 sudah disesuaikan untuk kandidat ini.</Alert>
            <div style={{ fontSize:14, marginBottom:14, color:'#374151' }}>
              <strong>Rationale:</strong> {script.rationale}
            </div>
            {(script.questions || []).map(q => {
              const uc = BANK.stage4.find(u => u.id === q.uc_id);
              return (
                <div key={q.uc_id} style={{ padding:'12px 14px', border:'1px solid #E5E7EB', borderRadius:10,
                  marginBottom:10, borderLeft:'4px solid #2E75B6', background:'#FAFAFA' }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                    <span className="uc-code">{q.uc_id}</span>
                    <span style={{ fontSize:14, fontWeight:700 }}>{uc?.title || ''}</span>
                  </div>
                  <div style={{ fontSize:14, color:'#2E75B6', fontStyle:'italic' }}>Probe: {q.custom_probe}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ── Analisis Akhir ────────────────────────────────────
function AnalisisAkhir({ candidate, answers, evals, savedConsistency, onConsistencyDone, onAIStart, onAIDone }) {
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(savedConsistency || null);
  const [error, setError]         = useState(null);
  const [sections, setSections]   = useState({
    ringkasan: true, konsistensi: false, keaslian: false,
    individuality: false, catatan: false
  });

  const safeNum = v => parseFloat(v) || 0;

  // Hitung ringkasan dari evals
  const klasterScores = { A:[], B:[], C:[], D:[] };
  evals.forEach(e => {
    const allUCs = [...BANK.stage1,...BANK.stage2,...BANK.stage3,...BANK.stage4];
    const uc = allUCs.find(u => u.id === e.uc_id);
    const score = e.final_score || e.ai_score;
    if (uc && score) {
      const klasters = (uc.klaster || '').split('/');
      klasters.forEach(k => { if (klasterScores[k.trim()]) klasterScores[k.trim()].push(score); });
    }
  });
  const avg = arr => arr.length ? (arr.reduce((a,b) => a+b, 0) / arr.length).toFixed(1) : '—';

  const radarData = [
    { subject:'Cognitive (A)',      value: safeNum(avg(klasterScores.A)), fullMark:5 },
    { subject:'Orchestration (B)', value: safeNum(avg(klasterScores.B)), fullMark:5 },
    { subject:'Character (C)',      value: safeNum(avg(klasterScores.C)), fullMark:5 },
    { subject:'Foundational (D)',   value: safeNum(avg(klasterScores.D)), fullMark:5 },
  ];

  // Kumpulkan flags per UC
  const authFlags = evals.filter(e => e.authenticity_flag);
  const indivNotes = evals.filter(e => e.individuality_note);
  const reviewerNotes = evals.filter(e => e.reviewer_note);

  function toggleSection(key) {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleReview() {
    if (answers.length < 4) { alert('Perlu jawaban dari minimal semua stage untuk analisis konsistensi.'); return; }
    setLoading(true);
    onAIStart && onAIStart();
    setError(null);
    try {
      const res = await analyzeConsistency(candidate, answers, evals);
      setResult(res);
      setSections(prev => ({ ...prev, konsistensi: true }));
      onConsistencyDone && onConsistencyDone(res);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); onAIDone && onAIDone(); }
  }

  const consistencyColor = {
    tinggi: { bg:'#E2EFDA', color:'#548235', border:'#548235' },
    sedang: { bg:'#FBF3D5', color:'#BF8F00', border:'#BF8F00' },
    rendah: { bg:'#FBE4E4', color:'#C00000', border:'#C00000' },
  };

  function SectionHeader({ title, skey, badge }) {
    return (
      <div onClick={() => toggleSection(skey)} style={{ display:'flex', alignItems:'center', gap:10,
        padding:'12px 16px', background:sections[skey] ? '#F0F9FF' : 'var(--lgrey,#F5F5F5)',
        borderRadius:sections[skey] ? '10px 10px 0 0' : 10, cursor:'pointer', marginBottom: sections[skey] ? 0 : 2,
        border:'1px solid #E5E7EB', borderBottom: sections[skey] ? 'none' : '1px solid #E5E7EB' }}>
        <span style={{ fontSize:15, fontWeight:700, color:'#111827', flex:1 }}>{title}</span>
        {badge && <span style={{ fontSize:11, background:'#EBF4FA', color:'#0C447C', padding:'2px 8px', borderRadius:20, fontWeight:600 }}>{badge}</span>}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
          style={{ transform: sections[skey] ? 'rotate(180deg)' : '', transition:'transform .2s', flexShrink:0 }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    );
  }

  function SectionBody({ skey, children }) {
    if (!sections[skey]) return null;
    return (
      <div style={{ border:'1px solid #E5E7EB', borderTop:'none', borderRadius:'0 0 10px 10px',
        padding:'16px', marginBottom:12 }}>
        {children}
      </div>
    );
  }

  const stagesWithAnswers = [...new Set(answers.map(a => a.stage))];
  const hasAllStages = stagesWithAnswers.length >= 4;

  return (
    <div>
      <Alert type="info">
        Panel analisis komprehensif — berisi semua sinyal dari seluruh proses evaluasi Stage 1–4.
        Gunakan sebagai dasar keputusan hire/no hire.
      </Alert>

      {/* 1. Ringkasan Skor */}
      <SectionHeader title="Ringkasan Skor" skey="ringkasan" badge={`${evals.filter(e=>e.is_confirmed).length} UC dikonfirmasi`} />
      <SectionBody skey="ringkasan">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* Radar */}
          <div>
            <div style={{ height:220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize:12, fill:'#4B5563' }} />
                  <Radar name="Kandidat" dataKey="value" stroke="#2E75B6" fill="#2E75B6" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip formatter={v => [safeNum(v).toFixed(1), 'Skor']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Klaster detail */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, alignContent:'start' }}>
            {[
              { label:'Cognitive (A)',      val:avg(klasterScores.A), color:'#2E75B6', desc:'Pembeda utama' },
              { label:'Orchestration (B)', val:avg(klasterScores.B), color:'#548235', desc:'Pembeda utama' },
              { label:'Character (C)',      val:avg(klasterScores.C), color:'#BF8F00', desc:'Groomable' },
              { label:'Foundational (D)',   val:avg(klasterScores.D), color:'#C00000', desc:'Gerbang wajib' },
            ].map(k => (
              <div key={k.label} style={{ background:'#F9FAFB', borderRadius:10, padding:'10px 12px' }}>
                <div style={{ fontSize:12, color:'#6B7280', marginBottom:3, fontWeight:500 }}>{k.label}</div>
                <div style={{ fontSize:28, fontWeight:800, color:k.color, letterSpacing:'-0.02em' }}>{k.val}</div>
                <div style={{ fontSize:11, color:'#9CA3AF' }}>{k.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribusi skor */}
        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:8 }}>Distribusi skor per stage:</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[1,2,3,4].map(s => {
              const stageEvals = evals.filter(e => e.stage === s);
              const s1 = stageEvals.filter(e=>(e.final_score||e.ai_score)===1).length;
              const s3 = stageEvals.filter(e=>(e.final_score||e.ai_score)===3).length;
              const s5 = stageEvals.filter(e=>(e.final_score||e.ai_score)===5).length;
              return (
                <div key={s} style={{ background:'#F9FAFB', borderRadius:8, padding:'10px 12px', fontSize:13 }}>
                  <div style={{ fontWeight:600, marginBottom:6 }}>Stage {s}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <span style={{ background:'#FBE4E4', color:'#C00000', padding:'2px 6px', borderRadius:4, fontSize:12, fontWeight:600 }}>{s1}×1</span>
                    <span style={{ background:'#FBF3D5', color:'#BF8F00', padding:'2px 6px', borderRadius:4, fontSize:12, fontWeight:600 }}>{s3}×3</span>
                    <span style={{ background:'#E2EFDA', color:'#548235', padding:'2px 6px', borderRadius:4, fontSize:12, fontWeight:600 }}>{s5}×5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionBody>

      {/* 2. Review Konsistensi */}
      <SectionHeader title="Konsistensi Jawaban" skey="konsistensi"
        badge={result ? `${(result.contradictions||[]).length} kontradiksi` : hasAllStages ? 'Siap dianalisis' : 'Butuh semua stage'} />
      <SectionBody skey="konsistensi">
        {!hasAllStages ? (
          <Alert type="warn">Analisis konsistensi membutuhkan jawaban dari semua 4 stage. Stage yang belum ada: {[1,2,3,4].filter(s=>!stagesWithAnswers.includes(s)).join(', ')}.</Alert>
        ) : !result ? (
          <div>
            <div style={{ fontSize:14, color:'#4B5563', marginBottom:12, lineHeight:1.6 }}>
              AI akan membaca semua jawaban dari Stage 1–4 sekaligus dan mencari kontradiksi,
              pola membesar-besarkan, dan inkonsistensi antar stage.
            </div>
            <button className="btn" onClick={handleReview} disabled={loading}
              style={{ background:'#EEEDFE', color:'#534AB7', borderColor:'#534AB7' }}>
              {loading ? <><div className="spinner"/> Menganalisis...</> : '🔍 Jalankan Review Konsistensi'}
            </button>
            {error && <div style={{ marginTop:10, color:'#C00000', fontSize:13 }}>Gagal: {error}</div>}
          </div>
        ) : (
          <div>
            {result.overall_consistency && (() => {
              const s = consistencyColor[result.overall_consistency] || consistencyColor.sedang;
              return (
                <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderLeft:`4px solid ${s.border}`,
                  borderRadius:10, padding:'12px 16px', marginBottom:14 }}>
                  <div style={{ fontWeight:800, fontSize:13, color:s.color, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>
                    Konsistensi Keseluruhan: {result.overall_consistency}
                  </div>
                  <div style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{result.consistency_summary}</div>
                </div>
              );
            })()}
            {(result.contradictions||[]).map((c,i) => (
              <div key={i} style={{ padding:'10px 14px', background:'#FBE4E4', borderRadius:8, marginBottom:8, fontSize:13 }}>
                <div style={{ fontWeight:600, color:'#C00000', marginBottom:4 }}>
                  {(c.uc_ids||[]).map(id => <UCTooltip key={id} ucId={id} />)}
                </div>
                <div style={{ color:'#374151', lineHeight:1.6 }}>{c.description}</div>
              </div>
            ))}

            {/* Exaggeration signals */}
            {(result.exaggeration_signals||[]).length > 0 && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontWeight:700, fontSize:13, color:'#C00000', marginBottom:8 }}>📢 Sinyal membesar-besarkan / berbohong</div>
                {(result.exaggeration_signals||[]).map((s,i) => {
                  const severityColor = s.severity==='kuat' ? {bg:'#FBE4E4',border:'#C00000',color:'#C00000'} :
                    s.severity==='sedang' ? {bg:'#FBF3D5',border:'#BF8F00',color:'#BF8F00'} :
                    {bg:'#F9FAFB',border:'#D1D5DB',color:'#6B7280'};
                  return (
                    <div key={i} style={{ padding:'10px 14px', background:severityColor.bg,
                      border:`1px solid ${severityColor.border}`, borderLeft:`3px solid ${severityColor.border}`,
                      borderRadius:8, marginBottom:8, fontSize:13 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                        <UCTooltip ucId={s.uc_id} />
                        <span style={{ fontSize:11, fontWeight:700, color:severityColor.color,
                          background:'white', padding:'1px 7px', borderRadius:4, border:`1px solid ${severityColor.border}` }}>
                          {s.severity === 'kuat' ? '🚩 Kuat' : s.severity === 'sedang' ? '⚠ Sedang' : '○ Ringan'}
                        </span>
                        {s.collapse_uc && (
                          <span style={{ fontSize:12, color:'#9CA3AF' }}>
                            Runtuh di: <UCTooltip ucId={s.collapse_uc} />
                          </span>
                        )}
                      </div>
                      {s.claim && <div style={{ fontStyle:'italic', color:'#374151', marginBottom:4 }}>"{s.claim}"</div>}
                      <div style={{ color:'#374151', lineHeight:1.6 }}>{s.reason}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {result.individuality_pattern && (
              <div style={{ padding:'10px 14px', background:'#EBF4FA', border:'1px solid #2E75B6',
                borderLeft:'3px solid #2E75B6', borderRadius:8, marginBottom:8, fontSize:13 }}>
                <div style={{ fontWeight:700, color:'#0C447C', marginBottom:4 }}>👥 Pola "kami"</div>
                <div style={{ color:'#374151', lineHeight:1.6 }}>{result.individuality_pattern}</div>
              </div>
            )}
            {(result.probe_recommendations||[]).length > 0 && (
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:'#548235', marginBottom:8 }}>💡 Pertanyaan probe lanjutan</div>
                {result.probe_recommendations.map((p,i) => (
                  <div key={i} style={{ padding:'8px 12px', background:'#E2EFDA', borderRadius:6, marginBottom:6, fontSize:13, color:'#1F3A0A', lineHeight:1.6 }}>
                    {i+1}. {p}
                  </div>
                ))}
              </div>
            )}
            {result.overall_note && (
              <div style={{ padding:'12px 16px', background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:10, fontSize:14, color:'#374151', lineHeight:1.6, marginTop:8 }}>
                <strong>Catatan untuk panel:</strong> {result.overall_note}
              </div>
            )}
          </div>
        )}
      </SectionBody>

      {/* 3. Keaslian Jawaban */}
      <SectionHeader title="Keaslian Jawaban" skey="keaslian" badge={authFlags.length > 0 ? `${authFlags.length} flag` : 'Tidak ada flag'} />
      <SectionBody skey="keaslian">
        {authFlags.length === 0 ? (
          <div style={{ fontSize:14, color:'#9CA3AF' }}>Tidak ada flag keaslian yang terdeteksi dari evaluasi AI per UC.</div>
        ) : authFlags.map(e => (
          <div key={e.id} style={{ padding:'10px 14px', background:'#FBF3D5', border:'1px solid #BF8F00',
            borderLeft:'3px solid #BF8F00', borderRadius:8, marginBottom:8, fontSize:13 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
              <span style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#2E75B6', background:'#EBF4FA', padding:'1px 6px', borderRadius:4, fontWeight:700 }}>{e.uc_id}</span>
              <span style={{ fontWeight:600, color:'#BF8F00' }}>
                {e.authenticity_flag === 'possible_ai_generated' ? '🤖 Kemungkinan ditulis AI' :
                 e.authenticity_flag === 'possible_exaggeration' ? '📢 Kemungkinan dibesar-besarkan' :
                 '⚠ Detail tidak konsisten'}
              </span>
            </div>
            <div style={{ color:'#374151', lineHeight:1.6 }}>{e.authenticity_note}</div>
          </div>
        ))}
      </SectionBody>

      {/* 4. Pola Individuality */}
      <SectionHeader title="Pola Kontribusi Individual" skey="individuality" badge={indivNotes.length > 0 ? `${indivNotes.length} catatan` : 'Tidak ada catatan'} />
      <SectionBody skey="individuality">
        {indivNotes.length === 0 ? (
          <div style={{ fontSize:14, color:'#9CA3AF' }}>Tidak ada catatan pola "kami" yang terdeteksi dari evaluasi AI per UC.</div>
        ) : indivNotes.map(e => (
          <div key={e.id} style={{ padding:'10px 14px', background:'#EBF4FA', border:'1px solid #2E75B6',
            borderLeft:'3px solid #2E75B6', borderRadius:8, marginBottom:8, fontSize:13 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
              <span style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#2E75B6', background:'#EBF4FA', padding:'1px 6px', borderRadius:4, fontWeight:700 }}>{e.uc_id}</span>
              <span style={{ fontWeight:600, color:'#0C447C' }}>👥 Pola penggunaan "kami"</span>
            </div>
            <div style={{ color:'#374151', lineHeight:1.6 }}>{e.individuality_note}</div>
          </div>
        ))}
      </SectionBody>

      {/* 5. Catatan Penilai */}
      <SectionHeader title="Catatan Penilai" skey="catatan" badge={`${reviewerNotes.length} catatan`} />
      <SectionBody skey="catatan">
        {reviewerNotes.length === 0 ? (
          <div style={{ fontSize:14, color:'#9CA3AF' }}>Belum ada catatan penilai yang diisi.</div>
        ) : reviewerNotes.map(e => (
          <div key={e.id} style={{ padding:'10px 14px', background:'#F9FAFB', border:'1px solid #E5E7EB',
            borderRadius:8, marginBottom:8, fontSize:13 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
              <span style={{ fontFamily:'DM Mono,monospace', fontSize:11, color:'#2E75B6', background:'#EBF4FA', padding:'1px 6px', borderRadius:4, fontWeight:700 }}>{e.uc_id}</span>
              <span style={{ fontSize:11, color:'#9CA3AF' }}>Stage {e.stage} · {e.is_confirmed ? '✓ Dikonfirmasi' : 'Draft'}</span>
            </div>
            <div style={{ color:'#374151', lineHeight:1.6 }}>{e.reviewer_note}</div>
          </div>
        ))}
      </SectionBody>
    </div>
  );
}

// ── Main Component ────────────────────────────────────
export default function Evaluasi({ candidate, candidates, batch, onSelectCandidate, onBack, onRefresh }) {
  const [answers, setAnswers]         = useState([]);
  const [evals, setEvals]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [activeStage, setStage]       = useState('s1');
  const [stage4UCs, setStage4UCs]     = useState(null); // UC Stage 4 per kandidat
  const [generatedScript, setGeneratedScript] = useState(null); // script dari generate
  const [isAIRunning, setIsAIRunning]         = useState(false); // lock navigasi tab saat AI proses
  const [savedConsistency, setSavedConsistency] = useState(null); // hasil review konsistensi

  // Reset script saat kandidat berubah
  useEffect(() => { setGeneratedScript(null); }, [candidate?.id]);

  const loadData = useCallback(async () => {
    if (!candidate) return;
    setLoading(true);
    try {
      const [a, e, s4, latestScript, consistencyRes] = await Promise.all([
        getAnswers(candidate.id),
        getEvaluations(candidate.id),
        getStage4UCs(candidate.id),
        getLatestScript(candidate.id),
        getConsistencyResult(candidate.id),
      ]);
      setAnswers(a || []);
      setEvals(e || []);
      setStage4UCs(s4 || null);
      if (latestScript?.script_json) setGeneratedScript(latestScript.script_json);
      if (consistencyRes) setSavedConsistency(consistencyRes);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  }, [candidate?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  // Auto-update current_stage — baca current_stage dari DB untuk hindari stale prop
  async function handleEvalSaved(stageNum) {
    const { getEvaluations: fetchEvals, getAnswers: fetchAnswers } = await import('../lib/supabase');
    const [freshEvals, freshAnswers, freshCandidate] = await Promise.all([
      fetchEvals(candidate.id),
      fetchAnswers(candidate.id),
      getCandidateById(candidate.id),
    ]);

    const activeUCs = getStageUCs(stageNum);
    const confirmedInStage = (freshEvals || []).filter(e => e.stage === stageNum && e.is_confirmed);
    const currentStageFromDB = freshCandidate?.current_stage || 1;

    if (activeUCs.length > 0 && confirmedInStage.length >= activeUCs.length) {
      const nextStage = stageNum + 1;
      if (nextStage <= 4 && currentStageFromDB <= stageNum) {
        try {
          await updateCandidateStage(candidate.id, nextStage);
          onRefresh && onRefresh();
        } catch(e) { console.error('Gagal update stage:', e); }
      }
    }

    setAnswers(freshAnswers || []);
    setEvals(freshEvals || []);
  }

  // Ambil UC aktif untuk stage tertentu
  function getStageUCs(stageNum) {
    if (stageNum === 4) {
      // Stage 4: pakai UC dari generate script kalau ada, fallback ke batch/rotation
      if (stage4UCs && stage4UCs.length > 0) {
        return stage4UCs.map(id => BANK.stage4.find(uc => uc.id === id)).filter(Boolean);
      }
      if (batch?.stage4_ucs) {
        return batch.stage4_ucs.map(id => BANK.stage4.find(uc => uc.id === id)).filter(Boolean);
      }
      return getActiveUCs(4);
    }
    if (stageNum === 3 && batch) {
      const ucs = getActiveUCsFromBatch(batch);
      return ucs?.stage3 || getActiveUCs(3);
    }
    if (batch) {
      const ucs = getActiveUCsFromBatch(batch);
      return ucs?.[`stage${stageNum}`] || getActiveUCs(stageNum);
    }
    return getActiveUCs(stageNum);
  }

  if (!candidate) {
    return (
      <div>
        <p className="text-muted mb-2">Pilih kandidat untuk memulai evaluasi:</p>
        {candidates.length === 0
          ? <Alert type="warn">Belum ada kandidat. Tambahkan dari Dashboard.</Alert>
          : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:14 }}>
              {candidates.map(c => (
                <div key={c.id} className="card card-sm" style={{ cursor:'pointer' }} onClick={() => onSelectCandidate(c)}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <div className="avatar">{c.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{c.name}</div>
                      <div style={{ fontSize:13, color:'#9CA3AF' }}>{c.email}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    <span className={`badge-s${c.current_stage}`}>Stage {c.current_stage}</span>
                    <DirectionBadge direction={c.direction} />
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    );
  }

  const tabs = [
    { key:'s1', label:'Stage 1 — Aplikasi', stageNum:1 },
    { key:'s2', label:'Stage 2 — Situasi & Logika', stageNum:2 },
    { key:'s3', label:'Stage 3 — Case Study', stageNum:3 },
    { key:'prep', label:'Persiapan Panel', stageNum:null },
    { key:'s4', label:'Stage 4 — Panel', stageNum:4 },
    { key:'analisis', label:'Analisis Akhir', stageNum:null },
  ];

  const stagesWithAnswers = [...new Set(answers.map(a => a.stage))];

  return (
    <div>
      {/* Header kandidat */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
        <button className="btn btn-sm" onClick={onBack}>← Kembali</button>
        <div className="avatar avatar-lg">{candidate.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:'#111827' }}>{candidate.name}</div>
          <div style={{ fontSize:14, color:'#9CA3AF' }}>{candidate.email}</div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
          <span className={`badge-s${candidate.current_stage}`}>Stage {candidate.current_stage} aktif</span>
          <DirectionBadge direction={candidate.direction} />
        </div>
      </div>

      {/* Tabs */}
      {isAIRunning && (
        <div style={{ background:'#FBF3D5', border:'1px solid #BF8F00', borderLeft:'4px solid #BF8F00',
          borderRadius:8, padding:'10px 16px', marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
          <div className="spinner" style={{ borderColor:'#BF8F00', borderTopColor:'transparent' }} />
          <span style={{ fontSize:13, fontWeight:600, color:'#633806' }}>
            AI sedang memproses — jangan pindah tab atau refresh sampai selesai
          </span>
        </div>
      )}
      <div className="tabs" style={{ flexWrap:'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key}
            className={`tab-btn ${activeStage===tab.key?'active':''}`}
            onClick={() => { if (!isAIRunning) setStage(tab.key); }}
            disabled={isAIRunning && activeStage !== tab.key}
            style={{ opacity: isAIRunning && activeStage !== tab.key ? 0.4 : 1,
              cursor: isAIRunning && activeStage !== tab.key ? 'not-allowed' : 'pointer' }}>
            {tab.label}
            {tab.stageNum && tab.stageNum === candidate.current_stage && (
              <span style={{ marginLeft:5, color:'#2E75B6', fontSize:10 }}>●</span>
            )}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Stage 1, 2, 3, 4 — UC evaluasi */}
          {['s1','s2','s3','s4'].map(key => {
            const tab = tabs.find(t => t.key === key);
            if (activeStage !== key) return null;
            const stageUCs = getStageUCs(tab.stageNum);
            const confirmedCount = evals.filter(e => e.is_confirmed && e.stage === tab.stageNum).length;
            return (
              <div key={key}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
                  <span className={`badge-s${tab.stageNum}`}>{tab.label}</span>
                  <span className="text-muted">{stageUCs.length} UC aktif</span>
                  <span className="text-muted">·</span>
                  <span className="text-muted">{confirmedCount} dari {stageUCs.length} dikonfirmasi</span>
                  {key === 's3' && (
                    <span style={{ fontSize:12, color:'#BF8F00', background:'#FBF3D5', padding:'2px 8px', borderRadius:4 }}>
                      UC utama + pendamping + refleksi wajib · 50–60 menit per UC
                    </span>
                  )}
                  {key === 's4' && stage4UCs && (
                    <span style={{ fontSize:12, color:'#548235', background:'#E2EFDA', padding:'2px 8px', borderRadius:4 }}>
                      UC dipersonalisasi dari Generate Script
                    </span>
                  )}
                </div>
                <Alert type="warn">
                  <strong>AI adalah pembantu, bukan penentu.</strong> Gunakan <em>Simpan Draft</em> untuk menyimpan sementara
                  dan <em>Konfirmasi Skor Final</em> untuk mengunci.
                </Alert>
                {stageUCs.map(uc => (
                  <UCCard key={uc.id} uc={uc} stage={tab.stageNum} candidateId={candidate.id}
                    existingAnswer={answers.find(a => a.uc_id === uc.id)}
                    existingEval={evals.find(e => e.uc_id === uc.id)}
                    onEvalSaved={() => handleEvalSaved(tab.stageNum)}
                    onAIStart={() => setIsAIRunning(true)}
                    onAIDone={() => setIsAIRunning(false)} />
                ))}
              </div>
            );
          })}

          {/* Tab Persiapan Panel */}
          {activeStage === 'prep' && (
            <PersiapanPanel
              candidate={candidate}
              batch={batch}
              evals={evals}
              script={generatedScript}
              onScriptGenerated={(ucIds, scriptResult) => {
                setStage4UCs(ucIds);
                setGeneratedScript(scriptResult);
                loadData();
              }}
              onAIStart={() => setIsAIRunning(true)}
              onAIDone={() => setIsAIRunning(false)}
            />
          )}

          {/* Tab Analisis Akhir */}
          {activeStage === 'analisis' && (
            <AnalisisAkhir candidate={candidate} answers={answers} evals={evals}
            savedConsistency={savedConsistency}
            onConsistencyDone={async (result) => {
              setSavedConsistency(result);
              try { await saveConsistencyResult(candidate.id, result); }
              catch(e) { console.warn('Gagal simpan konsistensi:', e.message); }
            }}
            onAIStart={() => setIsAIRunning(true)}
            onAIDone={() => setIsAIRunning(false)} />
          )}
        </>
      )}
    </div>
  );
}
