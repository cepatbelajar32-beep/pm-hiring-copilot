# PM Hiring Co-Pilot — Changelog

Rekrutmen Junior IT PM · Leadership Track  
Stack: React · Supabase · Blackbox API (claude-sonnet-4.5)

---

## v0.9.0 — Aspek Keaslian & Konsistensi Jawaban
*(Belum di-push — update terakhir sebelum chat ini)*

### Ditambahkan
- **Aspek individuality**: AI mendeteksi kandidat yang bersembunyi di balik kata "kami/tim" tanpa bisa menjelaskan kontribusi spesifik dirinya — ditampilkan sebagai `individuality_note` di draft evaluasi
- **Aspek authenticity**: AI men-flag tiga kategori `possible_exaggeration`, `possible_ai_generated`, `inconsistent_detail` dengan penjelasan konkret
- **Tombol Review Konsistensi**: muncul setelah 3+ jawaban tersimpan; AI membaca semua jawaban sekaligus dan output kontradiksi antar UC, sinyal membesar-besarkan, pola "kami", kekhawatiran keaslian, dan rekomendasi probe Stage 4
- **Fungsi `analyzeConsistency`** di `claude.js` — API call terpisah dengan max_tokens 2000
- **Bahasa natural**: audit dan ganti semua jargon teknis di `bank.js` — "abai trap" → kalimat deskriptif, "SOW" → "dokumen kesepakatan kerja yang sudah ditandatangani", "scope" → "ruang lingkup pekerjaan", "dependency" → "bergantung pada siapa", "paralelisasi" → "dikerjakan bersamaan"
- **Konteks istilah teknis di soal**: penjelasan inline di prompt soal Stage 2 untuk kandidat yang belum familiar istilah IT
- **"SJT" dipanjangkan** menjadi "Stage 2 — Penilaian Situasi & Logika" di semua tab

### Diperbaiki
- `calibration_warning` dari `bank.js` sekarang masuk ke sistem prompt AI evaluasi — AI ikut menimbang konteks fresh grad saat memberi skor
- Tipe warning di sistem prompt AI disesuaikan per kategori: `score3ok`, `context`, `scale`, `delivery`

---

## v0.8.0 — Calibration Warning 19 UC
*(Belum di-push)*

### Ditambahkan
- **19 UC punya `calibration_warning`** tersimpan di `bank.js` sebagai field statis:
  - 🔵 Biru (`context`): UC 1.2, 1.7, 2.3, 2.7, 2.8, 3.9 — konteks terbatas, wajar untuk fresh grad
  - 🟡 Amber (`scale`): UC 1.4, 1.6, 1.9, 4.7, 4.9, 4.10 — jangan harap cerita berskala besar
  - 🟢 Hijau (`score3ok`): UC 2.5, 2.10, 3.3, 3.7 — Score 3 sudah bagus di UC ini
  - 🟣 Ungu (`delivery`): UC 1.5, 4.4, 4.6 — nilai substansi, bukan cara penyampaian
- Warning tampil di **Evaluasi AI** (di bawah rubrik, sebelum kolom jawaban) dan di **Bank Soal** (saat UC di-expand)
- Komponen `CalibrationWarning` dengan 4 warna berbeda per tipe

---

## v0.7.0 — Simpan Draft + Fix Catatan Penilai
*(Belum di-push)*

### Ditambahkan
- **Tombol "Simpan Draft"**: menyimpan skor sementara + catatan penilai ke Supabase tanpa mengunci (`is_confirmed = false`); bisa diubah lagi
- Indikator "Draft tersimpan" hijau muncul 3 detik setelah save berhasil
- Penjelasan perbedaan Simpan Draft vs Konfirmasi Skor Final di UI

### Diperbaiki
- **Bug catatan penilai hilang**: `reviewer_note` dari DB sekarang di-restore ke state lokal saat komponen mount via `useEffect` — sebelumnya hilang setiap kali halaman di-refresh atau pindah tab
- Catatan penilai ditampilkan ulang di bawah AI draft setelah dikonfirmasi
- `textarea` catatan penilai menggunakan komponen terpisah (bukan `input`) untuk multiline

---

## v0.6.0 — Hapus Kandidat + Fix Tab Duplikat
*(Belum di-push)*

### Ditambahkan
- **Fitur hapus kandidat**: tombol hapus (ikon tong sampah) di card kandidat dan tabel. Klik → modal konfirmasi dengan peringatan eksplisit → hapus semua data terkait (answers, evaluations, scripts, profiles) secara cascade
- Fungsi `deleteCandidate` di `supabase.js` dengan cascade delete ke semua tabel terkait

### Diperbaiki
- **Tab duplikat di Evaluasi**: Stepper (Aplikasi → SJT → Case Study → Panel) dihapus — redundan dengan tabs navigasi Stage 1–4
- Tabs navigasi sekarang berlabel lengkap: "Stage 1 — Aplikasi", "Stage 2 — Penilaian Situasi & Logika", dst.
- "SJT" pertama kali diganti di tab label

---

## v0.5.0 — QA Menyeluruh + UI Improvement
*(Belum di-push)*

### Bug fix
- **Override skor tidak tersimpan**: root cause `confirmEvaluation` bergantung pada `evalId` yang bisa `undefined`; diganti dengan `confirmEvaluationByUC` yang query berdasarkan `candidateId + ucId`
- **`useEffect` reset `overrideScore`**: setelah parent reload, state override tidak lagi di-reset ke skor AI
- **`CandidateProfile` crash** saat klaster bernilai `null`: semua nilai klaster sekarang melalui `safeNum()` dengan fallback 0
- **Dashboard tidak refresh kandidat** setelah tambah kandidat baru
- **Mobile menu**: sidebar sekarang slide in/out di layar ≤900px dengan tombol hamburger

