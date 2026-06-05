// src/data/bank.js — 40 UC statis, AI tidak generate ulang

export const BANK = {
  stage1: [
    { id:"UC_1_1", title:"Sumber Kepuasan", klaster:"A/C", mechanism:"M2",
      prompt:"Ceritakan satu pencapaian yang paling Anda banggakan — apa pun, tidak harus soal IT. Apa peran Anda, dan kenapa itu yang paling membekas?",
      cari:"Energi di closure & orchestration: rapikan kekacauan, satukan orang, tuntaskan hal sulit.",
      waspadai:"Bangga pada hal pasif. Peran kabur. Atau klaim heroik tanpa detail.",
      signal:"PM: bangga menuntaskan. Product: bangga menemukan/mendefinisikan ulang masalah." },
    { id:"UC_1_2", title:"Orchestration Tanpa Otoritas", klaster:"B",
      prompt:"Ceritakan saat Anda harus membuat sekelompok orang yang tidak wajib menurut pada Anda tetap bergerak ke satu tujuan. Bagaimana Anda melakukannya?",
      cari:"Menggerakkan lewat pemahaman motivasi tiap orang, bukan perintah.",
      waspadai:"Mengandalkan otoritas formal. Menyerah saat orang tak kooperatif.", signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad mengenal orchestration dari himpunan/kepanitiaan. Tolok ukur = pernah gerakkan orang tanpa jabatan formal, bukan kecanggihan teknik manajemen.' } },
    { id:"UC_1_3", title:"Realistic Expectations", klaster:"C",
      prompt:"Menurut Anda, hari-hari seorang Junior IT PM sebenarnya diisi oleh apa? Apa yang membuat Anda yakin itu cocok untuk Anda?",
      cari:"Sadar sisi tak-glamor (ngejar update, tengahi konflik) dan tetap tertarik karena alasan masuk akal.",
      waspadai:"Bayangan glamor/strategis. Tidak menyebut kerja koordinasi harian.", signal:null },
    { id:"UC_1_4", title:"Ownership / Agency", klaster:"C",
      prompt:"Ceritakan satu hal yang gagal atau berantakan, di mana Anda terlibat. Apa yang terjadi dan apa peran Anda di dalamnya?",
      cari:"Ambil tanggung jawab atas bagian spesifik miliknya. Ada pelajaran konkret yang dipakai kemudian.",
      waspadai:"Semua sebab di luar dirinya. Tidak ada 'saya bisa lakukan berbeda'.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad belum punya cerita gagal berskala besar. Nilai kejujuran dan pelajaran konkretnya — bukan skala kejadiannya. Kegagalan kecil yang diakui jujur > kegagalan besar yang disalahkan orang lain.' } },
    { id:"UC_1_5", title:"Reading Between the Lines", klaster:"A",
      prompt:"Atasan/dosen Anda berkata: 'Bagus kok, nanti saja kita bahas lagi.' Menurut Anda dia sebenarnya sedang mengatakan apa? Apa yang Anda lakukan?",
      cari:"Menangkap kemungkinan penolakan halus, lalu menggali dengan cara tidak memaksa.",
      waspadai:"Menerima harfiah. Tidak terpikir ada maksud lain.", signal:null ,
      calibration_warning: { type: 'delivery', label: 'Nilai substansi, bukan cara penyampaian', color: 'purple', text: 'Fresh grad dari budaya akademik cenderung membaca komunikasi secara harfiah. Perhatikan apakah ada kesadaran bahwa ada lapisan di balik kata-kata, bukan seberapa canggih interpretasinya.' } },
    { id:"UC_1_6", title:"Coachability", klaster:"C",
      prompt:"Ceritakan satu feedback yang awalnya tidak Anda setujui atau sulit Anda terima. Apa yang akhirnya Anda lakukan?",
      cari:"Awalnya tidak setuju, lalu benar-benar mencerna dan berubah. Bisa jelaskan kenapa feedback itu ternyata benar.",
      waspadai:"Tidak bisa menyebut satu pun. Atau menceritakan yang ia tolak dan tetap merasa benar.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Banyak fresh grad belum terbiasa menerima feedback konstruktif di lingkungan formal. Jawaban yang ragu-ragu atau butuh waktu bisa berarti jujur — bukan tidak coachable. Yang diukur: apakah akhirnya berubah, bukan seberapa cepat menerima.' } },
    { id:"UC_1_7", title:"Business–IT Translation", klaster:"B",
      prompt:"Bayangkan seorang manajer non-teknis berkata: 'Pokoknya saya mau sistemnya bisa otomatis, secepatnya.' Bagaimana Anda menanggapinya?",
      cari:"Menggali maksud bisnis di balik 'otomatis' & 'secepatnya', lalu terjemahkan ke kebutuhan konkret — dua arah.",
      waspadai:"Langsung mengiyakan. Atau membombardir dengan jargon teknis.", signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah berhadapan langsung dengan stakeholder bisnis. Nilai kemampuan berpikir dari dua sudut (bisnis ↔ teknis) — bukan penguasaan domain bisnis yang memang belum dimiliki.' } },
    { id:"UC_1_8", title:"Convergent Thinking & Decisive", klaster:"A/C", mechanism:"M1",
      prompt:"Anda diberi tugas tanpa instruksi lengkap dan tenggat dekat. Informasi tidak akan pernah 100% lengkap. Apa yang Anda lakukan?",
      cari:"Buat asumsi eksplisit, tetapkan keputusan yang bisa direvisi, bergerak maju. Nyaman mengunci arah meski info tak lengkap.",
      waspadai:"Lumpuh tanpa instruksi. Atau menuntut semua informasi dulu.",
      signal:"PM: kunci & eksekusi. Product: terus gali 'apakah ini masalah yang benar' tanpa bergerak." },
    { id:"UC_1_9", title:"Persistent", klaster:"C",
      prompt:"Ceritakan saat Anda terus mendorong sesuatu yang terus ditolak, diabaikan, atau dihambat. Apa yang membuat Anda tetap mendorong, dan kapan Anda memutuskan berhenti (atau tidak)?",
      cari:"Adaptif: ubah pendekatan, cari jalur lain, bangun koalisi. Keteguhan cerdas bukan keras kepala.",
      waspadai:"Tidak punya cerita. Atau langsung menyerah saat pertama diabaikan.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad jarang punya cerita perjuangan multi-bulan yang dramatis. Nilai pola adaptif-nya: apakah ubah pendekatan saat jalan pertama tidak berhasil? Bukan epik ceritanya.' } },
    { id:"UC_1_10", title:"Self-Management Under Load", klaster:"D",
      prompt:"Saat Anda punya banyak hal mendesak sekaligus dan semua terasa penting, bagaimana Anda memutuskan apa yang dikerjakan duluan? Beri contoh nyata.",
      cari:"Prioritaskan berdasar dampak & konsekuensi. Bisa jelaskan trade-off yang diambil.",
      waspadai:"Asal jalan/berdasar mood. Atau lumpuh karena semua terasa sama penting.", signal:null }
  ],
  stage2: [
    { id:"UC_2_1", title:"Locked-Scope Trap", klaster:"A", mechanism:"M1",
      prompt:"Fitur X sudah masuk dalam SOW. Di tengah pengerjaan Anda menemukan cara yang lebih baik untuk user.\n\nDua jalan:\n1. Selesaikan versi SOW sekarang; catat ide untuk fase berikutnya.\n2. Ajukan change request resmi sekarang dengan analisis dampak ke timeline & budget.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Tim sudah mengerjakan 60% versi yang disepakati, dan deadline tinggal 3 minggu.",
      cari:"Menyadari situasi sesungguhnya: tim sudah mengerjakan 60% dan deadline tinggal 3 minggu — ini bukan saat yang tepat untuk perubahan besar. Sadar ada konsekuensi dari pilihan yang diambil, dan cenderung memilih menyelesaikan komitmen yang sudah berjalan.",
      waspadai:"Tidak menyadari situasi di skenario: tim sudah 60% jalan dan deadline mepet. Atau langsung ubah sendiri tanpa proses change request.",
      signal:"Indikasi arah Product Manager: berpikir 'kesepakatan bisa diubah kalau manfaat untuk user lebih besar', tanpa mempertimbangkan dampak ke tim yang sedang mengerjakan." },
    { id:"UC_2_2", title:"Hybrid Tension", klaster:"A/B",
      prompt:"Tim teknis usul perbaikan internal yang memperlambat ~1 minggu tapi (klaim mereka) bikin sistem lebih aman jangka panjang. Scope & budget sudah dikunci. (Tidak perlu paham detail teknisnya.)\n\nDua jalan:\n1. Tahan usulan; jaga tanggal rilis demi komitmen yang sudah ada.\n2. Minta tim kuantifikasi dampak; jika layak, angkat ke stakeholder dengan opsi.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Rilis ini terikat komitmen ke divisi lain yang sudah menjadwalkan pelatihan user di tanggal rilis.",
      cari:"Menyadari keputusan ini punya riak ke divisi lain; menuntut data DAN menimbang komitmen eksternal.",
      waspadai:"Tidak menyadari ada komitmen ke divisi lain yang jadwalnya terikat tanggal rilis ini. Atau setujui usulan tim tanpa menilai dampaknya.", signal:null },
    { id:"UC_2_3", title:"Vendor Mulai Telat", klaster:"B",
      prompt:"Vendor (pihak ketiga, tak bisa Anda perintah langsung) yang mengerjakan bagian penting mulai sering meleset dari tenggat kecil. Setiap ditanya: 'aman kok, nanti terkejar.' Bagian ini dibutuhkan tiga minggu lagi.\n\nDua jalan:\n1. Beri ruang berdasar rekam jejak baik, tapi tetapkan satu titik cek konkret minggu ini.\n2. Perketat pengawasan sekarang — minta bukti progres nyata, siapkan rencana cadangan.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Vendor ini tahun lalu menyelamatkan proyek lain di detik akhir; hubungan selama ini baik.",
      cari:"Rekam jejak baik bukan jaminan sekarang; jaga hubungan tapi punya garis tegas.",
      waspadai:"Percaya begitu saja karena rekam jejak baik — padahal sinyal sekarang berbeda. Atau sebaliknya, langsung perketat pengawasan tanpa mempertimbangkan hubungan baik yang sudah dibangun.",
      context_note: 'Dalam proyek IT, pekerjaan sering dilakukan oleh pihak ketiga (vendor) — perusahaan luar yang dikontrak untuk mengerjakan bagian tertentu. Berbeda dengan anggota tim internal, vendor tidak bisa diperintah langsung; hubungannya dikelola lewat kontrak dan komunikasi. Sebagai PM, Anda bertanggung jawab memastikan vendor deliver tepat waktu meski mereka bukan bawahan Anda.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah kelola vendor secara nyata. Yang dinilai: apakah sadar bahwa rekam jejak baik ≠ garansi performa sekarang, dan apakah tahu cara menjaga hubungan sambil tetap waspada. Bukan teknis vendor management.' } },
    { id:"UC_2_4", title:"Scope Creep Halus", klaster:"A/C",
      prompt:"Seorang stakeholder bisnis sering menyelipkan permintaan kecil di tengah jalan — 'ini sedikit saja kok', 'sekalian ya'. Satu-satu terlihat sepele, tapi menumpuk.\n\nDua jalan:\n1. Akomodasi yang kecil-kecil demi relasi, tapi mulai catat & batasi.\n2. Tunjukkan akumulasi dampak sekarang, arahkan semua ke mekanisme perubahan resmi.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Stakeholder ini baru saja membantu mempercepat approval anggaran minggu lalu — ada 'utang budi'.",
      cari:"Menyeimbangkan: hargai relasi tanpa membiarkan scope creep; buat dampak terlihat dengan cara yang tidak membuat stakeholder merasa dipermalukan atau disudutkan.",
      waspadai:"Turuti semua karena utang budi (scope creep) atau tolak kaku tanpa menavigasi relasi.", signal:null },
    { id:"UC_2_5", title:"Konflik Prioritas Antar-Stakeholder", klaster:"A/B",
      prompt:"Dua stakeholder dengan jabatan setara meminta tim mengerjakan hal berbeda lebih dulu, dan keduanya merasa paling mendesak. Anda di tengah.\n\nDua jalan:\n1. Bawa ke kriteria objektif (dampak nyata, siapa yang dependency), fasilitasi keputusan bersama.\n2. Naikkan ke atasan bersama untuk diputuskan.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Salah satunya benar secara objektif (pekerjaannya memblokir tim lain), tapi menyampaikannya kurang asertif sehingga kalah 'berisik'.",
      cari:"Menemukan satu pihak punya dependency yang memblokir orang lain — memutuskan berdasar fakta, bukan volume suara.",
      waspadai:"Dahulukan yang lebih berisik. Atau bagi dua (beban tim tanpa menyelesaikan konflik).", signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Fresh grad belum punya pengalaman navigasi konflik antar stakeholder senior. Score 3 dengan logika berbasis fakta/dampak sudah sinyal kuat. Jangan tunggu jawaban dengan political savviness level senior.' } },
    { id:"UC_2_6", title:"Logika & Dependency", klaster:"A",
      prompt:"Sebuah proyek punya 4 pekerjaan:\n• A: 3 hari\n• B: 2 hari (butuh A selesai dulu)\n• C: 4 hari (bisa jalan bersamaan dengan A)\n• D: 1 hari (butuh B dan C selesai)\n\nPertanyaan:\n1. Berapa waktu tercepat seluruh proyek bisa selesai?\n2. Pekerjaan mana yang paling berbahaya bila terlambat?\n\nJelaskan alasan Anda. (Tidak perlu tahu istilah teknis — yang dinilai adalah logika Anda.)",
      trap:"Di soal disebut 'C dikerjakan vendor yang biasanya telat 1 hari'.",
      cari:"Benar 6 hari (A→B→D) DAN menangkap trap: jika C molor 1 hari, dua jalur jadi sama kritis. Berpikir risiko.",
      waspadai:"Menjumlah semua (10 hari) tanpa paham paralelisasi. Atau tidak menangkap risiko dari vendor yang dikenal sering telat.", signal:null },
    { id:"UC_2_7", title:"Production Incident", klaster:"B/D",
      prompt:"Sistem yang baru dirilis tiba-tiba bermasalah di jam sibuk. User bisnis panik dan menghubungi Anda terus-menerus. Tim teknis sedang menyelidiki. (Tidak perlu paham teknisnya.)\n\nDua jalan:\n1. Tunjuk satu kanal update terjadwal untuk semua (termasuk direktur), lindungi waktu koordinasi Anda.\n2. Penuhi permintaan direktur (lapor langsung tiap 15 menit) demi menjaga relasi penting.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Salah satu yang menghubungi adalah direktur yang meminta Anda lapor langsung ke dia tiap 15 menit — padahal itu menyita waktu dari mengoordinasi.",
      cari:"Lindungi kapasitas koordinasi tanpa mengabaikan direktur: update terjadwal + delegasikan satu liaison. Tegas + politik cerdas.",
      waspadai:"Ikut nyemplung benerin teknis, atau menuruti direktur sampai lalai koordinasi.",
      context_note: 'Dalam proyek IT, "production incident" adalah situasi di mana sistem yang sudah dirilis ke pengguna tiba-tiba bermasalah — misalnya aplikasi error, data tidak muncul, atau fitur tidak bisa dipakai. Ini kondisi darurat karena berdampak langsung ke pengguna yang sedang bekerja. Peran PM di sini bukan membenahi teknis (itu tugas tim teknis), tapi mengoordinasi semua pihak dan memastikan komunikasi berjalan lancar.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah menangani production incident nyata. Nilai urutan pikirnya dan kesadaran prioritas (koordinasi > memadamkan api sendiri) — bukan hafal protokol incident response.' } },
    { id:"UC_2_8", title:"Estimasi Terlalu Optimistis", klaster:"A/B",
      prompt:"Tim teknis memberi perkiraan waktu yang terasa terlalu cepat/optimistis bagi Anda. Anda bukan orang teknis dan tidak bisa menilai detailnya. (Tidak perlu jadi teknis — jelaskan bagaimana Anda menyikapinya sebagai PM.)\n\nDua jalan:\n1. Gali asumsi lewat pertanyaan (sudah masuk testing? revisi? dependensi?), ajak diskusi tanpa menggurui.\n2. Terima estimasi tapi pasang titik cek dini untuk mendeteksi meleset lebih awal.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Tim ini baru saja dikritik manajemen karena proyek sebelumnya lambat — ada tekanan untuk 'terlihat cepat'.",
      cari:"Membaca kenapa estimasi mungkin optimistis (tekanan manajemen), menggali tanpa mempermalukan tim. EQ + skeptisisme sehat.",
      waspadai:"Terima estimasi begitu saja, atau langsung memaksa tim memangkas. Tidak menyadari ada tekanan psikologis di balik angka yang diberikan.",
      context_note: 'Dalam proyek IT, tim teknis (developer, engineer) biasanya yang memberikan estimasi berapa lama suatu pekerjaan akan selesai. Sebagai PM yang bukan berlatar teknis, Anda tidak bisa menilai apakah estimasi itu realistis dari sisi teknis — tapi Anda tetap bertanggung jawab atas timeline keseluruhan proyek.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum punya feel untuk memperkirakan waktu pengerjaan teknis. Yang dinilai: apakah sadar estimasi punya bias, dan apakah bisa menggali tanpa mempermalukan tim. Bukan akurasi estimasinya sendiri.' } },
    { id:"UC_2_9", title:"Status 'Aman' yang Mencurigakan", klaster:"A/C",
      prompt:"Setiap laporan mingguan, satu anggota tim selalu melaporkan statusnya 'aman'. Tapi Anda perhatikan ia mulai jarang hadir di pertemuan harian dan jawabannya makin pendek.\n\nDua jalan:\n1. Dekati secara personal & tidak menghakimi untuk memahami kondisi sebenarnya.\n2. Fokus ke pekerjaan — minta ia tunjukkan progres konkret di pertemuan berikutnya.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Belakangan diketahui anggota ini sedang menghadapi masalah pribadi yang ia tutupi.",
      cari:"Membaca sinyal + mendekati dengan empati & aman; menyeimbangkan empati dengan kebutuhan proyek.",
      waspadai:"Percaya laporan begitu saja padahal ada sinyal yang tidak sesuai. Atau menegur langsung di forum bersama yang justru memperburuk situasi.", signal:null },
    { id:"UC_2_10", title:"Permintaan Bertentangan", klaster:"A/B",
      prompt:"Di tengah proyek, stakeholder meminta: tambah beberapa fitur baru, tapi tenggat dan budget tidak boleh berubah.\n\nDua jalan:\n1. Sajikan trade-off konkret (sesuatu harus mengalah: scope lain dipotong, waktu mundur, atau sumber daya ditambah) dan minta stakeholder memutuskan.\n2. Cari dulu apakah ada fitur existing yang bisa ditunda agar yang baru muat, baru bawa opsi itu ke stakeholder.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Stakeholder ini adalah sponsor utama proyek — kalau kecewa, dukungan proyek bisa goyah. Tapi tim sudah bekerja di kapasitas penuh.",
      cari:"Tangkap dua tekanan (politik sponsor + lindungi tim): datang dengan solusi, jaga muka sponsor sambil lindungi kapasitas tim.",
      waspadai:"Langsung menyanggupi tanpa mempertimbangkan kapasitas tim. Atau menolak mentah tanpa memikirkan konsekuensi ke hubungan dengan sponsor proyek.", signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Fresh grad belum pernah jadi buffer antara sponsor dan kapasitas tim. Score 3 yang sadar ada dua sisi dan tidak langsung menyanggupi tanpa pikir panjang sudah cukup bagus. Score 5 kalau bisa navigasi keduanya dengan konkret.' } }
  ],
  stage3: [
    { id:"UC_3_1", title:"Project Charter dari Brief Berantakan", klaster:"A/B", mechanism:"M4",
      prompt:"Lampiran: email dari kepala divisi bisnis:\n\n\"Dear Tim IT,\n\nKami butuh aplikasi untuk memudahkan tim lapangan kami. Tolong segera dibuat ya, pokoknya sebelum akhir tahun. Kalau bisa yang simpel dan bisa dipakai semua orang. Nanti kita diskusi lebih lanjut. Terima kasih.\"\n\nTugas: Berdasarkan email di atas, buat ringkasan rencana proyek awal yang berisi:\n1. Tujuan & ruang lingkup kasar\n2. Hal-hal yang belum jelas dan perlu diklarifikasi\n3. Asumsi yang Anda buat\n4. Langkah pertama yang akan Anda lakukan\n\n(Brief ini sengaja tidak lengkap. Bagian dari penilaian adalah bagaimana Anda menangani informasi yang kurang. Tuliskan asumsi Anda secara eksplisit.)",
      cari:"Pisahkan tahu vs belum tahu. Asumsi eksplisit masuk akal. Tetap tetapkan langkah pertama konkret meski info kurang.",
      waspadai:"Menelan brief apa adanya & langsung menjawab. Atau lumpuh — hanya daftar keluhan info kurang.",
      signal:"PM: klarifikasi condong 'kapan, siapa, batasannya apa'. Product: seluruh dokumen mempertanyakan 'apakah ini solusi tepat' tanpa bergerak." },
    { id:"UC_3_2", title:"Prioritisasi dari Daftar Kacau", klaster:"A",
      prompt:"Lampiran: daftar 12 pekerjaan acak (campur penting & sepele, beberapa saling bergantung, beberapa 'permintaan VIP'):\n\n1. Update dokumen SOP yang sudah lama\n2. Persiapkan laporan bulanan untuk direktur (minggu depan)\n3. Balas email vendor yang sudah 3 hari menunggu\n4. Setup environment testing untuk fitur baru\n5. Rapat koordinasi dengan tim bisnis (permintaan VP)\n6. Review spesifikasi teknis dari analis\n7. Follow-up approval anggaran yang tertunda\n8. Update Jira/task tracker\n9. Demo fitur ke stakeholder (dijadwalkan besok)\n10. Investigasi bug yang dilaporkan user kemarin\n11. Susun agenda rapat berikutnya\n12. Baca dokumentasi sistem lama untuk pemahaman\n\nTugas: Susun urutan pengerjaan 2 minggu pertama dan jelaskan dasar prioritas Anda.",
      cari:"Memprioritaskan berdasar dampak + ketergantungan. Berani menunda 'VIP' dengan alasan jernih.",
      waspadai:"Mengurut berdasar urutan daftar/yang mudah. Atau menuruti VIP tanpa pertimbangan.", signal:null },
    { id:"UC_3_3", title:"Membaca Situasi dari Komunikasi", klaster:"A",
      prompt:"Lampiran: 3 cuplikan komunikasi:\n\nCuplikan 1 (chat internal, dikirim jam 11 malam):\n\"Oke fine, kita ikutin aja timeline-nya.\"\n[Dikirim oleh anggota tim yang biasanya aktif pagi]\n\nCuplikan 2 (email vendor, tanpa lampiran, tanpa detail):\n\"Progres berjalan sesuai rencana. Kami confident bisa deliver tepat waktu.\"\n\nCuplikan 3 (pesan stakeholder):\n\"Lanjut saja dulu, nanti kita lihat hasilnya. Saya percayakan ke tim.\"\n\nTugas:\n1. Apa yang sebenarnya sedang terjadi di balik ketiga komunikasi ini?\n2. Apa 3 langkah pertama yang akan Anda ambil?",
      cari:"Menangkap sinyal halus di ketiga cuplikan, menghubungkannya jadi gambaran utuh, merancang langkah yang menyentuh akar.",
      waspadai:"Membaca semua harfiah ('semua tampak baik'). Tidak menangkap satu pun sinyal tersembunyi.", signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Membaca sinyal sosial tersirat dari komunikasi butuh jam terbang. Score 3 wajar kalau tangkap 1–2 sinyal dari 3 cuplikan. Score 5 kalau menangkap ketiganya dan menghubungkannya jadi gambaran utuh.' } },
    { id:"UC_3_4", title:"Rencana Mitigasi Risiko", klaster:"A",
      prompt:"Konteks: Anda PM proyek migrasi sistem absensi karyawan dari manual ke digital, melibatkan 500 karyawan di 3 lokasi berbeda. Vendor mengerjakan development. Target go-live: 3 bulan.\n\nTugas: Identifikasi 3–5 risiko terbesar dan untuk tiap risiko jelaskan apa yang akan Anda lakukan untuk mencegah/menguranginya.\n\n(Brief ini sengaja tidak lengkap. Tuliskan asumsi Anda.)",
      cari:"Mengidentifikasi risiko yang benar-benar mengancam delivery. Memprioritaskan berdasar dampak × kemungkinan. Mitigasi konkret & realistis.",
      waspadai:"Risiko generik & permukaan ('takut telat') tanpa mitigasi nyata, atau mitigasi tak nyambung.", signal:null },
    { id:"UC_3_5", title:"Status Report Dua Audiens", klaster:"B/D",
      prompt:"Konteks: Proyek integrasi sistem HR sedang berjalan. Status terkini:\n• Pengerjaan sudah 70% selesai\n• Modul laporan telat ~1 minggu karena data dari divisi Finance belum lengkap\n• Risiko: tim teknis vendor mulai memberikan estimasi yang berbeda-beda\n\nTugas: Tulis 2 versi update singkat (maksimal 5 kalimat per versi):\n1. Untuk Direktur HR yang non-teknis\n2. Untuk tim teknis yang sedang mengerjakan",
      cari:"Dua versi benar-benar disesuaikan audiens: eksekutif dapat implikasi & keputusan tanpa jargon; teknis dapat detail actionable. Jujur soal masalah + sajikan rencana.",
      waspadai:"Dua versi nyaris sama. Atau menutupi keterlambatan. Atau penuh jargon untuk audiens bisnis.", signal:null },
    { id:"UC_3_6", title:"Keputusan di Bawah Tekanan Waktu", klaster:"A/C",
      prompt:"Hari ini H-14 sebelum rilis. Ada dua opsi yang harus Anda putuskan sekarang:\n\nOpsi A: Rilis tepat waktu, tapi potong 1 fitur pelaporan (fitur ini diminta tapi tidak ada di SOW asli).\n\nOpsi B: Tunda rilis 2 minggu, semua fitur lengkap (termasuk fitur pelaporan yang diminta kemudian).\n\nTugas: Pilih satu opsi, jelaskan alasan Anda, dan tuliskan bagaimana Anda mengomunikasikan keputusan ini ke stakeholder.\n\n(Brief ini sengaja tidak lengkap. Tuliskan asumsi Anda.)",
      cari:"Memilih tegas dengan alasan berbasis dampak. Mengakui konsekuensi opsi yang ditinggalkan. Menyiapkan komunikasi jujur + rencana ke stakeholder.",
      waspadai:"Menolak memilih ('butuh info lebih dulu' tanpa batas). Atau memilih tanpa alasan.", signal:null },
    { id:"UC_3_7", title:"Menemukan Lubang dalam Rencana", klaster:"A/D",
      prompt:"Lampiran: rencana proyek implementasi sistem absensi digital, 8 minggu:\n\nMinggu 1–2: Analisa kebutuhan (PIC: Budi)\nMinggu 2–3: Desain sistem (PIC: Budi)\nMinggu 3–5: Development (PIC: Vendor)\nMinggu 4–5: Testing & UAT (PIC: Budi + Tim HR)\nMinggu 6: Training user (PIC: Budi)\nMinggu 7–8: Go-live & stabilisasi (PIC: Budi + Vendor)\n\nTugas: Identifikasi masalah atau risiko tersembunyi dalam rencana ini dan usulkan perbaikannya.",
      cari:"Menemukan cacat tersembunyi (Budi over-allocated di minggu 4-5, Testing & Development overlap, UAT terlalu mepet go-live), menjelaskan kenapa berbahaya, mengusulkan perbaikan realistis.",
      waspadai:"Menerima rencana sebagai 'sudah baik'. Hanya temukan 1 masalah paling kasar.",
      context_note: 'Dalam proyek IT, sebelum sistem diserahkan ke pengguna biasanya ada fase UAT (User Acceptance Testing) — proses di mana pengguna mencoba sistem dan memastikan semua berjalan sesuai kebutuhan. Selain itu, satu orang yang dialokasikan ke terlalu banyak pekerjaan sekaligus (over-allocation) adalah risiko umum yang sering terlewat dalam perencanaan.', signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Fresh grad mungkin hanya menemukan 1–2 masalah dari rencana. Nilai kualitas analisisnya: apakah penjelasan kenapa itu berbahaya masuk akal? Bukan kuantitas temuan. Senior pun kadang butuh waktu untuk lihat semuanya.' } },
    { id:"UC_3_8", title:"Menangani Permintaan Perubahan", klaster:"A/C",
      prompt:"Lampiran: email dari stakeholder:\n\n\"Dear [nama PM],\n\nSetelah melihat demo kemarin, kami ingin menambahkan fitur export ke Excel di semua laporan. Ini penting sekali untuk operasional kami. Bisa dimasukkan ke rilis bulan depan ya? Terima kasih.\"\n\nKonteks: Ruang lingkup proyek sudah dikunci dan ditandatangani sebelumnya. Tidak ada fitur export di SOW.\n\nTugas: Tulis bagaimana Anda menanggapi email ini. Boleh dalam bentuk draf balasan + catatan langkah internal yang akan Anda ambil.",
      cari:"Menghormati komitmen yang dikunci, menggali kebutuhan sebenarnya, menjelaskan dampak & jalur perubahan dengan empati. Jaga hubungan + tetap disiplin.",
      waspadai:"Langsung mengiyakan (scope dianggap cair), atau menolak kasar tanpa menjaga hubungan.", signal:null },
    { id:"UC_3_9", title:"Mengoordinasi Pihak yang Tak Sinkron", klaster:"B",
      prompt:"Anda baru bergabung sebagai PM di proyek yang sudah berjalan 3 minggu. Setelah berbicara dengan tiga pihak, Anda temukan:\n\n• Tim teknis mengira scope-nya adalah sistem A + B\n• Vendor mengira hanya sistem A yang perlu dikerjakan\n• User bisnis mengira akan mendapat sistem A + B + C\n\nTugas: Tuliskan bagaimana Anda menyamakan pemahaman ketiga pihak ini, dan langkah konkret apa yang Anda ambil.\n\n(Brief ini sengaja tidak lengkap. Tuliskan asumsi Anda.)",
      cari:"Merancang cara menyatukan pemahaman (sumber kebenaran tunggal, konfirmasi tertulis) DAN mekanisme agar tetap sinkron ke depan.",
      waspadai:"Hanya menyalahkan salah satu pihak. Atau solusinya kabur ('akan saya koordinasikan') tanpa langkah nyata.",
      context_note: 'Bayangkan Anda baru bergabung sebagai PM di sebuah proyek yang sudah berjalan beberapa minggu. Anda belum terlibat dari awal, tapi sekarang jadi penanggung jawabnya. Situasi seperti ini sering terjadi di dunia kerja nyata — dan tantangannya adalah menyamakan pemahaman semua pihak yang sudah punya asumsi masing-masing.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah menjadi PM yang masuk di tengah jalan saat semua orang sudah punya asumsi berbeda. Nilai kejelasan berpikir dan langkah pragmatisnya — bukan teknis change management yang memang belum dipelajari.' } },
    { id:"UC_3_10", title:"Refleksi (wajib semua varian)", klaster:"C",
      prompt:"Setelah menyelesaikan tugas di atas, tambahkan satu paragraf singkat:\n\n\"Jika Anda punya waktu atau informasi lebih, apa yang akan Anda lakukan berbeda? Dan bagian mana dari jawaban Anda yang paling tidak Anda yakini?\"",
      cari:"Jujur menunjuk bagian terlemah dari jawabannya sendiri dan kenapa. Self-awareness + keterbukaan pada koreksi.",
      waspadai:"Mengklaim semuanya sudah sempurna/tak ada yang diubah. Atau refleksinya kosong.", signal:null }
  ],
  stage4: [
    { id:"UC_4_1", title:"Redirection Moment", klaster:"A/C", mechanism:"M3",
      prompt:"[Role-play 2 babak]\n\nBabak A: 'Scope sudah dikunci, deadline mundur 2 minggu karena satu pihak telat, tim mulai panik. Saya berperan sebagai anggota tim. Pimpin situasi ini.'\n\nBabak B (ubah aturan setelah 5–7 menit): 'Sekarang aturan berubah — Anda bebas sepenuhnya. Boleh batalkan fitur apa pun, ubah apa pun, asalkan hasil akhirnya lebih bernilai bagi bisnis. Apa yang Anda lakukan?'",
      cari:"Di babak mana ia lebih hidup, terstruktur, energik? PM-fit menyala di Babak A; di Babak B refleksnya mencari kepastian eksekusi ('tapi kita komit kirim apa?').",
      waspadai:"Lumpuh di Babak A, atau membongkar semua di Babak B tanpa mempertimbangkan komitmen delivery.",
      signal:"Menyala di A + refleks 'tapi kita komit kirim apa?' di B = PM-fit. Menyala di B + terkekang di A = Product-fit." },
    { id:"UC_4_2", title:"Pendalaman Sumber Kepuasan", klaster:"A/C", mechanism:"M2",
      prompt:"'Di Stage 1 tadi Anda menyebut pencapaian [X]. Ceritakan lebih detail — apa peran persis Anda, bagian tersulitnya apa, dan kenapa itu yang paling membekas?'\n\nProbe follow-up:\n• 'Konkretnya, apa yang Anda lakukan saat X terjadi?'\n• 'Siapa lagi yang terlibat, dan apa kontribusi spesifik Anda vs mereka?'",
      cari:"Cerita makin kaya saat didalami. Energi terbesar muncul saat menceritakan 'membuat sesuatu sampai jadi / menyatukan orang'.",
      waspadai:"Cerita runtuh saat didalami (klaim membesar). Atau peran dirinya ternyata pasif.", signal:null },
    { id:"UC_4_3", title:"Klarifikasi Artefak Stage 3", klaster:"C",
      prompt:"'Di tugas Stage 3 tadi, Anda membuat asumsi [Y] dan memutuskan [Z]. Coba jelaskan kenapa — dan kalau sekarang diberi waktu lebih, apakah Anda akan memutuskan berbeda?'\n\n(Isi [Y] dan [Z] dari artefak Stage 3 yang sudah Anda baca sebelum panel.)",
      cari:"Penalaran jernih, terbuka pada sudut pandang baru, bisa berkata 'kalau tahu ini, saya akan ubah' tanpa rapuh. Percaya diri DAN coachable.",
      waspadai:"Tak bisa jelaskan alasannya sendiri (mungkin bukan murni karyanya). Atau ngotot benar tanpa mau menimbang sudut lain.", signal:null },
    { id:"UC_4_4", title:"Tekanan Stakeholder", klaster:"B/D",
      prompt:"[Role-play] Pewawancara berperan sebagai stakeholder bisnis yang kecewa:\n\n'Kenapa proyek ini lambat? Saya tidak mau dengar alasan teknis.'\n\nCatatan: mainkan tekanan secukupnya — tujuan melihat ketahanan, bukan membuat kandidat gagal.",
      cari:"Tenang, mengakui kekhawatiran, menerjemahkan ke bahasa dampak bisnis (bukan alasan teknis), menawarkan langkah konkret. Memegang kendali tanpa konfrontasi maupun menyerah.",
      waspadai:"Panik/defensif, menyalahkan tim teknis, atau menjanjikan hal mustahil untuk meredakan.",
      context_note: 'Dalam skenario ini, Anda akan berhadapan langsung dengan pewawancara yang berperan sebagai stakeholder (pemangku kepentingan) bisnis yang kecewa. Stakeholder adalah pihak yang berkepentingan dengan proyek — bisa atasan, klien internal, atau kepala divisi. Tidak perlu hafal jawaban sempurna; yang dinilai adalah cara Anda menghadapi tekanan dan menjaga komunikasi tetap konstruktif.', signal:null ,
      calibration_warning: { type: 'delivery', label: 'Nilai substansi, bukan cara penyampaian', color: 'purple', text: 'Wajar grogi saat role-play pertama menghadapi stakeholder marah. Nilai substansi respons-nya: apakah ada kesadaran untuk terjemahkan ke bahasa dampak bisnis dan tawarkan langkah konkret? Bukan kelancaran atau ketenangan delivery-nya.' } },
    { id:"UC_4_5", title:"Pertanyaan Pertama Mereka", klaster:"A", mechanism:"M4",
      prompt:"'Saya beri Anda proyek baru sekarang: Buat sistem untuk membantu tim HR.' Itu saja informasinya. Apa 5 pertanyaan pertama yang Anda ajukan?",
      cari:"Pertanyaan mencakup batasan eksekusi (deadline, sumber daya, siapa terlibat, apa yang sudah fix) DAN tujuan/pengguna — seimbang, terstruktur.",
      waspadai:"Pertanyaan sedikit/dangkal, atau langsung melompat ke solusi teknis tanpa menggali.",
      signal:"PM: mayoritas 'kapan, siapa, batasannya apa'. Product: mayoritas 'kenapa, untuk siapa, masalah apa' tanpa menyentuh eksekusi." },
    { id:"UC_4_6", title:"Menyampaikan Kabar Buruk", klaster:"C/D",
      prompt:"[Role-play] 'Saya stakeholder-nya. Anda harus memberi tahu saya bahwa proyek akan telat. Sampaikan.'",
      cari:"Menyampaikan lebih awal, jujur, dengan konteks & dampak jelas, langsung disertai rencana/opsi pemulihan. Mengambil tanggung jawab tanpa melempar kesalahan.",
      waspadai:"Menunda/mengaburkan kabar. Menyalahkan pihak lain. Atau menyampaikan tanpa rencana ke depan.",
      context_note: 'Menyampaikan kabar buruk ke stakeholder adalah salah satu momen paling tidak nyaman dalam pekerjaan PM — dan juga salah satu yang paling penting. Dalam skenario ini, Anda akan langsung mempraktikkannya dengan pewawancara sebagai stakeholder. Fokus pada kejujuran dan rencana ke depan, bukan mencari alasan.', signal:null ,
      calibration_warning: { type: 'delivery', label: 'Nilai substansi, bukan cara penyampaian', color: 'purple', text: 'Fresh grad sering nervous saat role-play kabar buruk. Nilai keberanian untuk jujur dan apakah ada rencana ke depan yang ditawarkan — bukan kepolisan atau cara penyampaiannya.' } },
    { id:"UC_4_7", title:"Coachability Real-Time", klaster:"C",
      prompt:"[Setelah role-play, beri feedback langsung]\n\n'Tadi caramu menangani [bagian X] kurang tepat menurut saya — mestinya [alternatif Y]. Apa pendapatmu?'\n\n(Isi [X] dan [Y] dari role-play yang baru saja terjadi. Ini satu-satunya UC yang harus diimprovisasi.)",
      cari:"Mendengar sungguh-sungguh, mencerna, bertanya untuk memahami, lalu mengintegrasikan — atau berargumen balik dengan hormat & berdasar. Ego yang bisa ditundukkan bukti.",
      waspadai:"Defensif & membenarkan diri. Atau langsung mengiyakan tanpa berpikir (tidak punya pendirian).", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad yang baru pertama kali dapat feedback langsung dari panel bisa tampak canggung. Nilai apakah ada proses berpikir nyata setelah feedback diberikan — bukan kecepatan responsnya.' } },
    { id:"UC_4_8", title:"Prioritisasi Spontan", klaster:"A/C",
      prompt:"'Pagi ini: vendor telat, satu anggota tim sakit, stakeholder minta meeting dadakan, dan ada bug di sistem yang baru rilis. Semua terjadi bersamaan. Apa yang Anda lakukan, dan dalam urutan apa?'",
      cari:"Cepat menilai dampak & urgensi (bug produksi yang memengaruhi user biasanya nomor satu), mendelegasikan yang bisa, tetap tenang, menjelaskan logikanya. Berpikir triase.",
      waspadai:"Panik, mencoba semua sekaligus, atau memprioritaskan berdasarkan siapa yang paling berisik.", signal:null },
    { id:"UC_4_9", title:"Motivasi & Realisme", klaster:"C",
      prompt:"'Bayangkan 18 bulan dari sekarang Anda masih di sini. Apa yang membuatnya layak bagi Anda? Dan apa yang paling mungkin membuat Anda ingin pergi?'",
      cari:"Menyebut hal yang realistis bisa disediakan (belajar dari proyek nyata, jalur ke senior, mentor). Motif & kenyataan selaras — sinyal retensi.",
      waspadai:"Motivasi murni eksternal (gaji/brand/jabatan) tanpa minat pada kerjanya. Atau ekspektasi yang jelas tak bisa dipenuhi.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad sering belum tahu persis apa yang mereka mau dari karir. Jawaban yang jujur dan realistis (meski sederhana) lebih berharga dari jawaban ambisius yang terdengar dihafalkan. Yang diukur: keselarasan motif dan realita.' } },
    { id:"UC_4_10", title:"Pertanyaan Kandidat", klaster:"D",
      prompt:"'Sekarang giliran Anda. Apa yang ingin Anda tanyakan kepada kami?'",
      cari:"Pertanyaan menunjukkan ia sudah membayangkan dirinya di peran: bagaimana sukses diukur, tantangan terbesar tim, bagaimana keputusan diambil, jalur berkembang.",
      waspadai:"Tidak ada pertanyaan. Atau hanya soal cuti/gaji/jam kerja. Atau pertanyaan yang sudah dijawab jelas sebelumnya.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad sering nervous di akhir wawancara dan pertanyaannya pendek atau generic. Gali lebih dalam dulu sebelum nilai rendah — tanya "ada lagi yang ingin kamu pahami?" untuk memberi ruang.' } }
  ]
};

// UC yang aktif per batch (index dari array BANK)
export const ACTIVE_INDEX = {
  stage1: [0, 1, 3, 5, 7],      // 5 UC
  stage2: [0, 1, 2, 3, 4, 6, 8], // 7 UC
  stage3: 0,                      // UC utama (+ UC_3_10 selalu wajib)
  stage4: [0, 1, 2, 3, 4, 5, 6]  // 7 UC
};

export function getActiveUCs(stage) {
  const key = `stage${stage}`;
  if (stage === 3) return [BANK.stage3[ACTIVE_INDEX.stage3], BANK.stage3[4], BANK.stage3[9]]; // default: UC_3_1 + UC_3_5 + UC_3_10
  return ACTIVE_INDEX[key].map(i => BANK[key][i]);
}

export function getAllUCs(stage) {
  return BANK[`stage${stage}`];
}

// ── ROTATION SETS ──────────────────────────────────────
// Setiap set adalah kombinasi UC yang bisa dipakai per batch.
// Rotasi otomatis berdasarkan jumlah batch yang sudah ada.
// UC_3_10 (index 9) selalu wajib di Stage 3, tidak dirotasi.
export const ROTATION_SETS = [
  // Set A — UC_3_1 (Charter) + UC_3_5 (Status Report 2 Audiens)
  { stage1: [0, 1, 3, 5, 7], stage2: [0, 1, 2, 3, 4, 6, 8], stage3: 0, stage3_companion: 4, stage4: [0, 1, 2, 3, 4, 5, 6] },
  // Set B — UC_3_2 (Prioritisasi) + UC_3_7 (Temukan Lubang Rencana)
  { stage1: [1, 2, 4, 6, 8], stage2: [0, 1, 3, 4, 5, 7, 9], stage3: 1, stage3_companion: 6, stage4: [0, 1, 2, 3, 5, 6, 7] },
  // Set C — UC_3_3 (Membaca Situasi) + UC_3_6 (Keputusan Under Pressure)
  { stage1: [0, 2, 3, 6, 9], stage2: [0, 2, 3, 5, 6, 7, 9], stage3: 2, stage3_companion: 5, stage4: [0, 1, 2, 4, 5, 6, 8] },
  // Set D — UC_3_4 (Mitigasi Risiko) + UC_3_9 (Koordinasi Pihak Tak Sinkron)
  { stage1: [1, 3, 4, 7, 8], stage2: [1, 2, 4, 5, 6, 8, 9], stage3: 3, stage3_companion: 8, stage4: [0, 1, 3, 4, 5, 7, 8] },
  // Set E — UC_3_6 (Keputusan Under Pressure) + UC_3_8 (Permintaan Perubahan)
  { stage1: [0, 2, 5, 6, 9], stage2: [0, 1, 2, 4, 7, 8, 9], stage3: 5, stage3_companion: 7, stage4: [0, 2, 3, 4, 6, 7, 9] },
  // Set F — UC_3_7 (Temukan Lubang) + UC_3_3 (Membaca Situasi)
  { stage1: [1, 2, 3, 7, 9], stage2: [1, 3, 4, 5, 6, 7, 8], stage3: 6, stage3_companion: 2, stage4: [1, 2, 3, 4, 5, 8, 9] },
];

export function getRotationSet(batchCount) {
  return ROTATION_SETS[batchCount % ROTATION_SETS.length];
}

export function getUCsFromSet(set) {
  return {
    stage1: set.stage1.map(i => BANK.stage1[i].id),
    stage2: set.stage2.map(i => BANK.stage2[i].id),
    stage3: BANK.stage3[set.stage3].id,
    stage3_companion: BANK.stage3[set.stage3_companion].id,
    stage4: set.stage4.map(i => BANK.stage4[i].id),
  };
}

export function getActiveUCsFromBatch(batch) {
  // Ambil UC dari data batch yang tersimpan di Supabase
  if (!batch) return null;
  return {
    stage1: (batch.stage1_ucs || []).map(id => BANK.stage1.find(uc => uc.id === id)).filter(Boolean),
    stage2: (batch.stage2_ucs || []).map(id => BANK.stage2.find(uc => uc.id === id)).filter(Boolean),
    stage3: [
      BANK.stage3.find(uc => uc.id === batch.stage3_uc),
      batch.stage3_companion_uc ? BANK.stage3.find(uc => uc.id === batch.stage3_companion_uc) : null,
      BANK.stage3[9], // UC_3_10 selalu wajib
    ].filter(Boolean),
    stage4: (batch.stage4_ucs || []).map(id => BANK.stage4.find(uc => uc.id === id)).filter(Boolean),
  };
}
