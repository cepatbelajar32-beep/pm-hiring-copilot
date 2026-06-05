import React, { useState } from 'react';
import { BANK } from '../data/bank';

// ── Data Kerangka Kompetensi ──────────────────────────
const KLASTER = [
  {
    id: 'A', label: 'Cognitive Core', tag: 'PEMBEDA UTAMA',
    tagColor: '#0C447C', tagBg: '#EBF4FA',
    desc: 'Cara berpikir — memisahkan calon Senior PM dari task-tracker',
    color: '#2E75B6', bg: '#EBF4FA',
    kompetensi: [
      { nama: 'Systems thinking', wujud: 'Melihat proyek sebagai jaringan dependency (sistem, tim, vendor, jadwal), bukan daftar task terpisah.' },
      { nama: 'Critical thinking & pattern recognition', wujud: 'Mencium akar masalah, bukan gejala. Mengenali pola yang berulang.' },
      { nama: 'Risk prioritization & decision-making', wujud: 'Tahu risiko mana yang paling mengancam delivery dan harus diurus duluan.' },
      { nama: 'Reading between the lines', wujud: 'Menangkap maksud tersirat — mis. "nanti saja" = sebenarnya menolak.' },
      { nama: 'Convergent thinking & decisive', wujud: 'Refleksnya mengunci keputusan & menuntaskan. Berani memutuskan saat orang lain ragu. Pembeda PM vs Product Manager.' },
    ]
  },
  {
    id: 'B', label: 'Orchestration Core', tag: 'PEMBEDA UTAMA',
    tagColor: '#0C447C', tagBg: '#EBF4FA',
    desc: 'Menggerakkan orang — memimpin tanpa otoritas formal',
    color: '#548235', bg: '#E2EFDA',
    kompetensi: [
      { nama: 'Orchestration tanpa otoritas', wujud: 'Menggerakkan vendor & orang lebih senior yang bukan bawahannya.' },
      { nama: 'Vendor / 3rd-party management instinct', wujud: 'Naluri mengelola, menagih, dan mengawasi pihak ketiga.' },
      { nama: 'Business–IT translation', wujud: 'Menerjemahkan kebutuhan bisnis ke bahasa teknis dan sebaliknya.' },
      { nama: 'Risk & dependency sensing', wujud: 'Mencium pemicu keterlambatan sebelum benar-benar terjadi.' },
    ]
  },
  {
    id: 'C', label: 'Character Core', tag: 'PENENTU GROOMABLE',
    tagColor: '#27500A', tagBg: '#E2EFDA',
    desc: 'Bertahan & bisa dibesarkan — penentu apakah investasi grooming berhasil',
    color: '#BF8F00', bg: '#FBF3D5',
    kompetensi: [
      { nama: 'Ownership / agency', wujud: 'Sikap "ini masalah saya" walaupun bukan salahnya.' },
      { nama: 'Coachability', wujud: 'Menerima feedback lalu benar-benar berubah, tidak defensif.' },
      { nama: 'Conscientiousness / follow-through', wujud: 'Menutup loop tanpa perlu diingatkan.' },
      { nama: 'Resilience under ambiguity', wujud: 'Tetap bisa bekerja walau tanpa instruksi yang jelas.' },
      { nama: 'Governance discipline', wujud: 'Nyaman dengan gate & sign-off, tapi paham kenapa prosesnya ada — bukan asal patuh.' },
      { nama: 'Persistent', wujud: 'Tidak menyerah saat menghadapi penolakan atau hambatan. Terus mendorong dengan cara yang adaptif.' },
      { nama: 'Decisive', wujud: 'Berani mengambil posisi dan memutuskan saat situasi tidak nyaman untuk memutuskan.' },
    ]
  },
  {
    id: 'D', label: 'Foundational Core', tag: 'GERBANG WAJIB',
    tagColor: '#791F1F', tagBg: '#FCEBEB',
    desc: 'Pondasi wajib — bukan pembeda, tapi gagal di sini = gugur',
    color: '#C00000', bg: '#FBE4E4',
    kompetensi: [
      { nama: 'Komunikasi (lisan & tulisan)', wujud: 'Menyampaikan status, risiko, keputusan dengan jelas ke audiens berbeda — dari engineer sampai eksekutif.' },
      { nama: 'Stakeholder management', wujud: 'Mengelola ekspektasi, menjaga hubungan, menavigasi kepentingan yang bertabrakan.' },
      { nama: 'Critical thinking (dasar)', wujud: 'Mengurai masalah secara logis di bawah tekanan & informasi terbatas.' },
      { nama: 'Negotiation & conflict navigation', wujud: 'Menengahi tarik-menarik bisnis, tim teknis, vendor tanpa merusak hubungan.' },
      { nama: 'Time & priority management', wujud: 'Mengelola banyak hal tanpa kehilangan jejak. Tidak bisa atur diri = tidak bisa atur proyek.' },
      { nama: 'Attention to detail', wujud: 'Menangkap hal kecil yang terlewat sebelum jadi masalah besar.' },
    ]
  },
];

