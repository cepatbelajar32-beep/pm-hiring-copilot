import React, { useState } from 'react';

const VERSIONS = [
  {
    version: 'v1.6.0',
    label: 'Terbaru',
    status: 'deployed',
    title: 'Naturalisasi Bank Soal + Tooltip UC + Metrik Dashboard',
    date: '5 Jun 2025',
    items: [
      { type: 'change', text: 'Naturalisasi bahasa 40 UC di bank.js — 70 frasa di field cari, waspadai, dan rubrik diubah menjadi bahasa Indonesia yang lebih natural tanpa mengubah esensi penilaian.' },
      { type: 'new', text: 'Tooltip UC di semua teks AI-generated — hover di mention UC_X_Y di reasoning, evidence, konsistensi, profil kandidat, dan catatan AI menampilkan judul UC dan klasternya.' },
      { type: 'new', text: 'Metrik dashboard diperluas — hire_with_dev dan caution sekarang muncul sebagai baris metrik kedua di Dashboard kalau ada kandidat dengan keputusan tersebut.' },
    ]
  },
  {
    version: 'v1.5.0',
    label: '',
    status: 'deployed',
    title: 'Download PDF Soal + Fix Bug Panel & Stage',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Fitur Download Soal — menu baru di sidebar. Pilih batch, preview UC yang aktif, lalu download PDF soal Stage 1+2+3 untuk dikirim ke kandidat. PDF di-generate langsung di browser via print dialog.' },
      { type: 'fix', text: 'Keputusan panel dikunci setelah disimpan — tombol pilihan dan simpan di-disable, tidak bisa diubah lagi.' },
      { type: 'fix', text: 'Keputusan hire_with_dev dan caution sekarang tampil di Dashboard setelah disimpan dari Profil Kandidat — onRefresh dipanggil setelah save.' },
      { type: 'fix', text: 'Bug current_stage — handleEvalSaved sekarang baca UC aktif dari batch langsung (bukan dari state) dan current_stage dari DB, sehingga stage update lebih akurat.' },
    ]
  },
  {
    version: 'v1.4.0',
    label: '',
    status: 'deployed',
    title: 'Halaman Referensi + Fix Bug',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Halaman Referensi — tab baru di sidebar berisi kerangka kompetensi lengkap (Klaster A/B/C/D dengan wujud konkret per kompetensi), bank soal & rubrik 1/3/5 per UC (40 UC, collapsible, per stage), dan mekanisme deteksi PM vs Product-fit (4 mekanisme + matriks keputusan).' },
      { type: 'fix', text: 'Bug dot biru — handleEvalSaved sekarang baca fresh evals dari DB setelah konfirmasi UC, lalu update current_stage kandidat otomatis. Badge Stage di Dashboard dan Profil Kandidat ikut terupdate.' },
      { type: 'fix', text: 'JSON Parse error generateInterviewScript — max_tokens dinaikkan dari 1200 ke 2000 untuk mencegah response terpotong.' },
    ]
  },
  {
    version: 'v1.3.0',
    label: '',
    status: 'deployed',
    title: 'Tab Analisis Akhir + Alur Evaluasi Lengkap',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Tab "Analisis Akhir" — panel komprehensif setelah Stage 4 berisi: radar chart skor per klaster, distribusi skor per stage, review konsistensi lintas semua stage, agregasi flag keaslian per UC, pola kontribusi individual, dan rekap catatan penilai. Semua section collapsible.' },
      { type: 'new', text: 'Tab "Persiapan Panel" — antara Stage 3 dan Stage 4, berisi Generate Script Stage 4. UC terpilih disimpan per kandidat di Supabase (Opsi B), dengan fallback ke rotation set batch kalau tidak di-generate.' },
      { type: 'new', text: 'Review Konsistensi dipindah ke tab Analisis Akhir — hanya muncul setelah ada jawaban dari semua 4 stage, bukan per stage.' },
      { type: 'new', text: 'Stage 3 sekarang terdiri dari 3 UC: UC utama + UC pendamping komplementer + UC_3_10 refleksi wajib. Instruksi waktu kandidat 50-60 menit per UC.' },
      { type: 'fix', text: 'Bug current_stage — badge Stage di Dashboard, dot di tab Evaluasi, dan label di Profil Kandidat sekarang otomatis update saat semua UC di stage dikonfirmasi.' },
      { type: 'fix', text: 'Generate Script tidak lagi muncul di Stage 2 dan Stage 3.' },
      { type: 'change', text: 'Supabase: tambah kolom stage4_ucs di tabel candidates (UC Stage 4 per kandidat), stage3_companion_uc di tabel batches.' },
    ]
  },
  {
    version: 'v1.2.0',
    label: '',
    status: 'deployed',
    title: 'Stage 4 Dipersonalisasi + Perbaikan Alur Evaluasi',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Generate Script Stage 4 sekarang menentukan UC aktif per kandidat (Opsi B) — AI pilih 7 dari 10 UC Stage 4 berdasarkan gap kandidat. Kalau tidak di-generate, fallback ke 7 UC default dari rotation set batch.' },
      { type: 'new', text: 'Generate Script dipindah ke tab Stage 4 saja, posisi paling atas sebagai langkah pertama sebelum input jawaban — tidak lagi muncul di Stage 2 dan Stage 3.' },
      { type: 'new', text: 'UC Stage 4 terpilih disimpan per kandidat di Supabase, bukan per batch — setiap kandidat bisa punya set Stage 4 yang berbeda.' },
      { type: 'fix', text: 'Bug dot biru — indikator stage aktif kandidat tidak lagi stuck di Stage 1.' },
      { type: 'fix', text: 'Review Konsistensi sekarang hanya muncul setelah ada jawaban dari minimal 3 stage berbeda — bukan di setiap stage.' },
    ]
  },
  {
    version: 'v1.1.0',
    label: '',
    status: 'deployed',
    title: 'Stage 3 Dua UC + Pasangan Komplementer',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Stage 3 sekarang selalu terdiri dari 2 UC — satu UC utama dan satu UC pendamping yang dipilih berdasarkan prinsip komplementer klaster. Setiap pasangan menutup dimensi kompetensi yang berbeda.' },
      { type: 'new', text: 'Pasangan UC Stage 3: UC_3_1↔UC_3_5, UC_3_2↔UC_3_7, UC_3_3↔UC_3_6, UC_3_4↔UC_3_9, UC_3_6↔UC_3_8, UC_3_7↔UC_3_3, UC_3_8↔UC_3_4, UC_3_9↔UC_3_2 — mengikuti rotation set batch.' },
      { type: 'change', text: 'Instruksi waktu kandidat Stage 3 diupdate — masing-masing UC dikerjakan 50-60 menit dalam total 2 jam, bukan satu UC 2 jam penuh.' },
      { type: 'change', text: 'ROTATION_SETS di bank.js diupdate untuk menyertakan UC pendamping Stage 3 per set.' },
    ]
  },
  {
    version: 'v1.0.0',
    label: '',
    status: 'deployed',
    title: 'Rotasi UC, Context Note, Hapus Refresh',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Rotasi UC otomatis per batch — 6 rotation set (A–F) di bank.js. Saat buat batch baru, sistem pilih set berikutnya secara otomatis. Modal buat batch menampilkan preview UC yang akan dipakai dan set berikutnya.' },
      { type: 'new', text: 'Tombol "Lihat UC" di setiap batch — klik untuk lihat daftar UC aktif per stage di batch tersebut, lengkap dengan klaster dan mekanisme.' },
      { type: 'new', text: 'Context note untuk 7 UC yang konteksnya berat bagi fresh grad (UC 2.3, 2.7, 2.8, 3.7, 3.9, 4.4, 4.6) — kotak biru "Konteks untuk kandidat" tampil di atas soal di Evaluasi AI dan Bank Soal.' },
      { type: 'fix', text: 'Revert bahasa: 23 istilah dikembalikan ke terminologi IT aslinya — SOW, scope, dependency, change request, paralelisasi, dll. Istilah tetap dipakai karena ini konteks organisasi IT.' },
      { type: 'fix', text: 'Hapus tombol Refresh Data dari sidebar — tidak diperlukan karena data sudah auto-refresh setiap kali ada aksi.' },
      { type: 'ui', text: 'Sidebar bersih: Dashboard, Bank Soal, Evaluasi AI, Profil Kandidat, Changelog — tanpa menu Sistem.' },
    ]
  },
  {
    version: 'v0.9.0',
    label: '',
    status: 'deployed',
    title: 'Aspek Keaslian & Konsistensi Jawaban',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Deteksi pola "kami/tim" — AI menandai kandidat yang tidak bisa menjelaskan kontribusi spesifik dirinya (individuality_note)' },
      { type: 'new', text: 'Deteksi kemungkinan dibesar-besarkan, ditulis AI, atau detail tidak konsisten (authenticity_flag)' },
      { type: 'new', text: 'Tombol Review Konsistensi — AI baca semua jawaban sekaligus, cari kontradiksi antar UC, sinyal membual, pola kami, dan kekhawatiran keaslian' },
      { type: 'new', text: 'Bahasa natural di seluruh bank soal — "abai trap" → kalimat deskriptif, "SOW" → dokumen kesepakatan kerja, "scope" → ruang lingkup, "dependency" → bergantung pada siapa' },
      { type: 'new', text: 'Penjelasan kontekstual inline di soal Stage 2 untuk istilah IT yang belum familiar bagi fresh grad' },
      { type: 'new', text: '"SJT" dipanjangkan menjadi "Stage 2 — Penilaian Situasi & Logika" di semua tab' },
      { type: 'fix', text: 'Calibration warning 19 UC sekarang masuk ke sistem prompt AI evaluasi — AI ikut menimbang konteks fresh grad saat memberi skor' },
    ]
  },
  {
    version: 'v0.8.0',
    label: '',
    status: 'deployed',
    title: 'Calibration Warning 19 UC',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: '19 UC punya peringatan kalibrasi tersimpan di bank.js — 4 kategori: konteks terbatas (biru), skala pengalaman (amber), score 3 sudah bagus (hijau), nilai substansi bukan cara penyampaian (ungu)' },
      { type: 'new', text: 'Warning tampil di Evaluasi AI sebelum kolom jawaban, dan di Bank Soal saat UC di-expand' },
      { type: 'new', text: 'Komponen CalibrationWarning dengan warna berbeda per tipe peringatan' },
    ]
  },
  {
    version: 'v0.7.0',
    label: '',
    status: 'deployed',
    title: 'Simpan Draft + Fix Catatan Penilai',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Tombol "Simpan Draft" — skor + catatan tersimpan sementara tanpa dikunci, bisa diubah lagi' },
      { type: 'new', text: 'Indikator "Draft tersimpan" muncul 3 detik setelah berhasil disimpan' },
      { type: 'fix', text: 'Bug catatan penilai hilang: reviewer_note dari DB sekarang di-restore ke state lokal saat komponen mount' },
      { type: 'fix', text: 'Catatan penilai ditampilkan ulang di bawah AI draft setelah dikonfirmasi' },
    ]
  },
  {
    version: 'v0.6.0',
    label: '',
    status: 'deployed',
    title: 'Hapus Kandidat + Fix Tab Duplikat',
    date: '5 Jun 2025',
    items: [
      { type: 'new', text: 'Fitur hapus kandidat dengan modal konfirmasi — menghapus semua data terkait (jawaban, evaluasi, script, profil) secara cascade' },
      { type: 'fix', text: 'Stepper duplikat di halaman Evaluasi dihapus — sekarang hanya ada satu navigasi stage' },
      { type: 'fix', text: 'Label tab lebih deskriptif: "Stage 1 — Aplikasi", "Stage 2 — Penilaian Situasi & Logika", dst.' },
    ]
  },
  {
    version: 'v0.5.0',
    label: '',
    status: 'deployed',
    title: 'QA Menyeluruh + UI Improvement',
    date: '5 Jun 2025',
    items: [
      { type: 'fix', text: 'Bug utama: override skor tidak tersimpan — confirmEvaluation sekarang pakai confirmEvaluationByUC berbasis candidateId + ucId, tidak bergantung pada evalId yang bisa undefined' },
      { type: 'fix', text: 'useEffect tidak lagi reset overrideScore setelah parent reload' },
      { type: 'fix', text: 'CandidateProfile tidak crash saat nilai klaster null dari AI' },
      { type: 'fix', text: 'Dashboard refresh kandidat setelah tambah kandidat baru' },
      { type: 'new', text: 'Mobile menu: sidebar slide in/out di layar ≤900px dengan tombol hamburger' },
      { type: 'ui', text: 'Font naik dari 14px ke 15px base; sidebar melebar 220→240px; page-body max-width 1280px' },
      { type: 'ui', text: 'grid-4 fallback ke 1fr 1fr di layar medium/mobile; page header sticky saat scroll' },
    ]
  },
  {
    version: 'v0.4.0',
    label: '',
    status: 'deployed',
    title: 'Profil Kandidat + Radar Chart',
    date: '4 Jun 2025',
    items: [
      { type: 'new', text: 'Halaman Profil Kandidat dengan radar chart Klaster A/B/C/D menggunakan Recharts' },
      { type: 'new', text: 'Generate profil AI berdasarkan semua evaluasi yang dikonfirmasi' },
      { type: 'new', text: 'Matriks keputusan: hire / hire_with_dev / caution / no dengan warna' },
      { type: 'new', text: 'Tabel detail evaluasi per UC — skor AI vs skor final penilai' },
      { type: 'new', text: 'Tabel candidate_profiles di Supabase' },
    ]
  },
  {
    version: 'v0.3.0',
    label: '',
    status: 'deployed',
    title: 'Generate Interview Script Stage 4',
    date: '4 Jun 2025',
    items: [
      { type: 'new', text: 'AI menganalisis gap dari evaluasi Stage 1–3 dan merekomendasikan 7 UC Stage 4 dengan probe yang dipersonalisasi per kandidat' },
      { type: 'new', text: 'Panel ScriptPanel tampil setelah ada evaluasi di Stage 2+' },
      { type: 'new', text: 'Tabel interview_scripts di Supabase' },
    ]
  },
  {
    version: 'v0.2.0',
    label: '',
    status: 'deployed',
    title: 'Evaluasi AI per UC',
    date: '4 Jun 2025',
    items: [
      { type: 'new', text: 'Evaluasi AI per UC via Blackbox API (blackboxai/anthropic/claude-sonnet-4.5): paste jawaban → draft skor 1/3/5 + reasoning + evidence + sinyal PM/Product + flag' },
      { type: 'new', text: 'Draft berlabel "Menunggu konfirmasi penilai" — tidak ada keputusan otomatis dari AI' },
      { type: 'new', text: 'Override skor dengan dropdown + catatan penilai sebelum konfirmasi final' },
      { type: 'change', text: 'API beralih dari Claude API langsung ke Blackbox API' },
      { type: 'new', text: 'Tabel answers dan evaluations di Supabase' },
    ]
  },
  {
    version: 'v0.1.0',
    label: 'Init',
    status: 'deployed',
    title: 'Inisialisasi Project',
    date: '4 Jun 2025',
    items: [
      { type: 'new', text: '40 UC bank soal statis di bank.js — AI tidak generate ulang soal' },
      { type: 'new', text: 'UC aktif per batch: Stage 1=5, Stage 2=7, Stage 3=1+refleksi, Stage 4=7' },
      { type: 'new', text: 'Dashboard: buat batch, tambah kandidat, lihat metrik' },
      { type: 'new', text: 'Bank Soal UI: browse 40 UC dengan expand detail per UC' },
      { type: 'new', text: 'Supabase: 7 tabel + RLS policy + storage bucket recordings' },
      { type: 'new', text: 'Deploy ke Vercel via GitHub (cepatbelajar32-beep/pm-hiring-copilot)' },
      { type: 'new', text: 'Stack: React 18 · Supabase · Recharts · DM Sans · Vercel' },
    ]
  },
];

