import { weekLesson } from './helpers';

const electronicsDomain = 'CDACC ICT L5 — Demonstrate Basic Electronics (IT/CU/ICT/CC/1/5, 100 h)';
const softwareDomain = 'CDACC ICT L5 — Install Computer Software (IT/CU/ICT/CR/2/5, 260 h)';
const repairDomain = 'CDACC ICT L5 — Perform Computer Repair and Maintenance (IT/CU/ICT/CR/3/5, 280 h)';
const databaseDomain = 'CDACC ICT L5 — Manage Database System (IT/CU/ICT/CR/4/5, 310 h)';
const programDomain = 'CDACC ICT L5 — Develop Computer Program (IT/CU/ICT/CR/5/5, 340 h)';
const osDomain = 'CDACC ICT L5 — Manage Operating System (IT/CU/ICT/CR/6/5, 210 h)';
const netDomain = 'CDACC ICT L5 — Perform Computer Networking (IT/CU/ICT/CR/1/5, 300 h)';

export const tvetElectronics1 = weekLesson({
  id: 'tvet-electronics-w1',
  courseId: 'basic-electronics',
  title: 'Week 1 — Circuits, quantities, and Ohm’s law',
  titleSw: 'Wiki 1 — Mizunguko, vipimo, na sheria ya Ohm',
  cdacc: 'IT/CU/ICT/CC/1/5',
  examDomain: electronicsDomain,
  minutes: 32,
  media: [{ kind: 'animation', preset: 'circuit', caption: 'Series vs parallel: current has one path or many.' }],
  briefing:
    'CDACC common unit Demonstrate Basic Electronics (IT/CU/ICT/CC/1/5, about 100 hours) starts with electric circuits before you ever open a PC. A circuit is a closed path that lets charge flow: source, conductors, load, and a return. Electromotive force (e.m.f.) is measured in volts, current in amperes, resistance in ohms, power in watts (P = VI), and energy in joules. If you mix those units in an oral, you fail the underpinning knowledge even if you can crimp an RJ45.\n\nDirect current (DC) from a PSU rail or battery is constant polarity. Alternating current (AC) from the wall reverses. Lab work is mostly DC on breadboards, but the PSU still converts AC. Series circuits share one current; voltages add. Parallel circuits share voltage; currents add. A blown series lamp kills the chain; a blown parallel lamp leaves the others on — that is how street lights and PC fans are thought about.\n\nOhm’s law V = IR is the first calculation. If a 5 V rail feeds a 220 Ω resistor, current is about 23 mA. Power in the resistor is I²R. If you cannot estimate that, you will not size a current-limiting resistor for an LED and you will destroy the diode. Always draw the circuit, label polarity, then measure with the meter in the correct mode — voltage in parallel, current in series, resistance with power off.\n\nWorkshop practice: isolate mains, use a current-limited bench supply, and never leave a shorted breadboard on a high-current PSU. Assessors watch meter discipline as much as the answer. A fused lead and a known-good ground are part of the competence, not extras.',
  briefingSw:
    'Mzunguko una chanzo, mzigo, na njia ya kurudi. Volt, ampere, ohm, watt, na joule. DC ni polarity moja; AC inabadilika. Series hushiriki current; parallel hushiriki voltage. V = IR. Pima voltage sambamba, current mfululizo, resistance umeme ukiwa umezima.',
  pairs: [
    { leftId: 'v', left: 'E.m.f. / voltage', rightId: 'volt', right: 'Volt (V)' },
    { leftId: 'i', left: 'Current', rightId: 'amp', right: 'Ampere (A)' },
    { leftId: 'r', left: 'Resistance', rightId: 'ohm', right: 'Ohm (Ω)' },
    { leftId: 'p', left: 'Power', rightId: 'watt', right: 'Watt (W)' },
  ],
  pairPrompt: 'Match each electrical quantity to its SI unit (CDACC electronics oral).',
  pairHint: 'V I R P.',
  pairExplanation: 'Volt, ampere, ohm, watt. Energy is the joule — do not call energy “watts”.',
  questions: [
    {
      prompt: 'In a series circuit with two resistors, which statement is true?',
      options: [
        'Voltage is the same across every resistor',
        'The same current flows through both resistors',
        'Currents add at every node',
        'Ohm’s law does not apply',
      ],
      correct: 'b',
      hint: 'One path.',
      explanation: 'Series shares current. Parallel shares voltage.',
    },
    {
      prompt: 'A 12 V DC rail feeds a 240 Ω load. Approximate current is:',
      options: ['0.05 A (50 mA)', '2 A', '240 A', '12 × 240 A'],
      correct: 'a',
      hint: 'I = V/R.',
      explanation: '12 / 240 = 0.05 A. Always check the order of magnitude before you connect.',
    },
    {
      prompt: 'How must a digital multimeter be connected to measure current?',
      options: [
        'In parallel with the load, on the voltage jack',
        'In series with the load, on the current jack, circuit powered as specified',
        'Across the supply with the resistance range',
        'On ohms, while the board is live',
      ],
      correct: 'b',
      hint: 'Current through, voltage across.',
      explanation: 'A meter on current is a near short. Parallel current measurement blows the fuse.',
    },
    {
      prompt: 'Power dissipated in a resistor is:',
      options: ['V + I', 'I²R or VI', 'R / V', 'Always 1 W'],
      correct: 'b',
      hint: 'Watts, not volts.',
      explanation: 'If power exceeds the resistor rating it burns. That is a workshop safety item.',
    },
  ],
  blanks: [
    {
      prompt: 'Ohm’s law states that voltage equals current multiplied by ___.',
      answer: 'resistance',
      hint: 'V = IR.',
      explanation: 'Resistance is measured in ohms. Do not write “watts”.',
    },
  ],
  practice: {
    prompt: 'A trainee measures a live 5 V rail on the ohms range and the meter dies. Root cause?',
    options: [
      'Ohm’s law is wrong',
      'Resistance is measured only with power removed; the ohms range injects a test current into a live rail',
      'The resistor value was too small',
      'CDACC forbids multimeters',
    ],
    correct: 'b',
    hint: 'Mode plus isolation.',
    explanation: 'Never ohm a live circuit. Isolate, discharge capacitors if needed, then measure.',
  },
});

export const tvetElectronics2 = weekLesson({
  id: 'tvet-electronics-w2',
  courseId: 'basic-electronics',
  title: 'Week 2 — Components, semiconductors, and the P–N junction',
  titleSw: 'Wiki 2 — Vipengele, semiconductor, na P–N junction',
  cdacc: 'IT/CU/ICT/CC/1/5',
  examDomain: electronicsDomain,
  minutes: 32,
  briefing:
    'Identify passive and active parts by symbol and body: resistor (colour code or printed value), capacitor (polar electrolytic vs non-polar ceramic), inductor, diode, LED, and transistor. Integrated circuits pack many junctions in one package. The colour code is still assessed: first bands are significant digits, then multiplier, then tolerance. A burnt resistor is often a symptom — find why current was high before you replace it.\n\nSemiconductor theory: silicon (and historically germanium) atoms share electrons in a crystal. Doping with impurities creates N-type (extra electrons) and P-type (holes). A P–N junction diode conducts when forward biased (P more positive than N, about 0.7 V for silicon) and blocks when reverse biased until breakdown. That is why a PSU diode oriented backwards does nothing useful, and why you must check polarity on electrolytics and LEDs.\n\nBipolar transistors are NPN or PNP sandwiches. They act as switches or amplifiers: a small base current controls a larger collector current. In ICT repair you meet them as regulators, MOSFET switches on motherboards, and optocouplers. You do not need to design an RF amp, but you must know “open diode” versus “shorted MOSFET” on a meter in diode mode.\n\nESD still applies: MOS inputs are fragile. Use the wrist strap from the safety unit. Store MOSFETs in foam. Assessors may ask you to identify a diode band (cathode) and to state forward voltage. Wrong polarity on a replacement rectifier is a classic fail.',
  briefingSw:
    'Resistor, capacitor, diode, transistor, IC. Silicon ina P-type na N-type. Diode inapitisha mbele (~0.7 V) na kuzuia nyuma. Transistor ni swichi au amplifier. Band ya diode ni cathode. Polar electrolytic ina polarity.',
  questions: [
    {
      prompt: 'A silicon diode is forward biased when:',
      options: [
        'The N-side is more positive than the P-side',
        'The P-side is more positive than the N-side, around 0.7 V drop',
        'Both sides are at 0 V',
        'It is an inductor',
      ],
      correct: 'b',
      hint: 'P to N, conventional current.',
      explanation: 'Forward bias lets current flow. Reverse bias blocks until breakdown.',
    },
    {
      prompt: 'Which component stores energy in an electric field and is often polarised?',
      options: ['Carbon resistor', 'Electrolytic capacitor', 'Fuse only', 'RJ45 jack'],
      correct: 'b',
      hint: 'Stripe or minus mark.',
      explanation: 'Reverse an electrolytic and it can vent. Ceramics are usually non-polar.',
    },
    {
      prompt: 'N-type semiconductor is created by doping that provides extra:',
      options: ['Holes only', 'Free electrons', 'Photons', 'Neutrons as current'],
      correct: 'b',
      hint: 'Negative carriers.',
      explanation: 'P-type has holes. N-type has electrons. That is the CDACC oral.',
    },
    {
      prompt: 'Diode mode on a meter across a good silicon diode typically shows:',
      options: [
        'About 0.5–0.8 V one way and open the other way',
        '0 Ω both ways',
        'OL both ways always if it is good',
        'Exactly 5 V',
      ],
      correct: 'a',
      hint: 'One way conducts.',
      explanation: 'Short both ways = dead. Open both ways = open diode (except some LEDs needing more voltage).',
    },
  ],
  blanks: [
    {
      prompt: 'The marked end of a through-hole diode is usually the ___.',
      answer: 'cathode',
      hint: 'Band / stripe.',
      explanation: 'Current in conventional notation enters the anode and leaves the cathode when forward biased.',
    },
  ],
  practice: {
    prompt: 'A replacement 7805 regulator runs scalding and the 5 V rail is 1.2 V. First electronics check?',
    options: [
      'Increase the wall voltage',
      'Look for a shorted load or reversed polar capacitor on the 5 V rail, then confirm the regulator orientation',
      'Replace the CPU first',
      'Ignore heat — regulators should glow',
    ],
    correct: 'b',
    hint: 'Heat plus low rail = too much current or wrong part.',
    explanation: 'A shorted tantalum or backwards electrolytic will cook a regulator. Find the short.',
  },
});

