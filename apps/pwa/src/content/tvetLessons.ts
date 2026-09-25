import { fillBlank, makeLesson, matchPairs, mcq, scenario } from './helpers';

export const tvetWorkshopSafety = makeLesson({
  id: 'tvet-workshop-safety-1',
  courseId: 'workshop-safety',
  title: 'Workshop and electrical safety',
  titleSw: 'Usalama wa warsha na umeme',
  briefing:
    'ICT technicians work around live power, sharp chassis edges, and electrostatic discharge (ESD). CDACC occupational safety units require you to isolate power, use PPE, and follow a lock-out mindset before you open a computer. Never service equipment with wet hands or on a metal bench without an anti-static mat.',
  briefingSw:
    'Fundi wa ICT hufanya kazi karibu na umeme, kingo kali, na umeme tuli (ESD). Kabla ya kufungua kompyuta, zima umeme, vaa PPE, na tumia mkeka wa kuzuia umeme tuli.',
  estimatedMinutes: 8,
  cdaccUnitId: 'CU/ICT/OS/01/5',
  examDomain: 'CDACC ICT Technician — Occupational Safety',
  media: [{ kind: 'animation', preset: 'circuit', caption: 'Isolate power before the circuit is live.' }],
  exercises: [
    mcq(
      'tvet-safe-q1',
      'What should you do first before opening a desktop PSU-side cover?',
      [
        'Touch the motherboard to discharge yourself',
        'Unplug the PC and hold the power button to drain residual charge',
        'Spray water on the PSU to cool it',
        'Increase the room humidity with a kettle',
      ],
      'b',
      'Power isolation comes before tools.',
      'Unplug mains, then hold the case power button so capacitors discharge. Only then open the chassis.',
      50
    ),
    fillBlank(
      'tvet-safe-q2',
      'A wrist strap that connects you to the computer chassis is used to prevent ___.',
      'ESD',
      'It is also called static electricity damage.',
      'Electrostatic discharge (ESD) can silently destroy RAM, NICs, and motherboard chips.'
    ),
    scenario(
      'tvet-safe-q3',
      'A learner smells burning plastic from a lab PC. What is the correct first action?',
      [
        'Keep troubleshooting so you do not lose the practical marks',
        'Pour water on the machine',
        'Switch off at the wall, unplug, and report to the instructor',
        'Cover the PC with a cloth and continue',
      ],
      'c',
      'Life and fire safety beat the exam clock.',
      'Isolate power, do not use water on electrical fires, and escalate. CDACC workshops treat this as an incident, not a race.'
    ),
    mcq(
      'tvet-safe-q4',
      'Which fire extinguisher class is appropriate for a live electrical cabinet?',
      ['Class A water', 'Class B foam only', 'CO₂ or dry powder rated for electrical fires', 'Wet chemical for kitchens only'],
      'c',
      'Water conducts electricity.',
      'CO₂ or dry powder are used on electrical (Class E / C depending on standard) fires. Water can electrocute the technician.'
    ),
  ],
});

export const tvetComputerHardware = makeLesson({
  id: 'tvet-computer-hardware-1',
  courseId: 'computer-hardware',
  title: 'Identify and replace core components',
  titleSw: 'Tambua na badilisha sehemu kuu',
  briefing:
    'A TVET ICT technician must identify CPU, RAM, storage, PSU, and motherboard, then follow a fault-isolation path: power, POST, display, storage, then peripherals. RAM is volatile working memory; an SSD or HDD is persistent storage. Mixing those two is one of the most common exam traps.',
  briefingSw:
    'Fundi wa ICT lazima atambue CPU, RAM, hifadhi, PSU, na motherboard. RAM ni kumbukumbu ya kazi; SSD/HDD ni hifadhi ya kudumu.',
  estimatedMinutes: 9,
  cdaccUnitId: 'CU/ICT/CR/01/5',
  examDomain: 'CDACC ICT Technician — Computer Repair',
  exercises: [
    matchPairs(
      'tvet-hw-q1',
      'Match each component to its role.',
      [
        { leftId: 'ram', left: 'RAM', rightId: 'volatile', right: 'Volatile working memory' },
        { leftId: 'ssd', left: 'SSD', rightId: 'storage', right: 'Persistent storage' },
        { leftId: 'psu', left: 'PSU', rightId: 'power', right: 'Converts AC to DC rails' },
        { leftId: 'cpu', left: 'CPU', rightId: 'execute', right: 'Executes instructions' },
      ],
      'Think: forget on power-off vs keep files.',
      'RAM loses data at power-off. Storage keeps the OS and user files. The PSU feeds DC to the board; the CPU executes code.'
    ),
    mcq(
      'tvet-hw-q2',
      'A PC powers fans but never beeps or shows a logo. Which check is most useful next?',
      [
        'Reinstall Microsoft Office',
        'Reseat RAM and confirm motherboard power connectors',
        'Buy a new monitor immediately',
        'Format the SSD',
      ],
      'b',
      'No POST usually means power, CPU, or memory — not applications.',
      'If the machine never posts, start with 24-pin/8-pin power, CPU seating, and RAM. Software cannot run yet.'
    ),
    fillBlank(
      'tvet-hw-q3',
      'The firmware that initialises hardware before the operating system loads is the ___.',
      'BIOS',
      'UEFI is the modern equivalent; either name is used in many TVET papers. We accept BIOS here.',
      'BIOS/UEFI runs power-on self-test and then hands control to the bootloader.'
    ),
    scenario(
      'tvet-hw-q4',
      'A college lab PC suddenly shuts down under load and smells hot. PSU rails were never tested. What should you do?',
      [
        'Keep running Prime95 to confirm',
        'Replace RAM first because it is cheapest',
        'Stop the test, check ventilation and measure PSU voltages before swapping parts',
        'Install a second operating system',
      ],
      'c',
      'Heat plus shutdown points to power or cooling.',
      'Technicians measure 12V/5V/3.3V, clean dust, and confirm the CPU cooler is seated before gambling on random replacements.'
    ),
  ],
});

