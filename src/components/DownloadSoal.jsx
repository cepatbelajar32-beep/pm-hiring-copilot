import React, { useState } from 'react';
import { getActiveUCsFromBatch } from '../data/bank';

// Generate PDF via HTML-to-print approach (tidak butuh library eksternal)
function generatePDFContent(batch, ucs) {
  const stageLabels = {
    stage1: 'Stage 1 — Aplikasi Awal (Async · 30 menit)',
    stage2: 'Stage 2 — Penilaian Situasi & Logika (Async · 45 menit)',
    stage3: 'Stage 3 — Case Study (Take-home · 2 jam · 50-60 mnt per soal)',
  };

  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Soal ${batch.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #111; line-height: 1.6; padding: 40px; }
  .cover { text-align: center; padding: 60px 0 40px; border-bottom: 2px solid #1F3864; margin-bottom: 40px; }
  .cover h1 { font-size: 24px; color: #1F3864; margin-bottom: 8px; }
  .cover h2 { font-size: 16px; color: #374151; font-weight: 400; margin-bottom: 16px; }
  .cover .meta { font-size: 12px; color: #6B7280; }
  .stage-header { background: #1F3864; color: white; padding: 10px 16px; border-radius: 6px; margin: 32px 0 18px; font-size: 14px; font-weight: 700; }
  .stage-info { background: #F3F4F6; padding: 10px 14px; border-radius: 6px; margin-bottom: 18px; font-size: 12px; color: #374151; }
  .uc-block { border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 18px; overflow: hidden; page-break-inside: avoid; }
  .uc-header { background: #F9FAFB; padding: 10px 14px; border-bottom: 1px solid #E5E7EB; display: flex; gap: 10px; align-items: center; }
  .uc-id { background: #EBF4FA; color: #0C447C; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 11px; font-weight: 700; }
  .uc-title { font-size: 13px; font-weight: 700; color: #111827; flex: 1; }
  .uc-klaster { font-size: 11px; color: #6B7280; }
  .uc-body { padding: 14px; }
  .context-note { background: #F0F9FF; border-left: 4px solid #0EA5E9; padding: 10px 14px; margin-bottom: 12px; font-size: 12px; color: #0C4A6E; border-radius: 0 6px 6px 0; }
  .context-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #0369A1; margin-bottom: 5px; }
  .prompt { font-size: 13px; color: #111827; line-height: 1.7; white-space: pre-wrap; }
  .answer-space { margin-top: 16px; border: 1px dashed #D1D5DB; border-radius: 6px; padding: 12px; min-height: 120px; background: #FAFAFA; }
  .answer-label { font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }
  .wajib-badge { background: #FBF3D5; color: #BF8F00; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
  .page-break { page-break-after: always; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF; text-align: center; }
  @media print {
    body { padding: 20px; }
    .stage-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .context-note { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .uc-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="cover">
  <div style="font-size:11px;color:#6B7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em">PM Hiring Co-Pilot</div>
  <h1>Soal Rekrutmen Junior IT PM</h1>
  <h2>${batch.name}</h2>
  <div class="meta">
    Dibuat: ${new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })} &nbsp;·&nbsp;
    Bersifat rahasia — tidak untuk disebarluaskan
  </div>
</div>

<div style="background:#FBF3D5;border-left:4px solid #BF8F00;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:32px;font-size:12px;color:#4B3500">
  <strong>Petunjuk untuk kandidat:</strong> Jawab setiap pertanyaan secara jujur berdasarkan pengalaman nyata Anda. 
  Tidak ada jawaban yang benar atau salah. Fokuslah pada cerita konkret, bukan jawaban yang terdengar "benar".
  Waktu pengerjaan sesuai instruksi di setiap stage.
</div>`;

  // Stage 1
  if (ucs.stage1?.length > 0) {
    html += `<div class="stage-header">Stage 1 — Aplikasi Awal</div>
<div class="stage-info">
  <strong>Waktu:</strong> 30 menit &nbsp;·&nbsp; <strong>Format:</strong> Async (dikerjakan mandiri) &nbsp;·&nbsp; <strong>Jumlah soal:</strong> ${ucs.stage1.length}
  <br>Ceritakan pengalaman nyata. Jawaban yang konkret dan jujur lebih dihargai dari jawaban yang terdengar sempurna.
</div>`;

    ucs.stage1.forEach((uc, i) => {
      html += `<div class="uc-block">
  <div class="uc-header">
    <span class="uc-id">${uc.id}</span>
    <span class="uc-title">${i + 1}. ${uc.title}</span>
    <span class="uc-klaster">Klaster ${uc.klaster}</span>
  </div>
  <div class="uc-body">
    ${uc.context_note ? `<div class="context-note"><div class="context-label">📋 Konteks</div>${uc.context_note}</div>` : ''}
    <div class="prompt">${uc.prompt}</div>
    <div class="answer-space"><div class="answer-label">Jawaban Anda</div></div>
  </div>
</div>`;
    });
  }

  // Stage 2
  if (ucs.stage2?.length > 0) {
    html += `<div class="page-break"></div>
<div class="stage-header">Stage 2 — Penilaian Situasi &amp; Logika</div>
<div class="stage-info">
  <strong>Waktu:</strong> 45 menit &nbsp;·&nbsp; <strong>Format:</strong> Async (dikerjakan mandiri) &nbsp;·&nbsp; <strong>Jumlah soal:</strong> ${ucs.stage2.length}
  <br>Setiap soal memiliki dua pilihan. Pilih satu dan jelaskan alasan Anda beserta konsekuensi dari pilihan tersebut.
</div>`;

    ucs.stage2.forEach((uc, i) => {
      html += `<div class="uc-block">
  <div class="uc-header">
    <span class="uc-id">${uc.id}</span>
    <span class="uc-title">${i + 1}. ${uc.title}</span>
    <span class="uc-klaster">Klaster ${uc.klaster}</span>
  </div>
  <div class="uc-body">
    ${uc.context_note ? `<div class="context-note"><div class="context-label">📋 Konteks</div>${uc.context_note}</div>` : ''}
    <div class="prompt">${uc.prompt}</div>
    <div class="answer-space"><div class="answer-label">Pilihan Anda + Alasan + Konsekuensi</div></div>
  </div>
</div>`;
    });
  }

  // Stage 3
  if (ucs.stage3?.length > 0) {
    html += `<div class="page-break"></div>
<div class="stage-header">Stage 3 — Case Study (Take-home)</div>
<div class="stage-info">
  <strong>Waktu:</strong> 2 jam total &nbsp;·&nbsp; <strong>Format:</strong> Take-home (dikerjakan di rumah) &nbsp;·&nbsp; <strong>Jumlah soal:</strong> ${ucs.stage3.length}
  <br>Alokasikan 50-60 menit per soal. Hasil pekerjaan bisa berupa dokumen tertulis, diagram, atau format lain yang relevan.
  <br>Soal terakhir (Refleksi) wajib dikerjakan oleh semua kandidat.
</div>`;

    ucs.stage3.forEach((uc, i) => {
      const isWajib = uc.id === 'UC_3_10';
      html += `<div class="uc-block">
  <div class="uc-header">
    <span class="uc-id">${uc.id}</span>
    <span class="uc-title">${i + 1}. ${uc.title}</span>
    ${isWajib ? '<span class="wajib-badge">WAJIB</span>' : `<span class="uc-klaster">Klaster ${uc.klaster}</span>`}
  </div>
  <div class="uc-body">
    ${uc.context_note ? `<div class="context-note"><div class="context-label">📋 Konteks</div>${uc.context_note}</div>` : ''}
    <div class="prompt">${uc.prompt}</div>
    <div class="answer-space" style="min-height:${isWajib ? '80px' : '160px'}">
      <div class="answer-label">${isWajib ? 'Refleksi Anda' : 'Hasil pekerjaan Anda'}</div>
    </div>
  </div>
</div>`;
    });
  }

  html += `<div class="footer">
  PM Hiring Co-Pilot &nbsp;·&nbsp; ${batch.name} &nbsp;·&nbsp; Dokumen Rahasia
</div>

</body>
</html>`;

  return html;
}

export default function DownloadSoal({ batches }) {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [loading, setLoading] = useState(false);

  const activeBatches = batches.filter(b => b.status === 'active' || b.status === 'completed');

  function handleDownload() {
    if (!selectedBatch) return;
    const batch = batches.find(b => b.id === selectedBatch);
    if (!batch) return;

    setLoading(true);

    const ucs = getActiveUCsFromBatch(batch);
    if (!ucs) {
      alert('Batch ini dibuat sebelum fitur rotasi aktif — data UC tidak tersedia.');
      setLoading(false);
      return;
    }

    const htmlContent = generatePDFContent(batch, ucs);

    // Buka di tab baru dan trigger print-to-PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        setLoading(false);
      }, 500);
    };
  }

  return (
    <div>
      <div style={{ background:'var(--color-background-secondary)', borderRadius:12, padding:'14px 18px',
        marginBottom:20, fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.6 }}>
        Download soal Stage 1, 2, dan 3 untuk dikirimkan ke kandidat. Format PDF berisi semua UC aktif
        di batch yang dipilih beserta ruang untuk menjawab.
      </div>

      <div className="card">
        <div className="card-title">Download Soal per Batch</div>

        <div className="field" style={{ marginBottom: 16 }}>
          <label>Pilih Batch</label>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
            <option value="">— Pilih batch —</option>
            {activeBatches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {selectedBatch && (() => {
          const batch = batches.find(b => b.id === selectedBatch);
          const ucs = batch ? getActiveUCsFromBatch(batch) : null;
          if (!ucs) return (
            <div style={{ fontSize:13, color:'#BF8F00', marginBottom:16 }}>
              ⚠ Batch ini dibuat sebelum fitur rotasi aktif — data UC tidak tersedia.
            </div>
          );
          return (
            <div style={{ background:'#F9FAFB', borderRadius:8, padding:'12px 16px', marginBottom:16,
              border:'1px solid #E5E7EB', fontSize:13 }}>
              <div style={{ fontWeight:600, marginBottom:8 }}>Preview UC yang akan masuk PDF:</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {[
                  { label:'Stage 1', ucs: ucs.stage1, color:'#2E75B6' },
                  { label:'Stage 2', ucs: ucs.stage2, color:'#548235' },
                  { label:'Stage 3', ucs: ucs.stage3, color:'#BF8F00' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize:11, fontWeight:700, color:s.color, marginBottom:5,
                      textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</div>
                    {(s.ucs || []).map(uc => (
                      <div key={uc.id} style={{ fontSize:12, color:'#374151', marginBottom:3,
                        display:'flex', gap:6, alignItems:'center' }}>
                        <span style={{ fontFamily:'monospace', fontSize:10, color:s.color,
                          background:'white', padding:'1px 5px', borderRadius:3,
                          border:`1px solid ${s.color}44`, flexShrink:0 }}>{uc.id}</span>
                        <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{uc.title}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button className="btn btn-primary" onClick={handleDownload}
            disabled={!selectedBatch || loading}>
            {loading
              ? <><div className="spinner"/> Membuka...</>
              : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:6}}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>Download PDF Soal</>
            }
          </button>
          <span style={{ fontSize:12, color:'#9CA3AF' }}>
            Akan membuka tab baru → Print → Save as PDF
          </span>
        </div>
      </div>

      {/* Info cara print */}
      <div style={{ marginTop:16, background:'#EBF4FA', border:'1px solid #2E75B6',
        borderRadius:10, padding:'14px 18px', fontSize:13, color:'#1F3864' }}>
        <div style={{ fontWeight:700, marginBottom:8 }}>📄 Cara simpan sebagai PDF:</div>
        <div style={{ lineHeight:1.8 }}>
          1. Klik <strong>Download PDF Soal</strong> — tab baru akan terbuka dengan dialog print<br/>
          2. Di dialog print, pilih <strong>"Save as PDF"</strong> atau <strong>"Microsoft Print to PDF"</strong><br/>
          3. Klik Save — file PDF tersimpan di komputer Anda<br/>
          4. Kirimkan PDF ke kandidat sesuai batch
        </div>
      </div>
    </div>
  );
}
