# 🏋️ Kettlebell Timer

A minimal, offline-first kettlebell workout timer with animated exercise demonstrations.

**[Try it live →](https://kit-thomas-assistant.github.io/kettlebell-timer/)**

## Features

- **Animated exercise demos** : SVG stick figures show each movement before and during the set
- **15-second preview** before each exercise with step-by-step instructions
- **Configurable workouts** : 10 / 15 / 20 min, beginner or intermediate
- **Auto-generated circuits** : randomized from a pool of 20+ kettlebell exercises
- **Audio cues** : beeps at transitions and 3-second warnings
- **Screen wake lock** : keeps the display on during your workout
- **Fully offline** : single HTML file, zero dependencies, no network required

## Exercises

### Beginner
Goblet Squat · Kettlebell Swing · KB Deadlift · Press (L/R) · Farmer Carry · Halo · Sumo Squat · Row (L/R)

### Intermediate
KB Swing · Clean & Press (L/R) · Goblet Squat · Snatch (L/R) · Turkish Get-Up (L/R) · Windmill (L/R) · Double KB Front Squat

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

## License

MIT