export const tvetOperatingSystems = makeLesson({
  id: 'tvet-operating-systems-1',
  courseId: 'operating-systems',
  title: 'Operating systems for technicians',
  titleSw: 'Mifumo ya uendeshaji kwa mafundi',
  briefing:
    'Windows and Linux both manage users, files, processes, and devices. You should know how to create a standard user (not everything as Administrator/root), check disk health, and read Task Manager or `top` when a PC is slow. File permissions protect exam servers and college records — they are not optional decoration.',
  briefingSw:
    'Windows na Linux husimamia watumiaji, faili, na vifaa. Tumia akaunti ya kawaida, kagua diski, na fahamu ruhusa za faili.',
  estimatedMinutes: 8,
  cdaccUnitId: 'CU/ICT/OS/LX/01/5',
  examDomain: 'CDACC ICT Technician — Systems Support',
  exercises: [
    mcq(
      'tvet-os-q1',
      'Why should a workshop technician avoid daily work as Administrator or root?',
      [
        'It makes the PC boot faster',
        'Malware and mistakes then inherit full system rights',
        'Microsoft Office will not install otherwise',
        'RAM cannot be upgraded',
      ],
      'b',
      'Least privilege is a core TVET and security control.',
      'A compromised or mistaken admin session can wipe disks, dump passwords, and disable AV. Use a standard account plus elevation when needed.'
    ),
    fillBlank(
      'tvet-os-q2',
      'On Linux, the command that prints the current directory is ___.',
      'pwd',
      'Print working directory.',
      'pwd shows where you are; ls lists files; cd changes directory.'
    ),
    matchPairs(
      'tvet-os-q3',
      'Match the tool to the job.',
      [
        { leftId: 'taskmgr', left: 'Task Manager', rightId: 'processes', right: 'Inspect Windows processes and startup' },
        { leftId: 'diskmgmt', left: 'Disk Management', rightId: 'volumes', right: 'Create and format volumes' },
        { leftId: 'eventvwr', left: 'Event Viewer', rightId: 'logs', right: 'Read system and application logs' },
      ],
      'Slow PC vs new partition vs crash history.',
      'Task Manager is live resource use; Disk Management is storage layout; Event Viewer is historical errors.'
    ),
    scenario(
      'tvet-os-q4',
      'A campus PC is full. Users dump downloads on the C: drive. What is the professional fix?',
      [
        'Delete the Windows folder',
        'Move user data to a data partition or shared drive and educate users',
        'Disable the page file forever',
        'Install a second BIOS',
      ],
      'b',
      'Do not destroy the OS to free space.',
      'Technicians relocate data, clean temp files carefully, and set policies. Deleting system folders creates a bigger outage.'
    ),
  ],
});

export const tvetComputerNetworks = makeLesson({
  id: 'tvet-computer-networks-1',
  courseId: 'computer-networks',
  title: 'Cables, IP addressing, and LAN devices',
  titleSw: 'Nyaya, anwani za IP, na vifaa vya LAN',
  briefing:
    'TVET networking starts with copper and Wi-Fi you can touch: RJ45, switches, routers, and IPv4. A switch forwards frames inside a LAN using MAC addresses. A router forwards packets between networks using IP. Private ranges such as 192.168.0.0/16 are for LANs; they are not routable on the public internet without NAT.',
  briefingSw:
    'Mitandao ya TVET huanza na RJ45, switch, router, na IPv4. Switch hutumia MAC ndani ya LAN; router hutumia IP kati ya mitandao.',
  estimatedMinutes: 10,
  cdaccUnitId: 'CU/ICT/CS/CR/01/6',
  examDomain: 'CDACC ICT Technician — Computer Networks',
  exercises: [
    mcq(
      'tvet-net-q1',
      'Which device is primarily responsible for forwarding frames inside one LAN?',
      ['Router', 'Switch', 'Modem only', 'Printer'],
      'b',
      'Think MAC addresses, not internet links.',
      'Switches learn MAC addresses and forward Ethernet frames. Routers make IP decisions between networks.'
    ),
    fillBlank(
      'tvet-net-q2',
      'The connector used on a typical Cat6 Ethernet patch cord is ___.',
      'RJ45',
      'Eight pins, plastic clip.',
      'RJ45 terminates twisted-pair Ethernet. Poor crimps cause intermittent lab failures.'
    ),
    matchPairs(
      'tvet-net-q3',
      'Match the address type to what it identifies.',
      [
        { leftId: 'mac', left: 'MAC address', rightId: 'nic', right: 'A specific network interface' },
        { leftId: 'ipv4', left: 'IPv4 address', rightId: 'hostnet', right: 'A host on an IP network' },
        { leftId: 'port', left: 'TCP port', rightId: 'service', right: 'An application service on a host' },
      ],
      'Hardware vs network vs process.',
      'MAC is L2 identity, IP is L3 location, ports distinguish services such as 80/443.'
    ),
    scenario(
      'tvet-net-q4',
      'A new office PC has IP 192.168.1.50 but cannot reach the internet. The default gateway is blank. What should you configure?',
      [
        'The MAC address of Google',
        'The LAN router IP as default gateway, plus DNS',
        'A public IP on every printer',
        'Disable the switch',
      ],
      'b',
      'No gateway means no path off the LAN.',
      'The default gateway is the router that NAT/firewalls traffic to the WAN. DNS then resolves names such as safaricom.co.ke.'
    ),
  ],
});
