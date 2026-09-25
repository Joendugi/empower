import type { TradeProgramme } from './build';

export const vehicleAnatomyProgramme: TradeProgramme = {
  id: 'vehicle-anatomy',
  title: 'Vehicle anatomy studio',
  titleSw: 'Anatomia ya gari',
  description:
    'Browser study of how a car is built: chassis, engine, cooling, drivetrain, brakes, and electrics — the same systems car-anatomy sites label in cutaways.',
  descriptionSw: 'Soma anatomia ya gari kwenye kivinjari: chasi, injini, baridi, drivetrain, breki, na umeme.',
  icon: '🦴',
  certificationTarget: 'CDACC Automotive · vehicle systems literacy',
  modules: [
    {
      slug: 'overview',
      title: 'Whole-car map: body, cabin, chassis',
      titleSw: 'Ramani ya gari: body, cabin, chasi',
      description: 'Read a car like a cutaway: what hangs on the frame and what the body only covers.',
      minutes: 28,
      cdacc: 'CU/AUT/CR/01/5',
      examDomain: 'Vehicle architecture',
      briefing:
        'Car-anatomy sites start with a map, not a single bolt. A vehicle is a carrying structure plus systems hung on it. The chassis (or subframe + body-in-white on a unibody car) is the skeleton: rails, cross-members, and mounting points that locate the engine, suspension, steering, and fuel tank. The body/cabin is the occupant cell and crash structure. Doors, glass, and trim are not the frame.\n\nUnibody cars combine body and structure. Body-on-frame pickups still have a ladder frame you can point to. Either way, loads travel: engine torque into mounts, braking into knuckles and subframe, pothole loads into springs and then the body. If a mount or rail is rusted, “just replace the part” is not a diagnosis.\n\nWalk a car the way a cutaway is layered: engine bay (power + cooling + charging), cabin (controls, HVAC, restraints), floor (exhaust, fuel, brake/fuel lines), corners (hub, bearing, brake, spring, damper, steering arm), rear (tank, spare, driveline).\n\nKenya workshop habit: look for accident pull, wet battery trays, crushed sills, and missing undertrays before you chase a noise. The map tells you which system can make that symptom.\n\nSources: vocational vehicle-systems units (body/frame, suspension, driveline, steering, fuel, intake/exhaust, lubrication, coolant, electrical, brakes, wheels) and standard service-technician component maps.',
      briefingSw:
        'Chasi ni mifupa. Body ni seli ya abiria. Tembea gari kama cutaway: engine bay, cabin, floor, pembe, nyuma. Kutu au ajali kwenye rail si “badilisha sehemu tu.”',
      diagram: {
        kind: 'overview',
        prompt: 'Label the whole-car cutaway the way an anatomy site layers the vehicle.',
        slots: [
          { id: 'engine', label: 'Engine bay', x: 22, y: 36 },
          { id: 'cabin', label: 'Occupant cell', x: 50, y: 40 },
          { id: 'chassis', label: 'Chassis / rails', x: 50, y: 78 },
        ],
        hint: 'Power up front, people in the middle, structure underneath.',
        explanation: 'Engine bay, cabin, and carrying structure are three different layers.',
      },
      questions: [
        {
          prompt: 'On a unibody hatchback the “chassis” you load is mostly:',
          options: [
            'Only the plastic bumper',
            'The body-in-white rails, floors, and subframes that carry the units',
            'The radio fascia',
            'The spare wheel alone',
          ],
          correct: 'b',
          hint: 'Skeleton plus mounts.',
          explanation: 'Unibody structure locates every major unit. Bumpers are cover and crash energy, not the carrying frame.',
        },
        {
          prompt: 'A cutaway “layer” that is not a powertrain layer is:',
          options: ['Engine and gearbox', 'Occupant cabin and restraints', 'Driveshafts and differential', 'Clutch or torque converter'],
          correct: 'b',
          hint: 'People, not torque.',
          explanation: 'Anatomy sites separate cabin/electrical layers from driveline layers.',
        },
      ],
      blanks: [
        {
          prompt: 'The main carrying structure of a vehicle is the ___.',
          answer: 'chassis',
          hint: 'French term used in vocational books.',
          explanation: 'Chassis / carrying unit. Body sits on or is integrated with it.',
        },
      ],
      practice: {
        prompt: 'A matatu has a pull to the left and a crumpled front rail. First anatomy question?',
        options: [
          'Replace both tyres and hope',
          'Ask which structure and which corner geometry were moved, then measure',
          'Add a heavier spring on the right',
          'Disconnect the battery forever',
        ],
        correct: 'b',
        hint: 'Map first.',
        explanation: 'Pull after impact is geometry and structure, not a mystery alignment “click”.',
      },
    },
    {
      slug: 'engine',
      title: 'Engine cutaway: air, fuel, spark, bottom end',
      titleSw: 'Cutaway ya injini',
      description: 'Block, head, crank, pistons, valvetrain — how a four-stroke actually moves.',
      minutes: 30,
      cdacc: 'CU/AUT/CR/02/5',
      examDomain: 'Internal combustion engine',
      briefing:
        'The engine is a pump that burns a mixture and turns heat into crank rotation. Vocational maps split: top end (head, valves, cam, intake, exhaust, ignition or injectors) and bottom end (block, pistons, rods, crank, sump).\n\nFour-stroke order: intake, compression, power, exhaust. Spark-ignition (petrol) lights a compressed mix. Compression-ignition (diesel) injects into hot air. Wrong fuel, wrong glow/spark, or no air (blocked filter / collapsed hose) all look like “no power”.\n\nAir path: filter → meter/MAF if fitted → throttle or diesel intake → manifold → valve → cylinder. Exhaust: valve → manifold → turbo if fitted → after-treatment → silencer. A boost leak after a turbo is a power complaint with a black or clean tailpipe depending on fueling.\n\nBottom-end noises and oil pressure are not “add thicker oil and release”. Low pressure, mayonnaise, coolant in oil, or white smoke send you to the cooling and sealing lesson next — the systems share the head gasket and jackets.\n\nAlways isolate: fuel delivery, spark/glow, compression, timing, air. Anatomy prevents swapping a coil when the timing chain has jumped.',
      briefingSw:
        'Injini ni pampu ya moto. Top end: kichwa, valves, intake, exhaust. Bottom end: block, pistoni, crank. Four-stroke: intake, compression, power, exhaust. Tenganisha hewa, mafuta, cheche, compression.',
      diagram: {
        kind: 'engine',
        prompt: 'Place the labels on this engine cutaway.',
        slots: [
          { id: 'head', label: 'Cylinder head', x: 48, y: 28 },
          { id: 'block', label: 'Block / pistons', x: 48, y: 52 },
          { id: 'crank', label: 'Crankshaft', x: 48, y: 76 },
        ],
        hint: 'Top end, bottom end, rotating assembly.',
        explanation: 'Head above, pistons in the block, crank at the bottom.',
      },
      questions: [
        {
          prompt: 'The crankshaft lives in the:',
          options: ['Fuse box', 'Cylinder head cover only', 'Bottom end of the block', 'Radiator tank'],
          correct: 'c',
          hint: 'Rotating assembly.',
          explanation: 'Pistons and rods turn the crank in the block. The head holds valves.',
        },
        {
          prompt: 'A diesel that will not start after sitting in the cold is missing heat for:',
          options: ['Compression ignition of injected fuel', 'A petrol spark plug', 'The radio mute', 'Power steering fluid colour'],
          correct: 'a',
          hint: 'No spark plugs on a diesel.',
          explanation: 'Glow plugs / compression heat. Petrol needs a spark; diesel needs hot air.',
        },
      ],
      blanks: [
        {
          prompt: 'The four strokes are intake, compression, power, and ___.',
          answer: 'exhaust',
          hint: 'Spent gas leaves.',
          explanation: 'Intake–compression–power–exhaust.',
        },
      ],
      practice: {
        prompt: 'A 1.5 petrol has a misfire on cylinder 2. Anatomy-first checks?',
        options: [
          'Replace the gearbox',
          'Spark/injector, compression/leak-down, then timing — on that hole',
          'Fit a larger battery only',
          'Bypass the radiator',
        ],
        correct: 'b',
        hint: 'One cylinder.',
        explanation: 'Localise to the hole before you replace a used engine.',
      },
    },
    {
      slug: 'cooling',
      title: 'Cooling and lubrication loops',
      titleSw: 'Mizunguko ya baridi na mafuta',
      description: 'Radiator, pump, thermostat, jackets, oil film — two liquids, two jobs.',
      minutes: 28,
      examDomain: 'Cooling and lubrication',
      briefing:
        'Combustion heat would seize the engine without two loops. Coolant carries heat from jackets in the block and head to the radiator. Air through the core (ram air + fans) dumps that heat. The thermostat holds temperature until the engine is warm, then opens. The pump (belt or electric) moves the liquid. An expansion tank gives the system a place to grow and a place to bleed.\n\nPressure (cap rating) raises the boiling point. Test only to spec. Plastic tanks on aluminium cores fail at the crimp; copper/brass can be soldered. Blocked tubes make cold vertical stripes on a hot core.\n\nOil is a film, not just a level on the dipstick. The pump picks up from the sump, through a pickup screen, to galleries, bearings, and often a cooler or filter bypass. Low level, aeration, or a blocked pickup is a bearing death sentence. Coolant in oil or oil in coolant is a shared-wall failure: gasket, cracked head, or cracked block.\n\nBleed after any open repair. An air lock at the head or heater matrix looks like a “bad thermostat”. Fans and shrouds are part of the anatomy — a missing shroud is a highway overheat waiting in Nairobi traffic.',
      briefingSw:
        'Coolant inachukua joto kwenda radiator. Thermostat inafungua baada ya joto. Pump inasukuma. Mafuta ni filamu kwenye bearings. Hewa kwenye mfumo inaiga thermostat mbaya.',
      diagram: {
        kind: 'cooling',
        prompt: 'Label the cooling loop.',
        slots: [
          { id: 'rad', label: 'Radiator + fans', x: 18, y: 42 },
          { id: 'stat', label: 'Thermostat', x: 58, y: 26 },
          { id: 'jackets', label: 'Block jackets', x: 74, y: 54 },
        ],
        hint: 'Heat exchanger at the nose, valve in the engine, jackets in the metal.',
        explanation: 'Radiator rejects heat; thermostat times flow; jackets collect it.',
      },
      questions: [
        {
          prompt: 'The part that keeps coolant in the engine until it is warm is the:',
          options: ['Alternator', 'Thermostat', 'Handbrake cable', 'Pollen filter'],
          correct: 'b',
          hint: 'Temperature valve.',
          explanation: 'Thermostat. Stuck closed overheats; stuck open never warms and wastes fuel.',
        },
        {
          prompt: 'Oil’s primary job at the crank bearings is:',
          options: ['To paint the sump gold', 'A pressurised film that prevents metal-to-metal contact', 'To fill the radiator', 'To lock the differential'],
          correct: 'b',
          hint: 'Hydrodynamic film.',
          explanation: 'Pressure and viscosity make the film. Level and pump health matter.',
        },
      ],
      blanks: [
        {
          prompt: 'Heat leaves the coolant as air passes through the ___.',
          answer: 'radiator',
          hint: 'Core at the nose.',
          explanation: 'Radiator core + fans + shroud.',
        },
      ],
      practice: {
        prompt: 'After a hose change the dash gauge climbs in traffic. First anatomy move?',
        options: [
          'Fit a hotter thermostat immediately',
          'Bleed, confirm level/cap, fans, then flow — before parts roulette',
          'Remove the thermostat forever',
          'Add engine oil to the tank',
        ],
        correct: 'b',
        hint: 'Air and flow.',
        explanation: 'Open cooling systems trap air. Bleed and prove fans before you buy a pump.',
      },
    },
    {
      slug: 'drivetrain',
      title: 'Drivetrain: clutch, gears, shafts, differential',
      titleSw: 'Drivetrain: clutch, gia, shafts, diff',
      description: 'How crank torque becomes wheel rotation in FWD, RWD, and 4WD.',
      minutes: 26,
      examDomain: 'Driveline',
      briefing:
        'The drivetrain is everything after the crank flange: flywheel or flexplate, clutch or torque converter, gearbox, then shafts to a differential that splits torque to the wheels and allows them to turn at different speeds in a corner.\n\nFWD: transaxle in the engine bay, short driveshafts with CV joints to the front hubs. RWD: gearbox, propshaft with U-joints, rear axle/diff, then half-shafts. 4WD/AWD adds a transfer case or coupling and a second axle.\n\nGear ratios multiply torque. A slipping clutch smells and revs without road speed. A failed CV clicks on lock. A worn U-joint clunks on take-up. A locked diff or a broken spider gear is a corner hop or a bang.\n\nDo not confuse drivetrain vibration with engine misfire: road-speed vs engine-speed is the anatomy test. Support the engine/gearbox on the correct mounts before you chase a “vibration at 80”.',
      briefingSw:
        'Baada ya crank: flywheel, clutch au converter, gearbox, shafts, diff. FWD ina transaxle. RWD ina propshaft. Gia zinazidisha torque. CV inabofya kwenye lock.',
      diagram: {
        kind: 'drivetrain',
        prompt: 'Label how torque leaves the engine.',
        slots: [
          { id: 'gear', label: 'Gearbox', x: 38, y: 40 },
          { id: 'shaft', label: 'Prop / driveshafts', x: 62, y: 48 },
          { id: 'diff', label: 'Differential', x: 82, y: 58 },
        ],
        hint: 'Box, then shaft, then split to the wheels.',
        explanation: 'Gearbox, shaft, differential.',
      },
      questions: [
        {
          prompt: 'A differential exists so that:',
          options: [
            'Both wheels must always spin at one speed',
            'Driven wheels can rotate at different speeds in a turn',
            'The battery can charge faster',
            'Coolant can bypass the head',
          ],
          correct: 'b',
          hint: 'Inside vs outside wheel.',
          explanation: 'Without a diff, a driven axle fights itself in a corner.',
        },
        {
          prompt: 'FWD power typically leaves the gearbox through:',
          options: ['A long timber propshaft to a rear beam', 'Driveshafts with CV joints to the front hubs', 'The radiator fan clutch only', 'The handbrake cable'],
          correct: 'b',
          hint: 'Transaxle.',
          explanation: 'Front-wheel drive uses short CV shafts.',
        },
      ],
      blanks: [
        {
          prompt: 'The assembly that lets driven wheels turn at different speeds is the ___.',
          answer: 'differential',
          hint: 'Diff.',
          explanation: 'Differential / final drive.',
        },
      ],
      practice: {
        prompt: 'Clicking on full lock after a pothole, no engine misfire. Anatomy target?',
        options: ['Spark plugs', 'Outer CV joint / driveshaft', 'Radiator cap', 'Cabin pollen filter'],
        correct: 'b',
        hint: 'Corner, lock, click.',
        explanation: 'Classic CV. Confirm boot, play, and grease before you rebuild an engine.',
      },
    },
    {
      slug: 'brakes',
      title: 'Stop and steer: hydraulics, discs, suspension',
      titleSw: 'Simama na elekeza: hydraulics, discs, suspension',
      description: 'Pedal to pad, plus the corner that keeps the tyre on the road.',
      minutes: 28,
      examDomain: 'Brakes and chassis corners',
      briefing:
        'Brakes convert motion to heat. The pedal moves a booster (vacuum or electric) then a tandem master cylinder. Fluid in two circuits (diagonal or front/rear split) goes through lines, often an ABS modulator, to calipers (disc) or wheel cylinders (drum). Pads clamp a disc; shoes expand in a drum. A leaking hose or boiling old fluid is a long pedal.\n\nABS does not create grip; it limits lock so you can still steer. If the ABS light is on, you still have foundation brakes — but the anatomy of the modulator and sensors is now in play.\n\nThe same corner holds the hub, bearing, disc, caliper bracket, steering arm, spring, and damper. A warped disc complaint is often a hub face or a sticking slide. A pull under braking can be a seized caliper, a collapsed hose, or alignment after a bent arm.\n\nSteering: rack (or box), track rods, and geometry (toe, camber, caster). Suspension: spring supports the mass; damper controls the oscillation. Anatomy sites draw them together because a tyre only works when it is pointing and loaded correctly.',
      briefingSw:
        'Pedal → booster → master → mistari → caliper au drum. ABS haizai grip. Koner moja ina disc, bearing, spring, damper, na steering arm.',
      diagram: {
        kind: 'brakes',
        prompt: 'Label the hydraulic path to the corner.',
        slots: [
          { id: 'master', label: 'Master cylinder', x: 34, y: 20 },
          { id: 'caliper', label: 'Caliper + disc', x: 80, y: 64 },
          { id: 'susp', label: 'Spring / damper', x: 78, y: 26 },
        ],
        hint: 'Pressure starts at the master; clamp is at the disc.',
        explanation: 'Master, caliper, and the corner that holds the tyre down.',
      },
      questions: [
        {
          prompt: 'A tandem master cylinder is used so that:',
          options: [
            'One leak can still leave a second circuit',
            'The radio stays on',
            'The engine idles higher',
            'The differential locks',
          ],
          correct: 'a',
          hint: 'Split circuit.',
          explanation: 'Legal dual-circuit design. A single leak must not empty the whole system.',
        },
        {
          prompt: 'ABS is designed to:',
          options: ['Always shorten stopping on ice below foundation brakes', 'Limit lock so the driver can still steer', 'Replace pads automatically', 'Cool the radiator'],
          correct: 'b',
          hint: 'Steer while braking.',
          explanation: 'Anti-lock. On some surfaces stopping distance can grow; control is the point.',
        },
      ],
      blanks: [
        {
          prompt: 'Disc brakes use a ___ to squeeze the pads.',
          answer: 'caliper',
          hint: 'Clamp.',
          explanation: 'Caliper. Slides and piston seals are service items.',
        },
      ],
      practice: {
        prompt: 'Long pedal after a hose job, no warning lamp. First anatomy check?',
        options: [
          'Bleed and inspect for a leak or leftover air in the open circuit',
          'Fit a new gearbox',
          'Charge the air-con only',
          'Remove the thermostat',
        ],
        correct: 'a',
        hint: 'Hydraulics.',
        explanation: 'Open the system, you own the bleed. Then look for a drip you created.',
      },
    },
    {
      slug: 'electrical',
      title: 'Electrical nervous system: battery, alternator, loads',
      titleSw: 'Mfumo wa umeme: betri, alternator, loads',
      description: 'How cranking power and running power are two different jobs.',
      minutes: 26,
      examDomain: 'Vehicle electrical',
      briefing:
        'Think of the electrical system as a nervous system on a cutaway layer: battery (stored energy), starter (cranking load), alternator (running generation), distribution (cables, fusible links, boxes), controllers (ECU, body modules), and loads (lamps, pumps, ignition, infotainment).\n\nThe battery must crank and buffer. The alternator must cover running loads plus recharge. A “dead battery” after night parking can be a parasitic draw or a charging fault — measure voltage and current; do not guess.\n\nEarths are half the circuit. A painted earth or a chewed loom at the hatch hinge is a living anatomy lesson. Fuses protect wires, not your schedule: a repeated fuse is a short, not a market for a bigger fuse.\n\nStarting path: ignition/enable → starter relay → solenoid → pinion to ring gear. Charging path: belt → alternator → output cable → battery positive, with the ECU sometimes commanding the field.\n\nNever work live on an SRS airbag circuit. Disconnect and wait as the data says. Anatomy includes what you must not probe.',
      briefingSw:
        'Betri inahifadhi. Starter inazungusha. Alternator inazalisha injini ikiwaka. Earth ni nusu ya mzunguko. Fuse inalinda waya, si kazi yako.',
      diagram: {
        kind: 'electrical',
        prompt: 'Label the charging and cranking parts.',
        slots: [
          { id: 'batt', label: 'Battery', x: 16, y: 64 },
          { id: 'alt', label: 'Alternator', x: 36, y: 32 },
          { id: 'start', label: 'Starter', x: 42, y: 70 },
        ],
        hint: 'Store, generate, crank.',
        explanation: 'Battery stores, alternator generates, starter cranks.',
      },
      questions: [
        {
          prompt: 'While the engine runs, the main source of electrical energy should be the:',
          options: ['Phone charger', 'Alternator', 'Handbrake switch', 'Radiator cap'],
          correct: 'b',
          hint: 'Generator.',
          explanation: 'Alternator (or DC-DC on some hybrids). The battery buffers.',
        },
        {
          prompt: 'A fuse that blows again after you “upgrade” the rating is telling you:',
          options: ['The car wants more current', 'There is still a short or overload — fix the circuit', 'To fit steel wool', 'To disconnect the earths forever'],
          correct: 'b',
          hint: 'Protection.',
          explanation: 'The fuse is a designed weak point. Find the fault.',
        },
      ],
      blanks: [
        {
          prompt: 'The machine that converts belt rotation into charging current is the ___.',
          answer: 'alternator',
          hint: 'Generator on the front of the engine.',
          explanation: 'Alternator. Belt, pulley, regulator, and output cable are part of the same anatomy.',
        },
      ],
      practice: {
        prompt: 'Cranks slowly, lights dim, 11.2 V at rest. Anatomy-first action?',
        options: [
          'Replace the gearbox',
          'Test/charge/replace the battery and prove the charging circuit before more parts',
          'Bypass every fuse with wire',
          'Add coolant to the cells',
        ],
        correct: 'b',
        hint: 'Stored energy first.',
        explanation: 'Low rest voltage is a battery or parasitic story. Prove charge next.',
      },
    },
  ],
};
