import { weekLesson } from './helpers';

const d1 = 'CompTIA Security+ SY0-701 Domain 1 — General Security Concepts (12%)';
const d2 = 'CompTIA Security+ SY0-701 Domain 2 — Threats, Vulnerabilities, and Mitigations (22%)';
const d3 = 'CompTIA Security+ SY0-701 Domain 3 — Security Architecture (18%)';
const d4 = 'CompTIA Security+ SY0-701 Domain 4 — Security Operations (28%)';
const d5 = 'CompTIA Security+ SY0-701 Domain 5 — Security Program Management (20%)';

export const cyberD1W1 = weekLesson({
  id: 'cyber-sy0701-d1-w1',
  courseId: 'secplus-concepts',
  title: 'Week 1 — CIA, AAA, Zero Trust, and control types',
  titleSw: 'Wiki 1 — CIA, AAA, Zero Trust, na aina za udhibiti',
  examDomain: d1,
  minutes: 32,
  media: [{ kind: 'animation', preset: 'pulse', caption: 'Zero Trust: never assume the LAN is friendly.' }],
  briefing:
    'Security+ SY0-701 Domain 1 is 12% of the exam but it is the vocabulary for the whole semester. Confidentiality is authorised eyes only (encryption, least privilege). Integrity is authorised change only (hashes, signed firmware, backups that detect tampering). Availability is usable when needed (redundancy, backups, DDoS defence). Non-repudiation means a sender cannot credibly deny a signed action. If you mix confidentiality with integrity in a scenario, you lose easy marks.\n\nAAA is authentication (who), authorisation (what they may do), accounting (what they did). You authenticate people (password, passkey, biometrics) and systems (certificates, machine identity). Authorisation models include RBAC, ABAC, MAC, and DAC — Kenyan colleges usually run RBAC (role = registrar, lecturer, student). Gap analysis compares current controls with a required baseline (ISO, CBK, or campus policy).\n\nZero Trust assumes breach: the control plane (policy engine, policy administrator, adaptive identity, threat-scope reduction) decides; the data plane (policy enforcement point, implicit trust zones) enforces. There is no “inside the LAN therefore trusted”. A student laptop on Wi-Fi is a subject that still needs policy. Physical security remains in 1.2: bollards, access-control vestibules, fences, guards, badges, lighting, and sensors (IR, pressure, microwave, ultrasonic). Deception: honeypot, honeynet, honeyfile, honeytoken.\n\nControl types you must classify: preventive, deterrent, detective, corrective, compensating, directive — and technical, managerial, operational, physical categories. A CCTV that nobody watches is a weak detective control. A locked server cage is physical preventive. Write examples from campus: turnstiles, AUPs, MFA on webmail.',
  briefingSw:
    'CIA: siri, uadilifu, upatikanaji. AAA: thibitisha, ruhusu, kumbuka. Zero Trust: usiamini LAN. RBAC ni majukumu. Honeypot ni udanganyifu. Dhibiti: preventive, detective, physical.',
  pairs: [
    { leftId: 'c', left: 'Confidentiality', rightId: 'eyes', right: 'Only authorised disclosure' },
    { leftId: 'i', left: 'Integrity', rightId: 'change', right: 'Only authorised modification' },
    { leftId: 'a', left: 'Availability', rightId: 'up', right: 'Systems usable when needed' },
    { leftId: 'n', left: 'Non-repudiation', rightId: 'deny', right: 'Cannot credibly deny an action' },
  ],
  pairPrompt: 'Match each SY0-701 security property to its meaning.',
  pairHint: 'CIA plus non-repudiation.',
  pairExplanation: 'These are objective 1.2 terms. Do not swap integrity and confidentiality.',
  questions: [
    {
      prompt: 'A hashed payroll file shows a changed digest after the weekend. Which CIA property is in question?',
      options: ['Confidentiality only', 'Integrity', 'Availability of the canteen', 'Non-repudiation of a badge colour'],
      correct: 'b',
      hint: 'Unauthorised change.',
      explanation: 'Hash mismatch is integrity. Confidentiality would be leakage; availability would be downtime.',
    },
    {
      prompt: 'RBAC authorises a user based on:',
      options: ['Random daily tokens only', 'Assigned role (set of permissions)', 'The colour of the Ethernet cable', 'Ohm’s law'],
      correct: 'b',
      hint: 'Role.',
      explanation: 'ABAC uses attributes; MAC uses labels; DAC uses owner discretion.',
    },
    {
      prompt: 'A honeytoken is:',
      options: [
        'A production student password',
        'A decoy secret that should never be used — access to it signals an attacker',
        'A type of firewall',
        'A Kenyan tax form'],
      correct: 'b',
      hint: 'Deception technology.',
      explanation: 'Honeypot is a system; honeyfile is a file; honeytoken is a credential/record.',
    },
    {
      prompt: 'In Zero Trust, the Policy Enforcement Point sits on the:',
      options: ['Control plane only as a slogan', 'Data plane, enforcing decisions from the policy engine', 'Printer spooler', 'HDMI cable'],
      correct: 'b',
      hint: '1.2 split control vs data plane.',
      explanation: 'Policy engine decides; PEP enforces. Implicit trust zones are minimised.',
    },
  ],
  blanks: [
    {
      prompt: 'Authentication, authorisation, and accounting together are abbreviated ___.',
      answer: 'AAA',
      hint: 'Triple A.',
      explanation: 'You can have authentication without authorisation (logged in but denied the share).',
    },
  ],
  practice: {
    prompt: 'Finance Wi-Fi is “trusted” because it is inside the building; guest IoT cameras sit on the same VLAN. Zero Trust response?',
    options: [
      'Leave it — buildings are trusted',
      'Segment, identify every subject, and enforce policy; cameras are not finance users',
      'Hang a honeypot poster and stop',
      'Disable CIA'],
    correct: 'b',
    hint: 'Threat-scope reduction.',
    explanation: 'Same building is not a trust zone. That is the point of Domain 1.',
  },
});