export const tvetElectronics3 = weekLesson({
  id: 'tvet-electronics-w3',
  courseId: 'basic-electronics',
  title: 'Week 3 — Number systems, memory classes, and emerging hardware',
  titleSw: 'Wiki 3 — Mifumo ya namba, kumbukumbu, na mwelekeo mpya',
  cdacc: 'IT/CU/ICT/CC/1/5',
  examDomain: electronicsDomain,
  minutes: 30,
  briefing:
    'Computers count in binary. You must convert between decimal, binary, octal, and hexadecimal because addresses, MAC values, IPv6 nybbles, and colour codes are hex. One hex digit is four bits (a nybble). 0xA = 10 decimal = 1010 binary. BCD 8421 encodes each decimal digit in four bits — used in some displays and RTC chips. Binary addition carries just as decimal does; overflow is why an 8-bit register wraps from 255 to 0.\n\nMemory in this unit is classified by how it is used, not by brand. RAM is volatile working store. ROM (and its flash descendants) keep firmware when power dies. Magnetic memory (HDD) versus semiconductor (SSD, DRAM). Cache is small and fast; secondary storage is large and slower. “DAM” appears in some CDACC lists as a memory class — treat it as a listed type in oral tests and contrast it with RAM/ROM in practice.\n\nEmerging trends you should be able to name: SoC boards (Raspberry Pi class), NVMe, USB-C power delivery, and denser NAND. Challenges: counterfeit ICs, right-to-repair parts, e-waste, and ESD on finer processes. Coping: buy from reputable distributors, follow JEDEC handling, and recycle boards through licensed e-waste — that links to the environmental literacy basic unit.\n\nAssessment is written conversion plus identification. A typical paper: convert 156₁₀ to hex, state whether DDR is volatile, and name one risk of unbranded RAM. Show working. Do not skip the 16s column in hex.',
  briefingSw:
    'Binary, octal, hex. Digit moja ya hex = bit 4. RAM ni volatile; ROM/firmware inabaki. SSD ni semiconductor; HDD ni magnetic. SoC, NVMe, USB-C ni mwelekeo. E-waste na ESD ni changamoto.',
  questions: [
    {
      prompt: 'How many bits does one hexadecimal digit represent?',
      options: ['1', '4', '10', '16 bits exactly always'],
      correct: 'b',
      hint: 'Nybble.',
      explanation: 'Hex 0–F maps to 0000–1111. That is why MAC addresses are written in hex.',
    },
    {
      prompt: 'Which memory loses its contents when the PSU is switched off?',
      options: ['ROM BIOS chip (firmware)', 'DRAM / system RAM', 'A programmed mask ROM in theory forever', 'Stone tablet'],
      correct: 'b',
      hint: 'Volatile.',
      explanation: 'RAM is working memory. Storage and firmware persist.',
    },
    {
      prompt: '156 decimal in hexadecimal is:',
      options: ['0x9C', '0x156', '0xFF', '156h meaning 156 decimal still'],
      correct: 'a',
      hint: '16 × 9 = 144, remainder 12 = C.',
      explanation: '9C₁₆ = 9×16 + 12 = 144 + 12 = 156.',
    },
    {
      prompt: 'BCD 8421 stores the decimal number 25 as:',
      options: ['11001 in five bits', '0010 0101', 'FF', '25 in ASCII only'],
      correct: 'b',
      hint: 'Each digit gets four bits.',
      explanation: '2 → 0010, 5 → 0101. That is the CDACC binary-codes outcome.',
    },
  ],
  blanks: [
    {
      prompt: 'Base-16 numbering used for memory addresses is called ___.',
      answer: 'hexadecimal',
      hint: 'Digits 0–9 and A–F.',
      explanation: 'Hex is the technician’s shorthand for binary groups of four.',
    },
  ],
  practice: {
    prompt: 'A learner writes that an SSD is “RAM because it is semiconductor.” Your assessor comment?',
    options: [
      'Correct — all semiconductors are volatile',
      'Wrong class: NAND flash is non-volatile semiconductor storage, not working RAM',
      'SSDs are magnetic',
      'RAM is only magnetic tape',
    ],
    correct: 'b',
    hint: 'Volatile versus persistent.',
    explanation: 'Material (semiconductor) is not the same as the role (working memory vs storage).',
  },
});

export const tvetSoftware1 = weekLesson({
  id: 'tvet-software-w1',
  courseId: 'software-install',
  title: 'Week 1 — Classify software, licences, and OS families',
  titleSw: 'Wiki 1 — Aina za programu, leseni, na familia za OS',
  cdacc: 'IT/CU/ICT/CR/2/5',
  examDomain: softwareDomain,
  minutes: 30,
  briefing:
    'Install Computer Software (IT/CU/ICT/CR/2/5, 260 hours) begins with identification, not clicking Next. Software is system (OS, drivers, utilities) or application (office, browser, college MIS). Acquisition is commercial off-the-shelf, open source, site licence, or in-house. Selection criteria: hardware compatibility, licence legality, vendor support, and the college acceptable-use policy. Installing a cracked copy is a CMCA and copyright fail, not a cost-saving tip.\n\nOperating systems are single or multi-user, single or multitasking, batch, real-time, or distributed. Interfaces are CLI, menu, or GUI. OS functions you will be asked: process, memory, device, storage, and security management. Windows, Linux, and mobile OS differ in driver models and update channels, but the install decision is the same: 64-bit vs 32-bit, disk layout, and whether the machine is domain-joined.\n\nLegal requirements: keep licence keys in the inventory, match OEM vs retail vs volume, and do not clone a Windows image onto five lab PCs unless the licence allows it. Data protection: back up user profiles before an OS reload — Kenya Data Protection Act duties apply to student records on that disk.\n\nDeliverable this week: a software specification sheet for a lab PC — OS edition, office suite licence, browser, antivirus, and drivers — with sources. Assessors mark the sheet, not a screenshot of a wallpaper.',
  briefingSw:
    'Programu ya mfumo dhidi ya programu ya matumizi. Leseni halali, si crack. OS inaweza kuwa multi-user, real-time, au distributed. CLI, menyu, au GUI. Hifadhi data kabla ya kufunga upya. Andika orodha ya programu na leseni.',
  questions: [
    {
      prompt: 'Which list is system software rather than an application?',
      options: [
        'LibreOffice, Chrome, GIMP',
        'Kernel, device drivers, and the file system manager',
        'A student game only',
        'A PDF of the timetable',
      ],
      correct: 'b',
      hint: 'Runs the machine.',
      explanation: 'Applications sit on top of the OS. Drivers and the kernel are system software.',
    },
    {
      prompt: 'A real-time OS is chosen when:',
      options: [
        'You need a pretty theme',
        'Tasks must meet strict timing (lab instruments, some industrial controllers)',
        'You refuse to licence Windows',
        'RAM is unlimited',
      ],
      correct: 'b',
      hint: 'Deadlines.',
      explanation: 'Batch OS queues jobs. Real-time guarantees timing. Desktop OS is interactive.',
    },
    {
      prompt: 'Before reinstalling an OS on a staff PC that holds student marks, you must:',
      options: [
        'Skip backup to save time',
        'Back up and protect personal data, then install from legal media',
        'Copy a cracked ISO from WhatsApp',
        'Format and hope',
      ],
      correct: 'b',
      hint: 'Data protection plus licence.',
      explanation: 'CDACC lists existing data protection and legal installation as outcomes.',
    },
    {
      prompt: 'A GUI differs from a CLI in that a GUI:',
      options: [
        'Cannot start programs',
        'Uses graphical controls; a CLI uses typed commands',
        'Is illegal in Kenya',
        'Replaces the need for drivers',
      ],
      correct: 'b',
      hint: 'Interface types in the unit.',
      explanation: 'Technicians still need CLI for repair (Safe Mode, recovery console, bash).',
    },
  ],
  blanks: [
    {
      prompt: 'Software you can legally inspect and modify under its licence is called ___ source.',
      answer: 'open',
      hint: 'Opposite of closed proprietary.',
      explanation: 'Open source still has a licence (GPL, MIT). It is not “no rules”.',
    },
  ],
  practice: {
    prompt: 'HOD asks you to image one licensed Windows disk onto 40 lab PCs. Correct professional response?',
    options: [
      'Do it — imaging is always allowed',
      'Refuse unless a volume/site licence or KMS covers those machines; propose legal options',
      'Change the product key sticker only',
      'Install and hide the banner',
    ],
    correct: 'b',
    hint: 'Licence math.',
    explanation: 'Unlicensed cloning is a fail in industry and in the unit’s legal requirements.',
  },
});

