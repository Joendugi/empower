import { fillBlank, makeLesson, matchPairs, mcq, scenario } from './helpers';

export const digitalSafety = makeLesson({
  id: 'digital-safety-101-lesson-1',
  courseId: 'digital-safety-101',
  title: 'Passwords, phishing, and M-Pesa fraud',
  titleSw: 'Nywila, ulaghai, na wizi wa M-Pesa',
  briefing:
    'Most Kenyan incidents start with people, not firewalls: reused PINs, fake Safaricom SMS, and WhatsApp “HR” job links. A strong passphrase is long and unique. Banks and MNOs will not ask for your PIN, PUK, or OTP on WhatsApp. Verify through the official app, *144#, or a published hotline.',
  briefingSw:
    'Mashambulizi mengi nchini Kenya huanza na watu: PIN zinazotumiwa tena na SMS za ulaghai. Mtoa huduma hataomba PIN au OTP kwenye WhatsApp.',
  estimatedMinutes: 8,
  examDomain: 'CompTIA Security+ 1.0 / 2.0',
  media: [{ kind: 'animation', preset: 'pulse', caption: 'Treat unexpected OTP and PIN requests as hostile traffic.' }],
  exercises: [
    mcq(
      'ds-q1',
      'Which password is strongest for a shared family phone in Kenya?',
      ['password123', 'Nairo@Mombasa-2026!', '12345678', 'qwerty'],
      'b',
      'Long unique passphrases beat short common passwords.',
      'Length plus uniqueness survives stuffing attacks. Common passwords are in every leak list.'
    ),
    fillBlank(
      'ds-q2',
      'A fake SMS that asks you to tap a link and enter an M-Pesa PIN is called ___.',
      'phishing',
      'It tries to fish for secrets.',
      'Phishing is social engineering that tricks you into giving credentials or money.'
    ),
    scenario(
      'ds-q3',
      "You get a WhatsApp from 'Safaricom Support' saying your line will be closed in 10 minutes unless you send a PUK. What should you do?",
      [
        'Send the PUK immediately so you keep the number',
        'Ignore it and confirm via the official Safaricom app or *144#',
        'Forward the PIN to a friend to check',
        'Reply with your ID number',
      ],
      'b',
      'Telcos do not demand secrets over WhatsApp.',
      'Urgency is a classic social-engineering tactic. Always verify through official channels.'
    ),
    mcq(
      'ds-q4',
      'What does multi-factor authentication (MFA) add beyond a password?',
      [
        'A second independent factor such as a phone prompt or hardware key',
        'The same password typed twice',
        'A longer username',
        'Disabling HTTPS',
      ],
      'a',
      'Something you know plus something you have.',
      'MFA stops many credential-stuffing attacks even when the password leaked.'
    ),
  ],
});

export const osiModel = makeLesson({
  id: 'osi-model-intro',
  courseId: 'network-fundamentals',
  title: 'The OSI model and TCP/IP',
  titleSw: 'Mfumo wa OSI na TCP/IP',
  briefing:
    'The OSI model has seven layers. You use it to isolate faults: cables and NICs (1–2), IP and routing (3), ports and TCP/UDP (4), then applications (7). TCP is reliable and connection-oriented; UDP is lightweight. Security controls map to layers too — encryption in transit is not a substitute for a locked wiring closet.',
  briefingSw:
    'OSI ina tabaka saba. Tabaka 1–2 ni kebo na MAC, 3 ni IP, 4 ni TCP/UDP, 7 ni programu.',
  estimatedMinutes: 9,
  cdaccUnitId: 'CU/ICT/CS/CR/01/6',
  examDomain: 'CompTIA Security+ 1.0 / Network+',
  exercises: [
    mcq(
      'osi-q1',
      'How many layers does the OSI model have?',
      ['4 layers', '5 layers', '7 layers', '12 layers'],
      'c',
      'Please Do Not Throw Sausage Pizza Away.',
      'Physical, Data Link, Network, Transport, Session, Presentation, Application.'
    ),
    fillBlank(
      'osi-q2',
      'The ___ protocol operates at Layer 4 and provides reliable, ordered delivery of data.',
      'TCP',
      'It uses a 3-way handshake.',
      'TCP is connection-oriented and guarantees delivery and ordering.'
    ),
    matchPairs(
      'osi-q3',
      'Match each layer to the PDU it handles.',
      [
        { leftId: 'l2', left: 'Data Link', rightId: 'frame', right: 'Frame' },
        { leftId: 'l3', left: 'Network', rightId: 'packet', right: 'Packet' },
        { leftId: 'l4', left: 'Transport', rightId: 'segment', right: 'Segment' },
      ],
      'Packets live where IP lives.',
      'Frames at L2, packets at L3, segments at L4.'
    ),
    scenario(
      'osi-q4',
      'Users can ping 8.8.8.8 but browsers fail for every website. Which layer is the best first suspect?',
      ['Physical cabling only', 'DNS or application-layer name resolution', 'The PSU wattage', 'The HDMI cable'],
      'b',
      'ICMP success means L3 often works.',
      'If IP reachability works but names do not, inspect DNS, proxies, and HTTP/S — not the patch cord first.'
    ),
  ],
});