export const cyberD1W2 = weekLesson({
  id: 'cyber-sy0701-d1-w2',
  courseId: 'secplus-concepts',
  title: 'Week 2 — Change management and security impact',
  titleSw: 'Wiki 2 — Usimamizi wa mabadiliko',
  examDomain: d1,
  minutes: 28,
  briefing:
    'Objective 1.3: explain why change management exists. Untracked changes are how “who opened RDP” happens. Business process: request, approval, ownership, stakeholders, impact analysis, test results, backout plan, maintenance window, and SOP. A campus firewall rule at 10 a.m. on a registration day without a window is an availability incident waiting to happen.\n\nTechnical implications: allow lists and deny lists, restricted activities, downtime, service/application restart, legacy applications, and dependencies. Updating a TLS certificate may restart a web server — say so in the change ticket. Documentation: update diagrams and policies. Version control for firewall configs and scripts is part of the objective, not a developer hobby.\n\nKenyan polytechnic translation: the ICT officer who “just changed DNS” without a ticket violates this even if it worked. Security+ will give you a scenario where a change caused an outage because there was no backout. The answer is almost never “try another random change”.\n\nArtefact this week: a change request for enabling WPA3 on student Wi-Fi — impact, test (one AP first), backout (restore WPA2-Enterprise), window (Sunday 05:00), and who approves.',
  briefingSw:
    'Ombi, idhini, uchambuzi wa athari, majaribio, mpango wa kurejesha, dirisha la matengenezo. Sasisha michoro. Version control. Usibadilishe DNS kimya.',
  questions: [
    {
      prompt: 'A backout plan is used when:',
      options: [
        'The change succeeds and you celebrate only',
        'The change fails or causes harm and you restore the last known good state',
        'You fire the SOC',
        'You disable logging'],
      correct: 'b',
      hint: 'Undo.',
      explanation: 'No backout = gambling with availability.',
    },
    {
      prompt: 'Allow lists / deny lists during a change are:',
      options: ['Irrelevant slogans', 'Technical implications that may block or permit traffic/apps', 'Physical bollards', 'Honeytokens'],
      correct: 'b',
      hint: '1.3 technical implications.',
      explanation: 'A new deny list can break the MIS. Impact-analyse it.',
    },
    {
      prompt: 'The best time to restart a student records server is usually:',
      options: ['Peak registration without notice', 'An agreed maintenance window with stakeholders told', 'During the exam as a surprise', 'Never, even for patches'],
      correct: 'b',
      hint: 'Window.',
      explanation: 'Availability is a CIA pillar. Windows exist to protect it.',
    },
    {
      prompt: 'After a network change, diagrams should be:',
      options: ['Left stale', 'Updated so the next incident responder is not flying blind', 'Deleted for secrecy', 'Printed in Comic Sans only'],
      correct: 'b',
      hint: 'Documentation.',
      explanation: 'Objective 1.3 lists updating diagrams and policies.',
    },
  ],
  blanks: [
    {
      prompt: 'The scheduled period when a disruptive change is allowed is a maintenance ___.',
      answer: 'window',
      hint: 'Not a GUI window.',
      explanation: 'Changes outside the window need emergency process, not silence.',
    },
  ],
  practice: {
    prompt: 'A technician patches the core switch at 11:00 on a Monday; registration dies; nobody can reverse the IOS upgrade. Missing 1.3 item?',
    options: [
      'A honeypot',
      'Approved window, test, and backout image/plan',
      'More bollards',
      'AAA colour scheme'],
    correct: 'b',
    hint: 'Change management.',
    explanation: 'This is a Domain 1 operational failure, not a missing firewall brand.',
  },
});

export const cyberD1W3 = weekLesson({
  id: 'cyber-sy0701-d1-w3',
  courseId: 'secplus-concepts',
  title: 'Week 3 — Cryptography, PKI, and when to use which control',
  titleSw: 'Wiki 3 — Kriptografia na PKI',
  examDomain: d1,
  minutes: 35,
  briefing:
    'Objective 1.4: appropriate cryptographic solutions. Symmetric (same key, fast, AES) versus asymmetric (key pair, RSA/ECC, for exchange and signatures). Key exchange (Diffie–Hellman and modern variants) lets you agree a session key. Hashing is one-way integrity (SHA-256); salting defends password files; stretching (PBKDF2, bcrypt, scrypt, Argon2) slows guessing. Digital signatures need hashing plus the sender’s private key. Encryption levels: full disk, partition, file, volume, database, record, and transport (TLS).\n\nPKI: public/private keys, CAs, root of trust, CSR, certificates, wildcards, self-signed versus public CA, CRL and OCSP for revocation, key escrow. Tools: TPM (on the motherboard), HSM (appliance), KMS, secure enclave. Obfuscation is not encryption: steganography, tokenization, masking. Blockchain/open ledgers appear as integrity/timestamp use cases — not a substitute for access control on the MIS.\n\nKenyan practice: HTTPS on student portals, disk encryption on laptops that leave campus, signed mail for finance, and M-Pesa PIN never stored as unsalted MD5. Self-signed certs on public portals train users to click through warnings — that is a program-management failure as well as crypto misuse.\n\nExam trap: hashing is not encryption; you cannot decrypt a hash. Confidentiality of a file in transit is TLS or a file cipher, not SHA. Integrity of a download is a published hash or a signature.',
  briefingSw:
    'AES ni symmetric; RSA/ECC ni asymmetric. Hash ni one-way; salt na stretching kwa nywila. TLS ni usafiri. CA, CSR, CRL/OCSP. TPM/HSM. Hash si encryption.',
  questions: [
    {
      prompt: 'Which provides confidentiality for a file sitting on a stolen laptop?',
      options: ['A SHA-256 hash of the file name', 'Full-disk or volume encryption with a strong key', 'A honeytoken', 'Open SSID'],
      correct: 'b',
      hint: 'Encryption level: full disk.',
      explanation: 'Hashes detect change; they do not hide contents.',
    },
    {
      prompt: 'OCSP is used to:',
      options: ['Encrypt RAM', 'Check whether a certificate has been revoked, online', 'Replace AES', 'Assign IPv6'],
      correct: 'b',
      hint: 'Revocation.',
      explanation: 'CRL is a list; OCSP is a live query. Both are PKI.',
    },
    {
      prompt: 'A salt in a password database:',
      options: [
        'Makes two identical passwords hash differently and slows precomputed tables',
        'Decrypts AES',
        'Is a type of firewall',
        'Replaces MFA'],
      correct: 'a',
      hint: 'Store unique salts per user.',
      explanation: 'Stretching adds CPU cost. MFA is a second factor — still use it.',
    },
    {
      prompt: 'A TPM is typically:',
      options: ['A cloud invoice', 'A hardware chip bound to the device for keys/secure boot', 'A student password', 'A topology'],
      correct: 'b',
      hint: 'Hardware root.',
      explanation: 'HSM is a dedicated module/appliance; TPM is onboard.',
    },
  ],
  blanks: [
    {
      prompt: 'The request a system sends to a CA to obtain a certificate is a ___.',
      answer: 'CSR',
      hint: 'Certificate signing request.',
      explanation: 'You generate a key pair, send the CSR, receive the cert. Protect the private key.',
    },
  ],
  practice: {
    prompt: 'Portal uses HTTP and stores PINs as unsalted MD5. Which Domain 1 fixes are appropriate?',
      options: [
      'Add a CCTV only',
      'TLS in transit; modern salted stretched hashes (or a proper secret store); never MD5 for PINs',
      'Self-signed cert and tell users to ignore warnings forever',
      'Disable hashing because it is slow'],
    correct: 'b',
    hint: 'Transport plus stored secrets.',
    explanation: 'Wrong crypto is worse than no theatre. This is “appropriate cryptographic solutions”.',
  },
});

