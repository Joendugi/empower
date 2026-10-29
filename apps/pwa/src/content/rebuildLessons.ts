import { fillBlank, makeLesson, matchPairs, mcq, scenario } from './helpers';
import type { Lesson } from '@cyberlearn/types';

// ─── Lesson 1: rebuild-000-1-1 ───────────────────────────────────────────────

export const rebuild000_1_1 = makeLesson({
  id: 'rebuild-000-1-1',
  courseId: 'the-rebuild-protocol',
  title: 'What is Digital Infrastructure?',
  titleSw: 'Miundombinu ya kidijitali ni nini?',
  briefing:
    'MISSION BRIEFING: You are a Rebuilder Corps recruit. The Blackout of 2031 showed the world what happens when digital infrastructure collapses. Your first mission is to understand the five invisible layers that modern society depends on — so you know exactly what you are defending.\n\n' +
    'Modern society runs on five invisible layers: (1) Power grids — electricity is the foundation; without it nothing else works. (2) Communications networks — fibre, satellite, and mobile towers that carry data. (3) Computing systems — the servers, routers, and devices that process information. (4) Databases — the stored records of money, health, identity, and logistics. (5) Applications — the software that citizens and businesses use every day. When any layer fails, everything above it fails too. The Blackout of 2031 proved this in 72 hours: attackers hit the power grid and communications layer simultaneously, and within three days banking, hospitals, and supply chains collapsed across East Africa. Rebuilder Corps exists to prevent it happening again.',
  briefingSw:
    'UJUMBE WA DHAMIRA: Wewe ni mwanachama mpya wa Kikosi cha Wajenzi. Giza Kuu la 2031 lilionyesha nini kinatokea miundombinu ya kidijitali inapoanguka.\n\n' +
    'Jamii ya kisasa inategemea tabaka tano zisizoonekana: (1) Gridi za umeme — msingi wa kila kitu. (2) Mitandao ya mawasiliano — nyuzi macho, setilaiti, na minara. (3) Mifumo ya kompyuta — seva na vifaa vinavyochakata data. (4) Hifadhidata — kumbukumbu za fedha, afya, na utambulisho. (5) Programu — zinazotumika na raia na biashara kila siku. Tabaka moja likiporomoka, yaliyopo juu yake yanaporomoka pia.',
  estimatedMinutes: 10,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-11-q1',
      'How many layers make up modern digital infrastructure according to the Rebuilder Corps model?',
      ['Three', 'Four', 'Five', 'Seven'],
      'c',
      'Think about power, comms, computing, data, and apps.',
      'The five layers are: power grids, communications networks, computing systems, databases, and applications. Each layer depends on the one below it.'
    ),
    mcq(
      'r000-11-q2',
      'If a city\'s communications network goes down completely, which of the following is the MOST likely immediate impact?',
      [
        'Only social media stops working',
        'Computing systems, databases, and applications that rely on that network also stop functioning',
        'The power grid automatically shuts down',
        'Databases are unaffected because they store data locally',
      ],
      'b',
      'Remember: each layer depends on the layers below it.',
      'Communications sit below computing systems, databases, and applications in the infrastructure stack. When the network layer fails, everything above it that relies on network connectivity fails too.'
    ),
    fillBlank(
      'r000-11-q3',
      'The Blackout of 2031 caused banking, hospitals, and supply chains to collapse within ___ hours after the initial attack on the power and communications layers.',
      '72',
      'It took three days.',
      'The Blackout scenario illustrates cascading failure: the initial attack took down the lowest layers, and within 72 hours (three days) the impact had cascaded up through the entire stack to affect citizens directly.'
    ),
    scenario(
      'r000-11-q4',
      'A ransomware group encrypts the central database of a major Kenyan bank. Customers cannot check balances, make payments, or withdraw cash. Which layer of digital infrastructure has been directly attacked?',
      [
        'The power grid layer',
        'The communications network layer',
        'The database layer',
        'The application layer only',
      ],
      'c',
      'The data itself — stored records — is the target.',
      'Databases are Layer 4 in the infrastructure stack. Encrypting a database directly attacks stored records of money and identity, and causes the applications above it (banking apps, ATMs) to fail even though the network and servers are still running.'
    ),
  ],
});

// ─── Lesson 1.2: rebuild-000-1-2 ─────────────────────────────────────────────

export const rebuild000_1_2 = makeLesson({
  id: 'rebuild-000-1-2',
  courseId: 'the-rebuild-protocol',
  title: 'How Civilisation Depends on Networks',
  titleSw: 'Jinsi Ustaarabu Unavyotegemea Mitandao',
  briefing:
    'MISSION BRIEFING: Modern life does not just use the internet — it is built on top of it. In this mission, examine what happens when digital connectivity is severed.\n\n' +
    'Every critical public system in East Africa relies on communications networks to operate: (1) Healthcare — hospitals verify health insurance, retrieve digital laboratory tests, and coordinate emergency ambulances across optical and wireless links. (2) Clean Water & Utilities — municipal water treatment plants and electric substations use telemetry and remote sensors to monitor pressure, chlorination, and load. (3) Commerce & Banking — M-Pesa, debit card terminals, and interbank clearance depend on secure cellular packet data. (4) Supply Chains — food transport, fuel distribution, and cargo tracking through the Port of Mombasa coordinate through digital manifests.\n\n' +
    'When network infrastructure is disrupted, the impact cascades: if payment systems fail, citizens cannot buy fuel; without fuel, backup hospital generators stop; without power, water pumps run dry. Network defense is not just IT — it is public safety.',
  briefingSw:
    'MISSION BRIEFING: Maisha ya kisasa yamejengwa juu ya mitandao. Katika misheni hii, chunguza kinachotokea miundombinu ya kidijitali inapokatika.\n\nHuduma zote muhimu hutegemea mtandao: hospitali, maji safi, umeme, M-Pesa, na usafirishaji wa mizigo. Mtandao ukikatika, athari huenea kwa kila sekta.',
  estimatedMinutes: 10,
  examDomain: 'Digital Citizenship',
  exercises: [
    matchPairs(
      'r000-12-match',
      'Match each vital community service to its digital network dependency.',
      [
        { leftId: 'hospital', left: 'Hospital Patient Care', rightId: 'dep-ehr', right: 'Cloud medical records & digital prescription verification' },
        { leftId: 'mpesa', left: 'M-Pesa & Mobile Money', rightId: 'dep-telco', right: 'Cellular packet data & encrypted transaction gateway' },
        { leftId: 'water', left: 'Clean Water Pumping Station', rightId: 'dep-scada', right: 'Telemetry sensors & remote valve control signals' },
        { leftId: 'cargo', left: 'Port Logistics & Cargo Fleet', rightId: 'dep-gps', right: 'Digital customs clearance manifests & GPS tracking' },
      ],
      'Think about what data each service needs to transmit to function.',
      'Every physical service depends on a specific digital communication protocol. When the network link breaks, the service cannot coordinate operations.'
    ),
    mcq(
      'r000-12-q2',
      'What is a "cascading failure" in critical infrastructure?',
      [
        'When an electrical wire falls into running water',
        'When the failure of one system (such as communications) triggers failures in multiple dependent systems (like banking, transport, and hospitals)',
        'When an antivirus program updates automatically',
        'When network speeds gradually decrease over time',
      ],
      'b',
      'Think about dominos falling one after another.',
      'A cascading failure occurs when interconnected systems collapse in sequence. Because water, healthcare, and logistics all depend on communications and power, losing one layer quickly brings down the others.'
    ),
    fillBlank(
      'r000-12-q3',
      'Mobile payment services like M-Pesa require an encrypted link to the telecom network; if the network goes down, merchants cannot verify transactions, demonstrating digital ___ on communications.',
      'dependency',
      'The state of relying on something to function.',
      'Digital dependency means modern economic activity cannot easily revert to analog alternatives during outages. Resilient societies design offline fallback mechanisms.'
    ),
    scenario(
      'r000-12-q4',
      'A rural health centre loses internet access during a regional storm. The power generator is running, but staff cannot access patient medical records hosted in Nairobi. Which defensive design principle was missing?',
      [
        'Faster optical fibre cables',
        'Local offline caching of essential emergency patient records',
        'Installing a larger diesel generator',
        'Switching from Android phones to laptops',
      ],
      'b',
      'The clinic had power, but no local copy of crucial data.',
      'Offline resilience requires local caching: critical data should be synchronised locally so clinics can treat patients safely even when the wider wide-area network is disconnected.'
    ),
  ],
});

// ─── Lesson 1.3: rebuild-000-1-3 ─────────────────────────────────────────────