export const tvetSoftware2 = weekLesson({
  id: 'tvet-software-w2',
  courseId: 'software-install',
  title: 'Week 2 — Installation types, configuration, and drivers',
  titleSw: 'Wiki 2 — Aina za usakinishaji, usanidi, na driver',
  cdacc: 'IT/CU/ICT/CR/2/5',
  examDomain: softwareDomain,
  minutes: 32,
  briefing:
    'Installation types in the curriculum: attended (you click through), unattended (answer file), headless (no local display), scheduled/automated, clean versus in-place update, and network (PXE, WSUS, apt from a mirror). Choose clean install when the OS is corrupt; choose in-place when you must keep apps. Headless is normal on servers — use SSH or a hypervisor console, not a story about “the screen is off so it cannot install”.\n\nMedia: OEM recovery, official ISO on a hashed USB, or a campus repository. Verify SHA256 when the college provides it. Register the product if the licence requires it. Configuration after install: computer name, timezone Africa/Nairobi, updates, local admin vs standard user, and joining the domain only with authority. Disable unused services. Set a restore point or Timeshift snapshot before big driver packs.\n\nDrivers: chipset first, then storage, GPU, NIC, audio. Windows Update is not a substitute for a missing storage driver during setup — have the RAID/AHCI driver on USB. On Linux, check `lsusb` / `lspci` and the distro driver policy. Never mix a random “driver pack” from a blog; they bundle PUPs.\n\nLab this week: unattended or documented attended install of a legal OS, then office suite, then browser, then endpoint protection. Photograph the activation/licence screen for the portfolio. If activation fails, do not skip it — that is the configuration outcome.',
  briefingSw:
    'Attended, unattended, headless, network, clean au update. Thibitisha ISO. Chipset kwanza kisha GPU na NIC. Jina la kompyuta, timezone Nairobi, watumiaji wa kawaida si admin wote. Usitumie driver pack ya blogu.',
  questions: [
    {
      prompt: 'An unattended install is best described as:',
      options: [
        'Leaving the room while a virus installs',
        'An installation driven by a prepared answer file / automation so prompts are not clicked by hand',
        'Any install after 5 p.m.',
        'PXE that skips licences',
      ],
      correct: 'b',
      hint: 'Answer file.',
      explanation: 'Unattended is a listed type. It still must be licensed and documented.',
    },
    {
      prompt: 'During Windows setup the disk is missing. Most likely need is:',
      options: [
        'A GPU overclock',
        'Storage/RAID/AHCI driver loaded at setup',
        'More wallpaper',
        'A HDMI cable',
      ],
      correct: 'b',
      hint: 'Controller, not display.',
      explanation: 'NVMe or RAID controllers often need a driver the ISO does not ship.',
    },
    {
      prompt: 'A headless server install means:',
      options: [
        'The machine has no CPU',
        'No local monitor; you use serial, IPMI, SSH, or hypervisor console',
        'You must smash the screen',
        'Only MS-DOS is allowed',
      ],
      correct: 'b',
      hint: 'No display.',
      explanation: 'CDACC lists headless as an installation type. ICT labs use it on servers.',
    },
    {
      prompt: 'Best first driver after a clean Windows install on a laptop is usually:',
      options: ['A game anti-cheat', 'Chipset / platform drivers from the vendor', 'A toolbar', 'A VPN crack'],
      correct: 'b',
      hint: 'Platform before gadgets.',
      explanation: 'Chipset enables USB, power, and other devices to enumerate correctly.',
    },
  ],
  blanks: [
    {
      prompt: 'Installing an OS over the network from a boot server often uses ___ boot (Preboot eXecution Environment).',
      answer: 'PXE',
      hint: 'Pixie boot.',
      explanation: 'PXE + a campus image is the network installation method.',
    },
  ],
  practice: {
    prompt: 'Install finished but there is no network. Device Manager shows a yellow NIC. Next step?',
    options: [
      'Format again',
      'Install the correct NIC driver from vendor/OS repo, then test DHCP/static as specified',
      'Buy a new motherboard immediately',
      'Disable all devices',
    ],
    correct: 'b',
    hint: 'Configuration outcome includes devices.',
    explanation: 'Yellow bang = missing or failed driver. That is a software-install fault, not always dead hardware.',
  },
});

export const tvetSoftware3 = weekLesson({
  id: 'tvet-software-w3',
  courseId: 'software-install',
  title: 'Week 3 — Testing, user training, and software maintenance',
  titleSw: 'Wiki 3 — Majaribio, mafunzo, na matengenezo ya programu',
  cdacc: 'IT/CU/ICT/CR/2/5',
  examDomain: softwareDomain,
  minutes: 28,
  briefing:
    'Testing is a listed learning outcome: the software must meet the specification, not merely show a desktop. Smoke-test: boots, logs on, prints or exports, opens the curriculum apps, and survives a reboot. Check disk space, activation, Windows Update / apt upgrade, and that a standard user cannot install random .exe. Record results in a test report — date, machine ID, tester, pass/fail, defects.\n\nUser training is not optional in the unit. Show the staff member or class captain: login, how to save to the approved folder, how to update, and what not to download. Leave a one-page handout. If antivirus alerts, they must know who to call. Training reduces “the computer has a virus” tickets that are actually toolbar installs.\n\nMaintenance: patch on a schedule, remove unused packages, renew licences, and re-image when drift is cheaper than repair. Use WSUS, Intune, or apt unattended-upgrades as the college standard. Document the golden image version. When a new printer arrives, add the driver to the image so the next 40 installs do not repeat the hunt.\n\nPortfolio: test report + training attendance + maintenance log. That is how 260 hours is evidenced — not a single Next-Next-Finish screenshot.',
  briefingSw:
    'Jaribu kuingia, kuchapisha, na kuwasha upya. Mtumiaji wa kawaida asiweke .exe. Funza stafu. Patch kwa ratiba. Andika ripoti ya majaribio na logi ya matengenezo.',
  questions: [
    {
      prompt: 'A software test report should include:',
      options: [
        'Only a selfie with the PC',
        'Machine identity, tests run, pass/fail, defects, tester, date',
        'The HOD password',
        'A poem',
      ],
      correct: 'b',
      hint: 'Evidence.',
      explanation: 'CDACC portfolios want repeatable evidence of testing.',
    },
    {
      prompt: 'Why create a standard (non-admin) account for teachers after install?',
      options: [
        'To annoy them',
        'Least privilege: malware and accidental installs need elevation',
        'Windows forbids admin',
        'It speeds the GPU',
      ],
      correct: 'b',
      hint: 'Security management function of the OS.',
      explanation: 'Admin for technicians, standard for users — unless the role requires more.',
    },
    {
      prompt: 'In-place office update fails halfway. Best maintenance action?',
      options: [
        'Leave it broken',
        'Restore snapshot/backup, retry from vendor media, then retest the suite',
        'Delete System32',
        'Install three trial copies',
      ],
      correct: 'b',
      hint: 'Backout.',
      explanation: 'Maintenance includes recovery when an update fails — same idea as change management.',
    },
    {
      prompt: 'User training after a lab refresh should at least cover:',
      options: [
        'BIOS overclocking',
        'Login, saving work, printing, and who to call for faults',
        'How to pirate Adobe',
        'Disabling the firewall permanently',
      ],
      correct: 'b',
      hint: 'Outcome 5.',
      explanation: 'The unit lists user training as a competence, not a courtesy.',
    },
  ],
  blanks: [
    {
      prompt: 'A recorded list of patches, image versions, and licence renewals is a software ___ log.',
      answer: 'maintenance',
      hint: 'After install comes care.',
      explanation: 'Maintenance is how labs stay legal and bootable for the next cohort.',
    },
  ],
  practice: {
    prompt: 'Forty PCs pass smoke tests but teachers cannot open the MIS URL. Install was “successful”. What did testing miss?',
    options: [
      'Nothing — browsers are optional',
      'Application acceptance: proxy, DNS, certificates, and the actual MIS workflow',
      'More themes',
      'A louder beep on POST',
    ],
    correct: 'b',
    hint: 'Test against the requirement.',
    explanation: 'Functionality means the job the college hired the software to do, not a blank desktop.',
  },
});