export const cyberD2W1 = weekLesson({
  id: 'cyber-sy0701-d2-w1',
  courseId: 'secplus-threats',
  title: 'Week 1 — Threat actors, motivations, and attack surfaces',
  titleSw: 'Wiki 1 — Washambuliaji na motisha',
  examDomain: d2,
  minutes: 32,
  briefing:
    'Domain 2 is 22% of SY0-701. Know actors: nation-state, unskilled attacker, hacktivist, insider (intentional and unintentional), organised crime, shadow IT, and competitor. Attributes: internal vs external, resources, level of sophistication, whether they are funded. Motivations: data exfiltration, espionage, service disruption, blackmail, financial gain, philosophical/political, revenge, chaos, war. In Kenya you will see financial (SIM-swap, M-Pesa social engineering), insider (fee clerk), and opportunistic unskilled attackers using leaked tools.\n\nTargets and surfaces: from the objectives — networks, infrastructure, applications, default credentials, open service ports, default configurations, open permissions, unsecure protocols, shared accounts, and human vectors. An open RDP on a polytechnic firewall is a surface. A default MikroTik password is a surface. WhatsApp “HR internship” is a human surface.\n\nSupply chain and third parties belong here too: vendor laptops, cloned Android APKs, and USB gifts. You cannot patch a threat actor; you reduce their surface and motive payoff.\n\nThis week: map three campus surfaces to likely actors. Example: guest Wi-Fi → unskilled / opportunistic; finance PC with USB → insider or crimeware; public WordPress → opportunistic scanners.',
  briefingSw:
    'Nation-state, insider, organised crime, hacktivist, unskilled. Motisha: pesa, upelelezi, kero. Nyuso: RDP wazi, nenosiri chaguomsingi, protocal dhaifu, WhatsApp. Punguza surface.',
  questions: [
    {
      prompt: 'An employee who emails a spreadsheet of students to a personal Gmail “to work at home” is:',
      options: ['A nation-state APT', 'An insider (often unintentional) data-exfil risk', 'A honeypot', 'A CA'],
      correct: 'b',
      hint: 'Inside the trust boundary.',
      explanation: 'Intentional insiders steal; unintentional ones bypass DLP with convenience.',
    },
    {
      prompt: 'Organised crime is most often motivated by:',
      options: ['Peer-reviewed science', 'Financial gain (ransomware, fraud)', 'Campus Wi-Fi aesthetics', 'Ohm’s law'],
      correct: 'b',
      hint: 'Money.',
      explanation: 'Nation-states may want espionage. Hacktivists want a message.',
    },
    {
      prompt: 'Default credentials on a new CCTV NVR are:',
      options: ['A compensating control', 'An attack surface / vulnerability to change at install', 'Required by PKI', 'A type of salt'],
      correct: 'b',
      hint: 'Objective 2.x surfaces.',
      explanation: 'Change them in the software-install and operations baselines.',
    },
    {
      prompt: 'Shadow IT is:',
      options: [
        'The SOC night shift',
        'Systems staff deploy outside approved IT — unpatched, unbacked, unmonitored',
        'A honeynet',
        'A hash algorithm'],
      correct: 'b',
      hint: 'Unknown assets.',
      explanation: 'You cannot defend what is not in the inventory. That is Domain 2 and 5 together.',
    },
  ],
  blanks: [
    {
      prompt: 'A politically motivated attacker who defaces a site to make a statement is a ___.',
      answer: 'hacktivist',
      hint: 'Hack + activist.',
      explanation: 'Different from crime (money) and nation-state (espionage/war).',
    },
  ],
  practice: {
    prompt: 'College WordPress on a public IP, admin/admin still valid, XML-RPC on. Most likely actor to hit first?',
    options: [
      'Only a nation-state with a custom implant',
      'Unskilled / opportunistic scanners and botnets using default creds and known CMS flaws',
      'The canteen',
      'TPM vendors'],
    correct: 'b',
    hint: 'Sophistication vs opportunity.',
    explanation: 'Internet-wide scanning does not need APT budgets. Close the surface.',
  },
});

export const cyberD2W2 = weekLesson({
  id: 'cyber-sy0701-d2-w2',
  courseId: 'secplus-threats',
  title: 'Week 2 — Malware, application attacks, and indicators',
  titleSw: 'Wiki 2 — Malware, mashambulizi ya programu, na dalili',
  examDomain: d2,
  minutes: 35,
  briefing:
    'Name the families: virus, worm, trojan, ransomware, logic bomb, rootkit, bloatware, spyware, keylogger, botnet/C2, RAT, cryptomalware. Delivery: phishing, USB, drive-by, email, SMS (smishing), voice (vishing), QR (quishing). Kenya: fake KRA/NHIF/Safaricom lures. Indicators: CPU, outbound beaconing, encrypted shares, disabled Defender, new admin users, impossible travel on mail.\n\nApplication and injection: SQL injection, XSS (reflected, stored, DOM), CSRF, directory traversal, buffer overflow, race conditions, integer overflow, insecure deserialization, SSRF. You already practised SQLi in web security; here you classify them as vulnerabilities versus the exploit in the wild. Password attacks: spraying, stuffing, brute force, rainbow (hence salts). Replay, session hijack, on-path (MITM), downgrade, DDoS, DNS poisoning, ARP spoofing, VLAN hopping, rogue AP, evil twin.\n\nPhysical: tailgating, dumpster diving, shoulder surfing, USB drop. Cryptographic attacks: downgrade, collision (old hashes), birthday, stealing keys from memory. AI-era items in current objectives: prompt injection and malicious AI-assisted social engineering — treat as emerging but examinable.\n\nLab mindset: you do not run ransomware samples on the production MIS. Indicators go to the SOC playbook (Domain 4). This week is recognition and classification for the exam and for first-line reporting.',
  briefingSw:
    'Ransomware, trojan, worm, keylogger, botnet. SQL injection, XSS, CSRF. Password spraying. Evil twin. Tailgating. Ripoti dalili; usiendeze sample kwenye MIS.',
  questions: [
    {
      prompt: 'A worm differs from a typical virus in that a worm:',
      options: ['Never spreads', 'Can self-propagate over the network without a host file', 'Is always a honeypot', 'Encrypts only TPM'],
      correct: 'b',
      hint: 'Standalone spread.',
      explanation: 'Viruses piggyback on files. Worms travel by themselves. Trojans pretend to be useful.',
    },
    {
      prompt: 'Credential stuffing uses:',
      options: ['Brand-new random guesses only', 'Leaked username/password pairs from other breaches', 'ICMP only', 'Bollards'],
      correct: 'b',
      hint: 'Reuse.',
      explanation: 'Spraying uses few common passwords across many accounts to avoid lockout.',
    },
    {
      prompt: 'Stored XSS is dangerous because:',
      options: [
        'It only affects the attacker',
        'Malicious script is saved on the server and runs in other users’ browsers',
        'It is a type of RAID',
        'It is physical only'],
      correct: 'b',
      hint: 'Persists.',
      explanation: 'Reflected XSS rides on a crafted URL. Output encoding and CSP mitigate.',
    },
    {
      prompt: 'An evil twin is:',
      options: ['A second TPM', 'A rogue AP impersonating a trusted SSID', 'A CA', 'A salt'],
      correct: 'b',
      hint: 'Wireless impersonation.',
      explanation: 'Users join “Campus_Free” and you on-path their traffic. Prefer 802.1X.',
    },
  ],
  blanks: [
    {
      prompt: 'Malware that encrypts files and demands payment is ___.',
      answer: 'ransomware',
      hint: 'Ransom.',
      explanation: 'Backups that are offline and tested are the mitigation that actually works.',
    },
  ],
  practice: {
    prompt: 'Helpdesk sees many failed logins for admin from 40 countries, then a success, then mass .encrypted files. Sequence?',
    options: [
      'Ignore — exams do that',
      'Password attack then ransomware — isolate, preserve logs, restore from offline backup, reset creds',
      'Buy more RAM only',
      'Disable backups so the attacker cannot find them'],
    correct: 'b',
    hint: 'Indicators chained.',
    explanation: 'Domain 2 names the attack; Domain 4 will run the incident. You must still recognise it.',
  },
});

