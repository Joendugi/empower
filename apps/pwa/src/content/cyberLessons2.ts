import { fillBlank, makeLesson, matchPairs, mcq, scenario } from './helpers';

export const digitalSafety2 = makeLesson({
  id: 'digital-safety-101-lesson-2',
  courseId: 'digital-safety-101',
  title: 'SIM swap, devices, and account recovery',
  titleSw: 'SIM swap, vifaa, na kurejesha akaunti',
  briefing:
    'M-Pesa and email reset via SMS, so a SIM swap at a shop (social engineering or bribed staff) can drain money and mailboxes. PINs, PUK, and “please register this line” stories need the official channel. Number lock / SIM PIN and alerting Safaricom on sudden loss of service are practical defences.\n\nDevice hygiene: screen lock, OS updates, unknown APKs off, and USB charging from a power-only source when possible. A public cyber-cafe PC is hostile — never type a bank password there. Full-disk encryption (phone + laptop) helps if the device is stolen in a matatu.\n\nAccount recovery: unique passwords (manager if you can), MFA that is not only SMS where the service allows an authenticator app, and backup codes stored offline. Family WhatsApp groups are not your password manager.\n\nIf money has moved: freeze via *334# or app, report to the MNO and police/DCI cyber as advised, and keep SMS evidence. Speed matters more than arguing in the group chat.',
  briefingSw:
    'SIM swap inaweza kuiba M-Pesa. Funga SIM PIN. Usitype nywila ya benki kwenye cyber. MFA si SMS tu kama inawezekana. Kama pesa zimeenda, froze na ripoti haraka.',
  estimatedMinutes: 16,
  examDomain: 'CompTIA Security+ 1.0 / 2.0',
  exercises: [
    mcq(
      'ds2-q1',
      'You lose signal and then get “your SIM is being registered”. Best first move?',
      [
        'Give the PUK to the WhatsApp helper',
        'Contact the official MNO channel and treat it as possible SIM swap',
        'Post your ID both sides for speed',
        'Ignore — it is always a network dip',
      ],
      'b',
      'SIM swap pattern.',
      'Official app, shop with ID process, or hotline — not a random text.'
    ),
    fillBlank(
      'ds2-q2',
      'Using an authenticator app in addition to a password is a form of ___.',
      'MFA',
      'Multi-factor authentication.',
      'SMS MFA is better than nothing but SIM swap weakens it.'
    ),
    scenario(
      'ds2-q3',
      'A cousin offers to “unlock” your phone with a cracked APK from Telegram. You should:',
      [
        'Install it — family is trusted',
        'Refuse; sideloaded cracks are a malware path',
        'Disable Play Protect and proceed',
        'Give them your Google password to help',
      ],
      'b',
      'Trust is not a control.',
      'Family members spread malware with good intentions.'
    ),
    mcq(
      'ds2-q4',
      'Why is a cyber-cafe risky for internet banking?',
      [
        'The chairs are uncomfortable',
        'Keyloggers, shared browsers, and shoulder surfing',
        'HTTPS does not work in Kenya',
        'M-Pesa cannot be used after 6 pm',
      ],
      'b',
      'Shared PCs.',
      'Use your phone on mobile data if you must transact away from home.'
    ),
  ],
});

export const osiModel2 = makeLesson({
  id: 'osi-model-2',
  courseId: 'network-fundamentals',
  title: 'Ports, firewalls, and isolating by layer',
  titleSw: 'Ports, firewall, na kutenganisha kwa tabaka',
  briefing:
    'Layer 4 is where ports live. 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS, 25/587 mail — you should recognise these in logs. A firewall that blocks 443 will look like “the internet is down” in a browser while ping still works. That is why ping is a poor only-test.\n\nTCP three-way handshake (SYN, SYN-ACK, ACK) vs UDP’s fire-and-forget explains why some VPNs and voice apps behave differently on bad links. RST means a refusal; timeout means filter or drop.\n\nTroubleshooting map: cable/Wi-Fi (L1–2), IP/gateway (L3), port/firewall (L4), then the app (L7). Jumping to reinstall Windows because a website fails is skipping the map.\n\nSecurity: a firewall is not optional decoration. Default deny inbound on a campus edge is normal. Opening RDP (3389) to the world is how ransomware arrives.',
  briefingSw:
    'Port 443 ni HTTPS. Ping unaweza kufanya kazi wakati wavuti imezuiwa. Fuata tabaka: kebo, IP, port, programu. Usifungue RDP kwa dunia.',
  estimatedMinutes: 16,
  cdaccUnitId: 'CU/ICT/CS/CR/01/6',
  examDomain: 'CompTIA Security+ · Network+',
  exercises: [
    mcq(
      'osi2-q1',
      'HTTPS commonly uses TCP port:',
      ['22', '23', '443', '3389'],
      'c',
      'Web encryption.',
      '80 is HTTP; 443 is HTTPS. 3389 is RDP — a favourite attack surface.'
    ),
    fillBlank(
      'osi2-q2',
      'The first packet of a TCP handshake is a ___ packet.',
      'SYN',
      'Synchronize.',
      'SYN, SYN-ACK, ACK.'
    ),
    matchPairs(
      'osi2-q3',
      'Match the symptom to the likely layer to inspect first.',
      [
        { leftId: 'nolink', left: 'No link light', rightId: 'l1', right: 'Physical / cable / NIC' },
        { leftId: 'nopinggw', left: 'Cannot ping gateway', rightId: 'l3', right: 'IP addressing / VLAN / L3' },
        { leftId: 'pingok', left: 'Ping IP works, website fails', rightId: 'l47', right: 'DNS, port, or application' },
      ],
      'Do not skip layers.',
      'This is the practical use of OSI, not reciting pizza mnemonics only.'
    ),
    scenario(
      'osi2-q4',
      'A principal wants RDP on a staff PC forwarded from the college public IP “for working from home”. You should:',
      [
        'Do it with no password',
        'Refuse naked RDP-to-world; propose VPN or another approved remote method',
        'Use port 80 for RDP to hide it',
        'Post the IP on the noticeboard',
      ],
      'b',
      'Exposed RDP.',
      'Security architecture is part of networking now.'
    ),
  ],
});

