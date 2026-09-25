import { fillBlank, makeLesson, matchPairs, mcq, scenario } from './helpers';

export const tvetWorkshopSafety2 = makeLesson({
  id: 'tvet-workshop-safety-2',
  courseId: 'workshop-safety',
  title: 'Incidents, chemicals, and lock-out in the ICT lab',
  titleSw: 'Ajali, kemikali, na lock-out lab ya ICT',
  briefing:
    'After basic PPE, the technician’s job is to stop energy: electrical, chemical, and mechanical (printers, shredders). Lock-out / tag-out is not only for electricians. If a photocopier is being serviced, it must not be powered by a helpful classmate. Put a notice, keep the key, and tell the instructor.\n\nSolvents for cleaning flux and plastics have SDS sheets. Do not pour isopropyl into an unmarked water bottle. Skin and eye exposure: rinse, then report. Toner is a fine dust — do not blow it with compressed air toward faces; vacuum with an approved method.\n\nIncident reporting is a competence. Write what happened, who was present, and what you isolated. Hiding a shock “because I am fine” is how the next student repeats it. First-aid kit location and fire exit are part of induction, not trivia.\n\nWaste: batteries and CRTs/PSUs are not general rubbish. Follow college hazardous-waste rules. That is occupational safety at Level 5, not housekeeping extra credit.',
  briefingSw:
    'Zima nishati kabla ya servisi. Lock-out. SDS kwa kemikali. Usiweke solvent kwenye chupa ya maji. Ripoti mshtuko. Betri na PSU si takataka za kawaida.',
  estimatedMinutes: 16,
  cdaccUnitId: 'CU/ICT/OS/01/5',
  examDomain: 'CDACC ICT Technician — Occupational Safety',
  exercises: [
    mcq(
      'tvet-safe2-q1',
      'A copier being repaired should be:',
      [
        'Left powered so you can see the error',
        'Isolated and tagged so nobody starts it during service',
        'Held by two students while a third tests live',
        'Sprayed with water to discharge it',
      ],
      'b',
      'Control of energy.',
      'Unexpected start-up injures. Isolate and communicate.'
    ),
    fillBlank(
      'tvet-safe2-q2',
      'The document that states hazards and first aid for a solvent is the ___.',
      'SDS',
      'Safety Data Sheet. MSDS is the older name.',
      'SDS is the professional source, not a WhatsApp rumour.'
    ),
    scenario(
      'tvet-safe2-q3',
      'You get a small shock from a “unplugged” printer that still has an internal PSU capacitor. You feel fine. What do you do?',
      [
        'Hide it so you are not blamed',
        'Stop work, report the incident, and treat residual charge as part of the procedure next time',
        'Lick the contact to check again',
        'Ask a classmate to confirm by repeating the shock',
      ],
      'b',
      'Report.',
      'Residual charge is a known PSU hazard. Reporting improves the procedure.'
    ),
    matchPairs(
      'tvet-safe2-q4',
      'Match the waste to the handling idea.',
      [
        { leftId: 'bat', left: 'Lithium / UPS batteries', rightId: 'haz', right: 'Hazardous — do not bin with paper' },
        { leftId: 'toner', left: 'Toner spill', rightId: 'dust', right: 'Avoid blowing into the air; contain dust' },
        { leftId: 'paper', left: 'Clean office paper', rightId: 'recycle', right: 'Normal recycle if policy allows' },
      ],
      'Not everything is general waste.',
      'ICT workshops generate mixed hazardous streams.'
    ),
  ],
});

