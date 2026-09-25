import type { TradeProgramme } from './build';

export const automotiveProgramme: TradeProgramme = {
  id: 'automotive',
  title: 'Automotive mechanics',
  titleSw: 'Ufundi wa magari',
  description: 'Workshop lifting safety, service to manufacturer data, then brakes and a diagnosis path.',
  descriptionSw: 'Usalama wa kuinua, servisi, breki, na diagnosis.',
  icon: '🚗',
  modules: [
    {
      slug: 'safety',
      title: 'Garage safety and lifting',
      titleSw: 'Usalama wa garage na kuinua',
      description: 'Axle stands, batteries, running engines, and what a jack is for.',
      minutes: 18,
      cdacc: 'CU/AUT/CR/01/5',
      examDomain: 'Workshop safety',
      briefing:
        'A jack lifts; axle stands hold. Never work under a vehicle supported only by a trolley jack. Level ground, chock wheels, rated stands under specified points — not the oil pan, not rust. Gearbox in park/gear, parking brake as the procedure says (know when you must release it).\n\nBatteries: acid, hydrogen when charging, and shorting a ring across terminals. Disconnect earth first on many negative-earth vehicles when the job needs isolation. Fuel vapour plus grinders is a fire. Spinning fans and belts take fingers.\n\nPPE: boots, eye protection on grinders and springs. Coil springs store energy. Exhaust work on a running engine in a closed bay is carbon monoxide poisoning — extract.\n\nOil and brake fluid on the floor are slip hazards. Clean as you go. That is assessed.',
      briefingSw:
        'Jack inainua; axle stands zinashikilia. Chock. Usifanye kazi chini ya jack peke yake. Battery ina asidi. Usifanye exhaust kwenye garage iliyofungwa bila extraction.',
      questions: [
        {
          prompt: 'Before crawling under a car you must:',
          options: [
            'Leave it on a trolley jack only',
            'Support it with rated axle stands on a level surface and chock wheels',
            'Run the engine in gear',
            'Remove the handbrake so it can roll',
          ],
          correct: 'b',
          hint: 'Jacks fail.',
          explanation: 'Stands hold. Jacks lift. Non-negotiable in NITA/CDACC workshops.',
        },
        {
          prompt: 'When disconnecting a typical negative-earth battery you usually remove:',
          options: ['Positive first always', 'Earth/negative first to reduce short risk', 'Both at once with one spanner across', 'The alternator first always'],
          correct: 'b',
          hint: 'Last off, first on is the positive on many procedures.',
          explanation: 'Follow the vehicle data. The principle is not to short the spanner to earth on the live terminal.',
        },
        {
          prompt: 'Running an engine in a closed workshop without extraction risks:',
          options: ['Better idle', 'Carbon monoxide poisoning', 'Colder oil', 'Automatic wheel chocks'],
          correct: 'b',
          hint: 'CO.',
          explanation: 'Use extract hoses. CO is colourless.',
        },
        {
          prompt: 'A coil spring compressor job is dangerous because:',
          options: ['Springs are light', 'Stored energy can release violently', 'NITA bans springs', 'Oil likes springs'],
          correct: 'b',
          hint: 'Energy.',
          explanation: 'Use the correct tool. Never improvise with rope.',
        },
      ],
      blanks: [
        {
          prompt: 'After a jack lifts the car, the vehicle is held on axle ___.',
          answer: 'stands',
          hint: 'Rated supports.',
          explanation: 'Axle stands, not bricks, not spare wheels.',
        },
      ],
      practice: {
        prompt: 'A trainee crawls under a pickup on a jack on sloping ground to change oil. You:',
        options: [
          'Film it',
          'Stop the job, move to level ground, stands, chocks, then drain',
          'Rev the engine to empty faster',
          'Kick the jack to test it',
        ],
        correct: 'b',
        hint: 'Slope plus jack.',
        explanation: 'This is how vehicles come down. Reset the whole setup.',
      },
    },
    {
      slug: 'service',
      title: 'Service to manufacturer data',
      titleSw: 'Servisi kulingana na data',
      description: 'Oil grade, filters, torque, and not guessing the drain plug.',
      minutes: 18,
      cdacc: 'CU/AUT/CR/02/5',
      examDomain: 'Routine service',
      briefing:
        'Service is not “black oil out, any oil in”. Use the manufacturer grade (viscosity and spec), the filter that fits, and torque on the drain plug and filter. Over-torque strips the sump. Under-torque weeps. Replace crush washers when specified.\n\nSequence: protect the vehicle, record mileage, inspect leaks and tyres, then fluids. Dispose of oil as hazardous waste. Air filters and plugs follow the schedule, not the customer’s cousin.\n\nOn modern vehicles, a service light and torque-to-yield bolts need data. If you do not have the book or a trusted information system, you do not invent a torque.\n\nRoad test or at least start and check the oil level again after the first run — filters fill and the level drops.',
      briefingSw:
        'Tumia grade ya mafuta iliyoainishwa. Torque kwenye plug. Badilisha washer. Tupa mafuta kama hatari. Kagua level baada ya kuwasha injini.',
      questions: [
        {
          prompt: 'Engine oil should be selected from:',
          options: ['Whatever is cheapest that day', 'Manufacturer viscosity and specification', 'Brake fluid bottles', 'Cooking oil if it is 20W'],
          correct: 'b',
          hint: 'The handbook wins.',
          explanation: 'Wrong spec oil damages aftertreatment and bearings.',
        },
        {
          prompt: 'Drain plug torque matters because:',
          options: ['It is fashion', 'Stripped sumps and oil-on-road both start here', 'Oil likes loose plugs', 'Filters replace plugs'],
          correct: 'b',
          hint: 'Aluminium sumps.',
          explanation: 'Use a torque wrench. New washer when specified.',
        },
        {
          prompt: 'Used engine oil goes:',
          options: ['Down rainwater drains', 'Into designated waste oil storage', 'Into the radiator', 'On the canteen dust to keep it down'],
          correct: 'b',
          hint: 'Hazardous.',
          explanation: 'Illegal dumping is not a workshop skill.',
        },
        {
          prompt: 'After an oil and filter change you should:',
          options: ['Never start the engine', 'Run, recheck level and leaks', 'Fill to the brim of the filler cap', 'Disable the oil pressure switch'],
          correct: 'b',
          hint: 'Filter volume.',
          explanation: 'Dry filters take a litre. Check again.',
        },
      ],
      blanks: [
        {
          prompt: 'The turning force specified for a drain plug is measured as ___.',
          answer: 'torque',
          hint: 'N·m on the chart.',
          explanation: 'Torque is not “tight enough”.',
        },
      ],
      practice: {
        prompt: 'Customer wants “thicker oil” because the engine knocks. Compression is low. You should:',
        options: [
          'Pour 40W into a 5W-30 petrol engine and call it a repair',
          'Diagnose the knock; do not hide wear with the wrong oil',
          'Remove the oil pump',
          'Disconnect the knock sensor and add 2-stroke mix',
        ],
        correct: 'b',
        hint: 'Oil is not a mechanical repair.',
        explanation: 'Explain options. Wrong oil can damage catalysts and still knock.',
      },
    },
    {
      slug: 'brakes',
      title: 'Brakes, fluid, and diagnosis path',
      titleSw: 'Breki, fluid, na diagnosis',
      description: 'Complaint, evidence, cause, correction, test — especially pulls and fluid.',
      minutes: 20,
      cdacc: 'CU/AUT/CR/03/5',
      examDomain: 'Brakes & diagnosis',
      briefing:
        'Brake fluid is hygroscopic (it absorbs water) and it destroys paint. Wash spills immediately. Use the DOT spec on the cap. Do not mix DOT 5 silicone with DOT 3/4 systems. Bleed in the specified order until fluid is clean and firm.\n\nPads and discs: minimum thickness, even wear, no oil on friction material. A car that pulls left under braking is often one-sided: seized caliper, collapsed hose, contaminated pad — not “the engine is tired”.\n\nDiagnosis path: complaint, evidence (test drive if safe), inspect, measure, cause, correction, retest. Parts cannon without evidence wastes the customer and fails assessments.\n\nABS faults need scan data. Unplugging ABS “to make it stop pulling” is not a repair.',
      briefingSw:
        'Brake fluid inaharibu rangi na inanyonya maji. Fuata DOT. Pull upande mmoja: kagua caliper, hose, pad. Diagnosis: malalamiko, ushahidi, sababu, ukarabati, jaribio.',
      questions: [
        {
          prompt: 'Brake fluid on paint should be:',
          options: [
            'Ignored; it improves gloss',
            'Washed off immediately; it damages paint and is hygroscopic in the system',
            'Mixed into engine oil',
            'Used on the windscreen',
          ],
          correct: 'b',
          hint: 'Glycol fluids are aggressive.',
          explanation: 'Spill care plus the correct DOT type in the system.',
        },
        {
          prompt: 'A car pulls left when braking. Professional first path:',
          options: [
            'Replace the engine',
            'Inspect tyres, pads/discs, calipers, and hoses for a one-sided problem',
            'Disconnect ABS permanently',
            'Add oil to the radiator',
          ],
          correct: 'b',
          hint: 'Uneven braking is often one corner.',
          explanation: 'Evidence before parts.',
        },
        {
          prompt: 'Mixing DOT 5 (silicone) into a DOT 4 system is:',
          options: ['Always fine', 'Wrong — incompatible fluids', 'Required annually', 'A type of bleed'],
          correct: 'b',
          hint: 'Read the cap.',
          explanation: 'Incompatible fluids gel and fail.',
        },
        {
          prompt: 'After brake work you must:',
          options: ['Skip bleeding if you are late', 'Ensure a firm pedal and a safe test before handover', 'Disconnect a line for “feel”', 'Paint the discs'],
          correct: 'b',
          hint: 'Pedal.',
          explanation: 'Soft pedal is air or failure. Do not release the car.',
        },
      ],
      blanks: [
        {
          prompt: 'Brake fluid that absorbs water from the air is described as ___.',
          answer: 'hygroscopic',
          hint: 'Hydro-scopic in some papers; we use hygroscopic.',
          explanation: 'Water lowers boiling point and corrodes ABS units.',
        },
      ],
      practice: {
        prompt: 'Pedal goes to the floor after a pad change. Trainee pumps it 40 times and wants to send the car. You:',
        options: [
          'Send it — pumping is bleeding',
          'Do not release: find the leak or bleed properly until the pedal is firm',
          'Fit a wood block under the pedal',
          'Disconnect a caliper to raise the pedal',
        ],
        correct: 'b',
        hint: 'Soft pedal.',
        explanation: 'A floor pedal is a danger. Stay on the job.',
      },
    },
    {
      slug: 'cracked-block',
      title: 'Week 4 — Cracked engine block: prove, classify, repair or replace',
      titleSw: 'Wiki 4 — Engine block iliyopasuka',
      description: 'Pressure-test and inspect a suspected crack, then choose stitching, specialist welding, sealing, or replacement honestly.',
      minutes: 34,
      cdacc: 'CU/AUT/CR/04/5',
      examDomain: 'Engine block diagnosis & repair decision',
      briefing:
        'A cracked block is a diagnosis, not a guess made because coolant disappears. First rule out hoses, water pump, radiator, heater core, core plugs, head gasket, warped head, and porous gasket surfaces. Record the complaint: external leak, coolant in oil (“mayonnaise”), oil in coolant, white exhaust smoke, overheating, low compression, or combustion gas in the expansion tank. Never open a hot pressurised cooling system.\n\nClean and inspect. Cooling-system pressure test at the cap/manufacturer rating—not above it. Use UV dye if permitted. Combustion-leak/block-test fluid detects exhaust gas in coolant. Compression and leak-down help separate rings, valves, head gasket, head, and block. With the engine stripped, dye penetrant finds surface cracks on non-porous material; magnetic-particle inspection is for ferrous cast iron, not aluminium. A machine shop can pressure-test the bare casting and measure deck flatness.\n\nClassify location and material. Cast-iron cracks in a non-critical water jacket may be repaired by cold metal stitching: drill stop holes as specified, install overlapping locks/pins, peen and seal, then pressure-test and machine if needed. Specialist hot welding of cast iron requires complete stripping, controlled preheat, compatible nickel filler, slow cooling, and post-machining; an unheated bead often creates a new crack beside the weld. Aluminium blocks may be TIG repaired only by a specialist after contamination is removed and distortion control planned. Cracks through main-bearing webs, cylinder bores beyond repair limit, multiple freeze fractures, or a badly distorted deck often make replacement or a remanufactured short block safer and cheaper.\n\nChemical “stop leak” is not a structural repair. It can block heater cores and radiator tubes. It may be an emergency measure only when the product/manufacturer permits and the customer understands the limitation. Final proof: pressure test cold and hot, check oil/coolant separation, verify compression, cooling-fan operation, torque records, and road test while monitoring temperature. Quote repair versus replacement with labour, machining, gaskets, fluids, warranty, and downtime.',
      briefingSw:
        'Usikisie block imepasuka. Pressure-test mfumo, block test ya gesi, compression/leak-down, na inspect. Cast iron inaweza kushonwa kwa metal stitching au ku-weldiwa na specialist; aluminium TIG na specialist. Crack kwenye main-bearing web mara nyingi inahitaji replacement. Stop-leak si repair ya muundo.',
      questions: [
        {
          prompt: 'Coolant disappears and oil turns milky. Before condemning the block, the technician should:',
          options: [
            'Pour stop-leak and sell the car',
            'Pressure-test, test combustion gas, inspect the head gasket/head/block, and document evidence',
            'Weld the outside while the engine runs',
            'Replace the radiator cap only and guarantee it',
          ],
          correct: 'b',
          hint: 'Several faults mix oil and coolant.',
          explanation: 'A failed oil cooler, head gasket, cracked head, or block can produce similar symptoms. Evidence determines the repair.',
        },
        {
          prompt: 'Why is a short cold weld bead on cast iron risky?',
          options: [
            'Cast iron cannot melt',
            'Uneven thermal expansion and rapid cooling can create hard zones and a new crack',
            'Nickel filler is always plastic',
            'Coolant makes every weld stronger',
          ],
          correct: 'b',
          hint: 'Heat control.',
          explanation: 'Specialist procedures use preheat/slow cooling or cold stitching to manage brittle cast iron.',
        },
        {
          prompt: 'A crack through a main-bearing web should normally lead to:',
          options: [
            'Silicone on the outside',
            'Engineering assessment and usually replacement/remanufactured block',
            'A bigger radiator cap',
            'Grinding the bearing shell thinner',
          ],
          correct: 'b',
          hint: 'Structural alignment.',
          explanation: 'The main web locates the crankshaft under high cyclic load. Casual welding can destroy alignment and safety.',
        },
        {
          prompt: 'The final acceptance test after a water-jacket repair includes:',
          options: [
            'Paint only',
            'Pressure test, hot run, fluid-contamination check, temperature/fan check, and documented road test',
            'One idle minute with no cap',
            'Adding extra stop-leak',
          ],
          correct: 'b',
          hint: 'Prove the leak and overheating are gone.',
          explanation: 'A repair is incomplete until it holds pressure and the root cause of overheating is corrected.',
        },
      ],
      blanks: [
        {
          prompt: 'The cold cast-iron repair that installs overlapping pins or locks across a crack is metal ___.',
          answer: 'stitching',
          hint: 'It avoids a large heat-affected zone.',
          explanation: 'Metal stitching can repair selected non-critical cast-iron cracks after engineering assessment.',
        },
      ],
      practice: {
        prompt: 'A block has a 70 mm external water-jacket crack after freezing; main webs and bore are sound. Customer wants the cheapest permanent option. Best professional path?',
        options: [
          'Smear epoxy over coolant and hand it back',
          'Strip and inspect; obtain a machine-shop quote for approved cold stitching versus replacement, then pressure-test',
          'Arc-weld it cold with 6013 while assembled',
          'Raise the radiator-cap pressure',
        ],
        correct: 'b',
        hint: 'Repairability depends on location and verification.',
        explanation: 'A non-structural cast-iron water-jacket crack may be stitchable, but only after inspection and with a final pressure test.',
      },
      practical: {
        type: 'video',
        prompt:
          'Record a diagnostic demonstration on a training engine or mock-up: identify three possible coolant-loss sources, show safe pressure-tester setup, explain the maximum test pressure, and state repair-versus-replace criteria. Do not work on a hot engine.',
        minSeconds: 20,
        rubric: [
          'Engine is cold and PPE is visible',
          'Tester and cap rating are identified before pressurising',
          'At least three alternative leak causes are checked',
          'Crack location/material and repair limits are explained',
          'Final pressure and contamination checks are stated',
        ],
      },
    },
    {
      slug: 'radiator-repair',
      title: 'Week 5 — Radiator diagnosis, solder repair, plastic tanks, and flow',
      titleSw: 'Wiki 5 — Ukarabati wa radiator',
      description: 'Find the leak, identify copper/brass versus aluminium/plastic construction, repair within limits, flush, and test.',
      minutes: 32,
      cdacc: 'CU/AUT/CR/05/5',
      examDomain: 'Cooling-system radiator service',
      briefing:
        'Start cold. Inspect cap seal, neck, tanks, seams, tube-to-header joints, drain plug, mounts, fan shroud, hoses, and staining. Pressure-test only to the specified cap pressure; too much pressure can create the leak you claim to diagnose. Remove the radiator if access or tank testing requires it. Plug openings and use a regulated water/air bench tester; never apply unregulated compressor pressure. Submerge testing uses low regulated pressure and bubbles to locate leaks.\n\nConstruction decides the repair. Older copper/brass radiators can often be de-soldered, cleaned to bright metal, fluxed, and soft-soldered at a tank seam or tube-to-header joint. Control heat so adjacent solder does not release. Damaged tubes may be professionally pinched and soldered only within an acceptable percentage; too many blocked tubes reduce cooling and require a re-core. Flush flux residue and pressure-test again.\n\nModern aluminium cores with crimped plastic tanks are different. A split plastic tank, hardened gasket, broken neck, or damaged crimp usually needs a replacement tank/gasket by a radiator specialist—or complete radiator replacement. Epoxy on a hot pressurised tank is usually temporary and may fail suddenly. Aluminium tube repair needs correct aluminium brazing/TIG equipment and skill; overheating thin tubes creates a larger hole. Bent fins may be straightened carefully, but punctured tubes and internal blockage need specialist evaluation.\n\nDiagnose overheating beyond leaks: restricted core (temperature scan shows cold bands), external mud/insects, missing shroud, wrong fan direction, thermostat, pump impeller, air lock, head-gasket gas, wrong coolant mix, and weak cap. Final service: correct coolant type and ratio, bleed using manufacturer procedure, cabin heater hot, fan cycles, no bubbles/leaks, stable road-test temperature, and recovery bottle level rechecked after cool-down. Never release coolant to soil or drains.',
      briefingSw:
        'Anza radiator ikiwa baridi. Pressure-test hadi rating ya cap tu. Copper/brass inaweza kusolderiwa baada ya kusafishwa; aluminium/plastic tank mara nyingi hubadilishwa au specialist. Epoxy ni temporary. Kagua flow, fan, thermostat, pump, air lock, na coolant sahihi.',
      questions: [
        {
          prompt: 'A modern radiator has a split plastic top tank beside the hose neck. Best durable repair?',
          options: [
            'Heat it with an oxy-acetylene torch',
            'Replace the tank and seal professionally if serviceable, or replace the radiator',
            'Add engine oil to soften the plastic',
            'Fit a higher-pressure cap',
          ],
          correct: 'b',
          hint: 'Hot plastic tanks cycle pressure.',
          explanation: 'External glue is rarely a durable repair at a stressed neck. Replacement restores pressure integrity.',
        },
        {
          prompt: 'Cold vertical bands on a hot radiator during a controlled temperature scan suggest:',
          options: ['Perfect flow', 'Internally restricted tubes', 'A stronger fan belt', 'Too much brake fluid'],
          correct: 'b',
          hint: 'Coolant is not flowing through those rows.',
          explanation: 'Blocked tubes reduce effective core area and can cause overheating under load.',
        },
        {
          prompt: 'Why regulate air pressure during a submerged radiator test?',
          options: [
            'To make bubbles smaller for photographs only',
            'Unregulated shop air can rupture the core or tanks and injure the technician',
            'Radiators normally run at 8 bar',
            'Air has no stored energy',
          ],
          correct: 'b',
          hint: 'Use the cap rating and bench procedure.',
          explanation: 'Cooling systems operate at relatively low pressure. Shop compressors can exceed that many times.',
        },
        {
          prompt: 'After soldering a copper/brass seam, the next step is:',
          options: [
            'Paint immediately over active flux',
            'Clean flux residue, pressure-test, flush, refit, bleed, and verify temperature',
            'Remove the thermostat permanently',
            'Mix any coolant colours',
          ],
          correct: 'b',
          hint: 'Repair then prove.',
          explanation: 'Flux is corrosive, and a bench repair still needs system commissioning.',
        },
      ],
      blanks: [
        {
          prompt: 'Replacing the complete tube-and-fin centre of a repairable radiator is called a re-___.',
          answer: 'core',
          hint: 'Re-core.',
          explanation: 'A re-core keeps serviceable tanks while replacing a badly blocked or damaged core.',
        },
      ],
      practice: {
        prompt: 'Taxi overheats uphill. Radiator has no external leak, fan works, and thermal scan shows half the core cold. Best repair decision?',
        options: [
          'Fit a 25 psi cap',
          'Confirm restricted flow, then re-core or replace the radiator and correct coolant/contamination cause',
          'Drill holes through cold tubes',
          'Remove the fan shroud',
        ],
        correct: 'b',
        hint: 'Cold bands are lost heat-transfer area.',
        explanation: 'A blocked core is a flow defect. Higher pressure does not restore tube area.',
      },
      practical: {
        type: 'video',
        prompt:
          'Record a cold cooling-system inspection or bench mock-up: identify radiator construction, cap rating, four likely leak points, safe pressure-test steps, and the final bleed/test sequence.',
        minSeconds: 20,
        rubric: [
          'Cold-system warning and PPE are stated',
          'Copper/brass versus aluminium/plastic construction is identified',
          'Pressure limit and regulated tester are shown',
          'Repair and replacement limits are explained',
          'Coolant recovery, bleeding, and hot verification are included',
        ],
      },
    },
    {
      slug: 'rim-repair',
      title: 'Week 6 — Wheel rims: run-out, cracks, straightening limits, and safe rejection',
      titleSw: 'Wiki 6 — Rim: run-out, nyufa, na mipaka ya ukarabati',
      description: 'Inspect steel and alloy wheels, measure run-out, identify repairable damage, and reject safety-critical cracks.',
      minutes: 32,
      cdacc: 'CU/AUT/CR/06/5',
      examDomain: 'Wheel inspection and repair decision',
      briefing:
        'A rim is a safety-critical rotating part. Begin with tyre condition and pressure, wheel-nut torque, hub face, bearing play, and impact history. Remove the tyre for a complete crack inspection when damage is suspected. Clean without grinding away evidence. Inspect bead seats, flanges, spokes, centre bore, stud holes, and the inner barrel—many alloy cracks hide on the inner lip. Dye penetrant may be used on clean non-porous alloy following its instructions. Magnetic particle is only for suitable ferrous steel.\n\nMeasure radial run-out (up/down) and lateral run-out (side-to-side) with a dial indicator on a clean mounted wheel; compare with vehicle/wheel limits. First eliminate tyre variation, rust between wheel and hub, dirt, and bearing play. Balancing cannot correct a bent rim; it only compensates mass imbalance. A wheel that needs excessive weights deserves inspection.\n\nSteel rims with limited flange bends may be cold-straightened by trained personnel using controlled equipment, then checked for cracks, run-out, bead sealing, and coating damage. Do not heat a modern wheel with a torch: heat changes material properties and can start a crack. Alloy-wheel straightening/welding is specialist work. Cracks in spokes, hub/bolt area, multiple cracks, severe distortion, unknown previous welds, or manufacturer-prohibited repairs mean reject and replace. Even a repairable inner-lip crack needs alloy identification, controlled TIG procedure, machining, penetrant re-test, pressure/leak test, and run-out check by a qualified wheel repairer.\n\nNever weld a rim with the tyre fitted or inflated. Heat plus trapped pressure can explode the assembly. Deflate, remove valve core, demount tyre, and clean flammable tyre products before any authorised hot work. Final fit: correct wheel size/offset/load rating, clean hub, hand-start nuts, star sequence, calibrated torque wrench, tyre pressure, and torque recheck policy. Document a rejected wheel so it is not put back into stock.',
      briefingSw:
        'Rim ni sehemu ya usalama. Ondoa tyre ili kuona crack. Pima radial na lateral run-out kwa dial indicator. Balancing haisahihishi rim iliyopinda. Steel flange inaweza kunyooshwa na specialist; alloy crack inahitaji specialist. Crack kwenye spoke/hub mara nyingi reject. Usilehemu rim ikiwa tyre iko ndani.',
      questions: [
        {
          prompt: 'A crack runs from an alloy wheel stud hole toward a spoke. Correct decision?',
          options: [
            'Weld it with the tyre inflated',
            'Reject and replace unless the wheel manufacturer and a qualified engineering process explicitly permit repair',
            'Balance it with more weights',
            'Drill the stud hole larger',
          ],
          correct: 'b',
          hint: 'Hub and spoke carry structural load.',
          explanation: 'Cracks in the mounting centre/spokes are safety-critical and are generally not routine repair candidates.',
        },
        {
          prompt: 'Balancing a bent rim will:',
          options: [
            'Make the rim straight',
            'Only correct mass imbalance; excessive run-out remains',
            'Repair cracks',
            'Restore heat treatment',
          ],
          correct: 'b',
          hint: 'Balance is weight, run-out is geometry.',
          explanation: 'Measure run-out separately. Do not hide a geometric defect with weights.',
        },
        {
          prompt: 'Before any authorised welding on a wheel, the technician must:',
          options: [
            'Inflate to maximum pressure',
            'Deflate, remove valve core, demount the tyre, clean, and identify the alloy/procedure',
            'Leave tyre sealant inside',
            'Heat the whole wheel red',
          ],
          correct: 'b',
          hint: 'Pressure plus heat can kill.',
          explanation: 'Tyre assemblies can explode during hot work. Demounting is mandatory.',
        },
        {
          prompt: 'Lateral run-out is measured as:',
          options: [
            'Wheel movement side-to-side at the rim face',
            'Tyre pressure loss per month',
            'Vehicle ride height',
            'Brake-fluid boiling point',
          ],
          correct: 'a',
          hint: 'Lateral = sideways.',
          explanation: 'Radial run-out is up/down relative to the axis. Both use a fixed dial indicator.',
        },
      ],
      blanks: [
        {
          prompt: 'Side-to-side geometric wheel error measured by a dial indicator is lateral ___.',
          answer: 'run-out',
          hint: 'Not balance.',
          explanation: 'Run-out must be within the vehicle/wheel specification after any repair.',
        },
      ],
      practice: {
        prompt: 'Pothole impact: steel rim outer flange bent, no crack found after tyre removal, run-out above limit. Appropriate next step?',
        options: [
          'Hammer it while inflated',
          'Qualified cold straightening within limits, then crack inspection, run-out and bead-leak tests',
          'Torch heat until red',
          'Add 400 g of balance weights',
        ],
        correct: 'b',
        hint: 'Steel flange damage may be repairable with controlled equipment.',
        explanation: 'Repair is conditional on material, location, severity, and passing all final tests.',
      },
      practical: {
        type: 'video',
        prompt:
          'Record a wheel inspection on a removed, deflated training assembly: identify wheel material, inspect bead/spokes/hub/barrel, demonstrate radial and lateral run-out setup, and state three rejection criteria.',
        minSeconds: 20,
        rubric: [
          'Wheel is secured, deflated, and safe to inspect',
          'Material and all critical inspection zones are identified',
          'Dial indicator has a fixed base and correct contact point',
          'Radial versus lateral run-out is explained',
          'Hub/spoke cracks, severe distortion, and unsafe prior repairs are rejected',
        ],
      },
    },
  ],
};

