from __future__ import annotations

"""
CDACC TVET Unit Database
========================
Kenya National Qualifications Authority (KNQA) / CDACC (Curriculum Development, Assessment and
Certification Council) — Competency-Based Education and Training (CBET) unit registry.

This module provides:
  - A typed registry of Kenya TVET occupational standard units for ICT / Cybersecurity.
  - A `lookup_unit()` function for unit validation and enrichment.
  - A `map_lesson_to_units()` function aligning CyberLearn lessons to CDACC units.
  - A `validate_cdacc_alignment()` function used by the CMS validator to enforce coverage.

Reference:
  CDACC Unit code format:  CU / <Sector> / <SubSector> / <Unit-Type> / <Sequential-No> / <KNQA-Level>
  Sectors used:  ICT  (Information and Communication Technology)
  KNQA Levels:  1–8  (1=Elementary, 3=Certificate, 5=Diploma, 6=Advanced Diploma, 8=PhD equivalent)
"""

import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass(frozen=True)
class CDACCUnit:
    """A single CDACC TVET occupational standard unit."""
    unit_id: str           # e.g. "CU/ICT/CS/CR/01/6"
    title: str             # Full unit title
    knqa_level: int        # 1–8
    sector: str            # e.g. "ICT"
    sub_sector: str        # e.g. "CS" = Cyber Security
    unit_type: str         # e.g. "CR" = Core | "EL" = Elective | "FD" = Foundation
    description: str
    learning_outcomes: list[str] = field(default_factory=list)
    performance_criteria: list[str] = field(default_factory=list)
    suggested_cyberlearn_lessons: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Kenya ICT / Cyber Security TVET Unit Registry
# Aligned to CDACC Cybersecurity Technician & Cybersecurity Specialist qualifications
# ---------------------------------------------------------------------------