export const tvetRepair1 = weekLesson({
  id: 'tvet-repair-w1',
  courseId: 'computer-repair',
  title: 'Week 1 — Troubleshooting method and probable cause',
  titleSw: 'Wiki 1 — Uchunguzi na sababu inayowezekana',
  cdacc: 'IT/CU/ICT/CR/3/5',
  examDomain: repairDomain,
  minutes: 32,
  briefing:
    'Perform Computer Repair and Maintenance (280 hours) is not “open the PC and guess”. The curriculum outcome is: identify the problem, form a theory of probable cause, test the theory, then act. Gather: what changed, error messages, beep codes, POST LEDs, and whether the fault is hardware, software, or both. Reproduce if safe. A burning smell is not a reproduce-and-hope case — isolate power first (safety unit).\n\nTools: screwdriver set, anti-static, multimeter, POST card if available, known-good RAM/PSU, boot USB, cable tester. Assemble the kit before you start so you do not walk across the workshop with an open chassis. Document the original configuration — RAM slots, cable routing, and jumper settings — because reassembly is a later outcome.\n\nTheories must be testable and ordered by likelihood and risk. No display: check power, then video cable, then RAM reseat, then GPU, then motherboard. Do not start by replacing the CPU. Test one change at a time. If the theory fails, document and form a new one. That is professional troubleshooting, and it is what CompTIA also expects.\n\nWrite a ticket: asset tag, symptoms, theories, tests, result. Assessors mark the method. A lucky reboot without notes is not competence.',
  briefingSw:
    'Tambua tatizo, unda nadharia, jaribu, kisha tengeneza. Nguvu kwanza, kisha POST, RAM, hifadhi. Chombo kimoja kwa wakati. Andika dalili na majaribio. Harufu ya moto: zima umeme.',
  questions: [
    {
      prompt: 'After identifying symptoms, the next CDACC repair step is to:',
      options: [
        'Replace every chip',
        'Establish a theory of probable cause, then test it',
        'Format immediately',
        'Call the vendor for a new building',
      ],
      correct: 'b',
      hint: 'Theory then test.',
      explanation: 'The unit lists troubleshooting as forming and testing probable cause.',
    },
    {
      prompt: 'A PC powers fans but has no beep and no display. Least useful first swap is:',
      options: ['Reseat RAM / try known-good RAM', 'The mechanical hard disk of user files', 'Video cable and monitor known-good', 'PSU 24-pin seating'],
      correct: 'b',
      hint: 'POST happens before the OS disk matters.',
      explanation: 'Storage faults appear after POST. No POST is power, CPU, RAM, firmware, or video.',
    },
    {
      prompt: 'Why change only one variable at a time?',
      options: [
        'To slow the exam',
        'So you know which action fixed or broke the system',
        'NITA bans two screwdrivers',
        'RAM must stay dusty',
      ],
      correct: 'b',
      hint: 'Scientific method.',
      explanation: 'Swapping PSU, RAM, and HDD together teaches you nothing.',
    },
    {
      prompt: 'A ticket with no asset tag and no tests is:',
      options: ['Industry standard', 'Incomplete evidence for the repair portfolio', 'Better for GDPR', 'Required by Ohm’s law'],
      correct: 'b',
      hint: 'Portfolio of evidence.',
      explanation: 'CDACC wants written troubleshooting, not folklore.',
    },
  ],
  blanks: [
    {
      prompt: 'Power-On Self-Test is abbreviated ___.',
      answer: 'POST',
      hint: 'Before the OS loads.',
      explanation: 'POST checks CPU, RAM, and firmware. Use it to split hardware from OS faults.',
    },
  ],
  practice: {
    prompt: 'Intermittent shutdowns under load. Trainee immediately reinstalls Windows. Your supervisor says?',
    options: [
      'Perfect — OS is always the cause',
      'Wrong theory order: check temperatures, PSU rails, and event logs before a destructive reload',
      'Skip hardware forever',
      'Increase pagefile to 200 GB first always',
    ],
    correct: 'b',
    hint: 'Heat and power look like software.',
    explanation: 'Thermal throttle and dying PSUs mimic OS crashes. Test the likely hardware theory.',
  },
});

export const tvetRepair2 = weekLesson({
  id: 'tvet-repair-w2',
  courseId: 'computer-repair',
  title: 'Week 2 — Disassemble, replace, reassemble, and ESD',
  titleSw: 'Wiki 2 — Bomoa, badilisha, kusanya, na ESD',
  cdacc: 'IT/CU/ICT/CR/3/5',
  examDomain: repairDomain,
  minutes: 32,
  briefing:
    'Disassembly is a listed outcome with techniques: photograph, bag screws by length, disconnect power, then cables, then cards, then drives, then motherboard last if needed. Do not pry by the PCB. CPU coolers need even torque when they go back. Laptop work: disconnect battery internally before the keyboard/trackpad cable. Use plastic tools near clips.\n\nReplace versus repair: consumer RAM and SSDs are replaced; a dry capacitor on a PSU may be repaired only if you are competent and the PSU is designed to be serviced — many college rules are replace-the-PSU. Match spec: DDR4 is not DDR5; SATA data is not SATA power. Record serials for warranty.\n\nReassembly is the reverse with cable management so fans are unobstructed and the side panel does not pinch SATA leads. Connect front-panel HD LED correctly or you will chase a “dead HDD” that is only a reversed LED. Ground yourself. Test-fit before all screws.\n\nComponent testing: known-good swap, meter on PSU rails (5 V, 12 V), and vendor diagnostics. Write a replace/repair report: what was faulty, part number, and why. Assessors fail messy trays and “extra screws left over with no idea”.',
  briefingSw:
    'Piga picha, weka skrubu kwenye mifuko. Zima betri ya laptop. DDR4 si DDR5. Kusanya kinyume cha kubomoa. Usibane kebo za SATA. Andika namba ya sehemu iliyobadilishwa.',
  questions: [
    {
      prompt: 'Before removing a laptop keyboard ribbon you should:',
      options: [
        'Increase brightness',
        'Disconnect internal battery / isolate power as the procedure requires',
        'Remove the CPU first always',
        'Soak the board',
      ],
      correct: 'b',
      hint: 'Live CMOS and battery.',
      explanation: 'Shorting a keyboard cable on a live battery board kills the EC.',
    },
    {
      prompt: 'DDR4 DIMM in a DDR5 slot:',
      options: ['Works if you push harder', 'Will not key in — different generation and notch', 'Doubles speed', 'Is required by CDACC'],
      correct: 'b',
      hint: 'Physical key.',
      explanation: 'Match the motherboard spec. Forcing RAM breaks the slot.',
    },
    {
      prompt: 'Best practice for screws during disassembly:',
      options: [
        'One bowl for the whole class',
        'Sorted by location/length, photographed, and accounted for at reassembly',
        'Leave them on the antistatic mat mixed with RAM',
        'Throw extras away'],
      correct: 'b',
      hint: 'Portfolio and safety.',
      explanation: 'A long screw through a laptop board is a new fault you created.',
    },
    {
      prompt: 'A replacement PSU must at least match:',
      options: [
        'Colour of the case only',
        'Connector types, wattage/headroom, and 24-pin/CPU/PCIe pinouts',
        'The old fan sticker year',
        'USB colour',
      ],
      correct: 'b',
      hint: 'Electrical and mechanical fit.',
      explanation: 'Under-rated PSUs reboot under GPU load. Wrong pinout lets the magic smoke out.',
    },
  ],
  blanks: [
    {
      prompt: 'Wrist straps and mats reduce damage from electrostatic discharge, abbreviated ___.',
      answer: 'ESD',
      hint: 'Static.',
      explanation: 'ESD kills MOSFETs silently. It is still the safety unit, applied in repair.',
    },
  ],
  practice: {
    prompt: 'After reassembly the PC POSTs but the front power LED is dark and the HDD LED is always on. Likely cause?',
    options: [
      'Dead CPU',
      'Front-panel LED pins reversed or swapped on the header',
      'Need a new operating system licence',
      'Ohm’s law failed'],
    correct: 'b',
    hint: 'Header polarity.',
    explanation: 'A classic reassembly fault. Check the motherboard silk screen.',
  },
});