const TYPE_CONFIG = {
  new:    { label: 'Baru',   bg: '#E2EFDA', color: '#548235' },
  fix:    { label: 'Fix',    bg: '#FBE4E4', color: '#C00000' },
  ui:     { label: 'UI',     bg: '#EBF4FA', color: '#2E75B6' },
  change: { label: 'Ubah',   bg: '#FBF3D5', color: '#BF8F00' },
};

const STATUS_CONFIG = {
  deployed: { label: '✓ Di-deploy',    bg: '#E2EFDA', color: '#548235' },
  pending:  { label: '⏳ Belum push',  bg: '#FBF3D5', color: '#BF8F00' },
};

const BACKLOG = [
  'Audio upload + speech-to-text via Blackbox API',
  'Calibration Log UI — catat jawaban kontroversial + konsensus antar-batch',
  'Export laporan PDF per kandidat',
  'Rotasi UC per batch: UI untuk admin pilih UC aktif',
  'Multi-penilai: skor independen sebelum diskusi, tracking per reviewer',
];

const PRINSIP = [
  { title: 'Bank soal statis', desc: 'bank.js adalah sumber kebenaran tunggal. AI tidak pernah generate ulang soal.' },
  { title: 'AI sebagai pembantu', desc: 'Semua skor butuh konfirmasi penilai manusia. Tidak ada keputusan otomatis dari AI.' },
  { title: 'Rotasi per batch', desc: 'UC Stage 1-3 dipilih per batch dari rotation set. Stage 3 selalu 3 UC (utama + pendamping + UC_3_10). Stage 4 dipilih per kandidat dari Generate Script — dengan fallback ke rotation set.' },
  { title: 'confirmEvaluationByUC', desc: 'Selalu pakai ini — tidak pakai confirmEvaluation dengan evalId yang bisa undefined.' },
  { title: 'Cascade delete', desc: 'Hapus kandidat selalu lewat deleteCandidate yang hapus semua data terkait.' },
];