CDACC_UNIT_REGISTRY: list[CDACCUnit] = [

    # ─── Foundation Units (FD) ───────────────────────────────────────────────
    CDACCUnit(
        unit_id="CU/ICT/CS/FD/01/3",
        title="Understand Digital Infrastructure Concepts",
        knqa_level=3,
        sector="ICT",
        sub_sector="CS",
        unit_type="FD",
        description="Introduces learners to the five layers of digital infrastructure: power grids, "
                    "communications networks, computing systems, databases, and applications. Covers "
                    "dependencies, failure cascades, and the role of defenders.",
        learning_outcomes=[
            "Describe the five layers of digital infrastructure and their interdependencies.",
            "Explain how failure in one layer cascades to higher layers.",
            "Identify real-world examples of infrastructure-level cyberattacks.",
        ],
        performance_criteria=[
            "Correctly maps at least 4 of 5 infrastructure layers with examples.",
            "Describes the 2016 Ukraine power-grid attack cause-and-effect chain.",
            "Lists two defences for each infrastructure layer.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-1-1", "rebuild-000-1-3"],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/FD/02/3",
        title="Apply Digital Citizenship and Ethical Conduct",
        knqa_level=3,
        sector="ICT",
        sub_sector="CS",
        unit_type="FD",
        description="Covers responsible use of digital tools, privacy rights, legal obligations under "
                    "the Kenya Computer Misuse and Cyber Crimes Act 2018, and ethical reporting of vulnerabilities.",
        learning_outcomes=[
            "Identify user rights and obligations under the Kenya Computer Misuse and Cyber Crimes Act 2018.",
            "Demonstrate responsible disclosure of security vulnerabilities.",
            "Apply ethical principles when handling personal data and system access.",
        ],
        performance_criteria=[
            "States minimum 3 offences defined by the Kenya Cyber Crimes Act.",
            "Correctly classifies a given scenario as ethical or unethical with justification.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-1-1"],
    ),

    # ─── Core Units (CR) ────────────────────────────────────────────────────
    CDACCUnit(
        unit_id="CU/ICT/CS/CR/01/6",
        title="Perform Network Security Assessment",
        knqa_level=6,
        sector="ICT",
        sub_sector="CS",
        unit_type="CR",
        description="Learner performs end-to-end network security assessment including reconnaissance, "
                    "vulnerability scanning, exploitation testing in a controlled lab, and reporting.",
        learning_outcomes=[
            "Conduct passive and active reconnaissance using industry tools.",
            "Identify and classify network vulnerabilities using CVSS scoring.",
            "Produce a structured penetration test report with remediation recommendations.",
        ],
        performance_criteria=[
            "Successfully maps a simulated network topology with all live hosts identified.",
            "Identifies at least 3 CVSS-High vulnerabilities with correct CVSS scores.",
            "Generates a penetration test report meeting PTES standard structure.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-2-1"],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/CR/02/4",
        title="Implement Endpoint and Access Controls",
        knqa_level=4,
        sector="ICT",
        sub_sector="CS",
        unit_type="CR",
        description="Covers password policies, multi-factor authentication, device hardening, "
                    "least privilege principles, and monitoring of endpoint security events.",
        learning_outcomes=[
            "Configure strong password policies and account lockout thresholds.",
            "Enable and verify multi-factor authentication on cloud and enterprise accounts.",
            "Apply the principle of least privilege to user and service accounts.",
        ],
        performance_criteria=[
            "Configures password policy meeting NCSC guidelines (14+ chars, no reuse).",
            "Enables MFA using TOTP authenticator on a test account and verifies recovery codes.",
            "Produces a least-privilege role matrix for a 3-tier web application.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-3-1", "rebuild-000-3-5"],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/CR/03/4",
        title="Identify and Respond to Phishing and Social Engineering",
        knqa_level=4,
        sector="ICT",
        sub_sector="CS",
        unit_type="CR",
        description="Learner identifies phishing emails, smishing, vishing, and spear-phishing tactics. "
                    "Covers incident response workflows, user awareness training, and technical controls.",
        learning_outcomes=[
            "Analyse email headers to identify spoofed sender domains and lookalike URLs.",
            "Apply DMARC, DKIM, and SPF records to prevent domain spoofing.",
            "Design a user awareness training module for phishing red-flags.",
        ],
        performance_criteria=[
            "Correctly identifies lookalike domain in 5/5 test phishing samples.",
            "Verifies SPF and DKIM records on a configured test domain.",
            "Produces a one-page phishing incident response runbook.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-3-2"],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/CR/04/5",
        title="Conduct Web Application Security Testing",
        knqa_level=5,
        sector="ICT",
        sub_sector="CS",
        unit_type="CR",
        description="Covers OWASP Top-10 vulnerabilities including SQL injection, XSS, CSRF, SSRF, "
                    "and insecure direct object references. Practical lab using DVWA or OWASP WebGoat.",
        learning_outcomes=[
            "Exploit and remediate SQL injection vulnerabilities in a controlled environment.",
            "Identify XSS vectors and implement Content Security Policy headers.",
            "Map OWASP Top-10 findings to remediation controls.",
        ],
        performance_criteria=[
            "Extracts DB version string via SQL injection in lab environment.",
            "Implements CSP header preventing reflected XSS payload execution.",
            "Completes OWASP Top-10 assessment report for a sample web application.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-2-1"],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/CR/05/5",
        title="Monitor and Analyse Security Events",
        knqa_level=5,
        sector="ICT",
        sub_sector="CS",
        unit_type="CR",
        description="SIEM configuration, log analysis, alert triage, network traffic analysis with "
                    "Wireshark/Zeek, and creating incident response playbooks.",
        learning_outcomes=[
            "Ingest and parse security logs from multiple sources into a SIEM.",
            "Write SIEM correlation rules to detect brute-force and lateral movement.",
            "Perform packet-level analysis of a PCAP to identify C2 traffic.",
        ],
        performance_criteria=[
            "Configures at least 2 log sources in a SIEM and verifies event ingestion.",
            "Creates brute-force detection rule with < 5% false-positive rate on test data.",
            "Identifies C2 beacon IP and protocol in a supplied PCAP within 10 minutes.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-2-3"],
    ),

    # ─── Elective Units (EL) ────────────────────────────────────────────────
    CDACCUnit(
        unit_id="CU/ICT/CS/EL/01/5",
        title="Implement Cloud Security Controls",
        knqa_level=5,
        sector="ICT",
        sub_sector="CS",
        unit_type="EL",
        description="Cloud shared responsibility model, IAM policies (AWS/GCP/Azure), encryption at "
                    "rest and in transit, cloud-native security tooling, and compliance posture.",
        learning_outcomes=[
            "Configure IAM roles and policies following least-privilege for a cloud workload.",
            "Enable encryption at rest and in transit for cloud storage and databases.",
            "Use cloud-native security services (GuardDuty, Security Command Center, Defender) to detect threats.",
        ],
        performance_criteria=[
            "Produces an IAM policy in JSON/YAML with no wildcard permissions.",
            "Enables S3 bucket encryption and verifies no public access settings.",
            "Configures a cloud security finding alert and demonstrates notification pathway.",
        ],
        suggested_cyberlearn_lessons=[],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/EL/02/4",
        title="Apply Linux System Hardening",
        knqa_level=4,
        sector="ICT",
        sub_sector="CS",
        unit_type="EL",
        description="Covers file system permissions, user privilege management, SSH hardening, "
                    "firewall rules (iptables/ufw), and auditd log configuration on Ubuntu/Kali Linux.",
        learning_outcomes=[
            "Configure minimal file system permissions following the principle of least privilege.",
            "Harden SSH daemon configuration (disable root login, key-based auth, port change).",
            "Configure ufw firewall rules and verify with nmap.",
        ],
        performance_criteria=[
            "Sets SUID bits only on required binaries in a test environment.",
            "SSH config passes CIS Benchmark Level 1 hardening checks.",
            "ufw rules deny all inbound except specified ports, verified by external nmap scan.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-3-3"],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/EL/03/6",
        title="Conduct Digital Forensics and Incident Response",
        knqa_level=6,
        sector="ICT",
        sub_sector="CS",
        unit_type="EL",
        description="Chain of custody, disk imaging, memory forensics with Volatility, log timeline "
                    "reconstruction, and producing an incident report meeting evidence standards.",
        learning_outcomes=[
            "Acquire a forensic disk image preserving hash integrity.",
            "Extract running process and network connection artefacts from a memory dump.",
            "Construct a timeline of attacker actions from log files and artefacts.",
        ],
        performance_criteria=[
            "dd/dcfldd image verified with matching MD5 and SHA256 checksums.",
            "Volatility output correctly identifies malicious process injected into explorer.exe.",
            "Produces incident timeline accurate to within 5-minute windows from supplied logs.",
        ],
        suggested_cyberlearn_lessons=[],
    ),

    CDACCUnit(
        unit_id="CU/ICT/CS/EL/04/3",
        title="Use Cryptography for Data Protection",
        knqa_level=3,
        sector="ICT",
        sub_sector="CS",
        unit_type="EL",
        description="Symmetric and asymmetric encryption, hashing, digital signatures, TLS/SSL "
                    "handshake, certificate management, and public key infrastructure basics.",
        learning_outcomes=[
            "Distinguish between symmetric (AES) and asymmetric (RSA, ECC) encryption schemes.",
            "Generate a self-signed TLS certificate and verify its chain.",
            "Explain how digital signatures ensure integrity and non-repudiation.",
        ],
        performance_criteria=[
            "Correctly identifies algorithm type for 5/5 given ciphertext/key samples.",
            "Generates a valid self-signed certificate viewable in browser with correct SAN.",
            "Produces a sequence diagram of TLS 1.3 handshake with correct message order.",
        ],
        suggested_cyberlearn_lessons=["rebuild-000-3-4"],
    ),
]


