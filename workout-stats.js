(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KettlebellWorkoutStats = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SIDE_SUFFIXES = [
    /\s*\((?:g|d|gauche|droite|left|right)\)\s*$/i,
    /\s+(?:gauche|droite|left|right)\s*$/i,
  ];

  function normalizeExerciseName(value) {
    let name = String(value || '').replace(/\s+/g, ' ').trim();
    for (const suffix of SIDE_SUFFIXES) name = name.replace(suffix, '').trim();
    return name;
  }

  function exerciseKey(value) {
    return normalizeExerciseName(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('fr');
  }

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function roundOne(value) {
    return Math.round(value * 10) / 10;
  }

  /**
   * Turns the actual work steps prepared by the timer into an intentionally
   * conservative estimate. A missing load or rep target never creates volume.
   */
  function buildExerciseStats(workSteps, options = {}) {
    const repeats = Math.max(0, Math.floor(finite(options.repeats, 1)));
    const steps = Array.isArray(workSteps) ? workSteps.filter(step => step && step.name) : [];
    const grouped = new Map();

    for (let repeat = 0; repeat < repeats; repeat++) {
      for (const step of steps) {
        const name = normalizeExerciseName(step.name);
        const key = exerciseKey(name);
        if (!key) continue;
        const repsPerSet = Math.max(0, finite(step.reps));
        // A per-side target describes the target for one side. Alternating
        // targets already describe the total and must not be doubled.
        const reps = repsPerSet * (step.laterality === 'per-side' ? 2 : 1);
        const hasRecordedWeight = step.weightKg !== null && step.weightKg !== undefined && step.weightKg !== '';
        const weightKg = hasRecordedWeight && Number.isFinite(Number(step.weightKg)) ? Number(step.weightKg) : null;
        const bellCount = Math.max(0, Math.floor(finite(step.bellCount)));
        const workSeconds = Math.max(0, finite(step.duration));
        const volumeKg = reps > 0 && weightKg !== null && bellCount > 0
          ? reps * weightKg * bellCount
          : 0;
        const current = grouped.get(key) || {
          key,
          name,
          occurrences: 0,
          sets: 0,
          estimatedReps: 0,
          weightKg,
          bellCount,
          workSeconds: 0,
          volumeKg: 0,
          estimated: true,
        };
        current.occurrences += 1;
        current.sets += 1;
        current.estimatedReps += reps;
        current.workSeconds += workSeconds;
        current.volumeKg += volumeKg;
        if (current.weightKg === null && weightKg !== null) current.weightKg = weightKg;
        current.bellCount = Math.max(current.bellCount, bellCount);
        grouped.set(key, current);
      }
    }

    return [...grouped.values()].map(item => ({
      ...item,
      estimatedReps: Math.round(item.estimatedReps),
      workSeconds: Math.round(item.workSeconds),
      volumeKg: roundOne(item.volumeKg),
    }));
  }

  function mergeExerciseStats(...collections) {
    const grouped = new Map();
    for (const detail of collections.flat().filter(Boolean)) {
      const name = normalizeExerciseName(detail.name);
      const key = exerciseKey(name || detail.key);
      if (!key) continue;
      const current = grouped.get(key) || {
        key, name, occurrences: 0, sets: 0, estimatedReps: 0,
        weightKg: null, bellCount: 0, workSeconds: 0, volumeKg: 0, estimated: true,
      };
      current.occurrences += Math.max(0, finite(detail.occurrences ?? detail.sets));
      current.sets += Math.max(0, finite(detail.sets ?? detail.occurrences));
      current.estimatedReps += Math.max(0, finite(detail.estimatedReps));
      current.workSeconds += Math.max(0, finite(detail.workSeconds));
      current.volumeKg += Math.max(0, finite(detail.volumeKg));
      const hasRecordedWeight = detail.weightKg !== null && detail.weightKg !== undefined && detail.weightKg !== '';
      if (current.weightKg === null && hasRecordedWeight && Number.isFinite(Number(detail.weightKg))) {
        current.weightKg = Number(detail.weightKg);
      }
      current.bellCount = Math.max(current.bellCount, Math.max(0, finite(detail.bellCount)));
      grouped.set(key, current);
    }
    return [...grouped.values()].map(item => ({
      ...item,
      estimatedReps: Math.round(item.estimatedReps),
      workSeconds: Math.round(item.workSeconds),
      volumeKg: roundOne(item.volumeKg),
    }));
  }

  function summarize(sessions) {
    const history = Array.isArray(sessions) ? sessions.filter(Boolean) : [];
    const exercises = new Map();
    const modes = new Map();
    const activeDays = new Set();
    let totalMinutes = 0;
    let exerciseExposures = 0;
    let detailedSessions = 0;
    let estimatedReps = 0;
    let totalVolumeKg = 0;
    let detailedWorkSeconds = 0;
    let longestSessionMinutes = 0;

    for (const session of history) {
      const duration = Math.max(0, finite(session.duration));
      totalMinutes += duration;
      longestSessionMinutes = Math.max(longestSessionMinutes, duration);
      const parsedDate = new Date(session.date);
      if (!Number.isNaN(parsedDate.getTime())) activeDays.add(parsedDate.toISOString().slice(0, 10));

      const modeKey = String(session.modeId || session.mode || 'other');
      const mode = modes.get(modeKey) || {
        key: modeKey,
        label: String(session.mode || session.modeId || modeKey),
        count: 0,
        minutes: 0,
      };
      mode.count += 1;
      mode.minutes += duration;
      modes.set(modeKey, mode);

      // Legacy frequency is deliberately session-based: seeing Swing three
      // times in one circuit still counts as one session featuring Swing.
      const sessionNames = new Map();
      for (const rawName of Array.isArray(session.exercises) ? session.exercises : []) {
        const name = normalizeExerciseName(rawName);
        const key = exerciseKey(name);
        if (key && !sessionNames.has(key)) sessionNames.set(key, name);
      }
      exerciseExposures += sessionNames.size;
      for (const [key, name] of sessionNames) {
        const item = exercises.get(key) || {
          key, name, sessions: 0, occurrences: 0, estimatedReps: 0,
          weightKg: null, bellCount: 0, volumeKg: 0,
        };
        item.sessions += 1;
        exercises.set(key, item);
      }

      const details = Array.isArray(session.exerciseStats) ? session.exerciseStats : null;
      if (details) {
        detailedSessions += 1;
        for (const detail of details) {
          const name = normalizeExerciseName(detail.name);
          const key = exerciseKey(name || detail.key);
          if (!key) continue;
          const item = exercises.get(key) || {
            key, name, sessions: 0, occurrences: 0, estimatedReps: 0,
            weightKg: null, bellCount: 0, volumeKg: 0,
          };
          const detailReps = Math.max(0, finite(detail.estimatedReps));
          const detailVolume = Math.max(0, finite(detail.volumeKg));
          item.occurrences += Math.max(0, finite(detail.occurrences ?? detail.sets));
          item.estimatedReps += detailReps;
          const hasRecordedWeight = detail.weightKg !== null && detail.weightKg !== undefined && detail.weightKg !== '';
          if (item.weightKg === null && hasRecordedWeight && Number.isFinite(Number(detail.weightKg))) {
            item.weightKg = Number(detail.weightKg);
          }
          item.bellCount = Math.max(item.bellCount, Math.max(0, finite(detail.bellCount)));
          item.volumeKg += detailVolume;
          exercises.set(key, item);
          estimatedReps += detailReps;
          totalVolumeKg += detailVolume;
          detailedWorkSeconds += Math.max(0, finite(detail.workSeconds));
        }
      }
    }

    const exerciseStats = [...exercises.values()]
      .map(item => ({ ...item, volumeKg: roundOne(item.volumeKg) }))
      .sort((a, b) => b.sessions - a.sessions || b.occurrences - a.occurrences || a.name.localeCompare(b.name));
    const modeStats = [...modes.values()]
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    return {
      totalSessions: history.length,
      totalMinutes: Math.round(totalMinutes),
      exerciseExposures,
      uniqueExercises: exercises.size,
      favoriteExercise: exerciseStats[0] || null,
      exerciseStats,
      modeStats,
      detailedSessions,
      detailedCoverage: { detailed: detailedSessions, total: history.length },
      estimatedReps: detailedSessions ? Math.round(estimatedReps) : null,
      totalVolumeKg: detailedSessions ? Math.round(totalVolumeKg) : null,
      detailedWorkSeconds: detailedSessions ? Math.round(detailedWorkSeconds) : null,
      activeDays: activeDays.size,
      longestSessionMinutes: Math.round(longestSessionMinutes),
      averageExercisesPerSession: history.length ? roundOne(exerciseExposures / history.length) : 0,
    };
  }

  return {
    normalizeExerciseName,
    exerciseKey,
    buildExerciseStats,
    mergeExerciseStats,
    // Backward-compatible alias for early local prototypes.
    buildExerciseDetails: buildExerciseStats,
    summarize,
  };
});
