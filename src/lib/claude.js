const BLACKBOX_URL = 'https://api.blackbox.ai/chat/completions';
const BLACKBOX_KEY = 'sk-PKD-A21l0vJrAwQBshBPNQ';
const MODEL = 'blackboxai/anthropic/claude-sonnet-4.5';

async function callClaude(systemPrompt, userContent) {
  const res = await fetch(BLACKBOX_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${BLACKBOX_KEY}` },
    body: JSON.stringify({ model: MODEL, max_tokens: 1000, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userContent }] })
  });
  if (!res.ok) throw new Error(`Blackbox error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export async function evaluateAnswer(uc, answerText) {
  return await callClaude(`Kamu evaluator rekrutmen Junior IT PM. Evaluasi jawaban kandidat untuk UC berikut.\nID: ${uc.id} | Judul: ${uc.title} | Klaster: ${uc.klaster}\n${uc.trap?'Trap: '+uc.trap:''}\nCari: ${uc.cari}\nWaspadai: ${uc.waspadai}\n${uc.signal?'Sinyal: '+uc.signal:''}\n\nOutput HANYA JSON: {"score":1|3|5,"reasoning":"maks 2 kalimat","evidence":"kutipan jawaban","direction":"pm_fit|neutral|product_lean","flag":null|"needs_probe"|"red_flag","flag_note":null|"catatan"}`, `Jawaban:\n\n${answerText}`);
}

export async function generateInterviewScript(candidate, evaluations, stage4Bank) {
  const evalSummary = evaluations.map(e => `${e.uc_id}: Skor ${e.final_score||e.ai_score}, ${e.ai_direction}, ${e.ai_flag||'ok'}. ${e.ai_reasoning||''}`).join('\n');
  const ucList = stage4Bank.map(u => `${u.id}: ${u.title}`).join('\n');
  return await callClaude(`Asisten panel interview Junior IT PM. Rekomendasikan 7 UC Stage 4 paling relevan.\nOutput HANYA JSON: {"selected_ucs":["UC_4_1"],"rationale":"2-3 kalimat","questions":[{"uc_id":"UC_4_1","custom_probe":"probe dipersonalisasi"}]}\nPilih tepat 7 UC. UC_4_1 dan UC_4_7 hampir selalu prioritas.`, `Kandidat: ${candidate.name}\nEvaluasi:\n${evalSummary}\nUC tersedia:\n${ucList}`);
}

export async function generateCandidateProfile(candidate, evaluations, bank) {
  const allUCs = [...bank.stage1,...bank.stage2,...bank.stage3,...bank.stage4];
  const detail = evaluations.map(e=>{const u=allUCs.find(x=>x.id===e.uc_id);return `${e.uc_id}(${u?.klaster||''}): Skor ${e.final_score||e.ai_score}, ${e.ai_direction}. ${e.ai_reasoning||''}`;}).join('\n');
  return await callClaude(`Analis rekrutmen Junior IT PM. Buat profil kandidat.\nOutput HANYA JSON: {"klaster_a":1-5,"klaster_b":1-5,"klaster_c":1-5,"klaster_d":1-5,"direction":"pm_fit|neutral|product_lean","direction_evidence":"1-2 kalimat","strengths":["x","y","z"],"gaps":["x","y","z"],"ai_recommendation":"hire|hire_with_dev|caution|no","ai_recommendation_note":"2-3 kalimat + disclaimer","matrix_position":"hire|hire_with_dev|caution|no"}`, `Kandidat: ${candidate.name}\nEvaluasi:\n${detail}`);
}
