import { Win95Button } from '../ui/Win95Button';

const resumeFile = '/Kazuhide_Tony_Lee_Updated_Resume.pdf';

export function ResumeApp() {
  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] p-3 text-black">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[12px]">Viewing: Kazuhide_Tony_Lee_Updated_Resume.pdf</div>
        <Win95Button
          href={resumeFile}
          download="Kazuhide_Tony_Lee_Resume.pdf"
          label="Save"
        />
      </div>

      <div className="min-h-0 flex-1 border border-[#808080] bg-white">
        <iframe
          src={resumeFile}
          title="Tony Lee Resume"
          className="h-full w-full border-0"
        />
      </div>

      <div className="mt-2 text-[11px]">
        If the PDF preview does not load,{' '}
        <a href={resumeFile} download="Kazuhide_Tony_Lee_Resume.pdf" className="underline">
          download the resume here
        </a>
        .
      </div>
    </div>
  );
}