export const cyberD2W3 = weekLesson({
  id: 'cyber-sy0701-d2-w3',
  courseId: 'secplus-threats',
  title: 'Week 3 — Vulnerability types and mitigations',
  titleSw: 'Wiki 3 — Udhaifu na hatua za kukabiliana',
  examDomain: d2,
  minutes: 32,
  briefing:
    'Vulnerabilities: hardware (firmware, unpatched BIOS, side channel), operating system, virtualisation, cloud, supply chain, cryptographic (obsolete TLS, weak ciphers), misconfiguration, zero-day, and human. CVSS scores help prioritise but context matters — a 9.8 on an air-gapped trainer laptop is not the same as a 9.8 on the public MIS. Patch, but also compensate when you cannot patch a lab instrument.\n\nMitigations in 2.5: segmentation, access control, encryption, monitoring, hardening/baselines, patching, secure SDLC, awareness, and isolation. Least privilege and disabling unused services close default-config surfaces. Application allow-listing beats endless antivirus theatre on a locked lab image. Isolation: VLAN, air-gap when the risk is real, sandbox for unknown files.\n\nCompensating control example: a vendor device that cannot be patched sits in a firewalled VLAN with no internet and jump-host access only. Document it (Domain 5). Do not hide it.\n\nWeek task: take five campus findings (open port, old TLS, shared admin, unencrypted backup disk, no MFA) and write the mitigation that is actually feasible this term.',
  briefingSw:
    'Udhaifu: firmware, OS, wingu, misconfig, zero-day, binadamu. CVSS. Mitigation: segmentation, patch, least privilege, encryption, awareness. Compensating control ikiwa huwezi kupatch.',
  questions: [
    {
      prompt: 'A zero-day is:',
      options: [
        'A patch released on Monday',
        'A vulnerability without a vendor fix available yet',
        'A type of honeypot',
        'Always CVSS 0.0'],
      correct: 'b',
      hint: 'No patch yet.',
      explanation: 'Mitigate with WAF, isolation, threat intel, and compensating controls.',
    },
    {
      prompt: 'The most appropriate mitigation for a public WordPress with unused XML-RPC is:',
      options: ['Paint the server', 'Disable the unused service / harden the baseline', 'Buy a bigger UPS only', 'Share the admin password more widely'],
      correct: 'b',
      hint: 'Attack surface reduction.',
      explanation: 'Hardening is a Domain 2 mitigation and a Domain 4 operations task.',
    },
    {
      prompt: 'Segmentation as a mitigation:',
      options: [
        'Puts finance and students on one flat LAN for simplicity',
        'Limits blast radius so ransomware in a lab VLAN is less likely to hit finance',
        'Replaces backups',
        'Is illegal under DPA'],
      correct: 'b',
      hint: 'Blast radius.',
      explanation: 'Zero Trust and architecture (Domain 3) implement this idea.',
    },
    {
      prompt: 'A compensating control is used when:',
      options: [
        'You already meet the requirement perfectly',
        'The primary control cannot be applied yet, so an alternative reduces risk',
        'You want to skip the exam',
        'CIA is repealed'],
      correct: 'b',
      hint: 'Alternative.',
      explanation: 'Document residual risk. Compensating is also a Domain 1 control type.',
    },
  ],
  blanks: [
    {
      prompt: 'The industry score used to rank vulnerability severity is ___.',
      answer: 'CVSS',
      hint: 'Common Vulnerability Scoring System.',
      explanation: 'Prioritise internet-facing high CVSS first, then context.',
    },
  ],
  practice: {
    prompt: 'Lab CNC PC must run an unpatchable Win7 app. Best mitigation set?',
    options: [
      'Put it on the student Wi-Fi with a public IP',
      'Isolate VLAN/firewall, block internet, jump host, application allow-list, offline AV, documented exception',
      'Give every student the local admin password',
      'Hash the PLC with MD5 and hope'],
    correct: 'b',
    hint: 'Compensate.',
    explanation: 'That is how TVET workshops survive Domain 2 in the real world.',
  },
});

export const cyberD3W1 = weekLesson({
  id: 'cyber-sy0701-d3-w1',
  courseId: 'secplus-architecture',
  title: 'Week 1 — Architecture models, segmentation, and secure design',
  titleSw: 'Wiki 1 — Miundo, segmentation, na usanifu salama',
  examDomain: d3,
  minutes: 32,
  briefing:
    'Domain 3 (18%) is how you place controls in a system. Models: on-premises, cloud, hybrid, and infrastructure concepts such as centralised vs decentralised, containerisation, virtualisation, IoT/ICS, and serverless. A Kenyan polytechnic is usually hybrid: on-prem AD and file servers, cloud mail, SaaS MIS. Design principles: least privilege, defence in depth, fail securely, keep it simple, privacy by design, and secure defaults.\n\nSegmentation: VLANs, subnets, DMZ for public web, air-gaps for ICS/welding-bay PLCs if required, east-west filtering, and micro-segmentation in virtualisation. Screened subnet (DMZ) holds the public website; it must not be a shortcut into finance. Jump servers/bastion hosts for admin. Jumping from student Wi-Fi straight to the domain controller is an architecture fail.\n\nDevice placement: firewalls, sensors, WAF, load balancers, proxies, IDS/IPS, NAC. Fail-open versus fail-closed: a fail-open door lock may be a fire code requirement; a fail-open firewall is usually a security fail. Know which you were asked about.\n\nDraw this week: campus zones — students, staff, servers, guests, CCTV, and a DMZ. Label trust boundaries. That drawing is the architecture artefact.',
  briefingSw:
    'On-prem, wingu, hybrid. DMZ, VLAN, jump server. Defence in depth, least privilege. Firewall fail-closed. ICS ya warsha itengwe. Chora kanda za chuo.',
  questions: [
    {
      prompt: 'A public college website should typically sit in:',
      options: ['The same VLAN as payroll file shares', 'A screened subnet / DMZ with controlled paths inward', 'The welding bay air-gap', 'The printer cartridge'],
      correct: 'b',
      hint: 'DMZ.',
      explanation: 'Do not hairpin public traffic through the finance LAN.',
    },
    {
      prompt: 'Defence in depth means:',
      options: [
        'One expensive firewall and nothing else',
        'Overlapping controls so one failure does not end the CIA triad',
        'Deleting logs',
        'Open RDP'],
      correct: 'b',
      hint: 'Layers.',
      explanation: 'Identity + patch + backup + segment + monitor.',
    },
    {
      prompt: 'A bastion / jump host is used to:',
      options: ['Mine cryptocurrency', 'Broker admin access into a sensitive zone instead of exposing RDP to the world', 'Replace TLS', 'Store salts in a GIF'],
      correct: 'b',
      hint: 'Admin path.',
      explanation: 'Combine with MFA and session recording if you can.',
    },
    {
      prompt: 'ICS/OT on a welding robot should:',
      options: ['Browse the web as SYSTEM', 'Be segmented from the campus internet and student Wi-Fi', 'Use admin/admin', 'Share the MIS SQL port'],
      correct: 'b',
      hint: 'Air-gap or tightly firewalled.',
      explanation: 'TVET workshops are OT. Treat them as Domain 3 critical architecture.',
    },
  ],
  blanks: [
    {
      prompt: 'The isolated network zone for public-facing servers is often called a ___.',
      answer: 'DMZ',
      hint: 'Demilitarised zone / screened subnet.',
      explanation: 'SY0-701 still expects you to place services correctly.',
    },
  ],
  practice: {
    prompt: 'Architect: students, CCTV, and domain controllers share one /24 with no ACLs. First architecture fix?',
    options: [
      'Buy a new logo',
      'Segment VLANs/subnets and default-deny between roles; DCs not on student LAN',
      'Disable AAA',
      'Put a honeypot sticker on the switch'],
    correct: 'b',
    hint: 'Segmentation.',
    explanation: 'Flat networks turn every malware into a campus-wide event.',
  },
});

