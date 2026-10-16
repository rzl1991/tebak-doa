(function () {
  "use strict";

  const data = window.TebakDoaData;
  const progressStore = window.TebakDoaProgress;
  const root = document.getElementById("app");
  const headerPoints = document.getElementById("header-points");
  const QUESTIONS_PER_SESSION = 8;
  if (!data || !progressStore) {
    const message = document.createElement("p");
    message.className = "inline-note warning-note";
    message.textContent = "Data permainan tidak dapat dimuat. Pastikan folder js/ lengkap dan tidak ada kesalahan pada data soal, lalu muat ulang halaman.";
    root.append(message);
    return;
  }
  const state = { page: "home", prayerId: null, game: null, notice: "", category: "Semua", shown: null };
  const icons = { situation: "💭", picture: "🖼️", match: "🃏", words: "🔤", order: "🔢" };
  let prayerAudio = null;
  let activeAudioPrayerId = null;

  progressStore.loadProgress();

  function element(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = text;
    return item;
  }

  function stopPrayerAudio() {
    if (prayerAudio) {
      prayerAudio.pause();
      prayerAudio.currentTime = 0;
    }
    prayerAudio = null;
    activeAudioPrayerId = null;
  }

  function togglePrayerAudio(replay) {
    const prayer = data.prayers.find((item) => item.id === state.prayerId);
    if (!prayer || !prayer.audio) {
      state.notice = "Audio bacaan belum tersedia. Tambahkan berkas audio lokal untuk doa ini terlebih dahulu.";
      render();
      return;
    }
    if (activeAudioPrayerId === prayer.id && prayerAudio) {
      if (replay) prayerAudio.currentTime = 0;
      if (prayerAudio.paused || replay) {
        prayerAudio.play().then(() => {
          state.notice = "Audio bacaan sedang diputar.";
          render();
        }).catch((error) => {
          console.warn("Audio bacaan tidak dapat diputar.", error);
          state.notice = "Audio tidak dapat diputar. Periksa format dan lokasi berkas lokal.";
          render();
        });
      } else {
        prayerAudio.pause();
        state.notice = "Audio dijeda.";
        render();
      }
      return;
    }
    stopPrayerAudio();
    prayerAudio = new Audio(prayer.audio);
    activeAudioPrayerId = prayer.id;
    prayerAudio.volume = progressStore.getProgress().settings.volume;
    prayerAudio.addEventListener("ended", () => {
      state.notice = "Audio selesai. Kamu bisa memutarnya lagi.";
      render();
    }, { once: true });
    prayerAudio.addEventListener("error", () => {
      state.notice = "Audio tidak dapat ditemukan atau formatnya tidak didukung.";
      render();
    }, { once: true });
    togglePrayerAudio(replay);
  }

  function button(text, action, className, attributes) {
    const item = element("button", className || "button button-secondary", text);
    item.type = "button";
    item.dataset.action = action;
    if (attributes) {
      Object.keys(attributes).forEach((key) => {
        if (key === "disabled") item.disabled = attributes[key];
        else item.setAttribute(key, attributes[key]);
      });
    }
    return item;
  }

  function panel(className) {
    return element("section", className);
  }

  function render() {
    const progress = progressStore.getProgress();
    headerPoints.textContent = String(progress.totalPoints);
    document.body.classList.toggle("reduce-motion", !progress.settings.animationsEnabled);
    root.replaceChildren();
    if (state.page === "home") renderHome();
    else if (state.page === "levels") renderLevels();
    else if (state.page === "materials") renderMaterials();
    else if (state.page === "material") renderMaterial();
    else if (state.page === "guide") renderGuide();
    else if (state.page === "settings") renderSettings();
    else if (state.page === "quiz") renderQuiz();
    else if (state.page === "mini") renderMiniGame();
    else if (state.page === "minigames") renderMiniStart();
    else if (state.page === "result") renderResult();
    else if (state.page === "progress") renderProgress();
    if (state.shown !== state.page) {
      state.shown = state.page;
      window.scrollTo(0, 0);
      const main = document.getElementById("main");
      if (main) main.focus({ preventScroll: true });
    }
  }

  function renderHome() {
    const progress = progressStore.getProgress();
    const summary = progressStore.getProgressSummary();
    const hero = panel("hero");
    const copy = element("div", "hero-copy");
    copy.append(element("p", "eyebrow", "Halo, penjelajah!"));
    copy.append(element("h1", "", "Belajar doa, bermain dengan gembira!"));
    copy.append(element("p", "hero-intro", "Kenali doa sehari-hari lewat cerita, kuis, dan permainan seru."));
    const actions = element("div", "hero-actions");
    actions.append(button("Mulai bermain", "play-next", "button button-primary"));
    actions.append(button("Belajar doa", "materials", "button button-secondary"));
    actions.append(button("Pilih level", "levels", "button button-secondary"));
    actions.append(button("Progres saya", "progress", "button button-secondary"));
    copy.append(actions);
    const mascot = element("div", "mascot-wrap");
    const image = element("img", "mascot");
    image.src = "assets/images/characters/mascot.svg";
    image.alt = "Maskot bintang ceria Tebak Doa";
    mascot.append(image, element("span", "mascot-caption", "Ayo, kita belajar!"));
    hero.append(copy, mascot);
    root.append(hero);

    if (!summary.storageAvailable) {
      root.append(element("p", "inline-note warning-note", "Penyimpanan browser tidak tersedia. Kamu tetap bisa bermain, tetapi progres mungkin tidak tersimpan."));
    }

    const stats = element("section", "stats-grid");
    stats.append(statCard("⭐", "Total poin", String(summary.totalPoints)));
    stats.append(statCard("🗺️", "Level terbuka", `${progress.highestUnlockedLevel} dari 5`));
    stats.append(statCard("🏅", "Badge", String(summary.earnedBadges)));
    if (progress.lastResult) stats.append(statCard("🕘", "Skor terakhir", String(progress.lastResult.score)));
    root.append(stats);

    const section = panel("home-lower");
    const heading = element("div", "section-heading");
    heading.append(element("div", "", ""));
    heading.firstChild.append(element("p", "eyebrow", "PILIH PETUALANGAN"));
    heading.firstChild.append(element("h2", "", "Mau belajar apa hari ini?"));
    heading.append(button("Panduan", "guide", "text-button"));
    section.append(heading);
    const tiles = element("div", "adventure-grid");
    [
      ["📖", "Ruang materi", "Baca doa dan pelajari situasinya.", "materials"],
      ["🎮", "Mini-game", "Belajar lewat lima permainan seru.", "minigames"],
      ["📈", "Progres saya", "Lihat level, skor terbaik, dan lencana.", "progress"],
      ["🧭", "Panduan", "Cari tahu cara bermain dan mengumpulkan poin.", "guide"]
    ].forEach((item) => {
      const card = element("article", "adventure-card");
      card.append(element("span", "adventure-icon", item[0]));
      card.append(element("h3", "", item[1]));
      card.append(element("p", "", item[2]));
      card.append(button("Buka", item[3], "button button-small"));
      tiles.append(card);
    });
    section.append(tiles);
    root.append(section);

    if (progress.earnedBadges.length) {
      const earned = panel("badges-section");
      earned.append(element("h2", "", "Badge yang kamu dapatkan"));
      earned.append(badgeList(progress.earnedBadges));
      root.append(earned);
    }
  }

  function statCard(symbol, label, value) {
    const card = element("article", "stat-card");
    card.append(element("span", "stat-symbol", symbol));
    const text = element("div", "");
    text.append(element("span", "stat-label", label), element("strong", "stat-value", value));
    card.append(text);
    return card;
  }

  function renderProgress() {
    const progress = progressStore.getProgress();
    const page = pageShell("Progres saya", "Lihat perkembangan belajarmu.", "home");
    const done = progress.completedLevels.length;
    const total = data.levels.length;
    const summary = element("article", "question-card");
    summary.append(element("h2", "", `${done} dari ${total} level selesai`));
    const track = element("div", "progress-track");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", "Level selesai");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(total));
    track.setAttribute("aria-valuenow", String(done));
    const fill = element("span", "progress-fill");
    fill.style.width = `${(done / total) * 100}%`;
    track.append(fill);
    summary.append(track);
    summary.append(element("p", "card-description", done === 0 ? "Ayo mulai dari Level 1. Pelan-pelan saja, kamu pasti bisa!" : done < total ? "Bagus! Teruskan, level berikutnya sudah menunggu." : "Luar biasa! Semua level sudah selesai. Ulangi lagi supaya makin ingat."));
    if (progress.lastResult) summary.append(element("p", "best-score", `Permainan terakhir: ${progress.lastResult.title} (${progress.lastResult.score} poin)`));
    page.append(summary);
    const stats = element("section", "stats-grid");
    stats.append(statCard("⭐", "Total poin", String(progress.totalPoints)), statCard("✅", "Jawaban benar", String(progress.correctAnswers)), statCard("🎮", "Permainan selesai", String(progress.gamesCompleted || 0)), statCard("🏆", "Skor terbaik sesi", String(progress.bestSession || 0)));
    page.append(stats);
    const levelBox = element("article", "question-card");
    levelBox.append(element("h2", "", "Level"));
    const list = element("ul", "level-progress");
    data.levels.forEach((level) => {
      const status = progress.completedLevels.includes(level.id) ? "selesai" : level.id <= progress.highestUnlockedLevel ? "terbuka" : "terkunci";
      list.append(element("li", "", `${level.symbol} Level ${level.id}, ${level.name}: ${status}. Skor terbaik ${progress.bestScores[level.id] || 0}.`));
    });
    levelBox.append(list);
    page.append(levelBox);
    const badgeBox = element("article", "question-card");
    badgeBox.append(element("h2", "", "Lencana"));
    const badges = element("div", "badge-list");
    data.badges.forEach((badge) => {
      const earned = progress.earnedBadges.includes(badge.id);
      const item = element("article", `badge-item${earned ? "" : " is-locked"}`);
      const text = element("div", "");
      text.append(element("strong", "", badge.name), element("small", "", earned ? badge.description : `Cara mendapatkan: ${badge.description}`));
      item.append(element("span", "badge-symbol", earned ? badge.symbol : "🔒"), text);
      badges.append(item);
    });
    badgeBox.append(badges);
    page.append(badgeBox);
    root.append(page);
  }

  function renderLevels() {
    const progress = progressStore.getProgress();
    const page = pageShell("Pilih level", "Jawab minimal setengah soal dengan benar untuk menyelesaikan level dan membuka level berikutnya.", "home");
    const cards = element("div", "level-grid");
    data.levels.forEach((level) => {
      const unlocked = level.id <= progress.highestUnlockedLevel;
      const completed = progress.completedLevels.includes(level.id);
      const card = element("article", `level-card${unlocked ? "" : " is-locked"}${completed ? " is-complete" : ""}`);
      const top = element("div", "level-card-top");
      top.append(element("span", "level-symbol", level.symbol));
      top.append(element("span", `status-pill ${completed ? "status-done" : unlocked ? "status-open" : "status-locked"}`, completed ? "Selesai" : unlocked ? "Terbuka" : "Terkunci"));
      card.append(top, element("p", "eyebrow", `LEVEL ${level.id}`), element("h2", "", level.name), element("p", "card-description", level.description));
      card.append(element("p", "best-score", `Skor terbaik: ${progress.bestScores[level.id] || 0}`));
      if (!unlocked) card.append(element("p", "lock-note", `🔒 Selesaikan Level ${level.id - 1} dulu.`));
      card.append(button(unlocked ? (completed ? "Main lagi" : "Mulai level") : "Selesaikan level sebelumnya", `start-level:${level.id}`, "button button-primary", { disabled: !unlocked }));
      cards.append(card);
    });
    page.append(cards);
    root.append(page);
  }

  function renderMaterials() {
    const page = pageShell("Ruang materi", "Pilih doa untuk melihat bacaan, arti, dan situasi penggunaannya.", "home");
    const chips = element("div", "chip-row");
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "Kategori doa");
    ["Semua", ...new Set(data.prayers.map((item) => item.category))].forEach((name) => {
      const active = state.category === name;
      chips.append(button(name, `filter:${name}`, `chip${active ? " is-active" : ""}`, { "aria-pressed": String(active) }));
    });
    page.append(chips);
    const grid = element("div", "material-grid");
    data.prayers.filter((item) => state.category === "Semua" || item.category === state.category).forEach((prayer) => {
      const card = element("article", "material-card");
      const image = element("img", "scene-illustration");
      image.src = prayer.image;
      image.alt = `Ilustrasi ${prayer.category.toLowerCase()} untuk ${prayer.name}`;
      card.append(image);
      card.append(element("p", "eyebrow", prayer.category));
      card.append(element("h2", "", prayer.name));
      card.append(element("p", "card-description", prayer.situation));
      card.append(button("Pelajari doa", `material:${prayer.id}`, "button button-secondary"));
      grid.append(card);
    });
    page.append(grid);
    root.append(page);
  }

  function renderMaterial() {
    const prayer = data.prayers.find((item) => item.id === state.prayerId);
    if (!prayer) {
      state.page = "materials";
      renderMaterials();
      return;
    }
    const page = pageShell(prayer.name, prayer.situation, "materials");
    const card = element("article", "prayer-detail");
    const image = element("img", "detail-illustration");
    image.src = prayer.image;
    image.alt = `Ilustrasi ${prayer.category.toLowerCase()} untuk ${prayer.name}`;
    card.append(image);
    card.append(element("span", "status-pill status-review", prayer.verification));
    card.append(element("p", "eyebrow detail-category", prayer.category));
    card.append(element("p", "arabic-text", prayer.arabic));
    card.lastChild.setAttribute("lang", "ar");
    card.lastChild.setAttribute("dir", "rtl");
    card.append(element("p", "detail-label", "Transliterasi"));
    card.append(element("p", "detail-text", prayer.transliteration));
    card.append(element("p", "detail-label", "Arti"));
    card.append(element("p", "detail-text", prayer.translation));
    card.append(element("p", "detail-label", "Kapan dibaca?"));
    card.append(element("p", "detail-text", prayer.situation));
    card.append(element("p", "source-note", `Rujukan awal: ${prayer.source}`));
    card.append(element("p", "inline-note warning-note", "Bacaan ini belum ditinjau sebagai materi final. Mohon verifikasi teks Arab, transliterasi, dan artinya bersama guru agama atau pendamping."));
    const controls = element("div", "button-row");
    const audioButtonLabel = activeAudioPrayerId === prayer.id && prayerAudio && !prayerAudio.paused
      ? "⏸ Jeda bacaan"
      : activeAudioPrayerId === prayer.id && prayerAudio
        ? "▶ Lanjutkan bacaan"
        : "▶ Dengarkan bacaan";
    controls.append(button(audioButtonLabel, "play-prayer", "button button-primary"));
    controls.append(button("↻ Ulangi audio", "replay-prayer", "button button-secondary"));
    controls.append(button("Doa sebelumnya", "previous-prayer", "button button-secondary"));
    controls.append(button("Doa berikutnya", "next-prayer", "button button-secondary"));
    card.append(controls);
    if (state.notice) card.append(element("p", "inline-note info-note", state.notice));
    page.append(card);
    root.append(page);
  }

  function renderGuide() {
    const page = pageShell("Panduan bermain", "Belajar pelan-pelan. Tidak apa-apa kalau perlu mencoba lagi!", "home");
    const list = element("div", "guide-grid");
    [
      ["1", "Pilih petualangan", "Mulai dari Level 1. Level selanjutnya terbuka setelah level sebelumnya selesai."],
      ["2", "Baca pertanyaan", "Pilih satu jawaban. Kalau belum tepat, baca petunjuk dan coba lagi tanpa kehilangan poin."],
      ["3", "Kumpulkan poin", "Jawaban benar memberi 10 poin. Menyelesaikan level memberi bonus 20 poin."],
      ["4", "Coba mini-game", "Tebak gambar, tebak situasi, cocokkan kartu, susun kata, atau urutkan langkah."],
      ["5", "Dapatkan badge", "Badge diberikan setelah memenuhi pencapaian, misalnya lima jawaban benar atau menyelesaikan mini-game."],
      ["6", "Simpan progres", "Progres tersimpan di browser dan perangkat ini saja. Audio doa belum tersedia sampai file lokal ditambahkan."]
    ].forEach((item) => {
      const card = element("article", "guide-card");
      card.append(element("span", "guide-number", item[0]), element("h2", "", item[1]), element("p", "", item[2]));
      list.append(card);
    });
    page.append(list);
    root.append(page);
  }

  function renderSettings() {
    const settings = progressStore.getProgress().settings;
    const page = pageShell("Pengaturan", "Atur pengalaman bermainmu.", "home");
    const card = element("section", "settings-card");
    card.append(settingToggle("Suara", "soundEnabled", settings.soundEnabled, "Efek suara dibuat oleh browser; tidak ada audio otomatis."));
    card.append(settingToggle("Animasi tambahan", "animationsEnabled", settings.animationsEnabled, "Matikan jika kamu lebih nyaman tanpa gerakan."));
    const volumeRow = element("label", "setting-row");
    const volumeText = element("span", "setting-copy");
    volumeText.append(element("strong", "", "Volume"), element("small", "", "Atur keras suara efek."));
    volumeRow.append(volumeText);
    const volume = element("input", "volume-slider");
    volume.type = "range";
    volume.min = "0";
    volume.max = "100";
    volume.value = String(Math.round(settings.volume * 100));
    volume.dataset.setting = "volume";
    volume.setAttribute("aria-label", "Volume suara");
    volumeRow.append(volume, element("output", "volume-output", `${volume.value}%`));
    card.append(volumeRow);
    card.append(settingToggle("Simpan progres di perangkat ini", "saveEnabled", settings.saveEnabled, "Nonaktifkan untuk berhenti menyimpan progres setelah perubahan ini."));
    card.append(element("p", "inline-note info-note", "Tidak ada data pribadi yang disimpan atau dikirim. Progres tidak tersinkron ke perangkat lain."));
    card.append(button("Reset progres", "reset-progress", "button button-danger"));
    if (state.notice) card.append(element("p", "inline-note info-note", state.notice));
    page.append(card);
    root.append(page);
  }

  function settingToggle(label, setting, checked, description) {
    const row = element("label", "setting-row");
    const copy = element("span", "setting-copy");
    copy.append(element("strong", "", label), element("small", "", description));
    const toggle = element("input", "toggle-input");
    toggle.type = "checkbox";
    toggle.checked = checked;
    toggle.dataset.setting = setting;
    toggle.setAttribute("aria-label", label);
    row.append(copy, toggle);
    return row;
  }

  function startQuiz(level, mode) {
    const questionPool = data.questions.filter((question) =>
      mode === "picture" ? question.level <= 2 :
        mode === "situation" ? ["cerita", "situasi"].includes(question.kind) :
          question.level === level
    );
    const seenPictureAnswers = new Set();
    const availableQuestions = mode === "picture" ? questionPool.filter((question) => {
      if (seenPictureAnswers.has(question.answer)) return false;
      seenPictureAnswers.add(question.answer);
      return true;
    }) : questionPool;
    const questions = shuffle(availableQuestions).slice(0, QUESTIONS_PER_SESSION);
    if (!questions.length) {
      setNotice("Soal untuk permainan ini belum tersedia.");
      return;
    }
    state.game = {
      mode: mode || "quiz", level, questions: shuffle(questions),
      index: 0, score: 0, correct: 0, wrong: 0, answered: false, picked: null, options: null, lastCorrect: false,
      message: "", newlyEarned: []
    };
    state.page = "quiz";
    state.notice = "";
    render();
  }

  function renderQuiz() {
    const game = state.game;
    if (!game) {
      state.page = "levels";
      renderLevels();
      return;
    }
    if (game.index >= game.questions.length) {
      finishQuiz();
      return;
    }
    const question = game.questions[game.index];
    const page = pageShell(game.mode === "picture" ? "Tebak Gambar" : game.mode === "situation" ? "Tebak Situasi" : data.levels[game.level - 1].name, "Pilih jawaban yang paling sesuai.", null);
    page.classList.add("game-page");
    const bar = element("div", "game-toolbar");
    bar.append(element("span", "status-pill status-open", `Soal ${game.index + 1} dari ${game.questions.length}`));
    bar.append(element("span", "status-pill status-points", `Poin sesi: ${game.score}`));
    bar.append(button("Mulai ulang", "restart-quiz", "button button-small button-secondary"));
    bar.append(button("Keluar", "exit-game", "button button-small button-secondary"));
    page.append(bar);
    const progressBar = element("div", "progress-track");
    const fill = element("span", "progress-fill");
    fill.style.width = `${((game.index + 1) / game.questions.length) * 100}%`;
    progressBar.append(fill);
    page.append(progressBar);

    const card = element("article", "question-card");
    if (game.mode === "picture") {
      const prayer = data.prayers.find((item) => item.id === question.answer);
      const image = element("img", "quiz-illustration");
      image.src = prayer.image;
      image.alt = `Ilustrasi untuk situasi: ${prayer.situation}`;
      card.append(image);
      card.append(element("p", "eyebrow", "SITUASI"));
      card.append(element("p", "question-prompt", prayer.situation));
    } else {
      card.append(element("p", "eyebrow", question.kind === "cerita" ? "CERITA" : question.kind === "arti" ? "ARTI DOA" : "TEBAK DOA"));
      card.append(element("h2", "question-prompt", question.prompt));
    }
    const answers = element("div", "answer-list");
    if (!game.options) game.options = getOptions(question);
    game.options.forEach((prayer) => {
      const mark = game.answered && prayer.id === question.answer ? " answer-correct" : game.answered && prayer.id === game.picked ? " answer-picked" : "";
      const option = button(prayer.name, `answer:${prayer.id}`, `answer-option${mark}`, { disabled: game.answered });
      option.setAttribute("aria-pressed", game.answered && prayer.id === question.answer ? "true" : "false");
      answers.append(option);
    });
    card.append(answers);
    if (game.message) {
      const feedback = element("div", `feedback ${game.lastCorrect ? "feedback-good" : "feedback-try"}`, game.message);
      feedback.setAttribute("role", "status");
      card.append(feedback);
      if (game.answered) {
        const right = data.prayers.find((item) => item.id === question.answer);
        const recap = element("div", "recap-card");
        const arabic = element("p", "arabic-text arabic-small", right.arabic);
        arabic.setAttribute("lang", "ar");
        arabic.setAttribute("dir", "rtl");
        recap.append(element("p", "detail-label", `Jawaban tepat: ${right.name}`), arabic, element("p", "detail-text", right.transliteration), element("p", "detail-text", `Artinya: ${right.translation}`));
        card.append(recap);
        card.append(button(game.index + 1 >= game.questions.length ? "Lihat hasil" : "Lanjut", "next-question", "button button-primary"));
      }
    }
    page.append(card);
    root.append(page);
  }

  function getOptions(question) {
    const correct = data.prayers.find((prayer) => prayer.id === question.answer);
    const others = shuffle(data.prayers.filter((prayer) => prayer.id !== question.answer)).slice(0, 3);
    return shuffle([correct, ...others]);
  }

  function answerQuestion(id) {
    const game = state.game;
    if (!game || game.answered) return;
    const question = game.questions[game.index];
    if (!data.prayers.some((prayer) => prayer.id === id)) return;
    game.answered = true;
    game.picked = id;
    game.lastCorrect = id === question.answer;
    if (!game.lastCorrect) {
      game.wrong += 1;
      game.message = "Hampir! Salah itu bagian dari belajar. Ini jawaban yang tepat:";
      playEffect(false);
    } else {
      game.correct += 1;
      game.score += 10;
      const prayer = data.prayers.find((item) => item.id === question.answer);
      game.message = `Hebat! Jawabanmu benar. ${prayer.situation} Kamu mendapat 10 poin!`;
      progressStore.addPoints(10);
      progressStore.recordCorrectAnswer();
      maybeAwardBadge("guesser", progressStore.getProgress().correctAnswers >= 5, game.newlyEarned);
      playEffect(true);
    }
    render();
  }

  function nextQuestion() {
    if (!state.game || !state.game.answered) return;
    state.game.index += 1;
    state.game.answered = false;
    state.game.picked = null;
    state.game.options = null;
    state.game.message = "";
    if (state.game.index >= state.game.questions.length) finishQuiz();
    else render();
  }

  function finishQuiz() {
    const game = state.game;
    if (!game || game.finished) return;
    game.finished = true;
    const total = game.questions.length;
    const ratio = total ? game.correct / total : 0;
    const stars = ratio === 1 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
    const base = { score: game.score, correct: game.correct, total, stars, badges: game.newlyEarned };
    const summary = `Kamu menjawab ${game.correct} dari ${total} soal dengan benar.`;
    if (game.mode !== "quiz") {
      maybeAwardBadge("challenger", true, game.newlyEarned);
      state.result = { ...base, title: game.mode === "picture" ? "Tebak Gambar selesai!" : "Tebak Situasi selesai!", detail: `${summary} Kamu mendapat ${game.score} poin.`, replay: `mini:${game.mode}` };
    } else if (stars > 0) {
      const first = !progressStore.getProgress().completedLevels.includes(game.level);
      const bonus = first ? 20 : 0;
      game.score += bonus;
      progressStore.completeLevel(game.level, game.score, bonus);
      maybeAwardBadge("learner", progressStore.getProgress().completedLevels.length >= 3, game.newlyEarned);
      maybeAwardBadge("expert", progressStore.getProgress().completedLevels.length === 5, game.newlyEarned);
      state.result = { ...base, score: game.score, title: "Level selesai!", level: game.level, passed: true, replay: `start-level:${game.level}`,
        detail: `${summary} ${bonus ? "Bonus penyelesaian pertama: 20 poin." : "Bonus hanya diberikan saat pertama kali menyelesaikan level."}` };
    } else {
      progressStore.updateBestScore(game.level, game.score);
      state.result = { ...base, title: "Sedikit lagi!", level: game.level, passed: false, replay: `start-level:${game.level}`,
        detail: `${summary} Jawab minimal ${Math.ceil(total / 2)} soal dengan benar untuk menyelesaikan level. Baca materinya, lalu coba lagi ya!` };
    }
    progressStore.recordGame({ title: state.result.title, score: state.result.score });
    state.game = null;
    state.page = "result";
    render();
  }

  function renderMiniGame() {
    const game = state.game;
    if (!game) {
      state.page = "home";
      renderHome();
      return;
    }
    if (game.kind === "match") renderMatchGame(game);
    else if (game.kind === "words") renderWordGame(game);
    else if (game.kind === "order") renderOrderGame(game);
  }

  function startMini(kind) {
    state.notice = "";
    if (kind === "match") {
      const pairCount = Math.min(data.pairs.length, 4 + Math.floor(Math.random() * 3));
      const selectedPairs = shuffle(data.pairs).slice(0, pairCount);
      const cards = shuffle(selectedPairs.flatMap((pair) => [
        { pairId: pair.id, side: "situation", text: pair.situation, symbol: pair.symbol, image: pair.image },
        { pairId: pair.id, side: "name", text: pair.prayerName, symbol: "💡" }
      ])).map((card, index) => ({ ...card, key: `card-${index}` }));
      state.game = { kind, pairs: selectedPairs, cards, selected: [], matched: [], score: 0, message: "" };
    } else if (kind === "words") {
      const challengeCount = Math.min(data.wordChallenges.length, 3 + Math.floor(Math.random() * 2));
      state.game = { kind, challenges: shuffle(data.wordChallenges).slice(0, challengeCount), index: 0, selected: [], score: 0, message: "", checked: false, completed: false };
      loadWordChallenge(state.game);
    } else if (kind === "order") {
      const challengeCount = Math.min(data.sequences.length, 3 + Math.floor(Math.random() * 2));
      state.game = { kind, challenges: shuffle(data.sequences).slice(0, challengeCount), index: 0, score: 0, message: "", completed: false };
      loadSequence(state.game);
    }
    state.page = "mini";
    render();
  }

  function renderMiniStart() {
    const page = pageShell("Mini-game", "Pilih satu permainan. Setiap permainan dapat dimainkan dengan tombol.", "home");
    const grid = element("div", "minigame-grid");
    [
      ["picture", "Tebak Gambar", "Lihat situasi, pilih doa yang tepat."],
      ["situation", "Tebak Situasi", "Baca cerita sehari-hari, pilih doa yang cocok."],
      ["match", "Cocokkan Kartu", "Pasangkan situasi dengan nama doanya."],
      ["words", "Susun Kata", "Susun kata menjadi nama doa."],
      ["order", "Susun Urutan", "Atur langkah kegiatan dengan urutan yang benar."]
    ].forEach(([kind, title, description]) => {
      const card = element("article", "minigame-card");
      card.append(element("span", "adventure-icon", icons[kind]), element("h2", "", title), element("p", "", description));
      card.append(button("Mainkan", `mini:${kind}`, "button button-primary"));
      grid.append(card);
    });
    page.append(grid);
    root.append(page);
  }

  function renderMatchGame(game) {
    const page = pageShell("Cocokkan Kartu", "Pilih satu situasi dan satu nama doa yang saling sesuai.", "minigames");
    const matchedCount = game.matched.length;
    page.append(gameToolbar(`${game.pairs.length - matchedCount} pasangan tersisa`, game.score));
    const grid = element("div", "match-grid");
    game.cards.forEach((card) => {
      const matched = game.matched.includes(card.pairId);
      const selected = game.selected.includes(card.key);
      const item = button("", `match:${card.key}`, `match-card${matched ? " is-matched" : ""}${selected ? " is-selected" : ""}`, { disabled: matched });
      if (card.side === "situation") {
        const image = element("img", "match-illustration");
        image.src = card.image;
        image.alt = "";
        item.append(image);
      } else {
        item.append(element("span", "match-symbol", card.symbol));
      }
      item.append(element("span", "", card.text));
      item.setAttribute("aria-pressed", String(selected));
      grid.append(item);
    });
    page.append(grid);
    if (game.message) page.append(element("p", "inline-note info-note", game.message));
    if (matchedCount === game.pairs.length) page.append(button("Selesai", "finish-match", "button button-primary"));
    root.append(page);
  }

  function selectMatchCard(key) {
    const game = state.game;
    if (!game || game.kind !== "match") return;
    const card = game.cards.find((item) => item.key === key);
    if (!card || game.matched.includes(card.pairId)) return;
    if (game.selected.includes(key)) {
      game.selected = game.selected.filter((item) => item !== key);
      render();
      return;
    }
    if (game.selected.length === 2) game.selected = [];
    game.selected.push(key);
    game.message = "";
    if (game.selected.length === 2) {
      const first = game.cards.find((item) => item.key === game.selected[0]);
      const second = game.cards.find((item) => item.key === game.selected[1]);
      if (first.pairId === second.pairId && first.side !== second.side) {
        game.matched.push(first.pairId);
        game.score += 10;
        progressStore.addPoints(10);
        game.message = "Pasangan cocok! Bagus sekali.";
        playEffect(true);
      } else {
        game.message = "Belum cocok. Pilih satu situasi dan satu nama doa.";
        playEffect(false);
      }
    }
    render();
  }

  function finishMatch() {
    const game = state.game;
    if (!game || game.kind !== "match" || game.matched.length !== game.pairs.length) return;
    completeMini(game.score, `${game.pairs.length} pasangan berhasil ditemukan.`);
  }

  function loadWordChallenge(game) {
    const challenge = game.challenges[game.index];
    if (!challenge) {
      game.completed = true;
      return;
    }
    game.challenge = challenge;
    game.order = shuffle(challenge.words.map((word, index) => ({ id: `${challenge.id}-${index}`, text: word })));
    game.selected = [];
    game.checked = false;
    game.message = "";
  }

  function renderWordGame(game) {
    const page = pageShell("Susun Kata", "Pilih kata satu per satu untuk menyusun nama doa. Kata yang dipilih bisa diketuk lagi untuk mengembalikannya.", "minigames");
    if (!game.challenge) loadWordChallenge(game);
    page.append(gameToolbar(`Tantangan ${game.index + 1} dari ${game.challenges.length}`, game.score));
    const card = element("article", "question-card");
    card.append(element("h2", "", game.challenge.title));
    const selected = element("div", "word-drop-zone");
    selected.setAttribute("aria-label", "Kata yang sudah disusun");
    if (!game.selected.length) selected.append(element("span", "muted-copy", "Ketuk kata di bawah untuk menyusunnya."));
    game.selected.forEach((word) => {
      selected.append(button(word.text, `word-remove:${word.id}`, "word-chip is-selected"));
    });
    card.append(selected);
    const pool = element("div", "word-pool");
    game.order.filter((word) => !game.selected.some((item) => item.id === word.id)).forEach((word) => {
      pool.append(button(word.text, `word-add:${word.id}`, "word-chip"));
    });
    card.append(pool);
    if (game.message) card.append(element("p", "inline-note info-note", game.message));
    const actions = element("div", "button-row");
    actions.append(button("Hapus susunan", "word-clear", "button button-secondary"));
    actions.append(button("Periksa jawaban", "word-check", "button button-primary", { disabled: game.checked }));
    if (game.checked) actions.append(button(game.index + 1 === game.challenges.length ? "Selesai" : "Lanjut", "word-next", "button button-primary"));
    card.append(actions);
    page.append(card);
    root.append(page);
  }

  function handleWordAction(action) {
    const game = state.game;
    if (!game || game.kind !== "words" || game.checked) return;
    if (action.startsWith("word-add:")) {
      const id = action.slice(9);
      const word = game.order.find((item) => item.id === id && !game.selected.some((selected) => selected.id === id));
      if (word) game.selected.push(word);
    } else if (action.startsWith("word-remove:")) {
      const id = action.slice(12);
      game.selected = game.selected.filter((word) => word.id !== id);
    } else if (action === "word-clear") {
      game.selected = [];
      game.message = "";
    } else if (action === "word-check") {
      const expected = game.challenge.words.join(" ");
      const answer = game.selected.map((word) => word.text).join(" ");
      if (answer === expected) {
        game.checked = true;
        game.score += 10;
        progressStore.addPoints(10);
        game.message = "Tepat! Susunan katamu benar.";
        playEffect(true);
      } else {
        game.message = "Belum tepat. Kamu boleh menyusun ulang dan mencoba lagi.";
        playEffect(false);
      }
    }
    render();
  }

  function advanceWordGame() {
    const game = state.game;
    if (!game || game.kind !== "words" || !game.checked) return;
    game.index += 1;
    if (game.index >= game.challenges.length) completeMini(game.score, "Semua tantangan susun kata selesai.");
    else {
      loadWordChallenge(game);
      render();
    }
  }

  function loadSequence(game) {
    const challenge = game.challenges[game.index];
    if (!challenge) {
      game.completed = true;
      return;
    }
    game.challenge = challenge;
    game.steps = shuffle(challenge.steps.map((text, index) => ({ id: `${challenge.id}-${index}`, text })));
    game.message = "";
    game.checked = false;
  }

  function renderOrderGame(game) {
    const page = pageShell("Susun Urutan", "Gunakan tombol Naik dan Turun untuk menyusun langkah, lalu periksa jawaban.", "minigames");
    if (!game.challenge) loadSequence(game);
    page.append(gameToolbar(`Aktivitas ${game.index + 1} dari ${game.challenges.length}`, game.score));
    const card = element("article", "question-card");
    card.append(element("h2", "", game.challenge.title));
    const list = element("ol", "sequence-list");
    game.steps.forEach((step, index) => {
      const row = element("li", "sequence-row");
      row.append(element("span", "sequence-text", step.text));
      const controls = element("span", "sequence-controls");
      controls.append(button("Naik", `step-up:${index}`, "button button-small button-secondary", { disabled: game.checked || index === 0 }));
      controls.append(button("Turun", `step-down:${index}`, "button button-small button-secondary", { disabled: game.checked || index === game.steps.length - 1 }));
      row.append(controls);
      list.append(row);
    });
    card.append(list);
    if (game.message) card.append(element("p", "inline-note info-note", game.message));
    if (!game.checked) card.append(button("Periksa urutan", "sequence-check", "button button-primary"));
    else card.append(button(game.index + 1 === game.challenges.length ? "Selesai" : "Lanjut", "sequence-next", "button button-primary"));
    page.append(card);
    root.append(page);
  }

  function handleSequenceAction(action) {
    const game = state.game;
    if (!game || game.kind !== "order" || game.checked) return;
    const match = action.match(/^step-(up|down):(\d+)$/);
    if (match) {
      const index = Number(match[2]);
      const target = match[1] === "up" ? index - 1 : index + 1;
      if (target >= 0 && target < game.steps.length) {
        [game.steps[index], game.steps[target]] = [game.steps[target], game.steps[index]];
      }
    } else if (action === "sequence-check") {
      const expected = game.challenge.steps;
      const actual = game.steps.map((step) => step.text);
      if (actual.every((step, index) => step === expected[index])) {
        game.checked = true;
        game.score += 10;
        progressStore.addPoints(10);
        game.message = "Urutannya tepat! Kerja bagus.";
        playEffect(true);
      } else {
        game.message = "Belum tepat. Coba pikirkan langkah dari awal kegiatan.";
        playEffect(false);
      }
    }
    render();
  }

  function advanceSequence() {
    const game = state.game;
    if (!game || game.kind !== "order" || !game.checked) return;
    game.index += 1;
    if (game.index >= game.challenges.length) completeMini(game.score, "Semua aktivitas berhasil diurutkan.");
    else {
      loadSequence(game);
      render();
    }
  }

  function completeMini(score, detail) {
    const game = state.game;
    if (!game || game.finished) return;
    game.finished = true;
    const newlyEarned = [];
    maybeAwardBadge("challenger", true, newlyEarned);
    state.result = { title: "Mini-game selesai!", detail: `${detail} Kamu mendapat ${score} poin.`, score, badges: newlyEarned, replay: `mini:${game.kind}` };
    progressStore.recordGame({ title: state.result.title, score });
    state.game = null;
    state.page = "result";
    render();
  }

  function renderResult() {
    const result = state.result || { title: "Selesai!", detail: "", score: 0, badges: [] };
    const page = pageShell("Hasil permainan", "", "home");
    page.classList.add("result-wrap");
    const card = element("section", "result-card");
    card.append(element("span", "result-star", "🌟"), element("p", "eyebrow", result.passed === false ? "TERUS SEMANGAT" : "KERJA HEBAT"), element("h1", "", result.title), element("p", "hero-intro", result.detail));
    if (result.score !== undefined) card.append(statCard("⭐", "Poin sesi", String(result.score)));
    if (result.total) {
      const stars = element("p", "star-row", "★".repeat(result.stars) + "☆".repeat(3 - result.stars));
      stars.setAttribute("aria-label", `${result.stars} dari 3 bintang`);
      card.append(stars);
    }
    if (result.level && result.passed) {
      card.append(element("p", "inline-note success-note", `Level ${result.level} selesai. Level ${Math.min(result.level + 1, 5)} sekarang ${result.level === 5 ? "sudah terbuka" : "terbuka untuk dimainkan"}!`));
    }
    if (result.badges && result.badges.length) {
      const badgeNames = result.badges.map((id) => data.badges.find((badge) => badge.id === id)).filter(Boolean);
      card.append(element("h2", "", "Badge baru!"));
      card.append(badgeList(badgeNames.map((badge) => badge.id)));
    }
    const actions = element("div", "button-row button-row-centered");
    if (result.replay) actions.append(button(result.passed === false ? "Coba lagi" : "Main lagi", result.replay, "button button-secondary"));
    actions.append(button("Pilih level", "levels", "button button-primary"));
    actions.append(button("Progres saya", "progress", "button button-secondary"));
    actions.append(button("Kembali ke beranda", "home", "button button-secondary"));
    card.append(actions);
    page.append(card);
    root.append(page);
  }

  function badgeList(ids) {
    const list = element("div", "badge-list");
    ids.forEach((id) => {
      const badge = data.badges.find((item) => item.id === id);
      if (!badge) return;
      const item = element("article", "badge-item");
      const image = element("img", "badge-art");
      image.src = "assets/images/badges/star.svg";
      image.alt = `Badge ${badge.name}`;
      item.append(image, element("div", "", ""));
      item.lastChild.append(element("strong", "", badge.name), element("small", "", badge.description));
      list.append(item);
    });
    return list;
  }

  function maybeAwardBadge(id, condition, earnedThisSession) {
    if (!condition || !progressStore.unlockBadge(id)) return;
    earnedThisSession.push(id);
    playEffect(true);
  }

  function gameToolbar(label, score) {
    const bar = element("div", "game-toolbar");
    bar.append(element("span", "status-pill status-open", label));
    bar.append(element("span", "status-pill status-points", `Poin sesi: ${score}`));
    if (state.game && state.game.kind) bar.append(button("Mulai ulang", `restart-mini:${state.game.kind}`, "button button-small button-secondary"));
    return bar;
  }

  function pageShell(title, subtitle, backAction) {
    const page = element("section", "page-shell");
    const header = element("div", "page-heading");
    const titleBox = element("div", "");
    titleBox.append(element("h1", "", title));
    if (subtitle) titleBox.append(element("p", "page-subtitle", subtitle));
    header.append(titleBox);
    if (backAction) header.append(button("← Kembali", backAction, "button button-secondary button-small"));
    page.append(header);
    return page;
  }

  function shuffle(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function movePrayer(offset) {
    stopPrayerAudio();
    const index = data.prayers.findIndex((prayer) => prayer.id === state.prayerId);
    const next = (index + offset + data.prayers.length) % data.prayers.length;
    state.prayerId = data.prayers[next].id;
    state.notice = "";
    render();
  }

  function playEffect(correct) {
    const settings = progressStore.getProgress().settings;
    if (!settings.soundEnabled || settings.volume === 0) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = correct ? 660 : 330;
      gain.gain.value = settings.volume * 0.08;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
      oscillator.onended = () => context.close();
    } catch (error) {
      console.warn("Efek suara tidak dapat diputar.", error);
    }
  }

  function handleAction(action) {
    if (action === "home") {
      if (state.game && !window.confirm("Keluar dari permainan ini? Progres jawaban pada sesi ini tidak akan disimpan.")) return;
      stopPrayerAudio();
      state.game = null;
      state.page = "home";
      state.notice = "";
    } else if (action === "levels") {
      stopPrayerAudio();
      state.page = "levels";
      state.notice = "";
    } else if (action === "materials") {
      stopPrayerAudio();
      state.page = "materials";
      state.notice = "";
    } else if (action === "guide") {
      stopPrayerAudio();
      state.page = "guide";
    } else if (action === "settings") {
      stopPrayerAudio();
      state.page = "settings";
      state.notice = "";
    } else if (action === "progress") {
      stopPrayerAudio();
      state.page = "progress";
      state.notice = "";
    } else if (action === "play-next") {
      const current = progressStore.getProgress();
      const next = data.levels.find((level) => !current.completedLevels.includes(level.id) && level.id <= current.highestUnlockedLevel) || data.levels[0];
      startQuiz(next.id, "quiz");
    } else if (action.startsWith("filter:")) {
      state.category = action.slice(7);
    } else if (action === "restart-quiz") {
      if (state.game && state.game.mode) startQuiz(state.game.level, state.game.mode);
    } else if (action.startsWith("restart-mini:")) {
      startMini(action.slice(13));
    } else if (action === "minigames") {
      stopPrayerAudio();
      state.page = "minigames";
      state.notice = "";
    } else if (action.startsWith("start-level:")) {
      const level = Number(action.slice(12));
      if (Number.isInteger(level) && level <= progressStore.getProgress().highestUnlockedLevel) startQuiz(level, "quiz");
    } else if (action.startsWith("material:")) {
      stopPrayerAudio();
      const id = action.slice(9);
      if (!data.prayers.some((prayer) => prayer.id === id)) return;
      state.prayerId = id;
      state.page = "material";
      state.notice = "";
      maybeAwardBadge("explorer", true, []);
    } else if (action === "play-prayer") {
      togglePrayerAudio(false);
      return;
    } else if (action === "replay-prayer") {
      togglePrayerAudio(true);
      return;
    } else if (action === "previous-prayer") movePrayer(-1);
    else if (action === "next-prayer") movePrayer(1);
    else if (action === "exit-game") {
      if (window.confirm("Keluar dari permainan ini? Poin yang sudah didapat tetap tersimpan, tetapi sesi ini akan berakhir.")) {
        state.game = null;
        state.page = "levels";
      }
    } else if (action === "next-question") nextQuestion();
    else if (action.startsWith("answer:")) answerQuestion(action.slice(7));
    else if (action.startsWith("mini:")) {
      const kind = action.slice(5);
      if (kind === "picture") startQuiz(1, "picture");
      else if (kind === "situation") startQuiz(1, "situation");
      else if (["match", "words", "order"].includes(kind)) startMini(kind);
    } else if (action.startsWith("match:")) selectMatchCard(action.slice(6));
    else if (action === "finish-match") finishMatch();
    else if (action.startsWith("word-add:") || action.startsWith("word-remove:") || action.startsWith("word-clear") || action === "word-check") handleWordAction(action);
    else if (action === "word-next") advanceWordGame();
    else if (action.startsWith("step-") || action === "sequence-check") handleSequenceAction(action);
    else if (action === "sequence-next") advanceSequence();
    else if (action === "reset-progress") {
      if (window.confirm("Hapus poin, level selesai, badge, dan pengaturan Tebak Doa yang tersimpan di browser ini?")) {
        progressStore.resetProgress();
        state.notice = "Progres Tebak Doa sudah direset.";
      }
    }
    render();
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (target && !target.disabled) handleAction(target.dataset.action);
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (target && !root.contains(target) && !target.disabled) handleAction(target.dataset.action);
  }, true);

  root.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-setting]")) {
      const setting = target.dataset.setting;
      const value = setting === "volume" ? Number(target.value) / 100 : target.checked;
      progressStore.updateSettings({ [setting]: value });
      if (setting === "soundEnabled" && !value && prayerAudio) stopPrayerAudio();
      if (setting === "volume" && prayerAudio) prayerAudio.volume = value;
      if (setting === "volume") target.nextElementSibling.textContent = `${target.value}%`;
      state.notice = setting === "saveEnabled" && !value ? "Penyimpanan dimatikan. Pilihan ini berlaku untuk penggunaan berikutnya." : "Pengaturan diperbarui.";
      render();
    }
  });

  function initialize() {
    render();
  }

  initialize();
})();
