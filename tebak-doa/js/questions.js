(function () {
  "use strict";

  const prayers = [
    {
      id: "sebelum-makan", name: "Doa Sebelum Makan", category: "Makan",
      image: "assets/images/situations/makan.svg",
      arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah.",
      translation: "Dengan nama Allah.",
      situation: "Dibaca sebelum mulai makan.",
      level: 1, difficulty: "mudah", symbol: "🍽️", audio: "",
      source: "Hadis tentang membaca basmalah sebelum makan; Sahih al-Bukhari 5376.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "sesudah-makan", name: "Doa Sesudah Makan", category: "Makan",
      image: "assets/images/situations/makan.svg",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah.",
      translation: "Segala puji bagi Allah.",
      situation: "Dibaca sebagai ungkapan syukur setelah makan.",
      level: 1, difficulty: "mudah", symbol: "🥣", audio: "",
      source: "Hadis tentang pujian kepada Allah setelah makan; Sahih Muslim 2734.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "sebelum-tidur", name: "Doa Sebelum Tidur", category: "Istirahat",
      image: "assets/images/situations/tidur.svg",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismika Allahumma amutu wa ahya.",
      translation: "Dengan nama-Mu, ya Allah, aku mati dan aku hidup.",
      situation: "Dibaca ketika hendak tidur.",
      level: 1, difficulty: "mudah", symbol: "🌙", audio: "",
      source: "Doa sebelum tidur; Sahih al-Bukhari 6324.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "bangun-tidur", name: "Doa Bangun Tidur", category: "Istirahat",
      image: "assets/images/situations/tidur.svg",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      transliteration: "Alhamdulillahil-ladzi ahyana ba'da ma amatana wa ilaihin-nusyur.",
      translation: "Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.",
      situation: "Dibaca ketika bangun dari tidur.",
      level: 1, difficulty: "mudah", symbol: "🌅", audio: "",
      source: "Doa bangun tidur; Sahih al-Bukhari 6312.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "sebelum-belajar", name: "Doa Memohon Ilmu", category: "Belajar",
      image: "assets/images/situations/belajar.svg",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidni 'ilma.",
      translation: "Ya Tuhanku, tambahkanlah ilmu kepadaku.",
      situation: "Doa memohon tambahan ilmu sebelum atau saat belajar.",
      level: 2, difficulty: "mudah", symbol: "📚", audio: "",
      source: "Al-Qur'an, Surah Taha (20): 114.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "masuk-rumah", name: "Doa Masuk Rumah", category: "Di rumah",
      image: "assets/images/situations/rumah.svg",
      arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
      transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Allahi rabbina tawakkalna.",
      translation: "Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah, Tuhan kami, kami bertawakal.",
      situation: "Dibaca saat masuk rumah, lalu mengucapkan salam kepada keluarga.",
      level: 2, difficulty: "sedang", symbol: "🏠", audio: "",
      source: "Riwayat Abu Dawud 5096; rujukan dan penilaian hadis perlu ditinjau pendamping.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "keluar-rumah", name: "Doa Keluar Rumah", category: "Di rumah",
      image: "assets/images/situations/rumah.svg",
      arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "Bismillahi, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah.",
      translation: "Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
      situation: "Dibaca saat hendak keluar rumah.",
      level: 2, difficulty: "sedang", symbol: "🚪", audio: "",
      source: "Riwayat Abu Dawud 5095 dan At-Tirmidzi 3426; rujukan perlu ditinjau pendamping.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "bepergian", name: "Doa Bepergian", category: "Perjalanan",
      image: "assets/images/situations/perjalanan.svg",
      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
      transliteration: "Subhanalladzi sakhkhara lana hadza wa ma kunna lahu muqrinin.",
      translation: "Mahasuci Allah yang telah menundukkan semua ini bagi kami, padahal kami sebelumnya tidak mampu menguasainya.",
      situation: "Bagian dari doa ketika menaiki kendaraan untuk bepergian.",
      level: 2, difficulty: "sedang", symbol: "🚌", audio: "",
      source: "Al-Qur'an, Surah Az-Zukhruf (43): 13; ayat berikutnya (43): 14 berisi doa lanjutannya.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "masuk-kamar-mandi", name: "Doa Masuk Kamar Mandi", category: "Kamar mandi",
      image: "assets/images/situations/kamar-mandi.svg",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      transliteration: "Allahumma inni a'udzu bika minal-khubutsi wal-khaba'its.",
      translation: "Ya Allah, aku berlindung kepada-Mu dari gangguan setan laki-laki dan perempuan.",
      situation: "Dibaca sebelum masuk kamar mandi.",
      level: 2, difficulty: "sedang", symbol: "🚿", audio: "",
      source: "Sahih al-Bukhari, doa sebelum masuk kamar mandi; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "keluar-kamar-mandi", name: "Doa Keluar Kamar Mandi", category: "Kamar mandi",
      image: "assets/images/situations/kamar-mandi.svg",
      arabic: "غُفْرَانَكَ",
      transliteration: "Ghufranaka.",
      translation: "Aku memohon ampunan-Mu.",
      situation: "Dibaca setelah keluar dari kamar mandi.",
      level: 2, difficulty: "mudah", symbol: "🚿", audio: "",
      source: "Sunan Abi Dawud, doa setelah keluar kamar mandi; status dan nomor riwayat perlu ditinjau pendamping.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "masuk-masjid", name: "Doa Masuk Masjid", category: "Masjid",
      image: "assets/images/situations/masjid.svg",
      arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      transliteration: "Allahummaftah li abwaba rahmatik.",
      translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
      situation: "Dibaca ketika masuk ke masjid.",
      level: 2, difficulty: "sedang", symbol: "🕌", audio: "",
      source: "Sahih Muslim, doa masuk masjid; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "keluar-masjid", name: "Doa Keluar Masjid", category: "Masjid",
      image: "assets/images/situations/masjid.svg",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
      transliteration: "Allahumma inni as'aluka min fadlik.",
      translation: "Ya Allah, aku memohon karunia-Mu.",
      situation: "Dibaca ketika keluar dari masjid.",
      level: 2, difficulty: "sedang", symbol: "🕌", audio: "",
      source: "Sahih Muslim, doa keluar masjid; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "setelah-wudu", name: "Doa Setelah Wudu", category: "Bersuci",
      image: "assets/images/situations/wudu.svg",
      arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
      transliteration: "Asyhadu an la ilaha illallah wahdahu la syarika lah, wa asyhadu anna Muhammadan 'abduhu wa rasuluh.",
      translation: "Aku bersaksi bahwa tidak ada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
      situation: "Dibaca setelah selesai berwudu.",
      level: 2, difficulty: "sedang", symbol: "💧", audio: "",
      source: "Sahih Muslim, keutamaan berwudu dan zikir setelahnya; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "ketika-bersin", name: "Ucapan Ketika Bersin", category: "Kesehatan",
      image: "assets/images/situations/kesehatan.svg",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah.",
      translation: "Segala puji bagi Allah.",
      situation: "Diucapkan oleh orang yang bersin setelah bersin.",
      level: 1, difficulty: "mudah", symbol: "🤧", audio: "",
      source: "Sahih al-Bukhari, adab ketika bersin; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "saat-hujan", name: "Doa Saat Hujan Turun", category: "Cuaca",
      image: "assets/images/situations/cuaca.svg",
      arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
      transliteration: "Allahumma shayyiban nafi'an.",
      translation: "Ya Allah, turunkanlah hujan yang bermanfaat.",
      situation: "Dibaca ketika hujan mulai turun.",
      level: 2, difficulty: "mudah", symbol: "🌧️", audio: "",
      source: "Sahih al-Bukhari, doa ketika hujan turun; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "setelah-hujan", name: "Ucapan Setelah Hujan", category: "Cuaca",
      image: "assets/images/situations/cuaca.svg",
      arabic: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ",
      transliteration: "Muthirna bi fadhlillahi wa rahmatih.",
      translation: "Kami diberi hujan karena karunia Allah dan rahmat-Nya.",
      situation: "Diucapkan sebagai rasa syukur setelah hujan turun.",
      level: 2, difficulty: "sedang", symbol: "🌦️", audio: "",
      source: "Sahih al-Bukhari, zikir setelah hujan; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "memohon-petunjuk", name: "Doa Memohon Petunjuk", category: "Kebaikan diri",
      image: "assets/images/situations/quran.svg",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
      transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina.",
      translation: "Ya Allah, aku memohon petunjuk, ketakwaan, kesucian diri, dan kecukupan kepada-Mu.",
      situation: "Doa memohon petunjuk dan kebaikan untuk diri.",
      level: 4, difficulty: "sedang", symbol: "✨", audio: "",
      source: "Sahih Muslim, doa memohon petunjuk, takwa, kesucian diri, dan kecukupan; penomoran dapat berbeda antar-edisi.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "doa-untuk-orang-tua", name: "Doa untuk Orang Tua", category: "Keluarga",
      image: "assets/images/situations/keluarga.svg",
      arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      transliteration: "Rabbirhamhuma kama rabbayani shaghira.",
      translation: "Ya Tuhanku, sayangilah keduanya sebagaimana mereka merawatku ketika kecil.",
      situation: "Doa memohon kasih sayang Allah untuk kedua orang tua.",
      level: 2, difficulty: "sedang", symbol: "👨‍👩‍👧", audio: "",
      source: "Al-Qur'an, Surah Al-Isra (17): 24.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "musa-mudahkan-urusan", name: "Doa Memohon Kemudahan", category: "Belajar",
      image: "assets/images/situations/belajar.svg",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي ۝ يَفْقَهُوا قَوْلِي",
      transliteration: "Rabbishrah li shadri, wa yassir li amri, wahlul 'uqdatan min lisani, yafqahu qawli.",
      translation: "Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, lepaskanlah kekakuan lidahku agar mereka memahami perkataanku.",
      situation: "Doa Nabi Musa memohon kelapangan, kemudahan urusan, dan kelancaran berbicara.",
      level: 4, difficulty: "sedang", symbol: "📖", audio: "",
      source: "Al-Qur'an, Surah Taha (20): 25–28.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "doa-nabi-yunus", name: "Doa Nabi Yunus", category: "Kebaikan diri",
      image: "assets/images/situations/quran.svg",
      arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
      transliteration: "La ilaha illa anta, subhanaka inni kuntu minazh-zhalimin.",
      translation: "Tidak ada Tuhan selain Engkau. Mahasuci Engkau. Sungguh, aku termasuk orang-orang yang zalim.",
      situation: "Doa Nabi Yunus yang disebut dalam Al-Qur'an.",
      level: 5, difficulty: "sedang", symbol: "🤲", audio: "",
      source: "Al-Qur'an, Surah Al-Anbiya (21): 87.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "ampuni-orang-tua", name: "Doa Memohon Ampun untuk Orang Tua", category: "Keluarga",
      image: "assets/images/situations/keluarga.svg",
      arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
      transliteration: "Rabbana-ghfir li wa liwalidayya wa lil-mu'minina yawma yaqumul-hisab.",
      translation: "Ya Tuhan kami, ampunilah aku, kedua orang tuaku, dan orang-orang beriman pada hari perhitungan.",
      situation: "Doa Nabi Ibrahim memohon ampun untuk diri, orang tua, dan orang-orang beriman.",
      level: 4, difficulty: "sedang", symbol: "💛", audio: "",
      source: "Al-Qur'an, Surah Ibrahim (14): 41.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "doa-keluarga", name: "Doa Kebaikan Keluarga", category: "Keluarga",
      image: "assets/images/situations/keluarga.svg",
      arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
      transliteration: "Rabbana hab lana min azwajina wa dzurriyyatina qurrata a'yun, waj'alna lil-muttaqina imama.",
      translation: "Ya Tuhan kami, anugerahkanlah kepada kami keluarga yang menyejukkan hati dan jadikanlah kami teladan bagi orang-orang yang bertakwa.",
      situation: "Doa memohon keluarga yang membawa kebahagiaan dan kebaikan.",
      level: 5, difficulty: "sedang", symbol: "👪", audio: "",
      source: "Al-Qur'an, Surah Al-Furqan (25): 74.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "musa-mohon-kebaikan", name: "Doa Memohon Kebaikan", category: "Kebaikan diri",
      image: "assets/images/situations/quran.svg",
      arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
      transliteration: "Rabbi inni lima anzalta ilayya min khairin faqir.",
      translation: "Ya Tuhanku, sungguh aku sangat memerlukan kebaikan yang Engkau turunkan kepadaku.",
      situation: "Doa Nabi Musa ketika memohon kebaikan dari Allah.",
      level: 4, difficulty: "sedang", symbol: "🌱", audio: "",
      source: "Al-Qur'an, Surah Al-Qasas (28): 24.",
      verification: "Perlu verifikasi pendamping"
    },
    {
      id: "doa-keteguhan-hati", name: "Doa Memohon Keteguhan Hati", category: "Kebaikan diri",
      image: "assets/images/situations/quran.svg",
      arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
      transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-wahhab.",
      translation: "Ya Tuhan kami, janganlah Engkau palingkan hati kami setelah Engkau memberi petunjuk. Anugerahkanlah rahmat kepada kami.",
      situation: "Doa memohon hati yang teguh dan rahmat dari Allah.",
      level: 5, difficulty: "sedang", symbol: "💚", audio: "",
      source: "Al-Qur'an, Surah Ali 'Imran (3): 8.",
      verification: "Perlu verifikasi pendamping"
    }
  ];

  const levels = [
    { id: 1, name: "Doa Dasar", description: "Kenali doa di waktu makan dan istirahat.", symbol: "🌱" },
    { id: 2, name: "Aktivitas Harian", description: "Belajar doa untuk rumah, belajar, dan perjalanan.", symbol: "☀️" },
    { id: 3, name: "Tebak Situasi", description: "Pilih doa yang cocok untuk ceritanya.", symbol: "🧩" },
    { id: 4, name: "Ulang dan Ingat", description: "Latihan campuran nama doa dan artinya.", symbol: "🔁" },
    { id: 5, name: "Tantangan Akhir", description: "Tunjukkan yang sudah kamu pelajari!", symbol: "🏆" }
  ];

  const legacyQuestions = [
    { id: "q1", level: 1, prompt: "Kamu akan mulai makan. Doa apa yang sesuai?", answer: "sebelum-makan", kind: "situasi" },
    { id: "q2", level: 1, prompt: "Setelah selesai makan, doa apa yang kita ingat?", answer: "sesudah-makan", kind: "situasi" },
    { id: "q3", level: 1, prompt: "Kamu sudah siap beristirahat malam. Doa apa yang sesuai?", answer: "sebelum-tidur", kind: "cerita" },
    { id: "q4", level: 1, prompt: "Baru bangun tidur di pagi hari. Doa apa yang sesuai?", answer: "bangun-tidur", kind: "cerita" },
    { id: "q5", level: 2, prompt: "Sebelum membuka buku pelajaran, doa apa yang dapat kamu baca?", answer: "sebelum-belajar", kind: "situasi" },
    { id: "q6", level: 2, prompt: "Kamu pulang dan hendak masuk rumah. Doa apa yang sesuai?", answer: "masuk-rumah", kind: "cerita" },
    { id: "q7", level: 2, prompt: "Kamu akan berangkat dari rumah. Doa apa yang sesuai?", answer: "keluar-rumah", kind: "cerita" },
    { id: "q8", level: 2, prompt: "Kamu naik kendaraan untuk bepergian. Doa apa yang dipelajari untuk situasi ini?", answer: "bepergian", kind: "situasi" },
    { id: "q9", level: 3, prompt: "Nisa mengucap syukur setelah menikmati makan siang. Doa apa yang cocok?", answer: "sesudah-makan", kind: "cerita" },
    { id: "q10", level: 3, prompt: "Rafi berangkat ke sekolah dan meninggalkan rumah. Doa mana yang cocok dibaca saat keluar?", answer: "keluar-rumah", kind: "cerita" },
    { id: "q11", level: 3, prompt: "Sebelum tidur, doa ini dimulai dengan kata “Bismika Allahumma”. Doa apakah itu?", answer: "sebelum-tidur", kind: "ingat" },
    { id: "q12", level: 3, prompt: "Saat menaiki kendaraan, doa dari Surah Az-Zukhruf ayat 13 dipelajari sebagai doa apa?", answer: "bepergian", kind: "ingat" },
    { id: "q13", level: 4, prompt: "Arti “Ya Tuhanku, tambahkanlah ilmu kepadaku” adalah doa apa?", answer: "sebelum-belajar", kind: "arti" },
    { id: "q14", level: 4, prompt: "Doa “Alhamdulillah” yang dipelajari setelah makan digunakan untuk apa?", answer: "sesudah-makan", kind: "arti" },
    { id: "q15", level: 4, prompt: "Doa bangun tidur mengingatkan kita untuk bersyukur setelah melakukan kegiatan apa?", answer: "bangun-tidur", kind: "arti" },
    { id: "q16", level: 4, prompt: "Doa “Bismillahi tawakkaltu 'alallah” dipelajari saat hendak melakukan apa?", answer: "keluar-rumah", kind: "ingat" },
    { id: "q17", level: 5, prompt: "Alya mengucapkan salam kepada keluarganya setelah masuk rumah. Doa mana yang dipelajari untuk saat masuk?", answer: "masuk-rumah", kind: "cerita" },
    { id: "q18", level: 5, prompt: "Doa memohon ilmu dari Surah Taha ayat 114 adalah doa untuk kegiatan apa?", answer: "sebelum-belajar", kind: "arti" },
    { id: "q19", level: 5, prompt: "Doa yang tepat ketika akan tidur adalah…", answer: "sebelum-tidur", kind: "situasi" },
    { id: "q20", level: 5, prompt: "Doa yang dipelajari untuk dibaca sebelum mulai makan adalah…", answer: "sebelum-makan", kind: "situasi" }
  ];

  const questionContexts = {
    "sebelum-makan": { moment: "akan mulai makan", story: "hendak menyantap makan siang bersama keluarga", target: "sebelum makan", meaning: "memulai dengan nama Allah" },
    "sesudah-makan": { moment: "baru selesai makan", story: "selesai menikmati bekal dan bersyukur", target: "sesudah makan", meaning: "segala puji bagi Allah" },
    "sebelum-tidur": { moment: "bersiap beristirahat malam", story: "akan beristirahat setelah hari yang menyenangkan", target: "sebelum tidur", meaning: "dengan nama-Mu aku hidup dan wafat" },
    "bangun-tidur": { moment: "baru bangun pada pagi hari", story: "bangun pagi dan bersyukur memulai hari", target: "setelah bangun tidur", meaning: "Allah menghidupkan kami setelah tidur" },
    "sebelum-belajar": { moment: "akan mulai belajar", story: "membuka buku untuk belajar hal baru", target: "memohon tambahan ilmu", meaning: "memohon tambahan ilmu" },
    "masuk-rumah": { moment: "sampai di rumah dan hendak masuk", story: "pulang dari sekolah lalu masuk rumah", target: "ketika masuk rumah", meaning: "masuk dengan nama Allah dan bertawakal" },
    "keluar-rumah": { moment: "akan pergi dan melangkah keluar rumah", story: "bersiap berangkat bersama keluarga", target: "ketika keluar rumah", meaning: "bertawakal dan memohon pertolongan Allah" },
    "bepergian": { moment: "akan menaiki kendaraan untuk bepergian", story: "duduk di kendaraan sebelum memulai perjalanan", target: "saat naik kendaraan", meaning: "Allah menundukkan kendaraan untuk kita" },
    "masuk-kamar-mandi": { moment: "akan masuk ke kamar mandi", story: "berhenti sejenak sebelum masuk kamar mandi", target: "sebelum masuk kamar mandi", meaning: "memohon perlindungan kepada Allah" },
    "keluar-kamar-mandi": { moment: "baru selesai menggunakan kamar mandi dan keluar", story: "selesai di kamar mandi lalu melangkah keluar", target: "setelah keluar kamar mandi", meaning: "memohon ampunan Allah" },
    "masuk-masjid": { moment: "tiba di masjid dan akan masuk", story: "datang untuk beribadah lalu memasuki masjid", target: "ketika masuk masjid", meaning: "memohon pintu-pintu rahmat" },
    "keluar-masjid": { moment: "selesai beribadah dan akan meninggalkan masjid", story: "selesai berada di masjid lalu melangkah keluar", target: "ketika keluar masjid", meaning: "memohon karunia Allah" },
    "setelah-wudu": { moment: "selesai membasuh anggota wudu", story: "menuntaskan wudu sebelum bersiap beribadah", target: "setelah selesai berwudu", meaning: "bersaksi tentang keesaan Allah" },
    "ketika-bersin": { moment: "baru saja bersin", story: "bersin lalu mengucap syukur kepada Allah", target: "setelah bersin", meaning: "segala puji bagi Allah" },
    "saat-hujan": { moment: "melihat hujan mulai turun", story: "melihat tetes hujan turun dari langit", target: "ketika hujan mulai turun", meaning: "memohon hujan yang bermanfaat" },
    "setelah-hujan": { moment: "hujan sudah turun dan kamu bersyukur", story: "melihat hujan reda lalu mengingat karunia Allah", target: "bersyukur setelah hujan", meaning: "hujan datang karena karunia dan rahmat Allah" },
    "memohon-petunjuk": { moment: "ingin memohon petunjuk dan kebaikan diri", story: "berdoa agar mendapat petunjuk dan menjaga diri", target: "petunjuk dan ketakwaan", meaning: "memohon petunjuk dan kesucian diri" },
    "doa-untuk-orang-tua": { moment: "teringat kasih sayang kedua orang tua", story: "ingin mendoakan ayah dan ibu dengan penuh kasih", target: "kasih sayang untuk orang tua", meaning: "menyayangi orang tua seperti mereka merawatku" },
    "musa-mudahkan-urusan": { moment: "menghadapi tugas dan berharap urusan dimudahkan", story: "akan berbicara di depan kelas dengan tenang", target: "kelapangan dan kemudahan", meaning: "lapangkan dada dan mudahkan urusan" },
    "doa-nabi-yunus": { moment: "mengingat kisah seorang nabi di dalam perut ikan", story: "membaca kisah nabi yang berdoa di dalam perut ikan", target: "ketika seorang nabi berada di dalam perut ikan", meaning: "mengakui keesaan dan kesucian Allah" },
    "ampuni-orang-tua": { moment: "berdoa memohon ampun untuk diri dan orang tua", story: "mengingat keluarga dan orang beriman dalam doa", target: "ampunan untuk orang tua", meaning: "memohon ampun untuk diri dan orang tua" },
    "doa-keluarga": { moment: "berdoa untuk keluarga yang membawa kebaikan", story: "berharap keluarganya tumbuh dalam kebaikan", target: "keluarga yang menyejukkan hati", meaning: "keluarga yang menjadi penyejuk hati" },
    "musa-mohon-kebaikan": { moment: "ingin meminta kebaikan dari Allah", story: "mengingat doa Nabi Musa saat memohon kebaikan", target: "memohon kebaikan", meaning: "memerlukan kebaikan dari Allah" },
    "doa-keteguhan-hati": { moment: "memohon hati tetap teguh dalam petunjuk", story: "berdoa agar tetap mengikuti petunjuk dan mendapat rahmat", target: "keteguhan hati", meaning: "memohon hati teguh dalam petunjuk" }
  };

  const characters = ["Nisa", "Rafi", "Alya", "Dimas", "Salsa", "Bima", "Laras", "Tio"];
  const basicLevelPrompts = {
    "sebelum-makan": [
      { kind: "cerita", prompt: "Rafi membuka bekal sebelum menyuap. Doa apa yang dibaca?" },
      { kind: "situasi", prompt: "Doa apa yang kita baca sebelum sarapan?" },
      { kind: "cerita", prompt: "Nisa akan makan siang. Doa apa yang dibaca sebelum makan?" },
      { kind: "situasi", prompt: "Makanan sudah siap disajikan. Doa apa yang dibaca sebelum mulai?" }
    ],
    "sesudah-makan": [
      { kind: "cerita", prompt: "Rafi selesai menyantap bekal. Doa apa yang dibaca sesudah makan?" },
      { kind: "situasi", prompt: "Setelah sarapan, doa apa yang sesuai?" },
      { kind: "cerita", prompt: "Nisa menuntaskan makan siangnya. Doa apa yang ia ucapkan?" },
      { kind: "situasi", prompt: "Makan malam telah usai. Doa apa yang diingat setelah makan?" }
    ],
    "sebelum-tidur": [
      { kind: "situasi", prompt: "Saat hendak memejamkan mata, doa apa yang dibaca?" },
      { kind: "cerita", prompt: "Alya bersiap tidur malam. Doa apa yang ia baca?" },
      { kind: "situasi", prompt: "Hari sudah selesai dan waktu tidur tiba. Doa apa yang cocok?" },
      { kind: "cerita", prompt: "Dimas siap beristirahat malam. Doa mana yang ia baca?" }
    ],
    "bangun-tidur": [
      { kind: "situasi", prompt: "Setelah membuka mata pada pagi hari, doa apa yang dibaca?" },
      { kind: "cerita", prompt: "Dimas baru terjaga dari tidur. Doa apa yang cocok?" },
      { kind: "situasi", prompt: "Ketika bangun pada pagi hari, doa apa yang diingat?" },
      { kind: "cerita", prompt: "Nisa bangun dan hendak memulai hari. Doa apa yang ia baca?" }
    ]
  };
  const dailyPrayerIds = new Set([
    "sebelum-makan", "sesudah-makan", "sebelum-tidur", "bangun-tidur",
    "sebelum-belajar", "masuk-rumah", "keluar-rumah", "bepergian",
    "masuk-kamar-mandi", "keluar-kamar-mandi", "masuk-masjid", "keluar-masjid",
    "setelah-wudu", "ketika-bersin", "saat-hujan", "setelah-hujan"
  ]);
  const generatedQuestions = prayers.flatMap((prayer, prayerIndex) => {
    const context = questionContexts[prayer.id];
    if (!context) throw new Error("Konteks soal belum tersedia untuk doa: " + prayer.id);
    const personOne = characters[prayerIndex % characters.length];
    const personTwo = characters[(prayerIndex + 3) % characters.length];
    const prompts = (basicLevelPrompts[prayer.id] || []).map((item) => ({ ...item, level: 1 }));
    if (dailyPrayerIds.has(prayer.id)) {
      prompts.push({ level: 2, kind: "cerita", prompt: `${personOne} ${context.story}. Doa apa yang cocok?` });
    }
    prompts.push(
      { level: 3, kind: "cerita", prompt: `Saat ${context.moment}, ${personTwo} teringat untuk berdoa. Doa mana yang sesuai?` },
      { level: 4, kind: "arti", prompt: `Doa ${context.target}: “${context.meaning}”. Doa apa?` },
      { level: 5, kind: "ingat", prompt: `Ingat kembali, doa yang dipelajari untuk ${context.target} bernama apa?` }
    );
    if (!dailyPrayerIds.has(prayer.id)) {
      prompts.push({ level: 5, kind: "cerita", prompt: `${personOne} ${context.story}. Doa apa yang cocok?` });
    }
    return prompts.map((item) => ({
      level: item.level,
      prompt: item.prompt,
      answer: prayer.id,
      kind: item.kind
    }));
  });

  const questions = legacyQuestions.concat(generatedQuestions).map((question, index) => ({
    ...question,
    id: `q${index + 1}`
  }));

  const badges = [
    { id: "explorer", name: "Penjelajah Doa", description: "Membuka detail materi doa.", symbol: "🧭" },
    { id: "guesser", name: "Jago Tebak", description: "Menjawab lima soal dengan benar.", symbol: "✨" },
    { id: "learner", name: "Bintang Belajar", description: "Menyelesaikan tiga level.", symbol: "⭐" },
    { id: "expert", name: "Ahli Doa Harian", description: "Menyelesaikan kelima level.", symbol: "🌟" },
    { id: "challenger", name: "Juara Tantangan", description: "Menuntaskan satu mini-game.", symbol: "🏅" }
  ];

  const pairs = prayers.filter((prayer) => prayer.situation).map((prayer) => ({
    id: prayer.id, situation: prayer.situation, prayerName: prayer.name, symbol: prayer.symbol, image: prayer.image
  }));

  const wordChallenges = prayers.map((prayer) => ({
    id: `words-${prayer.id}`,
    title: `Susun nama materi: ${prayer.name}`,
    words: prayer.name.split(/\s+/u),
    prayerId: prayer.id
  }));

  const sequences = [
    { id: "bedtime", title: "Bersiap untuk tidur", steps: ["Bersiap untuk beristirahat", "Membaca doa sebelum tidur", "Tidur dengan tenang"] },
    { id: "study", title: "Mulai belajar", steps: ["Menyiapkan buku pelajaran", "Membaca doa memohon ilmu", "Mulai belajar"] },
    { id: "travel", title: "Bersiap bepergian", steps: ["Bersiap untuk berangkat", "Membaca doa yang dipelajari", "Melanjutkan perjalanan dengan hati-hati"] },
    { id: "arrive-home", title: "Pulang ke rumah", steps: ["Sampai di depan rumah", "Membaca doa yang dipelajari", "Masuk dan mengucapkan salam"] },
    { id: "leave-home", title: "Berangkat dari rumah", steps: ["Memastikan barang bawaan siap", "Membaca doa yang dipelajari", "Melangkah keluar rumah"] },
    { id: "mosque-entry", title: "Berkunjung ke masjid", steps: ["Tiba di masjid", "Membaca doa masuk masjid", "Masuk dengan tertib"] },
    { id: "wudu", title: "Menuntaskan wudu", steps: ["Membasuh anggota wudu", "Menyelesaikan wudu dengan tertib", "Membaca zikir setelah wudu"] },
    { id: "rain", title: "Saat hujan turun", steps: ["Melihat hujan mulai turun", "Membaca doa saat hujan", "Bersyukur atas hujan"] },
    { id: "learning", title: "Bersiap belajar", steps: ["Menyiapkan alat belajar", "Membaca doa memohon ilmu", "Mulai belajar dengan tenang"] }
  ];

  function validateData() {
    const prayerIds = new Set(prayers.map((prayer) => prayer.id));
    const questionIds = new Set(questions.map((question) => question.id));
    const promptIds = new Set(questions.map((question) => question.prompt.trim().toLocaleLowerCase("id")));
    const problems = [];
    if (!prayers.length || !questions.length) problems.push("data kosong");
    if (prayerIds.size !== prayers.length) problems.push("id doa tidak unik");
    if (questionIds.size !== questions.length) problems.push("id soal tidak unik");
    if (promptIds.size !== questions.length) problems.push("prompt soal duplikat");
    const requiredPrayerFields = ["name", "category", "image", "arabic", "transliteration", "translation", "situation", "difficulty", "symbol", "source", "verification"];
    prayers.forEach((prayer) => {
      requiredPrayerFields.forEach((field) => {
        if (typeof prayer[field] !== "string" || !prayer[field].trim()) problems.push(`field ${field} kosong: ${prayer.id}`);
      });
      if (typeof prayer.audio !== "string") problems.push("field audio tidak valid: " + prayer.id);
      if (!Number.isInteger(prayer.level) || prayer.level < 1 || prayer.level > 5) problems.push("level doa tidak valid: " + prayer.id);
      if (prayer.verification !== "Perlu verifikasi pendamping") problems.push("status verifikasi tidak valid: " + prayer.id);
      if (!pairs.some((pair) => pair.id === prayer.id)) problems.push("pasangan situasi tidak tersedia: " + prayer.id);
    });
    questions.forEach((q) => {
      if (!questionIds.has(q.id)) problems.push("id soal tidak valid: " + q.id);
      if (!prayerIds.has(q.answer)) problems.push(`jawaban "${q.answer}" tidak valid: ${q.id}`);
      if (!levels.some((level) => level.id === q.level)) problems.push(`level ${q.level} tidak valid: ${q.id}`);
      if (!["situasi", "cerita", "ingat", "arti"].includes(q.kind)) problems.push(`jenis soal tidak valid: ${q.id}`);
      if (!q.prompt || q.prompt.trim().split(/\s+/u).length > 25) problems.push(`prompt kosong atau lebih dari 25 kata: ${q.id}`);
    });
    questions.forEach((question, index) => {
      if (question.id !== `q${index + 1}`) problems.push(`id soal harus berurutan pada: ${question.id}`);
    });
    levels.forEach((level) => {
      const count = questions.filter((question) => question.level === level.id).length;
      if (count < 20) problems.push(`level ${level.id} hanya memiliki ${count} soal; minimal 20`);
    });
    prayers.forEach((prayer) => {
      const related = questions.filter((question) => question.answer === prayer.id);
      const kinds = new Set(related.map((question) => question.kind));
      if (related.length < 4 || kinds.size < 2) problems.push(`doa kurang dari 4 soal atau 2 jenis: ${prayer.id}`);
    });
    wordChallenges.forEach((challenge) => {
      if (!prayerIds.has(challenge.prayerId) || !Array.isArray(challenge.words) || challenge.words.length < 2) problems.push("susun kata tidak valid: " + challenge.id);
    });
    if (new Set(wordChallenges.map((challenge) => challenge.id)).size !== wordChallenges.length) problems.push("id tantangan susun kata tidak unik");
    if (wordChallenges.length < 10) problems.push("tantangan susun kata kurang dari 10");
    sequences.forEach((sequence) => {
      if (!Array.isArray(sequence.steps) || sequence.steps.length < 3) problems.push("urutan memiliki kurang dari 3 langkah: " + sequence.id);
    });
    if (new Set(sequences.map((sequence) => sequence.id)).size !== sequences.length) problems.push("id tantangan susun urutan tidak unik");
    if (sequences.length < 8) problems.push("tantangan susun urutan kurang dari 8");
    if (new Set(pairs.map((pair) => pair.id)).size !== pairs.length) problems.push("id pasangan kartu tidak unik");
    if (prayers.length < 4) problems.push("minimal 4 doa diperlukan untuk pilihan jawaban");
    if (problems.length) throw new Error("Data Tebak Doa tidak konsisten: " + problems.join("; "));
  }

  validateData();
  window.TebakDoaData = Object.freeze({ prayers, levels, questions, badges, pairs, wordChallenges, sequences });
})();
