export interface ProjectEntry {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  role: string;
  approach: string;
  contributions: string[];
  outcome: string;
  decisions: string[];
  tech: string[];
  links: Array<{ label: string; href: string }>;
  extraSlides: ProjectExtraSlide[];
}

export interface ProjectExtraSlide {
  title: string;
  description?: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  zoomableImage?: boolean;
  images?: Array<{ src: string; alt: string }>;
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
  Education:[
    {
      school: "University of Michigan - Ann Arbor",
      duration: "2023 - 2025",
      degree: "B.S. in Computer Science",
    },
    {
      school: "New York University - Courant Institution",
      duration: "Incoming 2026",
      degree: "M.S. in Computer Science",
    },
  ],
  skills: {
    languages: ['C/C++', 'Python', 'PHP', 'Java', 'TypeScript/JavaScript'],
    systems: ['Linux', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'Git'],
    databases: ['SQL', 'MongoDB', 'Supabase', 'AWS', 'GCP'],
  },
  language_skills:{
    languages: ["English", "Korean", "Mandarin", "Japanese"],
  },
  contact: {
    email: 'tylee2715@gmail.com',
    github: 'https://github.com/kazuhidelee',
    linkedin: 'https://www.linkedin.com/in/tonykazuhidelee/',
  },
};

interface RawProjectEntry {
  projectName: string;
  description: string;
  overview: string;
  role: string;
  approach: string;
  contributions: string[];
  outcome: string;
  date?: string;
  highlights: string[];
  stack: string[];
  links?: Array<{ label?: string; href: string }>;
  extraSlides?: ProjectExtraSlide[];
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
  if (link.includes('docs.google.com/presentation')) {
    return 'Slides';
  }
  if (link.includes('docs.google.com/document')) {
    return 'Docs';
  }
  if (link.includes('arxiv.org')) {
    return 'Paper';
  }
  return 'Live Link';
}

function toProjectEntry(project: RawProjectEntry): ProjectEntry {
  return {
    slug: toSlug(project.projectName),
    title: project.projectName,
    summary: project.description,
    overview: project.overview,
    role: project.role,
    approach: project.approach,
    contributions: project.contributions,
    outcome: project.outcome,
    decisions: project.highlights,
    tech: project.stack,
    links: (project.links || []).map((link) => ({
      label: link.label || getProjectLinkLabel(link.href),
      href: link.href,
    })),
    extraSlides: project.extraSlides || [],
  };
}

