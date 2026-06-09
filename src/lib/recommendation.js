// ── Logika Rekomendasi Hire/No Hire ──────────────────
// Sumber kebenaran tunggal — dipakai di Analisis Akhir dan Profil Kandidat

export function calcKlasterScores(evals, bank) {
  const scores = { A:[], B:[], C:[], D:[] };
  const allUCs = [...bank.stage1, ...bank.stage2, ...bank.stage3, ...bank.stage4];
  evals.forEach(e => {
    const uc = allUCs.find(u => u.id === e.uc_id);
    const score = Number(e.final_score || e.ai_score);
    if (uc && score) {
      (uc.klaster || '').split('/').forEach(k => {
        if (scores[k.trim()]) scores[k.trim()].push(score);
      });
    }
  });
  const avg = arr => arr.length ? arr.reduce((a,b) => a+b,0) / arr.length : 0;
  return {
    A: avg(scores.A),
    B: avg(scores.B),
    C: avg(scores.C),
    D: avg(scores.D),
    raw: scores,
  };
}

// UC yang merupakan gerbang mati Klaster D
const GATE_UCS = ['UC_1_3', 'UC_1_5', 'UC_1_7', 'UC_1_9', 'UC_1_10',
                  'UC_2_6', 'UC_4_4', 'UC_4_6'];

