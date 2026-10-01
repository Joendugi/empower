import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, BookProgress } from '@cyberlearn/types';

export const SEEDED_BOOKS: Book[] = [
  {
    id: 'book-water-engineering',
    title: 'Decentralized Potable Water Engineering & Slow Sand Filtration',
    titleSw: 'Uhandisi wa Maji Safi na Uchujaji wa Mchanga',
    author: 'Dr. Joseph Kamau & Civilisation Resilience Initiative',
    description: 'Comprehensive engineering manual on sizing gravity slow sand filters, biological Schmutzdecke cultivation, Moringa coagulants, and solar UV-A disinfection.',
    descriptionSw: 'Mwongozo kamili wa uhandisi kuhusu upimaji wa vichungi vya mchanga, ukuzaji wa Schmutzdecke, na usafishaji wa maji kwa jua.',
    category: 'resilience',
    tradeId: 'water-sanitation-hygiene',
    tradeTitle: 'Water Sanitation & Hygiene',
    coverColor: 'from-blue-600 to-cyan-900',
    fileFormat: 'markdown',
    fileSizeMb: 4.2,
    totalPages: 84,
    estimatedMinutes: 180,
    featured: true,
    rating: 4.9,
    readersCount: 1240,
    cdaccUnitId: 'CU/ENV/WT/CR/01/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Stratification & Sizing of Sand Beds', pageNumber: 1 },
      { id: 'ch2', title: 'Hyponeuston Biology and Predation', pageNumber: 22 },
      { id: 'ch3', title: 'Cationic Flocculation with Moringa oleifera', pageNumber: 45 },
      { id: 'ch4', title: 'Solar Disinfection (SODIS) Optics & PET', pageNumber: 65 },
      { id: 'ch5', title: 'Maintenance, Scraping & Rejuvenation', pageNumber: 76 },
    ],
    contentMarkdown: `# Decentralized Potable Water Engineering

## Chapter 1: Stratification & Sizing of Sand Beds
Slow sand filtration relies on a carefully graded stratification of quartz river sand and gravel.
Unlike pressurized rapid filtration, water moves strictly by gravity at velocities between 0.1 and 0.2 meters per hour.

### Key Stratification Strata:
1. **Underdrainage gravel**: 15 cm coarse gravel (12-25 mm)
2. **Intermediate transition**: 5 cm pea gravel (2-6 mm)
3. **Active filtering quartz sand**: 60-90 cm with D10 grain size of 0.15-0.35 mm
4. **Supernatant raw water column**: 0.7-1.0 meter depth maintained continuously

## Chapter 2: The Schmutzdecke Biology
The true purification organ is not the mineral sand, but the biological skin that forms on its uppermost 2-3 centimeters.
Biofilms of algae, diatoms, ciliates, and bacterivorous nematodes actively trap and digest waterborne pathogens.
`,
  },
  {
    id: 'book-solar-pv-systems',
    title: 'East Africa Off-Grid Photovoltaic & DC Systems Field Guide',
    titleSw: 'Mwongozo wa Mifumo ya Umeme wa Jua na DC Afrika Mashariki',
    author: 'Eng. Faith Chebet (EPRA Certified Lead)',
    description: 'Standard technician reference for sizing panels, AGM/Gel/LiFePO4 battery banks, MPPT controllers, DC voltage-drop cabling, and multimeter commissioning.',
    descriptionSw: 'Rejea ya kiufundi ya kupima paneli, betri za AGM/Gel/LiFePO4, vidhibiti vya MPPT na nyaya za DC.',
    category: 'engineering',
    tradeId: 'solar-energy',
    tradeTitle: 'Solar Energy Installation',
    coverColor: 'from-amber-500 to-orange-900',
    fileFormat: 'markdown',
    fileSizeMb: 6.8,
    totalPages: 112,
    estimatedMinutes: 240,
    featured: true,
    rating: 4.8,
    readersCount: 2180,
    cdaccUnitId: 'CU/ENG/SL/CR/02/5',
    publishedYear: 2025,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Photovoltaic Cell Physics & NOCT Derating', pageNumber: 1 },
      { id: 'ch2', title: 'Battery Chemistry, DoD, and C-Ratings', pageNumber: 28 },
      { id: 'ch3', title: 'MPPT vs PWM Controller Dynamic Sizing', pageNumber: 56 },
      { id: 'ch4', title: 'DC Circuit Fusing & Safety Standards', pageNumber: 82 },
      { id: 'ch5', title: 'Multimeter Troubleshooting & Commissioning', pageNumber: 98 },
    ],
    contentMarkdown: `# East Africa Off-Grid Photovoltaic Field Guide

## Chapter 1: Photovoltaic Cell Physics
Silicon p-n junction converts photon flux into direct electrical current.
In equatorial Kenya (latitude 4°S to 4°N), panels must be tilted at a minimum of 5 degrees to enable self-cleaning from rainfall.

### Temperature Derating:
Solar modules are tested at Standard Test Conditions (STC) at 25 °C.
On an unshaded tin roof in Garissa or Mombasa, cell operating temperatures routinely exceed 55 °C.
With a power temperature coefficient of -0.38%/°C, output drops by over 11.4%.
`,
  },
  {
    id: 'book-food-preservation',
    title: 'Post-Harvest Grain Storage & Traditional Fermentation',
    titleSw: 'Uhifadhi wa Nafaka Baada ya Mavuno na Uchachushaji',
    author: 'Dr. Beatrice Muthoni & Kenya Agricultural Research Institute',
    description: 'Comprehensive protocols for hermetic bag storage, solar tunnel dryers, lacto-fermented gruels (uji wa togwa), smoked gourd dairy, and seed saving.',
    descriptionSw: 'Mbinu kamili za mifuko ya hermetic, vikaushio vya jua, uchachushaji wa uji, na uhifadhi wa mbegu.',
    category: 'agriculture',
    tradeId: 'agriculture',
    tradeTitle: 'Sustainable Agriculture',
    coverColor: 'from-emerald-600 to-green-950',
    fileFormat: 'markdown',
    fileSizeMb: 3.9,
    totalPages: 96,
    estimatedMinutes: 195,
    featured: true,
    rating: 4.9,
    readersCount: 1640,
    cdaccUnitId: 'CU/AGR/FS/CR/01/4',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Hermetic Depletion of Oxygen in Grain Storage', pageNumber: 1 },
      { id: 'ch2', title: 'Solar Tunnel Drying & Water Activity Thresholds', pageNumber: 25 },
      { id: 'ch3', title: 'Lactic Acid Bacteria & the pH 4.0 Safety Barrier', pageNumber: 48 },
      { id: 'ch4', title: 'Salt Curing & Smoke Phenolic Deposition', pageNumber: 70 },
      { id: 'ch5', title: 'Seed Saving & Open-Pollinated Variety Selection', pageNumber: 84 },
    ],
    contentMarkdown: `# Post-Harvest Grain Storage & Fermentation

## Chapter 1: Hermetic Grain Storage
Kenya experiences 30-40% annual post-harvest losses.
Sealing dried maize (< 13% moisture) in triple-layer hermetic bags (PICS) depletes oxygen below 2% via insect respiration, killing weevils without neurotoxic chemicals.
`,
  },
  {
    id: 'book-trauma-first-aid',
    title: 'Remote Trauma & Pre-Hospital First Aid in East Africa',
    titleSw: 'Msaada wa Kwanza wa Majeraha Vijijini',
    author: 'Capt. David Odhiambo (Wilderness EMS)',
    description: 'Tactical and rural bystander guide to Class I-IV haemorrhage control, windlass tourniquets, chest seals, fracture splinting, and improvised stretchers.',
    descriptionSw: 'Mwongozo wa kwanza wa kudhibiti kuvuja damu, tourniquet, splint za miguu, na machela ya kubuni.',
    category: 'health',
    tradeId: 'community-health-support',
    tradeTitle: 'Community Health & Emergency',
    coverColor: 'from-rose-600 to-red-950',
    fileFormat: 'markdown',
    fileSizeMb: 5.1,
    totalPages: 104,
    estimatedMinutes: 210,
    featured: true,
    rating: 5.0,
    readersCount: 3410,
    cdaccUnitId: 'CU/MED/FA/CR/03/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Catastrophic Bleeding & Tourniquet Biomechanics', pageNumber: 1 },
      { id: 'ch2', title: 'Airway Obstruction & 3-Sided Vented Chest Seals', pageNumber: 26 },
      { id: 'ch3', title: 'Thermal Burns, Cool Water Rules & Cling Wrap', pageNumber: 49 },
      { id: 'ch4', title: 'Fracture Neurovascular PMS Assessment & Splints', pageNumber: 72 },
      { id: 'ch5', title: 'The <C>ABCDE Algorithm & Improvised Stretchers', pageNumber: 91 },
    ],
    contentMarkdown: `# Remote Trauma & Pre-Hospital First Aid

## Chapter 1: Catastrophic Bleeding
Uncontrolled hemorrhage can cause fatal exsanguination in under 3 minutes.
Direct firm pressure, wound packing with clean cotton, and a windlass tourniquet placed 5-7 cm above the wound are the essential triad of bystander intervention.
`,
  },
  {
    id: 'book-welding-fabrication',
    title: 'Shielded Metal Arc Welding (SMAW) Workshop Practice',
    titleSw: 'Ulehemu wa Chuma na Mazoezi ya Karakana',
    author: 'Instructor Moses Mwangi (NITA Master Craftsman)',
    description: 'Complete manual for electrode selection (E6013, E7018), striking an arc, joint design, welding safety, and defect inspection for Kenyan metalworkers.',
    descriptionSw: 'Mwongozo kamili wa uchaguzi wa elektrodi, kuwasha arc, na usalama wa kulehemu.',
    category: 'tvet-trade',
    tradeId: 'welding-fabrication',
    tradeTitle: 'Welding & Fabrication',
    coverColor: 'from-slate-700 to-zinc-950',
    fileFormat: 'markdown',
    fileSizeMb: 7.5,
    totalPages: 140,
    estimatedMinutes: 320,
    featured: false,
    rating: 4.7,
    readersCount: 1820,
    cdaccUnitId: 'CU/ENG/WF/CR/01/4',
    publishedYear: 2024,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Arc Welding Physics & Transformer Current', pageNumber: 1 },
      { id: 'ch2', title: 'Electrode Classification & Storage', pageNumber: 30 },
      { id: 'ch3', title: 'Butt, Lap, and Tee Joint Preparation', pageNumber: 65 },
      { id: 'ch4', title: 'Slag Inclusions, Porosity & Undercut Remediation', pageNumber: 102 },
    ],
    contentMarkdown: `# SMAW Workshop Practice

## Chapter 1: Arc Welding Physics
Shielded Metal Arc Welding produces an electric arc between a flux-covered consumable electrode and the base workpiece.
The arc temperature reaches over 3,500 °C, instantly melting base steel.
`,
  },
  {
    id: 'book-shelter-construction',
    title: 'Natural Building & Resilient Structural Engineering in East Africa',
    titleSw: 'Uhandisi wa Ujenzi wa Asili na Miundo Thabiti Afrika Mashariki',
    author: 'Arch. Daniel Mutua (Earth Architecture Kenya)',
    description: 'Engineering guide to soil classification, compressed earth blocks (CEB), Superadobe catenary domes, timber King Post trusses, and ferro-cement cisterns.',
    descriptionSw: 'Mwongozo wa uhandisi kuhusu upimaji wa udongo, matofali ya CEB, kuba za Superadobe, na matanki ya ferro-cement.',
    category: 'engineering',
    tradeId: 'masonry',
    tradeTitle: 'Masonry & Structural Building',
    coverColor: 'from-amber-700 to-stone-950',
    fileFormat: 'markdown',
    fileSizeMb: 6.2,
    totalPages: 128,
    estimatedMinutes: 260,
    featured: true,
    rating: 4.9,
    readersCount: 2490,
    cdaccUnitId: 'CU/CON/MS/CR/02/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Soil Fractions & 24h Jar Sedimentation', pageNumber: 1 },
      { id: 'ch2', title: 'Cinva-Ram Pressing & Damp Curing', pageNumber: 28 },
      { id: 'ch3', title: 'Superadobe & Catenary Arch Domes', pageNumber: 55 },
      { id: 'ch4', title: 'King Post Trusses & Hurricane Uplift Ties', pageNumber: 84 },
      { id: 'ch5', title: 'Thin-Shell Ferro-Cement Rainwater Tanks', pageNumber: 108 },
    ],
    contentMarkdown: `# Natural Building & Resilient Structural Engineering

## Chapter 1: Soil Fractions & Testing
Structural earth relies on mineral subsoil containing 65-75% sand aggregate and 15-25% cohesive clay binder.
The 24-hour glass jar sedimentation test accurately separates sand, silt, and clay strata to determine stabilization requirements.
`,
  },
  {
    id: 'book-emergency-communications',
    title: 'Off-Grid Communications, VHF/UHF & LoRa Mesh Field Manual',
    titleSw: 'Mwongozo wa Mawasiliano Nje ya Gridi na LoRa Mesh',
    author: 'Eng. Robert Ochieng (Amateur Radio Society of Kenya 5Z4)',
    description: 'Field technical guide to antenna calculation, handheld VHF/UHF Baofeng transceivers, regional NVIS skywave, solar Meshtastic LoRa packet repeaters, and lightning grounding.',
    descriptionSw: 'Mwongozo wa uwanjani kuhusu antena, redio za Baofeng, mawasiliano ya NVIS, na mitandao ya LoRa Meshtastic.',
    category: 'technology',
    tradeId: 'electrical-installation',
    tradeTitle: 'Telecommunications & RF Systems',
    coverColor: 'from-cyan-600 to-blue-950',
    fileFormat: 'markdown',
    fileSizeMb: 5.7,
    totalPages: 116,
    estimatedMinutes: 230,
    featured: true,
    rating: 4.9,
    readersCount: 3120,
    cdaccUnitId: 'CU/ICT/TC/CR/03/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Electromagnetic Wavelength & Antennas', pageNumber: 1 },
      { id: 'ch2', title: 'Handheld VHF/UHF & Repeater Offsets', pageNumber: 26 },
      { id: 'ch3', title: 'High Frequency NVIS Regional Skywaves', pageNumber: 52 },
      { id: 'ch4', title: 'Decentralized LoRa Packet Mesh Networks', pageNumber: 78 },
      { id: 'ch5', title: 'Guyed Masts & Single-Point RF Grounding', pageNumber: 98 },
    ],
    contentMarkdown: `# Off-Grid Communications & Mesh Networks

## Chapter 1: Wavelength & Antenna Resonance
Radio waves travel at light speed. An antenna resonates when cut to precise fractions of its operating wavelength.
Operating into an unmatched antenna reflects RF energy back into the transmitter, destroying output power amplifier transistors.
`,
  },
  {
    id: 'book-ecological-sanitation',
    title: 'Ecological Sanitation & Closed-Loop Waste Systems',
    titleSw: 'Usafi wa Mazingira na Mfumo wa Taka Wenye Mzunguko',
    author: 'Eng. Grace Akinyi & EcoSan East Africa Initiative',
    description: 'Complete guide to urine-diversion dry toilets (UDDTs), fixed-dome biogas digesters, composting latrines, vermicomposting with Eisenia fetida, and horizontal subsurface flow constructed wetlands for greywater treatment.',
    descriptionSw: 'Mwongozo kamili wa vyoo vya UDDT, vichombo vya biogas, mabwawa ya ujenzi, minyoo ya Eisenia fetida, na matibabu ya maji machafu.',
    category: 'resilience',
    tradeId: 'water-sanitation-hygiene',
    tradeTitle: 'Water Sanitation & Hygiene',
    coverColor: 'from-green-700 to-emerald-950',
    fileFormat: 'markdown',
    fileSizeMb: 5.4,
    totalPages: 108,
    estimatedMinutes: 220,
    featured: true,
    rating: 4.8,
    readersCount: 1870,
    cdaccUnitId: 'CU/ENV/SN/CR/04/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Sanitation Ladder & Faecal-Oral Disease Routes', pageNumber: 1 },
      { id: 'ch2', title: 'Urine-Diversion Dry Toilets — Design & Construction', pageNumber: 22 },
      { id: 'ch3', title: 'Fixed-Dome Biogas Digesters — Sizing & Operation', pageNumber: 46 },
      { id: 'ch4', title: 'Composting Latrines & Vermicomposting', pageNumber: 74 },
      { id: 'ch5', title: 'Constructed Wetlands & Greywater Treatment', pageNumber: 92 },
    ],
    contentMarkdown: `# Ecological Sanitation & Closed-Loop Waste Systems

## Chapter 1: The Sanitation Ladder
In post-crisis communities the collapse of sewage infrastructure is one of the fastest triggers of epidemic disease.
The F-diagram identifies six pathways — Fingers, Flies, Fields, Fluids, Food, and Floods — by which pathogens travel from faeces to mouth.
Breaking any one pathway dramatically reduces disease burden. The WHO/JMP sanitation service ladder ranges from open defecation to safely managed systems aligned with SDG 6.2.
`,
  },
  {
    id: 'book-community-health',
    title: 'Community Epidemiology & Disease Control Field Guide',
    titleSw: 'Mwongozo wa Ugonjwa wa Mlipuko na Udhibiti wa Magonjwa',
    author: 'Dr. Agnes Mwangi (Kenya Field Epidemiology & Laboratory Training Programme)',
    description: 'Practical field manual covering R0, herd immunity, ORT formulation, malaria RDT/ACT protocols, vaccination cold chain, VVM interpretation, IDSR alert thresholds, contact tracing, and outbreak line listing.',
    descriptionSw: 'Mwongozo wa wahusika wa afya ya jamii kuhusu R0, ORT, malaria RDT/ACT, mnyororo baridi wa chanjo, na ufuatiliaji wa mlipuko.',
    category: 'health',
    tradeId: 'community-health-support',
    tradeTitle: 'Community Health & Epidemiology',
    coverColor: 'from-teal-600 to-cyan-950',
    fileFormat: 'markdown',
    fileSizeMb: 5.1,
    totalPages: 104,
    estimatedMinutes: 210,
    featured: true,
    rating: 4.9,
    readersCount: 4120,
    cdaccUnitId: 'CU/MED/PH/CR/05/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Disease Transmission & the Epidemiological Triangle', pageNumber: 1 },
      { id: 'ch2', title: 'Oral Rehydration Therapy & Diarrhoeal Disease', pageNumber: 22 },
      { id: 'ch3', title: 'Malaria — RDT Diagnosis & ACT Treatment', pageNumber: 46 },
      { id: 'ch4', title: 'Vaccination Cold Chain & KEPI Immunisation', pageNumber: 70 },
      { id: 'ch5', title: 'IDSR Surveillance & Outbreak Response', pageNumber: 88 },
    ],
    contentMarkdown: `# Community Epidemiology & Disease Control

## Chapter 1: The Epidemiological Triangle
Every infectious disease requires three elements: the agent (pathogen), the host (susceptible person), and the environment enabling contact.
Removing any one side of this triangle breaks transmission. The basic reproduction number R0 determines how many secondary cases each infectious person generates in a fully susceptible population.
When effective R_eff drops below 1.0, the outbreak collapses.
`,
  },
  {
    id: 'book-sustainable-agriculture',
    title: 'Smallholder Soil Science & Regenerative Agriculture Manual',
    titleSw: 'Sayansi ya Udongo na Mwongozo wa Kilimo Endelevu',
    author: 'Dr. Florence Wambugu & African Agroecology Network',
    description: 'Practical guide to soil ribbon and jar sedimentation testing, thermophilic Berkeley composting, biochar, zai pits, contour swales, nitrogen-fixing agroforestry (Calliandra, Leucaena, Sesbania), and community seed saving.',
    descriptionSw: 'Mwongozo wa vitendo kuhusu upimaji wa udongo, mboji ya moto, mkaa wa biochar, mashimo ya zai, kilimo msitu, na uhifadhi wa mbegu.',
    category: 'agriculture',
    tradeId: 'agriculture',
    tradeTitle: 'Sustainable Agriculture',
    coverColor: 'from-emerald-700 to-green-950',
    fileFormat: 'markdown',
    fileSizeMb: 6.1,
    totalPages: 120,
    estimatedMinutes: 240,
    featured: true,
    rating: 4.9,
    readersCount: 3890,
    cdaccUnitId: 'CU/AGR/SA/CR/06/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Soil Science — Texture, Structure & Field Testing', pageNumber: 1 },
      { id: 'ch2', title: 'Thermophilic Composting & Organic Amendments', pageNumber: 26 },
      { id: 'ch3', title: 'Water-Wise Catchments — Zai Pits & Swales', pageNumber: 50 },
      { id: 'ch4', title: 'Agroforestry & Biological Nitrogen Fixation', pageNumber: 76 },
      { id: 'ch5', title: 'Open-Pollinated Seed Saving & Seed Banks', pageNumber: 98 },
    ],
    contentMarkdown: `# Smallholder Soil Science & Regenerative Agriculture

## Chapter 1: Soil Texture & Structure
Healthy soil is the foundation of food sovereignty. Mineral soil consists of sand, silt, and clay fractions.
The 24-hour glass jar sedimentation test accurately separates the strata: sand settles within 2 minutes, silt within 1 to 2 hours, and clay remains suspended for up to 24 hours.
Maintaining a crumbly granular structure with over 2% soil organic matter ensures high cation exchange capacity and moisture retention during prolonged dry spells.
`,
  },
  {
    id: 'book-mechanical-workshop',
    title: 'Remote Workshop Practice, Machining & Micro-Hydro Fabrication',
    titleSw: 'Mazoezi ya Karakana, Utengenezaji Mitambo na Turbini za Maji',
    author: 'Eng. Patrick Mutiso (NITA Master Machinist & Energy Technologist)',
    description: 'Comprehensive engineering manual covering precision measurement (vernier calipers, micrometers, dial test indicators), drilling speeds, tapping progressions, oxy-acetylene cutting, SMAW stick welding, rolling bearing maintenance, shaft alignment, and Pelton runner micro-hydro turbine fabrication with static balancing.',
    descriptionSw: 'Mwongozo kamili wa uhandisi kuhusu vipimo sahihi, kuchimba na kutengeneza nyuzi, kukata kwa gesi na kuchomelea, fani za mitambo, na kutengeneza turbini za maji.',
    category: 'engineering',
    tradeId: 'mechanical-production',
    tradeTitle: 'Mechanical Engineering & Fabrication',
    coverColor: 'from-zinc-700 to-slate-950',
    fileFormat: 'markdown',
    fileSizeMb: 6.8,
    totalPages: 132,
    estimatedMinutes: 260,
    featured: true,
    rating: 4.9,
    readersCount: 4250,
    cdaccUnitId: 'CU/ENG/MP/CR/07/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Precision Measurement & Bench Layout', pageNumber: 1 },
      { id: 'ch2', title: 'Twist Drills, Tapping & Thread Standards', pageNumber: 28 },
      { id: 'ch3', title: 'Oxy-Acetylene Cutting & SMAW Welding', pageNumber: 56 },
      { id: 'ch4', title: 'Rolling Bearings, Fits & Shaft Alignment', pageNumber: 84 },
      { id: 'ch5', title: 'Micro-Hydro Pelton Turbine Balancing', pageNumber: 110 },
    ],
    contentMarkdown: `# Remote Workshop Practice & Machine Fabrication

## Chapter 1: Precision Measurement & Layout
In machine fabrication, guessing tolerances leads to loose bearings, vibrating shafts, and sudden equipment failure.
The metric vernier caliper provides 0.02 mm resolution across 50 vernier scale graduations.
The outside micrometer provides 0.01 mm resolution using a 0.50 mm pitch spindle screw.
Always verify and account for zero error before measuring critical interference shaft journals.
`,
  },
  {
    id: 'book-chemical-engineering',
    title: 'Decentralized Chemical Engineering & Industrial Production',
    titleSw: 'Uhandisi wa Kemikali na Utengenezaji wa Viwandani Vijijini',
    author: 'Dr. Beatrice Muthoni & Energy Autonomy Initiative',
    description: 'Comprehensive engineering field manual for producing vital civilization chemicals from local resources: vertical-shaft lime kilns and pozzolanic hydraulic mortar, wood-ash lye extraction, saponification and crude glycerol separation, fractional ethanol distillation with azeotrope handling, biodiesel transesterification from Jatropha/Croton seed oils, and double-drum retort biomass pyrolysis producing biochar and pyroligneous acid (wood vinegar).',
    descriptionSw: 'Mwongozo kamili wa uhandisi kuhusu kuchoma chokaa, kutengeneza sabuni na glycerol, kunereka pombe ya dawa, kutengeneza mafuta ya biodiesel, na kuzalisha mkaa na asidi ya mbao.',
    category: 'engineering',
    tradeId: 'chemical-processing',
    tradeTitle: 'Chemical Engineering & Industrial Processing',
    coverColor: 'from-purple-700 to-indigo-950',
    fileFormat: 'markdown',
    fileSizeMb: 6.9,
    totalPages: 136,
    estimatedMinutes: 270,
    featured: true,
    rating: 4.9,
    readersCount: 3950,
    cdaccUnitId: 'CU/ENG/CH/CR/08/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'The Lime Cycle & Vertical Shaft Kilns', pageNumber: 1 },
      { id: 'ch2', title: 'Saponification, Lye Leaching & Glycerol', pageNumber: 28 },
      { id: 'ch3', title: 'Ethanol Fermentation & Fractional Columns', pageNumber: 58 },
      { id: 'ch4', title: 'Biodiesel Transesterification & Washing', pageNumber: 86 },
      { id: 'ch5', title: 'Biomass Pyrolysis & Wood Vinegar Extraction', pageNumber: 112 },
    ],
    contentMarkdown: `# Decentralized Chemical Engineering & Production

## Chapter 1: The Chemical Lime Cycle
Before Portland cement, civilization was anchored upon the calcium carbonate cycle.
Limestone calcination requires 900°C to 1,000°C inside a counter-current vertical shaft kiln.
Slaking quicklime (calcium oxide) with water is violently exothermic, reaching boiling temperatures and producing pure calcium hydroxide putty.
Blending lime putty with volcanic pumice pozzolan yields hydraulic mortar capable of setting permanently underwater.
`,
  },
  {
    id: 'book-electrical-power',
    title: 'Autonomous Electrical Power Systems & Micro-Grid Engineering',
    titleSw: 'Mifumo ya Umeme ya Kujitegemea na Uhandisi wa Gridi Ndogo',
    author: 'Eng. John Gitau (EPRA Certified Electrical Systems Lead)',
    description: 'Comprehensive engineering manual for designing, commissioning, and maintaining off-grid mini-grids: single-phase 230V and 3-phase 400V star/delta analysis, inductive power factor correction capacitor calculation, synchronous alternator excitation and AVR tuning, field flashing, laminated transformer winding calculations (turns-per-volt, wire sizing), consumer unit MCB trip curves (B, C, D), 30mA RCD differential earth protection, TT earthing electrode installation, rotary synchroscope generator paralleling, and frequency-droop dynamic load shedding.',
    descriptionSw: 'Mwongozo kamili wa uhandisi kuhusu umeme wa awamu tatu, kurekebisha power factor, alternator na vidhibiti vya AVR, kufuma transfoma, vifaa vya MCB na RCD, mfumo wa earth, na kusawazisha jenereta kwenye gridi.',
    category: 'engineering',
    tradeId: 'electrical-installation',
    tradeTitle: 'Electrical Installation & Grid Engineering',
    coverColor: 'from-amber-600 to-yellow-950',
    fileFormat: 'markdown',
    fileSizeMb: 7.1,
    totalPages: 142,
    estimatedMinutes: 280,
    featured: true,
    rating: 5.0,
    readersCount: 4620,
    cdaccUnitId: 'CU/ENG/EL/CR/09/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Single-Phase vs 3-Phase & Power Factor', pageNumber: 1 },
      { id: 'ch2', title: 'Synchronous Alternators & AVR Systems', pageNumber: 32 },
      { id: 'ch3', title: 'Transformer Physics & Coil Winding', pageNumber: 64 },
      { id: 'ch4', title: 'Circuit Breakers, RCDs & Earth Electrodes', pageNumber: 92 },
      { id: 'ch5', title: 'Micro-Grid Paralleling & Load Shedding', pageNumber: 118 },
    ],
    contentMarkdown: `# Autonomous Electrical Power Systems & Micro-Grids

## Chapter 1: Alternating Current & 3-Phase Power
Direct current powers batteries, but alternating current powers civilization.
Three-phase star distribution delivers 230V line-to-neutral for households and 400V line-to-line for motors while using 25% less conductor copper.
Inductive motor loads draw reactive power (kVAR), dragging the power factor down.
Connecting power factor correction capacitor banks across motor terminals relieves generators of circulating reactive currents, unlocking hidden capacity.
`,
  },
  {
    id: 'book-civil-defense',
    title: 'Civil Defense, Perimeter Security & Community Hardening Manual',
    titleSw: 'Mwongozo wa Ulinzi wa Jamii, Vizuizi vya Mzunguko na Vyumba vya Usalama',
    author: 'Major (Rtd.) Samuel Kiprop & Community Resilience Council',
    description: 'Comprehensive tactical and engineering guide to safeguarding decentralized communities: CPTED environmental design, 2m/0.5m sightline landscaping, box H-brace high-tensile wire fencing, 3-coil pyramid concertina razor wire, anti-vehicle ditch-and-berm earthworks, impenetrable living thorn hedgerows (Euphorbia, Sisal, Kei Apple), elevated timber watchtower construction with ballistic parapets, dead space mapping, mechanical 12-gauge blank tripwire alarms, 3-zone wildfire defensible space, 3mm ember mesh, and hardened outward-opening panic rooms with sandbag ballistic walls and emergency VHF radio lifelines.',
    descriptionSw: 'Mwongozo kamili wa ulinzi kuhusu usanifu wa mazingira wa CPTED, wigo imara, nyaya za miiba, mifereji ya kuzuia magari, minara ya ulinzi, vihisi vya ardhini, kuzuia moto wa nyika, na vyumba vya dharura vya kuokoa maisha.',
    category: 'resilience',
    tradeId: 'security-operations',
    tradeTitle: 'Civil Defense & Physical Security',
    coverColor: 'from-stone-700 to-red-950',
    fileFormat: 'markdown',
    fileSizeMb: 6.7,
    totalPages: 138,
    estimatedMinutes: 275,
    featured: true,
    rating: 5.0,
    readersCount: 4890,
    cdaccUnitId: 'CU/SEC/CD/CR/10/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'CPTED & Concentric Rings of Defense', pageNumber: 1 },
      { id: 'ch2', title: 'Perimeter Fencing, Barriers & Living Hedges', pageNumber: 30 },
      { id: 'ch3', title: 'Watchtowers, Lines of Sight & Early Warning', pageNumber: 60 },
      { id: 'ch4', title: 'Wildfire Defensible Space & Firebreaks', pageNumber: 88 },
      { id: 'ch5', title: 'Safe Rooms, Door Hardening & QRT Protocols', pageNumber: 114 },
    ],
    contentMarkdown: `# Civil Defense, Perimeter Security & Community Hardening

## Chapter 1: The Foundations of CPTED
Physical security begins with environmental geometry, not just padlocks.
Concentric rings of defense ensure that an intruder must breach detection, delay, and structural barriers before reaching human lives.
The 2-metre canopy and 0.5-metre shrub rule maintains unobstructed sightlines across all approaches, stripping away ambush concealment.
Tactical outward-facing illumination exposes intruders in stark silhouette while keeping defenders concealed in darkness.
`,
  },
  {
    id: 'book-navigation-cartography',
    title: 'Expedition Cartography, Land Navigation & Geodesy Field Manual',
    titleSw: 'Mwongozo wa Uelekezaji Njia, Upimaji wa Ardhi na Ramani za Topografia',
    author: 'Dr. Joseph Kamau & Survey of Kenya Mapping Corps',
    description: 'Comprehensive practical field guide to terrestrial navigation, topographical map reading, and surveying without satellites: 1:50,000 contour interpretation and slope percentage calculations, UTM/MGRS coordinate systems, magnetic declination and annual drift calculations, prismatic compass sighting and back-bearing resection (resolving the Triangle of Error), plane table alidade mapping (radiation, intersection, and closed traverse), dead reckoning route navigation, personal pace counting calibration, ranger beads, 90-degree obstacle bypass box method, and emergency celestial orientation via the Southern Cross (Crux) and Orion's Belt.',
    descriptionSw: 'Mwongozo kamili wa kusoma ramani za topografia, kutumia dira na kurekebisha mkengeuko wa sumaku, kutambua eneo ulipo kwa pembetatu, upimaji wa jedwali la ndege, na uelekezaji wa njia gizani kwa kuhesabu hatua na nyota.',
    category: 'resilience',
    tradeId: 'surveying-geomatics',
    tradeTitle: 'Surveying & Geospatial Technology',
    coverColor: 'from-teal-700 to-emerald-950',
    fileFormat: 'markdown',
    fileSizeMb: 6.8,
    totalPages: 140,
    estimatedMinutes: 280,
    featured: true,
    rating: 5.0,
    readersCount: 5120,
    cdaccUnitId: 'CU/GEO/SV/CR/11/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Topographic Maps, Contours & UTM Grids', pageNumber: 1 },
      { id: 'ch2', title: 'Magnetic Compass & Declination Math', pageNumber: 30 },
      { id: 'ch3', title: 'Field Resection & Triangulation', pageNumber: 60 },
      { id: 'ch4', title: 'Plane Table Surveying & Base Mapping', pageNumber: 90 },
      { id: 'ch5', title: 'Dead Reckoning, Pacing & Night Navigation', pageNumber: 116 },
    ],
    contentMarkdown: `# Expedition Cartography, Land Navigation & Geodesy

## Chapter 1: Topographic Maps & The Language of Terrain
When digital satellites and cellular networks fall silent, a paper map is your only true guide.
Contour lines translate a three-dimensional landscape of mountains, rivers, and cliffs onto a flat two-dimensional sheet.
Water always flows down the open throat of a contour 'V', while ridgelines push spurs into the lowlands.
Mastering the 1-kilometre UTM metric grid allows precision coordination across expedition teams down to 10 metres.
`,
  },
  {
    id: 'book-metallurgy-foundry',
    title: 'Practical Metallurgy, Blacksmithing & Non-Ferrous Foundry Manual',
    titleSw: 'Mwongozo wa Ufundi Chuma, Uhunzi na Uyahushaji Vyuma Karakana',
    author: 'Fundi Mkuu Juma Omondi (Foundry Master & Blacksmith Guild Lead)',
    description: 'Comprehensive engineering field guide to extracting, hot-forging, heat-treating, and casting metals in remote workshops: direct iron reduction in clay bloomery furnaces (fayalite slag chemistry, consolidation forging), brake-drum forge hearth design, anvil work zones, drawing out, upsetting, hot punching, forge-welding with borax/silica flux, iron-carbon phase metallurgy (ferrite, pearlite, austenite, martensite), full annealing, normalizing, oil vs water quenching, temper color oxide spectrums (pale straw to spring blue), differential hardening, greensand mold making (bentonite binders, draft angles, shrinkage allowances), cope and drag flask gating, and crucible furnace non-ferrous casting (scrap aluminium and bronze, degassing fluxes, dross skimming, moisture explosion prevention).',
    descriptionSw: 'Mwongozo kamili wa kuyeyusha chuma cha asili kwenye tanuri ya bloomery, uhunzi wa zana, utireshaji wa ugumu wa vyuma (quenching na tempering), utengenezaji wa ukungu wa mchanga (greensand), na kuyeyusha alumini na shaba kwenye tanuri ya crucible.',
    category: 'engineering',
    tradeId: 'welding-fabrication',
    tradeTitle: 'Welding, Fabrication & Metallurgy',
    coverColor: 'from-orange-700 to-red-950',
    fileFormat: 'markdown',
    fileSizeMb: 7.3,
    totalPages: 146,
    estimatedMinutes: 290,
    featured: true,
    rating: 5.0,
    readersCount: 5420,
    cdaccUnitId: 'CU/MET/FD/CR/12/5',
    publishedYear: 2026,
    offlineReady: true,
    chapters: [
      { id: 'ch1', title: 'Bloomery Smelting & Direct Iron Reduction', pageNumber: 1 },
      { id: 'ch2', title: 'Blacksmith Forge Hearth, Anvil & Tooling', pageNumber: 32 },
      { id: 'ch3', title: 'Heat Treatment — Quench & Temper Colors', pageNumber: 62 },
      { id: 'ch4', title: 'Greensand Mold Making & Patterns', pageNumber: 92 },
      { id: 'ch5', title: 'Crucible Furnace Melting & Foundry Safety', pageNumber: 120 },
    ],
    contentMarkdown: `# Practical Metallurgy, Blacksmithing & Non-Ferrous Foundry

## Chapter 1: The Foundations of Direct Iron Smelting
Civilization relies on elemental iron. Before industrial blast furnaces, humanity extracted workable wrought iron through the bloomery process.
Operating at 1,150°C to 1,250°C, solid-state chemical reduction produces a spongy bloom of low-carbon iron without melting.
Consolidation forging under heavy sledges expels trapped liquid fayalite slag, welding the iron grains into tough structural billets.
`,
  },
];

