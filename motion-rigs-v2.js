/* Motion V2 production renderer. Generated from the reviewed local SVG Motion Lab. */
    (() => {
      'use strict';

      const P = (head, neck, ls, rs, le, re, lw, rw, lh, rh, lk, rk, la, ra, lt, rt, kb, angle = 0, gaze = null) => ({
        head, neck, ls, rs, le, re, lw, rw, lh, rh, lk, rk, la, ra, lt, rt, kb, angle, gaze
      });

      const familyProfiles = {
        squat: { label: 'Squat', renderer: 'front-rack' },
        hinge: { label: 'Charnière & puissance', renderer: 'swing-depth' },
        groundToStand: { label: 'Sol vers debout', renderer: 'standard' },
        lunge: { label: 'Fentes', renderer: 'standard' },
        ballistic: { label: 'Ballistiques', renderer: 'dynamic-depth' },
        clean: { label: 'Cleans', renderer: 'dynamic-depth' },
        press: { label: 'Presses', renderer: 'forearm-rack' },
        row: { label: 'Tirages', renderer: 'standard' },
        ground: { label: 'Travail au sol', renderer: 'ground-load' },
        windmill: { label: 'Windmill', renderer: 'overhead-depth' },
        orbit: { label: 'Autour du corps', renderer: 'dynamic-depth' },
        carry: { label: 'Carries & marches', renderer: 'carry' },
        arms: { label: 'Bras', renderer: 'standard' },
        calf: { label: 'Mollets', renderer: 'bodyweight' },
        bridge: { label: 'Ponts fessiers', renderer: 'ground-bodyweight' },
        locomotion: { label: 'Locomotion', renderer: 'floor-marker' },
        horizontalPush: { label: 'Poussée horizontale', renderer: 'ground-contact' },
        verticalPush: { label: 'Poussée verticale', renderer: 'ground-contact' },
        elbowExtension: { label: 'Extension de coude', renderer: 'chair' },
        isometricCore: { label: 'Gainage isométrique', renderer: 'ground-contact' },
        scapularControl: { label: 'Contrôle scapulaire', renderer: 'ground-contact' },
        supineCore: { label: 'Core allongé', renderer: 'ground-contact' },
        quadrupedLocomotion: { label: 'Locomotion quadrupède', renderer: 'ground-contact' },
        quadrupedStability: { label: 'Stabilité quadrupède', renderer: 'ground-contact' },
        proneShoulder: { label: 'Épaules au sol', renderer: 'prone-top' }
      };

      const equipmentLabels = {
        kettlebell: 'Kettlebell',
        bodyweight: 'Poids du corps',
        chair: 'Chaise stable'
      };

      // Catalogue schema v2. A definition may `extends` another entry to reuse its
      // deterministic poses. `mirror: true` flips the rendered rig around x=180
      // without reversing the timeline. A timing-only variant overrides values via
      // `timing: { duration, hold, interpolation, sequence, segment }`.
      // Example for later inventory packets:
      // pressRight: { extends: 'pressLeft', title: 'Press droit', side: 'right', mirror: true }
      // tempoSquat: { extends: 'airSquat', title: 'Squat tempo', timing: { duration: 6200, hold: .3 } }
      const exerciseSeeds = {
        squat: {
          id: 'squat',
          title: 'Goblet Squat',
          aliases: ['Squat gobelet'],
          family: 'squat',
          equipment: ['kettlebell'],
          laterality: 'bilatéral',
          side: 'both',
          mirror: false,
          renderer: 'front-rack',
          rigStatus: 'validé',
          rigVersion: '1.1',
          summary: 'Vue frontale pour lire simultanément profondeur, trajectoire des genoux, stabilité des pieds et placement de la charge.',
          duration: 5200,
          trajectory: 'M180 126 C180 150 180 182 180 216',
          phases: ['Rack debout', 'Descente contrôlée', 'Pause basse', 'Remontée / verrouillage'],
          phaseDetails: [
            'Debout, cloche proche du sternum',
            'Hanches entre les jambes, genoux dans l’axe des orteils',
            'Appuis centrés, colonne neutre',
            'Hanches et genoux en extension complète'
          ],
          invariants: ['Cloche tenue près de la poitrine, épaules basses', 'Genoux dans la direction des orteils', 'Poids centré sur chaque pied', 'Colonne neutre du départ au verrouillage'],
          flags: ['Cloche qui s’éloigne du torse', 'Genoux qui s’effondrent vers l’intérieur', 'Talons qui décollent ou bassin qui part en arrière', 'Hyperextension lombaire en haut'],
          sources: [{ label: 'StrongFirst · Heavy Goblet Squats', url: 'https://www.strongfirst.com/kettlebell-simple-sinister-tips-for-heavy-goblet-squats/' }],
          poses: [
            P([180,58],[180,86],[146,102],[214,102],[153,130],[207,130],[169,149],[191,149],[158,190],[202,190],[143,250],[217,250],[136,310],[224,310],[118,312],[242,312],[180,151],0,[180,84,180,106]),
            P([180,84],[180,112],[146,126],[214,126],[151,154],[209,154],[169,171],[191,171],[156,212],[204,212],[128,266],[232,266],[136,310],[224,310],[118,312],[242,312],[180,173],0,[180,110,180,132]),
            P([180,108],[180,136],[146,150],[214,150],[149,180],[211,180],[169,196],[191,196],[154,232],[206,232],[119,271],[241,271],[136,310],[224,310],[118,312],[242,312],[180,198],0,[180,134,180,156]),
            P([180,78],[180,106],[146,120],[214,120],[151,148],[209,148],[169,165],[191,165],[157,205],[203,205],[134,259],[226,259],[136,310],[224,310],[118,312],[242,312],[180,167],0,[180,104,180,126])
          ],
          sequence: [0, 1, 2, 3, 0],
          segment: [780, 920, 560, 980, 620],
          current: `<svg viewBox="0 0 100 110" role="img" aria-label="Goblet squat actuel"><g class="old-squat"><circle cx="50" cy="12" r="9" fill="none" stroke="#e8d5c0" stroke-width="2.5"/><line x1="50" y1="21" x2="50" y2="58" stroke="#e8d5c0" stroke-width="3" stroke-linecap="round"/><line x1="50" y1="35" x2="38" y2="48" stroke="#e8d5c0" stroke-width="2.5"/><line x1="50" y1="35" x2="62" y2="48" stroke="#e8d5c0" stroke-width="2.5"/><rect x="42" y="42" width="16" height="14" rx="4" fill="none" stroke="#4ecdc4" stroke-width="2.5"/><line x1="50" y1="58" x2="36" y2="90" stroke="#e8d5c0" stroke-width="3"/><line x1="50" y1="58" x2="64" y2="90" stroke="#e8d5c0" stroke-width="3"/></g></svg>`
        },
        swing: {
          id: 'swing',
          title: 'Kettlebell Swing',
          aliases: ['KB Swing', 'Swing russe'],
          family: 'hinge',
          equipment: ['kettlebell'],
          laterality: 'bilatéral',
          side: 'both',
          mirror: false,
          renderer: 'swing-depth',
          rigStatus: 'validé',
          rigVersion: '1.1',
          summary: 'Vue latérale, corps fixe dans le cadre. Le modèle distingue la charnière tardive, l’extension de hanche et le flottement passif de la cloche.',
          duration: 4600,
          hold: .06,
          interpolation: 'smoother',
          trajectory: 'M222 218 C246 196 206 148 118 122 C87 113 79 129 107 153 C145 185 206 193 222 218',
          phases: ['Charnière tardive / backswing', 'Drive de hanche', 'Planche debout / montée', 'Flottement', 'Descente avant charnière'],
          phaseDetails: ['Cloche haute entre les cuisses, dos neutre', 'Hanches propulsées, bras connectés au torse', 'Oreille, épaule, hanche et cheville alignées', 'Cloche vers hauteur de poitrine, bras passifs', 'Corps encore grand pendant la première partie de la descente'],
          invariants: ['Charnière de hanche, pas un squat', 'Grand dorsal engagé, bras reliés au torse', 'Sommet en planche debout, sans se pencher en arrière', 'Charnière seulement après le passage sous le nombril'],
          flags: ['Genoux très fléchis et bassin vertical comme un squat', 'Bras qui tirent activement la cloche', 'Dos arrondi au backswing', 'Corps entier qui pivote autour des pieds'],
          sources: [
            { label: 'StrongFirst · Power & Rhythm', url: 'https://www.strongfirst.com/power-rhythm-kettlebell-swing/' },
            { label: 'StrongFirst · Super Sinister swing', url: 'https://www.strongfirst.com/how-my-swing-changed-for-super-sinister/' }
          ],
          poses: [
            P([132,123],[148,142],[143,151],[151,158],[175,180],[178,184],[211,205],[215,210],[190,202],[198,207],[163,258],[220,256],[139,310],[229,310],[119,312],[248,312],[222,218],-14,[126,121,103,122]),
            P([156,94],[165,119],[157,129],[168,132],[164,161],[174,164],[178,190],[184,192],[180,194],[191,196],[158,251],[215,252],[139,310],[229,310],[119,312],[248,312],[187,201],-7,[150,93,128,94]),
            P([183,57],[181,86],[173,102],[187,102],[144,111],[147,116],[111,118],[106,124],[174,188],[188,188],[155,247],[214,249],[139,310],[229,310],[119,312],[248,312],[91,125],5,[178,57,155,61]),
            P([183,57],[181,86],[173,102],[187,102],[139,106],[142,112],[102,111],[96,118],[174,188],[188,188],[155,247],[214,249],[139,310],[229,310],[119,312],[248,312],[80,120],7,[178,57,155,61]),
            P([183,61],[181,90],[173,106],[187,106],[153,122],[159,126],[126,147],[132,149],[174,188],[188,188],[155,247],[214,249],[139,310],[229,310],[119,312],[248,312],[118,158],2,[178,61,155,65])
          ],
          sequence: [0, 1, 2, 3, 4, 0],
          segment: [560, 620, 500, 500, 900, 260],
          current: `<svg viewBox="0 0 100 110" role="img" aria-label="Swing actuel"><g class="old-swing"><circle cx="50" cy="15" r="9" fill="none" stroke="#e8d5c0" stroke-width="2.5"/><line x1="50" y1="24" x2="50" y2="60" stroke="#e8d5c0" stroke-width="3"/><line x1="50" y1="38" x2="50" y2="20" stroke="#e8d5c0" stroke-width="2.5"/><circle cx="50" cy="10" r="7" fill="none" stroke="#4ecdc4" stroke-width="2.5"/><line x1="50" y1="60" x2="38" y2="90" stroke="#e8d5c0" stroke-width="3"/><line x1="50" y1="60" x2="62" y2="90" stroke="#e8d5c0" stroke-width="3"/></g></svg>`
        },
        tgu: {
          id: 'tgu',
          title: 'Turkish Get-Up',
          aliases: ['TGU', 'Relevé turc'],
          family: 'groundToStand',
          equipment: ['kettlebell'],
          laterality: 'unilatéral',
          side: 'left',
          mirror: false,
          mirrorable: true,
          renderer: 'standard',
          descentStartsAt: 7,
          rigStatus: 'validé',
          rigVersion: '1.0',
          summary: 'Schéma trois-quarts en sept poses. Le bras chargé reste vertical et verrouillé pendant que les appuis se réorganisent sans rupture de squelette.',
          duration: 10800,
          trajectory: 'M116 169 C127 120 147 86 173 61 C190 42 203 28 215 20',
          phases: ['Press allongé', 'Roll sur le coude', 'Tall sit / main au sol', 'Low sweep', 'Charnière demi-genou', 'Demi-genou haut', 'Debout'],
          phaseDetails: ['Bras chargé vertical, jambe opposée longue', 'Pied fléchi pousse le sol, transfert sur le coude opposé', 'Main postée, poitrine ouverte', 'Jambe longue balayée sous le bassin', 'Base en demi-genou, tronc encore incliné', 'Bassin carré, tronc vertical', 'Extension complète et charge empilée'],
          invariants: ['Coude chargé verrouillé et poignet neutre', 'Épaule chargée active, cloche au-dessus de l’appui', 'Jambe longue au sol pendant le roll initial', 'Regard sur la cloche jusqu’au demi-genou, puis devant'],
          flags: ['Bras chargé qui s’incline ou coude qui fléchit', 'Jambe longue qui décolle pendant le roll', 'Jambe balayée qui téléporte ou traverse l’autre membre', 'Demi-genou instable avant de se relever'],
          sources: [
            { label: 'BuiltLean · Turkish Get-Up guide', url: 'https://www.builtlean.com/turkish-get-up/' },
            { label: 'Girls Gone Strong · Turkish Get-Up', url: 'https://www.girlsgonestrong.com/blog/strength-training/turkish-getup/' }
          ],
          poses: [
            P([58,292],[82,291],[100,283],[112,295],[92,315],[112,244],[126,316],[112,192],[175,291],[190,303],[243,299],[221,268],[303,307],[250,307],[322,307],[267,309],[112,170],0,[57,286,104,189]),
            P([91,269],[112,258],[118,269],[145,247],[104,303],[145,198],[127,316],[145,149],[185,284],[201,287],[249,300],[226,260],[306,307],[258,306],[325,307],[275,309],[145,128],0,[89,263,140,130]),
            P([129,216],[148,198],[145,206],[170,183],[121,251],[170,135],[102,312],[170,86],[204,270],[220,273],[263,295],[235,249],[312,307],[266,305],[331,307],[285,308],[170,65],0,[127,210,166,67]),
            P([154,188],[172,169],[158,179],[188,155],[138,229],[188,108],[115,313],[188,61],[211,247],[225,248],[183,292],[271,270],[154,312],[313,307],[135,313],[332,307],[188,40],0,[151,181,184,42]),
            P([174,166],[191,145],[178,154],[205,135],[153,210],[205,88],[132,300],[205,51],[199,218],[219,215],[176,305],[258,260],[136,307],[258,310],[117,309],[279,311],[205,27],0,[171,160,201,29]),
            P([197,84],[201,110],[187,124],[215,124],[178,174],[215,80],[168,223],[215,44],[194,210],[214,210],[174,305],[250,258],[136,307],[250,310],[116,309],[272,312],[215,20],0,[193,84,174,86]),
            P([201,70],[201,96],[187,110],[215,110],[182,156],[215,77],[174,205],[215,45],[188,194],[214,194],[173,250],[226,250],[168,310],[232,310],[148,312],[254,312],[215,20],0,[197,70,176,72])
          ],
          sequence: [0, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 0],
          segment: [720, 740, 760, 840, 760, 720, 820, 520, 620, 650, 700, 640, 620, 700],
          current: `<svg viewBox="0 0 100 110" role="img" aria-label="Turkish Get-Up actuel"><g class="old-tgu"><circle cx="50" cy="25" r="9" fill="none" stroke="#e8d5c0" stroke-width="2.5"/><line x1="50" y1="34" x2="52" y2="68" stroke="#e8d5c0" stroke-width="3"/><line x1="50" y1="48" x2="68" y2="58" stroke="#e8d5c0" stroke-width="2.5"/><line x1="50" y1="48" x2="28" y2="12" stroke="#e8d5c0" stroke-width="2.5"/><rect x="20" y="3" width="12" height="10" rx="3" fill="none" stroke="#4ecdc4" stroke-width="2.5"/><line x1="52" y1="68" x2="40" y2="95" stroke="#e8d5c0" stroke-width="3"/><line x1="52" y1="68" x2="62" y2="95" stroke="#e8d5c0" stroke-width="3"/></g></svg>`
        }
      };

      /*
       * SVG Motion Lab, canonical profiles 1-51.
       *
       * Temporary integration fragment. It intentionally does not mutate the lab.
       * The three accepted rigs (goblet-squat, kb-swing, turkish-get-up) remain owned
       * by svg-motion-lab.html. This packet supplies the other 48 canonical profiles
       * plus explicit mirror variants for the app's named left/right exercises.
       */
      (function exposeRigSeeds(root) {
        'use strict';
      
        const pt = value => Array.isArray(value) ? [...value] : value;
        const clonePose = pose => Object.fromEntries(Object.entries(pose).map(([key, value]) => {
          if (Array.isArray(value)) return [key, value.map(pt)];
          if (value && typeof value === 'object') return [key, { ...value }];
          return [key, value];
        }));
        const alter = (pose, changes) => Object.assign(clonePose(pose), changes);
      
        // Same joint contract as P() in svg-motion-lab.html. Additional `bells`,
        // `bellLayer` and `props` fields are deliberately additive renderer metadata.
        const P = (head, neck, ls, rs, le, re, lw, rw, lh, rh, lk, rk, la, ra, lt, rt, kb, angle = 0, gaze = null, extra = {}) => ({
          head, neck, ls, rs, le, re, lw, rw, lh, rh, lk, rk, la, ra, lt, rt, kb, angle, gaze, ...extra
        });
      
        const front = P(
          [180,54], [180,82], [157,96], [203,96], [151,138], [209,138], [151,176], [209,176],
          [166,188], [194,188], [154,248], [206,248], [150,310], [210,310], [132,312], [228,312],
          [180,154], 0, [176,53,176,30]
        );
        const side = P(
          [179,55], [178,84], [169,98], [187,98], [163,140], [193,140], [160,178], [197,178],
          [171,188], [191,188], [157,249], [207,249], [145,310], [219,310], [126,312], [239,312],
          [198,178], 0, [176,54,154,56]
        );
        const supine = P(
          [58,286], [84,286], [105,276], [108,296], [136,255], [137,304], [150,228], [166,300],
          [188,286], [198,300], [230,258], [248,283], [278,300], [298,308], [300,308], [320,310],
          [150,207], 0, [55,281,100,220]
        );
        const plank = P(
          [70,236], [94,242], [116,242], [119,258], [135,278], [139,278], [126,310], [151,310],
          [210,264], [214,278], [261,280], [266,289], [310,303], [314,312], [331,306], [334,314],
          [172,292], 0, [67,232,42,227]
        );
      
        const SOURCE = {
          hinge: [{ label: 'StrongFirst · Athletic Hip Hinge', url: 'https://www.strongfirst.com/explanation-athletic-hip-hinge/' }],
          clean: [{ label: 'StrongFirst · The 3 Cleans', url: 'https://www.strongfirst.com/3-cleans-relationship-form-function/' }],
          press: [{ label: 'StrongFirst · 3 Key Distinctions of the Press', url: 'https://www.strongfirst.com/the-3-key-distinctions-of-the-kettlebell-press/' }],
          snatch: [{ label: 'StrongFirst · Tame the Arc', url: 'https://www.strongfirst.com/mind-the-drop-tame-the-arc-for-better-snatches/' }],
          windmill: [{ label: 'StrongFirst · Kettlebell Windmill 101', url: 'https://www.strongfirst.com/kettlebell-windmill-101/' }],
          halo: [{ label: 'StrongFirst · Swing Grip and Halo', url: 'https://www.strongfirst.com/proper-swing-grip-kettlebell-halo/' }],
          squat: [{ label: 'StrongFirst · Kettlebell Front Squat', url: 'https://www.strongfirst.com/build-base-strength-5rm-kettlebell-front-squat-program/' }],
          shoulder: [{ label: 'StrongFirst · Get-Up and Shoulder Mobility', url: 'https://www.strongfirst.com/the-get-up-and-the-shoulder-mobility-dilemma/' }],
          row: [{ label: 'StrongFirst · A Word on Rows', url: 'https://www.strongfirst.com/a-word-on-rows/' }],
          pushup: [{ label: 'Push-Up Plus systematic review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6863690/' }],
          core: [{ label: 'Core exercise systematic review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7345922/' }],
          bodyweight: [{ label: 'Stronger by Science · No-Gym Training', url: 'https://www.strongerbyscience.com/no-gym/' }],
          bridge: [{ label: 'NASM · Glute Bridge', url: 'https://blog.nasm.org/how-to-do-a-glute-bridge' }]
        };
      
        const FAMILY = {
          squat: {
            invariants: ['Pieds ancrés et genoux dans l’axe des orteils', 'Colonne longue, charge centrée'],
            flags: ['Genou valgus ou talon qui décolle', 'Torse effondré ou charge qui traverse les cuisses'], sources: SOURCE.squat
          },
          hinge: {
            invariants: ['Charnière de hanche avec colonne longue', 'Charge proche des jambes, pieds en tripode'],
            flags: ['Hinge transformé en squat', 'Dos arrondi ou charge éloignée'], sources: SOURCE.hinge
          },
          clean: {
            invariants: ['Arc étroit et insertion de la main', 'Poignet neutre, coude proche du tronc'],
            flags: ['Curl de bras ou grand arc', 'Impact sur l’avant-bras ou cloche dans le torse'], sources: SOURCE.clean
          },
          press: {
            invariants: ['Cage et bassin empilés', 'Poignet, coude et épaule empilés au verrouillage'],
            flags: ['Cambrure ou inclinaison latérale', 'Poignet cassé ou coude très écarté'], sources: SOURCE.press
          },
          row: {
            invariants: ['Angle du torse et bassin stables', 'Coude vers la hanche, charge près du corps'],
            flags: ['Rotation du tronc ou shrug', 'Extension de hanche pour lancer la charge'], sources: SOURCE.row
          },
          carry: {
            invariants: ['Tête, bassin et pied d’appui empilés', 'Épaules basses, bassin horizontal'],
            flags: ['Inclinaison latérale', 'Cloche qui se balance ou genou qui croise'], sources: SOURCE.hinge
          },
          ground: {
            invariants: ['Côtes et bassin contrôlés', 'Charge empilée au-dessus de l’appui'],
            flags: ['Cambrure ou rotation du torse', 'Bras chargé derrière l’épaule'], sources: SOURCE.shoulder
          },
          bodyweight: {
            invariants: ['Appuis fixes et trajectoire contrôlée', 'Amplitude compatible avec une colonne neutre'],
            flags: ['Élan ou perte d’alignement', 'Amplitude forcée au détriment du contrôle'], sources: SOURCE.bodyweight
          }
        };
      
        const pathFor = poses => {
          const points = poses.map(pose => pose.kb).filter(Boolean);
          return points.length ? `M${points.map(point => `${point[0]} ${point[1]}`).join(' L')}` : '';
        };
        const defaultSequence = count => count === 1 ? [0, 0] : [...Array(count).keys(), ...Array.from({ length: count - 1 }, (_, i) => count - 2 - i)];
        const seed = (id, title, family, poses, phases, options = {}) => {
          const profile = FAMILY[options.familyProfile || family] || FAMILY.bodyweight;
          const sequence = options.sequence || defaultSequence(poses.length);
          return {
            id, title, aliases: options.aliases || [], family, equipment: options.equipment || ['kettlebell'],
            laterality: options.laterality || 'bilatéral', side: options.side || 'both', mirror: false,
            mirrorable: Boolean(options.mirrorable), renderer: options.renderer || 'standard', rigStatus: 'research-packet', rigVersion: '0.1',
            summary: options.summary || `${title}, poses déterministes et trajectoire de charge indépendante.`,
            duration: options.duration || Math.max(2600, sequence.length * 620), hold: options.hold ?? .08, interpolation: options.interpolation || 'smoother',
            trajectory: options.trajectory || pathFor(poses), phases, phaseDetails: options.phaseDetails || phases,
            invariants: options.invariants || profile.invariants, flags: options.flags || profile.flags, sources: options.sources || profile.sources,
            poses, sequence, segment: options.segment || sequence.map((_, index) => index === sequence.length - 1 ? 420 : 620),
            current: '', renderMeta: options.renderMeta || { bellCount: 1, dynamicZ: false },
            composition: options.composition || null,
            appVariants: options.appVariants || null
          };
        };
      
        const bilateralMirrorVariants = (baseId, labels) => Object.fromEntries(labels.map(([suffix, title, mirror]) => [
          `${baseId}-${suffix}`,
          { extends: baseId, title, side: mirror ? 'right' : 'left', laterality: 'unilatéral', mirror, canonicalProfile: baseId }
        ]));
      
        const squatStand = alter(front, { kb: [180,151], lw: [169,149], rw: [191,149], le: [153,130], re: [207,130] });
        const squatMid = alter(squatStand, { head:[180,82], neck:[180,110], ls:[157,124],rs:[203,124],le:[151,153],re:[209,153],lw:[169,170],rw:[191,170],lh:[166,211],rh:[194,211],lk:[135,265],rk:[225,265],kb:[180,172] });
        const squatLow = alter(squatMid, { head:[180,105],neck:[180,133],ls:[157,147],rs:[203,147],le:[150,177],re:[210,177],lw:[169,194],rw:[191,194],lh:[165,234],rh:[195,234],lk:[121,274],rk:[239,274],kb:[180,196] });
        const hingeTop = alter(side, { kb:[181,202], lw:[177,188], rw:[185,188], le:[169,147],re:[188,147] });
        const hingeMid = alter(hingeTop, { head:[129,119],neck:[149,137],ls:[143,151],rs:[158,157],le:[164,184],re:[174,186],lw:[180,216],rw:[187,216],lh:[193,205],rh:[205,210],lk:[170,256],rk:[220,256],kb:[184,233], gaze:[126,115,103,118] });
        const hingeFloor = alter(hingeMid, { head:[120,142],neck:[143,158],ls:[137,171],rs:[153,176],le:[158,205],re:[170,207],lw:[178,259],rw:[187,259],lh:[198,223],rh:[211,228],lk:[171,270],rk:[224,270],kb:[183,284], gaze:[117,139,95,145] });
        const rack = alter(front, { le:[148,126],lw:[169,116],re:[213,143],rw:[220,175],kb:[160,112],angle:-8 });
        const overhead = alter(rack, { le:[165,72],lw:[174,31],kb:[174,22],angle:3 });
        const cleanBack = alter(hingeMid, { lw:[181,220], kb:[191,235], bellLayer:'behind-pelvis' });
        const cleanFloat = alter(front, { le:[145,132],lw:[152,125],kb:[147,129],angle:-24 });
        const deadCleanFloor = alter(hingeFloor, { lw:[169,270],kb:[169,286], angle:-5 });
      
        const defs = {};
      
        defs['sumo-squat'] = seed('sumo-squat', 'Sumo Squat', 'squat', [
          alter(front,{lh:[158,188],rh:[202,188],lk:[120,249],rk:[240,249],la:[91,310],ra:[269,310],lt:[72,312],rt:[288,312],lw:[176,206],rw:[184,206],kb:[180,230]}),
          alter(front,{head:[180,83],neck:[180,111],ls:[157,125],rs:[203,125],lh:[158,223],rh:[202,223],lk:[105,271],rk:[255,271],la:[91,310],ra:[269,310],lt:[72,312],rt:[288,312],le:[164,172],re:[196,172],lw:[176,230],rw:[184,230],kb:[180,253]})
        ], ['Suspension debout','Squat large'], { renderer:'front-rack', renderMeta:{bellCount:1,dynamicZ:false,groundClearance:true} });
      
        const doubleTop = alter(squatStand,{kb:[153,118],bells:[{id:'left',x:153,y:118,angle:-8},{id:'right',x:207,y:118,angle:8}]});
        const doubleLow = alter(squatLow,{kb:[153,165],bells:[{id:'left',x:153,y:165,angle:-8},{id:'right',x:207,y:165,angle:8}]});
        defs['double-front-squat'] = seed('double-front-squat','Double KB Front Squat','squat',[doubleTop,doubleLow],['Double rack','Squat bas'],{renderer:'multi-bell-front-rack',renderMeta:{bellCount:2,dynamicZ:false,bellsField:'bells'},summary:'Deux cloches indépendantes restent fixées aux avant-bras pendant le squat.'});
      
        const cossackCenter=alter(squatStand,{la:[70,310],lt:[48,312],ra:[290,310],rt:[312,312]});
        const cossackLeft=alter(cossackCenter,{head:[135,108],neck:[143,136],ls:[119,149],rs:[165,149],le:[116,180],re:[170,180],lw:[132,197],rw:[154,197],lh:[122,221],rh:[163,220],lk:[91,273],rk:[232,288],la:[70,310],ra:[290,310],lt:[48,312],rt:[312,300],kb:[143,199]});
        defs['goblet-cossack'] = seed('goblet-cossack','Goblet Cossack Squat','squat',[cossackCenter,cossackLeft],['Stance large','Cossack gauche'],{mirrorable:true,renderer:'front-rack',sequence:[0,1,0,1],segment:[650,900,650,900],appVariants:[{title:'Côté gauche',mirror:false},{title:'Côté droit',mirror:true}]});
      
        const airStand=alter(squatStand,{kb:[180,154],angle:0,props:{hideBell:true},lw:[165,148],rw:[195,148]});
        const airLow=alter(squatLow,{kb:[180,196],props:{hideBell:true},lw:[154,177],rw:[206,177]});
        defs['air-squat']=seed('air-squat','Squat au poids du corps','squat',[airStand,airLow],['Debout','Squat contrôlé'],{equipment:['bodyweight'],renderer:'bodyweight',renderMeta:{bellCount:0,dynamicZ:false,hideBell:true}});
        defs['tempo-air-squat']={...seed('tempo-air-squat','Squat tempo','squat',[airStand,squatMid,airLow],['Debout','Descente lente','Pause basse'],{equipment:['bodyweight'],renderer:'bodyweight',sequence:[0,1,2,2,1,0],segment:[1500,1500,700,900,1100,500],duration:6200,renderMeta:{bellCount:0,dynamicZ:false,hideBell:true}}),timing:{duration:6200,hold:.04,interpolation:'smoother'}};
      
        const lungeTop=alter(front,{props:{hideBell:true},kb:[180,150]});
        const lungeBack=alter(lungeTop,{lh:[169,190],rh:[195,190],lk:[163,249],rk:[239,260],la:[156,310],ra:[286,310],lt:[137,312],rt:[307,312]});
        const lungeLow=alter(lungeBack,{head:[180,75],neck:[180,103],ls:[157,117],rs:[203,117],lh:[169,207],rh:[195,207],lk:[160,268],rk:[243,292],la:[156,310],ra:[286,310],lt:[137,312],rt:[307,312]});
        defs['reverse-lunge-bw']=seed('reverse-lunge-bw','Fente arrière alternée','lunge',[lungeTop,lungeBack,lungeLow],['Debout','Pas arrière','Genou proche du sol'],{familyProfile:'bodyweight',equipment:['bodyweight'],mirrorable:true,renderer:'bodyweight',renderMeta:{bellCount:0,dynamicZ:false,hideBell:true},sequence:[0,1,2,1,0],appVariants:[{title:'Jambe gauche',mirror:false},{title:'Jambe droite',mirror:true}]});
        const gobletLungeTop=alter(lungeTop,{props:null,kb:[180,151],lw:[169,149],rw:[191,149],le:[153,130],re:[207,130]});
        const gobletLungeLow=alter(lungeLow,{props:null,kb:[180,169],lw:[169,167],rw:[191,167],le:[153,148],re:[207,148]});
        defs['goblet-reverse-lunge']=seed('goblet-reverse-lunge','Goblet Reverse Lunge','lunge',[gobletLungeTop,gobletLungeLow],['Goblet debout','Fente arrière'],{familyProfile:'squat',mirrorable:true,renderer:'front-rack',appVariants:[{title:'Jambe gauche',mirror:false},{title:'Jambe droite',mirror:true}]});
        const tacticalLow=alter(lungeLow,{lw:[166,250],rw:[195,205],le:[154,215],re:[205,160],kb:[171,260],bellLayer:'behind-front-thigh'});
        const tacticalReceive=alter(lungeLow,{lw:[154,204],rw:[188,252],le:[147,161],re:[205,216],kb:[182,260],bellLayer:'front-after-pass'});
        defs['tactical-lunge']=seed('tactical-lunge','Tactical Lunge','lunge',[alter(lungeTop,{kb:[151,180],lw:[151,176]}),tacticalLow,tacticalReceive],['Pas arrière','Passe sous la cuisse','Réception opposée'],{familyProfile:'squat',mirrorable:true,renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true,zByPose:['front','behind-front-thigh','front']},flags:['Pas trop court ou genou dans le mauvais axe','Cloche qui traverse la cuisse ou rotation du torse']});
      
        defs['kb-deadlift']=seed('kb-deadlift','KB Deadlift','hinge',[hingeFloor,hingeMid,hingeTop],['Setup au sol','Décollage','Verrouillage'],{renderer:'side-hinge',renderMeta:{bellCount:1,dynamicZ:false,groundContactAt:[0]}});
        defs['kb-rdl']=seed('kb-rdl','KB Romanian Deadlift','hinge',[hingeTop,hingeMid],['Debout','Charnière sous le genou'],{renderer:'side-hinge'});
        const slRdlTop=alter(front,{props:{hideBell:true},kb:[180,200],la:[178,310],lt:[158,312],ra:[207,310],rt:[227,312]});
        const slRdlHinge=alter(slRdlTop,{head:[111,135],neck:[136,149],ls:[124,160],rs:[151,165],lh:[178,210],rh:[193,215],lk:[179,258],rk:[254,239],la:[178,310],ra:[306,228],lt:[158,312],rt:[326,224],props:{hideBell:true}});
        defs['single-leg-rdl-bw']=seed('single-leg-rdl-bw','Single-Leg RDL sans charge','hinge',[slRdlTop,slRdlHinge],['Équilibre debout','Charnière unipodale'],{equipment:['bodyweight'],mirrorable:true,renderer:'bodyweight',renderMeta:{bellCount:0,dynamicZ:false,hideBell:true},appVariants:[{title:'Appui gauche',mirror:false},{title:'Appui droit',mirror:true}]});
      
        const bridgeDown=alter(supine,{props:{hideBell:true},kb:[180,200],head:[58,286],neck:[84,286],ls:[105,282],rs:[108,296],lh:[188,286],rh:[198,300],lk:[236,260],rk:[249,281],la:[280,310],ra:[298,310]});
        const bridgeUp=alter(bridgeDown,{lh:[188,235],rh:[198,247],lk:[236,260],rk:[249,281]});
        defs['glute-bridge']=seed('glute-bridge','Pont fessier','bridge',[bridgeDown,bridgeUp],['Bassin au sol','Extension de hanche'],{familyProfile:'bodyweight',equipment:['bodyweight'],renderer:'ground-bodyweight',renderMeta:{bellCount:0,dynamicZ:false,hideBell:true},sources:SOURCE.bridge});
        const singleBridgeDown=alter(bridgeDown,{rk:[224,233],ra:[255,211],rt:[274,206]});
        const singleBridgeUp=alter(bridgeUp,{rk:[224,225],ra:[257,205],rt:[276,200]});
        defs['single-leg-glute-bridge']=seed('single-leg-glute-bridge','Pont fessier une jambe','bridge',[singleBridgeDown,singleBridgeUp],['Bassin au sol','Pont une jambe'],{familyProfile:'bodyweight',equipment:['bodyweight'],mirrorable:true,renderer:'ground-bodyweight',renderMeta:{bellCount:0,dynamicZ:false,hideBell:true},sources:SOURCE.bridge});
        const calfLow=alter(front,{props:{hideBell:true},kb:[180,154],la:[180,310],lt:[160,312],ra:[208,306],rt:[226,308]});
        const calfHigh=alter(calfLow,{head:[180,47],neck:[180,75],ls:[157,89],rs:[203,89],lh:[166,181],rh:[194,181],lk:[165,242],rk:[207,242],la:[180,303],lt:[160,308],ra:[208,299],rt:[226,304]});
        defs['single-leg-calf-raise']=seed('single-leg-calf-raise','Mollet une jambe','calf',[calfLow,calfHigh],['Talon bas','Montée sur avant-pied'],{familyProfile:'bodyweight',equipment:['bodyweight'],mirrorable:true,renderer:'bodyweight',renderMeta:{bellCount:0,dynamicZ:false,hideBell:true,optionalProp:'wall'}});
      
        const oneSwingBack=alter(cleanBack,{rw:[205,180],re:[212,139],bellLayer:'behind-pelvis'});
        const oneSwingFloat=alter(front,{lw:[112,119],le:[145,111],kb:[95,124],rw:[213,169],re:[211,133]});
        defs['single-arm-swing']=seed('single-arm-swing','Single Swing','hinge',[oneSwingBack,hingeTop,oneSwingFloat],['Backswing','Drive de hanche','Flottement'],{mirrorable:true,renderer:'swing-depth',renderMeta:{bellCount:1,dynamicZ:true,zByPose:['behind-pelvis','front','front']},appVariants:[{id:'single-swing-left',title:'Single Swing (G)',mirror:false},{id:'single-swing-right',title:'Single Swing (D)',mirror:true}]});
        const rotLoad=alter(oneSwingBack,{la:[124,310],lt:[105,306],ra:[235,300],rt:[253,290],lh:[158,195],rh:[189,204]});
        const rotPivot=alter(oneSwingFloat,{head:[211,61],neck:[202,89],ls:[180,98],rs:[220,105],lh:[178,188],rh:[205,195],lk:[159,250],rk:[229,244],la:[135,309],ra:[253,294],lt:[116,307],rt:[271,284],kb:[124,134]});
        defs['rotational-swing']=seed('rotational-swing','Rotational Swing','hinge',[rotLoad,rotPivot],['Charge hanche','Pivot coordonné'],{mirrorable:true,renderer:'swing-depth',renderMeta:{bellCount:1,dynamicZ:true,zByPose:['behind-pelvis','front'],footPivot:true},invariants:['Pied, genou, bassin et thorax pivotent ensemble','Décélération par la hanche, charge légère'],flags:['Rotation lombaire isolée','Genou qui ne suit pas le pied pivoté']});
      
        defs['single-arm-clean']=seed('single-arm-clean','Clean par côté','clean',[cleanBack,cleanFloat,rack],['Backswing','Float étroit','Insertion / rack'],{mirrorable:true,renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true,zByPose:['behind-pelvis','front','forearm-rack']},appVariants:[{id:'clean-left',title:'Clean (G)',mirror:false},{id:'clean-right',title:'Clean (D)',mirror:true}]});
        const twoCleanBack=alter(cleanBack,{lw:[176,220],rw:[188,220],le:[166,185],re:[178,187],kb:[183,237]});
        const twoCleanRack=alter(squatStand,{kb:[180,153],lw:[169,151],rw:[191,151]});
        defs['two-hand-clean']=seed('two-hand-clean','Clean à deux mains','clean',[twoCleanBack,alter(cleanFloat,{lw:[166,132],rw:[177,132],kb:[172,138]}),twoCleanRack],['Backswing deux mains','Float','Goblet rack'],{renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true,zByPose:['behind-pelvis','front','front']}});
        defs['dead-clean']=seed('dead-clean','Dead Clean','clean',[deadCleanFloor,cleanFloat,rack],['Départ au sol','Traction proche','Rack'],{mirrorable:true,renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true,groundContactAt:[0]},appVariants:[{id:'dead-clean-left',title:'Dead Clean (G)',mirror:false},{id:'dead-clean-right',title:'Dead Clean (D)',mirror:true}]});
        const bottomsRack=alter(rack,{kb:[158,82],angle:180,lw:[160,105],le:[150,128]});
        defs['bottoms-up-clean']=seed('bottoms-up-clean','Bottoms-Up Clean','clean',[alter(deadCleanFloor,{kb:[170,281]}),cleanFloat,bottomsRack],['Départ léger','Clean court','Stabilisation bottoms-up'],{mirrorable:true,renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true,bellOrientation:'bottoms-up-at-lockout'},flags:['Grand arc ou accélération excessive','Cloche qui bascule, poignet cassé']});
      
        const concat = (...groups) => groups.flat().map(clonePose);
        const cleanPoses=defs['single-arm-clean'].poses;
        const pressPoses=[rack,overhead];
        const thrusterPoses=[rack,alter(rack,{head:[180,101],neck:[180,129],ls:[157,143],rs:[203,143],lh:[166,228],rh:[194,228],lk:[126,272],rk:[234,272],kb:[160,159],lw:[169,163],le:[148,150]}),overhead];
        const squatCleanPoses=concat(defs['dead-clean'].poses,[alter(rack,{head:[180,95],neck:[180,123],ls:[157,137],rs:[203,137],lh:[166,228],rh:[194,228],lk:[125,272],rk:[235,272],kb:[160,153]})]);
        defs['squat-clean']=seed('squat-clean','Squat Clean','clean',squatCleanPoses,['Départ sol','Traction','Rack','Front squat'],{mirrorable:true,renderer:'dynamic-depth',composition:{kind:'concat',profiles:['dead-clean','single-arm-front-squat'],junction:'rack'},renderMeta:{bellCount:1,dynamicZ:true}});
      
        const snatchHigh=alter(front,{le:[135,113],lw:[144,103],kb:[137,105],angle:-30});
        const snatchPunch=alter(overhead,{kb:[174,22],angle:4});
        defs['snatch']=seed('snatch','Snatch','ballistic',[oneSwingBack,oneSwingFloat,snatchHigh,snatchPunch],['Backswing','Extension / float','High pull étroit','Punch-through overhead'],{familyProfile:'clean',mirrorable:true,renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true,zByPose:['behind-pelvis','front','front','forearm-overhead']},sources:SOURCE.snatch,flags:['Cloche loin du corps ou épaule qui lève','Coude arraché au drop ou impact sur avant-bras'],appVariants:[{id:'snatch-left',title:'Snatch (G)',mirror:false},{id:'snatch-right',title:'Snatch (D)',mirror:true}]});
        const highPullTop=alter(front,{le:[132,116],lw:[156,121],kb:[146,128],angle:-20,rw:[214,173]});
        defs['high-pull']=seed('high-pull','High Pull','ballistic',[oneSwingBack,oneSwingFloat,highPullTop],['Backswing','Extension','Coude vers arrière'],{familyProfile:'clean',mirrorable:true,renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true},flags:['Upright row ou traction d’épaule','Cloche éloignée du sternum'],appVariants:[{id:'high-pull-left',title:'High Pull (G)',mirror:false},{id:'high-pull-right',title:'High Pull (D)',mirror:true}]});
      
        defs['strict-press-standing']=seed('strict-press-standing','Press strict debout','press',[rack,alter(rack,{le:[151,91],lw:[166,65],kb:[161,57]}),overhead],['Rack','Mi-presse','Verrouillage'],{mirrorable:true,renderer:'forearm-rack',appVariants:[{id:'press-left',title:'Press (gauche)',mirror:false},{id:'press-right',title:'Press (droite)',mirror:true}]});
        const dip=alter(rack,{head:[180,66],neck:[180,94],ls:[157,108],rs:[203,108],lh:[166,200],rh:[194,200],lk:[149,258],rk:[211,258],kb:[160,124],lw:[169,128],le:[148,138]});
        defs['push-press']=seed('push-press','Push Press','press',[rack,dip,overhead],['Rack','Dip vertical court','Extension et lockout'],{mirrorable:true,renderer:'forearm-rack',appVariants:[{id:'push-press-left',title:'Push Press (G)',mirror:false},{id:'push-press-right',title:'Push Press (D)',mirror:true}],flags:['Dip transformé en squat','Bras part avant les jambes ou côtes ouvertes']});
        defs['clean-and-press']=seed('clean-and-press','Clean & Press','clean',concat(cleanPoses,[overhead]),['Backswing','Float','Rack','Press / lockout'],{mirrorable:true,renderer:'dynamic-depth',composition:{kind:'concat',profiles:['single-arm-clean','strict-press-standing'],junction:'rack'},renderMeta:{bellCount:1,dynamicZ:true},appVariants:[{id:'clean-press-left',title:'Clean & Press (G)',mirror:false},{id:'clean-press-right',title:'Clean & Press (D)',mirror:true}]});
        const halfRack=alter(rack,{lh:[169,205],rh:[195,205],lk:[164,270],rk:[235,266],la:[161,310],ra:[275,310],lt:[142,312],rt:[294,312]});
        const halfOverhead=alter(halfRack,{le:[165,72],lw:[174,31],kb:[174,22]});
        defs['half-kneeling-press']=seed('half-kneeling-press','Half-Kneeling Press','press',[halfRack,halfOverhead],['Rack demi-genou','Lockout'],{mirrorable:true,renderer:'forearm-rack',renderMeta:{bellCount:1,dynamicZ:false,groundContact:['rear-knee']}});
        const seatedRack=alter(rack,{lh:[166,231],rh:[194,231],lk:[121,271],rk:[239,271],la:[75,310],ra:[285,310],lt:[55,312],rt:[305,312]});
        const seatedOverhead=alter(seatedRack,{le:[165,72],lw:[174,31],kb:[174,22]});
        defs['seated-strict-press']=seed('seated-strict-press','Seated Strict Press','press',[seatedRack,seatedOverhead],['Rack assis','Lockout assis'],{mirrorable:true,renderer:'forearm-rack',renderMeta:{bellCount:1,dynamicZ:false,groundContact:['pelvis','legs']}});
        defs['thruster']=seed('thruster','Thruster','press',thrusterPoses,['Rack','Squat bas','Transfert jambes-bras / lockout'],{mirrorable:true,renderer:'forearm-rack',renderMeta:{bellCount:1,dynamicZ:false},flags:['Press depuis le fond du squat','Cloche projetée en avant ou côtes ouvertes'],appVariants:[{id:'thruster-left',title:'Thruster (G)',mirror:false},{id:'thruster-right',title:'Thruster (D)',mirror:true}]});
        defs['clean-thruster']=seed('clean-thruster','Clean + Thruster par côté','clean',concat(cleanPoses,thrusterPoses.slice(1)),['Backswing','Float','Rack','Squat','Lockout'],{mirrorable:true,renderer:'dynamic-depth',composition:{kind:'concat',profiles:['single-arm-clean','thruster'],junction:'rack'},renderMeta:{bellCount:1,dynamicZ:true}});
      
        const rowLong=alter(hingeMid,{lw:[155,236],le:[150,201],kb:[155,257],rw:[210,232],re:[205,196]});
        const rowTop=alter(rowLong,{lw:[179,199],le:[151,173],kb:[178,217]});
        defs['one-arm-row']=seed('one-arm-row','Row par côté','row',[rowLong,rowTop],['Bras long','Coude vers hanche'],{mirrorable:true,renderer:'side-hinge',appVariants:[{id:'row-left',title:'Row (gauche)',mirror:false},{id:'row-right',title:'Row (droite)',mirror:true}]});
        const suitcaseRowLong=alter(rowLong,{la:[134,310],lt:[116,312],ra:[238,310],rt:[256,312],kb:[150,260]});
        const suitcaseRowTop=alter(rowTop,{la:[134,310],lt:[116,312],ra:[238,310],rt:[256,312],kb:[177,217]});
        defs['suitcase-row']=seed('suitcase-row','Suitcase Row','row',[suitcaseRowLong,suitcaseRowTop],['Stance décalée / bras long','Row vers hanche'],{mirrorable:true,renderer:'side-hinge'});
        const gorillaLong=alter(hingeFloor,{kb:[150,287],bells:[{id:'left',x:150,y:287,angle:0},{id:'right',x:210,y:287,angle:0}],lw:[150,270],rw:[210,270]});
        const gorillaPull=alter(gorillaLong,{lw:[177,213],le:[151,190],kb:[177,231],bells:[{id:'left',x:177,y:231,angle:-5},{id:'right',x:210,y:287,angle:0}]});
        defs['gorilla-row']=seed('gorilla-row','Gorilla Row','row',[gorillaLong,gorillaPull],['Deux appuis au sol','Row unilatéral'],{mirrorable:true,renderer:'multi-bell-depth',sequence:[0,1,0,1],renderMeta:{bellCount:2,dynamicZ:true,bellsField:'bells',alternateByMirror:true}});
        const renegadeLong=alter(plank,{kb:[133,309],bells:[{id:'left',x:133,y:309,angle:0},{id:'right',x:158,y:309,angle:0}],lw:[133,300],rw:[158,300]});
        const renegadePull=alter(renegadeLong,{lw:[184,255],le:[151,249],kb:[184,273],bells:[{id:'left',x:184,y:273,angle:-8},{id:'right',x:158,y:309,angle:0}]});
        defs['renegade-row']=seed('renegade-row','Renegade Row','row',[renegadeLong,renegadePull],['Planche stable','Row sans rotation'],{mirrorable:true,renderer:'multi-bell-ground',sequence:[0,1,0,1],renderMeta:{bellCount:2,dynamicZ:true,bellsField:'bells',alternateByMirror:true,stableBasesRequired:true}});
      
        const floorBottom=alter(supine,{le:[132,294],lw:[145,254],kb:[145,235],angle:0});
        const floorTop=alter(floorBottom,{le:[145,252],lw:[150,207],kb:[150,187]});
        defs['single-arm-floor-press']=seed('single-arm-floor-press','Floor Press par côté','ground',[floorBottom,floorTop],['Triceps au sol','Press vertical'],{mirrorable:true,renderer:'ground-load',renderMeta:{bellCount:1,dynamicZ:false,groundContact:['triceps-at-bottom']},appVariants:[{id:'floor-press-left',title:'Floor Press gauche',mirror:false},{id:'floor-press-right',title:'Floor Press droite',mirror:true}]});
        const halfGetRack=alter(supine,{lw:[117,260],le:[105,279],kb:[116,241]});
        const halfGetElbow=alter(halfGetRack,{head:[95,242],neck:[117,244],ls:[130,249],rs:[133,266],le:[145,285],re:[151,289],lw:[117,219],rw:[175,303],kb:[117,199]});
        const halfGetSit=alter(halfGetElbow,{head:[134,174],neck:[149,198],ls:[136,210],rs:[165,214],le:[108,254],re:[166,255],lw:[90,307],rw:[170,278],kb:[144,152]});
        const halfGetPress=alter(halfGetSit,{le:[144,155],lw:[146,111],kb:[146,91]});
        defs['half-get-up-press']=seed('half-get-up-press','Half Get-Up Press','ground',[halfGetRack,halfGetElbow,halfGetSit,halfGetPress],['Rack couché','Roll coude','Tall sit','Press'],{mirrorable:true,renderer:'ground-load',renderMeta:{bellCount:1,dynamicZ:false},composition:{kind:'partial',profiles:['turkish-get-up','strict-press-standing'],range:'roll-to-tall-sit+press'}});
        const pulloverTop=alter(supine,{lw:[145,222],rw:[155,222],le:[132,248],re:[145,248],kb:[150,201]});
        const pulloverBack=alter(pulloverTop,{lw:[88,256],rw:[93,264],le:[111,245],re:[114,255],kb:[70,253],angle:-65});
        defs['kb-pullover']=seed('kb-pullover','Kettlebell Pullover','ground',[pulloverTop,pulloverBack],['Au-dessus poitrine','Arc derrière tête'],{renderer:'ground-load',renderMeta:{bellCount:1,dynamicZ:false},flags:['Côtes qui s’ouvrent ou lombaires qui s’arquent','Coudes verrouillés ou amplitude forcée']});
        const deadBugTop=alter(pulloverTop,{lk:[210,238],rk:[231,249],la:[208,194],ra:[251,210],lt:[200,177],rt:[263,194]});
        const deadBugBack=alter(pulloverBack,{lk:[210,238],rk:[231,249],la:[208,194],ra:[251,210],lt:[200,177],rt:[263,194]});
        defs['dead-bug-pullover']=seed('dead-bug-pullover','Dead Bug Pullover','ground',[deadBugTop,deadBugBack],['90/90 + charge poitrine','Pullover contrôlé'],{renderer:'ground-load',renderMeta:{bellCount:1,dynamicZ:false},invariants:['Hanches et genoux à 90°, lombaires au sol','Coudes souples, arc contrôlé'],flags:['Jambes qui dérivent ou lombaires qui décollent','Cloche trop basse derrière la tête']});
      
        const armBarStart=alter(floorTop,{lw:[150,207],kb:[150,187]});
        const armBarRoll=alter(armBarStart,{head:[93,269],neck:[116,264],ls:[131,253],rs:[136,270],le:[145,229],lw:[150,188],kb:[150,168],lh:[188,270],rh:[200,283],lk:[222,245],rk:[260,288],la:[269,275],ra:[312,310]});
        defs['kb-arm-bar']=seed('kb-arm-bar','Kettlebell Arm Bar','ground',[armBarStart,armBarRoll],['Bras vertical couché','Roulé latéral empilé'],{mirrorable:true,renderer:'ground-load',renderMeta:{bellCount:1,dynamicZ:false},invariants:['Bras chargé vertical du début à la fin','Hanches et épaules roulent ensemble'],flags:['Bras derrière l’épaule','Rotation du bras sans roulé du corps']});
        const windTop=alter(front,{lw:[164,43],le:[163,78],kb:[164,24],rw:[215,175],re:[208,138],la:[135,310],lt:[115,312],ra:[235,310],rt:[255,312]});
        const windLow=alter(windTop,{head:[126,122],neck:[148,138],ls:[137,151],rs:[164,156],lh:[183,207],rh:[201,213],lw:[164,43],le:[164,92],kb:[164,24],rw:[228,263],re:[199,211]});
        defs['windmill']=seed('windmill','Windmill','windmill',[windTop,windLow],['Overhead empilé','Charnière dans canal de hanche'],{familyProfile:'hinge',mirrorable:true,renderer:'overhead-depth',sources:SOURCE.windmill,renderMeta:{bellCount:1,dynamicZ:false,feetTurnedDegrees:45},invariants:['Bras chargé vertical et talon arrière au sol','Poids environ 70/30 vers l’arrière'],flags:['Side-bend lombaire ou toucher le sol à tout prix','Bras chargé qui part derrière l’épaule'],appVariants:[{id:'windmill-left',title:'Windmill (G)',mirror:false},{id:'windmill-right',title:'Windmill (D)',mirror:true}]});
      
        const haloFront=alter(front,{lw:[169,153],rw:[191,153],le:[149,127],re:[211,127],kb:[180,154]});
        const haloSide=alter(haloFront,{lw:[131,103],rw:[151,115],le:[143,128],re:[169,130],kb:[116,94],angle:-55,bellLayer:'front'});
        const haloBack=alter(haloFront,{lw:[164,99],rw:[196,99],le:[151,124],re:[209,124],kb:[180,83],angle:180,bellLayer:'behind-head'});
        defs['halo']=seed('halo','Halo','orbit',[haloFront,haloSide,haloBack,alter(haloSide,{lw:[209,115],rw:[229,103],le:[191,130],re:[217,128],kb:[244,94],angle:55})],['Poitrine','Côté tête','Derrière tête','Autre côté'],{familyProfile:'bodyweight',renderer:'dynamic-depth',sequence:[0,1,2,3,0],renderMeta:{bellCount:1,dynamicZ:true,zByPose:['front','front','behind-head','front']},sources:SOURCE.halo,invariants:['Tête et tronc immobiles','Coudes proches, poignée orientée avec le trajet'],flags:['Tête qui esquive','Cloche qui traverse tête ou poignets cassés']});
        const slingFront=alter(front,{lw:[165,182],rw:[195,182],kb:[180,205],bellLayer:'front'});
        const slingSide=alter(slingFront,{lw:[126,186],rw:[176,183],le:[144,144],re:[201,143],kb:[111,203],bellLayer:'front'});
        const slingBack=alter(slingFront,{lw:[165,184],rw:[195,184],kb:[180,207],bellLayer:'behind-torso'});
        defs['slingshot']=seed('slingshot','Slingshot','orbit',[slingFront,slingSide,slingBack,alter(slingSide,{lw:[184,183],rw:[234,186],le:[159,143],re:[216,144],kb:[249,203]})],['Transfert devant','Côté','Transfert derrière','Autre côté'],{familyProfile:'bodyweight',renderer:'dynamic-depth',sequence:[0,1,2,3,0],renderMeta:{bellCount:1,dynamicZ:true,zByPose:['front','front','behind-torso','front']},invariants:['Bassin et thorax immobiles','Cercle proche de la taille'],flags:['Cercle trop large','Cloche qui traverse le torse']});
        const figCenter=alter(squatMid,{lw:[164,217],rw:[196,217],le:[153,181],re:[207,181],kb:[180,239],bellLayer:'behind-thigh'});
        const figOutside=alter(figCenter,{lw:[118,229],rw:[173,215],le:[141,185],re:[203,179],kb:[101,248],bellLayer:'front'});
        defs['figure-8']=seed('figure-8','Figure 8','orbit',[figCenter,figOutside,alter(figCenter,{lw:[187,215],rw:[242,229],le:[157,179],re:[219,185],kb:[259,248],bellLayer:'front'})],['Passage entre jambes','Autour cuisse gauche','Autour cuisse droite'],{familyProfile:'hinge',mirrorable:true,renderer:'dynamic-depth',sequence:[0,1,0,2,0],renderMeta:{bellCount:1,dynamicZ:true,zByPose:['behind-thigh','front','front']},invariants:['Hinge constant et colonne longue','Transfert de main sans relever le buste'],flags:['Cloche qui traverse les cuisses','Squat ou buste qui oscille fortement']});
      
        const carryA=alter(front,{lw:[143,188],rw:[217,188],le:[151,143],re:[209,143],kb:[143,211],bells:[{id:'left',x:143,y:211,angle:0},{id:'right',x:217,y:211,angle:0}],lk:[146,249],rk:[215,238],la:[145,310],ra:[232,289],lt:[126,312],rt:[250,286]});
        const carryB=alter(carryA,{lk:[145,238],rk:[214,249],la:[128,288],ra:[219,310],lt:[110,285],rt:[238,312]});
        defs['farmer-carry']=seed('farmer-carry','Farmer Carry','carry',[carryA,carryB],['Marche gauche','Marche droite'],{renderer:'multi-bell-carry',sequence:[0,1,0,1],renderMeta:{bellCount:2,dynamicZ:false,bellsField:'bells'},invariants:['Deux cloches quasi immobiles','Bassin horizontal, épaules basses'],flags:['Balancement des cloches','Pas croisé ou tronc incliné']});
        const suitcaseA=alter(carryA,{bells:null,kb:[143,211],rw:[208,174],re:[207,136]});
        const suitcaseB=alter(carryB,{bells:null,kb:[143,211],rw:[208,174],re:[207,136]});
        defs['suitcase-march']=seed('suitcase-march','Suitcase March','carry',[suitcaseA,suitcaseB],['Genou opposé haut','Autre genou haut'],{mirrorable:true,renderer:'carry',sequence:[0,1,0,1],renderMeta:{bellCount:1,dynamicZ:false},invariants:['Résistance active à l’inclinaison','Cloche immobile près de la cuisse'],flags:['Épaule tirée vers le bas ou tronc incliné','Cloche qui balance']});
        const rackMarchA=alter(carryA,{bells:null,kb:[160,112],lw:[169,116],le:[148,126],rw:[212,174],re:[209,136]});
        const rackMarchB=alter(carryB,{bells:null,kb:[160,112],lw:[169,116],le:[148,126],rw:[212,174],re:[209,136]});
        defs['front-rack-march']=seed('front-rack-march','Front Rack March','carry',[rackMarchA,rackMarchB],['Genou opposé','Genou même côté'],{mirrorable:true,renderer:'forearm-rack',sequence:[0,1,0,1],renderMeta:{bellCount:1,dynamicZ:false},invariants:['Rack immobile, poignet neutre','Bassin horizontal sans inclinaison'],flags:['Rack qui s’effondre','Genou qui croise la ligne médiane']});
      
        const curlLow=alter(front,{lw:[168,206],rw:[192,206],le:[159,166],re:[201,166],kb:[180,229]});
        const curlTop=alter(curlLow,{lw:[169,142],rw:[191,142],le:[159,167],re:[201,167],kb:[180,164]});
        defs['goblet-curl']=seed('goblet-curl','Goblet Curl','arms',[curlLow,curlTop],['Bras longs','Curl au sternum'],{familyProfile:'bodyweight',renderer:'front-rack',renderMeta:{bellCount:1,dynamicZ:false},invariants:['Épaules et tronc fixes','Deux mains stables sur les cornes'],flags:['Balancement du buste','Coudes qui avancent ou épaules qui montent']});
        const triTop=alter(front,{le:[169,64],re:[191,64],lw:[176,29],rw:[184,29],kb:[180,13]});
        const triBottom=alter(triTop,{lw:[171,108],rw:[189,108],le:[169,65],re:[191,65],kb:[180,126],angle:180,bellLayer:'behind-head'});
        defs['overhead-triceps-extension']=seed('overhead-triceps-extension','Extension triceps au-dessus de la tête','arms',[triTop,triBottom],['Coudes tendus','Flexion derrière tête'],{familyProfile:'press',renderer:'dynamic-depth',renderMeta:{bellCount:1,dynamicZ:true,zByPose:['front','behind-head']},invariants:['Bras supérieurs presque verticaux','Tronc fixe et prise stable aux cornes'],flags:['Coudes très écartés','Cloche qui traverse la tête ou côtes ouvertes']});
      
        const canonicalProfiles = [
          'goblet-squat','sumo-squat','double-front-squat','goblet-cossack','air-squat','tempo-air-squat','reverse-lunge-bw','goblet-reverse-lunge','tactical-lunge','kb-deadlift','kb-rdl','single-leg-rdl-bw','glute-bridge','single-leg-glute-bridge','single-leg-calf-raise','kb-swing','single-arm-swing','rotational-swing','single-arm-clean','two-hand-clean','dead-clean','bottoms-up-clean','squat-clean','snatch','high-pull','strict-press-standing','push-press','clean-and-press','half-kneeling-press','seated-strict-press','thruster','clean-thruster','one-arm-row','suitcase-row','gorilla-row','renegade-row','single-arm-floor-press','half-get-up-press','kb-pullover','dead-bug-pullover','turkish-get-up','kb-arm-bar','windmill','halo','slingshot','figure-8','farmer-carry','suitcase-march','front-rack-march','goblet-curl','overhead-triceps-extension'
        ];
        const existingProfiles = ['goblet-squat','kb-swing','turkish-get-up'];
      
        // Explicit adapter from current index.html labels to the canonical motion
        // profile. This prevents reintroducing the misleading `visualFrom` fallback.
        const appExerciseMap = {
          'Goblet Squat':'goblet-squat', 'Sumo Squat':'sumo-squat', 'Double KB Front Squat':'double-front-squat',
          'Goblet Cossack Squat':'goblet-cossack', 'Squat au poids du corps':'air-squat', 'Squat tempo':'tempo-air-squat',
          'Fente arrière alternée':'reverse-lunge-bw', 'Goblet Reverse Lunge':'goblet-reverse-lunge', 'Tactical Lunge':'tactical-lunge',
          'KB Deadlift':'kb-deadlift', 'KB Romanian Deadlift':'kb-rdl', 'Single-Leg RDL sans charge':'single-leg-rdl-bw',
          'Pont fessier':'glute-bridge', 'Pont fessier une jambe':'single-leg-glute-bridge', 'Mollet une jambe':'single-leg-calf-raise',
          'Kettlebell Swing':'kb-swing', 'KB Swing':'kb-swing', 'Single Swing (G)':'single-arm-swing-left', 'Single Swing (D)':'single-arm-swing-right',
          'Rotational Swing':'rotational-swing', 'Clean (G)':'single-arm-clean-left', 'Clean (D)':'single-arm-clean-right',
          'Clean à deux mains':'two-hand-clean', 'Dead Clean (G)':'dead-clean-left', 'Dead Clean (D)':'dead-clean-right',
          'Bottoms-Up Clean':'bottoms-up-clean', 'Squat Clean':'squat-clean', 'Snatch (G)':'snatch-left', 'Snatch (D)':'snatch-right',
          'High Pull (G)':'high-pull-left', 'High Pull (D)':'high-pull-right', 'Press (gauche)':'strict-press-standing-left',
          'Press (droite)':'strict-press-standing-right', 'Press par côté':'strict-press-standing', 'Push Press (G)':'push-press-left',
          'Push Press (D)':'push-press-right', 'Clean & Press (G)':'clean-and-press-left', 'Clean & Press (D)':'clean-and-press-right',
          'Half-Kneeling Press':'half-kneeling-press', 'Seated Strict Press':'seated-strict-press', 'Thruster (G)':'thruster-left',
          'Thruster (D)':'thruster-right', 'Thruster par côté':'thruster', 'Clean + Thruster par côté':'clean-thruster',
          'Row (gauche)':'one-arm-row-left', 'Row (droite)':'one-arm-row-right', 'Row par côté':'one-arm-row',
          'Suitcase Row':'suitcase-row', 'Gorilla Row':'gorilla-row', 'Renegade Row':'renegade-row',
          'Floor Press':'single-arm-floor-press', 'Floor Press par côté':'single-arm-floor-press', 'Half Get-Up Press':'half-get-up-press',
          'Kettlebell Pullover':'kb-pullover', 'Dead Bug Pullover':'dead-bug-pullover', 'Turkish Get-Up (G)':'turkish-get-up',
          'Turkish Get-Up (D)':'turkish-get-up', 'Kettlebell Arm Bar':'kb-arm-bar', 'Windmill (G)':'windmill-left',
          'Windmill (D)':'windmill-right', 'Halo':'halo', 'Slingshot':'slingshot', 'Figure 8':'figure-8',
          'Farmer Carry':'farmer-carry', 'Suitcase March':'suitcase-march', 'Front Rack March':'front-rack-march',
          'Goblet Curl':'goblet-curl', 'Extension triceps au-dessus de la tête':'overhead-triceps-extension'
        };
      
        const variantSeeds = {
          ...bilateralMirrorVariants('single-arm-swing', [['left','Single Swing (G)',false],['right','Single Swing (D)',true]]),
          ...bilateralMirrorVariants('single-arm-clean', [['left','Clean (G)',false],['right','Clean (D)',true]]),
          ...bilateralMirrorVariants('dead-clean', [['left','Dead Clean (G)',false],['right','Dead Clean (D)',true]]),
          ...bilateralMirrorVariants('snatch', [['left','Snatch (G)',false],['right','Snatch (D)',true]]),
          ...bilateralMirrorVariants('high-pull', [['left','High Pull (G)',false],['right','High Pull (D)',true]]),
          ...bilateralMirrorVariants('strict-press-standing', [['left','Press (gauche)',false],['right','Press (droite)',true]]),
          ...bilateralMirrorVariants('push-press', [['left','Push Press (G)',false],['right','Push Press (D)',true]]),
          ...bilateralMirrorVariants('clean-and-press', [['left','Clean & Press (G)',false],['right','Clean & Press (D)',true]]),
          ...bilateralMirrorVariants('thruster', [['left','Thruster (G)',false],['right','Thruster (D)',true]]),
          ...bilateralMirrorVariants('one-arm-row', [['left','Row (gauche)',false],['right','Row (droite)',true]]),
          ...bilateralMirrorVariants('single-arm-floor-press', [['left','Floor Press gauche',false],['right','Floor Press droite',true]]),
          ...bilateralMirrorVariants('windmill', [['left','Windmill (G)',false],['right','Windmill (D)',true]])
        };
      
        const packet = {
          schemaVersion: 2,
          canonicalProfiles,
          existingProfiles,
          appExerciseMap,
          canonicalSeeds: defs,
          variantSeeds,
          seeds: { ...defs, ...variantSeeds },
          rendererExtensions: {
            bells: 'Optional pose.bells array: [{id,x,y,angle,layer?}] for two-bell profiles.',
            dynamicZ: 'renderMeta.dynamicZ + pose.bellLayer or renderMeta.zByPose controls bell insertion point.',
            props: 'pose.props.hideBell hides the legacy single bell for bodyweight profiles.',
            groundContact: 'renderMeta.groundContact/groundContactAt documents intentional contacts.'
          },
          suggestedFamilyProfiles: {
            lunge:{label:'Fentes',renderer:'standard'},
            ballistic:{label:'Ballistiques',renderer:'dynamic-depth'}, press:{label:'Presses',renderer:'forearm-rack'},
            row:{label:'Tirages',renderer:'standard'}, ground:{label:'Travail au sol',renderer:'ground-load'},
            windmill:{label:'Windmill',renderer:'overhead-depth'}, orbit:{label:'Autour du corps',renderer:'dynamic-depth'},
            carry:{label:'Carries & marches',renderer:'carry'}, arms:{label:'Bras',renderer:'standard'},
            calf:{label:'Mollets',renderer:'bodyweight'}, bridge:{label:'Ponts fessiers',renderer:'ground-bodyweight'}
          }
        };
      
        if (typeof module !== 'undefined' && module.exports) module.exports = packet;
        root.KettlebellRigSeedPacket = packet;
      })(typeof globalThis !== 'undefined' ? globalThis : window);

      // Temporary bodyweight packet for SVG Motion Lab.
      // Expects the lab's P(...) pose helper to exist before this fragment is loaded.
      // Nothing in this file is wired into the production timer.
      
      const BW_SOURCES = {
        pushup: { label: 'Stronger by Science · No-Gym Training', url: 'https://www.strongerbyscience.com/no-gym/' },
        scapula: { label: 'Push-Up Plus · systematic review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6863690/' },
        core: { label: 'Core exercise · systematic review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7345922/' },
        bridge: { label: 'NASM · Glute Bridge', url: 'https://blog.nasm.org/how-to-do-a-glute-bridge' },
        shoulder: { label: 'E3 Rehab · Scapular Control Progressions', url: 'https://e3rehab.com/scapulardyskinesis/' },
        dip: { label: 'Bench / bar / ring dip biomechanics (2022)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9603242/' }
      };
      
      const BW_KB_OFFSTAGE = [-40, 350];
      const BW_CURRENT_PLACEHOLDER = '';
      const bwSeed = definition => ({
        aliases: [],
        equipment: ['bodyweight'],
        laterality: 'bilatéral',
        side: 'both',
        mirror: false,
        rigStatus: 'research',
        rigVersion: '0.1',
        duration: 4200,
        hold: .12,
        interpolation: 'smoother',
        trajectory: '',
        current: BW_CURRENT_PLACEHOLDER,
        ...definition
      });
      
      const bodyweightExerciseSeeds = {
        'toe-taps': bwSeed({
          id: 'toe-taps', title: 'Toe Taps', family: 'locomotion', equipment: ['bodyweight'],
          laterality: 'alterné', side: 'alternating', renderer: 'floor-marker', duration: 3200,
          summary: 'Vue frontale. La cloche reste un repère entièrement fixe tandis que les appuis alternent sans saut haut.',
          trajectory: 'M146 282 C154 273 164 269 174 270 M214 282 C206 273 196 269 186 270',
          phases: ['Stance athlétique', 'Tap gauche', 'Centre', 'Tap droit'],
          phaseDetails: ['Genoux souples, poids réparti', 'Avant-pied gauche posé légèrement sur la base plate', 'Deux pieds au sol, cloche immobile', 'Avant-pied droit posé légèrement sur la base plate'],
          invariants: ['Kettlebell totalement fixe', 'Contact uniquement sur la base stable, jamais sur la poignée', 'Tronc haut et genoux souples'],
          flags: ['Pied sur la poignée', 'Cloche qui bascule', 'Saut haut ou genoux verrouillés'],
          sources: [{ label: 'Convention du lab · drill de coordination, cloche repère fixe', url: '#technique-title' }],
          poses: [
            P([180,54],[180,82],[153,98],[207,98],[145,139],[215,139],[141,176],[219,176],[160,184],[200,184],[147,246],[213,246],[141,307],[219,307],[123,309],[237,309],[180,294],0,[180,52,180,75]),
            P([180,58],[180,86],[153,102],[207,102],[145,142],[215,142],[141,178],[219,178],[160,187],[200,187],[153,252],[198,241],[149,307],[184,282],[131,309],[199,282],[180,294],0,[180,56,180,79]),
            P([180,55],[180,83],[153,99],[207,99],[145,140],[215,140],[141,177],[219,177],[160,185],[200,185],[147,247],[213,247],[141,307],[219,307],[123,309],[237,309],[180,294],0,[180,53,180,76]),
            P([180,58],[180,86],[153,102],[207,102],[145,142],[215,142],[141,178],[219,178],[160,187],[200,187],[162,241],[207,252],[176,282],[211,307],[161,282],[229,309],[180,294],0,[180,56,180,79])
          ], sequence: [0,1,2,3,0], segment: [520,430,520,430,520]
        }),
      
        'floor-push-up': bwSeed({
          id: 'floor-push-up', title: 'Pompes au sol', aliases: ['Floor Push-Up'], family: 'horizontalPush',
          renderer: 'ground-contact', duration: 3600,
          summary: 'Vue trois-quarts basse. Le corps reste monobloc pendant que la poitrine descend entre les mains.',
          trajectory: 'M82 219 C77 234 76 250 80 267',
          phases: ['Planche haute', 'Descente', 'Point bas'],
          phaseDetails: ['Épaules au-dessus des mains, tête-bassin-talons alignés', 'Coudes suivent une diagonale arrière', 'Poitrine entre les mains, bassin encore aligné'],
          invariants: ['Tête, bassin et talons sur une même ligne', 'Mains stables sous ou légèrement hors des épaules', 'Corps descend en bloc'],
          flags: ['Bassin qui tombe ou monte', 'Tête projetée en avant', 'Coudes à 90° du torse'],
          sources: [BW_SOURCES.pushup],
          poses: [
            P([70,216],[91,228],[105,232],[112,239],[98,265],[132,266],[96,302],[137,302],[213,260],[222,265],[268,281],[276,285],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[65,214,45,210]),
            P([75,238],[96,249],[110,253],[118,260],[84,278],[149,280],[96,302],[137,302],[214,274],[223,279],[269,288],[277,291],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[70,236,50,232]),
            P([80,257],[101,267],[114,270],[122,276],[81,285],[153,288],[96,302],[137,302],[215,285],[224,289],[270,294],[278,296],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[75,255,55,251])
          ], sequence: [0,1,2,1,0], segment: [620,520,380,560,520]
        }),
      
        'incline-push-up': bwSeed({
          id: 'incline-push-up', title: 'Pompes inclinées', aliases: ['Incline Push-Up'], family: 'horizontalPush', equipment: ['bodyweight','chair'],
          renderer: 'incline-support', duration: 3600, prop: { type: 'support', x: 62, y: 232, width: 74, height: 12 },
          summary: 'Le support est immobile et le corps entier pivote autour des pieds, sans casser à la hanche.',
          trajectory: 'M92 142 C82 155 76 171 74 186',
          phases: ['Planche inclinée', 'Descente contrôlée', 'Poitrine au support'],
          phaseDetails: ['Mains sur support stable, corps aligné', 'Coudes en diagonale arrière', 'Poitrine proche du bord sans affaissement'],
          invariants: ['Support totalement stable', 'Tête-bassin-talons alignés', 'Pieds et mains ne glissent pas'],
          flags: ['Support mobile', 'Hanches cassées', 'Épaules qui plongent sous les mains'], sources: [BW_SOURCES.pushup],
          poses: [
            P([92,140],[110,157],[123,162],[130,168],[103,195],[143,196],[91,229],[128,229],[209,225],[218,229],[266,263],[274,267],[310,300],[315,302],[330,304],[334,304],BW_KB_OFFSTAGE,0,[87,138,68,131]),
            P([80,161],[99,177],[113,182],[121,188],[88,207],[142,214],[91,229],[128,229],[204,239],[213,243],[263,270],[271,274],[310,300],[315,302],[330,304],[334,304],BW_KB_OFFSTAGE,0,[75,159,57,152]),
            P([74,181],[94,196],[108,201],[116,207],[82,216],[148,222],[91,229],[128,229],[201,249],[210,253],[261,277],[270,280],[310,300],[315,302],[330,304],[334,304],BW_KB_OFFSTAGE,0,[69,179,51,173])
          ], sequence: [0,1,2,1,0], segment: [620,520,380,560,520]
        }),
      
        'offset-kb-push-up': bwSeed({
          id: 'offset-kb-push-up', title: 'Pompe décalée sur kettlebell', family: 'horizontalPush', equipment: ['bodyweight','kettlebell'],
          laterality: 'par côté', side: 'left', mirrorable: true, renderer: 'offset-base', duration: 3900,
          summary: 'Une main reste centrée sur la base plate stable ; l’écart de hauteur des mains est explicite et le bassin reste carré.',
          trajectory: 'M82 219 C78 237 78 253 83 267',
          phases: ['Planche décalée', 'Descente', 'Point bas'],
          phaseDetails: ['Main gauche sur base stable, main droite au sol', 'Épaules restent de niveau malgré le décalage', 'Poitrine entre les appuis, cloche immobile'],
          invariants: ['Base plate parfaitement stable', 'Main haute centrée sur la base', 'Bassin face au sol'],
          flags: ['Main sur la poignée', 'Cloche qui bouge', 'Rotation du bassin ou chute de l’épaule'], sources: [BW_SOURCES.pushup],
          poses: [
            P([70,216],[91,228],[105,232],[112,239],[98,258],[132,266],[102,286],[137,302],[213,260],[222,265],[268,281],[276,285],[312,300],[316,302],[328,305],[332,305],[102,299],0,[65,214,45,210]),
            P([75,238],[96,249],[110,253],[118,260],[86,273],[149,280],[102,286],[137,302],[214,274],[223,279],[269,288],[277,291],[312,300],[316,302],[328,305],[332,305],[102,299],0,[70,236,50,232]),
            P([80,257],[101,267],[114,270],[122,276],[84,281],[153,288],[102,286],[137,302],[215,285],[224,289],[270,294],[278,296],[312,300],[316,302],[328,305],[332,305],[102,299],0,[75,255,55,251])
          ], sequence: [0,1,2,1,0], segment: [650,540,400,580,520]
        }),
      
        'push-up-kb-drag': bwSeed({
          id: 'push-up-kb-drag', title: 'Push-up + kettlebell drag', family: 'horizontalPush', equipment: ['bodyweight','kettlebell'],
          laterality: 'alterné', side: 'alternating', mirrorable: true, renderer: 'floor-drag', duration: 6200,
          summary: 'Après une pompe complète, la main opposée fait glisser la cloche au sol sous le sternum tandis que le bassin reste carré.',
          trajectory: 'M205 298 C181 298 158 298 134 298',
          phases: ['Planche large', 'Pompe', 'Retour planche', 'Prise croisée', 'Drag au sol'],
          phaseDetails: ['Pieds larges, cloche hors du torse', 'Corps descend en bloc', 'Quatre appuis rétablis', 'Main opposée passe sous le sternum', 'Cloche glisse sans décoller'],
          invariants: ['Cloche toujours en contact avec le sol', 'Bassin carré et pieds larges', 'Quatre appuis avant chaque drag'],
          flags: ['Cloche soulevée', 'Bassin qui s’ouvre', 'Drag exécuté pendant la descente de pompe'], sources: [BW_SOURCES.pushup],
          poses: [
            P([70,216],[91,228],[105,232],[112,239],[98,265],[132,266],[96,302],[137,302],[213,260],[222,265],[268,281],[276,285],[308,300],[320,302],[326,305],[338,305],[205,298],0,[65,214,45,210]),
            P([80,257],[101,267],[114,270],[122,276],[81,285],[153,288],[96,302],[137,302],[215,285],[224,289],[270,294],[278,296],[308,300],[320,302],[326,305],[338,305],[205,298],0,[75,255,55,251]),
            P([70,216],[91,228],[105,232],[112,239],[98,265],[132,266],[96,302],[137,302],[213,260],[222,265],[268,281],[276,285],[308,300],[320,302],[326,305],[338,305],[205,298],0,[65,214,45,210]),
            P([71,218],[92,230],[106,234],[113,241],[132,260],[143,270],[183,294],[137,302],[213,262],[222,267],[268,282],[276,286],[308,300],[320,302],[326,305],[338,305],[190,298],0,[66,216,46,212]),
            P([70,216],[91,228],[105,232],[112,239],[128,256],[132,266],[151,298],[137,302],[213,260],[222,265],[268,281],[276,285],[308,300],[320,302],[326,305],[338,305],[134,298],0,[65,214,45,210])
          ], sequence: [0,1,2,3,4,2,0], segment: [650,520,520,620,700,520,520]
        }),
      
        'floor-close-grip-push-up': bwSeed({
          id: 'floor-close-grip-push-up', title: 'Pompes serrées au sol', family: 'horizontalPush', renderer: 'ground-contact', duration: 3700,
          summary: 'Les mains sont seulement un peu plus serrées que les épaules et les coudes restent proches des côtes.',
          trajectory: 'M82 219 C77 236 77 252 80 267',
          phases: ['Planche serrée', 'Descente coudes proches', 'Point bas'],
          phaseDetails: ['Mains sous les épaules, pas de diamant forcé', 'Avant-bras contrôlés, coudes vers l’arrière', 'Poitrine basse sans perdre la ligne du corps'],
          invariants: ['Coudes proches des côtes', 'Corps en planche rigide', 'Poignets stables'],
          flags: ['Mains collées en diamant malgré inconfort', 'Coudes ouverts', 'Épaules haussées'], sources: [BW_SOURCES.pushup],
          poses: [
            P([70,216],[91,228],[106,233],[111,238],[103,266],[122,267],[108,302],[124,302],[213,260],[222,265],[268,281],[276,285],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[65,214,45,210]),
            P([75,238],[96,249],[110,254],[117,259],[94,280],[136,282],[108,302],[124,302],[214,274],[223,279],[269,288],[277,291],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[70,236,50,232]),
            P([80,257],[101,267],[114,271],[121,275],[91,289],[140,290],[108,302],[124,302],[215,285],[224,289],[270,294],[278,296],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[75,255,55,251])
          ], sequence: [0,1,2,1,0], segment: [640,540,400,580,520]
        }),
      
        'incline-close-grip-push-up': bwSeed({
          id: 'incline-close-grip-push-up', title: 'Pompes serrées inclinées', family: 'horizontalPush', equipment: ['bodyweight','chair'],
          renderer: 'incline-support', duration: 3700, prop: { type: 'support', x: 88, y: 232, width: 48, height: 12 },
          summary: 'Régression inclinée avec support stable, mains sous les épaules et coudes dirigés vers l’arrière.',
          trajectory: 'M92 142 C82 157 77 173 75 187',
          phases: ['Planche inclinée serrée', 'Descente', 'Poitrine au support'],
          phaseDetails: ['Mains légèrement sous largeur d’épaules', 'Coudes frôlent les côtes', 'Corps entier reste aligné'],
          invariants: ['Support immobile', 'Mains non collées', 'Coudes proches du tronc'],
          flags: ['Support instable', 'Coudes ouverts', 'Bassin qui recule'], sources: [BW_SOURCES.pushup],
          poses: [
            P([92,140],[110,157],[124,163],[129,168],[111,198],[133,198],[110,229],[126,229],[209,225],[218,229],[266,263],[274,267],[310,300],[315,302],[330,304],[334,304],BW_KB_OFFSTAGE,0,[87,138,68,131]),
            P([80,161],[99,177],[113,183],[120,187],[99,211],[139,214],[110,229],[126,229],[204,239],[213,243],[263,270],[271,274],[310,300],[315,302],[330,304],[334,304],BW_KB_OFFSTAGE,0,[75,159,57,152]),
            P([74,181],[94,196],[108,202],[115,206],[96,220],[143,222],[110,229],[126,229],[201,249],[210,253],[261,277],[270,280],[310,300],[315,302],[330,304],[334,304],BW_KB_OFFSTAGE,0,[69,179,51,173])
          ], sequence: [0,1,2,1,0], segment: [640,540,400,580,520]
        }),
      
        'pike-press': bwSeed({
          id: 'pike-press', title: 'Pike Press', family: 'verticalPush', renderer: 'ground-contact', duration: 3900,
          summary: 'Le bassin reste haut en V inversé ; la tête avance puis descend entre les mains sur une diagonale avant-bas.',
          trajectory: 'M95 216 C84 232 78 248 80 267',
          phases: ['V inversé', 'Tête en avant', 'Point bas'],
          phaseDetails: ['Hanches hautes, talons lourds', 'Épaules avancent au-dessus des mains', 'Sommet du crâne descend entre les appuis'],
          invariants: ['Bassin reste haut', 'Mains et pieds ancrés', 'Trajectoire diagonale, proche d’un press vertical'],
          flags: ['Corps qui devient une planche', 'Poitrine descend comme une pompe', 'Coudes très écartés'], sources: [BW_SOURCES.pushup],
          poses: [
            P([93,214],[112,224],[124,228],[131,235],[110,263],[146,265],[104,302],[143,302],[223,132],[231,137],[270,212],[276,216],[309,299],[316,300],[330,303],[336,303],BW_KB_OFFSTAGE,0,[88,212,67,207]),
            P([84,238],[104,247],[117,251],[124,257],[91,275],[151,278],[104,302],[143,302],[221,136],[230,141],[269,214],[276,218],[309,299],[316,300],[330,303],[336,303],BW_KB_OFFSTAGE,0,[79,236,58,231]),
            P([80,267],[101,274],[114,277],[121,283],[88,287],[154,290],[104,302],[143,302],[219,143],[228,148],[268,219],[275,223],[309,299],[316,300],[330,303],[336,303],BW_KB_OFFSTAGE,0,[75,265,54,261])
          ], sequence: [0,1,2,1,0], segment: [700,560,420,620,540]
        }),
      
        'chair-dip': bwSeed({
          id: 'chair-dip', title: 'Dip sur chaise stable', family: 'elbowExtension', equipment: ['bodyweight','chair'], renderer: 'chair', duration: 3900,
          prop: { type: 'chair', seatX: 214, seatY: 176, seatWidth: 104, backHeight: 116 },
          summary: 'La chaise est bloquée, le bassin reste près du siège et la profondeur volontairement confortable protège l’avant de l’épaule.',
          trajectory: 'M191 158 C188 174 188 190 192 204',
          phases: ['Bras tendus', 'Descente confortable', 'Retour avant douleur'],
          phaseDetails: ['Mains près des hanches, pieds assez proches', 'Coudes se fléchissent sans épaule projetée', 'Amplitude stoppée bien avant la profondeur maximale'],
          invariants: ['Chaise immobile contre un mur', 'Bassin proche du bord', 'Pieds assistent le mouvement'],
          flags: ['Épaule roule vers l’avant', 'Bassin loin de la chaise', 'Recherche de profondeur maximale'], sources: [BW_SOURCES.dip],
          poses: [
            P([169,92],[176,119],[166,129],[185,128],[191,149],[205,146],[211,176],[222,176],[185,170],[199,171],[153,223],[238,224],[120,300],[274,300],[102,302],[292,302],BW_KB_OFFSTAGE,0,[165,90,143,86]),
            P([171,112],[178,139],[168,148],[187,147],[193,173],[207,171],[211,176],[222,176],[187,190],[201,191],[153,237],[238,238],[120,300],[274,300],[102,302],[292,302],BW_KB_OFFSTAGE,0,[167,110,145,106]),
            P([173,130],[180,157],[170,166],[189,165],[195,188],[209,187],[211,176],[222,176],[189,207],[203,208],[153,248],[238,250],[120,300],[274,300],[102,302],[292,302],BW_KB_OFFSTAGE,0,[169,128,147,124])
          ], sequence: [0,1,2,1,0], segment: [680,560,480,600,520]
        }),
      
        'forearm-plank': bwSeed({
          id: 'forearm-plank', title: 'Planche avant-bras', family: 'isometricCore', renderer: 'ground-contact', duration: 5200, hold: .72,
          summary: 'Isométrique fidèle : seule une respiration de 1 px anime la cage, sans faire pomper le bassin.',
          phases: ['Planche stable', 'Expiration subtile'], phaseDetails: ['Coudes sous épaules, ligne tête-talons', 'Côtes se referment sans déplacement du bassin'],
          invariants: ['Coudes sous les épaules', 'Tête, bassin et talons alignés', 'Respiration visible ≤ 1 px'],
          flags: ['Bassin qui pompe', 'Lombaires qui s’effondrent', 'Épaules derrière les coudes'], sources: [BW_SOURCES.core],
          poses: [
            P([72,228],[92,238],[106,241],[113,247],[92,273],[123,275],[71,302],[126,302],[215,266],[223,270],[269,285],[277,288],[312,300],[317,302],[330,305],[334,305],BW_KB_OFFSTAGE,0,[67,226,47,222]),
            P([72,229],[92,239],[106,242],[113,248],[92,273],[123,275],[71,302],[126,302],[215,267],[223,271],[269,286],[277,289],[312,300],[317,302],[330,305],[334,305],BW_KB_OFFSTAGE,0,[67,227,47,223])
          ], sequence: [0,1,0], segment: [2100,900,2100]
        }),
      
        'side-plank': bwSeed({
          id: 'side-plank', title: 'Planche latérale', aliases: ['Planche latérale (G)','Planche latérale (D)','Side Plank'], family: 'isometricCore',
          laterality: 'par côté', side: 'left', mirrorable: true, renderer: 'ground-contact', duration: 5200, hold: .72,
          summary: 'Rig unique miroir pour les côtés G/D. Le bassin respire de 1 px maximum et ne roule pas.',
          phases: ['Planche latérale stable', 'Expiration subtile'], phaseDetails: ['Coude bas sous l’épaule, pieds empilés ou décalés', 'Cage se referme sans chute du bassin'],
          invariants: ['Coude sous l’épaule', 'Oreille, épaule, hanche et cheville alignées', 'Bassin face à l’avant'],
          flags: ['Bassin qui tombe', 'Tronc qui roule', 'Épaule basse écrasée'], sources: [BW_SOURCES.core],
          poses: [
            P([76,238],[98,246],[112,248],[119,253],[96,278],[124,211],[72,302],[127,166],[216,267],[224,271],[270,286],[278,289],[312,300],[317,302],[330,305],[334,305],BW_KB_OFFSTAGE,0,[71,236,51,232]),
            P([76,239],[98,247],[112,249],[119,254],[96,278],[124,212],[72,302],[127,167],[216,268],[224,272],[270,287],[278,290],[312,300],[317,302],[330,305],[334,305],BW_KB_OFFSTAGE,0,[71,237,51,233])
          ], sequence: [0,1,0], segment: [2100,900,2100]
        }),
      
        'high-plank-plus': bwSeed({
          id: 'high-plank-plus', title: 'Planche haute plus', aliases: ['High Plank Plus'], family: 'scapularControl', renderer: 'ground-contact', duration: 3800,
          summary: 'Les coudes restent verrouillés ; seul le thorax se déplace entre neutre et protraction scapulaire.',
          trajectory: 'M107 239 C103 234 100 229 98 224',
          phases: ['Planche neutre', 'Protraction / plus'], phaseDetails: ['Omoplates neutres, bras droits', 'Sol repoussé, haut du dos légèrement arrondi'],
          invariants: ['Coudes verrouillés', 'Bassin stable', 'Mains sous épaules'], flags: ['Mouvement animé comme une pompe', 'Coudes qui fléchissent', 'Lombaires qui s’affaissent'], sources: [BW_SOURCES.scapula],
          poses: [
            P([70,216],[91,228],[105,232],[112,239],[98,265],[132,266],[96,302],[137,302],[213,260],[222,265],[268,281],[276,285],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[65,214,45,210]),
            P([68,211],[89,223],[102,226],[109,233],[97,264],[131,265],[96,302],[137,302],[213,260],[222,265],[268,281],[276,285],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[63,209,43,205])
          ], sequence: [0,1,0], segment: [920,720,920]
        }),
      
        'dead-bug': bwSeed({
          id: 'dead-bug', title: 'Dead Bug', family: 'supineCore', laterality: 'alterné', side: 'alternating', mirrorable: true, renderer: 'ground-contact', duration: 5200,
          summary: 'Bras et jambe opposés s’allongent tandis que les lombaires restent en contact avec le sol.',
          phases: ['Tabletop 90/90', 'Extension opposée', 'Retour', 'Extension miroir'],
          phaseDetails: ['Hanches et genoux à 90°, bras verticaux', 'Bras gauche et jambe droite s’éloignent', 'Lombaires toujours plaquées', 'Même geste de l’autre côté'],
          invariants: ['Lombaires au sol', 'Bras et jambe opposés', 'Retour au tabletop avant d’alterner'],
          flags: ['Extension homolatérale', 'Dos qui se creuse', 'Membres qui tombent sans contrôle'], sources: [BW_SOURCES.core],
          poses: [
            P([52,286],[77,285],[92,276],[98,290],[92,225],[102,230],[93,172],[105,175],[168,284],[177,289],[195,232],[214,235],[190,186],[225,190],[174,177],[241,181],BW_KB_OFFSTAGE,0,[50,280,92,278]),
            P([52,286],[77,285],[92,276],[98,290],[78,249],[119,249],[48,210],[153,212],[168,284],[177,289],[225,276],[206,231],[297,291],[223,184],[318,294],[239,178],BW_KB_OFFSTAGE,0,[50,280,92,278]),
            P([52,286],[77,285],[92,276],[98,290],[92,225],[102,230],[93,172],[105,175],[168,284],[177,289],[195,232],[214,235],[190,186],[225,190],[174,177],[241,181],BW_KB_OFFSTAGE,0,[50,280,92,278]),
            P([52,286],[77,285],[92,276],[98,290],[112,249],[82,249],[153,212],[48,210],[168,284],[177,289],[206,231],[225,276],[223,184],[297,291],[239,178],[318,294],BW_KB_OFFSTAGE,0,[50,280,92,278])
          ], sequence: [0,1,2,3,0], segment: [780,760,620,760,620]
        }),
      
        'hollow-body-tuck': bwSeed({
          id: 'hollow-body-tuck', title: 'Hollow Body Tuck', family: 'supineCore', renderer: 'ground-contact', duration: 5200, hold: .72,
          summary: 'Tenue isométrique, omoplates légèrement décollées et lombaires plaquées ; respiration de 1 px seulement.',
          phases: ['Tuck hollow stable', 'Expiration subtile'], phaseDetails: ['Genoux repliés, bras vers les hanches', 'Côtes se ferment sans crunch répété'],
          invariants: ['Lombaires au sol', 'Omoplates légèrement décollées', 'Respiration ≤ 1 px'], flags: ['Animation en crunchs', 'Lombaires décollées', 'Nuque tirée vers l’avant'], sources: [BW_SOURCES.core],
          poses: [
            P([70,268],[94,278],[108,270],[115,282],[132,252],[139,258],[166,246],[173,251],[180,285],[190,287],[216,252],[224,254],[244,278],[252,279],[260,285],[268,286],BW_KB_OFFSTAGE,0,[65,265,46,254]),
            P([70,267],[94,277],[108,269],[115,281],[132,251],[139,257],[166,245],[173,250],[180,284],[190,286],[216,251],[224,253],[244,277],[252,278],[260,284],[268,285],BW_KB_OFFSTAGE,0,[65,264,46,253])
          ], sequence: [0,1,0], segment: [2100,900,2100]
        }),
      
        'reverse-crunch': bwSeed({
          id: 'reverse-crunch', title: 'Reverse Crunch', family: 'supineCore', renderer: 'ground-contact', duration: 3900,
          summary: 'Petite rétroversion du bassin : le sacrum se décolle légèrement, sans balancement massif des jambes.',
          trajectory: 'M184 284 C177 274 173 263 174 251',
          phases: ['Tabletop 90/90', 'Rétroversion', 'Sacrum légèrement décollé'],
          phaseDetails: ['Genoux au-dessus des hanches', 'Côtes basses, bassin s’enroule', 'Amplitude petite et contrôlée'],
          invariants: ['Mouvement initié par le bassin', 'Jambes restent compactes', 'Retour contrôlé au sol'], flags: ['Grand balancement des jambes', 'Genoux projetés vers le visage', 'Élan au retour'], sources: [BW_SOURCES.core],
          poses: [
            P([52,286],[77,285],[92,276],[98,290],[110,292],[116,293],[139,300],[145,300],[168,284],[177,289],[198,237],[208,239],[197,191],[219,194],[181,184],[235,187],BW_KB_OFFSTAGE,0,[50,280,92,278]),
            P([52,286],[77,285],[92,276],[98,290],[110,292],[116,293],[139,300],[145,300],[165,277],[174,282],[191,229],[201,231],[187,185],[209,188],[172,178],[225,181],BW_KB_OFFSTAGE,0,[50,280,92,278]),
            P([52,286],[77,285],[92,276],[98,290],[110,292],[116,293],[139,300],[145,300],[161,268],[170,273],[184,221],[194,223],[178,180],[200,183],[164,173],[216,176],BW_KB_OFFSTAGE,0,[50,280,92,278])
          ], sequence: [0,1,2,1,0], segment: [720,560,420,600,520]
        }),
      
        'mountain-climber': bwSeed({
          id: 'mountain-climber', title: 'Mountain Climber', family: 'quadrupedLocomotion', laterality: 'alterné', side: 'alternating', mirrorable: true, renderer: 'ground-contact', duration: 3600,
          summary: 'Le genou se déplace sous la poitrine, puis revient en planche avant l’alternance ; le bassin ne rebondit pas.',
          trajectory: 'M312 300 C270 287 230 277 183 271',
          phases: ['Planche haute', 'Genou sous poitrine', 'Retour', 'Côté opposé'],
          phaseDetails: ['Épaules au-dessus des mains', 'Genou gauche avance sans lever le bassin', 'Deux jambes longues', 'Même trajet côté droit'],
          invariants: ['Bassin stable', 'Épaules au-dessus des mains', 'Pied revient avant l’alternance'], flags: ['Bassin qui rebondit', 'Genou croise la ligne médiane', 'Épaules reculent'], sources: [BW_SOURCES.core],
          poses: [
            P([70,216],[91,228],[105,232],[112,239],[98,265],[132,266],[96,302],[137,302],[213,260],[222,265],[268,281],[276,285],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[65,214,45,210]),
            P([70,218],[91,230],[105,234],[112,241],[98,266],[132,267],[96,302],[137,302],[213,262],[222,267],[182,282],[276,286],[148,300],[316,302],[130,302],[332,305],BW_KB_OFFSTAGE,0,[65,216,45,212]),
            P([70,216],[91,228],[105,232],[112,239],[98,265],[132,266],[96,302],[137,302],[213,260],[222,265],[268,281],[276,285],[312,300],[316,302],[328,305],[332,305],BW_KB_OFFSTAGE,0,[65,214,45,210]),
            P([70,218],[91,230],[105,234],[112,241],[98,266],[132,267],[96,302],[137,302],[213,262],[222,267],[268,286],[182,282],[312,302],[148,300],[328,305],[130,302],BW_KB_OFFSTAGE,0,[65,216,45,212])
          ], sequence: [0,1,2,3,0], segment: [520,500,520,500,520]
        }),
      
        'bear-plank-shoulder-tap': bwSeed({
          id: 'bear-plank-shoulder-tap', title: 'Bear Plank Shoulder Tap', family: 'quadrupedStability', laterality: 'alterné', side: 'alternating', mirrorable: true, renderer: 'ground-contact', duration: 4400,
          summary: 'Genoux à quelques centimètres du sol ; une main touche l’épaule opposée avec un transfert minimal du bassin.',
          trajectory: 'M107 300 C120 272 132 248 146 231',
          phases: ['Bear hover', 'Transfert minimal', 'Tap épaule', 'Retour / miroir'],
          phaseDetails: ['Mains sous épaules, genoux sous hanches', 'Poids se répartit sur trois appuis', 'Main gauche touche l’épaule droite', 'Quatre appuis puis alternance'],
          invariants: ['Genoux bas et décollés', 'Bassin parallèle au sol', 'Main revient avant d’alterner'], flags: ['Bassin qui roule', 'Genoux très hauts', 'Main et genou du même côté décollent'], sources: [BW_SOURCES.core],
          poses: [
            P([78,224],[99,236],[112,239],[120,245],[102,269],[135,271],[99,302],[142,302],[213,253],[223,258],[219,287],[231,289],[210,302],[241,302],[194,303],[258,303],BW_KB_OFFSTAGE,0,[73,222,53,218]),
            P([80,225],[101,237],[114,240],[122,246],[110,266],[135,271],[120,292],[142,302],[213,253],[223,258],[219,287],[231,289],[210,302],[241,302],[194,303],[258,303],BW_KB_OFFSTAGE,0,[75,223,55,219]),
            P([80,225],[101,237],[114,240],[122,246],[129,246],[135,271],[143,239],[142,302],[213,253],[223,258],[219,287],[231,289],[210,302],[241,302],[194,303],[258,303],BW_KB_OFFSTAGE,0,[75,223,55,219]),
            P([78,224],[99,236],[112,239],[120,245],[102,269],[135,271],[99,302],[142,302],[213,253],[223,258],[219,287],[231,289],[210,302],[241,302],[194,303],[258,303],BW_KB_OFFSTAGE,0,[73,222,53,218])
          ], sequence: [0,1,2,3,0], segment: [620,520,620,560,520]
        }),
      
        'bird-dog': bwSeed({
          id: 'bird-dog', title: 'Bird Dog', family: 'quadrupedStability', laterality: 'alterné', side: 'alternating', mirrorable: true, renderer: 'ground-contact', duration: 5200,
          summary: 'Bras et jambe opposés s’allongent dans l’axe du tronc, sans ouvrir le bassin ni creuser le dos.',
          trajectory: 'M104 285 C79 264 58 244 39 225 M224 260 C257 252 285 242 314 229',
          phases: ['Quadrupédie', 'Extension opposée', 'Pause stable', 'Retour / miroir'],
          phaseDetails: ['Mains sous épaules, genoux sous hanches', 'Bras gauche et jambe droite s’allongent', 'Main, tronc et talon dans un même couloir', 'Retour complet avant d’alterner'],
          invariants: ['Bassin et cage parallèles au sol', 'Bras et jambe opposés', 'Jambe libre ne dépasse pas la hanche'], flags: ['Extension homolatérale', 'Bassin ouvert', 'Dos creusé ou jambe trop haute'], sources: [BW_SOURCES.core],
          poses: [
            P([82,224],[104,236],[118,239],[126,246],[108,270],[140,272],[105,302],[147,302],[218,254],[228,259],[222,288],[240,289],[212,302],[250,302],[196,303],[267,303],BW_KB_OFFSTAGE,0,[77,222,57,218]),
            P([73,221],[96,232],[111,235],[121,242],[75,247],[136,269],[39,224],[143,302],[215,252],[225,257],[272,242],[238,287],[316,228],[248,302],[334,226],[265,303],BW_KB_OFFSTAGE,0,[68,219,48,215]),
            P([72,220],[95,231],[110,234],[120,241],[74,246],[135,268],[38,223],[142,302],[214,251],[224,256],[273,241],[237,286],[317,227],[247,302],[335,225],[264,303],BW_KB_OFFSTAGE,0,[67,218,47,214]),
            P([82,224],[104,236],[118,239],[126,246],[108,270],[140,272],[105,302],[147,302],[218,254],[228,259],[222,288],[240,289],[212,302],[250,302],[196,303],[267,303],BW_KB_OFFSTAGE,0,[77,222,57,218])
          ], sequence: [0,1,2,3,0], segment: [720,720,620,720,620]
        }),
      
        'prone-w': bwSeed({
          id: 'prone-w', title: 'W au sol', aliases: ['Prone W'], family: 'proneShoulder', renderer: 'prone-top', duration: 3900,
          summary: 'Vue légèrement plongeante pour préserver la symétrie. Le lift des bras reste faible, sans extension lombaire.',
          phases: ['W relâché', 'Rétraction légère', 'Pause basse amplitude'], phaseDetails: ['Front bas, coudes pliés', 'Omoplates se rapprochent sans shrug', 'Mains et coudes décollent à peine'],
          invariants: ['Front, côtes et bassin au sol', 'Nuque longue', 'Amplitude volontairement faible'], flags: ['Tête relevée', 'Cambrure lombaire', 'Épaules haussées'], sources: [BW_SOURCES.shoulder],
          poses: [
            P([180,72],[180,99],[150,112],[210,112],[130,142],[230,142],[148,165],[212,165],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,70,180,48]),
            P([180,71],[180,98],[151,110],[209,110],[132,139],[228,139],[150,161],[210,161],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,69,180,47]),
            P([180,70],[180,97],[152,108],[208,108],[134,137],[226,137],[152,158],[208,158],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,68,180,46])
          ], sequence: [0,1,2,1,0], segment: [720,560,420,600,520]
        }),
      
        'prone-y': bwSeed({
          id: 'prone-y', title: 'Y au sol', aliases: ['Prone Y'], family: 'proneShoulder', renderer: 'prone-top', duration: 3900,
          summary: 'Les bras forment un Y large, pouces vers le haut, et se soulèvent de quelques centimètres sans hausser les épaules.',
          phases: ['Y au sol', 'Lift léger', 'Pause contrôlée'], phaseDetails: ['Front bas, bras en diagonale', 'Mains décollent sans shrug', 'Côtes et bassin restent lourds'],
          invariants: ['Pouces vers le haut', 'Nuque longue', 'Lift de faible amplitude'], flags: ['Bras à la verticale trop étroits', 'Épaules haussées', 'Extension lombaire'], sources: [BW_SOURCES.shoulder],
          poses: [
            P([180,72],[180,99],[150,112],[210,112],[124,89],[236,89],[92,62],[268,62],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,70,180,48]),
            P([180,71],[180,98],[151,110],[209,110],[126,86],[234,86],[95,58],[265,58],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,69,180,47]),
            P([180,70],[180,97],[152,108],[208,108],[128,84],[232,84],[98,55],[262,55],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,68,180,46])
          ], sequence: [0,1,2,1,0], segment: [720,560,420,600,520]
        }),
      
        'reverse-snow-angel': bwSeed({
          id: 'reverse-snow-angel', title: 'Ange inversé', aliases: ['Reverse Snow Angel'], family: 'proneShoulder', renderer: 'prone-top', duration: 5200,
          summary: 'Vue plongeante : les bras balayent près du sol des hanches vers le dessus de la tête, sans traverser le torse.',
          trajectory: 'M154 204 C105 185 83 133 105 80 M206 204 C255 185 277 133 255 80',
          phases: ['Bras aux hanches', 'Sweep latéral', 'Bras overhead', 'Retour contrôlé'],
          phaseDetails: ['Paumes près des cuisses, front bas', 'Arc large près du sol', 'Bras en Y sans haussement d’épaule', 'Même trajectoire en sens inverse'],
          invariants: ['Front, côtes et bassin au sol', 'Bras restent près du sol', 'Trajet symétrique sans shrug'], flags: ['Extension lombaire', 'Tête relevée', 'Bras qui traversent le torse ou amplitude forcée'], sources: [BW_SOURCES.shoulder],
          poses: [
            P([180,72],[180,99],[150,112],[210,112],[146,164],[214,164],[154,205],[206,205],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,70,180,48]),
            P([180,71],[180,98],[151,110],[209,110],[116,139],[244,139],[87,157],[273,157],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,69,180,47]),
            P([180,70],[180,97],[152,108],[208,108],[126,84],[234,84],[98,55],[262,55],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,68,180,46]),
            P([180,71],[180,98],[151,110],[209,110],[116,139],[244,139],[87,157],[273,157],[160,208],[200,208],[155,257],[205,257],[150,302],[210,302],[134,304],[226,304],BW_KB_OFFSTAGE,0,[180,69,180,47])
          ], sequence: [0,1,2,3,0], segment: [760,780,620,780,620]
        })
      };
      

      const canonicalBindings = {
        'goblet-squat': 'squat',
        'kb-swing': 'swing',
        'turkish-get-up': 'tgu'
      };

      const bodyweightAppExerciseMap = {
        'Toe Taps': 'toe-taps',
        'Pompes au sol': 'floor-push-up',
        'Pompes inclinées': 'incline-push-up',
        'Pompe décalée sur kettlebell': 'offset-kb-push-up',
        'Push-up + kettlebell drag': 'push-up-kb-drag',
        'Pompes serrées au sol': 'floor-close-grip-push-up',
        'Pompes serrées inclinées': 'incline-close-grip-push-up',
        'Pike Press': 'pike-press',
        'Dip sur chaise stable': 'chair-dip',
        'Planche avant-bras': 'forearm-plank',
        'Planche latérale (G)': 'side-plank',
        'Planche latérale (D)': 'side-plank',
        'Planche latérale': 'side-plank',
        'Planche haute plus': 'high-plank-plus',
        'Dead Bug': 'dead-bug',
        'Hollow Body Tuck': 'hollow-body-tuck',
        'Reverse Crunch': 'reverse-crunch',
        'Mountain Climber': 'mountain-climber',
        'Bear Plank Shoulder Tap': 'bear-plank-shoulder-tap',
        'Bird Dog': 'bird-dog',
        'W au sol': 'prone-w',
        'Y au sol': 'prone-y',
        'Ange inversé': 'reverse-snow-angel'
      };

      const kettlebellPacket = globalThis.KettlebellRigSeedPacket;
      Object.assign(exerciseSeeds, kettlebellPacket.canonicalSeeds, bodyweightExerciseSeeds);

      const canonicalProfiles = [
        ...kettlebellPacket.canonicalProfiles.map(id => canonicalBindings[id] || id),
        ...Object.keys(bodyweightExerciseSeeds)
      ];
      const appExerciseMap = {
        ...Object.fromEntries(Object.entries(kettlebellPacket.appExerciseMap).filter(([name]) => name !== 'KB Swing')),
        ...bodyweightAppExerciseMap
      };

      const canonicalIdFor = id => {
        const packetVariant = kettlebellPacket.variantSeeds[id];
        const canonical = packetVariant?.extends || id;
        return canonicalBindings[canonical] || canonical;
      };
      Object.entries(appExerciseMap).forEach(([appName, target]) => {
        const labId = canonicalIdFor(target);
        const seed = exerciseSeeds[labId];
        if (!seed) throw new Error(`App alias ${appName} points to unknown profile ${target}`);
        seed.aliases = [...new Set([...(seed.aliases || []), appName])];
      });

      const swapLaterality = (pose, { mirrorBell = false } = {}) => {
        const swapped = { ...pose };
        [['ls','rs'],['le','re'],['lw','rw'],['lh','rh'],['lk','rk'],['la','ra'],['lt','rt']].forEach(([left, right]) => {
          swapped[left] = [...pose[right]];
          swapped[right] = [...pose[left]];
        });
        if (mirrorBell && pose.kb) swapped.kb = [360 - pose.kb[0], pose.kb[1]];
        return swapped;
      };

      const expandAlternatingCycle = (id, activePoseIndexes, { mirrorBell = false } = {}) => {
        const seed = exerciseSeeds[id];
        const start = seed.poses.length;
        const mirrored = activePoseIndexes.map(index => swapLaterality(seed.poses[index], { mirrorBell }));
        seed.poses = [...seed.poses, ...mirrored];
        return mirrored.map((_, index) => start + index);
      };

      const pushDragMirror = expandAlternatingCycle('push-up-kb-drag', [3, 4], { mirrorBell: true });
      exerciseSeeds['push-up-kb-drag'].sequence = [0,1,2,3,4,2,...pushDragMirror,2,0];
      exerciseSeeds['push-up-kb-drag'].segment = [650,520,520,620,700,520,620,700,520,520];
      exerciseSeeds['push-up-kb-drag'].phases.push('Prise croisée opposée', 'Drag opposé au sol');
      exerciseSeeds['push-up-kb-drag'].phaseDetails.push('L’autre main passe sous le sternum', 'La cloche revient au sol sans rotation du bassin');

      ['bear-plank-shoulder-tap', 'bird-dog'].forEach(id => {
        const mirrored = expandAlternatingCycle(id, [1, 2]);
        exerciseSeeds[id].sequence = [0,1,2,3,...mirrored,0];
        exerciseSeeds[id].segment = [620,600,520,600,600,520,620];
        exerciseSeeds[id].phases.push('Côté opposé', 'Pause miroir');
        exerciseSeeds[id].phaseDetails.push('Même geste de l’autre côté sans rotation du bassin', 'Stabilité identique sur les appuis opposés');
      });

      const deadBug = exerciseSeeds['dead-bug'];
      ['re', 'rw'].forEach(key => { deadBug.poses[1][key] = [...deadBug.poses[0][key]]; });
      ['le', 'lw'].forEach(key => { deadBug.poses[3][key] = [...deadBug.poses[0][key]]; });

      const birdDog = exerciseSeeds['bird-dog'];
      birdDog.poses[1].le = [75,229];
      birdDog.poses[2].le = [75,228];
      birdDog.poses[4].re = [75,229];
      birdDog.poses[5].re = [75,228];

      const toeTaps = exerciseSeeds['toe-taps'];
      toeTaps.poses[1].ra = [202,307];
      toeTaps.poses[1].rt = [221,309];
      toeTaps.poses[3].la = [158,307];
      toeTaps.poses[3].lt = [139,309];

      exerciseSeeds['tactical-lunge'].poses.forEach(pose => { pose.props = {}; });

      ['forearm-plank', 'side-plank', 'hollow-body-tuck'].forEach(id => {
        const seed = exerciseSeeds[id];
        const fixedKeys = ['head','le','re','lw','rw','lh','rh','lk','rk','la','ra','lt','rt'];
        fixedKeys.forEach(key => { seed.poses[1][key] = [...seed.poses[0][key]]; });
      });

      function buildExerciseCatalog(seeds) {
        const cache = {};
        const resolve = (id, chain = []) => {
          if (cache[id]) return cache[id];
          const source = seeds[id];
          if (!source) throw new Error(`Unknown exercise definition: ${id}`);
          if (chain.includes(id)) throw new Error(`Circular exercise inheritance: ${[...chain, id].join(' -> ')}`);
          const base = source.extends ? resolve(source.extends, [...chain, id]) : {};
          const timing = { ...(base.timing || {}), ...(source.timing || {}) };
          const resolved = {
            ...base,
            ...source,
            ...timing,
            id,
            aliases: [...new Set([...(base.aliases || []), ...(source.aliases || [])])],
            equipment: [...(source.equipment || base.equipment || [])],
            renderer: source.renderer || base.renderer || familyProfiles[source.family || base.family]?.renderer || 'standard',
            rigSource: source.extends ? base.rigSource : id,
            timing
          };
          ['title', 'family', 'poses', 'sequence', 'segment'].forEach(field => {
            if (!resolved[field]) throw new Error(`${id} is missing ${field}`);
          });
          cache[id] = resolved;
          return resolved;
        };
        Object.keys(seeds).forEach(id => resolve(id));
        return cache;
      }

      const exercises = buildExerciseCatalog(exerciseSeeds);
      const catalogEntries = canonicalProfiles.map(id => exercises[id]).sort((a, b) => a.title.localeCompare(b.title, 'fr'));
      if (catalogEntries.length !== 72 || new Set(catalogEntries.map(ex => ex.id)).size !== 72) {
        throw new Error(`Canonical catalogue mismatch: ${catalogEntries.length}/72`);
      }
      if (Object.keys(appExerciseMap).length !== 90) throw new Error(`App alias mismatch: ${Object.keys(appExerciseMap).length}/90`);