export const rebuild000_1_3 = makeLesson({
  id: 'rebuild-000-1-3',
  courseId: 'the-rebuild-protocol',
  title: 'Real Blackouts: 3 Case Studies',
  titleSw: 'Masimulizi ya kweli ya kukatiwa umeme',
  briefing:
    'Three real-world cyberattacks prove that infrastructure attacks are not science fiction — they happened, and they will happen again without defenders.\n\n' +
    'Case Study 1 — Ukraine Power Grid (2016): Attackers from the Sandworm group compromised SCADA (industrial control) systems at three Ukrainian power distribution companies using spear-phishing emails. They then remotely opened circuit breakers, cutting electricity to approximately 230,000 people in winter. The lesson: critical infrastructure control systems are reachable from the internet and must be isolated and monitored.\n\n' +
    'Case Study 2 — Colonial Pipeline Ransomware (2021): A single compromised VPN password (found in a leaked credentials database) allowed the DarkSide group to access Colonial Pipeline\'s IT network. They deployed ransomware that paralysed billing and management systems. Colonial voluntarily shut down its 8,850-km pipeline, disrupting fuel supply to the US East Coast for six days. The lesson: one reused password on an internet-facing system can take down national fuel infrastructure.\n\n' +
    'Case Study 3 — MOVEit Breaches (2023): The Cl0p ransomware group exploited a zero-day SQL injection vulnerability in the MOVEit file-transfer software used by hundreds of organisations worldwide, including African financial institutions and pension funds. Personal and financial data from millions of people was exfiltrated. The lesson: supply-chain software vulnerabilities affect every organisation that uses the same product — attackers do not need to target you directly.',
  briefingSw:
    'Masimulizi matatu ya kweli yanaonyesha kwamba mashambulizi ya miundombinu si hadithi za kubuni.\n\n' +
    'Masimulizi 1 — Ukraine 2016: Wavamizi waliathiri mifumo ya SCADA ya gridi ya umeme na kukata umeme kwa watu 230,000 wakati wa baridi. Somo: mifumo ya udhibiti wa miundombinu inaweza kufikiwa kutoka mtandaoni.\n\n' +
    'Masimulizi 2 — Colonial Pipeline 2021: Nenosiri moja lililokuwa kwenye orodha ya data zilizovuja liliruhusu wavamizi kueneza ransomware na kusimamisha mabomba ya mafuta kwa siku sita.\n\n' +
    'Masimulizi 3 — MOVEit 2023: Udhaifu wa SQL injection kwenye programu ya MOVEit uliathiri taasisi nyingi za fedha Afrika na kwingineko.',
  estimatedMinutes: 12,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-13-q1',
      'In the 2016 Ukraine power grid attack, what type of industrial control system did the attackers compromise to remotely open circuit breakers?',
      ['ERP (Enterprise Resource Planning)', 'SCADA (Supervisory Control and Data Acquisition)', 'DNS (Domain Name System)', 'SIEM (Security Information and Event Management)'],
      'b',
      'It controls physical industrial equipment remotely.',
      'SCADA systems monitor and control industrial processes including power distribution. Compromising them allowed attackers to send real commands to circuit breakers, causing physical power outages.'
    ),
    mcq(
      'r000-13-q2',
      'What single security failure allowed DarkSide to access Colonial Pipeline\'s network in 2021?',
      [
        'An unpatched operating system on a public web server',
        'A compromised VPN password found in a leaked credentials database',
        'A malicious USB drive left in the car park',
        'A zero-day vulnerability in the pipeline\'s SCADA software',
      ],
      'b',
      'It was a password — not an exotic exploit.',
      'A single VPN account password, previously leaked in a separate breach and never changed, gave DarkSide their initial foothold. This demonstrates why password reuse and credential monitoring are critical.'
    ),
    fillBlank(
      'r000-13-q3',
      'The Cl0p group exploited a ___ injection vulnerability in MOVEit to steal data from hundreds of organisations without targeting each one individually.',
      'SQL',
      'It is a classic web application attack that manipulates database queries.',
      'SQL injection in the MOVEit zero-day allowed Cl0p to query and exfiltrate databases without authentication. This supply-chain attack hit every customer of the vulnerable software simultaneously.'
    ),
    fillBlank(
      'r000-13-q4',
      'The Colonial Pipeline ransomware attack disrupted fuel supply to the US East Coast for ___ days.',
      '6',
      'Nearly a week.',
      'Colonial voluntarily shut down its 8,850-km pipeline for six days. The disruption caused fuel shortages and price spikes across the US East Coast, demonstrating how a digital attack translates into real-world physical and economic harm.'
    ),
  ],
});

// ─── Lesson 3: rebuild-000-2-1 ───────────────────────────────────────────────

export const rebuild000_2_1 = makeLesson({
  id: 'rebuild-000-2-1',
  courseId: 'the-rebuild-protocol',
  title: 'How Cyberattacks Work',
  titleSw: 'Jinsi mashambulizi ya mtandao yanavyofanya kazi',
  briefing:
    'Understanding how attackers operate is the first step to stopping them. Every significant cyberattack follows a similar four-phase pattern.\n\n' +
    'Phase 1 — Reconnaissance: Attackers gather information about their target before striking. They map IP ranges, identify software versions, scrape employee names from LinkedIn, and look for leaked credentials online. This phase is mostly passive and hard to detect.\n\n' +
    'Phase 2 — Initial Access: Attackers exploit a weakness to get their first foothold inside the target. The three most common vectors are: (a) Phishing — tricking a person into clicking a link or opening an attachment; (b) Unpatched software — exploiting a known vulnerability in outdated systems; (c) Weak or stolen passwords — credential stuffing or brute force. The Nullers sent 40,000 phishing emails during The Blackout. Twelve people clicked. That was enough.\n\n' +
    'Phase 3 — Persistence: Once inside, attackers install a backdoor or create hidden accounts so they can return even if their initial access method is discovered and closed. They may stay dormant for weeks or months before acting.\n\n' +
    'Phase 4 — Impact: The final phase is the attacker\'s goal: steal data, encrypt files for ransom, destroy systems, or use compromised infrastructure to launch attacks elsewhere. The Nullers used all four phases methodically in the months before The Blackout struck.',
  briefingSw:
    'Kuelewa jinsi wavamizi wanavyofanya kazi ni hatua ya kwanza ya kuwazuia. Kila shambulio kubwa linafuata mfumo wa hatua nne.\n\n' +
    'Hatua 1 — Upelelezi: Kukusanya habari kuhusu lengo kabla ya kushambulia.\n' +
    'Hatua 2 — Uingiaji wa Awali: Kutumia udhaifu kupata nafasi ya kwanza ndani ya mfumo — kupitia udanganyifu, programu isiyosasishwa, au nenosiri dhaifu.\n' +
    'Hatua 3 — Kudumu: Kusakinisha mlango wa siri ili waweze kurudi hata baada ya kugundulika.\n' +
    'Hatua 4 — Athari: Lengo la mwisho — kuiba data, kusimba faili kwa fidia, au kuharibu mifumo.',
  estimatedMinutes: 10,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-21-q1',
      'Which phase of a cyberattack involves installing a hidden account or backdoor to ensure continued access?',
      ['Reconnaissance', 'Initial Access', 'Persistence', 'Impact'],
      'c',
      'The attacker wants to survive even if discovered.',
      'Persistence is Phase 3. After gaining initial access, attackers create mechanisms — backdoors, hidden admin accounts, scheduled tasks — that keep them inside even if their original entry point is closed.'
    ),
    mcq(
      'r000-21-q2',
      'During the Reconnaissance phase, which of these activities would an attacker MOST likely perform?',
      [
        'Encrypting the target\'s files with ransomware',
        'Installing a remote access trojan on a server',
        'Searching LinkedIn for employee names and scraping public IP ranges',
        'Sending phishing emails to the target\'s staff',
      ],
      'c',
      'Reconnaissance is passive information gathering — before any attack.',
      'Reconnaissance involves collecting publicly available information: employee names, email formats, IP addresses, software versions, and leaked credentials. No attack has happened yet — the attacker is building a map of their target.'
    ),
    fillBlank(
      'r000-21-q3',
      'The three most common Initial Access vectors are phishing, unpatched software, and weak or ___ passwords.',
      'stolen',
      'Think about credentials obtained from previous breaches.',
      'Stolen (or leaked) passwords from previous data breaches are used in credential-stuffing attacks: attackers try the same email/password combination across many services, exploiting users who reuse passwords.'
    ),
    scenario(
      'r000-21-q4',
      'An attacker sends a fake "salary slip" email to an HR officer at a power company. The officer opens the attached PDF, which silently installs software giving the attacker remote access. Which two phases have just occurred?',
      [
        'Reconnaissance and Persistence',
        'Initial Access and Persistence',
        'Reconnaissance and Impact',
        'Initial Access and Impact',
      ],
      'b',
      'The email is the entry point; the installed software ensures the attacker can stay.',
      'The phishing email represents Initial Access (Phase 2) — exploiting a human weakness to gain the first foothold. The software that installs in the background is a backdoor, which is Persistence (Phase 3). Reconnaissance happened earlier and Impact has not yet occurred.'
    ),
  ],
});

// ─── Lesson 2.2: rebuild-000-2-2 ─────────────────────────────────────────────

