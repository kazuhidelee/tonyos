import { ExternalLink, GitBranch } from 'lucide-react';
import { projects } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';

export function ProjectsApp() {
  return (
    <div className="space-y-5 p-5">
      {projects.map((project) => (
        <Panel key={project.slug} title={project.title} subtitle={project.summary}>
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4 text-sm leading-6 text-black">
              <p>
                <span className="font-bold">Problem:</span> {project.problem}
              </p>
              <div>
                <div className="mb-2 font-bold">Engineering decisions</div>
                <ul className="space-y-2">
                  {project.decisions.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-bold uppercase">Stack</div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <span key={item} className="border border-black bg-[#dfdfdf] px-2 py-1 text-xs text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 border border-black bg-[#dfdfdf] px-3 py-2 text-sm text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
                  >
                    {link.label === 'GitHub' ? <GitBranch className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