export const cyberD3W2 = weekLesson({
  id: 'cyber-sy0701-d3-w2',
  courseId: 'secplus-architecture',
  title: 'Week 2 — Cloud, virtualisation, and shared responsibility',
  titleSw: 'Wiki 2 — Wingu, virtualisation, na majukumu',
  examDomain: d3,
  minutes: 30,
  briefing:
    'Cloud models: IaaS, PaaS, SaaS, public/private/hybrid/community. Shared responsibility: the vendor secures the cloud; you secure what you put in it. SaaS mail: you still configure MFA and DLP. IaaS VM: you patch the guest OS. Misreading this is a classic fail. Kenya Data Protection Act still applies to student data in EU or US regions — know where the data sits and the contract.\n\nVirtualisation risks: VM escape, snapshot sprawl (sensitive memory on a datastore), stale templates with old patches, and management-plane exposure (vCenter/Hyper-V on the student LAN). Containers share a kernel — isolation is weaker than separate VMs. Serverless still has IAM keys. Infrastructure as code without secrets scanning leaks keys into Git.\n\nControls: cloud security groups as firewalls, private endpoints, customer-managed keys, CASB, and least-privilege IAM. Disable public S3-style buckets. Turn on provider logging (CloudTrail-like) and send it somewhere you actually watch.\n\nCampus example: Microsoft 365 is SaaS; a rented VPS for Moodle is IaaS. MFA on 365 is your job. Unpatched Moodle is your job.',
  briefingSw:
    'IaaS, PaaS, SaaS. Muuzaji hulinda wingu; wewe hulinda data na usanidi. MFA ni kazi yako. VM escape, snapshot, IAM. Usiachie ndoo ya umma. DPA bado inatumika.',
  questions: [
    {
      prompt: 'Under SaaS, the customer is usually still responsible for:',
      options: ['Physical datacenter cameras', 'Identity, access, data classification, and how users behave', 'Replacing failed disks in the provider’s rack', 'The hypervisor source code'],
      correct: 'b',
      hint: 'Shared responsibility.',
      explanation: 'Providers do not click MFA for your HODs.',
    },
    {
      prompt: 'A public object-storage bucket with student IDs is:',
      options: ['A good CDN trick', 'An architecture and DPA failure — close public access and review keys', 'Required for OCSP', 'A salt'],
      correct: 'b',
      hint: 'Misconfiguration.',
      explanation: 'Cloud misconfig is a Domain 2 vulnerability implemented in Domain 3.',
    },
    {
      prompt: 'VM snapshots may be a risk because they can contain:',
      options: ['Only wallpapers', 'Memory and disk secrets that are not wiped when you “delete” a VM casually', 'Bollards', 'HDMI EDID only'],
      correct: 'b',
      hint: 'Sprawl.',
      explanation: 'Treat snapshot stores as sensitive as backups.',
    },
    {
      prompt: 'IaaS differs from SaaS in that IaaS:',
      options: ['Removes all customer patching', 'Lets you run VMs/networks you must harden yourself', 'Is illegal in Kenya', 'Is only honeypots'],
      correct: 'b',
      hint: 'You get infrastructure.',
      explanation: 'PaaS is in the middle (runtime). SaaS is the finished app.',
    },
  ],
  blanks: [
    {
      prompt: 'The cloud service model where you rent virtual machines and networks is ___.',
      answer: 'IaaS',
      hint: 'Infrastructure as a Service.',
      explanation: 'IaaS / PaaS / SaaS is required vocabulary.',
    },
  ],
  practice: {
    prompt: 'Moodle on a VPS was left with port 22 open to 0.0.0.0/0 and password SSH. Whose responsibility?',
    options: [
      'Only the cloud vendor — they sold IaaS',
      'Yours: harden the guest, keys/MFA, security group restrict SSH, patch',
      'Students',
      'CompTIA'],
    correct: 'b',
    hint: 'IaaS customer.',
    explanation: 'Shared responsibility is the exam answer and the operational truth.',
  },
});

export const cyberD3W3 = weekLesson({
  id: 'cyber-sy0701-d3-w3',
  courseId: 'secplus-architecture',
  title: 'Week 3 — Resilience, backups, and data protection architecture',
  titleSw: 'Wiki 3 — Ustahimilivu, backup, na ulinzi wa data',
  examDomain: d3,
  minutes: 32,
  briefing:
    'Resilience: high availability, clustering, load balancing, UPS/generator, redundant ISPs, and geographic diversity. RTO is how fast you must be back; RPO is how much data you can lose. A college that backs up once a month has a 30-day RPO whether they admit it or not. RAID is availability of a disk, not a backup — ransomware encrypts the array too.\n\nBackups: full, incremental, differential, snapshots, and the 3-2-1 idea (three copies, two media, one off-site/offline). Test restores. Immutable / WORM backups defeat ransomware. Encrypt backup media — stolen tapes are a confidentiality incident. Power: UPS for clean shutdown; generator for long outages. Document the order of recovery: identity, DNS, MIS, then labs.\n\nData types: regulated (DPA personal data, exam integrity, health in the clinic), public, and intellectual property. Classification labels drive encryption and sharing. Data in use, in transit, at rest — different controls (TLS vs disk vs DLP). Retention and destruction: do not keep student IDs forever “just in case”.\n\nArchitecture diagram this week: where backups live, who can write, who can delete, and the offline copy. If the same domain admin can wipe production and backups, ransomware has won.',
  briefingSw:
    'RTO na RPO. RAID si backup. 3-2-1, offline, immutable. Ficha backup. UPS. Data at rest, in transit, in use. DPA: usihifadhi milele. Admin mmoja asifute production na backup.',
  questions: [
    {
      prompt: 'RPO measures:',
      options: ['How pretty the logo is', 'Maximum tolerable data loss (time since last good backup)', 'CPU temperature', 'Cable length'],
      correct: 'b',
      hint: 'Point in time.',
      explanation: 'RTO is downtime. RPO is data loss. Both belong in the DR plan.',
    },
    {
      prompt: 'RAID 1 mirrors disks. It is not a backup because:',
      options: [
        'Mirrors cannot fail',
        'Malware, fire, and accidental delete hit both sides; backups are independent copies',
        'RAID is illegal',
        'Mirrors skip CIA'],
      correct: 'b',
      hint: 'Independence.',
      explanation: 'Say this in every oral until it sticks.',
    },
    {
      prompt: 'An offline backup is valuable against ransomware because:',
      options: ['It is slower therefore safer always', 'The attacker cannot encrypt a copy that is not reachable', 'It uses MD5', 'It is a DMZ'],
      correct: 'b',
      hint: 'Air-gapped / detached.',
      explanation: 'Online-only sync folders get encrypted too.',
    },
    {
      prompt: 'Data in transit is primarily protected with:',
      options: ['A locked filing cabinet', 'TLS or a VPN', 'A bigger UPS', 'A honeytoken only'],
      correct: 'b',
      hint: 'Transport encryption.',
      explanation: 'At rest is disk/file/db encryption. In use may need confidential computing or just least privilege.',
    },
  ],
  blanks: [
    {
      prompt: 'The maximum acceptable downtime after a disaster is the ___.',
      answer: 'RTO',
      hint: 'Recovery Time Objective.',
      explanation: 'RTO drives whether you need clustering or just a tested restore by tomorrow.',
    },
  ],
  practice: {
    prompt: 'Backups sit on a NAS mapped as a drive for every staff member; no versioning. Ransomware risk?',
    options: [
      'None — NAS is magic',
      'High: encrypts live files and the backup share — use offline/immutable copies and restrict write',
      'Solved by RAID 0',
      'Solved by a prettier SSID'],
    correct: 'b',
    hint: 'Architecture of backup.',
    explanation: 'This is Domain 3 resilience, not an antivirus popup.',
  },
});

