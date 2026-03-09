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

interface RawProjectEntry {
  projectName: string;
  type: string;
  category: string;
  description: string;
  date: string;
  link: string;
  projectOverview: string;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getProjectLinkLabel(link: string): string {
  if (link.includes('github.com')) {
    return 'GitHub';
  }
  return 'Live Link';
}

function toProjectEntry(project: RawProjectEntry): ProjectEntry {
  return {
    slug: toSlug(project.projectName),
    title: project.projectName,
    summary: project.description,
    problem:
      project.projectOverview ||
      `${project.projectName} is a ${project.type.toLowerCase()} ${project.category.toLowerCase()} project from ${project.date}.`,
    decisions: [
      `Type: ${project.type}`,
      `Category: ${project.category}`,
      `Date: ${project.date}`,
    ],
    tech: [project.category, project.type, project.date],
    links:
      project.link === 'private'
        ? []
        : [{ label: getProjectLinkLabel(project.link), href: project.link }],
  };
}

const rawProjects: RawProjectEntry[] = [
  {
    projectName: 'Personal Website',
    type: 'Personal',
    category: 'Web Development',
    description: 'The portfolio website you are currently viewing!',
    date: '2025',
    link: 'https://github.com/kazuhidelee/Personal_Website',
    projectOverview: '',
  },
  {
    projectName: 'SoleSpeaks',
    type: 'Academic',
    category: 'Web Development',
    description: 'A web application project built for EECS 497.',
    date: '2025',
    link: 'https://eecs497.lkellar.org/',
    projectOverview: '',
  },
  {
    projectName: 'Bubble! - Learn Science',
    type: 'Industrial',
    category: 'Web Development',
    description: 'A web application that aids students with lower resource backgrounds...',
    date: '2023',
    link: 'https://github.com/kalifrancisco/bubble-nextjs',
    projectOverview: '',
  },
  {
    projectName: 'Arbor Advisor',
    type: 'Industrial',
    category: 'Web Development',
    description:
      'A user-centric website that condenses resources for international, out-of-state, and first-generation students in Washtenaw County.',
    date: '2023',
    link: 'https://mandyschen.github.io/WashtenawWelcome/',
    projectOverview: '',
  },
  {
    projectName: 'AI Chatbot',
    type: 'Personal',
    category: 'Web Development',
    description: 'An AI chatbot website that uses the OpenAI API key.',
    date: '2024',
    link: 'https://github.com/kazuhidelee/AI_chatbot',
    projectOverview:
      "This is a simple chat application using React.js and the Chat UI Kit library from Chatscope. The application allows users to interact with an AI chatbot powered by OpenAI where users can type messages, which are then sent to the backend (OpenAI's API). First, the message typed by the user is added to the messages array and it will be displayed in the chat UI. Then, the message will be processed into format that is suitable for the Open AI request format. After the conversion, the function will put all the required information (model, API message, system message) in JSON format and send it to the API. If processed successfully, the API will return a response message from ChatGPT, and the function will display the message content onto the chat UI.",
  },
  {
    projectName: 'Windrose API',
    type: 'Industrial',
    category: 'Web Development',
    description:
      'A public API that fetches historical windrose data from the Southeast Michigan region, used in the air quality map research project.',
    date: '2024',
    link: 'https://github.com/kazuhidelee/windrose_api',
    projectOverview: '',
  },
  {
    projectName: 'Concordia',
    type: 'Industrial',
    category: 'Mobile Development',
    description:
      'A mobile application for 200+ global volunteers to streamline support efforts, impacting 2.8 million people in the Dominican Republic.',
    date: '2024',
    link: 'private',
    projectOverview: '',
  },
  {
    projectName: 'Search Engine',
    type: 'Academic',
    category: 'Distributed System',
    description:
      'A scalable search engine similar to Google and Bing using MapReduce, tf-idf, and PageRank to optimize retrieval and link analysis.',
    date: '2024',
    link: 'private',
    projectOverview: '',
  },
  {
    projectName: 'Mapreduce paradigm',
    type: 'Academic',
    category: 'Distributed System',
    description:
      'A single-machine, multi-process, multi-threaded server that executes user-submitted MapReduce jobs.',
    date: '2024',
    link: 'private',
    projectOverview: '',
  },
  {
    projectName: 'Thread Library',
    type: 'Academic',
    category: 'Operating System',
    description:
      'A kernel-level thread library similar to the STL library in C++, including CPU, threads, mutex, and condition variable classes.',
    date: '2025',
    link: 'private',
    projectOverview: '',
  },
  {
    projectName: 'External Pager',
    type: 'Academic',
    category: 'Operating System',
    description: 'An external pager that manages virtual memory for application processes.',
    date: '2025',
    link: 'private',
    projectOverview: '',
  },
  {
    projectName: 'Network File System',
    type: 'Academic',
    category: 'Operating System',
    description:
      'A multi-threaded, secure network file server that allows clients to read, write, and delete files on the server.',
    date: '2025',
    link: 'private',
    projectOverview: '',
  },
  {
    projectName: 'BW Colorization',
    type: 'Academic',
    category: 'Computer Vision',
    description:
      'A TensorFlow image colorization model inspired by the paper "Colorful Image Colorization" by Zhang et al.',
    date: '2024',
    link: 'https://github.com/kazuhidelee/BWToColorized',
    projectOverview: '',
  },
  {
    projectName: 'Mission Valentine',
    type: 'Personal',
    category: 'Game Development',
    description:
      'A Valentine-themed mini game with dodge mechanics and hand-drawn pixel art.',
    date: '2025',
    link: 'https://github.com/kazuhidelee/mission_valentine',
    projectOverview: '',
  },
  {
    projectName: 'Monte Carlo Tree Search AI',
    type: 'Academic',
    category: 'Artificial Intelligence',
    description:
      "An implementation of the Monte Carlo Tree Search algorithm from AlphaZero in the context of the game 'Othello'.",
    date: '2024',
    link: 'https://github.com/kazuhidelee/MCTS',
    projectOverview: '',
  },
  {
    projectName: 'Image Classifier',
    type: 'Academic',
    category: 'Artificial Intelligence',
    description: 'A PyTorch convolutional neural network for image classification.',
    date: '2024',
    link: 'https://github.com/kazuhidelee/Image-Classification',
    projectOverview: '',
  },
  {
    projectName: 'Min-Max Game Agent',
    type: 'Academic',
    category: 'Artificial Intelligence',
    description:
      'A Tic-Tac-Toe and Connect-4 AI agent using minimax with alpha-beta pruning.',
    date: '2024',
    link: 'https://github.com/kazuhidelee/minimax-game-ai',
    projectOverview: '',
  },
  {
    projectName: 'Maze Search Algorithms',
    type: 'Academic',
    category: 'Artificial Intelligence',
    description:
      'An AI agent that searches for a path in a maze using BFS, DFS, UCS, and A* search algorithms.',
    date: '2024',
    link: 'https://github.com/kazuhidelee/maze-search-algorithms',
    projectOverview: '',
  },
];

export const projects: ProjectEntry[] = rawProjects.map(toProjectEntry);

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
