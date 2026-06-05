// src/lib/claude.js — AI evaluation & script generation

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

async function callClaude(systemPrompt, userContent) {
  const res = await fetch(CLAUDE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }]
    })
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── EVALUATE ANSWER ───────────────────────────────────
export async function evaluateAnswer(uc, answerText) {
  const systemPrompt = `Kamu adalah evaluator rekrutmen Junior IT Project Manager (IT PM).
Konteks organisasi: korporat non-tech, IT internal, hybrid waterfall-agile.
Kandidat: fresh graduate, belum berpengalaman kerja.
Tugas: evaluasi jawaban kandidat untuk use case berikut.

=== USE CASE ===
ID: ${uc.id}
Judul: ${uc.title}
Klaster kompetensi: ${uc.klaster}
${uc.mechanism ? `Mekanisme deteksi: ${uc.mechanism}` : ''}
${uc.trap ? `Trap clause (untuk penilai): ${uc.trap}` : ''}

Yang dicari (Score 5): ${uc.cari}
Yang perlu diwaspadai (Score 1): ${uc.waspadai}
${uc.signal ? `Sinyal PM vs Product: ${uc.signal}` : ''}

=== RUBRIK ===
Score 1 (Red Flag): Jawaban menunjukkan pola yang diwaspadai — akan sulit di role ini.
Score 3 (Average Fresh Grad): Kompeten tapi generik, tidak menunjukkan kedalaman atau diferensiasi.
Score 5 (Future Senior PM): Menunjukkan pola yang dicari — potensi Senior PM terlihat.

=== INSTRUKSI OUTPUT ===
Berikan output HANYA dalam format JSON valid, tanpa teks lain:
{
  "score": 1 atau 3 atau 5,
  "reasoning": "penjelasan singkat kenapa skor ini (maks 2 kalimat, bahasa Indonesia)",
  "evidence": "kutipan atau parafrase spesifik dari jawaban yang mendukung skor (maks 1 kalimat)",
  "direction": "pm_fit" atau "neutral" atau "product_lean",
  "flag": null atau "needs_probe" atau "red_flag",
  "flag_note": "catatan spesifik untuk panel jika ada flag, atau null"
}

Penting:
- AI adalah PEMBANTU, bukan penentu. Output adalah DRAFT untuk dikonfirmasi penilai manusia.
- Jika jawaban terlalu singkat untuk dinilai, beri score 1 dengan flag "needs_probe".
- Direction "product_lean" bukan berarti buruk — hanya sinyal salah role untuk posisi PM ini.`;

  return await callClaude(systemPrompt, `Jawaban kandidat:\n\n${answerText}`);
}

// ── GENERATE INTERVIEW SCRIPT ─────────────────────────
export async function generateInterviewScript(candidate, evaluations, stage4Bank) {
  const evalSummary = evaluations.map(e => {
    const uc = e.uc_id;
    return `${uc}: Skor final ${e.final_score || e.ai_score}, Arah ${e.ai_direction || '-'}, Flag: ${e.ai_flag || 'none'}. Reasoning: ${e.ai_reasoning || '-'}`;
  }).join('\n');

  const ucList = stage4Bank.map(u => `${u.id}: ${u.title} (Klaster ${u.klaster})`).join('\n');

  const systemPrompt = `Kamu adalah asisten panel interview rekrutmen Junior IT PM.
Tugasmu: berdasarkan hasil evaluasi kandidat di Stage 1-3, rekomendasikan 7 UC Stage 4 yang paling perlu digali dan personalisasi probe-nya.

Konteks: PM hiring untuk IT internal korporat, hybrid waterfall-agile. AI adalah PEMBANTU — rekomendasi ini untuk dipertimbangkan panel, bukan keputusan final.

Berikan output HANYA dalam format JSON valid:
{
  "selected_ucs": ["UC_4_X", "UC_4_Y", ...],
  "rationale": "penjelasan singkat kenapa UC ini diprioritaskan untuk kandidat ini (2-3 kalimat)",
  "questions": [
    {
      "uc_id": "UC_4_X",
      "custom_probe": "pertanyaan/konteks yang dipersonalisasi berdasarkan gap atau pola kandidat ini"
    }
  ]
}

Penting:
- Pilih tepat 7 UC dari daftar yang tersedia
- UC_4_1 (Redirection Moment) dan UC_4_7 (Coachability Real-Time) hampir selalu prioritas
- Personalisasi probe berdasarkan jawaban konkret di Stage 1-3
- Jika ada indikasi Product-lean, prioritaskan UC_4_1 dan UC_4_5
- Jika ada red flag ownership/coachability, prioritaskan UC_4_7 dan UC_4_2`;

  const userContent = `Kandidat: ${candidate.name}

Hasil evaluasi Stage 1-3:
${evalSummary}

Daftar UC Stage 4 yang tersedia:
${ucList}`;

  return await callClaude(systemPrompt, userContent);
}

// ── GENERATE CANDIDATE PROFILE ────────────────────────
export async function generateCandidateProfile(candidate, evaluations, bank) {
  const evalDetail = evaluations.map(e => {
    const allUCs = [...bank.stage1, ...bank.stage2, ...bank.stage3, ...bank.stage4];
    const uc = allUCs.find(u => u.id === e.uc_id);
    return `${e.uc_id} (${uc?.title || ''}, Klaster ${uc?.klaster || ''}): Skor ${e.final_score || e.ai_score}, Arah ${e.ai_direction || '-'}. ${e.ai_reasoning || ''}`;
  }).join('\n');

  const systemPrompt = `Kamu adalah analis rekrutmen Junior IT PM.
Tugasmu: berdasarkan semua evaluasi kandidat, buat profil kandidat yang komprehensif.

Berikan output HANYA dalam format JSON valid:
{
  "klaster_a": rata-rata skor UC dengan klaster A (angka 1-5, 1 desimal),
  "klaster_b": rata-rata skor UC dengan klaster B,
  "klaster_c": rata-rata skor UC dengan klaster C,
  "klaster_d": rata-rata skor UC dengan klaster D,
  "direction": "pm_fit" atau "neutral" atau "product_lean",
  "direction_evidence": "bukti konkret dari evaluasi yang mendukung arah ini (1-2 kalimat)",
  "strengths": ["kekuatan 1", "kekuatan 2", "kekuatan 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "ai_recommendation": "hire" atau "hire_with_dev" atau "caution" atau "no",
  "ai_recommendation_note": "penjelasan singkat rekomendasi (2-3 kalimat, termasuk disclaimer bahwa ini rekomendasi AI bukan keputusan final)",
  "matrix_position": "hire" atau "hire_with_dev" atau "caution" atau "no"
}`;

  return await callClaude(systemPrompt, `Kandidat: ${candidate.name}\n\nDetail evaluasi:\n${evalDetail}`);
}
