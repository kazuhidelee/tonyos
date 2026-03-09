import { AnimatePresence } from "framer-motion";
import { AboutApp } from "../apps/AboutApp";
import { ContactApp } from "../apps/ContactApp";
import { ExperienceApp } from "../apps/ExperienceApp";
import { OpenSourceApp } from "../apps/OpenSourceApp";
import { ProjectViewer } from "../apps/ProjectViewer";
import { ResumeApp } from "../apps/ResumeApp";
import { TextViewer } from "../apps/TextViewer";
import { DesktopIcon } from "./DesktopIcon";
import { FileExplorer } from "../explorer/FileExplorer";
import { Taskbar } from "../taskbar/Taskbar";
import { TerminalApp } from "../terminal/TerminalApp";
import { WindowFrame } from "../windows/WindowFrame";
import { useWindowStore } from "../../store/useWindowStore";
import type { AppWindow } from "../../types/window";
import { useDesktopStore } from "../../store/useDesktopStore";
import { SpotifyExplorerDesktop } from "../spotify/SpotifyExplorerDesktop";
import type { SpotifyWindowPayload } from "../../types/spotify";

const desktopIcons = [
  {
    id: "about",
    label: "About",
    iconSrc: "/Folder_big.png",
    appType: "about" as const,
    position: { x: 12, y: 72 },
  },
  {
    id: "projects",
    label: "Projects",
    iconSrc: "/Folder_big.png",
    appType: "projects" as const,
    position: { x: 12, y: 164 },
  },
  {
    id: "experience",
    label: "Experience",
    iconSrc: "/Folder_big.png",
    appType: "experience" as const,
    position: { x: 12, y: 256 },
  },
  {
    id: "open-source",
    label: "Open Source",
    iconSrc: "/Folder_big.png",
    appType: "open-source" as const,
    position: { x: 12, y: 348 },
  },
  {
    id: "resume",
    label: "Resume.pdf",
    iconSrc: "/Notepad_big.png",
    appType: "resume" as const,
    position: { x: 12, y: 440 },
  },
  {
    id: "terminal",
    label: "Terminal",
    iconSrc: "/Notepad_big.png",
    appType: "terminal" as const,
    position: { x: 12, y: 532 },
  },
  {
    id: "contact",
    label: "Contact",
    iconSrc: "/Notepad_big.png",
    appType: "contact" as const,
    position: { x: 12, y: 624 },
  },
  {
    id: "spotify",
    label: "Playlists",
    iconSrc: "/CD_big.png",
    appType: "spotify" as const,
    position: { x: 12, y: 716 },
  },
  {
    id: "files",
    label: "Files",
    iconSrc: "/Folder_big.png",
    appType: "explorer" as const,
    position: { x: 12, y: 808 },
  },
];

export function Desktop() {
  const { windows, openWindow } = useWindowStore();
  const { selectedIconId, iconPositions, selectIcon, moveIcon } =
    useDesktopStore();

  return (
    <div
      className="relative h-screen overflow-hidden bg-[#008080]"
      onMouseDown={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-icon-id]")) {
          selectIcon(null);
        }
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.png')" }}
      />

      <header className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between px-3 py-3">
        <div>
          <p className="text-[12px] font-bold text-white">Tony's Portfolio</p>
        </div>
      </header>

      <div className="absolute inset-0 z-10">
        {desktopIcons.map((item) => (
          <DesktopIcon
            key={item.id}
            id={item.id}
            iconSrc={item.iconSrc}
            label={item.label}
            position={iconPositions[item.id] ?? item.position}
            isSelected={selectedIconId === item.id}
            onSelect={() => selectIcon(item.id)}
            onMove={(position) => moveIcon(item.id, position)}
            onOpen={() =>
              openWindow(
                item.appType,
                {
                  singleton: false,
                  payload:
                    item.appType === "explorer"
                      ? { path: "/home/tony" }
                      : item.appType === "projects"
                        ? { path: "/home/tony/projects" }
                        : item.appType === "spotify"
                          ? { view: "home" }
                        : undefined,
                  title: item.label,
                },
              )
            }
          />
        ))}
      </div>

      <AnimatePresence>
        {windows
          .filter((window) => !window.isMinimized)
          .sort((left, right) => left.zIndex - right.zIndex)
          .map((window) => (
            <WindowFrame key={window.id} window={window}>
              <WindowContent window={window} />
            </WindowFrame>
          ))}
      </AnimatePresence>

      <Taskbar />
    </div>
  );
}

function WindowContent({ window }: { window: AppWindow }) {
  switch (window.appType) {
    case "about":
      return <AboutApp />;
    case "projects":
      return <FileExplorer initialPath="/home/tony/projects" compact />;
    case "experience":
      return <ExperienceApp />;
    case "open-source":
      return <OpenSourceApp />;
    case "resume":
      return <ResumeApp />;
    case "contact":
      return <ContactApp />;
    case "terminal":
      return <TerminalApp />;
    case "spotify":
      return <SpotifyExplorerDesktop payload={window.payload as SpotifyWindowPayload | undefined} />;
    case "explorer":
      return (
        <FileExplorer
          initialPath={(window.payload as { path?: string } | undefined)?.path}
        />
      );
    case "text":
      return <TextViewer path={(window.payload as { path: string }).path} />;
    case "project":
      return <ProjectViewer path={(window.payload as { path: string }).path} />;
    default:
      return <div className="p-5">Unsupported app.</div>;
  }
}