interface BookState {
  books: Book[];
  progress: Record<string, BookProgress>;
  savedBookIds: string[];
  offlineBookIds: string[];
  activeBookId: string | null;
  readerTheme: 'dark' | 'sepia' | 'light';
  readerFontSize: number;

  // Actions
  fetchBooks: () => Promise<void>;
  uploadBook: (payload: {
    file: File;
    title: string;
    author: string;
    category: Book['category'];
    tradeId?: string;
    tradeTitle?: string;
    description?: string;
  }) => Promise<Book>;
  saveProgress: (bookId: string, currentPage: number, totalPages: number) => void;
  toggleSaved: (bookId: string) => void;
  toggleOffline: (bookId: string) => void;
  setActiveBook: (bookId: string | null) => void;
  setReaderTheme: (theme: 'dark' | 'sepia' | 'light') => void;
  setReaderFontSize: (size: number) => void;
  getBook: (bookId: string) => Book | undefined;
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: SEEDED_BOOKS,
      progress: {
        'book-water-engineering': {
          bookId: 'book-water-engineering',
          currentPage: 24,
          totalPages: 84,
          percent: 28.5,
          lastReadAt: new Date().toISOString(),
        },
      },
      savedBookIds: ['book-solar-pv-systems', 'book-trauma-first-aid'],
      offlineBookIds: ['book-water-engineering', 'book-solar-pv-systems'],
      activeBookId: null,
      readerTheme: 'dark',
      readerFontSize: 16,