export const tvetComputerHardware2 = makeLesson({
  id: 'tvet-computer-hardware-2',
  courseId: 'computer-hardware',
  title: 'Storage, displays, and field replacement',
  titleSw: 'Hifadhi, skrini, na kubadilisha sehemu',
  briefing:
    'After naming parts, you replace them without destroying the board. Storage: HDD is magnetic platters, SSD is flash. Cloning and imaging are how you preserve a lab image; deleting partitions is not “repair”. Know SATA vs NVMe physically so you do not force a drive.\n\nDisplays: no picture can be cable, RAM, GPU onboard, or backlight. Test known-good monitor before condemning a motherboard. Laptops add DC jacks, batteries, and thermal paste — service manuals beat guesswork. Do not pry an LCD with a screwdriver through the matrix.\n\nField path: visual, power rails, POST beeps/codes, then swap the least expensive likely part with evidence. Scatter-gun replacement of RAM, HDD, and PSU at once teaches nothing and costs the college.\n\nDocument: serial numbers, what you found, what you fitted. The next duty technician should not start from zero.',
  briefingSw:
    'HDD vs SSD. Usilazimishe NVMe. Jaribu monitor inayojulikana kabla ya kuhukumu board. Path: visual, power, POST, kisha sehemu. Andika serial na kazi uliyofanya.',
  estimatedMinutes: 18,
  cdaccUnitId: 'CU/ICT/CR/01/5',
  examDomain: 'CDACC ICT Technician — Computer Repair',
  exercises: [
    mcq(
      'tvet-hw2-q1',
      'A PC posts, fans spin, but the screen is black. Best next evidence-gathering step?',
      [
        'Format the SSD immediately',
        'Try a known-good cable and monitor / onboard video',
        'Replace the case screws',
        'Install a second operating system in the dark',
      ],
      'b',
      'Display path before storage format.',
      'You cannot even see BIOS yet. Prove the display chain.'
    ),
    fillBlank(
      'tvet-hw2-q2',
      'The common connector family for many 2.5/3.5 inch drives is ___.',
      'SATA',
      'Serial ATA.',
      'NVMe M.2 is a different physical and logical interface.'
    ),
    scenario(
      'tvet-hw2-q3',
      'A lab HDD clicks. Students need yesterday’s work. You should:',
      [
        'Keep powering it in a loop to “unstick heads”',
        'Stop, image if policy allows, replace the drive, restore from backup/image — not hammer the platter',
        'Open the platter in dusty air for fun',
        'Install the drive as a USB boot without cloning',
      ],
      'b',
      'Clicking is mechanical failure.',
      'Further power cycles can destroy remaining data. Backup strategy should already exist.'
    ),
    mcq(
      'tvet-hw2-q4',
      'Why record the replaced part serial on the job card?',
      [
        'It looks busy',
        'Warranty, asset control, and the next technician need a trail',
        'Serials slow viruses',
        'CDACC bans labels',
      ],
      'b',
      'Traceability.',
      'Workshops are systems, not magic tricks.'
    ),
  ],
});

export const tvetOperatingSystems2 = makeLesson({
  id: 'tvet-operating-systems-2',
  courseId: 'operating-systems',
  title: 'Users, backup, and malware first response',
  titleSw: 'Watumiaji, backup, na malware',
  briefing:
    'A technician who can install Windows but cannot manage users will fail in a college. Create standard users. Disable unused guest accounts. Share folders with least privilege — not “Everyone: Full control” on exam papers.\n\nBackup: 3-2-1 is the idea (copies, media, offsite/offline). A USB disk left plugged in is eaten by ransomware too. Test a restore once, or you do not have a backup — you have a hope.\n\nMalware first response for a technician (not a forensics lab): isolate the NIC, do not run random “cleaners” from Telegram, capture the symptom, then follow college AV/EDR procedure. Reimage if that is the standard. Changing a password on a still-infected PC is not containment.\n\nLogs: Event Viewer and syslog tell you if a disk is dying. Learn to filter. Guessing is slower.',
  briefingSw:
    'Akaunti za kawaida, si admin kila siku. Backup inajaribiwa kwa restore. Malware: tengeneza mtandao, fuata taratibu, usitumie cleaner ya Telegram. Soma logs.',
  estimatedMinutes: 16,
  cdaccUnitId: 'CU/ICT/OS/LX/01/5',
  examDomain: 'CDACC ICT Technician — Systems Support',
  exercises: [
    mcq(
      'tvet-os2-q1',
      '“Everyone: Full control” on a shared exams folder is bad because:',
      [
        'It makes search slower',
        'Any account can alter or delete exam papers',
        'Windows forbids shares',
        'It uses extra RAM',
      ],
      'b',
      'Least privilege.',
      'Share to the group that must work, with the rights they need.'
    ),
    fillBlank(
      'tvet-os2-q2',
      'A backup you have never restored should be treated as ___.',
      'untested',
      'Until you restore, you do not know it works.',
      'Test restores. Untested backups fail on the day you need them.'
    ),
    scenario(
      'tvet-os2-q3',
      'A staff PC shows ransom text and mapped drives. First useful action?',
      [
        'Pay from M-Pesa immediately',
        'Isolate the machine from the network and escalate; do not encrypt more by “trying files”',
        'Open the USB of backups on the same live PC and copy the malware over',
        'Post the ransom note on the college Facebook',
      ],
      'b',
      'Contain.',
      'Network isolation reduces spread. Then IR process.'
    ),
    matchPairs(
      'tvet-os2-q4',
      'Match the control to the goal.',
      [
        { leftId: 'std', left: 'Standard user account', rightId: 'priv', right: 'Limit daily rights' },
        { leftId: 'bak', left: 'Offline backup', rightId: 'ransom', right: 'Survive ransomware on live disks' },
        { leftId: 'log', left: 'Event logs', rightId: 'ev', right: 'Evidence of disk and auth failures' },
      ],
      'Prevent, survive, investigate.',
      'OS support is controls, not only installing Office.'
    ),
  ],
});

