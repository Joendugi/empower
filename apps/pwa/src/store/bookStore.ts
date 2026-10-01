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
