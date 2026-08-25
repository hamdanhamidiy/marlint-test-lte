import { Question } from './supabase/types';

export interface DetailedExplanation {
  summary: string;
  whyCorrect: string;
  distractors: { option: string; reason: string }[];
  maritimeContext?: string;
  ruleOrFormula?: string;
}

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 1 (All 60 Questions)
const TEST_1_EXPLANATIONS: Record<string, DetailedExplanation> = {
  'marlins-g-01': {
    summary: 'Simple Present Tense untuk subjek tunggal (Chief Housekeeper) dengan rutinitas harian.',
    whyCorrect: 'Subjek "The Chief Housekeeper" adalah orang ketiga tunggal (he/she) dan terdapat penanda waktu rutinitas "every morning", sehingga kata kerja wajib berakhiran "-s" (inspects).',
    distractors: [
      { option: 'inspect', reason: 'Salah karena bentuk dasar tanpa akhiran -s hanya digunakan untuk subjek jamak (I/you/we/they).' },
      { option: 'inspecting', reason: 'Salah karena bentuk -ing memerlukan auxiliary verb (is/are) sebelumnya.' },
      { option: 'is inspected', reason: 'Salah karena bermakna pasif (diperiksa), sedangkan Chief Housekeeper adalah pelaku yang memeriksa kabin.' },
    ],
    ruleOrFormula: 'Simple Present: Subject (Singular) + Verb-1 (s/es).',
    maritimeContext: 'Tugas inspeksi harian supervisor tata graha (Housekeeping) di kapal pesiar untuk menjamin standar kebersihan kabin penumpang.',
  },
  'marlins-g-02': {
    summary: 'Modal auxiliary verb "must" selalu diikuti kata kerja bentuk dasar (bare infinitive).',
    whyCorrect: 'Setelah modal verb "must", kata kerja yang mengikutinya wajib dalam bentuk dasar murni tanpa tambahan akhiran (wear).',
    distractors: [
      { option: 'wears', reason: 'Salah karena modal "must" tidak boleh diikuti kata kerja berakhiran -s.' },
      { option: 'wearing', reason: 'Salah karena modal tidak bisa langsung diikuti bentuk gerund/participle (-ing).' },
      { option: 'wore', reason: 'Salah karena "wore" adalah bentuk lampau (Past Tense V2).' },
    ],
    ruleOrFormula: 'Modal Verb (must / should / can) + Bare Infinitive (Verb 1).',
    maritimeContext: 'Instruksi keselamatan wajib SOLAS saat latihan berkumpul darurat (passenger muster drill).',
  },
  'marlins-g-03': {
    summary: 'Present Continuous Tense untuk peristiwa yang sedang berlangsung sekarang (NOW).',
    whyCorrect: 'Penanda waktu "NOW" menunjukkan kegiatan yang sedang berlangsung saat ini, menggunakan pola Present Continuous: Subject + is/am/are + Verb-ing.',
    distractors: [
      { option: 'The waiter served dinner to the guests yesterday.', reason: 'Salah karena menggunakan Past Simple (served) untuk kejadian kemarin.' },
      { option: 'The waiter will serve dinner to the guests tomorrow.', reason: 'Salah karena menggunakan Future Tense (will serve) untuk kejadian besok.' },
      { option: 'The waiter has been served dinner.', reason: 'Salah karena bermakna pasif (pelayan yang disajikan makanan).' },
    ],
    ruleOrFormula: 'Present Continuous: Subject + is/am/are + Verb-ing.',
    maritimeContext: 'Aktivitas pelayanan makan malam di restoran utama kapal pesiar.',
  },
  'marlins-g-04': {
    summary: 'Kombinasi Past Continuous (was cleaning) dan Past Simple (entered).',
    whyCorrect: '"was cleaning" menyatakan aksi yang sedang berlangsung di masa lampau pada subjek tunggal (steward), yang disela oleh aksi tiba-tiba "entered" (Kapten masuk ruangan).',
    distractors: [
      { option: 'were, entered', reason: 'Salah karena subjek "steward" tunggal, harus menggunakan "was", bukan "were".' },
      { option: 'is, enters', reason: 'Salah karena konteks kalimat menceritakan kejadian masa lalu.' },
    ],
    ruleOrFormula: 'Past Continuous (was/were + V-ing) + when + Past Simple (V2).',
    maritimeContext: 'Operasional pembersihan area prasmanan restoran kapal.',
  },
  'marlins-g-05': {
    summary: 'Susunan kalimat imperatif (perintah sopan) keselamatan maritim.',
    whyCorrect: 'Susunan baku kalimat instruksi keselamatan: Please (kesopanan) + keep (kata kerja) + all emergency fire doors (frasa objek) + closed (kata sifat keadaan).',
    distractors: [
      { option: 'Keep please emergency doors all closed', reason: 'Salah karena penempatan kata "please" dan "all" tidak tepat secara gramatikal.' },
    ],
    ruleOrFormula: 'Imperative: Please + Verb + Object + Complement.',
    maritimeContext: 'Pintu kedap api di kapal wajib selalu tertutup untuk mencegah penjalaran asap dan api saat terjadi kebakaran.',
  },
  'marlins-g-06': {
    summary: 'Past Simple Tense dengan keterangan waktu lampau spesifik (yesterday morning).',
    whyCorrect: 'Penanda waktu "yesterday morning" mengharuskan penggunaan kata kerja bentuk lampau kedua / Past Simple (arrived).',
    distractors: [
      { option: 'is arriving', reason: 'Salah karena Present Continuous untuk waktu sekarang.' },
      { option: 'will arrive', reason: 'Salah karena Future Tense untuk rencana masa depan.' },
      { option: 'arrives', reason: 'Salah karena Simple Present untuk jadwal rutin berulang.' },
    ],
    ruleOrFormula: 'Past Simple: Subject + Verb 2 + Past Time Marker.',
    maritimeContext: 'Pencatatan waktu sandar kapal di pelabuhan pada logbook kapal.',
  },
  'marlins-g-07': {
    summary: 'Present Perfect Tense untuk menanyakan durasi pengalaman kerja hingga saat ini.',
    whyCorrect: 'Pertanyaan pengalaman kerja dengan pola "How long" menggunakan Present Perfect: How long + have + subject (you) + Verb 3 (worked)?',
    distractors: [
      { option: 'has', reason: 'Salah karena subjek "you" berpasangan dengan "have", bukan "has".' },
      { option: 'did', reason: 'Salah karena "did" harus diikuti kata kerja dasar (work), bukan "worked".' },
      { option: 'are', reason: 'Salah karena "are" tidak berpasangan dengan Verb 3 pada kalimat aktif.' },
    ],
    ruleOrFormula: 'Present Perfect Question: How long + have/has + Subject + Verb 3?',
    maritimeContext: 'Wawancara kompetensi dan masa layar pelaut oleh Manning Agency.',
  },
  'marlins-g-08': {
    summary: 'Modal "must" menyatakan kewajiban mutlak dalam kepatuhan APD (safety rules).',
    whyCorrect: '"must" menyatakan kewajiban wajib demi keselamatan kerja saat menangani bahan kimia pembersih sanitasi di dapur kapal.',
    distractors: [
      { option: 'might', reason: 'Salah karena hanya menyatakan kemungkinan lemah (boleh pakai atau tidak).' },
      { option: 'could', reason: 'Salah karena hanya menyatakan kesanggupan/kemampuan.' },
      { option: 'shall not', reason: 'Salah karena bermakna larangan (tidak boleh dipakai), berbahaya bagi awak kapal.' },
    ],
    ruleOrFormula: 'Modal "must" = Kewajiban mutlak regulasi keselamatan (Mandatory Requirement).',
    maritimeContext: 'Standar K3 / ISM Code penggunaan Alat Pelindung Diri (APD) di area Galley kapal.',
  },
  'marlins-g-09': {
    summary: 'Pola kalimat penawaran bantuan perhotelan yang sopan (Polite Service Offer).',
    whyCorrect: 'Susunan baku penawaran layanan hotel maritim: Would you like me to (Maukah Anda saya bantu) + bring you (bawakan Anda) + some extra towels (handuk tambahan)?',
    distractors: [
      { option: 'Do you like to bring extra towels', reason: 'Salah makna, menanyakan apakah tamu yang ingin membawa handuk.' },
    ],
    ruleOrFormula: 'Hospitality Offer: "Would you like me to + Verb 1 + Object?"',
    maritimeContext: 'Komunikasi pelayanan kabin penumpang kapal pesiar internasional.',
  },
  'marlins-g-10': {
    summary: 'Preposisi tempat "on" untuk geladak kapal dan "next to" untuk kedekatan lokasi.',
    whyCorrect: 'Geladak kapal menggunakan preposisi "on" (on Deck 5), sedangkan frasa posisi bersebelahan berpasangan dengan "next to".',
    distractors: [
      { option: 'in, of', reason: 'Salah karena lantai/deck kapal menggunakan "on", bukan "in".' },
      { option: 'at, from', reason: 'Salah karena "next from" bukan pasangan frasa yang baku.' },
    ],
    ruleOrFormula: 'Preposition of Place: "on Deck [Number]" dan "next to [Location]".',
    maritimeContext: 'Petunjuk arah navigasi lokasi Muster Station kepada tamu kapal.',
  },
  'marlins-g-11': {
    summary: 'Eksistensial "There are not" untuk kata benda jamak (wine glasses).',
    whyCorrect: 'Frasa benda "wine glasses" berbentuk jamak (plural), sehingga bentuk penyangkalan masa kini menggunakan "there are not".',
    distractors: [
      { option: 'is not', reason: 'Salah karena "is not" hanya untuk benda tunggal (singular).' },
      { option: 'was not', reason: 'Salah karena gala dinner diadakan malam ini (present), bukan lampau.' },
      { option: 'not have', reason: 'Salah secara struktur pembentukan kalimat bahasa Inggris.' },
    ],
    ruleOrFormula: 'Plural Existence: There are (not) + Plural Noun.',
    maritimeContext: 'Persiapan inventaris peralatan bar dan restoran kapal pesiar.',
  },
  'marlins-g-12': {
    summary: 'Reported Speech Backshift: pertanyaan lampau bergeser ke Past Perfect.',
    whyCorrect: 'Karena induk kalimat berbentuk lampau ("The Officer asked..."), pernyataan waktu lampau bergeser mundur (backshift) menjadi Past Perfect (had spotted).',
    distractors: [
      { option: 'has spotted', reason: 'Salah karena tenses tidak boleh present ketika induk kalimatnya lampau (asked).' },
      { option: 'is spotting', reason: 'Salah karena berbentuk Present Continuous.' },
      { option: 'spot', reason: 'Salah karena berbentuk dasar tanpa penyesuaian tenses.' },
    ],
    ruleOrFormula: 'Reported Speech: Past Simple -> Past Perfect (had + Verb 3).',
    maritimeContext: 'Komunikasi dinas jaga navigasi anjungan antara Perwira Jaga (OOW) dan Juru Mudi Jaga (Lookout).',
  },
  'marlins-g-13': {
    summary: 'Permohonan sopan tamu kabin kepada bagian pemeliharaan (Polite Request).',
    whyCorrect: 'Susunan baku permohonan sopan: Could you (Modal + Subjek) + send someone (kirim seseorang) + to repair (untuk memperbaiki) + my bedside lamp (lampu tidur saya)?',
    distractors: [
      { option: 'Send someone you could to repair lamp', reason: 'Salah susunan sintaksis kata tanya bahasa Inggris.' },
    ],
    ruleOrFormula: 'Polite Request: Could you + Verb + Object + to Infinitive?',
    maritimeContext: 'Pelaporan kerusakan fasilitas kabin penumpang ke bagian Housekeeping/Maintenance.',
  },
  'marlins-g-14': {
    summary: 'Preposisi maritim baku: "at port", "in the morning", dan "on board".',
    whyCorrect: 'Kapal sandar di pelabuhan menggunakan "at the port", waktu pagi menggunakan "in the morning", dan di atas kapal menggunakan frasa baku "on board".',
    distractors: [
      { option: 'on, at, in', reason: 'Salah pasangan preposisi standar bahasa maritim.' },
    ],
    ruleOrFormula: 'Maritime Phrases: "at port", "in the morning", "on board".',
    maritimeContext: 'Pemberlakuan peraturan keselamatan pelayaran saat kapal bersandar di pelabuhan.',
  },
  'marlins-g-15': {
    summary: 'Kata penghubung korelatif berpasangan: "Neither ... nor ...".',
    whyCorrect: '"Neither" selalu berpasangan secara gramatikal dengan "nor" untuk menyatakan "baik ... maupun ... tidak".',
    distractors: [
      { option: 'or', reason: 'Salah karena "or" berpasangan dengan "Either".' },
      { option: 'and', reason: 'Salah karena "and" berpasangan dengan "Both".' },
      { option: 'but', reason: 'Salah karena "but" berpasangan dengan "Not only".' },
    ],
    ruleOrFormula: 'Correlative Conjunction: Neither [A] nor [B] + Verb.',
    maritimeContext: 'Laporan insiden tumpahan minuman di lantai dansa lounge kapal.',
  },

  // Vocabulary (16-30)
  'marlins-v-16': {
    summary: 'Peralatan stasiun kopi dan seragam pelayanan bar.',
    whyCorrect: 'sugar bowl (wadah gula), coffee cup lid (tutup cangkir kopi panas), milk carton (karton susu), dan waistcoat (rompi seragam pelayan).',
    distractors: [],
    maritimeContext: 'Standar peralatan layanan sarapan pagi di restoran kapal pesiar.',
  },
  'marlins-v-17': {
    summary: 'Peralatan bar dan penyajian minuman koktail.',
    whyCorrect: 'straw (sedotan minuman), coaster (tatakan gelas anti tumpah), strainer (penyaring es koktail), dan bar measure / jigger (gelas takar minuman keras).',
    distractors: [],
    maritimeContext: 'Operasional bar service di lounge kapal pesiar.',
  },
  'marlins-v-18': {
    summary: 'Aksesoris penyajian es dan botol minuman.',
    whyCorrect: 'serving tongs (penjepit es higienis), ice (es batu), wine cork (gabus penutup botol anggur), dan bar spoon (sendok pengaduk bergagang panjang).',
    distractors: [],
    maritimeContext: 'Standar kebersihan USPH dalam penyajian es batu minuman.',
  },
  'marlins-v-19': {
    summary: 'Definisi dan identifikasi visual alat masak dapur "Ladle".',
    whyCorrect: '"Ladle" adalah sendok sayur bergagang panjang dengan mangkuk cekung dalam yang digunakan untuk menyendok sup atau kuah kaldu di dapur kapal.',
    distractors: [
      { option: 'Whisk', reason: 'Salah. Whisk adalah pengocok telur/adonan berkawat spiral.' },
      { option: 'Spatula', reason: 'Salah. Spatula adalah sodet datar untuk membalik masakan.' },
      { option: 'Tongs', reason: 'Salah. Tongs adalah alat penjepit makanan.' },
    ],
    maritimeContext: 'Peralatan dapur utama (Galley Equipment) juru masak kapal.',
  },
  'marlins-v-20': {
    summary: 'Identifikasi visual Life Jacket (Rompi Penolong Keselamatan SOLAS).',
    whyCorrect: 'Life Jacket adalah perangkat pelampung keselamatan individu berwarna oranye mencolok dengan peluit dan lampu sinyal yang wajib ada di setiap kabin.',
    distractors: [
      { option: 'Rain Coat', reason: 'Salah. Rain coat adalah jas hujan biasa tanpa daya apung.' },
      { option: 'Galley Apron', reason: 'Salah. Apron adalah celemek pelindung koki di dapur.' },
      { option: 'Officer Blazer', reason: 'Salah. Blazer adalah jas seragam dinas perwira kapal.' },
    ],
    maritimeContext: 'Perangkat keselamatan jiwa di laut wajib SOLAS Bab III LSA Code.',
  },
  'marlins-v-21': {
    summary: 'Identifikasi visual Anchor (Jangkar Kapal).',
    whyCorrect: '"Anchor" (Jangkar) adalah perangkat besi tempa berat yang terhubung ke rantai jangkar untuk menahan posisi kapal di dasar laut.',
    distractors: [
      { option: 'Rudder', reason: 'Salah. Rudder adalah daun kemudi di buritan kapal.' },
      { option: 'Propeller', reason: 'Salah. Propeller adalah baling-baling pendorong kapal.' },
      { option: 'Helm', reason: 'Salah. Helm adalah roda kemudi anjungan kapal.' },
    ],
    maritimeContext: 'Peralatan labuh jangkar kapal di area perairan pelabuhan.',
  },
  'marlins-v-22': {
    summary: 'Arti istilah maritim "Muster Station".',
    whyCorrect: '"Muster Station" adalah area titik kumpul darurat yang telah ditentukan di mana penumpang dan awak kapal berkumpul saat terjadi situasi darurat.',
    distractors: [
      { option: 'The central dining room where breakfast is served', reason: 'Salah karena itu adalah definisi restoran utama kapal.' },
      { option: 'The luggage sorting area in the terminal building', reason: 'Salah karena itu area penanganan bagasi pelabuhan.' },
      { option: 'The crew recreation lounge on Deck 2', reason: 'Salah karena itu ruang rekreasi awak kapal.' },
    ],
    maritimeContext: 'Prosedur keselamatan evakuasi darurat kapal pesiar standar SOLAS.',
  },
  'marlins-v-23': {
    summary: 'Istilah navigasi maritim untuk sisi kanan kapal (Starboard).',
    whyCorrect: '"Starboard" adalah istilah navigasi resmi untuk lambung sisi kanan kapal saat menghadap ke arah haluan (depan).',
    distractors: [
      { option: 'Port', reason: 'Salah karena Port adalah lambung sisi kiri kapal.' },
      { option: 'Bow', reason: 'Salah karena Bow adalah bagian ujung depan kapal (haluan).' },
      { option: 'Stern', reason: 'Salah karena Stern adalah bagian ujung belakang kapal (buritan).' },
    ],
    ruleOrFormula: 'Starboard = Kanan (Lampu Hijau) | Port = Kiri (Lampu Merah).',
    maritimeContext: 'Standar perintah kemudi dan navigasi anjungan IMO SMCP.',
  },
  'marlins-v-24': {
    summary: 'Istilah navigasi maritim untuk sisi kiri kapal (Port).',
    whyCorrect: '"Port" adalah istilah resmi kelautan untuk lambung sisi kiri kapal saat menghadap ke depan (haluan).',
    distractors: [
      { option: 'Starboard', reason: 'Salah karena Starboard adalah sisi kanan kapal.' },
      { option: 'Aft', reason: 'Salah karena Aft adalah arah menuju belakang kapal.' },
      { option: 'Bridge', reason: 'Salah karena Bridge adalah ruang anjungan navigasi.' },
    ],
    maritimeContext: 'Standar navigasi dan olah gerak kapal saat sandar di dermaga.',
  },
  'marlins-v-25': {
    summary: 'Istilah kelautan untuk dapur kapal (Galley).',
    whyCorrect: '"Galley" adalah istilah maritim resmi untuk dapur tempat memasak makanan di atas kapal.',
    distractors: [
      { option: 'Pantry', reason: 'Salah karena Pantry adalah ruang persiapan makanan kecil / penyimpanan perlengkapan.' },
      { option: 'Messroom', reason: 'Salah karena Messroom adalah ruang makan awak kapal.' },
      { option: 'Stateroom', reason: 'Salah karena Stateroom adalah kamar tidur kabin penumpang.' },
    ],
    maritimeContext: 'Area kerja koki dan staf kuliner kapal pesiar.',
  },
  'marlins-v-26': {
    summary: 'Kepanjangan standar sanitasi kapal pesiar USPH.',
    whyCorrect: '"USPH" adalah singkatan dari "United States Public Health", badan inspeksi standar sanitasi dan kebersihan kapal pesiar.',
    distractors: [
      { option: 'Universal Ship Passenger Hospital', reason: 'Salah kepanjangan fiktif.' },
      { option: 'United Seafarers Protection Health', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Undersea Protection and Safety Harbor', reason: 'Salah kepanjangan fiktif.' },
    ],
    maritimeContext: 'Standar inspeksi kebersihan makanan, air minum, dan kebersihan dapur kapal.',
  },
  'marlins-v-27': {
    summary: 'Arti tanda pintu perhotelan DND (Do Not Disturb).',
    whyCorrect: '"DND" adalah singkatan dari "Do Not Disturb" (Jangan Diganggu), menandakan tamu tidak ingin kamarnya dimasuki staf saat itu.',
    distractors: [
      { option: 'Day and Night Duty', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Daily Neat Deck', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Door Not Delivered', reason: 'Salah kepanjangan fiktif.' },
    ],
    maritimeContext: 'Etika pelayanan kabin housekeeping di kapal pesiar.',
  },
  'marlins-v-28': {
    summary: 'Definisi tangga/jembatan akses sandar kapal (Gangway).',
    whyCorrect: '"Gangway" adalah jembatan atau tangga jalan yang menghubungkan pintu lambung kapal dengan dermaga pelabuhan.',
    distractors: [
      { option: 'The narrow corridor between crew cabins', reason: 'Salah karena itu adalah lorong kabin (alleyway).' },
      { option: 'The emergency exit ladder inside the engine room', reason: 'Salah karena itu tangga darurat kamar mesin (escape trunk).' },
      { option: 'The anchor windlass control platform', reason: 'Salah karena itu anjungan mesin jangkar.' },
    ],
    maritimeContext: 'Titik kontrol keamanan akses embarkasi dan debarkasi penumpang di pelabuhan.',
  },
  'marlins-v-29': {
    summary: 'Alat pemadam api tumpahan minyak goreng di dapur (Galley Fire Safety).',
    whyCorrect: 'Kebakaran minyak goreng (lemak panas) dipadamkan dengan cara diselimuti selimut api (Fire Blanket) atau alat pemadam Wet Chemical untuk memutus oksigen.',
    distractors: [
      { option: 'Water bucket', reason: 'SANGAT BERBAHAYA! Menyiram air pada minyak panas akan menyebabkan ledakan uap api (fireball explosion).' },
      { option: 'Electric fan blower', reason: 'Salah karena meniupkan udara akan memperbesar kobaran api.' },
      { option: 'Paper napkins', reason: 'Salah karena tisu kertas adalah bahan mudah terbakar.' },
    ],
    maritimeContext: 'Prosedur pemadaman kebakaran Kelas F / K di dapur kapal.',
  },
  'marlins-v-30': {
    summary: 'Fungsi perahu angkut penumpang (Tender Boat).',
    whyCorrect: '"Tender Boat" digunakan untuk mengangkut penumpang bolak-balik antara kapal yang berlabuh di tengah laut dengan dermaga pulau/kota tujuan wisata.',
    distractors: [
      { option: 'Towing large container barges into the river', reason: 'Salah karena itu fungsi kapal tunda (tugboat).' },
      { option: 'Pumping fresh drinking water into the ship tanks', reason: 'Salah karena itu tongkang air (water barge).' },
      { option: 'Carrying heavy maintenance spare parts to the rudder', reason: 'Salah karena itu fungsi kapal kerja suplai.' },
    ],
    maritimeContext: 'Operasi transfer penumpang saat kapal pesiar berlabuh di pelabuhan dangkal (anchorage port).',
  },

  // Time & Numbers (31-40)
  'marlins-tn-31': {
    summary: 'Konversi jam analog 12-jam (07:30 PM) ke waktu maritim 24-jam (19:30).',
    whyCorrect: 'Jarum pendek berada di antara angka 7 dan 8 malam (pukul 7), jarum panjang di angka 6 (30 menit). Waktu 7:30 PM dikonversi ke sistem 24 jam menjadi 19:30.',
    distractors: [
      { option: '8:00 PM (20:00)', reason: 'Salah karena jarum panjang harus menunjuk ke angka 12 untuk jam tepat.' },
      { option: '6:15 PM (18:15)', reason: 'Salah karena jarum panjang di angka 6 menunjukkan 30 menit, bukan 15 menit.' },
      { option: '9:45 PM (21:45)', reason: 'Salah karena jarum pendek tidak berada di angka 9.' },
    ],
    ruleOrFormula: 'Format 24-Jam Maritim: PM = Jam + 12 (07:30 + 12:00 = 19:30).',
    maritimeContext: 'Pencatatan waktu reservasi restoran dan dinas jaga kapal.',
  },
  'marlins-tn-32': {
    summary: 'Konversi waktu militer 20:30 ke sistem 12-jam (8:30 PM).',
    whyCorrect: '20:30 dikurangi 12 jam menghasilkan pukul 8:30 malam (8:30 PM).',
    distractors: [
      { option: '8:30 AM', reason: 'Salah karena AM untuk pagi hari (08:30).' },
      { option: '10:30 PM', reason: 'Salah karena 10:30 PM adalah 22:30.' },
      { option: '7:30 PM', reason: 'Salah karena 7:30 PM adalah 19:30.' },
    ],
    ruleOrFormula: '20:30 - 12:00 = 8:30 PM.',
    maritimeContext: 'Komunikasi jadwal kegiatan hiburan kapal kepada penumpang.',
  },
  'marlins-tn-33': {
    summary: 'Jadwal sarapan pagi dan kapasitas tur wisata pantai.',
    whyCorrect: 'Breakfast dimulai pukul 7:00 AM dan kapasitas bus wisata maksimum adalah 150 orang sesuai teks panduan.',
    distractors: [],
    maritimeContext: 'Manajemen waktu dan kapasitas tur tamasya penumpang di pelabuhan singgah.',
  },
  'marlins-tn-34': {
    summary: 'Perhitungan durasi operasional prasmanan malam (18:45 hingga 21:15).',
    whyCorrect: 'Dari 18:45 ke 19:00 = 15 menit. Dari 19:00 ke 21:00 = 2 jam. Dari 21:00 ke 21:15 = 15 menit. Total durasi = 2 jam 30 menit.',
    distractors: [
      { option: '2 hours and 15 minutes', reason: 'Salah hitung durasi selisih 15 menit.' },
      { option: '3 hours', reason: 'Salah karena 3 jam dari 18:45 adalah 21:45.' },
      { option: '1 hour and 45 minutes', reason: 'Salah hitung pengurangan waktu.' },
    ],
    ruleOrFormula: 'Durasi = Waktu Tutup (21:15) - Waktu Buka (18:45) = 2 jam 30 menit.',
    maritimeContext: 'Jadwal operasional jam buka restoran prasmanan kapal.',
  },
  'marlins-tn-35': {
    summary: 'Kalkulasi total jam kerja pembersihan 16 kabin stateroom.',
    whyCorrect: '16 kabin × 15 menit/kabin = 240 menit. 240 menit ÷ 60 menit/jam = 4 jam tepat.',
    distractors: [
      { option: '3 hours and 30 minutes', reason: 'Salah karena 3,5 jam hanya 210 menit (14 kabin).' },
      { option: '5 hours', reason: 'Salah karena 5 jam adalah 300 menit (20 kabin).' },
      { option: '2 hours and 45 minutes', reason: 'Salah hitung perkalian menit.' },
    ],
    ruleOrFormula: 'Total Waktu = (16 × 15) ÷ 60 = 240 ÷ 60 = 4 Jam.',
    maritimeContext: 'Perencanaan beban kerja harian cabin steward kapal pesiar.',
  },
  'marlins-tn-36': {
    summary: 'Pengucapan nomor kabin "7042" dalam standar radio IMO SMCP.',
    whyCorrect: 'Sesuai aturan IMO SMCP, nomor diucapkan digit per digit secara terpisah dan jelas: "Seven – zero – four – two".',
    distractors: [
      { option: 'Seventy – forty-two', reason: 'Salah karena tidak boleh dikelompokkan puluhan dalam komunikasi maritim.' },
      { option: 'Seven thousand and forty-two', reason: 'Salah karena pengucapan ribuan dapat memicu salah dengar di radio.' },
      { option: 'Seven hundred forty-two', reason: 'Salah karena menghilangkan digit angka nol.' },
    ],
    ruleOrFormula: 'IMO SMCP Radiotelephony: Spell each digit individually (7-0-4-2).',
    maritimeContext: 'Prosedur komunikasi radio internal dan pemanggilan darurat kapal.',
  },
  'marlins-tn-37': {
    summary: 'Perhitungan persentase penumpang tur wisata (60% dari 2.400).',
    whyCorrect: '60% dari 2.400 = (60 ÷ 100) × 2.400 = 0,6 × 2.400 = 1.440 orang penumpang.',
    distractors: [
      { option: '1,200 passengers', reason: 'Salah karena 1.200 adalah 50% (setengah).' },
      { option: '1,600 passengers', reason: 'Salah karena 1.600 adalah sekitar 66,7%.' },
      { option: '1,800 passengers', reason: 'Salah karena 1.800 adalah 75%.' },
    ],
    ruleOrFormula: 'Nilai = 2.400 × 0,60 = 1.440 Penumpang.',
    maritimeContext: 'Perhitungan kuota logistik tur dan pengawasan tiket penumpang.',
  },
  'marlins-tn-38': {
    summary: 'Perhitungan tip 15% dari total tagihan $85.00.',
    whyCorrect: '15% dari $85.00 = 0,15 × 85 = $12.75.',
    distractors: [
      { option: '$10.50', reason: 'Salah hitung desimal.' },
      { option: '$15.00', reason: 'Salah karena menganggap 15% dari $100.' },
      { option: '$8.50', reason: 'Salah karena $8.50 adalah 10%.' },
    ],
    ruleOrFormula: 'Tip = $85.00 × 0,15 = $12.75.',
    maritimeContext: 'Sistem penagihan dan administrasi kasir restoran kapal.',
  },
  'marlins-tn-39': {
    summary: 'Penulisan kata bilangan bertingkat (Ordinal Number) untuk "22nd".',
    whyCorrect: 'Bilangan urutan ke-22 dalam bahasa Inggris adalah "Twenty-second" (disingkat 22nd).',
    distractors: [
      { option: 'Twenty-two', reason: 'Salah karena ini angka kardinal biasa (22), bukan urutan.' },
      { option: 'Twentieth-two', reason: 'Salah tata bahasa pembentukan kata bilangan bertingkat.' },
      { option: 'Twelfth-second', reason: 'Salah kata dasar.' },
    ],
    ruleOrFormula: 'Ordinal Number: 22nd = Twenty-second.',
    maritimeContext: 'Penyebutan tanggal dan nomor dek kapal.',
  },
  'marlins-tn-40': {
    summary: 'Sinyal isyarat alarm bahaya umum (General Emergency Alarm).',
    whyCorrect: 'Sesuai regulasi SOLAS Bab III, sinyal General Emergency Alarm terdiri dari 7 tiupan/isyarat pendek diikuti 1 tiupan panjang (7 short blasts + 1 prolonged blast).',
    distractors: [
      { option: 'Three (3)', reason: 'Salah karena 3 tiupan panjang adalah isyarat orang jatuh ke laut (Man Overboard).' },
      { option: 'Five (5)', reason: 'Salah karena 5 tiupan pendek adalah isyarat ragu-ragu/bahaya tubrukan COLREGs.' },
      { option: 'Ten (10)', reason: 'Salah jumlah tiupan.' },
    ],
    ruleOrFormula: 'SOLAS Alarm Standard: • • • • • • • — (7 pendek + 1 panjang).',
    maritimeContext: 'Tanda bahaya umum evakuasi darurat kapal di laut.',
  },

  // Reading (41-50)
  'marlins-r-41': {
    summary: 'Pencocokan judul paragraf teks pencegahan mabuk laut (Seasickness).',
    whyCorrect: 'Paragraf 1 membahas faktor sugesti pikiran (psychological cause), Paragraf 2 membahas efek samping obat patch (unwanted effects of medication), dan Paragraf 3 membahas jahe/apel hijau (helpful drug-free remedies).',
    distractors: [
      { option: 'Why children rarely get seasick.', reason: 'Judul pengalih yang tidak dibahas sama sekali di dalam teks.' },
    ],
    maritimeContext: 'Pengetahuan medis dasar penanganan keluhan mabuk laut penumpang kapal.',
  },
  'marlins-r-42': {
    summary: 'Waktu pemakaian plester anti mabuk laut scopolamine.',
    whyCorrect: 'Teks menyatakan plester harus ditempel di belakang telinga sekurang-kurangnya 8 jam sebelum terpapar ombak (at least eight hours before exposure).',
    distractors: [
      { option: 'Only after you start feeling dizzy and nauseous', reason: 'Salah karena plester bersifat pencegahan dini, bukan obat setelah mual parah.' },
      { option: 'Three days after boarding the cruise vessel', reason: 'Salah karena 3 hari adalah masa bertahannya efektivitas plester.' },
      { option: 'Immediately before going to sleep at midnight', reason: 'Salah karena tidak sesuai teks petunjuk medis.' },
    ],
    maritimeContext: 'Informasi kesehatan medis penumpang kapal pesiar.',
  },
  'marlins-r-43': {
    summary: 'Makanan alami pereda mual tanpa menyebabkan kantuk.',
    whyCorrect: 'Paragraf ke-3 menyebutkan jahe (ginger) dan apel hijau (green apples) sebagai makanan alami pencegah mual tanpa efek samping kantuk.',
    distractors: [
      { option: 'Hot milk and dark chocolate', reason: 'Tidak disebutkan dalam teks.' },
      { option: 'Citrus fruits and bread', reason: 'Tidak disebutkan dalam teks.' },
      { option: 'Raw fish and ginger ale', reason: 'Tidak tepat dan tidak tertulis di teks.' },
    ],
    maritimeContext: 'Pemberian saran makanan sehat untuk tamu yang mengalami mual di laut.',
  },
  'marlins-r-44': {
    summary: 'Pencocokan judul panduan keselamatan kebakaran kapal (Fire Safety).',
    whyCorrect: 'Paragraf 1 tentang tindakan menemukan api (What to do when you discover a fire), Paragraf 2 tentang evakuasi tamu (Evacuation procedures), Paragraf 3 tentang pencegahan (Prevention is better than cure).',
    distractors: [
      { option: 'Using heavy foam hoses only.', reason: 'Judul pengalih yang tidak ada pembahasannya di teks.' },
    ],
    maritimeContext: 'Tindakan pencegahan dan respon kebakaran kapal standar SOLAS Fire Safety.',
  },
  'marlins-r-45': {
    summary: 'Kelengkapan informasi layanan kamar (Room Service Information).',
    whyCorrect: 'Room service "available" (tersedia 24 jam), pesanan "delivered" (diantarkan), tidak ada biaya tambahan / "charge", dan hubungi / "contact" resepsionis.',
    distractors: [],
    maritimeContext: 'Standar komunikasi pelayanan kamar hotel kapal pesiar.',
  },
  'marlins-r-46': {
    summary: 'Aturan keselamatan barang terlarang (Banned Items on Cruise).',
    whyCorrect: 'Barang tertentu dilarang ("banned"), dilarang membawa ("pack") setrika baju ("iron") di koper karena risiko kebakaran, kecuali ("exception") catok rambut dengan auto shut-off.',
    distractors: [],
    maritimeContext: 'Regulasi pencegahan bahaya kebakaran akibat alat pemanas listrik di kabin.',
  },
  'marlins-r-47': {
    summary: 'Kewajiban menjaga jalur keluar darurat (Emergency Escape Route).',
    whyCorrect: 'Rambu "KEEP CLEAR AT ALL TIMES" mewajibkan lorong dan tangga darurat tidak boleh terhalang oleh koper, troli pelayanan, atau alat pembersih.',
    distractors: [
      { option: 'Only use this door when delivering room service breakfast', reason: 'Salah karena pintu ini adalah jalur keselamatan darurat.' },
      { option: 'Lock the door at night to maintain passenger cabin quietness', reason: 'DILARANG KERAS mengunci pintu darurat menurut aturan SOLAS.' },
      { option: 'Clean the door glass panels every afternoon', reason: 'Salah bukan makna inti rambu keselamatan.' },
    ],
    maritimeContext: 'Pemeriksaan rutin jalur evakuasi keselamatan kapal oleh Safety Officer.',
  },
  'marlins-r-48': {
    summary: 'Dokumen yang wajib dibawa penumpang saat tur pantai.',
    whyCorrect: 'Pengumuman secara eksplisit menginstruksikan tamu untuk siap dengan pas darat mereka ("with their shore passes ready").',
    distractors: [
      { option: 'Their heavy suitcases', reason: 'Salah karena koper tetap ditinggal di kabin kapal.' },
      { option: 'Their cabin lifejackets', reason: 'Salah karena jaket pelampung tidak dibawa ke darat.' },
      { option: 'Their passports only', reason: 'Salah karena dokumen akses utama di pelabuhan adalah shore pass kapal.' },
    ],
    maritimeContext: 'Prosedur debarkasi tur darat penumpang di pelabuhan singgah.',
  },
  'marlins-r-49': {
    summary: 'Pencegahan kontaminasi silang alergen makanan (Cross-Contamination).',
    whyCorrect: 'Roti bebas gluten disimpan di tempat terpisah untuk mencegah kontak dengan tepung terigu agar aman bagi tamu penderita alergi parah (Celiac disease).',
    distractors: [
      { option: 'Because gluten-free bread spoils faster than normal bread', reason: 'Salah bukan alasan medis pencegahan alergi.' },
      { option: 'To keep it hot before the dinner service starts', reason: 'Salah bukan tujuan penyimpanan terpisah.' },
      { option: 'Because it is only served to the Captain and Senior Officers', reason: 'Salah karena disediakan khusus bagi tamu dengan pantangan alergi.' },
    ],
    maritimeContext: 'Standar keamanan pangan USPH dan manajemen alergen di dapur kapal.',
  },
  'marlins-r-50': {
    summary: 'Tujuan pemindaian kartu identitas SeaPass di pintu gangway.',
    whyCorrect: 'Pemindaian kartu di gangway bertujuan memastikan sistem mengetahui jumlah persis orang yang ada di atas kapal (exact head count) sebelum kapal berlayar.',
    distractors: [
      { option: 'To track how much money crew members spend in port', reason: 'Salah bukan fungsi keamanan pelayaran.' },
      { option: 'To check whether the crew uniform is clean', reason: 'Salah bukan tujuan pemindaian gangway.' },
      { option: 'To verify work visas with local port immigration', reason: 'Salah karena verifikasi visa dilakukan oleh staf imigrasi kapal/pelabuhan.' },
    ],
    maritimeContext: 'Protokol keamanan kapal dan pelabuhan internasional ISPS Code.',
  },

  // Listening (51-60)
  'marlins-l-51': {
    summary: 'Pesanan bahan makanan laut dari Executive Chef (85 kg Udang/Shrimp).',
    whyCorrect: 'Dalam rekaman, Executive Chef secara jelas meminta: "...order 85 kilos of fresh jumbo shrimp..." (85 kg udang segar).',
    distractors: [
      { option: 'Lobster', reason: 'Salah karena kata yang diucapkan adalah "shrimp" bukan "lobster".' },
      { option: 'Crab', reason: 'Salah karena tidak disebutkan kepiting.' },
      { option: 'Salmon', reason: 'Salah karena tidak ada pesanan ikan salmon.' },
    ],
    maritimeContext: 'Komunikasi pengadaan logistik bahan makanan (Provisioning) di kapal.',
  },
  'marlins-l-52': {
    summary: 'Pesanan sarapan kamar (Omelette with salad).',
    whyCorrect: 'Tamu memesan: "a cheese and mushroom omelette with a side green salad and a glass of orange juice".',
    distractors: [
      { option: 'Curry with rice', reason: 'Salah karena tamu memesan telur dadar (omelette).' },
      { option: 'Toast with butter', reason: 'Salah tidak ada pesanan roti panggang.' },
      { option: 'Fresh fruit platter', reason: 'Salah tidak ada pesanan piring buah segar.' },
    ],
    maritimeContext: 'Penerimaan pesanan layanan kamar (Room Service Order) via telepon kabin.',
  },
  'marlins-l-53': {
    summary: 'Permintaan barang tambahan kabin tamu (Pillows & Mineral Water).',
    whyCorrect: 'Tamu meminta: "...two extra pillows and a large bottle of mineral water..." (dua bantal tambahan dan satu botol besar air mineral).',
    distractors: [
      { option: 'Two bath towels and extra shampoo', reason: 'Salah karena tamu meminta bantal (pillows), bukan handuk.' },
      { option: 'A breakfast tray and hot black coffee', reason: 'Salah tidak ada pesanan kopi/sarapan.' },
      { option: 'An iron and ironing board', reason: 'Salah karena setrika dilarang di kabin.' },
    ],
    maritimeContext: 'Pelayanan permintaan perlengkapan kabin oleh Cabin Steward.',
  },
  'marlins-l-54': {
    summary: 'Pengumuman cuaca dari Anjungan Kapal (Moderate swell with sunny intervals).',
    whyCorrect: 'Pengumuman kapten menyebutkan cuaca esok hari berombak sedang dengan jeda cerah berawan.',
    distractors: [
      { option: 'Severe hurricane storm', reason: 'Salah karena tidak ada badai topan.' },
      { option: 'Heavy snowfall', reason: 'Salah karena bukan cuaca salju lebat.' },
    ],
    maritimeContext: 'Prakiraan cuaca navigasi harian untuk kenyamanan pelayaran penumpang.',
  },
  'marlins-l-55': {
    summary: 'Instruksi waktu kedatangan pandu laut pelabuhan (Pilot Boarding Time).',
    whyCorrect: 'Pesan radio VHF stasiun pandu mengonfirmasi waktu naik pandu laut ke atas kapal pada waktu yang ditentukan.',
    distractors: [],
    maritimeContext: 'Komunikasi radio VHF Ship-to-Shore saat proses pemanduan kapal masuk alur pelabuhan.',
  },
  'marlins-l-56': {
    summary: 'Pemberitahuan latihan keselamatan kapal (Muster Drill Announcement).',
    whyCorrect: 'Instruksi pengumuman anjungan mewajibkan seluruh penumpang mengenakan jaket pelampung dan menuju pos kumpul masing-masing.',
    distractors: [],
    maritimeContext: 'Pengumuman keselamatan wajib pra-keberangkatan kapal pesiar.',
  },
  'marlins-l-57': {
    summary: 'Pemberian izin olah gerak kapal dari stasiun pemandu lalu lintas kapal (VTS).',
    whyCorrect: 'Stasiun VTS memberikan izin kapal keluar alur pelayaran setelah kapal tunda terlepas.',
    distractors: [],
    maritimeContext: 'Prosedur komunikasi VHF standar navigasi kapal keluar dermaga.',
  },
  'marlins-l-58': {
    summary: 'Laporan suhu kamar pendingin daging (Meat Freezer Cold Room Alarm).',
    whyCorrect: 'Kepala juru masak melaporkan alarm kenaikan suhu di ruang pendingin daging agar segera diperiksa teknisi pendingin.',
    distractors: [],
    maritimeContext: 'Pemeliharaan suhu pendingin makanan sesuai standar kesehatan USPH.',
  },
  'marlins-l-59': {
    summary: 'Perintah pembagian tugas sandar kapal di haluan (Mooring Station Orders).',
    whyCorrect: 'Perwira jaga menginstruksikan juru mudi haluan untuk menyiapkan tali tambat depan (head line dan spring line).',
    distractors: [],
    maritimeContext: 'Komunikasi radio walkie-talkie operasional sandar kapal di dermaga.',
  },
  'marlins-l-60': {
    summary: 'Pemberitahuan penutupan pintu kedap air bawah air (Watertight Doors Closing).',
    whyCorrect: 'Anjungan memberi peringatan bahwa pintu kedap air di dek bawah akan ditutup secara remote dari konsol kontrol anjungan.',
    distractors: [],
    maritimeContext: 'Prosedur keselamatan penutupan pintu kedap air kapal standar SOLAS.',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 2 (All 60 Questions)
const TEST_2_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm2-g-01': {
    summary: 'Pola kata kerja perintah/instruksi: instruct + someone + to-infinitive.',
    whyCorrect: 'Setelah kata kerja "instructed [someone]", kata kerja selanjutnya wajib menggunakan bentuk to-infinitive (to clean).',
    distractors: [
      { option: 'for', reason: 'Salah karena "instruct" tidak diikuti preposisi "for" sebelum kata kerja.' },
      { option: 'with', reason: 'Salah karena tidak memenuhi pola to-infinitive.' },
      { option: 'at', reason: 'Salah penggunaan preposisi.' },
    ],
    ruleOrFormula: 'Verb Pattern: Instruct + Object + to + Verb 1.',
    maritimeContext: 'Instruksi kerja pembersihan Oily Water Separator (OWS) di kamar mesin sebelum pemeriksaan PSC.',
  },
  'm2-g-02': {
    summary: 'Penggunaan preposisi "for" untuk menyatakan durasi/rentang waktu (three days).',
    whyCorrect: '"for" digunakan bersama durasi waktu (three days) pada kalimat Present Perfect Continuous ("has been anchored").',
    distractors: [
      { option: 'since', reason: 'Salah karena "since" digunakan untuk titik awal waktu (misal: since Monday), bukan total durasi hari.' },
      { option: 'during', reason: 'Salah karena "during" diikuti kata benda kejadian/peristiwa (misal: during the voyage).' },
      { option: 'until', reason: 'Salah makna karena "until" menyatakan batas akhir, bukan durasi waktu tunggu yang telah berlangsung.' },
    ],
    ruleOrFormula: 'Present Perfect: for + Period of Time (for three days).',
    maritimeContext: 'Waktu tunggu kapal berlabuh jangkar di luar pelabuhan sebelum mendapat izin sandar dermaga.',
  },
  'm2-g-03': {
    summary: 'Modal "must" menyatakan kewajiban mutlak dalam SOP tanggap darurat kamar mesin.',
    whyCorrect: '"must" menyatakan keharusan wajib bagi masinis jaga untuk segera menginvestigasi sumur got (bilge) saat alarm level tinggi berbunyi.',
    distractors: [
      { option: 'might', reason: 'Salah karena hanya menyatakan kemungkinan lemah (boleh atau tidak).' },
      { option: 'would', reason: 'Salah karena tidak menyatakan kewajiban tegas.' },
      { option: 'could', reason: 'Salah karena hanya menyatakan opsi kesanggupan.' },
    ],
    ruleOrFormula: 'Modal "must" = Kewajiban mutlak prosedur keselamatan darurat.',
    maritimeContext: 'Tindakan pencegahan kebocoran lambung dan banjir kamar mesin standar ISM Code.',
  },
  'm2-g-04': {
    summary: 'Susunan kalimat laporan navigasi olah gerak kapal menuju posisi marabahaya.',
    whyCorrect: 'Susunan baku kalimat laporan: Subject (The vessel) + Verb (proceeded) + Manner (at full speed) + Direction (towards the distress position).',
    distractors: [
      { option: 'At full speed the distress position towards proceeded the vessel.', reason: 'Salah susunan sintaksis kata kerja dan keterangan arah.' },
      { option: 'Towards the vessel proceeded at full speed distress position.', reason: 'Salah peletakan subjek dan objek tujuan.' },
    ],
    ruleOrFormula: 'Syntax: Subject + Verb + Manner + Direction.',
    maritimeContext: 'Komunikasi olah gerak operasi pencarian dan pertolongan maritim (SAR).',
  },
  'm2-g-05': {
    summary: 'Preposisi tempat "on the port side" dan waktu jam "at 0600 hours".',
    whyCorrect: 'Posisi lambung kapal menggunakan "on the port side" dan jam waktu spesifik menggunakan "at 0600 hours".',
    distractors: [
      { option: 'in, on', reason: 'Salah karena sisi lambung kapal tidak menggunakan "in" dan jam waktu tidak menggunakan "on".' },
      { option: 'at, in', reason: 'Salah penempatan pasangan preposisi.' },
      { option: 'by, for', reason: 'Salah konteks arti.' },
    ],
    ruleOrFormula: 'Preposition: "on the [port/starboard] side" & "at [time] hours".',
    maritimeContext: 'Pencatatan waktu dan posisi embarkasi pandu laut pada buku harian kapal (Deck Logbook).',
  },
  'm2-g-06': {
    summary: 'Subjek benda kolektif tak terhitung (lashing gear) berpasangan dengan "was".',
    whyCorrect: '"lashing gear" adalah kata benda kolektif tak terhitung (uncountable noun) yang berkonsep tunggal, sehingga kata kerja pasif lampau yang tepat adalah "was".',
    distractors: [
      { option: 'were', reason: 'Salah karena "gear" tidak diperlakukan sebagai kata benda jamak.' },
      { option: 'have been', reason: 'Salah karena peristiwa inspeksi terjadi sebelum berlayar di masa lampau spesifik.' },
      { option: 'are', reason: 'Salah karena bentuk present tidak sesuai dengan peristiwa sebelum berlayar.' },
    ],
    ruleOrFormula: 'Uncountable Noun Agreement: "gear / equipment" + Singular Verb (was).',
    maritimeContext: 'Pemeriksaan alat pengikat peti kemas oleh Mualim I sebelum kapal bertolak ke laut lepas.',
  },
  'm2-g-07': {
    summary: 'Past Continuous (were securing) untuk aksi latar belakang pada subjek jamak (deck crew).',
    whyCorrect: '"While" menyatakan aksi yang sedang berlangsung bersamaan di masa lampau pada subjek jamak (deck crew), disela oleh perintah pandu ("ordered").',
    distractors: [
      { option: 'are securing', reason: 'Salah karena induk kalimat "ordered" berbentuk Past Simple (lampau).' },
      { option: 'secures', reason: 'Salah bentuk Simple Present tunggal.' },
      { option: 'was secured', reason: 'Salah karena bermakna pasif dan subjek crew adalah jamak.' },
    ],
    ruleOrFormula: 'Past Continuous: While + Subject (Plural) + were + Verb-ing.',
    maritimeContext: 'Aktivitas pengikatan tali tambat geladak saat kapal melakukan olah gerak sandar.',
  },
  'm2-g-08': {
    summary: 'Kolokasi kata sifat: "responsible for" + Gerund (correcting).',
    whyCorrect: 'Kata sifat "responsible" selalu berpasangan dengan preposisi "for" untuk menyatakan tanggung jawab atas suatu tugas (responsible for correcting).',
    distractors: [
      { option: 'with', reason: 'Salah pasangan preposisi.' },
      { option: 'to', reason: 'Salah karena "responsible to" untuk atasan (misal: responsible to the Master), bukan atas pekerjaan.' },
      { option: 'in', reason: 'Salah penggunaan preposisi.' },
    ],
    ruleOrFormula: 'Collocation: "responsible for + Verb-ing / Noun".',
    maritimeContext: 'Tugas navigasi Mualim II (Navigating Officer) dalam mengoreksi peta laut dan buku kepanduan.',
  },
  'm2-g-09': {
    summary: 'Aturan kedekatan (Proximity Rule) pada "Neither... nor...".',
    whyCorrect: 'Pada konstruksi "Neither... nor...", kata kerja menyesuaikan dengan subjek yang paling dekat dengannya ("the Able Seamen" = jamak), sehingga menggunakan "were".',
    distractors: [
      { option: 'was', reason: 'Salah karena subjek terdekat adalah "Able Seamen" yang berbentuk jamak.' },
      { option: 'is', reason: 'Salah karena kejadian berada di waktu lampau (parted).' },
      { option: 'being', reason: 'Salah karena participle tidak dapat berdiri sendiri sebagai predikat utama.' },
    ],
    ruleOrFormula: 'Proximity Rule: Neither [A] nor [Plural Subject B] + Plural Verb (were).',
    maritimeContext: 'Investigasi insiden putusnya tali tambat di geladak haluan kapal.',
  },
  'm2-g-10': {
    summary: 'Simple Present Passive ("is tested") untuk rutinitas pemeliharaan mingguan.',
    whyCorrect: 'Mesin sekoci (subjek tunggal) dikenai tindakan uji coba secara berkala mingguan ("every week"), menggunakan kalimat pasif: is + tested.',
    distractors: [
      { option: 'are', reason: 'Salah karena subjek "engine" adalah tunggal.' },
      { option: 'was being', reason: 'Salah karena "every week" adalah rutinitas berkala, bukan kejadian lampau sesaat.' },
      { option: 'have', reason: 'Salah struktur tata bahasa pasif.' },
    ],
    ruleOrFormula: 'Present Passive: Subject (Singular) + is + Verb 3.',
    maritimeContext: 'Uji coba mingguan mesin sekoci penolong sesuai regulasi SOLAS Bab III.',
  },
  'm2-g-11': {
    summary: 'Modal "must not" menyatakan larangan mutlak keselamatan masuk ruang tertutup.',
    whyCorrect: '"must not" menyatakan larangan keras memasuki ruang tertutup (enclosed space) sebelum dilakukan pengujian atmosfer dan dinyatakan bebas gas berbahaya.',
    distractors: [
      { option: 'need not', reason: 'Salah karena bermakna "tidak perlu" (masih diperbolehkan jika mau).' },
      { option: 'might not', reason: 'Salah karena hanya menyatakan kemungkinan.' },
      { option: 'shall', reason: 'Salah karena bermakna perintah untuk masuk, sangat fatal bagi keselamatan jiwa.' },
    ],
    ruleOrFormula: 'Prohibition: "Must not" = Larangan mutlak demi keselamatan jiwa.',
    maritimeContext: 'SOP keselamatan izin kerja ruang tertutup (Enclosed Space Entry Permit).',
  },
  'm2-g-12': {
    summary: 'Susunan kalimat instruksi darurat berkumpul (Muster Station Announcement).',
    whyCorrect: 'Susunan baku instruksi darurat: Subject (All crew members) + Modal (must) + Verb (report) + Prepositional Phrase (to their emergency muster stations) + Adverb (immediately).',
    distractors: [
      { option: 'To their emergency muster stations all crew members immediately must report.', reason: 'Salah susunan sintaksis bahasa Inggris.' },
    ],
    ruleOrFormula: 'Syntax: Subject + Modal + Verb 1 + Destination + Adverb.',
    maritimeContext: 'Pengumuman instruksi anjungan saat alarm darurat bahaya kapal diaktifkan.',
  },
  'm2-g-13': {
    summary: 'Past Continuous (was drifting) untuk mendeskripsikan kondisi saat diamati.',
    whyCorrect: 'Perwira jaga mengamati kejadian yang sedang berlangsung di masa lampau: bahwa kapal sedang hanyut (was drifting) akibat arus lintang yang kuat.',
    distractors: [
      { option: 'drifts', reason: 'Salah bentuk Simple Present.' },
      { option: 'has drifted', reason: 'Salah karena induk kalimat "noticed" berbentuk Past Simple.' },
      { option: 'is drifting', reason: 'Salah tenses present tidak selaras dengan kalimat narasi lampau.' },
    ],
    ruleOrFormula: 'Past Narrative: Past Simple + that + Past Continuous.',
    maritimeContext: 'Pengamatan efek arus laut terhadap haluan kapal pada dinas jaga anjungan.',
  },
  'm2-g-14': {
    summary: 'Preposisi "Before" diikuti bentuk Gerund (opening).',
    whyCorrect: 'Setelah preposisi "Before", kata kerja yang mengikutinya wajib dalam bentuk Gerund (Verb-ing: opening).',
    distractors: [
      { option: 'opened', reason: 'Salah karena bentuk past tense tidak digunakan langsung setelah preposisi.' },
      { option: 'open', reason: 'Salah karena kata kerja dasar tidak dapat langsung mengikuti preposisi.' },
      { option: 'to open', reason: 'Salah bentuk to-infinitive.' },
    ],
    ruleOrFormula: 'Preposition + Gerund (Verb-ing): "Before opening".',
    maritimeContext: 'Pemeriksaan keselamatan sebelum membuka keran manifold pengisian bahan bakar (Bunkering).',
  },
  'm2-g-15': {
    summary: 'Pola kata kerja permohonan: request + object + to-infinitive.',
    whyCorrect: 'Konstruksi baku kata kerja permintaan: requested + [the tugboat] + to push (to-infinitive).',
    distractors: [
      { option: 'for', reason: 'Salah pola preposisi.' },
      { option: 'at', reason: 'Salah konstruksi kalimat.' },
      { option: 'with', reason: 'Salah struktur kata kerja.' },
    ],
    ruleOrFormula: 'Verb Pattern: Request + Object + to + Verb 1.',
    maritimeContext: 'Perintah Nahkoda kepada kapal tunda untuk mendorong lambung kanan buritan kapal.',
  },

  // Vocabulary & Equipment (16-30)
  'm2-v-16': {
    summary: 'Fungsi mekanis mesin derek jangkar (Windlass).',
    whyCorrect: 'Windlass adalah mesin derek utama di geladak haluan untuk menaikkan/menurunkan jangkar dan menarik tali tambat depan kapal.',
    distractors: [
      { option: 'To separate oil from bilge water in the engine room', reason: 'Salah karena itu fungsi Oily Water Separator (OWS).' },
      { option: 'To measure echo water depth below the ship keel', reason: 'Salah karena itu fungsi Echo Sounder.' },
      { option: 'To cool main engine cylinder liner jackets', reason: 'Salah karena itu fungsi pompa air pendingin mesin.' },
    ],
    maritimeContext: 'Peralatan geladak haluan (Forecastle) saat olah gerak labuh jangkar.',
  },
  'm2-v-17': {
    summary: 'Definisi teknis lambung timbul kapal (Freeboard).',
    whyCorrect: 'Freeboard adalah jarak vertikal yang diukur dari garis air (waterline) sampai ke tepi atas geladak lambung timbul (weather deck).',
    distractors: [
      { option: 'The overall length of the vessel from bow stem to stern', reason: 'Salah karena itu adalah Length Overall (LOA).' },
      { option: 'The maximum width of the hull at the midship section', reason: 'Salah karena itu adalah Beam / Breadth.' },
      { option: 'The depth of water beneath the lowest point of the keel', reason: 'Salah karena itu adalah Under-Keel Clearance (UKC).' },
    ],
    maritimeContext: 'Batas keselamatan sarat dan daya apung cadangan kapal (Load Line Convention).',
  },
  'm2-v-18': {
    summary: 'Perangkat penyelamat anti hipotermia (Immersion Suit).',
    whyCorrect: 'Immersion Suit (pakaian penyelamat tahan dingin kedap air) dirancang khusus untuk mencegah hipotermia bagi pelaut di perairan dingin.',
    distractors: [
      { option: 'Standard lifejacket beacon', reason: 'Salah karena jaket pelampung biasa tidak memberikan isolasi termal terhadap suhu dingin.' },
      { option: 'Inflatable lifebuoy ring', reason: 'Salah karena pelampung cincin hanya alat apung sederhana.' },
      { option: 'Thermal protective curtain', reason: 'Salah bukan perangkat keselamatan perorangan SOLAS.' },
    ],
    maritimeContext: 'Perangkat keselamatan jiwa di laut wajib SOLAS Bab III LSA Code.',
  },
  'm2-v-19': {
    summary: 'Fungsi material ganjal muatan kapal (Dunnage).',
    whyCorrect: 'Dunnage (kayu/bantalan alas) digunakan untuk melindungi muatan dari kelembaban lantai palka, kondensasi keringat kapal, dan kerusakan akibat gesekan.',
    distractors: [
      { option: 'To pump seawater ballast between double bottom tanks', reason: 'Salah karena itu sistem perpipaan ballast.' },
      { option: 'To measure ship speed through the water', reason: 'Salah karena itu fungsi Speed Log.' },
      { option: 'To clean boiler exhaust gas economizer tubes', reason: 'Salah perawatan mesin ketel uap.' },
    ],
    maritimeContext: 'Penataan dan pengamanan muatan palka kapal niaga (Cargo Stowage).',
  },
  'm2-v-20': {
    summary: 'Istilah dinding sekat baja kedap air kompartemen kapal (Bulkhead).',
    whyCorrect: 'Bulkhead adalah dinding sekat baja vertikal kedap air yang membagi lambung kapal menjadi beberapa ruang/kompartemen terpisah.',
    distractors: [
      { option: 'Keel', reason: 'Salah karena Keel adalah lunas kapal di bagian dasar terendah lambung.' },
      { option: 'Gunwale', reason: 'Salah karena Gunwale adalah bibir atas lambung kapal.' },
      { option: 'Bilge well', reason: 'Salah karena Bilge Well adalah sumuran got penampung air bilga.' },
    ],
    maritimeContext: 'Konstruksi stabilitas dan pembagian kompartemen kedap air kapal SOLAS.',
  },
  'm2-v-21': {
    summary: 'Definisi sarat benaman air kapal (Draft / Draught).',
    whyCorrect: 'Draft adalah kedalaman vertikal benaman air yang dibutuhkan untuk mengapungkan kapal, diukur dari garis air ke dasar lunas terbawah.',
    distractors: [
      { option: 'The speed of surface current moving past the hull', reason: 'Salah karena itu kecepatan arus laut.' },
      { option: 'The height of the navigation mast above the sea level', reason: 'Salah karena itu adalah tinggi tiang navigasi (Air Draft).' },
      { option: 'The gross volumetric tonnage of dry cargo holds', reason: 'Salah karena itu volume tonase muat palka.' },
    ],
    maritimeContext: 'Pengamatan tanda sarat (Draft Marks) kapal sebelum melewati alur pelayaran sempit/dangkal.',
  },
  'm2-v-22': {
    summary: 'Fungsi lubang pemandu tali tambat geladak (Fairlead).',
    whyCorrect: 'Fairlead adalah perangkat pemandu tali tambat di geladak untuk mengarahkan tali dan mencegah keausan akibat gesekan dengan plat lambung kapal.',
    distractors: [
      { option: 'To measure exhaust gas temperature in engine cylinders', reason: 'Salah karena itu termometer gas buang mesin.' },
      { option: 'To hoist pilot luggage from the pilot boat', reason: 'Salah derek barang pandu.' },
      { option: 'To secure container doors during sea passage', reason: 'Salah kunci pintu peti kemas.' },
    ],
    maritimeContext: 'Peralatan stasiun tambat di geladak haluan dan buritan kapal.',
  },
  'm2-v-23': {
    summary: 'Peralatan pernapasan udara bertekanan pemadam kebakaran (SCBA).',
    whyCorrect: 'SCBA (Self-Contained Breathing Apparatus) menyediakan udara bersih bertekanan bagi petugas pemadam untuk memasuki ruangan berasap tebal.',
    distractors: [
      { option: 'International Shore Connection', reason: 'Salah karena itu sambungan pipa hidran darat standar internasional.' },
      { option: 'CO2 fire extinguishing nozzle', reason: 'Salah nozel gas pemadam CO2.' },
      { option: 'AFFF mechanical foam generator', reason: 'Salah penghasil busa pemadam minyak.' },
    ],
    maritimeContext: 'Perlengkapan pakaian wajib tim pemadam kebakaran kapal (Fireman Outfit SOLAS).',
  },
  'm2-v-24': {
    summary: 'Fungsi pemancar suar marabahaya satelit (EPIRB).',
    whyCorrect: 'EPIRB berfungsi memancarkan sinyal marabahaya dan koordinat GPS kapal secara otomatis ke satelit pencari dan penyelamat (SAR) saat kapal tenggelam.',
    distractors: [
      { option: 'To communicate with port pilots over short-range VHF', reason: 'Salah karena itu fungsi radio VHF maritim.' },
      { option: 'To steer the ship automatically along a planned track', reason: 'Salah karena itu fungsi sistem Autopilot anjungan.' },
      { option: 'To measure wave height and sea surface temperature', reason: 'Salah sensor meteorologi.' },
    ],
    maritimeContext: 'Perangkat keselamatan pemancar marabahaya sistem GMDSS.',
  },
  'm2-v-25': {
    summary: 'Definisi tonggak penambat tali dermaga/kapal (Bollard).',
    whyCorrect: 'Bollard (bolder) adalah tiang tegak baja kokoh di dermaga atau geladak yang digunakan untuk mengikat tali kawat dan tali tambat kapal.',
    distractors: [
      { option: 'A drainage opening on the main deck to discharge water', reason: 'Salah karena itu lubang pembuangan air geladak (Scupper).' },
      { option: 'A navigational light indicating a restricted channel', reason: 'Salah rambu suar navigasi alur.' },
      { option: 'A valve used to flood ballast double bottom tanks', reason: 'Salah keran pipa ballast.' },
    ],
    maritimeContext: 'Fasilitas penambatan kapal di dermaga pelabuhan.',
  },
  'm2-v-26': {
    summary: 'Fungsi unit pelepas hidrostatis rakit penolong (Hydrostatic Release Unit / HRU).',
    whyCorrect: 'HRU berfungsi melepaskan rakit penolong (liferaft) secara otomatis jika kapal tenggelam hingga kedalaman 1,5 sampai 4 meter oleh tekanan air.',
    distractors: [
      { option: 'To inflate the liferaft canopy during rainy weather', reason: 'Salah bukan pengembang tenda pelindung.' },
      { option: 'To signal passing vessels using laser distress light', reason: 'Salah bukan lampu sinyal darurat.' },
      { option: 'To pump fresh water into liferaft emergency survival rations', reason: 'Salah bukan pompa air tawar darurat.' },
    ],
    maritimeContext: 'Mekanisme pelepasan otomatis alat keselamatan jiwa SOLAS LSA Code.',
  },
  'm2-v-27': {
    summary: 'Alat pengunci sudut peti kemas kontainer (Twistlock).',
    whyCorrect: 'Twistlock adalah alat pengunci mekanis standar yang mengunci sudut-sudut peti kemas (corner casting) agar susunan kontainer tidak goyah di laut.',
    distractors: [
      { option: 'A specialized padlock used on the captain safe', reason: 'Salah gembok brankas nakhoda.' },
      { option: 'A steering wheel locking mechanism on the bridge', reason: 'Salah pengunci roda kemudi.' },
      { option: 'A valve handle used to lock bunker pipelines', reason: 'Salah kunci keran bunker.' },
    ],
    maritimeContext: 'Sistem pengikatan kargo kontainer kapal peti kemas (Container Lashing System).',
  },
  'm2-v-28': {
    summary: 'Kepanjangan dokumen rencana tanggap pencemaran minyak kapal (SOPEP).',
    whyCorrect: 'SOPEP adalah singkatan resmi dari "Shipboard Oil Pollution Emergency Plan" (Rencana Darurat Penanggulangan Pencemaran Minyak di Kapal).',
    distractors: [
      { option: 'Standard Operation Procedure for Engine Protection', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Safety Observation Program for Environmental Protection', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Seafarer Ocean Passenger Evacuation Protocol', reason: 'Salah kepanjangan fiktif.' },
    ],
    maritimeContext: 'Dokumen wajib pencegahan pencemaran laut MARPOL 73/78 Annex I.',
  },
  'm2-v-29': {
    summary: 'Fungsi pemisah minyak dan air got kamar mesin (Oily Water Separator / OWS).',
    whyCorrect: 'OWS berfungsi memisahkan minyak dari air bilga/got kamar mesin agar buangan air ke laut memiliki kadar minyak di bawah 15 ppm.',
    distractors: [
      { option: 'To purify heavy fuel oil before injection into main engine cylinders', reason: 'Salah karena itu fungsi Purifier bahan bakar.' },
      { option: 'To generate steam from boiler feedwater', reason: 'Salah karena itu fungsi Boiler ketel uap.' },
      { option: 'To distill seawater into potable drinking water', reason: 'Salah karena itu fungsi Evaporator air tawar.' },
    ],
    maritimeContext: 'Peralatan pencegahan pencemaran minyak kamar mesin MARPOL Annex I.',
  },
  'm2-v-30': {
    summary: 'Definisi tangga akomodasi akses keluar/masuk kapal (Gangway).',
    whyCorrect: 'Gangway adalah jembatan atau tangga akomodasi yang digunakan penumpang dan awak kapal untuk naik ke kapal atau turun ke dermaga.',
    distractors: [
      { option: 'The corridor between the galley and the messroom', reason: 'Salah karena itu lorong akomodasi kapal.' },
      { option: 'The narrow platform on top of container stacks', reason: 'Salah platform lashing kontainer.' },
      { option: 'The catwalk inside the propeller shaft tunnel', reason: 'Salah jembatan lorong as baling-baling.' },
    ],
    maritimeContext: 'Akses titik kontrol keselamatan dan keamanan ISPS Code di dermaga.',
  },

  // Time, Numbers & Calculations (31-40)
  'm2-t-31': {
    summary: 'Standar pengucapan koordinat Bujur (Longitude 103° 50\' E) menurut IMO SMCP.',
    whyCorrect: 'Sesuai aturan IMO SMCP, setiap digit angka koordinat diucapkan secara individual dan terpisah: "Longitude one zero three degrees five zero minutes East".',
    distractors: [
      { option: 'Longitude one hundred three degrees fifty East', reason: 'Salah karena tidak boleh dikelompokkan menjadi ratusan atau puluhan.' },
      { option: 'Longitude thirteen fifty East', reason: 'Salah pemotongan angka.' },
      { option: 'Longitude one zero thirty five zero East', reason: 'Salah penyebutan angka campuran.' },
    ],
    ruleOrFormula: 'IMO SMCP: Spell numbers digit-by-digit: 1-0-3 degrees 5-0 minutes East.',
    maritimeContext: 'Pelaporan posisi navigasi kapal pada komunikasi radio VHF maritim.',
  },
  'm2-t-32': {
    summary: 'Perhitungan selisih sarat (Trim) kapal (Sarat Depan 7.80 m, Sarat Belakang 8.40 m).',
    whyCorrect: 'Trim = Sarat Belakang (8.40 m) - Sarat Depan (7.80 m) = 0.60 m. Karena sarat buritan lebih dalam, kondisi kapal adalah Trim by the Stern 0.60 meter.',
    distractors: [
      { option: 'Trim by the head of 0.60 meters', reason: 'Salah karena Trim by the Head terjadi bila sarat haluan (depan) lebih besar dari buritan.' },
      { option: 'Even keel condition', reason: 'Salah karena Even Keel adalah kondisi sarat depan dan belakang sama persis.' },
      { option: 'Trim by the stern of 1.20 meters', reason: 'Salah hitung selisih angka.' },
    ],
    ruleOrFormula: 'Trim = Aft Draft - Forward Draft = 8.40 - 7.80 = 0.60 m (Stern).',
    maritimeContext: 'Perhitungan stabilitas muatan dan efisiensi olah gerak kapal.',
  },
  'm2-t-33': {
    summary: 'Perhitungan Estimasi Waktu Tiba / ETA (Berangkat Senin 14:30 + 36 Jam).',
    whyCorrect: 'Senin 14:30 + 24 jam = Selasa 14:30. Sisa 12 jam: Selasa 14:30 + 12 jam = Rabu 02:30 UTC.',
    distractors: [
      { option: '1430 UTC on Tuesday', reason: 'Salah karena itu baru 24 jam pelayaran.' },
      { option: '0800 UTC on Wednesday', reason: 'Salah hitung penjumlahan waktu.' },
      { option: '2230 UTC on Tuesday', reason: 'Salah karena itu baru 32 jam pelayaran.' },
    ],
    ruleOrFormula: 'Senin 14:30 + 36 Jam = Rabu 02:30 UTC.',
    maritimeContext: 'Perhitungan Estimated Time of Arrival (ETA) pada laporan Passage Plan kapal.',
  },
  'm2-t-34': {
    summary: 'Pengucapan kecepatan kapal 14.5 knot menurut standar radio IMO SMCP.',
    whyCorrect: 'Angka desimal kecepatan dibaca digit per digit secara tegas: "One four point five knots".',
    distractors: [
      { option: 'Fourteen and a half knots', reason: 'Salah karena format non-standar yang berisiko memicu salah dengar di radio.' },
      { option: 'One hundred forty five knots', reason: 'Salah nilai angka.' },
      { option: 'Forty five knots', reason: 'Salah menghilangkan digit pertama.' },
    ],
    ruleOrFormula: 'IMO SMCP: Pronounce digits separately: 1-4 point 5 knots.',
    maritimeContext: 'Pelaporan kecepatan kapal kepada stasiun Vessel Traffic Service (VTS).',
  },
  'm2-t-35': {
    summary: 'Perhitungan total berat logistik makanan (450 kg + 320 kg + 180 kg).',
    whyCorrect: '450 kg daging + 320 kg sayur + 180 kg beras = 950 kg total berat perbekalan.',
    distractors: [
      { option: '920 kilograms', reason: 'Salah hitung penjumlahan.' },
      { option: '880 kilograms', reason: 'Salah hitung penjumlahan.' },
      { option: '1,000 kilograms', reason: 'Salah hitung penjumlahan.' },
    ],
    ruleOrFormula: 'Total = 450 + 320 + 180 = 950 kg.',
    maritimeContext: 'Penerimaan dan pencatatan inventaris logistik permakanan kapal (Provisions Receipt).',
  },
  'm2-t-36': {
    summary: 'Konversi sudut baringan radar 045° Sejati ke arah kuadran kompas.',
    whyCorrect: 'Baringan 045° Sejati berada tepat di arah kuadran Timur Laut (Northeast / NE).',
    distractors: [
      { option: 'Northwest (315° True)', reason: 'Salah karena Barat Laut adalah 315°.' },
      { option: 'Southeast (135° True)', reason: 'Salah karena Tenggara adalah 135°.' },
      { option: 'Southwest (225° True)', reason: 'Salah karena Barat Daya adalah 225°.' },
    ],
    ruleOrFormula: '045° = Northeast (NE), 135° = Southeast (SE), 225° = Southwest (SW), 315° = Northwest (NW).',
    maritimeContext: 'Plotting posisi target radar ARPA untuk menghindari tubrukan di laut (COLREGs 1972).',
  },
  'm2-t-37': {
    summary: 'Perhitungan sisa kapasitas tangki bunker (1.200 ton - 850 ton).',
    whyCorrect: 'Kapasitas maksimal 1.200 metrik ton dikurangi isi saat ini 850 metrik ton = 350 metrik ton yang masih dapat dimuat.',
    distractors: [
      { option: '450 metric tonnes', reason: 'Salah hitung pengurangan.' },
      { option: '300 metric tonnes', reason: 'Salah hitung pengurangan.' },
      { option: '500 metric tonnes', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Sisa Muat = 1.200 - 850 = 350 Metric Tonnes.',
    maritimeContext: 'Perhitungan ruang muat tangki bunker bahan bakar (Ullage Calculation).',
  },
  'm2-t-38': {
    summary: 'Arah mata angin utama untuk haluan kompas 270 derajat.',
    whyCorrect: 'Derajat kompas 270° tepat menunjuk ke arah mata angin Barat (West).',
    distractors: [
      { option: 'East', reason: 'Salah karena arah Timur adalah 090°.' },
      { option: 'North', reason: 'Salah karena arah Utara adalah 000° / 360°.' },
      { option: 'South', reason: 'Salah karena arah Selatan adalah 180°.' },
    ],
    ruleOrFormula: '000° = North, 090° = East, 180° = South, 270° = West.',
    maritimeContext: 'Perintah kemudi juru mudi anjungan (Helmsman Steering Orders).',
  },
  'm2-t-39': {
    summary: 'Kalkulasi jarak tempuh navigasi: Kecepatan 15 knot selama 4 jam.',
    whyCorrect: 'Jarak = Kecepatan (15 knot) × Waktu (4 jam) = 60 Mil Laut (Nautical Miles).',
    distractors: [
      { option: '45 nautical miles', reason: 'Salah karena 15 x 3 = 45.' },
      { option: '50 nautical miles', reason: 'Salah hitung perkalian.' },
      { option: '75 nautical miles', reason: 'Salah karena 15 x 5 = 75.' },
    ],
    ruleOrFormula: 'Distance (NM) = Speed (Knots) × Time (Hours) = 15 × 4 = 60 NM.',
    maritimeContext: 'Perhitungan jarak rencana rute pelayaran kapal (Passage Planning).',
  },
  'm2-t-40': {
    summary: 'Perhitungan ruang bebas di bawah lunas / UKC (Kedalaman 12.5 m - Sarat 9.0 m).',
    whyCorrect: 'UKC = Kedalaman air (12.5 m) - Sarat kapal (9.0 m) = 3.5 meter jarak aman di bawah lunas kapal.',
    distractors: [
      { option: '4.0 meters', reason: 'Salah hitung pengurangan.' },
      { option: '21.5 meters', reason: 'Salah karena menjumlahkan bukan mengurangkan.' },
      { option: '2.5 meters', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'UKC = Water Depth - Vessel Draft = 12.5 - 9.0 = 3.5 Meters.',
    maritimeContext: 'Jaminan batas aman dasar laut saat kapal bernavigasi di alur dangkal (Under-Keel Clearance Policy).',
  },

  // Reading Comprehension & Notices (41-50)
  'm2-r-41': {
    summary: 'Identifikasi bahaya navigasi dari pesan peringatan NAVTEX.',
    whyCorrect: 'Pesan NAVTEX secara eksplisit memperingatkan adanya kontainer hanyut tanpa penerangan (drifting unlit container) yang dapat memicu bahaya tubrukan.',
    distractors: [
      { option: 'A sunken fishing vessel blocking the deep water route', reason: 'Salah tidak sesuai teks NAVTEX.' },
      { option: 'A tropical revolving storm with hurricane force winds', reason: 'Salah tidak ada peringatan badai topan.' },
      { option: 'An uncharted sandbank near the coastal fairway', reason: 'Salah tidak ada laporan dangkal pasir.' },
    ],
    maritimeContext: 'Penerimaan berita navigasi keselamatan pelayaran melalui receiver NAVTEX.',
  },
  'm2-r-42': {
    summary: 'Frekuensi wajib pembaruan uji atmosfer gas pada pekerjaan panas (Hot Work).',
    whyCorrect: 'Pemberitahuan keselamatan secara jelas menyebutkan bahwa sertifikat uji gas harus diperiksa ulang setiap 4 jam sekali (every 4 hours).',
    distractors: [
      { option: 'Every 8 hours', reason: 'Salah durasi waktu.' },
      { option: 'Every 12 hours', reason: 'Salah durasi waktu.' },
      { option: 'Only once at the start of shift', reason: 'Salah karena kondisi atmosfer gas dapat berubah sewaktu-waktu.' },
    ],
    maritimeContext: 'Prosedur keselamatan izin kerja panas (Hot Work Permit) di atas kapal tangki dan kargo.',
  },
  'm2-r-43': {
    summary: 'Tujuan penyumbatan lubang geladak (Scupper Plugs) saat pengisian bahan bakar.',
    whyCorrect: 'Menyumbat scupper bertujuan menahan minyak di atas geladak dan mencegah tumpahan minyak tumpah ke laut jika terjadi kebocoran bahan bakar.',
    distractors: [
      { option: 'To retain rainwater on deck during fueling', reason: 'Salah bukan tujuan penahanan air hujan.' },
      { option: 'To increase deck stability while taking fuel', reason: 'Salah tidak memengaruhi stabilitas kapal.' },
      { option: 'To allow air to escape from fuel storage tanks', reason: 'Salah karena udara keluar lewat pipa ventilasi tangki (air vent).' },
    ],
    maritimeContext: 'Daftar periksa keselamatan pengisian bahan bakar kapal (Bunkering Safety Checklist MARPOL).',
  },
  'm2-r-44': {
    summary: 'Regulasi MARPOL Annex V terkait larangan pembuangan sampah plastik.',
    whyCorrect: 'MARPOL Annex V secara mutlak melarang pembuangan segala bentuk sampah plastik ke laut di seluruh perairan dunia tanpa pengecualian kapan pun.',
    distractors: [
      { option: 'Plastic waste may be discharged more than 12 nautical miles from land', reason: 'Salah karena plastik DILARANG TOTAL di jarak berapa pun.' },
      { option: 'Only shredded food-contaminated plastics may be thrown overboard', reason: 'Salah tetap dilarang.' },
      { option: 'Plastics can be dumped in designated international offshore dumping grounds', reason: 'Salah tidak ada area buang plastik di laut.' },
    ],
    maritimeContext: 'Manajemen pengelolaan sampah kapal MARPOL Annex V Garbage Record Book.',
  },
  'm2-r-45': {
    summary: 'Batas jarak tampak (Visibility) wajib lapor Nakhoda pada Standing Order.',
    whyCorrect: 'Instruksi tetap anjungan mewajibkan Perwira Jaga memanggil Nakhoda setiap kali jarak tampak turun di bawah 2 mil laut (< 2 NM).',
    distractors: [
      { option: 'Only when visibility reaches zero in dense fog', reason: 'Salah karena harus melapor sebelum jarak tampak menjadi nol.' },
      { option: 'When visibility is between 5 and 8 nautical miles', reason: 'Salah karena jarak tampak tersebut masih aman.' },
      { option: 'Only during daylight hours with light rain', reason: 'Salah pembatasan waktu.' },
    ],
    maritimeContext: 'Perintah tetap Nakhoda (Master Standing Orders) pada dinas jaga navigasi saat cuaca buruk.',
  },
  'm2-r-46': {
    summary: 'Tujuan utama pekerjaan pemeliharaan kapal di dok kering (Dry Docking).',
    whyCorrect: 'Tujuan pengedokan adalah memeriksa dan memperbaiki bagian bawah air kapal, pelat lambung dasar, bantalan poros baling-baling, dan katup laut.',
    distractors: [
      { option: 'To load high-density steel coil cargo into cargo holds', reason: 'Salah karena dok kering bukan tempat pemuatan kargo.' },
      { option: 'To conduct international crew change and certificate renewal', reason: 'Salah bukan tujuan teknis pengedokan.' },
      { option: 'To discharge dirty oily bilge water to shore reception facility', reason: 'Salah bukan tujuan utama dok.' },
    ],
    maritimeContext: 'Survei berkala pemeliharaan kondisi lambung bawah air kapal oleh Badan Klasifikasi.',
  },
  'm2-r-47': {
    summary: 'Lokasi penataan kontainer cairan mudah terbakar (UN 1993) menurut IMDG Code.',
    whyCorrect: 'Muatan berbahaya UN 1993 wajib ditempatkan di geladak cuaca terbuka (on weather deck only) serta jauh dari akomodasi awak dan sumber panas.',
    distractors: [
      { option: 'Inside lower cargo hold number 1 beneath the waterline', reason: 'Salah karena berisiko akumulasi uap gas di palka bawah air.' },
      { option: 'Inside the paint locker adjacent to the engine casing', reason: 'Salah sangat berbahaya dekat kamar mesin.' },
      { option: 'In the steering gear compartment', reason: 'Salah bukan ruang muatan.' },
    ],
    maritimeContext: 'Penataan muatan barang berbahaya kode maritim internasional IMDG Code.',
  },
  'm2-r-48': {
    summary: 'Kriteria kapal wajib menggunakan 2 kapal tunda menurut Otoritas Pelabuhan.',
    whyCorrect: 'Kapal yang keluar pelabuhan dengan panjang lebih dari 150 meter (LOA > 150 m) saat arus surut (ebb tide) wajib menggunakan dua kapal tunda.',
    distractors: [
      { option: 'All inbound fishing vessels under 50 meters', reason: 'Salah tidak sesuai kriteria teks.' },
      { option: 'Only oil tankers carrying dirty ballast water', reason: 'Salah bukan ketentuan jenis kargo.' },
      { option: 'Vessels anchoring in the outer quarantine zone', reason: 'Salah tidak terkait area karantina.' },
    ],
    maritimeContext: 'Regulasi pemanduan dan bantuan kapal tunda otoritas pelabuhan (Port Authority Regulations).',
  },
  'm2-r-49': {
    summary: 'Frekuensi pencatatan suhu kontainer berpendingin (Reefer Containers).',
    whyCorrect: 'SOP perawatan muatan menginstruksikan suhu peti kemas pendingin di Palka No. 3 wajib dicatat dalam buku log setiap 2 jam sekali (every 2 hours).',
    distractors: [
      { option: 'Every 4 hours', reason: 'Salah interval waktu.' },
      { option: 'Once per 24 hours', reason: 'Salah terlalu lama berisiko muatan rusak.' },
      { option: 'Every 30 minutes', reason: 'Salah interval waktu.' },
    ],
    maritimeContext: 'Pemantauan temperatur muatan berpendingin oleh Electrician dan Mualim Jaga.',
  },
  'm2-r-50': {
    summary: 'Tujuan pelaporan kejadian hampir celaka (Near-Miss Reporting) ISM Code.',
    whyCorrect: 'Pelaporan near-miss bertujuan mendeteksi dan menghilangkan potensi bahaya operasional sebelum berkembang menjadi kecelakaan nyata.',
    distractors: [
      { option: 'To punish seafarers who make operational mistakes', reason: 'Salah karena sistem bersifat non-punitive (tanpa sanksi hukuman).' },
      { option: 'To calculate overtime pay for deck ratings', reason: 'Salah bukan fungsi upah lembur.' },
      { option: 'To reduce port harbor dues', reason: 'Salah tidak terkait biaya pelabuhan.' },
    ],
    maritimeContext: 'Budaya keselamatan kerja maritim Sistem Manajemen Keselamatan (ISM Code).',
  },

  // Listening & IMO SMCP (51-60)
  'm2-l-51': {
    summary: 'Instruksi lokasi labuh jangkar dari Port Control.',
    whyCorrect: 'Radio Port Control menginstruksikan MV Ocean Pride untuk berlabuh di Area Charlie, arah Selatan (180°) sejauh 2 mil laut dari mercusuar.',
    distractors: [
      { option: 'Anchorage Alpha, 1 nautical mile North of the Lighthouse', reason: 'Salah nama area dan arah koordinat.' },
      { option: 'Alongside container berth number 4', reason: 'Salah karena diperintahkan berlabuh jangkar bukan sandar.' },
      { option: 'Outside port limits, 5 miles West of the fairway', reason: 'Salah posisi.' },
    ],
    maritimeContext: 'Komunikasi radio alokasi area labuh jangkar kapal dari otoritas pelabuhan.',
  },
  'm2-l-52': {
    summary: 'Ketinggian pemasangan tangga pandu (Pilot Ladder) di atas permukaan air.',
    whyCorrect: 'Instruksi pandu meminta tangga dipasang di lambung kanan (starboard) dengan tinggi 1,5 meter di atas permukaan laut pada laju 6 knot.',
    distractors: [
      { option: '3.0 meters above the water level on port side', reason: 'Salah ketinggian dan posisi lambung.' },
      { option: '2.5 meters above the main deck level', reason: 'Salah acuan pengukuran.' },
      { option: '1.0 meter above the keel line', reason: 'Salah acuan garis lunas.' },
    ],
    maritimeContext: 'Pemasangan tangga pandu sesuai regulasi keselamatan IMO Pilot Ladder Arrangement.',
  },
  'm2-l-53': {
    summary: 'Status kapal pada siaran berita urgensi maritim "PAN PAN".',
    whyCorrect: 'Panggilan PAN PAN menyatakan MV Pacific Trader mengalami mati mesin induk (blackout), sedang hanyut, dan meminta bantuan kapal tunda.',
    distractors: [
      { option: 'Vessel is sinking and crew is abandoning ship into liferafts', reason: 'Salah karena itu adalah situasi MAYDAY (Distress).' },
      { option: 'Vessel has run aground on a charted sandbank', reason: 'Salah kapal tidak kandas.' },
      { option: 'Vessel is requesting medical helicopter evacuation for injured crew', reason: 'Salah bukan evakuasi medis (MEDEVAC).' },
    ],
    maritimeContext: 'Pancaran berita urgensi keselamatan pelayaran GMDSS PAN PAN.',
  },
  'm2-l-54': {
    summary: 'Penanda pesan IMO SMCP resmi untuk peringatan bahaya navigasi.',
    whyCorrect: 'Sesuai standar IMO SMCP, pesan peringatan bahaya navigasi wajib diawali dengan penanda pesan (Message Marker) "WARNING".',
    distractors: [
      { option: 'QUESTION', reason: 'Salah karena QUESTION digunakan untuk meminta informasi/pertanyaan.' },
      { option: 'INSTRUCTION', reason: 'Salah karena INSTRUCTION digunakan untuk perintah resmi regulasi.' },
      { option: 'INTENTION', reason: 'Salah karena INTENTION digunakan untuk mengumumkan rencana tindakan navigasi sendiri.' },
    ],
    ruleOrFormula: 'IMO SMCP Message Marker: "WARNING" = Bahaya navigasi / rintangan.',
    maritimeContext: 'Standar fraseologi komunikasi radio maritim internasional IMO SMCP.',
  },
  'm2-l-55': {
    summary: 'Urutan pengiriman tali tambat haluan kapal saat olah gerak sandar.',
    whyCorrect: 'Perintah anjungan menginstruksikan stasiun haluan untuk mengirimkan tali tros depan (headline) dan tali spring depan (forward spring) terlebih dahulu.',
    distractors: [
      { option: 'The stern line and aft spring', reason: 'Salah karena itu tali stasiun buritan.' },
      { option: 'The port quarter wire rope', reason: 'Salah tali kawat lambung kiri buritan.' },
      { option: 'The starboard anchor chain', reason: 'Salah bukan rantai jangkar.' },
    ],
    maritimeContext: 'Komunikasi internal perintah penambatan haluan kapal di dermaga.',
  },
  'm2-l-56': {
    summary: 'Lokasi detektor alarm kebakaran kamar mesin yang aktif.',
    whyCorrect: 'Masinis jaga melaporkan alarm kebakaran aktif di Mesin Bantu Genset Nomor 2 (Auxiliary Engine Number 2) di kamar mesin.',
    distractors: [
      { option: 'Emergency generator room on boat deck', reason: 'Salah bukan genset darurat di geladak sekoci.' },
      { option: 'Main engine turbocharger casing', reason: 'Salah bukan turbocharger mesin induk.' },
      { option: 'Paint locker on forecastle deck', reason: 'Salah bukan gudang cat di haluan.' },
    ],
    maritimeContext: 'Pelaporan alarm darurat kamar mesin kepada Perwira Jaga di anjungan.',
  },
  'm2-l-57': {
    summary: 'Informasi lalu lintas olah gerak kapal di depan dari VTS.',
    whyCorrect: 'Pesan VTS menginformasikan kapal di depan (tanker Atlantic Voyager) berkecepatan 8 knot dan sedang mengubah haluan ke kanan (starboard).',
    distractors: [
      { option: 'Stopping engines and dropping anchor', reason: 'Salah tidak sedang lego jangkar.' },
      { option: 'Increasing speed to 18 knots and turning to port', reason: 'Salah nilai kecepatan dan arah belok.' },
      { option: 'Calling emergency distress on VHF channel 16', reason: 'Salah tidak ada panggilan darurat.' },
    ],
    maritimeContext: 'Pertukaran informasi pemandu lalu lintas kapal Vessel Traffic Service (VTS).',
  },
  'm2-l-58': {
    summary: 'Posisi pengikatan tali kapal tunda (Tugboat) saat olah gerak.',
    whyCorrect: 'Nahkoda menginstruksikan kapal tunda Tug Champion untuk mengikat tali di haluan kiri (port bow) dan menarik dengan setengah tenaga.',
    distractors: [
      { option: 'On the starboard quarter with ship line', reason: 'Salah posisi lambung kanan buritan.' },
      { option: 'Pushing directly against the center stern', reason: 'Salah dorong tengah buritan.' },
      { option: 'Stand by 1 mile astern without connecting lines', reason: 'Salah posisi jauh di belakang.' },
    ],
    maritimeContext: 'Komunikasi olah gerak bantuan kapal tunda saat sandar kapal.',
  },
  'm2-l-59': {
    summary: 'Pelaksanaan dan konfirmasi perintah cikar kemudi (Hard-a-starboard).',
    whyCorrect: 'Juru mudi mengonfirmasi telah memutar roda kemudi cikar kanan penuh hingga daun kemudi mencapai sudut 35 derajat ke kanan.',
    distractors: [
      { option: 'Centered the rudder to midships', reason: 'Salah karena itu perintah "Midships" (kemudi tengah-tengah).' },
      { option: 'Turned the wheel hard to port side', reason: 'Salah karena itu cikar kiri (Hard-a-port).' },
      { option: 'Stopped the steering pump motor', reason: 'Salah tidak mematikan pompa kemudi.' },
    ],
    ruleOrFormula: 'Helm Order: "Hard-a-starboard" = Kemudi cikar kanan penuh (35°).',
    maritimeContext: 'Perintah kemudi standar IMO SMCP saat olah gerak kapal di alur pelayaran.',
  },
  'm2-l-60': {
    summary: 'Arti evaluasi kualitas sinyal suara radio "Readability 5".',
    whyCorrect: '"Readability 5" adalah skala tertinggi penerimaan radio VHF maritim yang berarti suara terdengar sangat jelas dan jernih tanpa gangguan (Loud and clear 5/5).',
    distractors: [
      { option: 'Very weak and distorted, unreadable', reason: 'Salah karena itu adalah Readability 1.' },
      { option: 'Intermittent signal with background static noise', reason: 'Salah karena itu Readability 2 atau 3.' },
      { option: 'Radio transmitter power is completely broken', reason: 'Salah pemancar berfungsi sempurna.' },
    ],
    ruleOrFormula: 'Radio Readability Scale: 1 = Unreadable, 3 = Readable with difficulty, 5 = Loud and clear.',
    maritimeContext: 'Uji komunikasi pancaran radio VHF maritim antara kapal dan stasiun pelabuhan.',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 3 (All 60 Questions)
const TEST_3_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm3-g-01': {
    summary: 'First Conditional: If + Simple Present (decreases), Subject + Modal (must call).',
    whyCorrect: 'Klausa syarat "If" untuk peristiwa nyata masa kini menggunakan bentuk kata kerja Simple Present orang ketiga tunggal ("decreases").',
    distractors: [
      { option: 'will decrease', reason: 'Salah karena klausa bersyarat "If" tidak boleh menggunakan auxiliary "will".' },
      { option: 'decreased', reason: 'Salah karena induk kalimat menggunakan present modal "must".' },
      { option: 'would decrease', reason: 'Salah bentuk pengandaian tipe 2.' },
    ],
    ruleOrFormula: 'First Conditional: If + Present Simple, Subject + Modal + Verb 1.',
    maritimeContext: 'Perintah tetap Nakhoda (Standing Orders) saat jarak tampak menurun di laut.',
  },
  'm3-g-02': {
    summary: 'Inverted Third Conditional (Bentuk inversi tanpa "If"): Had + Subject + been + Verb 3.',
    whyCorrect: 'Bentuk pengandaian lampau bentuk pasif tanpa "If": "Had the auxiliary boiler been properly serviced...".',
    distractors: [
      { option: 'properly been', reason: 'Salah letak kata keterangan sebelum kata bantu "been".' },
      { option: 'being properly', reason: 'Salah karena past perfect pasif membutuhkan past participle "been", bukan gerund.' },
      { option: 'be properly', reason: 'Salah bentuk bare infinitive.' },
    ],
    ruleOrFormula: 'Inverted Third Conditional: Had + Subject + been + Adverb + Verb 3.',
    maritimeContext: 'Investigasi kegagalan tekanan ketel uap bantu akibat kelalaian pemeliharaan saat dok.',
  },
  'm3-g-03': {
    summary: 'Konjungsi waktu "until" (sampai/hingga) untuk menyatakan syarat sebelum izin keluar diberikan.',
    whyCorrect: '"until" menyatakan batas waktu bahwa kapal dilarang berangkat sampai seluruh temuan kekurangan PSC telah diperbaiki secara tuntas.',
    distractors: [
      { option: 'during', reason: 'Salah karena "during" adalah preposisi yang diikuti frasa benda, bukan klausa utuh.' },
      { option: 'while', reason: 'Salah makna (sementara).' },
      { option: 'since', reason: 'Salah makna karena "since" menyatakan titik awal masa lalu atau alasan.' },
    ],
    ruleOrFormula: 'Time Conjunction: Negative Clause + until + Condition Clause.',
    maritimeContext: 'Pencabutan penahanan kapal (Detention) oleh Port State Control (PSC).',
  },
  'm3-g-04': {
    summary: 'Susunan kalimat aturan navigasi kapal bertahan (Stand-on vessel) COLREG Aturan 17.',
    whyCorrect: 'Susunan baku aturan COLREG: Subject (The stand-on vessel) + Modal (shall) + Verb (maintain) + Object (her course and speed) + Prepositional Phrase (in a crossing situation).',
    distractors: [
      { option: 'In a crossing situation her course and speed shall maintain the stand-on vessel.', reason: 'Salah susunan sintaksis subjek dan predikat.' },
    ],
    ruleOrFormula: 'COLREG Rule 17: Stand-on vessel action.',
    maritimeContext: 'Kewajiban kapal bertahan untuk mempertahankan haluan dan kecepatan pada situasi bersilangan.',
  },
  'm3-g-05': {
    summary: 'Kombinasi konjungsi waktu "when" dan infinitive of purpose "to prevent".',
    whyCorrect: '"when" menyatakan titik waktu dimulainya hujan lebat, dan "to prevent" menyatakan tujuan penghentian bongkar muat.',
    distractors: [
      { option: 'after, for', reason: 'Salah karena "for" tidak diikuti kata kerja dasar (prevent).' },
      { option: 'since, with', reason: 'Salah struktur pembentukan kalimat tujuan.' },
      { option: 'while, so', reason: 'Salah pasangan kata penghubung.' },
    ],
    ruleOrFormula: 'Conjunction + Infinitive of Purpose: "when + event" & "to + Verb 1".',
    maritimeContext: 'Tindakan Mualim I menghentikan muat gandum curah saat hujan untuk mencegah muatan rusak basah.',
  },
  'm3-g-06': {
    summary: 'Reported speech: pergeseran "will clear" menjadi "would clear".',
    whyCorrect: 'Karena induk kalimat berbentuk lampau ("confirmed that..."), kata kerja masa depan bergeser (backshift) menjadi "would clear".',
    distractors: [
      { option: 'will clear', reason: 'Salah tenses present future setelah induk lampau (confirmed).' },
      { option: 'is clearing', reason: 'Salah present continuous.' },
      { option: 'clears', reason: 'Salah simple present.' },
    ],
    ruleOrFormula: 'Reported Speech: Past Reporting Verb + that + would + Verb 1.',
    maritimeContext: 'Konfirmasi perkiraan bebas alur sempit dari operator VTS pelabuhan.',
  },
  'm3-g-07': {
    summary: 'Past Continuous (was calibrating) untuk aktivitas yang sedang berlangsung saat disela peristiwa lampau.',
    whyCorrect: 'Masinis II sedang melakukan kalibrasi (was calibrating) ketika rpm mesin induk mendadak turun (dropped suddenly).',
    distractors: [
      { option: 'calibrated', reason: 'Salah karena menyatakan aksi selesai, bukan sedang berlangsung.' },
      { option: 'has calibrated', reason: 'Salah present perfect.' },
      { option: 'is calibrating', reason: 'Salah present continuous.' },
    ],
    ruleOrFormula: 'Past Continuous + when + Past Simple.',
    maritimeContext: 'Kalibrasi viskositas bahan bakar mesin induk di kamar mesin.',
  },
  'm3-g-08': {
    summary: 'Frasa preposisi baku regulasi maritim: "In accordance with".',
    whyCorrect: 'Frasa baku yang tepat untuk menyatakan kesesuaian dengan aturan internasional adalah "In accordance with".',
    distractors: [
      { option: 'to', reason: 'Salah pasangan preposisi baku.' },
      { option: 'for', reason: 'Salah penggunaan preposisi.' },
      { option: 'by', reason: 'Salah penggunaan preposisi.' },
    ],
    ruleOrFormula: 'Fixed Phrase: "In accordance with [Regulations]".',
    maritimeContext: 'Batas kandungan sulfur bahan bakar kapal global MARPOL Annex VI (maksimal 0,50% m/m).',
  },
  'm3-g-09': {
    summary: 'Preposisi perpindahan posisi asal: "moved from".',
    whyCorrect: 'Menyatakan perpindahan atau pergeseran dari lokasi semula menggunakan preposisi "from" (moved from its charted position).',
    distractors: [
      { option: 'at', reason: 'Salah penggunaan preposisi.' },
      { option: 'with', reason: 'Salah penggunaan preposisi.' },
      { option: 'by', reason: 'Salah penggunaan preposisi.' },
    ],
    ruleOrFormula: 'Preposition of Origin: "moved from [Original Position]".',
    maritimeContext: 'Peringatan navigasi hanyutnya pelampung suar alur pelayaran akibat ombak besar.',
  },
  'm3-g-10': {
    summary: 'Bentuk negatif to-infinitive pada reported advice: "advised not to touch".',
    whyCorrect: 'Nasihat larangan dibentuk dengan meletakkan "not" sebelum "to-infinitive": advised + not to + touch.',
    distractors: [
      { option: 'to not', reason: 'Bentuk split infinitive informal yang dihindari dalam bahasa Inggris standar.' },
      { option: 'do not', reason: 'Salah karena tidak bisa langsung mengikuti kata kerja pasif "was advised".' },
      { option: 'don\'t', reason: 'Salah struktur sintaksis.' },
    ],
    ruleOrFormula: 'Negative Infinitive: Verb + not to + Verb 1.',
    maritimeContext: 'Instruksi keselamatan bahaya tegangan tinggi saat uji coba generator paralel di kamar mesin.',
  },
  'm3-g-11': {
    summary: 'Aturan kedekatan (Proximity Rule) pada "Neither... nor...": "the radar" (tunggal) -> "was".',
    whyCorrect: 'Pada subjek gabungan "Neither... nor...", kata kerja mengikuti subjek terdekat ("the radar" = tunggal), sehingga menggunakan "was".',
    distractors: [
      { option: 'were', reason: 'Salah karena subjek terdekat "radar" adalah kata benda tunggal.' },
      { option: 'have been', reason: 'Salah tenses dan kesesuaian subjek.' },
      { option: 'are', reason: 'Salah tenses present.' },
    ],
    ruleOrFormula: 'Proximity Rule: Neither [A] nor [Singular Subject B] + Singular Verb (was).',
    maritimeContext: 'Laporan kerusakan radar dan ECDIS anjungan setelah tiang kapal tersambar petir.',
  },
  'm3-g-12': {
    summary: 'Future Perfect Tense: "will have drifted" sebelum batas waktu di masa depan.',
    whyCorrect: '"By the time + present clause (arrives)", klausa utama menyatakan aksi yang sudah selesai di masa depan menggunakan Future Perfect: will have + Verb 3 (will have drifted).',
    distractors: [
      { option: 'has drifted', reason: 'Salah tenses present perfect.' },
      { option: 'is drifting', reason: 'Salah present continuous.' },
      { option: 'will drift', reason: 'Salah simple future (tidak menyatakan penyelesaian sebelum titik waktu tertentu).' },
    ],
    ruleOrFormula: 'Future Perfect: By the time + Present Simple, Subject + will have + Verb 3.',
    maritimeContext: 'Perhitungan hanyutnya rakit penolong pada operasi pencarian dan penyelamatan SAR.',
  },
  'm3-g-13': {
    summary: 'Pola kata kerja permintaan/perintah: ask + someone + to-infinitive.',
    whyCorrect: 'Konstruksi baku kata kerja permintaan: asked + [the deck ratings] + to tighten (to-infinitive).',
    distractors: [
      { option: 'tightening', reason: 'Salah gerund.' },
      { option: 'tighten', reason: 'Salah bare infinitive.' },
      { option: 'tightened', reason: 'Salah past tense.' },
    ],
    ruleOrFormula: 'Verb Pattern: Ask + Object + to + Verb 1.',
    maritimeContext: 'Instruksi Bosun untuk mengencangkan tali lashing tutup palka sebelum matahari terbenam.',
  },
  'm3-g-14': {
    summary: 'Perfect Participle Clause (Active): "Having signed".',
    whyCorrect: '"Having signed" (Setelah menandatangani) menyatakan bahwa perwira keselamatan telah menyelesaikan penandatanganan surat izin sebelum mengizinkan tim masuk tangki.',
    distractors: [
      { option: 'signing', reason: 'Salah present participle.' },
      { option: 'sign', reason: 'Salah kata kerja dasar.' },
      { option: 'been signed', reason: 'Salah karena perwira keselamatan adalah pelaku aktif penandatanganan.' },
    ],
    ruleOrFormula: 'Perfect Participle: Having + Verb 3 (Active).',
    maritimeContext: 'Prosedur keselamatan izin resmi masuk tangki ballast kapal (Enclosed Space Entry Permit).',
  },
  'm3-g-15': {
    summary: 'Konjungsi akibat/konsekuensi logis: "so" (sehingga).',
    whyCorrect: '"so" menghubungkan kondisi sebab (jarak tampak terbatas) dengan tindakan akibat (isyarat kabut dibunyikan setiap 2 menit).',
    distractors: [
      { option: 'although', reason: 'Salah karena menyatakan pertentangan (meskipun).' },
      { option: 'because', reason: 'Salah penempatan letak klausa sebab-akibat.' },
      { option: 'unless', reason: 'Salah karena bermakna "kecuali jika".' },
    ],
    ruleOrFormula: 'Conjunction of Result: Cause + "," + so + Result.',
    maritimeContext: 'Pemberlakuan isyarat bunyi kabut interval 2 menit sesuai aturan navigasi COLREG Aturan 35.',
  },

  // Vocabulary & Advanced Equipment (16-30)
  'm3-v-16': {
    summary: 'COLREG Aturan 14: Tindakan dua kapal tenaga pada situasi berhadapan (Head-on).',
    whyCorrect: 'Kedua kapal wajib merubah haluannya ke kanan (starboard) sehingga masing-masing berpapasan pada lambung kirinya (port to port).',
    distractors: [
      { option: 'The larger vessel maintains course while the smaller vessel alters course to port', reason: 'Salah karena aturan COLREG tidak membedakan ukuran kapal dalam situasi berhadapan.' },
      { option: 'Both vessels immediately stop engines and sound five short blasts', reason: 'Salah bukan tindakan baku situasi berhadapan.' },
      { option: 'The vessel with the wind on her port side must give way to the other', reason: 'Salah karena itu aturan kapal layar (Rule 12).' },
    ],
    ruleOrFormula: 'COLREG Rule 14: Head-on Situation -> Both alter course to Starboard.',
    maritimeContext: 'Tindakan wajib pencegahan tubrukan kapal di laut pada situasi haluan berhadapan.',
  },
  'm3-v-17': {
    summary: 'Fungsi sistem gas lembam (Inert Gas System / IGS) di kapal tanker.',
    whyCorrect: 'IGS berfungsi menjaga kadar oksigen di dalam tangki muatan minyak tetap di bawah 8% volume untuk mencegah terjadinya ledakan.',
    distractors: [
      { option: 'To cool cargo oil down to ambient atmospheric temperature', reason: 'Salah bukan sistem pendingin minyak.' },
      { option: 'To filter volatile toxic vapors from ship accommodation corridors', reason: 'Salah bukan penyaring udara akomodasi.' },
      { option: 'To inject nitrogen into engine fuel injectors for fuel efficiency', reason: 'Salah bukan sistem injeksi mesin.' },
    ],
    maritimeContext: 'Sistem keselamatan pencegahan ledakan tangki muatan kapal tanker minyak mentah SOLAS.',
  },
  'm3-v-18': {
    summary: 'Kepanjangan sistem peta navigasi elektronik ECDIS.',
    whyCorrect: 'ECDIS adalah singkatan dari "Electronic Chart Display and Information System" (Sistem Tampilan dan Informasi Peta Elektronik).',
    distractors: [
      { option: 'Emergency Control Device for Internal Steering', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Electrical Circuit Distribution and Interlock System', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Engine Combustion Diagnostic and Inspection Software', reason: 'Salah kepanjangan fiktif.' },
    ],
    maritimeContext: 'Peralatan navigasi peta elektronik wajib di anjungan kapal modern SOLAS Bab V.',
  },
  'm3-v-19': {
    summary: 'Definisi kapal yang terkendala oleh saratnya (Constrained by Her Draught / CBD).',
    whyCorrect: 'CBD adalah kapal tenaga yang kemampuan olah geraknya sangat terbatas untuk menyimpang dari haluannya karena kedalaman air yang tersedia relatif terhadap saratnya.',
    distractors: [
      { option: 'A vessel carrying dangerous IMDG Class 1 explosive cargo', reason: 'Salah karena itu kapal muatan berbahaya.' },
      { option: 'A ship engaged in pair trawling with fishing nets', reason: 'Salah karena itu kapal yang sedang menangkap ikan.' },
      { option: 'A sailing vessel unable to steer because of calm wind', reason: 'Salah bukan definisi CBD.' },
    ],
    ruleOrFormula: 'COLREG Rule 3(h): Vessel Constrained by Her Draught definition.',
    maritimeContext: 'Status navigasi kapal sarat dalam di alur pelayaran dangkal/sempit.',
  },
  'm3-v-20': {
    summary: 'Definisi pengukuran ruang kosong tangki cairan (Ullage).',
    whyCorrect: 'Ullage adalah jarak ruang kosong yang diukur dari bibir lubang ukur atas tangki turun sampai ke permukaan cairan minyak.',
    distractors: [
      { option: 'The total depth of liquid measured from tank bottom up to the liquid surface', reason: 'Salah karena itu adalah kedalaman cairan (Sounding/Dip).' },
      { option: 'The amount of sediment sludge accumulated on the tank bottom plating', reason: 'Salah karena itu endapan lumpur (Sludge).' },
      { option: 'The density of oil measured at standard 15 degrees Celsius', reason: 'Salah karena itu massa jenis minyak (Density).' },
    ],
    maritimeContext: 'Pengukuran volume muatan cair tangki kapal tanker (Ullage Measurement).',
  },
  'm3-v-21': {
    summary: 'Fungsi anoda korban (Sacrificial Anodes) pada pelat lambung kapal.',
    whyCorrect: 'Anoda korban (seng/aluminium) memberikan proteksi katodik untuk mencegah korosi galvanik elektrokimia pada pelat baja lambung kapal bawah air.',
    distractors: [
      { option: 'To balance vessel transverse stability in heavy seas', reason: 'Salah tidak terkait keseimbangan stabilitas.' },
      { option: 'To absorb shock impact when mooring alongside a concrete quay', reason: 'Salah karena itu fungsi daprah (Fender).' },
      { option: 'To provide grounding for lightning strikes', reason: 'Salah bukan penangkal petir.' },
    ],
    maritimeContext: 'Perlindungan korosi pelat baja lambung bawah air kapal saat berlayar di laut.',
  },
  'm3-v-22': {
    summary: 'Sosok benda siang hari untuk kapal yang tidak dapat diolahgerakkan (Not Under Command / NUC).',
    whyCorrect: 'Sesuai Aturan 27 COLREG, kapal NUC pada siang hari wajib memperlihatkan dua bola hitam bersusun tegak lurus (two black balls in a vertical line).',
    distractors: [
      { option: 'Three black balls in a vertical line', reason: 'Salah karena 3 bola hitam adalah sosok benda kapal kandas (Vessel Aground).' },
      { option: 'One black diamond shape', reason: 'Salah karena belah ketupat adalah tanda gandengan kapal tunda panjang.' },
      { option: 'One black ball at the masthead', reason: 'Salah karena 1 bola hitam adalah kapal berlabuh jangkar (Vessel at Anchor).' },
    ],
    ruleOrFormula: 'COLREG Rule 27: NUC = • • (2 Bola Hitam Tegak Lurus).',
    maritimeContext: 'Isyarat sosok benda navigasi siang hari saat kapal mengalami kerusakan mesin/kemudi.',
  },
  'm3-v-23': {
    summary: 'Fungsi pendorong haluan melintang (Bow Thruster).',
    whyCorrect: 'Bow Thruster menghasilkan gaya dorong melintang ke samping pada haluan untuk mempermudah manuver sandar dan lepas sandar kapal di pelabuhan tanpa bantuan kapal tunda.',
    distractors: [
      { option: 'To pump emergency cooling water to the main propulsion engine', reason: 'Salah bukan pompa pendingin darurat.' },
      { option: 'To increase forward cruising speed in open ocean passage', reason: 'Salah tidak menambah laju maju kapal di laut lepas.' },
      { option: 'To discharge ballast water through the collision bulkhead', reason: 'Salah bukan pembuangan ballast.' },
    ],
    maritimeContext: 'Olah gerak sandar kapal di dermaga sempit pelabuhan.',
  },
  'm3-v-24': {
    summary: 'Arti istilah pembilasan gas buang (Scavenging) pada motor diesel kapal.',
    whyCorrect: 'Scavenging adalah proses mendorong gas buang sisa pembakaran keluar dari silinder dan mengisi kembali ruang silinder dengan udara bilas segar.',
    distractors: [
      { option: 'The filtration of lube oil through centrifugal purifiers', reason: 'Salah karena itu pemurnian minyak lumas (Purification).' },
      { option: 'The pre-heating of heavy fuel oil before injection', reason: 'Salah karena itu pemanasan bahan bakar (Fuel Heating).' },
      { option: 'The drainage of condensed water from air coolers', reason: 'Salah pengurasan kondensat pendingin udara.' },
    ],
    maritimeContext: 'Siklus kerja motor diesel 2-tak dan 4-tak penggerak utama kapal.',
  },
  'm3-v-25': {
    summary: 'Kepanjangan sistem radar ARPA.',
    whyCorrect: 'ARPA adalah singkatan dari "Automatic Radar Plotting Aid" (Alat Plotting Radar Otomatis) untuk memantau pergerakan target kapal lain dan menghitung risiko tubrukan.',
    distractors: [
      { option: 'Automated Radio Position Alignment', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Acoustic Range Plotter Appliance', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Auxiliary Rudder Positioning Apparatus', reason: 'Salah kepanjangan fiktif.' },
    ],
    maritimeContext: 'Peralatan radar navigasi pencegahan tubrukan kapal di anjungan.',
  },
  'm3-v-26': {
    summary: 'Definisi transponder pencarian dan penyelamatan SART.',
    whyCorrect: 'SART adalah perangkat sekoci penolong yang merespons pulsa radar 9 GHz kapal penyelamat sehingga memunculkan 12 titik gema garis di layar radar penolong.',
    distractors: [
      { option: 'A satellite receiver for NAVTEX navigational warnings', reason: 'Salah karena itu NAVTEX receiver.' },
      { option: 'An emergency smoke flare emitting orange smoke for 3 minutes', reason: 'Salah karena itu cerawat asap oranye.' },
      { option: 'A voice recorder installed on the navigation bridge', reason: 'Salah karena itu Voyage Data Recorder (VDR).' },
    ],
    maritimeContext: 'Perangkat penunjuk lokasi marabahaya sekoci penolong sistem GMDSS.',
  },
  'm3-v-27': {
    summary: 'Definisi dan fungsi lunas bilga (Bilge Keel) di lambung kapal.',
    whyCorrect: 'Bilge Keel adalah sirip plat memanjang di kedua sisi lengkungan lambung kapal yang berfungsi meredam dan memperkecil gerakan oleng (rolling) saat berlayar di laut bergelombang.',
    distractors: [
      { option: 'A keel pipe used to discharge contaminated bilge water', reason: 'Salah bukan pipa got pembuangan air bilga.' },
      { option: 'A protective guard preventing fishing nets from fouling the propeller', reason: 'Salah bukan pelindung baling-baling (Rope Cutter).' },
      { option: 'The lowest structural girder in the center of the ship bottom', reason: 'Salah karena itu lunas utama (Center Girder/Keel).' },
    ],
    maritimeContext: 'Struktur lambung peredam oleng stabilitas kapal di laut lepas.',
  },
  'm3-v-28': {
    summary: 'Fungsi pompa pemadam kebakaran darurat (Emergency Fire Pump).',
    whyCorrect: 'Pompa pemadam darurat berfungsi menyediakan pasokan air pemadam bertekanan secara independen dari luar kamar mesin jika pompa utama kamar mesin mati/terbakar.',
    distractors: [
      { option: 'To drain water from flooded cargo holds after collisions', reason: 'Salah karena itu fungsi pompa bilga darurat.' },
      { option: 'To pump high-pressure foam into bunker fuel tanks', reason: 'Salah karena itu sistem busa pemadam minyak.' },
      { option: 'To cool down hot container stacks on deck', reason: 'Salah bukan fungsi pokok darurat.' },
    ],
    maritimeContext: 'Peralatan keselamatan pemadam kebakaran darurat wajib SOLAS Bab II-2.',
  },
  'm3-v-29': {
    summary: 'Tujuan sistem pengolahan air ballast (Ballast Water Treatment) Konvensi BWM.',
    whyCorrect: 'Sistem pengolahan air ballast bertujuan mencegah perpindahan organisme akuatik invasif dan mikroba patogen berbahaya antar ekosistem perairan dunia.',
    distractors: [
      { option: 'To increase the ship propulsion efficiency in shallow waters', reason: 'Salah tidak terkait efisiensi baling-baling.' },
      { option: 'To purify ballast water for crew laundry and domestic use', reason: 'Salah bukan untuk air tawar domestik awak.' },
      { option: 'To clean rust scale from internal ballast tank surfaces', reason: 'Salah bukan pembersih karat tangki.' },
    ],
    maritimeContext: 'Kepatuhan perlindungan lingkungan laut Konvensi IMO BWM 2004.',
  },
  'm3-v-30': {
    summary: 'Arti parameter navigasi CPA pada layar radar ARPA.',
    whyCorrect: 'CPA (Closest Point of Approach) adalah jarak terdekat yang akan dicapai oleh kapal target saat berpapasan dengan kapal kita jika tidak ada perubahan haluan dan kecepatan.',
    distractors: [
      { option: 'Current Position Angle: The bearing of the target from true North', reason: 'Salah karena itu sudut baringan target.' },
      { option: 'Critical Propeller Acceleration: Maximum safe engine revolution rate', reason: 'Salah istilah permesinan.' },
      { option: 'Course Precision Adjustment: The gyro compass correction value', reason: 'Salah nilai koreksi giro kompas.' },
    ],
    ruleOrFormula: 'ARPA Parameter: CPA = Closest Point of Approach (Jarak Berpapasan Terdekat).',
    maritimeContext: 'Parameter kunci evaluasi risiko tubrukan navigasi anjungan.',
  },

  // Time, Numbers & Calculations (31-40)
  'm3-t-31': {
    summary: 'Interpretasi data radar target CPA 0.3 NM dan TCPA 12 menit.',
    whyCorrect: 'Data menunjukkan kapal target akan berpapasan pada jarak yang sangat dekat dan berbahaya (hanya 0,3 mil laut) dalam waktu 12 menit lagi, sehingga memerlukan tindakan pencegahan tubrukan segera.',
    distractors: [
      { option: 'Target has already passed safely 12 minutes ago at 0.3 miles distance', reason: 'Salah karena TCPA bernilai positif menandakan peristiwa akan terjadi di masa depan.' },
      { option: 'Target is stationary at an anchor position 12 miles away', reason: 'Salah target sedang bergerak.' },
      { option: 'Target speed is 12 knots on a reciprocal course', reason: 'Salah karena TCPA adalah waktu tempuh menit, bukan kecepatan knot.' },
    ],
    ruleOrFormula: 'TCPA = Time to Closest Point of Approach (Waktu menuju titik temu terdekat).',
    maritimeContext: 'Penilaian risiko tubrukan radar ARPA pada dinas jaga navigasi.',
  },
  'm3-t-32': {
    summary: 'Perhitungan konsumsi bahan bakar total pelayaran (1.680 NM pada 14 knot, 32 MT/hari).',
    whyCorrect: 'Lama pelayaran = 1.680 NM ÷ 14 knot = 120 jam = 5 hari. Total kebutuhan bahan bakar = 5 hari × 32 metrik ton/hari = 160 metrik ton.',
    distractors: [
      { option: '128 metric tonnes', reason: 'Salah karena mengalikan 4 hari (4 x 32 = 128).' },
      { option: '192 metric tonnes', reason: 'Salah karena mengalikan 6 hari (6 x 32 = 192).' },
      { option: '210 metric tonnes', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Waktu (Hari) = 1.680 / (14 × 24) = 5 Hari. Bahan Bakar = 5 × 32 MT = 160 MT.',
    maritimeContext: 'Perhitungan kebutuhan bunker bahan bakar pada Rencana Pelayaran (Passage Plan).',
  },
  'm3-t-33': {
    summary: 'Kalkulasi haluan sejati dari haluan pedoman (Compass 095°, Var 3° W, Dev 2° E).',
    whyCorrect: 'Haluan Magnet = Haluan Pedoman (095°) + Deviasi (+2° E) = 097°. Haluan Sejati = Haluan Magnet (097°) + Variasi (-3° W) = 094° Sejati.',
    distractors: [
      { option: '096° True', reason: 'Salah tanda plus/minus variasi dan deviasi.' },
      { option: '100° True', reason: 'Salah karena menjumlahkan seluruh koreksi ke arah yang sama.' },
      { option: '090° True', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'True Course = Compass + Dev (+E/-W) + Var (+E/-W) = 095° + (+2°) + (-3°) = 094° True.',
    maritimeContext: 'Perhitungan salah pedoman navigasi anjungan (Compass Error Calculation).',
  },
  'm3-t-34': {
    summary: 'Kecepatan angin dan sebutan skala Beaufort Force 8 (Gale Force).',
    whyCorrect: 'Skala Beaufort 8 bernilai kecepatan angin 34 hingga 40 knot dengan istilah Gale Force (Angin Ribut).',
    distractors: [
      { option: '17 to 21 knots (Fresh Breeze)', reason: 'Salah karena itu Beaufort Force 5.' },
      { option: '48 to 55 knots (Storm Force)', reason: 'Salah karena itu Beaufort Force 10.' },
      { option: '11 to 16 knots (Moderate Breeze)', reason: 'Salah karena itu Beaufort Force 4.' },
    ],
    ruleOrFormula: 'Beaufort Force 8 = 34–40 Knots (Gale Force).',
    maritimeContext: 'Pencatatan skala kekuatan angin pada buku harian kapal dan laporan cuaca maritim.',
  },
  'm3-t-35': {
    summary: 'Evaluasi pengaruh arus dari selisih SOG (16.5 kn) dan STW (14.0 kn).',
    whyCorrect: 'Karena Kecepatan terhadap Tanah (SOG = 16.5 kn) lebih besar dari Kecepatan terhadap Air (STW = 14.0 kn), kapal terdorong oleh arus searah sebesar 2,5 knot (16.5 - 14.0 = +2.5 kn).',
    distractors: [
      { option: 'Adverse opposing current slowing down the ship by 2.5 knots', reason: 'Salah karena arus berlawanan akan membuat SOG lebih kecil dari STW.' },
      { option: 'Transverse leeway drift of 16.5 degrees', reason: 'Salah karena ini adalah selisih kecepatan maju, bukan sudut hanyut angin.' },
      { option: 'Propeller slip of 14 percent', reason: 'Salah bukan slip baling-baling.' },
    ],
    ruleOrFormula: 'Pengaruh Arus = SOG - STW = 16.5 - 14.0 = +2.5 Knots (Arus Dorong Searah).',
    maritimeContext: 'Analisis navigasi pengaruh arus laut terhadap Estimated Time of Arrival (ETA).',
  },
  'm3-t-36': {
    summary: 'Kalkulasi berat benaman penuh kapal / Displacement (Deadweight 45.000 T + Light Ship 12.500 T).',
    whyCorrect: 'Displacement Penuh = Berat Kapal Kosong (Light Ship 12.500 T) + Bobot Mati Muat (Deadweight 45.000 T) = 57.500 metrik ton.',
    distractors: [
      { option: '32,500 tonnes', reason: 'Salah karena mengurangkan bukan menjumlahkan.' },
      { option: '50,000 tonnes', reason: 'Salah hitung penjumlahan.' },
      { option: '60,000 tonnes', reason: 'Salah hitung penjumlahan.' },
    ],
    ruleOrFormula: 'Total Displacement = Light Ship Displacement + Deadweight = 12.500 + 45.000 = 57.500 Tonnes.',
    maritimeContext: 'Perhitungan berat benaman total kapal untuk perhitungan sarat dan stabilitas.',
  },
  'm3-t-37': {
    summary: 'Pengucapan frekuensi radio maritim 156.800 MHz (VHF Ch 16) standar IMO SMCP.',
    whyCorrect: 'Angka frekuensi radio maritim diucapkan digit per digit dengan penyebutan "decimal": "One five six decimal eight zero zero megahertz".',
    distractors: [
      { option: 'One hundred fifty six point eight megahertz', reason: 'Salah karena tidak boleh membaca ratusan.' },
      { option: 'Fifteen six point eight zero zero megahertz', reason: 'Salah membaca puluhan.' },
      { option: 'One five sixty eight hundred megahertz', reason: 'Salah pengelompokan angka.' },
    ],
    ruleOrFormula: 'IMO SMCP Radiotelephony: Spell each frequency digit individually (1-5-6 decimal 8-0-0 MHz).',
    maritimeContext: 'Standar penyebutan frekuensi radio maritim internasional Saluran 16 (156.800 MHz).',
  },
  'm3-t-38': {
    summary: 'Perhitungan kecepatan rata-rata tempuh 35 NM dari pukul 08:15 ke 10:45 UTC.',
    whyCorrect: 'Waktu tempuh = 10:45 - 08:15 = 2 jam 30 menit = 2,5 jam. Kecepatan rata-rata = 35 NM ÷ 2,5 jam = 14,0 knot.',
    distractors: [
      { option: '15.5 knots', reason: 'Salah hitung pembagian.' },
      { option: '12.0 knots', reason: 'Salah hitung pembagian.' },
      { option: '16.5 knots', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Speed (Knots) = Distance (NM) / Time (Hours) = 35 / 2.5 = 14.0 Knots.',
    maritimeContext: 'Evaluasi kecepatan tempuh antar titik lintas (Waypoints) navigasi kapal.',
  },
  'm3-t-39': {
    summary: 'Perhitungan sisa margin batas aman suhu gas buang (Batas 450°C - Terbaca 420°C).',
    whyCorrect: 'Margin sisa batas aman suhu gas buang silinder = 450°C - 420°C = 30°C.',
    distractors: [
      { option: '40°C margin', reason: 'Salah hitung pengurangan.' },
      { option: '25°C margin', reason: 'Salah hitung pengurangan.' },
      { option: '50°C margin', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Margin = Batas Maksimal (450) - Nilai Saat Ini (420) = 30°C.',
    maritimeContext: 'Pengawasan batas termal suhu gas buang mesin induk kapal.',
  },
  'm3-t-40': {
    summary: 'Perhitungan UKC Dinamis (Kedalaman Peta 8.5 m + Pasang +2.2 m - Sarat 9.2 m).',
    whyCorrect: 'Kedalaman air total = 8.5 m (peta) + 2.2 m (pasang) = 10.7 m. UKC dinamis = 10.7 m - 9.2 m (sarat) = 1.5 meter.',
    distractors: [
      { option: '0.7 meters', reason: 'Salah karena lupa menambahkan tinggi air pasang (+2.2m).' },
      { option: '2.5 meters', reason: 'Salah hitung pengurangan.' },
      { option: '0.5 meters', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Dynamic UKC = (Charted Depth + Height of Tide) - Vessel Draft = (8.5 + 2.2) - 9.2 = 1.5 Meters.',
    maritimeContext: 'Perhitungan ruang bebas lunas aman saat memasuki alur dangkal pelabuhan.',
  },

  // Reading Comprehension & Casualty Reports (41-50)
  'm3-r-41': {
    summary: 'Akar penyebab insiden tubrukan kapal menurut laporan kecelakaan maritim.',
    whyCorrect: 'Laporan investigasi menyatakan bahwa penyebab utama tubrukan adalah kegagalan kedua kapal mempertahankan pengamatan keliling yang layak (proper lookout) pada kondisi tampak terbatas (COLREG Aturan 5 dan 19).',
    distractors: [
      { option: 'Mechanical failure of the steering gear hydraulic power unit', reason: 'Salah tidak ada kerusakan mesin kemudi.' },
      { option: 'Sudden loss of main propulsion electrical power', reason: 'Salah bukan karena mati listrik mesin.' },
      { option: 'Excessive speed while maneuvering alongside the container terminal', reason: 'Salah tidak terjadi saat sandar.' },
    ],
    maritimeContext: 'Analisis investigasi kecelakaan laut dan kepatuhan aturan navigasi COLREGs 1972.',
  },
  'm3-r-42': {
    summary: 'Cara menyeberangi alur bagan pemisah lalu lintas (TSS) menurut COLREG Aturan 10.',
    whyCorrect: 'Kapal yang wajib memotong jalur pemisah lalu lintas harus melakukannya sedekat mungkin pada sudut siku-siku (90 derajat) terhadap arah umum arus lalu lintas jalur tersebut.',
    distractors: [
      { option: 'Parallel to the traffic lane at maximum cruising speed', reason: 'Salah karena menyeberang sejajar akan membingungkan kapal di jalurnya.' },
      { option: 'At an acute angle of 30 degrees to minimize crossing time', reason: 'Salah karena sudut lancip dilarang dalam Aturan 10.' },
      { option: 'By anchoring in the middle of the separation zone', reason: 'Salah karena dilarang berlabuh jangkar di zona pemisah kecuali darurat.' },
    ],
    ruleOrFormula: 'COLREG Rule 10(c): Crossing traffic lane at right angles (90°).',
    maritimeContext: 'Navigasi aman memotong bagan pemisah lalu lintas kapal (Traffic Separation Scheme).',
  },
  'm3-r-43': {
    summary: 'Syarat pencabutan penahanan kapal (Detention) oleh Port State Control (PSC).',
    whyCorrect: 'Status penahanan kapal hanya dapat dicabut setelah ketiga temuan kekurangan kritis keselamatan (pompa pemadam darurat, kait sekoci, lisensi peta ECDIS) diperbaiki tuntas dan diverifikasi langsung oleh inspektur PSC.',
    distractors: [
      { option: 'The ship Master must pay a monetary port fine and sail immediately', reason: 'Salah karena denda uang tidak menggantikan perbaikan keselamatan teknis.' },
      { option: 'The vessel must transfer its cargo to another ship in the anchorage', reason: 'Salah bukan solusi pemindahan muatan.' },
      { option: 'The vessel must recruit an entirely new engine room crew', reason: 'Salah bukan pergantian total seluruh awak.' },
    ],
    maritimeContext: 'Pemeriksaan kelaiklautan dan penegakan regulasi keselamatan maritim internasional PSC.',
  },
  'm3-r-44': {
    summary: 'Aturan keselamatan mutlak bagi tim penolong korban di ruang tertutup (Enclosed Space).',
    whyCorrect: 'Tim penolong dilarang keras memasuki ruang berbahaya tanpa menggunakan alat bantu pernapasan (SCBA), tali pengaman, dan adanya petugas siaga di pintu masuk ruang tertutup.',
    distractors: [
      { option: 'Immediately enter to pull the casualty out as quickly as possible', reason: 'SANGAT BERBAHAYA! Banyak kematian ganda terjadi karena penolong langsung masuk tanpa SCBA dan ikut pingsan/tewas.' },
      { option: 'Wait 2 hours for natural ventilation before taking action', reason: 'Salah karena korban membutuhkan pertolongan darurat terencana segera.' },
      { option: 'Pour freshwater into the tank entrance to reduce fumes', reason: 'Salah tidak efektif dan memperparah kondisi korban.' },
    ],
    maritimeContext: 'SOP penyelamatan korban darurat ruang tertutup kapal (Enclosed Space Rescue Plan).',
  },
  'm3-r-45': {
    summary: 'Batas sudut senget maksimal akibat pergeseran muatan gandum curah (Grain Code).',
    whyCorrect: 'Sesuai Kode Internasional Muatan Gandum Curah (IMO International Grain Code), sudut senget kapal akibat pergeseran muatan gandum tidak boleh melampaui 12 derajat.',
    distractors: [
      { option: '15 degrees', reason: 'Salah batas sudut.' },
      { option: '20 degrees', reason: 'Salah batas sudut.' },
      { option: '8 degrees', reason: 'Salah batas sudut.' },
    ],
    ruleOrFormula: 'IMO Grain Code Criteria: Angle of heel due to grain shift ≤ 12°.',
    maritimeContext: 'Kriteria stabilitas dan pengamanan muatan curah biji-bijian kapal niaga.',
  },
  'm3-r-46': {
    summary: 'Kondisi keselamatan wajib saat pencucian tangki minyak mentah (Crude Oil Washing / COW).',
    whyCorrect: 'Selama pencucian tangki COW, tangki wajib berada dalam kondisi gas lembam (Inert Condition) dengan kadar oksigen terus dipantau secara ketat di bawah 8% volume.',
    distractors: [
      { option: 'Ventilating the cargo tank with fresh air fans', reason: 'SANGAT BERBAHAYA! Memasukkan udara segar saat pencucian minyak mentah dapat memicu ledakan tangki dahsyat.' },
      { option: 'Washing tanks with high-pressure boiling seawater', reason: 'Salah karena COW menggunakan semprotan minyak mentah itu sendiri, bukan air laut mendidih.' },
      { option: 'Disconnecting all bunker manifold emergency valves', reason: 'Salah tidak terkait manifold bunker.' },
    ],
    maritimeContext: 'Operasional pencucian tangki muatan kapal tanker minyak mentah MARPOL Annex I.',
  },
  'm3-r-47': {
    summary: 'Konsekuensi otomatis jika alarm detektor kebakaran tidak direspon dalam 2 menit.',
    whyCorrect: 'Sesuai regulasi SOLAS Bab II-2, jika alarm detektor tidak diakui di panel utama dalam 2 menit, sistem akan membunyikan alarm kebakaran umum secara otomatis di seluruh area akomodasi awak kapal.',
    distractors: [
      { option: 'The engine room emergency CO2 system immediately discharges', reason: 'Salah karena CO2 darurat hanya boleh dilepas secara manual setelah evakuasi tuntas.' },
      { option: 'The main diesel propulsion engine automatically shuts down', reason: 'Salah mesin utama tidak otomatis mati.' },
      { option: 'The fire control panel resets and clears the alert', reason: 'Salah alarm tidak akan mereset sendiri.' },
    ],
    maritimeContext: 'Sistem deteksi dan alarm kebakaran otomatis kapal standar SOLAS Bab II-2.',
  },
  'm3-r-48': {
    summary: 'Fitur wajib pada peralatan pemisah minyak got (OWS) di Area Khusus MARPOL.',
    whyCorrect: 'Di Area Khusus (Special Area), OWS wajib dilengkapi perangkat penghenti otomatis (automatic stopping device) yang langsung menghentikan buangan ke laut jika kadar minyak melampaui 15 ppm.',
    distractors: [
      { option: 'A chemical neutralizing tank with chlorine disinfectant', reason: 'Salah bukan tangki klorin.' },
      { option: 'A dual-stage seawater evaporator unit', reason: 'Salah bukan evaporator.' },
      { option: 'A manual overboard discharge valve locked in open position', reason: 'Salah katup tidak boleh dikunci terbuka.' },
    ],
    maritimeContext: 'Standar pencegahan pencemaran minyak kamar mesin di perairan laut khusus MARPOL Annex I.',
  },
  'm3-r-49': {
    summary: 'Tindakan kapal bersarat dalam terhadap pelampung suar alur yang hanyut 0.8 NM Barat.',
    whyCorrect: 'Pemberitahuan navigasi menginstruksikan kapal bersarat dalam untuk menjaga jarak bebas keselamatan minimal 1,5 mil laut (1.5 NM) dari posisi pelampung yang hanyut tersebut.',
    distractors: [
      { option: 'Stop and anchor immediately next to fairway buoy Alpha', reason: 'Salah karena dilarang berlabuh jangkar di alur navigasi dalam.' },
      { option: 'Turn on floodlights to search for the buoy in darkness', reason: 'Salah bukan tindakan navigasi yang tepat.' },
      { option: 'Increase speed to clear the fairway before low tide', reason: 'Salah karena menambah kecepatan meningkatkan bahaya tubrukan/kandas.' },
    ],
    maritimeContext: 'Kewaspadaan navigasi kapal bersarat dalam terhadap sarana bantu navigasi yang rusak/bergeser.',
  },
  'm3-r-50': {
    summary: 'Pihak yang memiliki wewenang menghentikan pekerjaan tidak aman (Stop-Work Authority).',
    whyCorrect: 'Sesuai budaya keselamatan ISM Code, wewenang menghentikan pekerjaan berbahaya (Stop-Work Authority) dimiliki oleh seluruh awak kapal tanpa memandang pangkat, jabatan, maupun departemen.',
    distractors: [
      { option: 'Only the Master and Chief Engineer', reason: 'Salah karena setiap kru berhak menghentikan pekerjaan yang membahayakan nyawa seketika.' },
      { option: 'Only shore-based safety superintendents', reason: 'Salah bukan hanya orang darat.' },
      { option: 'Only senior port authority inspectors', reason: 'Salah bukan hanya inspektur pelabuhan.' },
    ],
    maritimeContext: 'Budaya keselamatan kerja proaktif Sistem Manajemen Keselamatan (ISM Code).',
  },

  // Listening & Advanced IMO SMCP VHF (51-60)
  'm3-l-51': {
    summary: 'Status darurat marabahaya kapal pada siaran MAYDAY MV Coral Island.',
    whyCorrect: 'Pancaran radio MAYDAY melaporkan terjadi ledakan di palka No. 3, kapal kemasukan air dan tenggelam, serta 22 orang awak sedang meninggalkan kapal menuju rakit penolong.',
    distractors: [
      { option: 'Minor electrical fire in galley, assistance not required', reason: 'Salah bukan kebakaran kecil dapur.' },
      { option: 'Main engine breakdown drifting in anchorage', reason: 'Salah bukan mesin mati biasa.' },
      { option: 'Medical emergency requesting helicopter doctor', reason: 'Salah bukan darurat medis biasa.' },
    ],
    maritimeContext: 'Pancaran berita marabahaya maritim mutlak GMDSS MAYDAY.',
  },
  'm3-l-52': {
    summary: 'Pola pencarian dan penyelamatan (SAR) yang diperintahkan oleh On-Scene Coordinator.',
    whyCorrect: 'Koordinator SAR di lokasi memerintahkan pelaksanaan pola pencarian bujur sangkar meluas (Expanding Square Search Pattern) dari posisi datum dengan jarak lintasan 1,0 mil laut dan laju 10 knot.',
    distractors: [
      { option: 'Parallel sweep search pattern with 5.0 NM track spacing at maximum speed', reason: 'Salah pola pencarian sejajar dan jarak lintasan.' },
      { option: 'Sector search pattern around floating debris field', reason: 'Salah bukan pencarian sektor.' },
      { option: 'Track line return search along coastline', reason: 'Salah bukan pencarian garis pantai.' },
    ],
    maritimeContext: 'Pola operasi pencarian dan pertolongan maritim IAMSAR Manual Volume III.',
  },
  'm3-l-53': {
    summary: 'Instruksi keselamatan pengikatan kawat derek helikopter evakuasi medis.',
    whyCorrect: 'Awak kapal wajib membiarkan kawat derek menyentuh pelat geladak kapal terlebih dahulu guna membuang muatan listrik statis sebelum dipegang/ditangani langsung.',
    distractors: [
      { option: 'Tie the helicopter hoist wire firmly to the ship deck railing', reason: 'SANGAT BERBAHAYA! Mengikat kawat derek ke pagar kapal dapat menjatuhkan helikopter ke laut.' },
      { option: 'Cut the hoist wire immediately with emergency shears', reason: 'Salah memutus kawat tanpa sebab.' },
      { option: 'Connect the hoist wire to the 220V auxiliary switchboard', reason: 'Salah sangat fatal menyetrum.' },
    ],
    maritimeContext: 'Prosedur keselamatan evakuasi medis helikopter di kapal (Helicopter Winch Operations).',
  },
  'm3-l-54': {
    summary: 'Permohonan izin MV Nordica kepada VTS Dover saat melintasi Reporting Point Bravo.',
    whyCorrect: 'Kapal melaporkan posisi lintang dan meminta izin resmi untuk memasuki jalur bagan pemisah lalu lintas arah barat (westbound traffic separation lane).',
    distractors: [
      { option: 'Tug assistance to berth at container pier 3', reason: 'Salah bukan permintaan kapal tunda sandar.' },
      { option: 'Bunker supply barge at outer anchorage', reason: 'Salah bukan permintaan tongkang bunker.' },
      { option: 'Customs and immigration clearance', reason: 'Salah bukan izin imigrasi.' },
    ],
    maritimeContext: 'Prosedur pelaporan titik lintas wajib navigasi Vessel Traffic Service (VTS).',
  },
  'm3-l-55': {
    summary: 'Instruksi keselamatan navigasi siaran SECURITE terkait kapal keruk di alur barat.',
    whyCorrect: 'Pesan keselamatan SECURITE menginstruksikan seluruh kapal yang melintas untuk melaju dengan kecepatan rendah guna memperkecil ombak gelombang lambung (pass with minimum wake).',
    distractors: [
      { option: 'Sound five prolonged blasts on the fog horn', reason: 'Salah isyarat bunyi.' },
      { option: 'Stop engines and wait for pilot boat arrival', reason: 'Salah tidak diperintahkan berhenti total.' },
      { option: 'Anchor in the fairway until dredging completes', reason: 'Salah dilarang lego jangkar di alur.' },
    ],
    maritimeContext: 'Siaran radio keselamatan navigasi maritim SECURITE.',
  },
  'm3-l-56': {
    summary: 'Peringatan bahaya tubrukan mendesak dari VTS kepada MV Starling.',
    whyCorrect: 'VTS memperingatkan ada target di lambung kiri depan (port bow) jarak 1,2 mil laut pada haluan tubrukan langsung dengan CPA nol, mewajibkan tindakan olah gerak segera.',
    distractors: [
      { option: 'Target is overtaking your ship safely on starboard quarter', reason: 'Salah karena target berada di haluan kiri depan dan berada pada haluan tubrukan.' },
      { option: 'Target has dropped anchor outside port limits', reason: 'Salah target sedang melaju mendekat.' },
      { option: 'Target is requesting emergency medical advice', reason: 'Salah bukan panggilan medis.' },
    ],
    maritimeContext: 'Peringatan bahaya tubrukan aktif VTS (Collision Warning IMO SMCP).',
  },
  'm3-l-57': {
    summary: 'Jenis bahan bakar yang diperintahkan anjungan untuk persiapan olah gerak mesin.',
    whyCorrect: 'Anjungan memerintahkan kamar mesin untuk beralih dari minyak berat (HFO) ke bahan bakar minyak gas laut (Marine Gas Oil / MGO) untuk persiapan olah gerak dalam 15 menit.',
    distractors: [
      { option: 'Heavy Fuel Oil (HFO 380)', reason: 'Salah karena diperintahkan beralih dari HFO ke MGO.' },
      { option: 'Liquefied Natural Gas (LNG)', reason: 'Salah bukan gas alam cair.' },
      { option: 'Very Low Sulfur Heavy Fuel Oil (VLSFO)', reason: 'Salah bukan VLSFO.' },
    ],
    maritimeContext: 'Persiapan permesinan olah gerak masuk alur pelabuhan dan zona kontrol emisi (ECA).',
  },
  'm3-l-58': {
    summary: 'Jumlah segel rantai jangkar (Shackles) yang diulur di geladak.',
    whyCorrect: 'Laporan stasiun haluan mengonfirmasi jangkar kiri telah dilego pada kedalaman 25 meter dan rantai jangkar telah diulur sebanyak 5 segel (five shackles on deck).',
    distractors: [
      { option: '3 shackles', reason: 'Salah jumlah segel.' },
      { option: '7 shackles', reason: 'Salah jumlah segel.' },
      { option: '2 shackles', reason: 'Salah jumlah segel.' },
    ],
    ruleOrFormula: '1 Shackle Rantai Jangkar = 15 Fathoms = 27,43 Meter (90 Kaki).',
    maritimeContext: 'Prosedur komunikasi lego dan panjang area rantai jangkar kapal.',
  },
  'm3-l-59': {
    summary: 'Perintah pandu kepada kapal tunda Tug Sea Tiger saat proses sandar kapal.',
    whyCorrect: 'Pandu menginstruksikan kapal tunda Tug Sea Tiger untuk mendorong perlahan pada bagian pundak kanan (starboard shoulder) kapal.',
    distractors: [
      { option: 'Pull at full power on the port quarter wire', reason: 'Salah karena itu posisi buritan kiri.' },
      { option: 'Cast off towing line and return to tug base', reason: 'Salah tidak diperintahkan melepas tali.' },
      { option: 'Spray fire water monitor on the container stack', reason: 'Salah bukan pemadaman api.' },
    ],
    maritimeContext: 'Perintah bantuan olah gerak kapal tunda saat sandar dermaga.',
  },
  'm3-l-60': {
    summary: 'Laju pemompaan awal (Initial Rate) bahan bakar saat mulai transfer bunker.',
    whyCorrect: 'Tongkang bunker mengonfirmasi siap memompa bahan bakar minyak bersulfur rendah pada laju lambat awal sebesar 100 metrik ton per jam (100 MT/hr).',
    distractors: [
      { option: '300 metric tonnes per hour', reason: 'Salah laju pompa.' },
      { option: '500 metric tonnes per hour', reason: 'Salah laju pompa.' },
      { option: '50 metric tonnes per hour', reason: 'Salah laju pompa.' },
    ],
    ruleOrFormula: 'Bunkering Protocol: Start at slow initial rate (100 MT/hr) before full rate.',
    maritimeContext: 'Prosedur keselamatan transfer bunker bahan bakar kapal MARPOL Annex I.',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 4 (All 60 Questions)
const TEST_4_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm4-g-01': {
    summary: 'Subjunctive Mood: It is imperative that + Subject + bare verb (be).',
    whyCorrect: 'Setelah ungkapan keharusan mutlak "It is imperative that...", kata kerja wajib menggunakan bentuk dasar (bare infinitive) yaitu "be".',
    distractors: [
      { option: 'are', reason: 'Salah karena klausa subjunctive mewajibkan kata kerja dasar (be), bukan bentuk indikatif (are).' },
      { option: 'were', reason: 'Salah tenses past.' },
      { option: 'to be', reason: 'Salah bentuk to-infinitive.' },
    ],
    ruleOrFormula: 'Subjunctive Mood: It is imperative that + Subject + [be / base verb].',
    maritimeContext: 'Kewajiban penutupan katup manifold kargo sebelum proses purging gas lembam di kapal tanker.',
  },
  'm4-g-02': {
    summary: 'Negative Inversion: Not only + did + Subject + Verb 1 (fail).',
    whyCorrect: 'Inversi negatif diawali frasa "Not only", diikuti auxiliary lampau "did" dan kata kerja dasar "fail".',
    distractors: [
      { option: 'was', reason: 'Salah karena diikuti kata kerja dasar aktif "fail".' },
      { option: 'has', reason: 'Salah tenses present perfect.' },
      { option: 'had', reason: 'Salah karena had memerlukan past participle (failed), bukan kata kerja dasar (fail).' },
    ],
    ruleOrFormula: 'Negative Inversion: Not only + did + Subject + Verb 1...',
    maritimeContext: 'Laporan kegagalan ganda sistem sensor bilga dan katup hisap got darurat kamar mesin.',
  },
  'm4-g-03': {
    summary: 'Conditional Conjunction: Provided that + Simple Present (is).',
    whyCorrect: '"Provided that" (dengan syarat bahwa) berfungsi sebagai kata hubung pengandaian nyata masa kini yang diikuti Simple Present ("is certified").',
    distractors: [
      { option: 'will be', reason: 'Salah karena klausa bersyarat tidak menggunakan auxiliary future "will".' },
      { option: 'would be', reason: 'Salah tenses conditional tipe 2.' },
      { option: 'was being', reason: 'Salah tenses past continuous.' },
    ],
    ruleOrFormula: 'Condition: Provided that + Present Simple (is), Subject + may + Verb 1.',
    maritimeContext: 'Syarat penerbitan izin kerja panas (Hot Work Permit) setelah tangki dinyatakan bebas gas.',
  },
  'm4-g-04': {
    summary: 'Susunan kalimat baku laporan investigasi kecelakaan maritim (Participle Clause).',
    whyCorrect: 'Susunan baku formal maritim: Participle Clause (Having completed the discharge of flammable crude oil) + Koma + Main Clause (the crew commenced closed-loop vapor purging).',
    distractors: [
      { option: 'The crew commenced closed-loop vapor purging having completed the discharge of flammable crude oil.', reason: 'Kurang lazim untuk penekanan kronologis pelaporan resmi maritim.' },
    ],
    ruleOrFormula: 'Participial Clause + Subject + Verb + Object.',
    maritimeContext: 'Pelaksanaan proses purging uap minyak tertutup setelah selesai bongkar minyak mentah.',
  },
  'm4-g-05': {
    summary: 'Pola kolokasi "insist on + gerund" dan konjungsi waktu "while + clause".',
    whyCorrect: 'Kata kerja "insist" berpasangan tetap dengan preposisi "on" (insisted on maintaining), dan konjungsi "while" menghubungkan dua klausa yang berlangsung bersamaan.',
    distractors: [
      { option: 'in, during', reason: 'Salah karena "insist" tidak berpasangan dengan "in", dan "during" diikuti kata benda, bukan klausa.' },
      { option: 'for, as', reason: 'Salah pasangan preposisi "insist".' },
      { option: 'at, whereas', reason: 'Salah penggunaan preposisi dan konjungsi.' },
    ],
    ruleOrFormula: 'Collocation: Insist on + Gerund; Time Conjunction: While + Clause.',
    maritimeContext: 'Instruksi dinas jaga radio terus-menerus saat melintasi perairan rawan bajak laut.',
  },
  'm4-g-06': {
    summary: 'Negative Adverb Inversion: Seldom + do/does + Subject + Verb 1.',
    whyCorrect: 'Keterangan frekuensi bernilai negatif "Seldom" (jarang sekali) di awal kalimat memicu inversi: Seldom + do + we + observe.',
    distractors: [
      { option: 'we observe', reason: 'Salah karena tidak membalik struktur kalimat (inversion).' },
      { option: 'we are observing', reason: 'Salah struktur tanpa pembalikan.' },
      { option: 'observed we', reason: 'Salah bentuk pembalikan kuno tidak baku.' },
    ],
    ruleOrFormula: 'Negative Inversion: Seldom + do/does + Subject + Verb 1.',
    maritimeContext: 'Pengamatan penurunan drastis tekanan barometer sebagai tanda badai siklon tropis (TRS).',
  },
  'm4-g-07': {
    summary: 'Subjunctive Mood: Recommend that + Subject + base verb (recheck).',
    whyCorrect: 'Setelah kata kerja rekomendasi ("recommended that..."), kata kerja selanjutnya menggunakan bentuk dasar (bare infinitive) murni tanpa akhiran-s ("recheck").',
    distractors: [
      { option: 'rechecked', reason: 'Salah bentuk past tense.' },
      { option: 'rechecks', reason: 'Salah karena klausa subjunctive tidak menggunakan akhiran -s pada orang ketiga tunggal.' },
      { option: 'is rechecking', reason: 'Salah tenses continuous.' },
    ],
    ruleOrFormula: 'Subjunctive: Recommend that + Subject + Base Verb (recheck).',
    maritimeContext: 'Verifikasi ulang perhitungan komputer stabilitas sebelum proses buang air ballast.',
  },
  'm4-g-08': {
    summary: 'Modal Deduksi Lampau Pasif: must have been + Past Participle (caused).',
    whyCorrect: '"must have been caused by" menyatakan kesimpulan logis pasti dari kejadian tumpahan kimia di masa lampau yang diakibatkan oleh selang bertekanan berlebih.',
    distractors: [
      { option: 'be causing', reason: 'Salah bentuk continuous aktif.' },
      { option: 'cause', reason: 'Salah bentuk dasar aktif.' },
      { option: 'have caused', reason: 'Salah bentuk aktif (tumpahan adalah akibat pasif, bukan pelaku penyebab).' },
    ],
    ruleOrFormula: 'Past Passive Deduction: Must have been + Past Participle (caused).',
    maritimeContext: 'Investigasi penyebab insiden tumpahan muatan kimia di geladak tanker.',
  },
  'm4-g-09': {
    summary: 'Bentuk kalimat syarat bersyarat pasif: Unless + Present Passive (is maintained).',
    whyCorrect: '"Unless" (kecuali jika) diikuti kalimat pasif bentuk Simple Present ("is maintained") untuk menyatakan syarat mutlak pembukaan ventilasi tangki.',
    distractors: [
      { option: 'will be maintained', reason: 'Salah karena klausa "unless" tidak boleh menggunakan auxiliary "will".' },
      { option: 'maintains', reason: 'Salah bentuk aktif.' },
      { option: 'would maintain', reason: 'Salah tenses conditional tipe 2.' },
    ],
    ruleOrFormula: 'Conditional: Unless + Present Passive (is maintained).',
    maritimeContext: 'Standar tekanan selimut gas nitrogen (Nitrogen Blanket) tangki muatan kimia.',
  },
  'm4-g-10': {
    summary: 'Konjungsi waktu diikuti participle clause: while + navigating.',
    whyCorrect: 'Konjungsi "while" dapat langsung diikuti bentuk present participle ("while navigating") untuk menyatakan dua peristiwa yang terjadi secara bersamaan.',
    distractors: [
      { option: 'during', reason: 'Salah karena "during" adalah preposisi yang wajib diikuti kata benda murni, bukan participle "navigating".' },
      { option: 'since', reason: 'Salah makna.' },
      { option: 'despite', reason: 'Salah makna dan fungsi.' },
    ],
    ruleOrFormula: 'Time Conjunction + Participle: While + V-ing.',
    maritimeContext: 'Hempasan ombak keras pada lambung kapal (slamming) saat melintasi kuadran berbahaya badai taifun.',
  },
  'm4-g-11': {
    summary: 'Correlative Inversion: No sooner had we completed... than...',
    whyCorrect: 'Frasa korelatif inversi masa lampau: "No sooner had we completed [A] than [B]" untuk menyatakan dua peristiwa yang terjadi bersusulan seketika.',
    distractors: [
      { option: 'we had completed', reason: 'Salah karena tidak menggunakan susunan inversi.' },
      { option: 'did we complete', reason: 'Salah pola tenses correlative inversi past perfect.' },
      { option: 'have we completed', reason: 'Salah tenses present perfect.' },
    ],
    ruleOrFormula: 'Correlative Inversion: No sooner + had + Subject + Verb 3 + than + Past Simple.',
    maritimeContext: 'Peningkatan kekuatan angin laut mendadak tepat setelah transfer Ship-to-Ship (STS) selesai.',
  },
  'm4-g-12': {
    summary: 'Subjunctive Mood: Demand that + Subject + be + Verb 3 (be repeated).',
    whyCorrect: 'Kata kerja "demanded that" mewajibkan bentuk subjunctive pasif menggunakan bare infinitive "be repeated".',
    distractors: [
      { option: 'is', reason: 'Salah bentuk indikatif present.' },
      { option: 'was', reason: 'Salah bentuk indikatif past.' },
      { option: 'to be', reason: 'Salah bentuk to-infinitive.' },
    ],
    ruleOrFormula: 'Subjunctive: Demand that + Subject + be + Verb 3.',
    maritimeContext: 'Permintaan surveyor untuk mengulang uji tekanan jalur pipa bunker di depan otoritas pelabuhan.',
  },
  'm4-g-13': {
    summary: 'Konjungsi kausal formal maritim: "inasmuch as" (karena / mengingat bahwa).',
    whyCorrect: '"inasmuch as" adalah kata hubung sebab-akibat formal yang bermakna "karena / disebabkan oleh" (because / since).',
    distractors: [
      { option: 'whereas', reason: 'Salah karena menyatakan perbandingan/kontras (sedangkan).' },
      { option: 'despite', reason: 'Salah karena preposisi pertentangan yang diikuti kata benda.' },
      { option: 'unless', reason: 'Salah karena bermakna "kecuali jika".' },
    ],
    ruleOrFormula: 'Formal Causal Conjunction: "inasmuch as" = because / since.',
    maritimeContext: 'Hilangnya kendali kemudi kapal akibat korsleting pemancar indikator sudut kemudi.',
  },
  'm4-g-14': {
    summary: 'Inversi pengandaian tipe 3 formal: Were + Subject + to have been + Complement.',
    whyCorrect: '"Were the Chief Engineer to have been present..." adalah bentuk inversi formal tingkat tinggi untuk Third Conditional (Setara dengan: "If the Chief Engineer had been present...").',
    distractors: [
      { option: 'present', reason: 'Bentuk inversi tipe 2 masa kini, tidak sinkron dengan klausa konsekuensi lampau "would have been".' },
      { option: 'being present', reason: 'Salah bentuk participle.' },
      { option: 'was present', reason: 'Salah struktur inversi.' },
    ],
    ruleOrFormula: 'Inverted Conditional: Were + Subject + to have been + Complement, Subject + would have + Verb 3.',
    maritimeContext: 'Evaluasi tanggap darurat saat terjadi pemadaman listrik total (blackout) di anjungan.',
  },
  'm4-g-15': {
    summary: 'Konjungsi waktu "until" untuk menyatakan syarat penyelesaian pengurasan tangki.',
    whyCorrect: '"until" (sampai/hingga) menyatakan batas waktu dan syarat bahwa surveyor menolak menerbitkan sertifikat sampai tangki slop benar-benar bersih dari residu.',
    distractors: [
      { option: 'while', reason: 'Salah makna (sementara).' },
      { option: 'since', reason: 'Salah makna (sejak/karena).' },
      { option: 'during', reason: 'Salah karena preposisi yang diikuti kata benda, bukan klausa.' },
    ],
    ruleOrFormula: 'Negative Action + until + Condition Met.',
    maritimeContext: 'Penerbitan Dry Certificate tangki slop kapal tanker setelah pengurasan residu tuntas.',
  },

  // Vocabulary & Specialized Tanker/IMDG (16-30)
  'm4-v-16': {
    summary: 'Fungsi katup pernapasan P/V (Pressure/Vacuum Valve) pada tangki muatan minyak.',
    whyCorrect: 'Katup P/V berfungsi mencegah bahaya tekanan lebih positif maupun tekanan hampa (vakum) berbahaya di dalam tangki muatan selama proses muat, berlayar, dan bongkar.',
    distractors: [
      { option: 'To inject compressed air into cargo stripping pumps', reason: 'Salah bukan sistem injeksi udara stripping.' },
      { option: 'To measure volatile organic compound emissions from accommodation chimneys', reason: 'Salah bukan pengukur emisi cerobong.' },
      { option: 'To separate slop oil from segregated ballast water', reason: 'Salah bukan pemisah minyak slop.' },
    ],
    maritimeContext: 'Sistem pengaman integritas struktur tangki muatan kapal tanker.',
  },
  'm4-v-17': {
    summary: 'Klasifikasi bahaya muatan Kode IMDG Kelas 3 (Flammable Liquids).',
    whyCorrect: 'IMDG Kelas 3 adalah klasifikasi barang berbahaya untuk Cairan Mudah Terbakar (Flammable Liquids) seperti minyak mentah, bensin, toluena, dan metanol.',
    distractors: [
      { option: 'Toxic and Infectious Substances', reason: 'Salah karena itu IMDG Kelas 6.' },
      { option: 'Radioactive Materials and isotopes', reason: 'Salah karena itu IMDG Kelas 7.' },
      { option: 'Corrosive Acids and alkaline liquids', reason: 'Salah karena itu IMDG Kelas 8.' },
    ],
    ruleOrFormula: 'IMDG Class 3 = Flammable Liquids (Cairan Mudah Terbakar).',
    maritimeContext: 'Klasifikasi pengangkutan barang berbahaya internasional Kode IMDG.',
  },
  'm4-v-18': {
    summary: 'Definisi batas ledak bawah (Lower Explosive Limit / LEL) campuran gas.',
    whyCorrect: 'LEL adalah konsentrasi uap hidrokarbon minimum di udara di mana di bawah kadar tersebut perambatan nyala api tidak dapat terjadi karena campuran terlalu miskin (too lean).',
    distractors: [
      { option: 'The maximum temperature at which liquid oil catches fire automatically', reason: 'Salah karena itu suhu nyala otomatis (Auto-ignition Temperature).' },
      { option: 'The maximum percentage of oxygen required for inert gas purging', reason: 'Salah bukan persentase oksigen.' },
      { option: 'The lowest atmospheric pressure at which gas condenses into liquid', reason: 'Salah tekanan pengembunan.' },
    ],
    maritimeContext: 'Keselamatan pengujian atmosfer gas tangki tanker (Gas Measurement & ISGOTT).',
  },
  'm4-v-19': {
    summary: 'Fenomena hidrodinamika efek Squat pada navigasi perairan dangkal.',
    whyCorrect: 'Efek Squat adalah pertambahan sarat kapal dan penurunan badan kapal secara keseluruhan (bodily sinkage) akibat percepatan aliran air di bawah lunas di perairan dangkal.',
    distractors: [
      { option: 'The sudden vibration of propeller blades when reversing engine', reason: 'Salah karena itu getaran kavitasi baling-baling.' },
      { option: 'The lateral suction towards a vertical canal bank', reason: 'Salah karena itu Bank Suction.' },
      { option: 'The loss of compass heading in narrow channels', reason: 'Salah bukan kehilangan haluan.' },
    ],
    maritimeContext: 'Olah gerak kapal dan keselamatan navigasi di perairan dangkal (Shallow Water Hydrodynamics).',
  },
  'm4-v-20': {
    summary: 'Arti istilah pengukuran tangki tertutup (Closed Gauging) di kapal tanker.',
    whyCorrect: 'Closed Gauging adalah proses pengukuran ullage, interface air-minyak, dan suhu tangki tanpa membuka tutup tangki dan tanpa melepaskan uap hidrokarbon berbahaya ke atmosfer terbuka.',
    distractors: [
      { option: 'Inspecting cargo holds with all hatch covers locked shut', reason: 'Salah bukan inspeksi palka curah.' },
      { option: 'Checking fuel oil density using a sealed hydrometer', reason: 'Salah bukan uji hidrometer tertutup.' },
      { option: 'Using manual dipsticks through open inspection ports', reason: 'Salah karena memakai lubang terbuka adalah Open Gauging.' },
    ],
    maritimeContext: 'Pengukuran muatan tertutup standar keselamatan dan lingkungan ISGOTT.',
  },
  'm4-v-21': {
    summary: 'Definisi dan dampak efek permukaan bebas (Free Surface Effect / FSE).',
    whyCorrect: 'FSE adalah pergerakan cairan pada tangki yang terisi sebagian (slack) yang menyebabkan kenaikan titik berat semu (virtual rise of G) dan menurunkan tinggi metasentra (GM) stabilitas kapal.',
    distractors: [
      { option: 'The cooling of deck plating exposed to freezing spray', reason: 'Salah pendinginan geladak.' },
      { option: 'The drag caused by barnacles on the underwater hull plating', reason: 'Salah hambatan teritip lambung (Fouling).' },
      { option: 'The reduction in wave impact on the bulbous bow', reason: 'Salah bukan reduksi ombak haluan.' },
    ],
    maritimeContext: 'Pengaruh tangki slack terhadap stabilitas melintang kapal.',
  },
  'm4-v-22': {
    summary: 'Setengah lingkaran berbahaya (Dangerous Semi-circle) badai tropis di Belahan Bumi Utara.',
    whyCorrect: 'Setengah lingkaran berbahaya di BBU terletak di sisi kanan lintasan badai, di mana kecepatan maju badai dan angin putar siklon saling memperkuat dan cenderung meniup kapal masuk ke jalur lintasan mata badai.',
    distractors: [
      { option: 'The left-hand side of the cyclone eye where barometric pressure is highest', reason: 'Salah karena sisi kiri adalah Navigable Semi-circle.' },
      { option: 'The calm center area where sea waves completely disappear', reason: 'Salah karena pusat badai adalah Mata Badai (Eye of Storm).' },
      { option: 'The outer fringe region beyond 500 nautical miles from the center', reason: 'Salah pinggiran luar badai.' },
    ],
    maritimeContext: 'Navigasi penghindaran badai tropis siklon/taifun di laut (TRS Evasion Strategy).',
  },
  'm4-v-23': {
    summary: 'Fungsi flens isolator (Insulating Flange) pada manifold muatan tanker.',
    whyCorrect: 'Flens isolator berfungsi memutus aliran arus listrik liar (stray currents) dan mencegah percikan listrik statis antara lambung kapal dan instalasi pipa darat terminal.',
    distractors: [
      { option: 'To insulate cryogenic gas lines from tropical ambient heat', reason: 'Salah bukan isolasi suhu kriogenik.' },
      { option: 'To increase maximum discharge pumping velocity', reason: 'Salah tidak meningkatkan kecepatan pompa.' },
      { option: 'To measure cargo flow rate using ultrasonic sensors', reason: 'Salah bukan flow meter ultrasonik.' },
    ],
    maritimeContext: 'Keselamatan koneksi manifold muatan tanker standar ISGOTT.',
  },
  'm4-v-24': {
    summary: 'Pencatatan buku catatan kargo zat cair berbahaya (MARPOL Annex II Cargo Record Book).',
    whyCorrect: 'Buku Catatan Kargo Annex II wajib mencatat seluruh riwayat pemuatan, transfer internal, pencucian awal (pre-wash), pembongkaran, dan pembersihan tangki zat kimia cair berbahaya.',
    distractors: [
      { option: 'The daily consumption of low-sulfur marine gas oil', reason: 'Salah karena itu dicatat di Oil Record Book Part I.' },
      { option: 'The collection and incineration of domestic plastic garbage', reason: 'Salah karena itu Garbage Record Book (Annex V).' },
      { option: 'The sounding of machinery bilge holding tanks', reason: 'Salah itu Oil Record Book Part I.' },
    ],
    maritimeContext: 'Kepatuhan pencatatan operasional pencegahan pencemaran kimia MARPOL Annex II.',
  },
  'm4-v-25': {
    summary: 'Fenomena hisapan tebing (Bank Suction) di alur sempit atau terusan.',
    whyCorrect: 'Bank Suction adalah fenomena di mana buritan kapal tersedot tertarik mendekati tebing terdekat akibat penurunan tekanan air berkecepatan tinggi di celah antara lambung dan tebing.',
    distractors: [
      { option: 'The bow is pushed violently into the mud bank', reason: 'Salah karena haluan justru tertolak menjauh (Bank Cushion).' },
      { option: 'The engine cooling water intake is blocked by river silt', reason: 'Salah bukan penyumbatan sea chest.' },
      { option: 'The anchor chain drags along the concrete canal revetment', reason: 'Salah bukan rantai jangkar menyeret tebing.' },
    ],
    maritimeContext: 'Efek hidrodinamika navigasi olah gerak kapal di alur terusan sempit (Canal Navigation).',
  },
  'm4-v-26': {
    summary: 'Definisi sistem baling-baling bilah putar (Controllable Pitch Propeller / CPP).',
    whyCorrect: 'CPP adalah sistem baling-baling di mana sudut bilah baling-baling dapat diatur untuk mengubah besar dan arah gaya dorong maju/mundur tanpa perlu membalikkan arah putaran mesin induk.',
    distractors: [
      { option: 'A propeller fitted with fixed contra-rotating twin blades', reason: 'Salah karena itu baling-baling kontra-rotasi ganda tetap.' },
      { option: 'A water-jet thruster mounted inside the bow bulb', reason: 'Salah bukan water jet haluan.' },
      { option: 'An emergency propeller powered solely by hydraulic motors', reason: 'Salah bukan baling-baling darurat.' },
    ],
    maritimeContext: 'Sistem penggerak propulsi baling-baling kapal modern.',
  },
  'm4-v-27': {
    summary: 'Definisi Titik Nyala (Flash Point) cairan minyak bumi.',
    whyCorrect: 'Titik Nyala adalah suhu cairan terendah di mana cairan melepaskan uap yang cukup untuk membentuk campuran yang dapat menyala di udara dekat permukaan bila terkena sumber api.',
    distractors: [
      { option: 'The temperature at which oil spontaneously bursts into flame without an ignition source', reason: 'Salah karena itu suhu swa-nyala (Auto-ignition Temperature).' },
      { option: 'The boiling point of heavy fuel oil in standard atmosphere', reason: 'Salah karena itu titik didih (Boiling Point).' },
      { option: 'The temperature at which paraffin wax solidifies inside cargo pipes', reason: 'Salah karena itu titik tuang/beku (Pour Point).' },
    ],
    maritimeContext: 'Karakteristik keselamatan bahaya kebakaran produk minyak dan kimia maritim.',
  },
  'm4-v-28': {
    summary: 'Kepanjangan ISGOTT dalam keselamatan kapal tanker minyak.',
    whyCorrect: 'ISGOTT adalah singkatan resmi dari "International Safety Guide for Oil Tankers and Terminals" (Panduan Keselamatan Internasional untuk Kapal Tanker Minyak dan Terminal).',
    distractors: [
      { option: 'International Standard Guidance on Tanker Traffic Operations', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Integrated System Guidance on Toxic Transport at Sea', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Inspection Safety Group for Offshore Terminal Towage', reason: 'Salah kepanjangan fiktif.' },
    ],
    maritimeContext: 'Buku pedoman standar operasional keselamatan kapal tanker minyak dunia.',
  },
  'm4-v-29': {
    summary: 'Proses terbentuknya Kabut Adveksi (Advection Fog) di laut.',
    whyCorrect: 'Kabut Adveksi terbentuk ketika massa udara hangat dan lembap bergerak melintasi permukaan laut yang lebih dingin, sehingga udara mendingin hingga mencapai titik embunnya dan mengembun.',
    distractors: [
      { option: 'Fog caused by night-time radiative cooling over tropical land masses', reason: 'Salah karena itu kabut radiasi (Radiation Fog).' },
      { option: 'Steam fog rising from volcanic hot springs in geothermal bays', reason: 'Salah karena itu kabut asap uap (Steam Fog).' },
      { option: 'Smog produced by diesel exhaust in busy shipping straits', reason: 'Salah bukan polusi asap kapal.' },
    ],
    maritimeContext: 'Meteorologi maritim dan pembentukan kabut tampak terbatas di laut.',
  },
  'm4-v-30': {
    summary: 'Definisi Tinggi Metasentra (GM) dalam kalkulasi stabilitas kapal.',
    whyCorrect: 'Tinggi Metasentra (GM) adalah jarak vertikal antara Titik Berat Kapal (G) dan Titik Metasentra Melintang (M), yang menjadi tolak ukur stabilitas awal kapal.',
    distractors: [
      { option: 'The total height of the bridge above the summer load waterline', reason: 'Salah karena itu tinggi jembatan (Air Draft).' },
      { option: 'The horizontal distance between the center of buoyancy and the center of flotation', reason: 'Salah bukan jarak horizontal B dan F.' },
      { option: 'The length of the ship underwater keel profile', reason: 'Salah bukan panjang lunas.' },
    ],
    maritimeContext: 'Parameter fundamental stabilitas kapal melintang SOLAS.',
  },

  // Time, Stability Calculations & Meteorology (31-40)
  'm4-t-31': {
    summary: 'Kalkulasi GM Cair / Fluid GM (KM 10.80 m, KG 9.60 m, FSC 0.25 m).',
    whyCorrect: 'GM Padat = KM (10.80 m) - KG (9.60 m) = 1.20 m. GM Cair (Fluid GM) = GM Padat (1.20 m) - Koreksi Permukaan Bebas FSC (0.25 m) = 0.95 meter.',
    distractors: [
      { option: '1.20 meters', reason: 'Salah karena belum dikurangi koreksi permukaan bebas (FSC).' },
      { option: '1.45 meters', reason: 'Salah karena FSC justru ditambahkan.' },
      { option: '0.70 meters', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Fluid GM = (KM - KG) - FSC = (10.80 - 9.60) - 0.25 = 0.95 Meters.',
    maritimeContext: 'Kalkulasi stabilitas awal kapal tanker dengan koreksi tangki slack.',
  },
  'm4-t-32': {
    summary: 'Kalkulasi waktu perubahan haluan 60° pada ROT 15°/menit.',
    whyCorrect: 'Waktu putar = Derajat Perubahan (60°) ÷ Kecepatan Putar (15°/menit) = 4,0 menit.',
    distractors: [
      { option: '3.5 minutes', reason: 'Salah hitung pembagian.' },
      { option: '5.0 minutes', reason: 'Salah hitung pembagian.' },
      { option: '2.5 minutes', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Time = Heading Change / Rate of Turn = 60 / 15 = 4.0 Minutes.',
    maritimeContext: 'Manuver olah gerak perubahan haluan presisi dengan autopilot rate of turn.',
  },
  'm4-t-33': {
    summary: 'Kalkulasi berat bersih muatan minyak (5.000 m³ × 0,850 t/m³ × VCF 0,9920).',
    whyCorrect: 'Berat Bersih Kargo = Volume (5.000 m³) × Densitas (0,850 t/m³) × VCF (0,9920) = 4.216,0 metrik ton.',
    distractors: [
      { option: '4,250.0 metric tonnes', reason: 'Salah karena belum dikalikan faktor koreksi volume (VCF).' },
      { option: '4,180.5 metric tonnes', reason: 'Salah hitung perkalian.' },
      { option: '4,320.0 metric tonnes', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Net Weight = Volume × Density × VCF = 5.000 × 0.850 × 0.9920 = 4.216.0 MT.',
    maritimeContext: 'Perhitungan kalkulasi muatan minyak kapal tanker (Ullage Calculation Sheet).',
  },
  'm4-t-34': {
    summary: 'Arti kecenderungan barometer turun 9 hPa dalam 3 jam (1014 ke 1005 hPa).',
    whyCorrect: 'Penurunan tekanan barometer lebih dari 3 hPa dalam 3 jam (terlebih 9 hPa) adalah indikasi pasti mendekatnya badai tropis ganas (TRS) atau depresi badai yang memerlukan tindakan penghindaran segera.',
    distractors: [
      { option: 'Normal diurnal atmospheric tidal variation', reason: 'Salah karena variasi pasang surut atmosfer normal hanya sekitar 1-2 hPa per hari.' },
      { option: 'Developing anticyclone with calm clear weather', reason: 'Salah karena antisiklon ditandai naiknya tekanan udara tinggi.' },
      { option: 'Instrument calibration error due to ship rolling', reason: 'Salah bukan galat instrumen.' },
    ],
    ruleOrFormula: 'Barometric Tendency: Drop > 3 hPa / 3 hours = Severe Storm / TRS Alert.',
    maritimeContext: 'Kewaspadaan meteorologi navigasi cuaca buruk di laut.',
  },
  'm4-t-35': {
    summary: 'Kalkulasi penambahan sarat rata-rata (Muat 900 MT bunker pada TPC 45.0).',
    whyCorrect: 'Penambahan sarat (Sinkage) = Berat Muatan (900 ton) ÷ TPC (45,0 ton/cm) = 20 cm = 0,20 meter.',
    distractors: [
      { option: '15 centimeters (0.15 m)', reason: 'Salah hitung pembagian.' },
      { option: '25 centimeters (0.25 m)', reason: 'Salah hitung pembagian.' },
      { option: '10 centimeters (0.10 m)', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Sinkage (cm) = Weight Loaded (Tonnes) / TPC = 900 / 45.0 = 20 cm = 0.20 m.',
    maritimeContext: 'Perhitungan penambahan sarat rata-rata kapal saat pengisian bahan bakar bunker.',
  },
  'm4-t-36': {
    summary: 'Evaluasi kadar oksigen gas lembam 4,2% O2 menurut standar SOLAS.',
    whyCorrect: 'Ya, dapat diterima karena SOLAS mewajibkan pasokan gas lembam dari generator memiliki kadar O2 maksimal di bawah 5% dan atmosfer tangki dijaga di bawah 8% O2.',
    distractors: [
      { option: 'No, oxygen content must be zero percent at all times', reason: 'Salah karena batas pasokan teknis adalah di bawah 5% O2.' },
      { option: 'No, oxygen level must exceed 10% to prevent gas polymerization', reason: 'Salah fatal karena O2 > 8% meningkatkan risiko ledakan tangki.' },
      { option: 'Yes, but only during ballast sea passage', reason: 'Salah berlaku untuk seluruh tahap operasional.' },
    ],
    ruleOrFormula: 'SOLAS Standard: Supply O2 ≤ 5%, Tank Atmosphere O2 ≤ 8%.',
    maritimeContext: 'Standar kadar oksigen inerting kapal tanker SOLAS Bab II-2.',
  },
  'm4-t-37': {
    summary: 'Konversi Diameter Taktis 4,2 cable ke satuan meter (1 cable = 185,2 m).',
    whyCorrect: 'Diameter Taktis = 4,2 cable × 185,2 meter/cable = 777,84 meter.',
    distractors: [
      { option: '648.2 meters', reason: 'Salah hitung perkalian (3.5 cable).' },
      { option: '850.0 meters', reason: 'Salah hitung perkalian.' },
      { option: '555.6 meters', reason: 'Salah hitung perkalian (3.0 cable).' },
    ],
    ruleOrFormula: 'Tactical Diameter = 4.2 × 185.2 m = 777.8 Meters.',
    maritimeContext: 'Data lingkaran putar olah gerak kapal pada poster anjungan (Maneuvering Booklet).',
  },
  'm4-t-38': {
    summary: 'Kalkulasi Dock Water Allowance / DWA (FWA 200 mm, Densitas Air Dok 1.020 t/m³).',
    whyCorrect: 'DWA = FWA × (1.025 - Densitas Dok) ÷ 25 = 200 × (1.025 - 1.020) ÷ 25 = 200 × 5 ÷ 25 = 40 mm (0,04 meter).',
    distractors: [
      { option: '50 mm (0.05 m)', reason: 'Salah hitung perkalian pembagian.' },
      { option: '80 mm (0.08 m)', reason: 'Salah hitung perkalian pembagian.' },
      { option: '25 mm (0.025 m)', reason: 'Salah hitung perkalian pembagian.' },
    ],
    ruleOrFormula: 'DWA = FWA × (1.025 - Dock Density) / 25 = 200 × 5 / 25 = 40 mm.',
    maritimeContext: 'Koreksi sarat air payau pelabuhan (Dock Water Allowance).',
  },
  'm4-t-39': {
    summary: 'Kalkulasi durasi bongkar muatan 12.000 m³ pada laju 1.500 m³/jam.',
    whyCorrect: 'Waktu pembongkaran = Volume (12.000 m³) ÷ Laju Pompa (1.500 m³/jam) = 8,0 jam.',
    distractors: [
      { option: '7.5 hours', reason: 'Salah hitung pembagian.' },
      { option: '9.0 hours', reason: 'Salah hitung pembagian.' },
      { option: '6.5 hours', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Discharge Time = Total Volume / Pumping Rate = 12.000 / 1.500 = 8.0 Hours.',
    maritimeContext: 'Rencana waktu pembongkaran kargo minyak kapal tanker (Cargo Discharge Plan).',
  },
  'm4-t-40': {
    summary: 'Kalkulasi penurunan Squat di perairan terbuka (Cb = 0,80, Kecepatan V = 15 knot).',
    whyCorrect: 'Squat = Cb × V² ÷ 100 = 0,80 × (15)² ÷ 100 = 0,80 × 225 ÷ 100 = 1,80 meter.',
    distractors: [
      { option: '1.20 meters', reason: 'Salah hitung kuadrat kecepatan.' },
      { option: '0.90 meters', reason: 'Salah hitung pembagian.' },
      { option: '2.25 meters', reason: 'Salah karena tidak dikalikan nilai Cb.' },
    ],
    ruleOrFormula: 'Open Water Squat = Cb × V² / 100 = 0.80 × 225 / 100 = 1.80 Meters.',
    maritimeContext: 'Perhitungan penurunan badan kapal (squat) akibat laju kecepatan di perairan dangkal.',
  },

  // Reading Comprehension & Case Studies (41-50)
  'm4-r-41': {
    summary: 'Penyebab utama ledakan kapal tanker kimia pada laporan investigasi.',
    whyCorrect: 'Kegagalan kritis terjadi karena tim memasukkan mesin pencuci tangki tanpa pembumian kawat (ungrounded) ke dalam atmosfer tangki yang mudah terbakar dan belum di-inert, menimbulkan lucutan percikan listrik statis.',
    distractors: [
      { option: 'Failure of the main propulsion turbocharger bearing', reason: 'Salah tidak terkait bantalan turbocharger.' },
      { option: 'Over-pressurization of the deck steam heater', reason: 'Salah bukan pemanas uap geladak.' },
      { option: 'Contamination of bunker fuel with biological sediment', reason: 'Salah bukan kontaminasi bunker.' },
    ],
    maritimeContext: 'Analisis keselamatan pembersihan tangki kimia dan pencegahan bahaya elektrostatik.',
  },
  'm4-r-42': {
    summary: 'Kondisi lingkungan batas penghentian operasi alih muat Ship-to-Ship (STS).',
    whyCorrect: 'Operasi STS wajib dihentikan segera jika tinggi gelombang melebihi 2,5 m, kecepatan angin melebihi 25 knot, atau tegangan tali tambat mencapai 50% beban putus minimum (MBL).',
    distractors: [
      { option: 'Only when dense fog reduces visibility to zero', reason: 'Salah karena batasan angin, gelombang, dan tegangan tali adalah faktor utama.' },
      { option: 'When cargo discharge rate falls below 500 m³/hr', reason: 'Salah bukan karena laju pompa turun.' },
      { option: 'Whenever the bunker barge arrives in the vicinity', reason: 'Salah bukan kedatangan tongkang bunker.' },
    ],
    maritimeContext: 'Batasan parameter lingkungan keselamatan transfer muatan antar kapal (STS Operations).',
  },
  'm4-r-43': {
    summary: 'Pihak yang wajib menandatangani pengesahan (Countersign) setiap halaman Oil Record Book Part II.',
    whyCorrect: 'Regulasi MARPOL Annex I mewajibkan setiap halaman Buku Catatan Minyak Bagian II yang telah selesai diisi untuk ditandatangani pengesahan oleh Nakhoda kapal (The Master of the vessel).',
    distractors: [
      { option: 'The port state control inspector', reason: 'Salah karena inspektur PSC hanya memeriksa dan memaraf saat inspeksi pelabuhan.' },
      { option: 'The shore bunker surveyor', reason: 'Salah bukan surveyor darat.' },
      { option: 'The chief radio operator', reason: 'Salah bukan perwira radio.' },
    ],
    maritimeContext: 'Kepatuhan administrasi hukum MARPOL Annex I Oil Record Book.',
  },
  'm4-r-44': {
    summary: 'Alasan penutupan ventilasi akomodasi saat terjadi tumpahan cairan benzena.',
    whyCorrect: 'Ventilasi akomodasi segera ditutup dan disirkulasikan internal untuk mencegah masuknya uap hidrokarbon benzena yang sangat beracun dan karsinogenik ke dalam ruang hunian awak kapal.',
    distractors: [
      { option: 'To reduce electrical power load on auxiliary generators', reason: 'Salah bukan untuk penghematan listrik.' },
      { option: 'To maintain air conditioning temperature at 21 degrees Celsius', reason: 'Salah bukan pengaturan suhu.' },
      { option: 'To prevent sea spray from entering the galley exhaust', reason: 'Salah bukan mencegah percikan air laut.' },
    ],
    maritimeContext: 'Tanggap darurat tumpahan zat kimia beracun Kode IBC.',
  },
  'm4-r-45': {
    summary: 'Konsep BRM yang dilanggar saat perwira junior ragu mengingatkan kesalahan Nakhoda.',
    whyCorrect: 'Konsep ketegasan (Assertiveness) dan budaya saling mengingatkan (challenge culture) terhambat oleh adanya jurang wewenang senioritas yang kaku (steep authority gradient).',
    distractors: [
      { option: 'Radar clutter suppression adjustment', reason: 'Salah bukan penyetelan clutter radar.' },
      { option: 'Tide height calculation accuracy', reason: 'Salah bukan hitungan pasang surut.' },
      { option: 'Engine remote telegraph response', reason: 'Salah bukan telegraf mesin.' },
    ],
    maritimeContext: 'Manajemen Sumber Daya Anjungan (Bridge Resource Management - BRM).',
  },
  'm4-r-46': {
    summary: 'Arah haluan angin relatif saat menghindar di Setengah Lingkaran Navigasi (BBU).',
    whyCorrect: 'Di Setengah Lingkaran Navigasi (Navigable Semi-circle) Belahan Bumi Utara, kapal harus menempatkan angin pada lambung kanan belakang (starboard quarter, sekitar 135° relatif) dan berlayar dengan kecepatan terbaik menjauhi pusat badai.',
    distractors: [
      { option: 'Wind directly on the bow stem (000° relative)', reason: 'Salah karena menempatkan angin di haluan depan dilakukan di Dangerous Semi-circle.' },
      { option: 'Wind on the port beam (270° relative)', reason: 'Salah bukan lambung kiri.' },
      { option: 'Wind directly on the center stern (180° relative)', reason: 'Salah bukan tepat di buritan.' },
    ],
    ruleOrFormula: 'Northern Hemisphere Navigable Semi-circle: Keep wind on Starboard Quarter (135°).',
    maritimeContext: 'Strategi olah gerak navigasi penghindaran badai taifun/siklon tropis.',
  },
  'm4-r-47': {
    summary: 'Batas kecepatan maksimal kapal VLCC saat mendekati SPM buoy dalam jarak 100 meter.',
    whyCorrect: 'Pemberitahuan pelabuhan menetapkan batas kecepatan olah gerak saat berada dalam jarak 100 meter dari SPM adalah kurang dari 0,2 knot (less than 0.2 knots) untuk mencegah kerusakan fasilitas tambat.',
    distractors: [
      { option: 'Less than 1.5 knots', reason: 'Salah terlalu cepat untuk jarak 100 meter.' },
      { option: 'Less than 3.0 knots', reason: 'Salah sangat berisiko menabrak buoy.' },
      { option: 'Zero speed (stop engine)', reason: 'Salah karena kapal tetap membutuhkan daya kemudi lambat.' },
    ],
    maritimeContext: 'Prosedur navigasi sandar fasilitas tambat Single Point Mooring (SPM).',
  },
  'm4-r-48': {
    summary: 'Kriteria batas pH minimum air buangan pencuci scrubber (EGCS) MARPOL Annex VI.',
    whyCorrect: 'Regulasi MARPOL Annex VI menetapkan air buangan sistem scrubber terbuka (Open-loop EGCS) wajib memiliki nilai keasaman pH tidak kurang dari 6,5 pada jarak 4 meter dari titik pembuangan lambung saat kapal diam.',
    distractors: [
      { option: 'pH not less than 8.0', reason: 'Salah batas nilai pH.' },
      { option: 'pH exactly 7.0 neutral', reason: 'Salah batas nilai pH.' },
      { option: 'pH not less than 5.0', reason: 'Salah karena pH < 6.5 terlalu asam dan merusak ekosistem laut.' },
    ],
    maritimeContext: 'Standar lingkungan pembuangan air scrubber MARPOL Annex VI.',
  },
  'm4-r-49': {
    summary: 'Kompensasi yang dilindungi oleh klausul SCOPIC pada kontrak penyelamatan LOF.',
    whyCorrect: 'Klausul SCOPIC melindungi dan menjamin pembayaran biaya serta imbalan bagi penyelamat (salvor) atas tindakan pencegahan atau penekanan kerusakan lingkungan laut terlepas dari berhasil tidaknya penyelamatan harta benda kapal/kargo.',
    distractors: [
      { option: 'The shipowner right to abandon cargo without notice', reason: 'Salah bukan hak pemilik kapal menelantarkan muatan.' },
      { option: 'Port authority harbor dockage fees', reason: 'Salah bukan biaya sandar pelabuhan.' },
      { option: 'Crew overtime compensation during towing', reason: 'Salah bukan upah lembur awak.' },
    ],
    maritimeContext: 'Hukum maritim kontrak penyelamatan kapal Lloyd\'s Open Form (LOF) & SCOPIC.',
  },
  'm4-r-50': {
    summary: 'Durasi minimal perbekalan keselamatan bertahan hidup kelompok (SOLAS Polar Code).',
    whyCorrect: 'Kode Polar SOLAS Bab 11 menetapkan peralatan keselamatan bertahan hidup kelompok (Personal Survival Kits / PSKs) wajib menjamin perbekalan bertahan hidup minimal selama 5 hari setelah meninggalkan kapal di es/daratan.',
    distractors: [
      { option: '3 days', reason: 'Salah durasi hari.' },
      { option: '7 days', reason: 'Salah durasi hari.' },
      { option: '14 days', reason: 'Salah durasi hari.' },
    ],
    ruleOrFormula: 'Polar Code Survival Standard: Minimum 5 days survival provisions.',
    maritimeContext: 'Standar keselamatan pelayaran di perairan kutub es (Polar Waters).',
  },

  // Listening & Crisis VHF IMO SMCP (51-60)
  'm4-l-51': {
    summary: 'Laporan siaran estafet darurat MAYDAY RELAY dari MV Atlantic Pioneer.',
    whyCorrect: 'Pancaran radio mengabarkan kapal nelayan Sea Hawk terbalik dengan 6 orang korban di air tanpa rakit penyelamat di posisi 07-45N 105-18E, dan MV Atlantic Pioneer sedang melaju menuju lokasi untuk menyelamatkan.',
    distractors: [
      { option: 'Atlantic Pioneer has suffered structural hull damage and is sinking', reason: 'Salah karena Atlantic Pioneer adalah kapal penyelamat, bukan korban.' },
      { option: 'Sea Hawk is requesting bunker fuel transfer at anchorage', reason: 'Salah bukan permintaan bahan bakar.' },
      { option: 'VTS is warning of unexploded ordnance in position 07-45N', reason: 'Salah bukan ranjau laut.' },
    ],
    maritimeContext: 'Prosedur pancaran berita estafet marabahaya maritim MAYDAY RELAY.',
  },
  'm4-l-52': {
    summary: 'Perintah darurat penghentian transfer muatan alih muat Ship-to-Ship (STS).',
    whyCorrect: 'Superintendent memerintahkan penghentian darurat ESD 1 seketika, menghentikan pompa muatan, serta melakukan purging dan pengurasan selang transfer karena angin mencapai 38 knot dan daprah utama kempis tertekan.',
    distractors: [
      { option: 'Increase pumping rate to finish transfer before storm intensifies', reason: 'SANGAT BERBAHAYA! Menambah pompa saat daprah kempis dapat merobek lambung kedua kapal.' },
      { option: 'Cast off all mooring lines while cargo is still flowing', reason: 'Salah fatal melepas tali saat selang minyak masih mengalir.' },
      { option: 'Anchor both vessels in tandem formation', reason: 'Salah bukan formasi labuh jangkar.' },
    ],
    maritimeContext: 'Prosedur penghentian darurat pemindahan muatan Ship-to-Ship (STS Emergency Stop).',
  },
  'm4-l-53': {
    summary: 'Instruksi medis wajib TMAS untuk penanganan korban luka bakar cipratan soda api.',
    whyCorrect: 'Dokter TMAS menginstruksikan pembilasan mata korban dengan cairan infus saline steril terus-menerus selama minimal 30 menit dan menyiapkan prosedur evakuasi medis helikopter.',
    distractors: [
      { option: 'Apply petroleum jelly and bandage eyes with tight gauze', reason: 'SANGAT BERBAHAYA! Mengoleskan petroleum jelly pada luka bakar kimia basa memerangkap bahan kimia dan merusak kornea permanen.' },
      { option: 'Give patient hot black coffee and induce vomiting', reason: 'Salah penanganan medis.' },
      { option: 'Keep patient working in engine room under shade', reason: 'Salah penanganan medis.' },
    ],
    maritimeContext: 'Pertolongan pertama luka bakar bahan kimia Telemedical Maritime Advice Service (TMAS).',
  },
  'm4-l-54': {
    summary: 'Alasan penutupan jalur alur pelayaran dalam oleh VTS Selat Malaka.',
    whyCorrect: 'Alur pelayaran dalam antara One Fathom Bank dan Cape Rachado ditutup untuk seluruh kapal karena terjadi insiden kapal tanker kandas dan sedang berlangsung operasi aktif penanggulangan tumpahan minyak.',
    distractors: [
      { option: 'Naval gunnery firing exercise in international waters', reason: 'Salah bukan latihan tembak angkatan laut.' },
      { option: 'High density passenger ferry traffic during holiday season', reason: 'Salah bukan padatnya kapal feri.' },
      { option: 'Underwater telecommunication cable maintenance', reason: 'Salah bukan pemeliharaan kabel bawah laut.' },
    ],
    maritimeContext: 'Pemberitahuan darurat penutupan alur navigasi maritim VTS Selat Malaka.',
  },
  'm4-l-55': {
    summary: 'Syarat kontrak penyelamatan yang diajukan kapal tunda penyelamat Tug Ocean Titan.',
    whyCorrect: 'Kapal tunda menawarkan bantuan penyelamatan maritim dengan ketentuan kontrak standar internasional Lloyd\'s Open Form (LOF 2020) yang mengikutsertakan klausul perlindungan lingkungan SCOPIC.',
    distractors: [
      { option: 'Daily lump-sum commercial towing charter without liability', reason: 'Salah bukan carter harian biasa.' },
      { option: 'Port authority statutory wreck removal decree', reason: 'Salah bukan penetapan pengangkatan bangkai kapal.' },
      { option: 'Insurance total constructive loss abandonment', reason: 'Salah bukan pelepasan klaim asuransi.' },
    ],
    maritimeContext: 'Komunikasi kesepakatan kontrak penyelamatan kapal darurat di laut.',
  },
  'm4-l-56': {
    summary: 'Laju pengisian muatan saat topping off pada dua tangki kargo terakhir.',
    whyCorrect: 'Loading master terminal menginstruksikan pengurangan laju muat saat topping off pada dua tangki kargo terakhir menjadi 800 m³/jam (eight zero zero m³/hr).',
    distractors: [
      { option: '3,500 m³/hr', reason: 'Salah karena 3.500 m³/jam adalah laju muat borong maksimal.' },
      { option: '1,500 m³/hr', reason: 'Salah nilai laju.' },
      { option: '500 m³/hr', reason: 'Salah nilai laju.' },
    ],
    maritimeContext: 'Prosedur topping off pengisian tangki kapal tanker di terminal minyak.',
  },
  'm4-l-57': {
    summary: 'Haluan dan laju kapal yang diminta helikopter SAR saat evakuasi Hi-Line Transfer.',
    whyCorrect: 'Helikopter menginstruksikan kapal mempertahankan haluan 090 derajat Sejati (Course 090° True) dengan kecepatan stabil 12 knot.',
    distractors: [
      { option: 'Course 270° True at 6 knots', reason: 'Salah haluan dan kecepatan.' },
      { option: 'Course 180° True at 15 knots', reason: 'Salah haluan dan kecepatan.' },
      { option: 'Course 000° True with stopped engine', reason: 'Salah mesin tidak boleh dihentikan saat operasi winch.' },
    ],
    maritimeContext: 'Prosedur evakuasi udara kawat penuntun (Helicopter Hi-Line Rescue).',
  },
  'm4-l-58': {
    summary: 'Dua hal yang diverifikasi petugas karantina kesehatan pelabuhan (Port Health).',
    whyCorrect: 'Petugas karantina memverifikasi ketiadaan gejala penyakit menular pada seluruh awak kapal dan masa berlaku Sertifikat Bebas Sanitasi Kapal / Bebas Tikus (Deratting/SSCEC).',
    distractors: [
      { option: 'Engine oil sulfur analysis report and bilge water records', reason: 'Salah karena itu pemeriksaan PSC MARPOL.' },
      { option: 'Customs import duty bond and cash declarations', reason: 'Salah karena itu pemeriksaan Bea Cukai (Customs).' },
      { option: 'Lifeboat davit annual proof-load certificates', reason: 'Salah karena itu sertifikat keselamatan SOLAS.' },
    ],
    maritimeContext: 'Pemeriksaan karantina kesehatan pelabuhan (Maritime Declaration of Health).',
  },
  'm4-l-59': {
    summary: 'Perintah olah gerak darurat anti-tubrukan dari VTS kepada MV Northern Light.',
    whyCorrect: 'VTS memerintahkan kapal segera merubah haluan ke kanan menuju haluan 080 derajat dan menambah kecepatan penuh (full speed ahead) karena kapal di lambung kanan tidak mengambil tindakan pencegahan.',
    distractors: [
      { option: 'Stop engines and reverse full astern', reason: 'Salah bukan mundur penuh.' },
      { option: 'Alter course to port heading 260°', reason: 'Salah karena dilarang merubah haluan ke kiri.' },
      { option: 'Sound one prolonged blast and maintain course', reason: 'Salah karena situasi mendesak mengharuskan olah gerak menghindar segera.' },
    ],
    maritimeContext: 'Instruksi olah gerak darurat pencegahan tubrukan dari operator VTS.',
  },
  'm4-l-60': {
    summary: 'Status kesiapan mesin induk dari Kepala Kamar Mesin pasca pemulihan blackout.',
    whyCorrect: 'Kepala Kamar Mesin melaporkan suplai listrik bantu telah pulih tersinkronisasi, pompa pendingin air laut bekerja normal, dan mesin induk siap dihidupkan ulang dalam 5 menit.',
    distractors: [
      { option: 'Main engine permanently disabled, require ocean salvage tug', reason: 'Salah mesin tidak rusak permanen.' },
      { option: 'Emergency generator fire has destroyed switchboard', reason: 'Salah genset bekerja normal.' },
      { option: 'Main engine already running at full sea speed', reason: 'Salah mesin belum berjalan penuh.' },
    ],
    maritimeContext: 'Prosedur pemulihan kelistrikan dan permesinan pasca blackout di kamar mesin.',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 5 (All 60 Questions)
const TEST_5_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm5-g-01': {
    summary: 'Concession Preposition: Notwithstanding + Noun Phrase, Subject + Past Simple Verb (maintained).',
    whyCorrect: '"Notwithstanding" (Meskipun/Kendati) adalah preposisi konsesi yang diikuti frasa benda ("the 3.5-meter swell") dan klausa utama bentuk lampau ("maintained position").',
    distractors: [
      { option: 'is maintaining', reason: 'Salah tenses present continuous.' },
      { option: 'was maintain', reason: 'Salah struktur tata bahasa baku.' },
      { option: 'maintaining', reason: 'Salah karena kalimat memerlukan kata kerja predikat utama (finite verb).' },
    ],
    ruleOrFormula: 'Concession: Notwithstanding + Noun Phrase, Subject + Past Simple Verb.',
    maritimeContext: 'Kemampuan kapal AHTS mempertahankan posisi saat olah gerak penanganan jangkar di laut bergelombang.',
  },
  'm5-g-02': {
    summary: 'Correlative Conjunction: Neither [A] nor [B].',
    whyCorrect: 'Pasangan kata hubung korelatif baku untuk "Neither" adalah "nor" (Neither the laser reference sensor nor the acoustic transponder).',
    distractors: [
      { option: 'or', reason: 'Salah karena "or" berpasangan dengan "Either".' },
      { option: 'and', reason: 'Salah pasangan kata hubung korelatif.' },
      { option: 'also', reason: 'Salah penggunaan konjungsi.' },
    ],
    ruleOrFormula: 'Correlative Conjunction: Neither [A] nor [B].',
    maritimeContext: 'Kegagalan simultan sensor referensi posisi laser dan transponder akustik kapal DP saat cuaca buruk.',
  },
  'm5-g-03': {
    summary: 'Pola kata kerja: Avoid + Gerund (running).',
    whyCorrect: 'Kata kerja "avoid" (menghindari) wajib diikuti bentuk gerund (V-ing): avoided + running.',
    distractors: [
      { option: 'to run', reason: 'Salah karena "avoid" tidak boleh diikuti to-infinitive.' },
      { option: 'run', reason: 'Salah bare infinitive.' },
      { option: 'to running', reason: 'Salah bentuk gramatikal.' },
    ],
    ruleOrFormula: 'Verb Pattern: Avoid + Gerund (V-ing).',
    maritimeContext: 'Prosedur keselamatan penghentian thruster buritan saat penyelam komersial bekerja di dekat manifold dasar laut.',
  },
  'm5-g-04': {
    summary: 'Susunan baku instruksi darurat maritim lepas pantai (Prepositional Condition).',
    whyCorrect: 'Susunan baku instruksi darurat maritim: Conditional Prepositional Phrase (In the event of a catastrophic thruster failure) + Koma + Main Clause (the DPO must immediately initiate Yellow Alert status).',
    distractors: [
      { option: 'The DPO must immediately initiate Yellow Alert status in the event of a catastrophic thruster failure.', reason: 'Kurang formal untuk format penulisan SOP instruksi kedaruratan maritim.' },
    ],
    ruleOrFormula: 'In the event of + Noun Phrase, Subject + Modal + Adverb + Verb + Object.',
    maritimeContext: 'Prosedur aktivasi status Yellow Alert seketika saat terjadi kegagalan thruster fatal pada sistem DP.',
  },
  'm5-g-05': {
    summary: 'Pola adjektiva "incapable of + gerund" dan konjungsi waktu "after + clause".',
    whyCorrect: 'Kata sifat "incapable" berpasangan tetap dengan preposisi "of" (incapable of maintaining), dan konjungsi "after" menghubungkan urutan waktu peristiwa.',
    distractors: [
      { option: 'for, while', reason: 'Salah pasangan preposisi "incapable".' },
      { option: 'to, since', reason: 'Salah pasangan preposisi "incapable".' },
      { option: 'in, during', reason: 'Salah preposisi dan konjungsi.' },
    ],
    ruleOrFormula: 'Adjective Pattern: Incapable of + Gerund; Conjunction: After + Clause.',
    maritimeContext: 'Hilangnya kemampuan stasioner kapal DP akibat terbukanya sakelar bus-tie switchboard listrik utama.',
  },
  'm5-g-06': {
    summary: 'Inverted Third Conditional Passive: Had + Subject + been + Verb 3 (been positioned).',
    whyCorrect: '"Had the standby vessel been positioned closer..." adalah bentuk pengandaian lampau pasif tanpa "If" (Setara dengan: "If the standby vessel had been positioned...").',
    distractors: [
      { option: 'positioned', reason: 'Salah bentuk aktif.' },
      { option: 'was positioned', reason: 'Salah struktur inversi past perfect.' },
      { option: 'had positioned', reason: 'Salah bentuk dan struktur.' },
    ],
    ruleOrFormula: 'Inverted 3rd Conditional Passive: Had + Subject + been + Verb 3.',
    maritimeContext: 'Evaluasi penempatan kapal siaga (Standby Vessel) di sekitar anjungan produksi lepas pantai.',
  },
  'm5-g-07': {
    summary: 'Subjunctive Mood: Request that + Subject + bare verb (vacate).',
    whyCorrect: 'Setelah kata kerja permohonan resmi ("requested that..."), kata kerja selanjutnya menggunakan bentuk dasar (bare infinitive) murni "vacate".',
    distractors: [
      { option: 'vacated', reason: 'Salah bentuk past tense.' },
      { option: 'vacates', reason: 'Salah bentuk orang ketiga tunggal.' },
      { option: 'are vacating', reason: 'Salah bentuk continuous.' },
    ],
    ruleOrFormula: 'Subjunctive Mood: Request that + Subject + Base Verb (vacate).',
    maritimeContext: 'Instruksi pengosongan geladak kargo selama operasi pengangkatan muatan berat dengan derek anjungan.',
  },
  'm5-g-08': {
    summary: 'Perfect Infinitive Pasif: is reported to have performed flawlessly.',
    whyCorrect: '"is reported to have performed flawlessly" menyatakan pelaporan resmi atas keberhasilan kinerja uji coba DP yang telah selesai terlaksana di masa lampau.',
    distractors: [
      { option: 'to perform flawlessly', reason: 'Salah tenses (present infinitive tidak menyatakan penyelesaian masa lalu).' },
      { option: 'performing flawlessly', reason: 'Salah bentuk gerund.' },
      { option: 'performed flawlessly', reason: 'Salah struktur kata kerja.' },
    ],
    ruleOrFormula: 'Passive Reporting: Subject + is reported + to have + Verb 3 + Adverb.',
    maritimeContext: 'Laporan hasil uji coba tahunan sistem Dynamic Positioning tanpa kegagalan titik tunggal (SPOF).',
  },
  'm5-g-09': {
    summary: 'Syarat keselamatan mutlak: Negative Action + unless + Condition Engaged.',
    whyCorrect: '"unless" (kecuali jika) menyatakan syarat keselamatan mutlak bahwa kru dilarang masuk geladak kerja sebelum pin dan shark jaws terkunci sempurna.',
    distractors: [
      { option: 'despite', reason: 'Salah karena preposisi yang diikuti kata benda, bukan klausa.' },
      { option: 'because', reason: 'Salah hubungan logika.' },
      { option: 'although', reason: 'Salah makna pertentangan.' },
    ],
    ruleOrFormula: 'Safety Conditional: Negative Action + unless + Safety Condition Engaged.',
    maritimeContext: 'Prosedur keselamatan geladak kerja penanganan jangkar AHTS (Shark Jaws & Towing Pins).',
  },
  'm5-g-10': {
    summary: 'Participle Clause menyatakan hasil otomatis: Main Clause + "," + V-ing (neutralizing).',
    whyCorrect: '"neutralizing..." adalah present participle clause yang menyatakan efek atau akibat langsung dari cara kerja sistem elektro-klorinasi dalam mematikan organisme air.',
    distractors: [
      { option: 'neutralized', reason: 'Salah past participle pasif.' },
      { option: 'neutralize', reason: 'Salah bare infinitive.' },
      { option: 'to neutralize', reason: 'Kurang tepat untuk menyatakan hasil kerja yang sedang berlangsung otomatis.' },
    ],
    ruleOrFormula: 'Result Participle Clause: Main Clause + "," + V-ing (neutralizing).',
    maritimeContext: 'Prinsip pemusnahan mikroorganisme air ballast dengan sistem elektro-klorinasi (BWMS).',
  },
  'm5-g-11': {
    summary: 'Negative Adverb Inversion: Little + did + Subject + Verb 1 (realize).',
    whyCorrect: 'Kata keterangan bernilai negatif "Little" di awal kalimat memicu inversi kata bantu lampau "did" + Subjek + Kata kerja dasar "realize".',
    distractors: [
      { option: 'was', reason: 'Salah karena diikuti kata kerja dasar "realize".' },
      { option: 'had', reason: 'Salah karena had memerlukan past participle (realized).' },
      { option: 'were', reason: 'Salah agreement dan struktur.' },
    ],
    ruleOrFormula: 'Negative Inversion: Little + did + Subject + Verb 1 (realize).',
    maritimeContext: 'Deteksi kerusakan sensor tekanan rel bahan bakar rendah di kamar mesin kapal offshore.',
  },
  'm5-g-12': {
    summary: 'Pola preposisi diikuti kata benda objek dan gerund: insist on + Noun + V-ing (moving).',
    whyCorrect: 'Preposisi "on" diikuti frasa objek nama kapal dan bentuk gerund: insisted on + [the supply vessel] + moving.',
    distractors: [
      { option: 'to move', reason: 'Salah to-infinitive setelah preposisi "on".' },
      { option: 'moved', reason: 'Salah past tense.' },
      { option: 'move', reason: 'Salah bare infinitive.' },
    ],
    ruleOrFormula: 'Prepositional Object + Gerund: Insist on + Noun + V-ing.',
    maritimeContext: 'Perintah Pengawas Rig agar kapal pasokan segera keluar dari zona keselamatan 500m akibat angin kencang 45 knot.',
  },
  'm5-g-13': {
    summary: 'Frasa preposisi formal maritim: "by virtue of" (berkat / atas dasar / karena).',
    whyCorrect: '"by virtue of" adalah frasa formal maritim yang bermakna "karena / atas dasar / berkat" (because of / by reason of).',
    distractors: [
      { option: 'in spite of', reason: 'Salah karena bermakna "meskipun" (pertentangan).' },
      { option: 'in case of', reason: 'Salah karena bermakna "dalam hal jika" (kondisional).' },
      { option: 'for the sake of', reason: 'Salah makna (demi).' },
    ],
    ruleOrFormula: 'Formal Prepositional Phrase: "by virtue of" = because of / by reason of.',
    maritimeContext: 'Pemberian kontrak sewa kapal offshore atas dasar peringkat intensitas karbon terendah.',
  },
  'm5-g-14': {
    summary: 'Inverted First Conditional: Should + Subject + be + Verb 3 (be lost).',
    whyCorrect: '"Should the DGPS differential correction link be lost..." adalah inversi conditional tipe 1 dengan auxiliary "Should" yang diikuti bare infinitive "be".',
    distractors: [
      { option: 'is', reason: 'Salah karena modal "Should" wajib diikuti kata kerja dasar murni (be).' },
      { option: 'was', reason: 'Salah bentuk past.' },
      { option: 'are', reason: 'Salah bentuk indikatif.' },
    ],
    ruleOrFormula: 'Inverted Conditional: Should + Subject + be + Verb 3.',
    maritimeContext: 'Peralihan otomatis sistem DP ke referensi akustik jika sinyal koreksi DGPS terputus.',
  },
  'm5-g-15': {
    summary: 'Pola preposisi diikuti gerund: for + anticipating.',
    whyCorrect: 'Setelah preposisi "for", kata kerja wajib menggunakan bentuk gerund (V-ing): for + anticipating.',
    distractors: [
      { option: 'anticipated', reason: 'Salah past tense.' },
      { option: 'anticipate', reason: 'Salah bare infinitive.' },
      { option: 'to anticipate', reason: 'Salah to-infinitive setelah preposisi "for".' },
    ],
    ruleOrFormula: 'Preposition + Gerund: For + V-ing.',
    maritimeContext: 'Pencegahan bahaya pantulan tali/kawat putus (Snap-back Zone Hazard) saat penarikan jangkar rig.',
  },

  // Vocabulary & Specialized Offshore/DP (16-30)
  'm5-v-16': {
    summary: 'Perbedaan istilah "Drift-off" dan "Drive-off" pada sistem Dynamic Positioning.',
    whyCorrect: 'Drift-off adalah hilangnya posisi karena daya dorong tidak cukup melawan gaya lingkungan, sedangkan Drive-off adalah pergeseran posisi aktif akibat perintah dorong thruster yang salah/berlebih.',
    distractors: [
      { option: 'A drift-off occurs only when anchors drag, while a drive-off occurs when propellers reverse', reason: 'Salah karena sistem DP tidak menggunakan jangkar.' },
      { option: 'A drift-off is an intentional maneuver, while a drive-off is an engine room emergency', reason: 'Salah bukan manuver sengaja.' },
      { option: 'A drift-off applies to supply vessels, while a drive-off applies only to drilling rigs', reason: 'Salah berlaku untuk seluruh kapal DP.' },
    ],
    maritimeContext: 'Analisis kegagalan operasional sistem Dynamic Positioning (IMCA DP Incident Analysis).',
  },
  'm5-v-17': {
    summary: 'Fungsi peralatan Shark Jaws dan Towing Pins pada kapal AHTS.',
    whyCorrect: 'Shark Jaws dan Towing Pins adalah mekanisme hidrolik geladak untuk menjepit, menahan, dan memandu rantai serta kawat jangkar bertegangan tinggi dengan aman saat operasi penanganan jangkar.',
    distractors: [
      { option: 'Mechanical devices used to hoist lifeboats onto davits', reason: 'Salah bukan derek sekoci.' },
      { option: 'Underwater sonar devices used to detect marine life near the bow', reason: 'Salah bukan sonar biota laut.' },
      { option: 'Specialized cargo lashing hooks used in container holds', reason: 'Salah bukan ganco lashing kontainer.' },
    ],
    maritimeContext: 'Peralatan keselamatan geladak kerja kapal Anchor Handling Tug Supply (AHTS).',
  },
  'm5-v-18': {
    summary: 'Definisi Analisis Mode dan Efek Kegagalan (FMEA) pada sertifikasi kapal DP.',
    whyCorrect: 'FMEA adalah audit teknik sistematis untuk membuktikan bahwa tidak ada kegagalan komponen tunggal (single point of failure) yang dapat menyebabkan kapal kehilangan posisi atau haluan DP.',
    distractors: [
      { option: 'A financial audit calculating annual fuel bunkering costs', reason: 'Salah bukan audit finansial biaya bunker.' },
      { option: 'A medical examination procedure for deep-sea saturation divers', reason: 'Salah bukan tes medis penyelam.' },
      { option: 'A paint thickness test for offshore subsea pipelines', reason: 'Salah bukan uji ketebalan cat pipa subsea.' },
    ],
    maritimeContext: 'Sertifikasi keandalan redundansi kapal DP Kelas 2 dan Kelas 3 (IMO MSC/Circ.645).',
  },
  'm5-v-19': {
    summary: 'Definisi Standar D-2 Konvensi Manajemen Air Ballast (BWM).',
    whyCorrect: 'Standar D-2 adalah baku mutu biologi yang menetapkan batas konsentrasi maksimum organisme air hidup dan mikroba patogen yang boleh ada dalam air ballast yang dibuang ke laut.',
    distractors: [
      { option: 'The minimum distance of 200 nautical miles from land for ballast exchange', reason: 'Salah karena itu standar D-1 pertukaran ballast di laut lepas.' },
      { option: 'The minimum water depth of 200 meters required for sea chest deballasting', reason: 'Salah itu kedalaman standar D-1.' },
      { option: 'The maximum tank sediment thickness before mandatory dry dock cleaning', reason: 'Salah bukan ketebalan sedimen.' },
    ],
    maritimeContext: 'Standar kinerja instalasi pengolahan air ballast IMO BWM Convention.',
  },
  'm5-v-20': {
    summary: 'Kepanjangan sistem referensi posisi hidroakustik USBL.',
    whyCorrect: 'USBL adalah singkatan dari "Ultra-Short Baseline" (Sistem Akustik Garis Dasar Sangat Pendek) untuk penentuan posisi bawah air antara transduser kapal dan transponder dasar laut.',
    distractors: [
      { option: 'Universal Subsea Buoyancy Line', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Under-Surface Beam Locator', reason: 'Salah kepanjangan fiktif.' },
      { option: 'Ultrasonic Single Beacon Lock', reason: 'Salah kepanjangan fiktif.' },
    ],
    maritimeContext: 'Sistem referensi posisi akustik bawah laut kapal Dynamic Positioning.',
  },
  'm5-v-21': {
    summary: 'Definisi lubang bukaan Moonpool pada kapal konstruksi bawah air dan selam.',
    whyCorrect: 'Moonpool adalah bukaan lubang vertikal tembus lambung di tengah kapal yang memberikan akses terlindung ke laut untuk peluncuran wahana selam ROV, lonceng selam (diving bell), dan peralatan subsea.',
    distractors: [
      { option: 'A circular ballast water treatment holding tank', reason: 'Salah bukan tangki penampung air ballast.' },
      { option: 'An emergency swimming pool for passenger crew drills', reason: 'Salah bukan kolam renang darurat.' },
      { option: 'A hollow bulb fitted at the stem to reduce wave resistance', reason: 'Salah karena itu Bulbous Bow.' },
    ],
    maritimeContext: 'Konstruksi khusus kapal pendukung selam konstruksi bawah air (Diving Support Vessel).',
  },
  'm5-v-22': {
    summary: 'Fungsi Motion Reference Unit (MRU) pada kapal Dynamic Positioning.',
    whyCorrect: 'MRU berfungsi mengukur gerakan dinamis oleng (roll), angguk (pitch), naik-turun (heave), dan maju-mundur (surge) kapal untuk mengirimkan data kompensasi gerak secara seketika ke komputer kontrol DP.',
    distractors: [
      { option: 'To track GPS satellites on the celestial horizon', reason: 'Salah bukan pelacak satelit GPS.' },
      { option: 'To record the engine propeller shaft revolutions per minute', reason: 'Salah bukan tachometer baling-baling.' },
      { option: 'To monitor fuel level oscillations in wing settling tanks', reason: 'Salah bukan sensor tangki harian.' },
    ],
    maritimeContext: 'Sensor kompensasi gerak dinamis kapal pada sistem Dynamic Positioning.',
  },
  'm5-v-23': {
    summary: 'Persyaratan keselamatan kopling lepas darurat (ERC) bunker LNG menurut Kode IGF.',
    whyCorrect: 'Kopling darurat ERC wajib lepas secara otomatis dan langsung menyegel kedua ujung selang tanpa kebocoran gas LNG jika pergeseran kapal melampaui batas aman transfer.',
    distractors: [
      { option: 'They must be lubricated with mineral grease before every transfer', reason: 'Salah pelumasan gemuk dilarang pada suhu kriogenik.' },
      { option: 'They must remain bolted together until shore tanks are empty', reason: 'Salah harus dapat lepas darurat seketika.' },
      { option: 'They must vent methane gas to the atmosphere during rapid disconnection', reason: 'SANGAT BERBAHAYA! Pelepasan metana ke udara memicu bahaya ledakan.' },
    ],
    maritimeContext: 'Sistem keselamatan darurat bunker bahan bakar gas LNG Kode IGF.',
  },
  'm5-v-24': {
    summary: 'Fungsi Stern Roller pada kapal tunda penanganan jangkar (AHTS).',
    whyCorrect: 'Stern Roller adalah silinder baja putar berbobot berat di buritan kapal AHTS yang mempermudah penarikan dan penurunan jangkar rig serta kawat seling tanpa merusak geladak.',
    distractors: [
      { option: 'A winch used to moor life rafts during sea trials', reason: 'Salah bukan derek sekoci penolong.' },
      { option: 'A fairlead fitted on the forward forecastle head', reason: 'Salah bukan fairlead haluan.' },
      { option: 'A rudder support bearing inside the steering gear flat', reason: 'Salah bukan bantalan kemudi.' },
    ],
    maritimeContext: 'Peralatan buritan kapal tunda penanganan jangkar lepas pantai.',
  },
  'm5-v-25': {
    summary: 'Arti parameter Bollard Pull (BP) pada kapal tunda penunjang lepas pantai.',
    whyCorrect: 'Bollard Pull mengukur gaya tarik horizontal statis maksimum yang dapat dihasilkan oleh sistem propulsi kapal terhadap titik tambat tetap di darat.',
    distractors: [
      { option: 'The maximum weight of cargo that can be lashed onto the wooden deck', reason: 'Salah karena itu kapasitas muat geladak (Deck Capacity).' },
      { option: 'The breaking load of the bow anchor chain link', reason: 'Salah karena itu beban putus rantai jangkar.' },
      { option: 'The lifting capacity of the offshore pedestal crane', reason: 'Salah kapasitas angkat derek kargo.' },
    ],
    maritimeContext: 'Kapasitas daya tarik kapal tunda penarik rig lepas pantai (AHTS/Tug BP Rating).',
  },
  'm5-v-26': {
    summary: 'Arti nilai D (D-Value) pada helideck kapal lepas pantai.',
    whyCorrect: 'D-Value adalah dimensi panjang terluar helikopter (dari ujung bilah baling-baling depan hingga ekor) yang menjadi batas sertifikasi ukuran helideck kapal.',
    distractors: [
      { option: 'The thickness of non-skid friction paint on the deck', reason: 'Salah bukan ketebalan cat antiselip.' },
      { option: 'The decibel sound limit for helicopter take-offs', reason: 'Salah bukan batas kebisingan desibel.' },
      { option: 'The deadweight capacity of the aviation fuel storage tank', reason: 'Salah bukan kapasitas tangki bahan bakar avtur.' },
    ],
    maritimeContext: 'Standar dimensi keselamatan pendaratan helikopter di kapal (CAP 437 Offshore Helidecks).',
  },
  'm5-v-27': {
    summary: 'Arti status "Yellow Alert" pada panel peringatan sistem Dynamic Positioning.',
    whyCorrect: 'Yellow Alert menandakan status keandalan DP terdegradasi (terjadi kegagalan yang menghilangkan redundansi); seluruh tim wajib bersiap menghentikan operasi dan mengarahkan kapal ke posisi aman.',
    distractors: [
      { option: 'Normal operational condition with full redundancy available', reason: 'Salah karena status normal adalah Green Alert.' },
      { option: 'Immediate catastrophic emergency: abandon ship immediately', reason: 'Salah karena status darurat fatal adalah Red Alert.' },
      { option: 'Helicopter approaching for routine crew change', reason: 'Salah bukan pemberitahuan helikopter biasa.' },
    ],
    maritimeContext: 'Prosedur status peringatan darurat sistem Dynamic Positioning (DP Alert Panel).',
  },
  'm5-v-28': {
    summary: 'Definisi sistem referensi posisi Taut Wire pada kapal DP.',
    whyCorrect: 'Taut Wire adalah sensor posisi DP yang menggunakan kawat baja bertegangan tinggi yang diturunkan ke pemberat (clump weight) di dasar laut untuk mengukur pergeseran posisi relatif kapal.',
    distractors: [
      { option: 'A high-voltage power line connecting the vessel to an offshore wind turbine', reason: 'Salah bukan kabel listrik turbin angin.' },
      { option: 'An emergency towing pennant connected to a disabled tanker', reason: 'Salah bukan tali tunda darurat.' },
      { option: 'A deepwater oceanographic water sampling cable', reason: 'Salah bukan kabel sampling oseanografi.' },
    ],
    maritimeContext: 'Sistem referensi posisi mekanis bawah air kapal DP.',
  },
  'm5-v-29': {
    summary: 'Definisi sistem pencacah dan disinfeksi kotoran MARPOL Annex IV.',
    whyCorrect: 'Sistem penghancur dan disinfeksi kotoran adalah instalasi yang mencacah dan mendisinfeksi air limbah toilet (blackwater) sebelum dibuang ke laut pada jarak lebih dari 3 mil laut dari daratan.',
    distractors: [
      { option: 'A bilge water separator that removes fuel oil residues', reason: 'Salah karena itu Oily Water Separator (Annex I).' },
      { option: 'A garbage compactor that crushes aluminum cans', reason: 'Salah karena itu pemadat sampah (Annex V).' },
      { option: 'An exhaust gas scrubber cleaning engine flue gases', reason: 'Salah scrubber gas buang (Annex VI).' },
    ],
    maritimeContext: 'Pencegahan pencemaran limbah kotoran kapal MARPOL Annex IV.',
  },
  'm5-v-30': {
    summary: 'Fungsi Consequence Analysis pada sistem DP Kelas 2 dan 3.',
    whyCorrect: 'Consequence Analysis adalah program otomatis yang terus-menerus menghitung dan memprediksi apakah kapal masih mampu mempertahankan posisinya jika terjadi kegagalan komponen terburuk pada saat itu juga.',
    distractors: [
      { option: 'A financial program calculating port dues penalties for late departure', reason: 'Salah bukan kalkulator denda pelabuhan.' },
      { option: 'A wave radar analyzing structural fatigue on the vessel bow', reason: 'Salah bukan radar kelelahan struktur geladak.' },
      { option: 'An automated crew payroll audit system', reason: 'Salah bukan sistem penggajian awak.' },
    ],
    maritimeContext: 'Pengawasan keselamatan redundansi waktu-nyata sistem DP Kelas 2 dan 3.',
  },

  // Time, Offshore Dynamics & Power Calculations (31-40)
  'm5-t-31': {
    summary: 'Kalkulasi cadangan daya genset / Spinning Reserve (Kapasitas 8.000 kW, Beban 5.200 kW).',
    whyCorrect: 'Cadangan Daya (Spinning Reserve) = 8.000 kW - 5.200 kW = 2.800 kW. Persentase = (2.800 ÷ 8.000) × 100% = 35,0%.',
    distractors: [
      { option: '3,200 kW (40.0%)', reason: 'Salah hitung pengurangan.' },
      { option: '2,400 kW (30.0%)', reason: 'Salah hitung pengurangan.' },
      { option: '1,800 kW (22.5%)', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Spinning Reserve = Total Online - Current Load = 8.000 - 5.200 = 2.800 kW (35.0%).',
    maritimeContext: 'Manajemen daya listrik kamar mesin kapal Dynamic Positioning (Power Management System / PMS).',
  },
  'm5-t-32': {
    summary: 'Kalkulasi durasi pertukaran air ballast 300% (Tangki 1.200 m³, Laju Pompa 400 m³/jam).',
    whyCorrect: 'Volume total yang harus dipompa = 1.200 m³ × 3 = 3.600 m³. Waktu pemompaan = 3.600 m³ ÷ 400 m³/jam = 9,0 jam.',
    distractors: [
      { option: '6.0 hours', reason: 'Salah karena hanya mengalikan 2 kali volume.' },
      { option: '3.0 hours', reason: 'Salah karena hanya memompa 100% volume tangki.' },
      { option: '12.0 hours', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Exchange Volume = 1.200 × 3 = 3.600 m³. Time = 3.600 / 400 = 9.0 Hours.',
    maritimeContext: 'Pertukaran air ballast metode penggelontoran (Flow-through Ballast Exchange) Konvensi BWM.',
  },
  'm5-t-33': {
    summary: 'Kalkulasi gaya tarik penarikan rig pada 80% MCR (Bollard Pull Maksimal 220 MT).',
    whyCorrect: 'Gaya tarik yang dihasilkan = 220 ton × 0,80 = 176,0 metrik ton.',
    distractors: [
      { option: '198.0 tonnes', reason: 'Salah hitung perkalian (90%).' },
      { option: '160.0 tonnes', reason: 'Salah hitung perkalian.' },
      { option: '185.5 tonnes', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Towing Force = Max BP × Rating = 220 × 0.80 = 176.0 Tonnes.',
    maritimeContext: 'Kalkulasi beban gaya tarik operasi penarikan anjungan lepas pantai oleh kapal AHTS.',
  },
  'm5-t-34': {
    summary: 'Persentase batas deviasi posisi lingkaran pantau (Offset 3.2m dari Radius 4.0m).',
    whyCorrect: 'Persentase batas lingkaran pantau tercapai = (3,2 m ÷ 4,0 m) × 100% = 80%.',
    distractors: [
      { option: '70%', reason: 'Salah hitung pembagian.' },
      { option: '85%', reason: 'Salah hitung pembagian.' },
      { option: '75%', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Percentage = (Offset / Radius) × 100% = (3.2 / 4.0) × 100% = 80%.',
    maritimeContext: 'Batas toleransi deviasi posisi lingkaran pantau (Watch Circle) operasi selam DP.',
  },
  'm5-t-35': {
    summary: 'Evaluasi kekuatan geladak muat kargo subsea 45 MT pada bidang 3m x 3m (Batas 5.0 t/m²).',
    whyCorrect: 'Luas bidang kontak = 3 m × 3 m = 9 m². Beban geladak = 45 ton ÷ 9 m² = 5,0 t/m². Nilai ini tepat sama dengan batas izin 5,0 t/m², sehingga tidak melebihi batas kekuatan geladak.',
    distractors: [
      { option: 'Yes, the loading is 6.5 t/m² which will cause deck structural failure', reason: 'Salah hitung pembagian luas.' },
      { option: 'Yes, any cargo over 20 tonnes is prohibited on open deck', reason: 'Salah tidak ada larangan berat total jika beban terbagi merata.' },
      { option: 'No, the loading is only 2.5 t/m²', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Deck Load = Weight / Area = 45 / 9 = 5.0 t/m² (Matches 5.0 t/m² limit).',
    maritimeContext: 'Kalkulasi kekuatan beban muatan geladak kayu kapal offshore supply (Deck Load Density).',
  },
  'm5-t-36': {
    summary: 'Izin pendaratan helikopter MTOW 9.3t dan D 19.5m pada helideck "t: 11.0t / D: 21.0m".',
    whyCorrect: 'Ya, diizinkan karena kapasitas beban helideck (11,0 ton) dan nilai D (21,0 meter) lebih besar daripada berat helikopter (9,3 ton) dan dimensi D helikopter (19,5 meter).',
    distractors: [
      { option: 'No, helicopter D-value exceeds helideck diameter', reason: 'Salah karena 19.5m < 21.0m.' },
      { option: 'No, helideck certified weight is less than helicopter weight', reason: 'Salah karena 11.0t > 9.3t.' },
      { option: 'Yes, but only during daylight calm sea conditions', reason: 'Salah pembatasan tidak relevan jika helideck bersertifikat.' },
    ],
    maritimeContext: 'Verifikasi kepatuhan sertifikasi helideck lepas pantai standar CAP 437.',
  },
  'm5-t-37': {
    summary: 'Kalkulasi waktu penurunan 6 segel rantai jangkar pada laju 15 m/menit (1 segel = 27.5 m).',
    whyCorrect: 'Panjang rantai total = 6 × 27,5 m = 165 meter. Waktu penurunan = 165 m ÷ 15 m/menit = 11,0 menit.',
    distractors: [
      { option: '9.5 minutes', reason: 'Salah hitung pembagian.' },
      { option: '12.5 minutes', reason: 'Salah hitung pembagian.' },
      { option: '8.0 minutes', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Length = 6 × 27.5 = 165 m. Time = 165 / 15 = 11.0 Minutes.',
    maritimeContext: 'Operasi penurunan rantai penambat jangkar anjungan oleh kapal AHTS.',
  },
  'm5-t-38': {
    summary: 'Kalkulasi sisa cadangan daya dorong bow thruster pada utilisasi 72%.',
    whyCorrect: 'Sisa cadangan kapasitas thruster = 100% - 72% = 28% cadangan.',
    distractors: [
      { option: '35% reserve', reason: 'Salah hitung pengurangan.' },
      { option: '20% reserve', reason: 'Salah hitung pengurangan.' },
      { option: '15% reserve', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Reserve = 100% - 72% = 28% Reserve.',
    maritimeContext: 'Evaluasi grafik kemampuan posisi DP (DP Capability Plot) saat cuaca berangin.',
  },
  'm5-t-39': {
    summary: 'Evaluasi kepatuhan kadar sulfur MGO 0.08% terhadap batas ECA 0.10% MARPOL Annex VI.',
    whyCorrect: 'Ya, memenuhi syarat karena kadar sulfur 0,08% berada di bawah ambang batas maksimum 0,10% m/m yang ditetapkan MARPOL Annex VI untuk Zona Kontrol Emisi (ECA).',
    distractors: [
      { option: 'No, sulfur content in ECAs must be exactly zero percent', reason: 'Salah karena batas legal adalah 0.10% m/m.' },
      { option: 'No, 0.08% exceeds the allowable limit for marine diesel', reason: 'Salah karena 0.08% < 0.10%.' },
      { option: 'Yes, but only when operating outside territorial waters', reason: 'Salah berlaku di seluruh perairan dalam zona ECA.' },
    ],
    ruleOrFormula: 'MARPOL Annex VI ECA Limit: Sulfur content ≤ 0.10% m/m.',
    maritimeContext: 'Kepatuhan penerimaan bahan bakar kapal (Bunker Delivery Note) di zona emisi sulfur ketat.',
  },
  'm5-t-40': {
    summary: 'Kalkulasi waktu transit penurunan lonceng selam ke kedalaman 120m pada 15 m/menit.',
    whyCorrect: 'Waktu penurunan lonceng selam = 120 meter ÷ 15 meter/menit = 8,0 menit.',
    distractors: [
      { option: '6.5 minutes', reason: 'Salah hitung pembagian.' },
      { option: '10.0 minutes', reason: 'Salah hitung pembagian.' },
      { option: '7.0 minutes', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Descent Time = Depth / Speed = 120 / 15 = 8.0 Minutes.',
    maritimeContext: 'Operasi penyelaman saturasi air dalam (Deepwater Saturation Diving).',
  },

  // Reading Comprehension & Offshore Guidelines (41-50)
  'm5-r-41': {
    summary: 'Penyebab utama insiden pergeseran posisi (Drive-off) kapal DP menurut laporan IMCA.',
    whyCorrect: 'Penyebab utama insiden adalah pengoperasian sistem DP tanpa redundansi tiga giro kompas (Giro 2 dan 3 dinonaktifkan untuk perawatan saat operasi kritis), sehingga kegagalan Giro 1 langsung memicu drive-off ke kiri.',
    distractors: [
      { option: 'Loss of electrical power to the stern azimuth thrusters', reason: 'Salah listrik thruster normal.' },
      { option: 'Dragging of the emergency high-holding anchor', reason: 'Salah kapal DP tidak menggunakan jangkar.' },
      { option: 'Excessive biofouling on the acoustic transponder head', reason: 'Salah bukan karena teritip transponder.' },
    ],
    maritimeContext: 'Investigasi keselamatan sistem referensi haluan DP pedoman IMCA.',
  },
  'm5-r-42': {
    summary: 'Uji kesiapan wajib sebelum kapal memasuki zona keselamatan 500 meter anjungan.',
    whyCorrect: 'Sebelum memasuki zona 500 meter anjungan, kapal wajib melakukan uji coba mode otomatis DP minimal 15 menit, memeriksa cadangan daya genset, dan memperoleh izin lisan dari OIM.',
    distractors: [
      { option: 'A full speed astern emergency stopping maneuver', reason: 'Salah bukan manuver mundur penuh darurat.' },
      { option: 'Discharging 500 tonnes of deck cargo water', reason: 'Salah bukan membuang air kargo.' },
      { option: 'Lowering the fast rescue craft into the water', reason: 'Salah bukan menurunkan FRC.' },
    ],
    maritimeContext: 'Prosedur keselamatan memasuki zona 500 meter anjungan migas lepas pantai.',
  },
  'm5-r-43': {
    summary: 'Tindakan keselamatan perlindungan kru dari bahaya snap-back saat penarikan jangkar.',
    whyCorrect: 'Kru di geladak wajib berlindung di balik pembatas pelindung (crash barriers) di luar zona bahaya pantulan kawat (snap-back hazard zones) saat penarikan jangkar bertegangan tinggi.',
    distractors: [
      { option: 'Standing on the stern roller to guide the wire spooling', reason: 'SANGAT FATAL! Berdiri di stern roller saat kawat bertegangan tinggi dapat menyebabkan kematian seketika.' },
      { option: 'Holding the winch brake manually with emergency levers', reason: 'Salah bukan penahanan manual rem.' },
      { option: 'Disconnecting the main propulsion propeller pitch', reason: 'Salah bukan pemutusan baling-baling.' },
    ],
    maritimeContext: 'Mitigasi bahaya kecelakaan kerja penanganan jangkar AHTS.',
  },
  'm5-r-44': {
    summary: 'Frekuensi pencatatan wajib pada Buku Catatan Air Ballast (Ballast Water Record Book).',
    whyCorrect: 'Pencatatan wajib dilakukan pada setiap kali pengisian, sirkulasi internal, pengolahan melalui BWMS, maupun pembuangan air ballast ke laut.',
    distractors: [
      { option: 'Only once a month during dry dock inspections', reason: 'Salah bukan sebulan sekali.' },
      { option: 'Exclusively when crossing international maritime boundaries', reason: 'Salah bukan hanya saat lintas batas negara.' },
      { option: 'Only when the ballast water treatment system alarms trigger', reason: 'Salah bukan hanya saat alarm berbunyi.' },
    ],
    maritimeContext: 'Administrasi buku catatan air ballast IMO BWM Convention.',
  },
  'm5-r-45': {
    summary: 'Tindakan darurat penyelam dasar laut saat status DP Yellow Alert berbunyi.',
    whyCorrect: 'Saat status Yellow Alert berbunyi, penyelam di dasar laut wajib segera kembali ke dalam lonceng selam (diving bell) dan menutup rapat pintu dalam lonceng.',
    distractors: [
      { option: 'Continue subsea welding until Red Alert is declared', reason: 'SANGAT BERBAHAYA! Mengabaikan Yellow Alert dapat menyebabkan selang nafas (umbilical) penyelam putus tertarik kapal.' },
      { option: 'Disconnect their breathing umbilicals and swim to surface', reason: 'SANGAT FATAL! Melepas umbilical di kedalaman 100m+ memicu kematian karena dekompresi seketika.' },
      { option: 'Anchor the diving bell to the seabed manifold', reason: 'Salah lonceng tidak boleh dijangkarkan ke manifold.' },
    ],
    maritimeContext: 'Prosedur tanggap darurat penyelaman komersial air dalam (IMCA Diving Emergency Response).',
  },
  'm5-r-46': {
    summary: 'Kriteria kadar oksigen dan titik embun purging nitrogen selang manifold LNG (Kode IGF).',
    whyCorrect: 'Purging gas nitrogen pada selang manifold LNG wajib memenuhi kriteria kadar oksigen di bawah 1% dan titik embun kelembapan di bawah -40°C sebelum transfer dimulai.',
    distractors: [
      { option: 'Oxygen content below 10% and dew point at 0°C', reason: 'Salah karena 10% O2 masih berisiko terbakar dan titik embun 0°C menyebabkan pembekuan kristal es.' },
      { option: 'Pressurization with compressed air at 25 bar', reason: 'SANGAT BERBAHAYA! Memasukkan udara bertekanan ke jalur LNG memicu bahaya ledakan dahsyat.' },
      { option: 'Flushing lines with fresh water for 15 minutes', reason: 'Salah fatal memasukkan air ke jalur kriogenik -162°C.' },
    ],
    ruleOrFormula: 'IGF Code Purging Standard: O2 < 1.0%, Dew Point < -40°C.',
    maritimeContext: 'Standar keselamatan pengisian bahan bakar gas cair LNG Kode IGF.',
  },
  'm5-r-47': {
    summary: 'Peralatan lashing bersertifikat untuk mengikat pipa bor kargo geladak cuaca buruk.',
    whyCorrect: 'Pipa bor dan kargo geladak wajib diikat menggunakan rantai pengikat bersertifikat (certified chain binders) yang dirancang mampu menahan percepatan oleng kapal hingga 30 derajat.',
    distractors: [
      { option: 'Standard polyolefin fiber ropes with half-hitch knots', reason: 'Salah karena tali serat biasa tidak mampu menahan beban pipa ratusan ton saat kapal oleng.' },
      { option: 'Wooden wedges and rubber friction mats only', reason: 'Salah karena ganjal kayu saja tidak cukup tanpa lashing rantai.' },
      { option: 'Duct tape and temporary plastic strapping', reason: 'Salah bukan pengikat kargo laut.' },
    ],
    maritimeContext: 'Pedoman pengikatan muatan geladak cuaca buruk kapal suplai offshore (Cargo Securing Manual).',
  },
  'm5-r-48': {
    summary: 'Satu-satunya jenis sampah yang boleh dibuang dari anjungan lepas pantai (MARPOL Annex V).',
    whyCorrect: 'Satu-satunya sampah yang boleh dibuang dari anjungan dan kapal di sekitarnya pada jarak lebih dari 12 mil laut adalah sisa makanan yang telah dicacah melewati saringan berdiameter maksimal 25 mm.',
    distractors: [
      { option: 'Crushed glass bottles and plastic containers', reason: 'Salah karena plastik dilarang total dibuang ke laut di mana pun.' },
      { option: 'Incinerator ash from galley garbage burners', reason: 'Salah abu insinerator dilarang dibuang.' },
      { option: 'Used engine oil filter cartridges', reason: 'Salah limbah B3 minyak dilarang keras dibuang.' },
    ],
    ruleOrFormula: 'MARPOL Annex V Offshore Standard: Comminuted food waste ≤ 25mm beyond 12 NM only.',
    maritimeContext: 'Pencegahan pencemaran sampah di instalasi lepas pantai MARPOL Annex V.',
  },
  'm5-r-49': {
    summary: 'Fitur utama pembeda tingkat keandalan sistem DP-3 dibandingkan DP-2.',
    whyCorrect: 'DP-3 dibedakan dari DP-2 oleh adanya pemisahan fisik kedap air dan sekat tahan api A-60 antar komponen redundan, serta stasiun kontrol DP cadangan di kompartemen terpisah.',
    distractors: [
      { option: 'Ability to carry twice the amount of deck fuel cargo', reason: 'Salah bukan kapasitas muatan bahan bakar.' },
      { option: 'Having three anchors instead of two at the bow', reason: 'Salah bukan jumlah jangkar.' },
      { option: 'Equipping four helidecks instead of one', reason: 'Salah bukan jumlah helideck.' },
    ],
    maritimeContext: 'Klasifikasi standar keandalan redundansi Dynamic Positioning IMO DP-3.',
  },
  'm5-r-50': {
    summary: 'Tim tanggap darurat yang wajib siaga saat proses pendaratan helikopter di kapal.',
    whyCorrect: 'Petugas pendaratan helikopter (HLO) dan tim pemadam kebakaran berpakaian baju tahan api lengkap wajib siaga di monitor busa pemadam selama helikopter mendarat.',
    distractors: [
      { option: 'Diving supervisor with saturation decompression chamber team', reason: 'Salah bukan tim lonceng selam.' },
      { option: 'Anchor winch operator with hydraulic spanners', reason: 'Salah bukan operator derek jangkar.' },
      { option: 'Chief Cook with galley catering provisions', reason: 'Salah bukan juru masak dapur.' },
    ],
    maritimeContext: 'Kesiapsiagaan tanggap darurat pendaratan helikopter di kapal lepas pantai.',
  },

  // Listening & Offshore Communications (51-60)
  'm5-l-51': {
    summary: 'Izin masuk zona keselamatan 500 meter yang dimohonkan PSV Highland Star.',
    whyCorrect: 'Kapal pasokan meminta izin resmi memasuki zona 500 meter di sisi selatan terlindung (southern lee side) setelah menyelesaikan uji coba DP 15 menit dan verifikasi cadangan daya 45%.',
    distractors: [
      { option: 'Permission to anchor 2 miles north of the platform', reason: 'Salah bukan izin lego jangkar.' },
      { option: 'Request for emergency helicopter evacuation of injured sailor', reason: 'Salah bukan evakuasi medis.' },
      { option: 'Permission to discharge oily bilge water into sea', reason: 'Salah pembuangan bilga minyak dilarang.' },
    ],
    maritimeContext: 'Komunikasi izin masuk zona keselamatan 500 meter anjungan migas.',
  },
  'm5-l-52': {
    summary: 'Instruksi darurat tim bawah air saat status DP Yellow Alert disiarkan.',
    whyCorrect: 'DPO menginstruksikan penghentian segera operasi bawah air dan menarik unit ROV kembali ke permukaan geladak kapal karena sakelar bus-tie switchboard terbuka.',
    distractors: [
      { option: 'Continue diving operations on emergency battery power', reason: 'Salah operasi bawah air wajib dihentikan.' },
      { option: 'Drop anchor to secure ship position', reason: 'Salah kapal DP tidak melempar jangkar sembarangan di ladang pipa subsea.' },
      { option: 'Increase thruster power to 100%', reason: 'Salah bukan memaksakan daya thruster.' },
    ],
    maritimeContext: 'Pemberitahuan darurat degradasi redundansi sistem DP.',
  },
  'm5-l-53': {
    summary: 'Aba-aba pengangkatan kargo berat dari mandor geladak kepada operator derek.',
    whyCorrect: 'Mandor geladak menginstruksikan operator derek untuk mengangkat perlahan (heave up slowly) dan menahan muatan pada ketinggian 2 meter di atas geladak kapal.',
    distractors: [
      { option: 'Lower basket rapidly onto ship wooden deck', reason: 'Salah bukan menurunkan cepat.' },
      { option: 'Swing crane boom 90 degrees to starboard at full speed', reason: 'SANGAT BERBAHAYA! Mengayunkan derek kargo 14 ton dengan kecepatan penuh di atas geladak dapat menimbulkan kecelakaan fatal.' },
      { option: 'Release slings immediately while load is suspended', reason: 'Salah fatal melepas kaitan saat kargo masih tergantung di udara.' },
    ],
    maritimeContext: 'Komunikasi aba-aba operasi pengangkatan kargo derek anjungan lepas pantai.',
  },
  'm5-l-54': {
    summary: 'Peralatan pengunci kawat penambat jangkar yang diaktifkan di atas titik target.',
    whyCorrect: 'Anjungan memerintahkan pemasangan Karm fork dan penguncian shark jaws pada kawat penambat jangkar (pennant wire) di atas posisi koordinat target.',
    distractors: [
      { option: 'Anchor windlass manual hand brake', reason: 'Salah bukan rem manual mesin jangkar haluan.' },
      { option: 'Stern gangway boarding ladder', reason: 'Salah bukan tangga pandu/gangway.' },
      { option: 'Lifeboat recovery painter wire', reason: 'Salah bukan tali sekoci penolong.' },
    ],
    maritimeContext: 'Perintah keselamatan penguncian kawat jangkar di geladak AHTS.',
  },
  'm5-l-55': {
    summary: 'Izin pendaratan helikopter dari HLO kepada Rescue Helicopter 55.',
    whyCorrect: 'Petugas HLO mengonfirmasi status helideck hijau aman (kondisi oleng di bawah 1,5°) dan helikopter diizinkan mendarat di lingkaran tengah geladak.',
    distractors: [
      { option: 'Helideck is red, abort landing and return to shore base', reason: 'Salah helideck dinyatakan hijau aman.' },
      { option: 'Hold position hovering 500 feet above vessel mast', reason: 'Salah tidak diperintahkan melayang di atas tiang.' },
      { option: 'Perform winch hoist evacuation only without landing', reason: 'Salah helikopter diizinkan mendarat penuh.' },
    ],
    maritimeContext: 'Komunikasi radio izin pendaratan helikopter di helideck kapal.',
  },
  'm5-l-56': {
    summary: 'Laju transfer dan batas tekanan pengisian lumpur pemboran cair ke rig.',
    whyCorrect: 'Rig pengeboran mengonfirmasi siap menerima transfer lumpur bor cair pada laju 120 m³/jam dengan batas tekanan maksimal 6 bar.',
    distractors: [
      { option: '300 m³/hr with maximum pressure limit of 15 bar', reason: 'Salah nilai laju dan tekanan.' },
      { option: '50 m³/hr with maximum pressure limit of 2 bar', reason: 'Salah nilai laju dan tekanan.' },
      { option: '200 m³/hr with maximum pressure limit of 10 bar', reason: 'Salah nilai laju dan tekanan.' },
    ],
    maritimeContext: 'Prosedur transfer muatan curah cair lumpur pemboran kapal offshore.',
  },
  'm5-l-57': {
    summary: 'Haluan kapal yang diminta pengawas ROV saat peluncuran melalui moonpool.',
    whyCorrect: 'Pengawas ROV meminta anjungan mengunci haluan kapal pada 225 derajat Sejati guna memperkecil gerakan oleng saat wahana melintasi zona ombak moonpool.',
    distractors: [
      { option: 'Lock heading on 045 degrees', reason: 'Salah arah haluan.' },
      { option: 'Turn vessel 360 degrees in circle', reason: 'Salah kapal tidak boleh berputar saat peluncuran subsea.' },
      { option: 'Steer randomly according to swell', reason: 'Salah olah gerak sembarangan membahayakan kabel umbilical.' },
    ],
    maritimeContext: 'Operasi peluncuran wahana selam tanpa awak (ROV Subsea Launch).',
  },
  'm5-l-58': {
    summary: 'Laporan kondisi korban orang jatuh ke laut (MOB) dari sekoci penyelamat cepat.',
    whyCorrect: 'Juru mudi sekoci penyelamat cepat (FRC) melaporkan korban orang jatuh ke laut telah berhasil diselamatkan, dalam kondisi sadar dan mengalami hipotermia ringan.',
    distractors: [
      { option: 'Casualty missing in heavy seas, request search plane', reason: 'Salah korban telah ditemukan dan diselamatkan.' },
      { option: 'Rescue boat capsized on stern slipway', reason: 'Salah sekoci tidak terbalik.' },
      { option: 'Casualty declined rescue assistance', reason: 'Salah korban menerima pertolongan.' },
    ],
    maritimeContext: 'Operasi pertolongan darurat orang jatuh ke laut (Man-Overboard Rescue) kapal siaga.',
  },
  'm5-l-59': {
    summary: 'Peringatan keamanan kapal patroli kepada kapal layar yang melanggar zona 500m.',
    whyCorrect: 'Kapal patroli memerintahkan kapal layar tak berizin untuk segera merubah haluan ke 180 derajat guna keluar dari zona larangan keselamatan 500 meter anjungan produksi.',
    distractors: [
      { option: 'Proceed to platform gangway to drop anchor', reason: 'SANGAT BERBAHAYA! Mendekati gangway anjungan tanpa izin melanggar hukum maritim dan memicu risiko tabrakan anjungan.' },
      { option: 'Maintain speed and steer towards flare boom', reason: 'Salah flare boom adalah area api gas berbahaya.' },
      { option: 'Switch off AIS transponder and radar', reason: 'Salah mematikan AIS adalah pelanggaran SOLAS.' },
    ],
    maritimeContext: 'Penegakan zona eksklusi keselamatan anjungan lepas pantai (Offshore Safety Zone Enforcement).',
  },
  'm5-l-60': {
    summary: 'Hasil survey uji coba tahunan DP Class 2 dari surveyor klasifikasi.',
    whyCorrect: 'Surveyor klasifikasi menyatakan seluruh rangkaian uji coba FMEA DP (simulasi blackout, transfer UPS, kegagalan giro) berhasil lulus tanpa kehilangan posisi, dan sertifikat tahunan DP-2 disahkan.',
    distractors: [
      { option: 'DP trials failed due to thruster fire, vessel detained in port', reason: 'Salah uji coba dinyatakan sukses.' },
      { option: 'Vessel downgraded to non-DP manual steering mode', reason: 'Salah tidak diturunkan kelasnya.' },
      { option: 'Survey postponed due to lack of diesel fuel', reason: 'Salah survey tidak ditunda.' },
    ],
    maritimeContext: 'Pengesahan sertifikasi uji coba tahunan Dynamic Positioning Kelas 2.',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 6 (All 60 Questions)
const TEST_6_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm6-g-01': {
    summary: 'Subjunctive Mood: Required that + Subject + bare verb (maintain).',
    whyCorrect: 'Setelah kata kerja tuntutan kontrak resmi ("required that..."), kata kerja selanjutnya wajib menggunakan bentuk dasar (bare infinitive) murni "maintain".',
    distractors: [
      { option: 'maintained', reason: 'Salah bentuk past tense.' },
      { option: 'maintains', reason: 'Salah bentuk orang ketiga tunggal.' },
      { option: 'is maintaining', reason: 'Salah bentuk continuous.' },
    ],
    ruleOrFormula: 'Subjunctive Mood: Required that + Subject + Base Verb (maintain).',
    maritimeContext: 'Klausul garansi kecepatan kapal dalam kontrak sewa kapal (Charter Party Speed Warranty).',
  },
  'm6-g-02': {
    summary: 'Perfect Participle Clause Aktif: Having + Verb 3 (inspected).',
    whyCorrect: '"Having inspected..." menyatakan tindakan pemeriksaan yang telah selesai tuntas dilakukan sebelum Mualim 1 menandatangani deklarasi pengikatan kargo.',
    distractors: [
      { option: 'inspecting', reason: 'Salah present participle.' },
      { option: 'inspect', reason: 'Salah bare infinitive.' },
      { option: 'been inspected', reason: 'Salah bentuk pasif.' },
    ],
    ruleOrFormula: 'Perfect Participle Active: Having + Verb 3 (inspected) + Object.',
    maritimeContext: 'Pemeriksaan twistlock kontainer geladak sebelum penandatanganan Cargo Securing Declaration.',
  },
  'm6-g-03': {
    summary: 'Inverted Third Conditional: Had [subject] not [Verb 3], [subject] would not have [Verb 3].',
    whyCorrect: 'Klausa syarat pengandaian lampau tanpa If ("Had the moisture content... not exceeded") berpasangan dengan konsekuensi lampau "would not have liquefied" (tidak akan mencair).',
    distractors: [
      { option: 'will not liquefy', reason: 'Salah modal masa depan.' },
      { option: 'did not liquefy', reason: 'Salah past simple.' },
      { option: 'would not liquefy', reason: 'Salah conditional tipe 2.' },
    ],
    ruleOrFormula: 'Inverted 3rd Conditional: Had + Subject + not + Verb 3, Subject + would not have + Verb 3.',
    maritimeContext: 'Pencegahan fenomena pencairan muatan bijih nikel (Cargo Liquefaction) IMSBC Code.',
  },
  'm6-g-04': {
    summary: 'Susunan baku laporan inspeksi palka muatan curah (Prepositional Time Clause).',
    whyCorrect: 'Susunan baku laporan inspeksi palka: Prepositional Time Clause (Prior to loading grain cargo) + Koma + Main Passive Clause (all holds were inspected and certified completely clean and dry).',
    distractors: [
      { option: 'All holds were inspected and certified completely clean and dry prior to loading grain cargo.', reason: 'Kurang formal untuk format penulisan awal ringkasan laporan inspeksi resmi.' },
    ],
    ruleOrFormula: 'Prior to + Gerund Phrase, Subject + were + Verb 3 + and + Verb 3 + Adjective Complement.',
    maritimeContext: 'Sertifikasi kebersihan palka sebelum pemuatan biji-bijian (Grain Hold Cleanliness Inspection).',
  },
  'm6-g-05': {
    summary: 'Pola pasif "instructed to + verb" dan preposisi instrumen "with + tool".',
    whyCorrect: 'Pola pasif "instructed to lash down" (diinstruksikan untuk mengikat) dan preposisi alat "with cross-lashing rods" (menggunakan batang lashing silang).',
    distractors: [
      { option: 'for, using', reason: 'Salah pola infinitif.' },
      { option: 'in, by', reason: 'Salah preposisi.' },
      { option: 'at, on', reason: 'Salah preposisi.' },
    ],
    ruleOrFormula: 'Passive Instruction: Instructed to + Verb; Instrument Preposition: With + Tool.',
    maritimeContext: 'Instruksi pengikatan kontainer susun luar menggunakan batang lashing silang (Cross-lashing).',
  },
  'm6-g-06': {
    summary: 'Negative Prepositional Inversion: Under no circumstances + modal (may) + Subject.',
    whyCorrect: 'Frasa larangan keras bernilai negatif "Under no circumstances" memicu pembalikan kata bantu modal "may" mendahului subjek "crew members".',
    distractors: [
      { option: 'crew may', reason: 'Salah karena tidak terjadi inversi.' },
      { option: 'did crew', reason: 'Salah auxiliary modal konteks larangan.' },
      { option: 'crew can', reason: 'Salah susunan tanpa inversi.' },
    ],
    ruleOrFormula: 'Negative Inversion: Under no circumstances + Modal (may) + Subject + Bare Verb.',
    maritimeContext: 'Keamanan siber anjungan melarang koneksi USB pribadi ke stasiun kerja ECDIS.',
  },
  'm6-g-07': {
    summary: 'Perfect Continuous Infinitive Pasif: was found to have been operating.',
    whyCorrect: '"was found to have been operating" menyatakan temuan audit bahwa kapal telah beroperasi terus-menerus menggunakan peta navigasi elektronik kadaluarsa di masa lampau.',
    distractors: [
      { option: 'operating', reason: 'Kurang tepat menunjukkan temuan durasi masa lampau.' },
      { option: 'to operate', reason: 'Salah present infinitive.' },
      { option: 'operated', reason: 'Salah bentuk past participle.' },
    ],
    ruleOrFormula: 'Passive Audit Finding: was found + to have been + V-ing.',
    maritimeContext: 'Temuan audit Port State Control atas pengoperasian peta elektronik ENC tanpa pembaruan terkini.',
  },
  'm6-g-08': {
    summary: 'Participle Clause menyatakan akibat langsung: Main Clause + "," + V-ing (forcing).',
    whyCorrect: '"forcing the vessel..." adalah present participle clause yang menyatakan akibat langsung dari kegagalan shipper menyediakan sertifikat kelembapan muatan.',
    distractors: [
      { option: 'forced', reason: 'Salah past participle.' },
      { option: 'force', reason: 'Salah bare infinitive.' },
      { option: 'to force', reason: 'Kurang tepat untuk klausa hasil.' },
    ],
    ruleOrFormula: 'Result Participle Clause: Main Clause + "," + V-ing (forcing).',
    maritimeContext: 'Penahanan kapal di area labuh jangkar akibat ketiadaan sertifikat kelembapan muatan curah.',
  },
  'm6-g-09': {
    summary: 'Konjungsi urutan kronologis sebab-akibat: Event A + after + Event B.',
    whyCorrect: '"after" (setelah) secara logis menghubungkan peristiwa runtuhnya susunan kontainer yang terjadi setelah kapal mengalami oleng sinkron (synchronous rolling).',
    distractors: [
      { option: 'unless', reason: 'Salah karena bermakna "kecuali jika".' },
      { option: 'despite', reason: 'Salah karena "despite" adalah preposisi, bukan konjungsi klausa.' },
      { option: 'whereas', reason: 'Salah karena bermakna pertentangan "sedangkan".' },
    ],
    ruleOrFormula: 'Chronological Sequence: Event A (Stack collapsed) + after + Event B (Encountered synchronous rolling).',
    maritimeContext: 'Keruntuhan susunan kontainer di geladak akibat oleng sinkron di laut bergelombang serong.',
  },
  'm6-g-10': {
    summary: 'Pola formal konsesi: Much as + Subject + Verb (Much as the Master tried).',
    whyCorrect: '"Much as [clause]" adalah frasa formal maritim yang menyatakan konsesi ("Meskipun/Kendati", setara dengan "Even though the Master tried hard...").',
    distractors: [
      { option: 'though', reason: 'Salah struktur jika didahului kata "Much".' },
      { option: 'since', reason: 'Salah makna kausal.' },
      { option: 'because', reason: 'Salah makna kausal.' },
    ],
    ruleOrFormula: 'Concession Pattern: Much as + Subject + Verb, Main Clause.',
    maritimeContext: 'Upaya trim kapal curah dengan pembuangan ballast palka depan yang tidak merubah sarat haluan.',
  },
  'm6-g-11': {
    summary: 'Subjunctive Mood Pasif: Insisted that + Subject + be + Verb 3 (be tested).',
    whyCorrect: 'Setelah kata kerja desakan resmi ("insisted that..."), kalimat pasif subjunctive menggunakan bentuk dasar "be + Verb 3 (be tested)" tanpa to atau to-be berkonjugasi.',
    distractors: [
      { option: 'are', reason: 'Salah bentuk indikatif present.' },
      { option: 'were', reason: 'Salah bentuk indikatif past.' },
      { option: 'to be', reason: 'Salah to-infinitive.' },
    ],
    ruleOrFormula: 'Subjunctive Passive: Insisted that + Subject + be + Verb 3 (be tested).',
    maritimeContext: 'Pengujian kekedapan saluran drainase ambang palka kapal curah menggunakan selang air bertekanan tinggi.',
  },
  'm6-g-12': {
    summary: 'Negative Inversion dengan Past Perfect: Not until + had been + Verb 3 + did + Verb 1.',
    whyCorrect: '"Not until the firewall had been updated did the bridge team restore..." menunjukkan pembaruan firewall telah tuntas terlebih dahulu sebelum jaringan dibuka kembali.',
    distractors: [
      { option: 'has been', reason: 'Salah present perfect.' },
      { option: 'was being', reason: 'Salah past continuous.' },
      { option: 'would be', reason: 'Salah modal.' },
    ],
    ruleOrFormula: 'Negative Inversion: Not until + Subject + had been + Verb 3 + did + Subject + Verb 1.',
    maritimeContext: 'Prosedur keamanan siber anjungan sebelum membuka koneksi jaringan internet ke server darat.',
  },
  'm6-g-13': {
    summary: 'Kolokasi kata sifat kausal formal: "attributable to [noun]".',
    whyCorrect: '"attributable to" adalah pasangan baku kata sifat yang bermakna "disebabkan oleh / dapat diatribusikan kepada".',
    distractors: [
      { option: 'for', reason: 'Salah pasangan preposisi baku.' },
      { option: 'with', reason: 'Salah pasangan preposisi baku.' },
      { option: 'from', reason: 'Salah pasangan preposisi baku.' },
    ],
    ruleOrFormula: 'Adjective Collocation: Attributable to + Noun Phrase.',
    maritimeContext: 'Analisis kerusakan struktur kontainer akibat gaya racking melintang di laut ganas.',
  },
  'm6-g-14': {
    summary: 'Inverted Second Conditional: Were + Subject + to + Verb 1 (to exceed).',
    whyCorrect: '"Were the cargo temperature to exceed 55°C..." adalah bentuk pengandaian tipe 2 formal tanpa If (Setara dengan: "If the cargo temperature were to exceed 55°C...").',
    distractors: [
      { option: 'exceeds', reason: 'Salah present tense.' },
      { option: 'exceeded', reason: 'Salah past tense.' },
      { option: 'exceeding', reason: 'Salah participle.' },
    ],
    ruleOrFormula: 'Inverted 2nd Conditional: Were + Subject + to + Verb 1.',
    maritimeContext: 'Prosedur darurat pemanasan sendiri (Self-heating) muatan batu bara IMSBC Code pada suhu 55°C.',
  },
  'm6-g-15': {
    summary: 'Participle Clause: having + Verb 3 (having performed).',
    whyCorrect: '"having performed..." menjelaskan bahwa surveyor mengesahkan kekedapan palka setelah tuntas melaksanakan tes kekedapan ultrasonik.',
    distractors: [
      { option: 'have', reason: 'Salah bentuk kata kerja.' },
      { option: 'had', reason: 'Salah bentuk kata kerja.' },
      { option: 'has', reason: 'Salah bentuk kata kerja.' },
    ],
    ruleOrFormula: 'Participle Clause: Having + Verb 3 (having performed).',
    maritimeContext: 'Sertifikasi kekedapan palka melalui pengujian ultrasonik (Ultrasonic Tightness Test).',
  },

  // Vocabulary & Specialized Container/Bulk/Cyber (16-30)
  'm6-v-16': {
    summary: 'Sistem koordinat slot kontainer "Bay-Row-Tier" (contoh: 05-04-82).',
    whyCorrect: 'Sistem koordinat slot kontainer: Bay (posisi membujur kapal), Row (posisi melintang dari garis tengah kapal), dan Tier (posisi ketinggian vertikal, di mana angka 82+ menunjukkan muatan di atas geladak).',
    distractors: [
      { option: 'Bay 05 (cargo weight in tonnes), Row 04 (hold number), Tier 82 (port of destination code)', reason: 'Salah bukan berat atau pelabuhan tujuan.' },
      { option: 'Bay 05 (reefer plug number), Row 04 (crane gang index), Tier 82 (hatch cover number)', reason: 'Salah bukan nomor colokan reefer.' },
      { option: 'Bay 05 (stowage sequence), Row 04 (IMDG class), Tier 82 (customs clearance stamp)', reason: 'Salah bukan kelas IMDG.' },
    ],
    maritimeContext: 'Standar penomoran stowage plan peti kemas internasional (Bays-Rows-Tiers).',
  },
  'm6-v-17': {
    summary: 'Definisi Batas Kelembapan Aman Angkut (TML) kode IMSBC.',
    whyCorrect: 'TML adalah batas kadar air maksimum muatan curah padat Grup A yang dinyatakan aman untuk diangkut tanpa risiko pencairan muatan di laut (dihitung sebesar 90% dari Flow Moisture Point).',
    distractors: [
      { option: 'The minimum humidity required to prevent spontaneous combustion in coal holds', reason: 'Salah bukan batas pencegahan kebakaran batu bara.' },
      { option: 'The percentage of water added to grain to facilitate pneumatic discharge', reason: 'Salah air tidak pernah ditambahkan ke biji-bijian.' },
      { option: 'The dew point at which condensation begins on cargo hold bulkheads', reason: 'Salah karena itu titik embun kondensasi (Sweat).' },
    ],
    maritimeContext: 'Pencegahan pencairan muatan curah mineral IMSBC Code.',
  },
  'm6-v-18': {
    summary: 'Fungsi Cell Guides di dalam palka kapal kontainer.',
    whyCorrect: 'Cell Guides adalah rel baja struktural vertikal di dalam palka yang memandu kontainer meluncur tepat ke kolom susunannya sehingga tidak memerlukan pengikatan lashing manual.',
    distractors: [
      { option: 'Electrical cables providing power to reefer containers', reason: 'Salah bukan kabel listrik reefer.' },
      { option: 'Hydraulic bilge pumps draining condensation water', reason: 'Salah bukan pompa bilga.' },
      { option: 'Pneumatic shock absorbers protecting hatch covers', reason: 'Salah bukan peredam kejut palka.' },
    ],
    maritimeContext: 'Konstruksi penahan kontainer di dalam palka kapal peti kemas.',
  },
  'm6-v-19': {
    summary: 'Definisi fenomena Parametric Rolling pada kapal kontainer modern.',
    whyCorrect: 'Parametric Rolling adalah oleng hebat dan mendadak dengan sudut kemiringan ekstrem yang terjadi saat periode pertemuan gelombang sekitar setengah dari periode oleng alami kapal pada laut haluan atau buritan.',
    distractors: [
      { option: 'The slow listing caused by asymmetrical fuel oil bunkering', reason: 'Salah itu kemiringan statis (Listing).' },
      { option: 'The steady heel produced by wind gusts on high container stacks', reason: 'Salah itu oleng akibat tiupan angin konstan (Heeling).' },
      { option: 'The vibration of the rudder blade during full speed maneuvering', reason: 'Salah bukan getaran daun kemudi.' },
    ],
    maritimeContext: 'Dinamika bahaya stabilitas kapal kontainer besar di laut lepas.',
  },
  'm6-v-20': {
    summary: 'Kewajiban regulasi Verified Gross Mass (VGM) SOLAS Bab VI.',
    whyCorrect: 'VGM mewajibkan pihak pengirim (shipper) untuk menimbang secara akurat dan mendeklarasikan berat kotor terverifikasi peti kemas sebelum dimuat ke atas kapal.',
    distractors: [
      { option: 'Vessel crews must weigh every individual cardboard carton by hand', reason: 'Salah awak kapal tidak menimbang karton kardus manual.' },
      { option: 'Customs officers must inspect and verify cargo valuation invoices', reason: 'Salah bea cukai memeriksa faktur pabean, bukan VGM keselamatan pelayaran.' },
      { option: 'Port terminal cranes must re-weigh containers after vessel departure', reason: 'Salah penimbangan wajib tuntas sebelum kapal berangkat.' },
    ],
    maritimeContext: 'Regulasi SOLAS Bab VI tentang verifikasi berat kontainer demi stabilitas kapal.',
  },
  'm6-v-21': {
    summary: 'Definisi pengujian Can Test di atas kapal menurut kode IMSBC.',
    whyCorrect: 'Can Test adalah uji lapangan sederhana di mana sampel bijih mineral dimasukkan ke dalam kaleng logam dan dibenturkan keras ke geladak untuk memeriksa munculnya kelembapan/cairan bebas di permukaan.',
    distractors: [
      { option: 'A laboratory test measuring diesel fuel viscosity in an aluminum can', reason: 'Salah bukan tes viskositas bahan bakar.' },
      { option: 'A chemical titration test checking boiler water salinity', reason: 'Salah bukan titrasi air ketel.' },
      { option: 'A pressure test verifying container door airtightness', reason: 'Salah bukan uji tekanan pintu kontainer.' },
    ],
    maritimeContext: 'Uji cepat visual kadar air muatan curah padat di atas kapal (IMSBC Can Test).',
  },
  'm6-v-22': {
    summary: 'Definisi serangan siber GPS Spoofing pada navigasi kapal.',
    whyCorrect: 'GPS Spoofing adalah transmisi sinyal radio satelit palsu oleh pihak berbahaya yang memanipulasi perangkat penerima navigasi kapal sehingga menampilkan posisi palsu yang salah.',
    distractors: [
      { option: 'The temporary loss of satellite reception in polar latitudes', reason: 'Salah itu pemadaman sinyal alami (Blackout/Loss of Signal).' },
      { option: 'A hardware failure of the bridge radar display tube', reason: 'Salah bukan kerusakan tabung radar.' },
      { option: 'The automatic recalibration of the electronic gyro compass', reason: 'Salah bukan kalibrasi giro kompas.' },
    ],
    maritimeContext: 'Manajemen risiko keamanan siber navigasi IMO Resolution MSC.428(98).',
  },
  'm6-v-23': {
    summary: 'Aturan pemisahan "Separated from" (Segregasi Tingkat 2) kode IMDG.',
    whyCorrect: 'Pemisahan "Separated from" (Tingkat 2) mewajibkan muatan berbahaya dimuat di palka yang berbeda jika di bawah geladak, atau berjarak minimal 6 meter jika dimuat di atas geladak terbuka.',
    distractors: [
      { option: 'Stowed in the same hold provided they are separated by a plywood partition', reason: 'Salah partisi kayu dilarang untuk Segregasi 2.' },
      { option: 'Stowed on completely different ships', reason: 'Salah tidak perlu kapal berbeda.' },
      { option: 'Stowed only in forward cargo holds numbers 1 and 2', reason: 'Salah bukan pembatasan nomor palka.' },
    ],
    maritimeContext: 'Tabel pemisahan muatan berbahaya kode IMDG (Segregation Table).',
  },
  'm6-v-24': {
    summary: 'Definisi gaya Transverse Racking pada tumpukan kontainer geladak.',
    whyCorrect: 'Transverse Racking adalah deformasi kemiringan menyamping pada rangka ujung persegi kontainer akibat percepatan gaya oleng kapal di laut berombak.',
    distractors: [
      { option: 'The vertical compression of bottom corner castings due to stack weight', reason: 'Salah itu gaya tekan vertikal (Stack Compression).' },
      { option: 'The longitudinal sliding of containers along deck hatch coamings', reason: 'Salah itu pergeseran membujur (Longitudinal Sliding).' },
      { option: 'The bending of lashing rods during cargo discharging', reason: 'Salah bukan pembengkokan saat bongkar.' },
    ],
    maritimeContext: 'Kekuatan struktur dan lashing kontainer (CSS Code & Cargo Securing Manual).',
  },
  'm6-v-25': {
    summary: 'Definisi Trimming muatan curah padat di dalam palka (IMSBC Code).',
    whyCorrect: 'Trimming adalah perataan permukaan muatan curah di dalam palka untuk memperkecil risiko pergeseran muatan dan mengurangi masuknya udara ke dalam tumpukan.',
    distractors: [
      { option: 'Washing cargo hold bilge wells with fresh water', reason: 'Salah bukan pencucian got palka.' },
      { option: 'Weighing bulk cargo trucks on port weighbridges', reason: 'Salah bukan jembatan timbang truk.' },
      { option: 'Measuring fuel oil density in double bottom tanks', reason: 'Salah bukan pengukuran densitas bahan bakar.' },
    ],
    maritimeContext: 'Prosedur keselamatan pemuatan kapal curah IMSBC Code.',
  },
  'm6-v-26': {
    summary: 'Definisi muatan kontainer Out-of-Gauge (OOG).',
    whyCorrect: 'OOG adalah muatan kargo yang dimensi panjang, lebar, atau tingginya melebihi ukuran standar kerangka peti kemas ISO (dimuat pada flat rack atau open top container).',
    distractors: [
      { option: 'A container loaded with hazardous radioactive materials', reason: 'Salah karena itu muatan berbahaya Kelas 7 (Radioaktif).' },
      { option: 'An empty container returned from a dry dock repair yard', reason: 'Salah bukan kontainer kosong perbaikan.' },
      { option: 'A reefer container with a damaged temperature logger', reason: 'Salah bukan kontainer reefer rusak.' },
    ],
    maritimeContext: 'Penanganan muatan berukuran lebih pada kapal kontainer (Out-of-Gauge Cargo).',
  },
  'm6-v-27': {
    summary: 'Definisi segregasi jaringan Operational Technology (OT) pada kapal pintar.',
    whyCorrect: 'Segregasi jaringan OT adalah pemisahan jaringan kontrol permesinan, navigasi, dan kemudi dari jaringan komersial IT dan internet kru guna mencegah infeksi silang malware siber.',
    distractors: [
      { option: 'Separating ballast water piping from fire-fighting pumps', reason: 'Salah bukan pipa pemadam dan ballast.' },
      { option: 'Dividing passenger internet speed equally among cabins', reason: 'Salah bukan pembagian bandwidth Wi-Fi.' },
      { option: 'Switching off all bridge computers during tropical storms', reason: 'Salah mematikan navigasi saat badai sangat fatal.' },
    ],
    maritimeContext: 'Arsitektur keamanan siber kapal pintar modern (Maritime Cyber Risk Management).',
  },
  'm6-v-28': {
    summary: 'Definisi muatan curah Grup B menurut kode IMSBC.',
    whyCorrect: 'Grup B adalah muatan curah padat yang memiliki bahaya kimiawi yang dapat memicu kondisi bahaya di kapal (seperti pemanasan sendiri, pelepasan gas beracun/mudah terbakar, atau penyerapan oksigen).',
    distractors: [
      { option: 'A cargo which may liquefy if shipped at moisture content exceeding TML', reason: 'Salah karena muatan mencair adalah Grup A.' },
      { option: 'A cargo which is completely inert and poses no physical or chemical hazard', reason: 'Salah karena muatan inert tanpa bahaya adalah Grup C.' },
      { option: 'A containerized package of consumer electronics', reason: 'Salah bukan paket elektronik kemasan.' },
    ],
    maritimeContext: 'Klasifikasi muatan curah berbahaya kode IMSBC.',
  },
  'm6-v-29': {
    summary: 'Fungsi konstruksi Lashing Bridge pada kapal kontainer besar.',
    whyCorrect: 'Lashing Bridge adalah jembatan kerangka baja di antara bay kontainer yang memungkinkan tenaga kerja memasang batang lashing panjang hingga tingkat kedua dan ketiga kontainer geladak.',
    distractors: [
      { option: 'A walkway connecting the forecastle to the poop deck', reason: 'Salah karena itu Flying Bridge / Gangway anjungan.' },
      { option: 'A platform used exclusively for mooring rope handling in locks', reason: 'Salah bukan platform tali tambat pintu air.' },
      { option: 'A structure supporting the satellite communication antennas', reason: 'Salah bukan tiang antena komunikasi satelit.' },
    ],
    maritimeContext: 'Konstruksi pengikatan peti kemas kapal kontainer ultra besar (ULCV).',
  },
  'm6-v-30': {
    summary: 'Prinsip hukum maritim General Average (GA).',
    whyCorrect: 'General Average adalah prinsip hukum maritim di mana seluruh pemilik kapal dan pemilik muatan menanggung bersama secara proporsional pengorbanan atau biaya luar biasa yang dilakukan secara sengaja demi menyelamatkan kapal dan muatan dari marabahaya bersama.',
    distractors: [
      { option: 'The mean fuel consumption rate of a vessel across an ocean voyage', reason: 'Salah bukan rata-rata konsumsi bahan bakar.' },
      { option: 'The average speed calculation used in charter party speed claims', reason: 'Salah bukan rata-rata kecepatan pelayaran.' },
      { option: 'The mathematical mean of student scores on a Marlins test', reason: 'Salah bukan nilai rata-rata ujian siswa.' },
    ],
    maritimeContext: 'Hukum maritim internasional klaim asuransi York-Antwerp Rules.',
  },

  // Calculations & Formulas (31-40)
  'm6-t-31': {
    summary: 'Kalkulasi Batas Kelembapan Aman Angkut / TML (FMP 12.0%, TML = 90% FMP).',
    whyCorrect: 'TML = 12,0% × 0,90 = 10,8%.',
    distractors: [
      { option: '11.2%', reason: 'Salah hitung perkalian.' },
      { option: '10.5%', reason: 'Salah hitung perkalian.' },
      { option: '11.5%', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'TML = FMP × 0.90 = 12.0% × 0.90 = 10.8%.',
    maritimeContext: 'Kalkulasi batas aman kadar air muatan curah IMSBC Code.',
  },
  'm6-t-32': {
    summary: 'Dekode posisi slot kontainer "13-06-84".',
    whyCorrect: 'Bay 13 (posisi membujur ganjil 20ft), Row 06 (genap = lambung kanan / starboard), Tier 84 (angka 82+ adalah on deck, tier 84 adalah susunan tingkat kedua di atas geladak).',
    distractors: [
      { option: 'Bay 13, Row 06 (Port side, odd row), Tier 84 (Under deck inside hold bottom tier)', reason: 'Salah karena Row genap adalah Starboard dan Tier 84 adalah di atas geladak.' },
      { option: 'Bay 13, Row 06 (On vessel centerline), Tier 84 (On forecastle mast)', reason: 'Salah posisi centerline adalah Row 00.' },
      { option: 'Bay 13, Row 06 (Engine room flat), Tier 84 (Ballast tank number 4)', reason: 'Salah pembacaan kompartemen.' },
    ],
    ruleOrFormula: 'Bay (Longitudinal), Row (Even=Starboard, Odd=Port), Tier (02-18=Underdeck, 82-96=Ondeck).',
    maritimeContext: 'Identifikasi posisi kontainer pada stowage plan kapal peti kemas.',
  },
  'm6-t-33': {
    summary: 'Kalkulasi Verified Gross Mass (VGM) kontainer (Tare 3.800 kg, Muatan 24.650 kg).',
    whyCorrect: 'VGM = (3.800 kg + 24.650 kg) ÷ 1.000 = 28.450 kg = 28,45 metrik ton.',
    distractors: [
      { option: '27.50 metric tonnes', reason: 'Salah penjumlahan.' },
      { option: '28.00 metric tonnes', reason: 'Salah pembulatan.' },
      { option: '29.10 metric tonnes', reason: 'Salah penjumlahan.' },
    ],
    ruleOrFormula: 'VGM = (Tare Weight + Cargo Weight) / 1,000 = 28.45 MT.',
    maritimeContext: 'Perhitungan berat kotor terverifikasi SOLAS Chapter VI VGM.',
  },
  'm6-t-34': {
    summary: 'Kalkulasi berat susunan kontainer geladak (28t, 26t, 24t, 20t terhadap batas 120t).',
    whyCorrect: 'Berat total susunan = 28 + 26 + 24 + 20 = 98,0 ton. Nilai ini berada 22,0 ton di bawah batas maksimal 120 ton, sehingga memenuhi syarat aman (Complies).',
    distractors: [
      { option: '125.0 tonnes (Exceeds limit by 5.0 tonnes)', reason: 'Salah hitung penjumlahan.' },
      { option: '98.0 tonnes (Exceeds limit because no stack can exceed 80 tonnes)', reason: 'Salah batasan batas izin adalah 120 ton.' },
      { option: '110.0 tonnes (Complies exactly)', reason: 'Salah hitung penjumlahan.' },
    ],
    ruleOrFormula: 'Total Stack Weight = 28 + 26 + 24 + 20 = 98.0 Tonnes (Limit: 120.0 Tonnes).',
    maritimeContext: 'Verifikasi beban tumpukan kontainer geladak (Stack Weight Limit).',
  },
  'm6-t-35': {
    summary: 'Kalkulasi persentase batas ledak bawah / LEL gas metana (Kadar 1,2% dari LEL 5,0%).',
    whyCorrect: 'Persentase LEL = (1,2% ÷ 5,0%) × 100% = 24% dari LEL.',
    distractors: [
      { option: '30% of LEL', reason: 'Salah hitung pembagian.' },
      { option: '15% of LEL', reason: 'Salah hitung pembagian.' },
      { option: '50% of LEL', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: '% LEL = (Measured Gas % / LEL %) × 100% = (1.2 / 5.0) × 100% = 24%.',
    maritimeContext: 'Pemantauan konsentrasi gas metana palka batu bara IMSBC Code.',
  },
  'm6-t-36': {
    summary: 'Kalkulasi durasi bongkar 18.000 MT biji-bijian pada laju 1.200 MT/jam.',
    whyCorrect: 'Durasi bongkar = 18.000 ton ÷ 1.200 ton/jam = 15,0 jam.',
    distractors: [
      { option: '12.5 hours', reason: 'Salah hitung pembagian.' },
      { option: '16.0 hours', reason: 'Salah hitung pembagian.' },
      { option: '14.0 hours', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Discharge Time = Total Tonnage / Rate = 18,000 / 1,200 = 15.0 Hours.',
    maritimeContext: 'Estimasi waktu bongkar muatan gantry crane terminal curah kering.',
  },
  'm6-t-37': {
    summary: 'Analisis bahaya oleng parametrik (Periode oleng alami Tn 24 detik, pertemuan ombak Te 12 detik).',
    whyCorrect: 'Periode pertemuan gelombang tepat setengah dari periode oleng alami kapal (rasio resonansi 1:2), yang memicu bahaya resonansi oleng parametrik ekstrem (Parametric Resonance Rolling).',
    distractors: [
      { option: 'The ship will run out of fuel twice as fast', reason: 'Salah bukan konsumsi bahan bakar.' },
      { option: 'The propeller will cavitate due to calm water', reason: 'Salah bukan kavitasi baling-baling.' },
      { option: 'The rudder indicator will lose calibration', reason: 'Salah bukan kalibrasi indikator kemudi.' },
    ],
    ruleOrFormula: 'Parametric Resonance Condition: Te ≈ 0.5 × Tn.',
    maritimeContext: 'Mitigasi bahaya dinamika stabilitas kapal kontainer di perairan berombak.',
  },
  'm6-t-38': {
    summary: 'Kalkulasi waktu denda demurrage (Izin laytime 72 jam, waktu aktual 90 jam).',
    whyCorrect: 'Waktu denda keterlambatan (Demurrage) = 90 jam - 72 jam = 18 jam denda.',
    distractors: [
      { option: '24 hours of demurrage', reason: 'Salah hitung pengurangan.' },
      { option: '12 hours of dispatch', reason: 'Salah karena waktu melebihi laytime menghasilkan demurrage, bukan dispatch.' },
      { option: '6 hours of dispatch', reason: 'Salah konsep.' },
    ],
    ruleOrFormula: 'Demurrage = Actual Used Time - Allowed Laytime = 90 - 72 = 18 Hours.',
    maritimeContext: 'Kalkulasi laytime dan denda demurrage kontrak sewa pelayaran (Charter Party Laytime).',
  },
  'm6-t-39': {
    summary: 'Konversi gaya pra-tarik turnbuckle 25 kN ke ton gaya (1 ton gaya ≈ 9,81 kN).',
    whyCorrect: 'Gaya tarik = 25 kN ÷ 9,81 kN/ton = 2,548 ≈ 2,55 ton gaya.',
    distractors: [
      { option: '1.80 tonnes force', reason: 'Salah hitung pembagian.' },
      { option: '3.20 tonnes force', reason: 'Salah hitung pembagian.' },
      { option: '4.10 tonnes force', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Force = 25 / 9.81 = 2.55 Tonnes Force.',
    maritimeContext: 'Kekuatan pra-tarik turnbuckle batang pengikat kontainer (Lashing Rod Tension).',
  },
  'm6-t-40': {
    summary: 'Kalkulasi total pemindahan kontainer 4 derek kuai (25 boks/jam per derek selama 8 jam).',
    whyCorrect: 'Total pemindahan = 4 derek × 25 boks/jam × 8 jam = 800 boks kontainer.',
    distractors: [
      { option: '600 moves', reason: 'Salah hitung perkalian.' },
      { option: '750 moves', reason: 'Salah hitung perkalian.' },
      { option: '1,000 moves', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Total Moves = 4 × 25 × 8 = 800 Moves.',
    maritimeContext: 'Kalkulasi produktivitas bongkar muat terminal peti kemas pelabuhan.',
  },

  // Reading Comprehension & Regulations (41-50)
  'm6-r-41': {
    summary: 'Penyebab langsung kapal curah terbalik menurut laporan investigasi MAIB.',
    whyCorrect: 'Penyebab langsung kapal terbalik adalah pencairan bijih nikel basah (kadar air 14,8% melampaui TML 10,2%) yang mengakibatkan hilangnya stabilitas melintang secara katastropik.',
    distractors: [
      { option: 'Structural failure of the rudder stock during turning maneuver', reason: 'Salah bukan patah tongkat kemudi.' },
      { option: 'Flooding of the engine room through fractured sea water pipe', reason: 'Salah bukan banjir kamar mesin.' },
      { option: 'Explosion of methane gas in the forward paint locker', reason: 'Salah bukan ledakan gudang cat.' },
    ],
    maritimeContext: 'Laporan investigasi kecelakaan maritim pencairan muatan curah (MAIB Casualty Report).',
  },
  'm6-r-42': {
    summary: 'Standar kekuatan putus geser (Shear Breaking Load) twistlock kontainer geladak.',
    whyCorrect: 'Buku pedoman pengikatan kargo menetapkan kekuatan putus geser (shear breaking strength) minimal twistlock semi-otomatis adalah 420 kN (dan 500 kN untuk kekuatan tarik).',
    distractors: [
      { option: '500 kN', reason: 'Salah karena 500 kN adalah kekuatan tarik minimal (Tension).' },
      { option: '300 kN', reason: 'Salah nilai di bawah standar CSS Code.' },
      { option: '250 kN', reason: 'Salah nilai di bawah standar CSS Code.' },
    ],
    ruleOrFormula: 'Twistlock Standards: Minimum Tension = 500 kN, Minimum Shear = 420 kN.',
    maritimeContext: 'Standar kekuatan perangkat lashing peti kemas CSS Code.',
  },
  'm6-r-43': {
    summary: 'Unsur manajemen risiko siber yang wajib dimasukkan ke dalam SMS kapal.',
    whyCorrect: 'Panduan IMO mewajibkan penerapan kontrol risiko siber dalam SMS mencakup pencadangan basis data navigasi, kepatuhan kata sandi, dan proteksi akses fisik peralatan OT anjungan.',
    distractors: [
      { option: 'Mandatory free Wi-Fi access for all visitors and shore stevedores', reason: 'SANGAT BERBAHAYA! Memberikan Wi-Fi bebas kepada pihak luar memicu kerentanan peretasan sistem kapal.' },
      { option: 'Replacing all electronic radar equipment with paper logbooks', reason: 'Salah bukan mengganti radar dengan buku manual.' },
      { option: 'Disabling the ship satellite communication system during port stay', reason: 'Salah mematikan satelit melanggar keselamatan GMDSS.' },
    ],
    maritimeContext: 'Integrasi manajemen risiko siber kapal dalam ISM Code (IMO Resolution MSC.428(98)).',
  },
  'm6-r-44': {
    summary: 'Lokasi pemuatan yang dilarang untuk bahan peledak IMDG Kelas 1.',
    whyCorrect: 'Muatan bahan peledak Kelas 1 dilarang keras dimuat langsung di atas geladak tangki bahan bakar berpemanas dan di dekat area akomodasi tempat tinggal awak kapal.',
    distractors: [
      { option: 'Inside cargo holds fitted with mechanical ventilation', reason: 'Salah palka berventilasi mekanis justru disyaratkan untuk bahan peledak.' },
      { option: 'On container tier number 82', reason: 'Salah tier 82 diizinkan jika memenuhi jarak segregasi.' },
      { option: 'Within 100 meters of the anchor chain locker', reason: 'Salah bukan pembatasan ceruk jangkar.' },
    ],
    maritimeContext: 'Aturan penempatan muatan berbahaya bahan peledak IMDG Code.',
  },
  'm6-r-45': {
    summary: 'Bahaya atmosfer yang ditimbulkan muatan kayu dan batu bara di ruang tertutup palka.',
    whyCorrect: 'Muatan kayu dan batu bara menyerap oksigen atmosfer dengan cepat serta melepaskan gas beracun karbon monoksida dan karbon dioksida yang memicu asfiksia fatal dalam hitungan detik.',
    distractors: [
      { option: 'Excessive accumulation of pure ozone gas', reason: 'Salah muatan organik tidak menghasilkan gas ozon murni.' },
      { option: 'Over-pressurization of hold access hatch covers', reason: 'Salah bukan tekanan berlebih tutup palka.' },
      { option: 'Formation of combustible liquid petroleum vapors', reason: 'Salah bukan uap minyak bumi cair.' },
    ],
    maritimeContext: 'Prosedur keselamatan memasuki ruang tertutup palka muatan curah (IMO Enclosed Space Entry).',
  },
  'm6-r-46': {
    summary: 'Persyaratan susunan cadangan ECDIS menurut SOLAS Bab V.',
    whyCorrect: 'Kapal wajib memiliki unit ECDIS cadangan independen dengan suplai daya dan sensor terpisah, atau membawa satu set lengkap peta kertas resmi terbaru yang terkoreksi.',
    distractors: [
      { option: 'A handheld GPS receiver with commercial leisure road maps', reason: 'Salah peta jalan darat GPS genggam tidak diakui untuk navigasi pelayaran resmi.' },
      { option: 'A magnetic steering compass without deviation card', reason: 'Salah pedoman magnet tanpa daftar deviasi tidak memenuhi syarat.' },
      { option: 'A smartphone navigation application without satellite link', reason: 'Salah aplikasi ponsel bukan instrumen navigasi SOLAS.' },
    ],
    maritimeContext: 'Persyaratan kelaiklautan navigasi elektronik SOLAS Bab V.',
  },
  'm6-r-47': {
    summary: 'Frekuensi pemantauan dan pencatatan suhu kontainer reefer aktif.',
    whyCorrect: 'Pemeriksaan dan pencatatan suhu udara pasokan dan kembali (supply and return air) pada seluruh kontainer berpendingin aktif wajib dilakukan minimal dua kali sehari.',
    distractors: [
      { option: 'Once every week', reason: 'Salah sepekan sekali terlalu lama dan berisiko kargo busuk.' },
      { option: 'Only upon arrival at discharge port', reason: 'Salah pencatatan wajib dilakukan selama pelayaran.' },
      { option: 'Once a month during sea passage', reason: 'Salah sebulan sekali.' },
    ],
    maritimeContext: 'Prosedur pengawasan suhu muatan kontainer berpendingin (Reefer Container Log).',
  },
  'm6-r-48': {
    summary: 'Definisi muatan curah padat Grup C kode IMSBC.',
    whyCorrect: 'Muatan Grup C didefinisikan sebagai material curah padat yang tidak rentan mencair (bukan Grup A) dan tidak memiliki bahaya kimiawi (bukan Grup B), seperti pasir silika dan semen klinker.',
    distractors: [
      { option: 'Cargoes that always emit combustible methane gas', reason: 'Salah itu muatan Grup B.' },
      { option: 'Chemical hazardous liquids carried in bulk tanks', reason: 'Salah karena IMSBC hanya untuk muatan curah padat.' },
      { option: 'Explosive military ammunition in standardized containers', reason: 'Salah itu muatan kontainer IMDG Kelas 1.' },
    ],
    maritimeContext: 'Kategori muatan curah padat tidak berbahaya kode IMSBC.',
  },
  'm6-r-49': {
    summary: 'Ambang batas keausan korosi perangkat lashing kontainer pada inspeksi Paris MoU.',
    whyCorrect: 'Petugas PSC memeriksa bahwa keausan korosi pada twistlock, bridge fitting, dan eye-plate tidak boleh melebihi 10% dari ketebalan baja asli.',
    distractors: [
      { option: 'Exceeding 50% of steel thickness', reason: 'Salah batas 50% sangat rapuh dan berbahaya.' },
      { option: 'Exceeding 25% of steel thickness', reason: 'Salah batas izin maksimal adalah 10%.' },
      { option: 'Zero corrosion allowed on any fitting', reason: 'Salah korosi permukaan ringan wajar asal < 10%.' },
    ],
    ruleOrFormula: 'Lashing Gear Wastage Limit: Maximum allowable corrosion ≤ 10% of original thickness.',
    maritimeContext: 'Inspeksi kelaikan perangkat pengikat kargo Port State Control.',
  },
  'm6-r-50': {
    summary: 'Tiga komponen utama penjamin kekedapan cuaca tutup palka kapal curah.',
    whyCorrect: 'Tiga komponen utama yang wajib diperiksa kekedapannya adalah karet packing (rubber gaskets), batang penekan (compression bars), dan klem pengunci samping (side cleats).',
    distractors: [
      { option: 'Anchor chain links, hawse pipes, and windlass brakes', reason: 'Salah karena itu peralatan jangkar haluan.' },
      { option: 'Lifeboat engine fuel filters and spark plugs', reason: 'Salah karena itu peralatan mesin sekoci penolong.' },
      { option: 'Galley oven thermostats and refrigeration compressors', reason: 'Salah karena itu peralatan dapur kapal.' },
    ],
    maritimeContext: 'Pemeriksaan kekedapan cuaca ambang palka kapal curah (Hatch Cover Weather-tightness).',
  },

  // Listening & Terminal/Emergency VHF (51-60)
  'm6-l-51': {
    summary: 'Alasan penyisihan kontainer di dermaga oleh operator derek kuai.',
    whyCorrect: 'Kontainer disisihkan ke dermaga karena sudut bawah (corner casting) retak/rusak sehingga twistlock semi-otomatis tidak dapat mengunci dengan aman.',
    distractors: [
      { option: 'Container exceeded maximum weight by 10 tonnes', reason: 'Salah bukan karena kelebihan berat.' },
      { option: 'Reefer temperature alarm was sounding', reason: 'Salah bukan alarm reefer.' },
      { option: 'Customs seal was missing from container door', reason: 'Salah bukan segel pabean.' },
    ],
    maritimeContext: 'Komunikasi koordinasi keselamatan pemuatan kontainer terminal pelabuhan.',
  },
  'm6-l-52': {
    summary: 'Penyebab penghentian darurat pemuatan kapal curah di palka 2.',
    whyCorrect: 'Pemuatan dihentikan darurat karena laju curah berlebih menyebabkan tegangan geser lambung (shearing stress) melonjak hingga 98% dari batas izin pelabuhan.',
    distractors: [
      { option: 'Conveyor belt conveyor motor caught fire on the jetty', reason: 'Salah bukan motor konveyor terbakar.' },
      { option: 'Rainstorm started soaking the dry cement clinker cargo', reason: 'Salah bukan karena hujan basah.' },
      { option: 'Vessel ran aground on the loading berth', reason: 'Salah kapal tidak kandas.' },
    ],
    maritimeContext: 'Pengawasan tegangan struktur lambung kapal curah saat pemuatan cepat (Hull Stress Monitoring).',
  },
  'm6-l-53': {
    summary: 'Peringatan anomali GPS Spoofing dari VTS Singapura dan instruksi navigasi.',
    whyCorrect: 'VTS memperingatkan adanya anomali GPS dan menginstruksikan seluruh navigator memverifikasi posisi secara silang menggunakan jarak radar terestrial, baringan visual, dan parallel indexing.',
    distractors: [
      { option: 'Drop anchor immediately in the center of the fairway', reason: 'SANGAT BERBAHAYA! Melempar jangkar di tengah alur pelayaran utama dapat menyebabkan tubrukan beruntun.' },
      { option: 'Switch off all radar transmitters and echo sounders', reason: 'Salah radar justru dibutuhkan untuk verifikasi jarak.' },
      { option: 'Increase speed to 20 knots to clear the area', reason: 'Salah mengebut di area labuh jangkar sangat berbahaya.' },
    ],
    maritimeContext: 'Peringatan keselamatan navigasi anomali sinyal satelit navigasi.',
  },
  'm6-l-54': {
    summary: 'Penyebab kenaikan suhu kontainer reefer vaksin farmasi MNBU-881920.',
    whyCorrect: 'Kenaikan suhu terjadi akibat sakelar pemutus sirkuit (circuit breaker) motor kompresor terputus, dan kini telah diganti cadangan serta suhu kembali normal ke +4°C.',
    distractors: [
      { option: 'Container door was left open by stevedores', reason: 'Salah bukan pintu terbuka.' },
      { option: 'Reefer cooling gas leaked completely into sea', reason: 'Salah freon tidak bocor.' },
      { option: 'Ship main generator suffered complete blackout', reason: 'Salah genset bekerja normal.' },
    ],
    maritimeContext: 'Penanganan gangguan teknis kontainer pendingin kargo farmasi.',
  },
  'm6-l-55': {
    summary: 'Deklarasi General Average dan tindakan pengorbanan muatan darurat oleh Nakhoda.',
    whyCorrect: 'Nakhoda mendeklarasikan General Average setelah kehilangan 12 kontainer dan membuang sengaja (jettison) 8 kontainer geladak demi mencegah kapal terbalik akibat lambung bocor di laut ganas.',
    distractors: [
      { option: 'Abandoned ship with all crew into lifeboats', reason: 'Salah kapal tidak ditinggalkan.' },
      { option: 'Anchored ship on coral reef in international waters', reason: 'Salah tidak dijangkarkan di terumbu karang.' },
      { option: 'Sold the vessel to salvage tug operator', reason: 'Salah kapal tidak dijual.' },
    ],
    maritimeContext: 'Pernyataan General Average dan pembuangan muatan darurat (Jettison of Cargo).',
  },
  'm6-l-56': {
    summary: 'Peringatan bahaya fumigasi gas fosfin pada palka 3 kapal curah.',
    whyCorrect: 'Palka 3 telah difumigasi pelet gas fosfin beracun untuk hama kutu biji-bijian, seluruh palka disegel dan dilarang keras dimasuki siapa pun sampai izin pelabuhan tiba.',
    distractors: [
      { option: 'Hold No. 3 is flooded with sea water for firefighting', reason: 'Salah palka tidak dibanjiri air laut.' },
      { option: 'Hold No. 3 is being painted with epoxy resin', reason: 'Salah bukan pengecatan epoksi.' },
      { option: 'Hold No. 3 is open for grain shovel cleaning', reason: 'Salah palka disegel rapat dan dilarang dimasuki.' },
    ],
    maritimeContext: 'Prosedur keselamatan fumigasi muatan biji-bijian dalam pelayaran (In-transit Fumigation).',
  },
  'm6-l-57': {
    summary: 'Konfirmasi penyelesaian lashing kontainer geladak dari mandor bongkar muat.',
    whyCorrect: 'Mandor lashing mengonfirmasi bahwa seluruh batang pengikat silang dan jarum keras (turnbuckles) telah dikencangkan, dikunci mur pengaman, dan sertifikat pengikatan telah ditandatangani.',
    distractors: [
      { option: 'Half of the containers are unsecured due to missing rods', reason: 'Salah seluruh kontainer telah terikat 100% lengkap.' },
      { option: 'Stevedores are requesting 50 additional chain binders', reason: 'Salah tidak meminta rantai tambahan.' },
      { option: 'Crane operations are delayed due to lightning storm', reason: 'Salah bukan penundaan derek.' },
    ],
    maritimeContext: 'Konfirmasi penyelesaian pengikatan muatan kontainer geladak.',
  },
  'm6-l-58': {
    summary: 'Temuan PSC Code 17 yang wajib diperbaiki sebelum kapal berangkat.',
    whyCorrect: 'Petugas PSC menerbitkan temuan Code 17 bahwa baterai cadangan UPS untuk unit ECDIS utama telah kadaluarsa dan wajib diganti sebelum pandu naik kapal.',
    distractors: [
      { option: 'Missing magnetic compass deviation card', reason: 'Salah bukan kartu deviasi pedoman magnet.' },
      { option: 'Expired life raft hydro-static release units', reason: 'Salah bukan HRU sekoci.' },
      { option: 'Broken sewage treatment plant macerator', reason: 'Salah bukan mesin pengolah kotoran.' },
    ],
    maritimeContext: 'Temuan pemeriksaan kelaiklautan Port State Control (PSC Code 17 Rectification).',
  },
  'm6-l-59': {
    summary: 'Tindakan keselamatan darurat kebocoran asam korosif kontainer TGHU-440192.',
    whyCorrect: 'Kru mengidentifikasi kebocoran asam korosif (Kelas 8) dan memastikan sumbat lubang pembuangan geladak (scupper plugs) terpasang rapat guna mencegah pencemaran ke laut.',
    distractors: [
      { option: 'Hosing acid overboard directly into harbor waters', reason: 'SANGAT FATAL! Membuang cairan asam kimia ke air pelabuhan adalah tindak pidana pencemaran lingkungan MARPOL.' },
      { option: 'Opening container door without respiratory protection', reason: 'SANGAT BERBAHAYA! Menghirup uap asam pekat tanpa SCBA memicu luka bakar paru-paru.' },
      { option: 'Pouring gasoline onto the chemical puddle', reason: 'SANGAT FATAL! Menuang bensin memicu kebakaran dan ledakan.' },
    ],
    maritimeContext: 'Tanggap darurat kebocoran bahan kimia berbahaya kode IMDG di atas kapal.',
  },
  'm6-l-60': {
    summary: 'Verifikasi pertukaran rute navigasi mandiri aman (Autonomous Route Exchange) ECDIS.',
    whyCorrect: 'Perwira navigasi memverifikasi tanda tangan digital dan kecocokan hash kriptografi sebelum mengaktifkan rute revisi yang dikirimkan VTS melalui gerbang aman ECDIS.',
    distractors: [
      { option: 'Route accepted automatically without human officer check', reason: 'Salah wajib melalui verifikasi perwira navigasi manusia.' },
      { option: 'ECDIS rebooted in safe mode to clear antivirus alarms', reason: 'Salah bukan reboot safe mode.' },
      { option: 'Satellite internet disconnected permanently', reason: 'Salah koneksi satelit tidak diputus permanen.' },
    ],
    maritimeContext: 'Pertukaran rute navigasi elektronik aman (Secure ECDIS Route Exchange).',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 7 (All 60 Questions)
const TEST_7_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm7-g-01': {
    summary: 'Struktur direktif formal: Subject jamak (wardens) + are to + base verb.',
    whyCorrect: '"All muster wardens are to remain..." adalah bentuk instruksi direktif formal yang mewajibkan seluruh petugas pos kumpul tetap berada di stasiun tangga.',
    distractors: [
      { option: 'is', reason: 'Salah subject-verb agreement untuk subjek jamak "wardens".' },
      { option: 'was', reason: 'Salah tenses past untuk instruksi aktif.' },
      { option: 'to be', reason: 'Salah predikat tanpa kata bantu finite verb.' },
    ],
    ruleOrFormula: 'Formal Directive: Plural Subject + are to + Base Verb.',
    maritimeContext: 'Penempatan petugas muster warden di tangga darurat saat evakuasi penumpang kapal ferry Ro-Ro.',
  },
  'm7-g-02': {
    summary: 'Inverted Third Conditional Passive: Had + Subject + been + Adverb + Verb 3 (been properly).',
    whyCorrect: '"Had the pins been properly engaged..." adalah bentuk pengandaian lampau pasif tanpa If (Setara dengan: "If the pins had been properly engaged...").',
    distractors: [
      { option: 'properly been', reason: 'Salah posisi penempatan adverb.' },
      { option: 'were properly', reason: 'Salah struktur inversi past perfect.' },
      { option: 'had properly', reason: 'Salah bentuk aktif tanpa been.' },
    ],
    ruleOrFormula: 'Inverted 3rd Conditional Passive: Had + Subject + been + Adverb + Verb 3.',
    maritimeContext: 'Pencegahan insiden kebocoran pintu haluan (Bow Visor) kapal Ro-Ro akibat kelalaian penguncian pin ramp.',
  },
  'm7-g-03': {
    summary: 'Subjunctive Mood: Mandated that + Subject + bare verb (receive).',
    whyCorrect: 'Setelah frasa ketetapan mandat resmi ("mandated that..."), kata kerja selanjutnya wajib menggunakan bentuk dasar (bare infinitive) murni "receive".',
    distractors: [
      { option: 'receives', reason: 'Salah bentuk orang ketiga tunggal.' },
      { option: 'received', reason: 'Salah bentuk past tense.' },
      { option: 'is receiving', reason: 'Salah continuous.' },
    ],
    ruleOrFormula: 'Subjunctive Mood: Mandated that + Subject + Base Verb (receive).',
    maritimeContext: 'Kewajiban penilaian tahunan Indikator Intensitas Karbon (CII) MARPOL Annex VI.',
  },
  'm7-g-04': {
    summary: 'Susunan baku instruksi pengendalian massa darurat (Crowd Control Directive).',
    whyCorrect: 'Susunan baku instruksi pengendalian massa: Polite Imperative (Please remain calm) + Conjunction (and) + Action Directive (follow the crew instructions) + Directional Prepositional Phrase (towards your assigned muster station).',
    distractors: [
      { option: 'Remain calm please and follow your assigned muster station towards the crew instructions.', reason: 'Salah susunan logika frasa arah.' },
    ],
    ruleOrFormula: 'Crowd Control Imperative: Please + Verb 1 + and + Verb 1 + towards + Location.',
    maritimeContext: 'Pengumuman pengendalian kepanikan massa penumpang menuju stasiun kumpul darurat (Muster Station).',
  },
  'm7-g-05': {
    summary: 'Pola kata kerja "advise + object + to-infinitive" dan tujuan "to + verb".',
    whyCorrect: 'Pola kata kerja nasihat "advised the convoy to maintain" (menasihati konvoi untuk mempertahankan) dan infinitive tujuan "to avoid" (untuk menghindari terjepit es).',
    distractors: [
      { option: 'for, for', reason: 'Salah pola infinitif kata kerja.' },
      { option: 'in, in order', reason: 'Salah preposisi.' },
      { option: 'at, so that', reason: 'Salah preposisi.' },
    ],
    ruleOrFormula: 'Verb Pattern: Advise + Object + to-infinitive; Purpose: to + Base Verb.',
    maritimeContext: 'Instruksi kapal pemecah es (Icebreaker) kepada konvoi kapal untuk mempertahankan RPM mesin konstan.',
  },
  'm7-g-06': {
    summary: 'Cleft Sentence penegasan lampau: It was [noun] that + Past Verb (caused).',
    whyCorrect: '"It was the rapid accumulation... that caused..." adalah cleft sentence penegasan yang menekankan akumulasi es semprotan laut sebagai penyebab kemiringan kapal.',
    distractors: [
      { option: 'causing', reason: 'Salah participle tanpa finite verb.' },
      { option: 'was caused', reason: 'Salah bentuk pasif.' },
      { option: 'causes', reason: 'Salah tenses present.' },
    ],
    ruleOrFormula: 'Cleft Sentence: It was + Noun Phrase + that + Past Verb (caused).',
    maritimeContext: 'Penumpukan es semprotan laut (Spray Icing) di bangunan atas kapal kutub yang merusak stabilitas.',
  },
  'm7-g-07': {
    summary: 'Subjunctive Mood Pasif: Recommended that + Subject + be + Verb 3 (be switched).',
    whyCorrect: 'Setelah kata kerja rekomendasi ("recommended that..."), kalimat pasif subjunctive menggunakan bentuk dasar "be + Verb 3 (be switched)".',
    distractors: [
      { option: 'is', reason: 'Salah bentuk indikatif present.' },
      { option: 'was', reason: 'Salah bentuk indikatif past.' },
      { option: 'were', reason: 'Salah bentuk indikatif jamak.' },
    ],
    ruleOrFormula: 'Subjunctive Passive: Recommended that + Subject + be + Verb 3.',
    maritimeContext: 'Peralihan bahan bakar mesin ganda ke metanol hijau di kawasan suaka lingkungan pesisir.',
  },
  'm7-g-08': {
    summary: 'Pasangan konjungsi korelatif: No sooner had... than...',
    whyCorrect: 'Pasangan konjungsi korelatif baku untuk "No sooner" adalah "than" (No sooner had the drencher system activated than the fire was contained).',
    distractors: [
      { option: 'when', reason: 'Salah karena "when" berpasangan dengan "Hardly" atau "Scarcely".' },
      { option: 'then', reason: 'Salah pasangan kata hubung.' },
      { option: 'before', reason: 'Salah pasangan kata hubung.' },
    ],
    ruleOrFormula: 'Correlative Structure: No sooner had + Past Participle... than + Past Simple.',
    maritimeContext: 'Pemadaman cepat kebakaran baterai mobil listrik di geladak kendaraan menggunakan sistem drencher.',
  },
  'm7-g-09': {
    summary: 'Participle Clause menyatakan hasil efisiensi: Main Clause + "," + V-ing (reducing).',
    whyCorrect: '"reducing greenhouse gas emissions..." adalah present participle clause yang menyatakan hasil atau dampak efisiensi emisi yang dicapai oleh pemasangan layar rotor Flettner.',
    distractors: [
      { option: 'reduced', reason: 'Salah past participle.' },
      { option: 'reduces', reason: 'Salah finite verb tanpa kata hubung.' },
      { option: 'to reduce', reason: 'Kurang tepat untuk menyatakan hasil operasional yang telah terbukti.' },
    ],
    ruleOrFormula: 'Result Participle Clause: Main Clause + "," + V-ing (reducing).',
    maritimeContext: 'Pengurangan emisi gas rumah kaca menggunakan teknologi bantuan angin Rotor Sail.',
  },
  'm7-g-10': {
    summary: 'Konjungsi kondisi berulang: "whenever" (setiap kali / kapan pun).',
    whyCorrect: '"whenever" menyatakan kondisi berulang ("setiap kali / kapan pun") saat kapal bernavigasi di perairan berkonsentrasi es > 4/10.',
    distractors: [
      { option: 'wherever', reason: 'Kurang tepat karena konteks kalimat menekankan waktu/kondisi operasi.' },
      { option: 'whichever', reason: 'Salah pilihan objek.' },
      { option: 'however', reason: 'Salah makna pertentangan.' },
    ],
    ruleOrFormula: 'Temporal Conditional: whenever + V-ing / clause.',
    maritimeContext: 'Kepatuhan terhadap Buku Panduan Operasi Perairan Kutub (PWOM) Polar Code.',
  },
  'm7-g-11': {
    summary: 'Negative Inversion: Scarcely + had + Subject + Verb 3... before...',
    whyCorrect: 'Kata keterangan bernilai negatif "Scarcely" di awal kalimat memicu inversi kata bantu "had" mendahului subjek "the connection".',
    distractors: [
      { option: 'was', reason: 'Salah auxiliary past.' },
      { option: 'did', reason: 'Salah auxiliary simple past.' },
      { option: 'has', reason: 'Salah tenses present perfect.' },
    ],
    ruleOrFormula: 'Negative Inversion: Scarcely + had + Subject + Verb 3... before + Past Simple.',
    maritimeContext: 'Penyambungan listrik darat tegangan tinggi (Cold Ironing / HVSC) sebelum genset dimatikan.',
  },
  'm7-g-12': {
    summary: 'Pola preposisi majemuk diikuti gerund: on account of + Noun + V-ing (making).',
    whyCorrect: 'Preposisi kausal "on account of" (karena) diikuti frasa benda pelaku dan bentuk gerund: on account of the crew making.',
    distractors: [
      { option: 'made', reason: 'Salah past tense.' },
      { option: 'make', reason: 'Salah bare infinitive.' },
      { option: 'to make', reason: 'Salah to-infinitive setelah preposisi.' },
    ],
    ruleOrFormula: 'Preposition + Object + Gerund: on account of + Noun + V-ing.',
    maritimeContext: 'Pengendalian psikologi massa penumpang melalui siaran instruksi yang jelas dan menenangkan.',
  },
  'm7-g-13': {
    summary: 'Frasa preposisi formal tujuan: "with a view to + gerund" (demi / bertujuan untuk).',
    whyCorrect: '"with a view to" adalah frasa formal maritim yang diikuti gerund (V-ing) dan bermakna "dengan tujuan untuk / demi menghindari" (with the aim of).',
    distractors: [
      { option: 'in addition to', reason: 'Salah makna "sebagai tambahan".' },
      { option: 'by means of', reason: 'Salah makna "dengan sarana/cara".' },
      { option: 'in terms of', reason: 'Salah makna "dalam hal".' },
    ],
    ruleOrFormula: 'Formal Prepositional Phrase of Purpose: with a view to + V-ing.',
    maritimeContext: 'Perubahan haluan kapal untuk menghindari pecahan es terapung (Growlers & Bergy Bits).',
  },
  'm7-g-14': {
    summary: 'Inverted Second Conditional: Were + Subject + to + Verb 1 (to become).',
    whyCorrect: '"Were the vehicle deck scuppers to become blocked..." adalah bentuk pengandaian tipe 2 formal tanpa If (Setara dengan: "If the scuppers were to become blocked...").',
    distractors: [
      { option: 'became', reason: 'Salah past tense.' },
      { option: 'becoming', reason: 'Salah participle.' },
      { option: 'becomes', reason: 'Salah present tense.' },
    ],
    ruleOrFormula: 'Inverted 2nd Conditional: Were + Subject + to + Verb 1.',
    maritimeContext: 'Bahaya penyumbatan lubang got pembuangan geladak kendaraan (Scuppers) yang memicu efek permukaan bebas.',
  },
  'm7-g-15': {
    summary: 'Participle Clause menyatakan pencapaian hasil: Main Clause + "," + V-ing (surpassing).',
    whyCorrect: '"surpassing..." adalah participle clause yang menyatakan pencapaian hasil simulasi evakuasi kapal pesiar yang berhasil melampaui tolok ukur 30 menit SOLAS.',
    distractors: [
      { option: 'surpassed', reason: 'Salah past tense tanpa konjungsi.' },
      { option: 'surpass', reason: 'Salah bare infinitive.' },
      { option: 'to surpass', reason: 'Kurang tepat untuk menyatakan hasil pencapaian faktual.' },
    ],
    ruleOrFormula: 'Accomplishment Participle Clause: Main Clause + "," + V-ing (surpassing).',
    maritimeContext: 'Uji coba simulasi evakuasi massal penumpang kapal pesiar sesuai standar SOLAS Bab III.',
  },

  // Vocabulary & Specialized Ro-Ro/Polar/Green (16-30)
  'm7-v-16': {
    summary: 'Definisi konstruksi Bow Visor pada kapal penyeberangan Ro-Ro.',
    whyCorrect: 'Bow Visor adalah struktur pintu cangkang luar berengsel di haluan kapal ferry yang terangkat ke atas secara hidrolik untuk akses kendaraan melewati ramp kedap air bagian dalam.',
    distractors: [
      { option: 'An optical sighting compass on the bridge wings', reason: 'Salah itu pedoman bidik anjungan (Pelorus).' },
      { option: 'A sunshade fitted over the wheelhouse forward windows', reason: 'Salah bukan peneduh kaca anjungan.' },
      { option: 'A protective guard fitted around the bow anchor hawse pipe', reason: 'Salah bukan pelindung ulup jangkar.' },
    ],
    maritimeContext: 'Konstruksi pintu haluan kapal Ro-Ro penumpang (Ro-Ro Bow Doors & Visors).',
  },
  'm7-v-17': {
    summary: 'Definisi bongkahan es "Growler" menurut IMO Polar Code.',
    whyCorrect: 'Growler adalah bongkahan es kecil yang muncul kurang dari 1 meter di atas permukaan laut dan luasnya kurang dari 20 m², sehingga sangat sulit terdeteksi oleh radar navigasi.',
    distractors: [
      { option: 'A severe arctic gale exceeding Beaufort Force 10', reason: 'Salah bukan badai kutub.' },
      { option: 'A polar bear swimming across a shipping lane', reason: 'Salah bukan beruang kutub.' },
      { option: 'The low-frequency vibration of an icebreaker propeller', reason: 'Salah bukan getaran baling-baling.' },
    ],
    maritimeContext: 'Klasifikasi bahaya es navigasi kutub pedoman IMO Polar Code.',
  },
  'm7-v-18': {
    summary: 'Definisi Indikator Intensitas Karbon (CII) MARPOL Annex VI.',
    whyCorrect: 'CII adalah metrik efisiensi energi operasional yang mengukur emisi gas rumah kaca tahunan kapal per kapasitas bobot mati dan mil laut, dengan pemeringkatan nilai dari A hingga E.',
    distractors: [
      { option: 'A carbon filter installed inside the galley exhaust duct', reason: 'Salah bukan filter cerobong dapur.' },
      { option: 'The percentage of unburned carbon soot in diesel engine oil', reason: 'Salah bukan kadar jelaga oli mesin.' },
      { option: 'A device measuring carbon dioxide levels inside lifeboats', reason: 'Salah bukan sensor CO2 sekoci.' },
    ],
    maritimeContext: 'Regulasi dekarbonisasi operasional kapal MARPOL Annex VI.',
  },
  'm7-v-19': {
    summary: 'Definisi Marine Evacuation System (MES) pada kapal penumpang.',
    whyCorrect: 'MES adalah sistem seluncur/parasut tiup vertikal atau miring yang memindahkan penumpang secara cepat dari geladak embarkasi langsung ke rakit penolong terapung tanpa derek sekoci.',
    distractors: [
      { option: 'An automated alarm siren waking up all passenger cabins', reason: 'Salah bukan sirene alarm kabin.' },
      { option: 'A helicopter winch platform on the sun deck', reason: 'Salah bukan helideck kapal.' },
      { option: 'A system of lifebuoys thrown from bridge wings', reason: 'Salah bukan pelampung penolong lempar.' },
    ],
    maritimeContext: 'Peralatan keselamatan evakuasi massal penumpang SOLAS Bab III.',
  },
  'm7-v-20': {
    summary: 'Arti istilah "Cold Ironing" (HVSC) pada operasi pelabuhan ramah lingkungan.',
    whyCorrect: 'Cold Ironing (Penyambungan Listrik Darat Tegangan Tinggi) adalah penyambungan kabel daya listrik pelabuhan ke kapal sandar agar mesin diesel bantu dapat dimatikan total demi mewujudkan nol emisi di pelabuhan.',
    distractors: [
      { option: 'Cooling engine exhaust manifolds with refrigerated ice water', reason: 'Salah bukan pendinginan manifold.' },
      { option: 'De-icing the anchor windlass with steam lances', reason: 'Salah bukan pembersihan es jangkar.' },
      { option: 'Welding hull steel plates in freezing arctic temperatures', reason: 'Salah bukan pengelasan pelat lambung.' },
    ],
    maritimeContext: 'Teknologi pelabuhan hijau ramah lingkungan (Onshore Power Supply / Cold Ironing).',
  },
  'm7-v-21': {
    summary: 'Definisi fenomena Thermal Runaway pada kebakaran mobil listrik di kapal Ro-Ro.',
    whyCorrect: 'Thermal Runaway adalah reaksi pemanasan mandiri berantai yang tak terkendali di dalam sel baterai lithium-ion yang melepaskan gas beracun dan mudah terbakar, membutuhkan pendinginan air dalam jumlah masif secara terus-menerus.',
    distractors: [
      { option: 'The rapid boiling of engine cooling water in extreme heat', reason: 'Salah bukan pendidihan air radiator biasa.' },
      { option: 'The freezing of car tires on open upper deck in winter', reason: 'Salah bukan pembekuan ban mobil.' },
      { option: 'The failure of car air conditioning compressors', reason: 'Salah bukan kompresor AC mobil.' },
    ],
    maritimeContext: 'Prosedur penanganan kebakaran kendaraan listrik di kapal penyeberangan Ro-Ro.',
  },
  'm7-v-22': {
    summary: 'Definisi perairan terbuka "Polynya" dalam navigasi kutub.',
    whyCorrect: 'Polynya adalah area perairan terbuka non-linear yang terkepung di dalam hamparan es laut (pack ice) yang tetap bebas es secara alami meskipun kondisi sekitar membeku.',
    distractors: [
      { option: 'A specialized ice navigation sextant', reason: 'Salah bukan sekstan es.' },
      { option: 'An arctic bird nesting on navigation buoys', reason: 'Salah bukan burung kutub.' },
      { option: 'A frozen freshwater iceberg formed on land', reason: 'Salah bukan gunung es daratan.' },
    ],
    maritimeContext: 'Oseanografi navigasi perairan es kutub (WMO Sea-Ice Nomenclature).',
  },
  'm7-v-23': {
    summary: 'Definisi teknologi Air Lubrication pada lambung kapal.',
    whyCorrect: 'Teknologi Air Lubrication adalah pemompaan lapisan gelembung udara mikro di bawah dasar lambung kapal untuk mengurangi gesekan hidrodinamis air dan menghemat bahan bakar.',
    distractors: [
      { option: 'Injecting compressed air into diesel engine turbochargers', reason: 'Salah bukan injeksi udara turbocharger.' },
      { option: 'Spraying silicone grease on stern propeller blades', reason: 'Salah pelumasan gemuk pada baling-baling mencemari laut.' },
      { option: 'Pumping air into ballast tanks during emergency deballasting', reason: 'Salah bukan peniupan tangki ballast.' },
    ],
    maritimeContext: 'Teknologi efisiensi energi hijau lambung kapal (Clean Marine Technology).',
  },
  'm7-v-24': {
    summary: 'Peran petugas Crowd Management Marshall menurut regulasi STCW Table A-V/2.',
    whyCorrect: 'Petugas pengendali massa bertugas mengatur pergerakan penumpang, mencegah kepanikan, mengosongkan jalur pelarian darurat, dan memandu penumpang secara tertib ke stasiun kumpul.',
    distractors: [
      { option: 'To operate the ship radar and helm controls', reason: 'Salah itu tugas perwira navigasi jaga.' },
      { option: 'To inspect engine fuel injectors during sea passage', reason: 'Salah itu tugas masinis kamar mesin.' },
      { option: 'To handle customs declaration forms at the terminal', reason: 'Salah itu tugas administrasi pabean.' },
    ],
    maritimeContext: 'Pelatihan manajemen pengendalian massa kapal penumpang regulasi STCW.',
  },
  'm7-v-25': {
    summary: 'Definisi teknologi Flettner Rotor Sail pada kapal ramah lingkungan.',
    whyCorrect: 'Rotor Sail Flettner adalah silinder tegak berputar yang memanfaatkan Efek Magnus dari hembusan angin relatif untuk menghasilkan gaya dorong aerodinamis maju bagi kapal.',
    distractors: [
      { option: 'A flexible canvas sail hoisted on the radar mast', reason: 'Salah bukan layar kain kanvas konvensional.' },
      { option: 'A propeller fitted inside a Kort steering nozzle', reason: 'Salah bukan baling-baling pipa Kort.' },
      { option: 'A wind turbine generating electricity for passenger elevators', reason: 'Salah bukan turbin kincir lift.' },
    ],
    maritimeContext: 'Sistem propulsi bantuan angin ramah lingkungan (Wind-Assisted Propulsion Systems / WAPS).',
  },
  'm7-v-26': {
    summary: 'Definisi pecahan gunung es "Bergy Bit" dalam terminologi es internasional.',
    whyCorrect: 'Bergy Bit adalah bongkahan besar pecahan gletser es terapung dengan ketinggian antara 1 hingga 5 meter di atas permukaan laut dan luas sekitar 100 hingga 300 meter persegi.',
    distractors: [
      { option: 'A small pancake ice disc in freezing rivers', reason: 'Salah karena itu Pancake Ice.' },
      { option: 'An iceberg larger than an entire island', reason: 'Salah karena itu Ice Island / Tabular Iceberg.' },
      { option: 'A frozen icicle hanging from the ship anchor', reason: 'Salah bukan tetesan es beku.' },
    ],
    maritimeContext: 'Terminologi es internasional untuk navigasi perairan dingin (IMO Polar Code).',
  },
  'm7-v-27': {
    summary: 'Definisi Metanol Hijau (Green Methanol) sebagai bahan bakar dekarbonisasi kapal.',
    whyCorrect: 'Metanol Hijau adalah bahan bakar metanol yang diproduksi dari hidrogen hijau terbarukan dan penangkapan karbon biogenik, menghasilkan siklus hidup emisi karbon mendekati nol (net-zero).',
    distractors: [
      { option: 'Methanol colored with green dye for safety identification', reason: 'Salah bukan pewarna hijau kosmetik.' },
      { option: 'Methanol mixed with raw unrefined crude oil', reason: 'Salah pencampuran minyak mentah bukan bahan bakar hijau.' },
      { option: 'Methanol extracted directly from seawater algae without processing', reason: 'Salah proses ekstraksi fiktif.' },
    ],
    maritimeContext: 'Bahan bakar alternatif dekarbonisasi pelayaran masa depan.',
  },
  'm7-v-28': {
    summary: 'Definisi Dokumen Muster List pada keselamatan kapal penumpang.',
    whyCorrect: 'Muster List adalah dokumen resmi yang merinci tugas kedaruratan, pos stasiun, dan tindakan yang wajib dilakukan setiap awak kapal saat kebakaran, tubrukan, maupun perintah meninggalkan kapal.',
    distractors: [
      { option: 'A list of daily menu choices for passengers', reason: 'Salah bukan daftar menu makanan.' },
      { option: 'A passenger ticket manifest given to immigration', reason: 'Salah bukan manifes tiket imigrasi.' },
      { option: 'A list of duty-free items for sale in the ship gift shop', reason: 'Salah bukan daftar barang toko bebas bea.' },
    ],
    maritimeContext: 'Daftar tugas darurat awak kapal penumpang (SOLAS Chapter III Muster List).',
  },
  'm7-v-29': {
    summary: 'Arti kondisi kapal "Beset in Ice" pada pelayaran perairan kutub.',
    whyCorrect: 'Beset in Ice (Terjepit Es) adalah kondisi di mana kapal terkepung rapat oleh es laut dan tidak mampu bergerak menggunakan tenaga mesinnya sendiri, sehingga membutuhkan bantuan kapal pemecah es.',
    distractors: [
      { option: 'A ship equipped with an icebreaker bow classification', reason: 'Salah itu kapal berkelas lambung es (Ice-strengthened ship).' },
      { option: 'A vessel anchored safely in a frozen fjord', reason: 'Salah bukan lego jangkar aman.' },
      { option: 'A ship loading refrigerated fish cargo', reason: 'Salah bukan muat kargo ikan beku.' },
    ],
    maritimeContext: 'Situasi darurat pelayaran di perairan beku kutub (Polar Ice Navigation).',
  },
  'm7-v-30': {
    summary: 'Definisi Indeks Desain Efisiensi Energi Kapal Beroperasi (EEXI).',
    whyCorrect: 'EEXI adalah indeks teknis yang mengukur efisiensi energi desain struktur dan emisi karbon per kapasitas-mil untuk kapal-kapal yang telah beroperasi (existing ships) menurut MARPOL Annex VI.',
    distractors: [
      { option: 'An annual tax paid on bunker fuel purchases', reason: 'Salah bukan pajak tahunan bahan bakar.' },
      { option: 'A certificate issued to electric vehicles on ferries', reason: 'Salah bukan sertifikat mobil listrik.' },
      { option: 'A measurement of engine room sound insulation', reason: 'Salah bukan peredam suara kamar mesin.' },
    ],
    maritimeContext: 'Kepatuhan sertifikasi efisiensi energi desain kapal IMO EEXI.',
  },

  // Calculations & Dynamics (31-40)
  'm7-t-31': {
    summary: 'Kalkulasi durasi evakuasi 960 penumpang menggunakan 2 stasiun luncur MES (60 orang/menit per stasiun).',
    whyCorrect: 'Laju evakuasi total = 2 stasiun × 60 orang/menit = 120 orang/menit. Waktu evakuasi = 960 orang ÷ 120 orang/menit = 8,0 menit.',
    distractors: [
      { option: '12.0 minutes', reason: 'Salah hitung pembagian.' },
      { option: '16.0 minutes', reason: 'Salah karena hanya menghitung satu stasiun luncur.' },
      { option: '6.5 minutes', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Total Flow = 2 × 60 = 120 pass/min. Time = 960 / 120 = 8.0 Minutes.',
    maritimeContext: 'Kalkulasi kecepatan aliran evakuasi massal stasiun seluncur MES.',
  },
  'm7-t-32': {
    summary: 'Kalkulasi pertambahan bobot atas akumulasi es geladak terbuka 800 m² (Densitas 30 kg/m²).',
    whyCorrect: 'Berat es total = (800 m² × 30 kg/m²) ÷ 1.000 kg/ton = 24.000 kg = 24,0 metrik ton.',
    distractors: [
      { option: '20.0 metric tonnes', reason: 'Salah hitung perkalian.' },
      { option: '28.5 metric tonnes', reason: 'Salah hitung perkalian.' },
      { option: '16.0 metric tonnes', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Ice Weight = (Area × Density) / 1,000 = (800 × 30) / 1,000 = 24.0 MT.',
    maritimeContext: 'Kalkulasi pertambahan bobot atas akumulasi es geladak kutub (Polar Ice Accretion).',
  },
  'm7-t-33': {
    summary: 'Kalkulasi emisi CO2 yang dicegah dengan listrik darat HVSC (36.000 kWh, reduksi 0,60 kg CO2/kWh).',
    whyCorrect: 'CO2 yang dicegah = (36.000 kWh × 0,60 kg/kWh) ÷ 1.000 kg/ton = 21.600 kg = 21,6 metrik ton CO2.',
    distractors: [
      { option: '18.0 metric tonnes CO2', reason: 'Salah hitung perkalian (0.50).' },
      { option: '24.5 metric tonnes CO2', reason: 'Salah hitung perkalian.' },
      { option: '15.2 metric tonnes CO2', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'CO2 Avoided = (kWh × 0.60) / 1,000 = (36,000 × 0.60) / 1,000 = 21.6 MT CO2.',
    maritimeContext: 'Kalkulasi reduksi emisi karbon pemanfaatan listrik darat (Cold Ironing HVSC).',
  },
  'm7-t-34': {
    summary: 'Kalkulasi total gaya penekan hidrolik 8 cleat pintu haluan Ro-Ro (125 kN per cleat).',
    whyCorrect: 'Gaya jepit total = 8 cleat × 125 kN = 1.000 kN.',
    distractors: [
      { option: '800 kN', reason: 'Salah hitung perkalian.' },
      { option: '1,200 kN', reason: 'Salah hitung perkalian.' },
      { option: '950 kN', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Total Force = 8 × 125 kN = 1,000 kN.',
    maritimeContext: 'Kekuatan penekan hidrolik kekedapan pintu haluan kapal Ro-Ro.',
  },
  'm7-t-35': {
    summary: 'Konversi jarak aman konvoi kapal pemecah es 4 cable ke meter (1 cable = 185,2 meter).',
    whyCorrect: 'Jarak konvoi = 4 cable × 185,2 meter = 740,8 meter.',
    distractors: [
      { option: '620.0 meters', reason: 'Salah hitung perkalian.' },
      { option: '850.5 meters', reason: 'Salah hitung perkalian.' },
      { option: '555.6 meters', reason: 'Salah karena hanya mengalikan 3 cable.' },
    ],
    ruleOrFormula: 'Distance = 4 × 185.2 = 740.8 Meters.',
    maritimeContext: 'Jarak aman iring-iringan konvoi di belakang kapal pemecah es.',
  },
  'm7-t-36': {
    summary: 'Evaluasi peringkat CII capaian 4,80 gCO2/(dwt·nm) terhadap target 5,20 gCO2/(dwt·nm).',
    whyCorrect: 'Ya, memenuhi syarat karena nilai capaian intensitas karbon 4,80 lebih rendah/unggul daripada batas target 5,20, sehingga kapal berhak memperoleh peringkat efisiensi tinggi A atau B.',
    distractors: [
      { option: 'No, CII values must be higher than target to pass', reason: 'Salah karena semakin rendah nilai CII operasional, semakin tinggi efisiensi kapal.' },
      { option: 'No, CII rating is assessed only once every 10 years', reason: 'Salah evaluasi CII dinilai setiap tahun.' },
      { option: 'Yes, but only if the ship sails in tropical zones', reason: 'Salah CII berlaku global di seluruh rute pelayaran.' },
    ],
    ruleOrFormula: 'CII Rule: Attained CII < Target Threshold = High Efficiency Rating (A or B).',
    maritimeContext: 'Evaluasi peringkat kepatuhan intensitas karbon kapal MARPOL Annex VI.',
  },
  'm7-t-37': {
    summary: 'Kalkulasi kapasitas stasiun kumpul darurat 350 m² (Standar SOLAS 0,35 m²/orang).',
    whyCorrect: 'Kapasitas stasiun kumpul = 350 m² ÷ 0,35 m²/orang = 1.000 orang.',
    distractors: [
      { option: '850 persons', reason: 'Salah hitung pembagian.' },
      { option: '1,200 persons', reason: 'Salah hitung pembagian.' },
      { option: '750 persons', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Capacity = Area / Area per Person = 350 / 0.35 = 1,000 Persons.',
    maritimeContext: 'Kalkulasi kapasitas stasiun kumpul darurat penumpang SOLAS Bab III.',
  },
  'm7-t-38': {
    summary: 'Waktu pembekuan radang dingin (Frostbite) pada suhu Wind Chill -46°C di udara terbuka.',
    whyCorrect: 'Pada suhu Wind Chill -46°C, kulit yang terbuka akan membeku dan mengalami radang dingin parah (frostbite) dalam waktu kurang dari 5 menit.',
    distractors: [
      { option: 'Over 2 hours without danger', reason: 'SANGAT FATAL! Berada di luar tanpa proteksi pada -46°C selama 2 jam memicu kematian hipotermia.' },
      { option: '45 minutes under normal conditions', reason: 'Salah 45 menit terlalu lama untuk -46°C.' },
      { option: 'No risk of freezing in marine atmosphere', reason: 'Salah angin laut justru mempercepat pelepasan panas tubuh.' },
    ],
    maritimeContext: 'Bahaya paparan suhu dingin ekstrem bagi awak kapal di perairan kutub.',
  },
  'm7-t-39': {
    summary: 'Kalkulasi suplai air sistem drencher geladak mobil listrik (5.000 L/menit selama 20 menit).',
    whyCorrect: 'Total volume air pemadam = 5.000 liter/menit × 20 menit = 100.000 liter = 100 m³.',
    distractors: [
      { option: '50,000 liters (50 m³)', reason: 'Salah hitung perkalian (10 menit).' },
      { option: '150,000 liters (150 m³)', reason: 'Salah hitung perkalian.' },
      { option: '80,000 liters (80 m³)', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Volume = Rate × Time = 5,000 × 20 = 100,000 L = 100 m³.',
    maritimeContext: 'Kalkulasi suplai air pemadam sistem drencher geladak kendaraan mobil listrik.',
  },
  'm7-t-40': {
    summary: 'Kalkulasi emisi CO2 pembakaran 45 ton Metanol Hijau (Faktor emisi 1,375 tCO2/ton).',
    whyCorrect: 'Total emisi CO2 = 45 ton × 1,375 tCO2/ton = 61,875 ≈ 61,88 metrik ton CO2.',
    distractors: [
      { option: '55.20 metric tonnes CO2', reason: 'Salah hitung perkalian.' },
      { option: '72.50 metric tonnes CO2', reason: 'Salah hitung perkalian.' },
      { option: '48.00 metric tonnes CO2', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Emissions = Fuel Mass × Carbon Factor = 45 × 1.375 = 61.88 MT CO2.',
    maritimeContext: 'Perhitungan emisi gas buang bahan bakar metanol hijau IMO GHG Protocol.',
  },

  // Reading Comprehension & Regulations (41-50)
  'm7-r-41': {
    summary: 'Penyebab utama bencana kapal ferry Ro-Ro tenggelam menurut hasil investigasi resmi.',
    whyCorrect: 'Faktor utama penyebab bencana kapal tenggelam adalah kapal berlayar dengan pintu visor haluan tidak terkunci dan ramp kedap air dalam tidak terpasang aman, sehingga gelombang haluan membanjiri geladak kendaraan.',
    distractors: [
      { option: 'Failure of the auxiliary diesel generator fuel injector', reason: 'Salah bukan kerusakan injektor genset.' },
      { option: 'Over-loading of passengers in upper cabin lounge', reason: 'Salah bukan kelebihan penumpang di lounge.' },
      { option: 'Loss of radar display in heavy rain', reason: 'Salah bukan gangguan radar.' },
    ],
    maritimeContext: 'Laporan investigasi kecelakaan tenggelamnya kapal ferry Ro-Ro.',
  },
  'm7-r-42': {
    summary: 'Durasi minimal perbekalan bertahan hidup darurat di perairan kutub (IMO Polar Code).',
    whyCorrect: 'Peralatan keselamatan di perairan kutub wajib menjamin seluruh awak dan penumpang mampu bertahan hidup pada suhu ekstrem (-30°C atau lebih rendah) selama minimal tidak kurang dari 5 hari.',
    distractors: [
      { option: 'Not less than 24 hours', reason: 'Salah batas 24 jam hanya untuk perairan tropis.' },
      { option: 'Not less than 48 hours', reason: 'Salah batas 48 jam di bawah standar Polar Code.' },
      { option: 'Not less than 14 days', reason: 'Salah bukan 14 hari.' },
    ],
    ruleOrFormula: 'Polar Code Survival Standard: Provisions for not less than 5 days.',
    maritimeContext: 'Standar peralatan bertahan hidup pelayaran kutub IMO Polar Code.',
  },
  'm7-r-43': {
    summary: 'Kondisi wajib penyusunan Rencana Aksi Korektif SEEMP Bagian III menurut MARPOL Annex VI.',
    whyCorrect: 'Rencana Aksi Korektif (SEEMP Bagian III) wajib disusun jika kapal memperoleh peringkat CII "D" selama 3 tahun berturut-turut atau peringkat "E" selama satu tahun.',
    distractors: [
      { option: 'Only upon transfer of ship ownership', reason: 'Salah bukan hanya saat ganti pemilik kapal.' },
      { option: 'Whenever the vessel undergoes 5-year special drydock survey', reason: 'Salah bukan saat survey 5 tahunan dok kering.' },
      { option: 'Exclusively when changing flag administration', reason: 'Salah bukan saat ganti bendera.' },
    ],
    ruleOrFormula: 'CII Corrective Mandate: 3 consecutive "D" ratings OR 1 "E" rating.',
    maritimeContext: 'Kewajiban audit rencana perbaikan efisiensi energi kapal MARPOL Annex VI.',
  },
  'm7-r-44': {
    summary: 'Mekanisme keselamatan yang diverifikasi sebelum penyambungan listrik darat tegangan tinggi (HVSC).',
    whyCorrect: 'Sebelum kabel daya listrik bertegangan 6,6 kV dialiri arus, rangkaian interlock pengaman otomatis wajib memverifikasi kontinuitas pembumian (ground) dan kesiapan pemutus darurat jika kabel tertarik.',
    distractors: [
      { option: 'Air conditioning temperature in crew mess', reason: 'Salah bukan suhu AC ruang makan awak.' },
      { option: 'Passenger luggage weight on gangway conveyor', reason: 'Salah bukan timbangan bagasi penumpang.' },
      { option: 'Bunker fuel oil viscosity in service tank', reason: 'Salah bukan viskositas bahan bakar.' },
    ],
    maritimeContext: 'Standar keselamatan penyambungan listrik darat tegangan tinggi IEC/ISO/IEEE 80005-1.',
  },
  'm7-r-45': {
    summary: 'Gaya komunikasi yang direkomendasikan saat evakuasi massal penumpang (STCW).',
    whyCorrect: 'Pengumuman harus disampaikan dengan suara yang tenang, jelas, dan berwibawa guna mencegah perilaku panik massa, dorong-mendorong, dan penumpukan di lorong tangga.',
    distractors: [
      { option: 'Loud, frantic screaming over sirens to hurry passengers', reason: 'SANGAT BERBAHAYA! Teriakan histeris memicu kepanikan massal dan kecelakaan injak-menginjak.' },
      { option: 'Complete radio silence without passenger updates', reason: 'Salah membisu tanpa informasi memicu ketakutan penumpang.' },
      { option: 'Playing loud party music over the public address system', reason: 'Salah musik pesta menghalangi komunikasi instruksi darurat.' },
    ],
    maritimeContext: 'Keterampilan komunikasi manajemen krisis dan perilaku manusia STCW Table A-V/2.',
  },
  'm7-r-46': {
    summary: 'Aturan keselamatan pengisian daya mobil listrik di atas kapal Ro-Ro.',
    whyCorrect: 'Pengisian daya baterai kendaraan listrik di atas kapal dilarang keras kecuali menggunakan stasiun pengisian daya bersertifikasi maritim yang dilengkapi pemantauan suhu termal.',
    distractors: [
      { option: 'Permitted using standard household extension cords', reason: 'SANGAT FATAL! Kabel rol ekstensi rumah tangga dapat meleleh dan memicu kebakaran geladak.' },
      { option: 'Mandatory for all electric cars on every voyage', reason: 'Salah pengisian daya tidak diwajibkan.' },
      { option: 'Allowed only during rough sea conditions', reason: 'Salah kondisi laut bergelombang justru meningkatkan risiko guncangan baterai.' },
    ],
    maritimeContext: 'Pedoman pencegahan bahaya pengisian daya mobil listrik di kapal penyeberangan.',
  },
  'm7-r-47': {
    summary: 'Kewajiban seketika jika kapal kehilangan daya mesin saat berkonvoi di perairan es.',
    whyCorrect: 'Jika kapal kehilangan daya mesin saat berkonvoi di perairan es, perwira wajib segera memberitahu kapal pemecah es dan kapal lain di saluran VHF taktis agar jarak konvoi dapat disesuaikan.',
    distractors: [
      { option: 'Deploy bow anchor into deep ice pack', reason: 'SANGAT BERBAHAYA! Menjatuhkan jangkar di lapisan es tebal dapat merusak mesin jangkar dan mematahkan rantai.' },
      { option: 'Turn on deck floodlights and sound whistle indefinitely', reason: 'Salah bukan menyalakan lampu tanpa komunikasi radio.' },
      { option: 'Evacuate engine room into liferafts', reason: 'Salah kehilangan daya bukan alasan meninggalkan kapal.' },
    ],
    maritimeContext: 'Prosedur keselamatan darurat konvoi kapal pemecah es.',
  },
  'm7-r-48': {
    summary: 'Lokasi alarm peringatan kebocoran air di geladak kendaraan Ro-Ro (SOLAS Bab II-1).',
    whyCorrect: 'Detektor permukaan air di geladak kendaraan kapal Ro-Ro wajib membunyikan alarm visual dan suara di anjungan navigasi (navigation bridge) dan pusat keselamatan kapal dalam 30 detik.',
    distractors: [
      { option: 'In the passenger cinema lounge', reason: 'Salah bukan di bioskop penumpang.' },
      { option: 'Inside the galley cold storage rooms', reason: 'Salah bukan di gudang pendingin dapur.' },
      { option: 'On the open sun deck only', reason: 'Salah bukan hanya di geladak berjemur.' },
    ],
    maritimeContext: 'Sistem deteksi dini kebocoran air geladak Ro-Ro SOLAS Bab II-1.',
  },
  'm7-r-49': {
    summary: 'Bahaya operasional utama bahan bakar alternatif amonia hijau.',
    whyCorrect: 'Bahaya utama bahan bakar amonia hijau adalah sifat toksisitas kimiawi yang sangat tinggi dan korosif, sehingga memerlukan pemipaan ganda berpelindung gas nitrogen dan menara pencuci air.',
    distractors: [
      { option: 'High greenhouse gas carbon emissions', reason: 'Salah karena amonia tidak mengandung unsur karbon (zero carbon).' },
      { option: 'Excessive radioactive gamma radiation', reason: 'Salah amonia bukan zat radioaktif.' },
      { option: 'Rapid freezing of double bottom fuel tanks', reason: 'Salah bukan pembekuan tangki dasar ganda.' },
    ],
    maritimeContext: 'Mitigasi bahaya bahan bakar alternatif nol karbon amonia cair.',
  },
  'm7-r-50': {
    summary: 'Tujuan Sistem Pendukung Keputusan Darurat anjungan kapal penumpang (SOLAS).',
    whyCorrect: 'Sistem Pendukung Keputusan Darurat berfungsi menyediakan rencana tindakan darurat terstruktur yang telah ditetapkan sebelumnya bagi perwira anjungan untuk respons cepat saat krisis.',
    distractors: [
      { option: 'To calculate passenger casino payouts automatically', reason: 'Salah bukan mesin kasino.' },
      { option: 'To automate ticket sales and cabin booking upgrades', reason: 'Salah bukan penjualan tiket.' },
      { option: 'To replace the Master authority with shore remote control', reason: 'Salah kewenangan tertinggi tetap berada di tangan Nakhoda di kapal.' },
    ],
    maritimeContext: 'Sistem pendukung keputusan anjungan kapal penumpang SOLAS Bab III.',
  },

  // Listening & Crisis/Polar VHF (51-60)
  'm7-l-51': {
    summary: 'Instruksi konvoi kapal pemecah es Polaris kepada MV Arctic Trader.',
    whyCorrect: 'Kapal pemecah es menginstruksikan pengurangan kecepatan menjadi 5 knot, mengemudi tepat di jalur bekas pecah es pada jarak 3 kabel, dan segera melapor jika kecepatan turun di bawah 4 knot.',
    distractors: [
      { option: 'Overtake icebreaker on starboard side at full sea speed', reason: 'SANGAT BERBAHAYA! Menyalip kapal pemecah es di lapisan es tebal dapat memicu benturan lambung es fatal.' },
      { option: 'Drop both bow anchors and stop main engine', reason: 'Salah bukan melempar jangkar.' },
      { option: 'Turn 180 degrees and return to departure port', reason: 'Salah tidak diperintahkan putar balik.' },
    ],
    maritimeContext: 'Komunikasi komando taktis konvoi navigasi es kutub.',
  },
  'm7-l-52': {
    summary: 'Laporan darurat kebakaran kendaraan listrik dari petugas patroli geladak.',
    whyCorrect: 'Petugas patroli melaporkan kebakaran SUV listrik di Geladak 3 dengan gejala thermal runaway baterai, dan langsung mengaktifkan sistem drencher air Seksi 2.',
    distractors: [
      { option: 'Vehicle deck is clear of all fire hazards', reason: 'Salah terjadi kebakaran aktif.' },
      { option: 'Passenger car alarm sounded accidentally due to engine vibration', reason: 'Salah bukan alarm mobil biasa.' },
      { option: 'Bow door hydraulic oil leak on car deck ramp', reason: 'Salah bukan kebocoran oli pintu haluan.' },
    ],
    maritimeContext: 'Laporan darurat kebakaran kendaraan listrik di geladak penyeberangan.',
  },
  'm7-l-53': {
    summary: 'Instruksi siaran pengumuman Nakhoda kepada seluruh penumpang kapal.',
    whyCorrect: 'Nakhoda meminta seluruh penumpang tetap tenang dan segera menuju ke Stasiun Kumpul (Muster Station) di Geladak 6 dengan mengenakan pakaian hangat serta mengikuti petunjuk kru.',
    distractors: [
      { option: 'Jump immediately into the sea with lifebuoys', reason: 'SANGAT FATAL! Melompat ke laut tanpa instruksi memicu tenggelam dan hipotermia seketika.' },
      { option: 'Remain locked inside cabins until further notice', reason: 'Salah penumpang diperintahkan menuju pos kumpul.' },
      { option: 'Assemble on the helicopter sun deck', reason: 'Salah pos kumpul berada di Geladak 6.' },
    ],
    maritimeContext: 'Siaran pengumuman resmi Nakhoda kepada penumpang saat situasi darurat.',
  },
  'm7-l-54': {
    summary: 'Pemeriksaan keselamatan yang dikonfirmasi sebelum penyambungan listrik darat 6,6 kV.',
    whyCorrect: 'Teknisi pelabuhan mengonfirmasi kabel tegangan tinggi 6,6 kV telah tersambung, rangkaian interlock kawat pilot tertutup aktif, dan sistem pembumian telah terverifikasi aman.',
    distractors: [
      { option: 'Ship auxiliary generators have run out of diesel', reason: 'Salah genset tidak kehabisan solar.' },
      { option: 'Shore power voltage has surged to dangerous levels', reason: 'Salah tegangan stabil dan aman.' },
      { option: 'Port electrical substation has tripped offline', reason: 'Salah gardu induk darat bekerja normal.' },
    ],
    maritimeContext: 'Protokol penyambungan listrik darat kapal pesiar ramah lingkungan.',
  },
  'm7-l-55': {
    summary: 'Peringatan bahaya gunung es SECURITE dari International Ice Patrol.',
    whyCorrect: 'Patroli Es Internasional menyiarkan peringatan navigasi adanya gunung es tabular sepanjang 1,2 mil laut yang hanyut ke selatan disertai pecahan bergy bits dan growlers.',
    distractors: [
      { option: 'Pack ice has completely cleared from northern passage', reason: 'Salah bukan laporan jalur bebas es.' },
      { option: 'Icebreaker is disabled and drifting in ice', reason: 'Salah bukan kapal pemecah es rusak.' },
      { option: 'Harbor entrance is frozen shut with fast ice', reason: 'Salah bukan pelabuhan beku.' },
    ],
    maritimeContext: 'Peringatan keselamatan navigasi bahaya gunung es Samudra Atlantik Utara.',
  },
  'm7-l-56': {
    summary: 'Konfirmasi kelaikan pintu haluan Ro-Ro dari Mualim 1 sebelum kapal bertolak.',
    whyCorrect: 'Mualim 1 mengonfirmasi pintu visor haluan telah tertutup rapat, 8 cleat hidrolik terkunci hijau, ramp kedap air dalam terkunci baut pengaman, dan CCTV bebas rembesan air.',
    distractors: [
      { option: 'Bow visor is stuck open, delay departure by 2 hours', reason: 'Salah pintu visor berfungsi sempurna.' },
      { option: 'Inner ramp is broken and cannot support vehicle weight', reason: 'Salah ramp dalam dalam kondisi prima.' },
      { option: 'Vehicle deck is being washed with sea water', reason: 'Salah bukan pencucian geladak.' },
    ],
    maritimeContext: 'Pemeriksaan akhir kekedapan pintu haluan sebelum kapal Ro-Ro bertolak.',
  },
  'm7-l-57': {
    summary: 'Laporan keberhasilan penurunan sistem seluncur evakuasi massal (MES).',
    whyCorrect: 'Perwira keselamatan melaporkan parasut luncur MES Stasiun 1 berhasil mengembang, dua rakit 150 orang tersambung, dan evakuasi penumpang berlangsung lancar pada laju 50 orang/menit.',
    distractors: [
      { option: 'MES chute punctured and deflated, abort deployment', reason: 'Salah parasut luncur mengembang sempurna.' },
      { option: 'Liferaft painter parted in heavy sea swell', reason: 'Salah tali penambat rakit aman.' },
      { option: 'Passengers refused to slide down the evacuation chute', reason: 'Salah proses embarkasi berjalan lancar.' },
    ],
    maritimeContext: 'Operasi penurunan sistem seluncur evakuasi massal laut (MES Deployment).',
  },
  'm7-l-58': {
    summary: 'Pemeriksaan keselamatan sebelum pemompaan bunker metanol hijau dimulai.',
    whyCorrect: 'Tongkang bunker mengonfirmasi jalur pengembalian uap tersambung, pemipaan telah di-purging nitrogen hingga kadar oksigen 0,2%, dan uji tekanan selang ganda berhasil lolos.',
    distractors: [
      { option: 'Methanol hose is leaking on the manifold tray', reason: 'Salah tidak ada kebocoran selang.' },
      { option: 'Oxygen content is 21% inside methanol cargo line', reason: 'SANGAT BERBAHAYA! 21% oksigen memicu bahaya kebakaran.' },
      { option: 'Pumping commenced without nitrogen inerting', reason: 'Salah purging nitrogen wajib diselesaikan.' },
    ],
    maritimeContext: 'Prosedur pengisian bunker bahan bakar metanol hijau ramah lingkungan.',
  },
  'm7-l-59': {
    summary: 'Laporan manfaat efisiensi pengaktifan sistem pelumasan udara dasar lambung.',
    whyCorrect: 'Kepala Kamar Mesin melaporkan lapisan gelembung udara mikro di dasar lambung telah aktif sempurna dan konsumsi bahan bakar mesin induk turun sebesar 8,5% pada kecepatan 19 knot.',
    distractors: [
      { option: 'Air lubrication failed due to compressor explosion', reason: 'Salah kompresor bekerja normal.' },
      { option: 'Micro-bubbles caused severe propeller cavitation', reason: 'Salah tidak menyebabkan kavitasi baling-baling.' },
      { option: 'Fuel consumption increased by 15%', reason: 'Salah konsumsi bahan bakar justru turun 8,5%.' },
    ],
    maritimeContext: 'Laporan efisiensi sistem pelumasan gelembung udara dasar lambung.',
  },
  'm7-l-60': {
    summary: 'Pengiriman logistik dan personel medis helikopter penyelamat kutub ke kapal pesiar.',
    whyCorrect: 'Helikopter penyelamat telah menurunkan perlengkapan bertahan hidup kutub (Polar Survival Kits) serta dokter medis ke geladak buritan dan bersiap mengevakuasi pasien kritis.',
    distractors: [
      { option: 'Life raft was dropped into the freezing sea', reason: 'Salah bukan menjatuhkan rakit penolong.' },
      { option: 'Helicopter crashed onto the stern deck', reason: 'Salah helikopter melayang aman.' },
      { option: 'Helicopter returned to base due to lack of fuel', reason: 'Salah misi penyelamatan terlaksana sukses.' },
    ],
    maritimeContext: 'Operasi evakuasi medis helikopter di perairan kutub ekstrem.',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 8 (All 60 Questions)
const TEST_8_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm8-g-01': {
    summary: 'Subjunctive Mood dalam instruksi teknis: Requested that + Subject + bare verb (verify).',
    whyCorrect: 'Setelah kata kerja permintaan formal ("requested that..."), kata kerja yang mengikuti subjek wajib menggunakan bentuk dasar murni "verify" tanpa akhiran -s.',
    distractors: [
      { option: 'verified', reason: 'Salah bentuk past tense.' },
      { option: 'verifies', reason: 'Salah bentuk orang ketiga tunggal.' },
      { option: 'is verifying', reason: 'Salah continuous.' },
    ],
    ruleOrFormula: 'Subjunctive Mood: Requested that + Subject + Base Verb (verify).',
    maritimeContext: 'Pemeriksaan dan verifikasi duga tangki dasar ganda sebelum pengurasan air dok kolam (Dewatering).',
  },
  'm8-g-02': {
    summary: 'Perfect Participle Clause Aktif: Having + Verb 3 (synchronized) + Object.',
    whyCorrect: '"Having synchronized both cranes..." menyatakan tindakan sinkronisasi derek yang telah tuntas diselesaikan sebelum muatan diizinkan diangkat.',
    distractors: [
      { option: 'synchronizing', reason: 'Salah present participle.' },
      { option: 'synchronize', reason: 'Salah bare infinitive.' },
      { option: 'been synchronized', reason: 'Salah bentuk pasif karena supercargo adalah pelaku aktif yang menyinkronkan derek.' },
    ],
    ruleOrFormula: 'Perfect Participle Active: Having + Verb 3 (synchronized) + Object.',
    maritimeContext: 'Sinkronisasi dua derek berat kapal (Heavy Lift Tandem Cranes) untuk pengangkatan modul turbin industri.',
  },
  'm8-g-03': {
    summary: 'Inverted Third Conditional: Had + Subject + not + Verb 3, Subject + would have + Verb 3 (would have exceeded).',
    whyCorrect: '"Had the pumps not reacted instantly, the list would have exceeded..." adalah kalimat pengandaian tipe 3 lampau tanpa If.',
    distractors: [
      { option: 'will exceed', reason: 'Salah tenses future.' },
      { option: 'exceeded', reason: 'Salah past simple.' },
      { option: 'would exceed', reason: 'Salah conditional tipe 2.' },
    ],
    ruleOrFormula: 'Inverted 3rd Conditional: Had + Subject + not + Verb 3, Subject + would have + Verb 3.',
    maritimeContext: 'Respon otomatis sistem pompa anti-kemiringan (Anti-Heeling System) saat pengangkatan muatan berat di pelabuhan.',
  },
  'm8-g-04': {
    summary: 'Susunan baku laporan survei lunas dok (Keel Block Inspection Report).',
    whyCorrect: 'Susunan baku laporan survei: Prepositional Time Phrase (Prior to vessel entry) + Subject (all keel and bilge blocks) + Passive Main Verb (were aligned) + Prepositional Reference Phrase (according to the docking plan).',
    distractors: [
      { option: 'All keel and bilge blocks were aligned according to the docking plan prior to vessel entry.', reason: 'Kurang lazim dalam tata urutan formal klausa laporan inspeksi maritim.' },
    ],
    ruleOrFormula: 'Formal Survey Syntax: Prior to + Noun Phrase + Subject + were + Verb 3 + according to + Reference.',
    maritimeContext: 'Penyusunan dan penataan balok lunas (Keel Blocks) dok kolam sesuai Docking Plan sebelum kapal masuk dok.',
  },
  'm8-g-05': {
    summary: 'Kolokasi kontrak maritim baku: "contracted under LOF" dan "on a No Cure - No Pay basis".',
    whyCorrect: 'Kolokasi hukum maritim baku: "contracted under Lloyd\'s Open Form" (dikontrak berdasarkan LOF) dan "on a \'No Cure - No Pay\' basis" (atas dasar kondisi No Cure - No Pay).',
    distractors: [
      { option: 'by, with', reason: 'Salah kolokasi hukum maritim.' },
      { option: 'in, for', reason: 'Salah preposisi.' },
      { option: 'at, under', reason: 'Salah preposisi.' },
    ],
    ruleOrFormula: 'Contractual Maritime Collocations: Contracted under LOF; On a No Cure - No Pay basis.',
    maritimeContext: 'Kontrak pertolongan dan penyelamatan kapal salvage berdasar klausula baku LOF.',
  },
  'm8-g-06': {
    summary: 'Modal deduksi kepastian lampau: must have + Verb 3 (must have parted).',
    whyCorrect: '"must have parted" menyatakan kesimpulan logis yang sangat pasti bahwa kawat penarik putus akibat beban kejut akut gelombang 6 meter.',
    distractors: [
      { option: 'should part', reason: 'Salah makna keharusan.' },
      { option: 'ought to part', reason: 'Salah makna anjuran.' },
      { option: 'can have parted', reason: 'Kurang tepat untuk menyatakan kepastian deduksi lampau.' },
    ],
    ruleOrFormula: 'Past Logical Deduction: must have + Verb 3 (must have parted).',
    maritimeContext: 'Putusnya kawat penarik utama (Towing Pennant) akibat beban kejut dinamis ombak besar saat penundaan samudra.',
  },
  'm8-g-07': {
    summary: 'Subjunctive Mood Pasif: Essential that + Subject + be + Verb 3 (be recorded).',
    whyCorrect: 'Setelah frasa urgensi penting ("essential that..."), bentuk pasif subjunctive menggunakan bentuk dasar "be + Verb 3 (be recorded)".',
    distractors: [
      { option: 'is', reason: 'Salah bentuk indikatif present.' },
      { option: 'was', reason: 'Salah bentuk indikatif past.' },
      { option: 'are being', reason: 'Salah continuous.' },
    ],
    ruleOrFormula: 'Subjunctive Passive: Essential that + Subject + be + Verb 3.',
    maritimeContext: 'Pengukuran ketebalan pelat lambung ultrasonik (UTM) sesuai standar klasifikasi IACS UR Z7.',
  },
  'm8-g-08': {
    summary: 'Participle Clause menyatakan hasil: Main Clause + "," + V-ing (reducing).',
    whyCorrect: '"reducing..." menyatakan dampak penurunan tahanan gesek hidrodinamis lambung sebesar 9% berkat pelapisan cat silikon anti-biota.',
    distractors: [
      { option: 'reduced', reason: 'Salah past participle.' },
      { option: 'reduces', reason: 'Salah finite verb tanpa konjungsi.' },
      { option: 'to reduce', reason: 'Kurang tepat untuk menyatakan hasil operasional yang telah tercapai.' },
    ],
    ruleOrFormula: 'Result Participle Clause: Main Clause + "," + V-ing (reducing).',
    maritimeContext: 'Aplikasi cat anti-hewan laut (Foul-Release Coating) untuk mengurangi tahanan gesek kapal.',
  },
  'm8-g-09': {
    summary: 'Negative Adverb Inversion: Seldom + does + Subject + Verb 1 (experience).',
    whyCorrect: 'Keterangan frekuensi negatif "Seldom" di awal kalimat memicu inversi kata bantu present simple "does" mendahului subjek tunggal "a heavy lift vessel".',
    distractors: [
      { option: 'is', reason: 'Salah auxiliary untuk kata kerja dasar experience.' },
      { option: 'has', reason: 'Salah auxiliary perfect.' },
      { option: 'did', reason: 'Salah tenses past untuk fakta umum habitual.' },
    ],
    ruleOrFormula: 'Negative Inversion: Seldom + does + Singular Subject + Base Verb (experience).',
    maritimeContext: 'Kepatuhan pembagian beban muatan berat terhadap Buku Panduan Pengikatan Muatan (Cargo Securing Manual).',
  },
  'm8-g-10': {
    summary: 'Frasa interval waktu operasional: "from the moment [event] until [event]".',
    whyCorrect: '"from the moment the stern touches the blocks until the entire keel is resting on the blocks" mendefinisikan interval waktu periode kritis dok secara tepat.',
    distractors: [
      { option: 'during the time', reason: 'Kurang tepat untuk titik awal mula interval.' },
      { option: 'whereas', reason: 'Salah makna pertentangan.' },
      { option: 'as long as', reason: 'Salah makna syarat durasi.' },
    ],
    ruleOrFormula: 'Time Interval: from the moment [Event A] until [Event B].',
    maritimeContext: 'Definisi periode kritis stabilitas kapal saat penurunan air di dok kolam (Drydock Critical Period).',
  },
  'm8-g-11': {
    summary: 'Frasa preposisi formal tujuan: "with the purpose of + gerund" (securing).',
    whyCorrect: '"with the purpose of securing" bermakna "dengan tujuan untuk / guna mengamankan ganti rugi biaya terjamin" bagi pihak penyelamat.',
    distractors: [
      { option: 'in spite of', reason: 'Salah makna pertentangan "meskipun".' },
      { option: 'in relation to', reason: 'Salah makna "sehubungan dengan".' },
      { option: 'regardless of', reason: 'Salah makna "tanpa memedulikan".' },
    ],
    ruleOrFormula: 'Prepositional Phrase of Purpose: with the purpose of + V-ing.',
    maritimeContext: 'Pengaktifan klausula SCOPIC dalam kontrak salvage LOF untuk jaminan kompensasi biaya operasional.',
  },
  'm8-g-12': {
    summary: 'Inverted Second Conditional: Were + Subject + to + Verb 1 (to exceed).',
    whyCorrect: '"Were the clearance to exceed 2.5 mm..." adalah bentuk pengandaian tipe 2 formal tanpa If (Setara dengan: "If the clearance were to exceed 2.5 mm...").',
    distractors: [
      { option: 'exceeds', reason: 'Salah present tense.' },
      { option: 'exceeded', reason: 'Salah past tense.' },
      { option: 'exceeding', reason: 'Salah participle.' },
    ],
    ruleOrFormula: 'Inverted 2nd Conditional: Were + Subject + to + Verb 1.',
    maritimeContext: 'Batas keausan bantalan poros baling-baling (Stern Tube Bearing Clearance) dalam survei dok.',
  },
  'm8-g-13': {
    summary: 'Preposisi sarana teknis pengikatan: "by means of [noun phrase]".',
    whyCorrect: '"by means of heavy-duty turnbuckles and wire rope lashings" bermakna "dengan sarana/menggunakan jarum keras tugas berat dan kawat pengikat".',
    distractors: [
      { option: 'on behalf of', reason: 'Salah makna "atas nama".' },
      { option: 'in front of', reason: 'Salah makna posisi fisik "di depan".' },
      { option: 'as a result of', reason: 'Kurang tepat untuk menyatakan sarana pengikatan.' },
    ],
    ruleOrFormula: 'Instrumental Preposition: by means of + Noun Phrase.',
    maritimeContext: 'Pengikatan dan pengamanan muatan proyek (Project Cargo Lashing) di atas geladak kapal.',
  },
  'm8-g-14': {
    summary: 'Struktur konsesi pembuka diikuti Past Simple: Notwithstanding + Noun, Subject + Verb 2 (maneuvered).',
    whyCorrect: '"Notwithstanding the heavy cross-current, the tug successfully maneuvered..." melengkapi klausa utama fakta lampau dengan Past Simple.',
    distractors: [
      { option: 'maneuvering', reason: 'Salah participle tanpa kata kerja utama.' },
      { option: 'maneuvers', reason: 'Salah present tense.' },
      { option: 'to maneuver', reason: 'Salah infinitive.' },
    ],
    ruleOrFormula: 'Concession Preposition + Past Simple Main Clause: Notwithstanding + Noun, Subject + Verb 2 (maneuvered).',
    maritimeContext: 'Manuver kapal tunda penyelamat (Salvage Tug) menunda kapal rusak melewati alur sempit berarus kuat.',
  },
  'm8-g-15': {
    summary: 'Participle Clause: having + Verb 3 (having verified).',
    whyCorrect: '"having verified all sea chest valves under pressure" menyatakan bahwa surveyor mengesahkan sertifikat setelah terlebih dahulu memeriksa seluruh katup sea chest di bawah tekanan.',
    distractors: [
      { option: 'had', reason: 'Salah auxiliary past.' },
      { option: 'has', reason: 'Salah auxiliary present.' },
      { option: 'have', reason: 'Salah auxiliary bare.' },
    ],
    ruleOrFormula: 'Participle Clause: having + Verb 3 (having verified).',
    maritimeContext: 'Pemeriksaan dan pengesahan katup kotak laut (Sea Chest Valves) oleh surveyor biro klasifikasi.',
  },

  // Vocabulary & Specialized Heavy Lift / Docking / Salvage (16-30)
  'm8-v-16': {
    summary: 'Definisi operasi pengangkatan tandem (Tandem Lift) muatan berat.',
    whyCorrect: 'Tandem Lift adalah pengangkatan satu unit muatan berat secara terkoordinasi dan simultan menggunakan dua derek kapal independen yang dihubungkan oleh balok perata beban (spreader beam).',
    distractors: [
      { option: 'Lifting two separate containers at the same time on a container crane', reason: 'Salah itu operasi twin-lift kontainer.' },
      { option: 'Lowering two anchors simultaneously in deep water', reason: 'Salah bukan lego dua jangkar.' },
      { option: 'Operating two bow thrusters in opposite directions', reason: 'Salah bukan pengoperasian thruster.' },
    ],
    maritimeContext: 'Operasi pengangkatan muatan proyek ekstra berat (Heavy Lift Tandem Crane Operations).',
  },
  'm8-v-17': {
    summary: 'Definisi Periode Kritis Dok (Critical Period) saat pengedokan kapal.',
    whyCorrect: 'Periode Kritis Dok adalah selang waktu sejak buritan kapal pertama kali menyentuh balok lunas hingga seluruh lunas bertumpu rata di atas balok, di mana gaya ke atas P menyebabkan penurunan tinggi metasentra (GM).',
    distractors: [
      { option: 'The time required to paint the antifouling boot-topping', reason: 'Salah bukan waktu pengecatan garis air.' },
      { option: 'The period when all crew members are on shore leave', reason: 'Salah bukan waktu pesiar kru.' },
      { option: 'The moment the dock gates open after refloating', reason: 'Salah bukan saat pintu dok dibuka.' },
    ],
    maritimeContext: 'Stabilitas kapal saat proses pengedokan dok kolam (Drydock Critical Period & Loss of GM).',
  },
  'm8-v-18': {
    summary: 'Definisi Klausula SCOPIC pada kontrak penyelamatan maritim LOF.',
    whyCorrect: 'SCOPIC (Special Compensation P&I Club Clause) adalah klausula kompensasi khusus yang memungkinkan pihak penyelamat memperoleh penggantian biaya peralatan dan personel ditambah laba standar 25% terlepas dari apakah properti kapal berhasil diselamatkan atau tidak.',
    distractors: [
      { option: 'A clause banning salvage tugs from entering foreign ports', reason: 'Salah bukan larangan masuk pelabuhan.' },
      { option: 'A mandatory arbitration fee paid to the flag state', reason: 'Salah bukan biaya arbitrase bendera.' },
      { option: 'An insurance discount given to vessels carrying dangerous goods', reason: 'Salah bukan diskon asuransi muatan berbahaya.' },
    ],
    maritimeContext: 'Hukum dan kontrak penyelamatan maritim internasional (Lloyd\'s Open Form LOF / SCOPIC).',
  },
  'm8-v-19': {
    summary: 'Definisi balok perata beban (Spreader Beam) pada rigging muatan proyek.',
    whyCorrect: 'Spreader Beam adalah balok baja struktural yang dirancang untuk menjaga sling pengangkat tetap tegak lurus (vertikal) guna mencegah timbulnya gaya remuk tekan lateral pada bodi muatan.',
    distractors: [
      { option: 'A steel plate welded to the hull bottom during drydocking', reason: 'Salah bukan pelat las dasar lambung.' },
      { option: 'A hydraulic ram used to push hatch covers open', reason: 'Salah bukan silinder hidrolik tutup palka.' },
      { option: 'A transverse beam supporting the wheelhouse ceiling', reason: 'Salah bukan balok atap anjungan.' },
    ],
    maritimeContext: 'Peralatan rigging pengangkatan muatan berat (Rigging Gear & Spreader Beams).',
  },
  'm8-v-20': {
    summary: 'Definisi fenomena bahaya Girting / Tripping pada kapal tunda penyelamat.',
    whyCorrect: 'Girting atau Tripping adalah kondisi darurat fatal di mana tali tunda menarik kapal tunda secara melintang tegak lurus lunas kapal akibat sudut tarikan yang salah, sehingga memicu kapal terbalik seketika.',
    distractors: [
      { option: 'The anchor slipping along a rocky sea bed', reason: 'Salah itu jangkar menggaruk (dragging anchor).' },
      { option: 'The engine stalling during full astern maneuvering', reason: 'Salah bukan mesin mati saat mundur.' },
      { option: 'A loss of electrical power during towing operations', reason: 'Salah bukan blackout listrik.' },
    ],
    maritimeContext: 'Keselamatan operasional kapal tunda samudra (Tug Girting / Tripping Hazards).',
  },
  'm8-v-21': {
    summary: 'Fungsi kawat penahan Gob Wire (GOG Rope) pada kapal tunda.',
    whyCorrect: 'Gob Wire (GOG Rope) adalah tali kawat atau klem hidrolik di buritan yang menahan tali tunda utama tetap berada di garis tengah buritan kapal guna mencegah bahaya girting dan terbaliknya kapal tunda.',
    distractors: [
      { option: 'The wire used to hoist the national flag on the mast', reason: 'Salah itu tali bendera mast.' },
      { option: 'A rope used exclusively for pilot boarding ladders', reason: 'Salah itu tangga pandu.' },
      { option: 'A cable connecting the radar scanner to the gyro', reason: 'Salah bukan kabel radar.' },
    ],
    maritimeContext: 'Peralatan keselamatan penundaan kapal tunda (Gob Wire / GOG Winch).',
  },
  'm8-v-22': {
    summary: 'Tujuan sistem tangki Anti-Heeling pada kapal muatan berat (Heavy Lift).',
    whyCorrect: 'Sistem Anti-Heeling berfungsi memompa air ballast antar tangki sayap kiri dan kanan secara otomatis dengan debit sangat tinggi untuk melawan momen kemiringan yang ditimbulkan oleh derek muatan berat.',
    distractors: [
      { option: 'To heat heavy fuel oil before entering purifiers', reason: 'Salah bukan pemanas bahan bakar.' },
      { option: 'To drain sewage water from passenger accommodations', reason: 'Salah bukan sistem sanitasi kotoran.' },
      { option: 'To cool auxiliary generators during full speed transit', reason: 'Salah bukan pendingin genset.' },
    ],
    maritimeContext: 'Sistem otomasi stabilitas kapal muatan berat (Heavy Lift Anti-Heeling System).',
  },
  'm8-v-23': {
    summary: 'Arti istilah "Declivity" pada konstruksi lantai dok kolam perkapalan.',
    whyCorrect: 'Declivity adalah sudut kemiringan lantai dok kolam dari ujung kepala ke arah pintu masuk dok yang dibuat sedikit menurun untuk memudahkan pengaliran dan pengeringan air dok.',
    distractors: [
      { option: 'The maximum water depth inside the flooded dock chamber', reason: 'Salah bukan kedalaman air dok.' },
      { option: 'The thickness of timber caps fitted on concrete keel blocks', reason: 'Salah bukan ketebalan kayu balok.' },
      { option: 'The electrical resistance of the dock grounding cables', reason: 'Salah bukan hambatan kabel pembumian.' },
    ],
    maritimeContext: 'Konstruksi dok kolam dan perhitungan pengedokan (Drydock Floor Declivity).',
  },
  'm8-v-24': {
    summary: 'Fungsi alat ukur Poker Gauge pada survei poros baling-baling dok perkapalan.',
    whyCorrect: 'Poker Gauge adalah mikrometer pengukur khusus yang digunakan untuk mengukur kelonggaran atau keausan vertikal (wear-down clearance) antara poros baling-baling dan bantalan tabung poros buritan.',
    distractors: [
      { option: 'A tool for measuring the thickness of paint coats', reason: 'Salah itu Elcometer (pengukur ketebalan cat).' },
      { option: 'An instrument used to check boiler flue gas temperature', reason: 'Salah itu pirometer gas buang boiler.' },
      { option: 'A device measuring depth of water in bilge wells', reason: 'Salah itu pita duga sounding.' },
    ],
    maritimeContext: 'Survei poros baling-baling dok perkapalan (Stern Tube Tailshaft Clearance Survey).',
  },
  'm8-v-25': {
    summary: 'Definisi "Niche Areas" menurut Pedoman Biofouling IMO MEPC.378(80).',
    whyCorrect: 'Niche Areas adalah area lambung kapal tertentu yang sangat rentan menjadi sarang penumpukan biota laut karena bentuk hidrodinamisnya yang terlindung (seperti kotak laut/sea chests, terowongan bow thruster, tabung kemudi, dan lunas bilga).',
    distractors: [
      { option: 'Passenger VIP suites located on the bridge deck', reason: 'Salah bukan kamar VIP penumpang.' },
      { option: 'Enclosed paint lockers on the forecastle', reason: 'Salah bukan gudang cat haluan.' },
      { option: 'Storage lockers for lifejackets on muster decks', reason: 'Salah bukan lemari rompi penolong.' },
    ],
    maritimeContext: 'Pedoman pengelolaan biota laut penempel IMO Biofouling Guidelines (MEPC.378(80)).',
  },
  'm8-v-26': {
    summary: 'Definisi tali pengangkat Grommet Sling pada operasi rigging muatan berat.',
    whyCorrect: 'Grommet Sling adalah tali kawat baja atau serat sintetis berkekuatan tinggi yang dibentuk melingkar tanpa sambungan ujung terputus (endless continuous loop) yang memberikan kekuatan putus ekstra tinggi.',
    distractors: [
      { option: 'A rubber ring sealing a cargo hold hatch coaming drain', reason: 'Salah bukan karet paking got palka.' },
      { option: 'A plastic tag attached to a dangerous goods container', reason: 'Salah bukan label kontainer berbahaya.' },
      { option: 'A metal washer under a cylinder head bolt', reason: 'Salah bukan ring baut silinder.' },
    ],
    maritimeContext: 'Perlengkapan tali pengangkat beban berat proyek (Heavy Lift Rigging Slings).',
  },
  'm8-v-27': {
    summary: 'Fungsi sistem proteksi katodik Impressed Current (ICCP) pada lambung kapal.',
    whyCorrect: 'Sistem ICCP mengalirkan arus listrik searah (DC) terkendali secara aktif melalui anoda lambung untuk menetralkan reaksi elektrokimia korosi pada seluruh pelat lambung bawah air kapal.',
    distractors: [
      { option: 'Powers the ship electronic navigation displays', reason: 'Salah bukan catu daya layar navigasi.' },
      { option: 'Charges the emergency radio batteries', reason: 'Salah bukan pengisi baterai radio.' },
      { option: 'Generates micro-bubbles under the flat hull bottom', reason: 'Salah itu sistem Air Lubrication.' },
    ],
    maritimeContext: 'Sistem proteksi katodik aktif pencegahan korosi lambung kapal (ICCP System).',
  },
  'm8-v-28': {
    summary: 'Definisi Emergency Towing Arrangement (ETA) kapal tanker SOLAS Bab II-1.',
    whyCorrect: 'ETA adalah susunan peralatan penundaan darurat siap pakai yang terpasang standar di haluan dan buritan kapal tanker (terdiri dari titik ikat kuat, rantai gesek, kawat penarik, dan tali penjemput) untuk operasi penyelamatan darurat.',
    distractors: [
      { option: 'A lifeboat fitted with a diesel towing winch', reason: 'Salah bukan sekoci bermesin derek.' },
      { option: 'A portable radio carried in the pilot bag', reason: 'Salah bukan radio pandu.' },
      { option: 'An inflatable salvage pontoon stored in the engine room', reason: 'Salah bukan ponton tiup.' },
    ],
    maritimeContext: 'Susunan penundaan darurat kapal tanker SOLAS Bab II-1 (Emergency Towing Arrangement).',
  },
  'm8-v-29': {
    summary: 'Definisi In-Water Cleaning with Capture (IWC) pada pengelolaan biofouling.',
    whyCorrect: 'IWC adalah proses pembersihan biofouling lambung bawah air menggunakan robot penyelam khusus yang menyedot dan menangkap 100% rontokan biota laut guna mencegah penyebaran spesies laut invasif.',
    distractors: [
      { option: 'Washing the ship upper deck with harbor sea water', reason: 'Salah bukan pencucian geladak atas.' },
      { option: 'Purging ballast water tanks with ozone gas at sea', reason: 'Salah bukan pembersihan ozon tangki ballast.' },
      { option: 'Scrubbing the galley grease trap with chemical solvents', reason: 'Salah bukan pembersihan perangkap lemak dapur.' },
    ],
    maritimeContext: 'Teknologi ramah lingkungan pembersihan lambung di air (In-Water Cleaning with Capture).',
  },
  'm8-v-30': {
    summary: 'Definisi cat pelapis Foul-Release Coating (FRC) pada pemeliharaan lambung.',
    whyCorrect: 'Foul-Release Coating adalah lapisan cat silikon atau fluoropolimer non-biocidal yang permukaannya sangat licin sehingga organisme laut tidak dapat menempel kuat dan akan terlepas secara alami saat kapal melaju.',
    distractors: [
      { option: 'A toxic copper paint banned under the AFS Convention', reason: 'Salah cat FRC bebas racun biosida tembaga.' },
      { option: 'A rust-converting chemical primer for ballast tanks', reason: 'Salah bukan cat primer konversi karat.' },
      { option: 'A cement wash applied inside fresh water drinking tanks', reason: 'Salah bukan lapisan semen tangki air tawar.' },
    ],
    maritimeContext: 'Teknologi pelapisan lambung ramah lingkungan bebas biosida (Foul-Release Coatings).',
  },

  // Calculations & Dynamics (31-40)
  'm8-t-31': {
    summary: 'Kalkulasi tegangan kaki sling 2-leg pada sudut 30°: T = W / (2 · sin θ).',
    whyCorrect: 'Tegangan setiap kaki sling T = 300 ÷ (2 × 0,50) = 300 ÷ 1,0 = 300 metrik ton.',
    distractors: [
      { option: '150 metric tonnes', reason: 'Salah karena hanya membagi beban dengan 2 tanpa memperhitungkan sin 30°.' },
      { option: '200 metric tonnes', reason: 'Salah hitung rumus trigonometri.' },
      { option: '250 metric tonnes', reason: 'Salah hitung rumus trigonometri.' },
    ],
    ruleOrFormula: 'Sling Tension: T = W / (2 × sin θ) = 300 / (2 × 0.50) = 300 MT.',
    maritimeContext: 'Kalkulasi tegangan kaki sling sudut rendah pada pengangkatan muatan berat.',
  },
  'm8-t-32': {
    summary: 'Kalkulasi reduksi GM periode kritis dok kolam: ΔGM = (P · KG) / W.',
    whyCorrect: 'Kehilangan GM semu ΔGM = (600 ton × 7,50 m) ÷ 12.000 ton = 4.500 ÷ 12.000 = 0,375 meter.',
    distractors: [
      { option: '0.500 meters', reason: 'Salah hitung pembagian.' },
      { option: '0.250 meters', reason: 'Salah hitung pembagian.' },
      { option: '0.450 meters', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Loss of GM: ΔGM = (P × KG) / W = (600 × 7.50) / 12,000 = 0.375 m.',
    maritimeContext: 'Kalkulasi reduksi tinggi metasentra akibat gaya tekan balok dok (Drydock Critical Period Loss of GM).',
  },
  'm8-t-33': {
    summary: 'Kalkulasi berat maksimal muatan trafo pada luas 20 m² (Batas beban geladak 18 t/m²).',
    whyCorrect: 'Berat maksimal yang diizinkan = 20 m² × 18 ton/m² = 360 metrik ton.',
    distractors: [
      { option: '280 metric tonnes', reason: 'Salah hitung perkalian.' },
      { option: '420 metric tonnes', reason: 'Salah hitung perkalian.' },
      { option: '320 metric tonnes', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Max Weight = Area × Load Limit = 20 × 18 = 360 MT.',
    maritimeContext: 'Evaluasi batas kekuatan beban geladak muatan proyek (Deck Permissible Load Rating).',
  },
  'm8-t-34': {
    summary: 'Kalkulasi gaya tarik tunda (Bollard Pull) kapal 12.000 BHP (1,35 t / 100 BHP) vs Kebutuhan 160 t.',
    whyCorrect: 'Gaya tarik tunda (Bollard Pull) = (12.000 ÷ 100) × 1,35 ton = 120 × 1,35 = 162,0 ton. Memenuhi syarat kebutuhan 160 ton dengan surplus 2,0 ton.',
    distractors: [
      { option: '140.0 tonnes (Fails requirement by 20 tonnes)', reason: 'Salah hitung perkalian BHP.' },
      { option: '185.0 tonnes (Meets requirement by 25 tonnes)', reason: 'Salah hitung perkalian BHP.' },
      { option: '150.0 tonnes (Fails requirement by 10 tonnes)', reason: 'Salah hitung perkalian BHP.' },
    ],
    ruleOrFormula: 'Bollard Pull = (BHP / 100) × 1.35 = 120 × 1.35 = 162.0 Tonnes (Meets 160t).',
    maritimeContext: 'Evaluasi kecukupan daya tarik kapal tunda samudra (Ocean Towage Bollard Pull Assessment).',
  },
  'm8-t-35': {
    summary: 'Kalkulasi momen perata kemiringan pemindahan 250 t ballast sejauh 18 m.',
    whyCorrect: 'Momen perata kemiringan = 250 ton × 18 meter = 4.500 ton-meter.',
    distractors: [
      { option: '3,600 tonne-meters', reason: 'Salah hitung perkalian.' },
      { option: '5,000 tonne-meters', reason: 'Salah hitung perkalian.' },
      { option: '4,200 tonne-meters', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Heeling Moment = Mass × Distance = 250 × 18 = 4,500 t·m.',
    maritimeContext: 'Kalkulasi momen lawan sistem tangki anti-kemiringan kapal muatan berat.',
  },
  'm8-t-36': {
    summary: 'Kalkulasi persentase keausan pelat lambung 20,0 mm menjadi 16,8 mm (Batas kelas 15%).',
    whyCorrect: 'Persentase keausan = ((20,0 - 16,8) ÷ 20,0) × 100% = (3,2 ÷ 20,0) × 100% = 16,0%. Karena 16,0% melebihi batas toleransi 15%, maka peremajaan pelat baja (steel renewal) wajib dilakukan.',
    distractors: [
      { option: '12.0% wastage (Complies, no renewal needed)', reason: 'Salah hitung persentase keausan.' },
      { option: '14.5% wastage (Complies, no renewal needed)', reason: 'Salah hitung persentase keausan.' },
      { option: '20.0% wastage (Ship must be scrapped)', reason: 'Salah karena keausan lokal pelat cukup diganti baru tanpa harus discrap.' },
    ],
    ruleOrFormula: 'Wastage = ((Original - Actual) / Original) × 100% = (3.2 / 20.0) × 100% = 16.0% (>15% limit).',
    maritimeContext: 'Penilaian batas keausan pelat lambung kapal berdasarkan standar biro klasifikasi IACS.',
  },
  'm8-t-37': {
    summary: 'Uji kepatuhan baku mutu pelepasan air ballast Konvensi BWM D-2 (35 organisme dalam 5 m³).',
    whyCorrect: 'Konsentrasi organisme = 35 organisme ÷ 5 m³ = 7,0 organisme/m³. Memenuhi syarat baku mutu standar D-2 Konvensi BWM (< 10 organisme/m³).',
    distractors: [
      { option: '35 organisms / m³ (Non-compliant, exceeds limit)', reason: 'Salah karena 35 adalah total dalam 5 m³, bukan per meter kubik.' },
      { option: '12 organisms / m³ (Non-compliant, exceeds limit)', reason: 'Salah hitung pembagian.' },
      { option: '5 organisms / m³ (Compliant)', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Organism Density = Count / Volume = 35 / 5 = 7.0 organisms/m³ (<10/m³).',
    maritimeContext: 'Uji kepatuhan baku mutu pelepasan air ballast Konvensi IMO BWM D-2 Standard.',
  },
  'm8-t-38': {
    summary: 'Kalkulasi durasi pengurasan air dok 42.000 m³ dengan debit pompa 3.500 m³/jam.',
    whyCorrect: 'Waktu pengurasan dok = 42.000 m³ ÷ 3.500 m³/jam = 12,0 jam.',
    distractors: [
      { option: '10.5 hours', reason: 'Salah hitung pembagian.' },
      { option: '14.0 hours', reason: 'Salah hitung pembagian.' },
      { option: '15.0 hours', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Time = Volume / Pump Rate = 42,000 / 3,500 = 12.0 Hours.',
    maritimeContext: 'Kalkulasi durasi pengeringan kolam dok perkapalan (Drydock Dewatering Time).',
  },
  'm8-t-39': {
    summary: 'Kalkulasi beban putus minimum segel WLL 120 ton dengan Faktor Keselamatan 5:1.',
    whyCorrect: 'Beban putus minimum (Breaking Load) = 120 ton × 5 = 600 metrik ton.',
    distractors: [
      { option: '480 metric tonnes', reason: 'Salah karena mengalikan dengan faktor 4:1.' },
      { option: '500 metric tonnes', reason: 'Salah hitung perkalian.' },
      { option: '720 metric tonnes', reason: 'Salah karena mengalikan dengan faktor 6:1.' },
    ],
    ruleOrFormula: 'Breaking Load = WLL × Safety Factor = 120 × 5 = 600 MT.',
    maritimeContext: 'Kalkulasi kekuatan putus segel pengangkat muatan berat (Rigging Shackle Minimum Breaking Load).',
  },
  'm8-t-40': {
    summary: 'Kalkulasi estimasi waktu tempuh penundaan 1.800 mil laut pada kecepatan 6,0 knot.',
    whyCorrect: 'Lama pelayaran = 1.800 mil ÷ (6,0 knot × 24 jam/hari) = 1.800 ÷ 144 = 12,5 hari.',
    distractors: [
      { option: '10.0 days', reason: 'Salah hitung pembagian.' },
      { option: '15.0 days', reason: 'Salah hitung pembagian.' },
      { option: '14.2 days', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Duration Days = Distance / (Speed × 24) = 1,800 / 144 = 12.5 Days.',
    maritimeContext: 'Perhitungan estimasi waktu tempuh penundaan samudra tongkang muatan berat.',
  },

  // Reading Comprehension & Regulations (41-50)
  'm8-r-41': {
    summary: 'Penyebab patahnya lengan derek muatan berat menurut laporan investigasi MAIB.',
    whyCorrect: 'Penyebab keruntuhan lengan derek adalah kelebihan beban dinamis sebesar 15% yang dipicu oleh guncangan/entakan mendadak kapal saat derek sedang berputar (slewing) di atas dermaga.',
    distractors: [
      { option: 'Electrical failure of the crane operator joystick', reason: 'Salah bukan kerusakan joystick operator.' },
      { option: 'Fracture of the main engine crankshaft', reason: 'Salah bukan patah poros engkol mesin induk.' },
      { option: 'Flooding of the crane engine housing', reason: 'Salah bukan banjir ruang derek.' },
    ],
    maritimeContext: 'Laporan investigasi kegagalan struktur derek muatan berat akibat beban dinamis.',
  },
  'm8-r-42': {
    summary: 'Batasan operasional wajib selama periode kritis pengedokan kapal di dok kolam.',
    whyCorrect: 'Selama periode kritis pengedokan, seluruh pemindahan cairan internal (ballast atau bahan bakar) dilarang keras guna mencegah timbulnya momen permukaan bebas dan pergeseran titik berat kapal.',
    distractors: [
      { option: 'Ship auxiliary generators must be operated at full overload', reason: 'Salah genset tidak dioperasikan overload.' },
      { option: 'All double bottom manhole covers must be unbolted', reason: 'SANGAT BERBAHAYA! Membuka manhole tangki saat air dok surut memicu risiko kecelakaan fatal.' },
      { option: 'Anchor chains must be lowered into the dock bottom', reason: 'Salah rantai jangkar diturunkan setelah kapal duduk stabil.' },
    ],
    ruleOrFormula: 'Drydock Safety Rule: Strict prohibition of internal liquid transfers during critical period.',
    maritimeContext: 'Prosedur keselamatan pencegahan kapal terbalik saat periode kritis dok perkapalan.',
  },
  'm8-r-43': {
    summary: 'Perubahan prinsip "No Cure - No Pay" oleh klausula SCOPIC pada kontrak LOF.',
    whyCorrect: 'Klausula SCOPIC menjamin pihak penyelamat tetap menerima kompensasi berdasar tarif baku terlepas dari apakah kapal berhasil diselamatkan atau tidak, guna memotivasi tindakan pencegahan pencemaran lingkungan.',
    distractors: [
      { option: 'Eliminates all salvage awards permanently', reason: 'Salah SCOPIC tidak menghapus imbalan salvage jika kapal berhasil diselamatkan.' },
      { option: 'Forces the salvor to buy the damaged vessel', reason: 'Salah penyelamat tidak dipaksa membeli kapal.' },
      { option: 'Makes the port state pay for all cargo losses', reason: 'Salah negara pelabuhan tidak menanggung kerugian kargo.' },
    ],
    maritimeContext: 'Klausula perlindungan lingkungan kontrak salvage maritim SCOPIC.',
  },
  'm8-r-44': {
    summary: 'Dua dokumen resmi yang diwajibkan oleh Pedoman Biofouling IMO MEPC.378(80).',
    whyCorrect: 'Setiap kapal komersial wajib memiliki dua dokumen resmi: Rencana Pengelolaan Biofouling (BFMP) dan Buku Catatan Biofouling (BFRB) yang mencatat seluruh riwayat pembersihan dan survei lambung.',
    distractors: [
      { option: 'Passenger Ticket Register and Casino Log', reason: 'Salah bukan buku tiket dan kasino.' },
      { option: 'Fuel Bunkering Invoice and Garbage Receipt', reason: 'Salah bukan tanda terima sampah dan minyak.' },
      { option: 'Medical Locker Inventory and Narcotic Register', reason: 'Salah bukan daftar obat bius.' },
    ],
    maritimeContext: 'Dokumentasi wajib pengelolaan biota laut penempel resolusi IMO MEPC.378(80).',
  },
  'm8-r-45': {
    summary: 'Definisi korosi substansial (Substantial Corrosion) menurut IACS UR Z7.',
    whyCorrect: 'Korosi substansial didefinisikan sebagai penipisan pelat yang telah melampaui 75% dari batas toleransi keausan yang diizinkan oleh biro klasifikasi.',
    distractors: [
      { option: 'A hole punctured through the outer hull plating', reason: 'Salah lubang tembus lambung adalah kegagalan struktur fatal.' },
      { option: 'Surface rust on anchor chain links', reason: 'Salah karat permukaan rantai jangkar adalah korosi ringan wajar.' },
      { option: 'Paint peeling off superstructure bulkheads', reason: 'Salah bukan cat mengelupas di akomodasi.' },
    ],
    ruleOrFormula: 'IACS Standard: Substantial Corrosion = Wastage > 75% of allowable margin.',
    maritimeContext: 'Kriteria penilaian korosi survei lambung kapal biro klasifikasi IACS.',
  },
  'm8-r-46': {
    summary: 'Tujuan penempatan kayu alas dunnage atau karpet karet di bawah dudukan muatan berat (CSS Code).',
    whyCorrect: 'Pemasangan kayu alas (dunnage) atau karpet karet di bawah dudukan muatan bertujuan untuk meningkatkan koefisien gesekan (µ ≥ 0,40) guna mencegah pergeseran muatan ke samping di atas geladak baja.',
    distractors: [
      { option: 'To absorb spilled diesel fuel from cargo engines', reason: 'Salah bukan penyerap tumpahan minyak.' },
      { option: 'To prevent rust from staining the deck paint', reason: 'Salah bukan sekadar mencegah noda karat.' },
      { option: 'To elevate cargo so crew can crawl underneath', reason: 'Salah bukan tempat merangkak kru.' },
    ],
    maritimeContext: 'Pedoman pengikatan muatan berat proyek IMO CSS Code Annex 13.',
  },
  'm8-r-47': {
    summary: 'Batas maksimal sudut apit tali cabang tunda samudra (Ocean Towage Bridle).',
    whyCorrect: 'Sudut apit kedua kaki tali cabang tunda (towing bridle legs) dibatasi maksimal tidak boleh melebihi 60 derajat untuk menghindari peningkatan beban tegangan berlebih pada masing-masing kaki.',
    distractors: [
      { option: 'Not more than 90 degrees', reason: 'Salah sudut 90° menimbulkan tegangan tali berlebih.' },
      { option: 'Not more than 120 degrees', reason: 'SANGAT BERBAHAYA! Sudut 120° menggandakan tegangan pada tiap kaki tali.' },
      { option: 'Not more than 30 degrees', reason: 'Salah sudut 30° terlalu sempit dan membutuhkan panjang tali bridle berlebih.' },
    ],
    ruleOrFormula: 'Towage Safety Standard: Bridle enclosed angle ≤ 60 degrees.',
    maritimeContext: 'Spesifikasi perakitan tali cabang penundaan samudra (Towing Bridle Rigging).',
  },
  'm8-r-48': {
    summary: 'Uji wajib seal tabung poros baling-baling sebelum kapal keluar dok.',
    whyCorrect: 'Sebelum dok dibanjiri air kembali, seal tabung poros baling-baling wajib diuji tekanan hidrostatis dengan minyak lumas selama 4 jam pada tinggi tekan dinas maksimal untuk memastikan nol kebocoran oli ke laut.',
    distractors: [
      { option: 'Testing the ship whistle for 1 hour continuously', reason: 'Salah bukan membunyikan suling kapal 1 jam.' },
      { option: 'Painting the propeller blades with red varnish', reason: 'Salah bukan pernis merah baling-baling.' },
      { option: 'Running main engine on heavy fuel oil in dry dock', reason: 'SANGAT FATAL! Menghidupkan mesin induk tanpa air pendingin di dok kering membakar mesin.' },
    ],
    maritimeContext: 'Uji kekedapan tabung poros baling-baling sebelum kapal keluar dari dok.',
  },
  'm8-r-49': {
    summary: 'Ketentuan penggantian anoda korban pelat lambung kapal saat naik dok.',
    whyCorrect: 'Seluruh anoda korban seng atau aluminium yang telah terkikis atau susut lebih dari 50% dari massa aslinya wajib diganti baru saat kapal naik dok guna menjamin proteksi katodik berlanjut.',
    distractors: [
      { option: 'Only when completely dissolved and missing', reason: 'Salah menunggu anoda habis total memicu perkaratan hebat pada pelat lambung.' },
      { option: 'Every 10 years regardless of condition', reason: 'Salah interval 10 tahun terlalu lama.' },
      { option: 'Whenever the ship changes cargo ports', reason: 'Salah bukan saat ganti pelabuhan muat.' },
    ],
    ruleOrFormula: 'Anode Renewal Threshold: Wastage > 50% of original mass.',
    maritimeContext: 'Standar penggantian anoda korban pelat lambung saat survei dok.',
  },
  'm8-r-50': {
    summary: 'Ruang lingkup survei jarak dekat (Close-Up Survey) Pembaruan Kelas IV (Usia 20 Tahun).',
    whyCorrect: 'Survei Khusus IV (usia kapal 20 tahun) mewajibkan pemeriksaan jarak dekat (close-up examination) sebesar 100% pada seluruh palka muatan, tangki ballast, dan tangki ceruk (peak tanks) beserta pengukuran ketebalan pelat.',
    distractors: [
      { option: 'Visual check of wheelhouse navigation screens only', reason: 'Salah bukan hanya layar anjungan.' },
      { option: 'Sampling 5% of ballast tank bilge water', reason: 'Salah bukan sampel 5% air bilga.' },
      { option: 'Checking captain cabin air conditioner filter', reason: 'Salah bukan filter AC kabin Nakhoda.' },
    ],
    maritimeContext: 'Survei khusus pembaruan kelas kapal usia 20 tahun (IACS Special Survey IV).',
  },

  // Listening & Heavy Lift / Dockmaster / Salvage VHF (51-60)
  'm8-l-51': {
    summary: 'Petunjuk komando pengangkatan tandem muatan reaktor oleh Supercargo.',
    whyCorrect: 'Supercargo memerintahkan kedua derek mengangkat serentak pada kecepatan 0,5 m/menit dengan posisi spreader beam rata, sistem anti-heeling aktif, dan menahan angkatan saat muatan berada 1 meter di atas geladak.',
    distractors: [
      { option: 'Lower both cranes at maximum emergency speed', reason: 'SANGAT BERBAHAYA! Menurunkan muatan 400 ton secara mendadak memicu benturan fatal geladak.' },
      { option: 'Slew Crane 1 to port while Crane 2 remains stopped', reason: 'SANGAT FATAL! Memutar satu derek saja mematahkan balok perata spreader beam.' },
      { option: 'Abort lift and release cargo hook immediately', reason: 'Salah bukan membatalkan angkatan.' },
    ],
    maritimeContext: 'Komunikasi komando radio operasi pengangkatan tandem muatan reaktor berat.',
  },
  'm8-l-52': {
    summary: 'Peringatan penting Dockmaster kepada Nakhoda saat kapal memasuki periode kritis dok.',
    whyCorrect: 'Dockmaster memperingatkan bahwa buritan kapal baru saja menyentuh balok dok dan kapal memasuki periode kritis, sehingga seluruh pemindahan cairan internal wajib dihentikan seketika.',
    distractors: [
      { option: 'Drydock gate has collapsed, prepare to abandon ship', reason: 'Salah pintu dok tidak runtuh.' },
      { option: 'Reflood dock immediately due to engine breakdown', reason: 'Salah proses pengedokan berjalan normal.' },
      { option: 'Start auxiliary generators and test bow thruster', reason: 'SANGAT FATAL! Menghidupkan bow thruster di dok merusak balok dok dan mencederai petugas.' },
    ],
    maritimeContext: 'Instruksi keselamatan anjungan saat kapal memasuki periode kritis pengedokan.',
  },
  'm8-l-53': {
    summary: 'Instruksi pengikatan tali tunda darurat ke Smit Bracket haluan kapal.',
    whyCorrect: 'Pihak kapal tunda penyelamat menginstruksikan penarikan kawat penjemput dan penguncian rantai gesek 76 mm ke dalam Smit Bracket haluan kapal menggunakan pasak pengunci.',
    distractors: [
      { option: 'Cut the towing wire with emergency torch', reason: 'Salah dilarang memotong tali tunda.' },
      { option: 'Throw messenger line back into the sea', reason: 'Salah tali penjemput ditarik ke geladak.' },
      { option: 'Tie towing pennant to forward mooring winch drum', reason: 'SANGAT BERBAHAYA! Mengikat kawat penarik utama pada tromol tali tambat dapat meremukkan mesin kimbul.' },
    ],
    maritimeContext: 'Prosedur penyambungan tali tunda darurat penyelamatan kapal (Emergency Salvage Tow Connection).',
  },
  'm8-l-54': {
    summary: 'Laporan penyelesaian pembersihan biofouling kotak laut dan terowongan thruster oleh penyelam.',
    whyCorrect: 'Supervisor penyelam melaporkan bahwa kotak laut dan terowongan thruster telah bersih dari teritip/kerang dan unit filtrasi vakum berhasil menangkap 100% rontokan biota tanpa ada pencemaran ke laut.',
    distractors: [
      { option: 'Diver lost underwater cleaning head in sea chest', reason: 'Salah kepala pembersih tidak hilang.' },
      { option: 'Sea water intake pipe was punctured by diver scraper', reason: 'Salah tidak ada pipa yang bocor.' },
      { option: 'Biofouling cleaning failed due to high water turbidity', reason: 'Salah operasi pembersihan berjalan sukses.' },
    ],
    maritimeContext: 'Laporan penyelesaian pembersihan biofouling bawah air ramah lingkungan.',
  },
  'm8-l-55': {
    summary: 'Aktivasi otomatis pompa anti-heeling saat diterpa hembusan angin 35 knot.',
    whyCorrect: 'Saat hembusan angin 35 knot menerpa kapal, sistem PLC anti-heeling otomatis meningkatkan debit pemompaan ballast ke tangki kanan menjadi 1.200 m³/jam sehingga kemiringan kapal stabil aman di 1,2 derajat.',
    distractors: [
      { option: 'Ship listed 15 degrees and grounded against jetty', reason: 'Salah kapal tetap stabil dan tidak kandas.' },
      { option: 'Crane boom automatically jettisoned cargo', reason: 'Salah muatan tidak dibuang.' },
      { option: 'Ballast tank over-pressurized and ruptured deck', reason: 'Salah tangki ballast bekerja normal.' },
    ],
    maritimeContext: 'Respon otomatis pompa anti-heeling terhadap momen angin mendadak.',
  },
  'm8-l-56': {
    summary: 'Pengesahan survei keausan poros baling-baling kapal oleh surveyor biro klasifikasi.',
    whyCorrect: 'Surveyor biro klasifikasi mengonfirmasi bahwa hasil pengukuran poker gauge kelonggaran atas 1,45 mm, bawah 0,35 mm, dan keausan 0,20 mm berada dalam batas izin toleransi kelas dan disetujui.',
    distractors: [
      { option: 'Tailshaft is bent and must be replaced immediately', reason: 'Salah poros baling-baling lurus dan sempurna.' },
      { option: 'Stern tube bearings severely damaged by sand ingress', reason: 'Salah bantalan poros dalam kondisi prima.' },
      { option: 'Propeller nut loose on shaft taper', reason: 'Salah mur baling-baling terkunci rapat.' },
    ],
    maritimeContext: 'Verifikasi hasil survei keausan poros baling-baling kapal.',
  },
  'm8-l-57': {
    summary: 'Perintah penggunaan kawat penahan Gob Wire buritan untuk mencegah girting.',
    whyCorrect: 'Nakhoda kapal tunda memerintahkan pengaktifan Gob Wire hidrolik untuk menekan tali tunda utama tetap di garis tengah buritan kapal guna mencegah bahaya kapal tunda terbalik (girting/tripping) akibat ombak samping.',
    distractors: [
      { option: 'To haul the barge closer to the tug stern', reason: 'Salah bukan untuk memendekkan jarak tongkang.' },
      { option: 'To disconnect the towline in an emergency', reason: 'Salah bukan untuk melepas tali tunda.' },
      { option: 'To hoist the stern working anchor', reason: 'Salah bukan untuk mengangkat jangkar kerja buritan.' },
    ],
    maritimeContext: 'Penggunaan kawat penahan Gob Wire saat penundaan samudra di laut ganas.',
  },
  'm8-l-58': {
    summary: 'Instruksi penutupan katup hisap laut saat dok kolam mulai dibanjiri kembali.',
    whyCorrect: 'Dockmaster menginstruksikan agar seluruh katup hisap laut (sea suction) tetap ditutup sampai ketinggian air dok mencapai 4 meter di atas lunas untuk mencegah lumpur dasar dok tersedot masuk ke pipa mesin.',
    distractors: [
      { option: 'Open all sea valves immediately while dock bottom is dry', reason: 'SANGAT BERBAHAYA! Membuka kran laut saat dok kering menyedot udara dan kotoran ke pipa.' },
      { option: 'Start main propulsion engine at full ahead while still on blocks', reason: 'SANGAT FATAL! Menghidupkan baling-baling saat kapal masih di balok dok menghancurkan konstruksi dok.' },
      { option: 'Release dock mooring lines before water enters dock', reason: 'SANGAT BERBAHAYA! Melepas tali tambat sebelum kapal terapung membuat kapal bergeser dan terguling dari balok dok.' },
    ],
    maritimeContext: 'Prosedur pengisian kembali air dok kolam dan pencegahan endapan lumpur laut.',
  },
  'm8-l-59': {
    summary: 'Pengesahan sertifikasi pengikatan muatan turbin berat oleh Marine Warranty Surveyor.',
    whyCorrect: 'Surveyor asuransi maritim mengonfirmasi bahwa 24 jarum keras pengikat telah kencang, kawat diklem 4 bulldog grip dengan mur pengaman terkunci, dan Sertifikat Kelaikan Pengikatan CSS Code telah diterbitkan.',
    distractors: [
      { option: 'Cargo lashings failed inspection and must be removed', reason: 'Salah lashing lulus uji 100%.' },
      { option: 'D-rings are cracked and must be re-welded', reason: 'Salah titik ikat D-ring dalam kondisi prima.' },
      { option: 'Cargo weight exceeds ship crane capacity by 50 tonnes', reason: 'Salah berat muatan berada dalam batas aman derek.' },
    ],
    maritimeContext: 'Inspeksi sertifikasi pengikatan muatan berat oleh Marine Warranty Surveyor.',
  },
  'm8-l-60': {
    summary: 'Konfirmasi kalibrasi dan operasional sistem proteksi katodik ICCP lambung kapal.',
    whyCorrect: 'Supervisi listrik mengonfirmasi bahwa sistem proteksi katodik arus tandingan (ICCP) telah dikalibrasi pada potensial proteksi -850 mV terhadap elektroda acuan perak/perak-klorida dan proteksi korosi aktif penuh.',
    distractors: [
      { option: 'ICCP failed due to short circuit and must be disconnected', reason: 'Salah sistem ICCP bekerja normal tanpa korsleting.' },
      { option: 'Hull anodes are generating excessive toxic chlorine gas', reason: 'Salah tidak ada gas klorin berbahaya.' },
      { option: 'Reference electrode disconnected permanently', reason: 'Salah elektroda acuan terhubung aktif.' },
    ],
    maritimeContext: 'Pengujian dan pengoperasian sistem proteksi katodik aktif lambung kapal (ICCP Commissioning).',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 9 (All 60 Questions)
const TEST_9_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm9-g-01': {
    summary: 'Subjunctive Mood dalam direktif komando otonom: Mandated that + Subject + bare verb (enter).',
    whyCorrect: 'Setelah kata kerja mandat ("mandated that..."), kata kerja subjek wajib menggunakan bentuk dasar murni "enter" tanpa akhiran -s.',
    distractors: [
      { option: 'entered', reason: 'Salah bentuk past tense.' },
      { option: 'enters', reason: 'Salah bentuk orang ketiga tunggal.' },
      { option: 'is entering', reason: 'Salah continuous.' },
    ],
    ruleOrFormula: 'Subjunctive Mood: Mandated that + Subject + Base Verb (enter).',
    maritimeContext: 'Perintah direktif Pusat Operasi Jarak Jauh (Remote Operations Center / ROC) kepada kapal otonom untuk masuk area apung aman.',
  },
  'm9-g-02': {
    summary: 'Perfect Participle Clause Aktif: Having + Verb 3 (fused) + Object.',
    whyCorrect: '"Having fused multi-sensor data..." menyatakan proses penggabungan data sensor yang telah selesai dilakukan sebelum algoritma mengidentifikasi perahu sasaran.',
    distractors: [
      { option: 'fusing', reason: 'Salah present participle.' },
      { option: 'fuse', reason: 'Salah bare infinitive.' },
      { option: 'been fused', reason: 'Salah bentuk pasif karena algoritma adalah subjek aktif yang menggabungkan sensor.' },
    ],
    ruleOrFormula: 'Perfect Participle Active: Having + Verb 3 (fused) + Object.',
    maritimeContext: 'Penggabungan data multi-sensor navigasi kapal otonom (Sensor Fusion LiDAR, Kamera & Radar).',
  },
  'm9-g-03': {
    summary: 'Inverted Third Conditional dalam investigasi BRM: Had + Subject + Verb 3 (asserted).',
    whyCorrect: '"Had the Officer of the Watch asserted his concern..." adalah pengandaian lampau tanpa If (Setara dengan: "If the OOW had asserted his concern...").',
    distractors: [
      { option: 'asserting', reason: 'Salah participle.' },
      { option: 'asserts', reason: 'Salah present tense.' },
      { option: 'been asserted', reason: 'Salah pasif karena perwira adalah pelaku yang seharusnya menyampaikan keberatan.' },
    ],
    ruleOrFormula: 'Inverted 3rd Conditional: Had + Subject + Verb 3 (asserted).',
    maritimeContext: 'Penyampaian keberatan asertif perwira jaga (BRM Assertiveness) untuk mencegah bahaya kapal kandas di alur sempit.',
  },
  'm9-g-04': {
    summary: 'Susunan baku kalimat tantangan asertif BRM (Bridge Resource Management Directive).',
    whyCorrect: 'Susunan baku kalimat tantangan asertif: Call-out (Captain) + Observation Clause (I observe our cross-track error increasing) + Conjunction (and) + Recommendation Action (recommend altering course five degrees to starboard).',
    distractors: [
      { option: 'Our cross-track error increasing Captain I observe and altering course five degrees to starboard recommend.', reason: 'Salah susunan struktur tata bahasa Inggris formal.' },
    ],
    ruleOrFormula: 'BRM Assertive Directive: [Call-out], I observe [Observation] and recommend [Action].',
    maritimeContext: 'Protokol komunikasi tantangan dan respon asertif di anjungan (BRM Challenge and Response).',
  },
  'm9-g-05': {
    summary: 'Preposisi batas durasi waktu "within" dan arah transmisi "to".',
    whyCorrect: '"within seconds" menyatakan dalam hitungan detik dan "transmitted an acknowledgment to the EPIRB" menyatakan pengiriman balasan konfirmasi kepada suar EPIRB.',
    distractors: [
      { option: 'for, at', reason: 'Salah preposisi waktu dan arah.' },
      { option: 'by, on', reason: 'Salah preposisi.' },
      { option: 'in, with', reason: 'Salah preposisi penerima.' },
    ],
    ruleOrFormula: 'Temporal duration: within [time]; Direction: transmitted to [receiver].',
    maritimeContext: 'Penerimaan sinyal marabahaya dan pengiriman balasan konfirmasi RLS satelit MEOSAR ke EPIRB.',
  },
  'm9-g-06': {
    summary: 'Cleft Sentence penegasan penyebab psikologis lampau: It was [bias] that + Past Verb (prevented).',
    whyCorrect: '"It was the insidious plan continuation bias that prevented the Master..." menegaskan bias psikologis pemaksaan rencana sebagai akar penyebab kegagalan pembatalan olah gerak berbahaya.',
    distractors: [
      { option: 'preventing', reason: 'Salah participle tanpa finite verb.' },
      { option: 'was prevented', reason: 'Salah bentuk pasif.' },
      { option: 'prevents', reason: 'Salah tenses present.' },
    ],
    ruleOrFormula: 'Cleft Sentence: It was + Noun Phrase + that + Past Verb (prevented).',
    maritimeContext: 'Bias psikologis pemaksaan rencana (Plan Continuation Bias) yang menghalangi Nakhoda membatalkan olah gerak berbahaya.',
  },
  'm9-g-07': {
    summary: 'Subjunctive Mood Pasif: Recommended that + Subject + be + Verb 3 (be restructured).',
    whyCorrect: 'Setelah kata kerja rekomendasi resmi ("recommended that..."), bentuk pasif subjunctive menggunakan bentuk dasar "be + Verb 3 (be restructured)".',
    distractors: [
      { option: 'is', reason: 'Salah bentuk indikatif present.' },
      { option: 'was', reason: 'Salah bentuk indikatif past.' },
      { option: 'were', reason: 'Salah bentuk indikatif jamak.' },
    ],
    ruleOrFormula: 'Subjunctive Passive: Recommended that + Subject + be + Verb 3.',
    maritimeContext: 'Rekomendasi audit MAIB terkait restrukturisasi jadwal dinas jaga anjungan untuk mencegah kelelahan jam biologis (Circadian Trough).',
  },
  'm9-g-08': {
    summary: 'Pasangan konjungsi korelatif: No sooner had... than...',
    whyCorrect: 'Pasangan konjungsi korelatif baku untuk "No sooner" adalah "than" (No sooner had the primary link failed than the vessel activated backup link).',
    distractors: [
      { option: 'when', reason: 'Salah karena "when" berpasangan dengan "Hardly" atau "Scarcely".' },
      { option: 'then', reason: 'Salah pasangan kata hubung korelatif.' },
      { option: 'before', reason: 'Salah pasangan kata hubung korelatif.' },
    ],
    ruleOrFormula: 'Correlative Structure: No sooner had + Past Participle... than + Past Simple.',
    maritimeContext: 'Peralihan otomatis jalur komunikasi data satelit ke link cadangan terestrial 5G pada kapal otonom.',
  },
  'm9-g-09': {
    summary: 'Participle Clause menyatakan hasil/kontribusi: Main Clause + "," + V-ing (providing).',
    whyCorrect: '"providing vital evidence..." menerangkan bahwa perekaman data VDR menghasilkan bukti penting bagi mahkamah maritim.',
    distractors: [
      { option: 'provided', reason: 'Salah past participle.' },
      { option: 'provides', reason: 'Salah finite verb tanpa konjungsi.' },
      { option: 'to provide', reason: 'Kurang tepat untuk menyatakan fungsi hasil rekaman faktual.' },
    ],
    ruleOrFormula: 'Result Participle Clause: Main Clause + "," + V-ing (providing).',
    maritimeContext: 'Perekaman data audio dan visual radar oleh Voyage Data Recorder (VDR) untuk investigasi kecelakaan maritim.',
  },
  'm9-g-10': {
    summary: 'Negative Inversion: Under no circumstances + may + Subject + Base Verb.',
    whyCorrect: 'Keterangan negatif "Under no circumstances" di awal kalimat memicu inversi kata bantu modal "may" mendahului subjek "an autonomous navigation system".',
    distractors: [
      { option: 'can it', reason: 'Salah karena kalimat sudah memiliki subjek "an autonomous system".' },
      { option: 'did', reason: 'Salah auxiliary past.' },
      { option: 'system can', reason: 'Salah susunan non-inversi.' },
    ],
    ruleOrFormula: 'Negative Inversion: Under no circumstances + may + Subject + Base Verb.',
    maritimeContext: 'Kewajiban pengamatan keliling yang layak (Proper Lookout) COLREGs Aturan 5 pada kapal otonom.',
  },
  'm9-g-11': {
    summary: 'Negative Inversion dengan Past Perfect: Not until + Subject + had been + Verb 3 + did + Subject + Verb 1.',
    whyCorrect: '"Not until the layer had been loaded did the ECDIS display..." menyatakan kronologi lampau di mana peta S-101 harus dimuat terlebih dahulu sebelum kontur kedalaman muncul.',
    distractors: [
      { option: 'has been', reason: 'Salah present perfect.' },
      { option: 'was being', reason: 'Salah past continuous.' },
      { option: 'would be', reason: 'Salah future modal.' },
    ],
    ruleOrFormula: 'Negative Inversion: Not until + Subject + had been + Verb 3 + did + Subject + Verb 1.',
    maritimeContext: 'Pemuatan lapisan batimetri resolusi tinggi peta elektronik standar IHO S-101/S-102 pada ECDIS.',
  },
  'm9-g-12': {
    summary: 'Preposisi pelaku/penyebab kalimat pasif: was influenced by [noun phrase].',
    whyCorrect: '"influenced by confirmation bias" (dipengaruhi oleh bias konfirmasi dari prakiraan cuaca lama).',
    distractors: [
      { option: 'with', reason: 'Salah preposisi.' },
      { option: 'from', reason: 'Salah preposisi.' },
      { option: 'at', reason: 'Salah preposisi.' },
    ],
    ruleOrFormula: 'Passive Agent: was influenced by + Noun Phrase.',
    maritimeContext: 'Faktor manusia bias konfirmasi dalam pengambilan keputusan bernavigasi di cuaca berkabut tebal.',
  },
  'm9-g-13': {
    summary: 'Frasa preposisi formal regulasi: "with respect to [noun phrase]" (dalam hal / berkenaan dengan).',
    whyCorrect: '"with respect to safety risk assessments" bermakna "berkenaan dengan / dalam hal penilaian risiko keselamatan dan rencana kontinjensi cadangan".',
    distractors: [
      { option: 'on behalf of', reason: 'Salah makna "atas nama".' },
      { option: 'in front of', reason: 'Salah makna posisi "di depan".' },
      { option: 'as opposed to', reason: 'Salah makna "sebagai lawan dari".' },
    ],
    ruleOrFormula: 'Regulatory Reference Phrase: with respect to + Noun Phrase.',
    maritimeContext: 'Kepatuhan terhadap Pedoman Uji Coba Kapal Otonom IMO MASS Trial Guidelines.',
  },
  'm9-g-14': {
    summary: 'Inverted Second Conditional: Were + Subject + to + Verb 1 (to exceed).',
    whyCorrect: '"Were the latency to exceed 1,500 ms..." adalah bentuk pengandaian tipe 2 formal tanpa If (Setara dengan: "If the latency were to exceed 1,500 ms...").',
    distractors: [
      { option: 'exceeds', reason: 'Salah present tense.' },
      { option: 'exceeded', reason: 'Salah past tense.' },
      { option: 'exceeding', reason: 'Salah participle.' },
    ],
    ruleOrFormula: 'Inverted 2nd Conditional: Were + Subject + to + Verb 1.',
    maritimeContext: 'Ambang batas keterlambatan latensi sinyal kendali jarak jauh kapal otonom (C2 Datalink Latency Threshold).',
  },
  'm9-g-15': {
    summary: 'Participle Clause: having + Verb 3 (having synchronized).',
    whyCorrect: '"having synchronized all bridge audio channels with radar video" menyatakan bahwa investigator merekonstruksi kronologi tubrukan setelah terlebih dahulu menyinkronkan rekaman audio anjungan dengan video radar.',
    distractors: [
      { option: 'have', reason: 'Salah auxiliary bare.' },
      { option: 'had', reason: 'Salah auxiliary past.' },
      { option: 'has', reason: 'Salah auxiliary present.' },
    ],
    ruleOrFormula: 'Participle Clause: having + Verb 3 (having synchronized).',
    maritimeContext: 'Forensik rekonstruksi kronologi kecelakaan menggunakan rekaman data VDR.',
  },

  // Vocabulary & Specialized MASS, GMDSS, S-100 & BRM (16-30)
  'm9-v-16': {
    summary: 'Definisi Kapal Otonom Derajat 3 (Degree 3 MASS) menurut IMO.',
    whyCorrect: 'Derajat 3 MASS adalah kapal yang dikendalikan dari jarak jauh tanpa ada pelaut/awak di atas kapal, yang seluruh operasinya dipantau dan dikontrol langsung dari Pusat Operasi Jarak Jauh (ROC).',
    distractors: [
      { option: 'A ship with automated processes and decision support but seafarers on board to take control', reason: 'Salah itu MASS Derajat 1.' },
      { option: 'A remotely controlled ship with seafarers on board', reason: 'Salah itu MASS Derajat 2.' },
      { option: 'A fully autonomous ship where the operating system makes all decisions independently without human supervision', reason: 'Salah itu MASS Derajat 4.' },
    ],
    maritimeContext: 'Klasifikasi tingkat otonomi kapal maritim pedoman IMO MASS Interim Guidelines.',
  },
  'm9-v-17': {
    summary: 'Definisi fitur Return Link Service (RLS) pada suar darurat Cospas-Sarsat EPIRB.',
    whyCorrect: 'RLS adalah fitur satelit Cospas-Sarsat yang mengirimkan sinyal konfirmasi balik ke EPIRB pemancar (lampu biru berkedip) untuk meyakinkan korban bahwa sinyal darurat telah diterima dan lokasinya telah terkunci oleh tim SAR.',
    distractors: [
      { option: 'An automatic parachute deploying from the beacon', reason: 'Salah bukan parasut otomatis.' },
      { option: 'A radio link connecting the EPIRB directly to passenger smartphones', reason: 'Salah bukan koneksi smartphone penumpang.' },
      { option: 'A solar battery charging mechanism', reason: 'Salah bukan panel surya.' },
    ],
    maritimeContext: 'Teknologi keselamatan marabahaya modern GMDSS MEOSAR / RLS EPIRB.',
  },
  'm9-v-18': {
    summary: 'Definisi standar produk data hidrografi S-102 di bawah kerangka IHO S-100.',
    whyCorrect: 'S-102 adalah spesifikasi produk permukaan batimetri resolusi tinggi dalam format grid 3D yang menyajikan data kedalaman presisi tinggi untuk navigasi ruang bebas bawah lunas (Under-Keel Clearance) dinamis.',
    distractors: [
      { option: 'Vector Electronic Navigational Charts (ENC)', reason: 'Salah peta vektor dasar adalah S-101.' },
      { option: 'Surface Current Water Flow specification', reason: 'Salah arus permukaan adalah S-111.' },
      { option: 'Marine Protected Area spatial boundary dataset', reason: 'Salah kawasan suaka laut adalah S-122.' },
    ],
    maritimeContext: 'Standar data hidrografi digital masa depan IHO S-100 Universal Hydrographic Model.',
  },
  'm9-v-19': {
    summary: 'Definisi bias pemaksaan rencana (Plan Continuation Bias) dalam BRM.',
    whyCorrect: 'Plan Continuation Bias adalah kecenderungan alam bawah sadar manusia untuk terus memaksakan rencana pelayaran awal meskipun kondisi cuaca atau lalu lintas telah memburuk dan tidak lagi aman.',
    distractors: [
      { option: 'A software bug in the ECDIS voyage planning tool', reason: 'Salah bukan bug perangkat lunak ECDIS.' },
      { option: 'The duty of navigator to complete logbook entries', reason: 'Salah bukan kewajiban pengisian buku jurnal.' },
      { option: 'The rotation of watchkeeping officers at sea', reason: 'Salah bukan rotasi perwira jaga.' },
    ],
    maritimeContext: 'Manajemen faktor kesalahan manusia (Human Factors) dalam Bridge Resource Management (BRM).',
  },
  'm9-v-20': {
    summary: 'Definisi kondisi Fallback Safe State pada operasi kapal otonom (MASS).',
    whyCorrect: 'Fallback Safe State adalah kondisi operasi aman terprogram (seperti menahan posisi dengan DP atau hanyut aman di zona terbuka) yang otomatis aktif jika link komunikasi kendali terputus atau algoritma mendeteksi konflik darurat.',
    distractors: [
      { option: 'Lowering the ship anchor in full ocean depth', reason: 'SANGAT FATAL! Lego jangkar di laut dalam merusak mesin jangkar dan mematahkan rantai.' },
      { option: 'Shutting down all electrical generators and extinguishing navigation lights', reason: 'SANGAT BERBAHAYA! Mematikan lampu navigasi memicu tubrukan.' },
      { option: 'Reversing the propeller shaft at maximum speed', reason: 'Salah bukan mundur kecepatan penuh tanpa kendali.' },
    ],
    maritimeContext: 'Prosedur keselamatan kontinjensi kapal otonom (MASS Fail-Safe Fallback Modes).',
  },
  'm9-v-21': {
    summary: 'Definisi sistem konstelasi satelit pencarian dan pertolongan MEOSAR.',
    whyCorrect: 'MEOSAR adalah konstelasi satelit orbit bumi menengah yang mampu mendeteksi dan menghitung posisi koordinat suar darurat EPIRB secara instan dengan cakupan global dan akurasi tinggi.',
    distractors: [
      { option: 'A low-frequency coastal radio transmitter', reason: 'Salah bukan pemancar radio pantai LF.' },
      { option: 'A handheld radar reflector used in lifeboats', reason: 'Salah bukan reflektor radar sekoci.' },
      { option: 'A marine weather fax broadcast frequency', reason: 'Salah bukan siaran faks cuaca.' },
    ],
    maritimeContext: 'Sistem satelit pencarian dan pertolongan maritim internasional Cospas-Sarsat MEOSAR.',
  },
  'm9-v-22': {
    summary: 'Fungsi Kapsul Terapung Bebas (Float-Free Capsule) pada Voyage Data Recorder (VDR).',
    whyCorrect: 'Kapsul VDR Terapung Bebas (Float-Free) dirancang untuk terlepas otomatis saat kapal tenggelam, mengapung di permukaan air, dan memancarkan sinyal suar pemandu agar rekaman data pelayaran mudah ditemukan oleh investigator.',
    distractors: [
      { option: 'To store emergency fresh water for survivors', reason: 'Salah bukan penyimpan air minum darurat.' },
      { option: 'To release fluorescent green sea dye marker', reason: 'Salah bukan pewarna laut hijau.' },
      { option: 'To deploy an inflatable liferaft automatically', reason: 'Salah bukan peluncur rakit penolong.' },
    ],
    maritimeContext: 'Peralatan perekam data pelayaran kapal SOLAS Bab V (Voyage Data Recorder Performance Standards).',
  },
  'm9-v-23': {
    summary: 'Definisi teknologi Sensor Fusion pada sistem navigasi kapal otonom.',
    whyCorrect: 'Sensor Fusion adalah proses penggabungan dan korelasi silang data dari berbagai instrumen (radar, LiDAR, AIS, dan kamera optik cerdas) menjadi satu gambaran situasi navigasi terpadu yang sangat akurat secara real-time.',
    distractors: [
      { option: 'Welding navigation equipment brackets to the bridge roof', reason: 'Salah bukan pengelasan dudukan radar.' },
      { option: 'Connecting all navigation lights to a single circuit breaker', reason: 'Salah lampu navigasi wajib memiliki sirkuit terpisah.' },
      { option: 'Melting thermal fuses in the fire alarm panel', reason: 'Salah bukan pelelehan sekring alarm api.' },
    ],
    maritimeContext: 'Teknologi persepsi dan kecerdasan buatan navigasi kapal otonom.',
  },
  'm9-v-24': {
    summary: 'Tingkat tertinggi kesadaran situasional (Level 3) dalam BRM.',
    whyCorrect: 'Tingkat tertinggi kesadaran situasional (Level 3) adalah "Proyeksi Status Masa Depan" (kemampuan mengantisipasi bagaimana pergerakan lalu lintas kapal, perubahan cuaca, dan dinamika olah gerak kapal akan berkembang dalam beberapa menit ke depan).',
    distractors: [
      { option: 'Perception of elements in current environment (Level 1)', reason: 'Salah itu persepsi dasar (Level 1).' },
      { option: 'Comprehension of the current situation (Level 2)', reason: 'Salah itu pemahaman situasi saat ini (Level 2).' },
      { option: 'Memorizing ship particulars and dimensions', reason: 'Salah bukan sekadar menghafal dimensi kapal.' },
    ],
    maritimeContext: 'Model kesadaran situasional Endsley dalam Bridge Resource Management (BRM Level 3 Projection).',
  },
  'm9-v-25': {
    summary: 'Definisi layanan Iridium SafetyCast dalam modernisasi GMDSS.',
    whyCorrect: 'Iridium SafetyCast adalah layanan satelit resmi yang diakui IMO untuk menyiarkan Informasi Keselamatan Maritim (MSI), peringatan navigasi, dan prakiraan cuaca secara global hingga perairan kutub (Area Laut A4).',
    distractors: [
      { option: 'A commercial television channel for crew recreational rooms', reason: 'Salah bukan siaran televisi hiburan kru.' },
      { option: 'An underwater acoustic fish finder system', reason: 'Salah bukan alat pendeteksi ikan.' },
      { option: 'A handheld walkie-talkie for mooring operations', reason: 'Salah bukan handy talkie tali tambat.' },
    ],
    maritimeContext: 'Modernisasi sistem komunikasi keselamatan maritim global (GMDSS Modernization & Iridium SafetyCast).',
  },
  'm9-v-26': {
    summary: 'Definisi budaya keselamatan Just Culture dalam manajemen maritim.',
    whyCorrect: 'Just Culture adalah budaya keselamatan organisasi di mana awak kapal didorong untuk melaporkan kesalahan dan insiden nyaris celaka tanpa takut dihukum, dengan membedakan secara adil antara kekhilafan manusiawi dan kelalaian berat.',
    distractors: [
      { option: 'A legal courtroom where maritime trials take place', reason: 'Salah bukan ruang sidang pengadilan maritim.' },
      { option: 'A strict punitive disciplinary regime punishing all mistakes with dismissal', reason: 'Salah rezim hukuman keras justru memicu budaya menutup-nutupi bahaya.' },
      { option: 'A social club for maritime academy graduates', reason: 'Salah bukan klub alumni maritim.' },
    ],
    maritimeContext: 'Budaya keterbukaan pelaporan keselamatan ISM Code (Just Culture in Maritime Safety).',
  },
  'm9-v-27': {
    summary: 'Informasi yang disajikan oleh produk data hidrografi S-111 (IHO S-100).',
    whyCorrect: 'Produk data S-111 menyajikan lapisan visual vektor arus permukaan laut serta kecepatan dan arah aliran pasang surut secara dinamis di atas peta elektronik.',
    distractors: [
      { option: 'Marine boundary lines and customs zones', reason: 'Salah batas laut adalah S-121.' },
      { option: 'Under-keel clearance calculation algorithms', reason: 'Salah algoritma UKC adalah S-129.' },
      { option: 'Radio navigation aid frequencies and Morse codes', reason: 'Salah frekuensi radio navigasi adalah S-123.' },
    ],
    maritimeContext: 'Standar data oseanografi permukaan navigasi elektronik IHO S-111.',
  },
  'm9-v-28': {
    summary: 'Definisi Model Keju Swiss (Swiss Cheese Model) dalam analisis kecelakaan maritim.',
    whyCorrect: 'Model Keju Swiss Reason adalah model kecelakaan sistemik yang menggambarkan bahwa kecelakaan terjadi ketika lapisan pertahanan keselamatan gagal bersamaan sehingga lubang-lubang kelemahan berada dalam satu garis lurus.',
    distractors: [
      { option: 'A culinary guide for passenger cruise galleys', reason: 'Salah bukan buku resep keju dapur kapal.' },
      { option: 'A method of calculating structural steel corrosion on cargo holds', reason: 'Salah bukan metode ukur karat baja.' },
      { option: 'A technique for inspecting dairy products in refrigerated containers', reason: 'Salah bukan inspeksi susu kontainer.' },
    ],
    maritimeContext: 'Analisis kausalitas kecelakaan maritim (James Reason Swiss Cheese Accident Model).',
  },
  'm9-v-29': {
    summary: 'Definisi Latensi Datalink Komando & Kendali (C2 Datalink Latency).',
    whyCorrect: 'Latensi Datalink C2 adalah jeda waktu antara perintah yang dikirimkan oleh operator darat di ROC hingga perintah tersebut dieksekusi oleh sistem kapal dan konfirmasi telemetrinya diterima kembali di darat.',
    distractors: [
      { option: 'The cable length of the ship anchor chain', reason: 'Salah bukan panjang rantai jangkar.' },
      { option: 'The battery life of bridge hand-held radios', reason: 'Salah bukan daya tahan baterai HT anjungan.' },
      { option: 'The time taken to print electronic charts on paper', reason: 'Salah bukan waktu cetak peta kertas.' },
    ],
    maritimeContext: 'Parameter keandalan jaringan telekomunikasi komando kapal otonom (MASS C2 Datalink Telemetry).',
  },
  'm9-v-30': {
    summary: 'Definisi periode kelelahan Circadian Trough pada jadwal dinas jaga anjungan.',
    whyCorrect: 'Circadian Trough adalah periode penurunan biologis alami tubuh manusia antara pukul 02:00 hingga 06:00 dini hari di mana tingkat kewaspadaan, konsentrasi, dan kecepatan respon berada pada titik terendah.',
    distractors: [
      { option: 'A low-pressure tropical storm trough in the Pacific', reason: 'Salah bukan palung badai tropis.' },
      { option: 'The deepest trench in the Atlantic Ocean', reason: 'Salah bukan palung samudra terdalam.' },
      { option: 'A drain channel under the engine room floor plates', reason: 'Salah bukan got kamar mesin.' },
    ],
    maritimeContext: 'Manajemen pencegahan kelelahan awak kapal jaga (Watchkeeper Fatigue & Circadian Rhythm).',
  },

  // Calculations & Dynamics (31-40)
  'm9-t-31': {
    summary: 'Kalkulasi jarak tempuh kapal otonom selama jeda latensi satelit 1,2 detik pada kecepatan 16 knot (8,22 m/s).',
    whyCorrect: 'Jarak tempuh selama jeda latensi = Kecepatan × Waktu = 8,22 m/s × 1,2 detik = 9,864 ≈ 9,86 meter.',
    distractors: [
      { option: '12.50 meters', reason: 'Salah hitung perkalian.' },
      { option: '6.40 meters', reason: 'Salah hitung perkalian.' },
      { option: '15.20 meters', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Distance = Speed × Time = 8.22 × 1.2 = 9.86 Meters.',
    maritimeContext: 'Kalkulasi jarak tempuh kapal otonom selama jeda transmisi sinyal satelit.',
  },
  'm9-t-32': {
    summary: 'Kalkulasi setting ECDIS Safety Depth: Sarat 11,20 m + Squat 0,80 m + Heel 0,40 m - Pasut 1,50 m + Margin 1,00 m.',
    whyCorrect: 'Safety Depth = Sarat (11,20) + Squat (0,80) + Kemiringan (0,40) - Pasang Surut (1,50) + Margin Aman (1,00) = 11,90 meter.',
    distractors: [
      { option: '12.40 meters', reason: 'Salah hitung karena tidak mengurangkan tinggi pasang surut.' },
      { option: '13.20 meters', reason: 'Salah hitung penjumlahan.' },
      { option: '10.50 meters', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Safety Depth = Draft + Squat + Heel - Tide + Margin = 11.20 + 0.80 + 0.40 - 1.50 + 1.00 = 11.90 m.',
    maritimeContext: 'Kalkulasi batas kedalaman aman (ECDIS Safety Depth Contour Setting).',
  },
  'm9-t-33': {
    summary: 'Evaluasi kepatuhan jam istirahat 10 jam dalam 2 periode (6 jam dan 4 jam) menurut MLC 2006.',
    whyCorrect: 'Ya, memenuhi syarat penuh MLC 2006 karena total istirahat mencapai 10 jam dalam 24 jam, dibagi maksimal 2 periode, dan salah satu periode istirahat berdurasi minimal 6 jam berturut-turut.',
    distractors: [
      { option: 'No, rest cannot be divided under any circumstances', reason: 'Salah MLC 2006 memperbolehkan pembagian maksimal 2 periode.' },
      { option: 'No, minimum continuous rest must be 8 hours', reason: 'Salah batas minimal periode terpanjang adalah 6 jam, bukan 8 jam.' },
      { option: 'Yes, but only if approved by the Chief Engineer', reason: 'Salah kepatuhan MLC berlaku normatif hukum tanpa perlu dispensasi KKM.' },
    ],
    ruleOrFormula: 'MLC 2006 Rule: Min 10 hrs rest / 24h, max 2 periods, one period ≥ 6 hrs.',
    maritimeContext: 'Evaluasi kepatuhan jam kerja dan jam istirahat pelaut Konvensi MLC 2006 Standard A2.3.',
  },
  'm9-t-34': {
    summary: 'Durasi minimal penyimpanan data rekaman VDR dalam kapsul tetap menurut Resolusi IMO MSC.333(90).',
    whyCorrect: 'Resolusi IMO MSC.333(90) menetapkan bahwa kapsul tetap (fixed) dan kapsul terapung (float-free) VDR wajib menyimpan data rekaman minimal selama 48 jam terus-menerus.',
    distractors: [
      { option: '24 hours', reason: 'Salah 24 jam hanya untuk data rekaman lama sebelum revisi 2014.' },
      { option: '12 hours', reason: 'Salah batas 12 jam adalah standar lama VDR lama non-revisi.' },
      { option: '72 hours', reason: 'Salah bukan 72 jam.' },
    ],
    ruleOrFormula: 'VDR Retention Standard: Minimum 48 hours continuous data.',
    maritimeContext: 'Standar durasi penyimpanan data rekaman kotak hitam kapal (VDR Performance Standards).',
  },
  'm9-t-35': {
    summary: 'Kalkulasi persentase korelasi fusi sensor cerdas: 38 target terkorelasikan dari total 40 target.',
    whyCorrect: 'Persentase korelasi fusi sensor = (38 target ÷ 40 target) × 100% = 95,0%.',
    distractors: [
      { option: '92.5%', reason: 'Salah hitung pembagian.' },
      { option: '98.0%', reason: 'Salah hitung pembagian.' },
      { option: '90.0%', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Correlation Rate = (Correlated / Total) × 100% = (38 / 40) × 100% = 95.0%.',
    maritimeContext: 'Tingkat akurasi algoritma penggabungan sensor pelacakan target navigasi otonom.',
  },
  'm9-t-36': {
    summary: 'Batas minimal wajib jam istirahat pelaut dalam setiap periode 7 hari menurut STCW dan MLC 2006.',
    whyCorrect: 'Regulasi MLC 2006 dan STCW Seksi A-VIII/1 mewajibkan waktu istirahat pelaut tidak boleh kurang dari 77 jam dalam setiap periode 7 hari.',
    distractors: [
      { option: '70 hours', reason: 'Salah 70 jam berada 7 jam di bawah batas undang-undang.' },
      { option: '84 hours', reason: 'Salah bukan 84 jam.' },
      { option: '60 hours', reason: 'Salah 60 jam merupakan pelanggaran berat.' },
    ],
    ruleOrFormula: 'Mandatory Weekly Rest: Minimum 77 hours in any 7-day period.',
    maritimeContext: 'Ketentuan batas minimal jam istirahat mingguan pelaut STCW / MLC 2006.',
  },
  'm9-t-37': {
    summary: 'Kalkulasi selisih kecepatan penguncian koordinat MEOSAR (3,5 menit) vs LEOSAR (120 menit).',
    whyCorrect: 'Keunggulan kecepatan = 120,0 menit - 3,5 menit = 116,5 menit lebih cepat.',
    distractors: [
      { option: '110.0 minutes faster', reason: 'Salah hitung pengurangan.' },
      { option: '90.5 minutes faster', reason: 'Salah hitung pengurangan.' },
      { option: '100.0 minutes faster', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Time Saved = 120.0 - 3.5 = 116.5 Minutes.',
    maritimeContext: 'Efisiensi kecepatan penguncian koordinat suar darurat satelit MEOSAR generasi baru.',
  },
  'm9-t-38': {
    summary: 'Kalkulasi kedalaman air dinamis S-102/S-104: Kedalaman peta 8,5 m + Lonjakan pasut +1,8 m.',
    whyCorrect: 'Kedalaman air dinamis yang tersedia = 8,5 meter + 1,8 meter = 10,3 meter.',
    distractors: [
      { option: '9.8 meters', reason: 'Salah hitung penjumlahan.' },
      { option: '10.8 meters', reason: 'Salah hitung penjumlahan.' },
      { option: '11.0 meters', reason: 'Salah hitung penjumlahan.' },
    ],
    ruleOrFormula: 'Dynamic Depth = Charted Depth + Dynamic Tide = 8.5 + 1.8 = 10.3 m.',
    maritimeContext: 'Integrasi data pasang surut real-time S-104/S-102 pada navigasi presisi alur pelabuhan.',
  },
  'm9-t-39': {
    summary: 'Kalkulasi kapasitas penyimpanan data VDR 30 hari pada konsumsi data 4,5 GB per hari.',
    whyCorrect: 'Total kapasitas data yang terpakai = 30 hari × 4,5 GB/hari = 135,0 Gigabytes (GB).',
    distractors: [
      { option: '120.0 GB', reason: 'Salah hitung perkalian.' },
      { option: '150.0 GB', reason: 'Salah hitung perkalian.' },
      { option: '180.0 GB', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Total Storage = 30 days × 4.5 GB/day = 135.0 GB.',
    maritimeContext: 'Kalkulasi kapasitas media penyimpanan data jangka panjang VDR kapal.',
  },
  'm9-t-40': {
    summary: 'Evaluasi audit kepatuhan jam istirahat mingguan total 49 jam terhadap batas wajib MLC 77 jam.',
    whyCorrect: 'Tidak memenuhi syarat (pelanggaran berat) karena total istirahat 49 jam berada 28 jam di bawah batas minimal wajib 77 jam per 7 hari.',
    distractors: [
      { option: 'Yes, complies because average is 7 hours per day', reason: 'Salah rata-rata harian 7 jam (49/7) melanggar aturan minimal 10 jam/hari dan 77 jam/minggu.' },
      { option: 'Yes, complies if compensatory rest is granted next month', reason: 'Salah istirahat kompensasi tidak dapat ditunda hingga bulan depan.' },
      { option: 'No, but exempt during ocean passage', reason: 'Salah tidak ada pengecualian jam istirahat selama pelayaran samudra biasa.' },
    ],
    ruleOrFormula: 'Audit Calculation: 49 hours < 77 hours minimum (Deficit = -28 hours).',
    maritimeContext: 'Temuan audit jam kerja dan istirahat pelaut oleh Port State Control (MLC Deficiency).',
  },

  // Reading Comprehension & Regulations (41-50)
  'm9-r-41': {
    summary: 'Pihak yang memegang tanggung jawab hukum tertinggi atas navigasi kapal otonom (MASS).',
    whyCorrect: 'Nakhoda Jarak Jauh (Remote Master) yang berwenang atau operator manusia yang ditunjuk tetap memegang tanggung jawab hukum tertinggi atas keselamatan navigasi kapal otonom sesuai SOLAS dan COLREGs.',
    distractors: [
      { option: 'The artificial intelligence software vendor', reason: 'Salah vendor perangkat lunak AI tidak memegang wewenang komando hukum maritim.' },
      { option: 'The satellite internet service provider', reason: 'Salah penyedia internet satelit bukan penanggung jawab hukum navigasi.' },
      { option: 'The port state customs department', reason: 'Salah bea cukai bukan penanggung jawab navigasi.' },
    ],
    maritimeContext: 'Tanggung jawab hukum nakhoda kendali jarak jauh kapal otonom (MASS Remote Master Accountability).',
  },
  'm9-r-42': {
    summary: 'Faktor kesalahan organisasi manusia penyebab kapal kandas menurut laporan MAIB.',
    whyCorrect: 'Penyebab utama kecelakaan adalah gradien otoritas yang terlalu curam (jarak hierarki tinggi) dan rasa takut perwira muda untuk menegur/menantang Nakhoda yang mengambil keputusan keliru.',
    distractors: [
      { option: 'Complete blackout of electrical steering motors', reason: 'Salah bukan blackout mesin kemudi.' },
      { option: 'Failure of the satellite GPS constellations', reason: 'Salah sinyal GPS bekerja normal.' },
      { option: 'Loss of radar display in heavy fog', reason: 'Salah radar bekerja normal.' },
    ],
    maritimeContext: 'Analisis faktor hierarki komunikasi anjungan (Steep Authority Gradient in BRM).',
  },
  'm9-r-43': {
    summary: 'Manfaat operasional utama ekosistem data navigasi IHO S-100.',
    whyCorrect: 'Manfaat utama standar S-100 adalah kemampuan mengintegrasikan lapisan data dinamis real-time (batimetri detail S-102, pasang surut S-104, dan arus permukaan S-111) langsung ke atas peta elektronik.',
    distractors: [
      { option: 'Eliminating the need for ship compasses and steering wheels', reason: 'Salah pedoman dan kemudi tetap diwajibkan SOLAS.' },
      { option: 'Allowing crew to watch commercial streaming entertainment on ECDIS', reason: 'Salah ECDIS dilarang digunakan untuk menonton hiburan.' },
      { option: 'Automating payroll payments to seafarers via satellite', reason: 'Salah bukan sistem penggajian awak kapal.' },
    ],
    maritimeContext: 'Keunggulan operasional ekosistem peta elektronik generasi baru IHO S-100.',
  },
  'm9-r-44': {
    summary: 'Komunikasi suara yang wajib direkam oleh Voyage Data Recorder (VDR).',
    whyCorrect: 'VDR wajib merekam percakapan suara dari seluruh mikrofon anjungan navigasi serta komunikasi radio maritim VHF.',
    distractors: [
      { option: 'Private telephone calls made by passengers in cabins', reason: 'Salah telepon pribadi penumpang tidak direkam VDR.' },
      { option: 'Conversations in shore shipping company offices', reason: 'Salah bukan percakapan kantor darat.' },
      { option: 'Galley dining table chatter only', reason: 'Salah bukan obrolan ruang makan dapur.' },
    ],
    maritimeContext: 'Spesifikasi perekaman audio anjungan standar VDR IMO Bab V.',
  },
  'm9-r-45': {
    summary: 'Dua ketentuan hukum yang berlaku pada pencatatan jam istirahat pelaut (STCW).',
    whyCorrect: 'Catatan jam istirahat wajib dibuat dalam bahasa kerja resmi kapal dan wajib ditandatangani bersama oleh pelaut bersangkutan serta Nakhoda.',
    distractors: [
      { option: 'Kept strictly confidential and destroyed after 7 days', reason: 'Salah catatan jam istirahat wajib disimpan minimal 1 tahun untuk audit PSC.' },
      { option: 'Sent to the flag state every 24 hours by satellite', reason: 'Salah tidak wajib dikirim tiap 24 jam.' },
      { option: 'Recorded only during port stays', reason: 'Salah jam istirahat wajib dicatat setiap hari baik di laut maupun di pelabuhan.' },
    ],
    maritimeContext: 'Kewajiban dokumentasi dan verifikasi jam istirahat pelaut STCW Bab VIII.',
  },
  'm9-r-46': {
    summary: 'Aturan manuver penghindaran tubrukan kapal otonom (MASS COLREGs Compliance).',
    whyCorrect: 'Kapal otonom wajib mematuhi aturan kemudi dan berlayar COLREGs secara mutlak dengan mengambil tindakan pencegahan tubrukan sedini mungkin dan dalam skala yang tegas/nyata.',
    distractors: [
      { option: 'By maintaining course and forcing manned ships to give way', reason: 'SANGAT FATAL! Memaksa kapal berawak menghindar melanggar aturan hak jalan COLREGs.' },
      { option: 'By reversing engines to a complete stop for every target', reason: 'Salah mesin tidak dimatikan mendadak untuk tiap target jauh.' },
      { option: 'By ignoring small fishing boats and leisure crafts', reason: 'SANGAT BERBAHAYA! Mengabaikan perahu nelayan memicu tubrukan maut.' },
    ],
    maritimeContext: 'Kepatuhan algoritma kapal otonom terhadap Aturan P2TL / COLREGs 1972.',
  },
  'm9-r-47': {
    summary: 'Metode kalkulasi posisi koordinat suar darurat pada konstelasi satelit MEOSAR.',
    whyCorrect: 'Satelit MEOSAR menghitung koordinat lokasi suar darurat secara instan menggunakan kombinasi perbedaan waktu tiba sinyal (TDOA) dan perbedaan pergeseran frekuensi Doppler (FDOA).',
    distractors: [
      { option: 'By waiting for visual spotting from rescue aircraft', reason: 'Salah MEOSAR adalah sistem kalkulasi satelit otomatis.' },
      { option: 'By measuring water salinity around the beacon', reason: 'Salah bukan mengukur kadar garam air laut.' },
      { option: 'Using magnetic compass bearings transmitted via Morse code', reason: 'Salah bukan baringan kompas kode morse.' },
    ],
    maritimeContext: 'Teknologi kalkulasi posisi suar marabahaya satelit Cospas-Sarsat MEOSAR.',
  },
  'm9-r-48': {
    summary: 'Definisi fenomena penyempitan kognitif (Cognitive Tunneling) di anjungan.',
    whyCorrect: 'Cognitive Tunneling adalah kondisi psikologis di mana perhatian navigator terpaku sempit hanya pada satu masalah/alarm kecil sehingga kehilangan kewaspadaan terhadap bahaya navigasi di sekelilingnya.',
    distractors: [
      { option: 'Navigating a ship through an underwater tunnel', reason: 'Salah bukan berlayar di terowongan bawah air.' },
      { option: 'A hardware error on the radar transceiver', reason: 'Salah bukan kerusakan transceiver radar.' },
      { option: 'The normal function of automated autopilot steering', reason: 'Salah bukan fungsi autopilot.' },
    ],
    maritimeContext: 'Bahaya penyempitan fokus perhatian saat situasi darurat di anjungan (Cognitive Tunneling).',
  },
  'm9-r-49': {
    summary: 'Langkah pengamanan siber yang diwajibkan untuk jalur komunikasi data kapal otonom (MSC.428(98)).',
    whyCorrect: 'Jalur komunikasi kendali kapal otonom wajib dilindungi dengan enkripsi kriptografi ujung-ke-ujung (end-to-end), otentikasi sertifikat timbal balik, dan sistem deteksi intrusi siber.',
    distractors: [
      { option: 'Open unencrypted public Wi-Fi networks', reason: 'SANGAT BERBAHAYA! Menggunakan Wi-Fi publik tanpa enkripsi memicu pembajakan kapal oleh peretas.' },
      { option: 'Sharing default administration passwords with shore contractors', reason: 'SANGAT FATAL! Membagikan password admin melanggar keamanan siber.' },
      { option: 'Disabling firewalls during high-speed data transfers', reason: 'SANGAT BERBAHAYA! Mematikan firewall membiarkan malware masuk ke sistem kendali kapal.' },
    ],
    maritimeContext: 'Manajemen risiko siber maritim pada jaringan kapal otonom IMO Cyber Risk Management.',
  },
  'm9-r-50': {
    summary: 'Tujuan sejati Analisis Akar Masalah (Root Cause Analysis / RCA) dalam forensik kecelakaan laut.',
    whyCorrect: 'Tujuan sejati Analisis Akar Masalah (RCA) adalah mengidentifikasi kelemahan sistemik dan kekurangan organisasi laten di balik kecelakaan, bukan sekadar mencari kesalahan individu pelaksana.',
    distractors: [
      { option: 'To assign criminal blame to the lowest ranking crew member', reason: 'Salah RCA bukan sarana mengambinghitamkan kru bawahan.' },
      { option: 'To conceal equipment defects from insurance adjusters', reason: 'Salah RCA dilarang menyembunyikan cacat peralatan.' },
      { option: 'To reduce the compensation paid to cargo owners', reason: 'Salah bukan untuk memotong ganti rugi muatan.' },
    ],
    maritimeContext: 'Metodologi investigasi keselamatan maritim modern (Systemic Root Cause Analysis).',
  },

  // Listening & Remote ROC / GMDSS / BRM VHF (51-60)
  'm9-l-51': {
    summary: 'Konfirmasi serah terima wewenang kendali kapal otonom dari pengendali ROC ke anjungan.',
    whyCorrect: 'Pengendali ROC mengonfirmasi proses serah terima wewenang kendali kapal otonom (Command Authority) dari konsol darat kepada tim anjungan kapal di pelampung alur pandu.',
    distractors: [
      { option: 'Vessel engines shut down completely', reason: 'Salah mesin kapal tetap beroperasi normal.' },
      { option: 'Shore console has lost all satellite connection', reason: 'Salah link telemetri hijau dan bekerja normal.' },
      { option: 'Onboard crew evacuated to shore via helicopter', reason: 'Salah tidak ada evakuasi helikopter.' },
    ],
    maritimeContext: 'Protokol serah terima kendali kapal otonom dari stasiun darat ke anjungan kapal.',
  },
  'm9-l-52': {
    summary: 'Peringatan siaran marabahaya Mayday Relay aktivasi EPIRB RLS oleh JRCC Stavanger.',
    whyCorrect: 'Pusat Koordinasi Penyelamatan (JRCC) menyiarkan Mayday Relay atas aktivasi suar EPIRB 406 MHz berfitur RLS dan radar SART aktif pada koordinat 62-15N 004-30E.',
    distractors: [
      { option: 'Test broadcast of storm warning signals', reason: 'Salah bukan siaran uji coba badai.' },
      { option: 'Navigational light buoy missing from position', reason: 'Salah bukan pelampung suar hilang.' },
      { option: 'Routine radio check with coast radio station', reason: 'Salah bukan uji coba radio rutin.' },
    ],
    maritimeContext: 'Siaran siaga marabahaya SAR maritim modern Cospas-Sarsat.',
  },
  'm9-l-53': {
    summary: 'Pernyataan keberatan asertif Mualim 2 menentang haluan kapal demi mencegah tubrukan.',
    whyCorrect: 'Mualim 2 secara asertif menentang haluan kapal saat ini karena jarak terdekat (CPA) dengan kapal penyeberang hanya 0,1 mil dalam 4 menit dan merekomendasikan perubahan haluan 20 derajat ke kanan seketika.',
    distractors: [
      { option: 'Recommending increasing speed to 25 knots to cross ahead', reason: 'SANGAT BERBAHAYA! Menambah kecepatan memotong haluan kapal lain memicu tubrukan fatal.' },
      { option: 'Agreeing that current heading is completely safe', reason: 'Salah Mualim 2 justru menyatakan risiko tubrukan sangat tinggi.' },
      { option: 'Asking the helmsman to leave the steering wheel', reason: 'Salah bukan menyuruh jurumudi pergi.' },
    ],
    maritimeContext: 'Penerapan tantangan asertif BRM perwira jaga guna mencegah bahaya tubrukan.',
  },
  'm9-l-54': {
    summary: 'Laporan pengamanan barang bukti dan unduhan rekaman 48 jam data VDR oleh investigator.',
    whyCorrect: 'Investigator utama melaporkan kapsul VDR berhasil dilepas utuh dan rekaman 48 jam audio anjungan, video radar, dan data mesin berhasil diunduh dengan rantai pengawasan bukti hukum yang sah.',
    distractors: [
      { option: 'VDR capsule was destroyed in collision and data lost', reason: 'Salah kapsul VDR ditemukan utuh sempurna.' },
      { option: 'VDR had not recorded any data for the past 6 months', reason: 'Salah rekaman 48 jam tersimpan lengkap.' },
      { option: 'Investigation cancelled due to lack of evidence', reason: 'Salah investigasi berlanjut dengan bukti forensik lengkap.' },
    ],
    maritimeContext: 'Prosedur pengamanan barang bukti rekaman VDR dalam investigasi kecelakaan laut.',
  },
  'm9-l-55': {
    summary: 'Tindakan manuver penghindaran rintangan kayu terapung otomatis oleh kapal otonom MASS.',
    whyCorrect: 'Sistem kecerdasan buatan kapal otonom mendeteksi batang kayu terapung pada jarak 6 kabel melalui fusi kamera optik dan LiDAR, serta mengeksekusi perubahan haluan otomatis 15 derajat ke kiri.',
    distractors: [
      { option: 'Ship ran directly over the floating obstacle at full speed', reason: 'Salah kapal berhasil menghindar otomatis.' },
      { option: 'Navigation system suffered total processor freeze', reason: 'Salah sistem komputasi bekerja normal.' },
      { option: 'Radar detected a phantom false target on land', reason: 'Salah target terkonfirmasi nyata di laut.' },
    ],
    maritimeContext: 'Deteksi rintangan dan manuver penghindaran otomatis kapal tanpa awak.',
  },
  'm9-l-56': {
    summary: 'Peringatan navigasi operasi penggelaran kabel laut yang disiarkan lewat Iridium SafetyCast.',
    whyCorrect: 'Siaran peringatan navigasi SafetyCast mengabarkan adanya operasi penggelaran kabel listrik bawah laut dan meminta seluruh kapal yang melintas memberikan ruang bebas yang lebar.',
    distractors: [
      { option: 'Lighthouse extinguished due to power failure', reason: 'Salah bukan mercusuar padam.' },
      { option: 'Military firing exercise in coastal waters', reason: 'Salah bukan latihan tembak militer.' },
      { option: 'Port closed due to heavy fog', reason: 'Salah bukan penutupan pelabuhan.' },
    ],
    maritimeContext: 'Penerimaan siaran peringatan keselamatan navigasi Iridium SafetyCast MSI.',
  },
  'm9-l-57': {
    summary: 'Pelajaran evaluasi bias pemaksaan rencana yang ditegaskan Nakhoda di anjungan.',
    whyCorrect: 'Nakhoda menegaskan pelajaran penting untuk mengenali bias pemaksaan rencana, berkomitmen membatalkan operasi lebih awal saat cuaca buruk, dan menerapkan prinsip Just Culture dalam evaluasi tim.',
    distractors: [
      { option: 'Disciplining the second officer for reporting bad weather', reason: 'Salah menghukum perwira yang melapor melanggar prinsip Just Culture.' },
      { option: 'Ignoring weather warnings to meet charter party schedules', reason: 'SANGAT BERBAHAYA! Mengabaikan cuaca demi jadwal memicu kecelakaan laut fatal.' },
      { option: 'Prohibiting debriefing meetings on the bridge', reason: 'Salah evaluasi anjungan sangat dianjurkan.' },
    ],
    maritimeContext: 'Evaluasi pasca-pelayaran dan penerapan prinsip Just Culture di anjungan.',
  },
  'm9-l-58': {
    summary: 'Konfirmasi lapisan data batimetri grid S-102 dan arus pasut S-111 kepada pandu kapal.',
    whyCorrect: 'Perwira navigasi mengonfirmasi kepada pandu bahwa lapisan batimetri grid S-102 dan visual vektor arus pasang surut S-111 telah aktif dengan kontur kedalaman aman 12,5 meter.',
    distractors: [
      { option: 'Paper chart was torn and cannot be used', reason: 'Salah sistem navigasi menggunakan ECDIS resmi.' },
      { option: 'ECDIS system lost all sounder input', reason: 'Salah instrumen perum gema bekerja normal.' },
      { option: 'Pilot portable unit ran out of battery', reason: 'Salah unit pandu berfungsi normal.' },
    ],
    maritimeContext: 'Konfirmasi kesiapan navigasi berpresisi tinggi standar S-100 kepada Pandu Pelabuhan.',
  },
  'm9-l-59': {
    summary: 'Aktivasi kondisi aman darurat (Fallback State) kapal otonom saat link C2 satelit terputus.',
    whyCorrect: 'Akibat putusnya link kendali C2, kapal otonom otomatis masuk mode aman darurat (fallback state): menahan posisi dengan DP, membunyikan suling kabut, dan memancarkan status otonom pada AIS Pesan 21.',
    distractors: [
      { option: 'Steaming ahead blindly at 20 knots', reason: 'SANGAT FATAL! Berlayar buta tanpa kendali memicu tubrukan bencana.' },
      { option: 'Vessel drifting uncontrolled onto sandbank', reason: 'Salah kapal menahan posisi secara otomatis dengan Dynamic Positioning.' },
      { option: 'Remote operator abandoned control station', reason: 'Salah operator darat tetap berkoordinasi dengan VTS.' },
    ],
    maritimeContext: 'Aktivasi protokol keselamatan gagal (Fail-Safe Protocol) kapal otonom saat hilang kontak.',
  },
  'm9-l-60': {
    summary: 'Penerbitan temuan audit Port State Control atas pelanggaran batas minimal jam istirahat pelaut.',
    whyCorrect: 'Inspektur PSC menerbitkan temuan kekurangan Code 17 karena Mualim 1 hanya memperoleh total 58 jam istirahat dalam 7 hari berturut-turut, melanggar batas minimal 77 jam yang diwajibkan STCW/MLC.',
    distractors: [
      { option: 'Ship failed to pay harbor mooring dues', reason: 'Salah bukan masalah uang tambat pelabuhan.' },
      { option: 'Master forgot to sign the garbage logbook', reason: 'Salah bukan buku catatan sampah.' },
      { option: 'Chief Officer was on shore leave without permission', reason: 'Salah bukan masalah izin pesiar darat.' },
    ],
    maritimeContext: 'Penerbitan temuan pemeriksaan kelaiklautan PSC terkait pelanggaran jam istirahat pelaut.',
  },
};

// Comprehensive & Non-Rambling Indonesian Explanations for Marlins Test 10 (All 60 Questions)
const TEST_10_EXPLANATIONS: Record<string, DetailedExplanation> = {
  // Grammar (1-15)
  'm10-g-01': {
    summary: 'Legal Subjunctive Mood: Stipulated that + Subject + bare verb (sign).',
    whyCorrect: 'Setelah kata kerja penegasan klausula hukum ("stipulated that..."), kata kerja subjek jamak/tunggal wajib menggunakan bentuk dasar murni "sign" tanpa akhiran -s atau bentuk lampau.',
    distractors: [
      { option: 'signed', reason: 'Salah bentuk past tense.' },
      { option: 'signs', reason: 'Salah bentuk orang ketiga tunggal.' },
      { option: 'will sign', reason: 'Salah future modal.' },
    ],
    ruleOrFormula: 'Executive Legal Subjunctive: Stipulated that + Subject + Base Verb (sign).',
    maritimeContext: 'Ketetapan hukum penilai kerugian umum (Average Adjuster) terkait penandatanganan surat jaminan kontribusi kerugian (Average Bond).',
  },
  'm10-g-02': {
    summary: 'Inverted Third Conditional Pasif: Had + Subject + been + Verb 3 (been deemed).',
    whyCorrect: '"Had the vessel been deemed unseaworthy..." adalah pengandaian lampau bentuk pasif tanpa If (Setara dengan: "If the vessel had been deemed unseaworthy...").',
    distractors: [
      { option: 'deemed', reason: 'Salah bentuk aktif (kapal dinilai oleh pihak berwenang, bukan menilai dirinya sendiri).' },
      { option: 'deeming', reason: 'Salah participle.' },
      { option: 'been deeming', reason: 'Salah continuous.' },
    ],
    ruleOrFormula: 'Inverted 3rd Conditional Passive: Had + Subject + been + Verb 3 (been deemed).',
    maritimeContext: 'Pengecualian Aturan D York-Antwerp Rules atas kelalaian kelaiklautan kapal (Unseaworthiness) sebelum berlayar.',
  },
  'm10-g-03': {
    summary: 'Perfect Participle Clause Aktif: Having + Verb 3 (verified) + Object.',
    whyCorrect: '"Having verified High-Voltage breaker isolation..." menyatakan bahwa perwira listrik senior telah selesai memverifikasi isolasi dan pentanahan tegangan tinggi sebelum memberikan izin kerja masuk ruang switchboard.',
    distractors: [
      { option: 'verifying', reason: 'Salah present participle.' },
      { option: 'verify', reason: 'Salah bare infinitive.' },
      { option: 'been verified', reason: 'Salah bentuk pasif karena Chief Electrical Engineer adalah subjek aktif yang melakukan verifikasi.' },
    ],
    ruleOrFormula: 'Perfect Participle Active: Having + Verb 3 (verified) + Object.',
    maritimeContext: 'Prosedur keselamatan kerja kelistrikan tegangan tinggi kapal (High-Voltage Safety & Permit to Work).',
  },
  'm10-g-04': {
    summary: 'Susunan baku kalimat penyerahan Notice of Readiness (NOR).',
    whyCorrect: 'Susunan baku hukum maritim penyerahan NOR: Formal Courtesy Clause (Please be advised that) + Arrival Statement (the vessel has arrived at the customary anchorage) + Conjunction (and) + Readiness Clause (is in all respects ready to load cargo).',
    distractors: [
      { option: 'The vessel has arrived please be advised at the customary anchorage and ready to load cargo is in all respects.', reason: 'Salah susunan struktur kalimat hukum maritim formal.' },
    ],
    ruleOrFormula: 'Standard NOR Tendering Declaration: Please be advised that [Ship] has arrived at [Location] and is in all respects ready to [Action].',
    maritimeContext: 'Deklarasi formal penyerahan Notice of Readiness (NOR) kepada penyewa/agen kapal di pelabuhan muat.',
  },
  'm10-g-05': {
    summary: 'Kolokasi maritim "declared GA for" dan frasa kausal "in response to".',
    whyCorrect: '"declared General Average for the common maritime adventure" (menyatakan kerugian umum demi keselamatan pelayaran bersama) dan "in response to flooding" (sebagai respon terhadap kebocoran kamar mesin).',
    distractors: [
      { option: 'of, on', reason: 'Salah preposisi.' },
      { option: 'to, with', reason: 'Salah preposisi.' },
      { option: 'at, by', reason: 'Salah preposisi.' },
    ],
    ruleOrFormula: 'Maritime Legal Collocation: declared General Average for [noun] in response to [peril].',
    maritimeContext: 'Pernyataan resmi Kerugian Umum (General Average) oleh Nakhoda untuk menyelamatkan kapal dan muatan.',
  },
  'm10-g-06': {
    summary: 'Negative Inversion: Scarcely had + Subject + Verb 3... when + Past Simple.',
    whyCorrect: '"Scarcely had the On-Scene Commander deployed the pattern when the drone located the liferaft" menyatakan dua peristiwa lampau yang terjadi berurutan hampir seketika.',
    distractors: [
      { option: 'did', reason: 'Salah auxiliary karena kata kerja utama berbentuk past participle "deployed".' },
      { option: 'was', reason: 'Salah auxiliary pasif.' },
      { option: 'has', reason: 'Salah present tense.' },
    ],
    ruleOrFormula: 'Negative Inversion: Scarcely had + Subject + Verb 3... when + Past Simple.',
    maritimeContext: 'Koordinasi pola pencarian korban di laut (IAMSAR Parallel Track Search) oleh On-Scene Commander.',
  },
  'm10-g-07': {
    summary: 'Subjunctive Mood Formal: Demanded that + Subject + Base Verb (conduct).',
    whyCorrect: 'Setelah kata kerja tuntutan resmi ("demanded that..."), kata kerja subjek menggunakan bentuk dasar murni "conduct" tanpa akhiran -s.',
    distractors: [
      { option: 'conducted', reason: 'Salah bentuk past tense.' },
      { option: 'conducts', reason: 'Salah bentuk orang ketiga tunggal.' },
      { option: 'is conducting', reason: 'Salah continuous.' },
    ],
    ruleOrFormula: 'Formal ISM Subjunctive: Demanded that + Subject + Base Verb (conduct).',
    maritimeContext: 'Tuntutan audit darurat Sistem Manajemen Keselamatan (SMS) ISM Code oleh Administrasi Negara Bendera.',
  },
  'm10-g-08': {
    summary: 'Noun Complement Clause: on the grounds that + Complete Clause.',
    whyCorrect: '"on the grounds that the emergency generator failed to start" bermakna "atas dasar / dengan alasan bahwa generator darurat gagal menyala otomatis dalam 45 detik".',
    distractors: [
      { option: 'which', reason: 'Salah karena klausa penjelas adalah klausa komplit penjelas alasan, bukan relative pronoun.' },
      { option: 'where', reason: 'Salah relative pronoun tempat.' },
      { option: 'whose', reason: 'Salah kepemilikan.' },
    ],
    ruleOrFormula: 'Noun Complement Clause: on the grounds that + Complete Clause.',
    maritimeContext: 'Dasar hukum penahanan kapal (Detention Order) oleh Port State Control akibat kegagalan generator darurat SOLAS.',
  },
  'm10-g-09': {
    summary: 'Participle Clause menyatakan konsekuensi tak terhindarkan: Main Clause + "," + V-ing (subjecting).',
    whyCorrect: '"subjecting its heavy cargo deck lashings to extreme dynamic stress" menerangkan bahwa keputusan berlayar menerjang badai mengakibatkan ikatan muatan geladak mengalami beban dinamis ekstrem.',
    distractors: [
      { option: 'subjected', reason: 'Salah past participle.' },
      { option: 'subjects', reason: 'Salah finite verb tanpa konjungsi.' },
      { option: 'to subject', reason: 'Kurang tepat untuk menyatakan akibat faktual.' },
    ],
    ruleOrFormula: 'Consequence Participle Clause: Main Clause + "," + V-ing (subjecting).',
    maritimeContext: 'Pemberian beban dinamis ekstrem pada pengikatan muatan geladak kapal di laut bergelombang ganas.',
  },
  'm10-g-10': {
    summary: 'Mandatory Inversion: Under no circumstances + shall + Subject + Base Verb.',
    whyCorrect: 'Keterangan negatif absolut "Under no circumstances" memicu pembalikan modal wajib "shall" mendahului subjek "High-Voltage testing equipment".',
    distractors: [
      { option: 'must it', reason: 'Salah karena kalimat sudah memiliki subjek "High-Voltage testing equipment".' },
      { option: 'did', reason: 'Salah auxiliary past.' },
      { option: 'is to', reason: 'Salah struktur inversi modal.' },
    ],
    ruleOrFormula: 'Mandatory Inversion: Under no circumstances + shall + Subject + Base Verb.',
    maritimeContext: 'Ketentuan mutlak larangan penyambungan alat uji tegangan tinggi sebelum dipastikan tidak bertegangan (Proven Dead).',
  },
  'm10-g-11': {
    summary: 'Negative Restrictive Inversion dengan Past Perfect: Only after + Subject + had reviewed + did + Subject + Verb 1.',
    whyCorrect: '"Only after the salvage arbitrators had reviewed all bunker logbooks did they determine..." menyatakan proses pemeriksaan buku jurnal bahan bakar terjadi lebih dulu di masa lampau sebelum arbiter menetapkan putusan.',
    distractors: [
      { option: 'reviewed', reason: 'Kurang tepat untuk menegaskan kronologi sebelum klausa "did they determine".' },
      { option: 'have reviewed', reason: 'Salah present perfect.' },
      { option: 'were reviewing', reason: 'Salah past continuous.' },
    ],
    ruleOrFormula: 'Negative Inversion: Only after + Subject + had reviewed + did + Subject + Verb 1.',
    maritimeContext: 'Pemeriksaan data konsumsi bahan bakar dan kecepatan kapal dalam arbitrase sengketa charter party.',
  },
  'm10-g-12': {
    summary: 'Preposisi kausalitas: Refused + due to + Noun Phrase.',
    whyCorrect: '"due to the risk of fraudulent delivery" (disebabkan oleh / karena adanya risiko penyerahan barang palsu/penipuan).',
    distractors: [
      { option: 'instead of', reason: 'Salah makna "alih-alih".' },
      { option: 'as for', reason: 'Salah makna "adapun mengenai".' },
      { option: 'regardless of', reason: 'Salah makna "terlepas dari".' },
    ],
    ruleOrFormula: 'Causal Preposition: Refused + due to + Noun Phrase.',
    maritimeContext: 'Penolakan penyerahan muatan tanpa dokumen asli Bill of Lading guna menghindari risiko hukum (Letter of Indemnity Risk).',
  },
  'm10-g-13': {
    summary: 'Konjungsi syarat mutlak: Action + provided that + Conditional Clause.',
    whyCorrect: '"provided that the supplier provided an internationally accredited certification" bermakna "dengan syarat bahwa / asalkan pihak pemasok menyerahkan sertifikasi keberlanjutan yang diakreditasi internasional".',
    distractors: [
      { option: 'so that', reason: 'Salah makna tujuan "agar".' },
      { option: 'whereas', reason: 'Salah makna pertentangan "sedangkan".' },
      { option: 'even though', reason: 'Salah makna konsesi "meskipun".' },
    ],
    ruleOrFormula: 'Stipulation Conjunction: Action + provided that + Conditional Clause.',
    maritimeContext: 'Persyaratan kualitas dan sertifikasi lingkungan pengisian bahan bakar alternatif metanol hijau (Alternative Fuels Bunkering).',
  },
  'm10-g-14': {
    summary: 'Inverted First Conditional Pasif: Should + Subject + be + Verb 3 (be identified).',
    whyCorrect: '"Should a Major Non-Conformity be identified..." adalah bentuk pengandaian tipe 1 formal pasif (Setara dengan: "If a Major Non-Conformity is identified...").',
    distractors: [
      { option: 'is', reason: 'Salah bentuk indikatif present.' },
      { option: 'was', reason: 'Salah bentuk past tense.' },
      { option: 'being', reason: 'Salah participle.' },
    ],
    ruleOrFormula: 'Inverted 1st Conditional Passive: Should + Subject + be + Verb 3.',
    maritimeContext: 'Dampak temuan ketidaksesuaian mayor (Major Non-Conformity) terhadap keabsahan Sertifikat Manajemen Keselamatan (SMC).',
  },
  'm10-g-15': {
    summary: 'Participle Clause: Main Clause + "," + V-ing (rejecting).',
    whyCorrect: '"rejecting the commercial charterers pressure to sail into dangerous weather" menerangkan bahwa saat mengeksekusi wewenang tertingginya, Nakhoda menolak tekanan komersial penyewa kapal demi keselamatan.',
    distractors: [
      { option: 'rejected', reason: 'Salah past tense tanpa konjungsi.' },
      { option: 'rejects', reason: 'Salah present tense.' },
      { option: 'to reject', reason: 'Kurang tepat untuk menyatakan tindakan bersamaan.' },
    ],
    ruleOrFormula: 'Participle Clause: Main Clause + "," + V-ing (rejecting).',
    maritimeContext: 'Wewenang mutlak Nakhoda (Master Overriding Authority) menolak berlayar dalam cuaca buruk sesuai SOLAS Bab V Aturan 34-1.',
  },

  // Vocabulary & Executive Maritime Law, Propulsion & PSC (16-30)
  'm10-v-16': {
    summary: 'Definisi yuridis Kerugian Umum (General Average) menurut York-Antwerp Rules 2016.',
    whyCorrect: 'Kerugian Umum (General Average) adalah setiap pengorbanan atau pengeluaran luar biasa yang secara sengaja dan wajar dilakukan demi keselamatan bersama guna menyelamatkan harta benda dalam pelayaran dari marabahaya nyata.',
    distractors: [
      { option: 'The normal operating fuel costs of an ocean voyage', reason: 'Salah biaya bahan bakar operasional adalah biaya rutin pemilik kapal.' },
      { option: 'Routine maintenance of the vessel engine in drydock', reason: 'Salah perawatan rutin bukan pengorbanan darurat.' },
      { option: 'A minor damage claim covered completely by crew insurance', reason: 'Salah bukan klaim asuransi perorangan kecil.' },
    ],
    maritimeContext: 'Definisi yuridis Kerugian Umum Peraturan York-Antwerp Rules 2016 Aturan A.',
  },
  'm10-v-17': {
    summary: 'Definisi surat izin Sanction-to-Test pada instalasi tegangan tinggi (HV).',
    whyCorrect: 'Sanction-to-Test adalah izin kerja resmi tertulis yang memberikan wewenang untuk memberi tegangan sementara pada sirkuit tegangan tinggi yang diisolasi di bawah pengawasan ketat guna melakukan pengujian diagnostik atau uji tahanan isolasi.',
    distractors: [
      { option: 'A permit to run the galley bread toaster', reason: 'Salah bukan izin pemanggang roti dapur.' },
      { option: 'A certificate allowing crew to change lightbulbs in cabins', reason: 'Salah bukan izin ganti bohlam kabin.' },
      { option: 'A custom clearance document for spare electrical parts', reason: 'Salah bukan dokumen bea cukai suku cadang.' },
    ],
    maritimeContext: 'Manajemen izin kerja keselamatan tegangan tinggi kapal (High-Voltage Safety Management STCW A-III/2).',
  },
  'm10-v-18': {
    summary: 'Definisi Pola Pencarian Persegi Membesar (Expanding Square Search Pattern) IAMSAR.',
    whyCorrect: 'Pola Persegi Membesar (Expanding Square) adalah pola pencarian SAR yang dimulai tepat di titik perkiraan awal (datum) dan mengembang keluar membentuk kotak konsentris dengan belokan 90 derajat, sangat efektif jika koordinat target diketahui dengan akurasi tinggi di area sempit.',
    distractors: [
      { option: 'A search flown by passenger aircraft in zig-zags', reason: 'Salah bukan manuver pesawat penumpang zig-zag.' },
      { option: 'A circular anchor dragging technique', reason: 'Salah bukan teknik garuk jangkar.' },
      { option: 'A towing maneuver executed by three tugboats', reason: 'Salah bukan manuver tunda tiga kapal.' },
    ],
    maritimeContext: 'Pola pencarian marabahaya manual IAMSAR Volume III (Search Patterns).',
  },
  'm10-v-19': {
    summary: 'Definisi Ketidaksesuaian Mayor (Major Non-Conformity) di bawah ISM Code.',
    whyCorrect: 'Ketidaksesuaian Mayor (Major Non-Conformity) adalah penyimpangan nyata yang menimbulkan ancaman serius terhadap keselamatan jiwa, kapal, atau lingkungan laut serta memerlukan tindakan perbaikan pencegahan seketika.',
    distractors: [
      { option: 'A missing pen in the ship office', reason: 'Salah bukan pulpen hilang di kantor.' },
      { option: 'A dirty teacup left in the crew messroom', reason: 'Salah bukan cangkir kotor di messroom.' },
      { option: 'An unpainted handrail on the forecastle', reason: 'Salah bukan sekadar cat pegangan tangan terkelupas.' },
    ],
    maritimeContext: 'Klasifikasi temuan audit kelaiklautan ISM Code IMO.',
  },
  'm10-v-20': {
    summary: 'Definisi Letter of Indemnity (LOI) dalam hukum komersial maritim.',
    whyCorrect: 'Letter of Indemnity (LOI) adalah surat pernyataan ganti rugi kontraktual dari pihak penyewa/pengirim untuk membebaskan pemilik kapal dari segala tuntutan kerugian finansial akibat membongkar muatan tanpa penyerahan konosemen asli (Original B/L).',
    distractors: [
      { option: 'A thank-you letter sent to port authorities after departure', reason: 'Salah bukan surat ucapan terima kasih pelabuhan.' },
      { option: 'A birth certificate issued to children born at sea', reason: 'Salah bukan akta kelahiran anak lahir di laut.' },
      { option: 'A receipt for ship provisions purchased in foreign currency', reason: 'Salah bukan kuitansi bahan makanan.' },
    ],
    maritimeContext: 'Hukum pengangkutan laut dan risiko komersial penyerahan muatan tanpa dokumen asli.',
  },
  'm10-v-21': {
    summary: 'Definisi sel bahan bakar membran penukar proton (PEMFC) pada propulsi maritim.',
    whyCorrect: 'PEMFC adalah sel elektrokimia yang mengubah energi kimia hidrogen langsung menjadi listrik dengan produk sampingan murni hanya berupa uap air dan panas, mewujudkan propulsi kapal bebas emisi.',
    distractors: [
      { option: 'A traditional coal-burning marine steam boiler', reason: 'Salah bukan ketel uap batubara lama.' },
      { option: 'A heavy fuel oil purification centrifuge', reason: 'Salah bukan sentrifugal pemurni MFO.' },
      { option: 'A hydraulic steering gear pump', reason: 'Salah bukan pompa hidrolik kemudi.' },
    ],
    maritimeContext: 'Teknologi dekarbonisasi propulsi hidrogen ramah lingkungan (Hydrogen Fuel Cell Zero-Emission Marine Propulsion).',
  },
  'm10-v-22': {
    summary: 'Definisi Concentrated Inspection Campaign (CIC) pada rezim Port State Control.',
    whyCorrect: 'CIC adalah kampanye inspeksi terfokus intensif selama 3 bulan yang diselenggarakan serentak oleh rezim PSC (Paris MoU, Tokyo MoU) pada bidang keselamatan atau lingkungan maritim kritis tertentu.',
    distractors: [
      { option: 'A celebration dinner for port pilots', reason: 'Salah bukan makan malam perayaan pandu.' },
      { option: 'A mandatory physical fitness exam for shore dockworkers', reason: 'Salah bukan tes kebugaran buruh pelabuhan.' },
      { option: 'A tariff negotiation meeting between shipping lines', reason: 'Salah bukan rapat tarif uang tambang.' },
    ],
    maritimeContext: 'Pemeriksaan kelaiklautan kapal terfokus Port State Control (PSC CIC Campaigns).',
  },
  'm10-v-23': {
    summary: 'Peran dan fungsi On-Scene Commander (OSC) menurut IAMSAR Volume III.',
    whyCorrect: 'On-Scene Commander (OSC) adalah perwira/nakhoda yang ditunjuk oleh pusat koordinasi SAR (JRCC) untuk memimpin dan mengoordinasikan seluruh unit penyelamat laut dan udara di lokasi pencarian.',
    distractors: [
      { option: 'The director of customs at the arrival port', reason: 'Salah bukan direktur bea cukai pelabuhan.' },
      { option: 'The insurance adjuster investigating cargo damage', reason: 'Salah bukan penilai klaim asuransi.' },
      { option: 'The chief engineer in charge of boiler cleaning', reason: 'Salah bukan KKM yang membersihkan ketel.' },
    ],
    maritimeContext: 'Kepemimpinan komando operasi SAR di lokasi musibah maritim IAMSAR Manual.',
  },
  'm10-v-24': {
    summary: 'Pengecualian tanggung jawab pengangkut di bawah Hague-Visby Rules Pasal IV Ayat 2.',
    whyCorrect: 'Klausula pengecualian tanggung jawab pengangkut: Kesalahan, kelalaian, atau kekhilafan nakhoda, pelaut, pandu, atau awak kapal dalam bernavigasi atau mengolah gerak kapal (Nautical Fault Exception).',
    distractors: [
      { option: 'Failure to maintain refrigeration temperatures due to negligence', reason: 'Salah kelalaian merawat suhu pendingin muatan adalah tanggung jawab pengangkut penuh.' },
      { option: 'Willful theft of cargo by the ship officers', reason: 'Salah pencurian muatan oleh perwira adalah tindak pidana murni.' },
      { option: 'Improper cargo stowage caused by ship crew negligence', reason: 'Salah kelalaian pemuatan bukan pengecualian kelaikan.' },
    ],
    maritimeContext: 'Hukum pengangkutan niaga internasional Konvensi Hague-Visby Rules.',
  },
  'm10-v-25': {
    summary: 'Definisi Reaktor Modular Kecil (Small Modular Reactor / SMR) maritim.',
    whyCorrect: 'SMR adalah reaktor fisi nuklir modular kompak buatan pabrik berdaya tinggi dengan sistem keselamatan pasif yang mampu menyuplai tenaga propulsi tanpa emisi karbon secara terus-menerus tanpa isi ulang bahan bakar selama puluhan tahun.',
    distractors: [
      { option: 'A chemical battery used in bridge flashlights', reason: 'Salah bukan baterai senter anjungan.' },
      { option: 'A small diesel generator used for lifeboat battery charging', reason: 'Salah bukan genset darurat sekoci.' },
      { option: 'An electronic sensor measuring exhaust smoke opacity', reason: 'Salah bukan sensor kepekatan asap cerobong.' },
    ],
    maritimeContext: 'Teknologi reaktor nuklir generasi baru untuk dekarbonisasi armada kapal niaga maritim.',
  },
  'm10-v-26': {
    summary: 'Fungsi perangkat Earthing Truck pada pemeliharaan instalasi listrik tegangan tinggi.',
    whyCorrect: 'Earthing Truck adalah perangkat kereta dorong khusus yang dimasukkan ke dalam bilik pemutus sirkuit HV untuk menghubungkan rel busbar atau kabel keluar langsung ke massa lambung kapal (ground) sebelum teknisi memulai perbaikan.',
    distractors: [
      { option: 'A vehicle transporting fresh vegetables to the ship', reason: 'Salah bukan mobil pengangkut sayur pelabuhan.' },
      { option: 'A forklift carrying electrical spare motors on the dock', reason: 'Salah bukan forklift pengangkut motor listrik.' },
      { option: 'A fire truck stationed at the terminal gates', reason: 'Salah bukan mobil pemadam terminal.' },
    ],
    maritimeContext: 'Peralatan keselamatan isolasi pentanahan instalasi listrik tegangan tinggi kapal.',
  },
  'm10-v-27': {
    summary: 'Definisi Klaim Kecepatan dan Konsumsi Bahan Bakar (Speed and Consumption Claim).',
    whyCorrect: 'Klaim Kecepatan dan Konsumsi Bahan Bakar adalah klaim komersial yang diajukan penyewa kapal jika kapal gagal mencapai kecepatan yang dijaminkan dalam kontrak pada kondisi cuaca baik atau mengonsumsi bahan bakar melebihi batas toleransi garansi.',
    distractors: [
      { option: 'A claim for speed limits exceeded inside harbor canals', reason: 'Salah bukan denda melebihi batas kecepatan alur kanal.' },
      { option: 'A bonus paid to the galley cooks for fast dinner service', reason: 'Salah bukan bonus koki kapal.' },
      { option: 'A tax levied on high-speed passenger hydrofoils', reason: 'Salah bukan pajak kapal cepat hydrofoil.' },
    ],
    maritimeContext: 'Sengketa komersial sewa kapal waktu (Time Charter Party Performance Disputes).',
  },
  'm10-v-28': {
    summary: 'Definisi Document of Compliance (DOC) di bawah ISM Code.',
    whyCorrect: 'Document of Compliance (DOC) adalah sertifikat statutori yang diterbitkan untuk perusahaan pelayaran yang membuktikan bahwa sistem manajemen keselamatan di darat telah memenuhi seluruh persyaratan ISM Code untuk tipe kapal terkait.',
    distractors: [
      { option: 'A medical certificate issued to the ship doctor', reason: 'Salah bukan sertifikat kesehatan dokter kapal.' },
      { option: 'A customs receipt for foreign port dues', reason: 'Salah bukan kuitansi bea cukai pelabuhan.' },
      { option: 'A receipt for passenger ticket sales', reason: 'Salah bukan kuitansi tiket penumpang.' },
    ],
    maritimeContext: 'Sertifikasi kelaiklautan manajemen perusahaan pelayaran ISM Code.',
  },
  'm10-v-29': {
    summary: 'Peran Designated Person Ashore (DPA) dalam komando krisis maritim ISM Code.',
    whyCorrect: 'DPA adalah pejabat kunci perusahaan di darat yang memiliki akses langsung ke direksi tertinggi, berfungsi sebagai penghubung langsung antara kapal dan manajemen puncak guna memantau aspek keselamatan dan pencegahan pencemaran.',
    distractors: [
      { option: 'A travel agent arranging flight tickets for crew changes', reason: 'Salah bukan agen travel tiket pesawat kru.' },
      { option: 'A terminal crane operator loading container boxes', reason: 'Salah bukan operator derek kontainer.' },
      { option: 'A lawyer defending stowaways caught in lifeboats', reason: 'Salah bukan pengacara penumpang gelap.' },
    ],
    maritimeContext: 'Peran statutori DPA dalam organisasi keselamatan maritim ISM Code Klausula 4.',
  },
  'm10-v-30': {
    summary: 'Definisi Sertifikat Daya Tarik Statis (Bollard Pull Certification).',
    whyCorrect: 'Sertifikat Bollard Pull adalah dokumen resmi uji tarik biro klasifikasi yang mengesahkan kapasitas gaya tarik statis maksimal terus-menerus (dalam metrik ton) yang mampu dihasilkan kapal tunda terhadap tonggak tambat uji di darat.',
    distractors: [
      { option: 'A certificate approving mooring ropes on cruise ships', reason: 'Salah bukan sertifikat tali tambat kapal pesiar.' },
      { option: 'A license to operate heavy harbor winches', reason: 'Salah bukan lisensi derek pelabuhan.' },
      { option: 'A tax exemption certificate for harbor pilots', reason: 'Salah bukan surat bebas pajak pandu.' },
    ],
    maritimeContext: 'Sertifikasi daya tarik statis kapal tunda penyelamat dan penunda samudra.',
  },

  // Calculations & Executive Math (31-40)
  'm10-t-31': {
    summary: 'Kalkulasi penyesuaian Kerugian Umum: Kerugian $2M pada total ventura $50M (Kapal $30M, Muatan $18M, Tambang $2M).',
    whyCorrect: 'Faktor Kontribusi GA = $2.000.000 ÷ $50.000.000 = 0,04 (4,0%). Kontribusi Muatan = 4,0% × $18.000.000 = $720.000.',
    distractors: [
      { option: 'Factor = 5.0% ($0.05), Cargo Contributes $900,000', reason: 'Salah hitung pembagian ventura total.' },
      { option: 'Factor = 3.5% ($0.035), Cargo Contributes $630,000', reason: 'Salah hitung persentase.' },
      { option: 'Factor = 2.0% ($0.02), Cargo Contributes $360,000', reason: 'Salah hitung persentase.' },
    ],
    ruleOrFormula: 'GA Factor = Total Loss / Total Venture = $2M / $50M = 4.0%. Cargo Contribution = $18M × 0.04 = $720,000.',
    maritimeContext: 'Kalkulasi pembagian kontribusi kerugian umum (General Average Adjustment Calculation).',
  },
  'm10-t-32': {
    summary: 'Kalkulasi daya listrik aktif motor propulsi 6,6 kV 3 fasa: P = √3 × V × I × cosφ (6.600 V, 450 A, cosφ 0,88).',
    whyCorrect: 'P = 1,732 × 6.600 V × 450 A × 0,88 = 4.523.937,6 Watt ≈ 4,52 Megawatt (MW).',
    distractors: [
      { option: '5.14 MW', reason: 'Salah hitung tanpa mengalikan faktor daya cosφ.' },
      { option: '3.88 MW', reason: 'Salah hitung perkalian tegangan.' },
      { option: '6.20 MW', reason: 'Salah hitung perkalian arus.' },
    ],
    ruleOrFormula: 'Active Power P = √3 × V × I × cosφ = 1.732 × 6600 × 450 × 0.88 = 4,523,937 W ≈ 4.52 MW.',
    maritimeContext: 'Kalkulasi daya listrik motor propulsi tegangan tinggi kamar mesin kapal.',
  },
  'm10-t-33': {
    summary: 'Kalkulasi laju cakupan area pencarian IAMSAR: C = N × V × S (3 kapal, 15 knot, spasi jalur 2,0 mil).',
    whyCorrect: 'Laju Cakupan Area = 3 kapal × 15 knot × 2,0 mil laut = 90,0 mil laut persegi per jam (nm²/jam).',
    distractors: [
      { option: '75.0 nm²/hr', reason: 'Salah hitung perkalian.' },
      { option: '60.0 nm²/hr', reason: 'Salah hitung perkalian.' },
      { option: '105.0 nm²/hr', reason: 'Salah hitung perkalian.' },
    ],
    ruleOrFormula: 'Coverage Rate C = N × V × S = 3 × 15 × 2.0 = 90.0 nm²/hr.',
    maritimeContext: 'Kalkulasi laju sapuan pencarian pola paralel IAMSAR Manual Volume III.',
  },
  'm10-t-34': {
    summary: 'Evaluasi kinerja sewa kapal: 2.040 mil dalam 120 jam, 225 ton VLSFO dalam 5 hari (garansi 18 knot / 42 ton/hari).',
    whyCorrect: 'Kecepatan Aktual = 2.040 mil ÷ 120 jam = 17,0 knot (defisit 1,0 knot di bawah garansi 18 knot). Konsumsi Harian = 225,0 ton ÷ 5 hari = 45,0 ton/hari (boros 3,0 ton/hari di atas garansi 42 ton).',
    distractors: [
      { option: 'Speed = 18.5 knots, Consumption = 40.0 t/day', reason: 'Salah hitung pembagian.' },
      { option: 'Speed = 16.5 knots, Consumption = 42.0 t/day', reason: 'Salah hitung pembagian.' },
      { option: 'Speed = 17.5 knots, Consumption = 48.0 t/day', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Actual Speed = 2040 / 120 = 17.0 kn; Daily Consumption = 225 / 5 = 45.0 t/day.',
    maritimeContext: 'Kalkulasi evaluasi kinerja klaim kecepatan dan bahan bakar sewa kapal (Charter Party Speed Claim).',
  },
  'm10-t-35': {
    summary: 'Evaluasi hasil megger isolasi motor propulsi HV 6,6 kV (terukur 45 MΩ vs batas statutori 6,6 MΩ).',
    whyCorrect: 'Ya, sangat memenuhi syarat karena nilai isolasi 45 MΩ hampir 7 kali lipat melampaui batas minimal statutori 6,6 MΩ.',
    distractors: [
      { option: 'No, minimum insulation must be at least 100 MΩ', reason: 'Salah batas minimal aturan kelas adalah 1 kΩ/V (6,6 MΩ).' },
      { option: 'No, Megger testing at 5,000V is illegal', reason: 'Salah pengujian Megger 5 kV adalah prosedur standar pada instalasi 6,6 kV.' },
      { option: 'Yes, but only if tested when underwater', reason: 'Salah pengujian motor di bawah air merusak peralatan.' },
    ],
    ruleOrFormula: 'Insulation Evaluation: 45 MΩ > 6.6 MΩ minimum requirement.',
    maritimeContext: 'Pengujian tahanan isolasi switchboard tegangan tinggi kapal (High-Voltage Megger Testing).',
  },
  'm10-t-36': {
    summary: 'Kalkulasi durasi pencarian sektor IAMSAR: 54,0 mil laut pada kecepatan 12 knot.',
    whyCorrect: 'Waktu pencarian = Total Jarak ÷ Kecepatan = 54,0 mil laut ÷ 12 knot = 4,5 jam.',
    distractors: [
      { option: '3.5 hours', reason: 'Salah hitung pembagian.' },
      { option: '5.0 hours', reason: 'Salah hitung pembagian.' },
      { option: '6.0 hours', reason: 'Salah hitung pembagian.' },
    ],
    ruleOrFormula: 'Time = Distance / Speed = 54.0 / 12 = 4.5 Hours.',
    maritimeContext: 'Kalkulasi durasi pencarian sektor pola pencarian korban musibah laut IAMSAR.',
  },
  'm10-t-37': {
    summary: 'Kalkulasi konsumsi hidrogen propulsi 2.400 kW selama 10 jam transit pada laju 60 g H2/kWh.',
    whyCorrect: 'Total Energi = 2.400 kW × 10 jam = 24.000 kWh. Konsumsi Hidrogen = 24.000 kWh × 60 g/kWh = 1.440.000 gram = 1.440,0 kg.',
    distractors: [
      { option: '1,200.0 kg', reason: 'Salah hitung perkalian energi.' },
      { option: '1,800.0 kg', reason: 'Salah hitung perkalian energi.' },
      { option: '960.0 kg', reason: 'Salah hitung perkalian energi.' },
    ],
    ruleOrFormula: 'H2 Mass = Power × Time × Specific Rate = 2400 × 10 × 60 g = 1,440.0 kg.',
    maritimeContext: 'Kalkulasi konsumsi bahan bakar hidrogen cair pada sistem propulsi sel bahan bakar kapal.',
  },
  'm10-t-38': {
    summary: 'Kalkulasi margin tekanan pompa pemadam kebakaran darurat (terukur 3,4 bar vs batas statutori 2,7 bar).',
    whyCorrect: 'Margin tekanan aman di atas batas statutori = 3,4 bar - 2,7 bar = 0,7 bar.',
    distractors: [
      { option: '0.5 bar above statutory minimum', reason: 'Salah hitung pengurangan.' },
      { option: '1.0 bar above statutory minimum', reason: 'Salah hitung pengurangan.' },
      { option: '0.2 bar above statutory minimum', reason: 'Salah hitung pengurangan.' },
    ],
    ruleOrFormula: 'Pressure Margin = Measured Pressure - Statutory Minimum = 3.4 - 2.7 = 0.7 bar.',
    maritimeContext: 'Pengujian tekanan hidran pompa pemadam kebakaran darurat SOLAS Bab II-2.',
  },
  'm10-t-39': {
    summary: 'Kalkulasi putusan imbalan salvage LOF 8,5% dari total dana terselamatkan $40.000.000.',
    whyCorrect: 'Nilai imbalan penyelamatan = $40.000.000 × 0,085 = $3.400.000.',
    distractors: [
      { option: '$3,200,000', reason: 'Salah hitung persentase imbalan.' },
      { option: '$3,800,000', reason: 'Salah hitung persentase imbalan.' },
      { option: '$4,000,000', reason: 'Salah hitung persentase imbalan.' },
    ],
    ruleOrFormula: 'Salvage Award = Salved Fund × Percentage = $40M × 8.5% = $3,400,000.',
    maritimeContext: 'Kalkulasi imbalan imbal jasa penyelamatan maritim kontrak LOF Konvensi Salvage Internasional.',
  },
  'm10-t-40': {
    summary: 'Batas waktu statutori penyelesaian perbaikan ketidaksesuaian mayor ISM yang diturunkan statusnya.',
    whyCorrect: 'Pedoman ISM IMO menetapkan bahwa ketidaksesuaian mayor yang diturunkan statusnya wajib diselesaikan dan ditutup perbaikannya paling lambat dalam waktu 3 bulan (dengan tindakan awal segera dalam 30 hari).',
    distractors: [
      { option: '12 months', reason: 'Salah 12 bulan terlalu lama dan membatalkan sertifikat SMC.' },
      { option: '24 hours', reason: 'Salah 24 jam adalah waktu untuk pelaporan awal ke DPA.' },
      { option: '6 months', reason: 'Salah batas maksimal statutori adalah 3 bulan.' },
    ],
    ruleOrFormula: 'ISM Closeout Timeline: Maximum 3 months for downgraded Major Non-Conformity.',
    maritimeContext: 'Batas waktu statutori penyelesaian tindakan perbaikan audit kelaiklautan ISM Code.',
  },

  // Reading Comprehension & Executive Case Studies (41-50)
  'm10-r-41': {
    summary: 'Faktor yang menggugurkan hak pemilik kapal menuntut kontribusi Kerugian Umum (Rule D).',
    whyCorrect: 'Kelalaian pemilik kapal dalam memastikan kelaiklautan kapal (Due Diligence for Seaworthiness) sebelum berlayar menggugurkan hak pemilik kapal untuk menuntut kontribusi Kerugian Umum dari pemilik muatan.',
    distractors: [
      { option: 'Refusing to pay crew overtime wages in cash', reason: 'Salah bukan sengketa uang lembur kru.' },
      { option: 'Changing the voyage destination without informing customs', reason: 'Salah bukan masalah bea cukai tujuan.' },
      { option: 'Purchasing low-grade lube oil at a discount port', reason: 'Salah bukan sekadar pembelian minyak pelumas murah.' },
    ],
    maritimeContext: 'Dampak hukum ketidaklaiklautan kapal terhadap klaim Kerugian Umum York-Antwerp Rules.',
  },
  'm10-r-42': {
    summary: 'Tiga langkah wajib sebelum memulai pekerjaan pemeliharaan kelistrikan tegangan tinggi (HV).',
    whyCorrect: 'Tiga langkah wajib sebelum perbaikan tegangan tinggi adalah mengisolasi sumber listrik, membuktikan nihil tegangan (proving dead) dengan alat uji bersertifikat, dan mentanahkan sirkuit secara solid.',
    distractors: [
      { option: 'Wiping the switchboard with a wet cloth, resetting breakers, and calling the pilot', reason: 'SANGAT FATAL! Mengelap switchboard tegangan tinggi dengan kain basah memicu ledakan arc flash maut.' },
      { option: 'Increasing generator frequency, closing breakers, and turning off air conditioning', reason: 'Salah bukan menaikkan frekuensi generator.' },
      { option: 'Wearing rubber boots and touching copper busbars with insulated screwdrivers', reason: 'SANGAT BERBAHAYA! Menyentuh busbar HV dengan obeng memicu sengatan mematikan.' },
    ],
    maritimeContext: 'SOP baku keselamatan kelistrikan tegangan tinggi STCW Bab III/2.',
  },
  'm10-r-43': {
    summary: 'Tugas pokok Nakhoda yang ditunjuk sebagai On-Scene Commander (OSC) menurut IAMSAR.',
    whyCorrect: 'Tugas utama On-Scene Commander adalah menetapkan frekuensi radio kerja SAR, membagikan sektor dan pola pencarian kepada kapal yang berpartisipasi, serta mengirimkan laporan situasi (SITREP) berkala ke JRCC.',
    distractors: [
      { option: 'Ordering all other ships to leave the area immediately', reason: 'Salah OSC justru mengoordinasikan seluruh kapal untuk membantu.' },
      { option: 'Returning to port to pick up more lifejackets', reason: 'Salah OSC wajib tetap berada di lokasi musibah.' },
      { option: 'Charging salvage fees to the rescue coordination centre', reason: 'Salah operasi penyelamatan jiwa (SOLAS V) bebas biaya.' },
    ],
    maritimeContext: 'Tanggung jawab komando koordinator lapangan pencarian maritim IAMSAR.',
  },
  'm10-r-44': {
    summary: 'Hak fundamental yang dijamin ISM Code Klausula 5.2 kepada Nakhoda.',
    whyCorrect: 'Hak mutlak yang dijamin ISM Code kepada Nakhoda adalah wewenang penuh yang mengesampingkan kepentingan komersial demi keselamatan jiwa dan pencegahan pencemaran lingkungan laut.',
    distractors: [
      { option: 'The right to sell the ship to the highest bidder in foreign ports', reason: 'Salah Nakhoda tidak berhak menjual kapal pemilik.' },
      { option: 'The right to ignore all classification society rules', reason: 'Salah aturan biro klasifikasi wajib dipatuhi.' },
      { option: 'Exemption from paying port pilotage dues', reason: 'Salah uang pandu tetap wajib dibayar sesuai aturan pelabuhan.' },
    ],
    maritimeContext: 'Perlindungan statutori wewenang tertinggi Nakhoda ISM Code Klausula 5.2.',
  },
  'm10-r-45': {
    summary: 'Kekurangan statutori yang memicu penahanan kapal seketika oleh Port State Control (CIC).',
    whyCorrect: 'Penyimpangan serius seperti membypass alarm 15 ppm OWS pemisah minyak atau tidak berfungsinya sistem darurat (pompa pemadam/generator darurat) adalah temuan penahanan langsung (detainable deficiency).',
    distractors: [
      { option: 'A minor scratch on the ship hull paint above the waterline', reason: 'Salah goresan cat bukan temuan penahanan.' },
      { option: 'Having outdated non-mandatory magazines in the crew library', reason: 'Salah majalah lama bukan kekurangan statutori.' },
      { option: 'Serving dinner 15 minutes later than scheduled', reason: 'Salah jam makan malam bukan ranah inspeksi PSC.' },
    ],
    maritimeContext: 'Kriteria temuan penahanan kapal oleh inspektur kelaiklautan Port State Control (PSC Detention).',
  },
  'm10-r-46': {
    summary: 'Definisi kondisi cuaca baik dalam klausula garansi sewa kapal (BIMCO).',
    whyCorrect: 'Definisi cuaca baik dalam garansi sewa kapal adalah kecepatan angin maksimal Skala Beaufort 4 dan tinggi gelombang laut maksimal Skala Douglas 3 tanpa adanya arus berlawanan arah.',
    distractors: [
      { option: 'Completely flat calm seas with zero wind and clear sunny skies only', reason: 'Salah laut tenang tanpa angin sama sekali bukan standar realistis BIMCO.' },
      { option: 'Any weather condition where the ship engines do not overheat', reason: 'Salah suhu mesin bukan definisi cuaca.' },
      { option: 'Wind speeds up to Beaufort Force 8 gale force', reason: 'Salah badai Beaufort 8 adalah cuaca buruk ekstrem.' },
    ],
    maritimeContext: 'Ketentuan standar cuaca klausa garansi sewa kapal BIMCO Good Weather Criteria.',
  },
  'm10-r-47': {
    summary: 'Mekanisme pendinginan Reaktor Modular Kecil (SMR) maritim saat kondisi mati listrik total (blackout).',
    whyCorrect: 'Reaktor nuklir modular maritim didesain dengan sistem pendinginan pasif konveksi alami yang mampu membuang panas peluruhan tanpa membutuhkan tenaga listrik maupun intervensi operator saat mati listrik total (blackout).',
    distractors: [
      { option: 'By pumping sea water directly into the radioactive fuel rods', reason: 'SANGAT BERBAHAYA! Memompa air laut langsung ke bahan bakar merusak struktur reaktor.' },
      { option: 'By ejecting the reactor into the ocean instantly', reason: 'Salah reaktor tidak dibuang ke laut.' },
      { option: 'Using diesel emergency generators connected to external battery banks', reason: 'Salah sistem keselamatan SMR murni bersifat pasif tanpa ketergantungan daya listrik.' },
    ],
    maritimeContext: 'Sistem keselamatan pasif reaktor nuklir maritim berdaya tahan tinggi.',
  },
  'm10-r-48': {
    summary: 'Risiko kritis penyerahan muatan berdasarkan Letter of Indemnity (LOI) tanpa konosemen asli.',
    whyCorrect: 'Menyerahkan muatan tanpa dokumen asli Bill of Lading hanya berdasarkan LOI menggugurkan perlindungan asuransi P&I Club kapal, sehingga pemilik kapal menanggung sendiri risiko tuntutan ganti rugi finansial secara penuh.',
    distractors: [
      { option: 'Immediate revocation of the Master license by the IMO', reason: 'Salah IMO tidak mencabut ijazah secara langsung.' },
      { option: 'Confiscation of the vessel by port customs authorities', reason: 'Salah bukan penyitaan oleh bea cukai.' },
      { option: 'Mandatory criminal arrest of all crew members', reason: 'Salah bukan penangkapan pidana otomatis seluruh kru.' },
    ],
    maritimeContext: 'Risiko hukum pembatalan perlindungan asuransi P&I Club pada praktik penyerahan muatan via LOI.',
  },
  'm10-r-49': {
    summary: 'Pihak yang berwenang memberikan pernyataan pers resmi saat terjadi insiden maritim darurat.',
    whyCorrect: 'Hanya pejabat humas resmi perusahaan yang ditunjuk atau juru bicara Tim Tanggap Darurat darat yang berwenang memberikan pernyataan resmi kepada media massa guna mencegah spekulasi yang menyesatkan.',
    distractors: [
      { option: 'Any crew member with an active social media account', reason: 'SANGAT DILARANG! Kru dilarang mengunggah informasi insiden ke media sosial.' },
      { option: 'The ship cook and steward department', reason: 'Salah koki kapal bukan juru bicara krisis.' },
      { option: 'Local news journalists boarding the vessel', reason: 'Salah wartawan bukan perwakilan resmi perusahaan.' },
    ],
    maritimeContext: 'Protokol komunikasi krisis dan humas penanganan insiden maritim darurat.',
  },
  'm10-r-50': {
    summary: 'Pemeriksaan yang diwajibkan untuk kabel pentanahan portabel tegangan tinggi.',
    whyCorrect: 'Kabel pentanahan portabel tegangan tinggi wajib diperiksa fisik serabut tembaganya dari kerusakan/keausan dan dikalibrasi titik ujinya sebelum dipasang ke rel busbar.',
    distractors: [
      { option: 'Painting earthing leads with yellow marine varnish', reason: 'Salah mengecat kabel pentanahan merusak konduktivitas listrik.' },
      { option: 'Washing leads in diesel fuel to remove grease', reason: 'SANGAT BERBAHAYA! Mencuci kabel di solar merusak isolasi dan memicu bahaya api.' },
      { option: 'Storing earthing leads in hot engine exhaust uptakes', reason: 'Salah menyimpan kabel di cerobong panas merusak kabel.' },
    ],
    maritimeContext: 'Standar inspeksi kelayakan peralatan isolasi keselamatan listrik tegangan tinggi.',
  },

  // Listening & Executive Crisis / OSC VHF (51-60)
  'm10-l-51': {
    summary: 'Penetapan resmi kapal MV Atlantic Leader sebagai On-Scene Commander oleh JRCC Halifax.',
    whyCorrect: 'JRCC mengumumkan penetapan kapal MV Atlantic Leader sebagai On-Scene Commander (OSC) pada saluran radio kerja VHF 67 untuk mengoordinasikan seluruh kapal penyelamat di area musibah.',
    distractors: [
      { option: 'MV Atlantic Leader ordered to abandon search and proceed to port', reason: 'Salah kapal justru ditunjuk memimpin pencarian.' },
      { option: 'All rescue operations suspended due to heavy fog', reason: 'Salah operasi pencarian tetap berjalan penuh.' },
      { option: 'JRCC taking direct tactical control of lifeboats', reason: 'Salah kendali taktis di lapangan didelegasikan ke OSC.' },
    ],
    maritimeContext: 'Siaran penunjukan resmi komando operasi SAR di lokasi kecelakaan laut.',
  },
  'm10-l-52': {
    summary: 'Konfirmasi protokol keselamatan pemutusan dan pentanahan tegangan tinggi 6,6 kV bow thruster.',
    whyCorrect: 'Perwira listrik senior mengonfirmasi bahwa pemutus sirkuit bow thruster telah ditarik keluar (racked out), rel busbar ditanahkan dengan earthing truck, terbukti 0 Volt, dan Permit to Work HV-042 telah resmi disahkan.',
    distractors: [
      { option: 'Power remains live on bow thruster motor during work', reason: 'SANGAT FATAL! Bekerja pada motor bertegangan memicu sengatan maut.' },
      { option: 'Electrical system suffered complete transformer explosion', reason: 'Salah sistem listrik dalam kondisi aman dan terisolasi.' },
      { option: 'Chief Engineer cancelled all maintenance permits', reason: 'Salah izin kerja justru telah resmi disahkan.' },
    ],
    maritimeContext: 'Pengesahan izin kerja tegangan tinggi dan verifikasi keselamatan nol volt.',
  },
  'm10-l-53': {
    summary: 'Pernyataan resmi Kerugian Umum dan penetapan pelabuhan perlindungan oleh Nakhoda.',
    whyCorrect: 'Akibat patahnya poros kemudi dalam badai dahsyat, Nakhoda secara resmi mendeklarasikan Kerugian Umum (General Average) demi keselamatan kapal dan muatan serta berlayar tunda menuju Brest sebagai pelabuhan perlindungan.',
    distractors: [
      { option: 'Abandoning ship immediately in open ocean', reason: 'Salah kapal tidak ditinggalkan.' },
      { option: 'Declaring the vessel a total loss and cancelling insurance', reason: 'Salah kapal berlayar tunda menuju pelabuhan perlindungan.' },
      { option: 'Selling cargo directly to the towing tugboat', reason: 'Salah muatan tidak dijual ke kapal tunda.' },
    ],
    maritimeContext: 'Pernyataan Kerugian Umum dan penetapan pelabuhan perlindungan darurat (Port of Refuge).',
  },
  'm10-l-54': {
    summary: 'Hasil penutupan inspeksi kampanye keselamatan kebakaran PSC (Form A bersih).',
    whyCorrect: 'Inspektur senior PSC mengonfirmasi bahwa seluruh sistem pemadam kebakaran darurat lulus uji dengan tekanan 3,5 bar, nol kekurangan statutori tercatat, dan Sertifikat Form A bersih telah diserahkan.',
    distractors: [
      { option: 'Ship detained due to failed fire pump', reason: 'Salah pompa pemadam kebakaran bekerja sangat prima.' },
      { option: 'CO2 system condemned and crew fined', reason: 'Salah sistem CO2 lulus uji 100%.' },
      { option: 'PSC inspection abandoned due to bad weather', reason: 'Salah inspeksi selesai secara lengkap.' },
    ],
    maritimeContext: 'Penutupan hasil audit kelaiklautan inspeksi kampanye PSC dengan hasil sempurna.',
  },
  'm10-l-55': {
    summary: 'Pelaksanaan wewenang tertinggi Nakhoda (SOLAS V/34-1) menolak berlayar menerjang badai taifun.',
    whyCorrect: 'Nakhoda menolak perintah komersial untuk berlayar menerjang taifun Kategori 4 dan menggunakan wewenang tertingginya berdasarkan SOLAS Bab V Aturan 34-1 demi melindungi keselamatan jiwa dan kapal.',
    distractors: [
      { option: 'Agreeing to steam directly through the eye of the hurricane to save time', reason: 'SANGAT FATAL! Menerobos mata badai menenggelamkan kapal.' },
      { option: 'Resigning as Master immediately', reason: 'Salah Nakhoda tetap memimpin kapal dengan aman di dermaga.' },
      { option: 'Transferring command to the charterers operations desk', reason: 'Salah wewenang komando keselamatan mutlak di tangan Nakhoda.' },
    ],
    maritimeContext: 'Pelaksanaan wewenang mutlak Nakhoda mengabaikan instruksi penyewa kapal demi keselamatan.',
  },
  'm10-l-56': {
    summary: 'Konfirmasi kesiapan pengisian bahan bakar hidrogen cair kriogenik pada suhu -253°C.',
    whyCorrect: 'KKM mengonfirmasi bahwa pipa transfer kriogenik telah dibersihkan dengan gas Nitrogen murni, link sistem pemutus darurat ESD-2 telah teruji, dan kapal siap memulai pengisian hidrogen cair pada suhu -253°C.',
    distractors: [
      { option: 'Hydrogen lines leaking heavily into harbor waters', reason: 'Salah tidak ada kebocoran bahan bakar.' },
      { option: 'Bunkering stopped due to missing fuel filters', reason: 'Salah seluruh persiapan pengisian siap 100%.' },
      { option: 'Terminal refused to supply cryogenic fuel', reason: 'Salah terminal siap menyalurkan hidrogen cair.' },
    ],
    maritimeContext: 'Prosedur keselamatan pengisian bahan bakar kriogenik hidrogen cair nol emisi.',
  },
  'm10-l-57': {
    summary: 'Laporan perkembangan situasi operasi penyelamatan IAMSAR SITREP 2 oleh OSC.',
    whyCorrect: 'OSC melaporkan bahwa pola pencarian paralel selesai, rakit penolong ditemukan dengan 6 korban selamat, sekoci cepat diluncurkan, dan evakuasi medis helikopter telah diminta ke lokasi.',
    distractors: [
      { option: 'Search failed and all vessels standing down', reason: 'Salah korban berhasil ditemukan hidup.' },
      { option: 'Liferaft sank with no survivors found', reason: 'Salah 6 korban terkonfirmasi selamat di dalam rakit.' },
      { option: 'Search vessel collided with drifting wreckage', reason: 'Salah tidak ada tubrukan antar kapal penolong.' },
    ],
    maritimeContext: 'Penyampaian laporan berkala situasi operasi penyelamatan maritim IAMSAR SITREP.',
  },
  'm10-l-58': {
    summary: 'Pembelaan hukum Nakhoda atas klaim kecepatan sewa kapal menggunakan data cuaca VDR.',
    whyCorrect: 'Nakhoda membuktikan lewat data VDR dan buku jurnal cuaca bahwa kapal menghadapi angin kencang Skala Beaufort 6 dan gelombang Skala Douglas 5, sehingga klaim kecepatan sewa kapal pada cuaca baik tidak berlaku.',
    distractors: [
      { option: 'Admitting that ship engines were defective and accepting full liability', reason: 'Salah mesin kapal bekerja normal dan penalti dibatalkan karena faktor cuaca buruk.' },
      { option: 'Stating that the ship ran out of fuel completely', reason: 'Salah kapal tidak kehabisan bahan bakar.' },
      { option: 'Claiming that compass error caused the slow transit', reason: 'Salah bukan karena kesalahan kompas.' },
    ],
    maritimeContext: 'Pembuktian data cuaca logbook dalam membela diri dari klaim penalti sewa kapal.',
  },
  'm10-l-59': {
    summary: 'Penolakan tegas penyerahan muatan tanpa dokumen asli Bill of Lading oleh Nakhoda.',
    whyCorrect: 'Nakhoda secara tegas menolak membongkar muatan tanpa penyerahan konosemen asli (Original B/L) dan menolak LOI pengirim yang tidak memiliki jaminan jaminan bank resmi.',
    distractors: [
      { option: 'Discharging all cargo immediately to anyone with cash', reason: 'SANGAT FATAL! Membongkar muatan tanpa dokumen resmi melanggar hukum pengangkutan laut.' },
      { option: 'Selling the cargo to the highest bidder at the wharf', reason: 'Salah muatan tidak boleh dijual sembarangan.' },
      { option: 'Dumping the cargo into the harbor basin', reason: 'SANGAT FATAL! Membuang muatan ke kolam pelabuhan mencemari laut dan melanggar hukum.' },
    ],
    maritimeContext: 'Penegakan hukum penyerahan kargo maritim guna melindungi pemilik kapal dari sengketa salah serah.',
  },
  'm10-l-60': {
    summary: 'Hasil penutupan audit pembaruan Sertifikat Manajemen Keselamatan (SMC) ISM Code.',
    whyCorrect: 'Lead Auditor mengumumkan audit pembaruan Sistem Manajemen Keselamatan berhasil sukses tanpa adanya temuan ketidaksesuaian mayor dan rekomendasi pembaruan SMC penuh 5 tahun diajukan ke Administrasi Bendera.',
    distractors: [
      { option: 'Safety Management Certificate cancelled immediately', reason: 'Salah sertifikat justru diperbarui penuh 5 tahun.' },
      { option: 'Vessel prohibited from sailing indefinitely', reason: 'Salah kapal dinyatakan laiklaut penuh.' },
      { option: 'Auditor demanded payment of cash fines', reason: 'Salah auditor ISM tidak memungut denda tunai.' },
    ],
    maritimeContext: 'Penutupan audit eksternal pembaruan Sertifikat Manajemen Keselamatan (SMC) ISM Code.',
  },
};

const ALL_BESPOKE_EXPLANATIONS: Record<string, DetailedExplanation> = {
  ...TEST_1_EXPLANATIONS,
  ...TEST_2_EXPLANATIONS,
  ...TEST_3_EXPLANATIONS,
  ...TEST_4_EXPLANATIONS,
  ...TEST_5_EXPLANATIONS,
  ...TEST_6_EXPLANATIONS,
  ...TEST_7_EXPLANATIONS,
  ...TEST_8_EXPLANATIONS,
  ...TEST_9_EXPLANATIONS,
  ...TEST_10_EXPLANATIONS,
};

export function getRichQuestionExplanation(q: Question): DetailedExplanation {
  // 1. Check if the question is in our bespoke bank (Test 1 through 10)
  if (q.id && ALL_BESPOKE_EXPLANATIONS[q.id]) {
    const bespoke = ALL_BESPOKE_EXPLANATIONS[q.id];
    // If admin custom edited question_data fields exist, override with them
    const qData = q.question_data || {};
    return {
      summary: bespoke.summary,
      whyCorrect: qData.why_correct || bespoke.whyCorrect,
      distractors: qData.distractor_reasons
        ? Object.entries(qData.distractor_reasons).map(([opt, reason]) => ({ option: opt, reason: String(reason) }))
        : bespoke.distractors,
      maritimeContext: qData.maritime_context || bespoke.maritimeContext,
      ruleOrFormula: qData.rule_or_formula || bespoke.ruleOrFormula,
    };
  }

  // 2. Check if custom admin/database fields exist directly on question_data
  const qData = q.question_data || {};
  if (qData.why_correct) {
    const distList = qData.distractor_reasons
      ? Object.entries(qData.distractor_reasons).map(([opt, reason]) => ({ option: opt, reason: String(reason) }))
      : [];
    return {
      summary: q.explanation || 'Pembahasan terstruktur standar IMO SMCP.',
      whyCorrect: qData.why_correct,
      distractors: distList,
      maritimeContext: qData.maritime_context,
      ruleOrFormula: qData.rule_or_formula,
    };
  }

  // 3. Fallback: Dynamic intelligent generator
  const qText = q.question_text.toLowerCase();
  const cat = q.category;
  const correctAns = String(q.correct_answer || '').trim();
  const options = q.options || q.question_data?.option_labels || [];
  const rawExpl = q.explanation || q.question_data?.explanation || '';

  let customWhyCorrect = rawExpl;
  let customSummary = '';
  let ruleOrFormula = '';
  let maritimeContext = '';

  if (cat === 'grammar') {
    customSummary = `Kaidah Tata Bahasa Maritim: ${rawExpl || 'Struktur gramatikal bahasa Inggris maritim.'}`;
    customWhyCorrect = rawExpl
      ? `${rawExpl} Bentuk kata/frasa "${correctAns}" adalah satu-satunya yang memenuhi aturan struktur kalimat ini secara gramatikal.`
      : `Pilihan "${correctAns}" tepat karena sesuai dengan kaidah subjek-predikat, bentuk tenses (waktu), dan preposisi standar bahasa Inggris.`;
    ruleOrFormula = 'Subject + Verb Agreement / Passive Voice / Modal Auxiliary Rule.';
    maritimeContext = 'Penggunaan tata bahasa yang tepat dan terstruktur sangat penting pada instruksi keselamatan kapal agar tidak menimbulkan ambigu.';
  } else if (cat === 'vocabulary') {
    customSummary = `Istilah Terminologi Maritim: "${correctAns}".`;
    customWhyCorrect = rawExpl || `Istilah "${correctAns}" secara spesifik mendefinisikan objek, peran, atau prosedur operasional maritim yang ditanyakan.`;
    maritimeContext = 'Standar kosakata maritim IMO SMCP (Standard Marine Communication Phrases).';
  } else if (cat === 'time_and_numbers') {
    customSummary = 'Kalkulasi Angka & Pengukuran Standar Maritim Internasional.';
    customWhyCorrect = rawExpl || `Hasil kalkulasi matematis atau pembacaan besaran teknis yang akurat menghasilkan nilai "${correctAns}".`;
    ruleOrFormula = 'Konversi Satuan Metrik Maritim: 1 Ton = 1.000 kg, 1 Knot = 1 NM/jam, 1 NM = 1.852 meter.';
    maritimeContext = 'Digunakan pada laporan stabilitas muatan, perhitungan bahan bakar bunker, dan navigasi.';
  } else if (cat === 'reading_comprehension') {
    customSummary = 'Analisis Pemahaman Teks Prosedur & Keselamatan Maritim.';
    customWhyCorrect = rawExpl || `Informasi pada teks bacaan secara eksplisit dan faktual mendukung bahwa "${correctAns}" adalah kesimpulan/jawaban yang paling akurat.`;
    maritimeContext = 'Membaca instruksi kerja, dokumen manifes kargo, dan panduan keselamatan IMO.';
  } else if (cat === 'listening_comprehension') {
    customSummary = 'Komunikasi Radio VHF & Fraseologi Standar IMO SMCP.';
    customWhyCorrect = rawExpl || `Klip percakapan radio maritim secara jelas menyebutkan informasi "${correctAns}" sesuai prosedur pertukaran pesan VHF.`;
    maritimeContext = 'Komunikasi radio antara kapal dengan kapal lain (ship-to-ship) atau kapal dengan VTS/Stasiun Pandu (ship-to-shore).';
  } else {
    customSummary = 'Evaluasi Standar Kemahiran Bahasa Inggris Maritim IMO STCW.';
    customWhyCorrect = rawExpl || `Pilihan "${correctAns}" adalah jawaban yang paling tepat sesuai konteks pertanyaan dan standar maritim internasional.`;
  }

  const distractorsList: { option: string; reason: string }[] = [];
  if (options.length > 0) {
    options.forEach((opt: string) => {
      const cleanOpt = String(opt).trim();
      if (cleanOpt.toLowerCase() === correctAns.toLowerCase()) return;

      let reason = '';
      const optLower = cleanOpt.toLowerCase();

      if (cat === 'grammar') {
        if (optLower.endsWith('ing')) {
          reason = `Bentuk Participle / Gerund (-ing) tidak dapat berdiri sendiri tanpa auxiliary verb yang mendahuluinya.`;
        } else if (optLower.endsWith('ed')) {
          reason = `Bentuk Past Tense (-ed) tidak sesuai dengan tenses kalimat atau konteks waktu yang dinyatakan.`;
        } else if (optLower.startsWith('is ') || optLower.startsWith('are ')) {
          reason = `Terdapat ketidaksesuaian jumlah subjek (tunggal/jamak) atau tenses aktif/pasif pada kalimat.`;
        } else {
          reason = `Secara gramatikal, bentuk kata "${cleanOpt}" tidak sesuai dengan pola kalimat ini.`;
        }
      } else if (cat === 'time_and_numbers') {
        reason = `Hasil perhitungan matematis atau pembacaan nilai tidak menghasilkan ${cleanOpt}.`;
      } else if (cat === 'vocabulary') {
        reason = `Istilah "${cleanOpt}" merujuk pada komponen, alat, atau definisi lain yang tidak sesuai dengan deskripsi soal.`;
      } else if (cat === 'listening_comprehension') {
        reason = `Informasi "${cleanOpt}" tidak diucapkan atau bertentangan dengan pesan radio VHF pada rekaman audio.`;
      } else if (cat === 'reading_comprehension') {
        reason = `Pernyataan "${cleanOpt}" tidak didukung oleh fakta yang tertulis di dalam teks bacaan.`;
      } else {
        reason = `Pilihan "${cleanOpt}" tidak memenuhi kriteria dan konteks yang diminta dalam pertanyaan.`;
      }

      distractorsList.push({
        option: cleanOpt,
        reason,
      });
    });
  }

  return {
    summary: customSummary,
    whyCorrect: customWhyCorrect,
    distractors: distractorsList,
    maritimeContext,
    ruleOrFormula,
  };
}
