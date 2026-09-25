import type { TradeProgramme } from './build';

export const electricalProgramme: TradeProgramme = {
  id: 'electrical-installation',
  title: 'Electrical installation',
  titleSw: 'Ufungaji wa umeme',
  description:
    'Semester-style electrical installation: safe isolation, planning and load estimation (IEE), earthing, circuits, inspection and testing, then maintenance and breakdowns — CDACC electrical cores.',
  descriptionSw:
    'Mtaala wa semester: isolation, kupanga mzigo, earthing, circuits, majaribio, kisha matengenezo.',
  icon: '⚡',
  modules: [
    {
      slug: 'isolation',
      title: 'Safe isolation and proving dead',
      titleSw: 'Isolation salama na kuthibitisha kifo cha current',
      description: 'Isolate, lock, test the tester, test the circuit, test the tester again.',
      minutes: 20,
      cdacc: 'CU/EIT/CR/01/5',
      examDomain: 'Safe isolation',
      media: [{ kind: 'animation', preset: 'wave', caption: 'Live — dead — live. Never skip the proving unit.' }],
      briefing:
        'Treat every circuit as live until you prove it dead. The sequence taught in competent installation practice is: identify, isolate, lock/tag, test your tester on a known live source (or proving unit), test the circuit conductors, then test the tester again. A dead lamp on a tester with a flat battery has killed people.\n\nThe consumer unit is not a junk drawer. Stand on dry footing, use insulated tools, and do not lean on earth pipes. Remove loads, then isolate. Single-pole isolation of a circuit that still has a borrowed neutral is a trap — understand the wiring before you trust a switch.\n\nPermits and college lock-out boards exist because “I thought it was off” is not a defence. If you cannot lock, you must still control the device and put a warning. Never use the installation’s own socket as the only proof that your tester works while you are already inside the CU.\n\nFirst aid: you do not become the second casualty. Isolate, then help. That order is part of the unit.',
      briefingSw:
        'Chukulia waya kuwa hai. Isolate, funga, jaribu tester, jaribu circuit, jaribu tester tena. Usitumie tester na betri mbovu. Elewa neutral. Usijaribu kuokoa mtu kabla ya kuzima umeme.',
      questions: [
        {
          prompt: 'What is the first action before opening a consumer unit for work?',
          options: [
            'Tighten every screw you see',
            'Isolate the supply and prove dead with a proving unit / known live source',
            'Stand in water for better earth',
            'Remove the earth first',
          ],
          correct: 'b',
          hint: 'Safe isolation sequence.',
          explanation: 'Proving dead prevents electrocution. Never use the circuit itself as the only proof that the tester works.',
        },
        {
          prompt: 'Why test the tester before and after proving a circuit dead?',
          options: [
            'To waste time',
            'A failed tester can read dead on a live conductor',
            'NITA requires three testers',
            'It charges the MCB',
          ],
          correct: 'b',
          hint: 'Live-dead-live.',
          explanation: 'The proving unit (or known live) confirms the instrument still works.',
        },
        {
          prompt: 'Working on a circuit with only a sticky note on the main switch is risky because:',
          options: [
            'Paper is recyclable',
            'Someone can re-energise the board while you are on the conductors',
            'Sticky notes improve isolation',
            'MCBs dislike ink',
          ],
          correct: 'b',
          hint: 'Lock and tag.',
          explanation: 'Control of the isolating device is the point of lock-out.',
        },
        {
          prompt: 'If a person is still in contact with a live part you should first:',
          options: [
            'Pull them with both wet hands',
            'Isolate the supply, then give first aid',
            'Pour water on both of you',
            'Take a photo for the incident book',
          ],
          correct: 'b',
          hint: 'Do not become casualty two.',
          explanation: 'Break the circuit, then help.',
        },
      ],
      blanks: [
        {
          prompt: 'The live-dead-live method is also called ___ dead.',
          answer: 'proving',
          hint: 'You prove the circuit is not live.',
          explanation: 'Proving dead is a scored practical.',
        },
      ],
      practice: {
        prompt: 'Your voltage tester shows 0 V on a circuit. You did not check the tester on a proving unit first. What is correct?',
        options: [
          'Start work — zero is zero',
          'Stop, prove the instrument, then re-test the circuit; do not trust an unproven 0 V',
          'Lick the conductor to confirm',
          'Tighten the MCB and assume',
        ],
        correct: 'b',
        hint: 'Unproven zero is meaningless.',
        explanation: 'This is the classic exam and mortuary scenario.',
      },
    },
    {
      slug: 'earthing',
      title: 'Earthing, bonding, and protective devices',
      titleSw: 'Earthing, bonding, na vifaa vya ulinzi',
      description: 'Earth is a fault path. Neutral is not a spare earth. MCBs and RCDs do different jobs.',
      minutes: 20,
      cdacc: 'CU/EIT/CR/02/5',
      examDomain: 'Protection',
      briefing:
        'The earth conductor exists so that a live-to-metal fault makes a large current (or an RCD imbalance) and the protective device disconnects. It is not a spare neutral. Combining earth and neutral incorrectly (wrong use of PEN, missing links, bootleg earths) is how cases stay live.\n\nKenya installations you meet may be TN-S, TN-C-S, or TT at the origin — follow the existing earthing arrangement and the spec; do not invent a mix. Main bonding of pipes and extra bonding in bathrooms follow the drawing and regulations you are taught.\n\nMCBs (or fuses) protect against overcurrent. RCDs protect against earth leakage / shock in many final circuits. An MCB will not always trip on a high-resistance earth fault that still can kill. That is why testing and correct device selection matter.\n\nNever “borrow” an earth from a neighbouring circuit’s sheath unless the design says so. Never disconnect earths to stop a nuisance trip without finding the fault.',
      briefingSw:
        'Earth ni njia ya fault, si neutral. MCB hulinda overcurrent; RCD hulinda uvujaji. Usichanganye earth na neutral. Usikate earth ili “kutuliza” trip.',
      questions: [
        {
          prompt: 'The earth wire exists primarily to:',
          options: [
            'Carry current in normal use like the live',
            'Provide a low-impedance path so protective devices disconnect on a fault',
            'Make the cable look thicker',
            'Power the doorbell only',
          ],
          correct: 'b',
          hint: 'Fault current needs a path.',
          explanation: 'Earthing lets the MCB/fuse/RCD clear a fault instead of leaving metalwork live.',
        },
        {
          prompt: 'An RCD is mainly intended to detect:',
          options: ['Overload on a cooker only', 'Imbalance between live and neutral (earth leakage)', 'Whether the bulb is LED', 'Wi-Fi strength'],
          correct: 'b',
          hint: 'Imbalance.',
          explanation: 'RCD ≠ MCB. They complement each other.',
        },
        {
          prompt: 'Using the water pipe as the only earth without a proper electrode/arrangement is:',
          options: ['Always excellent', 'Dangerous and non-compliant in modern practice', 'Required by all cookers', 'A type of MCB'],
          correct: 'b',
          hint: 'Plastic pipes, disconnection.',
          explanation: 'Bonding is not a substitute for a designed earth.',
        },
        {
          prompt: 'Nuisance RCD trips should be solved by:',
          options: ['Removing the earth', 'Insulation and leakage investigation, not defeating protection', 'Fitting a bigger fuse in the RCD', 'Wetting the CU'],
          correct: 'b',
          hint: 'Find the leak.',
          explanation: 'Defeating protection is how shocks happen later.',
        },
      ],
      blanks: [
        {
          prompt: 'A device that trips when live and neutral currents differ is an ___.',
          answer: 'RCD',
          hint: 'Residual Current Device. RCCB is also used.',
          explanation: 'RCD/RCCB detects imbalance. Store that abbreviation.',
        },
      ],
      practice: {
        prompt: 'A metal kettle case tingles. The socket earth pin is not connected. What is correct?',
        options: [
          'Tell the user to wear rubber shoes and continue',
          'Take the kettle out of service and restore the earth at socket and flex',
          'Swap live and neutral only',
          'Paint the kettle',
        ],
        correct: 'b',
        hint: 'Class I metal appliances need a working earth.',
        explanation: 'A missing earth on Class I gear is a serious defect. Isolate, tag, repair.',
      },
    },
    {
      slug: 'circuits',
      title: 'Final circuits, cables, and conduit',
      titleSw: 'Circuits, kebo, na conduit',
      description: 'Ring vs radial, grouping, PVC conduit, and not undersizing a cooker cable.',
      minutes: 20,
      cdacc: 'CU/EIT/CR/03/5',
      examDomain: 'Installation methods',
      briefing:
        'Final circuits are designed: load, length, grouping, insulation, and protective device. A 2.5 mm² radial or ring for sockets is common in examples you will meet — but you follow the drawing and calculation, not a rumour. Cooker and shower circuits are dedicated for a reason.\n\nRing final circuits need both legs continuous; a break turns them into two overloaded radials. Test continuity of ring (r1, rn, r2) as taught. Never spur a spur if the method forbids it.\n\nPVC conduit: cut square, deburr so insulation is not stripped, bend with a spring, and do not overfill. Draw wires with lubricant approved for PVC, not cooking oil. Leave draw wires in spare ways. Box entries must not have sharp edges.\n\nLabel circuits in the CU. The next electrician’s life depends on your marker pen.',
      briefingSw:
        'Fuata drawing. Ring lazima iwe complete. Conduit kata sawa, deburr, usijaze kupita kiasi. Andika majina ya circuits kwenye CU.',
      questions: [
        {
          prompt: 'A broken ring final circuit becomes:',
          options: ['Safer', 'Two radials that may be overloaded', 'An RCD', 'A bonding conductor'],
          correct: 'b',
          hint: 'Continuity of the ring.',
          explanation: 'That is why ring tests exist.',
        },
        {
          prompt: 'Conduit ends are deburred so that:',
          options: ['The paint sticks', 'Cable insulation is not cut when drawing in', 'Earth becomes live', 'MCBs trip faster'],
          correct: 'b',
          hint: 'Sharp PVC/metal cuts PVC insulation.',
          explanation: 'A sliced insulation is a future earth fault.',
        },
        {
          prompt: 'Why are showers often on their own circuit?',
          options: ['Fashion', 'High load and diversity — sharing with lights is a fire/nuisance risk', 'They need USB', 'NITA bans 1.5 mm² everywhere'],
          correct: 'b',
          hint: 'Load.',
          explanation: 'Design, not tradition alone.',
        },
        {
          prompt: 'Circuit schedules in the CU are for:',
          options: ['Decoration', 'Safe isolation and future work — identify the right device', 'Hiding spare MCBs', 'The painter'],
          correct: 'b',
          hint: 'Identify before isolate.',
          explanation: 'Unlabelled boards cause wrong isolation.',
        },
      ],
      blanks: [
        {
          prompt: 'A socket circuit that loops out and returns to the same MCB is a ___ final circuit.',
          answer: 'ring',
          hint: 'Opposite of radial.',
          explanation: 'Ring finals are tested for continuity of both legs.',
        },
      ],
      practice: {
        prompt: 'You find 1.0 mm² twin on a 32 A MCB feeding sockets in a kiosk. What do you do?',
        options: [
          'Leave it — it has worked two weeks',
          'Treat as a dangerous mismatch; isolate and report/redesign to spec',
          'Fit a 63 A MCB to help the cable',
          'Paint the cable yellow',
        ],
        correct: 'b',
        hint: 'Protective device must protect the cable.',
        explanation: 'Undersized conductors on big MCBs are fire starters.',
      },
    },
    {
      slug: 'testing',
      title: 'Inspection and testing basics',
      titleSw: 'Ukaguzi na majaribio',
      description: 'Continuity, insulation resistance, polarity, and RCD tests before energising.',
      minutes: 20,
      cdacc: 'CU/EIT/CR/04/5',
      examDomain: 'Inspection & testing',
      briefing:
        'Dead tests before live tests. Continuity of protective conductors (including bonding), insulation resistance (typically 500 V IR tester on many LV circuits — follow the instrument and standard you were taught), and polarity: live to the switch, not the other way round.\n\nA failed IR (low megohms) means moisture, damaged insulation, or connected equipment. Disconnect lamps and sensitive electronics as instructed before IR tests. Do not IR-test a circuit with a surge-protected socket still in, then blame the student meter.\n\nWhen the instructor allows live testing: earth-fault loop and RCD trip times are measured with the correct instrument. Record results on the schedule. A test not written down did not happen for assessment.\n\nNever energise an installation that failed dead tests. Paperwork is part of competence.',
      briefingSw:
        'Majaribio ya dead kwanza: continuity, insulation, polarity. Kisha live tests kwa ruhusa. Andika matokeo. Usitie umeme kama dead tests zimeshindwa.',
      questions: [
        {
          prompt: 'Insulation resistance tests are usually done:',
          options: ['After you hand the keys over, never before', 'As a dead test before energising', 'Only on the kettle', 'With a wet finger'],
          correct: 'b',
          hint: 'Dead before live.',
          explanation: 'IR on a live circuit is wrong practice.',
        },
        {
          prompt: 'Polarity on a lighting circuit means:',
          options: [
            'Earth is optional',
            'The switch breaks the live conductor, not only the neutral',
            'The lamp cap is painted',
            'MCB rating equals wattage',
          ],
          correct: 'b',
          hint: 'Switch in the live.',
          explanation: 'A switch in the neutral leaves the lampholder live when “off”.',
        },
        {
          prompt: 'Low IR might be caused by:',
          options: ['Perfect dry cables', 'Damp, damaged insulation, or connected electronic loads', 'Correct bonding only', 'Too many labels'],
          correct: 'b',
          hint: 'Paths to earth that should not exist.',
          explanation: 'Investigate; do not just raise the MCB.',
        },
        {
          prompt: 'Test results belong:',
          options: ['In your head', 'On the installation schedule / certificate as taught', 'On WhatsApp status', 'Only if they pass'],
          correct: 'b',
          hint: 'Evidence.',
          explanation: 'Failed results still get recorded, then defects repaired.',
        },
      ],
      blanks: [
        {
          prompt: 'Confirming that the switch is in the live conductor is a ___ test.',
          answer: 'polarity',
          hint: 'Live vs neutral the right way.',
          explanation: 'Polarity failures leave fittings live when switched off.',
        },
      ],
      practice: {
        prompt: 'IR reads 0.02 MΩ on a new lighting radial. Trainee wants to connect the supply because the lamps work on a test lead. You should:',
        options: [
          'Energise — lamps working is enough',
          'Treat as fail: isolate, disconnect loads, find the insulation fault before live',
          'Fit a larger MCB',
          'Earth the live to “clear” it',
        ],
        correct: 'b',
        hint: 'Working on a wander lead is not an IR pass.',
        explanation: '0.02 MΩ is a serious insulation failure.',
      },
    },
    {
      slug: 'plan',
      title: 'Week 5 — Plan the installation: survey, load, and drawings',
      titleSw: 'Wiki 5 — Panga ufungaji: survey, mzigo, na michoro',
      description: 'Site survey, load estimation, cable and protective-device sizing, permits, and a work plan — ENG/OS/EI/CR/01.',
      minutes: 28,
      cdacc: 'ENG/OS/EI/CR/01/6',
      examDomain: 'Plan electrical installation',
      briefing:
        'CDACC electrical cores begin with planning, not with a coil of twin-and-earth. Conduct a site survey: construction type, routes, existing supply capacity, and hazards (wet, flammable, overhead lines). Take measurements. Write a survey note the supervisor can use. “It looked fine” is not a survey.\n\nLoad estimation: list luminaires, sockets (diversified as taught), cookers, motors, and future spare. Size cables and protective devices to IEE/IEC practice as in your college tables — current-carrying capacity, voltage drop, and fault protection must all pass. An MCB bigger than the cable is a fire design. Record system sizes and share them.\n\nDrawings: obtain the design, produce a working drawing and a materials list (cables, accessories, glands, trunking). Logistics: access, storage, permits to work, isolation of the existing supply, and a team with named roles. Raising a permit is an element of the unit, not bureaucracy you skip.\n\nThis week’s artefact: a one-page load schedule for a two-bedroom staff house plus a materials list and a simple lighting/power layout. That is how  the installation unit is evidenced before you chase conduits.',
      briefingSw:
        'Survey wa site, hatari, na vipimo. Kadiria mzigo. Ukubwa wa kebo na MCB kwa IEE — voltage drop na fault. Mchoro wa kazi, orodha ya vifaa, permit. Usianze conduit bila mpango.',
      questions: [
        {
          prompt: 'A 32 A MCB protecting 1.5 mm² lighting cable is wrong because:',
          options: [
            'MCBs must always be 6 A',
            'The device will not protect the conductor — fire risk',
            'Lighting cannot use MCBs',
            'IEE requires aluminium only'],
          correct: 'b',
          hint: 'Device vs cable.',
          explanation: 'Planning includes matching protection to CCC of the cable.',
        },
        {
          prompt: 'Voltage drop checks exist so that:',
          options: [
            'Lamps and motors at the far end still receive adequate voltage',
            'The earth can be omitted',
            'You can undersize everything',
            'Surveys are optional'],
          correct: 'a',
          hint: 'Length plus current.',
          explanation: 'Long small cables fail voltage drop even if CCC looks fine in a short run.',
        },
        {
          prompt: 'A permit to work on a live installation board is used to:',
          options: ['Decorate the CU', 'Control who isolates, when, and under which conditions', 'Replace IEE tables', 'Increase diversity'],
          correct: 'b',
          hint: 'Planning element 7.',
          explanation: 'Identify the issuer. Do not invent isolation.',
        },
        {
          prompt: 'Diversity in load estimation means:',
          options: [
            'Assume every socket at 13 A forever without rules',
            'Apply taught factors so not all loads are assumed at 100% simultaneous use',
            'Ignore cookers',
            'Count only lights'],
          correct: 'b',
          hint: 'Estimation, not fantasy.',
          explanation: 'Follow the method in your IEE guidance notes / college tables.',
        },
      ],
      blanks: [
        {
          prompt: 'Comparing design current, cable capacity, and voltage drop is part of system ___.',
          answer: 'sizing',
          hint: 'Element: perform system sizing.',
          explanation: 'Sizing is recorded and shared — it is not a private guess at the counter.',
        },
      ],
      practice: {
        prompt: 'Client wants ten 3 kW heaters on one 2.5 mm² radial “because the shop sold the cable”. Planning response?',
        options: [
          'Install it — heaters are diversity 0',
          'Refuse that circuit: recalculate load, split circuits, upsize cable/protection, document',
          'Fit a 63 A MCB on 2.5 mm²',
          'Skip the survey'],
        correct: 'b',
        hint: 'Load estimation.',
        explanation: 'Planning exists to stop fires designed on a till receipt.',
      },
    },
    {
      slug: 'maintain',
      title: 'Week 6 — Maintenance and breakdown: diagnose, isolate, restore',
      titleSw: 'Wiki 6 — Matengenezo na breakdown',
      description: 'Planned maintenance versus breakdown: safe isolation, root cause, then test before return to service.',
      minutes: 28,
      cdacc: 'ENG/OS/EI/CR/04/6',
      examDomain: 'Maintain electrical installation',
      briefing:
        'After install and test, CDACC expects maintenance and breakdown competence. Planned maintenance: inspect, tighten (to torque, not “until it squeals”), clean, test RCDs at recommended intervals, IR sample, thermal scan if you have it, and record. A consumer unit full of dust and insects is a maintenance fail waiting to become a fire.\n\nBreakdown: take a symptom (no lights ring 2, RCD trip, burning smell). Isolate and prove dead. Then diagnose — lost neutral, overloaded circuit, failed lamp, moisture in an outside fitting, nuisance RCD from a leaking kettle. Replacing every MCB “to be sure” is not diagnosis. Use the test instruments from the testing week.\n\nRoot cause: if an RCD trips, find the leaking appliance or damp fitting; do not bridge the RCD. If a motor trips on overload, check mechanical lock and current, not only the starter coil. Restore: refit covers, re-test the affected circuit, and write the job card. Temporary tails hanging out of a CU are not a completed breakdown job.\n\nCompetence includes knowing the limit of your authorised work. Service heads and company meters are not yours to open. Escalate.',
      briefingSw:
        'Matengenezo: kaza, safisha, jaribu RCD, andika. Breakdown: isolate, gundua sababu, usibadilishe kila MCB. Usiruke RCD. Job card. Usifungue meter ya kampuni.',
      questions: [
        {
          prompt: 'An RCD that trips every time the kettle boils should first lead you to:',
          options: [
            'Bridge the RCD with a link',
            'Isolate, test the kettle/circuit insulation, repair or replace the leaking load',
            'Fit a bigger RCD coil of unknown type',
            'Remove the earth from the kettle'],
          correct: 'b',
          hint: 'Find the leak.',
          explanation: 'Nuisance trips are often real leakage. Bridging is illegal and lethal.',
        },
        {
          prompt: 'Planned maintenance records exist so that:',
          options: [
            'The next technician and the assessor can see history and due tests',
            'Paper can fill a drawer',
            'IEE tables can be ignored',
            'You can skip isolation'],
          correct: 'a',
          hint: 'Evidence.',
          explanation: 'Breakdowns without history take longer and miss repeat faults.',
        },
        {
          prompt: 'A burning smell at the CU. After isolation you find a loose incoming terminal. Correct completion includes:',
          options: [
            'Leaving the cover off for cooling',
            'Repair to spec, torque, refit cover, re-test, record, and investigate why it loosened',
            'Painting the terminal black',
            'Upsizing the MCB only'],
          correct: 'b',
          hint: 'Restore to a tested state.',
          explanation: 'Heat from high resistance joints is a classic preventable fire.',
        },
        {
          prompt: 'Opening the supply company’s sealed meter is:',
          options: ['A normal first-year task', 'Outside typical craft authority — escalate to the licensee', 'Required for every lamp change', 'How you prove dead'],
          correct: 'b',
          hint: 'Limits of work.',
          explanation: 'Competence includes stopping at the boundary of your authorisation.',
        },
      ],
      blanks: [
        {
          prompt: 'Work done after a failure, rather than on a schedule, is ___ maintenance.',
          answer: 'breakdown',
          hint: 'Also called corrective.',
          explanation: 'Planned (preventive) versus breakdown (corrective). Both are cores.',
        },
      ],
      practice: {
        prompt: 'Hostel ring “dead”. Trainee fits a 32 A MCB in place of a 16 A without measuring or finding the fault. You should:',
        options: [
          'Approve the upgrade',
          'Stop: isolate, diagnose (continuity, IR, loads), repair, restore original correct rating unless a documented redesign',
          'Fit 63 A next',
          'Bypass the RCD too'],
        correct: 'b',
        hint: 'Diagnosis, not bigger fuses.',
        explanation: 'Breakdown maintenance is a thinking unit. Oversizing protection is how buildings burn.',
      },
    },
  ],
};

