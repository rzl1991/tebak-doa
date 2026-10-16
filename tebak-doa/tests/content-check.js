"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const questionsPath = path.join(__dirname, "..", "js", "questions.js");
const source = fs.readFileSync(questionsPath, "utf8");
const sandbox = { window: {} };

vm.runInNewContext(source, sandbox, { filename: questionsPath });

const { prayers, questions, pairs, wordChallenges, sequences } = sandbox.window.TebakDoaData;
const unique = (items) => new Set(items).size === items.length;

assert.ok(prayers.length >= 24, `Expected at least 24 prayers; got ${prayers.length}.`);
assert.ok(questions.length >= 100, `Expected at least 100 questions; got ${questions.length}.`);
assert.ok(unique(prayers.map(({ id }) => id)), "Prayer IDs must be unique.");
assert.ok(unique(questions.map(({ id }) => id)), "Question IDs must be unique.");
assert.ok(unique(questions.map(({ prompt }) => prompt)), "Question prompts must be unique.");

const prayerIds = new Set(prayers.map(({ id }) => id));
const questionCounts = new Map();
const prayerKinds = new Map();

for (const [index, question] of questions.entries()) {
  assert.equal(question.id, `q${index + 1}`, `Question IDs must be sequential; got ${question.id}.`);
  assert.ok(prayerIds.has(question.answer), `${question.id} has an unknown answer: ${question.answer}.`);
  assert.ok(question.prompt.trim(), `${question.id} has an empty prompt.`);
  assert.ok(question.prompt.trim().split(/\s+/u).length <= 25, `${question.id} exceeds 25 words.`);
  assert.ok(question.level >= 1 && question.level <= 5, `${question.id} has invalid level ${question.level}.`);
  questionCounts.set(question.level, (questionCounts.get(question.level) || 0) + 1);
  const kinds = prayerKinds.get(question.answer) || new Set();
  kinds.add(question.kind);
  prayerKinds.set(question.answer, kinds);
}

for (let level = 1; level <= 5; level += 1) {
  assert.ok((questionCounts.get(level) || 0) >= 20, `Level ${level} has fewer than 20 questions.`);
}

const sortedIds = (ids) => Array.from(ids).sort();
const basicPrayerIds = ["sebelum-makan", "sesudah-makan", "sebelum-tidur", "bangun-tidur"];
const dailyPrayerIds = [
  "sebelum-makan", "sesudah-makan", "sebelum-tidur", "bangun-tidur",
  "sebelum-belajar", "masuk-rumah", "keluar-rumah", "bepergian",
  "masuk-kamar-mandi", "keluar-kamar-mandi", "masuk-masjid", "keluar-masjid",
  "setelah-wudu", "ketika-bersin", "saat-hujan", "setelah-hujan"
];
for (const [level, expectedIds] of [[1, basicPrayerIds], [2, dailyPrayerIds], [3, prayers.map(({ id }) => id)], [5, prayers.map(({ id }) => id)]]) {
  const actualIds = new Set(questions.filter((question) => question.level === level).map(({ answer }) => answer));
  assert.deepEqual(sortedIds(actualIds), sortedIds(expectedIds), `Level ${level} prayer coverage does not match its learning goal.`);
}

const finalLevelKinds = new Set(questions.filter(({ level }) => level === 5).map(({ kind }) => kind));
assert.ok(finalLevelKinds.size >= 3, "Level 5 should mix question kinds.");
assert.ok(questions.filter(({ id, level }) => Number(id.slice(1)) > 20 && level === 3).every(({ kind }) => kind === "cerita"), "New Level 3 questions must be stories.");

for (const prayer of prayers) {
  const count = questions.filter(({ answer }) => answer === prayer.id).length;
  assert.ok(count >= 4, `${prayer.id} is an answer to fewer than four questions.`);
  assert.ok((prayerKinds.get(prayer.id) || new Set()).size >= 2, `${prayer.id} has fewer than two question kinds.`);
  assert.ok(Number.isInteger(prayer.level) && prayer.level >= 1 && prayer.level <= 5, `${prayer.id} has an invalid level.`);
  for (const field of ["name", "category", "image", "arabic", "transliteration", "translation", "situation", "difficulty", "symbol", "source", "verification"]) {
    assert.ok(typeof prayer[field] === "string" && prayer[field].trim(), `${prayer.id} is missing ${field}.`);
  }
  assert.equal(prayer.audio, "", `${prayer.id} audio must remain an empty string until a local recording is provided.`);
}

assert.ok(wordChallenges.length >= 10, "Expected at least 10 word challenges.");
for (const challenge of wordChallenges) {
  assert.ok(prayerIds.has(challenge.prayerId), `${challenge.id} refers to unknown prayer ${challenge.prayerId}.`);
}

assert.ok(sequences.length >= 8, "Expected at least 8 sequences.");
for (const sequence of sequences) {
  assert.ok(sequence.steps.length >= 3, `${sequence.id} has fewer than three steps.`);
}

const expectedPairIds = prayers.filter(({ situation }) => situation).map(({ id }) => id).sort();
const actualPairIds = pairs.map(({ id }) => id).sort();
assert.deepEqual(actualPairIds, expectedPairIds, "Pairs must cover every prayer with a situation.");

console.log(`Content checks passed: ${prayers.length} prayers, ${questions.length} questions, ${pairs.length} pairs, ${wordChallenges.length} word challenges, ${sequences.length} sequences.`);