      fetchBooks: async () => {
        try {
          const res = await fetch('/api/v1/library/books');
          if (res.ok) {
            const remoteBooks: Book[] = await res.json();
            // Merge remote books with existing seeded books
            const merged = [...remoteBooks];
            for (const seeded of SEEDED_BOOKS) {
              if (!merged.some((b) => b.id === seeded.id)) {
                merged.push(seeded);
              }
            }
            set({ books: merged });
          }
        } catch {
          // Offline fallback — maintain current books
        }
      },

      uploadBook: async ({ file, title, author, category, tradeId, tradeTitle, description }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        if (tradeId) formData.append('tradeId', tradeId);
        if (tradeTitle) formData.append('tradeTitle', tradeTitle);
        if (description) formData.append('description', description);

        // Try remote upload first
        try {
          const res = await fetch('/api/v1/library/upload', {
            method: 'POST',
            body: formData,
          });
          if (res.ok) {
            const newBook: Book = await res.json();
            set((state) => ({ books: [newBook, ...state.books] }));
            return newBook;
          }
        } catch {
          // Backend offline — create client-side book record
        }

        // Local fallback creation
        const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
        const newBook: Book = {
          id: `local-book-${Date.now()}`,
          title,
          author,
          description: description || `Uploaded file: ${file.name}`,
          category,
          tradeId,
          tradeTitle: tradeTitle || 'General TVET',
          coverColor: 'from-violet-600 to-indigo-950',
          fileFormat: extension === 'epub' ? 'epub' : extension === 'pdf' ? 'pdf' : 'markdown',
          fileSizeMb: Math.max(0.1, Number((file.size / (1024 * 1024)).toFixed(1))),
          totalPages: 40,
          estimatedMinutes: 80,
          featured: false,
          rating: 5.0,
          readersCount: 1,
          offlineReady: true,
          publishedYear: new Date().getFullYear(),
          contentMarkdown: `# ${title}\n\n*Uploaded locally by learner / educator.*\n\nAuthor: ${author}\n\n---`,
        };

        set((state) => ({ books: [newBook, ...state.books] }));
        return newBook;
      },