export const plumbingProgramme: TradeProgramme = {
  id: 'plumbing',
  title: 'Plumbing',
  titleSw: 'Ufundi wa mabomba',
  description:
    'Semester-style plumbing L4/L5 cores: isolation and potable hygiene, joints, traps, then rainwater harvesting, drainage, sanitary appliances, and storage tanks as in CDACC plumber units.',
  descriptionSw:
    'Mtaala wa semester: isolation, viungo, traps, mvua, drainage, vifaa vya choo, na tanki.',
  icon: '🚿',
  modules: [
    {
      slug: 'isolate',
      title: 'Water systems, isolation, and hygiene',
      titleSw: 'Mifumo ya maji, isolation, na usafi',
      description: 'Stopcocks, potable vs waste, and not contaminating drinking water.',
      minutes: 18,
      cdacc: 'CU/PLB/CR/01/5',
      examDomain: 'Cold & hot water',
      briefing:
        'Plumbing keeps potable water in and sewage out. Know the incoming stopcock, tank valves, and fixture isolators before you cut. Drain the section; opening a live PPR or copper line is a flood, not a shortcut.\n\nNever connect waste to drinking water. Backflow risk is why we use air gaps and approved valves. Do not use the same wrench-dirty rag on a kitchen tap that just sat in a gully.\n\nHot water: unvented cylinders and solar thermosiphon systems have extra hazards (pressure, scalds). If it is outside your unit, stop and call the person who is allowed to open it.\n\nMark isolated valves so the next person does not open them on your open joint.',
      briefingSw:
        'Funga stopcock na drain kabla ya kukata. Usichanganye taka na maji ya kunywa. Weka alama kwenye valve. Mifumo ya pressure ya hot water ina hatari za ziada.',
      questions: [
        {
          prompt: 'Before cutting a live water pipe you should:',
          options: [
            'Increase boiler temperature',
            'Close the isolating valve / stopcock and drain the section',
            'Open every tap as a substitute for isolation',
            'Hit the pipe to relieve pressure',
          ],
          correct: 'b',
          hint: 'No water, no flood.',
          explanation: 'Isolate and drain. Know which valve actually holds.',
        },
        {
          prompt: 'Connecting a waste pipe into a drinking-water line is forbidden because of:',
          options: ['Extra fittings cost', 'Contamination / backflow of sewage into potable water', 'It reduces pressure nicely', 'PVC colour rules'],
          correct: 'b',
          hint: 'Health.',
          explanation: 'Cross-connections cause disease. There is no “temporary” version.',
        },
        {
          prompt: 'After isolating a valve for work you should:',
          options: ['Hide it', 'Tag/control it so nobody opens it on your open joint', 'Remove the handle and throw it', 'Paint it gold'],
          correct: 'b',
          hint: 'Same idea as electrical lock-out.',
          explanation: 'Unexpected repressurising injures and floods.',
        },
        {
          prompt: 'A kitchen tap should be installed with hygiene in mind because:',
          options: ['Assessors like shine only', 'It delivers water people drink and cook with', 'It is plastic', 'Gullies are potable'],
          correct: 'b',
          hint: 'Potable.',
          explanation: 'Dirty tools on drinking outlets are a professional fail.',
        },
      ],
      blanks: [
        {
          prompt: 'The valve that stops the incoming mains water to a house is often called the ___.',
          answer: 'stopcock',
          hint: 'Also stop tap / isolation valve at the origin.',
          explanation: 'Find it before you cut.',
        },
      ],
      practice: {
        prompt: 'You open a PPR joint and water keeps coming. The gate valve handle turns but does not stop flow. Next step?',
        options: [
          'Keep turning until it snaps',
          'Go to an upstream isolation, drain, and treat the valve as failed',
          'Block with your thumb and solvent-weld',
          'Call it a feature',
        ],
        correct: 'b',
        hint: 'Failed isolator.',
        explanation: 'A spinning handle is not isolation. Move upstream.',
      },
    },
    {
      slug: 'joints',
      title: 'Pipe materials and making joints',
      titleSw: 'Aina za mabomba na viungo',
      description: 'Solvent weld, compression, and thread seal — each done clean and square.',
      minutes: 18,
      cdacc: 'CU/PLB/CR/02/5',
      examDomain: 'Jointing',
      briefing:
        'PVC solvent weld needs a square cut, even chamfer, clean dry surfaces, the right cement for the pipe, and the full insertion with a twist. Hold until it grabs. Purple primer where specified is not graffiti — it is preparation. Too little cement leaks; too much puddles and weakens.\n\nCompression joints: pipe square, olive the right way, do not overtighten brass to the point of crushing. PTFE on threads: in the direction of the thread, not as a random bandage, and not on compression olives.\n\nPPR fusion: temperature and time from the manufacturer. Burnt sockets fail later inside the wall. Support pipes so joints are not in bending.\n\nPressure-test joints before you close the chase. A leak behind tiles is your name on a complaint.',
      briefingSw:
        'PVC: kata sawa, safisha, cement sahihi. Compression: usikaze kupita kiasi. PTFE kwenye thread, si olive. PPR: fuata joto na muda. Jaribu shinikizo kabla ya kufunga ukuta.',
      questions: [
        {
          prompt: 'Solvent-weld PVC fails most often because:',
          options: ['The moon is full', 'Dirty, oval, unchamfered, or dry-fit joints without cement', 'Too many pipe clips', 'White pipes'],
          correct: 'b',
          hint: 'Prep.',
          explanation: 'Cement cannot stick to mud or a pipe sitting on 3 mm of the socket.',
        },
        {
          prompt: 'PTFE tape belongs on:',
          options: ['Compression olives', 'Tapered threads as taught, wound with the thread', 'The tap aerator as flavour', 'Solvent-weld sockets'],
          correct: 'b',
          hint: 'Threads, not olives.',
          explanation: 'Tape on an olive prevents the olive from sealing.',
        },
        {
          prompt: 'You should pressure-test:',
          options: ['After the tiler has finished', 'Before concealing joints', 'Never, if you are confident', 'With sewage'],
          correct: 'b',
          hint: 'Access.',
          explanation: 'Test while you can still see the joint.',
        },
        {
          prompt: 'A PPR socket that was overheated typically:',
          options: ['Gets stronger', 'Can restrict internally or fail later', 'Becomes copper', 'Needs no cooling time'],
          correct: 'b',
          hint: 'Melted plastic.',
          explanation: 'Follow time-and-temp charts. Inspect the bore.',
        },
      ],
      blanks: [
        {
          prompt: 'The small brass or copper ring in a compression fitting is the ___.',
          answer: 'olive',
          hint: 'It crushes to seal.',
          explanation: 'Olives are single-use in many repairs — replace them.',
        },
      ],
      practice: {
        prompt: 'A new solvent-weld waste drips at the socket after 20 minutes. Trainee adds more cement on the outside. You should:',
        options: [
          'Approve the smear',
          'Cut out and remake the joint correctly; exterior cement is not a repair',
          'Paint the drip',
          'Tighten with a hammer',
        ],
        correct: 'b',
        hint: 'Solvent weld is not filler on the outside.',
        explanation: 'Remake. Cosmetics over a gap will leak again.',
      },
    },
    {
      slug: 'waste',
      title: 'Traps, waste, and leak diagnosis',
      titleSw: 'Traps, waste, na uvujaji',
      description: 'Water seals against sewer gas, falls on waste runs, and finding the real leak.',
      minutes: 18,
      cdacc: 'CU/PLB/CR/03/5',
      examDomain: 'Sanitary & faults',
      briefing:
        'A P-trap holds a water seal that blocks sewer gas. A dry trap in a guest bathroom smells like a blocked sewer even when the line is fine. Prime it, then fix evaporation, leaks, or missing venting.\n\nWaste runs need fall (often around 1:40 as a teaching starting point — follow the spec). Backfall holds water and solids. Boss connections into stacks must use the right fittings, not a hole and hope.\n\nDiagnosis: dry the area, use tissue or a dye, pressurise or run water in one fixture at a time. Condensation on a cold pipe is not always a leak. Repair the source, not the ceiling stain.\n\nPPE for sewage: gloves, wash, and keep tools for soil work separate from potable work.',
      briefingSw:
        'P-trap inazuia gesi. Trap kavu hunuka. Waste inahitaji fall. Gundua uvujaji kwa kukausha na kujaribu fixture moja. Usichanganye zana za soil na za maji safi.',
      questions: [
        {
          prompt: 'The main purpose of a P-trap under a sink is to:',
          options: ['Increase pressure', 'Hold a water seal that blocks sewer gas', 'Filter fluoride', 'Earth the tap'],
          correct: 'b',
          hint: 'Smell prevention.',
          explanation: 'The seal stops foul air while allowing waste to flow.',
        },
        {
          prompt: 'A hostel bathroom smells of sewage and the trap is dry. First practical step:',
          options: [
            'Connect waste to the drinking tap',
            'Pour water to restore the seal, then find why it dried',
            'Seal the gully with paint',
            'Ignore it with incense',
          ],
          correct: 'b',
          hint: 'Prime the trap.',
          explanation: 'Then address leaks, disuse, or venting.',
        },
        {
          prompt: 'Waste pipes without fall typically:',
          options: ['Self-clean better', 'Block because solids do not travel', 'Become potable', 'Need no clips'],
          correct: 'b',
          hint: 'Gravity.',
          explanation: 'Correct gradient is a design and practical item.',
        },
        {
          prompt: 'A wet patch on a ceiling under a bathroom might be:',
          options: ['Always rain', 'A leaking joint, seal, or overflow — test methodically', 'Always condensation from the fridge', 'Proof the earth is live'],
          correct: 'b',
          hint: 'Evidence.',
          explanation: 'One stain, many possible sources. Isolate which fixture.',
        },
      ],
      blanks: [
        {
          prompt: 'The water held in a trap that blocks foul air is called the water ___.',
          answer: 'seal',
          hint: 'It seals the pipe from the room.',
          explanation: 'Without a seal, the stack talks to the room.',
        },
      ],
      practice: {
        prompt: 'You are asked to clear a blocked soil stack with raw chemical while tenants are on the highest floor with open traps. You should:',
        options: [
          'Pour extra acid',
          'Protect people, use mechanical clearing as trained, and never mix unknown chemicals',
          'Open the drinking tank into the stack',
          'Ignore PPE because it is only waste',
        ],
        correct: 'b',
        hint: 'Chemicals plus people.',
        explanation: 'Caustic plus acid plus methane is how plumbers get hurt. Method and PPE.',
      },
    },
    {
      slug: 'rainwater',
      title: 'Week 4 — Rainwater harvesting: gutters, downpipes, and test',
      titleSw: 'Wiki 4 — Kuvuna maji ya mvua',
      description: 'Quantify goods, mount gutters to fall, and test the system — CDACC plumber rainwater unit.',
      minutes: 28,
      cdacc: 'CU/PLB/CR/04/4',
      examDomain: 'Rainwater harvesting',
      briefing:
        'CDACC plumbing includes install rainwater harvesting: interpret drawings, quantify goods, mount, and test. Gutters are troughs under the eaves. Materials: PVC, galvanised, aluminium, GRP. Accessories: running outlets, stop ends, unions, angles (90°/135°), hopper heads, downpipes, shoes, and brackets. Size from roof area and a rainfall intensity (teaching figure often ~0.0208 L/s/m² — use the figure your college cites from BS EN 12056-3).\n\nFall: gutters must fall toward the outlet (typically around 1:350 to 1:600 as taught — follow the manufacturer). Backfall ponds water and breeds mosquitoes. Brackets at specified centres; do not hang a 6 m PVC gutter on two nails. Expansion: plastics move — use union details that allow it. Isolation from sewage: rainwater is not connected into a foul stack without an approved design.\n\nMounting: PPE (height work), fascia sound, outlets cut, downpipes plumb, shoes to a gully or tank inlet with a leaf screen. First-flush diverters improve tank water. Tanks: opaque, covered, mosquito-proof, on a level plinth, overflow arranged so it does not undermine the foundation.\n\nTest: water or hose test for leaks at unions, overflow operation, and that the gully/tank receives flow. Housekeeping: offcuts, sealant, and safe ladder work. Portfolio: take-off list plus a photo of a falling gutter and a test note.',
      briefingSw:
        'Gutter, downpipe, outlet, stop end. Kadiria kutoka eneo la paa. Fall kuelekea outlet. PVC inapanuka. Tangi funika ili mbu wasizae. Jaribu uvujaji. Usichanganye maji ya mvua na soil stack ovyo.',
      questions: [
        {
          prompt: 'Gutters that pond water usually have:',
          options: ['Too much fall toward the outlet', 'Insufficient or reverse fall', 'Too many brackets', 'A correct first-flush'],
          correct: 'b',
          hint: 'Gradient.',
          explanation: 'Set fall with a line and spirit level / laser as taught.',
        },
        {
          prompt: 'A rainwater shoe typically:',
          options: ['Joins two gutters at 90°', 'Turns the downpipe discharge into a gully or channel', 'Is a type of trap for soil stacks only', 'Replaces the fascia'],
          correct: 'b',
          hint: 'Foot of the downpipe.',
          explanation: 'Access for cleansing is part of the fitting’s job.',
        },
        {
          prompt: 'An uncovered rainwater tank in the tropics is a health issue mainly because of:',
          options: ['Voltage drop', 'Mosquito breeding and contamination', 'Ohm’s law', 'Too much fall'],
          correct: 'b',
          hint: 'Vector control.',
          explanation: 'Lids, screens, and overflow details are part of the unit.',
        },
        {
          prompt: 'Quantifying rainwater goods should start from:',
          options: ['A random shop bundle', 'The drawing: roof area, runs, outlets, and specified materials', 'The cheapest offcut in the yard', 'Soil-stack diameter only'],
          correct: 'b',
          hint: 'Take-off.',
          explanation: 'CDACC lists quantifying goods as a learning outcome.',
        },
      ],
      blanks: [
        {
          prompt: 'The shallow trough fixed under the eaves to collect roof water is a ___.',
          answer: 'gutter',
          hint: 'Not the downpipe.',
          explanation: 'Gutters collect; downpipes convey; tanks store.',
        },
      ],
      practice: {
        prompt: 'PVC gutter installed dead level “for looks” holds water and mosquitoes. Fix?',
        options: [
          'Add insecticide only',
          'Reset brackets to specified fall, check outlets, and prove with a hose test',
          'Connect it into the WC pan',
          'Paint the water black'],
        correct: 'b',
        hint: 'Fall plus test.',
        explanation: 'Rainwater harvesting is a tested installation, not a decoration.',
      },
    },
    {
      slug: 'drainage',
      title: 'Week 5 — Drainage: combined vs separate, falls, and vents',
      titleSw: 'Wiki 5 — Drainage: mifumo, fall, na vents',
      description: 'Underground drainage layouts, access, ventilation, and water tests from the plumber curriculum.',
      minutes: 28,
      cdacc: 'CU/PLB/CR/05/4',
      examDomain: 'Drainage systems',
      briefing:
        'Drainage units cover above-ground waste you already did and underground systems. Combined systems carry foul and rain in one sewer (older towns). Separate systems keep foul and surface water apart — rain must not overload the septic tank. You should sketch both in plan as the curriculum asks.\n\nPipes: rigid plastics (PVC-U, PP) have largely replaced cast iron and glazed clay in new work, but you will still meet clay and CI on rehab. Bedding, cover, and haunching under roads matter. Fittings: rest bends, gulleys, inspection chambers, rodding eyes. Access is a legal/practical need — a run you cannot rod is a future excavation.\n\nFalls: too steep and solids race leaving paper; too flat and the drain silts. Follow the diameter tables you were taught (e.g. 100 mm around 1:40 as a starting teaching value — use the spec). Ventilation of the underground system prevents trap siphonage and sewer gas in the house. IC covers must be to load class (driveway vs garden).\n\nTesting: water test (fill to overflow, watch the level) or air test as permitted. Plug branches. Record. A drain that only “looks straight” is not tested. Keep soil tools off potable benches.',
      briefingSw:
        'Combined dhidi ya separate. Mvua isizidishe septic. Chamber za inspection. Fall kwa jedwali. Vent. Jaribu maji. Cover ya barabara si ya bustani.',
      questions: [
        {
          prompt: 'A separate drainage system means:',
          options: [
            'Foul and rainwater share one pipe always',
            'Foul sewage and surface water are piped independently',
            'No vents are allowed',
            'Only clay pipes'],
          correct: 'b',
          hint: 'Two networks.',
          explanation: 'Combined is one pipe. Know which the site has before you connect a downpipe.',
        },
        {
          prompt: 'Inspection chambers exist mainly to:',
          options: ['Decorate the lawn', 'Provide access for inspection and rodding', 'Increase fall infinitely', 'Store PTFE'],
          correct: 'b',
          hint: 'Access.',
          explanation: 'Place them at changes of direction and long runs as the drawing shows.',
        },
        {
          prompt: 'Connecting roof water into a septic tank typically:',
          options: ['Improves treatment', 'Hydraulically overloads the tank and washes solids out', 'Is required by CDACC', 'Replaces the vent'],
          correct: 'b',
          hint: 'Separate systems.',
          explanation: 'Rain belongs in surface water or a soakaway/harvest tank, not the digester.',
        },
        {
          prompt: 'A water test on drainage is failed if:',
          options: [
            'The sun is out',
            'The water level drops beyond the allowed amount in the test period',
            'The pipe is plastic',
            'There is a rodding eye'],
          correct: 'b',
          hint: 'Hold the head.',
          explanation: 'Curriculum practicals still list water/air tests before backfill.',
        },
      ],
      blanks: [
        {
          prompt: 'A chamber that lets you inspect and rod an underground drain is an ___ chamber.',
          answer: 'inspection',
          hint: 'IC.',
          explanation: 'Manholes/ICs are access. Do not backfill a bend with no access.',
        },
      ],
      practice: {
        prompt: 'New house: trainee drops the kitchen sink waste into the rainwater gully “because it was closer”. You should:',
        options: [
          'Approve — water is water',
          'Redo: foul to foul system; keep rain separate unless a true combined design exists',
          'Add more fall to the gutter',
          'Seal the gully with cement forever'],
        correct: 'b',
        hint: 'Foul vs surface.',
        explanation: 'Wrong system connections fail inspections and public health.',
      },
    },
    {
      slug: 'sanitary',
      title: 'Week 6 — Sanitary appliances: set-out, seals, and flush',
      titleSw: 'Wiki 6 — Vifaa vya usafi',
      description: 'WC, basin, and shower set-out: brackets, traps, and flush performance without leaks.',
      minutes: 26,
      cdacc: 'CU/PLB/CR/06/4',
      examDomain: 'Sanitary appliances',
      briefing:
        'Sanitary appliances are a listed plumber core: WC pans, cisterns, basins, sinks, urinals, showers, bidets as the college workshop stocks. Set-out from finished floor and centre-lines so the pan sits square to the wall and the seat does not hit the cistern. Pan connectors (soil fitments) must be the right offset; a pan wedged with mortar is a crack waiting.\n\nBasins: brackets or pedestals that actually carry the load, waste and overflow working, trap accessible. Do not support a basin only on the trap. Showers: tray level, waste with hair trap, and a fall that does not flood the room. Sealant is a second defence, not a substitute for a mechanical joint.\n\nFlush: cistern fills to the marked waterline, drop valve or siphon as specified, no continuous trickle (wastes water and stains). Dual flush where specified. After install, flush several times and check the pan connector from the access if you have it.\n\nHygiene: potable supplies to cisterns via approved inlet valves; overflow discharging safely. PPE for used appliances on rehab jobs. Test: fill, flush, no drip at the stopcock, no rock on the pan.',
      briefingSw:
        'WC iwe square, connector sahihi, si mortar kama wedge. Bonde liwe na bracket, si trap pekee. Cistern ijaa hadi alama, isichuruzike. Sealant si kiungo pekee. Flush mara kadhaa kisha kagua.',
      questions: [
        {
          prompt: 'A WC pan should be held by:',
          options: [
            'Mortar jammed as a wedge under one side only',
            'Specified fixings, level, with the correct pan connector — not stress from packing',
            'The trap of the basin',
            'PTFE only'],
          correct: 'b',
          hint: 'Mechanical fix.',
          explanation: 'Stressed ceramic cracks after handover.',
        },
        {
          prompt: 'A basin supported only by the waste trap will:',
          options: ['Last longer', 'Strain and leak — use brackets/pedestal as designed', 'Improve seal', 'Vent the stack'],
          correct: 'b',
          hint: 'Load path.',
          explanation: 'Traps are not structural.',
        },
        {
          prompt: 'A cistern that never stops filling usually has:',
          options: ['A failed inlet valve / wrong waterline / leaking flush valve', 'Too much fall on the gutter', 'A good dual flush', 'No overflow needed ever'],
          correct: 'a',
          hint: 'Inlet or outlet leaking.',
          explanation: 'Adjust or replace. Continuous flow is a defect and a water bill.',
        },
        {
          prompt: 'Silicone around a shower tray:',
          options: ['Replaces the waste joint', 'Seals the perimeter after the tray is level and the waste is proven', 'Should be applied to the soil stack threads', 'Is a type of PTFE'],
          correct: 'b',
          hint: 'Second defence.',
          explanation: 'If the waste leaks, silicone at the wall will not save the ceiling.',
        },
      ],
      blanks: [
        {
          prompt: 'The fitting that joins a WC pan to the soil pipe is a pan ___.',
          answer: 'connector',
          hint: 'Also soil fitment / horn connector.',
          explanation: 'Correct offset and a dry, complete push-fit beat cement smears.',
        },
      ],
      practice: {
        prompt: 'After tiling, the pan rocks 8 mm and the connector weeps on flush. Trainee adds more silicone at the floor. You should:',
        options: [
          'Approve the smear',
          'Reset the pan level on a proper bed/fixings and remake the connector; silicone is not a joint',
          'Tighten the seat bolts until the ceramic cracks',
          'Block the overflow'],
        correct: 'b',
        hint: 'Level plus connector.',
        explanation: 'Sanitary appliances are a fit-and-test unit.',
      },
    },
    {
      slug: 'storage',
      title: 'Week 7 — Water storage tanks, overflow, and maintenance',
      titleSw: 'Wiki 7 — Tanki, overflow, na matengenezo',
      description: 'Siting, covers, overflows, ball valves, and hygienic maintenance of stored potable water.',
      minutes: 26,
      cdacc: 'CU/PLB/CR/07/4',
      examDomain: 'Water storage',
      briefing:
        'Water storage is a plumber core: loft tanks, roof tanks, and ground tanks feeding gravity or pumps. Structure first — a full tank is heavy. Support as the manufacturer and the builder specify. A tank on two skinny timber across a span is how ceilings collapse. Inlet via a float/ball valve set so the waterline leaves air gap and overflow capacity.\n\nOverflow (warning pipe) must discharge where someone will notice — not silently into a void. Covers keep out light, insects, and debris; screened vents. Potable tanks are cleaned on a schedule; biofilm and drowned rodents are public-health failures. Do not use a waste-water drum as a drinking tank.\n\nIsolation: every tank should have valves so you can work without draining the whole site. Maintenance: replace perished ball-valve washers, check overflow, inspect for UV-brittle plastic, and chlorinate after cleaning as instructed. Pumps: isolate electrically as well as hydraulically — you already know that from isolation week.\n\nTest: fill, confirm shut-off, overflow trial, no weep at unions, and the cover back on. Record the clean date. That is storage competence, not “fit and forget”.',
      briefingSw:
        'Tanki ni nzito — msaada wa muundo. Ball valve, overflow inayoonekana, kifuniko dhidi ya mbu. Usitumie drum ya taka kwa maji ya kunywa. Valve za isolation. Safisha na rekodi. Pampu: zima umeme pia.',
      questions: [
        {
          prompt: 'A warning/overflow pipe should discharge:',
          options: ['Into a sealed ceiling void', 'Where the leak is visible so the fault is noticed', 'Into the soil stack without a design', 'Into the electrical CU'],
          correct: 'b',
          hint: 'Warning.',
          explanation: 'Silent overflows flood for weeks. Visibility is the point.',
        },
        {
          prompt: 'A potable storage tank without a lid is wrong because:',
          options: ['It cools better', 'Contamination and mosquito breeding', 'Ball valves need sunlight', 'IEE requires open tanks'],
          correct: 'b',
          hint: 'Hygiene.',
          explanation: 'Covers and screens are part of the appliance.',
        },
        {
          prompt: 'Before working on a roof tank outlet you should:',
          options: [
            'Open every tap in the estate',
            'Isolate inlet and outlet valves and drain as needed, with electrical isolation if a pump is present',
            'Hit the ball valve with a hammer only',
            'Connect the overflow to the kettle'],
          correct: 'b',
          hint: 'Same isolation mindset.',
          explanation: 'Stored water plus a pump is a flood and a shock risk.',
        },
        {
          prompt: 'A ball valve that does not shut at the waterline will:',
          options: ['Save water', 'Overflow continuously and can collapse a poorly supported ceiling', 'Sterilise the tank', 'Increase fall on gutters'],
          correct: 'b',
          hint: 'Float setting.',
          explanation: 'Washer, seating, and arm setting are maintenance items.',
        },
      ],
      blanks: [
        {
          prompt: 'The float-operated valve that stops the tank filling is a ___ valve.',
          answer: 'ball',
          hint: 'Ball valve / float valve.',
          explanation: 'Set the waterline below the overflow. That is the adjustment.',
        },
      ],
      practice: {
        prompt: 'Plastic tank on a roof, no overflow, ball valve stuck open, water staining the bedroom ceiling. Immediate actions?',
        options: [
          'Advise more silicone in the bedroom',
          'Isolate supply, drain/make safe, repair/replace the valve, add a working overflow, check structure, then restore',
          'Fit a bigger inlet only',
          'Connect the stain to the soil stack'],
        correct: 'b',
        hint: 'Stop the water, then engineer the tank.',
        explanation: 'Storage maintenance is isolation, hygiene, and overflow — the whole unit.',
      },
    },
  ],
};