const rawProjects: RawProjectEntry[] = [
  {
    projectName: 'Budget-Constrained Deep Research Agent',
    description:
      'A budget-constrained research agent that answers multi-step questions by planning sub-queries, retrieving evidence, compressing sources into notes, and synthesizing a final answer under explicit token and cost limits.',
    overview:
      'I wanted to build this because I kept running into the same frustration with research workflows: once context filled up or usage got expensive, I had almost no control over what the system kept, dropped, or spent. A lot of AI research assistant projects also feel like thin wrappers around one model call, so I wanted to make a version where memory, token usage, and cost constraints were visible, adjustable, and actually enforced.',
    role: 'Solo',
    approach:
      'The system starts by planning sub-questions from a user query, then routes retrieval to live web search or a local fallback corpus. Retrieved documents are compressed into evidence notes, stored in a temporary memory layer, filtered through a budget manager that limits retained sources, tokens, and estimated cost, and finally synthesized from only the top retained notes. The UI exposes the answer, evidence trail, claim mapping, retrieval log, and budget usage instead of hiding everything inside one LLM call.',
    contributions: [
      'Built the full pipeline: FastAPI backend, browser UI, query planner, retrieval router, evidence compression layer, session memory store, and budget enforcement logic.',
      'Integrated multiple synthesis providers plus safe fallback behavior when hosted model access fails or live APIs are unavailable.',
      'Implemented source-grounded result rendering with citations, freshness metadata, claim-to-evidence mapping, and both CLI and web interfaces.',
    ],
    outcome:
      'The final system runs end-to-end as a working CLI and web app, supports configurable per-query budgets, falls back safely when hosted model access fails, and surfaces structured evidence with clickable citations and freshness indicators.',
    date: 'Mar 2026 - May 2026',
    highlights: [
      'Bounded memory instead of unlimited context -> ranked evidence notes and trimmed what the agent kept before synthesis -> the system behaved more like a real constrained workflow than a toy chatbot.',
      'External providers and live APIs can fail unpredictably -> added provider fallback plus a local retrieval path with the same pipeline shape -> the demo still ran end to end when hosted services were unavailable.',
      'Weak retrieval can push an agent toward hallucination-prone synthesis -> separated retrieval, compression, memory selection, and synthesis into explicit stages -> reviewers can inspect what was retrieved, what was discarded, and why the final answer was produced.',
      'Transparency had to coexist with a lightweight local demo -> exposed citations, freshness metadata, claim mapping, retrieval logs, and budget usage in the UI without introducing heavyweight infrastructure -> the system stayed inspectable without losing simplicity.',
    ],
    stack: ['Python', 'FastAPI', 'JavaScript', 'HTML/CSS', 'Pydantic', 'OpenAI-compatible providers', 'Tavily', 'CLI'],
    links: [{ href: 'https://github.com/kazuhidelee/Budget-constrained_research_agent' }],
  },
  {
    projectName: 'Tamagotchi - OS',
    description:
      'A Linux kernel character-device driver that exposes a virtual pet through /dev/pet for interactive state updates and diagnostics.',
    overview:
      'A kernel-space virtual pet implemented as a Linux device driver. The project exists to show lower-level OS work beyond user-space systems code by modeling a stateful interactive system directly in the kernel and exposing it through device and procfs interfaces.',
    role: 'Solo',
    approach:
      'The core design centers on a character device at /dev/pet, timer-driven state transitions, user-kernel communication for commands and reads, and procfs endpoints for observability and diagnostics.',
    contributions: [
      'Implemented the device-driver logic and pet-state model.',
      'Built timer-based lifecycle updates and character-device interactions.',
      'Added procfs diagnostics and logging for debugging state transitions.',
    ],
    outcome:
      'Built a working kernel-space prototype with timer-driven state management, procfs diagnostics, and interactive /dev/pet controls.',
    date: 'May 2026 - Current',
    highlights: [
      'Kernel-space state management is harder to inspect than user-space code -> added procfs diagnostics and event logging -> internal state transitions became debuggable and observable.',
      'The pet needed autonomous behavior rather than only command-triggered updates -> used timer-based state transitions inside the driver -> hunger, mood, and lifecycle state could evolve without direct user input.',
      'The interface needed to feel interactive while staying simple -> exposed the pet through a character-device API -> reads and writes mapped cleanly to status queries and user actions.',
    ],
    stack: ['C', 'Linux kernel', 'Character devices', 'procfs', 'Systems programming'],
    links: [{ href: 'https://github.com/kazuhidelee/tamagotchi-os' }],
  },
  {
    projectName: 'Windrose API',
    description:
      'A small Express API that exports meteorological wind data from a MySQL database as CSV for the Detroit Air research site’s visualization workflows.',
    overview:
      'I built a standalone backend service for historical meteorological data used by the Detroit Air research project. Instead of hardcoding wind data access into the frontend, the project exposes a reusable HTTP API that queries the MRAPID MySQL database and returns CSV exports that downstream visualization tools can consume directly.',
    role: 'Solo project within a research group; owned the API design, implementation, and deployment',
    approach:
      'The service runs as a Node/Express API with CORS enabled, exposes a simple readiness route at `/`, and provides a CSV export endpoint at `/meteorological_data/csv`. That route validates a start and end timestamp, reconstructs timestamps from the database columns, filters for rows that include both wind speed and wind direction, and returns the matching dataset as a downloadable CSV attachment. Configuration is handled through environment variables so the same code can run locally or against a deployed database connection.',
    contributions: [
      'Built the Express server, route handlers, MySQL query flow, and CSV export behavior in `API.js`.',
      'Designed the request contract for date-bounded CSV export and added error handling for missing parameters, empty results, and database failures.',
      'Configured the service for deployment with environment-based database settings and deployed it on Google Cloud for Detroit Air integration.',
    ],
    outcome:
      'Delivered a working research-facing API that serves downloadable CSV exports from the MRAPID meteorological dataset and was deployed for use by the Detroit Air project.',
    date: '2024',
    highlights: [
      'Research data lived in MySQL, but visualization consumers needed flat exportable files -> added a route that converts filtered query results into downloadable CSV -> the frontend could consume structured wind data without embedding database logic.',
      'The export endpoint needed to support bounded historical queries -> accepted explicit `start_date` and `end_date` parameters and filtered reconstructed timestamps in SQL -> consumers could request only the relevant time window instead of downloading the whole table.',
      'A small research API still needs predictable failure behavior -> returned clear 400, 404, and 500 responses for missing dates, empty result sets, and query failures -> the service was easier to debug and integrate than a happy-path-only script.',
      'The same code needed to work across local and deployed environments -> used environment-based database configuration, including socket-path support for Cloud SQL style connections -> deployment stayed simple without hardcoding infrastructure details.',
    ],
    stack: ['Node.js', 'Express', 'MySQL', 'JavaScript', 'json2csv', 'CORS', 'Google Cloud'],
    extraSlides: [
      {
        title: 'Research Product Context',
        description:
          'This screenshot shows the Detroit Air product that consumed the API. The backend work was not just a standalone export script; it fed into a real air-quality interface where geographic and environmental data needed to be queryable and reusable across the research product.',
        image: '/windrose-detroit-air-map.png',
        imageAlt: 'Detroit Air research product air quality map',
        zoomableImage: false,
      },
      {
        title: 'Generated Windrose Output',
        description:
          'This example windrose visualization shows the kind of downstream artifact the API supported. The service made it easier to export time-bounded wind speed and direction data in a format that could be plugged into windrose generation and other meteorological analysis workflows.',
        image: '/windrose-generated-example.png',
        imageAlt: 'Generated windrose visualization example',
        zoomableImage: false,
      },
    ],
    links: [
      { href: 'https://github.com/kazuhidelee/windrose_api' },
      { href: 'https://detroitair.umich.edu/' },
    ],
  },
  {
    projectName: 'Concordia',
    description:
      'A React Native mobile app for volunteers to browse service sites, view site needs, and coordinate support tasks for a humanitarian program in the Dominican Republic.',
    overview:
      'Concordia is a volunteer-operations mobile app designed to help teams discover sites, review site-level needs, and coordinate support work in the field. The product mattered because it was tied to a real humanitarian program, not just a mock mobile workflow.',
    role: 'Team of 5; project lead/PM and contributing software engineer',
    approach:
      'The app centers on map-based site discovery, filtered browsing, site-detail pages, required-services management, and Firebase-backed application data. The engineering plan paired a mobile React Native client with an API gateway, backend domain services, persistent storage, and Firebase-based authentication.',
    contributions: [
      'Led delivery planning and scoped the app against the project timeline.',
      'Coordinated execution across teammates in different time zones.',
      'Contributed to the React Native codebase and helped shape core product flows.',
    ],
    outcome:
      'Supported a program involving 200+ volunteers and 2.8 million people served, while shipping map-based site browsing, filters, detail views, and service-management flows.',
    date: '2024',
    highlights: [
      'Tight timeline for a fully functional mobile app -> prioritized must-have flows and cut lower-value scope early -> the team stayed focused on delivering a usable product instead of overcommitting.',
      'High design freedom with limited pre-defined structure -> translated loose product goals into concrete screens, flows, and engineering tasks -> the team could move from ambiguity to implementable requirements.',
      'Teammates working across time zones -> relied on stronger task organization and clearer ownership boundaries -> collaboration stayed workable despite limited overlap.',
      'Client communication was inconsistent because the client was traveling -> pushed for clearer internal planning and more deliberate requirement interpretation -> progress continued without blocking the team on every open question.',
      'Map-heavy functionality and external API dependence -> planned around Google Maps and Geocoding usage, deployment setup, and cost considerations -> the team could make product decisions with infrastructure constraints in mind.',
    ],
    stack: ['React Native', 'JavaScript', 'Firebase', 'Mobile development'],
    links: [
      { label: 'Slides', href: 'https://docs.google.com/presentation/d/1Fzpn1ID_sVSjCdPZHB4L1Jx0wjYx6nMSKgDqiuCcupc/edit?slide=id.g1f29e1f7e16_4_0#slide=id.g1f29e1f7e16_4_0' },
      { label: 'Docs', href: 'https://docs.google.com/document/d/1AhMoGhBGZUIf_Ig4hVyCeb40hJPAcSBGXILP8BYhpKw/edit?tab=t.0' },
    ],
    extraSlides: [
      {
        title: 'Product Goals',
        description:
          'The PRD positioned Concordia as a centralized volunteer-operations hub for nonprofit partners serving communities in the Dominican Republic. The core product goal was to make sites, services, calendars, communication, and reporting easier to coordinate from a mobile device.',
        bullets: [
          'Primary users were volunteer leaders and coordinators who needed a better way to manage sites, service opportunities, and communication.',
          'Secondary users included local community members and volunteers who needed clearer visibility into sites, services, and logistics.',
          'Core requirements covered account creation, site browsing, interactive maps, calendars, reports, messaging, chat, multilingual support, and news/event posts.',
        ],
      },
      {
        title: 'Backend Architecture',
        description:
          'The engineering design proposed a service-oriented backend behind an API gateway so the mobile client could rely on a clean boundary between user management, site data, communication features, and reporting.',
        bullets: [
          'Requests flow from the React Native client through a load balancer into an API gateway that fronts user management, service-site management, calendar, chat, reports, and news/event services.',
          'The chat service was planned with a messaging queue for asynchronous work, while caching and data storage were separated into Redis, SQL/NoSQL persistence, and optional monitoring/logging layers.',
          'The design also left room for CDN support for static media if time allowed.',
        ],
        image: '/concordia-system-design.png',
        imageAlt: 'Concordia backend system design diagram',
      },
      {
        title: 'Data Model Planning',
        description:
          'The design doc leaned on Firebase and Firestore as the main data layer, with SQL kept as a possible complement. The goal was to model users, sites, services, sign-ups, and groups cleanly enough for both map-driven browsing and volunteer coordination.',
        bullets: [
          'Users can sign up for multiple services, and services belong to specific sites with availability windows and capacity information.',
          'Sites carry basic information, location data, and associated services so both list views and map views can retrieve the right data efficiently.',
          'Sign-ups and groups were modeled explicitly so the app could support both individual volunteers and group leaders.',
        ],
        image: '/concordia-relationship-chart.png',
        imageAlt: 'Concordia entity relationship planning chart',
      },
      {
        title: 'Entity Relationship Diagram',
        description:
          'The ERD translated those planning decisions into concrete collections and references for users, groups, sign-ups, services, and sites.',
        bullets: [
          'User, group, and sign-up relationships were modeled to support both individual and group-based volunteering flows.',
          'Service records included category, availability, capacity, and site references to support filtering and scheduling.',
          'Site records connected location data, organization metadata, and generated reporting outputs.',
        ],
        image: '/concordia-erd.png',
        imageAlt: 'Concordia entity relationship diagram',
      },
      {
        title: 'Basic Authentication Flow',
        description:
          'The initial authentication plan prioritized speed and implementation simplicity so the team could unblock testing of the rest of the app.',
        bullets: [
          'Firebase Authentication handled login, signup, and password-reset flows using email and password.',
          'The basic flow was meant to support early testing of the app’s core features without overcomplicating the first version.',
          'This gave the team a clear phase-one security model while the rest of the product was still moving quickly.',
        ],
        image: '/concordia-basic-auth.png',
        imageAlt: 'Concordia basic authentication flow diagram',
      },
      {
        title: 'Enhanced Authentication',
        description:
          'A second-phase plan added stronger identity and account protection once the main product flows were in place.',
        bullets: [
          'The enhanced flow planned for MFA setup and social-provider login through Firebase Authentication with Identity Platform.',
          'This phase balanced improved security and user experience against time and pricing tradeoffs.',
          'The design doc explicitly called out active-user pricing limits and the operational cost of stronger auth features.',
        ],
        image: '/concordia-enhanced-auth.png',
        imageAlt: 'Concordia enhanced authentication flow diagram',
      },
      {
        title: 'Platform Constraints',
        description:
          'The planning doc also called out the practical cost and deployment complexity around maps and external services, which shaped what was realistic to ship on the timeline.',
        bullets: [
          'Google Maps and Geocoding were the preferred APIs for the map experience, but API cost had to be considered because usage could become expensive.',
          'Deployment planning required Google Cloud setup, API key management, and mobile platform-specific configuration such as SHA-1 fingerprints for Android.',
          'Optional components like CDN support and centralized monitoring were explicitly scoped as stretch work rather than assumed to be free.',
        ],
      },
      {
        title: 'Shipped Experience',
        description:
          'The end result was a mobile experience that tied together onboarding, site browsing, map/list discovery, messaging, and content-sharing flows into one volunteer-facing product.',
        bullets: [
          'The design artifacts evolved into concrete multi-screen mobile experiences instead of staying at the planning stage.',
          'The product direction emphasized coordination workflows that real volunteers and organization leaders could actually navigate from a phone.',
        ],
        images: [
          { src: '/concordia-results-hero.png', alt: 'Concordia promotional overview with multiple mobile screens' },
          { src: '/concordia-results-screens.png', alt: 'Concordia app screens showing calendar, home, messages, and news views' },
        ],
      },
    ],
  },
  {
    projectName: 'Search Engine',
    description:
      'A small search engine with a MapReduce-style inverted-index pipeline, shard-based Flask index servers, and a search frontend that merges ranked hits and renders results from document metadata.',
    overview:
      'I built a search engine project that focused on the systems side of information retrieval rather than just the UI. The project starts with a crawl corpus, builds an inverted index through a multi-stage MapReduce-style pipeline, serves ranked hits from multiple index shards, and then merges those hits in a frontend service that looks up titles, summaries, and URLs from SQLite before rendering results.',
    role: 'Solo',
    approach:
      'The system has three main pieces: an inverted-index pipeline built with madoop, an index_server Flask API that answers `/api/v1/hits/` requests for one shard, and a search_server Flask app that fans out a query to all shards, merges the ranked results, and enriches them with metadata stored in SQLite. Prebuilt shard files can be served directly, or the full index can be regenerated from the crawl corpus through the pipeline.',
    contributions: [
      'Built the inverted-index pipeline over the crawl corpus and structured it as a multi-stage MapReduce-style workflow.',
      'Implemented the Flask-based index and search services, including shard querying, result aggregation, and metadata lookup.',
      'Set up the service workflow for rebuilding the SQLite document database, launching multiple shard servers, and running the search UI end to end.',
    ],
    outcome:
      'Delivered a working local search stack that rebuilds document metadata, serves three index shards on separate ports, aggregates ranked hits across shards, and renders searchable results through a browser UI.',
    date: '2024',
    highlights: [
      'Index construction and query serving are different systems problems -> split the project into an offline inverted-index pipeline plus online Flask services -> the architecture looked more like a real search stack than a single script.',
      'Serving one large index from one process would hide the distributed retrieval shape -> partitioned the final index across three shard files and queried all shard servers per search -> the frontend had to merge ranked hits across independently served indexes.',
      'Raw ranked document IDs are not enough for a usable search experience -> built a SQLite-backed metadata database from the crawl HTML and joined search hits with title, summary, and URL data -> the results page could present useful snippets instead of bare identifiers.',
      'Reproducibility matters for systems demos -> kept prebuilt index shards in the repo while preserving the full pipeline to regenerate them from the crawl corpus -> the project stayed easy to run locally without losing the indexing story.',
    ],
    stack: ['Python', 'Flask', 'SQLite', 'MapReduce', 'madoop', 'Information retrieval', 'tf-idf', 'PageRank'],
    links: [{ href: 'https://github.com/kazuhidelee/p5-search-engine' }],
  },
  {
    projectName: 'Network File System',
    description:
      'A multi-threaded network file server in C++ that handles authenticated remote file operations over encrypted client-server messages while preserving on-disk consistency under concurrent access.',
    overview:
      'I built a network file server for an operating-systems project that combined several lower-level systems concerns in one place: socket programming, encrypted request handling, filesystem semantics, concurrency control, and crash-safe disk updates. Instead of acting like a toy RPC server, it had to enforce ownership rules, session and sequence-number validity, and correct on-disk behavior across reads, appends, creates, and deletes.',
    role: 'Solo',
    approach:
      'The server listens for client requests over TCP, decrypts each request using the user password identified in a cleartext header, validates session and sequence numbers to prevent replay, and dispatches each request on a detached worker thread. On disk, the filesystem is a single-directory inode-based layout, so the server caches only the directory inode and free-block map between requests, performs the rest of the necessary reads from disk, and orders writes carefully so metadata never points to invalid blocks after a crash.',
    contributions: [
      'Implemented the C++ file server, socket setup, per-request threading model, encrypted request parsing, and response handling for session, read, append, create, and delete operations.',
      'Designed the synchronization scheme using reader-writer style locking so compatible requests could proceed in parallel while directory-mutating operations stayed serialized.',
      'Handled free-block management, directory entry allocation, file ownership checks, and crash-safe disk-write ordering for create, append, and delete operations.',
    ],
    outcome:
      'Delivered a working secure file server that supports concurrent client requests, authenticated encrypted messaging, replay-resistant session sequencing, and correct filesystem updates against an inode-based on-disk format.',
    date: '2025',
    highlights: [
      'Concurrent requests needed to avoid blocking each other unnecessarily -> designed request handling around detached threads plus reader-writer style synchronization -> session requests, parallel reads, and operations on different files could proceed concurrently without corrupting shared state.',
      'Create and delete operations mutate shared directory metadata -> separated file-level coordination from directory-level coordination -> appends and reads could stay parallel where safe while directory-changing requests remained serialized.',
      'The protocol required encrypted messages keyed by user password plus replay protection -> validated usernames, decrypted requests from cleartext size headers, and enforced per-session sequence-number rules -> the server handled authentication and nonce-style request ordering instead of blindly trusting clients.',
      'Filesystem crashes can leave metadata pointing at garbage blocks -> ordered disk writes so data blocks and inodes were written before metadata that referenced them -> create, append, and delete preserved on-disk consistency even if the server stopped mid-operation.',
      'The spec limited caching to the directory inode and free-block list -> kept the implementation lightweight and re-read file metadata from disk when needed -> the design matched the assignment constraints without hiding correctness behind aggressive in-memory state.',
    ],
    stack: ['C++', 'POSIX sockets', 'Multithreading', 'Reader-writer locks', 'File systems', 'TCP', 'Encrypted messaging', 'Systems testing'],
    extraSlides: [
      {
        title: 'Architecture Notes',
        description:
          'This diagram captures the synchronization and traversal strategy I used for core filesystem operations. It maps how create, delete, read, and write requests move through the directory and inode structure, when reader versus writer locks are acquired, and how shared resources like free-block state are protected during updates.',
        bullets: [
          'Directory traversal and file access were treated differently so reads could stay concurrent while directory-mutating operations remained serialized.',
          'The sketch also reflects the inode and data-block layout on disk, which informed both lock placement and crash-safe write ordering.',
        ],
        image: '/network-file-system-architecture.png',
        imageAlt: 'Network file system architecture and lock-traversal notes',
      },
    ],
    links: [{ href: 'https://github.com/kazuhidelee/network_file_system' }],
  },
  {
    projectName: 'BW Colorization',
    description:
      'A TensorFlow computer-vision pipeline that reproduces Zhang et al.’s image colorization method by predicting quantized color classes from grayscale images.',
    overview:
      'A reproduction of Colorful Image Colorization by Zhang et al. The value of the project is that it turns a published CV method into a working implementation, including preprocessing, training, and inference, instead of stopping at a paper summary.',
    role: 'Team of 4; primarily owned the Colab workflow and data-training pipeline',
    approach:
      'The system converts RGB images into LAB space, uses the L channel as grayscale input, quantizes the AB color space into 40 bins, and trains a TensorFlow model with categorical cross-entropy to predict per-pixel color classes.',
    contributions: [
      'Built and maintained the Colab-based workflow for experimentation.',
      'Contributed to preprocessing and the model-training pipeline.',
      'Worked on inference behavior for generated colorizations.',
    ],
    outcome:
      'Reimplemented a published grayscale-to-color pipeline end to end in TensorFlow and achieved a 3.89 average survey rating for generated images versus 4.06 for real images.',
    date: '2024',
    highlights: [
      'Direct color regression is ambiguous for many grayscale inputs -> used the paper’s quantized classification framing instead of raw regression -> the model could predict plausible color classes more stably.',
      'Grayscale images contain structure but not explicit chroma -> converted images into LAB space and separated luminance from color channels -> the training pipeline could focus the model on reconstructing color information from grayscale context.',
      'Paper reproduction requires more than copying an architecture diagram -> implemented preprocessing, quantization, training, and inference as a working pipeline -> the project became a true research implementation.',
    ],
    stack: ['TensorFlow', 'Python', 'Google Colab', 'LAB color space', 'Computer vision'],
    links: [
      { href: 'https://github.com/kazuhidelee/BWToColorized' },
      { label: 'Slides', href: 'https://canva.link/fch8jj49jb3fygw' },
      { href: 'https://arxiv.org/abs/1603.08511' },
    ],
    extraSlides: [
      {
        title: 'Motivation',
        description:
          'The project set out to colorize black-and-white scenery images without relying on user-provided reference images and without settling for dull desaturated outputs.',
        bullets: [
          'Prior colorization methods often required user input or produced less vivid results.',
          'By adapting Colorful Image Colorization by Zhang et al., the team aimed for a more automatic and vibrant approach under limited compute and training data.',
        ],
      },
      {
        title: 'Related Work',
        description:
          'Our project team explored and constrasted non-parametric and parametric colorization approaches before positioning the our method.',
        bullets: [
          'Non-parametric methods transfer colors from reference images and work well only when good matches exist, which limits scalability.',
          'Parametric methods learn color predictions from large datasets and generalize better, but must handle multimodal color prediction and rare color classes.',
          'We ended up using a parametric, classification-based direction but adapted it for lower compute and less data.',
        ],
        images: [
          { src: '/bw-non-parametric-method.png', alt: 'Example of a non-parametric image colorization method using reference candidates' },
          { src: '/bw-parametric-method.png', alt: 'Example of a parametric classification-based colorization method' },
        ],
      },
      {
        title: 'Model Architecture',
        description:
          'The model followed a paper-inspired grayscale-to-color pipeline that takes luminance input and predicts quantized color information across a sequence of convolutional layers.',
        bullets: [
          'The architecture treats colorization as classification over discrete color bins instead of direct pixel-wise regression.',
          'The pipeline uses the L channel as input and predicts AB-space color information for reconstruction into a colorized LAB image.',
          'The presentation also highlighted that the team reduced bins and adjusted the model to fit more limited memory and data.',
        ],
        images: [
          { src: '/bw-colorization-architecture.png', alt: 'BW Colorization model architecture diagram' },
          { src: '/bw-our-model.png', alt: 'BW Colorization grayscale to ab channel prediction diagram' },
        ],
      },
      {
        title: 'Objective Function',
        description:
          'In this project, we framed colorization as multinomial classification over quantized AB-space bins and optimized the model with multinomial cross-entropy loss.',
        bullets: [
          'The AB output space was quantized with grid size 10 into Q = 40 color bins.',
          'For each input image, the model learned a mapping from luminance input to a probability distribution over possible colors.',
          'Ground-truth color targets used the top 5 closest colors with Gaussian weighting.',
        ],
        images: [
          { src: '/bw-cross-entropy-loss.png', alt: 'Multinomial cross entropy loss formula used for BW Colorization' },
          { src: '/bw-color-distribution.png', alt: 'Distribution of quantized color values in AB space' },
        ],
      },
      {
        title: 'End-to-End Pipeline',
        description:
          'The pipeline moved from preprocessing through training into post-processing to reconstruct a final RGB image.',
        bullets: [
          'Preprocessing resized and normalized images, then converted them into LAB color space.',
          'Training used the luminance channel as input while the network learned to predict AB color information.',
          'Post-processing took a weighted average of the top 3 predicted colors, combined the result with luminance, and converted the image back to RGB.',
        ],
        images: [
          { src: '/bw-approach-overview.png', alt: 'Overview of combining luminance and predicted color channels to generate a colorized image' },
        ],
      },
      {
        title: 'Dataset',
        description:
          'Our team trained on scenery images from the Scene Classification Kaggle dataset, which contains around 25,000 images across six natural-scene categories.',
        bullets: [
          'Categories included buildings, forests, mountains, glaciers, streets, and sea scenes.',
          'For the actual experiment shown in the presentation, the model was trained on 1,000 images.',
          'Restricting the task to scenery aligned with the dataset bias and helped the model produce more plausible greens and blues.',
        ],
        images: [
          { src: '/bw-dataset-images.png', alt: 'Sample images from the scene classification dataset used for BW Colorization' },
        ],
      },
      {
        title: 'Generated Results',
        description:
          'These examples show representative outputs produced by the model on grayscale inputs after the training and inference pipeline was wired together.',
        bullets: [
          'The outputs illustrate how the model learned plausible color assignments for landscapes and building scenes from grayscale structure alone.',
          'The project was evaluated as a reproduction exercise, so the emphasis was on implementing the method and generating believable colorized outputs rather than claiming a novel model.',
        ],
        images: [
          { src: '/bw-colorization-results.png', alt: 'Examples of colorized images generated by the BW Colorization model' },
        ],
      },
      {
        title: 'Best and Worst Cases',
        description:
          'The presentation explicitly compared the strongest and weakest generated outputs to show where the method worked well and where it struggled.',
        bullets: [
          'Best results tended to be scenery with stronger blue and green priors, which matched the dataset bias and survey conclusions.',
          'Worst results often had weaker realism or patchier color placement in scenes that were harder to infer confidently from grayscale alone.',
        ],
        images: [
          { src: '/bw-best-results.png', alt: 'Best generated BW Colorization results' },
          { src: '/bw-worst-results.png', alt: 'Worst generated BW Colorization results' },
        ],
      },
      {
        title: 'Evaluation Method',
        description:
          'At the end of our project, we also ran a Google Forms survey with 31 respondents to measure perceived realism of generated images.',
        bullets: [
          'The survey mixed the team’s generated images with real images and Zhang et al. outputs as baselines.',
          'Participants rated how realistic each image looked, which turned the evaluation into a human-perception study instead of a purely numeric loss comparison.',
        ],
        images: [
          { src: '/bw-evaluation-form.png', alt: 'BW Colorization realism survey form' },
        ],
      },
      {
        title: 'Evaluation Results',
        description:
          'The survey showed that the stronger generated samples landed surprisingly close to real-image ratings, while weaker samples exposed the limits of training on only 1,000 images.',
        bullets: [
          'Highest generated-image score: 4.55; lowest generated-image score: 3.10; average generated-image score: 3.89.',
          'Real images averaged 4.06, with scores ranging from 3.77 to 4.35.',
          'Our project team was able to conclude that scenes dominated by greens and blues looked more realistic, which matched the composition of the training set.',
        ],
        images: [
          { src: '/bw-generated-sample-1.png', alt: 'Example survey result image for BW Colorization evaluation' },
          { src: '/bw-generated-sample-2.png', alt: 'Second survey result image for BW Colorization evaluation' },
          { src: '/bw-generated-sample-3.png', alt: 'Third survey result image for BW Colorization evaluation' },
        ],
      },
    ],
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
    company: 'Linux Foundation (OpenSSF)',
    role: 'Software Engineering Intern, LFX mentorship',
    period: 'May 2025 - Current',
    highlights: [
      'Contributing security-focused features for gittuf, an OpenSSF repository security framework that enables policy-driven software supply chain protections across Git hosting platforms.',
      'Owning the end-to-end development of gittuf visualizer, including UI/UX design, full-stack development, deployment, and technical decisions across the application stack.',
      'Improving the gittuf Terminal User Interface (TUI) to streamline developer workflows and improve accessibility for repository security management.',
    ],
  },
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