export const hairdressingProgramme: TradeProgramme = {
  id: 'hairdressing',
  title: 'Hairdressing & beauty',
  titleSw: 'Urembo na nywele',
  description: 'Hygiene and consultation, chemical safety, then finishing and aftercare.',
  descriptionSw: 'Usafi, kemikali, na aftercare.',
  icon: '💇',
  modules: [
    {
      slug: 'hygiene',
      title: 'Hygiene, consultation, and professional conduct',
      titleSw: 'Usafi, ushauri, na maadili',
      description: 'Infection control, client record, and when to refuse a service.',
      minutes: 18,
      cdacc: 'CU/HBT/CR/01/5',
      examDomain: 'Salon hygiene',
      briefing:
        'Salon work is a health trade. Wash hands, sanitise or sterilise tools to the salon SOP, and change towels. Blood on a blade goes in a sharps container, not the general bin. Do not work with open wounds on your hands without covering as policy says.\n\nConsultation is assessment: scalp, history of relaxer/colour, allergies, and what the client actually wants. Photographs help. If the scalp is broken, you do not apply relaxer “gently”. Refuse, explain, reschedule or refer.\n\nRecords protect the client and the college: products, batch if required, and patch-test outcome. Gossip about a scalp condition is unprofessional.\n\nGowning and posture prevent product on clothes and injury to you during long cutting sessions.',
      briefingSw:
        'Osha mikono na taka vyombo. Consultation: kichwa, historia, mzio. Kama kichwa kimejeruhiwa, usitumie relaxer. Weka kumbukumbu. Usisemeaze hali ya mteja.',
      questions: [
        {
          prompt: 'Combs and scissors between clients should be:',
          options: [
            'Wiped on your uniform only',
            'Cleaned and disinfected to salon standard',
            'Shared wet with the next queue',
            'Stored in the till',
          ],
          correct: 'b',
          hint: 'Infection control.',
          explanation: 'Even “just a trim” has infection risk.',
        },
        {
          prompt: 'A client with open scalp sores wants a relaxer today. You:',
          options: [
            'Apply stronger product to burn infection',
            'Refuse the chemical service, explain risk, refer or reschedule after healing',
            'Cover sores with concealer and proceed',
            'Use kitchen lye',
          ],
          correct: 'b',
          hint: 'Broken skin.',
          explanation: 'Ethics: do not put sodium/calcium hydroxide on open skin.',
        },
        {
          prompt: 'Used blades belong in:',
          options: ['The towel skip', 'A sharps container', 'The client’s bag', 'The sink'],
          correct: 'b',
          hint: 'Sharps.',
          explanation: 'Needlestick and blade injuries are salon incidents too.',
        },
        {
          prompt: 'Consultation notes are kept because:',
          options: ['They fill a file', 'They record consent, products, and patch tests for safety and complaints', 'NITA bans talking', 'They replace hygiene'],
          correct: 'b',
          hint: 'Evidence.',
          explanation: 'If something goes wrong, the card matters.',
        },
      ],
      blanks: [
        {
          prompt: 'Checking a small area of skin before a full colour is a ___ test.',
          answer: 'patch',
          hint: 'Allergy check.',
          explanation: 'Patch tests prevent some severe reactions.',
        },
      ],
      practice: {
        prompt: 'A client demands you skip the patch test because they are late for a matatu. You:',
        options: [
          'Skip it to keep the tip',
          'Hold the policy: no required test, no chemical service',
          'Do a patch test on yourself instead',
          'Use extra peroxide to save time',
        ],
        correct: 'b',
        hint: 'Policy over speed.',
        explanation: 'Anaphylaxis is not worth a fare.',
      },
    },
    {
      slug: 'chemicals',
      title: 'Colour, relaxer, and chemical safety',
      titleSw: 'Rangi, relaxer, na kemikali',
      description: 'Patch test, mix ratios, timing, PPE, and never mixing unknown products.',
      minutes: 20,
      cdacc: 'CU/HBT/CR/02/5',
      examDomain: 'Chemical services',
      briefing:
        'Patch-test colour and some relaxers as the manufacturer and college require. Mix ratios (developer volumes) are chemistry. 40 volume is not a shortcut for 20 volume on a scalp. Timing starts when application is complete; over-processing burns.\n\nPPE: gloves, and apron. Bleach dust is not for inhaling. Do not mix products you cannot name. Never use metallic dye then oxidise without knowing the reaction risk.\n\nStrand tests tell you if the hair will survive. Overlapping relaxer on previously relaxed hair is a classic breakage. Apply to new growth as specified.\n\nEmergency: product in eyes — rinse and seek help. Keep SDS. Neutralise relaxer as directed; water alone is not always the full story.',
      briefingSw:
        'Fanya patch test. Fuata ratio ya developer. Usiweke 40 volume kichwani ovyo. PPE. Usichanganye bidhaa usizozifahamu. Strand test. Overlap ya relaxer inavunja nywele.',
      questions: [
        {
          prompt: 'Why is a patch test used before some colour services?',
          options: [
            'To bill extra time',
            'To check for allergic reaction before full-scalp application',
            'To bleach the floor',
            'NITA requires it for water only',
          ],
          correct: 'b',
          hint: 'Allergies can be severe.',
          explanation: 'Follow product timing. Document the result.',
        },
        {
          prompt: 'Overlapping relaxer onto already relaxed lengths often causes:',
          options: ['Extra shine only', 'Breakage', 'Permanent patch tests', 'Lower pH automatically'],
          correct: 'b',
          hint: 'Virgin vs processed.',
          explanation: 'Apply to new growth. Protect lengths.',
        },
        {
          prompt: 'Developer volume (10, 20, 30, 40) is mainly about:',
          options: ['Bottle size', 'Lift / oxidising strength — using too high on scalp burns', 'Water temperature', 'Comb colour'],
          correct: 'b',
          hint: 'Not a speed setting.',
          explanation: 'Wrong volume is a chemical burn risk.',
        },
        {
          prompt: 'If colour enters the eye you should:',
          options: ['Rub with a towel of bleach', 'Rinse with water and get medical help as SOP', 'Apply more colour to equalise', 'Ignore it'],
          correct: 'b',
          hint: 'First aid.',
          explanation: 'Stop the service. Irrigate. Record.',
        },
      ],
      blanks: [
        {
          prompt: 'A test on a small section of hair to see the result before full application is a ___ test.',
          answer: 'strand',
          hint: 'Not the skin patch test.',
          explanation: 'Strand tests check breakage and colour result.',
        },
      ],
      practice: {
        prompt: 'Hair snaps when you comb during relaxer processing. Trainee wants to leave it on “so it finishes”. You:',
        options: [
          'Leave it — breakage means it is working',
          'Rinse/neutralise immediately per manufacturer and treat as an emergency over-process',
          'Add more lye',
          'Blow-dry on high to strengthen',
        ],
        correct: 'b',
        hint: 'Stop the chemical.',
        explanation: 'Breakage during processing is a stop condition.',
      },
    },
    {
      slug: 'finish-salon',
      title: 'Cutting finish, styling heat, and aftercare',
      titleSw: 'Kumalizia kukata, heat, na aftercare',
      description: 'Balance, heat protection, and telling the client how to look after the work.',
      minutes: 16,
      cdacc: 'CU/HBT/CR/03/5',
      examDomain: 'Finish & aftercare',
      briefing:
        'A haircut is checked in the mirror and with the head in movement, not only on a still mannequin. Balance both sides. Cross-check. Do not hide a mistake with excessive thinning that will spike in two weeks.\n\nHeat tools: temperature suitable for the hair’s condition. Heat protectant is not optional on already chemical-processed hair. Burns on ears and necks are professionalism failures.\n\nAftercare: which shampoo, how soon to wash colour, how to sleep on a silk scarf if that is the method, and when to return. Selling a product is fine; lying about what the chemical did is not.\n\nClean the station before the next client. Hair on the floor is a slip and a hygiene fail.',
      briefingSw:
        'Kagua cut pande zote. Heat protectant kwenye nywele ya kemikali. Usiwasha masikio. Eleza aftercare. Safisha kituo kabla ya mteja mwingine.',
      questions: [
        {
          prompt: 'Cross-checking a haircut means:',
          options: ['Ignoring the longer side', 'Looking at the cut from another angle/section to find imbalance', 'Only using clippers', 'Wetting with relaxer'],
          correct: 'b',
          hint: 'Quality control.',
          explanation: 'Two views catch a heavy side.',
        },
        {
          prompt: 'High heat on chemically relaxed hair without protection often:',
          options: ['Adds protein', 'Causes dryness and breakage', 'Replaces conditioner forever', 'Lowers pH'],
          correct: 'b',
          hint: 'Processed hair is weaker.',
          explanation: 'Protect and lower temperature.',
        },
        {
          prompt: 'Aftercare is part of the service because:',
          options: ['Clients enjoy lectures', 'Home care decides whether the result lasts and stays healthy', 'NITA bans aftercare', 'It replaces patch tests'],
          correct: 'b',
          hint: 'The job continues at home.',
          explanation: 'Tell them what not to do for 48 hours as the product says.',
        },
        {
          prompt: 'Hair clippings on a wet floor are a:',
          options: ['Style', 'Slip and hygiene hazard', 'Patch test', 'Type of bond'],
          correct: 'b',
          hint: 'Housekeeping.',
          explanation: 'Sweep. Mop. Next client.',
        },
      ],
      blanks: [
        {
          prompt: 'A spray used before tongs or straighteners to reduce heat damage is heat ___.',
          answer: 'protectant',
          hint: 'Also heat protector.',
          explanation: 'Especially on chemically processed hair.',
        },
      ],
      practice: {
        prompt: 'Client hates the length after you cut. They asked for “a trim”. You cut 8 cm. Professional response?',
        options: [
          'Blame their hair',
          'Acknowledge the consultation failure, discuss realistic fix (style, wait, or further agreed cut), and record',
          'Relax the hair as compensation',
          'Refuse to look in the mirror',
        ],
        correct: 'b',
        hint: 'Consultation.',
        explanation: 'Show length with fingers first next time. Own the error.',
      },
    },
  ],
};

