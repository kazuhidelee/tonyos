import { useEffect, useState } from 'react';
import { profile } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';

export function AboutApp() {
  const [asciiArt, setAsciiArt] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetch('/ascii-art.txt')
      .then((response) => response.text())
      .then((text) => {
        if (!cancelled) {
          setAsciiArt(text);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAsciiArt('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5 p-5">
      <Panel title="About">
        <div className="grid gap-5 lg:grid-cols-[240px_1fr] lg:items-start">
          <div className="space-y-4">
            {asciiArt ? (
              <div className="classic-scroll-area overflow-auto bg-white p-2">
                <pre className="whitespace-pre font-mono text-[5px] leading-[5px] text-black">{asciiArt}</pre>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 text-sm leading-6 text-black">
            <p className="font-bold">{profile.tagline}</p>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Education">
          <div className="space-y-3 text-sm text-black">
            {toEducationEntries(profile.Education).map((entry) => (
              <div
                key={`${entry.school}-${entry.degree}-${entry.duration}`}
                className="border border-[#808080] bg-white p-3 shadow-[inset_-1px_-1px_0_#dfdfdf,inset_1px_1px_0_#808080]"
              >
                <div className="font-bold">{entry.school}</div>
                <div>{entry.degree}</div>
                <div className="text-[#404040]">{entry.duration}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Languages">
          <ul className="space-y-2 text-sm text-black">
            {profile.language_skills.languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {Object.entries(profile.skills).map(([group, values]) => (
          <Panel key={group} title={toPanelTitle(group)}>
            <ul className="space-y-2 text-sm text-black">
              {values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <Panel title="Contact">
        <div className="grid gap-3 text-sm text-black sm:grid-cols-3">
          {Object.entries(profile.contact).map(([label, value]) => (
            <div
              key={label}
              className="border border-[#808080] bg-white p-3 shadow-[inset_-1px_-1px_0_#dfdfdf,inset_1px_1px_0_#808080]"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-[#404040]">{label}</div>
              <div className="mt-2 break-words leading-5">{value}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function toPanelTitle(value: string) {
  if (value === value.toUpperCase()) {
    return value;
  }

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toEducationEntries(
  education:
    | { school: string; degree: string; duration: string }
    | Array<{ school: string; degree: string; duration: string }>,
) {
  return Array.isArray(education) ? education : [education];
}