export const rebuild000_2_2 = makeLesson({
  id: 'rebuild-000-2-2',
  courseId: 'the-rebuild-protocol',
  title: 'The Human Cost: Nakuru Hospital',
  titleSw: 'Gharama kwa Binadamu: Hospitali ya Nakuru',
  briefing:
    'MISSION BRIEFING: Cyberattacks are not abstract lines of code on a terminal screen. They have real human consequences. Step into the shoes of the medical response team at Nakuru Level 5 Hospital during The Blackout of 2031.\n\n' +
    'At 14:15 on Day 1 of The Blackout, hospital power flickered and transferred to emergency generators. Simultaneously, external broadband, cellular signals, and the centralized hospital management system went dark. Within 30 minutes:\n' +
    '- Patient records, allergy histories, and active medication orders were inaccessible.\n' +
    '- Digital blood bank inventory counts were offline; nurses had to manually count units by flashlight.\n' +
    '- Vaccine cold-chain refrigerators (+2°C to +8°C) were dependent on limited on-site fuel reserves.\n' +
    '- Incoming road trauma referrals could not be coordinated by phone or WhatsApp.\n\n' +
    'The decisions made in those 72 hours saved lives through disciplined emergency procedures, manual triage tags, and analog VHF radio coordination. Security defenders do not protect machines — they protect human life.',
  briefingSw:
    'MISSION BRIEFING: Mashambulizi ya mtandao yanaathiri maisha halisi ya binadamu. Katika misheni hii, jifunze kuhusu changamoto za Hospitali ya Nakuru wakati wa Giza Kuu la 2031.\n\nMifumo ya kompyuta ilipozimika, madaktari walilazimika kutumia kumbukumbu za karatasi, taa za betri, na redio za mawasiliano ili kuokoa maisha.',
  estimatedMinutes: 12,
  examDomain: 'Digital Citizenship',
  exercises: [
    scenario(
      'r000-22-q1',
      'During a network blackout, a patient arrives unconscious at the emergency room with severe trauma. The digital health record system is offline. What is the correct clinical protocol?',
      [
        'Delay treatment until the network connection is restored so records can be checked',
        'Apply emergency universal trauma protocols immediately, log care on paper triage tags, and test blood type manually',
        'Try restarting the main server room router before attending to the patient',
        'Transfer the patient to another facility without examining them',
      ],
      'b',
      'Life preservation takes precedence over electronic record-keeping.',
      'In a cyber crisis, analog and paper fallback procedures must be second nature. Delaying emergency medical treatment for IT recovery is a catastrophic failure mode.'
    ),
    mcq(
      'r000-22-q2',
      'Why is maintaining the cold chain (+2°C to +8°C) critical for hospitals during an extended power and network outage?',
      [
        'To keep cold drinks chilled for the doctors',
        'Because life-saving vaccines, insulin, and blood products spoil rapidly if temperature limits are breached',
        'To prevent computer server racks from overheating',
        'It is only an aesthetic preference with no medical impact',
      ],
      'b',
      'Think about biological medications and vaccines.',
      'Biological supplies such as antivenom, rabies vaccines, child immunisations, and insulin degrade when temperatures exceed +8°C. Protecting cold-chain power and monitoring is a vital security requirement.'
    ),
    fillBlank(
      'r000-22-q3',
      'When cellular networks and internet cables fail completely, emergency services rely on analog ___ radio transceivers for long-range voice communication.',
      'VHF',
      'Very High Frequency two-way radios used by emergency services and park rangers.',
      'VHF and UHF two-way radio systems operate independently of internet infrastructure and cell towers, making them the ultimate emergency communications lifeline.'
    ),
    scenario(
      'r000-22-q4',
      'You are auditing the cybersecurity posture of a county hospital. What is the MOST critical recommendation to ensure survival during a ransomware attack?',
      [
        'Buy larger curved computer monitors for all desks',
        'Maintain tested, offline air-gapped backups of patient databases and regular paper-triage disaster drill rehearsals',
        'Allow doctors to use any personal USB flash drive they bring from home',
        'Disable all password requirements to make access faster',
      ],
      'b',
      'Focus on recovery and staff readiness.',
      'Ransomware encrypts active network drives. Only immutable, offline (air-gapped) backups and practiced manual continuity drills allow a hospital to continue saving lives during an active incident.'
    ),
  ],
});

// ─── Lesson 2.3: rebuild-000-2-3 ─────────────────────────────────────────────

export const rebuild000_2_3 = makeLesson({
  id: 'rebuild-000-2-3',
  courseId: 'the-rebuild-protocol',
  title: 'Why Defenders Matter More Than Attackers',
  titleSw: 'Kwa Nini Walinzi Ni Muhimu Zaidi ya Wavamizi',
  briefing:
    'MISSION BRIEFING: In popular media, hackers are often romanticised as lone geniuses in dark rooms. In reality, destruction is easy — construction and defense require true expertise, stamina, and purpose.\n\n' +
    'The core challenge in cybersecurity is known as the Defender\'s Dilemma (asymmetric advantage): an adversary only needs to find one unpatched flaw, one stolen password, or one distracted user to breach a network. A defender, by contrast, must protect every server, every workstation, every mobile phone, and every employee, 24 hours a day, 365 days a year.\n\n' +
    'Yet defenders hold the decisive long-term advantage: community, collective intelligence, and purpose. When the Rebuilder Corps shares threat intelligence, fixes vulnerabilities, and educates colleagues, we build collective immunity. An attack lasts hours; a fortified infrastructure protects generations. You are training to become a defender of our shared society.',
  briefingSw:
    'MISSION BRIEFING: Kuharibu ni rahisi, lakini kujenga na kulinda kunahitaji ujuzi na moyo wa uzalendo.\n\nMvamizi anahitaji kosa moja tu kuingia, lakini mlinzi lazima alinde kila sehemu wakati wote. Kikosi cha Wajenzi kinalinda jamii nzima kwa kushirikiana na kusambaza maarifa.',
  estimatedMinutes: 8,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-23-q1',
      'What is the "Defender\'s Dilemma" in cybersecurity?',
      [
        'Defenders do not know which operating system to install',
        'Attackers only need to find a single flaw to succeed, while defenders must secure every vulnerability continuously',
        'Defenders are not allowed to use computers during an attack',
        'Antivirus software is too expensive for most companies',
      ],
      'b',
      'Think about the asymmetry between attack and defense.',
      'The asymmetry of cybersecurity means defenders face thousands of potential targets while attackers can focus resources on testing for a single weak link. Understanding this teaches us why defense-in-depth is essential.'
    ),
    matchPairs(
      'r000-23-match',
      'Match each defensive pillar of the Rebuilder Corps to its definition.',
      [
        { leftId: 'depth', left: 'Defense in Depth', rightId: 'def-depth', right: 'Multiple overlapping defensive layers rather than a single perimeter' },
        { leftId: 'intel', left: 'Threat Sharing', rightId: 'def-intel', right: 'Promptly notifying partner organisations and national CERTs about indicators of compromise' },
        { leftId: 'hygiene', left: 'Security Hygiene', rightId: 'def-hygiene', right: 'Consistent daily adherence to strong passphrases, 2FA, and prompt patching' },
        { leftId: 'resilience', left: 'Resilience', rightId: 'def-resil', right: 'Designing systems that can absorb damage and maintain core services during outages' },
      ],
      'Match each principle to its practical application.',
      'Defenders succeed by implementing multiple defensive layers, sharing threat intelligence, practicing daily hygiene, and engineering for resilience.'
    ),
    fillBlank(
      'r000-23-q3',
      'In Kenya, organisations report cyber incidents and coordinate national defense through the National ___ (National Computer Emergency Response Team).',
      'KE-CIRT',
      'The national computer emergency response team coordinated by the Communications Authority of Kenya.',
      'KE-CIRT/CC (Kenya Computer Incident Response Team Coordination Centre) monitors cyber threats nationally and alerts institutions to emerging attacks.'
    ),
    scenario(
      'r000-23-q4',
      'A technician discovers an unpatched critical flaw on an internal water utility server. Instead of keeping it secret, what should an ethical Rebuilder do?',
      [
        'Post the flaw on social media to embarrass the organisation',
        'Report it immediately to the security team and follow responsible disclosure to patch it before attackers exploit it',
        'Attempt to sell the exploit on an underground hacker forum',
        'Ignore it because no attack has happened yet',
      ],
      'b',
      'Responsible, prompt remediation protects the community.',
      'Responsible disclosure and internal reporting ensure vulnerabilities are patched before malicious actors discover them. Ethical defenders act with integrity to shield their communities.'
    ),
  ],
});

// ─── Lesson 3.1: rebuild-000-3-1 ─────────────────────────────────────────────

export const rebuild000_3_1 = makeLesson({
  id: 'rebuild-000-3-1',
  courseId: 'the-rebuild-protocol',
  title: 'Your Password Is Your Key',
  titleSw: 'Nywila yako ni ufunguo wako',
  briefing:
    'Passwords are the first line of defence for every digital account. Most successful attacks exploit weak or reused passwords — not sophisticated zero-days.\n\n' +
    'What makes a password strong? Length is the single most important factor. A 14-character password takes vastly longer to crack than an 8-character one, even if the shorter one uses symbols. Aim for 14 or more characters. Uniqueness matters just as much: every account must have a different password. If one account is breached, attackers immediately try the same credentials everywhere else — this is called credential stuffing. Passphrases are the practical solution: three or more random words combined with numbers (e.g. "mango-cloud-47-river") are long, memorable, and strong.\n\n' +
    'Password managers (like Bitwarden, 1Password, or the built-in manager in your phone) store hundreds of unique, randomly generated passwords behind a single master passphrase. You only need to remember one strong passphrase. The manager does the rest.\n\n' +
    'Never reuse a password. Never share a password. Change a password immediately if you suspect a breach. These three rules would have prevented the Colonial Pipeline attack.',
  briefingSw:
    'Nywila ni ulinzi wa kwanza wa kila akaunti ya kidijitali. Mashambulizi mengi yanafanikiwa kwa sababu ya nywila dhaifu au zinazotumiwa tena.\n\n' +
    'Nywila nzuri ni ndefu (herufi 14 au zaidi), ya kipekee kwa kila akaunti, na inayochanganya maneno matatu au zaidi ya nasibu. Wasimamizi wa nywila huhifadhi nywila nyingi za kipekee nyuma ya nywila kuu moja. Usiwahi kutumia nywila sawa katika akaunti mbili.',
  estimatedMinutes: 8,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-31-q1',
      'Which of the following passwords is the strongest?',
      [
        'P@ssw0rd!',
        'nairobi2024',
        'mango-cloud-47-river',
        'Abc123!',
      ],
      'c',
      'Length beats complexity. Three random words plus numbers is long and memorable.',
      '"mango-cloud-47-river" is a passphrase — approximately 20 characters, random words that are hard to predict, and includes a number. The others are short, use common substitutions (P@ssw0rd), or contain dictionary words with predictable patterns.'
    ),
    scenario(
      'r000-31-q2',
      'You use the same password for your email, M-Pesa app, and work system. Your email provider suffers a data breach and your password is leaked. What is the MOST likely consequence?',
      [
        'Only your email is at risk because the breach was limited to the email provider',
        'Attackers will try the same password on your M-Pesa app and work system — and probably succeed',
        'You are safe as long as you change the email password within 24 hours',
        'Password reuse only matters for banking apps, not work systems',
      ],
      'b',
      'Attackers automate credential stuffing across thousands of sites.',
      'Credential stuffing is automated: tools take leaked email/password pairs and try them against hundreds of popular services. If you reuse a password, a single breach compromises every account that shares it. Change all reused passwords immediately when any breach occurs.'
    ),
    mcq(
      'r000-31-q3',
      'What is the PRIMARY benefit of using a password manager?',
      [
        'It makes your passwords shorter and easier to type',
        'It allows you to use the same strong password across all sites safely',
        'It generates and stores a unique strong password for every account behind one master passphrase',
        'It automatically resets your passwords every week',
      ],
      'c',
      'You only need to remember one thing.',
      'Password managers generate random, unique passwords for every site and encrypt them behind a single master passphrase. This eliminates reuse without requiring you to memorise hundreds of passwords.'
    ),
    fillBlank(
      'r000-31-q4',
      'According to the Rebuilder Corps password standard, the minimum recommended length for a strong password or passphrase is ___ characters.',
      '14',
      'Think: longer than a typical short password, but shorter than a sentence.',
      'Fourteen characters is the Rebuilder standard minimum. At this length, even a simple passphrase of random words becomes computationally expensive to brute-force. Many security frameworks (NIST SP 800-63B) recommend 15+ characters for user-chosen passwords.'
    ),
  ],
});

