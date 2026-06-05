# PM Hiring Co-Pilot

Sistem evaluasi rekrutmen Junior IT Project Manager berbasis AI.

## Setup & Deploy ke Vercel

### 1. Upload ke GitHub

Buat repo baru di GitHub, lalu:
```bash
cd pm-hiring-copilot
git init
git add .
git commit -m "init: PM Hiring Co-Pilot"
git remote add origin https://github.com/USERNAME/pm-hiring-copilot.git
git push -u origin main
```

### 2. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → Login dengan GitHub
2. Klik "Add New Project" → Import repo `pm-hiring-copilot`
3. Framework: Create React App (auto-detected)
4. Klik Deploy

Selesai! URL akan muncul setelah ~2 menit.

### 3. Supabase Schema

Jalankan `supabase_schema.sql` di Supabase SQL Editor sebelum pertama kali pakai.

## Arsitektur

```
pm-hiring-copilot/
├── src/
│   ├── data/bank.js          # 40 UC statis — tidak diubah
│   ├── lib/
│   │   ├── supabase.js       # Database helpers
│   │   └── claude.js         # AI evaluation & script generation
│   ├── components/
│   │   ├── Dashboard.jsx     # Manajemen batch & kandidat
│   │   ├── Evaluasi.jsx      # Evaluasi AI per UC
│   │   ├── BankSoal.jsx      # Browse 40 UC
│   │   ├── CandidateProfile  # Radar chart & profil
│   │   └── Shared.jsx        # Komponen reusable
│   ├── App.js                # Main app & routing
│   └── index.css             # Global styling
└── public/index.html
```

## Prinsip Desain

- **AI sebagai pembantu, bukan penentu** — semua draft skor memerlukan konfirmasi penilai
- **Bank soal statis** — 40 UC tersimpan di `bank.js`, AI tidak generate ulang
- **Rotasi per batch** — 5/7/1+refleksi/7 UC dipilih dari bank per batch
- **Audit trail** — setiap skor final tercatat: AI draft vs konfirmasi penilai
