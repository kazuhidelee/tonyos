import { BriefcaseBusiness, Cpu, FolderGit2, Mail } from 'lucide-react';
import { experience, profile, projects } from '../data/portfolioContent';
import { Panel } from '../components/ui/Panel';
import { cn } from '../utils/ui';

interface TraditionalPortfolioViewProps {
  embedded?: boolean;
}

export function TraditionalPortfolioView({ embedded = false }: TraditionalPortfolioViewProps) {
  return (
    <div className={cn('h-full overflow-auto bg-[#c0c0c0] text-black scrollbar-thin', embedded ? 'p-5' : 'h-screen p-6 md:p-10')}>
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="border border-black bg-[#c0c0c0] p-6 shadow-[-1px_-1px_0_#ffffff,inset_-1px_-1px_0_#808080,inset_1px_1px_0_#ffffff,1px_1px_0_#000000] md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-bold uppercase">Tony Lee</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
                Backend and infrastructure-minded engineer with a systems lens.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-black">{profile.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="border border-black bg-[#dfdfdf] px-4 py-2 text-sm text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
                >
                  Contact
                </a>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-black bg-[#dfdfdf] px-4 py-2 text-sm text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric icon={Cpu} label="Focus" value="Systems + Infra" />
              <Metric icon={FolderGit2} label="Projects" value={`${projects.length}+ deep dives`} />
              <Metric icon={BriefcaseBusiness} label="Experience" value={`${experience.length} roles`} />
              <Metric icon={Mail} label="Availability" value="Open to SWE roles" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="About" subtitle={profile.role}>
            <div className="space-y-4 text-sm leading-7 text-slate-300">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Panel>

          <Panel title="Core Skills">
            <div className="space-y-4">
              {Object.entries(profile.skills).map(([group, values]) => (
                <div key={group}>
                  <div className="mb-2 text-xs font-bold uppercase">{group}</div>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value) => (
                      <span key={value} className="border border-black bg-[#dfdfdf] px-3 py-1 text-xs text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Projects" subtitle="Engineering-heavy work centered on concurrency, backend systems, reliability, and operability.">
          <div className="grid gap-4 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.slug} className="border border-black bg-[#dfdfdf] p-4 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
                <h3 className="text-lg font-semibold text-black">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-black">{project.summary}</p>
                <p className="mt-3 text-sm leading-7 text-black/75">{project.problem}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Experience">
          <div className="space-y-4">
            {experience.map((entry) => (
              <article key={entry.company} className="border border-black bg-[#dfdfdf] p-4 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-semibold text-black">{entry.company}</h3>
                  <div className="text-sm text-black">
                    {entry.role} · {entry.period}
                  </div>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-black">
                  {entry.highlights.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-black bg-[#dfdfdf] p-4 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
      <Icon className="h-5 w-5 text-black" />
      <div className="mt-4 text-xs font-bold uppercase text-black/70">{label}</div>
      <div className="mt-1 text-lg font-semibold text-black">{value}</div>
    </div>
  );
}
