import type { TradeModule, TradeProgramme } from './build';

function module(
  slug: string,
  title: string,
  titleSw: string,
  description: string,
  briefing: string,
  term: string,
  answer: string,
  scenario: string
): TradeModule {
  return {
    slug,
    title,
    titleSw,
    description,
    minutes: 28,
    examDomain: 'Community-supporting trade practice',
    briefing,
    briefingSw: `${titleSw}: usalama, utaratibu sahihi, ukaguzi wa ubora, na huduma kwa jamii.`,
    questions: [
      {
        prompt: `Which action is the safest professional starting point for ${term}?`,
        options: [
          'Start immediately without inspecting the site or client',
          'Assess hazards and needs, select PPE/tools, explain the plan, then begin',
          'Copy a social-media clip without checking local conditions',
          'Let an untrained bystander make every technical decision',
        ],
        correct: 'b',
        hint: 'Plan before tools.',
        explanation: 'A competent craft worker assesses risk, scope, people, tools, and standards before starting.',
      },
      {
        prompt: `What is the strongest evidence that ${term} was completed well?`,
        options: [
          'The worker says it is fine',
          'A documented inspection or functional test against the job specification',
          'The cheapest material was used',
          'The work was hidden before testing',
        ],
        correct: 'b',
        hint: 'Test against a requirement.',
        explanation: 'Quality is demonstrated with a repeatable inspection, measurement, or functional test.',
      },
    ],
    blanks: [
      {
        prompt: `The documented check used to prove this work meets its requirements is a quality ___.`,
        answer,
        hint: 'A planned check, not an opinion.',
        explanation: `A quality ${answer} provides evidence for the client, trainer, and next technician.`,
      },
    ],
    practice: {
      prompt: scenario,
      options: [
        'Continue and conceal the problem',
        'Stop, make the area safe, explain the defect, correct it, then test and document',
        'Ask the client to sign before seeing the work',
        'Remove the safety device so the job appears complete',
      ],
      correct: 'b',
      hint: 'Safety and honesty before handover.',
      explanation: 'Community trades carry public consequences. Defects are corrected and tested, never concealed.',
    },
  };
}

export const solarProgramme: TradeProgramme = {
  id: 'solar-energy',
  title: 'Solar PV installation & maintenance',
  titleSw: 'Ufungaji na matengenezo ya solar',
  description:
    'Clean-energy skills for homes, schools, clinics, and micro-enterprises: site survey, array safety, batteries, commissioning, and maintenance.',
  descriptionSw: 'Solar kwa nyumba, shule, kliniki, na biashara: survey, betri, usalama, na matengenezo.',
  icon: '☀️',
  certificationTarget: 'TVET / EPRA-aligned solar PV foundation',
  modules: [
    module(
      'survey',
      'Week 1 — Site survey, demand, and solar resource',
      'Wiki 1 — Survey, matumizi, na jua',
      'Measure loads and shading before sizing panels or batteries.',
      'A solar system starts with a load audit, not a panel catalogue. List every appliance, its watts, hours per day, and surge current. Daily energy is watts × hours. Separate essential loads (clinic fridge, lights, router) from optional loads. Inspect the roof for orientation, shading from trees and water tanks, corrosion, wind exposure, access, and structural condition.\n\nUse a sun-path app or repeated observation, but verify on site. One shaded cell can reduce a whole string. Decide whether the project is off-grid, grid-tied, or hybrid; each has different protection and legal requirements. Record cable routes and distances because voltage drop determines conductor size.\n\nThe survey report includes client needs, load table, photos, risks, proposed equipment location, and an initial single-line diagram. Do not promise “24-hour power” before calculating worst-month generation and storage.',
      'a solar site survey',
      'audit',
      'The client adds an electric cooker after sizing and the inverter overloads every evening. What should the technician do?'
    ),
    module(
      'install',
      'Week 2 — DC safety, batteries, commissioning, and maintenance',
      'Wiki 2 — Usalama wa DC, betri, commissioning',
      'Isolate DC, protect strings, torque terminals, and prove performance before handover.',
      'Solar DC arcs do not pass through zero like AC and can persist. Cover modules or isolate strings using rated devices before working. Use DC-rated isolators, fuses, connectors, and cable. Never mix incompatible “MC4-style” brands unless the manufacturer approves them. Crimp with the correct tool and pull-test.\n\nBatteries store dangerous energy. Match chemistry and BMS settings; fuse close to the positive terminal; ventilate lead-acid banks; keep lithium batteries within manufacturer temperature limits. Torque lugs to specification and record it. Commission in the manufacturer’s order: polarity, insulation where required, open-circuit voltage, battery voltage, inverter settings, controlled load test, and monitoring.\n\nHandover includes shutdown/startup, expected daily limits, cleaning without standing on panels, and an emergency contact. Maintenance compares current output with baseline, checks hot/loose terminals, cleans safely, and records battery health.',
      'solar commissioning',
      'test',
      'During commissioning, a string polarity is reversed and the isolator crackles. What is the correct response?'
    ),
  ],
};