export const linuxEssentials2 = makeLesson({
  id: 'linux-essentials-lesson-2',
  courseId: 'linux-essentials',
  title: 'Processes, logs, and users on Linux',
  titleSw: 'Processes, logs, na watumiaji Linux',
  briefing:
    'After pwd/ls/cd, you must see what is running and who is logged in. `ps`, `top`/`htop`, and `journalctl` or `/var/log/syslog` are how you find a runaway process or a failed service. Killing PID 1 is not a joke — know `kill` vs `kill -9` and when a service restart is cleaner.\n\nUsers: `id`, `sudo -l`, and not giving sudo to every classmate. Files in `/home` vs `/etc` vs `/var`. Permissions 777 on `/etc/passwd` is vandalism. SUID binaries are a later topic; do not chmod +s randomly.\n\nDisk: `df -h` before the disk fills at 3 a.m. `du` finds the heavy directory. Logs that grow without logrotate will take a server down as surely as malware.\n\nYou still do not run curl|sudo bash from a pastebin. Read. Then run, if the instructor approves.',
  briefingSw:
    'ps/top kuona processes. Logs kwenye journalctl au /var/log. Usitoe sudo kwa kila mtu. df -h. Usitumie chmod 777 kwenye /etc. Usitekeleze script ya mtandao kama root bila kusoma.',
  estimatedMinutes: 16,
  cdaccUnitId: 'CU/ICT/OS/LX/01/6',
  examDomain: 'LPIC-1 / CompTIA Linux+',
  exercises: [
    mcq(
      'lx2-q1',
      'df -h is used to:',
      ['Hash passwords', 'Show mounted disk space in human-readable form', 'Delete home directories', 'Open a firewall'],
      'b',
      'Disk free.',
      'Full disks make login and logging fail in surprising ways.'
    ),
    fillBlank(
      'lx2-q2',
      'The command that shows your user and group IDs is ___.',
      'id',
      'Identity.',
      'id is faster than guessing whether you are root.'
    ),
    scenario(
      'lx2-q3',
      'A lab VM is slow. top shows one process at 99% CPU you do not recognise. You should:',
      [
        'kill -9 1 immediately',
        'Identify the process, check with the instructor/service docs, then stop that service/PID',
        'chmod 777 /',
        'Delete /var/log so CPU drops',
      ],
      'b',
      'Do not kill init.',
      'Investigate, then act. PID 1 is the system.'
    ),
    matchPairs(
      'lx2-q4',
      'Match the path to what it usually holds.',
      [
        { leftId: 'etc', left: '/etc', rightId: 'cfg', right: 'Configuration' },
        { leftId: 'var', left: '/var/log', rightId: 'logs', right: 'Log files' },
        { leftId: 'home', left: '/home', rightId: 'users', right: 'User home directories' },
      ],
      'Where things live.',
      'Knowing the tree prevents deleting the wrong folder.'
    ),
  ],
});

