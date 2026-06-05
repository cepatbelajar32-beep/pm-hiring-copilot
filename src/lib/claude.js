// src/lib/claude.js
// Menggunakan Blackbox API (OpenAI-compatible format)

const BLACKBOX_URL = 'https://api.blackbox.ai/chat/completions';
const BLACKBOX_KEY = 'sk-PKD-A21l0vJrAwQBshBPNQ';
const MODEL = 'blackboxai/anthropic/claude-sonnet-4.5';

async function callClaude(systemPrompt, userContent, maxTokens = 1200) {
  const res = await fetch(BLACKBOX_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BLACKBOX_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Blackbox API error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── EVALUATE ANSWER ───────────────────────────────────────────────────────────
export async function evaluateAnswer(uc, answerText) {
  const calibCtx = uc.calibration_warning
    ? `\nKONTEKS KALIBRASI FRESH GRAD untuk UC ini:\n${uc.calibration_warning.text}\nImplikasi penilaian: ${
        uc.calibration_warning.type === 'score3ok'
          ? 'Score 3 sudah merupakan hasil yang bagus untuk UC ini. Jangan terlalu cepat beri Score 1 hanya karena jawabannya tidak sekompleks jawaban senior.'
          : uc.calibration_warning.type === 'context'
          ? 'Nilai kemampuan berpikirnya, bukan kedalaman pengalamannya. Fresh grad belum punya pengalaman langsung di konteks ini.'
          : uc.calibration_warning.type === 'scale'
          ? 'Jangan harapkan cerita berskala besar. Nilai apakah ada pola yang benar dalam skala yang mereka punya.'
          : 'Nilai substansi jawaban dan logika berpikirnya, bukan cara penyampaiannya.'
      }`
    : '';

  const systemPrompt = `Kamu adalah evaluator rekrutmen Junior IT Project Manager (IT PM).
Konteks organisasi: perusahaan non-teknologi, departemen IT internal, sistem kerja campuran antara perencanaan terstruktur dan pelaksanaan fleksibel.
Kandidat: fresh graduate, belum berpengalaman kerja profesional.
Tugas: evaluasi jawaban kandidat untuk pertanyaan rekrutmen berikut.
${calibCtx}

=== PERTANYAAN YANG DIEVALUASI ===
ID: ${uc.id}
Judul: ${uc.title}
Kompetensi yang diukur: ${uc.klaster}
${uc.mechanism ? `Mekanisme khusus: ${uc.mechanism}` : ''}
${uc.trap ? `Situasi tersembunyi yang perlu diperhatikan penilai: ${uc.trap}` : ''}

Yang ingin dilihat (Skor 5): ${uc.cari}
Yang perlu diwaspadai (Skor 1): ${uc.waspadai}
${uc.signal ? `Sinyal arah PM vs Product Manager: ${uc.signal}` : ''}

=== RUBRIK PENILAIAN ===
Skor 1 (Sinyal mengkhawatirkan): Jawaban menunjukkan pola yang menjadi perhatian — akan sulit berkembang di role ini.
Skor 3 (Rata-rata fresh grad): Jawaban masuk akal tapi masih generik, belum menunjukkan kedalaman atau cara berpikir yang khas.
Skor 5 (Calon Senior PM): Jawaban menunjukkan pola yang dicari — ada potensi nyata untuk berkembang menjadi Senior PM.

=== INSTRUKSI OUTPUT ===
Berikan output HANYA dalam format JSON valid, tanpa teks tambahan apapun:
{
  "score": 1 atau 3 atau 5,
  "reasoning": "penjelasan kenapa skor ini dalam 1-2 kalimat bahasa Indonesia yang natural",
  "evidence": "kutipan atau rangkuman spesifik dari jawaban yang mendukung skor (1 kalimat)",
  "direction": "pm_fit" atau "neutral" atau "product_lean",
  "flag": null atau "needs_probe" atau "red_flag",
  "flag_note": "catatan spesifik untuk panel jika ada flag, atau null",

  "individuality_note": null atau string — apakah kandidat cenderung menyembunyikan kontribusi individualnya dengan bersembunyi di balik kata 'kami/tim'? Isi dengan observasi konkret jika terdeteksi, null jika tidak ada indikasi. Contoh isi: "Kandidat konsisten menggunakan 'kami' dan tidak pernah menjelaskan apa yang spesifik dia lakukan — perlu digali lebih dalam di sesi langsung.",

  "authenticity_flag": null atau "possible_exaggeration" atau "possible_ai_generated" atau "inconsistent_detail",
  "authenticity_note": null atau string — penjelasan konkret jika ada keraguan keaslian. Isi jika ada salah satu dari ini: (a) klaim yang terlalu besar untuk fresh grad tanpa detail yang kredibel, (b) jawaban terlalu sempurna, formal, dan terstruktur seperti tulisan AI — tidak ada keraguan, kesalahan kecil, atau ungkapan personal, (c) detail yang terlalu spesifik tapi tidak konsisten satu sama lain.
}

Catatan penting:
- Kamu adalah PEMBANTU penilai manusia, bukan penentu keputusan. Output ini adalah DRAFT.
- Jawaban pendek bukan otomatis Skor 1 — gali dulu sebelum menilai rendah.
- Pengalaman dari organisasi kampus atau kepanitiaan adalah bukti yang valid.
- "product_lean" bukan berarti buruk — hanya sinyal bahwa kandidat mungkin lebih cocok di role Product Manager.
- Untuk individuality_note: bedakan antara kandidat yang genuinely bekerja dalam tim (bukan masalah) vs yang tidak bisa atau sungkan mengidentifikasi kontribusinya sendiri (perlu digali).
- Untuk authenticity_flag: jangan terlalu mudah men-flag. Hanya flag jika ada indikasi yang cukup kuat.`;

  return await callClaude(systemPrompt, `Jawaban kandidat:\n\n${answerText}`);
}

// ── ANALISIS KONSISTENSI (aspek 3 — cross-UC) ────────────────────────────────
export async function analyzeConsistency(candidate, allAnswers, allEvals) {
  // Gabungkan jawaban + evaluasi per UC untuk analisis lintas jawaban
  const answersDetail = allAnswers.map(a => {
    const ev = allEvals.find(e => e.uc_id === a.uc_id);
    return `${a.uc_id} | Skor: ${ev?.final_score || ev?.ai_score || '?'} | Jawaban: ${(a.answer_text || '').slice(0, 400)}`;
  }).join('\n\n---\n\n');

  const systemPrompt = `Kamu adalah analis rekrutmen berpengalaman yang menilai konsistensi dan keaslian jawaban kandidat secara menyeluruh.

Tugasmu: baca SEMUA jawaban kandidat berikut secara bersamaan, lalu identifikasi:
1. Apakah ada kontradiksi antar jawaban — misalnya di satu jawaban klaim selalu bertanggung jawab, tapi di jawaban lain semua masalah disebabkan orang lain
2. Apakah ada pola membual atau melebih-lebihkan yang terlihat dari keseluruhan jawaban
3. Apakah kandidat konsisten menyembunyikan kontribusi individualnya di semua jawaban, atau hanya di sebagian
4. Apakah ada jawaban yang terasa seperti di-generate AI atau dihafal dari template — berbeda gaya dengan jawaban lainnya

Berikan output HANYA dalam format JSON valid:
{
  "overall_consistency": "tinggi" atau "sedang" atau "rendah",
  "consistency_summary": "ringkasan umum konsistensi kandidat dalam 2-3 kalimat",
  "contradictions": [
    {
      "uc_ids": ["UC_X_Y", "UC_A_B"],
      "description": "penjelasan konkret kontradiksinya — apa yang berbeda antara dua jawaban ini"
    }
  ],
  "exaggeration_signals": [
    {
      "uc_id": "UC_X_Y",
      "description": "klaim spesifik yang terasa berlebihan dan alasannya"
    }
  ],
  "individuality_pattern": null atau "kandidat konsisten menggunakan 'kami' di hampir semua jawaban tanpa pernah menjelaskan apa yang spesifik dia lakukan" atau penjelasan pola lain,
  "authenticity_concerns": [
    {
      "uc_id": "UC_X_Y",
      "type": "possible_ai_generated" atau "memorized_template" atau "inconsistent_with_others",
      "description": "penjelasan konkret kekhawatirannya"
    }
  ],
  "probe_recommendations": [
    "Pertanyaan probe spesifik yang disarankan untuk digali di Stage 4 berdasarkan inkonsistensi yang ditemukan"
  ],
  "overall_note": "catatan keseluruhan untuk panel — apa yang paling penting untuk diperhatikan"
}

Catatan:
- Kosongkan array jika tidak ada temuan di kategori tersebut (jangan isi dengan asumsi)
- Fokus pada bukti konkret dari teks jawaban, bukan spekulasi
- Tone-nya adalah kolega yang membantu, bukan hakim`;

  return await callClaude(
    systemPrompt,
    `Kandidat: ${candidate.name}\n\nSemua jawaban (${allAnswers.length} UC):\n\n${answersDetail}`,
    2000
  );
}

// ── GENERATE INTERVIEW SCRIPT ─────────────────────────────────────────────────
export async function generateInterviewScript(candidate, evaluations, stage4Bank) {
  const evalSummary = evaluations.map(e =>
    `${e.uc_id}: Skor ${e.final_score || e.ai_score}, Arah ${e.ai_direction || '-'}, Flag: ${e.ai_flag || 'tidak ada'}. ${e.ai_reasoning || ''}`
  ).join('\n');

  const ucList = stage4Bank.map(u => `${u.id}: ${u.title} (Kompetensi ${u.klaster})`).join('\n');

  const systemPrompt = `Kamu adalah asisten panel interview rekrutmen Junior IT PM.
Berdasarkan hasil evaluasi kandidat, rekomendasikan 7 pertanyaan Stage 4 yang paling relevan dan sesuaikan probe-nya dengan profil kandidat ini.

Konteks: rekrutmen untuk IT internal perusahaan. AI adalah PEMBANTU — rekomendasi ini untuk dipertimbangkan panel, bukan keputusan final.

Berikan output HANYA dalam format JSON valid:
{
  "selected_ucs": ["UC_4_1", "UC_4_2"],
  "rationale": "penjelasan singkat kenapa pertanyaan-pertanyaan ini dipilih untuk kandidat ini (2-3 kalimat)",
  "questions": [
    {
      "uc_id": "UC_4_1",
      "custom_probe": "pertanyaan atau konteks yang disesuaikan dengan pola jawaban kandidat ini"
    }
  ]
}

Panduan memilih:
- Pilih tepat 7 UC dari daftar yang tersedia
- UC_4_1 (Momen Pengalihan) dan UC_4_7 (Keterbukaan terhadap Masukan) hampir selalu perlu ada
- Sesuaikan probe dengan jawaban konkret yang sudah diberikan di Stage sebelumnya
- Jika ada indikasi arah Product Manager, prioritaskan UC_4_1 dan UC_4_5
- Jika ada kekhawatiran soal rasa tanggung jawab atau keterbukaan menerima masukan, prioritaskan UC_4_7 dan UC_4_2`;

  return await callClaude(
    systemPrompt,
    `Kandidat: ${candidate.name}\n\nHasil evaluasi:\n${evalSummary}\n\nPertanyaan Stage 4 yang tersedia:\n${ucList}`,
    2000
  );
}

// ── GENERATE CANDIDATE PROFILE ────────────────────────────────────────────────
export async function generateCandidateProfile(candidate, evaluations, bank) {
  const allUCs = [...bank.stage1, ...bank.stage2, ...bank.stage3, ...bank.stage4];
  const evalDetail = evaluations.map(e => {
    const uc = allUCs.find(u => u.id === e.uc_id);
    return `${e.uc_id} (${uc?.title || ''}, Kompetensi ${uc?.klaster || ''}): Skor ${e.final_score || e.ai_score}, Arah ${e.ai_direction || '-'}. ${e.ai_reasoning || ''}`;
  }).join('\n');

  const systemPrompt = `Kamu adalah analis rekrutmen Junior IT PM.
Buat profil komprehensif kandidat berdasarkan semua evaluasi.

Berikan output HANYA dalam format JSON valid:
{
  "klaster_a": angka 1-5 dengan 1 desimal (rata-rata skor UC kompetensi A),
  "klaster_b": angka 1-5 dengan 1 desimal (rata-rata skor UC kompetensi B),
  "klaster_c": angka 1-5 dengan 1 desimal (rata-rata skor UC kompetensi C),
  "klaster_d": angka 1-5 dengan 1 desimal (rata-rata skor UC kompetensi D),
  "direction": "pm_fit" atau "neutral" atau "product_lean",
  "direction_evidence": "bukti konkret dari evaluasi yang mendukung arah ini (1-2 kalimat)",
  "strengths": ["kekuatan 1", "kekuatan 2", "kekuatan 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "ai_recommendation": "hire" atau "hire_with_dev" atau "caution" atau "no",
  "ai_recommendation_note": "penjelasan rekomendasi dalam 2-3 kalimat, termasuk pernyataan bahwa ini rekomendasi AI dan keputusan final ada di tangan panel",
  "matrix_position": "hire" atau "hire_with_dev" atau "caution" atau "no"
}`;

  return await callClaude(
    systemPrompt,
    `Kandidat: ${candidate.name}\n\nDetail evaluasi:\n${evalDetail}`
  );
}
