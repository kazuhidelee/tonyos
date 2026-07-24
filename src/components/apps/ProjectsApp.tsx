import { useState } from 'react';
import { projects } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';
import { useWindowStore } from '../../store/useWindowStore';

const placeholderPreview = `${import.meta.env.BASE_URL}merlin-microsoft-wizard.jpeg`;
const projectPreviews: Record<string, string> = {
  'bw-colorization': `${import.meta.env.BASE_URL}project-icon-bw-colorization.jpeg`,
  concordia: `${import.meta.env.BASE_URL}concordia-preview.png`,
  'network-file-system': `${import.meta.env.BASE_URL}network-file-system-preview.png`,
  'search-engine': `${import.meta.env.BASE_URL}project-icon-search-engine.jpeg`,
  'tamagotchi-os': `${import.meta.env.BASE_URL}project-icon-tamagotchi-os.jpeg`,
  'windrose-api': `${import.meta.env.BASE_URL}project-icon-windrose-api.jpeg`,
};
const projectPreviewPositions: Record<string, string> = {
  'bw-colorization': 'center',
  concordia: '65% center',
  'search-engine': 'center',
  'tamagotchi-os': 'center',
  'windrose-api': 'center',
};

interface ProjectsAppProps {
  windowId: string;
}

export function ProjectsApp({ windowId }: ProjectsAppProps) {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');
  const { closeWindow, openPathWindow } = useWindowStore();
  const selectedProject = projects.find((project) => project.slug === selectedSlug) ?? projects[0];
  const selectedPreview = projectPreviews[selectedProject?.slug] ?? placeholderPreview;
  const selectedPreviewPosition = projectPreviewPositions[selectedProject?.slug] ?? 'center';

  if (!selectedProject) {
    return null;
  }

  return (
    <div className="bg-[#f7f3de] p-5">
      <Panel
        title="Projects"
        subtitle="Select a project to open its full description."
        className="border-black bg-[#f7f3de] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#000000,1px_1px_0_#ffffff]"
      >
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="border border-black bg-[#f7f3df] p-2 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#000000,1px_1px_0_#ffffff]">
            <div className="mb-1 border-b border-black pb-1 text-xs font-bold text-black">Project Library</div>
            <div className="classic-scroll-area h-[320px] overflow-y-auto border border-black bg-white">
              {projects.map((project) => {
                const isSelected = project.slug === selectedProject.slug;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => setSelectedSlug(project.slug)}
                    className={`block w-full border-b border-black/10 px-2 py-1 text-left text-sm ${
                      isSelected ? 'bg-[#000080] text-white' : 'bg-white text-black hover:bg-[#dfdfdf]'
                    }`}
                  >
                    {project.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between border border-black bg-[#f7f3df] p-3 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#000000,1px_1px_0_#ffffff]">
            <div className="border border-black bg-white p-2 shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#000000,1px_1px_0_#ffffff]">
              <img
                src={selectedPreview}
                alt={`${selectedProject.title} preview`}
                draggable={false}
                className="mx-auto h-[260px] w-full select-none object-contain"
                style={{ objectPosition: selectedPreviewPosition }}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  openPathWindow(`/home/tony/projects/${selectedProject.slug}.md`);
                }}
                className="min-w-[120px] border border-black bg-[#f7f3df] px-6 py-2 text-sm text-black shadow-[inset_-1px_-1px_0_#000000,inset_1px_1px_0_#ffffff]"
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => closeWindow(windowId)}
                className="min-w-[120px] border border-black bg-[#f7f3df] px-6 py-2 text-sm text-black shadow-[inset_-1px_-1px_0_#000000,inset_1px_1px_0_#ffffff]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
