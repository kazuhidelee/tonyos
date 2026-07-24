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
      'A budget-aware research agent that answers multi-part strategy questions by routing retrieval, compressing evidence, and synthesizing conclusions under fixed token, source, and cost limits.',
    overview:
      'A deep-research agent for long-form analysis that was designed around a real LLM systems constraint: producing useful multi-source reports without blowing through context windows or API budget. Instead of stuffing all retrieved text into one final prompt, the system decomposes the question, compresses evidence into notes, and only carries forward the highest-value information.',
    role: 'Solo',
    approach:
      'The system uses a query planner, retrieval router, evidence compressor, memory store, budget manager, top-k evidence selector, and a final synthesizer. It runs offline against a bundled corpus by default, and can switch to live Tavily retrieval plus OpenAI-backed synthesis when keys are available.',
    contributions: [
      'Designed the end-to-end agent architecture and pipeline stages.',
      'Implemented retrieval routing, fallback behavior, and budget controls in code.',
      'Built the evidence note memory layer, CLI flow, and FastAPI interface.',
    ],
    outcome:
      'Enforced hard per-session limits of 2000 context tokens, 8 retained sources, 5 final evidence notes, and $0.05 estimated cost while preserving a full retrieval-to-synthesis workflow.',
    date: 'Mar 2026 - May 2026',
    highlights: [
      'Hard context and session budget limits -> introduced explicit token, source-count, and evidence-note caps before final synthesis -> the agent had to prioritize only the highest-value evidence instead of passing full context.',
      'Need for reproducible demos without paid APIs -> built an offline-first corpus path with the same pipeline shape as the live system -> the project remained demoable locally while preserving the budget-management story.',
      'Retrieval breadth versus reproducibility -> added a router that prefers Tavily when configured and falls back to the local corpus otherwise -> the system could handle both stable demos and broader live research.',
      'Transparency versus abstraction -> surfaced whether the run used offline or OpenAI synthesis and whether retrieval was live or local -> reviewers can see what the system actually did instead of guessing from a polished UI.',
    ],
    stack: ['Python', 'FastAPI', 'OpenAI API', 'Tavily', 'CLI', 'LLM orchestration'],
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
      'A public API that serves historical windrose data for the Detroit Air research site’s air-quality visualization workflows.',
    overview:
      'A standalone backend service for historical windrose data used by an air-quality research application. The project exists because research visualizations need a reusable data service rather than hardcoded file access or one-off scripts embedded in the frontend.',
    role: 'Solo project within a research group; owned the API design, implementation, and deployment',
    approach:
      'The API packages historical regional wind data behind a service layer that can be queried by the research application. It was deployed independently so the Detroit Air site could consume it as a dedicated backend dependency.',
    contributions: [
      'Built the API and defined how windrose data would be exposed to consumers.',
      'Separated research-specific data logic into a reusable backend service.',
      'Deployed the service on Google Cloud for research-site integration.',
    ],
    outcome:
      'Deployed on Google Cloud for the Detroit Air research project; the Vercel deployment was only used for testing.',
    date: '2024',
    highlights: [
      'Research data is often stored in formats that are inconvenient for frontend visualization -> wrapped the dataset behind a dedicated API layer -> downstream clients could consume a cleaner interface.',
      'The backend had to serve a real research-facing application rather than a toy demo -> deployed it as a standalone public service -> the system became reusable outside a local dev environment.',
      'Research tooling often gets embedded in one application and becomes hard to reuse -> separated the windrose logic into its own backend component -> the data service could support the Detroit Air site without coupling the logic to the UI.',
    ],
    stack: ['Node.js', 'JavaScript', 'API development', 'Google Cloud'],
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
      'A search engine that indexes documents and ranks results using tf-idf and PageRank-style scoring over a MapReduce-based processing pipeline.',
    overview:
      'A search engine project focused on the systems side of retrieval: document processing, indexing, ranking, and scaling the pipeline instead of only building a search UI.',
    role: 'Solo',
    approach:
      'The system processes document collections with custom Python MapReduce scripts, builds an index, and ranks results using tf-idf and PageRank-inspired signals. The main value is the retrieval pipeline and ranking logic rather than the presentation layer.',
    contributions: [
      'Built the indexing and retrieval pipeline for document processing.',
      'Implemented scoring and ranking logic using tf-idf and PageRank concepts.',
      'Integrated custom Python scripts to model distributed indexing workflows.',
    ],
    outcome:
      'Processed roughly 3,062 documents and validated correctness through unit testing.',
    date: '2024',
    highlights: [
      'Search quality depends on more than string matching -> combined term-based relevance with link-structure ranking -> results could reflect both content and graph importance.',
      'Processing a few thousand documents serially would not reflect real search-engine structure -> built custom Python MapReduce scripts for indexing workflows -> the project better modeled distributed document processing at small scale.',
      'A retrieval system needs to serve ranked answers, not just indexed data -> designed scoring and ranking around tf-idf and PageRank ideas -> the project demonstrated actual IR fundamentals instead of pure parsing.',
    ],
    stack: ['C++', 'Python', 'Custom MapReduce scripts', 'tf-idf', 'PageRank', 'Unit testing'],
    links: [{ href: 'https://github.com/kazuhidelee/p5-search-engine' }],
  },
  {
    projectName: 'Network File System',
    description:
      'A multi-threaded network file server that supports remote read, write, and delete operations across concurrent clients.',
    overview:
      'A network file server for concurrent remote filesystem operations. The value here is that it combines file-system semantics, networking, and concurrency control in one system.',
    role: 'Solo',
    approach:
      'The service accepts remote client operations and coordinates read, write, and delete requests against server-side state with multithreaded concurrency controls and security checks.',
    contributions: [
      'Implemented the server, request handling, and concurrent file operations.',
      'Added coordination around shared file state for remote clients.',
      'Validated behavior through unit tests across core operation types.',
    ],
    outcome:
      'Implemented a secure concurrent file-service design and validated behavior through unit testing.',
    date: '2025',
    highlights: [
      'Concurrent clients can interfere with shared file state -> used multithreaded server-side coordination around file operations -> the system could handle remote requests with correctness checks validated by tests.',
      'File-serving systems need correctness across multiple operation types -> designed explicit handling for read, write, and delete behavior -> the project covered more realistic filesystem semantics than a read-only demo.',
      'Remote access introduces both security and coordination concerns -> built the server as a secure multi-threaded system -> the design better reflects real backend systems constraints.',
    ],
    stack: ['C++', 'Multithreading', 'Networking', 'File systems', 'Unit testing'],
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
          'The presentation contrasted non-parametric and parametric colorization approaches before positioning the team’s method.',
        bullets: [
          'Non-parametric methods transfer colors from reference images and work well only when good matches exist, which limits scalability.',
          'Parametric methods learn color predictions from large datasets and generalize better, but must handle multimodal color prediction and rare color classes.',
          'The team used a parametric, classification-based direction but adapted it for lower compute and less data.',
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
          'The project framed colorization as multinomial classification over quantized AB-space bins and optimized the model with multinomial cross-entropy loss.',
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
          'The team trained on scenery images from the Scene Classification Kaggle dataset, which contains around 25,000 images across six natural-scene categories.',
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
          'The team ran a Google Forms survey with 31 respondents to measure perceived realism of generated images.',
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
          'The presentation concluded that scenes dominated by greens and blues looked more realistic, which matched the composition of the training set.',
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
