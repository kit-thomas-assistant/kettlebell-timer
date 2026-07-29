# 🏋️ Kettlebell Timer

A minimal, offline-first kettlebell workout timer with animated exercise demonstrations.

**[Try it live →](https://kit-thomas-assistant.github.io/kettlebell-timer/)**

## Features

- **Animated exercise demos** : SVG stick figures plus a correlated YouTube technique demo
- **12-second preview** before each exercise with step-by-step instructions
- **Configurable workouts** : 10 / 15 / 20 min, beginner or intermediate
- **Auto-generated circuits** : randomized from a pool of 40+ kettlebell exercises
- **Hard category filters** : disabling upper/lower/full body/core immediately removes that category
- **Audio cues** : beeps at transitions and 3-second warnings
- **Screen wake lock** : keeps the display on during your workout
- **Offline workout core** : the timer, SVG demos and workout history work without a network; YouTube demos require a connection

## Exercises

### Beginner
Goblet Squat · Kettlebell Swing · KB Deadlift/RDL · Press (L/R) · Farmer/Suitcase Carry · Halo/Slingshot · Sumo Squat · Row (L/R) · Arm Bar · Dead Bug Pullover · Half-Kneeling Press

### Intermediate
KB Swing · Clean & Press (L/R) · Squat Clean · Goblet Squat · Snatch (L/R) · Turkish Get-Up (L/R) · Windmill (L/R) · Double KB Front Squat · Gorilla Row · Bottoms-Up Clean · Tactical Lunge · Rotational Swing · Goblet Cossack Squat

## How it works

1. Pick duration and level
2. Watch the 15s exercise preview with animation + instructions
3. Follow the timer — mini-animation stays visible during the set
4. Rest periods with breathing animation
5. Summary at the end

## Stack

- Pure HTML / CSS / JS — single file, no build step
- SVG animations (CSS keyframes)
- Web Audio API for beeps
- Screen Wake Lock API
- localStorage ready (future: workout history)

## Run locally

Just open `index.html` in a browser. That's it.

## Filter diagnostic

With Node.js and Chromium installed:

```bash
node tests/filter-diagnostic.mjs
```

The browser diagnostic toggles categories against the real app, runs 100 regenerations, checks the zero-category state, and verifies YouTube demo coverage.

## License

MIT
