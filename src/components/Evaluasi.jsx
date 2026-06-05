import React, { useState, useEffect, useCallback } from 'react';
import { ScoreBadge, DirectionBadge, Avatar, Spinner, FlagBadge, Alert } from './Shared';
import { getAnswers, getEvaluations, saveAnswer, saveEvaluation, confirmEvaluationByUC, saveInterviewScript } from '../lib/supabase';
import { evaluateAnswer, generateInterviewScript, analyzeConsistency } from '../lib/claude';
import { getActiveUCs, BANK } from '../data/bank';

// ── saveDraft ke supabase (update final_score + note tanpa konfirmasi) ──
async function saveDraftToDB(candidateId, ucId, score, note) {
  const { supabase } = await import('../lib/supabase');
  const { error } = await supabase.from('evaluations').update({
    final_score: score,
    reviewer_note: note,
  }).eq('candidate_id', candidateId).eq('uc_id', ucId);
  if (error) throw error;
}

// ── CalibrationWarning ───────────────────────────────
const WARNING_STYLES = {
  context:  { bg:'#EBF4FA', border:'#2E75B6', icon:'⚠', label_color:'#0C447C', text_color:'#1F3864' },
  scale:    { bg:'#FBF3D5', border:'#BF8F00', icon:'📏', label_color:'#633806', text_color:'#4B3500' },
  score3ok: { bg:'#E2EFDA', border:'#548235', icon:'✓', label_color:'#27500A', text_color:'#1F3A0A' },
  delivery: { bg:'#EEEDFE', border:'#534AB7', icon:'🎯', label_color:'#3C3489', text_color:'#26215C' },
};

