// src/components/Evaluasi.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ScoreBadge, DirectionBadge, StageBadge, Avatar, Spinner, FlagBadge, Alert, Modal } from './Shared';
import { getAnswers, getEvaluations, saveAnswer, saveEvaluation, confirmEvaluation, confirmEvaluationByUC, saveInterviewScript, getLatestScript, updateCandidateStage, updateCandidateDecision } from '../lib/supabase';
import { evaluateAnswer, generateInterviewScript } from '../lib/claude';
import { getActiveUCs, BANK } from '../data/bank';

// ── Stepper ───────────────────────────────────────────
function Stepper({ currentStage }) {
  const stages = ['Aplikasi', 'SJT', 'Case Study', 'Panel'];
  return (
    <div className="stepper" style={{ marginBottom: 20 }}>
      {stages.map((label, i) => {
        const s = i + 1;
        const state = currentStage === s ? 'active' : currentStage > s ? 'done' : '';
        return (
          <React.Fragment key={s}>
            {i > 0 && <div className={`step-line ${currentStage > i ? 'done' : ''}`} />}
            <div className={`step ${state}`}>
              <div className="step-circle">
                {currentStage > s ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : s}
              </div>
              <div className="step-label">{label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── UC Evaluasi Card ─────────────────────────────────
function UCCard({ uc, stage, candidateId, existingAnswer, existingEval, onEvalSaved }) {
  const [answer, setAnswer] = useState(existingAnswer?.answer_text || '');
  const [aiDraft, setAiDraft] = useState(existingEval || null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [overrideScore, setOverrideScore] = useState(existingEval?.final_score || null);
  const [reviewerNote, setReviewerNote] = useState('');
  const [confirmed, setConfirmed] = useState(existingEval?.is_confirmed || false);

  useEffect(() => {
    if (existingEval) {
      setAiDraft(existingEval);
      setOverrideScore(existingEval.final_score || existingEval.ai_score);
      setConfirmed(existingEval.is_confirmed);
    }
    if (existingAnswer) setAnswer(existingAnswer.answer_text || '');
  }, [existingEval, existingAnswer]);

  async function handleEvaluate() {
    if (!answer.trim()) { alert('Isi jawaban kandidat terlebih dahulu.'); return; }
    setLoading(true);
    try {
      const savedAnswer = await saveAnswer(candidateId, stage, uc.id, answer);
      const result = await evaluateAnswer(uc, answer);
      const savedEval = await saveEvaluation(savedAnswer.id, candidateId, uc.id, stage, result);
      setAiDraft({ ...result, id: savedEval.id });
      setOverrideScore(result.score);
      setConfirmed(false);
      onEvalSaved && onEvalSaved();
    } catch (e) {
      alert('Evaluasi gagal: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!aiDraft) return;
    // Ambil skor dari state override, fallback ke skor AI
    const scoreToSave = Number(overrideScore) || Number(aiDraft.ai_score) || Number(aiDraft.score) || 3;
    setConfirming(true);
    try {
      // Pakai confirmEvaluationByUC — lebih reliable, tidak butuh evalId
      await confirmEvaluationByUC(candidateId, uc.id, scoreToSave, reviewerNote, 'Panel');
      setAiDraft(prev => ({ ...prev, final_score: scoreToSave, is_confirmed: true }));
      setConfirmed(true);
      onEvalSaved && onEvalSaved();
    } catch (e) {
      alert('Konfirmasi gagal: ' + e.message);
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className={`uc-card ${true ? 'uc-active' : ''}`}>
      <div className="uc-header">
        <span className="uc-code">{uc.id}</span>
        <span className="uc-title">{uc.title}</span>
        {uc.mechanism && <span className="badge badge-purple">{uc.mechanism}</span>}
        <span className="badge badge-blue">Klaster {uc.klaster}</span>
        {confirmed && <span className="confirmed-pill" style={{ marginLeft: 'auto' }}>✓ Dikonfirmasi</span>}
      </div>

      <div className="uc-prompt">{uc.prompt}</div>

      {uc.trap && (
        <div className="uc-trap">
          <strong>Trap clause (hanya untuk penilai):</strong> {uc.trap}
        </div>
      )}

      <div className="uc-meta" style={{ marginBottom: 12 }}>
        <span className="uc-cari"><strong>Cari:</strong> {uc.cari}</span>
        <span className="uc-waspadai"><strong>Waspadai:</strong> {uc.waspadai}</span>
        {uc.signal && <span style={{ color: '#2E75B6' }}><strong>Sinyal:</strong> {uc.signal}</span>}
      </div>

      <div className="field">
        <label>Jawaban kandidat</label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Paste atau ketik jawaban kandidat di sini..."
          rows={5}
          disabled={confirmed}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <button
          className="btn btn-blue btn-sm"
          onClick={handleEvaluate}
          disabled={loading || confirmed || !answer.trim()}
        >
          {loading ? <><div className="spinner" /> Mengevaluasi...</> : '🤖 Evaluasi dengan AI'}
        </button>
        {aiDraft && !confirmed && (
          <span className="draft-pill">Draft AI — menunggu konfirmasi</span>
        )}
      </div>

      {aiDraft && (
        <div className="ai-draft">
          <div className="ai-draft-header">
            <span className="ai-draft-label">Draft AI</span>
            <ScoreBadge score={aiDraft.ai_score || aiDraft.score} />
            <DirectionBadge direction={aiDraft.ai_direction || aiDraft.direction} />
            <FlagBadge flag={aiDraft.ai_flag || aiDraft.flag} />
          </div>

          <div className="ai-reasoning">
            <strong>Reasoning:</strong> {aiDraft.ai_reasoning || aiDraft.reasoning}
          </div>
          <div className="ai-evidence">
            <strong>Evidence:</strong> "{aiDraft.ai_evidence || aiDraft.evidence}"
          </div>
          {(aiDraft.ai_flag || aiDraft.flag) && (aiDraft.flag_note || aiDraft.ai_flag) && (
            <div className="ai-flag-note">
              <strong>Catatan untuk panel:</strong> {aiDraft.flag_note || aiDraft.ai_flag}
            </div>
          )}

          {!confirmed && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: '#4B5563', fontWeight: 600, marginBottom: 4, display: 'block' }}>Override skor:</label>
                <select
                  value={overrideScore ?? (aiDraft?.ai_score ?? aiDraft?.score ?? 3)}
                  onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) setOverrideScore(v); }}
                  style={{ padding: '5px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #E5E7EB' }}
                >
                  <option value={1}>1 — Red Flag</option>
                  <option value={3}>3 — Average Fresh Grad</option>
                  <option value={5}>5 — Future Senior PM</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={{ fontSize: 11, color: '#4B5563', fontWeight: 600, marginBottom: 4, display: 'block' }}>Catatan penilai (opsional):</label>
                <input
                  type="text"
                  placeholder="Catatan override atau observasi..."
                  value={reviewerNote}
                  onChange={e => setReviewerNote(e.target.value)}
                  style={{ padding: '5px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #E5E7EB', width: '100%' }}
                />
              </div>
              <button
                className="btn btn-green btn-sm"
                onClick={handleConfirm}
                disabled={confirming}
                style={{ flexShrink: 0 }}
              >
                {confirming ? <><div className="spinner" /> Menyimpan...</> : '✓ Konfirmasi Skor'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Script Generator ──────────────────────────────────
function ScriptPanel({ candidate, evaluations }) {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);

  async function handleGenerate() {
    if (evaluations.length === 0) { alert('Evaluasi minimal 1 UC terlebih dahulu.'); return; }
    setLoading(true);
    try {
      const result = await generateInterviewScript(candidate, evaluations, BANK.stage4);
      await saveInterviewScript(candidate.id, result.selected_ucs, result, result.rationale);
      setScript(result);
    } catch (e) {
      alert('Gagal generate script: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ borderColor: '#2E75B6', borderWidth: 1.5 }}>
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
          <Alert type="success">Script berhasil di-generate — ini rekomendasi AI, penilai tetap bisa menyesuaikan.</Alert>
          <div style={{ fontSize: 13, marginBottom: 12 }}>
            <strong>Rationale:</strong> {script.rationale}
          </div>
          {(script.questions || []).map(q => {
            const uc = BANK.stage4.find(u => u.id === q.uc_id);
            return (
              <div key={q.uc_id} style={{ padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 8, borderLeft: '3px solid #2E75B6' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span className="uc-code">{q.uc_id}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{uc?.title || ''}</span>
                </div>
                <div style={{ fontSize: 13, color: '#2E75B6', fontStyle: 'italic' }}>
                  Probe: {q.custom_probe}
                </div>
                {uc?.prompt && (
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                    Prompt standar: {uc.prompt.slice(0, 120)}...
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ── Main Evaluasi Component ───────────────────────────
export default function Evaluasi({ candidate, candidates, onSelectCandidate, onBack }) {
  const [answers, setAnswers] = useState([]);
  const [evals, setEvals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(1);

  const loadData = useCallback(async () => {
    if (!candidate) return;
    setLoading(true);
    try {
      const [a, e] = await Promise.all([
        getAnswers(candidate.id),
        getEvaluations(candidate.id)
      ]);
      setAnswers(a);
      setEvals(e);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [candidate]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (candidate) setActiveStage(candidate.current_stage); }, [candidate]);

  if (!candidate) {
    return (
      <div>
        <div className="card-title" style={{ marginBottom: 12 }}>Pilih kandidat untuk dievaluasi</div>
        {candidates.length === 0 ? (
          <Alert type="warn">Belum ada kandidat. Tambahkan kandidat dari Dashboard terlebih dahulu.</Alert>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {candidates.map(c => (
              <div key={c.id} className="card card-sm" style={{ cursor: 'pointer' }} onClick={() => onSelectCandidate(c)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Avatar name={c.name} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                    <div className="text-xs text-muted">{c.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className={`badge badge-s${c.current_stage}`}>Stage {c.current_stage}</span>
                  <DirectionBadge direction={c.direction} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const stageUCs = getActiveUCs(activeStage);
  const confirmedCount = evals.filter(e => e.is_confirmed && e.stage === activeStage).length;

  return (
    <div>
      {/* Header kandidat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-sm" onClick={onBack}>← Kembali</button>
        <Avatar name={candidate.name} size="lg" />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{candidate.name}</div>
          <div className="text-muted">{candidate.email}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <DirectionBadge direction={candidate.direction} />
        </div>
      </div>

      <Stepper currentStage={candidate.current_stage} />

      {/* Stage tabs */}
      <div className="tabs">
        {[1, 2, 3, 4].map(s => (
          <button
            key={s}
            className={`tab-btn ${activeStage === s ? 'active' : ''}`}
            onClick={() => setActiveStage(s)}
          >
            Stage {s}
            {s === candidate.current_stage && <span style={{ marginLeft: 4, fontSize: 10, color: '#2E75B6' }}>●</span>}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`badge badge-s${activeStage}`}>Stage {activeStage}</span>
            <span className="text-muted">{stageUCs.length} UC</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{confirmedCount} sudah dikonfirmasi</span>
          </div>

          <Alert type="warn">
            <strong>AI adalah pembantu, bukan penentu.</strong> Semua draft skor harus dikonfirmasi oleh penilai sebelum tersimpan permanen. Override skor kapan pun diperlukan.
          </Alert>

          {stageUCs.map(uc => (
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

          {activeStage >= 2 && evals.filter(e => e.stage <= activeStage - 1).length > 0 && (
            <ScriptPanel candidate={candidate} evaluations={evals} />
          )}
        </>
      )}
    </div>
  );
}