// ─── Lesson 5: rebuild-000-3-2 ───────────────────────────────────────────────

export const rebuild000_3_2 = makeLesson({
  id: 'rebuild-000-3-2',
  courseId: 'the-rebuild-protocol',
  title: 'Recognising Phishing',
  titleSw: 'Kutambua ujumbe wa ulaghai',
  briefing:
    'Phishing is the number one attack vector globally — and the one that started The Blackout. Attackers send fake emails or SMS messages pretending to be trusted organisations: Safaricom, KCB, the Kenya Revenue Authority, government ministries, or employers.\n\n' +
    'The six warning signs of phishing:\n' +
    '1. Urgency — "Your account will be closed in 10 minutes unless you act now." Legitimate organisations do not use countdown pressure.\n' +
    '2. Lookalike domains — rebu1ld.ke (the digit 1 replacing the letter l) vs rebuild.ke. Check the sender address carefully.\n' +
    '3. Requests for passwords or OTPs — No legitimate bank, telco, or government agency will ask you to send your password or OTP via email or WhatsApp.\n' +
    '4. Unexpected attachments — A PDF or Word document you did not ask for, especially with a vague name like "salary_slip.pdf".\n' +
    '5. Generic greetings — "Dear Customer" instead of your name.\n' +
    '6. Mismatched links — The displayed URL says one thing but hovering shows a different destination.\n\n' +
    'The Nullers sent 40,000 phishing emails the morning of The Blackout. The messages pretended to be from the Kenya Power emergency maintenance team. Twelve people clicked. That was enough to give the attackers their initial foothold in the power grid control network.',
  briefingSw:
    'Udanganyifu wa phishing ndiyo njia kuu ya shambulio duniani kote — na ile iliyoanzisha Giza Kuu.\n\n' +
    'Ishara sita za phishing: (1) Haraka — "Akaunti yako itafungwa dakika 10." (2) Vikoa vinavyofanana — rebu1ld.ke badala ya rebuild.ke. (3) Maombi ya nywila au OTP. (4) Viambatisho visivyotarajiwa. (5) Salamu za jumla — "Mteja Mpendwa." (6) Viungo visivyolingana na maandishi.\n\n' +
    'Nullers walituma barua pepe 40,000 za udanganyifu siku ya Giza Kuu. Watu 12 walibonyeza. Hiyo ilikuwa ya kutosha.',
  estimatedMinutes: 10,
  examDomain: 'Digital Citizenship',
  exercises: [
    scenario(
      'r000-32-q1',
      'You receive an SMS: "URGENT: Your Safaricom line will be permanently suspended in 15 minutes. Tap this link to verify your identity: safar1com-verify.link/ke". What should you do?',
      [
        'Tap the link immediately to avoid losing your number',
        'Forward it to a friend to check if it is real',
        'Delete the SMS and verify your account status by dialling *100# or calling the official Safaricom line',
        'Reply with your ID number to prove your identity',
      ],
      'c',
      'Urgency + suspicious domain = phishing. Always use official channels.',
      'This SMS has multiple red flags: artificial urgency ("15 minutes"), a lookalike domain ("safar1com" with a digit 1), and a non-official link. Safaricom uses official shortcodes and never suspends lines via SMS link. Always verify through the official app or *100#.'
    ),
    fillBlank(
      'r000-32-q2',
      'An attacker registers the domain "rebu1ld.ke" (using the digit 1 instead of the letter l) to trick Rebuilder Corps staff. This technique of creating domains that closely resemble legitimate ones is called domain ___.',
      'spoofing',
      'The fake domain impersonates the real one visually.',
      'Domain spoofing (also called typosquatting or lookalike domains) is the technique of registering domains that are visually similar to legitimate ones. Users who glance quickly at the URL may not notice the substitution of a digit for a letter.'
    ),
    mcq(
      'r000-32-q3',
      'You receive a work email with an attachment called "Q3_Payroll_Final.xlsx" from your HR department. You were NOT expecting any payroll file today. What is the SAFEST action?',
      [
        'Open the file — it is probably a genuine HR document',
        'Open it only if your antivirus is running',
        'Contact HR through a separate trusted channel (phone or in-person) to confirm they sent it before opening',
        'Save it to your desktop and open it next week',
      ],
      'c',
      'Verify unexpected attachments through a different channel.',
      'Unexpected attachments are a classic phishing vector, especially when they reference high-interest topics like payroll. Verify with the claimed sender through a completely separate channel (a phone call, not a reply to the same email) before opening.'
    ),
    mcq(
      'r000-32-q4',
      'Which of the following is a legitimate reason for a bank or mobile money provider to ask you for your PIN or OTP?',
      [
        'To verify your identity when you call their support line',
        'To process a transaction you initiated through their official app',
        'There is no legitimate reason — banks and telcos never ask for your PIN or OTP',
        'When they send you an SMS with a verification link',
      ],
      'c',
      'If anyone asks for your PIN or OTP, it is a scam.',
      'Legitimate financial institutions and telcos design their systems so that staff never need — and can never ask for — your PIN or OTP. These are your secrets alone. Any request for them, from any channel, is a social-engineering attack.'
    ),
    matchPairs(
      'r000-32-q5',
      'Match each phishing red flag to its correct explanation.',
      [
        {
          leftId: 'urgency',
          left: 'Artificial urgency',
          rightId: 'urgency-desc',
          right: 'Creates panic to prevent careful thinking',
        },
        {
          leftId: 'lookalike',
          left: 'Lookalike domain',
          rightId: 'lookalike-desc',
          right: 'Visually similar address designed to deceive',
        },
        {
          leftId: 'otp-request',
          left: 'OTP request',
          rightId: 'otp-desc',
          right: 'No legitimate provider ever asks for this',
        },
        {
          leftId: 'generic',
          left: 'Generic greeting',
          rightId: 'generic-desc',
          right: 'Shows attacker does not know your real name',
        },
      ],
      'Match the warning sign to why it is suspicious.',
      'Each red flag exploits a different human weakness: urgency bypasses rational thought, lookalike domains exploit visual inattention, OTP requests exploit trust in authority, and generic greetings indicate mass targeting.'
    ),
  ],
});

// ─── Lesson 3.3: rebuild-000-3-3 ─────────────────────────────────────────────

