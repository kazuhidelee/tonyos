import { Mail, Github, Linkedin } from 'lucide-react';
import { profile } from '../../data/portfolioContent';
import { Panel } from '../ui/Panel';

export function ContactApp() {
  const links = [
    { label: 'Email', href: `mailto:${profile.contact.email}`, icon: Mail },
    { label: 'GitHub', href: profile.contact.github, icon: Github },
    { label: 'LinkedIn', href: profile.contact.linkedin, icon: Linkedin },
  ];

  return (
    <div className="space-y-5 p-5">
      <Panel title="Contact" subtitle="Reach out for backend, infrastructure, systems, or platform engineering roles.">
        <div className="grid gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                className="flex items-center gap-3 border border-black bg-[#dfdfdf] px-4 py-3 text-sm text-black shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#808080]"
              >
                <Icon className="h-4 w-4 text-black" />
                {link.label}
              </a>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