export const tvetRepair3 = weekLesson({
  id: 'tvet-repair-w3',
  courseId: 'computer-repair',
  title: 'Week 3 — Functional testing and hardware/software upgrades',
  titleSw: 'Wiki 3 — Majaribio ya kazi na uboreshaji',
  cdacc: 'IT/CU/ICT/CR/3/5',
  examDomain: repairDomain,
  minutes: 30,
  briefing:
    'Testing after repair: power on, POST, BIOS/UEFI sees RAM and disks at expected size, OS boots, device manager/lspci clean, soak test (memtest, disk SMART, GPU stress if relevant). Generate a status report. If you replaced storage, confirm the user data restore. Do not return a machine that POSTs but overheats in twenty minutes.\n\nUpgrades are a separate outcome: reasons (performance, capacity, compatibility, security), procedure, then test. RAM upgrade: check max per slot, dual-channel matching. SSD upgrade: clone or clean install, enable AHCI/NVMe as required, align partitions. GPU/PSU: wattage and physical clearance. Firmware: backup, correct file, do not power-off a BIOS flash.\n\nSoftware upgrade versus hardware: more RAM will not fix a dying HDD. A new OS will not fix a shorted MOSFET. Choose the upgrade that matches the bottleneck you measured (Task Manager, `free -h`, SMART). Record before/after benchmarks in the portfolio.\n\nHandback: explain what changed, what not to do (warranty stickers, blocked vents), and get sign-off. That closes the 280-hour unit loop: troubleshoot, repair, test, upgrade, report.',
  briefingSw:
    'POST, kiasi cha RAM, SMART, na soak test. Uboreshaji: RAM, SSD, GPU/PSU, firmware. Pima bottleneck kwanza. Usizime umeme wakati wa kusasisha BIOS. Mteja atie sahihi.',
  questions: [
    {
      prompt: 'A BIOS flash interrupted by a power cut often results in:',
      options: ['Faster boot', 'A bricked firmware image until recovered with vendor SOP', 'More RAM', 'A better GPU'],
      correct: 'b',
      hint: 'Do not kill power.',
      explanation: 'Upgrade procedure includes stable power and the correct file for the board revision.',
    },
    {
      prompt: 'You add a 4 TB HDD but the OS shows ~2 TB. First check is:',
      options: [
        'The RAM colour',
        'Partition table (MBR vs GPT) and controller mode',
        'Keyboard language',
        'The HDMI dummy'],
      correct: 'b',
      hint: 'MBR cap.',
      explanation: 'MBR tops out around 2 TiB. GPT is the usual fix on modern OS.',
    },
    {
      prompt: 'Dual-channel RAM works best when:',
      options: [
        'Modules of matched size/speed sit in the correct paired slots',
        'One stick is DDR3 and one is DDR5',
        'Sticks are different sizes in any slots',
        'You tape them together'],
      correct: 'a',
      hint: 'Manual colour slots.',
      explanation: 'Wrong slots = single channel. Mismatched kits may run at the slower stick.',
    },
    {
      prompt: 'Soak testing means:',
      options: [
        'Washing the motherboard',
        'Running the system under representative load to catch intermittent thermal/power faults',
        'A 5-second POST only',
        'Ignoring SMART'],
      correct: 'b',
      hint: 'Time plus load.',
      explanation: 'Intermittents show up after minutes, not at the bench POST.',
    },
  ],
  blanks: [
    {
      prompt: 'Self-Monitoring, Analysis and Reporting Technology for disks is called ___.',
      answer: 'SMART',
      hint: 'Reallocated sectors.',
      explanation: 'SMART is a testing technique for storage before you return the PC.',
    },
  ],
  practice: {
    prompt: 'College wants “upgrade for speed” on a lab PC with 4 GB RAM and a 5400 RPM HDD. Best justified upgrade path?',
    options: [
      'RGB fans only',
      'SSD for the OS volume and RAM to the board maximum, then retest boot and app load',
      'A 16-core CPU on a board that cannot take it',
      'Larger CRT monitor'],
    correct: 'b',
    hint: 'Bottlenecks you can measure.',
    explanation: 'Storage and RAM are the cheap, correct theories for “slow office PC”.',
  },
});

export const tvetDatabase1 = weekLesson({
  id: 'tvet-database-w1',
  courseId: 'database-systems',
  title: 'Week 1 — Database concepts and models',
  titleSw: 'Wiki 1 — Dhana na modeli za hifadhidata',
  cdacc: 'IT/CU/ICT/CR/4/5',
  examDomain: databaseDomain,
  minutes: 30,
  briefing:
    'Manage Database System (310 hours) starts with concepts. A database is organised, shared, persistent data with a DBMS controlling access. File piles on a desktop are not a database: they lack integrity rules, concurrent access control, and a query language. Merits: less redundancy, consistency, security, and multi-user access. Demerits: cost, skill, and a single point of failure if you never back up.\n\nModels in the unit: hierarchical (tree), network (many-to-many pointers), relational (tables), and ER (design drawing of entities and relationships). Kenya’s college registers, M-Pesa ledgers, and NHIF lists are relational in practice. Hierarchical still appears in exam papers and in some LDAP trees. ER is how you design before you CREATE TABLE.\n\nKey vocabulary: entity, attribute, record, field, primary key, foreign key, schema. Redundancy is storing the same fact twice so it can disagree. Anomalies: insert, update, delete problems when the design is not normalised. You will normalise next week; this week you must explain why a spreadsheet of mixed student-and-course rows will hurt.\n\nTools listed by CDACC: Microsoft Access for teaching, MySQL and SQL Server in industry. You should be able to say when Access is enough (single-department forms) and when a server DBMS is required (concurrent campus MIS).',
  briefingSw:
    'Hifadhidata ni data iliyopangwa na DBMS. Faida: punguza kurudia, usalama. Hasara: gharama na backup. Modeli: hierarchical, network, relational, ER. Primary key, foreign key. Access, MySQL, SQL Server.',
  pairs: [
    { leftId: 'rel', left: 'Relational model', rightId: 'tables', right: 'Tables, rows, keys' },
    { leftId: 'hier', left: 'Hierarchical model', rightId: 'tree', right: 'Tree of parent–child records' },
    { leftId: 'er', left: 'ER model', rightId: 'design', right: 'Design diagram of entities and relationships' },
    { leftId: 'net', left: 'Network model', rightId: 'pointers', right: 'Records with many-to-many pointers' },
  ],
  pairPrompt: 'Match each database model named in CDACC ICT L5 to its idea.',
  pairHint: 'Tables vs trees vs diagrams.',
  pairExplanation: 'Relational is what you will implement in SQL. ER is how you design it.',
  questions: [
    {
      prompt: 'The main advantage of a DBMS over scattered Excel files is:',
      options: [
        'It cannot be backed up',
        'Controlled redundancy, integrity rules, and concurrent users',
        'It forbids keys',
        'It prints only once'],
      correct: 'b',
      hint: 'Merits in the unit.',
      explanation: 'Spreadsheets do not enforce foreign keys across a campus.',
    },
    {
      prompt: 'A primary key must be:',
      options: ['Nullable and duplicated', 'Unique (and not null) for each row', 'The student’s favourite colour', 'Always a long sentence'],
      correct: 'b',
      hint: 'Identity.',
      explanation: 'Admission number or a surrogate ID — not “John from Nakuru”.',
    },
    {
      prompt: 'An ER diagram is used to:',
      options: [
        'Replace the need for SQL forever',
        'Design entities, attributes, and relationships before creating tables',
        'Format the disk',
        'Draw the campus map only'],
      correct: 'b',
      hint: 'Design outcome.',
      explanation: 'You draw, then you implement. Skipping ER causes messy tables.',
    },
    {
      prompt: 'Hierarchical models organise data as:',
      options: ['A tree of parent and child records', 'Only JSON files', 'Random bits', 'Ohm’s law'],
      correct: 'a',
      hint: 'IMS-style trees.',
      explanation: 'Still in the syllabus even if your lab is MySQL.',
    },
  ],
  blanks: [
    {
      prompt: 'A key in table B that refers to the primary key of table A is a ___ key.',
      answer: 'foreign',
      hint: 'Links tables.',
      explanation: 'Foreign keys implement relationships and referential integrity.',
    },
  ],
  practice: {
    prompt: 'Registry stores student name, unit, and grade in one un-keyed sheet. Two “Mary Wanjiku” rows get mixed. This is:',
    options: [
      'Good hierarchical design',
      'Missing unique identifiers and a relational design — identity anomaly',
      'A printer fault',
      'Required by CDACC'],
    correct: 'b',
    hint: 'Keys.',
    explanation: 'Without a student ID as primary key, names collide. That is why we design models.',
  },
});