export const tvetComputerNetworks2 = makeLesson({
  id: 'tvet-computer-networks-2',
  courseId: 'computer-networks',
  title: 'IPv4 sense, Wi-Fi, and first-line tests',
  titleSw: 'IPv4, Wi-Fi, na majaribio ya kwanza',
  briefing:
    'You do not need to be a CCNP to be useful. You must read an IPv4 address and mask enough to see that 192.168.1.50/24 cannot use gateway 192.168.0.1 without a router. APIPA 169.254.x.x means DHCP failed. ipconfig / ifconfig / ip are the first tools, then ping the gateway, then ping a public IP, then DNS (ping a name).\n\nWi-Fi: wrong passphrase, hidden SSID confusion, 2.4 vs 5 GHz range, and a crowded channel. A “weak signal” is not always the ISP. Stand at the AP with a known-good client before blaming Safaricom.\n\nCabling: a link light is not a permission to skip testing. A miswired RJ45 (split pairs) passes a cheap tester and fails under load. Follow T568A or B consistently at both ends.\n\nDocument the LAN: who is DHCP, what is the gateway, where is the switch. A drawing on the wall saves hours.',
  briefingSw:
    'Soma mask. 169.254 ni DHCP imeshindwa. Ping gateway, kisha DNS. Wi-Fi: nenosiri, chaneli, bendi. Kebo: T568A/B sawa pande zote. Andika mchoro wa LAN.',
  estimatedMinutes: 18,
  cdaccUnitId: 'CU/ICT/CS/CR/01/6',
  examDomain: 'CDACC ICT Technician — Computer Networks',
  exercises: [
    mcq(
      'tvet-net2-q1',
      'A host shows 169.254.32.10. What is the likely issue?',
      [
        'Perfect static design',
        'DHCP failed so the OS assigned APIPA',
        'The default gateway is Google',
        'Fibre is unplugged at the beach',
      ],
      'b',
      'APIPA.',
      'Check cable, DHCP server, and pool exhaustion.'
    ),
    fillBlank(
      'tvet-net2-q2',
      'The command-line test that checks whether a host answers ICMP is ___.',
      'ping',
      'Round-trip.',
      'Ping gateway vs ping 8.8.8.8 vs ping a name splits the fault.'
    ),
    scenario(
      'tvet-net2-q3',
      'Office PCs ping 8.8.8.8 but Chrome cannot load safaricom.co.ke. You should inspect:',
      [
        'Only HDMI cables',
        'DNS settings / DNS server reachability',
        'PSU wattage',
        'The office kettle earth',
      ],
      'b',
      'IP works, names fail.',
      'Classic DNS fault. ipconfig /all and nslookup.'
    ),
    mcq(
      'tvet-net2-q4',
      'Both ends of a UTP run should use:',
      [
        'Random A and B mixed “for security”',
        'The same T568A or T568B standard throughout as designed',
        'Telephone RJ11 crimps',
        'Only four of eight wires always, even for Gigabit',
      ],
      'b',
      'Pair integrity.',
      'A-B mismatch is a crossover. Unintended crossovers break links.'
    ),
  ],
});
