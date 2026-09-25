import type { TradeProgramme } from './build';

export const weldingProgramme: TradeProgramme = {
  id: 'welding-fabrication',
  title: 'Welding & fabrication',
  titleSw: 'Ulehemu na utengenezaji',
  description:
    'Semester-style welding L5 cores: arc PPE, MMA, defects, oxy-fuel fabrication, then GMAW/MIG, TIG, and weld testing as in CDACC occupational standards.',
  descriptionSw:
    'Mtaala wa semester: PPE, MMA, kasoro, gesi, kisha MIG, TIG, na majaribio ya weld.',
  icon: '🛠️',
  modules: [
    {
      slug: 'ppe',
      title: 'Arc safety, PPE, and the bay',
      titleSw: 'Usalama wa arc, PPE, na bay',
      description: 'Filters, leather, ventilation, and why you never look at a live arc.',
      minutes: 20,
      cdacc: 'CU/WEL/CR/01/5',
      examDomain: 'Occupational safety',
      media: [{ kind: 'animation', preset: 'weld', caption: 'Arc flash — UV/IR, not just “bright light”.' }],
      watchMedia: [
        { kind: 'animation', preset: 'weld', mustFinish: true, caption: 'Confirm helmet discipline before questions.' },
      ],
      watchPrompt: 'Watch the arc simulation and confirm you will use a rated filter before answering.',
      briefing:
        'Welding is a high-risk trade. Shade 10–13 filters (follow electrode and process), leather gloves, apron or jacket, and closed boots are not optional. Cotton under-layers beat melting synthetics. Screens protect the next trainee. Chipping slag without eye protection is how “welder’s flash” and metal-in-eye cases fill the clinic every term.\n\nTreat cylinders, cables, and the workpiece as a system. Isolate the machine when changing electrodes if the procedure requires it; never coil cables around your body. The workpiece clamp must be on clean metal, not a painted bench edge that arcs randomly. Ventilate: zinc on galvanised steel produces fumes that make you ill; grind coatings off in a controlled way and extract.\n\nHousekeeping is part of safety: no water on the floor around MMA sets, no oily rags by grinders, fire extinguisher known and unblocked. Hot work needs a watcher if the college rule says so. Never weld on a closed tank that held fuel.\n\nAssessors watch helmet-down before the strike, not after you see the puddle. That habit is the first competence.',
      briefingSw:
        'Kivuli 10–13, glavu za ngozi, na buti ni lazima. Usitazame arc. Ventilate; fume ya zinc ni hatari. Clamp iwe kwenye chuma safi. Usilehemu tanki la mafuta. Helmet inashuka kabla ya kugonga electrode.',
      questions: [
        {
          prompt: 'Why must a welder never look at the arc with the naked eye?',
          options: [
            'It only wastes electrodes',
            'Arc flash (UV/IR) can burn the cornea (“welder’s flash”)',
            'It cools the metal too fast',
            'It is only a problem at night',
          ],
          correct: 'b',
          hint: 'The arc is a UV source.',
          explanation: 'Photokeratitis is painful and preventable with a rated helmet filter.',
        },
        {
          prompt: 'The earth / work clamp should be attached to:',
          options: [
            'Painted bench tube',
            'Clean metal on the job so current returns through a short, sound path',
            'The helmet strap',
            'A wet floor',
          ],
          correct: 'b',
          hint: 'Bad earth makes stray arcs.',
          explanation: 'A poor return path is a shock and quality problem.',
        },
        {
          prompt: 'Before welding galvanised sheet you should:',
          options: [
            'Ignore the coating',
            'Remove coating in the weld zone and use extraction; know metal-fume fever risk',
            'Paint more zinc on first',
            'Use water as flux',
          ],
          correct: 'b',
          hint: 'Zinc fumes.',
          explanation: 'Grind/strip as specified and ventilate. Do not breathe the plume.',
        },
        {
          prompt: 'A closed drum that once held petrol is:',
          options: [
            'Safe if you whistle',
            'Not to be welded until made safe by a competent procedure — explosion risk',
            'Best preheated with oxy-fuel',
            'A good exam shortcut',
          ],
          correct: 'b',
          hint: 'Vapour plus spark kills.',
          explanation: 'Tank welding is specialist. Polytechnic practice is: do not.',
        },
      ],
      blanks: [
        {
          prompt: 'Painful UV burn of the eye from an arc is commonly called welder’s ___.',
          answer: 'flash',
          hint: 'Also photokeratitis.',
          explanation: 'Filter shade and helmet timing prevent it.',
        },
      ],
      practice: {
        prompt: 'A classmate chips slag in a T-shirt, visor up, toward the next bay. What do you do?',
        options: [
          'Film it for TikTok',
          'Stop the work, visor down or safety specs, leather on, screen the bay, then chip',
          'Turn up current so slag flies less',
          'Pour water on the weld',
        ],
        correct: 'b',
        hint: 'Hot slag is a projectile.',
        explanation: 'Eye protection stays on for chipping. Supervisors fail this instantly.',
      },
    },
    {
      slug: 'mma',
      title: 'Joints, electrodes, and MMA setup',
      titleSw: 'Viungo, electrode, na MMA',
      description: 'Butt, lap, fillet; current vs diameter; striking and travel.',
      minutes: 22,
      cdacc: 'CU/WEL/CR/02/5',
      examDomain: 'MMA / SMAW practice',
      briefing:
        'MMA/SMAW (stick) is the common polytechnic process. Joint types: butt (edges in one plane), lap (overlap), T-fillet, and corner. A fillet sits in the included angle; its size is the leg length, not how pretty the ripples look. Clean mill scale, rust, and oil from the joint. A dirty joint is porosity waiting to happen.\n\nElectrode diameter and current are paired. A typical starting point many trainers use: roughly 30–40 A per millimetre of electrode diameter, then tune to the puddle. Too cold: the slag fights you and the bead sits high. Too hot: undercut and burn-through on thin plate. Electrode angle and arc length (about the core diameter) matter as much as the dial.\n\nStrike on the joint or on a scrap, not on the bench. Travel speed should leave a bead about twice the core diameter for many pad welds — follow the WPS or job card. Stop, chip, and inspect between runs on a multi-pass butt. Interpass temperature matters on thicker plate; do not freeze a second pass onto black cold slag.\n\nStore electrodes dry. Damp rutile/basic rods give hydrogen cracks and porosity. If the oven is required, use it.',
      briefingSw:
        'Butt, lap, fillet. Safisha kiungo. Current inafuatana na kipenyo cha electrode. Arc fupi. Angle na kasi vinaathiri bead. Hifadhi electrode kavu.',
      questions: [
        {
          prompt: 'Which joint joins two plates in the same plane, edge to edge?',
          options: ['Lap joint', 'Butt joint', 'Wood dovetail', 'Rivet without heat'],
          correct: 'b',
          hint: 'Edges face each other.',
          explanation: 'A butt joint welds two edges in one plane.',
        },
        {
          prompt: 'A fillet weld size is primarily described by:',
          options: ['The colour of slag', 'Leg length (and throat as specified)', 'Electrode brand only', 'Helmet sticker'],
          correct: 'b',
          hint: 'Geometry, not art.',
          explanation: 'Inspectors measure legs. Ripple is secondary to size and fusion.',
        },
        {
          prompt: 'An arc that is too long typically causes:',
          options: ['Perfect fusion always', 'Spatter, unstable arc, and poor shielding', 'Automatic heat treatment', 'Smaller electrodes'],
          correct: 'b',
          hint: 'The gas shield is the flux envelope.',
          explanation: 'Keep a short arc. Long arcs suck air into the puddle.',
        },
        {
          prompt: 'Damp basic electrodes are a risk because:',
          options: ['They weld faster', 'Moisture can add hydrogen and porosity / cracking', 'They become stainless', 'NITA requires wet rods'],
          correct: 'b',
          hint: 'Hydrogen cracking.',
          explanation: 'Dry storage or baking as specified is part of the trade.',
        },
      ],
      blanks: [
        {
          prompt: 'Stick welding using a flux-coated consumable electrode is abbreviated MMA or ___.',
          answer: 'SMAW',
          hint: 'Shielded Metal Arc Welding.',
          explanation: 'MMA and SMAW are the same family of process.',
        },
      ],
      practice: {
        prompt: 'Thin 1.5 mm sheet burns through at 120 A with a 3.2 mm rod. What is the professional adjustment?',
        options: [
          'Increase to 180 A',
          'Drop current, consider a smaller electrode, faster travel, and a backing or different joint',
          'Remove the helmet to see better',
          'Weld underwater',
        ],
        correct: 'b',
        hint: 'Heat input vs thickness.',
        explanation: 'Heat input is current, voltage/arc, and time. Thin sheet needs less heat, not more heroics.',
      },
    },
    {
      slug: 'defects',
      title: 'Weld defects and visual inspection',
      titleSw: 'Kasoro za weld na ukaguzi',
      description: 'Porosity, undercut, slag inclusions, lack of fusion, and what you grind versus recut.',
      minutes: 18,
      cdacc: 'CU/WEL/CR/03/5',
      examDomain: 'Quality & inspection',
      briefing:
        'Visual inspection is the first NDT. Look at profile, undercut, overlap, craters, and spatter. Undercut is a groove melted into the parent metal along the toe — it is a stress raiser. Porosity is gas holes from contamination, long arc, or damp flux. Slag inclusions happen when you do not chip and brush between passes. Lack of fusion is a cold joint that looks joined until it peels.\n\nCracks are never “just cosmetic”. Stop. Report. Do not peen a crack to hide it. For many student butts, the repair is grind to sound metal and re-weld, not a third pass over dirt.\n\nMeasure throat and legs with a gauge if you have one. A pretty ripple on an undersize fillet still fails. Parent metal thickness and the drawing decide the size, not your eye from two metres.\n\nWrite defects in the log with the cause: “undercut — current high / travel slow at the toe.” That sentence is how you improve, and how assessors see that you understand metallurgy at craft level.',
      briefingSw:
        'Angalia undercut, porosity, slag, na fusion. Mpasuko si mapambo. Pima ukubwa wa fillet. Andika kasoro na sababu kwenye log.',
      questions: [
        {
          prompt: 'Undercut is dangerous mainly because:',
          options: ['It uses extra rods', 'It is a notch that concentrates stress', 'It looks dark', 'It cools the shop'],
          correct: 'b',
          hint: 'Fatigue starts at notches.',
          explanation: 'Toes must be smooth enough for the spec. Grind and re-weld if required.',
        },
        {
          prompt: 'The usual cause of slag trapped between MMA passes is:',
          options: ['Too much grinding of the table', 'Not deslagging and brushing before the next pass', 'Using a helmet', 'Earthing correctly'],
          correct: 'b',
          hint: 'Clean between runs.',
          explanation: 'Chip, brush, inspect, then weld. Slag is not filler metal.',
        },
        {
          prompt: 'Porosity often comes from:',
          options: ['Perfectly dry, clean joints', 'Contamination, moisture, or a long arc', 'Correct clamp only', 'Too much PPE'],
          correct: 'b',
          hint: 'Gas in the puddle.',
          explanation: 'Clean, dry, short arc. Then look again.',
        },
        {
          prompt: 'A crack in a butt weld should be:',
          options: ['Painted', 'Reported and repaired by removing to sound metal — not covered', 'Ignored if the ripple is even', 'Peened until shiny'],
          correct: 'b',
          hint: 'Hiding cracks is a fail and a hazard.',
          explanation: 'Structural honesty is the occupation.',
        },
      ],
      blanks: [
        {
          prompt: 'Gas pockets left in a weld metal are called ___.',
          answer: 'porosity',
          hint: 'Holes from gas.',
          explanation: 'Porosity is a visual and structural defect.',
        },
      ],
      practice: {
        prompt: 'Your fillet is shiny but a gauge shows legs of 3 mm where the drawing says 6 mm. What is correct?',
        options: [
          'Pass it; shine is strength',
          'Add a correctly sized pass or rebuild to the specified throat/legs after cleaning',
          'Grind the parent thinner so the ratio looks bigger',
          'Photograph from far away',
        ],
        correct: 'b',
        hint: 'Size is specified.',
        explanation: 'Undersize fillets fail even if they are pretty.',
      },
    },
    {
      slug: 'gas-fab',
      title: 'Oxy-fuel, leaks, and simple fabrication',
      titleSw: 'Gesi, uvujaji, na fabrication',
      description: 'Cylinder practice, leak test, cutting sequence, and square frames.',
      minutes: 20,
      cdacc: 'CU/WEL/CR/04/5',
      examDomain: 'Oxy-fuel & fabrication',
      briefing:
        'Oxy-acetylene is still taught for cutting, heating, and braze-welding. Cylinders stay chained. Open oxygen slowly. Acetylene: keep cylinders upright, and know the 15 psi (about 1 bar) working-pressure caution taught in class — follow the college chart. Flashback arrestors and correct hose colours (red fuel, blue oxygen in many Kenyan shops — confirm local standard) are not decorations.\n\nLeak test with approved solution, never a flame. An icy fitting can mean a leaking gas expanding. If you smell acetylene: shut cylinders, no sparks, ventilate, and fetch the instructor.\n\nFabrication: measure twice, square with a builder’s square or 3-4-5, tack opposite corners, check, then weld. Distortion is controlled by sequence, not by hoping. Cut with a clean piercing method off the line, then run the cut; slag on the floor is hot.\n\nA square gate that is diamond-shaped after welding was tacked out of square. Fit-up is most of fabrication.',
      briefingSw:
        'Mitungi imefungwa. Arrestors ni lazima. Jaribu uvujaji kwa soap, si moto. Tack kisha kagua square kabla ya weld kamili. Distortion inadhibitiwa na mpangilio.',
      questions: [
        {
          prompt: 'You smell acetylene and a hose fitting feels icy. You should:',
          options: [
            'Light a match to find the leak',
            'Shut cylinders, keep ignition away, ventilate, and leak-test with solution — never flame',
            'Increase pressure to blow it clear',
            'Ignore it if the cut still looks shiny',
          ],
          correct: 'b',
          hint: 'Gas plus spark.',
          explanation: 'Flame tests have caused workshop explosions.',
        },
        {
          prompt: 'Flashback arrestors are fitted to:',
          options: ['The helmet', 'Stop a flame travelling back into hoses/regulators', 'Hold drawings', 'Cool the workpiece only'],
          correct: 'b',
          hint: 'They are safety devices on the gas train.',
          explanation: 'Missing arrestors are a serious non-compliance.',
        },
        {
          prompt: 'To keep a frame square during welding you should:',
          options: [
            'Weld one corner fully first every time',
            'Tack, measure diagonals, then use a balanced welding sequence',
            'Hammer it after painting',
            'Skip tacks',
          ],
          correct: 'b',
          hint: 'Diagonals equal means square.',
          explanation: 'Sequence fights shrinkage. Tacks let you correct before heat locks the error.',
        },
        {
          prompt: 'Acetylene cylinders in the workshop should be:',
          options: ['On their side under a bench', 'Upright, secured, away from heat and oil', 'Inside the electrode oven', 'Used as rollers'],
          correct: 'b',
          hint: 'Acetone and valves.',
          explanation: 'Upright and chained is the basic rule.',
        },
      ],
      blanks: [
        {
          prompt: 'Checking joints with soapy water instead of a flame is a ___ test.',
          answer: 'leak',
          hint: 'You are looking for bubbles.',
          explanation: 'Leak testing is mandatory before lighting up.',
        },
      ],
      practice: {
        prompt: 'A trainee wants to free a stuck oxygen regulator with oil. What do you say?',
        options: [
          'Oil makes oxygen friendly',
          'Stop — oil/grease plus oxygen is a fire/explosion risk; use approved procedures only',
          'Heat the cylinder with the torch',
          'Hit the gauge with a chipping hammer',
        ],
        correct: 'b',
        hint: 'Oxygen and hydrocarbons.',
        explanation: 'Oxygen equipment stays oil-free. This is a classic fatal error.',
      },
    },
    {
      slug: 'mig',
      title: 'Week 5 — GMAW / MIG: gas, wire, and set-up',
      titleSw: 'Wiki 5 — GMAW/MIG: gesi, waya, na set-up',
      description: 'Solid wire, shielding gas, voltage and wire-feed — CDACC GMAW core after MMA.',
      minutes: 28,
      cdacc: 'CU/WEL/CR/05/5',
      examDomain: 'GMAW / MIG',
      media: [{ kind: 'animation', preset: 'weld', caption: 'MIG: wire is the electrode; gas shields the puddle.' }],
      briefing:
        'CDACC welding Level 5 includes GMAW (MIG) as a core separate from MMA. The electrode is a continuously fed solid wire. Shielding gas (often CO₂ or Ar/CO₂ mix for steel — follow the WPS) displaces air so the puddle does not nitride and porosity. No gas, or a blocked nozzle, looks like a “bad machine”. Clean the nozzle and contact tip; a fused tip is a feed fault, not a new inverter.\n\nSet voltage (or “trim”) and wire-speed together. Too little heat: ropey, lack of fusion. Too much: burn-through on thin sheet. Stick-out (contact tip to work) is typically about 10–15 mm as taught — long stick-out cools the arc and increases spatter. Earth clamp on clean metal, same as MMA. Push (forehand) for flatter beads on many steel fillets; drag if the WPS says so for a given transfer mode.\n\nTransfer modes you should name: short-circuit (thin sheet, more spatter), globular, spray (needs enough current and usually argon-rich mix). Do not run spray on 1 mm sheet. PPE still includes a filter; MIG is an arc. Spats burn through synthetic shirts — leather or flame-resistant cotton.\n\nPractical: fillet on 6 mm, then a butt on 2–3 mm with backing as specified. Assessors mark gas on before the strike, and a bead that fuses both toes.',
      briefingSw:
        'MIG ni waya endelevu na gesi ya kinga. Nozzle safi. Voltage na wire-speed pamoja. Stick-out ~10–15 mm. Short-circuit kwa sheet; spray kwa sasa kubwa. PPE bado. Gesi iwe ON kabla ya arc.',
      questions: [
        {
          prompt: 'Porosity in a MIG bead with the gas cylinder closed is primarily:',
          options: ['Too much grinding', 'Loss of shielding — air in the puddle', 'Correct spray transfer', 'A good earth'],
          correct: 'b',
          hint: 'Shielding.',
          explanation: 'Open the cylinder, check flow, leaks, and wind. MIG outdoors needs screens.',
        },
        {
          prompt: 'Contact-tip to work distance that is much too long typically:',
          options: ['Improves fusion always', 'Raises resistance, cools the arc, increases spatter', 'Replaces gas', 'Sharpens the wire'],
          correct: 'b',
          hint: 'Stick-out.',
          explanation: 'Hold the taught stick-out. Resting the nozzle off the job changes everything.',
        },
        {
          prompt: 'Short-circuit transfer is chosen mainly for:',
          options: ['Heavy spray on 20 mm plate only', 'Thinner material and positional work at lower heat', 'Oxy-fuel only', 'TIG tungsten'],
          correct: 'b',
          hint: 'Heat input.',
          explanation: 'Spray needs current and usually a different mix. Know which mode you are in.',
        },
        {
          prompt: 'A fused contact tip and bird-nested wire in the liner means:',
          options: ['Buy a new welder first', 'Clear the liner, replace the tip, check drive-roll tension and liner length', 'Increase gas to 50 L/min', 'Remove the earth'],
          correct: 'b',
          hint: 'Feed path.',
          explanation: 'Bird-nesting is mechanical. Forcing the trigger makes it worse.',
        },
      ],
      blanks: [
        {
          prompt: 'GMAW on steel commonly uses a shielding ___ such as CO₂ or an Ar/CO₂ mix.',
          answer: 'gas',
          hint: 'Not flux in basic solid-wire MIG.',
          explanation: 'FCAW is the flux-cored cousin. Do not mix the names in the oral.',
        },
      ],
      practice: {
        prompt: 'Trainee MIG-welds 1.2 mm sheet on spray-transfer settings copied from a 10 mm demo. Result?',
        options: [
          'Perfect cosmetic beads',
          'Likely burn-through — drop to short-circuit / lower heat and a suitable WPS for thin sheet',
          'Stronger than the plate always',
          'Gas becomes optional'],
        correct: 'b',
        hint: 'Heat versus thickness.',
        explanation: 'GMAW is a set-up competence, not one-knob-fits-all.',
      },
    },
    {
      slug: 'tig',
      title: 'Week 6 — GTAW / TIG: tungsten, gas, and cleanliness',
      titleSw: 'Wiki 6 — TIG: tungsten, gesi, na usafi',
      description: 'TIG for stainless and thin work: argon, electrode grind, and filler timing.',
      minutes: 28,
      cdacc: 'CU/WEL/CR/06/5',
      examDomain: 'GTAW / TIG',
      briefing:
        'TIG (GTAW) is a CDACC core because stainless tanks, food plant, and thin aluminium (where taught) need a clean, controllable arc. The tungsten is not consumed as filler — you add a separate rod. Shielding is usually argon. Contaminated tungsten (dipped in the puddle) is reground; a dirty tip wanders and spatters tungsten inclusions into the weld — a test fail.\n\nGrind tungsten along its length (not across) to a point for DC on steel/stainless; AC on aluminium uses a different balance/blob as taught. Polarity: DCEN (electrode negative) is common for steel TIG. Gas post-flow protects the cooling tungsten and the crater. No post-flow = oxidised tip and a sugared stainless root.\n\nCleanliness is the process: stainless brushed with a stainless-only brush, joints degreased, no mill scale if the WPS forbids it. Filler is added to the leading edge of the puddle, not stabbed through the arc onto cold metal. Foot pedal or torch amp control lets you taper out to avoid a crater crack.\n\nPPE: TIG is still UV. Thin gloves for dexterity but cover skin. Practical: autogenous fusion on stainless sheet, then a fillet with filler. Assessors watch gas pre-flow and a shiny, not black, stainless face.',
      briefingSw:
        'Tungsten si filler — ongeza fimbo. Argon. Kama tungsten ichafuliwa, saga upya. DCEN kwa chuma. Post-flow. Stainless brush tofauti. Usichome crater. Uso wa stainless uwe shiny.',
      questions: [
        {
          prompt: 'If the tungsten touches the puddle you should:',
          options: ['Keep welding to burn it clean', 'Stop, break off/regrind the tungsten, clean the weld as specified', 'Increase oxygen', 'Switch to oil on the regulator'],
          correct: 'b',
          hint: 'Inclusions.',
          explanation: 'Tungsten in the weld is a defect. Restart with a clean electrode.',
        },
        {
          prompt: 'Stainless TIG that is black and sugared on the root often lacked:',
          options: ['Enough mill scale', 'Argon coverage / purge / post-flow as specified', 'Water on the joint', 'A bigger earth on painted steel only'],
          correct: 'b',
          hint: 'Oxidation.',
          explanation: 'Stainless needs gas on both sides for sanitary work. Follow the WPS.',
        },
        {
          prompt: 'Tungsten is ground:',
          options: ['Across the diameter like a match', 'Lengthwise to a concentric point (for DC) as taught', 'With oily shop rags', 'Never — factory balls only always'],
          correct: 'b',
          hint: 'Along the axis.',
          explanation: 'Cross-grinding makes the arc wander.',
        },
        {
          prompt: 'TIG filler metal should be:',
          options: ['The same as MIG drive rolls', 'A matching specified rod, kept clean, dipped into the puddle not the tungsten', 'Any rusty rebar', 'Oil-coated electrode stubs'],
          correct: 'b',
          hint: 'Separate rod.',
          explanation: 'Contaminated filler becomes porosity and inclusions.',
        },
      ],
      blanks: [
        {
          prompt: 'GTAW is commonly called ___ welding in the workshop.',
          answer: 'TIG',
          hint: 'Tungsten Inert Gas.',
          explanation: 'GTAW is the process name; TIG is the shop name. Both appear in papers.',
        },
      ],
      practice: {
        prompt: 'Food-plant stainless pipe, no purge, trainee TIG-welds from one side. Inspector sees black root. Your call?',
        options: [
          'Paint it silver',
          'Reject: purge/backing gas as specified, cut out, re-weld to procedure',
          'It is only cosmetic',
          'Switch to MMA 6013 inside the pipe'],
        correct: 'b',
        hint: 'Sanitary stainless.',
        explanation: 'TIG competence includes gas backing where the WPS and hygiene require it.',
      },
    },
    {
      slug: 'weld-test',
      title: 'Week 7 — Weld testing: visual, bend, and when NDT is required',
      titleSw: 'Wiki 7 — Majaribio ya weld',
      description: 'Visual acceptance, nick-break or bend as taught, and why cracks are never “just painted”.',
      minutes: 28,
      cdacc: 'CU/WEL/CR/07/5',
      examDomain: 'Weld testing',
      briefing:
        'Weld testing is a CDACC core (visual plus mechanical/NDT introduction). Start with visual: size, profile, undercut, overlap, porosity, slag, incomplete fusion, cracks, and spatter. Use a fillet gauge. A pretty ripple with undercut at the toe fails. Lighting and slag fully chipped — you cannot inspect through slag.\n\nDestructive tests in college: nick-break, face/root bend, and sometimes a macro etch. Bends reveal lack of fusion that visual missed. Non-destructive: dye penetrant (surface cracks), MPI on ferritic steel, and ultrasonics/radiography in industry. You will not run a gamma source without a licence; you must know when to call that test.\n\nAcceptance is against a code or the college WPS, not against “it held my weight”. Repair: grind to sound metal, re-weld, re-test. Peening cracks closed or filling with silicone is malpractice.\n\nPortfolio: a visual report with sketches, a bend result, and a sentence on why a cracked tandem-trailer hitch must not leave the bay. That is professional welding, not hobby art.',
      briefingSw:
        'Visual: ukubwa, undercut, porosity, nyufa. Fillet gauge. Bend/nick-break vinaonyesha fusion. Dye penetrant. Usipake rangi juu ya crack. Rekodi majaribio.',
      questions: [
        {
          prompt: 'Undercut is:',
          options: ['Extra reinforcement', 'A groove melted into the parent at the toe, reducing thickness', 'A type of gas', 'Always acceptable'],
          correct: 'b',
          hint: 'Toe groove.',
          explanation: 'It is a stress raiser. Depth limits are in the spec.',
        },
        {
          prompt: 'A root bend that opens along the fusion line indicates:',
          options: ['Perfect procedure', 'Likely lack of fusion / incomplete penetration', 'Too much slag colour', 'Correct flashback arrestors'],
          correct: 'b',
          hint: 'Destructive test.',
          explanation: 'Visual passed; the bend did not. That is why testing exists.',
        },
        {
          prompt: 'Dye penetrant testing is suited to:',
          options: ['Buried volumetric flaws only', 'Surface-breaking defects on suitable materials', 'Measuring voltage', 'Replacing visual entirely'],
          correct: 'b',
          hint: 'Surface.',
          explanation: 'Clean, apply penetrant, dwell, remove, developer, inspect. Follow the kit.',
        },
        {
          prompt: 'Painting over a visible crack on a lifting eye is:',
          options: ['Industry standard', 'Dangerous concealment — repair or reject to procedure', 'A type of NDT', 'Required before bend tests'],
          correct: 'b',
          hint: 'Safety critical.',
          explanation: 'Testing without honesty is worse than no testing.',
        },
      ],
      blanks: [
        {
          prompt: 'Checking a fillet size with a purpose-made gauge is a ___ inspection.',
          answer: 'visual',
          hint: 'VT.',
          explanation: 'Visual testing is still NDT. Do it first, every time.',
        },
      ],
      practice: {
        prompt: 'School gate welds pass a 10-second glance. A bend test from a coupon of the same WPS splits. You should:',
        options: [
          'Ship the gate — coupons are theory',
          'Hold the job: investigate procedure, repair, and re-qualify as the instructor requires',
          'Add more paint',
          'Switch off the extractor'],
        correct: 'b',
        hint: 'Test represents the work.',
        explanation: 'CDACC weld testing is how fabrication earns the stamp, not how it earns a selfie.',
      },
    },
  ],
};