export const hospitalityProgramme: TradeProgramme = {
  id: 'hospitality',
  title: 'Food production & hospitality',
  titleSw: 'Upishi na ukarimu',
  description: 'Food hygiene and the danger zone, kitchen fire and knives, then service recovery.',
  descriptionSw: 'Usafi wa chakula, moto jikoni, na huduma.',
  icon: '🍳',
  modules: [
    {
      slug: 'hygiene-food',
      title: 'Food hygiene and temperature control',
      titleSw: 'Usafi wa chakula na joto',
      description: 'Danger zone, raw vs cooked, and cooling leftovers like a professional.',
      minutes: 18,
      cdacc: 'CU/FBP/CR/01/5',
      examDomain: 'Food hygiene',
      briefing:
        'The danger zone for bacterial growth is approximately 5–60 °C. Keep cold food cold and hot food hot. Do not leave cooked stew on the pass overnight “to cool slowly in a deep pot”. Cool quickly in shallow containers as taught, then refrigerate.\n\nSeparate raw and cooked: boards, knives, cloths. Colour-coded boards exist because chicken juice on a salad is an outbreak. Wash hands after raw protein, after the toilet, and after handling refuse.\n\nFIFO stock rotation. Date labels. A dented blown can is not a bargain. Report pest signs; do not hide droppings with a mat.\n\nPersonal hygiene: hair restrained, wounds covered with a waterproof dressing, no jewellery that falls in food. That is the unit, not extra politeness.',
      briefingSw:
        'Danger zone takriban 5–60 °C. Tenganisha mbichi na iliyopikwa. Poza haraka. FIFO. Funga vidonda. Funga nywele.',
      questions: [
        {
          prompt: 'The danger zone for bacterial growth in food is approximately:',
          options: ['Below 0 °C only', 'About 5 °C to 60 °C', 'Above 200 °C only', 'Room temperature is always safe'],
          correct: 'b',
          hint: 'Fridge vs hot-hold.',
          explanation: 'Time in the zone matters. Get through it quickly.',
        },
        {
          prompt: 'Raw chicken and salad should share:',
          options: ['The same board “if wiped”', 'Separate boards and utensils', 'The same cloth all service', 'A bucket of warm danger-zone water'],
          correct: 'b',
          hint: 'Cross-contamination.',
          explanation: 'Colour codes only work if you obey them.',
        },
        {
          prompt: 'FIFO means:',
          options: ['Fry in fat only', 'First in, first out — older stock used first', 'Finish in the oven', 'Fire in the pastry'],
          correct: 'b',
          hint: 'Rotation.',
          explanation: 'Date and rotate. Reduced waste and safer food.',
        },
        {
          prompt: 'A deep pot of stew cooling on the stove all night is a risk because:',
          options: ['It tastes better', 'The core stays in the danger zone for too long', 'Refrigerators dislike steel', 'NITA bans stew'],
          correct: 'b',
          hint: 'Cooling method.',
          explanation: 'Portion, shallow, chill. Then store.',
        },
      ],
      blanks: [
        {
          prompt: 'Using the oldest food first is the ___ system (four letters).',
          answer: 'FIFO',
          hint: 'First in, first out.',
          explanation: 'FIFO is stock rotation.',
        },
      ],
      practice: {
        prompt: 'A trainee uses the raw-meat board for chopping parsley because the green board is in the wash. You:',
        options: [
          'Allow it if they wipe with their apron',
          'Stop: wash a clean board or delay; do not contaminate ready-to-eat food',
          'Rinse parsley in the chicken sink',
          'Serve extra chilli to kill bacteria',
        ],
        correct: 'b',
        hint: 'Ready-to-eat.',
        explanation: 'Chilli does not sanitise Salmonella. Get a clean board.',
      },
    },
    {
      slug: 'kitchen-safety',
      title: 'Knives, fire, and kitchen hazards',
      titleSw: 'Visu, moto, na hatari jikoni',
      description: 'Fat fires, carry knives down, and never a wet floor plus a run.',
      minutes: 18,
      cdacc: 'CU/FBP/CR/02/5',
      examDomain: 'Kitchen safety',
      briefing:
        'A chip-pan / fat fire is fought by turning off heat if safe, covering with a lid, and using the correct extinguisher. Never water — it explodes the oil into a fireball. Know the extinguisher types in your kitchen.\n\nKnives: carry point down, pass handle first, cut on a stable board with fingers tucked. A falling knife is not caught. Sharp knives are safer than dull ones because they do not slip.\n\nFloors: clean spills immediately. “I’ll mop at close” is how ankles break mid-service. Lids on pots, handles inward, and dry cloths on hot handles.\n\nFirst aid box and burns protocol. Oil burns are serious. Cool with running water as trained, then report.',
      briefingSw:
        'Usitumie maji kwenye moto wa mafuta. Funika na zima moto. Chukua kisu ncha chini. Futa mafuriko mara moja. Visu vikali ni salama kuliko butu.',
      questions: [
        {
          prompt: 'A chip-pan fire should be fought by:',
          options: [
            'Throwing a mug of water',
            'Turning off heat if safe, covering, correct extinguisher — never water',
            'Carrying the pan through the dining room',
            'Blowing on it',
          ],
          correct: 'b',
          hint: 'Water plus hot oil.',
          explanation: 'Steam expansion spreads burning fat.',
        },
        {
          prompt: 'You should carry a knife:',
          options: ['Swinging at shoulder height', 'Point down, close to your side', 'In your teeth', 'Hidden in a towel with the point out'],
          correct: 'b',
          hint: 'If you trip.',
          explanation: 'Point down. Announce “back” in a crowded pass.',
        },
        {
          prompt: 'A dull knife is more dangerous because it:',
          options: ['Is heavier', 'Slips off the food into your hand', 'Cools the stove', 'Sanitises boards'],
          correct: 'b',
          hint: 'Force and slip.',
          explanation: 'Hone and sharpen. Do not saw tomatoes with a spoon-edge.',
        },
        {
          prompt: 'Oil on the pass floor should be:',
          options: ['Left as seasoning', 'Cleaned immediately and the area signed if needed', 'Covered with more flour only', 'Ignored until tomorrow'],
          correct: 'b',
          hint: 'Slips.',
          explanation: 'Service speed does not outrank a broken arm.',
        },
      ],
      blanks: [
        {
          prompt: 'Putting a lid on a pan of burning fat starves the fire of ___.',
          answer: 'oxygen',
          hint: 'Fire triangle.',
          explanation: 'Covering is the first move if it is safe.',
        },
      ],
      practice: {
        prompt: 'A pan of oil has ignited. A commis reaches for a jug of water. You:',
        options: [
          'Help pour',
          'Stop them, lid on, heat off if reachable, alarm if it grows',
          'Carry the pan to the dining room',
          'Add flour explosively',
        ],
        correct: 'b',
        hint: 'No water.',
        explanation: 'Take over the procedure. Water is the wrong reflex.',
      },
    },
    {
      slug: 'service',
      title: 'Service, mise en place, and complaints',
      titleSw: 'Huduma, mise en place, na malalamiko',
      description: 'Prepare, greet, serve, and recover when something is wrong.',
      minutes: 16,
      cdacc: 'CU/FBP/CR/03/5',
      examDomain: 'Food service',
      briefing:
        'Mise en place means everything in its place before service: garnishes cut, stations stocked, glasses polished. Panic during service is usually poor prep, not fate.\n\nGreet, inform, and serve from the correct side as the style requires. Hot plates are warned. Dietary needs are not a joke — allergen contamination can hospitalise.\n\nComplaints: listen, apologise without arguing, replace or remove, tell the supervisor, log. A hair in soup is not a debate about protein. The guest is not always right about the recipe, but they are always heard.\n\nClose-down is hygiene: labelling, temperatures, and a clean pass so the morning brigade does not inherit your mess.',
      briefingSw:
        'Mise en place kabla ya service. Allergens ni hatari. Malalamiko: sikiliza, samahani, badilisha, log. Usibishane kuhusu nywele kwenye supu.',
      questions: [
        {
          prompt: 'Mise en place is:',
          options: ['A type of pastry', 'Preparation so service is not a scramble', 'Mopping after close only', 'A French complaint'],
          correct: 'b',
          hint: 'Before service.',
          explanation: 'Prep is the job. Service is the test of prep.',
        },
        {
          prompt: 'A guest finds a hair in soup. Professional response:',
          options: [
            'Argue that protein looks like hair',
            'Apologise, remove, replace, and log with the supervisor',
            'Discount nothing and laugh',
            'Blame the guest',
          ],
          correct: 'b',
          hint: 'Service recovery.',
          explanation: 'Own it. Fix the kitchen check that failed.',
        },
        {
          prompt: 'A peanut allergy must be treated as:',
          options: ['Pickiness', 'A safety specification — avoid cross-contact', 'Solved by extra chilli', 'Only a front-of-house issue'],
          correct: 'b',
          hint: 'Anaphylaxis.',
          explanation: 'Tell the kitchen. Use clean utensils. If unsure, do not serve.',
        },
        {
          prompt: 'Arguing with a guest about a cold plate usually:',
          options: ['Improves the brand', 'Makes the situation worse — fix and follow up', 'Is required in exams', 'Replaces mise en place'],
          correct: 'b',
          hint: 'Recovery.',
          explanation: 'Replace the plate. Train the pass. Do not win the argument.',
        },
      ],
      blanks: [
        {
          prompt: 'Having tools and garnishes ready before service is mise en ___.',
          answer: 'place',
          hint: 'French: putting in place.',
          explanation: 'Mise en place is professional prep.',
        },
      ],
      practice: {
        prompt: 'Kitchen sent fish to a guest who asked for no fish (religion). It is already on the table. You:',
        options: [
          'Tell them to pick it off',
          'Remove immediately, apologise, get a correct meal, inform chef, log the error',
          'Offer extra tartare as compensation only',
          'Hide the fish under salad',
        ],
        correct: 'b',
        hint: 'Respect plus hygiene.',
        explanation: 'Do not negotiate belief or contamination. Replace the dish.',
      },
    },
  ],
};