/* Superseded per-instance renderer draft kept inside the isolated preview only.
      const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const instances = new WeakMap();
      const liveInstances = new Set();
      const normalizedAliases = new Map();

      const normalizeName = value => String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

      const canonicalTarget = target => {
        const variant = kettlebellPacket.variantSeeds[target];
        const canonical = variant?.extends || target;
        return canonicalBindings[canonical] || canonical;
      };

      Object.entries(appExerciseMap).forEach(([name, id]) => normalizedAliases.set(normalizeName(name), canonicalTarget(id)));
      Object.values(exercises).forEach(exercise => {
        normalizedAliases.set(normalizeName(exercise.id), exercise.id);
        normalizedAliases.set(normalizeName(exercise.title), exercise.id);
        (exercise.aliases || []).forEach(alias => normalizedAliases.set(normalizeName(alias), exercise.id));
      });

      function resolveExercise(nameOrId) {
        if (!nameOrId) return null;
        if (typeof nameOrId === 'object' && nameOrId.id && exercises[nameOrId.id]) return exercises[nameOrId.id];
        const direct = exercises[nameOrId];
        if (direct) return direct;
        const mapped = appExerciseMap[nameOrId] || normalizedAliases.get(normalizeName(nameOrId));
        return mapped ? exercises[canonicalTarget(mapped)] || null : null;
      }

      function mirrorFor(nameOrId, exercise) {
        const target = appExerciseMap[nameOrId] || null;
        const variant = target ? kettlebellPacket.variantSeeds[target] : null;
        const rightLabel = /(?:\(D\)|droite|right)/i.test(String(nameOrId || ''));
        return Boolean(exercise.mirror) !== Boolean(variant?.mirror || (!variant && exercise.mirrorable && rightLabel));
      }

      function installStyles() {
        if (document.getElementById('motion-rig-v2-styles')) return;
        const style = document.createElement('style');
        style.id = 'motion-rig-v2-styles';
        style.textContent = `
          .motion-rig-v2-svg { display:block; width:100%; height:100%; overflow:visible; contain:layout style paint; }
          .motion-rig-v2-svg .mv2-ground { stroke:color-mix(in srgb,var(--body-color) 20%,transparent); stroke-width:2; }
          .motion-rig-v2-svg .mv2-body-shadow { fill:none; stroke:color-mix(in srgb,var(--bg) 72%,transparent); stroke-width:13; stroke-linecap:round; stroke-linejoin:round; }
          .motion-rig-v2-svg .mv2-body { fill:none; stroke:var(--body-color); stroke-width:8; stroke-linecap:round; stroke-linejoin:round; }
          .motion-rig-v2-svg .mv2-torso { fill:color-mix(in srgb,var(--body-color) 16%,transparent); stroke:var(--body-color); stroke-width:4; }
          .motion-rig-v2-svg .mv2-head { fill:color-mix(in srgb,var(--body-color) 13%,var(--surface)); stroke:var(--body-color); stroke-width:5; }
          .motion-rig-v2-svg .mv2-pelvis { fill:color-mix(in srgb,var(--body-color) 18%,var(--surface)); stroke:var(--body-color); stroke-width:3; }
          .motion-rig-v2-svg .mv2-hand { fill:var(--body-color); stroke:var(--surface); stroke-width:2; }
          .motion-rig-v2-svg .mv2-kb-handle { fill:none; stroke:var(--kb-color); stroke-width:7; stroke-linecap:round; }
          .motion-rig-v2-svg .mv2-kb-body { fill:color-mix(in srgb,var(--kb-color) 62%,var(--surface)); stroke:var(--kb-color); stroke-width:3; }
          .motion-rig-v2-svg .mv2-kb-shine { fill:color-mix(in srgb,var(--kb-color) 45%,transparent); }
          .motion-rig-v2-svg .mv2-prop { fill:color-mix(in srgb,var(--body-color) 8%,var(--surface)); stroke:color-mix(in srgb,var(--body-color) 52%,transparent); stroke-width:4; }
          .motion-rig-v2-svg .mv2-gaze { stroke:var(--accent); stroke-width:2; stroke-dasharray:5 6; opacity:.55; }
          .motion-v2-preprod-badge { position:fixed; z-index:9999; inset:calc(env(safe-area-inset-top) + 8px) 8px auto auto; padding:5px 8px; border:1px solid color-mix(in srgb,var(--rest) 65%,transparent); border-radius:999px; background:color-mix(in srgb,var(--bg) 88%,transparent); color:var(--rest); font:800 10px/1 'Inter',sans-serif; letter-spacing:.12em; pointer-events:none; }
          @media (prefers-reduced-motion: reduce) { .motion-rig-v2-svg { scroll-behavior:auto; } }
        `;
        document.head.appendChild(style);
      }

      const svgNode = (name, attrs = {}) => {
        const node = document.createElementNS('http://www.w3.org/2000/svg', name);
        Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
        return node;
      };
      const point = p => `${p[0]} ${p[1]}`;
      const mixNumber = (a, b, t) => a + (b - a) * t;
      const mixPoint = (a, b, t) => [mixNumber(a[0], b[0], t), mixNumber(a[1], b[1], t)];
      const smoothstep = t => {
        const clamped = Math.max(0, Math.min(1, t));
        return clamped * clamped * (3 - 2 * clamped);
      };
      const smootherstep = t => {
        const clamped = Math.max(0, Math.min(1, t));
        return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
      };

      function mixPose(a, b, t) {
        const pose = {};
        ['head','neck','ls','rs','le','re','lw','rw','lh','rh','lk','rk','la','ra','lt','rt','kb'].forEach(key => {
          pose[key] = mixPoint(a[key], b[key], t);
        });
        pose.angle = mixNumber(a.angle || 0, b.angle || 0, t);
        if (a.gaze && b.gaze) pose.gaze = a.gaze.map((value, index) => mixNumber(value, b.gaze[index], t));
        else pose.gaze = t < .5 ? a.gaze : b.gaze;
        if (Array.isArray(a.bells) && Array.isArray(b.bells)) {
          pose.bells = a.bells.map((bell, index) => {
            const next = b.bells.find(candidate => candidate.id === bell.id) || b.bells[index] || bell;
            return {
              id: bell.id || next.id || `bell-${index}`,
              x: mixNumber(bell.x, next.x, t),
              y: mixNumber(bell.y, next.y, t),
              angle: mixNumber(bell.angle || 0, next.angle || 0, t),
              layer: t < .5 ? bell.layer : next.layer
            };
          });
        } else if (Array.isArray(a.bells) || Array.isArray(b.bells)) {
          pose.bells = t < .5 ? a.bells : b.bells;
        }
        pose.bellLayer = t < .5 ? a.bellLayer : b.bellLayer;
        pose.props = t < .5 ? a.props : b.props;
        return pose;
      }

      function expectedBellCount(exercise) {
        if (Number.isInteger(exercise.renderMeta?.bellCount)) return Math.max(0, exercise.renderMeta.bellCount);
        if (exercise.renderer === 'floor-marker' || exercise.renderer === 'offset-base') return 1;
        return exercise.equipment.includes('kettlebell') ? 1 : 0;
      }

      function createBell() {
        const group = svgNode('g', { 'data-motion-bell': 'true' });
        group.append(
          svgNode('path', { class: 'mv2-kb-handle', d: 'M-11 -2 C-11 -17 11 -17 11 -2' }),
          svgNode('path', { class: 'mv2-kb-body', d: 'M-15 -1 Q-20 15 -11 24 Q0 31 11 24 Q20 15 15 -1 Z' }),
          svgNode('ellipse', { class: 'mv2-kb-shine', cx: -6, cy: 9, rx: 3, ry: 8 })
        );
        return group;
      }

      function createScene(exercise) {
        const svg = svgNode('svg', {
          class: 'motion-rig-v2-svg', viewBox: '0 0 360 360', role: 'img',
          'aria-label': `${exercise.title}, animation biomécanique`, preserveAspectRatio: 'xMidYMid meet',
          'data-motion-rig-v2': exercise.id
        });
        const root = svgNode('g', { 'data-part': 'root' });
        const ground = svgNode('line', { class: 'mv2-ground', x1: 28, y1: 318, x2: 332, y2: 318 });
        const decor = svgNode('g', { 'data-part': 'decor', 'aria-hidden': 'true' });
        const athlete = svgNode('g', { 'data-part': 'athlete' });
        const rearArmShadow = svgNode('path', { class: 'mv2-body-shadow', 'data-part': 'rear-arm-shadow' });
        const rearArm = svgNode('path', { class: 'mv2-body', 'data-part': 'rear-arm' });
        const rearLegShadow = svgNode('path', { class: 'mv2-body-shadow', 'data-part': 'rear-leg-shadow' });
        const rearLeg = svgNode('path', { class: 'mv2-body', 'data-part': 'rear-leg' });
        const torso = svgNode('path', { class: 'mv2-torso', 'data-part': 'torso' });
        const neck = svgNode('path', { class: 'mv2-body', 'data-part': 'neck' });
        const pelvis = svgNode('ellipse', { class: 'mv2-pelvis', 'data-part': 'pelvis', rx: 22, ry: 13 });
        const head = svgNode('circle', { class: 'mv2-head', 'data-part': 'head', r: 16 });
        const frontArmShadow = svgNode('path', { class: 'mv2-body-shadow', 'data-part': 'front-arm-shadow' });
        const frontArm = svgNode('path', { class: 'mv2-body', 'data-part': 'front-arm' });
        const frontLegShadow = svgNode('path', { class: 'mv2-body-shadow', 'data-part': 'front-leg-shadow' });
        const frontLeg = svgNode('path', { class: 'mv2-body', 'data-part': 'front-leg' });
        const rearShoe = svgNode('path', { class: 'mv2-body', 'data-part': 'rear-shoe' });
        const frontShoe = svgNode('path', { class: 'mv2-body', 'data-part': 'front-shoe' });
        const rearHand = svgNode('circle', { class: 'mv2-hand', 'data-part': 'rear-hand', r: 6 });
        const frontHand = svgNode('circle', { class: 'mv2-hand', 'data-part': 'front-hand', r: 6 });
        const gaze = svgNode('line', { class: 'mv2-gaze', 'data-part': 'gaze', display: 'none' });
        athlete.append(rearArmShadow, rearArm, rearLegShadow, rearLeg, torso, neck, pelvis, head, frontArmShadow, frontArm, frontLegShadow, frontLeg, rearShoe, frontShoe, rearHand, frontHand, gaze);
        const bellLayer = svgNode('g', { 'data-part': 'bell-layer' });
        root.append(ground, decor, athlete, bellLayer);
        svg.appendChild(root);
        return { svg, root, ground, decor, athlete, bellLayer, rearArmShadow, rearArm, rearLegShadow, rearLeg, torso, neck, pelvis, head, frontArmShadow, frontArm, frontLegShadow, frontLeg, rearShoe, frontShoe, rearHand, frontHand, gaze, bells: [] };
      }

      function setPath(node, points) {
        node.setAttribute('d', `M${points.map(point).join(' L')}`);
      }

      function renderEnvironment(scene, exercise) {
        scene.decor.replaceChildren();
        const topDown = exercise.renderer === 'prone-top';
        scene.ground.setAttribute('display', topDown ? 'none' : 'inline');
        if (topDown) scene.decor.appendChild(svgNode('rect', { x:54, y:26, width:252, height:304, rx:18, class:'mv2-prop', opacity:.55 }));
        const prop = exercise.prop;
        if (prop?.type === 'support') {
          scene.decor.appendChild(svgNode('rect', { x:prop.x, y:prop.y, width:prop.width, height:prop.height, rx:3, class:'mv2-prop' }));
          scene.decor.appendChild(svgNode('path', { d:`M${prop.x + 8} ${prop.y + prop.height} V318 M${prop.x + prop.width - 8} ${prop.y + prop.height} V318`, class:'mv2-prop' }));
        }
        if (prop?.type === 'chair') {
          const left = prop.seatX;
          const right = prop.seatX + prop.seatWidth;
          scene.decor.appendChild(svgNode('rect', { x:left, y:prop.seatY, width:prop.seatWidth, height:12, rx:3, class:'mv2-prop' }));
          scene.decor.appendChild(svgNode('path', { d:`M${right - 10} ${prop.seatY} V${prop.seatY - prop.backHeight} M${left + 12} ${prop.seatY + 12} V318 M${right - 12} ${prop.seatY + 12} V318`, class:'mv2-prop' }));
        }
        if (exercise.renderer === 'offset-base') {
          const base = svgNode('g', { 'data-motion-bell': 'true', 'data-motion-bell-prop': 'true' });
          base.append(svgNode('path', { d:'M86 301 Q87 287 96 283 H108 Q117 287 118 301 Z', class:'mv2-kb-body' }), svgNode('path', { d:'M91 301 H113', class:'mv2-kb-handle' }));
          scene.decor.appendChild(base);
        }
        if (exercise.renderMeta?.optionalProp === 'wall') scene.decor.appendChild(svgNode('path', { d:'M82 44 V318', class:'mv2-prop', opacity:.55 }));
      }

      function poseAt(exercise, elapsed) {
        const segments = exercise.segment;
        const total = segments.reduce((sum, value) => sum + value, 0);
        let cursor = ((elapsed % total) + total) % total;
        let index = 0;
        while (index < segments.length - 1 && cursor > segments[index]) {
          cursor -= segments[index];
          index += 1;
        }
        const fromIndex = exercise.sequence[index];
        const toIndex = exercise.sequence[(index + 1) % exercise.sequence.length];
        const raw = Math.min(1, cursor / Math.max(1, segments[index]));
        const hold = exercise.hold ?? .12;
        const progress = raw < hold ? 0 : (raw - hold) / (1 - hold);
        const eased = exercise.interpolation === 'smoother' ? smootherstep(progress) : smoothstep(progress);
        return mixPose(exercise.poses[fromIndex], exercise.poses[toIndex], eased);
      }

      function renderPose(scene, exercise, pose) {
        setPath(scene.rearArmShadow, [pose.ls, pose.le, pose.lw]);
        setPath(scene.rearArm, [pose.ls, pose.le, pose.lw]);
        setPath(scene.frontArmShadow, [pose.rs, pose.re, pose.rw]);
        setPath(scene.frontArm, [pose.rs, pose.re, pose.rw]);
        setPath(scene.rearLegShadow, [pose.lh, pose.lk, pose.la]);
        setPath(scene.rearLeg, [pose.lh, pose.lk, pose.la]);
        setPath(scene.frontLegShadow, [pose.rh, pose.rk, pose.ra]);
        setPath(scene.frontLeg, [pose.rh, pose.rk, pose.ra]);
        setPath(scene.rearShoe, [pose.la, pose.lt]);
        setPath(scene.frontShoe, [pose.ra, pose.rt]);
        scene.torso.setAttribute('d', `M${point(pose.ls)} Q${point(pose.neck)} ${point(pose.rs)} L${point(pose.rh)} Q${point([(pose.lh[0] + pose.rh[0]) / 2, (pose.lh[1] + pose.rh[1]) / 2 + 8])} ${point(pose.lh)} Z`);
        setPath(scene.neck, [pose.neck, pose.head]);
        scene.head.setAttribute('cx', pose.head[0]);
        scene.head.setAttribute('cy', pose.head[1]);
        const pelvisX = (pose.lh[0] + pose.rh[0]) / 2;
        const pelvisY = (pose.lh[1] + pose.rh[1]) / 2;
        scene.pelvis.setAttribute('cx', pelvisX);
        scene.pelvis.setAttribute('cy', pelvisY);
        scene.pelvis.setAttribute('transform', `rotate(${Math.atan2(pose.rh[1] - pose.lh[1], pose.rh[0] - pose.lh[0]) * 180 / Math.PI} ${pelvisX} ${pelvisY})`);
        scene.rearHand.setAttribute('cx', pose.lw[0]);
        scene.rearHand.setAttribute('cy', pose.lw[1]);
        scene.frontHand.setAttribute('cx', pose.rw[0]);
        scene.frontHand.setAttribute('cy', pose.rw[1]);
        if (pose.gaze) {
          scene.gaze.setAttribute('display', 'inline');
          ['x1','y1','x2','y2'].forEach((attr, index) => scene.gaze.setAttribute(attr, pose.gaze[index]));
        } else scene.gaze.setAttribute('display', 'none');

        const declaredCount = expectedBellCount(exercise);
        const environmentCount = exercise.renderer === 'offset-base' ? 1 : 0;
        const rigCount = Math.max(0, declaredCount - environmentCount);
        const poseBells = Array.isArray(pose.bells) && pose.bells.length
          ? pose.bells
          : [{ id:'primary', x:pose.kb[0], y:pose.kb[1], angle:pose.angle || 0, layer:pose.bellLayer }];
        while (scene.bells.length < rigCount) {
          const bell = createBell();
          scene.bells.push(bell);
          scene.bellLayer.appendChild(bell);
        }
        scene.bells.forEach((bell, index) => {
          if (index >= rigCount) {
            bell.setAttribute('display', 'none');
            return;
          }
          const data = poseBells[index] || poseBells[0];
          bell.setAttribute('display', 'inline');
          bell.setAttribute('transform', `translate(${data.x} ${data.y + (exercise.renderer === 'floor-drag' ? -4 : 0)}) rotate(${data.angle || 0})`);
          const layer = data.layer || pose.bellLayer || 'front';
          if (['behind-head','behind-torso','behind-pelvis'].includes(layer)) scene.root.insertBefore(bell, scene.athlete);
          else if (['behind-thigh','behind-front-thigh'].includes(layer)) scene.athlete.insertBefore(bell, scene.frontLegShadow);
          else scene.root.appendChild(bell);
        });
      }

      function createInstance(container, exercise, options = {}) {
        const scene = createScene(exercise);
        scene.root.setAttribute('transform', options.mirror ? 'translate(360 0) scale(-1 1)' : '');
        renderEnvironment(scene, exercise);
        container.replaceChildren(scene.svg);
        container.dataset.motionV2 = exercise.id;
        const staticMode = options.static === true || reduceMotionQuery.matches;
        const start = performance.now();
        let frame = 0;
        let destroyed = false;
        const tick = now => {
          if (destroyed) return;
          renderPose(scene, exercise, poseAt(exercise, staticMode ? 0 : now - start));
          if (!staticMode) frame = requestAnimationFrame(tick);
        };
        tick(start);
        const instance = {
          exercise,
          sourceName: options.sourceName,
          mirror: options.mirror,
          scene,
          destroy({ clear = true } = {}) {
            destroyed = true;
            if (frame) cancelAnimationFrame(frame);
            liveInstances.delete(instance);
            if (instances.get(container) === instance) instances.delete(container);
            if (clear && container.dataset.motionV2) {
              container.replaceChildren();
              delete container.dataset.motionV2;
            }
          }
        };
        liveInstances.add(instance);
        return instance;
      }

      function mount(container, nameOrId, options = {}) {
        if (!enabled) return false;
        if (!(container instanceof Element)) return false;
        const exercise = resolveExercise(nameOrId);
        if (!exercise) return false;
        const mirror = mirrorFor(nameOrId, exercise);
        const current = instances.get(container);
        if (current && current.exercise === exercise && current.mirror === mirror) return true;
        instances.get(container)?.destroy({ clear:false });
        try {
          const instance = createInstance(container, exercise, { ...options, mirror, sourceName:nameOrId });
          instances.set(container, instance);
          return true;
        } catch (error) {
          console.error('[MotionRigV2] render failed', nameOrId, error);
          return false;
        }
      }

      function destroy(container, options) {
        const instance = instances.get(container);
        if (!instance) return false;
        instance.destroy(options);
        return true;
      }

      function destroyAll() {
        [...liveInstances].forEach(instance => instance.destroy());
      }

      installStyles();
      const enabled = new URLSearchParams(location.search).get('motion') === 'v2';
      if (enabled && !document.querySelector('.motion-v2-preprod-badge')) {
        const badge = document.createElement('div');
        badge.className = 'motion-v2-preprod-badge';
        badge.textContent = 'PREPROD V2';
        badge.setAttribute('aria-hidden', 'true');
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(badge), { once:true });
      }

      const publicApi = Object.freeze({
        enabled,
        exercises,
        canonicalProfiles: [...canonicalProfiles],
        appExerciseMap: { ...appExerciseMap },
        resolve: resolveExercise,
        expectedBellCount: nameOrExercise => {
          const exercise = typeof nameOrExercise === 'string' ? resolveExercise(nameOrExercise) : nameOrExercise;
          return exercise ? expectedBellCount(exercise) : null;
        },
        mapName: name => resolveExercise(name)?.id || null,
        mount,
        update: mount,
        destroy,
        destroyAll,
        activeCount: () => liveInstances.size,
        snapshot: () => ({ enabled, mounted:liveInstances.size, reducedMotion:reduceMotionQuery.matches })
      });
      globalThis.MotionRigV2 = publicApi;
      globalThis.KettlebellMotionV2 = publicApi;
      reduceMotionQuery.addEventListener('change', () => {
        [...liveInstances].forEach(instance => {
          const { sourceName, mirror } = instance;
          const container = instance.scene.svg.parentElement;
          instance.destroy({ clear:false });
          if (container) {
            const replacement = createInstance(container, instance.exercise, { sourceName, mirror, static:reduceMotionQuery.matches });
            instances.set(container, replacement);
          }
        });
      });
      window.addEventListener('pagehide', destroyAll);
    })();
*/

      const SVG_NS = 'http://www.w3.org/2000/svg';
      const jointNames = ['head','neck','ls','rs','le','re','lw','rw','lh','rh','lk','rk','la','ra','lt','rt'];
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const motionMode = new URLSearchParams(window.location.search).get('motion');
      const enabled = motionMode !== 'legacy';
      const instances = new Set();
      const instancesByContainer = new WeakMap();
      let animationFrame = 0;
      let lastFrame = 0;

      const normalizeName = value => String(value || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      const normalizedAppMap = new Map(Object.keys(appExerciseMap).map(name => [normalizeName(name), name]));
      const point = p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
      const mixNum = (a, b, t) => a + (b - a) * t;
      const mixPoint = (a, b, t) => [mixNum(a[0], b[0], t), mixNum(a[1], b[1], t)];
      const smoothstep = t => t * t * (3 - 2 * t);
      const smootherstep = t => t * t * t * (t * (t * 6 - 15) + 10);

      function canonicalIdForName(name) {
        const exactName = Object.hasOwn(appExerciseMap, name) ? name : normalizedAppMap.get(normalizeName(name));
        if (!exactName) return null;
        const target = appExerciseMap[exactName];
        const variant = kettlebellPacket.variantSeeds[target];
        const canonical = variant?.extends || target;
        return canonicalBindings[canonical] || canonical;
      }

      function resolveExercise(name) {
        const exactName = Object.hasOwn(appExerciseMap, name) ? name : normalizedAppMap.get(normalizeName(name));
        if (!exactName) return null;
        const target = appExerciseMap[exactName];
        const variant = kettlebellPacket.variantSeeds[target];
        const id = canonicalIdForName(exactName);
        const exercise = exercises[id];
        if (!exercise) return null;
        const rightLabel = /(?:\(D\)|droite|right)/i.test(exactName);
        return {
          exercise,
          mirror: Boolean(exercise.mirror) !== Boolean(variant?.mirror || (!variant && exercise.mirrorable && rightLabel))
        };
      }

      function svgNode(name, attrs = {}) {
        const node = document.createElementNS(SVG_NS, name);
        Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
        return node;
      }

      function createBellNode(index = 0) {
        const bell = svgNode('g', { class: 'motion-v2-bell', 'data-motion-bell': String(index), 'aria-hidden': 'true' });
        bell.append(
          svgNode('path', { d: 'M-12 8 Q-11 -6 0 -9 Q11 -6 12 8 Q12 17 0 19 Q-12 17 -12 8 Z', class: 'motion-v2-bell-body' }),
          svgNode('path', { d: 'M-7 -7 Q-7 -17 0 -17 Q7 -17 7 -7', class: 'motion-v2-bell-handle' })
        );
        return bell;
      }

      function injectStyles() {
        if (document.getElementById('motion-v2-styles')) return;
        const style = document.createElement('style');
        style.id = 'motion-v2-styles';
        style.textContent = `
          .motion-v2-stage { width:100%; height:100%; display:block; overflow:visible; contain:layout paint; }
          .motion-v2-stage .motion-v2-limb-shadow { fill:none; stroke:#0d0d0d; stroke-width:12; stroke-linecap:round; stroke-linejoin:round; opacity:.38; }
          .motion-v2-stage .motion-v2-limb { fill:none; stroke:var(--body-color,#e8d5c0); stroke-width:7; stroke-linecap:round; stroke-linejoin:round; }
          .motion-v2-stage .motion-v2-torso { fill:#28231f; stroke:var(--body-color,#e8d5c0); stroke-width:4; stroke-linejoin:round; }
          .motion-v2-stage .motion-v2-head { fill:#28231f; stroke:var(--body-color,#e8d5c0); stroke-width:4; }
          .motion-v2-stage .motion-v2-joint { fill:#28231f; stroke:var(--body-color,#e8d5c0); stroke-width:3; }
          .motion-v2-stage .motion-v2-hand { fill:var(--body-color,#e8d5c0); }
          .motion-v2-stage .motion-v2-bell-body { fill:#123d3a; stroke:var(--kb-color,#4ecdc4); stroke-width:4; }
          .motion-v2-stage .motion-v2-bell-handle { fill:none; stroke:var(--kb-color,#4ecdc4); stroke-width:4; stroke-linecap:round; }
          .motion-v2-stage .motion-v2-ground { stroke:var(--surface2,#2a2a2a); stroke-width:3; stroke-linecap:round; }
          .motion-v2-stage .motion-v2-prop { fill:#262626; stroke:var(--muted,#777); stroke-width:3; stroke-linecap:round; stroke-linejoin:round; }
          .motion-v2-preprod-badge { position:fixed; z-index:9999; right:8px; bottom:max(8px,env(safe-area-inset-bottom)); padding:4px 7px; border:1px solid color-mix(in srgb,var(--rest,#4ecdc4) 60%,transparent); border-radius:999px; background:#111d; color:var(--rest,#4ecdc4); font:700 9px/1.1 sans-serif; letter-spacing:.08em; pointer-events:none; }
        `;
        document.head.appendChild(style);
      }

      function buildStage(container, exercise) {
        const svg = svgNode('svg', {
          viewBox: '0 0 360 340', class: 'motion-v2-stage', role: 'img',
          'aria-label': `${exercise.title}, démonstration animée`
        });
        const decor = svgNode('g', { class: 'motion-v2-decor' });
        const ground = svgNode('path', { d: 'M55 320 H305', class: 'motion-v2-ground' });
        const motionRoot = svgNode('g');
        const athlete = svgNode('g');
        const rearArmShadow = svgNode('path', { class: 'motion-v2-limb-shadow' });
        const rearArm = svgNode('path', { class: 'motion-v2-limb' });
        const rearLegShadow = svgNode('path', { class: 'motion-v2-limb-shadow' });
        const rearLeg = svgNode('path', { class: 'motion-v2-limb' });
        const torso = svgNode('path', { class: 'motion-v2-torso' });
        const neck = svgNode('line', { class: 'motion-v2-limb' });
        const pelvis = svgNode('ellipse', { rx: 23, ry: 12, class: 'motion-v2-joint' });
        const head = svgNode('circle', { r: 17, class: 'motion-v2-head' });
        const frontLegShadow = svgNode('path', { class: 'motion-v2-limb-shadow' });
        const frontLeg = svgNode('path', { class: 'motion-v2-limb' });
        const frontArmShadow = svgNode('path', { class: 'motion-v2-limb-shadow' });
        const frontArm = svgNode('path', { class: 'motion-v2-limb' });
        const rearShoe = svgNode('path', { class: 'motion-v2-limb' });
        const frontShoe = svgNode('path', { class: 'motion-v2-limb' });
        const rearHand = svgNode('circle', { r: 5, class: 'motion-v2-hand' });
        const frontHand = svgNode('circle', { r: 5, class: 'motion-v2-hand' });
        athlete.append(rearArmShadow, rearArm, rearLegShadow, rearLeg, torso, neck, pelvis, head,
          frontLegShadow, frontLeg, rearShoe, frontShoe, frontArmShadow, frontArm, rearHand, frontHand);
        motionRoot.appendChild(athlete);
        svg.append(decor, ground, motionRoot);
        container.replaceChildren(svg);
        return { svg, decor, ground, motionRoot, athlete, rearArmShadow, rearArm, rearLegShadow, rearLeg,
          torso, neck, pelvis, head, frontLegShadow, frontLeg, frontArmShadow, frontArm,
          rearShoe, frontShoe, rearHand, frontHand, bells: [], environmentBells: [] };
      }

      function setPath(node, points) {
        node.setAttribute('d', `M${points.map(point).join(' L')}`);
      }

      function setLine(node, a, b) {
        node.setAttribute('x1', a[0]); node.setAttribute('y1', a[1]);
        node.setAttribute('x2', b[0]); node.setAttribute('y2', b[1]);
      }

      function mixPose(a, b, t) {
        const pose = {};
        jointNames.concat(['kb']).forEach(name => {
          if (a[name] && b[name]) pose[name] = mixPoint(a[name], b[name], t);
        });
        pose.angle = mixNum(a.angle || 0, b.angle || 0, t);
        if (Array.isArray(a.bells) && Array.isArray(b.bells)) {
          pose.bells = a.bells.map((bell, index) => {
            const next = b.bells.find(candidate => candidate.id === bell.id) || b.bells[index] || bell;
            return { id: bell.id || next.id || `bell-${index}`, x: mixNum(bell.x, next.x, t),
              y: mixNum(bell.y, next.y, t), angle: mixNum(bell.angle || 0, next.angle || 0, t),
              layer: t < .5 ? bell.layer : next.layer };
          });
        }
        pose.props = { ...(t < .5 ? a.props : b.props) };
        pose.bellLayer = t < .5 ? a.bellLayer : b.bellLayer;
        return pose;
      }

      function timelineAt(exercise, normalized) {
        const total = exercise.segment.reduce((sum, value) => sum + value, 0);
        let cursor = normalized * total;
        let index = 0;
        while (index < exercise.segment.length - 1 && cursor > exercise.segment[index]) {
          cursor -= exercise.segment[index++];
        }
        const fromIndex = exercise.sequence[index];
        const toIndex = exercise.sequence[(index + 1) % exercise.sequence.length];
        const raw = Math.min(1, cursor / exercise.segment[index]);
        const hold = exercise.hold ?? .18;
        const moving = raw < hold ? 0 : (raw - hold) / (1 - hold);
        const eased = exercise.interpolation === 'smoother' ? smootherstep(moving) : smoothstep(moving);
        return { pose: mixPose(exercise.poses[fromIndex], exercise.poses[toIndex], eased), phase: fromIndex };
      }

      function expectedBellCount(exercise) {
        if (Number.isInteger(exercise.renderMeta?.bellCount)) return Math.max(0, exercise.renderMeta.bellCount);
        if (exercise.renderer === 'floor-marker' || exercise.renderer === 'offset-base') return 1;
        return exercise.equipment.includes('kettlebell') ? 1 : 0;
      }

      function renderEnvironment(instance) {
        const { exercise: ex, nodes } = instance;
        nodes.decor.replaceChildren();
        nodes.environmentBells = [];
        nodes.ground.style.display = ex.renderer === 'prone-top' ? 'none' : '';
        if (ex.renderer === 'prone-top') {
          nodes.decor.appendChild(svgNode('rect', { x: 54, y: 26, width: 252, height: 294, rx: 18, class: 'motion-v2-prop', opacity: .28 }));
        }
        const prop = ex.prop;
        if (prop?.type === 'support') {
          nodes.decor.appendChild(svgNode('rect', { x: prop.x, y: prop.y, width: prop.width, height: prop.height, rx: 3, class: 'motion-v2-prop' }));
        }
        if (prop?.type === 'chair') {
          nodes.decor.append(
            svgNode('rect', { x: prop.seatX, y: prop.seatY, width: prop.seatWidth, height: 12, rx: 3, class: 'motion-v2-prop' }),
            svgNode('path', { d: `M${prop.seatX + prop.seatWidth - 10} ${prop.seatY} V${prop.seatY - prop.backHeight} M${prop.seatX + 12} ${prop.seatY + 12} V318 M${prop.seatX + prop.seatWidth - 12} ${prop.seatY + 12} V318`, class: 'motion-v2-prop' })
          );
        }
        if (ex.renderer === 'offset-base') {
          const bell = createBellNode('prop');
          bell.setAttribute('transform', 'translate(102 292)');
          nodes.environmentBells.push(bell);
          nodes.decor.appendChild(bell);
        }
        if (ex.renderer === 'floor-marker') {
          nodes.decor.appendChild(svgNode('ellipse', { cx: 180, cy: 304, rx: 27, ry: 7, class: 'motion-v2-prop', opacity: .55 }));
        }
        if (ex.renderMeta?.optionalProp === 'wall') {
          nodes.decor.appendChild(svgNode('path', { d: 'M82 44 V318', class: 'motion-v2-prop', opacity: .5 }));
        }
      }

      function acquireBell(instance, index) {
        if (!instance.nodes.bells[index]) instance.nodes.bells[index] = createBellNode(index);
        return instance.nodes.bells[index];
      }

      function placeBell(instance, node, layer) {
        const { nodes } = instance;
        if (['behind-head','behind-torso','behind-pelvis'].includes(layer)) nodes.athlete.insertBefore(node, nodes.torso);
        else if (['behind-thigh','behind-front-thigh'].includes(layer)) nodes.athlete.insertBefore(node, nodes.frontLegShadow);
        else nodes.motionRoot.appendChild(node);
      }

      function renderBells(instance, pose, phase) {
        const { exercise: ex, nodes } = instance;
        const environmentCount = ex.renderer === 'offset-base' ? 1 : 0;
        const rigCount = Math.max(0, expectedBellCount(ex) - environmentCount);
        const source = Array.isArray(pose.bells) && pose.bells.length
          ? pose.bells
          : pose.kb ? [{ id: 'primary', x: pose.kb[0], y: pose.kb[1], angle: pose.angle || 0, layer: pose.bellLayer }] : [];
        const active = source.slice(0, rigCount);
        const phaseLayer = ex.renderMeta?.zByPose?.[Math.min(phase, (ex.renderMeta.zByPose?.length || 1) - 1)];
        active.forEach((bell, index) => {
          const node = acquireBell(instance, index);
          node.style.display = '';
          node.setAttribute('transform', `translate(${bell.x} ${bell.y + (ex.renderer === 'floor-drag' ? -4 : 0)}) rotate(${bell.angle || 0})`);
          placeBell(instance, node, bell.layer || pose.bellLayer || phaseLayer || 'front');
        });
        nodes.bells.slice(active.length).forEach(node => { node.style.display = 'none'; });
      }

      function renderInstance(instance) {
        const { exercise: ex, nodes } = instance;
        const { pose, phase } = timelineAt(ex, instance.progress);
        setPath(nodes.rearArmShadow, [pose.ls, pose.le, pose.lw]);
        setPath(nodes.rearArm, [pose.ls, pose.le, pose.lw]);
        setPath(nodes.frontArmShadow, [pose.rs, pose.re, pose.rw]);
        setPath(nodes.frontArm, [pose.rs, pose.re, pose.rw]);
        setPath(nodes.rearLegShadow, [pose.lh, pose.lk, pose.la]);
        setPath(nodes.rearLeg, [pose.lh, pose.lk, pose.la]);
        setPath(nodes.frontLegShadow, [pose.rh, pose.rk, pose.ra]);
        setPath(nodes.frontLeg, [pose.rh, pose.rk, pose.ra]);
        setPath(nodes.rearShoe, [pose.la, pose.lt]);
        setPath(nodes.frontShoe, [pose.ra, pose.rt]);
        nodes.torso.setAttribute('d', `M${point(pose.ls)} Q${point(pose.neck)} ${point(pose.rs)} L${point(pose.rh)} Q${point([(pose.lh[0]+pose.rh[0])/2,(pose.lh[1]+pose.rh[1])/2+8])} ${point(pose.lh)} Z`);
        setLine(nodes.neck, pose.neck, pose.head);
        nodes.head.setAttribute('cx', pose.head[0]); nodes.head.setAttribute('cy', pose.head[1]);
        const pelvis = [(pose.lh[0] + pose.rh[0]) / 2, (pose.lh[1] + pose.rh[1]) / 2];
        nodes.pelvis.setAttribute('cx', pelvis[0]); nodes.pelvis.setAttribute('cy', pelvis[1]);
        nodes.pelvis.setAttribute('transform', `rotate(${Math.atan2(pose.rh[1]-pose.lh[1],pose.rh[0]-pose.lh[0])*180/Math.PI} ${pelvis[0]} ${pelvis[1]})`);
        nodes.rearHand.setAttribute('cx', pose.lw[0]); nodes.rearHand.setAttribute('cy', pose.lw[1]);
        nodes.frontHand.setAttribute('cx', pose.rw[0]); nodes.frontHand.setAttribute('cy', pose.rw[1]);
        nodes.motionRoot.setAttribute('transform', instance.mirror ? 'translate(360 0) scale(-1 1)' : '');
        renderBells(instance, pose, phase);
      }

      function stopLoop() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        lastFrame = 0;
      }

      function ensureLoop() {
        if (animationFrame || reducedMotion.matches || document.hidden || !instances.size) return;
        animationFrame = requestAnimationFrame(tick);
      }

      function tick(now) {
        animationFrame = 0;
        const dt = Math.min(50, lastFrame ? now - lastFrame : 16);
        lastFrame = now;
        instances.forEach(instance => {
          if (!instance.container.isConnected) {
            instances.delete(instance);
            return;
          }
          if (instance.container.offsetParent === null) return;
          instance.progress = (instance.progress + dt / (instance.exercise.duration || 4200)) % 1;
          renderInstance(instance);
        });
        ensureLoop();
      }

      function destroy(container) {
        if (!container) {
          [...instances].forEach(instance => destroy(instance.container));
          return;
        }
        const instance = instancesByContainer.get(container);
        if (!instance) return;
        instances.delete(instance);
        instancesByContainer.delete(container);
        if (!instances.size) stopLoop();
      }

      function mount(container, name) {
        if (!enabled || !(container instanceof Element)) return false;
        const resolved = resolveExercise(name);
        if (!resolved) return false;
        let instance = instancesByContainer.get(container);
        if (instance && instance.exercise === resolved.exercise && instance.mirror === resolved.mirror) {
          renderInstance(instance);
          ensureLoop();
          return true;
        }
        if (instance) destroy(container);
        instance = {
          container, exercise: resolved.exercise, mirror: resolved.mirror, progress: 0,
          nodes: buildStage(container, resolved.exercise)
        };
        renderEnvironment(instance);
        instances.add(instance);
        instancesByContainer.set(container, instance);
        renderInstance(instance);
        ensureLoop();
        return true;
      }

      reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
          stopLoop();
          instances.forEach(instance => { instance.progress = 0; renderInstance(instance); });
        } else ensureLoop();
      });
      document.addEventListener('visibilitychange', () => document.hidden ? stopLoop() : ensureLoop());
      window.addEventListener('pagehide', () => destroy());

      if (enabled) {
        injectStyles();
      }
      if (motionMode === 'v2') {
        const badge = document.createElement('div');
        badge.className = 'motion-v2-preprod-badge';
        badge.textContent = 'PREPROD V2';
        badge.setAttribute('aria-hidden', 'true');
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(badge), { once: true });
      }

      window.KettlebellMotionV2 = {
        enabled,
        canonicalProfiles: Object.freeze([...canonicalProfiles]),
        appExerciseNames: Object.freeze(Object.keys(appExerciseMap)),
        mapName: canonicalIdForName,
        mount,
        update: mount,
        destroy,
        expectedBellCount: name => {
          const resolved = resolveExercise(name);
          return resolved ? expectedBellCount(resolved.exercise) : null;
        },
        snapshot: () => ({ enabled, mounted: instances.size, reducedMotion: reducedMotion.matches })
      };
    })();