export const rebuild000_3_3 = makeLesson({
  id: 'rebuild-000-3-3',
  courseId: 'the-rebuild-protocol',
  title: 'Software Updates & Patch Culture',
  titleSw: 'Maboresho ya Programu na Utamaduni wa Kupachika Viraka',
  briefing:
    'MISSION BRIEFING: Attackers rarely invent brand-new zero-day exploits. The overwhelming majority of real-world breaches exploit known vulnerabilities that vendors had already patched months earlier. Your mission is to master patch management.\n\n' +
    'When security researchers or software engineers discover a bug in an operating system, app, or router firmware, the vendor creates a "patch" (software update) and assigns it a CVE identifier (Common Vulnerabilities and Exposures, e.g. CVE-2024-38077). Once a patch is announced publicly, malicious actors reverse-engineer the fix and unleash automated scanner bots across the internet, looking for any unpatched device.\n\n' +
    'If your phone, Wi-Fi router, or server has not installed the update, you become an effortless target. Developing a "patch culture" means:\n' +
    '1. Enabling automatic updates on your mobile operating system and browser.\n' +
    '2. Regularly rebooting devices so updates take effect.\n' +
    '3. Updating firmware on Wi-Fi routers and security cameras, not just phones.\n' +
    '4. Retiring software that is no longer supported with security updates (End-of-Life).',
  briefingSw:
    'MISSION BRIEFING: Wavamizi wengi hutumia udhaifu unaojulikana ambao viraka vyake tayari vimetolewa. Jifunze umuhimu wa kufanya sasisho za programu mara kwa mara.\n\nKuweka sasisho kiotomatiki kwenye simu, kompyuta, na vipanga njia vya Wi-Fi (routers) huzuia mashambulizi mengi mtandaoni.',
  estimatedMinutes: 10,
  examDomain: 'CompTIA Security+ 2.0 · Digital Citizenship',
  exercises: [
    mcq(
      'r000-33-q1',
      'What is a "CVE" in the context of cybersecurity updates?',
      [
        'Central Video Encoder',
        'Common Vulnerabilities and Exposures — a standardized identifier for known security flaws',
        'Certified Virtual Ethernet connection',
        'Computer Virus Elimination software',
      ],
      'b',
      'It is the public dictionary of known security vulnerabilities.',
      'CVE (Common Vulnerabilities and Exposures) gives every security flaw a unique number (e.g. CVE-2023-34362) so defenders, vendors, and researchers can track and fix it systematically.'
    ),
    matchPairs(
      'r000-33-match',
      'Match each vulnerability lifecycle term to its explanation.',
      [
        { leftId: 'zeroday', left: 'Zero-Day Vulnerability', rightId: 'exp-zeroday', right: 'A flaw unknown to the vendor with no public patch available yet' },
        { leftId: 'patch', left: 'Security Patch / Update', rightId: 'exp-patch', right: 'Code released by the vendor to repair a specific software flaw' },
        { leftId: 'eol', left: 'End-of-Life (EOL) Software', rightId: 'exp-eol', right: 'Software no longer supported or patched by the developer' },
        { leftId: 'scanner', left: 'Vulnerability Scanner', rightId: 'exp-scanner', right: 'Automated tool that scans networks to find unpatched software' },
      ],
      'Match each concept with its role in the security lifecycle.',
      'Software progresses from zero-day to patched, and eventually to end-of-life where it must be replaced.'
    ),
    fillBlank(
      'r000-33-q3',
      'Network equipment like Wi-Fi routers run embedded software called ___ that must be updated periodically to patch remote exploitation vulnerabilities.',
      'firmware',
      'The permanent software programmed into read-only memory on hardware devices.',
      'Router firmware is frequently overlooked by users, leaving internet-facing gateways vulnerable to botnets and DNS tampering.'
    ),
    scenario(
      'r000-33-q4',
      'Your work computer prompts you: "A critical security update has been downloaded. Restart to complete installation." You are in the middle of writing a non-urgent report. What is the best practice?',
      [
        'Click "Remind me in 30 days" and keep working',
        'Save your document and restart the computer immediately to apply the patch',
        'Disable all future update notifications in settings',
        'Turn off the computer and switch to a smartphone',
      ],
      'b',
      'Patches only take effect after a reboot.',
      'Delaying patches leaves the system vulnerable to active exploit bots. Saving your work and performing a 2-minute restart immediately closes known attack vectors.'
    ),
  ],
});

// ─── Lesson 3.4: rebuild-000-3-4 ─────────────────────────────────────────────

export const rebuild000_3_4 = makeLesson({
  id: 'rebuild-000-3-4',
  courseId: 'the-rebuild-protocol',
  title: 'Backups: The Rebuild Starts Here',
  titleSw: 'Nakala Teule: Ujenzi Mpya Unaanzia Hapa',
  briefing:
    'MISSION BRIEFING: There are two types of computer users: those who have experienced catastrophic data loss, and those who are about to. In the Rebuilder Corps, our rule is simple: data that does not exist in three places does not exist.\n\n' +
    'The gold standard of resilient digital survival is the 3-2-1 Backup Rule:\n' +
    '- 3 Copies of all critical data (1 primary operational copy + 2 backup copies).\n' +
    '- 2 Different Media types (e.g. your computer\'s internal drive + an external USB drive, or magnetic tape + cloud storage).\n' +
    '- 1 Copy stored Offsite or Offline (air-gapped and disconnected from your local network).\n\n' +
    'Why must one copy be offline? Modern ransomware specifically searches your local network for connected backup drives, shared network folders (NAS), and cloud sync folders — and encrypts them first so you cannot recover. An air-gapped drive kept in a drawer or an immutable cloud vault with write-once protection is immune to ransomware encryption. Backups turn a catastrophic extortion incident into an afternoon of restoration.',
  briefingSw:
    'MISSION BRIEFING: Sheria ya dhahabu ya nakala teule ni 3-2-1:\n' +
    'Nakala 3 za data yako, kwenye aina 2 tofauti za vifaa, na nakala 1 iliyo mbali au nje ya mtandao (offline).\n\nRansomware huangamiza pia nakala zilizounganishwa kwenye mtandao mmoja, hivyo nakala iliyotenganishwa (air-gapped) ndiyo kinga ya uhakika.',
  estimatedMinutes: 10,
  examDomain: 'CompTIA Security+ 3.0 · Digital Citizenship',
  exercises: [
    mcq(
      'r000-34-q1',
      'According to the industry-standard 3-2-1 backup strategy, how many copies of your essential data should you maintain?',
      ['1 copy', '2 copies', '3 copies', '10 copies'],
      'c',
      'The "3" in 3-2-1 stands for the total number of copies.',
      'The 3-2-1 rule dictates 3 copies of your data: the live working copy plus two distinct backup copies.'
    ),
    mcq(
      'r000-34-q2',
      'Why is it vital that at least one backup copy is kept "offline" (air-gapped) and disconnected from your computer network?',
      [
        'Offline drives consume zero electricity and run faster',
        'Ransomware and attackers actively search for and encrypt any backup drive connected to the network',
        'Data transfers faster when the cable is unplugged',
        'Offline storage prevents physical dust from accumulating',
      ],
      'b',
      'Think about how ransomware spreads across connected drives and shared folders.',
      'Ransomware traverses network shares and external drives plugged into infected machines. An air-gapped, disconnected drive cannot be reached or encrypted over the network.'
    ),
    fillBlank(
      'r000-34-q3',
      'A backup device physically disconnected from all networks and computers is described as being ___-gapped.',
      'air',
      'A gap of physical air between the device and the network.',
      'An air gap provides physical isolation, preventing remote cyberattacks, malware propagation, and unauthorized network access.'
    ),
    scenario(
      'r000-34-q4',
      'A microfinance cooperative stores its loan ledger on a single office desktop. The manager plugs in an external hard drive every Friday to back up files, then unplugs it and locks it in a fireproof safe. Is this an effective 3-2-1 practice?',
      [
        'No, external hard drives should never be stored in safes',
        'Yes, it provides an offline, air-gapped copy protected from both network ransomware and physical hazards',
        'No, backups should always remain plugged in 24/7',
        'No, financial ledgers do not need backups',
      ],
      'b',
      'It creates an isolated, offline copy protected from malware and physical loss.',
      'Unplugging the drive and securing it in a safe creates an authentic air-gapped backup. Even if ransomware infects the office network on Monday, Friday\'s ledger remains untouched and restorable.'
    ),
  ],
});

// ─── Lesson 3.5: rebuild-000-3-5 ─────────────────────────────────────────────

export const rebuild000_3_5 = makeLesson({
  id: 'rebuild-000-3-5',
  courseId: 'the-rebuild-protocol',
  title: 'Two-Factor Authentication',
  titleSw: 'Uthibitishaji wa vipengele viwili',
  briefing:
    'Two-Factor Authentication (2FA) means that logging in requires BOTH something you know (your password) AND something you have (your phone, an authenticator app, or a hardware key). Even if an attacker steals or guesses your password, they still cannot log in without the second factor.\n\n' +
    'The three types of 2FA, ordered from weakest to strongest:\n\n' +
    '1. SMS OTP (One-Time Password) — A code sent to your phone via text message. Weak but still far better than a password alone. Vulnerable to SIM-swap attacks, where an attacker convinces your carrier to transfer your number to their SIM card.\n\n' +
    '2. Authenticator App — Apps like Google Authenticator, Microsoft Authenticator, or Authy generate time-based codes that change every 30 seconds. These are not sent over SMS, so SIM-swap attacks do not work. Strong.\n\n' +
    '3. Hardware Key — Physical devices like YubiKey that plug into USB or tap via NFC. Cryptographically verify you are on the real website (preventing phishing). Strongest protection available.\n\n' +
    'Enable 2FA on: your email (the master key to all accounts), M-Pesa and banking apps, social media accounts, and any work system that supports it. If your email is protected by 2FA, attackers cannot use the "Forgot Password" link to take over your other accounts — even if they know your email password.',
  briefingSw:
    'Uthibitishaji wa Vipengele Viwili (2FA) unahitaji VITU VIWIli: kitu unachojua (nywila) NA kitu unacho (simu, programu ya uthibitishaji, au ufunguo wa vifaa). Hata kama mshambulizi anajua nywila yako, hawezi kuingia bila kipengele cha pili.\n\n' +
    'Aina tatu za 2FA kwa nguvu inayoongezeka:\n' +
    '1. OTP ya SMS — Nambari inayotumwa kwa ujumbe mfupi. Dhaifu kidogo lakini bora kuliko nywila peke yake.\n' +
    '2. Programu ya Uthibitishaji — Kama Google Authenticator. Nambari zinabadilika kila sekunde 30. Nguvu.\n' +
    '3. Ufunguo wa Vifaa — Kama YubiKey. Inaunganishwa kwenye USB. Yenye nguvu zaidi.\n\n' +
    'Washa 2FA kwenye: barua pepe, M-Pesa, mitandao ya kijamii, na mifumo ya kazi.',
  estimatedMinutes: 8,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-35-q1',
      'What does "2FA" stand for?',
      [
        'Two-File Authentication',
        'Two-Factor Authentication',
        'Twice-Failed Authorisation',
        'Two-Form Access',
      ],
      'b',
      'It refers to using two separate factors to verify identity.',
      '2FA stands for Two-Factor Authentication. It combines something you know (password) with something you have (a device or key) or something you are (biometrics), making it much harder for attackers to gain unauthorised access.'
    ),
    matchPairs(
      'r000-35-q2',
      'Order these 2FA types by matching each to its correct strength level, from weakest to strongest.',
      [
        {
          leftId: 'sms',
          left: 'SMS OTP',
          rightId: 'weak',
          right: 'Weakest — vulnerable to SIM-swap',
        },
        {
          leftId: 'auth-app',
          left: 'Authenticator App',
          rightId: 'strong',
          right: 'Strong — time-based codes, no SMS',
        },
        {
          leftId: 'hardware-key',
          left: 'Hardware Key (e.g. YubiKey)',
          rightId: 'strongest',
          right: 'Strongest — cryptographic, phishing-resistant',
        },
      ],
      'Think about what attacks each method is vulnerable to.',
      'SMS OTP is the weakest because SIM-swap attacks can redirect your codes. Authenticator apps are stronger because they are tied to your device, not your phone number. Hardware keys are the strongest because they use cryptographic challenge-response and verify the real website URL.'
    ),
    scenario(
      'r000-35-q3',
      'An attacker obtains your email password from a leaked credentials database. Your email account has 2FA enabled via an authenticator app. What happens when the attacker tries to log in?',
      [
        'They can log in immediately because they have the correct password',
        'They are blocked — they have the password but not the time-based code from your authenticator app',
        'They receive an SMS code that they can intercept',
        'The account is automatically deleted to prevent unauthorised access',
      ],
      'b',
      'The second factor is on your device, not in the leaked database.',
      '2FA blocks the attacker even when the password is known. The authenticator app generates a time-based code that changes every 30 seconds and is only accessible on your physical device. Without it, the correct password alone is insufficient to log in.'
    ),
    fillBlank(
      'r000-35-q4',
      'A SIM-swap attack works against SMS-based 2FA because an attacker can trick your mobile carrier into transferring your phone number to their own ___.',
      'SIM',
      'Think about the physical card in your phone that identifies your number.',
      'In a SIM-swap attack, the attacker social-engineers the mobile carrier\'s support staff into believing they are you, then transfers your phone number to a new SIM card in their possession. Once done, all SMS messages — including OTP codes — go to the attacker\'s phone. This is why authenticator apps and hardware keys are stronger than SMS OTP.'
    ),
  ],
});

