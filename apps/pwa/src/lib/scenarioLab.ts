import type { Lesson } from '@cyberlearn/types';

export interface ScenarioLab {
  setting: string;
  incident: string;
  evidence: string[];
  constraints: string[];
  workflow: string[];
  deliverable: string;
}

type Template = Omit<ScenarioLab, 'incident'>;

const automotive: Template = {
  setting: 'You are the responsible technician in a busy garage. The customer needs a dependable repair, but the vehicle cannot leave with an unverified safety, cooling, or structural fault.',
  evidence: [
    'Complaint, failure history, warning lamps, fluid loss, impact or overheating history',
    'Manufacturer limits for pressure, torque, run-out, thickness, fluid and material',
    'Measured tester results and condition of related systems that can cause the same symptom',
  ],
  constraints: [
    'Control heat, pressure, lifting, spring, fuel and electrical hazards before inspection',
    'Do not disguise damage with sealant, paint, excess balance weight or a larger cap/fuse',
    'Refer machining, alloy welding and safety-critical work beyond your competence',
  ],
  workflow: [
    'Confirm the complaint and make the vehicle safe.',
    'List three plausible causes; test the least destructive and most likely first.',
    'Compare measurements with limits and classify repair, specialist referral or replacement.',
    'Repair to procedure, then repeat the original test and complete a controlled road test.',
  ],
  deliverable: 'Job card with complaint, measurements, diagnosis, decision, repair, final test, parts/warranty and customer advice.',
};

const workshop: Template = {
  setting: 'A client has ordered work that must remain safe and serviceable after handover. You are responsible for matching the drawing, material and occupational standard—not only appearance.',
  evidence: [
    'Latest drawing/specification, dimensions, material grade, load and acceptance tolerance',
    'Tool settings, machine guards, PPE, fit-up/set-out and environmental conditions',
    'In-process measurements and final visual, dimensional and functional tests',
  ],
  constraints: [
    'Isolate energy and control fire, fumes, dust, sharp tools, height and bystander risk',
    'Do not hide cracks, poor fusion, wrong grain, weak joints or dimensional error under finishes',
    'Stop when material, drawing or damage is outside the approved procedure',
  ],
  workflow: [
    'Interpret the job and mark the safety and quality hold points.',
    'Set out and verify material, dimensions, tools and a sample where useful.',
    'Perform in a controlled sequence with repeated measurements.',
    'Correct defects while accessible, test to the specification and document handover.',
  ],
  deliverable: 'Quality sheet with drawing revision, materials, settings, measurements, defects/corrections, final test and acceptance.',
};

const utilities: Template = {
  setting: 'A household, school or clinic depends on this installation. Your work must prevent shock, fire, flooding, contamination, disease and hidden future failure.',
  evidence: [
    'Drawing, loads/flow, routes, isolation points, environment and equipment ratings',
    'Cable, pipe or component size; protection, support, earthing/backflow, access and manufacturer data',
    'Dead/pressure/flow/insulation/function test results recorded with the instrument used',
  ],
  constraints: [
    'Isolate, lock/tag and prove safe before opening the system',
    'Never bypass protection, cross-connect foul and potable water, or conceal untested work',
    'Escalate licensed, confined-space or specialist work outside your authority',
  ],
  workflow: [
    'Survey the site and trace the real source of the complaint.',
    'Plan isolation, sizing, materials, sequence and test points.',
    'Install or repair with correct components, support, termination/joints and labels.',
    'Test before restoration, correct defects, update records and brief the user.',
  ],
  deliverable: 'Service certificate with system sketch, isolation, design values, materials, readings, defects, corrections and maintenance advice.',
};

