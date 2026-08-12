# 🏋️ Kettlebell Timer

A minimal, offline-first kettlebell workout timer with animated exercise demonstrations.

**[Try it live →](https://kit-thomas-assistant.github.io/kettlebell-timer/)**

## Features

- **Animated exercise demos** : SVG stick figures plus a targeted YouTube technique search (never a brittle single-video link)
- **12-second preview** before each exercise with step-by-step instructions
- **Configurable workouts** : 10 / 15 / 20 min, beginner or intermediate
- **Auto-generated circuits** : randomized from a pool of 50+ kettlebell and bodyweight exercises, with movement-family diversity
- **Equipment-aware plans** : tap 8–24 kg buttons to record zero, one or two matching bells; incompatible two-bell exercises are excluded automatically
- **No-kettlebell travel mode** : an explicit zero-equipment entry keeps the 10 / 15 / 20-minute and beginner / intermediate controls, then rotates through three deterministic full-body travel sessions based only on completed bodyweight workouts
- **Conservative load suggestions** : lighter available bells for overhead/technical work, heavier available bells for hinges, squats, rows and carries, with one optional “Use lighter weights” action
- **Guided 20-minute recipe** : the David Nateli full-body sequence runs inside Circuit mode with automatic transitions, four ordered passes, rep targets as guidance and midpoint side-switch cues
- **Guided sessions layer** : progressive disclosure keeps fixed recipes separate from random generation. Minimal 3 runs 10 total thrusters (5/side), 12 total rows (6/side), then 15 swings in that exact order, with a 60 / 90 / 120 / 180s round-rest choice and a 3–4 quality-round cue
- **Real AMRAP runner** : Full-body Density uses a fixed six-movement checklist, 10 / 12 / 15 / 20-minute clock, manual exercise advancement, visible round counter, pause/resume and free rest
- **Optional 5-minute finisher** : after a completed main workout, add two or three rounds of two-hand goblet curls, light overhead triceps extensions and halos. It is attached to the original history entry and never advances the weekly lane twice
- **Fat-loss goal mode** : a structured 15 / 20 / 25 min plan combining preparation, kettlebell intervals, full-body strength and a core finisher; “Vary this session” changes the movement families while preserving phases, timing, side balance and available equipment
- **Three complementary weekly sessions** : a stable preview lane rotates only after completion through Strength base, Hinge & power, then Mixed & unilateral. Every fat-loss session remains full-body; the lane is a bias, not a body-part split
- **Hard category filters** : disabling upper/lower/full body/core immediately removes that category
- **Audio cues** : beeps at transitions and 3-second warnings
- **Screen wake lock** : keeps the display on during your workout
- **Offline workout core** : the timer, SVG demos and workout history work without a network; YouTube demos require a connection
- **Weekly consistency** : a 12-week activity heatmap, three-session weekly target and non-punitive weekly streak appear below the primary start action
- **Optional cloud history** : passwordless email OTP sync through Supabase, with local-first saves, offline retry and deterministic cross-device merging. Workouts never require an account or network

## Exercises

### Beginner
Goblet Squat · Kettlebell Swing · KB Deadlift/RDL · Press (L/R) · Farmer/Suitcase Carry · Halo/Slingshot · Sumo Squat · Row (L/R) · Arm Bar · Dead Bug Pullover · Half-Kneeling Press · Floor/Incline Push-Up · Offset Kettlebell Push-Up · Single-Arm Floor Press · Light Kettlebell Pullover · Suitcase Row · Two-Hand Goblet Curl · Two-Hand Overhead Triceps Extension · Toe Taps

### Intermediate
KB Swing · Clean & Press (L/R) · Dead Clean from the floor (L/R) · Clean + Thruster per side · Squat Clean · Goblet Squat · Snatch (L/R) · Turkish Get-Up (L/R) · Windmill (L/R) · Double KB Front Squat · Gorilla Row · Bottoms-Up Clean · Tactical Lunge · Rotational Swing · Goblet Cossack Squat · Push-Up + Kettlebell Drag · Half Get-Up Press · Seated Strict Press, plus the beginner upper-body fundamentals

The offset push-up is only offered with one hand centred on a kettlebell that has a perfectly stable flat base. If the bell moves, the on-screen instruction explicitly sends the athlete back to floor push-ups. The app intentionally excludes crush-grip presses and does not ask the athlete to balance on two unstable handles.

### Bodyweight core
Forearm Plank · Side Plank (L/R) · Dead Bug · Mountain Climber · Bear Plank Shoulder Tap

### No-kettlebell travel program

The dedicated travel mode is curated rather than randomly assembled. Completed bodyweight sessions rotate through:

1. **Full-body base** : squat, horizontal push, hip extension, trunk control and prone shoulder control;
2. **Unilateral & stability** : alternating reverse lunge, push-up, glute bridge variation, Bird Dog, Side Plank and prone shoulder control;
3. **Conditioning & trunk** : squat, push-up, glute bridge variation, Mountain Climber, Bear Plank Shoulder Tap and prone shoulder control.

Beginner plans use incline push-ups on a stable wall or support and bilateral bridges. Intermediate plans use floor push-ups, tempo squats and single-leg bridges. Work stays around RPE 6–8, with explicit prompts to regress or stop for pain or form loss. No jumps, improvised door/towel rows, unstable furniture drills, forced failure or gimmicky burpees are programmed.

The no-equipment limitation is explicit: prone W raises and reverse snow angels can train scapular and posterior-shoulder control, but they do **not** replace loaded rows. Add real horizontal pulling when safe equipment is available.

This product framing follows [ACSM's 2026 resistance-training guidance](https://acsm.org/resistance-training-guidelines-update-2026/), which emphasizes consistency, training all major muscle groups at least twice weekly and the meaningful benefits of bodyweight/home routines, plus the [WHO physical activity fact sheet](https://www.who.int/news-room/fact-sheets/detail/physical-activity), which emphasizes that any activity is better than none and that all movement counts.

## Fat-loss mode and scientific framing

The app does not claim that abdominal fat can be spot-reduced. Abdominal exercises can strengthen the trunk, but fat loss happens systemically. The dedicated mode therefore combines:

1. movement preparation;
2. metabolic kettlebell intervals at a controlled RPE 7–8;
3. full-body strength work to retain/build useful muscle;
4. anti-extension and anti-rotation core work.

Sessions are available in 15, 20 and 25 minute versions, with beginner and intermediate movement pools. They are one practical part of a broader approach that also depends on consistent activity, appropriate nutrition, recovery and sleep.

Regeneration compares movement-family signatures with the displayed plan and the two most recent fat-loss sessions. It targets at most 40% family overlap when the compatible pool permits, then relaxes the threshold progressively with bounded retries instead of hanging on a constrained equipment setup. Left/right named variants count as one family and remain paired.

### Evidence used for the product framing

- Vispute et al., abdominal exercise and abdominal fat, PMID [21804427](https://pubmed.ncbi.nlm.nih.gov/21804427/)
- Maillard et al., HIIT effect on total, abdominal and visceral fat, systematic review and meta-analysis, PMID [29127602](https://pubmed.ncbi.nlm.nih.gov/29127602/)
- Wewege et al., resistance training effect on body-fat percentage, fat mass and visceral fat, systematic review and meta-analysis, PMID [34536199](https://pubmed.ncbi.nlm.nih.gov/34536199/)
- Farrar et al., oxygen cost of kettlebell swings, PMID [20300022](https://pubmed.ncbi.nlm.nih.gov/20300022/)
- [WHO physical activity guidance](https://www.who.int/news-room/fact-sheets/detail/physical-activity)
- [ACSM's 2026 resistance-training guidance](https://acsm.org/resistance-training-guidelines-update-2026/): consistency and training all major muscle groups at least twice weekly matter more than unnecessary complexity
- [ACE's single-kettlebell EMOM programming guidance](https://www.acefitness.org/resources/pros/expert-articles/6526/one-weight-workout-kettlebell/), used as a practical reference for time-efficient full-body sequencing
- Kettlebells Workouts coaching references on [push/pull balance](https://kettlebellsworkouts.com/kettlebell-push-pull-workouts/), [chest work](https://kettlebellsworkouts.com/kettlebell-exercises-for-chest/) and [upper-body kettlebell variations](https://kettlebellsworkouts.com/kettlebell-exercises-for-upper-body/)

## How it works

1. Select the kettlebells you own, then pick duration and level
2. Watch the 12s exercise preview with animation, instructions and suggested load
3. Follow the timer — mini-animation stays visible during the set
4. Rest periods with breathing animation
5. For AMRAP and fixed guided recipes, tick through the checklist manually while the workout clock stays visible
6. At the summary, either finish cleanly or add the optional five-minute arms and shoulders finisher

## Stack

- Pure HTML / CSS / JS — single file, no build step
- SVG animations (CSS keyframes)
- Web Audio API for beeps
- Screen Wake Lock API
- localStorage for equipment selection and the offline-first workout history cache
- Supabase Auth + Postgres for optional cross-device history sync (history only, no equipment/preferences)

### Supabase setup

The checked-in migration at `supabase/migrations/20260808065000_create_workout_sessions.sql` creates the `workout_sessions` table, its user/date index, strict owner-only RLS policies and the `updated_at` trigger.

In **Authentication → URL Configuration**, set:

- Site URL: `https://kit-thomas-assistant.github.io/kettlebell-timer/`
- Redirect URLs: add `https://kit-thomas-assistant.github.io/kettlebell-timer/` exactly

The app passes its clean current page as `emailRedirectTo`, so local development URLs must also be added to the redirect allow list before testing email links locally.

The login UI accepts either the confirmation/magic link or a six-digit email code. Supabase's default template already supports the link through `{{ .ConfirmationURL }}`. To also show the code, open **Authentication → Email Templates → Magic Link** and include `{{ .Token }}`, for example:

```html
<p>Your Kettlebell Timer code: <strong>{{ .Token }}</strong></p>
```

The static client contains only the project URL and publishable key. Never add a `service_role` or secret key to this repository.

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
node tests/rotation-diagnostic.mjs
```

The rotation diagnostic checks the enlarged one-bell upper-body pools, horizontal push/pull coverage, left/right movement families, YouTube search-only URLs, perceptible fat-loss regeneration, stable three-session lanes, history compatibility, bilingual badges and 320px containment.

```bash
node tests/equipment-recipe-diagnostic.mjs
```

The equipment/recipe diagnostic checks selector cycling and persistence, 44px accessible controls, repeated single-bell filtering, equal-pair unlocking, conservative mixed-load recommendations, the lighten action, recipe order/timing/laterality, midpoint cues, history metadata and FR/EN translations.

```bash
node tests/consistency-diagnostic.mjs
```

The consistency diagnostic checks day/week aggregation, the three-session target, in-progress week streak logic, the 12×7 heatmap, empty and bilingual states, history opening, post-session refresh, 200-session retention, legacy data compatibility, accessibility and 320px layout containment.

```bash
node tests/guided-amrap-finisher-diagnostic.mjs
```

The guided/AMRAP/finisher diagnostic checks the exact fixed recipes and rep targets, duration and rest choices, manual round advancement, pause and free-rest states, single-save completion, finisher history attachment and weekly-lane invariants, FR/EN copy, query-only demos, new exercise metadata/equipment filtering and 320px containment.

```bash
node tests/supabase-sync-diagnostic.mjs
node tests/auth-ui-diagnostic.mjs
```

The Supabase diagnostics cover legacy UUID migration, deterministic merge/no duplicates, richer/latest payload preservation, offline queue/retry, logout preservation, local-first saves, OTP UI states, bilingual copy, graceful cloud failure and schema/RLS assertions.

```bash
node tests/bodyweight-mode-diagnostic.mjs
```

The bodyweight diagnostic checks bilingual setup and preview copy, zero-inventory mode transitions, enabled CTA semantics, all durations and levels, deterministic bodyweight-only lane rotation, zero-equipment exercise metadata/SVG/steps/search demos, history and exercise stats without tonnage, accessible touch targets and 320px containment.

## License

MIT