# ---------------------------------------------------------------------------
# Lookup helpers
# ---------------------------------------------------------------------------

_REGISTRY_BY_ID: dict[str, CDACCUnit] = {u.unit_id: u for u in CDACC_UNIT_REGISTRY}
_REGISTRY_BY_LESSON: dict[str, list[CDACCUnit]] = {}
for _unit in CDACC_UNIT_REGISTRY:
    for _lid in _unit.suggested_cyberlearn_lessons:
        _REGISTRY_BY_LESSON.setdefault(_lid, []).append(_unit)


def lookup_unit(unit_id: str) -> Optional[CDACCUnit]:
    """Return CDACCUnit for the given ID, or None if not registered."""
    return _REGISTRY_BY_ID.get(unit_id)


def lookup_units_for_lesson(lesson_id: str) -> list[CDACCUnit]:
    """Return all CDACC units suggested for the given CyberLearn lesson ID."""
    return _REGISTRY_BY_LESSON.get(lesson_id, [])


def all_unit_ids() -> set[str]:
    """Return all registered CDACC unit IDs."""
    return set(_REGISTRY_BY_ID.keys())


def units_by_level(knqa_level: int) -> list[CDACCUnit]:
    """Return all units at a specific KNQA level."""
    return [u for u in CDACC_UNIT_REGISTRY if u.knqa_level == knqa_level]


