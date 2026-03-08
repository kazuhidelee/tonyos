import { profile, projects, experience } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';

export function ResumeApp() {
  return (
    <div className="bg-white p-8 text-black">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="mt-2 text-sm text-slate-700">{profile.role}</p>
          <p className="mt-1 text-sm text-slate-600">
            {profile.location} · {profile.contact.email}
          </p>
        </header>

        <Panel className="bg-[#dfdfdf] shadow-none" title="Summary">
          <p className="text-sm leading-6 text-black">{profile.tagline}</p>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="bg-[#dfdfdf] shadow-none" title="Experience">
            <div className="space-y-4">
              {experience.map((entry) => (
                <div key={entry.company}>
                  <div className="font-semibold text-black">{entry.company}</div>
                  <div className="text-sm text-black/75">
                    {entry.role} · {entry.period}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="bg-[#dfdfdf] shadow-none" title="Selected Projects">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.slug}>
                  <div className="font-semibold text-black">{project.title}</div>
                  <div className="text-sm text-black/75">{project.summary}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