export default function Changelog() {
  const [expanded, setExpanded] = useState(new Set(['v1.6.0']));

  function toggle(v) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  }

  return (
    <div>
      {/* Ringkasan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Versi', value: VERSIONS.length },
          { label: 'Sudah Di-deploy', value: VERSIONS.filter(v => v.status === 'deployed').length },
          { label: 'Menunggu Push', value: VERSIONS.filter(v => v.status === 'pending').length },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-val">{m.value}</div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline versi */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-title">Riwayat Versi</div>
        {VERSIONS.map((v, idx) => {
          const isOpen = expanded.has(v.version);
          const st = STATUS_CONFIG[v.status];
          return (
            <div key={v.version} style={{ borderBottom: idx < VERSIONS.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
              {/* Header versi */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', cursor: 'pointer' }}
                onClick={() => toggle(v.version)}
              >
                {/* Dot */}
                <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: v.status === 'deployed' ? '#548235' : '#BF8F00' }} />

                {/* Version badge */}
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 700,
                  color: '#2E75B6', background: '#EBF4FA', padding: '2px 8px', borderRadius: 4 }}>
                  {v.version}
                </span>

                {/* Title */}
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', flex: 1 }}>{v.title}</span>

                {/* Label */}
                {v.label && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: '#E2EFDA', color: '#548235' }}>{v.label}</span>
                )}

                {/* Status */}
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span>

                {/* Date */}
                <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{v.date}</span>

                {/* Chevron */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
                  style={{ transform: isOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              {/* Body items */}
              {isOpen && (
                <div style={{ paddingBottom: 14, paddingLeft: 20 }}>
                  {v.items.map((item, i) => {
                    const tc = TYPE_CONFIG[item.type] || TYPE_CONFIG.new;
                    return (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                          background: tc.bg, color: tc.color, flexShrink: 0, marginTop: 1 }}>{tc.label}</span>
                        <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Backlog */}
        <div className="card">
          <div className="card-title">Rencana Berikutnya</div>
          {BACKLOG.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ color: '#9CA3AF', fontWeight: 700, flexShrink: 0 }}>○</span>
              <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Prinsip */}
        <div className="card">
          <div className="card-title">Prinsip Arsitektur</div>
          {PRINSIP.map((p, i) => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 12,
              borderBottom: i < PRINSIP.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1F3864', marginBottom: 3 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