// ── Unit 4: Joining the Corps ─────────────────────────────────────────────────

export const rebuild000_4_1 = makeLesson({
  id: 'rebuild-000-4-1',
  courseId: 'the-rebuild-protocol',
  title: 'The Rebuilder Corps: Who We Are',
  titleSw: 'Kikosi cha Wajenzi: Sisi Ni Nani',
  briefing:
    'MISSION BRIEFING: Before you take the oath of service and step onto the frontlines of the Civilization Map, understand the foundation and principles of the Rebuilder Corps.\n\n' +
    'The Rebuilder Corps was forged in the aftermath of The Blackout of 2031. When centralized institutions faltered, ordinary citizens — vocational trainees, network technicians, solar electricians, software developers, and university instructors — came together to rebuild East Africa\'s infrastructure. We are defined by three core tenets:\n\n' +
    '1. Sovereign Defense & Civic Service: We protect schools, hospitals, water supplies, and civic institutions. We never use our skills for illegal access, unauthorized hacking, or extortion.\n' +
    '2. Open Knowledge: Everything we learn is shared. Proprietary gatekeeping leaves communities vulnerable. We train each other, author open-source tools, and publish bilingual guides in English and Swahili.\n' +
    '3. Ethical & Legal Rigour: We operate strictly within the law — adhering to Kenya\'s Computer Misuse and Cybercrimes Act (CMCA 2018) and Data Protection Act (DPA 2019). We do not "hack back"; we defend, harden, and rebuild.\n\n' +
    'Wear your Corps designation with pride, whether you are a TVET apprentice or a senior systems engineer.',
  briefingSw:
    'MISSION BRIEFING: Kikosi cha Wajenzi kiliundwa baada ya Giza Kuu la 2031 na wataalamu, mafundi wa TVET, na raia wazalendo.\n\nNguzo zetu: (1) Kulinda miundombinu ya umma, (2) Kusambaza maarifa waziwazi, na (3) Kufanya kazi kwa maadili na kufuata sheria za nchi (CMCA 2018 na DPA 2019).',
  estimatedMinutes: 8,
  examDomain: 'Digital Citizenship · CMCA 2018',
  exercises: [
    mcq(
      'r000-41-q1',
      'Under Kenya\'s Computer Misuse and Cybercrimes Act (CMCA 2018), accessing a computer system or network without authorization is:',
      [
        'Permitted if you do not download any files',
        'A criminal offence punishable by significant fines and imprisonment',
        'Allowed as long as you consider yourself a hobbyist',
        'Legal if you notify the administrator afterwards on social media',
      ],
      'b',
      'The law requires explicit authorization before testing or accessing systems.',
      'Section 14 of the CMCA 2018 criminalizes unauthorized access to computer systems. Ethical defenders always obtain formal written authorization before performing security audits or penetration testing.'
    ),
    matchPairs(
      'r000-41-match',
      'Match each tenet of the Rebuilder Corps to its commitment.',
      [
        { leftId: 'defense', left: 'Civic Defense', rightId: 'com-defense', right: 'Protecting civilian infrastructure and public services from harm' },
        { leftId: 'open', left: 'Open Knowledge', rightId: 'com-open', right: 'Sharing technical skills openly in local languages without paywalls' },
        { leftId: 'ethics', left: 'Legal Integrity', rightId: 'com-ethics', right: 'Complying strictly with cybersecurity legislation and ethical standards' },
      ],
      'Match each core value to its operational practice.',
      'The Corps operates with civic duty, open educational resources, and strict adherence to constitutional and cyber laws.'
    ),
    fillBlank(
      'r000-41-q3',
      'The principle of "Responsible ___" means reporting a discovered security flaw privately to the vendor so they can fix it before the public or attackers learn about it.',
      'Disclosure',
      'Disclosing information responsibly to the vendor.',
      'Responsible disclosure protects the community by giving developers time to build and distribute a security patch before malicious actors exploit the vulnerability.'
    ),
    scenario(
      'r000-41-q4',
      'A friend asks you to "test" the security of their former employer\'s website because they suspect it has a security bug, but they do not have written permission from the company. What must you do?',
      [
        'Run an automated attack tool late at night when traffic is low',
        'Refuse to scan or access the system, as unauthorized security testing is illegal under CMCA 2018 without explicit owner consent',
        'Scan it as long as you promise not to alter any database records',
        'Send a fake phishing email to see if their staff click it',
      ],
      'b',
      'Consent and authorization are mandatory for any security assessment.',
      'Scanning or testing without written authorization from the system owner is unauthorized access under cyber law. Ethical cybersecurity professionals always maintain signed Rules of Engagement (RoE).'
    ),
  ],
});

// ─── Lesson 4.2: rebuild-000-4-2 ─────────────────────────────────────────────

export const rebuild000_4_2 = makeLesson({
  id: 'rebuild-000-4-2',
  courseId: 'the-rebuild-protocol',
  title: 'Your Skill Tree: Reading the Civilization Map',
  titleSw: 'Mti wako wa ujuzi: Kusoma Ramani ya Ustaarabu',
  briefing:
    "MISSION BRIEFING: Every node on the Civilization Map is a real skill. Every skill you unlock lights up a piece of East Africa.\n\nThe CyberLearn Civilization Map shows your learning journey as a network of infrastructure nodes. Each node represents a skill cluster that, when mastered, restores a piece of the region's digital infrastructure. Nodes are connected — you must complete prerequisites before unlocking the next node, just as you must restore power before you can restore communications.\n\nYour map shows three states for each node: (1) Locked — prerequisites not yet complete. (2) In Progress — at least one lesson started. (3) Restored — all lessons complete, badge earned. Your overall progress is measured in Rebuild Points (XP). As your XP grows, your Rebuilder Corps rank increases from Recruit through Technician, Engineer, Specialist, Architect, and ultimately Commander.\n\nEvery lesson you complete contributes to a CDACC-recognised competency unit and maps to a real industry certification (CompTIA Security+, LPIC-1, CDACC ICT Technician Level 5). The Civilization Map is not just a game — it is your career roadmap.",
  briefingSw:
    'MISSION BRIEFING: Kila nodi katika Ramani ya Ustaarabu ni ujuzi halisi. Kila ujuzi unaofungua unawasha sehemu ya Afrika Mashariki. Majukumu yako yanalingana na vitengo vya CDACC na vyeti vya tasnia kama CompTIA Security+.',
  estimatedMinutes: 8,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-42-q1',
      'What does a "Restored" node on the Civilization Map indicate?',
      [
        'You have watched the introduction video for that topic',
        'All lessons in that skill cluster are complete and the badge has been earned',
        'The node is available to start but not yet begun',
        'An instructor has manually approved your progress',
      ],
      'b',
      'Think about what full completion means on the map.',
      'A Restored node means every lesson is complete and the associated competency badge has been awarded. It contributes to your CDACC unit portfolio and certification readiness percentage.'
    ),
    matchPairs(
      'r000-42-match',
      'Match each Rebuilder Corps rank to its XP threshold.',
      [
        { leftId: 'recruit',   left: 'Recruit',    rightId: 'xp-0',     right: '0 – 499 XP' },
        { leftId: 'tech',      left: 'Technician', rightId: 'xp-500',   right: '500 – 1,499 XP' },
        { leftId: 'engineer',  left: 'Engineer',   rightId: 'xp-1500',  right: '1,500 – 3,999 XP' },
        { leftId: 'commander', left: 'Commander',  rightId: 'xp-15000', right: '15,000+ XP' },
      ],
      'Higher ranks require more XP — think about the progression.',
      'Corps ranks reflect real skill depth: Recruit starts at 0 XP, Technician at 500, Engineer at 1,500, and Commander requires 15,000+ XP — equivalent to mastering multiple full certification paths.'
    ),
    fillBlank(
      'r000-42-q3',
      'The CyberLearn skill path "Cybersecurity Practitioner" maps to the ___ Security+ certification exam code.',
      'SY0-701',
      'It is the current CompTIA Security+ exam version.',
      'CompTIA Security+ SY0-701 covers five domains: General Security Concepts, Threats & Vulnerabilities, Security Architecture, Security Operations, and Program Management. The CyberLearn Cybersecurity Practitioner path follows this structure exactly.'
    ),
    scenario(
      'r000-42-q4',
      'You complete a node labelled "Linux Essentials" on the Civilization Map. Which real-world outcomes does this unlock?',
      [
        'Only a game badge with no real-world value',
        'Progress toward CDACC ICT Technician Level 5 unit CR/6/5 and LPIC-1 certification readiness',
        'Automatic registration for a CDACC exam',
        'Access to a paid subscription tier',
      ],
      'b',
      'Every CyberLearn node maps to something real.',
      'Linux Essentials completion maps to CDACC unit IT/CU/ICT/CR/6/5 (Manage Operating System) and contributes to LPIC-1 exam readiness. CyberLearn certificates are designed to be verifiable proof of learning for employers and academic institutions.'
    ),
  ],
});

