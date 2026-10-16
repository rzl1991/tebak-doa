(function () {
  "use strict";

  const STORAGE_KEY = "tebak-doa.progress.v1";
  const defaults = {
    version: 1, totalPoints: 0, highestUnlockedLevel: 1,
    completedLevels: [], bestScores: {}, earnedBadges: [],
    correctAnswers: 0, gamesCompleted: 0, bestSession: 0, lastResult: null,
    settings: { soundEnabled: false, volume: 0.65, animationsEnabled: true, saveEnabled: true }
  };
  let progress = clone(defaults);
  let storageAvailable = true;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isValidProgress(value) {
    const completed = value && Array.isArray(value.completedLevels) ? value.completedLevels : [];
    const scores = value && value.bestScores && typeof value.bestScores === "object" ? value.bestScores : {};
    const knownBadges = ["explorer", "guesser", "learner", "expert", "challenger"];
    const completedIsValid = Array.isArray(value && value.completedLevels) &&
      completed.length <= 5 &&
      completed.every((level) => Number.isInteger(level) && level >= 1 && level <= 5) &&
      new Set(completed).size === completed.length &&
      completed.slice().sort((a, b) => a - b).every((level, index) => level === index + 1);
    const expectedUnlocked = completedIsValid ? Math.min(5, completed.length + 1) : 0;
    return value && value.version === 1 &&
      Number.isFinite(value.totalPoints) && value.totalPoints >= 0 &&
      Number.isInteger(value.highestUnlockedLevel) && value.highestUnlockedLevel >= 1 && value.highestUnlockedLevel <= 5 &&
      completedIsValid &&
      value.highestUnlockedLevel === expectedUnlocked &&
      value.bestScores && typeof value.bestScores === "object" && !Array.isArray(value.bestScores) &&
      Object.keys(scores).every((level) => ["1", "2", "3", "4", "5"].includes(level) && Number.isFinite(scores[level]) && scores[level] >= 0) &&
      Array.isArray(value.earnedBadges) && value.earnedBadges.every((badge) => knownBadges.includes(badge)) &&
      Number.isInteger(value.correctAnswers) && value.correctAnswers >= 0 &&
      (value.gamesCompleted === undefined || (Number.isInteger(value.gamesCompleted) && value.gamesCompleted >= 0)) &&
      (value.bestSession === undefined || (Number.isFinite(value.bestSession) && value.bestSession >= 0)) &&
      (value.lastResult == null || (typeof value.lastResult === "object" && typeof value.lastResult.title === "string")) &&
      value.settings && typeof value.settings === "object" &&
      typeof value.settings.soundEnabled === "boolean" &&
      typeof value.settings.animationsEnabled === "boolean" &&
      typeof value.settings.saveEnabled === "boolean" &&
      Number.isFinite(value.settings.volume) && value.settings.volume >= 0 && value.settings.volume <= 1;
  }

  function saveProgress() {
    if (!progress.settings.saveEnabled) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      storageAvailable = true;
      return true;
    } catch (error) {
      storageAvailable = false;
      console.warn("Progres tidak dapat disimpan pada perangkat ini.", error);
      return false;
    }
  }

  function loadProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        progress = clone(defaults);
        storageAvailable = true;
      } else {
        const parsed = JSON.parse(stored);
        if (isValidProgress(parsed)) {
          progress = { ...clone(defaults), ...parsed, settings: { ...defaults.settings, ...parsed.settings } };
          storageAvailable = true;
        } else {
          console.warn("Data progres tidak valid; progres baru digunakan.");
          progress = clone(defaults);
          storageAvailable = false;
        }
      }
    } catch (error) {
      console.warn("Progres tidak dapat dibaca; progres baru digunakan.", error);
      progress = clone(defaults);
      storageAvailable = false;
    }
    return getProgress();
  }

  function getProgress() {
    return clone(progress);
  }

  function resetProgress() {
    progress = clone(defaults);
    try {
      localStorage.removeItem(STORAGE_KEY);
      storageAvailable = true;
    } catch (error) {
      storageAvailable = false;
      console.warn("Data tersimpan tidak dapat dihapus dari browser.", error);
    }
    return getProgress();
  }

  function updateBestScore(level, score) {
    if (!Number.isInteger(level) || level < 1 || level > 5 || !Number.isFinite(score) || score < 0) return false;
    progress.bestScores[level] = Math.max(progress.bestScores[level] || 0, score);
    saveProgress();
    return true;
  }

  function completeLevel(level, score, earnedPoints) {
    if (!Number.isInteger(level) || level < 1 || level > 5 || level > progress.highestUnlockedLevel || !Number.isFinite(score) || score < 0) return false;
    const first = !progress.completedLevels.includes(level);
    if (first) progress.completedLevels.push(level);
    progress.completedLevels.sort((a, b) => a - b);
    progress.highestUnlockedLevel = Math.max(progress.highestUnlockedLevel, Math.min(5, level + 1));
    if (first) progress.totalPoints += Math.max(0, Math.floor(earnedPoints));
    updateBestScore(level, score);
    saveProgress();
    return true;
  }

  function addPoints(points) {
    if (!Number.isFinite(points) || points < 0) return false;
    progress.totalPoints += Math.floor(points);
    saveProgress();
    return true;
  }

  function recordCorrectAnswer() {
    progress.correctAnswers += 1;
    saveProgress();
  }

  function recordGame(result) {
    const score = Number.isFinite(result && result.score) ? Math.max(0, result.score) : 0;
    progress.gamesCompleted = (progress.gamesCompleted || 0) + 1;
    progress.bestSession = Math.max(progress.bestSession || 0, score);
    progress.lastResult = { title: String((result && result.title) || "Permainan"), score };
    saveProgress();
  }

  function unlockBadge(id) {
    if (typeof id !== "string" || progress.earnedBadges.includes(id)) return false;
    progress.earnedBadges.push(id);
    saveProgress();
    return true;
  }

  function updateSettings(settings) {
    progress.settings = { ...progress.settings, ...settings };
    if (progress.settings.saveEnabled) {
      saveProgress();
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        storageAvailable = true;
      } catch (error) {
        storageAvailable = false;
        console.warn("Preferensi penyimpanan tidak dapat disimpan.", error);
      }
    }
    return getProgress();
  }

  function getProgressSummary() {
    return {
      totalPoints: progress.totalPoints,
      highestUnlockedLevel: progress.highestUnlockedLevel,
      completedLevels: progress.completedLevels.length,
      earnedBadges: progress.earnedBadges.length,
      storageAvailable
    };
  }

  window.TebakDoaProgress = Object.freeze({
    loadProgress, getProgress, getProgressSummary, saveProgress, resetProgress,
    completeLevel, updateBestScore, addPoints, recordCorrectAnswer, recordGame, unlockBadge, updateSettings
  });
})();