      saveProgress: (bookId, currentPage, totalPages) => {
        const percent = Math.min(100, Math.round((currentPage / totalPages) * 100));
        const updated: BookProgress = {
          bookId,
          currentPage,
          totalPages,
          percent,
          lastReadAt: new Date().toISOString(),
          completed: currentPage >= totalPages,
        };

        set((state) => ({
          progress: {
            ...state.progress,
            [bookId]: updated,
          },
        }));

        // Send to API in background
        void fetch('/api/v1/library/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId, currentPage, totalPages }),
        }).catch(() => undefined);
      },

      toggleSaved: (bookId) => {
        set((state) => {
          const exists = state.savedBookIds.includes(bookId);
          return {
            savedBookIds: exists
              ? state.savedBookIds.filter((id) => id !== bookId)
              : [...state.savedBookIds, bookId],
          };
        });
      },

      toggleOffline: (bookId) => {
        set((state) => {
          const exists = state.offlineBookIds.includes(bookId);
          return {
            offlineBookIds: exists
              ? state.offlineBookIds.filter((id) => id !== bookId)
              : [...state.offlineBookIds, bookId],
          };
        });
      },

      setActiveBook: (bookId) => set({ activeBookId: bookId }),
      setReaderTheme: (theme) => set({ readerTheme: theme }),
      setReaderFontSize: (size) => set({ readerFontSize: size }),

      getBook: (bookId) => {
        return get().books.find((b) => b.id === bookId);
      },
    }),
    {
      name: 'cyberlearn_readflix_library_v1',
    }
  )
);
