#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Stats = require('../workout-stats.js');

assert.equal(Stats.normalizeExerciseName('Press (gauche)'), 'Press');
assert.equal(Stats.normalizeExerciseName('Press (right)'), 'Press');
assert.equal(Stats.exerciseKey('Élévation gauche'), Stats.exerciseKey('Elevation droite'));

const details = Stats.buildExerciseStats([
  { name: 'Kettlebell Swing', reps: 15, weightKg: 12, bellCount: 1, duration: 35 },
  { name: 'Goblet Squat', reps: 10, weightKg: 12, bellCount: 1, duration: 35 },
  { name: 'Row par côté', reps: 5, weightKg: 12, bellCount: 1, laterality: 'per-side', duration: 40 },
  { name: 'Pompes au sol', reps: 8, weightKg: null, bellCount: 0, duration: 30 },
]);
assert.equal(details.find(item => item.name === 'Row par côté').estimatedReps, 10);
assert.equal(details.find(item => item.name === 'Pompes au sol').volumeKg, 0);
assert.equal(details.reduce((sum, item) => sum + item.estimatedReps, 0), 43);
assert.equal(details.reduce((sum, item) => sum + item.volumeKg, 0), 420);

const doubled = Stats.buildExerciseStats([
  { name: 'Kettlebell Swing', reps: 15, weightKg: 12, bellCount: 1, duration: 35 },
], { repeats: 3 });
assert.equal(doubled[0].occurrences, 3);
assert.equal(doubled[0].estimatedReps, 45);
assert.equal(doubled[0].volumeKg, 540);

const merged = Stats.mergeExerciseStats(details, doubled);
assert.equal(merged.find(item => item.name === 'Kettlebell Swing').estimatedReps, 60);
const mergedBodyweight = merged.find(item => item.name === 'Pompes au sol');
assert.equal(mergedBodyweight.weightKg, null);
assert.equal(mergedBodyweight.bellCount, 0);
assert.equal(mergedBodyweight.volumeKg, 0);

const legacy = {
  date: '2026-08-01T10:00:00.000Z', duration: 15, mode: 'Circuit', modeId: 'circuit',
  exercises: ['Press (gauche)', 'Press (droite)', 'Goblet Squat'],
};
const detailed = {
  date: '2026-08-03T10:00:00.000Z', duration: 20, mode: 'AMRAP', modeId: 'amrap',
  exercises: ['Kettlebell Swing', 'Goblet Squat', 'Row par côté', 'Pompes au sol'],
  exerciseStats: details,
};
const summary = Stats.summarize([legacy, detailed]);
assert.equal(summary.totalSessions, 2);
assert.equal(summary.totalMinutes, 35);
assert.equal(summary.exerciseExposures, 6);
assert.equal(summary.uniqueExercises, 5);
assert.equal(summary.detailedSessions, 1);
assert.equal(summary.estimatedReps, 43);
assert.equal(summary.totalVolumeKg, 420);
assert.equal(summary.modeStats.length, 2);
assert.equal(summary.exerciseStats.find(item => item.name === 'Press').sessions, 1);
const summarizedBodyweight = summary.exerciseStats.find(item => item.name === 'Pompes au sol');
assert.equal(summarizedBodyweight.weightKg, null);
assert.equal(summarizedBodyweight.bellCount, 0);
assert.equal(summarizedBodyweight.volumeKg, 0);

const legacyOnly = Stats.summarize([legacy]);
assert.equal(legacyOnly.estimatedReps, null);
assert.equal(legacyOnly.totalVolumeKg, null);
assert.equal(legacyOnly.detailedSessions, 0);

console.log(JSON.stringify({
  ok: true,
  checks: {
    sideNormalization: true,
    perSideRepsAndBodyweightExclusion: true,
    plannedLoadCalculation: true,
    repeatedRunnerRounds: true,
    legacyMetricsWithoutInventedLoad: true,
    detailedCoverage: true,
  },
}, null, 2));