export const tvetDatabase2 = weekLesson({
  id: 'tvet-database-w2',
  courseId: 'database-systems',
  title: 'Week 2 — Design, integrity, and normalisation',
  titleSw: 'Wiki 2 — Usanifu, uadilifu, na normalisation',
  cdacc: 'IT/CU/ICT/CR/4/5',
  examDomain: databaseDomain,
  minutes: 32,
  briefing:
    'Design concepts in the unit include entity integrity and referential integrity. Entity integrity: primary key unique and not null. Referential integrity: a foreign key must match an existing parent or be null if allowed. If you delete a course that still has enrolments, the DBMS should reject or cascade according to the rule you declared — you must choose on purpose.\n\nRelationships: one-to-one (rarely, citizen ID card), one-to-many (one department, many staff), many-to-many (students and units) which needs a junction table (enrolment). Cardinality belongs on the ER drawing. Attributes have data types: integer, varchar, date, boolean. Do not store “yes” and “Y” and “true” as three conventions.\n\nNormalisation (1NF, 2NF, 3NF) is how you remove repeating groups and partial/transitive dependencies. 1NF: atomic columns, no lists in a cell. 2NF: no partial key dependencies in composite keys. 3NF: no non-key column depending on another non-key (city depending on postal code stored beside a repeating address). College example: do not store lecturer phone on every enrolment row.\n\nDeliverable: ER for a simple library or workshop job-card system, mapped to 3NF tables, with keys marked. That is the design week before SQL next week.',
  briefingSw:
    'Entity integrity: primary key si null. Referential: foreign key ina mzazi. Many-to-many inahitaji jedwali la kiungo. 1NF, 2NF, 3NF. Usiweke simu ya mwalimu kwenye kila mstari wa alama.',
  questions: [
    {
      prompt: 'Referential integrity means:',
      options: [
        'Passwords are optional',
        'Foreign keys must match an existing parent key (or follow the stated null/cascade rule)',
        'Tables have no names',
        'Print is disabled'],
      correct: 'b',
      hint: 'Parent must exist.',
      explanation: 'Orphan enrolment rows are a design fail.',
    },
    {
      prompt: 'Students ↔ units is typically:',
      options: ['One-to-one only', 'Many-to-many, implemented with an enrolment/junction table', 'Impossible in SQL', 'A hierarchical mandatory tree'],
      correct: 'b',
      hint: 'Junction.',
      explanation: 'That table holds grade and semester as relationship attributes.',
    },
    {
      prompt: 'Storing a comma-separated list of units in one student column violates:',
      options: ['1NF (atomic values)', 'Ohm’s law', 'HDMI', 'PXE'],
      correct: 'a',
      hint: 'Repeating group.',
      explanation: '1NF wants one fact per cell. Lists belong in child rows.',
    },
    {
      prompt: 'ON DELETE CASCADE on a course table would:',
      options: [
        'Prevent all deletes forever',
        'Remove child enrolment rows when the course is deleted — dangerous if not intended',
        'Print the ER',
        'Create RAM'],
      correct: 'b',
      hint: 'Know your rule.',
      explanation: 'RESTRICT/NO ACTION is often safer for academic data.',
    },
  ],
  blanks: [
    {
      prompt: 'A table that exists only to implement a many-to-many relationship is a ___ table.',
      answer: 'junction',
      hint: 'Also called a link or associative table.',
      explanation: 'Enrolment, order_line, and similar tables are junction tables with extra attributes.',
    },
  ],
  practice: {
    prompt: 'You store department name and HOD phone on every staff row. HOD changes number; 40 rows stay old. This is:',
    options: [
      'Good 3NF',
      'A transitive/redundancy anomaly — department should be its own entity',
      'Entity integrity success',
      'BCD arithmetic'],
    correct: 'b',
    hint: '3NF.',
    explanation: 'Non-key facts about the department do not belong repeating on staff.',
  },
});

export const tvetDatabase3 = weekLesson({
  id: 'tvet-database-w3',
  courseId: 'database-systems',
  title: 'Week 3 — SQL objects, queries, testing, and printables',
  titleSw: 'Wiki 3 — SQL, maswali, majaribio, na print',
  cdacc: 'IT/CU/ICT/CR/4/5',
  examDomain: databaseDomain,
  minutes: 32,
  briefing:
    'Objects: tables, queries/views, forms, reports, indexes, and users. CREATE TABLE with types and keys. INSERT, UPDATE, DELETE, SELECT with WHERE, JOIN, GROUP BY. Access uses QBE grids; MySQL uses the mysql client or Workbench. Parameter queries avoid concatenating user text — that links to the SQL injection lesson in cybersecurity.\n\nTesting: integration (forms write to the right tables), query testing (known input, expected row counts), and referential tests (orphan insert must fail). Generate a test report. Sample data should include the awkward cases: two students with similar names, a unit with zero enrolments, a deleted draft.\n\nPrinting: the unit still lists print of tables, queries, reports, and forms. In a modern MIS you export PDF, but for CDACC practicals you produce a readable report with headings, date, and filters (e.g. “failed students in ICT L5 2026”). Page setup, not a screenshot of datasheet chaos.\n\nSecurity: least-privilege accounts, hashed passwords if you ever store them (you should not store PINs in plaintext), and backups (mysqldump / Access compact and repair plus file copy). A database without a restore test is a rumour.',
  briefingSw:
    'CREATE TABLE, INSERT, SELECT JOIN. Forms na reports. Jaribu orphan INSERT ishindwe. Chapisha ripoti yenye kichwa na tarehe. Backup na least privilege. Usiunganishe SQL na maandishi ya mtumiaji.',
  questions: [
    {
      prompt: 'SELECT students who scored below 40 in a unit is best done with:',
      options: [
        'Deleting the table',
        'SELECT … FROM enrolment JOIN student WHERE grade < 40',
        'Printing the ER only',
        'Ohm’s law'],
      correct: 'b',
      hint: 'Query objects.',
      explanation: 'Filtering is a query, not a new database.',
    },
    {
      prompt: 'A form in Access/MySQL app stacks is for:',
      options: ['Controlled data entry onto tables', 'Replacing the DBMS', 'BIOS setup', 'Crimping'],
      correct: 'a',
      hint: 'Object list.',
      explanation: 'Forms, tables, queries, reports are the teaching object set.',
    },
    {
      prompt: 'The safest way to put user input into SQL is:',
      options: [
        'String concatenation of whatever they typed',
        'Bound parameters / prepared statements',
        'Disable the network forever',
        'All-caps table names'],
      correct: 'b',
      hint: 'Injection.',
      explanation: 'CDACC testing plus cyber: never trust concatenated SQL.',
    },
    {
      prompt: 'A backup you have never restored is:',
      options: ['Proven', 'Unverified — restore-test it', 'A primary key', 'BCD'],
      correct: 'b',
      hint: 'Testing outcome.',
      explanation: 'Database testing includes recoverability, not only SELECT.',
    },
  ],
  blanks: [
    {
      prompt: 'The SQL command that retrieves rows is ___.',
      answer: 'SELECT',
      hint: 'Not INSERT.',
      explanation: 'SELECT is the core of query testing and reports.',
    },
  ],
  practice: {
    prompt: 'Practical: the report of “all ICT L5 females in 2026” prints 0 rows but the table has data. First query test?',
    options: [
      'Drop the database',
      'Check JOIN conditions, filters (gender/year codes), and whether the form filter contradicts the query',
      'Buy SQL Server immediately',
      'Print the ER in landscape'],
    correct: 'b',
    hint: 'Query testing.',
    explanation: 'Wrong JOIN or coded values like F versus Female is the usual cause. Prove it with a simpler SELECT.',
  },
});

export const tvetProgramming1 = weekLesson({
  id: 'tvet-programming-w1',
  courseId: 'computer-programming',
  title: 'Week 1 — Concepts, translators, methodologies, and design tools',
  titleSw: 'Wiki 1 — Dhana, translators, mbinu, na zana za usanifu',
  cdacc: 'IT/CU/ICT/CR/5/5',
  examDomain: programDomain,
  minutes: 32,
  briefing:
    'Develop Computer Program (340 hours) starts with concepts. A program is a set of instructions a computer can execute. Programming is writing those instructions. Translators: compiler (whole program to machine code), interpreter (line by line), assembler for low level. Editors, linkers, and loaders complete the tool chain. Mixing “compiler” and “editor” in an oral loses marks.\n\nApproaches: structured/procedural, modular, object-oriented, functional. Methodologies: waterfall, Agile, RAD, spiral — CDACC lists Agile, Crystal, RAD among others. The program development cycle is still: problem, requirements, design, code, test, maintain. Agile repeats that in small increments. For a college practical, a mini waterfall with a test plan is acceptable if you document it.\n\nDesign tools: pseudo-code, flowcharts, decision tables/trees, data-flow diagrams. Top-down design decomposes; bottom-up builds from known modules; data-driven starts from the records. Languages: low-level (assembly), high-level (C, Python, Java), 4GL, OOP, visual. Choose by domain, popularity, tools, and the exam — this unit requires basic C and basic internet programming.\n\nThis week’s artefact: a problem statement (e.g. compute workshop job-card total), structured English, and a flowchart with start/end, process, decision. No code yet. Assessors want the design, because coding without design is the usual fail.',
  briefingSw:
    'Compiler dhidi ya interpreter. Linker na loader. Agile, RAD, waterfall. Pseudo-code, flowchart, decision table. C ni high-level structured. Buni kabla ya kuandika msimbo.',
  questions: [
    {
      prompt: 'A compiler differs from an interpreter because a compiler:',
      options: [
        'Only colours the editor',
        'Translates the whole source to object/machine code before running',
        'Cannot produce errors',
        'Is a type of RAM'],
      correct: 'b',
      hint: 'Whole vs line by line.',
      explanation: 'C is typically compiled. Many scripting languages are interpreted.',
    },
    {
      prompt: 'Pseudo-code is used to:',
      options: [
        'Replace the linker',
        'Describe algorithm logic in structured English before syntax',
        'Flash the BIOS',
        'Crimp cables'],
      correct: 'b',
      hint: 'Design tool.',
      explanation: 'If you cannot pseudo-code a loop, you cannot code it in C.',
    },
    {
      prompt: 'In a flowchart, a diamond typically represents:',
      options: ['A decision / condition', 'A magnetic tape only', 'The compiler', 'Ohm’s law'],
      correct: 'a',
      hint: 'Yes/no.',
      explanation: 'Parallelogram often I/O, rectangle process, oval start/end.',
    },
    {
      prompt: 'Agile development emphasises:',
      options: [
        'One giant delivery after years with no feedback',
        'Short iterations, working software, and responding to change',
        'Avoiding tests',
        'Only assembly language'],
      correct: 'b',
      hint: 'Methodology list.',
      explanation: 'Waterfall is linear. RAD/Agile trade documentation for speed — still test.',
    },
  ],
  blanks: [
    {
      prompt: 'The tool that combines object files with libraries into an executable is the ___.',
      answer: 'linker',
      hint: 'After compile.',
      explanation: 'Compile → link → load. The loader places the program in memory.',
    },
  ],
  practice: {
    prompt: 'A trainee opens Dev-C++ and types before writing requirements. For a CDACC portfolio you should:',
    options: [
      'Mark it complete',
      'Require problem statement, pseudo-code/flowchart, then code and test evidence',
      'Delete the compiler',
      'Convert it to hexadecimal by hand'],
    correct: 'b',
    hint: 'Outcomes 1–3 before 5.',
    explanation: 'The unit is development methodology, not typing speed.',
  },
});

