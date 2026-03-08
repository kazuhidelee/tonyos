import { projects } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';

interface ProjectViewerProps {
  path: string;
}

export function ProjectViewer({ path }: ProjectViewerProps) {
  const slug = path.split('/').pop()?.replace(/\.md$/, '');
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <div className="p-5 text-sm text-accent-red">Project not found.</div>;
  }

  return (
    <div className="space-y-5 p-5">
      <Panel title={project.title} subtitle={project.summary}>
        <div className="space-y-4 text-sm leading-6 text-black">
          <p>{project.problem}</p>
          <div>
            <div className="mb-2 font-bold">Key engineering decisions</div>
            <ul className="space-y-2">
              {project.decisions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 font-bold">Tech stack</div>
            <div>{project.tech.join(', ')}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
