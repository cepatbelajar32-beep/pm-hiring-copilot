import React, { useState, useEffect, useCallback } from 'react';
import { ScoreBadge, DirectionBadge, Avatar, Spinner, FlagBadge, Alert } from './Shared';
import { getAnswers, getEvaluations, saveAnswer, saveEvaluation, confirmEvaluationByUC, saveInterviewScript } from '../lib/supabase';
import { evaluateAnswer, generateInterviewScript } from '../lib/claude';
import { getActiveUCs, BANK } from '../data/bank';

// ── UCCard ────────────────────────────────────────────
function UCCard({ uc, stage, candidateId, existingAnswer, existingEval, onEvalSaved }) {
  const [answer, setAnswer]           = useState('');
  const [aiDraft, setAiDraft]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [confirming, setConfirming]   = useState(false);
  // overrideScore selalu number atau null — JANGAN inisialisasi 0
  const [overrideScore, setOverride]  = useState(null);
  const [reviewerNote, setNote]       = useState('');
  const [confirmed, setConfirmed]     = useState(false);

  // Sync dari props — tapi HANYA saat props berubah dan belum ada draft lokal
  useEffect(() => {
    if (existingAnswer?.answer_text) setAnswer(existingAnswer.answer_text);
    if (existingEval) {
      setAiDraft(existingEval);
      setConfirmed(existingEval.is_confirmed || false);
      // Set override ke final_score yang sudah dikonfirmasi, BUKAN ai_score
      if (existingEval.is_confirmed) {
        setOverride(existingEval.final_score);
      }
    }
  }, [existingEval?.id, existingAnswer?.id]); // hanya re-run saat ID berubah, bukan tiap render

  async function handleEvaluate() {
    if (!answer.trim()) { alert('Isi jawaban kandidat terlebih dahulu.'); return; }
    setLoading(true);
    try {
      const savedAnswer = await saveAnswer(candidateId, stage, uc.id, answer);
      const result = await evaluateAnswer(uc, answer);
      await saveEvaluation(savedAnswer.id, candidateId, uc.id, stage, result);
      // Set draft lokal — TIDAK trigger reload parent supaya state tidak di-reset
      setAiDraft({ ...result, ai_score: result.score, ai_reasoning: result.reasoning,
        ai_evidence: result.evidence, ai_direction: result.direction, ai_flag: result.flag });
      setOverride(result.score); // default override = skor AI
      setConfirmed(false);
    } catch (e) {
      alert('Evaluasi gagal: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!aiDraft) return;
    // Bug fix: overrideScore pasti number karena di-set dari skor AI saat evaluasi
    // Kalau user ganti dropdown, overrideScore = pilihan user
    const scoreToSave = overrideScore || (aiDraft.ai_score || aiDraft.score);
    setConfirming(true);
    try {
      await confirmEvaluationByUC(candidateId, uc.id, Number(scoreToSave), reviewerNote, 'Panel');
      setConfirmed(true);
      setAiDraft(prev => ({ ...prev, final_score: Number(scoreToSave), is_confirmed: true }));
      onEvalSaved && onEvalSaved(); // reload parent untuk update counter
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
      <div className="uc-header">
        <span className="uc-code">{uc.id}</span>
        <span className="uc-title">{uc.title}</span>
        {uc.mechanism && <span className="badge badge-purple">{uc.mechanism}</span>}
        <span className="badge badge-blue">Klaster {uc.klaster}</span>
        {confirmed && <span className="confirmed-pill" style={{ marginLeft: 'auto' }}>✓ Dikonfirmasi — Skor {aiDraft?.final_score}</span>}
      </div>

      <div className="uc-prompt">{uc.prompt}</div>

      {uc.trap && (
        <div className="uc-trap"><strong>Trap clause (penilai):</strong> {uc.trap}</div>
      )}

      <div className="uc-meta">
        <span className="uc-cari"><strong>Cari:</strong> {uc.cari}</span>
        <span className="uc-waspadai"><strong>Waspadai:</strong> {uc.waspadai}</span>
        {uc.signal && <span style={{ color: '#2E75B6' }}><strong>Sinyal:</strong> {uc.signal}</span>}
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label>Jawaban kandidat</label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Paste atau ketik jawaban kandidat di sini..."
          rows={5}
          disabled={confirmed}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="btn btn-blue btn-sm" onClick={handleEvaluate}
          disabled={loading || confirmed || !answer.trim()}>
          {loading ? <><div className="spinner" /> Mengevaluasi...</> : '🤖 Evaluasi dengan AI'}
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
          {(aiDraft.flag_note) && (
            <div className="ai-flag-note"><strong>Catatan panel:</strong> {aiDraft.flag_note}</div>
          )}

          {!confirmed && (
            <div style={{ marginTop: 12, padding: '12px 14px', background: 'white', borderRadius: 8, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Konfirmasi Penilai
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 5, display: 'block' }}>
                    Skor final (ubah jika perlu):
                  </label>
                  <select
                    value={currentDisplayScore}
                    onChange={e => setOverride(parseInt(e.target.value, 10))}
                    style={{ padding: '8px 12px', fontSize: 14, borderRadius: 8, border: '1px solid #D1D5DB', fontFamily: 'inherit', background: 'white', color: '#111827' }}
                  >
                    <option value={1}>1 — Red Flag</option>
                    <option value={3}>3 — Average Fresh Grad</option>
                    <option value={5}>5 — Future Senior PM</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 5, display: 'block' }}>
                    Catatan penilai (opsional):
                  </label>
                  <input type="text" placeholder="Alasan override atau observasi tambahan..."
                    value={reviewerNote} onChange={e => setNote(e.target.value)}
                    style={{ padding: '8px 12px', fontSize: 14, borderRadius: 8, border: '1px solid #D1D5DB', width: '100%', fontFamily: 'inherit' }}
                  />
                </div>
                <button className="btn btn-green" onClick={handleConfirm} disabled={confirming} style={{ flexShrink: 0 }}>
                  {confirming ? <><div className="spinner" /> Menyimpan...</> : '✓ Konfirmasi Skor'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Script Generator ──────────────────────────────────
function ScriptPanel({ candidate, evals }) {
  const [loading, setLoading]   = useState(false);
  const [script, setScript]     = useState(null);

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
    <div className="card" style={{ borderColor: '#2E75B6', borderWidth: 2 }}>
      <div className="card-title" style={{ color: '#2E75B6' }}>Generate Interview Script Stage 4</div>
      <Alert type="info">
        AI menganalisis semua evaluasi kandidat ini dan merekomendasikan 7 UC Stage 4 yang paling perlu digali, beserta probe yang dipersonalisasi berdasarkan gap yang terdeteksi.
      </Alert>
      <button className="btn btn-blue" onClick={handleGenerate} disabled={loading}>
        {loading ? <><div className="spinner" /> Generating...</> : '✨ Generate Script Stage 4'}
      </button>

      {script && (
        <>
          <div className="divider" />
          <Alert type="success">Script berhasil di-generate — rekomendasi AI, panel tetap bisa menyesuaikan.</Alert>
          <div style={{ fontSize: 14, marginBottom: 14, color: '#374151' }}>
            <strong>Rationale:</strong> {script.rationale}
          </div>
          {(script.questions || []).map(q => {
            const uc = BANK.stage4.find(u => u.id === q.uc_id);
            return (
              <div key={q.uc_id} style={{ padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 10, marginBottom: 10, borderLeft: '4px solid #2E75B6', background: '#FAFAFA' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span className="uc-code">{q.uc_id}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{uc?.title || ''}</span>
                </div>
                <div style={{ fontSize: 14, color: '#2E75B6', fontStyle: 'italic' }}>Probe: {q.custom_probe}</div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────
export default function Evaluasi({ candidate, candidates, onSelectCandidate, onBack }) {
  const [answers, setAnswers]       = useState([]);
  const [evals, setEvals]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [activeStage, setStage]     = useState(1);

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 14 }}>
              {candidates.map(c => (
                <div key={c.id} className="card card-sm" style={{ cursor: 'pointer' }} onClick={() => onSelectCandidate(c)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div className="avatar">{c.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: '#9CA3AF' }}>{c.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 7 }}>
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

  const stageUCs      = getActiveUCs(activeStage);
  const confirmedCount = evals.filter(e => e.is_confirmed && e.stage === activeStage).length;


  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <button className="btn btn-sm" onClick={onBack}>← Kembali</button>
        <div className="avatar avatar-lg">{candidate.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{candidate.name}</div>
          <div style={{ fontSize: 14, color: '#9CA3AF' }}>{candidate.email}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <DirectionBadge direction={candidate.direction} />
        </div>
      </div>



      {/* Stage tabs — navigasi utama */}
      <div className="tabs">
        {[
          { s:1, label:'Stage 1 — Aplikasi' },
          { s:2, label:'Stage 2 — SJT' },
          { s:3, label:'Stage 3 — Case Study' },
          { s:4, label:'Stage 4 — Panel' },
        ].map(({ s, label }) => (
          <button key={s} className={`tab-btn ${activeStage===s?'active':''}`} onClick={() => setStage(s)}>
            {label}
            {s === candidate.current_stage && <span style={{ marginLeft:5, color:'#2E75B6', fontSize:10 }}>●</span>}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span className={`badge-s${activeStage}`}>Stage {activeStage}</span>
        <span className="text-muted">{stageUCs.length} UC aktif</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{confirmedCount} dikonfirmasi</span>
      </div>

      <Alert type="warn">
        <strong>AI adalah pembantu, bukan penentu.</strong> Semua draft skor harus dikonfirmasi penilai. Override skor kapan pun diperlukan.
      </Alert>

      {loading ? <Spinner /> : stageUCs.map(uc => (
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
    </div>
  );
}
