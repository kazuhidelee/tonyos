import { Panel } from '../ui/Panel';

const helpSections = [
  'Double-click desktop icons to open apps and folders.',
  'Use the Start button in the taskbar for documents, search, help, and shutdown.',
  'Drag windows by the blue title bar and use the controls to minimize, maximize, or close them.',
  'Open Documents to browse portfolio files, projects, and contact details like a file explorer.',
  'Open Playlists to browse Spotify playlists as folders and tracks as files.',
  'Open Terminal to navigate the portfolio filesystem with commands.',
];

export function HelpApp() {
  return (
    <div className="space-y-5 p-5">
      <Panel title="Help" subtitle="How to use TonyOS">
        <ul className="space-y-3 text-sm leading-6 text-black">
          {helpSections.map((section) => (
            <li key={section}>- {section}</li>
          ))}
        </ul>
      </Panel>
      <Panel title="Tips">
        <div className="space-y-3 text-sm leading-6 text-black">
          <p>Single-click selects an item.</p>
          <p>Double-click opens folders, apps, and playlists.</p>
          <p>Track rows in the Spotify explorer open Spotify in a new tab when double-clicked.</p>
        </div>
      </Panel>
    </div>
  );
}
