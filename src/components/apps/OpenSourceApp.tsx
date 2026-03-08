import { openSourceEntries } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';

export function OpenSourceApp() {
  return (
    <div className="space-y-5 p-5">
      {openSourceEntries.map((entry) => (
        <Panel key={entry.name} title={entry.name}>
          <p className="text-sm leading-6 text-black">{entry.description}</p>
        </Panel>
      ))}
    </div>
  );
}
