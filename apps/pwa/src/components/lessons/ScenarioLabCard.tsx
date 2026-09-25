import type { Lesson } from '@cyberlearn/types';
import { scenarioLabFor } from '@/lib/scenarioLab';

export default function ScenarioLabCard({ lesson }: { lesson: Lesson }) {
  const lab = scenarioLabFor(lesson);
  return (
    <section className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4 space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-amber-300 font-semibold">
          Workplace scenario lab
        </p>
        <h3 className="text-white font-semibold mt-1">Apply this unit before the graded questions</h3>
      </div>
      <div>
        <p className="text-xs uppercase text-muted font-semibold">Setting</p>
        <p className="text-sm text-white/90 mt-1 leading-relaxed">{lab.setting}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-muted font-semibold">Incident / decision point</p>
        <p className="text-sm text-white mt-1 leading-relaxed">{lab.incident}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <ScenarioList title="Evidence to collect" items={lab.evidence} />
        <ScenarioList title="Constraints and stop points" items={lab.constraints} />
      </div>
      <div>
        <p className="text-xs uppercase text-muted font-semibold">Professional decision workflow</p>
        <ol className="mt-2 space-y-2">
          {lab.workflow.map((item, index) => (
            <li key={item} className="flex gap-2 text-sm text-white/90">
              <span className="text-accent font-semibold">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-xl bg-primary-dark/60 p-3">
        <p className="text-xs uppercase text-muted font-semibold">Evidence for the portfolio</p>
        <p className="text-sm text-white/90 mt-1">{lab.deliverable}</p>
      </div>
    </section>
  );
}

function ScenarioList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted font-semibold">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-white/90 flex gap-2">
            <span className="text-amber-300">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