export const communityHealthProgramme: TradeProgramme = {
  id: 'community-health-support',
  title: 'Community health support',
  titleSw: 'Msaada wa afya ya jamii',
  description:
    'Ethical first-line community support: hygiene, vital signs, referral, health promotion, safeguarding, and confidential records.',
  descriptionSw: 'Usafi, vipimo, rufaa, elimu ya afya, ulinzi, na siri za mgonjwa.',
  icon: '🩺',
  certificationTarget: 'Community health support foundation — not a clinical licence',
  modules: [
    module(
      'hygiene',
      'Week 1 — Infection prevention and safe home visits',
      'Wiki 1 — Kuzuia maambukizi',
      'Hand hygiene, PPE, cleaning, sharps boundaries, consent, and confidentiality.',
      'Community support workers reduce harm but do not diagnose beyond their competence. Before a home visit, identify the household, explain your role, obtain consent, and protect privacy. Hand hygiene follows the moments taught by health authorities: before contact, before a clean task, after body-fluid risk, after contact, and after touching surroundings.\n\nSelect PPE for the task; gloves do not replace handwashing. Never recap or transport loose needles. Clean reusable equipment between households using the approved product and contact time. Separate clean and dirty items in the field bag. Record only what is necessary and do not discuss a client in a WhatsApp group without a lawful, approved process.\n\nRed flags—difficulty breathing, severe bleeding, altered consciousness, convulsions, chest pain, danger signs in pregnancy or a child—require urgent referral, not herbal advice or social-media diagnosis.',
      'infection prevention',
      'audit',
      'A neighbour asks you to post a patient’s wound photo in a public group to get advice. What should you do?'
    ),
    module(
      'screen-refer',
      'Week 2 — Basic observations, referral, and health promotion',
      'Wiki 2 — Vipimo, rufaa, na elimu',
      'Measure accurately, recognise danger signs, refer, and communicate without diagnosing.',
      'Basic observations include temperature, pulse, breathing rate, and blood pressure only when trained and using maintained equipment. Verify identity, explain the measurement, position the person correctly, record units, repeat an unexpected result, and clean the device. A number without context is not a diagnosis.\n\nUse approved referral pathways. State what you observed, when it began, relevant history volunteered by the client, and what first aid was given. Do not promise outcomes. Health promotion should be practical and respectful: safe water, immunisation information, nutrition, mosquito control, medication adherence, maternal danger signs, and clinic follow-up.\n\nSafeguarding concerns involving children, vulnerable adults, violence, or exploitation follow the institution’s escalation policy. Do not investigate alone or confront a suspected abuser in a way that increases danger.',
      'community referral',
      'check',
      'A client has severe breathing difficulty but asks you to keep the visit secret and leave. What should you do?'
    ),
  ],
};

export const caregivingProgramme: TradeProgramme = {
  id: 'caregiving-assistance',
  title: 'Caregiving & home assistance',
  titleSw: 'Ulezi na msaada wa nyumbani',
  description:
    'Dignified assistance for older people, persons with disabilities, and recovering clients: movement, hygiene, nutrition, records, and escalation.',
  descriptionSw: 'Msaada wenye heshima: movement, usafi, lishe, rekodi, na rufaa.',
  icon: '🤝',
  certificationTarget: 'Caregiving / home-based care foundation',
  modules: [
    module(
      'dignity',
      'Week 1 — Dignity, consent, safeguarding, and boundaries',
      'Wiki 1 — Heshima, ridhaa, na ulinzi',
      'Support choice and privacy while recognising neglect, abuse, and professional boundaries.',
      'Caregiving begins with the person, not the task list. Introduce yourself, explain each action, obtain consent, offer choices, and protect privacy during washing or dressing. Capacity can vary; follow the care plan and lawful representative process rather than assuming every older person cannot decide.\n\nProfessional boundaries protect both parties: do not borrow money, change a will, share photos, or accept control of mobile banking. Record gifts according to policy. Safeguarding signs include unexplained injury, fear, poor hygiene, missing medication, sudden financial change, or a caregiver who will not let the client speak.\n\nReport concerns through the designated channel and preserve immediate safety. Confidentiality does not mean hiding abuse or a medical emergency. Write objective observations—what you saw and heard—not accusations.',
      'a safeguarding concern',
      'check',
      'A relative asks you to withdraw money using the client’s PIN because “we always do it.” What should you do?'
    ),
    module(
      'mobility',
      'Week 2 — Safe mobility, personal care, nutrition, and records',
      'Wiki 2 — Movement salama, usafi, na lishe',
      'Assist without lifting dangerously; prevent pressure injury, dehydration, and medication errors.',
      'Use the mobility plan and the correct aid. Check brakes on wheelchairs, clear the route, fit footwear, and ask the person to participate. Do not lift a dependent adult alone because you are in a hurry; use a hoist or second trained worker where required. Reposition immobile clients on the schedule and inspect pressure areas without massaging damaged skin.\n\nPersonal care uses clean-to-dirty technique and protects dignity. Food and fluids follow prescribed texture, allergies, diabetes, and swallowing plans. Coughing, wet voice, or choking while eating is a stop-and-escalate sign. Medication assistance follows the care plan; never crush tablets or change doses without authority.\n\nThe daily record states intake, output if required, skin changes, mobility, mood, and incidents. Never pre-sign a task. A falsified care record puts a vulnerable person at risk.',
      'safe caregiving',
      'check',
      'A client starts coughing and has a wet voice during a meal. The schedule says they must finish. What should you do?'
    ),
  ],
};