def units_by_type(unit_type: str) -> list[CDACCUnit]:
    """Return all units matching the given unit_type code (FD, CR, EL)."""
    return [u for u in CDACC_UNIT_REGISTRY if u.unit_type == unit_type.upper()]


# ---------------------------------------------------------------------------
# Alignment validation for CMS
# ---------------------------------------------------------------------------

@dataclass
class CDACCAlignmentResult:
    """Result of CDACC alignment check for a lesson or catalogue."""
    unit_id: str
    unit_found: bool
    unit: Optional[CDACCUnit]
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0


# CU/ICT/CS/CR/01/6, or with the sector prefix the CDACC ICT curriculum prints: IT/CU/ICT/CR/4/5.
CDACC_UNIT_REGEX = re.compile(r"^([A-Z]{2,4}/)?(CU|[A-Z]{2,4}/OS)/[A-Z]{2,4}(/[A-Z]{2,4})?/[A-Z]{2,4}/\d{1,2}/\d$")


def validate_cdacc_alignment(lesson_id: str, cdacc_unit_id: Optional[str]) -> CDACCAlignmentResult:
    """
    Validate that a CyberLearn lesson's declared CDACC unit ID is:
      1. Correctly formatted.
      2. Registered in the CDACC unit database.
      3. Consistent — the unit references the lesson in its suggested_cyberlearn_lessons.
    """

    if not cdacc_unit_id:
        return CDACCAlignmentResult(
            unit_id="",
            unit_found=False,
            unit=None,
            warnings=["No cdacc_unit_id declared — lesson not mapped to any CDACC occupational standard."],
        )

    result = CDACCAlignmentResult(unit_id=cdacc_unit_id, unit_found=False, unit=None)

    # Format check
    if not CDACC_UNIT_REGEX.match(cdacc_unit_id):
        result.errors.append(
            f"CDACC unit ID '{cdacc_unit_id}' does not match standard format [<SECTOR>/]CU/<SECTOR>[/<SUB>]/<TYPE>/<NN>/<L>"
        )
        return result

    # Registry lookup
    unit = lookup_unit(cdacc_unit_id)
    if unit is None:
        result.warnings.append(
            f"CDACC unit '{cdacc_unit_id}' is valid format but not found in CyberLearn CDACC registry. "
            "Add it to apps/cms-tools/src/cdacc_database.py or verify the unit code."
        )
        return result

    result.unit_found = True
    result.unit = unit

    # Bidirectional consistency check
    if lesson_id and lesson_id not in unit.suggested_cyberlearn_lessons:
        result.warnings.append(
            f"Lesson '{lesson_id}' maps to CDACC unit '{cdacc_unit_id}' ('{unit.title}'), "
            "but this unit does not list the lesson in suggested_cyberlearn_lessons. "
            "Update the registry for full bidirectional traceability."
        )

    return result
