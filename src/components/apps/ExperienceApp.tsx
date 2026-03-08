import { experience } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';

export function ExperienceApp() {
  return (
    <div className="space-y-5 p-5">
      {experience.map((entry) => (
        <Panel key={entry.company} title={entry.company} subtitle={`${entry.role} · ${entry.period}`}>
          <ul className="space-y-3 text-sm leading-6 text-black">
            {entry.highlights.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  );
}