export const linuxEssentials = makeLesson({
  id: 'linux-essentials-lesson-1',
  courseId: 'linux-essentials',
  title: 'Linux permissions and the shell',
  titleSw: 'Ruhusa za Linux na shell',
  briefing:
    'Linux is the backbone of servers, firewalls, and many security labs. `chmod 755` is rwx for the owner and rx for group/others. Never run unknown scripts as root. Know `pwd`, `ls`, `cd`, and `whoami` before you touch iptables or production logs.',
  briefingSw:
    'Linux ndiyo msingi wa seva nyingi. chmod 755 ni rwx kwa mmiliki. Usiendeshe script kama root bila kuelewa.',
  estimatedMinutes: 7,
  cdaccUnitId: 'CU/ICT/OS/LX/01/6',
  examDomain: 'LPIC-1 / CompTIA Linux+',
  exercises: [
    mcq(
      'lx-q1',
      'What does chmod 755 file.sh typically grant the owner?',
      ['Read only', 'Read, write, and execute', 'Write only', 'No permissions'],
      'b',
      '7 means rwx.',
      '755 is rwx for owner, rx for group and others.'
    ),
    fillBlank(
      'lx-q2',
      'The command to print the current working directory is ___.',
      'pwd',
      'Print working directory.',
      'pwd shows where you are in the filesystem.'
    ),
    scenario(
      'lx-q3',
      'A classmate shares “fix-wifi.sh” from an unknown Telegram group and says run it with sudo. What should you do?',
      [
        'Run it immediately so the lab works',
        'Read the script, verify the source, and ask the instructor',
        'chmod 777 the whole disk first',
        'Email the root password to the group',
      ],
      'b',
      'Sudo executes with full rights.',
      'Untrusted scripts are a common malware path. Read, hash-check, and use official repos.'
    ),
    matchPairs(
      'lx-q4',
      'Match the command to its purpose.',
      [
        { leftId: 'ls', left: 'ls', rightId: 'list', right: 'List files' },
        { leftId: 'cd', left: 'cd', rightId: 'change', right: 'Change directory' },
        { leftId: 'whoami', left: 'whoami', rightId: 'user', right: 'Show current user' },
      ],
      'Inventory, navigate, identity.',
      'These three commands are the start of every Linux practical.'
    ),
  ],
});