export const webSecurity2 = makeLesson({
  id: 'web-security-lesson-2',
  courseId: 'web-security',
  title: 'Sessions, cookies, HTTPS, and secrets',
  titleSw: 'Sessions, cookies, HTTPS, na siri',
  briefing:
    'After injection and XSS, you must understand the session. Cookies that store session IDs need Secure and HttpOnly flags in production thinking. A session in localStorage is easier for XSS to steal. CSRF tokens or SameSite cookies reduce cross-site request forgery.\n\nHTTPS (TLS) protects data in transit from cafe Wi-Fi snooping. It does not fix SQL injection. Mixed content (HTTPS page loading HTTP script) is a downgrade. Certificate warnings exist because someone might be intercepting — do not click through on banking.\n\nSecrets: API keys in a public GitHub repo are live incidents. .env files are not for the frontend bundle. Rotate keys if they leak. Password reset tokens must expire and be single-use.\n\nAuth: default admin/admin on a lab app is a finding. Change it. Lockout / MFA on admin panels is a control, not a nuisance.',
  briefingSw:
    'Cookie ya session iwe HttpOnly/Secure. HTTPS inalinda njiani, si injection. Usiignore certificate warning kwenye benki. Usiweke API key kwenye GitHub. Badilisha default passwords.',
  estimatedMinutes: 16,
  examDomain: 'OWASP Top 10',
  exercises: [
    mcq(
      'web2-q1',
      'HttpOnly on a session cookie mainly helps against:',
      ['SQL injection in the database engine', 'JavaScript on a XSS page reading the cookie', 'Weak Wi-Fi passwords', 'Slow DNS'],
      'b',
      'Cookie theft via XSS.',
      'HttpOnly is not a full XSS fix, but it raises the cost of cookie theft.'
    ),
    fillBlank(
      'web2-q2',
      'HTTP over TLS is commonly called ___.',
      'HTTPS',
      'The S is for secure transport.',
      'HTTPS encrypts the path, not the application logic.'
    ),
    scenario(
      'web2-q3',
      'A student commits a .env with the college SMS API key to a public repo. You should:',
      [
        'Leave it — Git history is private really',
        'Revoke/rotate the key, remove it from git history as policy allows, and treat it as a leak',
        'Add more keys to the same file',
        'Tweet the key so attackers share it fairly',
      ],
      'b',
      'Assume compromise.',
      'Rotation is mandatory. Deleting the file on HEAD is not enough if history is public.'
    ),
    mcq(
      'web2-q4',
      'Clicking through a browser certificate warning on internet banking is risky because:',
      [
        'It uses extra ink',
        'You may be talking to an interceptor, not the bank',
        'HTTPS is illegal in Kenya',
        'Certificates only matter on Windows XP',
      ],
      'b',
      'PKI warning.',
      'Stop. Use another network. Call the bank’s published number.'
    ),
  ],
});

export const cyberLawKenya2 = makeLesson({
  id: 'cyber-law-kenya-2',
  courseId: 'cyber-law-kenya',
  title: 'Data protection, evidence, and disclosure',
  titleSw: 'Ulinzi wa data, ushahidi, na disclosure',
  briefing:
    'The Data Protection Act, 2019 sits beside the Computer Misuse and Cybercrimes Act. Personal data (IDs, student marks, health, location) has rules on collection, storage, and sharing. “I found it on an open share so I copied 40,000 rows to study Excel” can still be unlawful processing.\n\nEvidence: if you discover a crime, your job is not to become a hacker detective. Preserve what policy allows (screenshots of URLs, logs), do not alter systems, and hand over to supervisors, police, or KE-CIRT as directed. Imaging someone’s phone “for proof” without authority is another offence stacked on the first.\n\nDisclosure: vendors and government have channels. Public shaming on Twitter with live data dumps harms the people in the database. Coordinated disclosure through the organisation is the professional path.\n\nWorkplace: acceptable-use policies, monitoring notices, and not using the college firewall hole you found for personal torrents. Privilege is observed.',
  briefingSw:
    'Data Protection Act 2019. Usiibe data ya watu “kwa ajili ya Excel”. Ushahidi: hifadhi kama policy inavyosema, usibadilishe mifumo. Usichapishe database Twitter. Fuata AUP ya chuo.',
  estimatedMinutes: 16,
  examDomain: 'Kenya DPA 2019 · CMCA 2018',
  exercises: [
    mcq(
      'law2-q1',
      'Copying a spreadsheet of student ID numbers from an open lab share to your USB “to practise Excel” is:',
      [
        'Always fine because it was open',
        'Likely unlawful / against policy processing of personal data',
        'Required by CDACC',
        'A type of encryption',
      ],
      'b',
      'Personal data.',
      'Availability is not permission. Use dummy data for practice.'
    ),
    fillBlank(
      'law2-q2',
      'Kenya’s 2019 law on personal data is the Data ___ Act.',
      'protection',
      'Data Protection Act.',
      'It sits with CMCA in professional practice.'
    ),
    scenario(
      'law2-q3',
      'You find live medical records on a misconfigured bucket. Best action?',
      [
        'Download all of it to prove severity on GitHub',
        'Stop access, record the URL per policy, report to supervisor / DPO / KE-CIRT path — do not exfiltrate the records',
        'Message patients one by one on WhatsApp',
        'Sell access to a journalist only',
      ],
      'b',
      'Minimise data you touch.',
      'Proof of existence ≠ copying the whole population.'
    ),
    mcq(
      'law2-q4',
      'Changing log timestamps on a college server to “clean” your mistake is:',
      [
        'Good hygiene',
        'Integrity violation and likely an offence / serious misconduct',
        'Required before KE-CIRT calls',
        'The same as patching',
      ],
      'b',
      'Evidence tampering.',
      'Report the mistake. Do not forge logs.'
    ),
  ],
});