export const masonryProgramme: TradeProgramme = {
  id: 'masonry',
  title: 'Masonry & building technology',
  titleSw: 'Uashi na teknolojia ya ujenzi',
  description: 'Setting out, mortar and first course, then wall quality and weather protection.',
  descriptionSw: 'Setting out, chokaa, kozi ya kwanza, na ubora wa ukuta.',
  icon: '🧱',
  modules: [
    {
      slug: 'setout',
      title: 'Site safety and setting out',
      titleSw: 'Usalama wa site na setting out',
      description: 'PPE, working platforms, profiles, and getting the building on the lines.',
      minutes: 18,
      cdacc: 'CU/MAS/CR/01/5',
      examDomain: 'Setting out',
      briefing:
        'Masonry starts with a safe site: boots, gloves, goggles when cutting, and no standing under a hoist. Scaffold and trestles must be complete; a stack of blocks is not a platform. Cement burns skin — wash splashes.\n\nSetting out: profiles, builder’s square or 3-4-5, diagonals equal for a rectangle. A wall built off a wrong line is demolished, not decorated. Check reduced levels if you have a dumpy or laser; do not assume the slab is true.\n\nStore cement dry and blocks on a clean base. Mixing on the soil fills mortar with clay and weakens it.\n\nThe assessor will ask you to explain how you know the corner is square. “It looks square” is not an answer.',
      briefingSw:
        'Vaa PPE. Usisimame chini ya hoist. Square kwa 3-4-5 au diagonals. Usichanganye chokaa kwenye udongo. Cement inawasha ngozi.',
      questions: [
        {
          prompt: 'A rectangle is square in plan when:',
          options: ['One corner looks nice', 'Diagonals are equal (and sides as drawn)', 'All blocks are wet', 'The mixer is loud'],
          correct: 'b',
          hint: 'Geometry.',
          explanation: 'Measure diagonals. That is craft, not theory only.',
        },
        {
          prompt: 'When cutting a concrete block you should:',
          options: [
            'Hold it on your knee toward your face',
            'Use appropriate tools, eye protection, and a stable surface',
            'Soak it in petrol',
            'Leave random gaps instead',
          ],
          correct: 'b',
          hint: 'Chips fly.',
          explanation: 'Goggles and a bench. Angle grinders need extra discipline.',
        },
        {
          prompt: 'Mixing mortar on bare soil is bad because:',
          options: ['It is faster', 'Soil contaminates and weakens the mix', 'Cement prefers clay', 'It squares the building'],
          correct: 'b',
          hint: 'Dirty mix.',
          explanation: 'Use a board or mixer as specified.',
        },
        {
          prompt: 'Standing on a dry-stack of blocks to lay the next lift is:',
          options: ['Efficient', 'Unsafe — use a proper platform', 'Required by CDACC', 'A type of profile'],
          correct: 'b',
          hint: 'Fall from height.',
          explanation: 'Access equipment is part of the unit.',
        },
      ],
      blanks: [
        {
          prompt: 'The 3-4-5 method is used to set a right ___.',
          answer: 'angle',
          hint: 'A square corner.',
          explanation: '3-4-5 is a practical Pythagorean square.',
        },
      ],
      practice: {
        prompt: 'Rain is forecast and profiles are already knocked by a wheelbarrow. You should:',
        options: [
          'Build anyway from memory',
          'Reset lines from datums, protect profiles, and only then lay',
          'Double the mortar water',
          'Remove all PPE to move faster',
        ],
        correct: 'b',
        hint: 'Datums first.',
        explanation: 'A wall on a moved line is waste.',
      },
    },
    {
      slug: 'first-course',
      title: 'Mortar, bond, and the first course',
      titleSw: 'Chokaa, bond, na kozi ya kwanza',
      description: 'Mix as specified, bed the first course true, and keep perpends aligned.',
      minutes: 20,
      cdacc: 'CU/MAS/CR/02/5',
      examDomain: 'Brick/block work',
      briefing:
        'A wall is only as true as the first course. Level and line it until you are bored of checking. Any error is multiplied as you rise. Butter heads for full perpends; empty perpends leak and fail compressive paths.\n\nMortar: follow the job spec (a common teaching mix for general blockwork is in the region of 1:4 cement:sand — never invent a wetter mix to make laying “easy”). Too much water weakens and stains. Mix small enough to use before it dies. Do not retemper with extra water hours later if the spec forbids it.\n\nBond (stretcher, English, etc.) must run correctly so vertical joints do not align one above the other except where the bond requires. Quoins are your plumbing posts — get them up with a level and line pins.\n\nJoint thickness consistent. Fat joints on one course and hairline on the next is a fail even if the wall stands.',
      briefingSw:
        'Kozi ya kwanza ni msingi. Level na line. Fuata mchanganyiko wa chokaa. Perpends zijazwe. Bond isizuie joints kuwa wima moja juu ya nyingine isipokuwa bond inavyosema.',
      questions: [
        {
          prompt: 'Why is the first course critical?',
          options: [
            'It uses leftover mortar',
            'Error in level or line is multiplied as the wall rises',
            'Paint hides it',
            'Blocks are cheaper at the bottom',
          ],
          correct: 'b',
          hint: 'Foundation of the elevation.',
          explanation: 'A lean first course cannot be fixed higher without a visible correction.',
        },
        {
          prompt: 'Empty perpends typically cause:',
          options: ['Faster curing always', 'Weakness and water paths', 'Perfect bond', 'Automatic square'],
          correct: 'b',
          hint: 'Fill the heads.',
          explanation: 'Full mortar beds and perpends as specified.',
        },
        {
          prompt: 'Adding water to dying mortar hours later (if not allowed) is called retempering and often:',
          options: ['Improves spec strength', 'Weakens the mix', 'Squares the quoin', 'Replaces lime'],
          correct: 'b',
          hint: 'Chemistry has started.',
          explanation: 'Mix what you can use. Dump set mortar.',
        },
        {
          prompt: 'Aligned vertical joints up the wall (in stretcher bond) usually mean:',
          options: ['Perfect work', 'Broken bond / setting-out error', 'Stronger perpends', 'A type of damp-proof course'],
          correct: 'b',
          hint: 'Stagger the perpends.',
          explanation: 'Bond pattern is structural and visual.',
        },
      ],
      blanks: [
        {
          prompt: 'The vertical mortar joint between block ends is a ___.',
          answer: 'perpend',
          hint: 'Also “head joint”.',
          explanation: 'Perpends should be full and aligned to the bond.',
        },
      ],
      practice: {
        prompt: 'Your first course is 8 mm out of level across a 3 m wall. Trainee wants to “catch it up” over six courses. You should:',
        options: [
          'Agree — nobody sees the DPC',
          'Take it up and relay the first course; do not pack errors into the elevation',
          'Use wooden wedges forever',
          'Flood the bed with water',
        ],
        correct: 'b',
        hint: 'Reset now.',
        explanation: 'Catching up makes tapering joints and a drunk wall.',
      },
    },
    {
      slug: 'quality',
      title: 'Plumb, line, curing, and weather',
      titleSw: 'Plumb, line, curing, na hali ya hewa',
      description: 'Rise in lifts, protect green work from rain, and finish joints.',
      minutes: 18,
      cdacc: 'CU/MAS/CR/03/5',
      examDomain: 'Quality of work',
      briefing:
        'Check plumb and line every few courses, not only at the end of the day. Corner profiles and a line keep the face true. Raking back or toothing as specified if you stop a length.\n\nGreen mortar fears sun and rain. Cure: keep it damp as taught; do not let it bake on day one. Incoming rain: cover the wall; do not add extra storeys onto weak beds. Washout of cement from joints is a defect.\n\nJoint finishing (flush, tooled) is done at the right stiffness — too early and you smear; too late and you polish a cracked skin. Brush excess without staining the face.\n\nLeave weep holes and DPCs as the drawing shows. A beautiful wall that bridges the DPC with mortar droppings can still damp.',
      briefingSw:
        'Kagua plumb kila baadhi ya kozi. Linda chokaa mpya na mvua na jua. Finish joints kwa wakati. Usiingize mortar kwenye DPC.',
      questions: [
        {
          prompt: 'Rain is coming and today’s mortar is still green on a 1.2 m wall. Right action:',
          options: [
            'Cover the work and do not load extra height onto weak mortar',
            'Spray diesel',
            'Build two more metres to weight it down',
            'Remove all profiles',
          ],
          correct: 'a',
          hint: 'Protect green work.',
          explanation: 'Rain washes cement from fresh joints.',
        },
        {
          prompt: 'Mortar droppings on a DPC can:',
          options: ['Improve insulation always', 'Bridge the DPC and let damp rise', 'Replace the DPC', 'Square the diagonal'],
          correct: 'b',
          hint: 'Keep the DPC clean.',
          explanation: 'Cavity/DPC hygiene is part of the craft.',
        },
        {
          prompt: 'You should check plumb:',
          options: ['Only after painting', 'Frequently as the wall rises', 'Never — the line is enough', 'With a tape across the road'],
          correct: 'b',
          hint: 'Little and often.',
          explanation: 'End-of-day surprises are expensive.',
        },
        {
          prompt: 'Pointing too early typically:',
          options: ['Strengthens cement', 'Smears and stains the face', 'Replaces curing', 'Sets the DPC'],
          correct: 'b',
          hint: 'Timing.',
          explanation: 'Wait for the right stiffness.',
        },
      ],
      blanks: [
        {
          prompt: 'Keeping new mortar from drying too fast is called ___.',
          answer: 'curing',
          hint: 'Not “cooking”.',
          explanation: 'Curing develops strength. Baking in the sun does not.',
        },
      ],
      practice: {
        prompt: 'An assessor’s 2 m spirit level shows a belly in the face. Trainee offers to render thick to hide it. You should:',
        options: [
          'Render 40 mm to fake plumb',
          'Cut out and rebuild the section; render is not a structural correction',
          'Paint it dark',
          'Lean the next wall the other way',
        ],
        correct: 'b',
        hint: 'Geometry first.',
        explanation: 'Thick render fails and still shows. Rebuild.',
      },
    },
  ],
};

