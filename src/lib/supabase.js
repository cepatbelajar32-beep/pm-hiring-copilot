// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://mckfzghywtlthzeklzjb.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ja2Z6Z2h5d3RsdGh6ZWtsempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MTU1NzUsImV4cCI6MjA5NjE5MTU3NX0.Y9D5OmhPkOISr2SdyHUvKYkn0RA9CWBKJv7F--WhWe8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── BATCHES ───────────────────────────────────────────
export async function getBatches() {
  const { data, error } = await supabase.from('batches').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createBatch(name, stage1Ucs, stage2Ucs, stage3Uc, stage4Ucs) {
  const { data, error } = await supabase.from('batches').insert({
    name, stage1_ucs: stage1Ucs, stage2_ucs: stage2Ucs,
    stage3_uc: stage3Uc, stage4_ucs: stage4Ucs
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateBatchStatus(id, status) {
  const { error } = await supabase.from('batches').update({ status }).eq('id', id);
  if (error) throw error;
}

// ── CANDIDATES ────────────────────────────────────────
export async function getCandidates(batchId = null) {
  let query = supabase.from('candidates').select('*').order('created_at', { ascending: false });
  if (batchId) query = query.eq('batch_id', batchId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createCandidate(batchId, name, email) {
  const { data, error } = await supabase.from('candidates').insert({
    batch_id: batchId, name, email
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateCandidateStage(id, stage) {
  const { error } = await supabase.from('candidates').update({ current_stage: stage }).eq('id', id);
  if (error) throw error;
}

export async function updateCandidateDecision(id, direction, finalDecision) {
  const { error } = await supabase.from('candidates')
    .update({ direction, final_decision: finalDecision }).eq('id', id);
  if (error) throw error;
}

// ── ANSWERS ───────────────────────────────────────────
export async function getAnswers(candidateId) {
  const { data, error } = await supabase.from('answers')
    .select('*').eq('candidate_id', candidateId).order('stage');
  if (error) throw error;
  return data;
}

export async function saveAnswer(candidateId, stage, ucId, answerText) {
  // Upsert: kalau sudah ada, update
  const { data: existing } = await supabase.from('answers')
    .select('id').eq('candidate_id', candidateId).eq('uc_id', ucId).single();

  if (existing) {
    const { data, error } = await supabase.from('answers')
      .update({ answer_text: answerText }).eq('id', existing.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('answers')
      .insert({ candidate_id: candidateId, stage, uc_id: ucId, answer_text: answerText })
      .select().single();
    if (error) throw error;
    return data;
  }
}

// ── EVALUATIONS ───────────────────────────────────────
export async function getEvaluations(candidateId) {
  const { data, error } = await supabase.from('evaluations')
    .select('*').eq('candidate_id', candidateId).order('stage');
  if (error) throw error;
  return data;
}

export async function saveEvaluation(answerId, candidateId, ucId, stage, aiResult) {
  // Upsert
  const { data: existing } = await supabase.from('evaluations')
    .select('id').eq('candidate_id', candidateId).eq('uc_id', ucId).single();

  const payload = {
    answer_id: answerId, candidate_id: candidateId, uc_id: ucId, stage,
    ai_score: aiResult.score, ai_reasoning: aiResult.reasoning,
    ai_evidence: aiResult.evidence, ai_direction: aiResult.direction,
    ai_flag: aiResult.flag, final_score: aiResult.score,
    is_confirmed: false
  };

  if (existing) {
    const { data, error } = await supabase.from('evaluations')
      .update(payload).eq('id', existing.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('evaluations')
      .insert(payload).select().single();
    if (error) throw error;
    return data;
  }
}

export async function confirmEvaluation(evalId, finalScore, reviewerNote, reviewedBy) {
  const { error } = await supabase.from('evaluations').update({
    final_score: finalScore, reviewer_note: reviewerNote,
    reviewed_by: reviewedBy, reviewed_at: new Date().toISOString(),
    is_confirmed: true
  }).eq('id', evalId);
  if (error) throw error;
}

// Konfirmasi berdasarkan candidateId + ucId — tidak bergantung pada evalId yang mungkin undefined
export async function confirmEvaluationByUC(candidateId, ucId, finalScore, reviewerNote, reviewedBy) {
  const { error } = await supabase.from('evaluations').update({
    final_score: finalScore,
    reviewer_note: reviewerNote,
    reviewed_by: reviewedBy,
    reviewed_at: new Date().toISOString(),
    is_confirmed: true
  })
  .eq('candidate_id', candidateId)
  .eq('uc_id', ucId);
  if (error) throw error;
}

// ── INTERVIEW SCRIPTS ─────────────────────────────────
export async function saveInterviewScript(candidateId, selectedUcs, scriptJson, rationale) {
  const { data, error } = await supabase.from('interview_scripts').insert({
    candidate_id: candidateId, selected_ucs: selectedUcs,
    script_json: scriptJson, rationale
  }).select().single();
  if (error) throw error;
  return data;
}

export async function getLatestScript(candidateId) {
  const { data, error } = await supabase.from('interview_scripts')
    .select('*').eq('candidate_id', candidateId)
    .order('generated_at', { ascending: false }).limit(1).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ── CANDIDATE PROFILES ────────────────────────────────
export async function saveProfile(candidateId, profile) {
  const { data: existing } = await supabase.from('candidate_profiles')
    .select('id').eq('candidate_id', candidateId).single();

  const payload = { candidate_id: candidateId, ...profile, updated_at: new Date().toISOString() };

  if (existing) {
    const { error } = await supabase.from('candidate_profiles')
      .update(payload).eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('candidate_profiles').insert(payload);
    if (error) throw error;
  }
}

export async function getProfile(candidateId) {
  const { data, error } = await supabase.from('candidate_profiles')
    .select('*').eq('candidate_id', candidateId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ── CALIBRATION LOG ───────────────────────────────────
export async function getCalibrationLog(batchId) {
  const { data, error } = await supabase.from('calibration_log')
    .select('*').eq('batch_id', batchId).order('logged_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addCalibrationEntry(batchId, ucId, candidateRef, controversyNote, consensus, loggedBy) {
  const { error } = await supabase.from('calibration_log').insert({
    batch_id: batchId, uc_id: ucId, candidate_ref: candidateRef,
    controversy_note: controversyNote, consensus, logged_by: loggedBy
  });
  if (error) throw error;
}