export const refrigerationProgramme: TradeProgramme = {
  id: 'refrigeration',
  title: 'Refrigeration & air conditioning',
  titleSw: 'Ufundi wa friji na AC',
  description: 'Cooling cycle, recovery law, leak finding, and charge — not guesswork topping-up.',
  descriptionSw: 'Mzunguko wa baridi, recovery, uvujaji, na charge sahihi.',
  icon: '❄️',
  modules: [
    {
      slug: 'cycle',
      title: 'Vapour-compression cycle and components',
      titleSw: 'Mzunguko wa vapour-compression',
      description: 'Compressor, condenser, expansion device, evaporator — and what each does to pressure and heat.',
      minutes: 18,
      cdacc: 'CU/RAC/CR/01/5',
      examDomain: 'Cooling cycle',
      briefing:
        'Almost every fridge and split AC you service uses the vapour-compression cycle. The compressor raises pressure and temperature of the vapour. The condenser rejects heat so the refrigerant becomes liquid. The expansion device (capillary or TXV) drops pressure. The evaporator absorbs heat as liquid boils at low pressure. If you cannot point to those four on a domestic fridge, you are not diagnosing — you are guessing.\n\nHigh-side vs low-side: gauges, pipe temperatures, and frost patterns tell a story. Ice on the evaporator with a warm cabinet can be airflow, defrost, or charge — not “always add gas”. The thermostat stops the compressor; it does not fix a leak.\n\nElectrical isolation still applies: unplug, discharge capacitors as trained, and do not short a thermostat with a nail to “test cooling”.',
      briefingSw:
        'Compressor inainua shinikizo. Condenser inatoa joto. Expansion inashusha shinikizo. Evaporator inachukua joto. Usiweke gesi bila kuelewa mzunguko. Zima umeme kabla ya kufungua unit.',
      questions: [
        {
          prompt: 'Which component raises refrigerant pressure and temperature?',
          options: ['Evaporator fan only', 'Compressor', 'Drain pipe', 'Room thermostat plastic'],
          correct: 'b',
          hint: 'The pump of the cycle.',
          explanation: 'The compressor compresses vapour; the condenser then rejects heat.',
        },
        {
          prompt: 'Heat is rejected to the room (or outside air) mainly at the:',
          options: ['Evaporator', 'Condenser', 'Suction filter drier only', 'Door gasket'],
          correct: 'b',
          hint: 'The hot component.',
          explanation: 'Condenser heat rejection is why the back of a fridge is warm.',
        },
        {
          prompt: 'A capillary tube is a type of:',
          options: ['Compressor oil', 'Expansion device', 'Condenser fan blade', 'Electrical earth'],
          correct: 'b',
          hint: 'It meters liquid to the evaporator.',
          explanation: 'Restriction drops pressure so boiling can happen in the evaporator.',
        },
        {
          prompt: 'To service a packaged unit electrically you first:',
          options: ['Bypass every safety', 'Isolate power and prove dead as for any appliance', 'Hold the live to feel current', 'Ground the compressor shell to the water pipe randomly'],
          correct: 'b',
          hint: 'RAC is also electrical work.',
          explanation: 'Capacitors store charge. Isolation is not optional.',
        },
      ],
      blanks: [
        {
          prompt: 'The component that absorbs heat from the cabinet as refrigerant boils is the ___.',
          answer: 'evaporator',
          hint: 'It is the cold heat exchanger.',
          explanation: 'No airflow over a dirty evaporator means poor cooling even with a full charge.',
        },
      ],
      practice: {
        prompt: 'A fridge ices heavily at the back wall but the cabinet is warm. A trainee reaches for a gas cylinder. What should happen?',
        options: [
          'Add gas until the pipe sweats',
          'Check airflow, defrost, leaks, and evidence before any charge',
          'Pierce the pipe to listen',
          'Pour water on the compressor',
        ],
        correct: 'b',
        hint: 'Symptom is not a procedure.',
        explanation: 'Blind topping-up hides leaks and overcharges. Diagnose first.',
      },
    },
    {
      slug: 'recovery',
      title: 'Refrigerant law, recovery, and nitrogen',
      titleSw: 'Sheria ya gesi, recovery, na nitrogen',
      description: 'Do not vent. Recover. Pressure-test with nitrogen, not oxygen.',
      minutes: 18,
      cdacc: 'CU/RAC/CR/02/5',
      examDomain: 'Environment & safety',
      briefing:
        'Venting refrigerant to air is environmentally harmful and may be illegal. Recover into a proper cylinder with recovery equipment. Label cylinders. Mixing refrigerants in one bottle is a later technician’s nightmare.\n\nPressure tests use dry nitrogen, never oxygen or compressed air from an oily workshop compressor. Oxygen plus oil in a system is an explosion risk. Use a regulator and know the test pressure from the manufacturer — do not “pump until it feels hard”.\n\nGoggles and gloves when opening systems. Liquid refrigerant on skin is a freeze burn. Evacuate to the required vacuum before charging; moisture plus refrigerant plus oil makes acids and sludge.\n\nSDS and cylinder colours: know what is in your hand. R600a (isobutane) in many domestic fridges is flammable — no smoking, no sparks, follow hydrocarbon procedures.',
      briefingSw:
        'Usitoe gesi hewani — fanya recovery. Jaribu shinikizo kwa nitrogen, si oxygen. Vacuum kabla ya charge. R600a ni kuwaka; fuata taratibu za hydrocarbon.',
      questions: [
        {
          prompt: 'Why recover refrigerant instead of releasing it?',
          options: [
            'It is slower',
            'Legal and environmental duty — many refrigerants harm climate and may be illegal to vent',
            'It makes ice cream freeze faster',
            'NITA requires open vents for luck',
          ],
          correct: 'b',
          hint: 'Climate and law.',
          explanation: 'Recovery is competent RAC practice, not optional kindness.',
        },
        {
          prompt: 'Systems should be strength/leak tested with:',
          options: ['Oxygen', 'Dry nitrogen (regulated)', 'Petrol vapour', 'Workshop air from an oily compressor'],
          correct: 'b',
          hint: 'Inert, dry.',
          explanation: 'Oxygen + oil is dangerous. Moisture in air is also unwelcome.',
        },
        {
          prompt: 'R600a in domestic cabinets is a concern because it is:',
          options: ['Always non-flammable', 'A hydrocarbon — flammable; needs spark-aware procedure', 'The same as water', 'Only used in cars'],
          correct: 'b',
          hint: 'Isobutane.',
          explanation: 'Treat HC systems as flammable. Charge masses are small but ignition is real.',
        },
        {
          prompt: 'A deep vacuum before charging is mainly to:',
          options: ['Paint the pipes', 'Remove air and moisture', 'Increase oil acidity on purpose', 'Cool the room'],
          correct: 'b',
          hint: 'Non-condensables and water.',
          explanation: 'Air raises head pressure; moisture damages the system chemically.',
        },
      ],
      blanks: [
        {
          prompt: 'Putting used refrigerant into a recovery cylinder instead of the atmosphere is called ___.',
          answer: 'recovery',
          hint: 'Opposite of venting.',
          explanation: 'Recovery, recycle, reclaim — know which your equipment actually does.',
        },
      ],
      practice: {
        prompt: 'A trainee wants to find a leak with a cigarette lighter on a hydrocarbon fridge. Your response?',
        options: [
          'Approve — flames show leaks',
          'Stop immediately; use approved leak detection, isolate ignition, follow HC rules',
          'Open all windows and still use the lighter',
          'Add oxygen to make the flame clearer',
        ],
        correct: 'b',
        hint: 'Fuel plus flame.',
        explanation: 'Electronic or bubble methods, not naked flames on HC systems.',
      },
    },
    {
      slug: 'service',
      title: 'Leak, charge, and performance checks',
      titleSw: 'Uvujaji, charge, na utendaji',
      description: 'Weigh-in charge, superheat/subcooling at craft level, and airflow.',
      minutes: 18,
      cdacc: 'CU/RAC/CR/03/5',
      examDomain: 'Service diagnosis',
      briefing:
        'Charge is a measured quantity, often by mass (weigh-in) on a capillary system, or by superheat/subcooling on TXV systems as you are taught. “Until the pipe ices” is not a method. Find and repair leaks, replace driers when the system has been open, evacuate, then charge.\n\nAirflow is half of refrigeration. A blocked condenser (dust, cow hair, butcher-shop grease) raises head pressure and trips overloads. A blocked evaporator ices. Clean, straighten fins, check fans, then talk about gas.\n\nAfter service: cabinet temperature vs spec, no abnormal noise, no ice where it should not be, electrical covers back, and a record of refrigerant type and mass. That record is professional, and it protects the next person.',
      briefingSw:
        'Charge ni uzito au superheat/subcooling, si “hadi barafu”. Rekodi uvujaji. Safisha condenser na evaporator. Weka kumbukumbu ya aina na kiasi cha gesi.',
      questions: [
        {
          prompt: 'The professional way to charge many capillary domestic systems is:',
          options: ['Guess from hissing', 'Weigh in the specified mass after vacuum', 'Fill until the compressor is silent', 'Use oxygen to push liquid'],
          correct: 'b',
          hint: 'The nameplate has grams.',
          explanation: 'Overcharge is as bad as undercharge.',
        },
        {
          prompt: 'A filthy condenser typically causes:',
          options: ['Lower energy use', 'High head pressure and poor cooling / trips', 'Freezing of the compressor oil into ice cubes', 'Automatic leak repair'],
          correct: 'b',
          hint: 'Heat must leave the cycle.',
          explanation: 'Clean heat exchangers before you condemn compressors.',
        },
        {
          prompt: 'After opening a system you often replace the:',
          options: ['Door colour', 'Filter-drier', 'Serial plate', 'Owner’s manual only'],
          correct: 'b',
          hint: 'Moisture protection.',
          explanation: 'Driers are cheap compared with acid and burnout.',
        },
        {
          prompt: 'Service records should include:',
          options: ['Only the trainee’s nickname', 'Refrigerant type, quantity, and work done', 'The customer’s M-Pesa PIN', 'Nothing, to stay fast'],
          correct: 'b',
          hint: 'Traceability.',
          explanation: 'The next technician and the law both like records.',
        },
      ],
      blanks: [
        {
          prompt: 'Charging by reading a scale under the cylinder is called a ___-in charge.',
          answer: 'weigh',
          hint: 'Mass, not vibes.',
          explanation: 'Weigh-in is standard on many factory-charged capillary units.',
        },
      ],
      practice: {
        prompt: 'Split AC cools one room weakly. Outdoor unit is packed with lint. Trainee wants to add 2 kg of mixed leftover gas. What do you do?',
        options: [
          'Add the mix',
          'Clean airflow path, confirm type, leak-check, then charge only the specified refrigerant to spec',
          'Swap indoor and outdoor pipes randomly',
          'Bypass the high-pressure switch permanently',
        ],
        correct: 'b',
        hint: 'Airflow then refrigerant identity.',
        explanation: 'Mixed leftovers are not a refrigerant. Dirty condensers fake a “low gas” story.',
      },
    },
  ],
};

