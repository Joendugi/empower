import type { Lesson, SkillPath } from '@cyberlearn/types';
import { nodeFromLessons } from './helpers';
import {
  tvetComputerHardware,
  tvetComputerNetworks,
  tvetOperatingSystems,
  tvetWorkshopSafety,
} from './tvetLessons';
import {
  tvetComputerHardware2,
  tvetComputerNetworks2,
  tvetOperatingSystems2,
  tvetWorkshopSafety2,
} from './tvetLessons2';
import {
  cyberLawKenya,
  digitalSafety,
  linuxEssentials,
  osiModel,
  webSecurity,
} from './cyberLessons';
import {
  cyberLawKenya2,
  digitalSafety2,
  linuxEssentials2,
  osiModel2,
  webSecurity2,
} from './cyberLessons2';
import { tradeLessons, tradePaths } from './trades/index';
import {
  tvetDatabaseLessons,
  tvetElectronicsLessons,
  tvetNetSemesterLessons,
  tvetOsSemesterLessons,
  tvetProgrammingLessons,
  tvetRepairLessons,
  tvetSoftwareLessons,
} from './tvetSemester';
import {
  cyberArchitectureLessons,
  cyberConceptsLessons,
  cyberOperationsLessons,
  cyberProgramLessons,
  cyberThreatsLessons,
} from './cyberSemester';
import { useCurriculumStore } from '@/store/curriculumStore';
import { toPublicLesson } from '@/lib/publicLesson';

export const allLessons: Lesson[] = [
  tvetWorkshopSafety,
  tvetWorkshopSafety2,
  ...tvetElectronicsLessons,
  tvetComputerHardware,
  tvetComputerHardware2,
  tvetOperatingSystems,
  tvetOperatingSystems2,
  ...tvetOsSemesterLessons,
  ...tvetSoftwareLessons,
  ...tvetRepairLessons,
  tvetComputerNetworks,
  tvetComputerNetworks2,
  ...tvetNetSemesterLessons,
  ...tvetDatabaseLessons,
  ...tvetProgrammingLessons,
  digitalSafety,
  digitalSafety2,
  ...cyberConceptsLessons,
  ...cyberThreatsLessons,
  osiModel,
  osiModel2,
  linuxEssentials,
  linuxEssentials2,
  ...cyberArchitectureLessons,
  webSecurity,
  webSecurity2,
  ...cyberOperationsLessons,
  ...cyberProgramLessons,
  cyberLawKenya,
  cyberLawKenya2,
  ...tradeLessons,
];

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.id, lesson])
);

let publicLessonsById: Record<string, Lesson> | null = null;
let publicHydrate: Promise<void> | null = null;

/** Strip plaintext answer keys after hashing — call once at app start. */
export async function hydratePublicCatalogue(): Promise<void> {
  if (publicLessonsById) return;
  if (!publicHydrate) {
    publicHydrate = Promise.all(allLessons.map((lesson) => toPublicLesson(lesson))).then((lessons) => {
      publicLessonsById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));
    });
  }
  await publicHydrate;
}

function withoutPlaintextAnswers(lesson: Lesson): Lesson {
  return {
    ...lesson,
    exercises: lesson.exercises.map(({ correctAnswer: _omit, ...exercise }) => exercise),
  };
}

export function getSkillPaths(): SkillPath[] {
  return [...builtInSkillPaths, ...useCurriculumStore.getState().paths];
}

export function getLesson(id: string): Lesson | undefined {
  const custom = useCurriculumStore.getState().lessons[id];
  if (custom) {
    return custom.exercises.some((item) => item.correctAnswer !== undefined)
      ? withoutPlaintextAnswers(custom)
      : custom;
  }
  if (publicLessonsById?.[id]) return publicLessonsById[id];
  const raw = lessonsById[id];
  return raw ? withoutPlaintextAnswers(raw) : undefined;
}