function CalibrationWarning({ w }) {
  const style = WARNING_STYLES[w.type] || WARNING_STYLES.context;
  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderLeft: `4px solid ${style.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      marginTop: 10,
      marginBottom: 4,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
        <span style={{ fontSize:14 }}>{style.icon}</span>
        <span style={{
          fontSize: 11, fontWeight: 800, color: style.label_color,
          textTransform: 'uppercase', letterSpacing: '0.07em'
        }}>
          Kalibrasi Penilai — {w.label}
        </span>
      </div>
      <div style={{ fontSize: 13, color: style.text_color, lineHeight: 1.6 }}>
        {w.text}
      </div>
    </div>
  );
}

// ── UCCard ────────────────────────────────────────────
function UCCard({ uc, stage, candidateId, existingAnswer, existingEval, onEvalSaved }) {
  const [answer, setAnswer]           = useState('');
  const [aiDraft, setAiDraft]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [confirming, setConfirming]   = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved]   = useState(false);
  const [overrideScore, setOverride]  = useState(null);
  const [reviewerNote, setNote]       = useState('');
  const [confirmed, setConfirmed]     = useState(false);

  // Sync dari props — restore semua state termasuk reviewer_note dari DB
  useEffect(() => {
    if (existingAnswer?.answer_text) setAnswer(existingAnswer.answer_text);
    if (existingEval) {
      setAiDraft(existingEval);
      setConfirmed(existingEval.is_confirmed || false);
      // Restore catatan penilai dari DB
      if (existingEval.reviewer_note) setNote(existingEval.reviewer_note);
      // Restore skor override dari DB
      if (existingEval.final_score) setOverride(existingEval.final_score);
    }
  }, [existingEval?.id, existingAnswer?.id]);

  // Reset draftSaved indicator setelah 3 detik
  useEffect(() => {
    if (draftSaved) {
      const t = setTimeout(() => setDraftSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [draftSaved]);

  async function handleEvaluate() {
    if (!answer.trim()) { alert('Isi jawaban kandidat terlebih dahulu.'); return; }
    setLoading(true);
    try {
      const savedAnswer = await saveAnswer(candidateId, stage, uc.id, answer);
      const result = await evaluateAnswer(uc, answer);
      await saveEvaluation(savedAnswer.id, candidateId, uc.id, stage, result);
      setAiDraft({
        ...result,
        ai_score: result.score, ai_reasoning: result.reasoning,
        ai_evidence: result.evidence, ai_direction: result.direction, ai_flag: result.flag
      });
      setOverride(result.score);
      setConfirmed(false);
    } catch (e) {
      alert('Evaluasi gagal: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    if (!aiDraft) { alert('Lakukan evaluasi AI terlebih dahulu.'); return; }
    const scoreToSave = overrideScore || aiDraft.ai_score || aiDraft.score;
    setSavingDraft(true);
    try {
      // Simpan jawaban dulu kalau belum
      if (answer.trim()) await saveAnswer(candidateId, stage, uc.id, answer);
      // Simpan skor + catatan sementara (tanpa konfirmasi)
      await saveDraftToDB(candidateId, uc.id, Number(scoreToSave), reviewerNote);
      setDraftSaved(true);
    } catch (e) {
      alert('Gagal simpan draft: ' + e.message);
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleConfirm() {
    if (!aiDraft) return;
    const scoreToSave = overrideScore || aiDraft.ai_score || aiDraft.score;
    setConfirming(true);
    try {
      await confirmEvaluationByUC(candidateId, uc.id, Number(scoreToSave), reviewerNote, 'Panel');
      setConfirmed(true);
      setAiDraft(prev => ({ ...prev, final_score: Number(scoreToSave), is_confirmed: true }));
      onEvalSaved && onEvalSaved();
    } catch (e) {
      alert('Konfirmasi gagal: ' + e.message);
    } finally {
      setConfirming(false);
    }
  }

  const aiScore = aiDraft?.ai_score || aiDraft?.score;
  const currentDisplayScore = overrideScore || aiScore || 3;

  return (
    <div className="uc-card uc-active">
      {/* Header UC */}
      <div className="uc-header">
        <span className="uc-code">{uc.id}</span>
        <span className="uc-title">{uc.title}</span>
        {uc.mechanism && <span className="badge badge-purple">{uc.mechanism}</span>}
        <span className="badge badge-blue">Klaster {uc.klaster}</span>
        {confirmed && (
          <span className="confirmed-pill" style={{ marginLeft:'auto' }}>
            ✓ Dikonfirmasi — Skor {aiDraft?.final_score}
          </span>
        )}
      </div>

      {/* Context note untuk kandidat — penjelasan konteks sebelum soal */}
      {uc.context_note && (
        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderLeft: '4px solid #0EA5E9',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 10,
          fontSize: 13,
          color: '#0C4A6E',
          lineHeight: 1.65,
        }}>
          <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.07em', marginBottom: 5, color: '#0369A1' }}>
            📋 Konteks untuk kandidat
          </div>
          {uc.context_note}
        </div>
      )}

      <div className="uc-prompt">{uc.prompt}</div>

      {uc.trap && (
        <div className="uc-trap"><strong>Trap clause (penilai):</strong> {uc.trap}</div>
      )}

      <div className="uc-meta">
        <span className="uc-cari"><strong>Cari:</strong> {uc.cari}</span>
        <span className="uc-waspadai"><strong>Waspadai:</strong> {uc.waspadai}</span>
        {uc.signal && <span style={{ color:'#2E75B6' }}><strong>Sinyal:</strong> {uc.signal}</span>}
      </div>

      {/* Calibration Warning */}
      {uc.calibration_warning && <CalibrationWarning w={uc.calibration_warning} />}

      {/* Jawaban */}
      <div className="field" style={{ marginTop:14 }}>
        <label>Jawaban kandidat</label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Paste atau ketik jawaban kandidat di sini..."
          rows={5}
          disabled={confirmed}
        />
      </div>

      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
        <button className="btn btn-blue btn-sm" onClick={handleEvaluate}
          disabled={loading || confirmed || !answer.trim()}>
          {loading
            ? <><div className="spinner"/> Mengevaluasi...</>
            : '🤖 Evaluasi dengan AI'}
        </button>
        {aiDraft && !confirmed && <span className="draft-pill">Draft AI — belum dikonfirmasi</span>}
      </div>

      {/* AI Draft */}
      {aiDraft && (
        <div className="ai-draft">
          <div className="ai-draft-header">
            <span className="ai-draft-label">Draft AI</span>
            <ScoreBadge score={aiScore} />
            <DirectionBadge direction={aiDraft.ai_direction || aiDraft.direction} />
            <FlagBadge flag={aiDraft.ai_flag || aiDraft.flag} />
          </div>

          <div className="ai-reasoning">
            <strong>Reasoning:</strong> {aiDraft.ai_reasoning || aiDraft.reasoning}
          </div>
          <div className="ai-evidence">
            <strong>Evidence:</strong> "{aiDraft.ai_evidence || aiDraft.evidence}"
          </div>
          {aiDraft.flag_note && (
            <div className="ai-flag-note">
              <strong>Catatan panel:</strong> {aiDraft.flag_note}
            </div>
          )}

          {/* Individuality note */}
          {(aiDraft.individuality_note) && (
            <div style={{ background:'#EBF4FA', border:'1px solid #2E75B6', borderLeft:'3px solid #2E75B6', borderRadius:8, padding:'10px 14px', marginTop:8, fontSize:13, color:'#1F3864' }}>
              <strong>👥 Pola penggunaan "kami":</strong> {aiDraft.individuality_note}
            </div>
          )}

          {/* Authenticity flag */}
          {aiDraft.authenticity_flag && (
            <div style={{ background:'#FBF3D5', border:'1px solid #BF8F00', borderLeft:'3px solid #BF8F00', borderRadius:8, padding:'10px 14px', marginTop:8, fontSize:13, color:'#4B3500' }}>
              <strong>
                {aiDraft.authenticity_flag === 'possible_ai_generated' ? '🤖 Kemungkinan ditulis AI:' :
                 aiDraft.authenticity_flag === 'possible_exaggeration' ? '📢 Kemungkinan dibesar-besarkan:' :
                 '⚠ Detail tidak konsisten:'}
              </strong>{' '}
              {aiDraft.authenticity_note}
            </div>
          )}

          {/* Panel konfirmasi */}
          {!confirmed && (
            <div style={{ marginTop:14, padding:'16px 18px', background:'white', borderRadius:10, border:'1px solid #E5E7EB' }}>
              <div style={{ fontSize:12, fontWeight:800, color:'#374151', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                Penilaian Penilai
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'12px 16px', alignItems:'start', marginBottom:14 }}>
                {/* Skor */}
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:'#4B5563', marginBottom:6, display:'block' }}>
                    Skor final:
                  </label>
                  <select
                    value={currentDisplayScore}
                    onChange={e => setOverride(parseInt(e.target.value, 10))}
                    style={{ padding:'9px 12px', fontSize:14, borderRadius:8, border:'1px solid #D1D5DB', fontFamily:'inherit', background:'white', color:'#111827', cursor:'pointer' }}
                  >
                    <option value={1}>1 — Red Flag</option>
                    <option value={3}>3 — Average Fresh Grad</option>
                    <option value={5}>5 — Future Senior PM</option>
                  </select>
                </div>

                {/* Catatan */}
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:'#4B5563', marginBottom:6, display:'block' }}>
                    Catatan penilai:
                    <span style={{ fontWeight:400, color:'#9CA3AF', marginLeft:6 }}>(tersimpan bersama draft & konfirmasi)</span>
                  </label>
                  <textarea
                    value={reviewerNote}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Alasan override, observasi tambahan, atau hal yang perlu digali di stage berikutnya..."
                    rows={3}
                    style={{ padding:'9px 12px', fontSize:14, borderRadius:8, border:'1px solid #D1D5DB', width:'100%', fontFamily:'inherit', resize:'vertical', lineHeight:1.55 }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                <button
                  className="btn btn-sm"
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                  style={{ borderColor:'#D1D5DB' }}
                >
                  {savingDraft
                    ? <><div className="spinner"/> Menyimpan...</>
                    : '💾 Simpan Draft'}
                </button>

                {draftSaved && (
                  <span style={{ fontSize:13, color:'#548235', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Draft tersimpan
                  </span>
                )}

                <button
                  className="btn btn-green"
                  onClick={handleConfirm}
                  disabled={confirming}
                  style={{ marginLeft:'auto' }}
                >
                  {confirming
                    ? <><div className="spinner"/> Mengonfirmasi...</>
                    : '✓ Konfirmasi Skor Final'}
                </button>
              </div>

              <div style={{ fontSize:12, color:'#9CA3AF', marginTop:10, lineHeight:1.5 }}>
                <strong>Simpan Draft</strong> = skor & catatan tersimpan sementara, bisa diubah lagi.<br/>
                <strong>Konfirmasi Skor Final</strong> = dikunci permanen, tidak bisa diubah lagi.
              </div>
            </div>
          )}

          {/* Tampilan jika sudah dikonfirmasi */}
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

// ── Consistency Reviewer ─────────────────────────────
function ConsistencyPanel({ candidate, allAnswers, allEvals }) {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);

  async function handleReview() {
    if (allAnswers.length < 2) {
      alert('Perlu minimal 2 jawaban untuk bisa menganalisis konsistensi.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeConsistency(candidate, allAnswers, allEvals);
      setResult(res);
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const consistencyColor = {
    tinggi: { bg:'#E2EFDA', color:'#548235', border:'#548235' },
    sedang: { bg:'#FBF3D5', color:'#BF8F00', border:'#BF8F00' },
    rendah: { bg:'#FBE4E4', color:'#C00000', border:'#C00000' },
  };

  return (
    <div className="card" style={{ borderColor:'#534AB7', borderWidth:2, marginTop:8 }}>
      <div className="card-title" style={{ color:'#534AB7' }}>Review Konsistensi Jawaban</div>
      <div style={{ fontSize:14, color:'#4B5563', marginBottom:14, lineHeight:1.6 }}>
        AI akan membaca <strong>semua jawaban kandidat sekaligus</strong> dan mencari: kontradiksi antar jawaban,
        pola membesar-besarkan pencapaian, pola menyembunyikan kontribusi individual, dan jawaban yang terasa
        tidak autentik atau seperti ditulis AI.
      </div>
      <button className="btn btn-sm" onClick={handleReview} disabled={loading}
        style={{ background:'#EEEDFE', color:'#534AB7', borderColor:'#534AB7' }}>
        {loading ? <><div className="spinner"/> Menganalisis...</> : '🔍 Review Konsistensi Semua Jawaban'}
      </button>

      {error && (
        <div style={{ marginTop:12, padding:'10px 14px', background:'#FBE4E4', borderRadius:8, fontSize:13, color:'#C00000' }}>
          Gagal menganalisis: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop:16 }}>
          {/* Ringkasan */}
          {result.overall_consistency && (() => {
            const s = consistencyColor[result.overall_consistency] || consistencyColor.sedang;
            return (
              <div style={{ background:s.bg, border:`1px solid ${s.border}`, borderLeft:`4px solid ${s.border}`, borderRadius:10, padding:'12px 16px', marginBottom:14 }}>
                <div style={{ fontWeight:800, fontSize:13, color:s.color, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>
                  Konsistensi Keseluruhan: {result.overall_consistency.charAt(0).toUpperCase() + result.overall_consistency.slice(1)}
                </div>
                <div style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{result.consistency_summary}</div>
              </div>
            );
          })()}

          {/* Kontradiksi */}
          {(result.contradictions || []).length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:13, color:'#C00000', marginBottom:8 }}>
                ⚠ Kontradiksi yang ditemukan ({result.contradictions.length})
              </div>
              {result.contradictions.map((c, i) => (
                <div key={i} style={{ padding:'10px 14px', background:'#FBE4E4', borderRadius:8, marginBottom:8, fontSize:13 }}>
                  <div style={{ fontWeight:600, color:'#C00000', marginBottom:4 }}>
                    {(c.uc_ids || []).join(' ↔ ')}
                  </div>
                  <div style={{ color:'#374151', lineHeight:1.6 }}>{c.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Pola melebih-lebihkan */}
          {(result.exaggeration_signals || []).length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:13, color:'#BF8F00', marginBottom:8 }}>
                📢 Sinyal kemungkinan dibesar-besarkan ({result.exaggeration_signals.length})
              </div>
              {result.exaggeration_signals.map((e, i) => (
                <div key={i} style={{ padding:'10px 14px', background:'#FBF3D5', borderRadius:8, marginBottom:8, fontSize:13 }}>
                  <div style={{ fontWeight:600, color:'#BF8F00', marginBottom:4 }}>{e.uc_id}</div>
                  <div style={{ color:'#374151', lineHeight:1.6 }}>{e.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Pola individuality */}
          {result.individuality_pattern && (
            <div style={{ padding:'10px 14px', background:'#EBF4FA', border:'1px solid #2E75B6', borderLeft:'3px solid #2E75B6', borderRadius:8, marginBottom:14, fontSize:13 }}>
              <div style={{ fontWeight:700, color:'#0C447C', marginBottom:4 }}>👥 Pola penggunaan kata "kami"</div>
              <div style={{ color:'#374151', lineHeight:1.6 }}>{result.individuality_pattern}</div>
            </div>
          )}

          {/* Kekhawatiran keaslian */}
          {(result.authenticity_concerns || []).length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:13, color:'#534AB7', marginBottom:8 }}>
                🤖 Kekhawatiran keaslian jawaban ({result.authenticity_concerns.length})
              </div>
              {result.authenticity_concerns.map((a, i) => (
                <div key={i} style={{ padding:'10px 14px', background:'#EEEDFE', borderRadius:8, marginBottom:8, fontSize:13 }}>
                  <div style={{ fontWeight:600, color:'#534AB7', marginBottom:4 }}>
                    {a.uc_id} — {a.type === 'possible_ai_generated' ? 'Kemungkinan ditulis AI' :
                      a.type === 'memorized_template' ? 'Terkesan dari template' : 'Tidak konsisten dengan jawaban lain'}
                  </div>
                  <div style={{ color:'#374151', lineHeight:1.6 }}>{a.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Rekomendasi probe */}
          {(result.probe_recommendations || []).length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:13, color:'#548235', marginBottom:8 }}>
                💡 Pertanyaan yang disarankan untuk Stage 4
              </div>
              {result.probe_recommendations.map((p, i) => (
                <div key={i} style={{ padding:'8px 12px', background:'#E2EFDA', borderRadius:6, marginBottom:6, fontSize:13, color:'#1F3A0A', lineHeight:1.6 }}>
                  {i+1}. {p}
                </div>
              ))}
            </div>
          )}

          {/* Catatan akhir */}
          {result.overall_note && (
            <div style={{ padding:'12px 16px', background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:10, fontSize:14, color:'#374151', lineHeight:1.6 }}>
              <strong>Catatan untuk panel:</strong> {result.overall_note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Script Generator ──────────────────────────────────
function ScriptPanel({ candidate, evals }) {
  const [loading, setLoading] = useState(false);
  const [script, setScript]   = useState(null);

  async function handleGenerate() {
    if (evals.length === 0) { alert('Evaluasi minimal 1 UC terlebih dahulu.'); return; }
    setLoading(true);
    try {
      const result = await generateInterviewScript(candidate, evals, BANK.stage4);
      await saveInterviewScript(candidate.id, result.selected_ucs, result, result.rationale);
      setScript(result);
    } catch (e) {
      alert('Gagal generate script: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ borderColor:'#2E75B6', borderWidth:2 }}>
      <div className="card-title" style={{ color:'#2E75B6' }}>Generate Interview Script Stage 4</div>
      <Alert type="info">
        AI menganalisis semua evaluasi kandidat ini dan merekomendasikan 7 UC Stage 4 paling relevan, beserta probe yang dipersonalisasi berdasarkan gap yang terdeteksi.
      </Alert>
      <button className="btn btn-blue" onClick={handleGenerate} disabled={loading}>
        {loading ? <><div className="spinner"/> Generating...</> : '✨ Generate Script Stage 4'}
      </button>

      {script && (
        <>
          <div className="divider" />
          <Alert type="success">Script berhasil di-generate — rekomendasi AI, panel tetap bisa menyesuaikan.</Alert>
          <div style={{ fontSize:14, marginBottom:14, color:'#374151' }}>
            <strong>Rationale:</strong> {script.rationale}
          </div>
          {(script.questions || []).map(q => {
            const uc = BANK.stage4.find(u => u.id === q.uc_id);
            return (
              <div key={q.uc_id} style={{ padding:'12px 14px', border:'1px solid #E5E7EB', borderRadius:10, marginBottom:10, borderLeft:'4px solid #2E75B6', background:'#FAFAFA' }}>
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
  );
}

// ── Main Component ────────────────────────────────────
export default function Evaluasi({ candidate, candidates, onSelectCandidate, onBack }) {
  const [answers, setAnswers]   = useState([]);
  const [evals, setEvals]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [activeStage, setStage] = useState(1);

  const loadData = useCallback(async () => {
    if (!candidate) return;
    setLoading(true);
    try {
      const [a, e] = await Promise.all([getAnswers(candidate.id), getEvaluations(candidate.id)]);
      setAnswers(a || []);
      setEvals(e || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [candidate?.id]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (candidate) setStage(candidate.current_stage || 1); }, [candidate?.id]);

  if (!candidate) {
    return (
      <div>
        <p className="text-muted mb-2">Pilih kandidat untuk memulai evaluasi:</p>
        {candidates.length === 0
          ? <Alert type="warn">Belum ada kandidat. Tambahkan dari Dashboard terlebih dahulu.</Alert>
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

  const stageUCs       = getActiveUCs(activeStage);
  const confirmedCount = evals.filter(e => e.is_confirmed && e.stage === activeStage).length;

  return (
    <div>
      {/* Header kandidat */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
        <button className="btn btn-sm" onClick={onBack}>← Kembali</button>
        <div className="avatar avatar-lg">
          {candidate.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:'#111827' }}>{candidate.name}</div>
          <div style={{ fontSize:14, color:'#9CA3AF' }}>{candidate.email}</div>
        </div>
        <div style={{ marginLeft:'auto' }}>
          <DirectionBadge direction={candidate.direction} />
        </div>
      </div>

      {/* Stage tabs */}
      <div className="tabs">
        {[
          { s:1, label:'Stage 1 — Aplikasi' },
          { s:2, label:'Stage 2 — Penilaian Situasi & Logika' },
          { s:3, label:'Stage 3 — Case Study' },
          { s:4, label:'Stage 4 — Panel' },
        ].map(({ s, label }) => (
          <button key={s} className={`tab-btn ${activeStage===s?'active':''}`}
            onClick={() => setStage(s)}>
            {label}
            {s === candidate.current_stage && (
              <span style={{ marginLeft:5, color:'#2E75B6', fontSize:10 }}>●</span>
            )}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <span className={`badge-s${activeStage}`}>Stage {activeStage}</span>
        <span className="text-muted">{stageUCs.length} UC aktif</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{confirmedCount} dari {stageUCs.length} dikonfirmasi</span>
      </div>

      <Alert type="warn">
        <div>
          <strong>AI adalah pembantu, bukan penentu.</strong> Gunakan <em>Simpan Draft</em> untuk menyimpan sementara,
          dan <em>Konfirmasi Skor Final</em> untuk mengunci. Catatan penilai selalu tersimpan bersama draft maupun konfirmasi.
        </div>
      </Alert>

      {loading
        ? <Spinner />
        : stageUCs.map(uc => (
            <UCCard
              key={uc.id}
              uc={uc}
              stage={activeStage}
              candidateId={candidate.id}
              existingAnswer={answers.find(a => a.uc_id === uc.id)}
              existingEval={evals.find(e => e.uc_id === uc.id)}
              onEvalSaved={loadData}
            />
          ))}

      {activeStage >= 2 && evals.length > 0 && (
        <ScriptPanel candidate={candidate} evals={evals} />
      )}

      {/* Review konsistensi — tampil setelah ada jawaban di semua stage */}
      {answers.length >= 3 && (
        <ConsistencyPanel
          candidate={candidate}
          allAnswers={answers}
          allEvals={evals}
        />
      )}
    </div>
  );
}
