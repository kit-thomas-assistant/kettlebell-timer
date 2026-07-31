# 🏋️ Kettlebell Timer

A minimal, offline-first kettlebell workout timer with animated exercise demonstrations.

**[Try it live →](https://kit-thomas-assistant.github.io/kettlebell-timer/)**

## Features

- **Animated exercise demos** : SVG stick figures plus a correlated YouTube technique demo
- **12-second preview** before each exercise with step-by-step instructions
- **Configurable workouts** : 10 / 15 / 20 min, beginner or intermediate
- **Auto-generated circuits** : randomized from a pool of 40+ kettlebell exercises
- **Equipment-aware plans** : tap 8–24 kg buttons to record zero, one or two matching bells; incompatible two-bell exercises are excluded automatically
- **Conservative load suggestions** : lighter available bells for overhead/technical work, heavier available bells for hinges, squats, rows and carries, with one optional “Use lighter weights” action
- **Guided 20-minute recipe** : the David Nateli full-body sequence runs inside Circuit mode with automatic transitions, four ordered passes, rep targets as guidance and midpoint side-switch cues
- **Fat-loss goal mode** : a structured 15 / 20 / 25 min plan combining preparation, kettlebell intervals, full-body strength and a core finisher
- **Hard category filters** : disabling upper/lower/full body/core immediately removes that category
- **Audio cues** : beeps at transitions and 3-second warnings
- **Screen wake lock** : keeps the display on during your workout
- **Offline workout core** : the timer, SVG demos and workout history work without a network; YouTube demos require a connection
- **Weekly consistency** : a 12-week activity heatmap, three-session weekly target and non-punitive weekly streak appear below the primary start action

## Exercises

### Beginner
Goblet Squat · Kettlebell Swing · KB Deadlift/RDL · Press (L/R) · Farmer/Suitcase Carry · Halo/Slingshot · Sumo Squat · Row (L/R) · Arm Bar · Dead Bug Pullover · Half-Kneeling Press

### Intermediate
KB Swing · Clean & Press (L/R) · Squat Clean · Goblet Squat · Snatch (L/R) · Turkish Get-Up (L/R) · Windmill (L/R) · Double KB Front Squat · Gorilla Row · Bottoms-Up Clean · Tactical Lunge · Rotational Swing · Goblet Cossack Squat

### Bodyweight core
Forearm Plank · Side Plank (L/R) · Dead Bug · Mountain Climber · Bear Plank Shoulder Tap

## Fat-loss mode and scientific framing

The app does not claim that abdominal fat can be spot-reduced. Abdominal exercises can strengthen the trunk, but fat loss happens systemically. The dedicated mode therefore combines:

1. movement preparation;
2. metabolic kettlebell intervals at a controlled RPE 7–8;
3. full-body strength work to retain/build useful muscle;
4. anti-extension and anti-rotation core work.

Sessions are available in 15, 20 and 25 minute versions, with beginner and intermediate movement pools. They are one practical part of a broader approach that also depends on consistent activity, appropriate nutrition, recovery and sleep.

### Evidence used for the product framing

- Vispute et al., abdominal exercise and abdominal fat, PMID [21804427](https://pubmed.ncbi.nlm.nih.gov/21804427/)
- Maillard et al., HIIT effect on total, abdominal and visceral fat, systematic review and meta-analysis, PMID [29127602](https://pubmed.ncbi.nlm.nih.gov/29127602/)
- Wewege et al., resistance training effect on body-fat percentage, fat mass and visceral fat, systematic review and meta-analysis, PMID [34536199](https://pubmed.ncbi.nlm.nih.gov/34536199/)
- Farrar et al., oxygen cost of kettlebell swings, PMID [20300022](https://pubmed.ncbi.nlm.nih.gov/20300022/)
- [WHO physical activity guidance](https://www.who.int/news-room/fact-sheets/detail/physical-activity)

## How it works

1. Select the kettlebells you own, then pick duration and level
2. Watch the 12s exercise preview with animation, instructions and suggested load
3. Follow the timer — mini-animation stays visible during the set
4. Rest periods with breathing animation
5. Summary at the end

## Stack

- Pure HTML / CSS / JS — single file, no build step
- SVG animations (CSS keyframes)
- Web Audio API for beeps
- Screen Wake Lock API
- localStorage for equipment selection and automatic workout history

For Circuit 20 min, the first preview surfaces the curated David Nateli recipe deterministically. “Regenerate” then switches to the standard generated Circuit plan, so the recipe is easy to find without becoming a separate home mode.

## Run locally

Just open `index.html` in a browser. That's it.

## Filter diagnostic

With Node.js and Chromium installed:

```bash
node tests/filter-diagnostic.mjs
```

The filter diagnostic toggles categories against the real app, runs 100 regenerations, checks the zero-category state, and verifies YouTube demo coverage.

```bash
node tests/fatloss-diagnostic.mjs
```

The fat-loss diagnostic checks the homepage card, mode-specific durations, beginner/intermediate constraints, phase coverage, approximate duration, translations, SVG/demo coverage, and regeneration invariants.

```bash
node tests/equipment-recipe-diagnostic.mjs
```

The equipment/recipe diagnostic checks selector cycling and persistence, 44px accessible controls, repeated single-bell filtering, equal-pair unlocking, conservative mixed-load recommendations, the lighten action, recipe order/timing/laterality, midpoint cues, history metadata and FR/EN translations.

```bash
node tests/consistency-diagnostic.mjs
```

The consistency diagnostic checks day/week aggregation, the three-session target, in-progress week streak logic, the 12×7 heatmap, empty and bilingual states, history opening, post-session refresh, 200-session retention, legacy data compatibility, accessibility and 320px layout containment.

## License

MIT