### UI Improvement
- Font naik dari 14px ke 15px base; elemen kecil minimum 13px
- Sidebar melebar dari 220px ke 240px
- `page-body` max-width 1280px — tidak molor di layar ultrawide
- `grid-4` fallback ke `1fr 1fr` di layar medium/mobile
- Semua badge, button, card padding diproporsikan ulang
- Page header sticky di top saat scroll

---

## v0.4.0 — Candidate Profile + Radar Chart
*(Di-push ke Vercel)*

### Ditambahkan
- **Halaman Profil Kandidat**: radar chart Klaster A/B/C/D menggunakan Recharts
- Generate profil AI berdasarkan semua evaluasi yang sudah dikonfirmasi
- Matriks keputusan: hire / hire_with_dev / caution / no dengan warna
- Tabel detail evaluasi per UC dengan skor AI vs skor final
- Fungsi `generateCandidateProfile` di `claude.js`
- Fungsi `saveProfile` dan `getProfile` di `supabase.js`
- Tabel `candidate_profiles` di Supabase

---

## v0.3.0 — Generate Interview Script Stage 4
*(Di-push ke Vercel)*

### Ditambahkan
- **Generate Interview Script**: AI menganalisis gap dari evaluasi Stage 1–3 dan merekomendasikan 7 UC Stage 4 dengan probe yang dipersonalisasi
- Fungsi `generateInterviewScript` di `claude.js`
- Fungsi `saveInterviewScript` di `supabase.js`
- Tabel `interview_scripts` di Supabase
- Panel ScriptPanel tampil di bawah UCCard setelah ada evaluasi di Stage 2+

---

## v0.2.0 — Evaluasi AI per UC
*(Di-push ke Vercel)*

### Ditambahkan
- **Evaluasi AI per UC**: paste jawaban → AI evaluasi → draft skor 1/3/5 + reasoning + evidence + sinyal PM/Product + flag
- Draft label "Menunggu konfirmasi penilai" sebelum dikunci
- Override skor dengan dropdown sebelum konfirmasi
- Catatan penilai tersimpan bersama konfirmasi
- AI menggunakan `calibration_warning` dari `bank.js` sebagai konteks
- Fungsi `evaluateAnswer` di `claude.js` via Blackbox API (`blackboxai/anthropic/claude-sonnet-4.5`)
- Fungsi `saveAnswer`, `saveEvaluation`, `confirmEvaluationByUC` di `supabase.js`
- Tabel `answers` dan `evaluations` di Supabase

### Perubahan konfigurasi
- API: Blackbox (`https://api.blackbox.ai/chat/completions`) menggantikan Claude API langsung
- Model: `blackboxai/anthropic/claude-sonnet-4.5`

---

## v0.1.0 — Inisialisasi Project
*(Di-push ke Vercel via GitHub: `cepatbelajar32-beep/pm-hiring-copilot`)*

### Ditambahkan
- **Bank Soal**: 40 UC statis tersimpan di `src/data/bank.js` — AI tidak generate ulang soal
- **UC aktif per batch**: Stage 1=5, Stage 2=7, Stage 3=1+refleksi, Stage 4=7 (dari ACTIVE_INDEX)
- **Dashboard**: buat batch, tambah kandidat, lihat semua data dan metrik
- **Bank Soal UI**: browse 40 UC per stage, klik expand untuk detail lengkap (prompt, rubrik, sinyal)
- **Evaluasi AI** (shell): halaman evaluasi dengan tab Stage 1–4
- **Sidebar navigasi**: Dashboard / Bank Soal / Evaluasi AI / Profil Kandidat
- **Supabase integration**: tabel `batches`, `candidates`, `answers`, `evaluations`, `interview_scripts`, `calibration_log`, `candidate_profiles`
- **RLS policy**: anon key bisa read/write semua (prototype)
- **Storage bucket** `recordings` untuk upload audio (belum diimplementasi)

### Stack
- React 18 + Create React App
- Supabase (`mckfzghywtlthzeklzjb.supabase.co`)
- Recharts (radar chart)
- DM Sans + DM Mono (Google Fonts)
- Vercel (hosting)

---

## Backlog / Rencana Berikutnya

- [ ] Audio upload + speech-to-text via Blackbox API (model yang tersedia di-cek via `/v1/models`)
- [ ] Calibration Log UI — panel catat jawaban kontroversial + konsensus antar-batch
- [ ] Export laporan PDF per kandidat
- [ ] Rotasi UC per batch (UI untuk admin pilih UC yang aktif)
- [ ] Multi-penilai: skor independen sebelum diskusi, tracking per reviewer
- [ ] Notifikasi/reminder untuk kandidat yang belum lengkap

---

## Prinsip Arsitektur (Tidak Boleh Dilanggar)

1. **Bank soal statis** — `bank.js` adalah sumber kebenaran tunggal; AI tidak generate ulang soal
2. **AI sebagai pembantu** — semua skor butuh konfirmasi penilai; tidak ada keputusan otomatis dari AI
3. **Rotasi per batch** — UC aktif dipilih per batch dari `ACTIVE_INDEX`, bukan per kandidat
4. **`confirmEvaluationByUC`** — selalu pakai ini, tidak pakai `confirmEvaluation` dengan evalId yang bisa undefined
5. **Cascade delete** — hapus kandidat selalu lewat `deleteCandidate` yang hapus semua data terkait