export const tvetProgramming2 = weekLesson({
  id: 'tvet-programming-w2',
  courseId: 'computer-programming',
  title: 'Week 2 — Structured C: types, control, functions, and headers',
  titleSw: 'Wiki 2 — C: aina, control, functions, na headers',
  cdacc: 'IT/CU/ICT/CR/5/5',
  examDomain: programDomain,
  minutes: 35,
  briefing:
    'C concepts in the curriculum: characteristics, preprocessor directives (`#include`, `#define`), headers (`stdio.h`, `stdlib.h`, `math.h`, `string.h`), data types (`int`, `float`, `char`, arrays, structs), operators, and input/output with `printf`/`scanf` (or safer `fgets` in a security-aware lab). Every complete C program has `main`. Statements end with semicolons. Braces define blocks.\n\nControl: `if/else`, `switch`, `while`, `for`, `do-while`. Trace on paper with a trace table — that is how orals work. Functions: prototype, definition, call, return, and parameters (pass by value in C; pointers when you must change the caller’s data). Scope: local versus global. Avoid globals unless the lesson requires a demo of why they hurt.\n\nArrays and strings: a string is a `char` array with a `\\0` terminator. Off-by-one and buffer overflow are how C programs become cyber incidents. Check lengths. Structures group fields (a `Student` with id, name, grade). File I/O (`fopen`, `fclose`) if the practical stores records.\n\nLab: a menu-driven program — enter n numbers, compute average, reject invalid input, print a small report. Compile with warnings (`gcc -Wall`). Screenshot of source, compile, and sample run for the portfolio. Style: indent, names that mean something, comments that explain why.',
  briefingSw:
    '#include <stdio.h>, main, printf/scanf. if, for, while. Functions na return. String ina \\0. -Wall. Programu ya menyu: wastani wa namba, kataa input batili.',
  questions: [
    {
      prompt: '`#include <stdio.h>` is a:',
      options: ['Linker script only', 'Preprocessor directive pulling a standard header', 'BIOS setting', 'Foreign key'],
      correct: 'b',
      hint: 'Hash at top.',
      explanation: 'Preprocessor runs before the compiler proper.',
    },
    {
      prompt: 'A `for` loop is most appropriate when:',
      options: [
        'You know how many iterations you need',
        'You are drawing an ER diagram',
        'You are crimping',
        'The program must not repeat'],
      correct: 'a',
      hint: 'Counted repetition.',
      explanation: '`while` is for unknown counts; `do-while` runs at least once.',
    },
    {
      prompt: 'In C, a string is typically:',
      options: [
        'A `char` array terminated by `\\0`',
        'A SQL table',
        'An Ohm value',
        'Always 256 RAM chips'],
      correct: 'a',
      hint: 'Null terminator.',
      explanation: 'Forgetting `\\0` makes `printf("%s")` read off the end of the array.',
    },
    {
      prompt: '`scanf("%d", &x)` needs `&` because:',
      options: [
        'C is object-oriented only',
        '`scanf` must receive the address of `x` to store the value',
        'Ampersands start comments',
        'It converts to hex'],
      correct: 'b',
      hint: 'Pointers.',
      explanation: 'Pass by value would not update `x`. Address-of is required for scalars.',
    },
  ],
  blanks: [
    {
      prompt: 'The function that is the entry point of a hosted C program is ___.',
      answer: 'main',
      hint: 'int main(void).',
      explanation: 'Execution starts at main after the loader and CRT startup.',
    },
  ],
  practice: {
    prompt: 'Program should average five positive scores but crashes when the user types “nine”. Fix?',
    options: [
      'Ignore it — users are the problem',
      'Check `scanf` return value / read a line and validate before converting; loop until valid',
      'Remove `main`',
      'Use a hierarchical DBMS instead of C'],
    correct: 'b',
    hint: 'Defensive input.',
    explanation: 'Unvalidated `scanf` leaves the stream dirty and is undefined for wrong types.',
  },
});

export const tvetProgramming3 = weekLesson({
  id: 'tvet-programming-w3',
  courseId: 'computer-programming',
  title: 'Week 3 — Testing C programs and basic internet programming',
  titleSw: 'Wiki 3 — Majaribio ya C na programu ya intaneti',
  cdacc: 'IT/CU/ICT/CR/5/5',
  examDomain: programDomain,
  minutes: 32,
  briefing:
    'Testing is not “it ran once on my laptop”. Dry-run the flowchart, then unit-test functions with known inputs (average of 2, 4, 6 is 4). Boundary tests: zero items, negative where forbidden, maximum array size. Syntax errors versus logic errors versus runtime (divide by zero, NULL pointer). Use a test table in the portfolio.\n\nInternet programming in this unit is introductory: HTML structure (`html`, `head`, `body`, headings, links, forms), maybe CSS, and a simple client-side or server-side script as the college lab allows (JavaScript validation, or a tiny PHP/Python form that must not concatenate SQL). HTTP is request/response. GET versus POST. Never put passwords in a GET query string.\n\nConnect the tracks: a C program can write a `.html` report; a form can post to a backend that inserts with parameters into MySQL (database unit). That is how a semester project looks: design, C or web module, database, test report.\n\nIndustrial attachment (360 hours in the ICT L5 gross total) expects you to have this discipline: requirements, versioned source, tests, and a README. Git is not named in the 2018 PDF but is professional practice — use it if the lab has it.',
  briefingSw:
    'Jaribu mipaka na jedwali la majaribio. HTML, fomu, GET dhidi ya POST. Usitie nywila kwenye URL. Usiunganishe SQL. Mradi wa semester: buni, C au wavuti, hifadhidata, ripoti.',
  questions: [
    {
      prompt: 'A program compiles but always prints 0 for average when n=3. This is a:',
      options: ['Syntax error', 'Logic error', 'Successful linker', 'HDMI fault'],
      correct: 'b',
      hint: 'Runs, wrong answer.',
      explanation: 'Syntax stops compile. Logic is a wrong algorithm (e.g. integer division).',
    },
    {
      prompt: 'HTML form passwords should be sent with:',
      options: ['GET so they appear in history', 'POST over HTTPS, never in the query string', 'ICMP', 'Ohm’s law'],
      correct: 'b',
      hint: 'Internet programming + cyber.',
      explanation: 'GET leaks in logs and Referer. POST in cleartext still needs TLS.',
    },
    {
      prompt: 'A boundary test for an array of max 10 scores includes:',
      options: ['n=10 and n=11', 'Only n=7', 'Compiling twice', 'Changing the wallpaper'],
      correct: 'a',
      hint: 'On and over the limit.',
      explanation: 'Off-by-one lives at the boundary.',
    },
    {
      prompt: 'Client-side JavaScript validation is:',
      options: [
        'Sufficient alone for security',
        'Helpful UX but the server must still validate',
        'A replacement for C',
        'Illegal in Kenya'],
      correct: 'b',
      hint: 'Never trust the browser.',
      explanation: 'Users can disable JS. Server-side checks are mandatory.',
    },
  ],
  blanks: [
    {
      prompt: 'The markup language of web pages in the internet-programming outcome is ___.',
      answer: 'HTML',
      hint: 'HyperText.',
      explanation: 'HTML structures the page; CSS styles; JS behaves.',
    },
  ],
  practice: {
    prompt: 'A student web form concatenates the search box into `SELECT * FROM books WHERE title=` and drops the library DB. Cause?',
    options: [
      'HTML is deprecated',
      'SQL injection from string-built queries — use parameters and least-privilege DB account',
      'Too much CSS',
      'The C compiler'],
    correct: 'b',
    hint: 'Same as database week 3.',
    explanation: 'Internet programming without sanitisation is a cyber incident. That is semester integration.',
  },
});