export const cyberD4W1 = weekLesson({
  id: 'cyber-sy0701-d4-w1',
  courseId: 'secplus-operations',
  title: 'Week 1 — Baselines, hardening, and vulnerability management',
  titleSw: 'Wiki 1 — Baseline, hardening, na udhaifu',
  examDomain: d4,
  minutes: 32,
  briefing:
    'Domain 4 is 28% — the largest. Operations establish a secure baseline: CIS-style images, disable unused services, firmware updates, default passwords gone, time sync (NTP) so logs match. Given vs established: you receive a vendor image, then you harden it to the college baseline. Configuration management (GPO, Ansible, Intune) keeps drift down. The golden image from the software-install unit belongs here with a version number.\n\nVulnerability management: asset inventory, scan (authenticated when you can), prioritise (CVSS + exposure), patch or compensate, rescan, report. Do not scan the ICS VLAN with aggressive plugins on production day. Maintenance windows (Domain 1) apply. Tickets must close with evidence.\n\nApplication security operations: input validation, WAF, dependency scanning, secrets not in Git. Host security: EDR, host firewall, disk encryption, USB policy. Wireless: WPA3/Enterprise, disable WPS, separate staff/student/IoT SSIDs — that is operations implementing architecture.\n\nThis week’s artefact: a baseline checklist for a lab PC (20 items) and a vuln-scan report with three findings, owners, and due dates.',
  briefingSw:
    'Baseline: zima huduma, nenosiri chaguomsingi, NTP. GPO/Intune. Scan, patch, scan tena. EDR, bitlocker. WPA3. Orodha ya asset kwanza.',
  questions: [
    {
      prompt: 'An authenticated vulnerability scan is better than an unauthenticated one because it:',
      options: [
        'Hacks the domain',
        'Sees missing patches from inside the host, not only open ports',
        'Disables logging',
        'Replaces backups'],
      correct: 'b',
      hint: 'Visibility.',
      explanation: 'Still need permission and a window. Do not DoS the MIS.',
    },
    {
      prompt: 'Time synchronisation (NTP) matters because:',
      options: ['It cools the CPU', 'Incident timelines across devices will not correlate if clocks drift', 'It is a type of malware', 'It replaces MFA'],
      correct: 'b',
      hint: 'Logs.',
      explanation: 'Operations live and die on timestamps.',
    },
    {
      prompt: 'Drift from the golden image is controlled by:',
      options: ['Hope', 'Configuration management and periodic rebuilds', 'More wallpapers', 'Disabling the SOC'],
      correct: 'b',
      hint: 'GPO / Ansible / MDM.',
      explanation: 'Uncontrolled local admin is how labs rot.',
    },
    {
      prompt: 'WPS on college APs should be:',
      options: ['Enabled for convenience', 'Disabled — it is a known brute-force/weak-enrolment surface', 'Required by PKI', 'A backup method'],
      correct: 'b',
      hint: 'Wireless hardening.',
      explanation: 'Use WPA2/3-Enterprise with campus credentials.',
    },
  ],
  blanks: [
    {
      prompt: 'A known-good hardened OS image used to rebuild labs is a ___ image.',
      answer: 'golden',
      hint: 'Gold standard.',
      explanation: 'Version it. Scan it. Do not let lecturers install random toolbars onto it.',
    },
  ],
  practice: {
    prompt: 'Monthly scan still shows SMBv1 on 12 lab PCs after you “patched”. Next operations step?',
    options: [
      'Ignore SMBv1 — it is vintage',
      'Confirm the GPO/hardening actually applied, disable SMBv1, rebuild outliers from golden image, rescan',
      'Turn off the scanner',
      'Publish the finding on Facebook'],
    correct: 'b',
    hint: 'Close the loop.',
    explanation: 'Vulnerability management is not a PDF; it is a change that sticks.',
  },
});