const MEKANISME_PM = [
  { label: 'M1 — Locked-Scope Trap', desc: 'Beri skenario scope yang sudah dikunci, lalu munculkan godaan untuk mengubahnya. PM-fit: hormati scope, ubahnya lewat proses. Product-fit: langsung dorong ubah demi "user value".' },
  { label: 'M2 — Sumber Kepuasan', desc: 'Tanya pencapaian yang dibanggakan. PM-fit bangga pada closure — merapikan kekacauan, menyatukan orang, menuntaskan. Product-fit bangga pada insight — menyadari yang diminta ≠ yang dibutuhkan.' },
  { label: 'M3 — Redirection Moment', desc: 'Role-play 2 babak. Babak A: scope fix, krisis eksekusi. Babak B: bebas ubah apa saja. PM-fit menyala di A, gelisah di B. Product-fit sebaliknya.' },
  { label: 'M4 — Pertanyaan Pertama', desc: 'Brief ambigu, nilai pertanyaan klarifikasi pertama. PM-fit → how & when (deadline, siapa, batasan). Product-fit → what & why (kenapa dibangun, siapa user).' },
];

const STAGE_LABELS = {
  stage1: { label: 'Stage 1 — Aplikasi', color: '#2E75B6', bg: '#EBF4FA', waktu: 'Async · 30 menit' },
  stage2: { label: 'Stage 2 — Situasi & Logika', color: '#548235', bg: '#E2EFDA', waktu: 'Async · 45 menit' },
  stage3: { label: 'Stage 3 — Case Study', color: '#BF8F00', bg: '#FBF3D5', waktu: 'Take-home · 2 jam · 50-60 mnt per UC' },
  stage4: { label: 'Stage 4 — Panel Interview', color: '#534AB7', bg: '#EEEDFE', waktu: 'Live · 60 menit' },
};