export const tvetOs3 = weekLesson({
  id: 'tvet-os-w3',
  courseId: 'operating-systems',
  title: 'Week 3 — Process, memory, and file management (OS internals)',
  titleSw: 'Wiki 3 — Mchakato, kumbukumbu, na faili',
  cdacc: 'IT/CU/ICT/CR/6/5',
  examDomain: osDomain,
  minutes: 32,
  briefing:
    'Manage Operating System (210 hours) goes beyond installing Windows. Fundamentals: kernel versus shell, system calls, monolithic versus layered versus microkernel/client-server versus virtual-machine structures. Types: batch, time-sharing, real-time, distributed, mobile. Installation you already practised; this week is how the OS shares the machine.\n\nProcess management: a process is a program in execution with a process control block (PCB). States: new, ready, running, waiting, terminated. Threads share the process address space. Scheduling (FCFS, SJF, round robin, priority) decides who runs. Concurrency control: race conditions, critical sections, semaphores, monitors, message passing. Deadlock: four Coffman conditions — know prevention versus detection at theory level.\n\nMemory: contiguous allocation, paging, segmentation, virtual memory, and thrashing when the working set does not fit. I/O: device drivers, interrupts, buffering. File systems: directories, allocation (FAT, NTFS, ext4), permissions you met in Linux essentials. Emerging: containers, TPM-backed secure boot, and 64-bit only images.\n\nPractical: use Task Manager / `top` / `ps` to identify a runaway process, `free` for memory, and Event Viewer. Tie a freeze to memory pressure rather than “Windows is bad”. That is the technician translation of this unit.',
  briefingSw:
    'Kernel dhidi ya shell. PCB, hali za process, threads. Scheduling. Semaphore. Paging na virtual memory. Thrashing. FAT, NTFS, ext4. top/ps na Task Manager.',
  questions: [
    {
      prompt: 'The kernel is:',
      options: [
        'A user wallpaper',
        'The core OS code that runs in privileged mode and handles system calls',
        'A type of capacitor',
        'Only a GUI theme'],
      correct: 'b',
      hint: 'Privileged.',
      explanation: 'The shell is the user interface to the kernel.',
    },
    {
      prompt: 'Round-robin scheduling is characterised by:',
      options: ['A time quantum / time slice', 'Shortest job only with no preemption ever', 'Random RAM colours', 'One process until the college closes'],
      correct: 'a',
      hint: 'Fair share of CPU.',
      explanation: 'FCFS is a queue. SJF picks short jobs. Priority can starve.',
    },
    {
      prompt: 'Thrashing means:',
      options: [
        'The disk is full of movies',
        'The system spends most of its time paging, not doing useful work',
        'A good compile',
        'A welding defect'],
      correct: 'b',
      hint: 'Virtual memory overload.',
      explanation: 'Add RAM or reduce working set. Reinstalling Office may not help.',
    },
    {
      prompt: 'A process control block stores:',
      options: ['Only the hexadecimal colour of the window', 'PID, state, registers, memory info, and accounting', 'The HDMI EDID only', 'Ohm’s law'],
      correct: 'b',
      hint: 'PCB.',
      explanation: 'Without a PCB the scheduler cannot context-switch.',
    },
  ],
  blanks: [
    {
      prompt: 'A program in execution is called a ___.',
      answer: 'process',
      hint: 'Not just a file on disk.',
      explanation: 'The same program can have many processes (two Notepads).',
    },
  ],
  practice: {
    prompt: 'Lab PCs freeze when browsers open 80 tabs. `free` shows almost no RAM and high swap. OS diagnosis?',
    options: [
      'Need a new compiler',
      'Memory pressure / thrashing — add RAM or limit workloads, check for a leak',
      'Re-crimp all RJ45',
      'Disable the kernel'],
    correct: 'b',
    hint: 'Week 3 memory outcome.',
    explanation: 'This is Manage OS, not Install Software. Measure, then act.',
  },
});

export const tvetNet3 = weekLesson({
  id: 'tvet-net-w3',
  courseId: 'computer-networks',
  title: 'Week 3 — Device configuration, LAN types, and network testing',
  titleSw: 'Wiki 3 — Usanidi wa vifaa, LAN, na majaribio',
  cdacc: 'IT/CU/ICT/CR/1/5',
  examDomain: netDomain,
  minutes: 32,
  briefing:
    'Perform Computer Networking (300 hours) learning outcomes continue: identify types (LAN, WAN, PAN, MAN), topologies (star, ring, mesh, hybrid, point-to-point), then connect, configure, build a LAN, and test. Devices: hub versus switch versus router, ports, media (copper, fibre, wireless), NICs, gateways. Hubs collide; switches forward by MAC; routers by IP.\n\nConfiguration: management IP on a switch, default gateway, DNS, DHCP pool, and wireless SSID/security (WPA2/WPA3, not open lab SSIDs with the password on the blackboard forever). Ethernet and the TCP/IP suite. Document the architecture: which VLAN is staff, which is students, where NAT happens. College LANs usually star out from a core switch — do not invent a ring because it looks exam-fancy if the site is a star.\n\nTesting tools in the curriculum: cable tester, tone/signal tester, clamp meter and voltmeter when you suspect PoE or power issues, plus `ping`, `ipconfig`/`ip`, `tracert`. Write a test plan: what will be tested, expected result, instruments. A link light is not a test report. Split pairs pass some cheap testers and fail under load — use a proper wiremap.\n\nSafety: antistatic, no copper punch-downs on live PoE without knowing the kit, fibre eye safety. Resources: crimp tools, RJ45, punch-down, labelled patch panel. Portfolio: drawing, IP plan, test results. That is 300 hours evidenced, not one successful ping of localhost.',
  briefingSw:
    'LAN/WAN/PAN, star/mesh. Switch ni MAC; router ni IP. DHCP, gateway, WPA2/WPA3. Cable tester, ping, traceroute. Andika mpango wa majaribio. Usitumie nenosiri la Wi-Fi ubaoni milele.',
  questions: [
    {
      prompt: 'A switch primarily forwards frames using:',
      options: ['IP addresses only', 'MAC addresses in the CAM/MAC table', 'Ohm’s law', 'Postal codes'],
      correct: 'b',
      hint: 'Layer 2.',
      explanation: 'Routers use IP. Hubs flood everything.',
    },
    {
      prompt: 'Which topology is most common for a college computer lab LAN?',
      options: ['Star (or extended star) on switches', 'A token ring because the exam sheet showed one in 1985', 'Mesh of every PC to every PC with fibre', 'Point-to-point RS-232 only'],
      correct: 'a',
      hint: 'Practical labs.',
      explanation: 'You must still be able to define ring and mesh for the paper.',
    },
    {
      prompt: 'A cable tester that only checks continuity may miss:',
      options: ['Split pairs and NEXT problems', 'Whether the PC is on', 'The SSID name', 'The CDACC unit code'],
      correct: 'a',
      hint: 'Wiremap quality.',
      explanation: 'T568A/B consistency both ends is part of connecting devices.',
    },
    {
      prompt: 'APIPA 169.254.x.x on a lab PC usually means:',
      options: ['Successful DHCP', 'DHCP failed and the client self-assigned', 'A public Google IP', 'Fibre is up'],
      correct: 'b',
      hint: 'You already met this in networks 2 — now it is in the test plan.',
      explanation: 'Test: ping gateway. If APIPA, check cable, VLAN, DHCP pool exhaustion.',
    },
  ],
  blanks: [
    {
      prompt: 'The protocol suite used on almost all modern LANs and the internet is ___.',
      answer: 'TCP/IP',
      hint: 'Not IPX.',
      explanation: 'Ethernet at layer 2, TCP/IP above. CDACC lists both.',
    },
  ],
  practice: {
    prompt: 'New VLAN for guests: they receive IPs but cannot reach the internet. Staff VLAN is fine. Best first theory?',
    options: [
      'Replace every NIC in the college',
      'Check guest VLAN SVI/gateway, ACL/firewall, NAT, and DNS — routing/policy, not cabling of staff',
      'Install Microsoft Access',
      'Change all PCs to ring topology'],
    correct: 'b',
    hint: 'Configure then test.',
    explanation: 'A test plan isolates: L2 connectivity works (DHCP), L3/policy fails. That is the unit.',
  },
});

export const tvetElectronicsLessons = [tvetElectronics1, tvetElectronics2, tvetElectronics3];
export const tvetSoftwareLessons = [tvetSoftware1, tvetSoftware2, tvetSoftware3];
export const tvetRepairLessons = [tvetRepair1, tvetRepair2, tvetRepair3];
export const tvetDatabaseLessons = [tvetDatabase1, tvetDatabase2, tvetDatabase3];
export const tvetProgrammingLessons = [tvetProgramming1, tvetProgramming2, tvetProgramming3];
export const tvetOsSemesterLessons = [tvetOs3];
export const tvetNetSemesterLessons = [tvetNet3];

export const tvetSemesterLessons = [
  ...tvetElectronicsLessons,
  ...tvetSoftwareLessons,
  ...tvetRepairLessons,
  ...tvetDatabaseLessons,
  ...tvetProgrammingLessons,
  ...tvetOsSemesterLessons,
  ...tvetNetSemesterLessons,
];
