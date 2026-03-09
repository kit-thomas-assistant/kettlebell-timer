# Kettlebell Timer v2 — Brief

## Problèmes actuels

### 1. Programmes répétitifs
- Seulement 2 pools d'exercices (beginner: 10, inter: 12)
- La sélection random pioche dans un petit pool → tu retombes vite sur les mêmes exos
- Pas de logique de programmation (toujours work/rest linéaire, pas de complexes, pas d'EMOM, pas de ladders)
- Les rounds sont identiques (mêmes exos répétés N fois)

### 2. Animations SVG basiques
- Les SVG sont des stick figures statiques avec des CSS keyframes simples (squat-down, swing-arc, press-up...)
- Pas de phases distinctes dans l'animation (la KB swing montre juste un arc, pas les 3 phases hip hinge → extension → float)
- Tous les exos utilisent la même boucle infinie → pas de corrélation avec le rythme réel de l'exercice
- Les proportions corporelles sont approximatives

### 3. Format unique
- Seulement du circuit training classique (work/rest)
- Pas de variété de formats : EMOM, AMRAP, complexes, ladders, tabata

---

## Ce que la recherche recommande

### Programmes de référence (Reddit r/kettlebell + sites spécialisés)

**Formats éprouvés à implémenter :**

| Format | Description | Source |
|--------|-------------|--------|
| **Simple & Sinister** | 100 swings + 10 TGU. Simple, progressif, le gold standard. | Pavel / StrongFirst |
| **The Perfect Pair** | 200 swings + 55 push-ups (descending ladder 10→1). ~10 min. | kettlebellsworkouts.com |
| **EMOM** | Every Minute On the Minute. Ex: 5 cleans EMOM x 10 min. Force le repos actif. | Men's Health |
| **Armor Building Complex (ABC)** | 2 cleans + 1 press + 3 front squats. Répéter. Le complex le plus populaire. | Dan John |
| **Tabata KB** | 20s on / 10s off x 8 rounds. Swings ou snatches. 4 min brutal. | Standard |
| **Ladder** | 1-2-3-4-5 reps, repos entre chaque échelon. Accumulation de volume sans fatigue excessive. | RoP / StrongFirst |
| **Circuit varié** | 5 exos, countdown (20-15-10-5 reps). Plus de variété que le format actuel. | kettlebellsworkouts.com |

### Exercices manquants à ajouter

- **Clean** (séparé du clean & press)
- **Swing à 1 bras** (gauche/droite)
- **Renegade Row** (combo plank + row)
- **KB Thruster** (squat + press en un mouvement)
- **Floor Press** (alternative au bench)
- **Figure 8** (entre les jambes)
- **Swing High Pull** (entre swing et snatch)
- **Farmer Walk** (existe mais pas animé)
- **Goblet Reverse Lunge**
- **KB Push Press** (momentum des jambes)

### Pool cible : ~25 exercices uniques
Avec variantes G/D ça fait ~35 entrées, assez pour ne jamais avoir 2 sessions identiques.

---

## Plan d'amélioration

### A. Programmes (priorité 1)

Remplacer le système actuel (1 seul format circuit) par **6 modes de workout** :

1. **Circuit** (actuel amélioré) — pool élargi, exos jamais répétés dans un round, variation entre rounds
2. **EMOM** — 1-2 exos, rep fixe chaque minute, 10-20 min
3. **Tabata** — 20/10 x 8, choix de l'exo ou rotation
4. **Complex** — séquence enchaînée sans poser la KB (ABC, clean+press+squat, etc.)
5. **Ladder** — 1-2-3-4-5 reps, montée puis descente, repos entre échelons
6. **Simple & Sinister** — 100 swings (sets de 10) + 10 TGU (1 par côté x 5), repos chronométré

**Chaque mode a :**
- Sa propre logique de timer (EMOM = 60s fixe, Tabata = 20/10, etc.)
- Son pool d'exercices adapté
- Son affichage spécifique (EMOM montre le compteur de minutes, Ladder montre l'échelon)

### B. Animations SVG (priorité 2)

**Objectif : passer de "stick figure qui bouge" à "démo claire du mouvement"**

1. **Multi-phase animations** — chaque exo a 3-5 keyframes distincts qui montrent les positions clés
   - Swing : position basse (hip hinge) → extension → float en haut → retour
   - TGU : allongé → coude → main → pont → genou → debout (6 phases)
   - Squat : debout → descente → bottom → remontée

2. **Meilleure anatomie**
   - Articulations visibles (épaules, coudes, genoux, hanches)
   - Proportions réalistes (ratio tête/corps)
   - La KB a un handle visible et réaliste

3. **Indicateurs visuels**
   - Flèches de direction du mouvement
   - Zone musculaire active en surbrillance subtile
   - Cadence synchronisée avec le timer (pas juste loop infini)

4. **Responsive**
   - SVG plein écran sur mobile
   - Texte d'instructions lisible
   - Gros timer visible

### C. UX (priorité 3)

- **Écran de sélection enrichi** : choisir le MODE (circuit/EMOM/tabata/complex/ladder/S&S) puis durée puis difficulté
- **Preview amélioré** : voir la liste complète des exos avant de démarrer
- **Historique de session** : localStorage avec date, durée, mode, exercices faits
- **Anti-répétition** : tracker les dernières 3 sessions et éviter de reproposer les mêmes exos
- **Son amélioré** : countdown 3-2-1 avec beeps distincts, voix optionnelle pour le nom de l'exo (Web Speech API)

---

## Contraintes techniques

- **Single HTML file** (pas de build, pas de framework)
- **PWA-ready** (déjà wake lock, ajouter manifest + service worker pour offline)
- **Mobile-first** (c'est utilisé sur téléphone pendant l'entraînement)
- **Pas de dépendances externes** (tout inline : CSS, JS, SVG)

---

## Livraison

Phase 1 : Nouveaux programmes + pool d'exercices élargi (le plus impactant pour la répétitivité)
Phase 2 : Animations SVG haute fidélité
Phase 3 : Historique + anti-répétition + PWA

Repo : https://github.com/kit-thomas-assistant/kettlebell-timer
Deploy : GitHub Pages (push to main = live)