function UCRow({ uc }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:'0.5px solid var(--color-border-tertiary)', borderRadius:10, marginBottom:10, overflow:'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px',
        background: open ? 'var(--color-background-secondary)' : 'var(--color-background-primary)', cursor:'pointer' }}>
        <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:'#2E75B6',
          background:'#EBF4FA', padding:'2px 7px', borderRadius:4, flexShrink:0 }}>{uc.id}</span>
        <span style={{ fontSize:13, fontWeight:500, flex:1 }}>{uc.title}</span>
        <span style={{ fontSize:11, color:'var(--color-text-secondary)', flexShrink:0 }}>Klaster {uc.klaster}</span>
        {uc.mechanism && <span style={{ fontSize:11, background:'#EEEDFE', color:'#3C3489', padding:'2px 6px', borderRadius:4, flexShrink:0 }}>{uc.mechanism}</span>}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : '', transition:'transform .2s', flexShrink:0, opacity:.4 }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      {open && (
        <div style={{ padding:'14px 16px', borderTop:'0.5px solid var(--color-border-tertiary)' }}>
          {/* Prompt */}
          <div style={{ background:'var(--color-background-secondary)', borderLeft:'3px solid #2E75B6',
            borderRadius:'0 8px 8px 0', padding:'10px 14px', marginBottom:12, fontSize:13,
            lineHeight:1.65, fontStyle:'italic', color:'var(--color-text-primary)', whiteSpace:'pre-wrap' }}>
            {uc.prompt}
          </div>

          {/* Context note */}
          {uc.context_note && (
            <div style={{ background:'#F0F9FF', border:'1px solid #BAE6FD', borderLeft:'4px solid #0EA5E9',
              borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:'#0C4A6E', lineHeight:1.65 }}>
              <div style={{ fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, color:'#0369A1' }}>
                📋 Konteks untuk kandidat
              </div>
              {uc.context_note}
            </div>
          )}

          {/* Trap */}
          {uc.trap && (
            <div style={{ background:'#FBF3D5', borderLeft:'3px solid #BF8F00', borderRadius:'0 8px 8px 0',
              padding:'8px 12px', marginBottom:12, fontSize:13, color:'#4B3500' }}>
              <strong>Situasi tersembunyi (untuk penilai):</strong> {uc.trap}
            </div>
          )}

          {/* Rubrik */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
            {[
              { label:'Skor 1 — Sinyal mengkhawatirkan', text: uc.waspadai, bg:'#FBE4E4', color:'#C00000', border:'#F9A8A8' },
              { label:'Skor 3 — Rata-rata fresh grad', text: 'Jawaban masuk akal tapi generik, belum menunjukkan kedalaman atau pola khas.', bg:'#FBF3D5', color:'#BF8F00', border:'#F5C842' },
              { label:'Skor 5 — Calon Senior PM', text: uc.cari, bg:'#E2EFDA', color:'#548235', border:'#86EFAC' },
            ].map(r => (
              <div key={r.label} style={{ background:r.bg, border:`1px solid ${r.border}`, borderRadius:8, padding:'10px 12px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:r.color, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>{r.label}</div>
                <div style={{ fontSize:12, color:'var(--color-text-primary)', lineHeight:1.6 }}>{r.text}</div>
              </div>
            ))}
          </div>

          {/* Signal PM vs Product */}
          {uc.signal && (
            <div style={{ fontSize:13, color:'#2E75B6', fontStyle:'italic', borderLeft:'3px solid #2E75B6',
              paddingLeft:10, lineHeight:1.6 }}>
              <strong style={{ fontStyle:'normal' }}>Sinyal PM vs Product:</strong> {uc.signal}
            </div>
          )}

          {/* Calibration warning */}
          {uc.calibration_warning && (
            <div style={{ marginTop:10, background:
              uc.calibration_warning.type === 'score3ok' ? '#E2EFDA' :
              uc.calibration_warning.type === 'scale' ? '#FBF3D5' :
              uc.calibration_warning.type === 'delivery' ? '#EEEDFE' : '#EBF4FA',
              border:`1px solid ${
                uc.calibration_warning.type === 'score3ok' ? '#548235' :
                uc.calibration_warning.type === 'scale' ? '#BF8F00' :
                uc.calibration_warning.type === 'delivery' ? '#534AB7' : '#2E75B6'}`,
              borderLeft:`4px solid ${
                uc.calibration_warning.type === 'score3ok' ? '#548235' :
                uc.calibration_warning.type === 'scale' ? '#BF8F00' :
                uc.calibration_warning.type === 'delivery' ? '#534AB7' : '#2E75B6'}`,
              borderRadius:8, padding:'10px 14px', fontSize:13 }}>
              <div style={{ fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5,
                color: uc.calibration_warning.type === 'score3ok' ? '#27500A' :
                       uc.calibration_warning.type === 'scale' ? '#633806' :
                       uc.calibration_warning.type === 'delivery' ? '#3C3489' : '#0C447C' }}>
                ⚠ Kalibrasi Penilai — {uc.calibration_warning.label}
              </div>
              <div style={{ color:'var(--color-text-primary)', lineHeight:1.6 }}>{uc.calibration_warning.text}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Referensi() {
  const [activeTab, setActiveTab] = useState('klaster');
  const [activeStage, setActiveStage] = useState('stage1');
  const [expandAll, setExpandAll] = useState(false);

  const allUCs = BANK[activeStage] || [];

  const tabs = [
    { key:'klaster', label:'Kerangka Kompetensi' },
    { key:'uc', label:'Bank Soal & Rubrik' },
    { key:'mekanisme', label:'Deteksi PM vs Product' },
  ];

  return (
    <div>
      <div style={{ background:'var(--color-background-secondary)', borderRadius:12, padding:'14px 18px',
        marginBottom:20, fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.6 }}>
        Dokumen referensi untuk penilai — kerangka kompetensi, rubrik per UC, dan mekanisme deteksi PM-fit.
        Gunakan sebagai acuan sebelum atau selama proses evaluasi.
      </div>

      {/* Tab utama */}
      <div className="tabs" style={{ marginBottom:20 }}>
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${activeTab===t.key?'active':''}`}
            onClick={() => setActiveTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* ── Kerangka Kompetensi ── */}
      {activeTab === 'klaster' && (
        <div>
          {/* Cara membaca */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
            {KLASTER.map(k => (
              <div key={k.id} style={{ background:k.bg, borderRadius:10, padding:'12px 14px',
                border:`1px solid ${k.color}22` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:28, height:28, borderRadius:6, background:k.color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'white', fontWeight:800, fontSize:14, flexShrink:0 }}>{k.id}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:k.color }}>{k.label}</div>
                </div>
                <div style={{ fontSize:11, background:k.tagBg, color:k.tagColor, padding:'2px 7px',
                  borderRadius:20, fontWeight:700, display:'inline-block', marginBottom:6 }}>{k.tag}</div>
                <div style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.5 }}>{k.desc}</div>
              </div>
            ))}
          </div>

          {/* Detail per klaster */}
          {KLASTER.map(k => (
            <div key={k.id} style={{ marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12,
                padding:'10px 14px', background:k.bg, borderRadius:'10px 10px 0 0',
                border:`1px solid ${k.color}33`, borderBottom:'none' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:k.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'white', fontWeight:800, fontSize:16, flexShrink:0 }}>{k.id}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--color-text-primary)' }}>
                    Klaster {k.id} — {k.label}
                  </div>
                  <div style={{ fontSize:12, color:'var(--color-text-secondary)' }}>{k.desc}</div>
                </div>
                <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700,
                  background:k.tagBg, color:k.tagColor, padding:'3px 10px', borderRadius:20 }}>{k.tag}</span>
              </div>
              <div style={{ border:`1px solid ${k.color}33`, borderRadius:'0 0 10px 10px', overflow:'hidden' }}>
                {k.kompetensi.map((komp, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'200px 1fr',
                    borderBottom: i < k.kompetensi.length-1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                    padding:'11px 16px', background: i%2===0 ? 'var(--color-background-primary)' : 'var(--color-background-secondary)' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:k.color, paddingRight:12 }}>{komp.nama}</div>
                    <div style={{ fontSize:13, color:'var(--color-text-primary)', lineHeight:1.6 }}>{komp.wujud}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Aturan agregasi */}
          <div style={{ background:'var(--color-background-secondary)', borderRadius:12, padding:'16px 18px', marginTop:8 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Aturan keputusan seleksi</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Klaster D — Gerbang Mati', desc:'Skor 1 di komunikasi, attention to detail, atau self-management = gugur, sehebat apapun klaster lain. Tidak untuk dirata-rata.', color:'#C00000', bg:'#FBE4E4' },
                { label:'Klaster A & B — Pembeda', desc:'Bobot tertinggi. Di sinilah Future Senior PM dipisahkan dari Average Fresh Grad.', color:'#2E75B6', bg:'#EBF4FA' },
                { label:'Klaster C — Groomable', desc:'Skor rendah di coachability/ownership = risiko tinggi grooming gagal, walau pintar sekalipun.', color:'#BF8F00', bg:'#FBF3D5' },
                { label:'Arah PM-fit — Filter Terpisah', desc:'Bukan skor, tapi filter sendiri. Kandidat Product-lean dengan skor tinggi tetap tidak direkomendasikan untuk peran ini.', color:'#534AB7', bg:'#EEEDFE' },
              ].map(r => (
                <div key={r.label} style={{ background:r.bg, borderRadius:8, padding:'12px 14px' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:r.color, marginBottom:5 }}>{r.label}</div>
                  <div style={{ fontSize:12, color:'var(--color-text-primary)', lineHeight:1.6 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bank Soal & Rubrik ── */}
      {activeTab === 'uc' && (
        <div>
          {/* Stage selector */}
          <div className="tabs" style={{ marginBottom:16 }}>
            {Object.entries(STAGE_LABELS).map(([key, val]) => (
              <button key={key} className={`tab-btn ${activeStage===key?'active':''}`}
                onClick={() => { setActiveStage(key); setExpandAll(false); }}>
                {val.label}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div style={{ fontSize:13, color:'var(--color-text-secondary)' }}>
              {STAGE_LABELS[activeStage].waktu} · {allUCs.length} UC tersedia
            </div>
            <button onClick={() => setExpandAll(!expandAll)}
              style={{ marginLeft:'auto', fontSize:12, color:'var(--color-text-secondary)',
                background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
              {expandAll ? 'Tutup semua' : 'Buka semua'}
            </button>
          </div>

          {allUCs.map(uc => (
            <div key={uc.id} style={{ border:'0.5px solid var(--color-border-tertiary)', borderRadius:10, marginBottom:10, overflow:'hidden' }}>
              <div onClick={e => { e.currentTarget.nextElementSibling.style.display = e.currentTarget.nextElementSibling.style.display === 'none' ? 'block' : 'none'; }}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', cursor:'pointer',
                  background:'var(--color-background-secondary)' }}>
                <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:'#2E75B6',
                  background:'#EBF4FA', padding:'2px 7px', borderRadius:4, flexShrink:0 }}>{uc.id}</span>
                <span style={{ fontSize:13, fontWeight:500, flex:1 }}>{uc.title}</span>
                <span style={{ fontSize:11, color:'var(--color-text-secondary)', flexShrink:0 }}>Klaster {uc.klaster}</span>
                {uc.mechanism && <span style={{ fontSize:11, background:'#EEEDFE', color:'#3C3489', padding:'2px 6px', borderRadius:4, flexShrink:0 }}>{uc.mechanism}</span>}
                {uc.id === 'UC_3_10' && <span style={{ fontSize:11, background:'#FBF3D5', color:'#BF8F00', padding:'2px 6px', borderRadius:4, fontWeight:600 }}>Wajib</span>}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ flexShrink:0, opacity:.4 }}><path d="M6 9l6 6 6-6"/></svg>
              </div>

              <div style={{ display: expandAll ? 'block' : 'none', padding:'14px 16px',
                borderTop:'0.5px solid var(--color-border-tertiary)' }}>
                <div style={{ background:'var(--color-background-secondary)', borderLeft:'3px solid #2E75B6',
                  borderRadius:'0 8px 8px 0', padding:'10px 14px', marginBottom:12, fontSize:13,
                  lineHeight:1.65, fontStyle:'italic', whiteSpace:'pre-wrap' }}>{uc.prompt}</div>

                {uc.context_note && (
                  <div style={{ background:'#F0F9FF', border:'1px solid #BAE6FD', borderLeft:'4px solid #0EA5E9',
                    borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:'#0C4A6E', lineHeight:1.65 }}>
                    <div style={{ fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, color:'#0369A1' }}>📋 Konteks untuk kandidat</div>
                    {uc.context_note}
                  </div>
                )}

                {uc.trap && (
                  <div style={{ background:'#FBF3D5', borderLeft:'3px solid #BF8F00', borderRadius:'0 8px 8px 0',
                    padding:'8px 12px', marginBottom:12, fontSize:13, color:'#4B3500' }}>
                    <strong>Situasi tersembunyi:</strong> {uc.trap}
                  </div>
                )}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
                  {[
                    { label:'Skor 1', text:uc.waspadai, bg:'#FBE4E4', color:'#C00000', border:'#F9A8A8' },
                    { label:'Skor 3', text:'Jawaban masuk akal tapi generik, belum menunjukkan kedalaman atau pola khas.', bg:'#FBF3D5', color:'#BF8F00', border:'#F5C842' },
                    { label:'Skor 5', text:uc.cari, bg:'#E2EFDA', color:'#548235', border:'#86EFAC' },
                  ].map(r => (
                    <div key={r.label} style={{ background:r.bg, border:`1px solid ${r.border}`, borderRadius:8, padding:'10px 12px' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:r.color, marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' }}>{r.label}</div>
                      <div style={{ fontSize:12, lineHeight:1.6 }}>{r.text}</div>
                    </div>
                  ))}
                </div>

                {uc.signal && (
                  <div style={{ fontSize:13, color:'#2E75B6', fontStyle:'italic', borderLeft:'3px solid #2E75B6', paddingLeft:10, lineHeight:1.6, marginBottom:8 }}>
                    <strong style={{ fontStyle:'normal' }}>Sinyal PM vs Product:</strong> {uc.signal}
                  </div>
                )}

                {uc.calibration_warning && (
                  <div style={{ marginTop:8, background:
                    uc.calibration_warning.type==='score3ok'?'#E2EFDA':uc.calibration_warning.type==='scale'?'#FBF3D5':uc.calibration_warning.type==='delivery'?'#EEEDFE':'#EBF4FA',
                    border:`1px solid ${uc.calibration_warning.type==='score3ok'?'#548235':uc.calibration_warning.type==='scale'?'#BF8F00':uc.calibration_warning.type==='delivery'?'#534AB7':'#2E75B6'}`,
                    borderLeft:`4px solid ${uc.calibration_warning.type==='score3ok'?'#548235':uc.calibration_warning.type==='scale'?'#BF8F00':uc.calibration_warning.type==='delivery'?'#534AB7':'#2E75B6'}`,
                    borderRadius:8, padding:'10px 14px', fontSize:13 }}>
                    <div style={{ fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5,
                      color:uc.calibration_warning.type==='score3ok'?'#27500A':uc.calibration_warning.type==='scale'?'#633806':uc.calibration_warning.type==='delivery'?'#3C3489':'#0C447C' }}>
                      ⚠ Kalibrasi Penilai — {uc.calibration_warning.label}
                    </div>
                    <div style={{ lineHeight:1.6 }}>{uc.calibration_warning.text}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Mekanisme Deteksi PM vs Product ── */}
      {activeTab === 'mekanisme' && (
        <div>
          <div style={{ background:'#FBF3D5', border:'1px solid #BF8F00', borderRadius:10,
            padding:'14px 18px', marginBottom:20, fontSize:14, color:'#4B3500', lineHeight:1.7 }}>
            <strong>Aturan emas:</strong> PM-fit tidak pernah ditanya terbuka ("kamu suka eksekusi atau strategi?") —
            kandidat pintar akan menjawab sesuai yang dikira pewawancara mau.
            PM-fit dipancing lewat <strong>struktur soal</strong>. Empat mekanisme berikut ditanam ke seluruh stage.
          </div>

          {MEKANISME_PM.map((m, i) => (
            <div key={i} style={{ border:'0.5px solid var(--color-border-tertiary)', borderRadius:10,
              padding:'14px 18px', marginBottom:12 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#2E75B6', marginBottom:8 }}>{m.label}</div>
              <div style={{ fontSize:13, color:'var(--color-text-primary)', lineHeight:1.7 }}>{m.desc}</div>
            </div>
          ))}

          <div style={{ marginTop:20 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Pemetaan mekanisme ke stage</div>
            <div style={{ border:'0.5px solid var(--color-border-tertiary)', borderRadius:10, overflow:'hidden' }}>
              {[
                { mek:'M1 — Locked-Scope Trap', stage:'Stage 2 (Situasi & Logika), Stage 3 (Case Study)' },
                { mek:'M2 — Sumber Kepuasan', stage:'Stage 1 (Aplikasi), Stage 4 (Panel)' },
                { mek:'M3 — Redirection Moment', stage:'Stage 4 (Panel — role-play)' },
                { mek:'M4 — Pertanyaan Pertama', stage:'Stage 3 (Case Study), Stage 4 (Panel)' },
              ].map((r, i, arr) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'220px 1fr',
                  borderBottom: i<arr.length-1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                  padding:'11px 16px', background: i%2===0 ? 'var(--color-background-primary)' : 'var(--color-background-secondary)' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#2E75B6' }}>{r.mek}</div>
                  <div style={{ fontSize:13, color:'var(--color-text-secondary)' }}>{r.stage}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:20, background:'var(--color-background-secondary)', borderRadius:10, padding:'16px 18px' }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Matriks keputusan akhir</div>
            <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:12 }}>
              Arah PM-fit adalah filter terpisah dari skor — bukan bagian dari rata-rata.
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[
                { profil:'A&B tinggi + C kuat + D lolos', pm:'HIRE — target utama', product:'Salah pintu', pmBg:'#E2EFDA', pmColor:'#27500A' },
                { profil:'A&B sedang + C kuat + D lolos', pm:'HIRE dengan pengembangan', product:'Lewati', pmBg:'#EBF4FA', pmColor:'#0C447C' },
                { profil:'A&B tinggi tapi C lemah', pm:'Hati-hati — risiko grooming', product:'Lewati', pmBg:'#FBF3D5', pmColor:'#633806' },
                { profil:'D gagal (gerbang mati)', pm:'NO — apapun skor lainnya', product:'NO', pmBg:'#FBE4E4', pmColor:'#791F1F' },
              ].map((r, i) => (
                <React.Fragment key={i}>
                  <div style={{ padding:'10px 12px', background:'var(--color-background-primary)',
                    borderRadius:8, fontSize:12, fontWeight:500 }}>{r.profil}</div>
                  <div style={{ padding:'10px 12px', background:r.pmBg, borderRadius:8,
                    fontSize:12, fontWeight:700, color:r.pmColor }}>{r.pm}</div>
                  <div style={{ padding:'10px 12px', background:'#FBE4E4', borderRadius:8,
                    fontSize:12, color:'#C00000', fontWeight:600 }}>{r.product}</div>
                </React.Fragment>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:4 }}>
              <div style={{ fontSize:11, color:'var(--color-text-secondary)', padding:'4px 12px' }}>Profil kandidat</div>
              <div style={{ fontSize:11, color:'var(--color-text-secondary)', padding:'4px 12px' }}>PM-fit / Netral</div>
              <div style={{ fontSize:11, color:'var(--color-text-secondary)', padding:'4px 12px' }}>Product-lean</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