export const cyberD4W2 = weekLesson({
  id: 'cyber-sy0701-d4-w2',
  courseId: 'secplus-operations',
  title: 'Week 2 — Identity, access, monitoring, and automation',
  titleSw: 'Wiki 2 — Utambulisho, ufuatiliaji, na automation',
  examDomain: d4,
  minutes: 32,
  briefing:
    'Identity operations: provisioning, deprovisioning on the day staff leave, MFA, passwordless where you can, privileged access management (no standing domain admin), just-in-time elevation, and reviews of membership in Domain Admins. Federation/SSO (SAML/OIDC) for SaaS. Service accounts with unique creds, not the HOD password pasted into a script. Kenya: disable accounts the day a contractor’s attachment ends.\n\nMonitoring: SIEM, log retention, use cases (failed MFA, new local admin, mass file rename). NetFlow, packet capture when legal, EDR alerts. Alert fatigue is an operations failure — tune. SNMP/syslog from network devices. You cannot detect without collecting, and you cannot collect without NTP and disk for logs.\n\nFirewall/IDS operations: rule reviews, default deny, documented exceptions, IPS in-line versus IDS tap. Automation/orchestration (SOAR) for repetitive containment — disable account, isolate host — with human approval for destructive steps. Scripting is in the objectives: you should read a PowerShell or bash snippet that disables a user.\n\nAccess reviews quarterly. Shared “lab” passwords are an operations defect. That is how Domain 4 eats 28% of the exam: lots of small professional habits.',
  briefingSw:
    'MFA, zima akaunti siku ya kuondoka. PAM, SSO. SIEM, logi, NTP. Default deny. SOAR kwa hatua za kawaida. Usitumie nenosiri moja ya lab.',
  questions: [
    {
      prompt: 'The day a trainer’s contract ends you should:',
      options: [
        'Leave the account until next year “in case they return”',
        'Disable/deprovision access the same day across AD, mail, and SaaS',
        'Share their password with the class',
        'Email the password to Gmail'],
      correct: 'b',
      hint: 'Joiner-mover-leaver.',
      explanation: 'Orphan accounts are insider and credential-stuffing bait.',
    },
    {
      prompt: 'SIEM is primarily for:',
      options: ['Encrypting disks', 'Aggregating and correlating logs into detections', 'Crimping', 'Issuing CSRs'],
      correct: 'b',
      hint: 'Monitoring.',
      explanation: 'Without use cases it is an expensive filing cabinet.',
    },
    {
      prompt: 'Standing (permanent) domain-admin rights for every technician is:',
      options: ['Best practice', 'Excessive privilege — use PAM / just-in-time / separate admin accounts', 'Required by Zero Trust', 'A type of salt'],
      correct: 'b',
      hint: 'Least privilege operations.',
      explanation: 'Daily browsing as DA is how one phishing mail owns the forest.',
    },
    {
      prompt: 'An IDS in tap/span mode differs from inline IPS because IDS:',
      options: ['Always drops packets', 'Observes and alerts; IPS can block in the path', 'Replaces identity', 'Is a backup'],
      correct: 'b',
      hint: 'Detect vs prevent.',
      explanation: 'Fail-open/closed matters more for inline IPS.',
    },
  ],
  blanks: [
    {
      prompt: 'Requiring a second factor such as a phone prompt in addition to a password is ___.',
      answer: 'MFA',
      hint: 'Also 2FA.',
      explanation: 'Phishing-resistant MFA (passkeys, FIDO2) is stronger than SMS OTP.',
    },
  ],
  practice: {
    prompt: 'SIEM shows 2,000 “critical” infos each day; nobody reads them. Operations fix?',
    options: [
      'Add 2,000 more rules',
      'Tune use cases, severity, and response playbooks so alerts are actionable',
      'Delete the SIEM and hope',
      'Print every log'],
    correct: 'b',
    hint: 'Alert fatigue.',
    explanation: 'Domain 4 is effectiveness, not volume.',
  },
});

export const cyberD4W3 = weekLesson({
  id: 'cyber-sy0701-d4-w3',
  courseId: 'secplus-operations',
  title: 'Week 3 — Incident response, forensics hygiene, and recovery',
  titleSw: 'Wiki 3 — Majibu ya tukio na urejeshaji',
  examDomain: d4,
  minutes: 32,
  briefing:
    'Incident steps (know the order): preparation; detection and analysis; containment, eradication, recovery; lessons learned. Preparation is playbooks, contacts (KE-CIRT/CC, campus DPO), and tool access before 02:00. Containment may be isolating a VLAN or disabling an account — decide short-term vs long-term. Do not power off a live ransomware host if memory forensics is required and you have the skill; do isolate it. Evidence: chain of custody, hashes of images, volatile then disk.\n\nLegal: Computer Misuse and Cybercrimes Act — you need authorisation to “hack back”. Preservation for police/KE-CIRT may be required. Communication: one spokesperson, no WhatsApp rumours. Recovery: rebuild from golden image, restore from offline backup, rotate credentials, hunt for persistence, then monitor harder.\n\nLessons learned is a meeting with actions: missing MFA, missing segmentation, missing backup. If the report is only “virus was removed” you will repeat the incident at the next graduation.\n\nTabletop this week: ransomware on a lab, MIS still up. Who isolates? Who talks to the principal? What is the RTO? Write it as a one-page playbook.',
  briefingSw:
    'Andaa, gundua, zuia, komesha, rejea, funza. KE-CIRT. Usishambulie nyuma. Hash ya picha. Chain of custody. Rejea kutoka backup ya nje. Somo: MFA, segmentation.',
  questions: [
    {
      prompt: 'The first incident-response phase is:',
      options: ['Lessons learned', 'Preparation (before the incident)', 'Press conference', 'Reinstalling every PC blindly'],
      correct: 'b',
      hint: 'Before detection.',
      explanation: 'Without prep you invent a process at 02:00.',
    },
    {
      prompt: 'Chain of custody records:',
      options: ['Who handled evidence, when, and why', 'The SSID password', 'Ohm’s law', 'The CA’s favourite colour'],
      correct: 'a',
      hint: 'Forensics hygiene.',
      explanation: 'Broken chain makes evidence useless in court or discipline cases.',
    },
    {
      prompt: 'After ransomware, the safest recovery of the MIS is usually:',
      options: [
        'Pay and trust the decryptor alone',
        'Rebuild/restore from known-good offline backups, rotate secrets, then monitor',
        'Format only the wallpaper',
        'Ignore persistence'],
      correct: 'b',
      hint: 'Eradication then recovery.',
      explanation: 'Decryptors may work; they are not a control strategy.',
    },
    {
      prompt: 'Hacking the attacker’s C2 server without authority is:',
      options: ['Required by Security+', 'Unauthorised access — illegal under Kenyan cybercrime law', 'A type of backup', 'Zero Trust'],
      correct: 'b',
      hint: 'You already have a cyber-law module — operations must obey it.',
      explanation: 'Report, contain, cooperate. Do not hack back.',
    },
  ],
  blanks: [
    {
      prompt: 'Keeping an incident from spreading (e.g. pulling a NIC, disabling an account) is ___.',
      answer: 'containment',
      hint: 'After analysis, before eradication.',
      explanation: 'Short-term containment buys time for a durable fix.',
    },
  ],
  practice: {
    prompt: 'Lecturer forwards a live malware sample to the all-staff list “for awareness”. IR problem?',
    options: [
      'Excellent detection',
      'Spread the incident — use a sandboxed channel and SOC intake, not all-mail',
      'Required by KE-CIRT',
      'A salt'],
    correct: 'b',
    hint: 'Do not amplify.',
    explanation: 'Operations includes how you communicate during an incident.',
  },
});