export const bodyWorksProgramme: TradeProgramme = {
  id: 'body-works',
  title: 'Motor vehicle body works',
  titleSw: 'Kukarabati mwili wa gari',
  description: 'Panel prep, filler, and spray-booth safety for body repair craft.',
  descriptionSw: 'Maandalizi ya panel, filler, na usalama wa rangi.',
  icon: '🚐',
  modules: [
    {
      slug: 'prep',
      title: 'Panel beating, cleanliness, and filler',
      titleSw: 'Panel beating, usafi, na filler',
      description: 'Metal finish first. Filler is thin layers on keyed, degreased metal.',
      minutes: 18,
      cdacc: 'CU/ABR/CR/01/5',
      examDomain: 'Metal & filler',
      briefing:
        'Body repair is metalwork before chemistry. Knock and file to get the panel close. Filler is for skim, not to rebuild a wing in one lump. Degrease with the specified solvent, abrade (key) the surface, and apply filler in thin layers, allowing cure. Thick filler cracks and sinks.\n\nGuide coat shows hollows when you sand. Work through grits as taught so scratches are finer than the next paint layer will hide. Bare metal needs the right primer — not random emulsion from the building store.\n\nDust from sanding is a lung hazard. Extraction, mask, and housekeeping beat sweeping clouds onto the next car.',
      briefingSw:
        'Rekebisha chuma kwanza. Filler ni tabaka nyembamba kwenye uso uliosafishwa na kuabrade. Guide coat inaonyesha mashimo. Vumbi linahitaji mask na extraction.',
      questions: [
        {
          prompt: 'Before body filler, metal should be:',
          options: ['Oily so filler slides', 'Clean, dry, and keyed as specified', 'Painted with bitumen', 'Soaking wet'],
          correct: 'b',
          hint: 'Adhesion.',
          explanation: 'Contamination causes lifting. Prep is most of the job.',
        },
        {
          prompt: 'Thick single-application filler often:',
          options: ['Stays flexible forever', 'Cracks, sinks, or pinholes', 'Replaces welding always', 'Cures without hardener'],
          correct: 'b',
          hint: 'Thin layers.',
          explanation: 'Build in coats. Follow mixing ratio of filler to hardener.',
        },
        {
          prompt: 'A guide coat is used to:',
          options: ['Colour the customer’s house', 'Reveal remaining high and low spots while sanding', 'Lubricate the file', 'Replace primer'],
          correct: 'b',
          hint: 'See the shape.',
          explanation: 'Dark dust in scratches/lows tells you where to work.',
        },
        {
          prompt: 'Sanding dust should be:',
          options: ['Blown into the canteen', 'Extracted and the operator masked to the grit/chemical risk', 'Eaten for calcium', 'Ignored on 2K jobs only'],
          correct: 'b',
          hint: 'Lungs.',
          explanation: 'Body filler and paint dust are occupational hazards.',
        },
      ],
      blanks: [
        {
          prompt: 'Abrading a surface so the next coat can grip is called giving it a ___.',
          answer: 'key',
          hint: 'Also “mechanical key”.',
          explanation: 'Smooth glossy paint is a poor base without a key.',
        },
      ],
      practice: {
        prompt: 'Filler mixed with too little hardener is still tacky after the slot time. Trainee adds a handful more powder. What is correct?',
        options: [
          'Keep adding random powder',
          'Discard, remix to the specified ratio, and check workshop temperature',
          'Heat with a cutting torch',
          'Paint over tacky filler',
        ],
        correct: 'b',
        hint: 'Ratio is chemistry.',
        explanation: 'Wrong mix never “catches up”. Scrap it.',
      },
    },
    {
      slug: 'paint',
      title: 'Masking, primer, and spray-booth rules',
      titleSw: 'Masking, primer, na booth',
      description: '2K vapour needs a real respirator and a booth — not a cloth mask by the welder.',
      minutes: 18,
      cdacc: 'CU/ABR/CR/02/5',
      examDomain: 'Paint safety',
      briefing:
        'Isocyanate 2K paints need a specified respirator and booth practice. A dust mask is for dust, not vapour. Read the SDS. Mix by ratio, strain, and apply flash-off times. Mask adjacent panels properly; overspray on glass and rubber is extra labour.\n\nDegrease before primer, and do not touch the keyed surface with bare oily hands. Build coats. Runs mean too much material or too close a gun.\n\nThinners are hazardous waste, not sink waste. Gun wash in the dedicated equipment. No smoking, no grinding next to wet paint.',
      briefingSw:
        'Rangi ya 2K inahitaji respirator na booth. Soma SDS. Mask panels. Degrease kabla ya primer. Thinners si maji ya kuzama.',
      questions: [
        {
          prompt: 'Why is a dust mask often inadequate for 2K spraying?',
          options: [
            'Wrong colour',
            'Vapours (e.g. isocyanates) need a specified respirator and booth',
            'NITA bans all spray',
            'Cars do not need primer',
          ],
          correct: 'b',
          hint: 'Vapour vs dust.',
          explanation: 'Follow SDS and college booth rules.',
        },
        {
          prompt: 'Runs in paint usually mean:',
          options: ['Too little material', 'Too much material, too close, or insufficient flash-off', 'Perfect technique', 'The compressor is too dry'],
          correct: 'b',
          hint: 'Film thickness.',
          explanation: 'Gun distance, speed, and coats are a skill, not luck.',
        },
        {
          prompt: 'Used thinners should go:',
          options: ['Down the rainwater gully', 'Into labelled hazardous-waste containers as instructed', 'Into the tea urn', 'On the canteen floor for shine'],
          correct: 'b',
          hint: 'Environment and fire.',
          explanation: 'Solvents are controlled waste.',
        },
        {
          prompt: 'Touching a degreased panel with bare hands:',
          options: ['Improves adhesion', 'Can deposit oil that causes fish-eyes or poor bond', 'Is required by NITA', 'Replaces masking'],
          correct: 'b',
          hint: 'Skin oil.',
          explanation: 'Handle edges or wear gloves after degrease.',
        },
      ],
      blanks: [
        {
          prompt: 'The enclosed extracted room used for spraying is the spray ___.',
          answer: 'booth',
          hint: 'Not the welding bay.',
          explanation: 'Booths control overspray, fire, and exposure.',
        },
      ],
      practice: {
        prompt: 'A trainee wants to spray in the open workshop next to the welding bay “to save time”. You say:',
        options: [
          'Approve — overspray helps rust',
          'Stop: fire, fume, and contamination; use the booth and isolate ignition sources',
          'Turn on grinders for airflow',
          'Spray toward the stores',
        ],
        correct: 'b',
        hint: 'Sparks plus solvent vapour.',
        explanation: 'Hot work and spraying are separated for a reason.',
      },
    },
    {
      slug: 'finish',
      title: 'Flatting, polish, and handing back the job',
      titleSw: 'Flatting, polish, na kukabidhi kazi',
      description: 'De-nib, polish, refit trim, and inspect in good light.',
      minutes: 16,
      cdacc: 'CU/ABR/CR/03/5',
      examDomain: 'Finishing & QC',
      briefing:
        'After cure, de-nib dust inclusions with fine grit, then polish as specified. Do not cut through edges — paint is thin on lines. Refit lights, mouldings, and tapes without scratching the new film.\n\nInspect in north light or a booth lamp: miss, dry spray, sinkage over filler, and unmatched colour (blend if the spec says). Clean the interior of dust. Torque bumper bolts to sense, not until they strip.\n\nCustomer handover: explain stone-chip care and curing time before a car-wash. Industry loses money on comebacks, not on an extra ten minutes of inspection.',
      briefingSw:
        'Baada ya kukauka, de-nib na polish. Usikate kingo. Kagua rangi na filler sinkage. Kabidhi kazi baada ya usafi na maelezo ya curing.',
      questions: [
        {
          prompt: 'Polishing through an edge happens because:',
          options: ['Edges have extra paint always', 'Paint films are thinner on edges; too much cut burns through', 'Polish is only water', 'NITA requires burn-through'],
          correct: 'b',
          hint: 'Be gentle on lines.',
          explanation: 'Tape or light pressure on edges.',
        },
        {
          prompt: 'Sinkage over filler a day later usually means:',
          options: ['The colour code was lucky', 'Filler or primer not cured/filled properly before colour', 'Too much wax on day one is required', 'The compressor nameplate is wrong'],
          correct: 'b',
          hint: 'Prep shows through later.',
          explanation: 'Rushing filler to colour is a classic comeback.',
        },
        {
          prompt: 'Before handing back you should:',
          options: ['Leave masking on as a gift', 'Inspect, clean, refit, and brief the owner on cure time', 'Wash with thinners', 'Park under a grinder'],
          correct: 'b',
          hint: 'Complete job.',
          explanation: 'Unfinished refit is unfinished repair.',
        },
        {
          prompt: 'Colour mismatch on a wing is often reduced by:',
          options: ['Painting only a 2 cm spot in the middle', 'Blending into adjacent panels as specified', 'Using any leftover green', 'Clear coat only on the badge'],
          correct: 'b',
          hint: 'Blend.',
          explanation: 'Spot repairs that do not blend show as a patch.',
        },
      ],
      blanks: [
        {
          prompt: 'Removing tiny dust bits from a cured film with fine abrasive is called de-___.',
          answer: 'nib',
          hint: 'Nibs are dust pimples.',
          explanation: 'De-nib then polish, do not wet-sand through colour.',
        },
      ],
      practice: {
        prompt: 'Owner wants a machine wash one hour after 2K clear. You should:',
        options: [
          'Agree — clear is glass',
          'Explain cure time; early wash can mark the film',
          'Sand the whole car as a courtesy',
          'Spray more thinners as wax',
        ],
        correct: 'b',
        hint: 'Chemistry needs time.',
        explanation: 'Handover includes aftercare. That is part of the trade.',
      },
    },
  ],
};
