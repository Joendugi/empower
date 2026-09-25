import type { TradeProgramme } from './build';

export const sewingProgramme: TradeProgramme = {
  id: 'sewing-garment',
  title: 'Fashion design & garment making',
  titleSw: 'Ushonaji na ubunifu wa nguo',
  description:
    'Semester-style CDACC fashion cores: machine, textiles, sketching, pattern, grading, construction, ladies wear, gents wear, then fitting and finishing — about a year of workshop units plus attachment later.',
  descriptionSw:
    'Mtaala wa semester wa fashion: mashine, nguo, mchoro, pattern, grading, ujenzi, nguo za wanawake na wanaume, kisha fitting.',
  icon: '🧵',
  modules: [
    {
      slug: 'machine',
      title: 'Lockstitch machine and workshop safety',
      titleSw: 'Mashine ya lockstitch na usalama',
      description: 'Needles, irons, threading, stitch length, and tension before you sew a garment.',
      minutes: 20,
      cdacc: 'CU/FAS/CR/01/5',
      examDomain: 'Machine skills & OSHA',
      media: [{ kind: 'animation', preset: 'stitch', caption: 'Lockstitch path — needle, hook, and bobbin must meet in time.' }],
      watchMedia: [
        {
          kind: 'animation',
          preset: 'stitch',
          mustFinish: true,
          caption: 'Confirm the stitch path before the written items.',
        },
      ],
      watchPrompt: 'Watch the stitch animation, then confirm you can explain how a lockstitch is formed.',
      briefing:
        'Fashion practicals start at the table, not at the pattern. Unplug the iron when you leave the board. Cover the needle, and never sew with the presser foot up. A lockstitch machine forms a stitch when the needle thread loops around the bobbin thread. If the machine is threaded wrong — especially missing the take-up lever — you get bird’s nests, skipped stitches, or a jammed hook.\n\nNeedle size must match fabric: 70/10 or 80/12 for shirting, 90/14 or 100/16 for denim and canvas. A blunt or bent needle on heavy cloth is the usual cause of skipped stitches, not “the machine is old”. Stitch length is typically 2.0–2.5 mm for construction seams and longer for basting. Tension discs must be closed when you thread; the thread sits between them, not on top.\n\nBobbin winding should be even. Drop the bobbin so it rotates the way the machine manual shows, pull the thread through the slot, and hold both threads to the back before the first stitch. At the end of a seam, reverse two or three stitches, then cut threads with the thread cutter or snips — not by yanking the garment.\n\nCDACC/NITA assessors watch whether you can thread independently, sew a straight seam on calico, and leave the station safe. That is the first unit, before any fashion drawing.',
      briefingSw:
        'Anza na usalama: zima pasi, funika sindano. Lockstitch inahitaji uzi wa needle na bobbin kukutana. Chagua sindano kulingana na kitambaa: 80/12 kwa shirting, 90/14 au 100/16 kwa denim. Tension na take-up lever ni muhimu. Kadiria stitch 2.0–2.5 mm. Wakaguzi wanatazama kama unaweza kushona mshono sawa na kuacha meza salama.',
      questions: [
        {
          prompt: 'A lockstitch skips on denim. What should you check first?',
          options: [
            'The classroom Wi-Fi',
            'Needle size and condition, threading path, and tension discs',
            'Whether the mannequin is new',
            'Pinking shears only',
          ],
          correct: 'b',
          hint: 'Skipped stitches are mechanical, not decorative.',
          explanation: 'Heavy fabric needs a larger, sharp needle, a complete thread path through the take-up, and balanced tension.',
        },
        {
          prompt: 'Why must the presser foot be down before you sew?',
          options: [
            'It looks professional in photos',
            'It holds fabric and engages the top tension so stitches form correctly',
            'It cools the motor',
            'NITA bans feet-up sewing only at night',
          ],
          correct: 'b',
          hint: 'Tension is not applied with the foot up on most lockstitch machines.',
          explanation: 'Sewing with the foot up gives loops, poor feed, and broken needles.',
        },
        {
          prompt: 'Typical construction stitch length on woven shirting is about:',
          options: ['0.2 mm', '2.0–2.5 mm', '12 mm', 'One stitch per collar'],
          correct: 'b',
          hint: 'Basting is longer; construction is medium.',
          explanation: 'About 2–2.5 mm (roughly 10–12 SPI) is standard. Tiny stitches perforate; huge stitches look homemade and weak.',
        },
        {
          prompt: 'When you leave the ironing board you should:',
          options: [
            'Leave the iron face-down on the garment',
            'Stand the iron safely and unplug as required by workshop rules',
            'Spray water on the element',
            'Balance it on the machine bed',
          ],
          correct: 'b',
          hint: 'Burns and fires start from abandoned irons.',
          explanation: 'College workshops treat a live iron as a fire source. Unplug and set it on the rest.',
        },
      ],
      blanks: [
        {
          prompt: 'The lower thread supply that meets the needle thread in a lockstitch is wound on a ___.',
          answer: 'bobbin',
          hint: 'Small metal or plastic spool under the needle plate.',
          explanation: 'Needle thread and bobbin thread lock in the fabric. Wrong bobbin insertion causes loops underneath.',
        },
      ],
      practice: {
        prompt: 'A trainee’s first seam is a nest of loops on the underside. The top looks almost straight. What is the professional diagnosis?',
        options: [
          'Buy a new machine immediately',
          'Re-thread the top path (take-up and tension) and re-seat the bobbin case',
          'Increase stitch length to 8 mm and ignore it',
          'Oil the fabric',
        ],
        correct: 'b',
        hint: 'Loops underneath usually mean top threading or tension, not a new motor.',
        explanation: 'Underside looping is the classic “top thread not in tension / missed take-up” fault. Re-thread with the foot up, then down, and test on scrap.',
      },
    },
    {
      slug: 'pattern',
      title: 'Pattern, grain, and cutting',
      titleSw: 'Pattern, grain, na kukata',
      description: 'Lay, grainline, notches, 1.5 cm seam allowance, and economical cutting.',
      minutes: 20,
      cdacc: 'CU/FAS/CR/02/5',
      examDomain: 'Pattern & cutting',
      briefing:
        'A garment is decided on the table before a single stitch. Patterns carry grainlines, notches, drill holes, size, and cutting instructions. The grainline must sit parallel to the selvedge (or to the warp on a folded length). Off-grain collars twist; off-grain trousers twist around the leg.\n\nStandard woven seam allowance in many TVET practicals is 1.5 cm (sometimes 1 cm on necklines after staystitching — follow the pattern). Hem allowances are larger and must be planned, not guessed at the floor. Fold fabric right sides together unless the lay plan says otherwise. Pin inside the allowance, not on the stitch line, and cut with the shears resting on the table — don’t lift the cloth and chew it in the air.\n\nNotches match pieces: one notch often means a front, two a back, or they mark ease. Transfer markings with tailor’s tacks, chalk, or a tracing wheel as taught. Staystitch curved necks and armholes 5 mm from the edge, in the direction that stops stretch, before you handle the piece a lot.\n\nAssessors look at a clean lay: little waste, all pieces facing the planned nap/print direction, and no missing facings. Count pieces against the pattern chart before you move the waste.',
      briefingSw:
        'Grainline inafaa kuwa sambamba na selvedge. Seam allowance ya kawaida ni 1.5 cm. Kata kitambaa mezani, si hewani. Notches zinalinganisha vipande. Staystitch shingo kabla ya kushughulikia. Hesabu vipande kulingana na chart kabla ya kutupa waste.',
      questions: [
        {
          prompt: 'What is the usual seam allowance for most woven garments in TVET practicals?',
          options: ['0.3 cm', '1.5 cm', '5 cm', '10 cm'],
          correct: 'b',
          hint: 'About a finger joint, not a hem.',
          explanation: '1.5 cm is the common woven construction allowance before fitting changes.',
        },
        {
          prompt: 'If a grainline is not parallel to the selvedge, the garment may:',
          options: ['Sew faster', 'Twist or hang crooked after pressing', 'Never need notches', 'Become waterproof'],
          correct: 'b',
          hint: 'Fabric wants to return to true grain.',
          explanation: 'Off-grain cutting is a classic cause of twisting trousers, rolling hems, and collars that will not sit.',
        },
        {
          prompt: 'Staystitching on a neckline is done to:',
          options: [
            'Decorate the inside',
            'Stabilise a bias or curved edge so it does not stretch before joining',
            'Replace the facing',
            'Shorten the grainline',
          ],
          correct: 'b',
          hint: 'Curves stretch on the bias.',
          explanation: 'A row of stitching just inside the seam line keeps the neck the drafted size.',
        },
        {
          prompt: 'Why pin inside the seam allowance rather than through the stitch line?',
          options: [
            'Pins on the stitch line can leave holes and shift the seam when you sew over them',
            'Pins are illegal in CDACC exams',
            'It uses more pins',
            'It hides notches',
          ],
          correct: 'a',
          hint: 'The needle should not fight metal on the stitch path if you can avoid it.',
          explanation: 'Many trainers require pins removed as you sew. Never sew over a pin if the rule is “remove as you go”.',
        },
      ],
      blanks: [
        {
          prompt: 'The arrow printed on a pattern piece that must run parallel to the selvedge is the ___.',
          answer: 'grainline',
          hint: 'It controls how the cloth hangs.',
          explanation: 'Grainline alignment is a scored cutting criterion.',
        },
      ],
      practice: {
        prompt: 'You have cut a school-shirt back on the fold but the fold was not on the straight grain. What is correct?',
        options: [
          'Sew it anyway; pressing will hide twist',
          'Recut from remaining cloth on true grain, or recut a new length — do not construct a twisted back',
          'Clip the hem until it looks straight on the dummy',
          'Glue a second back on top',
        ],
        correct: 'b',
        hint: 'You cannot press grain into a piece that was cut wrong.',
        explanation: 'An off-grain back will never hang. Recut. That is cheaper than a failed practical garment.',
      },
    },
    {
      slug: 'construction',
      title: 'Seams, pressing, and assembly order',
      titleSw: 'Mishono, pressing, na mpangilio wa kushona',
      description: 'Open seams, neatening, underpressing, and the order that stops you sewing a sleeve shut.',
      minutes: 22,
      cdacc: 'CU/FAS/CR/03/5',
      examDomain: 'Garment construction',
      briefing:
        'Construction is a sequence, not a pile of random seams. A typical shirt or uniform blouse: shoulder seams, attach collar or neck facing, set sleeves (or join side seams then sleeves, depending on the method), then cuffs, then hem. If you hem first you often cannot set a sleeve. Write the order on your job card the way the assessor expects.\n\nPlain seams are sewn, pressed open, then neatened with zigzag, overlocker, or a turned edge as specified. Underpress every seam before you cross it with another. “Sew it all then iron at the end” is how collars twist and seam allowances get trapped. Use the ham and sleeve board for curves; do not crush a puff sleeve flat on the big board.\n\nClip inward curves and notch outward curves so they lie. Grade bulky seams (collar, waistband) so layers form a stair, not a ridge. For zips, a centred zip needs a basted opening, the zip face-down, and stitching an even distance from the teeth. Test on a scrap if the fabric is slippery.\n\nQuality at this stage: even seam width, matching notches, no puckers, and thread ends finished. Assessors put a ruler on your 1.5 cm — they are not guessing.',
      briefingSw:
        'Fuata mpangilio: mabega, shingo, mikono, kisha hem. Press kila mshono kabla ya kuuvuka. Neatisha kwa zigzag au overlocker. Clip curves. Zip inahitaji basting. Upana wa mshono lazima uwe sawa — wakaguzi hupima.',
      questions: [
        {
          prompt: 'Why underpress a seam before crossing it with another seam?',
          options: [
            'To use electricity',
            'So allowances lie flat and the next seam is accurate',
            'Pressing is only for the shop window',
            'It shortens the grainline',
          ],
          correct: 'b',
          hint: 'Bulk in a junction cannot be pressed out later.',
          explanation: 'Each seam is a foundation for the next. This is a scored finishing behaviour.',
        },
        {
          prompt: 'Notching an outward curve (e.g. a collar point area or convex seam) is done to:',
          options: [
            'Remove bulk so the curve turns without a ridge',
            'Decorate the inside',
            'Weaken the stitch on purpose',
            'Mark the grainline',
          ],
          correct: 'a',
          hint: 'Extra fabric in a curve has nowhere to go.',
          explanation: 'Clips on concave, notches on convex — both help the seam allowance sit after turning.',
        },
        {
          prompt: 'A professional open (plain) seam is usually:',
          options: [
            'Sewn, pressed to one side untrimmed always',
            'Sewn at the planned allowance, pressed open, then neatened',
            'Glued',
            'Only 2 mm wide on uniforms',
          ],
          correct: 'b',
          hint: 'Open and neatened is the default woven method.',
          explanation: 'Unless the spec says French or overlocked-together, press open and neaten both edges.',
        },
        {
          prompt: 'Why is assembly order written on a job card?',
          options: [
            'To fill paper',
            'So sleeves, collars, and closures are attached while the garment can still be opened flat',
            'Assessors ignore order',
            'It replaces the pattern',
          ],
          correct: 'b',
          hint: 'Some operations are impossible after a hem or a closed side seam.',
          explanation: 'Planning is part of competence, not extra theory.',
        },
      ],
      blanks: [
        {
          prompt: 'Trimming layered seam allowances to different widths so they stack without a ridge is called seam ___.',
          answer: 'grading',
          hint: 'Also called layering the seam.',
          explanation: 'Grading reduces bulk in collars, cuffs, and waistbands.',
        },
      ],
      practice: {
        prompt: 'You set a sleeve and the ease forms one big pleat at the cap. The spec is a smooth head. What do you do?',
        options: [
          'Leave it; ease always looks like a pleat',
          'Unpick, redistribute ease with two rows of gather stitches, shrink with the iron if the cloth allows, and restitch',
          'Cut a dart out of the cap',
          'Glue the cap to the dummy',
        ],
        correct: 'b',
        hint: 'Ease is tiny fullness, not a tuck.',
        explanation: 'Two rows of ease stitching, steam, and even distribution are the textbook fix. A pleat is a construction fault on a plain sleeve.',
      },
    },
    {
      slug: 'finishing',
      title: 'Fitting, hems, and quality control',
      titleSw: 'Fitting, hem, na udhibiti wa ubora',
      description: 'Measure on the body, correct length properly, and check the garment as an assessor would.',
      minutes: 20,
      cdacc: 'CU/FAS/CR/04/5',
      examDomain: 'Fitting & finishing',
      briefing:
        'Fitting is a measured process. Put the garment on the client or dummy, pin on the right side, and mark with chalk. Do not cut until you have recorded the change on the pattern or a fitting sheet. A skirt that is 4 cm too long is not “trimmed at the floor”. Unpick the hem, measure from the waist with a stick or metre, mark a level hem, then rebuild the planned hem allowance (often 3–4 cm double-fold on uniforms).\n\nClosures must work: buttons align with holes, zippers open fully, hook-and-bar takes strain off a waist zip. Buttonholes are cut after stitching, not before, unless you use a bound method that requires a window. Secure buttons with a shank on coats so the fabric can sit.\n\nFinal press is directional: seams the way they were sewn, collars rolled at the edge, hems without a second shine-line from a dirty iron. Hang the garment and walk around it: unmatched side seams, twisted legs, and hanging threads fail assessment even if the design is pretty.\n\nBefore you submit, use a QC list: measurements vs spec, symmetry, inside neatness, labels if required, and safety (no pins left in). That list is how industry and CDACC both think.',
      briefingSw:
        'Fitting ni kipimo, si kukata ovyo. Rekodi mabadiliko. Hem ndefu inarekebishwa kwa kufungua na kupima kutoka kiunoni. Angalia zip, vifungo, na symmetry. Fanya orodha ya QC kabla ya kuwasilisha.',
      questions: [
        {
          prompt: 'A double-fold hem is 4 cm too long. The professional fix is:',
          options: [
            'Cut the hem off at floor level with scissors',
            'Unpick, re-measure from a fixed point (waist/dummy), and resew the planned hem allowance',
            'Glue the extra fabric inside',
            'Tell the client to grow',
          ],
          correct: 'b',
          hint: 'Protect the hem allowance.',
          explanation: 'Length comes from a measured mark. Guess-cutting destroys the finish and the allowance for next term.',
        },
        {
          prompt: 'Why make a button shank on a thick coat?',
          options: [
            'Fashion only',
            'So the button sits above the cloth thickness and the hole can close without strain',
            'NITA bans shanks',
            'It replaces the facing',
          ],
          correct: 'b',
          hint: 'Thickness needs space under the button.',
          explanation: 'A tight-sewn button on a coat pulls and the hole never meets.',
        },
        {
          prompt: 'Which item belongs on a final QC list?',
          options: [
            'Whether the trainee likes the colour',
            'Measurements against the spec, symmetry, threads, and no pins left in',
            'The Wi-Fi password',
            'The iron brand only',
          ],
          correct: 'b',
          hint: 'Assessors use a checklist.',
          explanation: 'Quality is evidence against a spec, not a feeling.',
        },
        {
          prompt: 'Fitting pins should be placed:',
          options: [
            'On the wrong side only so the client cannot see errors',
            'On the body, marking the correction, then transferred to cloth/pattern before cutting',
            'Through the machine needle',
            'In the assessor’s file',
          ],
          correct: 'b',
          hint: 'The dummy is not the pattern.',
          explanation: 'Transfer marks. Cutting on the person is unsafe and inaccurate.',
        },
      ],
      blanks: [
        {
          prompt: 'The extra length of cloth turned up at the bottom of a skirt or trouser is the ___ allowance.',
          answer: 'hem',
          hint: 'Not the 1.5 cm side seam.',
          explanation: 'Hem allowance is planned in the pattern. It is not leftover waste.',
        },
      ],
      practice: {
        prompt: 'An assessor finds three pins still in a finished uniform and a hanging bobbin thread at the zip. Result?',
        options: [
          'Ignore — pins are a design feature',
          'Those are finishing faults; remove pins, tidy threads, and only then present',
          'They add XP in industry',
          'Cut the zip out',
        ],
        correct: 'b',
        hint: 'Safety plus neatness.',
        explanation: 'Pins in a garment are a safety fail. Loose threads are a quality fail. Both are easy marks lost.',
      },
    },
    {
      slug: 'textiles',
      title: 'Week 5 — Textile science and fabric choice',
      titleSw: 'Wiki 5 — Sayansi ya nguo na chaguo la kitambaa',
      description: 'Fibres, weaves, grain, shrinkage, and matching fabric to a garment — CDACC fashion L5 textile principles.',
      minutes: 28,
      cdacc: 'CU/FAS/CR/05/5',
      examDomain: 'Textile principles',
      briefing:
        'Fashion Level 5 occupational standards start with textile principles, not only the machine. Fibres are natural (cotton, linen, wool, silk) or manufactured (polyester, nylon, viscose, blends). Cotton breathes and sews easily; it wrinkles and shrinks if not pre-shrunk. Wool felts with heat and moisture. Polyester is strong and crease-resistant but melts under a too-hot iron — that is why you test the iron on a scrap.\n\nYarn becomes fabric by weaving (plain, twill, satin) or knitting. Woven fabrics have warp (along the grain, little stretch) and weft. Knit fabrics stretch and need ball-point needles, stretch stitches, and a walking foot or careful feed. Cutting a woven shirt on the bias (45°) gives drape; cutting off-grain makes a hem twist after washing — a classic assessor fail.\n\nGrainline on the pattern must follow the warp unless the designer marked bias. Selvage is the factory edge parallel to warp. Nap (velvet, corduroy) must all lie the same way or light hits as two colours. Pre-wash or steam-shrink as the fabric requires before you cut a uniform that must survive the hostel laundry.\n\nIdentify: fibre burn tests are taught with care (tiny sample, ventilation, never in a sewing classroom full of cloth). Care labels: wash temperature, tumble, iron dots. Portfolio: a fabric swatch card with fibre, weave, suitable garment, needle size, and stitch length.',
      briefingSw:
        'Nyuzi asilia dhidi ya synthetic. Cotton inapumua na kuwa wrinkles; polyester inayeyuka kwa pasi moto. Weave ina warp na weft; knit inanyooshwa. Grainline ifuate warp. Pre-shrink sare. Nap ya velvet iwe upande mmoja.',
      questions: [
        {
          prompt: 'Warp yarns in a woven fabric generally:',
          options: ['Run across the fabric and stretch a lot', 'Run parallel to the selvage and have little stretch', 'Are always wool', 'Replace the grainline'],
          correct: 'b',
          hint: 'Length of the piece.',
          explanation: 'Weft is across. Grainline of most shirts follows warp.',
        },
        {
          prompt: 'A polyester school blouse should be pressed:',
          options: ['On linen heat with steam forever', 'On a cooler setting, tested on a scrap — synthetics melt', 'With a welding torch', 'Never, because polyester cannot crease'],
          correct: 'b',
          hint: 'Melt point.',
          explanation: 'Shine and holes are heat damage. Use a press cloth.',
        },
        {
          prompt: 'Knit jersey for a T-shirt needs:',
          options: ['A leather needle and 4 mm straight stitch only', 'Ball-point or stretch needle and a stretch stitch or overlocker', 'No needle', 'A size 110 jeans needle always'],
          correct: 'b',
          hint: 'Loops, not a tight weave.',
          explanation: 'Sharp needles cut knits and cause holes that run.',
        },
        {
          prompt: 'Nap fabrics such as corduroy must be cut:',
          options: ['With pile running in mixed directions to save cloth', 'With all pieces in the same pile direction', 'On the weft only', 'Without grainlines'],
          correct: 'b',
          hint: 'Light reflection.',
          explanation: 'One panel will look a different shade if the pile is reversed.',
        },
      ],
      blanks: [
        {
          prompt: 'The factory-finished edge of woven cloth parallel to the warp is the ___.',
          answer: 'selvage',
          hint: 'Also selvedge.',
          explanation: 'Grainline is usually parallel to the selvage.',
        },
      ],
      practice: {
        prompt: 'You cut a cotton uniform without pre-washing. After hostel laundry it is two sizes smaller. Cause?',
        options: [
          'The machine stitch length',
          'Relaxation/residual shrinkage — pre-shrink cottons before cutting production garments',
          'Too much interfacing',
          'Wrong zip colour'],
        correct: 'b',
        hint: 'Textile science.',
        explanation: 'CDACC textile principles exist so the garment still fits after wet treatment.',
      },
    },
    {
      slug: 'sketching',
      title: 'Week 6 — Fashion sketching and specifications',
      titleSw: 'Wiki 6 — Mchoro wa fashion na spec',
      description: 'Croquis, flats, construction notes, and a spec sheet an assessor or machinist can sew from.',
      minutes: 28,
      cdacc: 'CU/FAS/CR/06/5',
      examDomain: 'Fashion sketching',
      briefing:
        'CDACC fashion includes sketching figures and producing working drawings. A croquis is a proportioned template (often 8–9 heads for fashion, more realistic for school uniforms). Design sketches show silhouette, style lines, and fabric suggestion. They are not the same as a technical flat: flats are 2D, garment as if laid on a table, seams and topstitching visible, left and right consistent.\n\nA spec sheet / working drawing carries measurements (bust, waist, hip, length, sleeve, hem depth, seam allowance), stitch types, notions (zip length, button size), and fabric. Without it the machinist invents, and the assessor cannot mark against a standard. Callouts: “lockstitch 2.4 mm, 1.5 cm SA, 20 cm invisible zip”.\n\nShade for drape, but do not hide construction. Front and back views. If there is a lining, show it. Kenyan polytechnic practicals often ask for a school skirt or shirt — draw the actual garment, not a Paris gown, unless the brief says otherwise.\n\nPortfolio this week: one croquis illustration plus one flat plus a measurement table for a ladies’ blouse. That is how industry hands work to the sewing line.',
      briefingSw:
        'Croquis ni kielelezo cha mwili. Flat ni mchoro wa kiufundi wa nguo. Spec sheet ina vipimo, stitch, zip, na kitambaa. Chora mbele na nyuma. Sare ya shule ni mradi halali.',
      questions: [
        {
          prompt: 'A technical flat is best described as:',
          options: [
            'A painted fashion pose only',
            'A 2D working drawing of the garment with seams, topstitch, and callouts',
            'A photo of the dummy',
            'A grainline on cloth'],
          correct: 'b',
          hint: 'Machinist document.',
          explanation: 'Illustration sells; flats instruct. You need both in the unit.',
        },
        {
          prompt: 'Seam allowance belongs:',
          options: ['Only in the machinist’s head', 'On the spec/pattern, stated in millimetres or centimetres', 'On the fashion illustration face', 'Nowhere if you overlock'],
          correct: 'b',
          hint: 'Measurable.',
          explanation: '1.5 cm is common for garments but must be written.',
        },
        {
          prompt: 'Front and back flats should:',
          options: ['Match style lines that continue around the body', 'Be two unrelated garments', 'Omit closures', 'Use random proportions'],
          correct: 'a',
          hint: 'Same design.',
          explanation: 'A princess line that vanishes at the side is a drawing error.',
        },
        {
          prompt: 'Button size on a spec is needed because:',
          options: ['Buttons are decorative only', 'The hole, spacing, and facing must match the notion', 'NITA bans numbers', 'It sets stitch length'],
          correct: 'b',
          hint: 'Notions.',
          explanation: 'A 15 mm button in a 10 mm hole fails the garment.',
        },
      ],
      blanks: [
        {
          prompt: 'A proportioned fashion figure template used for illustration is a ___.',
          answer: 'croquis',
          hint: 'From French “sketch”.',
          explanation: 'You design on a croquis; you manufacture from flats and patterns.',
        },
      ],
      practice: {
        prompt: 'A trainee submits a coloured croquis of a gown with no measurements, no SA, and no back view. For CDACC evidence you should:',
        options: [
          'Pass it as complete design',
          'Require flats, spec measurements, and construction notes before sewing starts',
          'Cut fabric immediately',
          'Skip pattern making'],
        correct: 'b',
        hint: 'Working drawings.',
        explanation: 'Sketching in the OS is communication of a makeable garment.',
      },
    },
    {
      slug: 'grading',
      title: 'Week 7 — Pattern grading and size sets',
      titleSw: 'Wiki 7 — Grading ya pattern na saizi',
      description: 'Move a master pattern through a size chart with consistent grade rules, not random scaling.',
      minutes: 28,
      cdacc: 'CU/FAS/CR/07/5',
      examDomain: 'Pattern grading',
      briefing:
        'Construction of a master pattern (size 12 or the college block) is not the end. Grading produces the size set (e.g. 8–16) using grade rules: how much the bust, waist, hip, and length change per size. You do not photocopy at 110% — that enlarges buttons, seam allowances, and dart intake wrongly. Shift cardinal points: bust point, waist, hip, shoulder, scye, hem.\n\nManual grading uses a grade table and tracks (move X and Y). Computer grading does the same with CAD. Nested patterns should look like a family: even gaps at side seams, not a fan that explodes at the hem only. Check that dart tips still aim at the bust point after grade.\n\nKenyan school uniforms often have a size chart in centimetres. Measure a sample of learners; do not import a European chart blindly. Ease must remain after grading — a size 16 that lost wearing ease is unwearable.\n\nThis week: grade a skirt block one size up and one down, nest them, and measure hip circumference against the chart. That is the CDACC grading outcome.',
      briefingSw:
        'Grading si photocopy 110%. Tumia grade rules: bust, waist, hip, urefu. Cardinal points. Nested patterns ziwe familia. Ease ibaki. Pima chati ya Kenya, si ya Ulaya tu.',
      questions: [
        {
          prompt: 'Photocopying a pattern at 115% is a poor grade because it:',
          options: [
            'Is always perfect',
            'Also scales seam allowances, buttonholes, and dart logic incorrectly',
            'Is required by CDACC',
            'Only affects colour'],
          correct: 'b',
          hint: 'Not a photo enlarge.',
          explanation: 'Grade rules move body measurements; SA often stays 1.5 cm.',
        },
        {
          prompt: 'A nested set that fans wildly only at the hem usually means:',
          options: ['Perfect hip grade', 'Uneven or incorrect length/hip rules', 'Good CAD', 'Selvage error only'],
          correct: 'b',
          hint: 'Even nest.',
          explanation: 'Inspect the nest before you cut a size run.',
        },
        {
          prompt: 'Wearing ease after grading should:',
          options: ['Disappear on larger sizes to save cloth', 'Remain as specified so the garment can be worn', 'Become negative', 'Equal the seam allowance'],
          correct: 'b',
          hint: 'Still a garment.',
          explanation: 'Size 16 is not size 12 with no ease and longer hem only.',
        },
        {
          prompt: 'Cardinal points in grading include:',
          options: ['The iron temperature', 'Bust, waist, hip, shoulder, armhole, hem', 'Only the brand logo', 'The bobbin colour'],
          correct: 'b',
          hint: 'Body landmarks.',
          explanation: 'Those points get X/Y moves from the grade table.',
        },
      ],
      blanks: [
        {
          prompt: 'The table of millimetre moves per size for each landmark is a ___ rule table.',
          answer: 'grade',
          hint: 'Grade rules.',
          explanation: 'Without a table you are guessing, not grading.',
        },
      ],
      practice: {
        prompt: 'Size 10 blouse fits. Size 16 made by scaling the whole block including 1.5 cm SA to 2.2 cm and huge darts. Fix?',
        options: [
          'Ship it',
          'Re-grade with constant SA and proper bust/waist/hip rules; true the darts',
          'Only lengthen the hem by 40 cm',
          'Change fibre to polyester'],
        correct: 'b',
        hint: 'Rules, not scale.',
        explanation: 'That is the difference between grading and enlarging a drawing.',
      },
    },
    {
      slug: 'ladies',
      title: 'Week 8 — Ladies wear: dart, ease, and closures',
      titleSw: 'Wiki 8 — Nguo za wanawake',
      description: 'Make a ladies’ garment from block to finish using darts, zips, and bust ease as assessed in fashion L5.',
      minutes: 30,
      cdacc: 'CU/FAS/CR/08/5',
      examDomain: 'Ladies wear',
      briefing:
        'Ladies wear units in Kenyan fashion L5 typically produce a blouse, dress, or skirt that proves dart manipulation, closures, and fit on a female form. Bust darts point toward the bust point and stop short (about 1.5–2.5 cm) so they do not sit as cones on the apex. Waist darts shape the torso. If the client is between sizes, you alter the pattern — you do not guess on the cloth.\n\nClosures: centred zip, lapped zip, invisible zip, or buttons and placket. Invisible zips need the right foot and to be stitched close to the coils. A gaping back neck is a pattern/shoulder issue, not a bigger zip. Facings and bias bindings neat on the inside are marked hard.\n\nEase: a woven blouse needs wearing ease at bust (often ~5–8 cm depending on style). A “body-con” woven without stretch and without ease will not button. Knit ladies wear follows the textile week: stretch stitches, stay tape at the shoulder.\n\nAssessed sample: a school or office blouse with collar or neck finish, set-in sleeve, buttoned front or zip, and a finished hem. QC against the spec from sketching week.',
      briefingSw:
        'Dart za bust zielekee bust point zisiguse apex. Zip invisible inahitaji foot sahihi. Ease ya kuvaa kwenye bust. Facing ndani safi. Blouse ya ofisi au shule ni mradi mzuri.',
      questions: [
        {
          prompt: 'A bust dart that reaches the nipple point typically:',
          options: ['Looks couture', 'Creates a pointy cone — stop the dart short of the apex', 'Replaces ease', 'Is required on knits only'],
          correct: 'b',
          hint: 'Stop short.',
          explanation: 'Dart intake shapes to the apex but the tip fades before it.',
        },
        {
          prompt: 'An invisible zip that shows teeth usually means:',
          options: ['Correct coil exposure', 'Stitching too far from the coils or the wrong foot', 'Too much ease', 'Selvage on the zip'],
          correct: 'b',
          hint: 'Zipper foot.',
          explanation: 'Practice on scrap of the same fabric and zip length.',
        },
        {
          prompt: 'Wearing ease at the bust on a woven blouse is:',
          options: ['Always 0 cm', 'Extra circumference so the wearer can breathe and move', 'The same as seam allowance', 'Only for men'],
          correct: 'b',
          hint: 'Not skin-tight unless stretch/style says so.',
          explanation: 'Measure body + ease = garment circumference on the spec.',
        },
        {
          prompt: 'A gaping back neck is usually fixed by:',
          options: ['A longer zip', 'Pattern alteration at neck/shoulder, not by pulling the zip harder', 'Removing darts only', 'A hotter iron'],
          correct: 'b',
          hint: 'Fit.',
          explanation: 'Ladies wear is a fitting unit as much as a sewing unit.',
        },
      ],
      blanks: [
        {
          prompt: 'The fullest bust landmark that darts aim toward is the bust ___.',
          answer: 'point',
          hint: 'BP on the pattern.',
          explanation: 'Measure BP height from the shoulder; it changes with size and age.',
        },
      ],
      practice: {
        prompt: 'Buttons strain and gap on a woven blouse even though hip and waist are fine. First pattern action?',
        options: [
          'Shorten the hem',
          'Add bust ease or a dart/fullness alteration; check bust circumference vs body + ease',
          'Use a jeans needle',
          'Grade only the collar'],
        correct: 'b',
        hint: 'Bust circumference.',
        explanation: 'Ladies wear fails at the bust more than at the hem. Measure.',
      },
    },
    {
      slug: 'gents',
      title: 'Week 9 — Gents wear: shirt, trouser, and fly',
      titleSw: 'Wiki 9 — Nguo za wanaume',
      description: 'Collar stand, yoke, fly, and trouser crease — gents wear as a separate CDACC fashion core.',
      minutes: 30,
      cdacc: 'CU/FAS/CR/09/5',
      examDomain: 'Gents wear',
      briefing:
        'Gents wear is a distinct core in fashion L5 (shirts, trousers, sometimes a jacket). A man’s shirt: yoke, collar and stand, placket, cuff with placket, and extra length at the back. Collar points must match; the stand sits so the collar rolls, not flaps. Interfacing in collar and stand is not optional if the spec is a uniform shirt.\n\nTrousers: front crease on the grain, fly with zip guard, waistband with a curtain or facing, and pockets that do not gape. Rise (body rise) is measured seated as well as standing or the crotch will cut. A ladies’ block is not a gents’ block — different balance and fly construction.\n\nTopstitching on a shirt is a quality mark: even width, matching thread, no tunnels. Buttons: men’s shirts traditionally button left over right (as worn). Confirm the college spec. Sleeve pitch: the sleeve cap notch matches the shoulder; twisting sleeves are a setting error from construction week, still assessed here.\n\nAssessed sample: a school/office shirt or a pair of trousers with a working fly. Attach the spec sheet. Industrial attachment later will expect you to hit minutes-per-operation; here you hit quality first.',
      briefingSw:
        'Shati: yoke, collar na stand, placket, cuff. Suruali: crease, fly, waistband, rise. Block ya wanawake si ya wanaume. Topstitch sawa. Interfacing kwenye collar.',
      questions: [
        {
          prompt: 'A shirt collar that will not sit is often missing:',
          options: ['A longer hem', 'A correctly interfaced stand and balanced collar points', 'A bust dart', 'Knit fabric only'],
          correct: 'b',
          hint: 'Stand plus collar.',
          explanation: 'The stand is the engineered piece. Skipping it on a formal shirt is a fail.',
        },
        {
          prompt: 'Trouser fly construction must include:',
          options: ['Only a safety pin', 'Zip, guard/facing, and bar-tacks at stress points as specified', 'A ladies invisible zip always', 'No waistband'],
          correct: 'b',
          hint: 'Stress.',
          explanation: 'A fly without a guard or bar-tack fails first wash.',
        },
        {
          prompt: 'If the crotch bites when the learner sits, check:',
          options: ['Button colour', 'Body rise / crotch depth on the pattern', 'Selvage nap only', 'Iron steam'],
          correct: 'b',
          hint: 'Rise.',
          explanation: 'Gents trousers fail on rise more than on hem length.',
        },
        {
          prompt: 'Shirt back yokes exist to:',
          options: ['Waste cloth', 'Add structure and often conceal a shoulder split / hanging loop area', 'Replace collars', 'Hold bust darts'],
          correct: 'b',
          hint: 'Shoulder span.',
          explanation: 'A well-set yoke is a gents-wear competence.',
        },
      ],
      blanks: [
        {
          prompt: 'The band that lifts a shirt collar off the neck is the collar ___.',
          answer: 'stand',
          hint: 'Collar stand / band.',
          explanation: 'Collar and stand are two pattern pieces plus interfacing.',
        },
      ],
      practice: {
        prompt: 'Gents school trousers twist so the crease spirals. Trainee says “press harder”. Diagnosis?',
        options: [
          'More steam always fixes grain',
          'Legs off grain or twisted in making — recut/rehang on grain; pressing will not hold a grain fault',
          'Change to a ladies block',
          'Remove the fly'],
        correct: 'b',
        hint: 'Grain from textiles week.',
        explanation: 'Gents wear still obeys warp and weft. Pressing is not a grain correction.',
      },
    },
  ],
};