const care: Template = {
  setting: 'You are supporting a person or community where a missed danger sign, hygiene failure or privacy breach could cause serious harm.',
  evidence: [
    'Identity, consent, reported concern, onset, relevant history and approved care/referral plan',
    'Objective observations measured correctly and changes from normal condition',
    'Environment, hygiene, nutrition/water, mobility, safeguarding and available support',
  ],
  constraints: [
    'Stay within scope: observe, support, provide trained first aid and refer—do not invent diagnosis or dose',
    'Protect dignity, consent and confidentiality while escalating immediate danger',
    'Use infection controls and avoid becoming a second casualty',
  ],
  workflow: [
    'Introduce yourself, gain consent and assess immediate danger.',
    'Gather objective observations using clean, maintained equipment.',
    'Recognise red flags and activate the approved referral pathway early.',
    'Monitor, give a structured handover and write factual confidential records.',
  ],
  deliverable: 'Time-stamped note with consent, findings, actions, escalation, response and confidentiality/safeguarding controls.',
};

const business: Template = {
  setting: 'You advise a small trade enterprise whose owner supports a household and employees. A choice that appears profitable can still destroy cash flow or expose them to fraud and debt.',
  evidence: [
    'Demand, price, capacity, job cost, contribution, fixed cost and break-even',
    'Cashbook, reconciliation, receivables/payables, stock and cash-flow forecast',
    'Loan total cost/DSCR or investment horizon, real return, fees, liquidity and regulator status',
  ],
  constraints: [
    'Separate business/personal money and never share PIN or trust payment screenshots alone',
    'Calculate total shillings, timing and downside—not only headline rate or return',
    'Treat guaranteed extreme returns, recruitment, urgency and secrecy as fraud warnings',
  ],
  workflow: [
    'Define the decision, goal, amount, horizon and risk owner.',
    'Build a base case from records and show the calculation.',
    'Stress-test lower sales, delayed cash, inflation, fees and failure.',
    'Compare alternatives, document controls and schedule a review against actual results.',
  ],
  deliverable: 'One-page decision memo with calculations, assumptions, alternatives, cash effect, risks, approval and review date.',
};

const technology: Template = {
  setting: 'You are the technician or first responder for a live organisation. Restore service without losing evidence, exposing data or creating a second fault.',
  evidence: [
    'Asset owner, requirement, architecture, configuration, identity and approved baseline',
    'Logs/errors with reliable timestamps plus cable, process, database or endpoint test results',
    'Recent changes, dependencies, threat/fault hypotheses and business impact',
  ],
  constraints: [
    'Use authorised access and least privilege; protect personal data, secrets and evidence',
    'Change one variable at a time and keep a tested backout or backup',
    'Do not hack back, pirate software, destroy evidence or conceal an unresolved fault',
  ],
  workflow: [
    'Confirm scope, symptom, owner and safety/security impact.',
    'Record current state and establish a testable theory.',
    'Test from simple/foundational layers upward and document each result.',
    'Correct root cause, retest the user workflow, update diagrams/logs and hand over.',
  ],
  deliverable: 'Technical report with symptom, evidence, theory, commands/tests, change, backout, final result and preventive action.',
};

function templateFor(lesson: Lesson): Template {
  const key = `${lesson.courseId} ${lesson.title} ${lesson.examDomain ?? ''}`;
  if (/automotive|body works|engine|brake|radiator|rim|vehicle/i.test(key)) return automotive;
  if (/enterprise|business|financial|loan|investment|commerce|entrepreneur/i.test(key)) return business;
  if (/health|caregiving|care|hygiene|sanitation|wash/i.test(key)) return care;
  if (/electrical|electronics|circuit|solar|plumb|water|drainage|rainwater/i.test(key)) return utilities;
  if (/cyber|security|linux|network|database|program|software|hardware|electronics|operating|web/i.test(key)) return technology;
  return workshop;
}

export function scenarioLabFor(lesson: Lesson): ScenarioLab {
  const scenario = lesson.exercises.find((exercise) => exercise.type === 'SCENARIO');
  const fallback = lesson.exercises.find((exercise) => exercise.prompt);
  return {
    ...templateFor(lesson),
    incident: scenario?.prompt ?? fallback?.prompt ?? `Complete ${lesson.title} to the stated safety and quality standard.`,
  };
}
