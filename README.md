# 🏋️ Kettlebell Timer

A minimal, offline-first kettlebell workout timer with animated exercise demonstrations.

**[Try it live →](https://kit-thomas-assistant.github.io/kettlebell-timer/)**

## Features

- **Animated exercise demos** : SVG stick figures plus a targeted YouTube technique search (never a brittle single-video link)
- **12-second preview** before each exercise with step-by-step instructions
- **Configurable workouts** : 10 / 15 / 20 min, beginner or intermediate
- **Auto-generated circuits** : randomized from a pool of 50+ kettlebell and bodyweight exercises, with movement-family diversity
- **Equipment-aware plans** : tap 8–24 kg buttons to record zero, one or two matching bells; incompatible two-bell exercises are excluded automatically
- **No-kettlebell travel mode** : an explicit zero-equipment entry keeps the 10 / 15 / 20-minute and beginner / intermediate controls, with a persisted Balanced / Upper + core / Lower + core / Core & posture focus selector
- **Conservative load suggestions** : lighter available bells for overhead/technical work, heavier available bells for hinges, squats, rows and carries, with one optional “Use lighter weights” action
- **Guided 20-minute recipe** : the David Nateli full-body sequence runs inside Circuit mode with automatic transitions, four ordered passes, rep targets as guidance and midpoint side-switch cues
- **Guided sessions layer** : progressive disclosure keeps fixed recipes separate from random generation. Minimal 3 runs 10 total thrusters (5/side), 12 total rows (6/side), then 15 swings in that exact order, with a 60 / 90 / 120 / 180s round-rest choice and a 3–4 quality-round cue
- **Guided hip-mobility utility** : a secondary homepage card launches seven fixed no-equipment movements from the saved mobility routine, with bespoke animated SVG demos, manual 1/7 progress and conservative range/pain cues. Completion stays separate from kettlebell history and never advances the weekly plan
- **Real AMRAP runner** : Full-body Density uses a fixed six-movement checklist, 10 / 12 / 15 / 20-minute clock, manual exercise advancement, visible round counter, pause/resume and free rest
- **Optional 5-minute finisher** : after a completed main workout, add two or three rounds of two-hand goblet curls, light overhead triceps extensions and halos. It is attached to the original history entry and never advances the weekly lane twice
- **End-of-workout achievement** : skipping, completing or stopping the optional finisher opens a final recap with the real weekly 3-session progress, weekly streak, saved-session total and a six-week activity view. Ten sub-second celebration signatures rotate randomly, with reduced-motion support
- **Fat-loss goal mode** : a structured 15 / 20 / 25 min plan combining preparation, kettlebell intervals, full-body strength and a core finisher; “Vary this session” changes the movement families while preserving phases, timing, side balance and available equipment
- **Optional frozen weekly plan** : “Prepare my week” builds three complementary full-body Circuit sessions from the selected duration, level, equipment and the previous 7–10 days of movement load. If the week already started, the app offers to adopt up to three completed kettlebell sessions from the current week as finished slots, then generates only the complementary sessions still needed. The saved week advances 1/3 → 3/3, changes only through an explicit rebuild/variation action, and never replaces the zero-history free-session route
- **Push-volume guardrails** : every generated Circuit allows at most one horizontal-push slot and two total horizontal/vertical push slots. Floor, incline, offset and close-grip push-ups plus High Plank Plus share the same support-position budget instead of masquerading as unrelated families
- **Three complementary weekly biases** : Strength base, Hinge & power, then Mixed & unilateral keep every planned session full-body; the lane is a bias, not a body-part split
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
Forearm Plank · Side Plank (L/R) · Dead Bug · Reverse Crunch · Hollow Body Tuck · Bird Dog · Mountain Climber · Bear Plank Shoulder Tap

### No-kettlebell travel program

The dedicated travel mode is curated rather than randomly assembled. **Balanced** remains the default and preserves the original rotation through:

1. **Full-body base** : squat, horizontal push, hip extension, trunk control and prone shoulder control;
2. **Unilateral & stability** : alternating reverse lunge, push-up, glute bridge variation, Bird Dog, Side Plank and prone shoulder control;
3. **Conditioning & trunk** : squat, push-up, glute bridge variation, Mountain Climber, Bear Plank Shoulder Tap and prone shoulder control.

The expanded pool adds movement patterns that were genuinely missing instead of collecting cosmetic variations: Pike Press for vertical pushing, close-grip push-ups for triceps, High Plank Plus and Prone Y Raise for shoulder control, Reverse Crunch and Hollow Body Tuck for distinct trunk functions, Bodyweight Single-Leg RDL for standing hip-hinge and balance, and Single-Leg Calf Raise. Beginner plans use stable regressions; intermediate plans use floor or longer-lever progressions. Work stays around RPE 6–8, with explicit prompts to regress or stop for pain or form loss. No jumps, improvised door/towel rows, unstable furniture drills, forced failure or gimmicky burpees are programmed.

Three targeted focuses cover short-term recovery needs without changing the default program:

- **Upper + core** is visibly recommended when cycling has already loaded the legs. Each variant uses exactly one demanding push plus lighter shoulder-control work and trunk training at RPE 6–7, with no meaningful lower-body loading.
- **Lower + core** biases squat/lunge, hip extension, standing hinge, calves, balance and trunk work when the upper body needs rest.
- **Core & posture** is a lighter RPE 4–6 recovery session combining stability, controlled trunk flexion/anti-extension and scapular control, without hard conditioning.

Cycling is treated here as current training load, not a reason to permanently skip leg strength. The selector is fatigue management for a given session. The saved focus is included in workout history, while older no-kettlebell entries without a focus are interpreted as Balanced.

The mode promises **no kettlebell**, not an empty room: floor space and an optional completely stable wall/chair are allowed. The Stable-Chair Dip is a curated alternative for users who enjoy and tolerate it, not a default staple. Its on-screen warning requires an immovable chair against a wall, hips close to the chair, foot assistance, a comfortable range and an immediate stop for front-shoulder pinching. This reflects the limited 2022 biomechanical evidence: bench dips train the triceps, but can take the shoulder to unusually deep extension. Prone shoulder-control drills still do **not** replace loaded rows; add real horizontal pulling when safe equipment is available.

This product framing follows [ACSM's 2026 resistance-training guidance](https://acsm.org/resistance-training-guidelines-update-2026/), which emphasizes individualized programming, consistency over unnecessary complexity, meaningful bodyweight/home training and that training to failure is optional. The [WHO physical activity fact sheet](https://www.who.int/news-room/fact-sheets/detail/physical-activity) counts cycling as physical activity while still recommending muscle strengthening for everyone. Exercise selection is also grounded in the [push-up plus systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC6863690/), [core-exercise systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC7345922/), [Stronger by Science no-gym guide](https://www.strongerbyscience.com/no-gym/), [E3 Rehab shoulder-control progression](https://e3rehab.com/scapulardyskinesis/) and [2022 bench/bar/ring dip biomechanics study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9603242/).

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
7. Review the final consistency achievement, then return to setup or prepare another workout

## Stack

- Pure HTML / CSS / JS — single file, no build step
- SVG animations (CSS keyframes)
- Web Audio API for beeps
- Screen Wake Lock API
- localStorage for equipment selection, the versioned frozen weekly plan and the offline-first workout history cache
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
node tests/weekly-plan-diagnostic.mjs
```

The weekly-plan diagnostic checks the untouched zero-history quick start, V1 → V2 migration, versioned three-session persistence, explicit regeneration, planned-session completion linkage, current-week history adoption or explicit rejection, next-session progress, repeated push-volume caps, bilingual copy, 44px controls and 320px containment.

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
node tests/mobility-routine-diagnostic.mjs
```

The mobility diagnostic checks homepage hierarchy, the exact seven-movement sequence and targets, bespoke SVG/coaching coverage, manual 1/7 progression, persistent safety guidance, a history-neutral completion state, FR/EN copy, reduced-motion support, 44px controls and 320px containment.

```bash
node tests/achievement-diagnostic.mjs
```

The achievement diagnostic checks that restart actions stay hidden during the finisher offer, every route into final completion renders history-backed progress, all ten celebration variants are selectable, reduced motion suppresses animation, both final actions work, FR/EN copy remains complete and the panel fits at 320px.

```bash
node tests/supabase-sync-diagnostic.mjs
node tests/auth-ui-diagnostic.mjs
```

The Supabase diagnostics cover legacy UUID migration, deterministic merge/no duplicates, richer/latest payload preservation, offline queue/retry, logout preservation, local-first saves, OTP UI states, bilingual copy, graceful cloud failure and schema/RLS assertions.

```bash
node tests/bodyweight-mode-diagnostic.mjs
```

The bodyweight diagnostic checks bilingual setup and preview copy, focus visibility/accessibility/persistence, all four focus plans at every duration and level, focus-preserving exercise regeneration through the setup-to-preview flow, focus-scoped rotation and legacy Balanced history, no-kettlebell exercise metadata/SVG/steps/search demos, expanded movement-pattern coverage, chair-dip warnings, saved focus payloads and history labels, exercise stats without tonnage, 44px touch targets and 320px containment. Regeneration cycles curated six-exercise variants while retaining no-kettlebell mode, focus, duration and level; each variant changes at least one exercise, keeps exactly one demanding push in Upper + Core, and preserves the focus safety constraints.

## License

MIT