export const webSecurity = makeLesson({
  id: 'web-security-lesson-1',
  courseId: 'web-security',
  title: 'OWASP thinking: injection and XSS',
  titleSw: 'OWASP: injection na XSS',
  briefing:
    'Web apps fail when they trust the browser. SQL injection happens when user input is concatenated into queries. XSS runs attacker JavaScript in someone else’s session. The fix is parameterized queries, output encoding, and Content-Security-Policy — not “security through obscurity”.',
  briefingSw:
    'Injection hutokea input inapochanganywa na SQL. XSS huendesha JavaScript ya mshambulizi kwenye kivinjari cha mwathiriwa.',
  estimatedMinutes: 8,
  examDomain: 'OWASP Top 10',
  exercises: [
    mcq(
      'web-q1',
      'Which control best prevents SQL injection?',
      [
        'Concatenating user input into the query',
        'Parameterized queries / prepared statements',
        'Hiding the error messages only',
        'Using GET instead of POST',
      ],
      'b',
      'Never treat user data as SQL code.',
      'Bound parameters keep data separate from the query.'
    ),
    matchPairs(
      'web-q2',
      'Match the OWASP issue to a one-line description.',
      [
        { leftId: 'xss', left: 'XSS', rightId: 'xss-desc', right: 'Untrusted HTML runs in the browser' },
        { leftId: 'csrf', left: 'CSRF', rightId: 'csrf-desc', right: 'Browser sends a forged authenticated request' },
      ],
      'One attacks the page, one rides an existing session.',
      'XSS executes in the victim browser; CSRF abuses cookies on another request.'
    ),
    scenario(
      'web-q3',
      'A login form reflects the username back as raw HTML. A tester enters <script>alert(1)</script> and an alert appears. What is this?',
      ['Stored XSS', 'Reflected XSS', 'CSRF', 'SQL injection'],
      'b',
      'The payload came from the request and bounced back.',
      'Reflected XSS occurs when the payload is in the request and immediately rendered.'
    ),
    fillBlank(
      'web-q4',
      'Encoding < and > before showing user text in HTML is called output ___.',
      'encoding',
      'It stops the browser treating text as tags.',
      'Output encoding (escaping) is a primary XSS defence, together with CSP.'
    ),
  ],
});

export const cyberLawKenya = makeLesson({
  id: 'cyber-law-kenya-1',
  courseId: 'cyber-law-kenya',
  title: 'Kenya cyber law and professional ethics',
  titleSw: 'Sheria ya mtandao Kenya na maadili',
  briefing:
    'The Computer Misuse and Cybercrimes Act (2018) criminalises unauthorised access, interception, and system interference. A TVET or Security+ learner may scan lab VMs they own or have written permission to test — not a neighbour’s Wi-Fi, not a county portal “for practice”. Report incidents to the organisation and, where required, KE-CIRT/CC. Ethics is part of the occupation, not an optional extra.',
  briefingSw:
    'Sheria ya Computer Misuse and Cybercrimes Act (2018) inakataza kuingia mifumo bila idhini. Fanya majaribio kwenye lab uliyopewa tu. Ripoti tukio kwa KE-CIRT inapohitajika.',
  estimatedMinutes: 8,
  examDomain: 'Kenya CMCA 2018 · Professional ethics',
  exercises: [
    mcq(
      'law-q1',
      'Which activity is lawful for a CyberLearn practical?',
      [
        'Port-scanning a random shop’s public IP',
        'Testing a lab VM you were assigned, inside the documented scope',
        'Guessing a classmate’s email password',
        'Defacing a school site to prove a finding',
      ],
      'b',
      'Permission and scope first.',
      'Unauthorised access is an offence even if your intent is “learning”. Use sanctioned labs.'
    ),
    fillBlank(
      'law-q2',
      'Kenya’s national computer incident response team is commonly abbreviated KE-___.',
      'CIRT',
      'Computer Incident Response Team.',
      'KE-CIRT/CC coordinates national cyber incident handling under the Communications Authority ecosystem.'
    ),
    scenario(
      'law-q3',
      'During attachment you find an open county dashboard with citizen IDs. What should you do?',
      [
        'Download the database to your USB “as evidence” and post screenshots',
        'Stop, screenshot the URL only if policy allows, and report through your supervisor',
        'Sell the finding to a WhatsApp group',
        'Leave a taunt message so they notice',
      ],
      'b',
      'Do not exfiltrate personal data.',
      'Responsible disclosure goes through authority. Copying IDs can itself be unlawful processing.'
    ),
    mcq(
      'law-q4',
      'Why do professional codes of ethics matter as much as technical skill?',
      [
        'They replace the need for firewalls',
        'Technicians hold privileged access and can harm people if they misuse it',
        'Ethics questions never appear in exams',
        'They only apply to lawyers',
      ],
      'b',
      'Access is power.',
      'ICT and security staff see payroll, health, and exam data. Competence without ethics is a threat.'
    ),
  ],
});