export const wasteProgramme: TradeProgramme = {
  id: 'waste-recycling',
  title: 'Waste management & recycling',
  titleSw: 'Usimamizi wa taka na recycling',
  description:
    'Community collection, sorting, composting, material recovery, hazardous-waste boundaries, and circular micro-enterprise.',
  descriptionSw: 'Ukusanyaji, kutenganisha, compost, recycling, na biashara ya circular economy.',
  icon: '♻️',
  certificationTarget: 'Environmental literacy / waste recovery foundation',
  modules: [
    module(
      'sort',
      'Week 1 — Waste audit, segregation, and collection safety',
      'Wiki 1 — Ukaguzi na kutenganisha taka',
      'Separate organics, recyclables, residuals, medical, e-waste, and hazardous materials at source.',
      'Start with a waste audit: source, type, mass or volume, contamination, collection frequency, and destination. Segregate at source because a clean PET bottle has value and a PET bottle mixed with food and sharps is a hazard. Use locally understood labels and colours; train users and inspect bins.\n\nPPE depends on risk: gloves resistant to puncture, boots, high-visibility clothing, and respiratory protection where dust requires it. Never hand-sort closed bags that may contain needles. Medical waste, batteries, chemicals, oil, and e-waste need authorised routes; do not burn them in an open pit. Collection routes protect workers from traffic and overfilled containers.\n\nRecord weights and rejected loads. Data proves diversion from landfill and whether the enterprise is profitable.',
      'a waste audit',
      'audit',
      'A mixed bag contains a visible needle among bottles. A sorter is paid by the kilogram. What should happen?'
    ),
    module(
      'recover',
      'Week 2 — Compost, material recovery, and circular enterprise',
      'Wiki 2 — Compost, recovery, na biashara',
      'Control compost moisture and contamination; prepare clean materials for buyers and price the operation honestly.',
      'Compost needs carbon-rich browns, nitrogen-rich greens, moisture like a wrung sponge, oxygen, and time. Exclude batteries, glass, plastics, treated timber, meat where the system cannot manage it, and human waste unless a specialised process exists. Turn or aerate; record temperature where pathogen control is claimed.\n\nMaterial recovery: sort by buyer specification, remove contamination, bale or bundle safely, and store dry. Glass by colour where demanded; metals separated; e-waste sent to licensed handlers. Never heat wires to burn off insulation—the fumes poison workers and neighbours.\n\nBusiness records include input weight, recovery rate, labour, transport, buyer price, rejects, and PPE costs. Community benefit is real only if the enterprise is safe, lawful, and solvent.',
      'material recovery',
      'check',
      'A buyer offers more money if workers burn cable insulation to recover copper quickly. What should the supervisor do?'
    ),
  ],
};

export const waterProgramme: TradeProgramme = {
  id: 'water-sanitation-hygiene',
  title: 'Water, sanitation & hygiene (WASH)',
  titleSw: 'Maji, usafi wa mazingira na afya',
  description:
    'Safe-water chains, household treatment, sanitation inspection, handwashing stations, and community maintenance.',
  descriptionSw: 'Maji salama, treatment, ukaguzi wa vyoo, handwashing, na matengenezo ya jamii.',
  icon: '💧',
  certificationTarget: 'WASH community technician foundation',
  modules: [
    module(
      'safe-water',
      'Week 1 — Safe-water chain from source to cup',
      'Wiki 1 — Maji salama kutoka chanzo hadi kikombe',
      'Protect the source, transport cleanly, treat correctly, store covered, and prevent recontamination.',
      'Safe water can become unsafe after treatment. Inspect the source for latrines uphill, animal access, flood paths, cracked aprons, and standing water. Collect with clean containers that are not dipped by dirty cups. Household treatment may use boiling, approved chlorine dose/contact time, or filtration—follow public-health guidance and product instructions.\n\nChlorine is not guessed by smell. Dose depends on concentration, turbidity, and volume. Very cloudy water may need settling and filtration first. Store treated water in a covered, narrow-neck container with a tap. Do not put hands or cups inside.\n\nA sanitary inspection records hazards and corrective actions. Water testing and health authorities confirm microbiological safety; a clear-looking spring is not proof.',
      'safe water treatment',
      'check',
      'A household treats water correctly, then scoops it with an unwashed communal cup. What should change?'
    ),
    module(
      'sanitation',
      'Week 2 — Sanitation inspection and handwashing facilities',
      'Wiki 2 — Ukaguzi wa vyoo na handwashing',
      'Keep excreta away from people and water; build maintainable handwashing and report unsafe pits.',
      'Sanitation breaks faecal–oral transmission. Inspect the slab for cracks, privacy and safety, flies/odour, a washable surface, a child-safe opening, and distance from water sources according to local public-health rules. A full, collapsing, or flood-prone pit is an emergency to isolate and escalate—not a place for a trainee to enter.\n\nHandwashing stations need reliable water, soap or approved alternative, drainage that does not form a mosquito pool, and a design children and persons with disabilities can use. Tippy taps work only if refilled and repaired. Assign responsibility.\n\nFaecal sludge emptying requires trained, equipped operators and lawful disposal. Never enter a pit or septic tank: toxic gases and oxygen deficiency kill rescuers too.',
      'a sanitation inspection',
      'check',
      'A pit latrine wall is cracking after rain and children still use it. What is the correct immediate response?'
    ),
  ],
};