export function calcRecommendation(evals, bank, consistencyResult, direction) {
  const klaster = calcKlasterScores(evals, bank);

  // Hitung flag keaslian
  const authFlags = evals.filter(e => e.authenticity_flag);
  // Strong: klaim membesar atau detail tidak konsisten — lebih berbahaya karena intentional
  const strongFlags = authFlags.filter(e =>
    e.authenticity_flag === 'possible_exaggeration' ||
    e.authenticity_flag === 'inconsistent_detail'
  );
  // Mild: kemungkinan ditulis AI — bisa tidak sengaja, tapi tetap perlu diperhatikan
  const mildFlags = authFlags.filter(e =>
    e.authenticity_flag === 'possible_ai_generated'
  );
  const totalFlags = authFlags.length;

  // Konsistensi dari Review Konsistensi AI
  const consistency = consistencyResult?.overall_consistency || null;
  const contradictions = (consistencyResult?.contradictions || []).length;
  const exaggerations = (consistencyResult?.exaggeration_signals || []).filter(
    s => s.severity === 'kuat'
  ).length;

  // Cek gerbang mati Klaster D — skor 1 di UC gate
  const gateFailures = evals.filter(e =>
    GATE_UCS.includes(e.uc_id) && (e.final_score || e.ai_score) === 1
  );

  // Arah product_lean
  const isProductLean = direction === 'product_lean';
  const isProductLeanStrong = isProductLean && evals.filter(e =>
    e.ai_direction === 'product_lean'
  ).length >= 3;

  // ── Evaluasi kriteria ─────────────────────────────
  const reasons = { hire:[], hire_with_dev:[], caution:[], no:[] };

  // NO — kriteria absolut
  if (gateFailures.length > 0) {
    reasons.no.push(`Skor 1 di UC gerbang mati: ${gateFailures.map(e => e.uc_id).join(', ')}`);
  }
  if (klaster.A < 2.5 && klaster.B < 2.5) {
    reasons.no.push(`Klaster A (${klaster.A.toFixed(1)}) dan B (${klaster.B.toFixed(1)}) di bawah 2.5`);
  }
  if (consistency === 'rendah' && strongFlags.length >= 2) {
    reasons.no.push('Konsistensi rendah + 2+ flag keaslian kuat — data tidak bisa dipercaya');
  }
  if (strongFlags.length >= 3) {
    reasons.no.push(`${strongFlags.length} flag keaslian kuat — jawaban diragukan keasliannya`);
  }
  if (totalFlags >= 4 && strongFlags.length >= 2) {
    // Banyak flag DAN ada strong flag = NO
    reasons.no.push(`${totalFlags} flag keaslian dengan ${strongFlags.length} flag kuat — pola keaslian serius`);
  }
  // possible_ai_generated banyak = caution, bukan NO — karena ini deteksi probabilistik
  // NO hanya untuk strong flags (exaggeration/inconsistent) yang lebih intentional
  if (isProductLeanStrong && klaster.A >= 3.5) {
    reasons.no.push('Arah Product Manager konsisten dan kuat di semua stage — salah pintu');
  }
  if (exaggerations >= 2) {
    reasons.no.push(`${exaggerations} sinyal membesar-besarkan dengan severity kuat terdeteksi`);
  }

  // HATI-HATI — kriteria warning
  if (klaster.C < 3.0) {
    reasons.caution.push(`Klaster C (${klaster.C.toFixed(1)}) di bawah 3.0 — risiko grooming gagal`);
  }
  if (consistency === 'rendah' && contradictions >= 2) {
    reasons.caution.push(`Konsistensi rendah dengan ${contradictions} kontradiksi — interpretasi skor perlu diverifikasi`);
  }
  if (strongFlags.length === 1) {
    reasons.caution.push('1 flag keaslian kuat — perlu verifikasi di panel');
  }
  if (mildFlags.length >= 2 && strongFlags.length >= 1) {
    reasons.caution.push(`${mildFlags.length} flag ringan + ${strongFlags.length} flag kuat — pola keaslian mencurigakan`);
  }
  if (totalFlags >= 2 && totalFlags < 4) {
    reasons.caution.push(`${totalFlags} flag keaslian terdeteksi — perlu verifikasi di panel`);
  }
  if (mildFlags.length >= 3) {
    reasons.caution.push(`${mildFlags.length} jawaban terindikasi ditulis AI — verifikasi gaya penulisan di panel`);
  }
  if (totalFlags >= 4 && strongFlags.length < 2) {
    // Banyak flag tapi kebanyakan mild = hati-hati, bukan NO
    reasons.caution.push(`${totalFlags} flag keaslian total (mayoritas AI-generated) — perlu probing mendalam di panel`);
  }
  if (isProductLean && !isProductLeanStrong) {
    reasons.caution.push('Indikasi arah Product Manager — perlu probing lebih dalam di panel');
  }
  if (exaggerations === 1) {
    reasons.caution.push('1 sinyal membesar-besarkan kuat terdeteksi — verifikasi di panel');
  }

  // HIRE dengan Pengembangan
  if (klaster.A >= 3.0 && klaster.A < 4.0) {
    reasons.hire_with_dev.push(`Klaster A (${klaster.A.toFixed(1)}) — potensi ada, perlu pengembangan cognitive`);
  }
  if (klaster.B >= 3.0 && klaster.B < 4.0) {
    reasons.hire_with_dev.push(`Klaster B (${klaster.B.toFixed(1)}) — orchestration perlu digrooming`);
  }
  if (klaster.C >= 3.0 && klaster.C < 3.5) {
    reasons.hire_with_dev.push(`Klaster C (${klaster.C.toFixed(1)}) — karakter cukup tapi belum matang`);
  }
  if (consistency === 'sedang') {
    reasons.hire_with_dev.push('Konsistensi sedang — ada inkonsistensi kecil yang perlu diperhatikan');
  }

  // HIRE
  if (klaster.A >= 4.0) {
    reasons.hire.push(`Klaster A (${klaster.A.toFixed(1)}) — cognitive kuat`);
  }
  if (klaster.B >= 4.0) {
    reasons.hire.push(`Klaster B (${klaster.B.toFixed(1)}) — orchestration kuat`);
  }
  if (klaster.C >= 3.5) {
    reasons.hire.push(`Klaster C (${klaster.C.toFixed(1)}) — karakter matang dan groomable`);
  }
  if (consistency === 'tinggi') {
    reasons.hire.push('Konsistensi tinggi — jawaban dapat dipercaya');
  }
  if (!isProductLean && totalFlags === 0) {
    reasons.hire.push('Arah PM-fit tanpa flag keaslian');
  } else if (!isProductLean && mildFlags.length <= 1 && strongFlags.length === 0) {
    reasons.hire.push('Arah PM-fit dengan flag minimal');
  }

  // ── Tentukan rekomendasi akhir ────────────────────
  let recommendation;
  const hasNo = reasons.no.length > 0;
  const hasCaution = reasons.caution.length > 0;

  if (hasNo) {
    recommendation = 'no';
  } else if (hasCaution) {
    recommendation = 'caution';
  } else if (klaster.A >= 4.0 && klaster.B >= 4.0 && klaster.C >= 3.5 &&
             gateFailures.length === 0 && strongFlags.length === 0 &&
             totalFlags <= 1 &&
             (consistency === 'tinggi' || consistency === null)) {
    recommendation = 'hire';
  } else if (klaster.A >= 3.0 && klaster.B >= 3.0 && klaster.C >= 3.0 &&
             gateFailures.length === 0 && strongFlags.length < 2) {
    // Banyak mild flags saja tidak cukup untuk block hire_with_dev — tapi caution reasons tetap muncul
    recommendation = 'hire_with_dev';
  } else if (klaster.A < 3.0 || klaster.B < 3.0) {
    recommendation = 'no';
    reasons.no.push(`Klaster A (${klaster.A.toFixed(1)}) atau B (${klaster.B.toFixed(1)}) di bawah 3.0`);
  } else {
    recommendation = 'caution';
    reasons.caution.push('Kombinasi skor tidak memenuhi kriteria hire atau hire_with_dev');
  }

  return {
    recommendation,
    reasons,
    klaster,
    gateFailures: gateFailures.map(e => e.uc_id),
    authFlags: { strong: strongFlags.length, mild: mildFlags.length, total: totalFlags },
    consistency,
    contradictions,
    exaggerations,
    isProductLean,
  };
}

export const RECOMMENDATION_CONFIG = {
  hire:         { label: '✓ HIRE', desc: 'Rekomendasikan untuk diterima', bg:'#E2EFDA', color:'#27500A', border:'#548235' },
  hire_with_dev:{ label: 'HIRE + Pengembangan', desc: 'Rekomendasikan dengan program grooming aktif', bg:'#EBF4FA', color:'#0C447C', border:'#2E75B6' },
  caution:      { label: '⚠ Hati-hati', desc: 'Perlu diskusi panel sebelum keputusan', bg:'#FBF3D5', color:'#633806', border:'#BF8F00' },
  no:           { label: '✗ NO', desc: 'Tidak rekomendasikan', bg:'#FBE4E4', color:'#791F1F', border:'#C00000' },
};
