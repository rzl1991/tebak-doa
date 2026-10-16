TEBAK DOA — DATA MATERI DAN SOAL
================================

Tentang aplikasi
----------------
Game edukasi doa sehari-hari untuk anak 6–12 tahun. Aplikasi memakai HTML,
CSS, dan JavaScript biasa tanpa framework, backend, basis data, CDN, atau API
yang diperlukan saat bermain. Progres tetap disimpan lokal di browser sesuai
pengaturan pengguna.

Isi saat ini
------------
- 24 materi doa/ucapan, termasuk 8 materi awal dan 16 tambahan.
- 132 soal pilihan ganda: 20 soal Level 1, 20 Level 2, 28 Level 3,
  28 Level 4, dan 36 Level 5. ID berurutan q1 sampai q132.
- Lima level tetap dipakai. Satu sesi mengambil acak paling banyak 8 soal unik.
- Setiap materi menjadi jawaban pada sedikitnya 4 soal dan sedikitnya 2 jenis
  pertanyaan. Level 1 khusus empat doa dasar; Level 2 berfokus pada aktivitas
  harian; Level 3–5 memperluas cerita, arti, dan ingatan.
- 24 pasangan situasi-nama doa.
- 24 tantangan susun nama doa.
- 9 tantangan susun urutan, masing-masing sedikitnya 3 langkah.
- Tiap permainan cocokkan kartu memilih acak 4–6 pasangan; susun kata dan susun
  urutan memilih acak 3–4 tantangan.

Cara menjalankan
----------------
Buka index.html dengan browser modern. Materi dan ilustrasi lokal tersedia
offline. Audio bacaan doa belum disertakan; aplikasi menyampaikan kondisi ini
secara jelas dan tidak berpura-pura memutar rekaman.

Sumber materi tambahan
----------------------
Seluruh materi tambahan tetap berstatus "Perlu verifikasi pendamping".

Riwayat hadis:
- Masuk kamar mandi: Sahih al-Bukhari, doa sebelum masuk kamar mandi.
- Keluar kamar mandi: Sunan Abi Dawud, doa setelah keluar; status riwayat
  secara khusus perlu ditinjau guru/pendamping.
- Masuk dan keluar masjid: Sahih Muslim, doa masuk dan keluar masjid.
- Setelah wudu: Sahih Muslim, kesaksian setelah menyempurnakan wudu.
- Setelah bersin: Sahih al-Bukhari, adab orang yang bersin.
- Hujan turun dan syukur setelah hujan: Sahih al-Bukhari.
- Memohon petunjuk, takwa, kesucian diri, dan kecukupan: Sahih Muslim.
Penomoran hadis sengaja tidak dicantumkan pada materi baru karena penomoran
berbeda antar-edisi dan perlu diperiksa pada edisi yang dipakai pendamping.

Ayat Al-Qur'an:
- Doa untuk orang tua: Al-Isra (17): 24.
- Doa Nabi Musa memohon kelapangan dan kemudahan: Taha (20): 25–28.
- Doa Nabi Yunus: Al-Anbiya (21): 87.
- Ampunan untuk diri, orang tua, dan orang beriman: Ibrahim (14): 41.
- Kebaikan keluarga: Al-Furqan (25): 74.
- Permohonan kebaikan Nabi Musa: Al-Qasas (28): 24.
- Keteguhan hati dan rahmat: Ali 'Imran (3): 8.

Pemeriksaan sumber awal dilakukan terhadap teks ayat di Quran.com dan
API AlQuran.cloud serta koleksi hadis yang disebut di atas. Pemeriksaan ini
bukan fatwa atau pengesahan materi pendidikan. Guru agama tetap perlu
memeriksa teks Arab/harakat, transliterasi, arti, konteks ayat/hadis, dan
penilaian riwayat sebelum materi dipakai mengajar.

Doa yang tidak ditambahkan
--------------------------
Doa bercermin dan doa berpakaian tidak dimasukkan karena saya tidak memastikan
redaksi atau rujukannya dengan tingkat keyakinan yang diminta. Doa lain yang
redaksi/rujukannya meragukan juga dilewati, bukan diganti dengan teks rekaan.

Menambah materi dan soal
------------------------
1. Tambahkan satu objek doa ke array `prayers` di `js/questions.js`. Pertahankan
   skema yang sudah dipakai: id, name, category, image, arabic, transliteration,
   translation, situation, level, difficulty, symbol, audio, source, verification.
   Gunakan id unik, path gambar lokal, isi audio dengan string kosong jika belum
   ada rekaman, dan biarkan status verifikasi sebagai "Perlu verifikasi pendamping".
2. Tambahkan entri ke `questionContexts` dengan id yang sama serta konteks
   `moment`, `story`, `target`, dan `meaning` yang jelas. Atur juga kelayakan
   konteksnya untuk `dailyPrayerIds` atau `basicLevelPrompts`. Generator memberi
   sedikitnya empat soal yang sesuai dengan tingkat belajar, dengan ID lanjutan
   otomatis. Tinjau tiap prompt agar satu jawaban saja yang benar, kalimatnya
   tidak lebih dari 25 kata, dan konteks/arti tidak membocorkan nama jawaban.
3. Data validasi saat ini mensyaratkan sedikitnya 20 soal untuk setiap level,
   setidaknya 4 soal dan 2 jenis bagi setiap doa, ID soal berurutan, serta
   identitas unik. Setelah mengubah skema, tinjau `validateData()` dan jalankan
   kembali uji konten.
4. `pairs` dan `wordChallenges` dibuat dari daftar doa. Tantangan susun kata
   mengacak kata dari nama doa berbahasa Indonesia, bukan huruf atau teks Arab.
5. Tambahkan tantangan baru pada `sequences` bila ingin variasi aktivitas
   urutan; setiap tantangan harus mempunyai sekurangnya tiga langkah.

Cara kerja sesi
---------------
- Kuis mengambil soal acak dan membatasi sesi menjadi 8 pertanyaan. Jika
  tersedia kurang dari 8 soal, seluruh soal yang tersedia digunakan.
- Level lulus jika sekurangnya setengah soal sesi dijawab benar. Jawaban
  salah tidak memberi poin. Jawaban benar memberi 10 poin; bonus 20 poin
  hanya diberikan pada penyelesaian level pertama kali.
- Mini-game memilih sebagian tantangan secara acak, supaya sesi tetap singkat.

Ilustrasi dan audio
------------------
Ilustrasi SVG berada di `assets/images/situations/`; semua gambar tambahan
disimpan lokal. Rekaman doa belum disediakan. Tambahkan hanya berkas audio
lokal dengan hak pakai yang jelas lalu perbarui properti `audio` pada materi.

Pengujian pengembang
--------------------
Jalankan `node --check js/questions.js`, `node --check js/app.js`, dan
`node --check js/progress.js` jika Node.js tersedia. Jalankan pula
`node tests/content-check.js` untuk memeriksa jumlah, sebaran, referensi,
keunikan, batas panjang prompt, dan cakupan data mini-game.

Uji juga aplikasi di browser: kuis delapan soal, syarat lulus/buka level,
semua mini-game, penyimpanan, tampilan mobile/desktop, dan seluruh teks Arab.
Jangan menganggap status "Perlu verifikasi pendamping" sebagai pengganti
pemeriksaan guru.
