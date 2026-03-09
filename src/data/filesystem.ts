import { experience, profile, projects } from './portfolioContent';
import type { FileSystemDirectory } from '../types/filesystem';

const aboutText = [
  `${profile.name}`,
  `${profile.role}`,
  '',
  ...profile.about,
].join('\n');

const contactText = [
  `Email: ${profile.contact.email}`,
  `GitHub: ${profile.contact.github}`,
  `LinkedIn: ${profile.contact.linkedin}`,
].join('\n');

const skillsJson = JSON.stringify(profile.skills, null, 2);

const resumeContent = [
  'Tony Lee Resume',
  '',
  `${profile.role}`,
  `Location: ${profile.location}`,
  '',
  'Selected Experience:',
  ...experience.flatMap((entry) => [`- ${entry.company} | ${entry.role} | ${entry.period}`, ...entry.highlights.map((highlight) => `  * ${highlight}`)]),
  '',
  'Selected Projects:',
  ...projects.map((project) => `- ${project.title}: ${project.summary}`),
].join('\n');

export const portfolioFileSystem: FileSystemDirectory = {
  name: '/',
  path: '/',
  kind: 'directory',
  children: [
    {
      name: 'home',
      path: '/home',
      kind: 'directory',
      children: [
        {
          name: 'tony',
          path: '/home/tony',
          kind: 'directory',
          children: [
            {
              name: 'about.txt',
              path: '/home/tony/about.txt',
              kind: 'file',
              extension: 'txt',
              content: aboutText,
            },
            {
              name: 'projects',
              path: '/home/tony/projects',
              kind: 'directory',
              children: projects.map((project) => ({
                name: `${project.slug}.md`,
                path: `/home/tony/projects/${project.slug}.md`,
                kind: 'file',
                extension: 'md' as const,
                content: [
                  `# ${project.title}`,
                  '',
                  `Summary: ${project.summary}`,
                  '',
                  `Problem solved: ${project.problem}`,
                  '',
                  'Engineering decisions:',
                  ...project.decisions.map((item) => `- ${item}`),
                  '',
                  `Tech stack: ${project.tech.join(', ')}`,
                ].join('\n'),
              })),
            },
            {
              name: 'experience',
              path: '/home/tony/experience',
              kind: 'directory',
              children: experience.map((entry) => ({
                name: `${entry.company.toLowerCase().replace(/\s+/g, '-')}.md`,
                path: `/home/tony/experience/${entry.company.toLowerCase().replace(/\s+/g, '-')}.md`,
                kind: 'file',
                extension: 'md' as const,
                content: [
                  `# ${entry.company}`,
                  `${entry.role} | ${entry.period}`,
                  '',
                  ...entry.highlights.map((item) => `- ${item}`),
                ].join('\n'),
              })),
            },
            // {
            //   name: 'open-source.md',
            //   path: '/home/tony/open-source.md',
            //   kind: 'file',
            //   extension: 'md',
            //   content: [
            //     '# Open Source',
            //     '',
            //     ...openSourceEntries.flatMap((entry) => [`## ${entry.name}`, entry.description, '']),
            //   ].join('\n'),
            // },
            {
              name: 'resume.pdf',
              path: '/home/tony/resume.pdf',
              kind: 'file',
              extension: 'pdf',
              content: resumeContent,
            },
            {
              name: 'contact.txt',
              path: '/home/tony/contact.txt',
              kind: 'file',
              extension: 'txt',
              content: contactText,
            },
            {
              name: 'skills.json',
              path: '/home/tony/skills.json',
              kind: 'file',
              extension: 'json',
              content: skillsJson,
            },
          ],
        },
      ],
    },
  ],
};