export const digitalEnterpriseProgramme: TradeProgramme = {
  id: 'digital-enterprise',
  title: 'Digital enterprise & cooperative commerce',
  titleSw: 'Biashara ya kidijitali na ushirika',
  description:
    'Help artisans sell safely: costing, mobile-money controls, product photography, customer records, and cooperative fulfilment.',
  descriptionSw: 'Gharama, M-Pesa salama, picha za bidhaa, rekodi za wateja, na mauzo ya ushirika.',
  icon: '📱',
  certificationTarget: 'Digital entrepreneurship foundation',
  modules: [
    module(
      'costing',
      'Week 1 — Costing, pricing, records, and mobile-money controls',
      'Wiki 1 — Gharama, bei, rekodi, na M-Pesa',
      'Price labour and overhead honestly; reconcile payments without sharing PINs or OTPs.',
      'A trade enterprise fails when price covers materials but not labour, rent, electricity, transport, defects, and tool replacement. Build a job-cost sheet: direct material, direct labour hours, overhead allocation, contingency, then margin. Cash received is not profit. Record deposits and balances against a numbered job card.\n\nMobile-money security: separate business and personal till where possible, never share PIN/OTP, verify prompts on the handset, and reconcile the platform statement to the sales book. A screenshot is not final proof if the handset did not receive the transaction. Refunds follow a controlled process.\n\nCustomer records contain personal data. Collect only what fulfilment requires, protect it, and set a retention period. Kenya DPA applies to a tailor’s WhatsApp list too.',
      'a job-cost sheet',
      'audit',
      'A customer sends a fake M-Pesa screenshot and pressures the apprentice to release a finished gate. What should happen?'
    ),
    module(
      'market',
      'Week 2 — Product media, truthful marketing, and cooperative fulfilment',
      'Wiki 2 — Picha, matangazo ya kweli, na ushirika',
      'Create useful product listings, protect client privacy, and organise reliable shared production.',
      'A product listing needs clear light, neutral background, scale, multiple angles, material, dimensions, lead time, delivery area, care, and truthful price. Ask permission before showing a client, vehicle plate, house location, or child. Do not claim “CDACC certified” unless the product or worker actually holds that status.\n\nCooperative selling lets small workshops share photography, buying, transport, and large orders. Define who owns the customer, quality standard, payment split, deadlines, returns, and dispute process before accepting money. Use a sample and checklist so five tailors produce one uniform standard.\n\nMeasure conversion, returns, late jobs, and customer complaints—not only likes. A business serves society when it delivers what it promised and pays contributors transparently.',
      'a product listing',
      'check',
      'A cooperative receives a 500-uniform order but has no shared size chart or quality sample. What should happen before cutting?'
    ),
    {
      slug: 'management',
      title: 'Week 3 — Business model, operations, people, and customer systems',
      titleSw: 'Wiki 3 — Business model na usimamizi',
      description: 'Turn a craft into a managed business with clear customers, workflow, stock control, roles, and service standards.',
      minutes: 34,
      examDomain: 'Entrepreneurship — business management',
      briefing:
        'A business model explains who the customer is, what problem you solve, why they choose you, how you deliver, and how money remains after costs. “I repair cars” is too broad. “Same-day cooling-system diagnosis for matatu operators, with written pressure-test results” is a defined offer. Validate demand by interviewing customers, observing current alternatives, and testing a small paid service—not by asking friends whether they like the logo.\n\nOperations turn promises into repeatable work. Map enquiry → inspection → quotation → deposit → job card → quality test → balance → handover → aftercare. Set capacity: productive hours, bay or machine availability, and lead time. Work in progress that sits waiting for parts ties up cash. Use reorder levels for fast-moving stock, approve suppliers by quality and delivery, and count inventory regularly. Separate customer parts from business stock and label every job.\n\nPeople management requires job descriptions, safe induction, fair schedules, task supervision, feedback, and records. Do not call every worker an “independent contractor” to avoid lawful obligations. Separate duties where possible: the person receiving cash should not alone alter invoices and reconcile the till. Owner withdrawals are drawings, not wages hidden inside material cost.\n\nCustomer management: quote scope, exclusions, time, price, warranty, and approval for additional work. Complaints become data. Track on-time delivery, rework, gross margin, stock loss, repeat customers, and safety incidents. A weekly 20-minute review of those numbers is management; shouting at apprentices after a late job is not.',
      briefingSw:
        'Eleza mteja, tatizo, value, delivery, na mapato. Tengeneza workflow kutoka quotation hadi handover. Dhibiti stock na reorder level. Job descriptions na usalama. Tenganisha cash, invoice, na reconciliation. Pima delivery, rework, margin, na complaints.',
      questions: [
        {
          prompt: 'Which is the clearest value proposition?',
          options: [
            'We do everything for everyone',
            'Documented same-day cooling-system diagnosis for local matatu operators',
            'Our workshop is blue',
            'We borrow money',
          ],
          correct: 'b',
          hint: 'Customer + problem + result.',
          explanation: 'A focused offer guides marketing, tools, staffing, price, and quality.',
        },
        {
          prompt: 'A reorder level exists to:',
          options: [
            'Buy all stock at once',
            'Trigger replenishment before expected demand uses the remaining stock',
            'Hide inventory theft',
            'Replace the job card',
          ],
          correct: 'b',
          hint: 'Demand during supplier lead time.',
          explanation: 'Reorder level considers usage, lead time, and safety stock.',
        },
        {
          prompt: 'Why separate cash receipt, invoice changes, and reconciliation?',
          options: [
            'To employ unnecessary people',
            'Segregation of duties reduces error and fraud',
            'Because customers cannot count',
            'To avoid keeping records',
          ],
          correct: 'b',
          hint: 'One person should not control the whole transaction.',
          explanation: 'Small businesses can use owner review, numbered receipts, and daily reconciliation as compensating controls.',
        },
        {
          prompt: 'The most useful weekly operations dashboard includes:',
          options: [
            'Social-media likes only',
            'On-time jobs, rework, margin, stock loss, cash due, and safety incidents',
            'The owner’s personal spending only',
            'Competitor rumours',
          ],
          correct: 'b',
          hint: 'Measures tied to delivery, quality, and money.',
          explanation: 'Management uses a few actionable indicators, not vanity metrics.',
        },
      ],
      blanks: [
        {
          prompt: 'The ordered path from customer enquiry through handover is a business ___.',
          answer: 'workflow',
          hint: 'A repeatable sequence.',
          explanation: 'A visible workflow prevents forgotten approvals, tests, and balances.',
        },
      ],
      practice: {
        prompt: 'A workshop accepts 20 jobs with capacity for 8, spends every deposit on old debts, and gives no completion dates. Best management correction?',
        options: [
          'Accept 20 more deposits',
          'Plan capacity, ring-fence job cash, issue realistic schedules, and track work-in-progress',
          'Stop writing job cards',
          'Hide unfinished vehicles',
        ],
        correct: 'b',
        hint: 'Capacity and cash control.',
        explanation: 'Overbooking plus misuse of deposits produces late jobs and insolvency even when sales look high.',
      },
      practical: {
        type: 'photo',
        prompt:
          'Create and upload one readable page showing your business workflow, named responsibilities, two quality gates, and the records produced at each stage.',
        rubric: [
          'Workflow begins with customer need and written quotation',
          'Deposit and additional-work approval are controlled',
          'At least two quality or safety checks appear',
          'Handover, payment balance, and aftercare are included',
        ],
      },
    },
    {
      slug: 'bookkeeping',
      title: 'Week 4 — Bookkeeping, profit, cash flow, and break-even',
      titleSw: 'Wiki 4 — Vitabu, faida, cash flow, na break-even',
      description: 'Read an income statement and cash forecast, reconcile records, calculate margin, and find the break-even point.',
      minutes: 36,
      examDomain: 'Financial literacy — records and cash flow',
      briefing:
        'Use separate business money. Record every sale, purchase, expense, owner contribution, withdrawal, amount owed by customers (receivables), and amount owed to suppliers (payables). Keep source documents: invoice, receipt, M-Pesa/bank statement, delivery note, payroll record. Reconcile the cashbook to actual cash and the mobile/bank statement; differences are investigated, not forced into “miscellaneous”.\n\nProfit is not cash. Income statement: revenue minus cost of sales gives gross profit; minus operating expenses gives net profit. A profitable business can fail when customers pay in 60 days but suppliers demand cash today. A cash-flow forecast places expected receipts and payments in the week/month they occur. Opening cash + inflows − outflows = closing cash. VAT or other tax collected is not the owner’s profit; keep it separate according to current KRA obligations and obtain qualified advice.\n\nContribution per unit = selling price − variable cost. Break-even units = fixed costs ÷ contribution per unit. Example: a welding shop charges KES 6,000 for a standard grill; steel, rods, paint, and direct piece labour are KES 3,500. Contribution is KES 2,500. If monthly fixed costs are KES 100,000, break-even is 40 grills. Below 40 the model loses money; above it each additional grill contributes KES 2,500 before tax and unusual costs.\n\nGross margin percentage = gross profit ÷ revenue × 100. Markup is profit ÷ cost; it is not the same. Price also includes waste, warranty/rework, payment fees, bad debts, and tool depreciation. Close books monthly: stock count, receivables age, supplier reconciliation, bank reconciliation, income statement, and next 13 weeks of cash.',
      briefingSw:
        'Tenganisha pesa ya biashara. Rekodi mauzo, gharama, drawings, receivables na payables. Profit si cash. Contribution = bei minus variable cost. Break-even = fixed costs / contribution. Reconcile cashbook na bank/M-Pesa. Tax si faida.',
      questions: [
        {
          prompt: 'A job sells for KES 10,000 and variable cost is KES 6,500. Its contribution is:',
          options: ['KES 16,500', 'KES 3,500', 'KES 6,500', '35 jobs'],
          correct: 'b',
          hint: 'Selling price minus variable cost.',
          explanation: 'The KES 3,500 first covers fixed costs; only the remainder after fixed costs is profit.',
        },
        {
          prompt: 'Fixed costs are KES 84,000 and contribution per service is KES 2,800. Break-even volume is:',
          options: ['30 services', '300 services', 'KES 81,200', 'No calculation possible'],
          correct: 'a',
          hint: '84,000 ÷ 2,800.',
          explanation: 'At 30 services, total contribution equals fixed costs. Tax and financing are considered separately.',
        },
        {
          prompt: 'A profitable company can run out of cash when:',
          options: [
            'Customers pay slowly while wages and suppliers are due now',
            'Gross profit is positive',
            'It reconciles the bank',
            'It keeps an emergency reserve',
          ],
          correct: 'a',
          hint: 'Timing.',
          explanation: 'Accrual profit records earned revenue; cash flow records when money actually moves.',
        },
        {
          prompt: 'Owner takes KES 20,000 for school fees. In the business books this is:',
          options: ['Material cost', 'Owner drawing, not a business operating expense', 'Sales revenue', 'Supplier credit'],
          correct: 'b',
          hint: 'Business and owner are separate for records.',
          explanation: 'Misclassifying drawings makes job costs and profit unreliable.',
        },
      ],
      blanks: [
        {
          prompt: 'Matching the cashbook to bank or M-Pesa statements and explaining differences is called ___.',
          answer: 'reconciliation',
          hint: 'Compare independent records.',
          explanation: 'Reconciliation catches missed fees, duplicate entries, fraud, and timing differences.',
        },
      ],
      practice: {
        prompt: 'Sales rise, but the business cannot buy materials because half the invoices are over 60 days unpaid. Best action?',
        options: [
          'Record more unpaid sales',
          'Age receivables, enforce deposits/credit terms, collect overdue accounts, and update the cash forecast',
          'Ignore supplier due dates',
          'Use payroll deductions without permission',
        ],
        correct: 'b',
        hint: 'Turn accounting profit into collected cash.',
        explanation: 'Credit control is part of operations and financial management.',
      },
      practical: {
        type: 'photo',
        prompt:
          'Prepare and upload a one-month sample cash-flow forecast with opening cash, weekly inflows/outflows, closing cash, and one action for any negative week.',
        rubric: [
          'Opening cash and timing periods are labelled',
          'Sales receipts are separated from sales made on credit',
          'Materials, wages, overhead, debt, and owner drawings are included',
          'Every period calculates a closing balance',
          'A realistic response to a cash shortfall is stated',
        ],
      },
    },
    {
      slug: 'loans',
      title: 'Week 5 — Loans: true cost, affordability, collateral, and debt traps',
      titleSw: 'Wiki 5 — Mikopo na gharama yake',
      description: 'Compare reducing-balance and flat-rate loans, calculate total repayment, test debt-service ability, and read the contract.',
      minutes: 38,
      examDomain: 'Financial literacy — responsible borrowing',
      briefing:
        'Borrow for a productive purpose with a repayment source—not because an app says “limit available”. Define the asset or working-capital gap, amount, timing, expected extra cash, and fallback. Compare SACCO, bank, asset finance, supplier credit, government programme, digital lender, and equity. The lowest instalment is not automatically cheapest; a longer term can produce a larger total cost.\n\nRead: principal, annual interest method, effective annual rate/APR where supplied, flat versus reducing balance, fees, insurance, taxes, grace period, instalment dates, late penalties, early-settlement charge, variable-rate clause, collateral, guarantor liability, and default process. Flat 12% on the original principal every year costs more than 12% on a reducing balance. Ask for the amortisation schedule and total amount payable in shillings.\n\nExample (simplified): borrow KES 120,000 for 12 months at 12% flat plus KES 3,000 fee. Interest = 120,000 × 12% = 14,400; total = 137,400; average instalment = 11,450. A reducing-balance offer at the same stated 12% produces less interest if there are no extra fees. Compare cash received after deducted fees as well as total paid.\n\nAffordability: debt-service coverage ratio (DSCR) = cash available for debt service ÷ required debt payments. A DSCR of 1.0 leaves no cushion; many businesses target above 1.2–1.5 depending on risk. Stress-test a 20% sales drop, delayed customer, exchange-rate increase, or machine downtime. Never borrow short-term expensive money to finance a long-term asset without a credible refinancing plan. Keep a debt register and pay on time to protect credit history.',
      briefingSw:
        'Kopa kwa matumizi yanayozalisha cash. Linganisha principal, flat/reducing, APR, fees, insurance, penalty, collateral na total payable. Flat 12% si sawa na reducing 12%. DSCR = cash ya kulipa deni / instalment. Stress-test mauzo yakishuka.',
      questions: [
        {
          prompt: 'KES 120,000 at 12% flat for one year plus KES 3,000 fee has simplified total repayment of:',
          options: ['KES 120,000', 'KES 134,400', 'KES 137,400', 'KES 14,400'],
          correct: 'c',
          hint: 'Principal + 14,400 interest + 3,000 fee.',
          explanation: 'Always compare the total shillings paid and cash actually received.',
        },
        {
          prompt: 'Why can a flat-rate loan cost more than a reducing-balance loan at the same stated rate?',
          options: [
            'Flat interest is calculated on the original principal throughout',
            'Reducing loans have no contracts',
            'Flat loans cannot have fees',
            'Reducing balance increases principal monthly',
          ],
          correct: 'a',
          hint: 'What balance attracts interest?',
          explanation: 'Reducing-balance interest falls as principal is repaid. Flat interest does not.',
        },
        {
          prompt: 'A business has KES 60,000 monthly cash available for debt and instalments of KES 50,000. DSCR is:',
          options: ['0.83', '1.2', '10', 'KES 110,000'],
          correct: 'b',
          hint: '60,000 ÷ 50,000.',
          explanation: '1.2 has a 20% cushion, but stress testing may show whether that is enough.',
        },
        {
          prompt: 'A guarantor should sign only after understanding:',
          options: [
            'The borrower’s social-media following',
            'That the guarantor may be required to repay and may risk savings/assets',
            'That guarantees are never enforced',
            'Only the first instalment',
          ],
          correct: 'b',
          hint: 'A guarantee is a legal obligation.',
          explanation: 'Independent advice may be appropriate before risking SACCO shares or property.',
        },
      ],
      blanks: [
        {
          prompt: 'The schedule showing how each instalment splits into interest and principal is an ___ schedule.',
          answer: 'amortisation',
          hint: 'Loan table over time.',
          explanation: 'It reveals the balance after each payment and the true interest pattern.',
        },
      ],
      practice: {
        prompt: 'Digital lender offers KES 50,000, deducts KES 5,000 upfront, and demands KES 60,000 in 30 days. Best decision process?',
        options: [
          'Accept because the advert says 20%',
          'Calculate cost on KES 45,000 actually received, test 30-day cash, compare alternatives, and reject if unaffordable',
          'Use another loan automatically to repay it',
          'Ignore late fees',
        ],
        correct: 'b',
        hint: 'Net proceeds, total repayment, term.',
        explanation: 'Upfront deductions make the effective cost much higher than the headline suggests.',
      },
      practical: {
        type: 'audio',
        prompt:
          'Record a client explanation comparing two loan quotations. State net cash received, total repayment, rate method, fees, collateral, monthly instalment, DSCR, and your recommendation.',
        minSeconds: 25,
        rubric: [
          'Both offers are compared in total shillings',
          'Flat versus reducing balance is identified',
          'Fees, penalties, security, and guarantor risk are included',
          'Repayment is tested against forecast cash flow',
          'Recommendation states risks and an alternative',
        ],
      },
    },
    {
      slug: 'investment',
      title: 'Week 6 — Investment, compounding, diversification, and fraud checks',
      titleSw: 'Wiki 6 — Uwekezaji na hatari',
      description: 'Build reserves, compare regulated investments, understand return after inflation and fees, and reject scams.',
      minutes: 38,
      examDomain: 'Financial literacy — saving and investment',
      briefing:
        'Saving protects near-term needs; investing accepts risk for longer-term growth. Order matters: control high-cost debt, build an emergency reserve, insure catastrophic risks, then invest money that is not needed next month. Match the instrument to the goal and horizon. Working-capital cash should not be locked in a volatile five-year asset.\n\nCompounding means returns earn returns. Future value (simple annual example) = principal × (1 + rate)^years. KES 100,000 at 10% for three years becomes about KES 133,100 before tax/fees. Real return is approximately nominal return minus inflation: 10% return with 7% inflation grows purchasing power by only about 3% before costs. Fees reduce compounding every year.\n\nInstruments have different risk/liquidity: regulated bank/SACCO deposits, Treasury bills/bonds, licensed money-market or unit trusts, listed shares, property, business reinvestment, and pensions. Do not describe any as guaranteed unless the lawful issuer guarantees it. Diversification spreads issuer, asset, sector, and timing risk; owning five companies in one collapsing industry is not full diversification. Investment in your own workshop can have high return but concentrates livelihood and capital in one place.\n\nDue diligence: verify the provider and salesperson with the relevant Kenyan regulator (such as CMA, CBK, SASRA, RBA, or IRA depending on the product), read the prospectus/terms, know custody and withdrawal rules, understand return source, and keep statements. Scam signs: guaranteed unusually high monthly return, recruitment commissions, urgency, secrecy, personal mobile-money number, no audited information, and inability to explain the underlying asset. If you cannot explain how it earns money, do not invest. This curriculum is education, not personalised financial advice.',
      briefingSw:
        'Akiba ni kwa muda mfupi; investment ina risk na muda. Emergency fund kwanza. Compound: principal × (1+rate)^years. Real return ni return minus inflation. Diversify. Hakikisha regulator (CMA/CBK/SASRA/RBA/IRA). Guaranteed high monthly return ni red flag.',
      questions: [
        {
          prompt: 'KES 100,000 compounded annually at 10% for three years is approximately:',
          options: ['KES 103,000', 'KES 130,000 exactly', 'KES 133,100', 'KES 10,000'],
          correct: 'c',
          hint: '100,000 × 1.1 × 1.1 × 1.1.',
          explanation: 'Compounding earns a return on prior returns. Fees and tax would reduce the result.',
        },
        {
          prompt: 'An investment returns 11% while inflation is 8%. Approximate real return before fees is:',
          options: ['19%', '3%', '88%', '11% because inflation does not matter'],
          correct: 'b',
          hint: 'Nominal minus inflation is the quick approximation.',
          explanation: 'Purchasing power grows much less than the account balance.',
        },
        {
          prompt: 'Which is strongest evidence of investment fraud risk?',
          options: [
            'A regulated provider publishes audited reports',
            'Guaranteed 20% every month, urgency, recruitment rewards, and payment to a personal number',
            'Returns can fall and fees are disclosed',
            'Treasury auction results are public',
          ],
          correct: 'b',
          hint: 'High guaranteed return plus secrecy/recruitment.',
          explanation: 'Verify licences independently; do not trust screenshots or celebrity promotion.',
        },
        {
          prompt: 'Diversification primarily reduces:',
          options: [
            'All risk including inflation and fraud',
            'Concentration risk from one issuer, asset, or sector',
            'The need for due diligence',
            'Every possible loss',
          ],
          correct: 'b',
          hint: 'Do not put every egg in one basket.',
          explanation: 'Diversification cannot make a fraudulent product safe or guarantee profit.',
        },
      ],
      blanks: [
        {
          prompt: 'The return after accounting for inflation is the ___ return.',
          answer: 'real',
          hint: 'Nominal describes the printed percentage.',
          explanation: 'Financial goals are paid with purchasing power, so real return matters.',
        },
      ],
      practice: {
        prompt: 'A chama is offered “guaranteed 15% monthly” crypto mining, must recruit two members, and sends cash to a personal number. Best response?',
        options: [
          'Invest the emergency fund before the deadline',
          'Do not invest; verify licensing and underlying assets, document red flags, and consider reporting',
          'Borrow digitally to maximise return',
          'Join because a cousin withdrew once',
        ],
        correct: 'b',
        hint: 'Guaranteed extreme return plus recruitment is not normal investment risk.',
        explanation: 'Early withdrawals can be funded by later victims in a Ponzi scheme.',
      },
      practical: {
        type: 'video',
        prompt:
          'Present a three-bucket financial plan for a sample artisan: emergency reserve, medium-term equipment goal, and long-term investment. Explain horizon, liquidity, risk, diversification, inflation, fees, and regulator checks.',
        minSeconds: 30,
        rubric: [
          'Emergency funds remain liquid and low risk',
          'Each goal has an amount and time horizon',
          'Nominal and real returns are distinguished',
          'Diversification and concentration risk are explained',
          'Provider licensing and scam checks are demonstrated',
        ],
      },
    },
  ],
};

export const societyProgrammes = [
  solarProgramme,
  communityHealthProgramme,
  caregivingProgramme,
  wasteProgramme,
  waterProgramme,
  digitalEnterpriseProgramme,
];
