export interface ProjectEntry {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  decisions: string[];
  tech: string[];
  links: Array<{ label: string; href: string }>;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}





export const profile = {
  name: 'Tony Lee',
  role: 'Software Engineer focused on systems, infrastructure, and distributed applications',
  location: 'New York, NY',
  tagline:
    'Hello, and welcome to my website! My name is Tony, and I’m a recent CS grad from the University of Michigan.',
  about: [
    'Although I started my journey as a programmer relatively late, I was able to get involved in a lot of hands-on experience through internships, part-time jobs, and projects where I was able to gain both technical skills and teamworks, and become passionate about building solutions to real world problems.',
    'Beyond coding, my unique experience of growing up across countries like China, Korea, and Japan has shaped my adaptability in different environments, and also given me an ability to view situations in diverse perspectives, which I believe will be a great asset and skill I can bring to the table.',
    'For hobbies, I enjoy making music playlists and art!',
  ],
  skills: {
    languages: ['TypeScript', 'Python', 'Go', 'Java', 'SQL', 'Bash'],
    systems: ['Linux', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'Nginx'],
    practices: ['Distributed systems', 'API design', 'CI/CD', 'Observability', 'Performance tuning'],
  },
  contact: {
    email: 'tony@example.com',
    github: 'https://github.com/tony',
    linkedin: 'https://linkedin.com/in/tony',
  },
};

export const projects: ProjectEntry[] = [
  {
    slug: 'network-file-server',
    title: 'Multi-Threaded Network File Server',
    summary:
      'A concurrent file server designed to serve directory listings and file transfers under high connection churn.',
    problem:
      'I wanted to explore thread scheduling, lock granularity, and filesystem access patterns in a realistic networked workload.',
    decisions: [
      'Used a worker pool to cap concurrency and avoid thread explosion under burst traffic.',
      'Separated metadata lookup from transfer operations to reduce lock hold time.',
      'Added structured request logging and latency buckets to profile slow paths during load tests.',
    ],
    tech: ['C++', 'POSIX sockets', 'epoll', 'pthread', 'Linux'],
    links: [
      { label: 'GitHub', href: 'https://github.com/tony/network-file-server' },
      { label: 'Design Notes', href: 'https://example.com/network-file-server' },
    ],
  },
  {
    slug: 'distributed-session-platform',
    title: 'Distributed Session Management Platform',
    summary:
      'A fault-tolerant session service for multi-region web applications with cache-backed reads and durable write paths.',
    problem:
      'I wanted to understand the tradeoffs between consistency, failover behavior, and operational simplicity in stateful backend systems.',
    decisions: [
      'Modeled sessions as versioned records to support idempotent writes and easier conflict handling.',
      'Used Redis for low-latency access with Postgres as the authoritative store.',
      'Instrumented replication lag, session churn, and cache hit rate to guide tuning decisions.',
    ],
    tech: ['Go', 'Redis', 'PostgreSQL', 'gRPC', 'Docker'],
    links: [
      { label: 'GitHub', href: 'https://github.com/tony/distributed-session-platform' },
    ],
  },
  {
    slug: 'search-engine',
    title: 'Infrastructure-Aware Search Application',
    summary:
      'A full-stack app that pairs a React frontend with a FastAPI backend, focusing on clean APIs and production-friendly deployment.',
    problem:
      'The goal was to build a user-facing product while treating deployment, observability, and data flow as first-class engineering concerns.',
    decisions: [
      'Kept the frontend state model predictable with typed API contracts and clear fetch boundaries.',
      'Added background indexing jobs to decouple ingestion from query-time latency.',
      'Containerized services and added health checks for smoother local and staging workflows.',
    ],
    tech: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker Compose'],
    links: [
      { label: 'GitHub', href: 'https://github.com/tony/search-engine' },
      { label: 'Demo', href: 'https://example.com/search-engine' },
    ],
  },
];

export const openSourceEntries = [
  {
    name: 'Developer tooling contributions',
    description:
      'Contributed bug fixes, documentation improvements, and small ergonomics patches to open source tooling used in local development workflows.',
  },
  {
    name: 'Infra-focused examples',
    description:
      'Published example repos covering containerized services, CI pipelines, and terminal-first workflows to make backend systems easier to learn from.',
  },
];

export const experience: ExperienceEntry[] = [
  {
    company: 'F5',
    role: 'Software Engineering Intern',
    period: '2025',
    highlights: [
      'Built internal tools that improved service visibility and reduced debugging time for engineering teams.',
      'Worked across backend services and deployment workflows, with an emphasis on reliability and developer experience.',
      'Focused on practical improvements: cleaner operational insight, safer automation, and clearer interfaces.',
    ],
  },
  {
    company: 'Midas',
    role: 'Software Engineer',
    period: '2024',
    highlights: [
      'Delivered backend-heavy product features with attention to data modeling, maintainability, and observability.',
      'Collaborated across product and engineering to translate requirements into stable service behavior.',
    ],
  },
  {
    company: 'Develop for Good',
    role: 'Software Engineer',
    period: '2023',
    highlights: [
      'Built features for mission-driven products in a team environment with strong iteration and communication loops.',
      'Practiced shipping maintainable code under real delivery constraints while keeping user needs central.',
    ],
  },
];