export const tvetIctPath: SkillPath = {
  id: 'tvet-ict-technician',
  track: 'tvet',
  title: 'TVET ICT Technician',
  titleSw: 'Fundi wa ICT wa TVET',
  description:
    'CDACC ICT Technician Level 5 semester path (~2280 hours in the official curriculum including attachment): OSH, basic electronics, hardware, OS, software installation, repair, networking, databases, and programming. Weekly lessons follow published learning outcomes.',
  descriptionSw:
    'Mtaala wa semester wa CDACC ICT L5: usalama, electronics, hardware, OS, usakinishaji, repair, mitandao, hifadhidata, na programu.',
  certificationTarget: 'CDACC ICT Technician Level 5 — core units IT/CU/ICT/CR/1–6/5',
  nodes: [
    nodeFromLessons({
      id: 'workshop-safety',
      title: 'Workshop safety',
      titleSw: 'Usalama wa warsha',
      description: 'PPE, electrical isolation, ESD, and incident response in the ICT workshop.',
      icon: '🦺',
      prerequisites: [],
      cdaccUnitId: 'IT/CU/ICT/BC/7/5',
      examDomain: 'Occupational safety',
      lessons: [tvetWorkshopSafety, tvetWorkshopSafety2],
    }),
    nodeFromLessons({
      id: 'basic-electronics',
      title: 'Basic electronics',
      titleSw: 'Electronics ya msingi',
      description: 'Circuits, semiconductors, and number systems — IT/CU/ICT/CC/1/5 (~100 hours).',
      icon: '🔋',
      prerequisites: ['workshop-safety'],
      cdaccUnitId: 'IT/CU/ICT/CC/1/5',
      examDomain: 'Basic electronics',
      lessons: tvetElectronicsLessons,
    }),
    nodeFromLessons({
      id: 'computer-hardware',
      title: 'Computer hardware',
      titleSw: 'Vifaa vya kompyuta',
      description: 'Identify CPU, RAM, storage, and PSU. Follow a POST-based fault path.',
      icon: '🖥️',
      prerequisites: ['basic-electronics'],
      cdaccUnitId: 'IT/CU/ICT/CR/3/5',
      examDomain: 'Computer hardware',
      lessons: [tvetComputerHardware, tvetComputerHardware2],
    }),
    nodeFromLessons({
      id: 'operating-systems',
      title: 'Operating systems',
      titleSw: 'Mifumo ya uendeshaji',
      description: 'Install and support Windows/Linux, then process, memory, and files — CR/6/5 (~210 hours).',
      icon: '💿',
      prerequisites: ['computer-hardware'],
      cdaccUnitId: 'IT/CU/ICT/CR/6/5',
      examDomain: 'Manage operating system',
      lessons: [tvetOperatingSystems, tvetOperatingSystems2, ...tvetOsSemesterLessons],
    }),
    nodeFromLessons({
      id: 'software-install',
      title: 'Install computer software',
      titleSw: 'Sakinisha programu',
      description: 'Licences, attended/unattended install, drivers, testing, and user training — CR/2/5 (~260 hours).',
      icon: '📦',
      prerequisites: ['operating-systems'],
      cdaccUnitId: 'IT/CU/ICT/CR/2/5',
      examDomain: 'Install computer software',
      lessons: tvetSoftwareLessons,
    }),
    nodeFromLessons({
      id: 'computer-repair',
      title: 'Repair and maintenance',
      titleSw: 'Ukarabati na matengenezo',
      description: 'Troubleshoot, replace, test, and upgrade — CR/3/5 (~280 hours).',
      icon: '🔧',
      prerequisites: ['software-install'],
      cdaccUnitId: 'IT/CU/ICT/CR/3/5',
      examDomain: 'Computer repair and maintenance',
      lessons: tvetRepairLessons,
    }),
    nodeFromLessons({
      id: 'computer-networks',
      title: 'Computer networks',
      titleSw: 'Mitandao ya kompyuta',
      description: 'Types, cabling, device config, LAN, and testing — CR/1/5 (~300 hours).',
      icon: '🔌',
      prerequisites: ['computer-repair'],
      cdaccUnitId: 'IT/CU/ICT/CR/1/5',
      examDomain: 'Perform computer networking',
      lessons: [tvetComputerNetworks, tvetComputerNetworks2, ...tvetNetSemesterLessons],
    }),
    nodeFromLessons({
      id: 'database-systems',
      title: 'Database systems',
      titleSw: 'Hifadhidata',
      description: 'Models, integrity, SQL objects, and reports — CR/4/5 (~310 hours).',
      icon: '🗄️',
      prerequisites: ['computer-networks'],
      cdaccUnitId: 'IT/CU/ICT/CR/4/5',
      examDomain: 'Manage database system',
      lessons: tvetDatabaseLessons,
    }),
    nodeFromLessons({
      id: 'computer-programming',
      title: 'Computer programming',
      titleSw: 'Uandaaji programu',
      description: 'Design tools, structured C, testing, and intro HTML — CR/5/5 (~340 hours).',
      icon: '💻',
      prerequisites: ['database-systems'],
      cdaccUnitId: 'IT/CU/ICT/CR/5/5',
      examDomain: 'Develop computer program',
      lessons: tvetProgrammingLessons,
    }),
  ],
};