export const rebuild000_4_3 = makeLesson({
  id: 'rebuild-000-4-3',
  courseId: 'the-rebuild-protocol',
  title: 'Setting Your Learning Goal',
  titleSw: 'Kuweka Lengo Lako la Kujifunza',
  briefing:
    "MISSION BRIEFING: The Corps does not assign missions. You choose them. But the data is clear: learners who set specific goals complete 3x more content than those who do not.\n\nThe most effective learning goals are specific and time-bound: not 'learn cybersecurity' but 'complete the Digital Safety 101 node by the end of this week — 20 minutes a day, 5 days.' CyberLearn's daily goal system lets you set 5, 10, 15, or 20 minutes per day. You choose. The platform adapts the review schedule to your pace.\n\nThe Rebuilder Corps uses streaks to track consistency: each day you complete at least one lesson counts as an active day. Missing a day resets your streak — but you have 2 streak freeze tokens per month for emergencies. Consistency beats intensity: 15 minutes every day outperforms a 3-hour session once a week for long-term retention.\n\nRight now: decide your daily goal. Enter it in the app. Your first mission briefing will be calibrated to that pace.",
  briefingSw:
    'MISSION BRIEFING: Kikosi hachagui misheni yako — unachagua wewe mwenyewe. Kujifunza dakika 15 kila siku ni bora kuliko saa 3 mara moja kwa wiki. Weka lengo lako sasa hivi.',
  estimatedMinutes: 6,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-43-q1',
      'Research on learning shows that which approach leads to the best long-term retention?',
      [
        'One intensive 4-hour study session per week',
        'Short, consistent daily practice sessions (10–20 minutes)',
        'Reading the entire syllabus once before the exam',
        'Watching video lectures without pausing',
      ],
      'b',
      'Think about how muscles are built — not in one session.',
      "Spaced repetition and consistent daily practice are proven to create stronger long-term memory than cramming. CyberLearn's FSRS engine schedules review cards based on your individual forgetting curve — daily sessions let it work effectively."
    ),
    fillBlank(
      'r000-43-q2',
      'CyberLearn gives you ___ streak freeze tokens per month to protect your streak when life gets in the way.',
      '2',
      'It is a small number — meant for emergencies, not regular use.',
      'Two streak freezes per month prevent anxiety about missing a day during travel, illness, or emergencies. They are not for skipping — the streak system rewards genuine daily engagement.'
    ),
    scenario(
      'r000-43-q3',
      'You want to pass the CompTIA Security+ exam in 6 months. You can study for 20 minutes per day. Which CyberLearn strategy best fits your goal?',
      [
        'Complete every lesson on every path regardless of relevance to Security+',
        'Focus on the Cybersecurity Practitioner path in order, doing daily 20-minute sessions, and use review sessions to reinforce weak areas',
        'Only do CTF challenges because they are more fun',
        'Study for 3 hours every Sunday to cover the same total time',
      ],
      'b',
      'Focused, consistent, path-aligned study beats scattered or batched approaches.',
      'The Cybersecurity Practitioner path directly maps to Security+ SY0-701 domains. Daily 20-minute sessions with spaced repetition review gives you 70 hours over 6 months — comparable to a structured exam prep course, with better retention than weekend cramming.'
    ),
    mcq(
      'r000-43-q4',
      'What does the CyberLearn FSRS engine do for you automatically?',
      [
        'Chooses which lessons you must complete in a fixed order',
        'Schedules personalised review sessions based on when you are likely to forget each concept',
        'Sends reminders to your phone every hour',
        'Assigns you a tutor from the Rebuilder Corps',
      ],
      'b',
      'It watches your memory, not your schedule.',
      "FSRS-4.5 (Free Spaced Repetition Scheduler) tracks each concept's stability and difficulty for you individually. It calculates exactly when to show you a review card to catch it just before you would forget — maximising retention per minute of study time."
    ),
  ],
});

// ─── Lesson 4.4: rebuild-000-4-4 ─────────────────────────────────────────────

export const rebuild000_4_4 = makeLesson({
  id: 'rebuild-000-4-4',
  courseId: 'the-rebuild-protocol',
  title: 'Your First Mission Briefing',
  titleSw: 'Muongozo Wako wa Misheni ya Kwanza',
  briefing:
    'MISSION BRIEFING: Recruit, you have completed the foundational theory. The four sectors of the Civilization Map now await your deployment.\n\n' +
    'Upon passing the Initiate Assessment, you will select your primary specialization track:\n\n' +
    'Track 1 — TVET ICT Technician: Aligned with Kenya CDACC Level 5 curriculum. Master electrical workshop safety, computer hardware diagnostics, operating systems administration, local area networking, and database systems. You restore the physical and operational hardware of our cities.\n\n' +
    'Track 2 — Cybersecurity Practitioner: Aligned with CompTIA Security+ SY0-701 and LPIC-1. Master Linux system commands, threat mitigation, security architecture, network perimeter defense, and digital forensics. You defend our institutions against adversaries.\n\n' +
    'Track 3 — Renewable Energy & Hardware Trades: Solar installation, electrical wiring, off-grid telemetry, and electronics repair. You ensure the power grid never fails again.\n\n' +
    'Review your notes. Ensure you understand the five infrastructure layers, attack phases, password hygiene, phishing indicators, 2FA, and the 3-2-1 backup rule. The Initiate Assessment is the final gate.',
  briefingSw:
    'MISSION BRIEFING: Umemaliza mafunzo ya msingi. Baada ya tathmini hii, utachagua mkondo wako wa utaalamu:\n' +
    '1. Fundi wa ICT wa TVET (CDACC Level 5),\n' +
    '2. Mtaalamu wa Usalama wa Mtandao (Security+ SY0-701),\n' +
    '3. Nishati Jadidifu na Vifaa vya Umeme.\n\nJitayarishe kwa Tathmini ya Mwanajeshi Mpya.',
  estimatedMinutes: 6,
  examDomain: 'Digital Citizenship',
  exercises: [
    mcq(
      'r000-44-q1',
      'Which track should you select if your primary goal is passing the CompTIA Security+ SY0-701 certification and learning ethical cyber defense?',
      [
        'Carpentry & Joinery',
        'Cybersecurity Practitioner',
        'Plumbing Technology',
        'Office Secretarial Studies',
      ],
      'b',
      'Select the specialized security track.',
      'The Cybersecurity Practitioner track aligns with all five CompTIA Security+ SY0-701 domains, LPIC-1 Linux fundamentals, and Kenya cyber law.'
    ),
    matchPairs(
      'r000-44-match',
      'Match each specialization track to its primary certification focus.',
      [
        { leftId: 'tvet', left: 'TVET ICT Technician', rightId: 'cert-cdacc', right: 'CDACC ICT Technician Level 5 (CR/1–6/5)' },
        { leftId: 'cyber', left: 'Cybersecurity Practitioner', rightId: 'cert-secplus', right: 'CompTIA Security+ SY0-701 & LPIC-1' },
        { leftId: 'energy', left: 'Renewable Energy & Solar', rightId: 'cert-epra', right: 'EPRA Solar Technician Certification' },
      ],
      'Match the study pathway to its accredited industry certification.',
      'Every CyberLearn path leads directly to accredited vocational or industry certifications recognized by employers.'
    ),
    fillBlank(
      'r000-44-q3',
      'When you pass the Capstone Initiate Assessment with a score of 70% or higher, you earn the "Rebuilder Initiate" portable digital badge compatible with the OpenBadges ___ standard.',
      'v3',
      'The current version of the W3C / 1EdTech Open Badges standard.',
      'OpenBadges v3 credentials are cryptographically verifiable records that you can display on LinkedIn, digital portfolios, or CVs.'
    ),
    scenario(
      'r000-44-q4',
      'You are about to begin the Initiate Assessment. It contains 15 questions covering all four units and requires 70% to pass. What happens if you score 60% on your first attempt?',
      [
        'Your account is permanently locked',
        'You receive a targeted feedback report identifying which units to review, and you can retake the assessment without penalty',
        'You must pay a monetary fine in M-Pesa to unlock it',
        'You are disqualified from taking any other course',
      ],
      'b',
      'CyberLearn uses formative, supportive assessment.',
      'Assessment in the Rebuilder Corps is diagnostic and supportive. You are given clear feedback on your weak domains and can revisit the material to re-attempt until you achieve mastery.'
    ),
  ],
});

// ── Capstone: The Initiate Assessment ────────────────────────────────────────