export const agricultureProgramme: TradeProgramme = {
  id: 'agriculture',
  title: 'Agriculture & agribusiness',
  titleSw: 'Kilimo na biashara ya kilimo',
  description: 'Soil and husbandry, agrochemical safety, then records and marketing of the harvest.',
  descriptionSw: 'Udongo, dawa, na kumbukumbu za biashara.',
  icon: '🌾',
  modules: [
    {
      slug: 'husbandry',
      title: 'Soil, water, and crop husbandry',
      titleSw: 'Udongo, maji, na mazao',
      description: 'pH, fertiliser sense, rotation, and not drowning a seedbed.',
      minutes: 18,
      cdacc: 'CU/AGR/CR/01/5',
      examDomain: 'Crop production',
      briefing:
        'Know your soil. pH and texture decide whether fertiliser is used or wasted. Overdosing nitrogen burns and pollutes water. Follow a recommendation, not “more is greener”. Organic matter and drainage matter as much as a bag of DAP.\n\nCrop rotation breaks pest cycles and balances nutrients. Planting the same family on the same plot every season trains pests. Spacing and seed rate are on the packet or the local recommendation — crowding makes weak stems and disease.\n\nWater: irrigate to the root zone. Little-and-often on a baked crust can still stress plants. Mulch to reduce evaporation where taught.\n\nIdentify the crop stage. Spraying a flowering crop with the wrong product kills pollinators and can void a market standard.',
      briefingSw:
        'Jua pH ya udongo. Mbolea nyingi si bora. Zungusha mazao. Fuata seed rate. Mwagilia kwenye mizizi. Usinyunyize dawa ovyo wakati wa maua.',
      questions: [
        {
          prompt: 'Crop rotation is used mainly to:',
          options: [
            'Confuse the market',
            'Break pest/disease cycles and balance soil nutrients',
            'Avoid paying labour',
            'Stop rainfall',
          ],
          correct: 'b',
          hint: 'Pests follow the crop.',
          explanation: 'Changing families of crops reduces host-specific pests.',
        },
        {
          prompt: 'Too much nitrogen fertiliser often:',
          options: ['Always increases profit', 'Burns plants and can pollute water', 'Replaces weeding forever', 'Raises pH to 14 safely'],
          correct: 'b',
          hint: 'More is not always better.',
          explanation: 'Use recommended rates. Split applications as taught.',
        },
        {
          prompt: 'Seed rate on a packet exists to:',
          options: ['Decorate', 'Set population for yield and disease control', 'Confuse TVET', 'Replace soil tests'],
          correct: 'b',
          hint: 'Spacing.',
          explanation: 'Too dense: disease. Too thin: weeds and low yield.',
        },
        {
          prompt: 'Irrigating only the soil surface on a hot day can still fail because:',
          options: ['Roots need water at depth', 'Leaves drink first always', 'Mulch is illegal', 'pH becomes rainfall'],
          correct: 'a',
          hint: 'Root zone.',
          explanation: 'Check moisture where roots are, not just the crust.',
        },
      ],
      blanks: [
        {
          prompt: 'Soil acidity or alkalinity is measured as ___.',
          answer: 'pH',
          hint: 'A scale around 7 is neutral.',
          explanation: 'pH affects nutrient availability. Test before dumping lime or acidifying fertiliser.',
        },
      ],
      practice: {
        prompt: 'Maize leaves yellow in a waterlogged corner. Trainee wants more CAN. You:',
        options: [
          'Broadcast extra nitrogen on the mud',
          'Improve drainage/oxygen first; fertiliser on waterlogged roots is wasted',
          'Plant tomatoes in the same hole this week',
          'Spray herbicide on the yellow as fertiliser',
        ],
        correct: 'b',
        hint: 'Waterlogging.',
        explanation: 'Yellow can be nitrogen, but drowning roots cannot take it up. Diagnose the site.',
      },
    },
    {
      slug: 'chemicals-farm',
      title: 'Agrochemicals, PPE, and spraying',
      titleSw: 'Dawa, PPE, na kunyunyiza',
      description: 'Original containers, no wind toward a school, and never a soda-bottle store.',
      minutes: 18,
      cdacc: 'CU/AGR/CR/02/5',
      examDomain: 'Pesticide safety',
      briefing:
        'Pesticides are poisons with a label. Keep original labelled containers locked. A soda bottle of herbicide is how children die. Measure with dedicated equipment, not kitchen spoons that return to the canteen.\n\nPPE: gloves, boots, overall, and the mask specified for the product — not a handkerchief. Mix in air, not in a store. Triple-rinse containers as taught; do not dump washings in a river.\n\nDo not spray in wind toward people, water, or food. Buffer zones exist. Mixing two unlabelled leftovers is not IPM, it is gambling.\n\nRe-entry intervals: the time before people can enter a sprayed field. Ignore that and you poison the weeding gang.',
      briefingSw:
        'Weka dawa kwenye chombo asili chenye lebo. PPE. Usiweke dawa kwenye chupa ya soda. Usinyunyize upepo kuelekea shule. Fuata muda wa kurudi shambani.',
      questions: [
        {
          prompt: 'Why should pesticide never be stored in a soda bottle?',
          options: [
            'It tastes better in the jerrycan',
            'Someone may drink it; original labelled containers prevent poisoning',
            'NITA bans plastic',
            'It reduces nitrogen',
          ],
          correct: 'b',
          hint: 'Tragic mix-ups.',
          explanation: 'Keep labels. Lock the store.',
        },
        {
          prompt: 'You are asked to spray on a windy afternoon next to a school. You:',
          options: [
            'Spray extra so it carries further',
            'Postpone; do not spray in wind toward people, water, or food',
            'Remove the nozzle filter and spray anyway',
            'Mix two unlabelled chemicals to save a trip',
          ],
          correct: 'b',
          hint: 'Drift.',
          explanation: 'Wind plus schoolgrounds is a stop condition.',
        },
        {
          prompt: 'Triple-rinsing empty pesticide containers is to:',
          options: ['Make them toys', 'Reduce residue before disposal as instructed', 'Collect drinking water', 'Raise soil pH'],
          correct: 'b',
          hint: 'Residue.',
          explanation: 'Then dispose as hazardous, not in the household pit casually.',
        },
        {
          prompt: 'Re-entry interval is:',
          options: ['The length of the boom', 'How long until people may enter the sprayed crop', 'Rainfall in millimetres', 'A type of fertiliser'],
          correct: 'b',
          hint: 'People vs residue.',
          explanation: 'Read the label. Keep people out until it is safe.',
        },
      ],
      blanks: [
        {
          prompt: 'Keeping pesticide in the factory bottle with the paper instructions still on it means keeping the original ___.',
          answer: 'label',
          hint: 'The label is the law of that bottle.',
          explanation: 'Unlabelled liquids are an emergency waiting.',
        },
      ],
      practice: {
        prompt: 'A classmate mixes leftover insecticide and herbicide in one sprayer “to save water”. You:',
        options: [
          'Help shake it',
          'Stop: unknown tank mixes can be toxic and illegal; follow labels or agronomist advice',
          'Add petrol as a sticker',
          'Spray toward the river to dilute',
        ],
        correct: 'b',
        hint: 'Tank mix.',
        explanation: 'Compatibility is a science. Unlabelled mixes are reckless.',
      },
    },
    {
      slug: 'business',
      title: 'Records, costs, and selling the crop',
      titleSw: 'Kumbukumbu, gharama, na soko',
      description: 'Agribusiness is numbers: inputs, yields, spoilage, and a market, not only planting.',
      minutes: 16,
      cdacc: 'CU/AGR/CR/03/5',
      examDomain: 'Agribusiness',
      briefing:
        'A farm without records is a hobby. Write seed, fertiliser, labour, water, and chemical costs. Weigh or count yields. Then you can say whether the enterprise made money.\n\nPost-harvest: drying, storage pests, and clean bags. Aflatoxin in poorly dried maize is a health and market disaster. Grade produce; mixing rotten tomatoes with good ones loses the whole crate.\n\nMarketing: know the buyer’s standard (size, pesticide PHI — pre-harvest interval). Selling before PHI is how consignments get rejected and people get poisoned.\n\nSimple cash flow: money for harvest labour must exist before the broker pays. That is agribusiness, not “the rain will provide”.',
      briefingSw:
        'Andika gharama na mavuno. Kausha na hifadhi vizuri. Usiuze kabla ya PHI. Usichanganye mazao mabovu na mazuri. Biashara ni hesabu.',
      questions: [
        {
          prompt: 'Pre-harvest interval (PHI) is:',
          options: [
            'How long to wait after spraying before harvest',
            'The length of the shamba',
            'A bank loan',
            'pH of the market',
          ],
          correct: 'a',
          hint: 'Residue on food.',
          explanation: 'Harvest too soon and you sell poison.',
        },
        {
          prompt: 'Mixing rotten and good fruit in one crate usually:',
          options: ['Saves the rotten', 'Spreads spoilage and loses grade', 'Raises price', 'Replaces drying'],
          correct: 'b',
          hint: 'One bad tomato.',
          explanation: 'Grade. Then pack.',
        },
        {
          prompt: 'Farm records should include:',
          options: ['Only WhatsApp jokes', 'Inputs, dates, quantities, yields, and sales', 'The neighbour’s PIN', 'Rainfall on the moon'],
          correct: 'b',
          hint: 'Numbers.',
          explanation: 'Without records you cannot improve or access some finance.',
        },
        {
          prompt: 'Poorly dried maize in store is a risk for:',
          options: ['Extra protein', 'Mould / aflatoxin and market rejection', 'Higher germination in the plate', 'Lower labour'],
          correct: 'b',
          hint: 'Moisture plus fungus.',
          explanation: 'Dry, clean, inspect. Aflatoxin kills and closes markets.',
        },
      ],
      blanks: [
        {
          prompt: 'The wait between last spray and picking the crop is the pre-harvest ___.',
          answer: 'interval',
          hint: 'PHI.',
          explanation: 'PHI protects the eater and the sale.',
        },
      ],
      practice: {
        prompt: 'A broker offers a higher price if you harvest tomatoes two days after spraying a pesticide with a 7-day PHI. You:',
        options: [
          'Take the price',
          'Refuse; harvest after PHI even if the price drops',
          'Wash once and call it organic',
          'Spray again to be sure',
        ],
        correct: 'b',
        hint: 'Food safety over cash today.',
        explanation: 'This is professional ethics in agribusiness.',
      },
    },
  ],
};