export const cyberD5W1 = weekLesson({
  id: 'cyber-sy0701-d5-w1',
  courseId: 'secplus-program',
  title: 'Week 1 — Governance, policies, risk, and third parties',
  titleSw: 'Wiki 1 — Utawala, sera, hatari, na wauzaji',
  examDomain: d5,
  minutes: 30,
  briefing:
    'Domain 5 (20%) is the management system. Governance: policies, standards, procedures, guidelines. A policy says “backups shall exist”; a procedure says how. Acceptable use, password, remote access, data handling, BYOD, and incident policies are the campus set. Oversight: who owns risk (principal/council), who runs it (ICT/security), who audits. Security roles: administrator, analyst, DPO, auditor — separate where you can.\n\nRisk: identify assets, threats, vulnerabilities, likelihood, impact. Qualitative (high/medium/low) vs quantitative (money). Treatments: avoid, transfer (insurance), mitigate, accept. Residual risk after controls must be accepted by someone named. Risk register is a living document, not a PDF from 2019.\n\nThird parties: vendor assessment, contracts with security clauses, right to audit, least data shared, offboarding. A photocopy vendor who keeps exam papers is a third-party risk. Supply chain: who built the CCTV firmware?\n\nAwareness: phishing simulations, role-based training (finance vs workshop). Metrics: patch %, phishing click %, backup success. If you cannot measure, you cannot govern.',
  briefingSw:
    'Sera, kiwango, taratibu. AUP. Daftari la hatari. Epuka, hamisha, punguza, kubali. Wauzaji: kandarasi na data kidogo. Mafunzo ya phishing. Pima.',
  questions: [
    {
      prompt: 'A guideline differs from a policy in that a guideline is:',
      options: ['Always criminal law', 'Recommended practice; a policy is mandatory statement of management intent', 'A firewall rule', 'A hash'],
      correct: 'b',
      hint: 'Must vs should.',
      explanation: 'Standards are mandatory technical criteria. Procedures are steps.',
    },
    {
      prompt: 'Accepting a risk means:',
      options: [
        'Ignoring it secretly',
        'Formally living with residual risk after considering treatments, with an owner',
        'Deleting the asset',
        'Transferring it to students automatically'],
      correct: 'b',
      hint: 'Named owner.',
      explanation: 'Silent acceptance is negligence, not Domain 5.',
    },
    {
      prompt: 'The best first control on a photocopy vendor handling exam scripts is:',
      options: ['Hope', 'Contractual confidentiality, limited data, and return/destruction clauses', 'Giving them domain admin', 'A public S3 bucket of scripts'],
      correct: 'b',
      hint: 'Third party.',
      explanation: 'Vendors are in 5.3-style objectives. Assess them.',
    },
    {
      prompt: 'Quantitative risk analysis expresses impact primarily in:',
      options: ['Colours only', 'Numeric terms (often money) such as SLE/ALE', 'SSID names', 'Cable categories'],
      correct: 'b',
      hint: 'Numbers.',
      explanation: 'Qualitative uses ratings. Both are valid if consistent.',
    },
  ],
  blanks: [
    {
      prompt: 'A living list of threats, scores, owners, and treatments is a risk ___.',
      answer: 'register',
      hint: 'Also risk log.',
      explanation: 'No register = no governance, only heroics.',
    },
  ],
  practice: {
    prompt: 'Council asks “are we secure?” You have no policies, no register, 40 local admin passwords. Domain 5 answer?',
    options: [
      'Yes — the firewall is expensive',
      'No measurable program yet — establish policy, inventory, risk register, and owners first',
      'Only if the logo is new',
      'Security+ forbids governance'],
    correct: 'b',
    hint: 'Program.',
    explanation: 'Tools without governance are Domain 4 activity without Domain 5 purpose.',
  },
});

export const cyberD5W2 = weekLesson({
  id: 'cyber-sy0701-d5-w2',
  courseId: 'secplus-program',
  title: 'Week 2 — Compliance, privacy, and Kenya DPA with Security+',
  titleSw: 'Wiki 2 — Utiifu, faragha, na DPA ya Kenya',
  examDomain: d5,
  minutes: 32,
  briefing:
    'Privacy and compliance sit in Domain 5 and in Kenyan law. The Data Protection Act, 2019 (and regulations) require lawful basis, purpose limitation, minimisation, accuracy, storage limitation, integrity/confidentiality, and accountability. A data protection officer for entities that meet the threshold. Data subject rights: access, correction, deletion where applicable, and complaint to the Office of the Data Protection Commissioner. Cross-border transfer rules apply if the MIS is hosted abroad — contracts and adequacy, not “the cloud is magic”.\n\nSecurity+ privacy topics: PII, PHI (clinic), data inventory, impact assessments, notices, consent versus other lawful bases (public task, contract, legitimate interest — pick correctly for a public college). Retention schedules. Breach notification duties — know that you may need to inform the ODPC and affected students when the risk is high. Do not wait for the newspaper.\n\nCMCA 2018 still forbids unauthorised access — your pentest needs a letter. PCI is relevant if you take card payments for fees; most campuses should isolate that to a payment processor (reduce scope). Sector regulators (TVETA, CUE, CBK for student loan partners) may add duties.\n\nSemester close: write a one-page processing register for “student admissions data” — purpose, fields, system, retention, sharing, security measures. That is compliance as coursework, not a slogan.',
  briefingSw:
    'DPA 2019: msingi halali, minimisation, haki za mtu. DPO. ODPC. Uhamisho nje ya nchi. CMCA: pentest na barua. PCI ikiwa kadi. Andika rejesta ya usindikaji wa data ya wanafunzi.',
  questions: [
    {
      prompt: 'Keeping every unsuccessful applicant’s ID copy forever “for convenience” most clearly breaches:',
      options: ['Ohm’s law', 'Storage limitation / minimisation under data protection principles', 'WPA3', 'RAID 1'],
      correct: 'b',
      hint: 'DPA principles.',
      explanation: 'Purpose and storage limitation are examinable privacy ideas and Kenyan law.',
    },
    {
      prompt: 'A student asks for a copy of personal data you hold. You should:',
      options: [
        'Ignore them',
        'Follow the DPA access process (identity check, scope, lawful exceptions) within the required time',
        'Post it on the noticeboard',
        'Charge an arbitrary million shillings always'],
      correct: 'b',
      hint: 'Data subject rights.',
      explanation: 'Security+ calls this privacy operations; Kenya makes it law.',
    },
    {
      prompt: 'Hosting the MIS in another country requires extra attention to:',
      options: ['HDMI versions', 'Cross-border transfer rules and contracts', 'The canteen menu', 'Electrode shade'],
      correct: 'b',
      hint: 'Transfers.',
      explanation: 'Cloud region is a governance decision, not only a latency one.',
    },
    {
      prompt: 'An authorised penetration test differs from CMCA-offending hacking because it has:',
      options: ['Better malware', 'Written scope and permission from the data/system owner', 'No logs', 'A cooler hoodie'],
      correct: 'b',
      hint: 'Authorisation.',
      explanation: 'Your existing cyber-law lessons close this semester loop.',
    },
  ],
  blanks: [
    {
      prompt: 'Kenya’s 2019 statute on personal data is the Data Protection ___.',
      answer: 'Act',
      hint: 'DPA.',
      explanation: 'Name the Act in orals. Pair it with ODPC as the regulator.',
    },
  ],
  practice: {
    prompt: 'Ransomware exposes a database of student IDs and health clinic notes. Program-management first duties include:',
    options: [
      'Only restore and stay silent',
      'Incident process plus privacy: assess notification duties to ODPC/subjects, contain, preserve, communicate honestly',
      'Email the raw database to all parents',
      'Blame Security+'],
    correct: 'b',
    hint: 'IR + DPA.',
    explanation: 'Domain 4 handles the incident; Domain 5 handles legal privacy duties. Both are in this course.',
  },
});

export const cyberConceptsLessons = [cyberD1W1, cyberD1W2, cyberD1W3];
export const cyberThreatsLessons = [cyberD2W1, cyberD2W2, cyberD2W3];
export const cyberArchitectureLessons = [cyberD3W1, cyberD3W2, cyberD3W3];
export const cyberOperationsLessons = [cyberD4W1, cyberD4W2, cyberD4W3];
export const cyberProgramLessons = [cyberD5W1, cyberD5W2];

export const cyberSemesterLessons = [
  ...cyberConceptsLessons,
  ...cyberThreatsLessons,
  ...cyberArchitectureLessons,
  ...cyberOperationsLessons,
  ...cyberProgramLessons,
];
