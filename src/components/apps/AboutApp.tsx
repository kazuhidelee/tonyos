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
        <div className="grid gap-4 lg:grid-cols-[240px_1fr] lg:items-start">
          {asciiArt ? (
            <div className="overflow-auto bg-white p-2">
              <pre className="whitespace-pre font-mono text-[5px] leading-[5px] text-black">{asciiArt}</pre>
            </div>
          ) : null}
          <div className="space-y-4 text-sm leading-6 text-black">
            <p className="font-bold">{profile.tagline}</p>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-3">
        {Object.entries(profile.skills).map(([group, values]) => (
          <Panel key={group} title={group}>
            <ul className="space-y-2 text-sm text-black">
              {values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
