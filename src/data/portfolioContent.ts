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
    email: 'tylee2715@gmail.com',
    github: 'https://github.com/kazuhidelee',
    linkedin: 'https://www.linkedin.com/in/tonykazuhidelee/',
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
    company: 'Everstory',
    role: 'Software Engineering Intern',
    period: 'May 2025 - Current',
    highlights: [
      'Designed a vector-based retrieval system using HNSW indexing for Approximate Nearest Neighbor retrieval.',
      'Developed and deployed backend services in Python with FastAPI, including 10+ RESTful API endpoints.',
      'Integrated Amazon S3 for media storage and OpenAI Whisper for voice search functionality.',
      'Implemented a CI/CD pipeline with GitHub Actions to auto-provision a Supabase database and run pgTAP unit tests on pull requests, reducing integration errors by 35% before merges.',
    ],
  },
  {
    company: 'Ubiquant',
    role: 'Trading Reliability Engineer ',
    period: 'Oct 2025 – Dec 2025',
    highlights: [
      'Resolved 20+ production alerts by following SOPs, performing issue triage, and executing Linux system commands (logs, processes, services, networking) to diagnose and stabilize the trading systems.',
      'Implemented and maintained PTP/NTP time-synchronization services across servers, including configuration, and validation to ensure millisecond-level time accuracy critical for real-time market data.',
      'Integrated Amazon S3 for media storage and OpenAI Whisper for voice search functionality.',
      'Built a Python based web crawler that scraped 2,000+ event logs from the internal trading-system monitoring platform, performed data cleaning and analysis, and generated visualizations to identify anomalies using pandas.',
    ],
  },
  {
    company: 'F5',
    role: 'Software Engineering Intern',
    period: 'July 2024 – Oct 2024',
    highlights: [
      'Designed and tested a session-aware architecture in C to enable distributed session lookup and deletion across BIG-IP Next instances using Redis and mTLS communication.',
      'Implemented and exposed the distributed session state management component (dSSM proxy) to support cross-instance session synchronization, facilitating secure request forwarding and session record caching.',
      'Verified session creation, lookup, and deletion workflows via Pub/Sub, multicast messaging, and internal RedisDB interactions, reducing session resolution time across instances.',
    ],
  },
  {
    company: 'University of Michigan School of Public Health ',
    role: 'Technology Research Assistant ',
    period: 'May 2024 – Dec 2024',
    highlights: [
      'Built a full-stack web app with a real-time interactive air quality map and diagram using Typescript and Flask.',
      'Created and deployed REST API with MySQL and ExpressJS on GCP for 50+ sensor data sources.',
    ],
  },
  {
    company: 'Develop for Good',
    role: 'Product Manager Intern',
    period: 'May 2024 – Aug 2024',
    highlights: [
      'Led the development of the Concordia app, a mobile application for 200+ global volunteers to streamline support efforts, impacting 2.8 million people in the Dominican Republic.',
      'Managed a cross-functional team of 7 in an Agile environment, orchestrating weekly sprints, standups, and retrospectives to ensure alignment and delivery of key milestones.',
      'Contributed to both full-stack development using React Native and JavaScript, implementing an interactive map interface, user authentication, and Firebase database integration.',
    ],
  },
];