export const cybersecurityPath: SkillPath = {
  id: 'cybersecurity',
  track: 'cybersecurity',
  title: 'Cybersecurity Practitioner',
  titleSw: 'Mtaalamu wa usalama wa mtandao',
  description:
    'Semester coursework mapped to CompTIA Security+ SY0-701 (five domains) plus Kenyan practice: digital safety, networks, Linux, web attacks, operations, governance, DPA 2019, and CMCA 2018.',
  descriptionSw:
    'Mtaala wa semester wa Security+ SY0-701: dhana, vitisho, usanifu, operesheni, utawala, DPA, na CMCA.',
  certificationTarget: 'CompTIA Security+ SY0-701 · CMCA 2018 · DPA 2019',
  nodes: [
    nodeFromLessons({
      id: 'digital-safety-101',
      title: 'Digital safety 101',
      titleSw: 'Usalama wa kidijitali 101',
      description: 'Passwords, phishing, MFA, and M-Pesa social engineering.',
      icon: '🔐',
      prerequisites: [],
      examDomain: 'Security+ 1.0 / 2.0',
      lessons: [digitalSafety, digitalSafety2],
    }),
    nodeFromLessons({
      id: 'secplus-concepts',
      title: 'General security concepts',
      titleSw: 'Dhana za usalama',
      description: 'CIA, AAA, Zero Trust, change management, and cryptography — SY0-701 Domain 1 (12%).',
      icon: '📘',
      prerequisites: ['digital-safety-101'],
      examDomain: 'SY0-701 Domain 1',
      lessons: cyberConceptsLessons,
    }),
    nodeFromLessons({
      id: 'secplus-threats',
      title: 'Threats and mitigations',
      titleSw: 'Vitisho na mitigation',
      description: 'Actors, malware, application attacks, CVSS, and compensating controls — Domain 2 (22%).',
      icon: '⚠️',
      prerequisites: ['secplus-concepts'],
      examDomain: 'SY0-701 Domain 2',
      lessons: cyberThreatsLessons,
    }),
    nodeFromLessons({
      id: 'network-fundamentals',
      title: 'Network fundamentals',
      titleSw: 'Misingi ya mitandao',
      description: 'OSI, TCP/IP, and isolating faults by layer.',
      icon: '🌐',
      prerequisites: ['secplus-threats'],
      cdaccUnitId: 'IT/CU/ICT/CR/1/5',
      examDomain: 'Security+ · Network+',
      lessons: [osiModel, osiModel2],
    }),
    nodeFromLessons({
      id: 'linux-essentials',
      title: 'Linux essentials',
      titleSw: 'Misingi ya Linux',
      description: 'Shell, permissions, and safe use of sudo.',
      icon: '🐧',
      prerequisites: ['network-fundamentals'],
      cdaccUnitId: 'IT/CU/ICT/CR/6/5',
      examDomain: 'LPIC-1',
      lessons: [linuxEssentials, linuxEssentials2],
    }),
    nodeFromLessons({
      id: 'secplus-architecture',
      title: 'Security architecture',
      titleSw: 'Usanifu wa usalama',
      description: 'Segmentation, cloud shared responsibility, RTO/RPO, and backups — Domain 3 (18%).',
      icon: '🏛️',
      prerequisites: ['linux-essentials'],
      examDomain: 'SY0-701 Domain 3',
      lessons: cyberArchitectureLessons,
    }),
    nodeFromLessons({
      id: 'web-security',
      title: 'Web security',
      titleSw: 'Usalama wa wavuti',
      description: 'SQL injection, XSS, CSRF, and output encoding.',
      icon: '🕸️',
      prerequisites: ['secplus-architecture'],
      examDomain: 'OWASP Top 10',
      lessons: [webSecurity, webSecurity2],
    }),
    nodeFromLessons({
      id: 'secplus-operations',
      title: 'Security operations',
      titleSw: 'Operesheni za usalama',
      description: 'Baselines, identity, SIEM, and incident response — Domain 4 (28%).',
      icon: '🛰️',
      prerequisites: ['web-security'],
      examDomain: 'SY0-701 Domain 4',
      lessons: cyberOperationsLessons,
    }),
    nodeFromLessons({
      id: 'secplus-program',
      title: 'Program management and privacy',
      titleSw: 'Utawala na faragha',
      description: 'Policies, risk, vendors, and Kenya DPA 2019 — Domain 5 (20%).',
      icon: '📋',
      prerequisites: ['secplus-operations'],
      examDomain: 'SY0-701 Domain 5 · DPA 2019',
      lessons: cyberProgramLessons,
    }),
    nodeFromLessons({
      id: 'cyber-law-kenya',
      title: 'Cyber law & ethics',
      titleSw: 'Sheria na maadili',
      description: 'Computer Misuse and Cybercrimes Act, KE-CIRT, and authorised testing.',
      icon: '⚖️',
      prerequisites: ['secplus-program'],
      examDomain: 'CMCA 2018',
      lessons: [cyberLawKenya, cyberLawKenya2],
    }),
  ],
};

export const builtInSkillPaths: SkillPath[] = [tvetIctPath, cybersecurityPath, ...tradePaths];

export function getNextLessonId(lessonId: string): string | undefined {
  for (const path of getSkillPaths()) {
    const ids = path.nodes.flatMap((node) => node.lessonIds);
    const index = ids.indexOf(lessonId);
    if (index >= 0) return ids[index + 1];
  }
  return undefined;
}

export function catalogueStats() {
  const paths = getSkillPaths();
  const lessonCount = new Set([
    ...Object.keys(lessonsById),
    ...Object.keys(useCurriculumStore.getState().lessons),
  ]).size;
  return {
    programmes: paths.length,
    modules: paths.reduce((sum, path) => sum + path.nodes.length, 0),
    lessons: lessonCount,
  };
}