export const rebuild000_capstone = makeLesson({
  id: 'rebuild-000-capstone',
  courseId: 'the-rebuild-protocol',
  title: 'The Initiate Assessment',
  titleSw: 'Tathmini ya Mwanajeshi Mpya',
  briefing:
    'MISSION BRIEFING: This is your final evaluation before the Corps certifies you as a Rebuilder Initiate. Answer 15 questions drawn from all four units. Score 70% or above to earn your badge and unlock the full Civilization Map.\n\nThe Corps believes in honest assessment. If you score below 70%, you will receive a personalised report showing which units to revisit — and you can retake the assessment immediately. There is no penalty for retaking. Knowledge, not speed, is the mission.',
  briefingSw:
    'MISSION BRIEFING: Hii ni tathmini yako ya mwisho. Jibu maswali 15 kutoka vitengo vyote vinne. Pata 70% au zaidi ili kupata beji ya Mwanajeshi Mpya na kufungua Ramani ya Ustaarabu yote.',
  estimatedMinutes: 30,
  examDomain: 'Digital Citizenship · REBUILD-000 Capstone',
  exercises: [
    mcq(
      'r000-cap-q1',
      'Which of the five digital infrastructure layers is the foundation that all others depend on?',
      ['Communications', 'Compute', 'Power', 'Applications'],
      'c',
      'Without this, nothing else runs.',
      'Power (electricity) is the foundation. Without it, communications hardware, servers, databases, and applications all go offline.'
    ),
    fillBlank(
      'r000-cap-q2',
      'The 2021 Colonial Pipeline attack began with a single ___ credential found in a previous data breach.',
      'leaked',
      'It was not a sophisticated zero-day — just an old password.',
      'One recycled password gave attackers access to the pipeline network. This demonstrates why unique passwords and credential monitoring are non-negotiable.'
    ),
    mcq(
      'r000-cap-q3',
      'A zero-day vulnerability is dangerous primarily because:',
      [
        'It requires physical access to exploit',
        'It is unknown to the vendor so no patch exists yet',
        'It only affects older operating systems',
        'It is too complex for most attackers to use',
      ],
      'b',
      'The name hints at the timeline.',
      'Zero-day means zero days since the vendor knew about it — no patch exists. Defenders must rely on containment and monitoring rather than patching.'
    ),
    mcq(
      'r000-cap-q4',
      'An attacker has gained access to a network and installs a hidden process that connects to an external server every 30 minutes. Which attack phase does this represent?',
      ['Reconnaissance', 'Initial Access', 'Persistence', 'Impact'],
      'c',
      'The attacker is ensuring they can return even if the entry point is closed.',
      'Persistence involves backdoors, scheduled tasks, or modified startup services — so attackers retain control even after the original vulnerability is patched.'
    ),
    scenario(
      'r000-cap-q5',
      'Your security monitoring shows a user account that logged in at 02:00 from an unfamiliar country, accessed the HR database, and downloaded 500MB of files. The user has never worked night shifts. What is the most likely explanation and correct first response?',
      [
        'Routine backup — no action needed',
        'Compromised credentials — immediately disable the account, preserve logs, and notify the security team',
        'VPN anomaly — send the user an email asking about it',
        'Hardware failure — restart the database server',
      ],
      'b',
      'Anomalous access + sensitive data + unusual hours = likely compromise.',
      'Immediate containment (disable account) before investigation prevents further data exfiltration. Preserve logs for forensics — do not restart systems as this may destroy evidence.'
    ),
    mcq(
      'r000-cap-q6',
      'You use the same strong 20-character password on 10 different websites. One website is breached. How many of your accounts are now at risk?',
      ['Only the breached website account', '2 or 3 accounts', 'All 10 accounts', 'None — 20 characters is unbreakable'],
      'c',
      'Reuse means one breach = all breached.',
      'Credential stuffing attacks try a breached password against every other service automatically. All 10 accounts sharing that password are immediately at risk — regardless of the password strength.'
    ),
    fillBlank(
      'r000-cap-q7',
      'An SMS message claiming to be from your bank asks you to "confirm your identity" by replying with your OTP. This is a ___ attack.',
      'phishing',
      'It is trying to fish for your one-time code.',
      'SMS phishing (smishing) tricks victims into handing over OTP codes in real time. Legitimate banks never request OTPs via SMS reply.'
    ),
    mcq(
      'r000-cap-q8',
      'Which 2FA method is most resistant to SIM-swap attacks?',
      [
        'SMS one-time password',
        'Email one-time password',
        'Authenticator app (TOTP)',
        'Hardware security key (YubiKey)',
      ],
      'd',
      'This method requires physical possession of a device — impossible to SIM-swap.',
      'Hardware security keys use asymmetric cryptography and require physical presence. They are also phishing-resistant because they cryptographically verify the website domain before signing.'
    ),
    scenario(
      'r000-cap-q9',
      'A colleague receives an email from "kcb-secure@kcb-bank-alerts.co" asking them to click a link and verify their account to avoid suspension. The link goes to "secure-kcb.verify-now.net". What should they do?',
      [
        'Click the link — the email mentions KCB and looks official',
        'Do not click — report the email as phishing and verify directly via the official KCB app or published number',
        'Reply to the email asking for more information',
        'Forward it to friends to warn them before deleting',
      ],
      'b',
      'Check the sender domain and the link domain — neither matches kcb.co.ke.',
      'The sender domain (kcb-bank-alerts.co) and link domain (secure-kcb.verify-now.net) are lookalike domains. Report, do not click, verify through official channels only.'
    ),
    mcq(
      'r000-cap-q10',
      'What does achieving the "Engineer" rank in the Rebuilder Corps indicate?',
      [
        'You have completed exactly 10 lessons',
        'You have earned 1,500 – 3,999 XP across multiple skill nodes',
        'You have passed a CompTIA exam',
        'An instructor has manually promoted you',
      ],
      'b',
      'Ranks are XP-based, not lesson-count-based.',
      'Engineer rank (1,500–3,999 XP) reflects meaningful depth across multiple skill areas. It is earned through consistent lesson completion and review sessions.'
    ),
    mcq(
      'r000-cap-q11',
      'Why does CyberLearn use the FSRS-4.5 spaced repetition algorithm for review sessions?',
      [
        'It is the fastest algorithm available',
        'It schedules each review card at the optimal moment just before you would forget it, maximising retention per hour of study',
        'It randomly selects cards to keep learners surprised',
        'It focuses only on cards you have already mastered',
      ],
      'b',
      'The algorithm watches your personal forgetting curve.',
      'FSRS tracks stability, difficulty, and due date per learner per concept. By scheduling review at the moment of near-forgetting, it achieves the same retention as cramming with a fraction of the study time.'
    ),
    scenario(
      'r000-cap-q12',
      'Your security monitoring shows a threat actor conducting reconnaissance against Nairobi hospital networks — collecting staff email addresses from LinkedIn and the hospital website. Which defensive action is MOST effective at this stage?',
      [
        'Shut down all hospital websites immediately',
        'Remove staff names and roles from public websites, train staff to recognise spear-phishing, and enable 2FA on all email accounts',
        'Wait until an actual attack occurs before responding',
        'Change all passwords to the same strong password across all systems',
      ],
      'b',
      'Reconnaissance is the first phase — you can make it harder and prepare for the likely next step (spear-phishing).',
      'Reducing the reconnaissance yield, preparing staff for the expected phishing phase, and strengthening authentication are all high-impact, low-cost defences that directly counter the observed threat pattern.'
    ),
    fillBlank(
      'r000-cap-q13',
      'The four phases of a cyberattack in order are: Reconnaissance, Initial Access, ___, and Impact.',
      'Persistence',
      'The third phase ensures the attacker can return.',
      'Persistence is when attackers install backdoors or create rogue admin accounts to maintain access — even after the initial vulnerability is patched.'
    ),
    mcq(
      'r000-cap-q14',
      'Which of these is the STRONGEST password for a Rebuilder Corps system account?',
      [
        'Rebuild2031!',
        'P@$$w0rd99',
        'Corps-Maize-Satellite-Thunder-2031',
        'qwerty12345678',
      ],
      'c',
      'Length from random words beats short complexity.',
      '"Corps-Maize-Satellite-Thunder-2031" is 36 characters using random words. Even at a trillion guesses per second, it would take astronomically longer to crack than any short complex password.'
    ),
    scenario(
      'r000-cap-q15',
      'You are assigned to secure a newly restored community health clinic network with shared passwords, no 2FA, unpatched router from 2019, and staff using personal phones for work email. Rank the actions by PRIORITY (first action first).',
      [
        'Update router firmware → enforce unique passwords → enable 2FA on email → establish BYOD policy',
        'Establish BYOD policy → update router firmware → enable 2FA → enforce unique passwords',
        'Enable 2FA on email → enforce unique passwords → update router firmware → establish BYOD policy',
        'All actions have equal priority and should be done simultaneously',
      ],
      'a',
      'Fix the perimeter first, then authentication, then policy.',
      'An unpatched 2019 router has known critical vulnerabilities — it is the biggest external exposure. Unique passwords prevent credential stuffing. 2FA stops attackers who obtain a password. BYOD policy governance takes longest to enforce and comes last.'
    ),
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// Module export — all lessons in curriculum order
// ─────────────────────────────────────────────────────────────────────────────

export const rebuildProtocolLessons: Lesson[] = [
  rebuild000_1_1,
  rebuild000_1_2,
  rebuild000_1_3,
  rebuild000_2_1,
  rebuild000_2_2,
  rebuild000_2_3,
  rebuild000_3_1,
  rebuild000_3_2,
  rebuild000_3_3,
  rebuild000_3_4,
  rebuild000_3_5,
  rebuild000_4_1,
  rebuild000_4_2,
  rebuild000_4_3,
  rebuild000_4_4,
  rebuild000_capstone,
];
