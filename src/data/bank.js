// src/data/bank.js — 40 UC statis, AI tidak generate ulang

export const BANK = {
  stage1: [
    { id:"UC_1_1", title:"Sumber Kepuasan", klaster:"A/C", mechanism:"M2",
      prompt:"Ceritakan satu pencapaian yang paling Anda banggakan — apa pun, tidak harus soal IT. Apa peran Anda, dan kenapa itu yang paling membekas?",
      cari:"Kepuasannya ada di penyelesaian: merapikan kekacauan, menyatukan orang, menuntaskan hal yang sulit.",
      waspadai:"Bangga pada sesuatu yang terjadi di sekitarnya, tapi perannya sendiri tidak jelas. Atau klaim besar yang tidak didukung detail yang konkret.",
      signal:"PM: bangga menuntaskan. Product: bangga menemukan/mendefinisikan ulang masalah." },
    { id:"UC_1_2", title:"Orchestration Tanpa Otoritas", klaster:"B",
      prompt:"Ceritakan saat Anda harus membuat sekelompok orang yang tidak wajib menurut pada Anda tetap bergerak ke satu tujuan. Bagaimana Anda melakukannya?",
      cari:"Menggerakkan orang dengan memahami motivasi masing-masing, bukan dengan memerintah.",
      waspadai:"Hanya bisa menggerakkan orang kalau ada otoritas formal. Langsung menyerah atau frustrasi saat orang tidak kooperatif.", signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad mengenal orchestration dari himpunan/kepanitiaan. Tolok ukur = pernah gerakkan orang tanpa jabatan formal, bukan kecanggihan teknik manajemen.' } },
    { id:"UC_1_3", title:"Realistic Expectations", klaster:"C",
      prompt:"Menurut Anda, hari-hari seorang Junior IT PM sebenarnya diisi oleh apa? Apa yang membuat Anda yakin itu cocok untuk Anda?",
      cari:"Tahu bahwa pekerjaan PM banyak yang tidak terlihat — mengejar update, menengahi konflik, menjaga proses — dan tetap tertarik dengan alasan yang masuk akal.",
      waspadai:"Bayangan tentang peran PM yang terlalu strategis dan glamor. Tidak menyebut sama sekali tentang kerja koordinasi harian yang justru mengisi sebagian besar waktunya.", signal:null },
    { id:"UC_1_4", title:"Ownership / Agency", klaster:"C",
      prompt:"Ceritakan satu hal yang gagal atau berantakan, di mana Anda terlibat. Apa yang terjadi dan apa peran Anda di dalamnya?",
      cari:"Mengakui bagian yang memang menjadi tanggung jawabnya. Ada pelajaran konkret yang benar-benar dipakai setelahnya, bukan sekadar disebutkan.",
      waspadai:"Semua penyebab kegagalan ada di luar dirinya — anggota tim, dosen, kondisi eksternal. Tidak ada satu pun refleksi tentang apa yang bisa ia lakukan berbeda.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad belum punya cerita gagal berskala besar. Nilai kejujuran dan pelajaran konkretnya — bukan skala kejadiannya. Kegagalan kecil yang diakui jujur > kegagalan besar yang disalahkan orang lain.' } },
    { id:"UC_1_5", title:"Reading Between the Lines", klaster:"A",
      prompt:"Atasan/dosen Anda berkata: 'Bagus kok, nanti saja kita bahas lagi.' Menurut Anda dia sebenarnya sedang mengatakan apa? Apa yang Anda lakukan?",
      cari:"Menangkap kemungkinan bahwa 'nanti dibahas lagi' bukan persetujuan, lalu menggali dengan cara yang tidak terkesan memaksa.",
      waspadai:"Menerima kalimat itu secara harfiah sebagai persetujuan, tanpa mempertimbangkan kemungkinan ada maksud lain di baliknya.", signal:null ,
      calibration_warning: { type: 'delivery', label: 'Nilai substansi, bukan cara penyampaian', color: 'purple', text: 'Fresh grad dari budaya akademik cenderung membaca komunikasi secara harfiah. Perhatikan apakah ada kesadaran bahwa ada lapisan di balik kata-kata, bukan seberapa canggih interpretasinya.' } },
    { id:"UC_1_6", title:"Coachability", klaster:"C",
      prompt:"Ceritakan satu feedback yang awalnya tidak Anda setujui atau sulit Anda terima. Apa yang akhirnya Anda lakukan?",
      cari:"Awalnya tidak setuju, tapi kemudian benar-benar mencerna dan berubah — bukan sekadar mengangguk. Bisa menjelaskan kenapa feedback itu ternyata valid.",
      waspadai:"Tidak bisa menyebut satu pun feedback yang pernah tidak ia setujui. Atau justru bercerita tentang feedback yang ia tolak dan sampai sekarang masih merasa benar.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Banyak fresh grad belum terbiasa menerima feedback konstruktif di lingkungan formal. Jawaban yang ragu-ragu atau butuh waktu bisa berarti jujur — bukan tidak coachable. Yang diukur: apakah akhirnya berubah, bukan seberapa cepat menerima.' } },
    { id:"UC_1_7", title:"Business–IT Translation", klaster:"B",
      prompt:"Bayangkan seorang manajer non-teknis berkata: 'Pokoknya saya mau sistemnya bisa otomatis, secepatnya.' Bagaimana Anda menanggapinya?",
      cari:"Menggali apa yang sebenarnya dimaksud dengan 'otomatis' dan 'secepatnya' dari sisi bisnis, lalu menerjemahkannya ke kebutuhan yang lebih konkret — bergerak dua arah antara bisnis dan teknis.",
      waspadai:"Langsung mengiyakan permintaan tanpa menggali apa yang sebenarnya dibutuhkan. Atau justru membalas dengan jargon teknis yang tidak menjawab kekhawatiran orang bisnis.", signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah berhadapan langsung dengan stakeholder bisnis. Nilai kemampuan berpikir dari dua sudut (bisnis ↔ teknis) — bukan penguasaan domain bisnis yang memang belum dimiliki.' } },
    { id:"UC_1_8", title:"Convergent Thinking & Decisive", klaster:"A/C", mechanism:"M1",
      prompt:"Anda diberi tugas tanpa instruksi lengkap dan tenggat dekat. Informasi tidak akan pernah 100% lengkap. Apa yang Anda lakukan?",
      cari:"Membuat asumsi yang dituliskan dengan jelas, menetapkan keputusan yang masih bisa direvisi, lalu bergerak maju. Nyaman mengunci arah meski informasi belum lengkap sepenuhnya..",
      waspadai:"Tidak bisa bergerak tanpa instruksi yang lengkap. Atau terus menuntut informasi lebih sebelum mau memulai apapun.",
      signal:"PM: kunci & eksekusi. Product: terus gali 'apakah ini masalah yang benar' tanpa bergerak." },
    { id:"UC_1_9", title:"Persistent", klaster:"C",
      prompt:"Ceritakan saat Anda terus mendorong sesuatu yang terus ditolak, diabaikan, atau dihambat. Apa yang membuat Anda tetap mendorong, dan kapan Anda memutuskan berhenti (atau tidak)?",
      cari:"Bisa mengubah pendekatan saat satu jalur terblokir — cari jalur lain, bangun dukungan dari arah yang berbeda. Keteguhan yang cerdas, bukan keras kepala.",
      waspadai:"Tidak punya satu pun cerita tentang situasi seperti ini. Atau menyerah begitu saja saat pertama kali diabaikan atau ditolak.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad jarang punya cerita perjuangan multi-bulan yang dramatis. Nilai pola adaptif-nya: apakah ubah pendekatan saat jalan pertama tidak berhasil? Bukan epik ceritanya.' } },
    { id:"UC_1_10", title:"Self-Management Under Load", klaster:"D",
      prompt:"Saat Anda punya banyak hal mendesak sekaligus dan semua terasa penting, bagaimana Anda memutuskan apa yang dikerjakan duluan? Beri contoh nyata.",
      cari:"Mengurutkan berdasarkan dampak dan konsekuensinya. Bisa menjelaskan dengan jelas mengapa yang satu dikerjakan lebih dulu dari yang lain.",
      waspadai:"Mengerjakan berdasarkan apa yang terasa lebih mudah atau lebih menarik. Atau justru lumpuh karena semua terasa sama pentingnya dan tidak tahu harus mulai dari mana.", signal:null }
  ],
  stage2: [
    { id:"UC_2_1", title:"Locked-Scope Trap", klaster:"A", mechanism:"M1",
      prompt:"Fitur X sudah masuk dalam SOW. Tim sudah mengerjakan 60% dari versi yang disepakati, dan deadline tinggal 3 minggu lagi. Di tengah pengerjaan Anda menemukan cara yang lebih baik untuk user.\n\nDua jalan:\n1. Selesaikan sesuai SOW yang sudah disepakati sekarang, dan catat ide yang lebih baik itu untuk dipertimbangkan di fase berikutnya.\n2. Ajukan perubahan resmi sekarang, lengkap dengan analisis dampaknya ke jadwal dan anggaran, lalu tunggu persetujuan sebelum lanjut.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Tim sudah mengerjakan 60% versi yang disepakati, dan deadline tinggal 3 minggu.",
      cari:"Menyadari situasi sesungguhnya: tim sudah mengerjakan 60% dan deadline tinggal 3 minggu — ini bukan saat yang tepat untuk perubahan besar. Sadar ada konsekuensi dari pilihan yang diambil, dan cenderung memilih menyelesaikan komitmen yang sudah berjalan.",
      waspadai:"Tidak menyadari bahwa tim sudah 60% berjalan dan deadline tinggal 3 minggu — itu bukan waktu yang tepat untuk berubah haluan. Atau ingin mengubah sendiri tanpa lewat proses persetujuan.",
      signal:"Indikasi arah Product Manager: berpikir 'kesepakatan bisa diubah kalau manfaat untuk user lebih besar', tanpa mempertimbangkan dampak ke tim yang sedang mengerjakan." },
    { id:"UC_2_2", title:"Hybrid Tension", klaster:"A/B",
      prompt:"Tim teknis usul perbaikan internal yang memperlambat ~1 minggu tapi (klaim mereka) bikin sistem lebih aman jangka panjang. Scope & budget sudah dikunci. Rilis ini sudah terikat komitmen ke divisi lain yang telah menjadwalkan pelatihan user tepat di tanggal rilis. (Tidak perlu paham detail teknisnya.)\n\nDua jalan:\n1. Tahan usulan tim untuk sekarang dan jaga tanggal rilis — komitmen ke pihak lain lebih penting dari perbaikan yang belum terbukti kritis.\n2. Minta tim menjelaskan secara konkret seberapa besar risikonya kalau tidak dilakukan sekarang, dan kalau memang serius, bawa ke stakeholder sebagai opsi yang perlu diputuskan bersama.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Rilis ini terikat komitmen ke divisi lain yang sudah menjadwalkan pelatihan user di tanggal rilis.",
      cari:"Menyadari keputusan ini punya riak ke divisi lain; menuntut data DAN menimbang komitmen eksternal.",
      waspadai:"Tidak menyadari ada divisi lain yang sudah merencanakan pelatihan di tanggal rilis ini. Atau langsung menyetujui usulan tim tanpa mempertimbangkan dampaknya ke jadwal yang sudah ada.", signal:null },
    { id:"UC_2_3", title:"Vendor Mulai Telat", klaster:"B",
      prompt:"Vendor (pihak ketiga, tak bisa Anda perintah langsung) yang mengerjakan bagian penting mulai sering meleset dari tenggat kecil. Setiap ditanya: 'aman kok, nanti terkejar.' Bagian ini dibutuhkan tiga minggu lagi.\n\nDua jalan:\n1. Beri ruang berdasarkan rekam jejaknya yang selama ini baik, tapi tetapkan satu titik cek konkret minggu ini — minta sesuatu yang bisa Anda verifikasi sendiri, bukan sekadar laporan lisan.\n2. Perketat pengawasan sekarang — minta bukti progres yang nyata dan mulai siapkan rencana cadangan kalau ternyata tidak bisa terkejar.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Vendor ini tahun lalu menyelamatkan proyek lain di detik akhir; hubungan selama ini baik.",
      cari:"Rekam jejak bagus sebelumnya bukan jaminan kondisi sekarang sama. Menjaga hubungan baik tapi tetap punya batas yang jelas.",
      waspadai:"Terlalu percaya karena rekam jejak sebelumnya bagus, padahal sinyal saat ini berbeda. Atau sebaliknya, langsung perketat pengawasan tanpa mempertimbangkan hubungan yang sudah lama dibangun.",
      context_note: 'Dalam proyek IT, pekerjaan sering dilakukan oleh pihak ketiga (vendor) — perusahaan luar yang dikontrak untuk mengerjakan bagian tertentu. Berbeda dengan anggota tim internal, vendor tidak bisa diperintah langsung; hubungannya dikelola lewat kontrak dan komunikasi. Sebagai PM, Anda bertanggung jawab memastikan vendor deliver tepat waktu meski mereka bukan bawahan Anda.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah kelola vendor secara nyata. Yang dinilai: apakah sadar bahwa rekam jejak baik ≠ garansi performa sekarang, dan apakah tahu cara menjaga hubungan sambil tetap waspada. Bukan teknis vendor management.' } },
    { id:"UC_2_4", title:"Scope Creep Halus", klaster:"A/C",
      prompt:"Seorang stakeholder bisnis sering menyelipkan permintaan kecil di tengah jalan — 'ini sedikit saja kok', 'sekalian ya'. Satu-satu terlihat sepele, tapi menumpuk.\n\nDua jalan:\n1. Tetap akomodasi permintaan kecil demi menjaga hubungan baik, tapi mulai catat semua yang masuk dan pasang batas yang jelas ke depannya.\n2. Tunjukkan ke stakeholder ini bagaimana permintaan-permintaan kecil itu sudah menumpuk dan berdampak ke jadwal, lalu minta semua permintaan baru masuk lewat proses perubahan yang resmi.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Stakeholder ini baru saja membantu mempercepat approval anggaran minggu lalu — ada 'utang budi'.",
      cari:"Menghargai hubungan tanpa membiarkan permintaan kecil terus menumpuk. Membuat dampak akumulasi terlihat dengan cara yang tidak membuat stakeholder merasa disalahkan.der merasa dipermalukan atau disudutkan.",
      waspadai:"Mengikuti semua permintaan karena merasa berhutang budi, tanpa sadar bahwa scope sudah bocor. Atau menolak dengan kaku tanpa mempertimbangkan hubungan yang perlu dijaga.", signal:null },
    { id:"UC_2_5", title:"Konflik Prioritas Antar-Stakeholder", klaster:"A/B",
      prompt:"Dua stakeholder dengan jabatan setara meminta tim mengerjakan hal berbeda lebih dulu, dan keduanya merasa paling mendesak. Anda di tengah.\n\nDua jalan:\n1. Gali dulu siapa yang sebenarnya lebih mendesak secara objektif — siapa yang pekerjaannya menunggu siapa, apa konsekuensi nyata kalau salah satu terlambat — lalu fasilitasi keputusan berdasarkan fakta itu.\n2. Akui bahwa ini keputusan yang butuh otoritas di atas Anda, dan naikkan ke atasan bersama kedua pihak untuk diputuskan.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Salah satunya benar secara objektif (pekerjaannya memblokir tim lain), tapi menyampaikannya kurang asertif sehingga kalah 'berisik'.",
      cari:"Menemukan bahwa satu pihak punya pekerjaan yang memblokir pihak lain — memutuskan berdasarkan fakta itu, bukan berdasarkan siapa yang paling keras berbicara.",
      waspadai:"Mendahulukan pihak yang paling keras meminta. Atau membagi pekerjaan menjadi dua tanpa benar-benar menyelesaikan konflik prioritasnya.", signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Fresh grad belum punya pengalaman navigasi konflik antar stakeholder senior. Score 3 dengan logika berbasis fakta/dampak sudah sinyal kuat. Jangan tunggu jawaban dengan political savviness level senior.' } },
    { id:"UC_2_6", title:"Logika & Dependency", klaster:"A",
      prompt:"Sebuah proyek punya 4 pekerjaan:\n• A: 3 hari\n• B: 2 hari (butuh A selesai dulu)\n• C: 4 hari (bisa jalan bersamaan dengan A)\n• D: 1 hari (butuh B dan C selesai)\n\nPertanyaan:\n1. Berapa waktu tercepat seluruh proyek bisa selesai?\n2. Pekerjaan mana yang paling berbahaya bila terlambat?\n\nJelaskan alasan Anda. (Tidak perlu tahu istilah teknis — yang dinilai adalah logika Anda.)",
      trap:"Di soal disebut 'C dikerjakan vendor yang biasanya telat 1 hari'.",
      cari:"Menghitung dengan benar bahwa waktu tercepatnya 6 hari (jalur A→B→D). Dan menangkap bahwa kalau C molor satu hari, dua jalur jadi sama-sama kritis. Berpikir dalam kerangka risiko.",
      waspadai:"Menjumlahkan semua durasi pekerjaan (10 hari) tanpa menyadari bahwa sebagian bisa dikerjakan bersamaan. Atau tidak menangkap bahwa keterlambatan vendor bisa membuat dua jalur sama-sama kritis.", signal:null },
    { id:"UC_2_7", title:"Production Incident", klaster:"B/D",
      prompt:"Sistem yang baru dirilis tiba-tiba bermasalah di jam sibuk. User bisnis panik dan menghubungi Anda terus-menerus. Di antara yang menghubungi ada direktur yang meminta Anda melapor langsung ke dia setiap 15 menit. Tim teknis sedang menyelidiki. (Tidak perlu paham teknisnya.)\n\nDua jalan:\n1. Tetapkan satu jadwal update yang berlaku untuk semua pihak — termasuk direktur — supaya Anda bisa tetap fokus koordinasi dan tidak terus-menerus terganggu. Sampaikan ini dengan jelas ke direktur.\n2. Ikuti permintaan direktur dan lapor langsung tiap 15 menit, dengan prioritas menjaga kepercayaan pihak yang paling berpengaruh di situasi ini.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Salah satu yang menghubungi adalah direktur yang meminta Anda lapor langsung ke dia tiap 15 menit — padahal itu menyita waktu dari mengoordinasi.",
      cari:"Koordinasi tetap jalan sambil direktur tetap terinformasi: jadwalkan update berkala dan tunjuk satu orang khusus untuk komunikasi keluar. Tegas tapitik cerdas.",
      waspadai:"Ikut terlibat dalam perbaikan teknis padahal bukan perannya. Atau terlalu fokus melayani permintaan direktur sampai koordinasi tim jadi terbengkalai.",
      context_note: 'Dalam proyek IT, "production incident" adalah situasi di mana sistem yang sudah dirilis ke pengguna tiba-tiba bermasalah — misalnya aplikasi error, data tidak muncul, atau fitur tidak bisa dipakai. Ini kondisi darurat karena berdampak langsung ke pengguna yang sedang bekerja. Peran PM di sini bukan membenahi teknis (itu tugas tim teknis), tapi mengoordinasi semua pihak dan memastikan komunikasi berjalan lancar.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah menangani production incident nyata. Nilai urutan pikirnya dan kesadaran prioritas (koordinasi > memadamkan api sendiri) — bukan hafal protokol incident response.' } },
    { id:"UC_2_8", title:"Estimasi Terlalu Optimistis", klaster:"A/B",
      prompt:"Tim teknis memberi perkiraan waktu yang terasa terlalu cepat/optimistis bagi Anda. Anda bukan orang teknis dan tidak bisa menilai detailnya. Konteks: tim ini baru saja dikritik manajemen karena proyek sebelumnya dianggap terlalu lambat. (Tidak perlu jadi teknis — jelaskan bagaimana Anda menyikapinya sebagai PM.)\n\nDua jalan:\n1. Gali apa saja yang sudah diperhitungkan dalam estimasi itu — apakah sudah termasuk waktu testing, kemungkinan revisi, dan pekerjaan lain yang bergantung padanya — dengan cara bertanya, bukan menggurui.\n2. Terima estimasi tim untuk sekarang, tapi pasang titik pengecekan lebih awal dari biasanya supaya bisa mendeteksi lebih dini kalau mulai meleset.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Tim ini baru saja dikritik manajemen karena proyek sebelumnya lambat — ada tekanan untuk 'terlihat cepat'.",
      cari:"Membaca kenapa estimasi mungkin terlalu optimistis — bisa jadi ada tekanan dari manajemen. Menggali dengan cara yang tidak membuat tim merasa tidak dipercaya. Perlu empati sekaligus skeptisisme yang sehat..",
      waspadai:"Langsung menerima estimasi tanpa pertanyaan, atau sebaliknya langsung menekan tim untuk memangkasnya. Tidak menyadari bahwa ada tekanan psikologis yang mungkin memengaruhi angka yang diberikan.",
      context_note: 'Dalam proyek IT, tim teknis (developer, engineer) biasanya yang memberikan estimasi berapa lama suatu pekerjaan akan selesai. Sebagai PM yang bukan berlatar teknis, Anda tidak bisa menilai apakah estimasi itu realistis dari sisi teknis — tapi Anda tetap bertanggung jawab atas timeline keseluruhan proyek.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum punya feel untuk memperkirakan waktu pengerjaan teknis. Yang dinilai: apakah sadar estimasi punya bias, dan apakah bisa menggali tanpa mempermalukan tim. Bukan akurasi estimasinya sendiri.' } },
    { id:"UC_2_9", title:"Status 'Aman' yang Mencurigakan", klaster:"A/C",
      prompt:"Setiap laporan mingguan, satu anggota tim selalu melaporkan statusnya 'aman'. Tapi Anda perhatikan ia mulai jarang hadir di pertemuan harian dan jawabannya makin pendek.\n\nDua jalan:\n1. Dekati secara personal di luar konteks pekerjaan, tanpa langsung menuduh atau menekan — coba pahami dulu apakah ada sesuatu yang sedang terjadi di luar pekerjaan.\n2. Fokus ke pekerjaan: minta ia menunjukkan progres yang konkret dan bisa dilihat di pertemuan berikutnya, tanpa perlu masuk ke urusan personal.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Belakangan diketahui anggota ini sedang menghadapi masalah pribadi yang ia tutupi.",
      cari:"Membaca sinyal yang tidak konsisten dan mendekati dengan empati tanpa langsung menyudutkan. Menyeimbangkan kepedulian pada kondisi orang dengan kebutuhan proyek yang tetap harus berjalan.",
      waspadai:"Menerima laporan 'aman' begitu saja meski ada sinyal lain yang tidak konsisten. Atau langsung menegur di depan orang banyak yang justru membuat situasinya makin buruk.", signal:null },
    { id:"UC_2_10", title:"Permintaan Bertentangan", klaster:"A/B",
      prompt:"Di tengah proyek, stakeholder meminta: tambah beberapa fitur baru, tapi tenggat dan budget tidak boleh berubah. Konteks: stakeholder ini adalah sponsor utama proyek — dukungannya selama ini yang memastikan proyek ini bisa berjalan.\n\nDua jalan:\n1. Jelaskan dengan jujur bahwa menambah fitur baru tanpa mengubah tenggat dan anggaran berarti sesuatu yang lain harus berkurang — entah fitur lain dipotong, waktu dimundurkan, atau ada sumber daya tambahan. Sajikan pilihannya dan minta stakeholder yang memutuskan.\n2. Cari dulu apakah ada fitur yang sudah direncanakan tapi bisa ditunda tanpa dampak besar, sehingga permintaan baru bisa masuk tanpa mengubah jadwal keseluruhan. Kalau ada, bawa opsi itu ke stakeholder sebelum membuat keputusan.\n\nPilih satu dan jelaskan: kenapa pilihan itu, dan konsekuensi apa yang Anda terima?",
      trap:"Stakeholder ini adalah sponsor utama proyek — kalau kecewa, dukungan proyek bisa goyah. Tapi tim sudah bekerja di kapasitas penuh.",
      cari:"Menangkap dua hal sekaligus: ada hutang budi ke sponsor dan ada kapasitas tim yang perlu dijaga. Datang dengan solusi, bukan keluhan. Menjaga hubungan baik sambil tetap melindungi tim dari beban yang tidak realistis.tim.",
      waspadai:"Langsung menyanggupi semua permintaan tanpa melihat apakah tim punya kapasitas untuk itu. Atau menolak mentah-mentah tanpa memikirkan dampaknya ke hubungan dengan orang yang sebelumnya sudah membantu proyek ini.", signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Fresh grad belum pernah jadi buffer antara sponsor dan kapasitas tim. Score 3 yang sadar ada dua sisi dan tidak langsung menyanggupi tanpa pikir panjang sudah cukup bagus. Score 5 kalau bisa navigasi keduanya dengan konkret.' } }
  ],
  stage3: [
    { id:"UC_3_1", title:"Project Charter dari Brief Berantakan", klaster:"A/B", mechanism:"M4",
      prompt:"Lampiran: email dari kepala divisi bisnis:\n\n\"Dear Tim IT,\n\nKami butuh aplikasi untuk memudahkan tim lapangan kami. Tolong segera dibuat ya, pokoknya sebelum akhir tahun. Kalau bisa yang simpel dan bisa dipakai semua orang. Nanti kita diskusi lebih lanjut. Terima kasih.\"\n\nTugas: Berdasarkan email di atas, buat ringkasan rencana proyek awal yang berisi:\n1. Tujuan & ruang lingkup kasar\n2. Hal-hal yang belum jelas dan perlu diklarifikasi\n3. Asumsi yang Anda buat\n4. Langkah pertama yang akan Anda lakukan\n\n(Brief ini sengaja tidak lengkap. Bagian dari penilaian adalah bagaimana Anda menangani informasi yang kurang. Tuliskan asumsi Anda secara eksplisit.)",
      cari:"Memisahkan apa yang sudah diketahui dari apa yang masih asumsi. Asumsinya masuk akal dan dituliskan dengan jelas. Tetap bisa menentukan langkah pertama yang konkret meski informasinya belum lengkap.",
      waspadai:"Langsung menjawab tanpa mempertanyakan brief yang jelas tidak lengkap. Atau justru hanya mengeluhkan informasi yang kurang tanpa bisa bergerak sama sekali.",
      signal:"PM: klarifikasi condong 'kapan, siapa, batasannya apa'. Product: seluruh dokumen mempertanyakan 'apakah ini solusi tepat' tanpa bergerak." },
    { id:"UC_3_2", title:"Prioritisasi dari Daftar Kacau", klaster:"A",
      prompt:"Lampiran: daftar 12 pekerjaan acak (campur penting & sepele, beberapa saling bergantung, beberapa 'permintaan VIP'):\n\n1. Update dokumen SOP yang sudah lama\n2. Persiapkan laporan bulanan untuk direktur (minggu depan)\n3. Balas email vendor yang sudah 3 hari menunggu\n4. Setup environment testing untuk fitur baru\n5. Rapat koordinasi dengan tim bisnis (permintaan VP)\n6. Review spesifikasi teknis dari analis\n7. Follow-up approval anggaran yang tertunda\n8. Update Jira/task tracker\n9. Demo fitur ke stakeholder (dijadwalkan besok)\n10. Investigasi bug yang dilaporkan user kemarin\n11. Susun agenda rapat berikutnya\n12. Baca dokumentasi sistem lama untuk pemahaman\n\nTugas: Susun urutan pengerjaan 2 minggu pertama dan jelaskan dasar prioritas Anda.",
      cari:"Mengurutkan berdasarkan dampak dan ketergantungan antar pekerjaan. Berani menunda permintaan yang terasa 'VIP' kalau alasannya jelas dan bisa dipertanggungjawabkan.",
      waspadai:"Mengerjakan berdasarkan urutan di daftar atau yang terasa paling mudah. Atau langsung mendahulukan permintaan yang terkesan 'VIP' tanpa mempertimbangkan dampak dan ketergantungannya.", signal:null },
    { id:"UC_3_3", title:"Membaca Situasi dari Komunikasi", klaster:"A",
      prompt:"Lampiran: 3 cuplikan komunikasi:\n\nCuplikan 1 (chat internal, dikirim jam 11 malam):\n\"Oke fine, kita ikutin aja timeline-nya.\"\n[Dikirim oleh anggota tim yang biasanya aktif pagi]\n\nCuplikan 2 (email vendor, tanpa lampiran, tanpa detail):\n\"Progres berjalan sesuai rencana. Kami confident bisa deliver tepat waktu.\"\n\nCuplikan 3 (pesan stakeholder):\n\"Lanjut saja dulu, nanti kita lihat hasilnya. Saya percayakan ke tim.\"\n\nTugas:\n1. Apa yang sebenarnya sedang terjadi di balik ketiga komunikasi ini?\n2. Apa 3 langkah pertama yang akan Anda ambil?",
      cari:"Menangkap sinyal yang tidak tertulis eksplisit di ketiga cuplikan — lalu menghubungkannya menjadi gambaran yang utuh. Langkah yang dirancang menyentuh akar masalahnya, bukan gejalanya.",
      waspadai:"Membaca semua cuplikan secara harfiah dan menyimpulkan semuanya baik-baik saja. Tidak menangkap satu pun sinyal yang tersembunyi di balik kata-katanya.", signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Membaca sinyal sosial tersirat dari komunikasi butuh jam terbang. Score 3 wajar kalau tangkap 1–2 sinyal dari 3 cuplikan. Score 5 kalau menangkap ketiganya dan menghubungkannya jadi gambaran utuh.' } },
    { id:"UC_3_4", title:"Rencana Mitigasi Risiko", klaster:"A",
      prompt:"Konteks: Anda PM proyek migrasi sistem absensi karyawan dari manual ke digital, melibatkan 500 karyawan di 3 lokasi berbeda. Vendor mengerjakan development. Target go-live: 3 bulan.\n\nTugas: Identifikasi 3–5 risiko terbesar dan untuk tiap risiko jelaskan apa yang akan Anda lakukan untuk mencegah/menguranginya.\n\n(Brief ini sengaja tidak lengkap. Tuliskan asumsi Anda.)",
      cari:"Mengidentifikasi risiko yang benar-benar bisa menggagalkan delivery — bukan risiko generik yang ada di semua proyek. Prioritas berdasarkan seberapa besar dampaknya dan seberapa mungkin terjadi. Mitigasinya konkret dan bisa dilakukan.kret & realistis.",
      waspadai:"Risiko yang disebutkan terlalu generik dan ada di semua proyek, seperti 'takut telat'. Tidak ada mitigasi yang konkret, atau mitigasinya tidak nyambung dengan risikonya.", signal:null },
    { id:"UC_3_5", title:"Status Report Dua Audiens", klaster:"B/D",
      prompt:"Konteks: Proyek integrasi sistem HR sedang berjalan. Status terkini:\n• Pengerjaan sudah 70% selesai\n• Modul laporan telat ~1 minggu karena data dari divisi Finance belum lengkap\n• Risiko: tim teknis vendor mulai memberikan estimasi yang berbeda-beda\n\nTugas: Tulis 2 versi update singkat (maksimal 5 kalimat per versi):\n1. Untuk Direktur HR yang non-teknis\n2. Untuk tim teknis yang sedang mengerjakan",
      cari:"Dua versi yang benar-benar berbeda — bukan versi yang sama dengan header berbeda. Eksekutif mendapat gambaran dampak dan keputusan yang perlu diambil, tanpa jargon teknis. Tim teknis mendapat detail actionable yang mereka butuhkan.nable. Jujur soal masalah + sajikan rencana.",
      waspadai:"Dua versi update yang isinya nyaris sama — hanya beda header. Atau ada informasi yang disamarkan atau diperhalus supaya tidak terdengar buruk. Atau versi untuk eksekutif masih penuh jargon teknis.", signal:null },
    { id:"UC_3_6", title:"Keputusan di Bawah Tekanan Waktu", klaster:"A/C",
      prompt:"Hari ini H-14 sebelum rilis. Ada dua opsi yang harus Anda putuskan sekarang:\n\nOpsi A: Rilis tepat waktu, tapi potong 1 fitur pelaporan (fitur ini diminta tapi tidak ada di SOW asli).\n\nOpsi B: Tunda rilis 2 minggu, semua fitur lengkap (termasuk fitur pelaporan yang diminta kemudian).\n\nTugas: Pilih satu opsi, jelaskan alasan Anda, dan tuliskan bagaimana Anda mengomunikasikan keputusan ini ke stakeholder.\n\n(Brief ini sengaja tidak lengkap. Tuliskan asumsi Anda.)",
      cari:"Memilih dengan tegas dan bisa menjelaskan alasannya berdasarkan dampak nyata. Mengakui konsekuensi dari opsi yang tidak dipilih. Sudah memikirkan bagaimana menyampaikannya kepada pihak yang terdampak.rencana ke stakeholder.",
      waspadai:"Menolak memilih dengan alasan butuh lebih banyak informasi, padahal informasi yang cukup sudah tersedia. Atau memilih tapi tidak bisa menjelaskan alasannya.", signal:null },
    { id:"UC_3_7", title:"Menemukan Lubang dalam Rencana", klaster:"A/D",
      prompt:"Lampiran: rencana proyek implementasi sistem absensi digital, 8 minggu:\n\nMinggu 1–2: Analisa kebutuhan (PIC: Budi)\nMinggu 2–3: Desain sistem (PIC: Budi)\nMinggu 3–5: Development (PIC: Vendor)\nMinggu 4–5: Testing & UAT (PIC: Budi + Tim HR)\nMinggu 6: Training user (PIC: Budi)\nMinggu 7–8: Go-live & stabilisasi (PIC: Budi + Vendor)\n\nTugas: Identifikasi masalah atau risiko tersembunyi dalam rencana ini dan usulkan perbaikannya.",
      cari:"Menemukan masalah yang tidak langsung terlihat di rencana: Budi kelebihan beban di minggu 4-5, ada tahap yang tumpang tindih waktunya, dan jarak antara UAT dengan go-live terlalu sempit untuk antisipasi masalah.), menjelaskan kenapa berbahaya, mengusulkan perbaikan realistis.",
      waspadai:"Menilai rencana itu sudah baik tanpa menggali lebih dalam. Atau hanya menemukan satu masalah yang paling jelas terlihat di permukaan.",
      context_note: 'Dalam proyek IT, sebelum sistem diserahkan ke pengguna biasanya ada fase UAT (User Acceptance Testing) — proses di mana pengguna mencoba sistem dan memastikan semua berjalan sesuai kebutuhan. Selain itu, satu orang yang dialokasikan ke terlalu banyak pekerjaan sekaligus (over-allocation) adalah risiko umum yang sering terlewat dalam perencanaan.', signal:null ,
      calibration_warning: { type: 'score3ok', label: 'Score 3 sudah bagus di UC ini', color: 'green', text: 'Fresh grad mungkin hanya menemukan 1–2 masalah dari rencana. Nilai kualitas analisisnya: apakah penjelasan kenapa itu berbahaya masuk akal? Bukan kuantitas temuan. Senior pun kadang butuh waktu untuk lihat semuanya.' } },
    { id:"UC_3_8", title:"Menangani Permintaan Perubahan", klaster:"A/C",
      prompt:"Lampiran: email dari stakeholder:\n\n\"Dear [nama PM],\n\nSetelah melihat demo kemarin, kami ingin menambahkan fitur export ke Excel di semua laporan. Ini penting sekali untuk operasional kami. Bisa dimasukkan ke rilis bulan depan ya? Terima kasih.\"\n\nKonteks: Ruang lingkup proyek sudah dikunci dan ditandatangani sebelumnya. Tidak ada fitur export di SOW.\n\nTugas: Tulis bagaimana Anda menanggapi email ini. Boleh dalam bentuk draf balasan + catatan langkah internal yang akan Anda ambil.",
      cari:"Menghormati scope yang sudah dikunci, tapi tetap menggali apa yang sebenarnya dibutuhkan. Menjelaskan dampak perubahan dan jalur yang tersedia dengan cara yang tidak membuat stakeholder merasa ditolak.ga hubungan + tetap disiplin.",
      waspadai:"Langsung mengiyakan permintaan karena menganggap scope masih bisa berubah kapan saja. Atau menolak dengan cara yang keras dan tidak menjaga hubungan baik.", signal:null },
    { id:"UC_3_9", title:"Mengoordinasi Pihak yang Tak Sinkron", klaster:"B",
      prompt:"Anda baru bergabung sebagai PM di proyek yang sudah berjalan 3 minggu. Setelah berbicara dengan tiga pihak, Anda temukan:\n\n• Tim teknis mengira scope-nya adalah sistem A + B\n• Vendor mengira hanya sistem A yang perlu dikerjakan\n• User bisnis mengira akan mendapat sistem A + B + C\n\nTugas: Tuliskan bagaimana Anda menyamakan pemahaman ketiga pihak ini, dan langkah konkret apa yang Anda ambil.\n\n(Brief ini sengaja tidak lengkap. Tuliskan asumsi Anda.)",
      cari:"Merancang cara untuk menyatukan pemahaman semua pihak — ada satu dokumen yang jadi acuan bersama, ada konfirmasi tertulis. Dan ada mekanisme supaya semua pihak tetap sinkron ke depannya, bukan hanya sekali di awal.depan.",
      waspadai:"Hanya menyalahkan satu pihak tanpa mau memahami sudut pandang yang lain. Atau solusinya kabur — hanya bilang 'akan saya koordinasikan' tanpa langkah nyata yang bisa diverifikasi.",
      context_note: 'Bayangkan Anda baru bergabung sebagai PM di sebuah proyek yang sudah berjalan beberapa minggu. Anda belum terlibat dari awal, tapi sekarang jadi penanggung jawabnya. Situasi seperti ini sering terjadi di dunia kerja nyata — dan tantangannya adalah menyamakan pemahaman semua pihak yang sudah punya asumsi masing-masing.', signal:null ,
      calibration_warning: { type: 'context', label: 'Konteks terbatas — wajar untuk fresh grad', color: 'blue', text: 'Fresh grad belum pernah menjadi PM yang masuk di tengah jalan saat semua orang sudah punya asumsi berbeda. Nilai kejelasan berpikir dan langkah pragmatisnya — bukan teknis change management yang memang belum dipelajari.' } },
    { id:"UC_3_10", title:"Refleksi (wajib semua varian)", klaster:"C",
      prompt:"Setelah menyelesaikan tugas di atas, tambahkan satu paragraf singkat:\n\n\"Jika Anda punya waktu atau informasi lebih, apa yang akan Anda lakukan berbeda? Dan bagian mana dari jawaban Anda yang paling tidak Anda yakini?\"",
      cari:"Secara jujur menunjuk bagian dari jawabannya sendiri yang paling lemah — dan bisa menjelaskan kenapa. Ini tanda kesadaran diri yang baik dan keterbukaan untuk dikoreksi.",
      waspadai:"Mengklaim bahwa jawabannya sudah sempurna dan tidak ada yang perlu diubah. Atau refleksinya sangat dangkal dan tidak menunjukkan kesadaran diri yang nyata.", signal:null }
  ],
  stage4: [
    { id:"UC_4_1", title:"Redirection Moment", klaster:"A/C", mechanism:"M3",
      prompt:"[Role-play 2 babak]\n\nBabak A: 'Scope sudah dikunci, deadline mundur 2 minggu karena satu pihak telat, tim mulai panik. Saya berperan sebagai anggota tim. Pimpin situasi ini.'\n\nBabak B (ubah aturan setelah 5–7 menit): 'Sekarang aturan berubah — Anda bebas sepenuhnya. Boleh batalkan fitur apa pun, ubah apa pun, asalkan hasil akhirnya lebih bernilai bagi bisnis. Apa yang Anda lakukan?'",
      cari:"Perhatikan di babak mana ia lebih hidup dan terstruktur. Kandidat yang cocok untuk PM akan lebih energik di Babak A — saat harus mengelola kondisi dengan constraint yang jelas. Di Babak B, refleks pertamanya adalah mencari kepastian soal komitmen yang sudah ada.ksekusi ('tapi kita komit kirim apa?').",
      waspadai:"Tidak tahu harus apa di Babak A — bingung saat harus memimpin dengan constraint yang jelas. Atau di Babak B langsung ingin membongkar semua tanpa mempertimbangkan apa yang sudah menjadi komitmen ke stakeholder.",
      signal:"Menyala di A + refleks 'tapi kita komit kirim apa?' di B = PM-fit. Menyala di B + terkekang di A = Product-fit." },
    { id:"UC_4_2", title:"Pendalaman Sumber Kepuasan", klaster:"A/C", mechanism:"M2",
      prompt:"'Di Stage 1 tadi Anda menyebut pencapaian [X]. Ceritakan lebih detail — apa peran persis Anda, bagian tersulitnya apa, dan kenapa itu yang paling membekas?'\n\nProbe follow-up:\n• 'Konkretnya, apa yang Anda lakukan saat X terjadi?'\n• 'Siapa lagi yang terlibat, dan apa kontribusi spesifik Anda vs mereka?'",
      cari:"Ceritanya makin kaya dan spesifik saat digali lebih dalam. Energi terbesarnya muncul saat berbicara tentang membuat sesuatu sampai selesai atau menyatukan orang menuju satu tujuan — bukan saat membicarakan ide atau insight.g'.",
      waspadai:"Cerita yang awalnya terdengar besar runtuh saat digali — tidak bisa menyebut detail konkret apapun. Atau ternyata perannya jauh lebih pasif dari yang diklaim.", signal:null },
    { id:"UC_4_3", title:"Klarifikasi Artefak Stage 3", klaster:"C",
      prompt:"'Di tugas Stage 3 tadi, Anda membuat asumsi [Y] dan memutuskan [Z]. Coba jelaskan kenapa — dan kalau sekarang diberi waktu lebih, apakah Anda akan memutuskan berbeda?'\n\n(Isi [Y] dan [Z] dari artefak Stage 3 yang sudah Anda baca sebelum panel.)",
      cari:"Penalarannya jernih dan bisa menjelaskan kenapa asumsinya masuk akal saat itu. Terbuka pada sudut pandang lain dan bisa berkata 'kalau tahu ini dari awal, saya akan putuskan berbeda' — tanpa terkesan rapuh atau defensif.ri DAN coachable.",
      waspadai:"Tidak bisa menjelaskan alasan di balik keputusannya sendiri — bisa jadi artefaknya bukan murni hasil pemikirannya. Atau sebaliknya, ngotot jawabannya sudah benar tanpa mau mempertimbangkan sudut pandang lain.", signal:null },
    { id:"UC_4_4", title:"Tekanan Stakeholder", klaster:"B/D",
      prompt:"[Role-play] Pewawancara berperan sebagai stakeholder bisnis yang kecewa:\n\n'Kenapa proyek ini lambat? Saya tidak mau dengar alasan teknis.'\n\nCatatan: mainkan tekanan secukupnya — tujuan melihat ketahanan, bukan membuat kandidat gagal.",
      cari:"Tetap tenang, mengakui kekhawatiran stakeholder, dan menerjemahkan situasinya ke bahasa dampak bisnis — bukan alasan teknis. Menawarkan langkah konkret dan membiarkan stakeholder yang memutuskan.Memegang kendali tanpa konfrontasi maupun menyerah.",
      waspadai:"Panik atau defensif saat ditekan. Menyalahkan tim teknis di hadapan stakeholder. Atau menjanjikan sesuatu yang mustahil hanya untuk meredakan ketegangan saat itu.",
      context_note: 'Dalam skenario ini, Anda akan berhadapan langsung dengan pewawancara yang berperan sebagai stakeholder (pemangku kepentingan) bisnis yang kecewa. Stakeholder adalah pihak yang berkepentingan dengan proyek — bisa atasan, klien internal, atau kepala divisi. Tidak perlu hafal jawaban sempurna; yang dinilai adalah cara Anda menghadapi tekanan dan menjaga komunikasi tetap konstruktif.', signal:null ,
      calibration_warning: { type: 'delivery', label: 'Nilai substansi, bukan cara penyampaian', color: 'purple', text: 'Wajar grogi saat role-play pertama menghadapi stakeholder marah. Nilai substansi respons-nya: apakah ada kesadaran untuk terjemahkan ke bahasa dampak bisnis dan tawarkan langkah konkret? Bukan kelancaran atau ketenangan delivery-nya.' } },
    { id:"UC_4_5", title:"Pertanyaan Pertama Mereka", klaster:"A", mechanism:"M4",
      prompt:"'Saya beri Anda proyek baru sekarang: Buat sistem untuk membantu tim HR.' Itu saja informasinya. Apa 5 pertanyaan pertama yang Anda ajukan?",
      cari:"Pertanyaannya mencakup hal-hal yang menentukan jalannya eksekusi: kapan harus selesai, siapa yang terlibat, apa yang sudah dikunci, siapa penggunanya. Keseimbangan antara memahami tujuan dan memahami batas-batasnya.eimbang, terstruktur.",
      waspadai:"Pertanyaannya hanya sedikit dan tidak menyentuh hal yang penting. Atau langsung melompat ke solusi teknis sebelum memahami konteks dan batasannya.",
      signal:"PM: mayoritas 'kapan, siapa, batasannya apa'. Product: mayoritas 'kenapa, untuk siapa, masalah apa' tanpa menyentuh eksekusi." },
    { id:"UC_4_6", title:"Menyampaikan Kabar Buruk", klaster:"C/D",
      prompt:"[Role-play] 'Saya stakeholder-nya. Anda harus memberi tahu saya bahwa proyek akan telat. Sampaikan.'",
      cari:"Menyampaikan lebih awal, jujur, dengan konteks & dampak jelas, langsung disertai rencana/opsi pemulihan. Mengambil tanggung jawab tanpa melempar kesalahan.",
      waspadai:"Menunda atau mengaburkan kabar buruk supaya tidak terdengar terlalu parah. Menyalahkan pihak lain sebagai penyebab. Atau menyampaikan masalah tanpa disertai rencana atau opsi ke depan.",
      context_note: 'Menyampaikan kabar buruk ke stakeholder adalah salah satu momen paling tidak nyaman dalam pekerjaan PM — dan juga salah satu yang paling penting. Dalam skenario ini, Anda akan langsung mempraktikkannya dengan pewawancara sebagai stakeholder. Fokus pada kejujuran dan rencana ke depan, bukan mencari alasan.', signal:null ,
      calibration_warning: { type: 'delivery', label: 'Nilai substansi, bukan cara penyampaian', color: 'purple', text: 'Fresh grad sering nervous saat role-play kabar buruk. Nilai keberanian untuk jujur dan apakah ada rencana ke depan yang ditawarkan — bukan kepolisan atau cara penyampaiannya.' } },
    { id:"UC_4_7", title:"Coachability Real-Time", klaster:"C",
      prompt:"[Setelah role-play, beri feedback langsung]\n\n'Tadi caramu menangani [bagian X] kurang tepat menurut saya — mestinya [alternatif Y]. Apa pendapatmu?'\n\n(Isi [X] dan [Y] dari role-play yang baru saja terjadi. Ini satu-satunya UC yang harus diimprovisasi.)",
      cari:"Mendengar dengan sungguh-sungguh, mencerna, bertanya untuk memahami lebih dalam — lalu mengintegrasikan atau berargumen balik dengan cara yang menghormati penilai. Yang penting: ada proses berpikir yang nyata, bukan sekadar menerima atau menolak.t & berdasar. Ego yang bisa ditundukkan bukti.",
      waspadai:"Langsung defensif dan mencari pembenaran. Atau sebaliknya, langsung mengiyakan tanpa benar-benar memproses feedbacknya — tidak punya pendirian.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad yang baru pertama kali dapat feedback langsung dari panel bisa tampak canggung. Nilai apakah ada proses berpikir nyata setelah feedback diberikan — bukan kecepatan responsnya.' } },
    { id:"UC_4_8", title:"Prioritisasi Spontan", klaster:"A/C",
      prompt:"'Pagi ini: vendor telat, satu anggota tim sakit, stakeholder minta meeting dadakan, dan ada bug di sistem yang baru rilis. Semua terjadi bersamaan. Apa yang Anda lakukan, dan dalam urutan apa?'",
      cari:"Cepat menilai dampak dan urgensi masing-masing — bug yang memengaruhi pengguna aktif biasanya yang paling mendesak. Mendelegasikan yang bisa didelegasikan sambil tetap tahu kondisi keseluruhan. tenang, menjelaskan logikanya. Berpikir triase.",
      waspadai:"Panik dan mencoba menangani semuanya sekaligus tanpa urutan yang jelas. Atau memprioritaskan berdasarkan siapa yang paling keras menghubunginya, bukan berdasarkan dampak.", signal:null },
    { id:"UC_4_9", title:"Motivasi & Realisme", klaster:"C",
      prompt:"'Bayangkan 18 bulan dari sekarang Anda masih di sini. Apa yang membuatnya layak bagi Anda? Dan apa yang paling mungkin membuat Anda ingin pergi?'",
      cari:"Menyebut hal-hal yang realistis bisa disediakan oleh perusahaan ini — belajar dari proyek nyata, akses ke orang yang lebih senior, ruang untuk berkembang. Ekspektasinya selaras dengan kenyataan pekerjaan ini.ras — sinyal retensi.",
      waspadai:"Motivasinya murni soal gaji, nama perusahaan, atau jabatan — tanpa minat nyata pada pekerjaan itu sendiri. Atau ekspektasinya jelas tidak bisa dipenuhi oleh peran ini.", signal:null ,
      calibration_warning: { type: 'scale', label: 'Skala pengalaman — jangan harap cerita besar', color: 'amber', text: 'Fresh grad sering belum tahu persis apa yang mereka mau dari karir. Jawaban yang jujur dan realistis (meski sederhana) lebih berharga dari jawaban ambisius yang terdengar dihafalkan. Yang diukur: keselarasan motif dan realita.' } },
    { id:"UC_4_10", title:"Pertanyaan Kandidat", klaster:"D",
      prompt:"'Sekarang giliran Anda. Apa yang ingin Anda tanyakan kepada kami?'",
      cari:"Pertanyaannya menunjukkan ia sudah memikirkan dirinya dalam peran ini: bagaimana keberhasilan diukur, apa tantangan terbesar yang dihadapi tim saat ini, bagaimana pengambilan keputusan berjalan di sini.a keputusan diambil, jalur berkembang.",
      waspadai:"Tidak punya pertanyaan sama sekali. Atau pertanyaannya hanya soal fasilitas, gaji, atau jam kerja. Atau menanyakan hal yang sudah dijelaskan dengan jelas sebelumnya dalam proses ini.", signal:null ,
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