export const carpentryProgramme: TradeProgramme = {
  id: 'carpentry',
  title: 'Carpentry & joinery',
  titleSw: 'Useremala',
  description: 'Setting out timber, machine safety, joints, then hanging and moisture movement.',
  descriptionSw: 'Kuweka alama, usalama wa mashine, viungo, na unyevu.',
  icon: '🪚',
  modules: [
    {
      slug: 'setout-wood',
      title: 'Measuring, face marks, and hand tools',
      titleSw: 'Kipimo, face marks, na zana',
      description: 'Measure twice. Face side and face edge are the datums for every joint.',
      minutes: 18,
      cdacc: 'CU/CRP/CR/01/5',
      examDomain: 'Setting out',
      briefing:
        'Joinery is accurate only if every cut is taken from known faces. Mark face side and face edge. Squares sit on those faces. A rod or cutting list beats measuring each piece from the last mistake.\n\nSaws: a sharp saw is safer than a dull one. Support the waste so the last fibre does not splinter. Chisels: two hands, no body behind the point, knockers — not your palm on a stuck mortise in a hurry.\n\nMoisture: wet timber moves after you hang a door. Store stickers, off the ground, as taught. Write the job size after checking the opening, not from the drawing alone if the site is out.\n\nAssessors look at your marks. Faint, confused lines produce confused joints.',
      briefingSw:
        'Weka face side na face edge. Pima mara mbili. Msumeno mkali ni salama. Mbao yenye unyevu inasogea. Alama safi ni sehemu ya alama za mtihani.',
      questions: [
        {
          prompt: 'Why mark a face side and face edge before joints?',
          options: [
            'To decorate the timber',
            'So all measurements and joints reference the same true faces',
            'NITA forbids pencils',
            'It increases moisture',
          ],
          correct: 'b',
          hint: 'A datum for the whole job.',
          explanation: 'Without reference faces, squares and gauges lie.',
        },
        {
          prompt: 'A dull handsaw is more dangerous because:',
          options: ['It is lighter', 'You force it and it jumps', 'It vaporizes timber', 'CDACC bans sharp tools'],
          correct: 'b',
          hint: 'Force.',
          explanation: 'Sharpen or replace. Do not muscle a blunt saw.',
        },
        {
          prompt: 'You should take the hanging size of a door from:',
          options: ['The internet', 'The actual opening plus specified clearances', 'A random offcut', 'The previous site only'],
          correct: 'b',
          hint: 'Openings are never perfect.',
          explanation: 'Measure the hole you have.',
        },
        {
          prompt: 'Chiselling toward your body is:',
          options: ['Faster', 'A common way to get cut — work with the body out of line', 'Required for dovetails', 'A face mark'],
          correct: 'b',
          hint: 'If it slips.',
          explanation: 'Clamp, two hands, think where the edge goes.',
        },
      ],
      blanks: [
        {
          prompt: 'The marked good wide face used as a reference is the face ___.',
          answer: 'side',
          hint: 'Face side and face edge.',
          explanation: 'Face side is the datum surface.',
        },
      ],
      practice: {
        prompt: 'Your cutting list was copied from a drawing but the site opening is 12 mm narrower. You already cut. What now?',
        options: [
          'Force it with a bigger hammer',
          'Remake to the measured opening; forcing splits jambs',
          'Plane the masonry with a tenon saw',
          'Ignore clearances forever',
        ],
        correct: 'b',
        hint: 'Site wins.',
        explanation: 'Measure openings. Drawings are a start.',
      },
    },
    {
      slug: 'machines',
      title: 'Workshop machines and joints',
      titleSw: 'Mashine za warsha na viungo',
      description: 'Guards, push sticks, then housing, mortise and tenon, and glue-up.',
      minutes: 20,
      cdacc: 'CU/CRP/CR/02/5',
      examDomain: 'Machines & joints',
      briefing:
        'Circular saws, bandsaws, and thicknessers remove fingers faster than any other college machine. Guards on, riving knife on, push sticks for short pieces, and never stand in the kickback line. Unplug to change blades. Dust extraction is health, not comfort.\n\nJoints: housing, mortise and tenon, haunch, dovetail as taught. Dry fit. Shoulders must seat. Glue is not gap-filler for a 4 mm error. Cramp with protection blocks; check square as you tighten — frames rack.\n\nMark waste with hatching. Cut on the waste side of the line. A tenon that is too tight will split the mortise; too loose will fail when the glue dries.\n\nStop the machine fully before you clear offcuts. That sentence is in every accident report.',
      briefingSw:
        'Guards na push sticks. Usisimame kwenye mstari wa kickback. Dry fit viungo. Gundi si filler. Zima mashine kabisa kabla ya kuondoa offcuts.',
      questions: [
        {
          prompt: 'The safest way to feed a short piece on a table saw is:',
          options: [
            'Fingers over the blade',
            'Push stick / push block with guards in place',
            'Remove the riving knife always',
            'Stand in line with the board so kickback hits your chest',
          ],
          correct: 'b',
          hint: 'Hands never over the blade.',
          explanation: 'Kickback and contact injuries are common in college shops.',
        },
        {
          prompt: 'Glue in a 4 mm gap on a tenon shoulder:',
          options: ['Is structural magic', 'Does not replace a fitted joint', 'Replaces the face mark', 'Sharpens the saw'],
          correct: 'b',
          hint: 'Fit first.',
          explanation: 'Recut or pack only as the spec allows — usually recut.',
        },
        {
          prompt: 'You change a bandsaw blade:',
          options: ['With the machine running slowly', 'Isolated / unplugged, tracking set, guards replaced', 'By holding the pulley with a rag while powered', 'After removing all dust extraction'],
          correct: 'b',
          hint: 'Isolation.',
          explanation: 'Energy isolation applies to wood machines too.',
        },
        {
          prompt: 'Checking square during glue-up matters because:',
          options: ['Clamps always keep square', 'Frames rack as you tighten', 'Glue sets square automatically', 'NITA bans squares'],
          correct: 'b',
          hint: 'Measure diagonals.',
          explanation: 'Correct while the glue is wet.',
        },
      ],
      blanks: [
        {
          prompt: 'A stick used so fingers stay away from a saw blade is a ___ stick.',
          answer: 'push',
          hint: 'Push stick or push block.',
          explanation: 'They are not optional for short stock.',
        },
      ],
      practice: {
        prompt: 'Kickback just threw a board. The saw still runs. Trainee reaches over the blade for the offcut. You:',
        options: [
          'Let them — the board is expensive',
          'Stop them, power off, wait for stop, then use a stick to clear',
          'Speed the saw up',
          'Remove the guard so they can see',
        ],
        correct: 'b',
        hint: 'Wait for stop.',
        explanation: 'Most injuries are after the cut, grabbing waste.',
      },
    },
    {
      slug: 'hanging',
      title: 'Hanging, ironmongery, and movement',
      titleSw: 'Kuning’iniza, ironmongery, na kupanuka',
      description: 'Hinge gain, clearances, locks, and what rain does to unseasoned doors.',
      minutes: 18,
      cdacc: 'CU/CRP/CR/03/5',
      examDomain: 'Site joinery',
      briefing:
        'Hanging a door: plane to clearance (often about 2–3 mm as taught — follow the spec), mark hinge gains from the hanging stile, chop or router to the leaf thickness so the hinge sits flush. Screws in the frame must bite — pack or longer screws into studs if the lining is hollow.\n\nLocks: mortise at the right height, keep aligned, and do not split the stile. Handle sets have a backset. Test the latch before you call it done.\n\nMoisture movement: a door hung in the rains on wet timber binds at the head the next week. Ease the high spot after checking hinges have not sunk. Advise sealing all faces, including the bottom edge, or the job comes back.\n\nIronmongery on exterior work should be the specified corrosion resistance. Bright mild screws on a coastal door rust and seize.',
      briefingSw:
        'Weka hinge flush. Clearance kama spec. Fungua lock kwa urefu sahihi. Mbao yenye unyevu inasogea — seal pande zote. Test latch kabla ya kuondoka.',
      questions: [
        {
          prompt: 'A door binds at the head after a rainy night. Timber was not dry. You should:',
          options: [
            'Plane the high spot after checking hinges and moisture, and advise sealing',
            'Force it with a bigger hammer',
            'Pour water on the other side',
            'Replace the house foundation',
          ],
          correct: 'a',
          hint: 'Timber moves.',
          explanation: 'Ease and seal. Do not destroy the latch.',
        },
        {
          prompt: 'Hinge leaves that sit proud of the gain:',
          options: ['Look traditional', 'Throw the door out of line and strain screws', 'Increase clearance automatically', 'Replace locks'],
          correct: 'b',
          hint: 'Flush.',
          explanation: 'Gains are chopped to the leaf thickness.',
        },
        {
          prompt: 'The bottom edge of an exterior door should be:',
          options: ['Left raw for “breathing”', 'Sealed like the other faces to limit moisture uptake', 'Drilled for drainage always', 'Planed after painting only'],
          correct: 'b',
          hint: 'All faces.',
          explanation: 'Unsealed end grain drinks water.',
        },
        {
          prompt: 'A latch that does not enter the keep may need:',
          options: ['A longer door', 'Keep alignment / strike adjustment, not a bigger hammer on the handle', 'Removal of all hinges', 'Wetting the lock'],
          correct: 'b',
          hint: 'Geometry of keep.',
          explanation: 'Move the keep or plane the meeting stile as appropriate.',
        },
      ],
      blanks: [
        {
          prompt: 'The recess chopped for a hinge leaf is called a hinge ___.',
          answer: 'gain',
          hint: 'Also hinge recess / housing.',
          explanation: 'Gains let the hinge sit flush.',
        },
      ],
      practice: {
        prompt: 'You hung a door with 8 mm clearance at the head and 0 mm at the latch. It slams or will not close. Fix?',
        options: [
          'Leave it as character',
          'Rehang/plane to even specified clearances and reset the keep',
          'Remove two hinges',
          'Oil the floor instead',
        ],
        correct: 'b',
        hint: 'Even gaps.',
        explanation: 'Uneven clearance is a hanging fault, not a lock fault only.',
      },
    },
  ],
};
