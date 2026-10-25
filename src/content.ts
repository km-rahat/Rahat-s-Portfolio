// =========================================================================
// SITE CONTENT CONFIGURATION & MASTER DATA SOURCE
// All text, images, links, projects, skills, experience, education & theme colors
// are centralized in this single file. No hardcoded content anywhere else.
// =========================================================================

export const ENABLE_EDITOR = true;

export interface SkillItemContent {
  id: string;
  name: string;
  category: 'Frontend' | '3D / Graphics' | 'Backend' | 'Tools / DevOps' | 'Core / Languages';
  level: number; // 0 - 100
  description: string;
  usedIn: string[];
}

export interface ProjectContent {
  id: string;
  title: string;
  category: '3d-webgl' | 'ai-systems' | 'fintech' | 'creative';
  description: string;
  extendedDescription: string;
  image: string;
  techTags: string[];
  year: string;
  role: string;
  metrics?: string;
  liveUrl: string;
  githubUrl: string;
  highlights: string[];
}

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  place: string;
  description: string;
  location?: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface CounterItem {
  label: string;
  value: number;
  suffix: string;
  subtext: string;
}

export interface SiteContent {
  profile: {
    name: string;
    shortName: string;
    roles: string[];
    tagline: string;
    availabilityText: string;
    resumeUrl: string;
    photoUrl: string;
    location: string;
  };
  hero: {
    kicker: string;
    greeting: string;
    description: string;
    primaryButtonLabel: string;
    primaryButtonTarget: string;
    secondaryButtonLabel: string;
    secondaryButtonTarget: string;
    statusPeriod: string;
  };
  about: {
    badge: string;
    heading: string;
    paragraphs: string[];
    counters: CounterItem[];
    photoUrl: string;
    methodologyNotes: {
      leftTitle: string;
      leftSubtitle: string;
      leftText: string;
      rightTitle: string;
      rightSubtitle: string;
      rightText: string;
    };
  };
  skills: SkillItemContent[];
  projects: ProjectContent[];
  experienceSection: {
    badge: string;
    heading: string;
    subtitle: string;
  };
  experience: TimelineEntry[];
  educationSection: {
    badge: string;
    heading: string;
    subtitle: string;
  };
  education: TimelineEntry[];
  contact: {
    badge: string;
    heading: string;
    subheading: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    socials: SocialLink[];
    formTargetEmail: string;
    footerCopyright: string;
  };
  seo: {
    pageTitle: string;
    metaDescription: string;
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
  };
}

export const SITE_CONTENT: SiteContent = {
  profile: {
    name: 'Khalid Mahmud Rahat',
    shortName: 'KM RAHAT',
    roles: [
      'Creative Technologist',
      '3D WebGL Architect',
      'Full-Stack Engineer',
      'Interactive UI/UX Designer',
      'Generative Systems Developer',
    ],
    tagline:
      'Engineering immersive digital realities at the intersection of WebGL, generative algorithms, and fluid interface design.',
    availabilityText: 'AVAILABLE FOR SELECTIVE COMMISSIONS',
    resumeUrl: '#',
    photoUrl: 'https://i.postimg.cc/9XqD9rG1/me.png',
    location: 'San Francisco, CA / Remote',
  },
  hero: {
    kicker: 'SPATIAL WEB & CREATIVE ENGINEERING',
    greeting: 'Hello, I am',
    description:
      'Engineering immersive digital realities at the intersection of WebGL, generative algorithms, and fluid interface design.',
    primaryButtonLabel: 'View My Work',
    primaryButtonTarget: '#projects',
    secondaryButtonLabel: 'Contact Me',
    secondaryButtonTarget: '#contact',
    statusPeriod: 'Q1–Q4 2026',
  },
  about: {
    badge: '01. Background & Philosophy',
    heading: 'Engineering Visual Singularities',
    paragraphs: [
      'I craft award-winning digital experiences that bridge sculptural aesthetics and high-performance computing.',
      'Specialized in interactive Three.js environments, reactive shader design, and scalable frontend architectures that captivate audiences and elevate brand presence.',
      'Driven by typographic rigor, 60 FPS motion fidelity, and creating software that feels like touching the future.',
    ],
    counters: [
      { label: 'Engineering Experience', value: 6, suffix: '+ Yrs', subtext: 'Production Web & 3D' },
      { label: 'Products Shipped', value: 38, suffix: '+', subtext: 'Commercial Releases' },
      { label: 'Performance Benchmark', value: 60, suffix: ' FPS', subtext: 'Zero-Jank Guarantee' },
      { label: 'Design & Dev Awards', value: 14, suffix: ' Global', subtext: 'Awwwards, FWA, CSSDA' },
    ],
    photoUrl: 'https://i.postimg.cc/9XqD9rG1/me.png',
    methodologyNotes: {
      leftTitle: 'Deterministic WebGL',
      leftSubtitle: 'SHADER PIPELINES',
      leftText:
        'Profiling draw calls, optimizing buffer geometries, and authoring modular GLSL shaders to guarantee rock-solid 60 FPS across low-power mobile devices.',
      rightTitle: 'Tactile Micro-Physics',
      rightSubtitle: 'ERGONOMIC UX',
      rightText:
        'Every transition utilizes spring physics curves, subtle cursor parallax, and typographic restraint so interactions feel grounded and organic.',
    },
  },
  skills: [
    {
      id: 'react-next',
      name: 'React / Next.js',
      category: 'Frontend',
      level: 95,
      description:
        'Modern component architecture, SSR/SSG, App Router, and high-performance reactive web applications.',
      usedIn: ['Next.js App Router', 'React 19', 'Server Actions'],
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Core / Languages',
      level: 96,
      description:
        'Strict type-safe systems, complex generic patterns, AST manipulation, and robust developer tooling.',
      usedIn: ['Enterprise Codebases', 'Generic Design', 'Strict Typing'],
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'Frontend',
      level: 98,
      description:
        'Utility-first token architectures, custom theme plugins, responsive design, and zero-runtime CSS layouts.',
      usedIn: ['Design Systems', 'Modern UI', 'Micro-Interactions'],
    },
    {
      id: 'html-canvas',
      name: 'HTML5 & Canvas',
      category: 'Frontend',
      level: 94,
      description:
        'Semantic document tree, custom 2D bitmap manipulation, ImageData processing, and offscreen rendering.',
      usedIn: ['Particle Systems', '2D Games', 'Raster Graphics'],
    },
    {
      id: 'threejs',
      name: 'Three.js / WebGL',
      category: '3D / Graphics',
      level: 92,
      description:
        'Low-level WebGL pipelines, procedural BufferGeometries, custom PBR material pipelines, and 60 FPS scenes.',
      usedIn: ['3D Web Experiences', 'PBR Materials', 'Procedural Mesh'],
    },
    {
      id: 'r3f',
      name: 'React Three Fiber',
      category: '3D / Graphics',
      level: 94,
      description:
        'Declarative 3D scene graphs, Drei integration, spring-driven kinematics, and synchronized camera rigs.',
      usedIn: ['Interactive 3D UI', 'Drei Controls', 'Frame Loops'],
    },
    {
      id: 'glsl',
      name: 'GLSL Shaders',
      category: '3D / Graphics',
      level: 90,
      description:
        'Vertex & fragment shaders, raymarching, simplex/perlin noise synthesis, and screen-space post-processing.',
      usedIn: ['Custom VFX', 'Noise Waves', 'Distortion Effects'],
    },
    {
      id: 'framer-motion',
      name: 'Framer Motion',
      category: 'Frontend',
      level: 92,
      description:
        'Physical spring animations, layout morphing, gesture responders, and orchestration timelines.',
      usedIn: ['Page Transitions', 'Micro-Interactions', 'Layout Springs'],
    },
    {
      id: 'gsap',
      name: 'GSAP & ScrollTrigger',
      category: '3D / Graphics',
      level: 91,
      description:
        'Pinned scroll choreographies, scrubbing camera timelines, MorphSVG, and high-precision animation tweens.',
      usedIn: ['Scroll Narratives', 'Scrub Timelines', 'SVG Morphing'],
    },
    {
      id: 'node-express',
      name: 'Node.js & Express',
      category: 'Backend',
      level: 90,
      description:
        'Scalable REST services, asynchronous queue workers, custom streaming pipelines, and secure middleware.',
      usedIn: ['REST Endpoints', 'Async Workers', 'Stream Pipelines'],
    },
    {
      id: 'postgres-prisma',
      name: 'PostgreSQL & Prisma',
      category: 'Backend',
      level: 88,
      description:
        'Relational data modeling, ACID transactions, Prisma ORM schema migrations, and index optimization.',
      usedIn: ['PostgreSQL DB', 'Prisma Schema', 'Query Optimization'],
    },
    {
      id: 'graphql-rest',
      name: 'GraphQL & REST APIs',
      category: 'Backend',
      level: 89,
      description:
        'Schema-first API design, typed query resolvers, mutation contracts, and distributed edge caching.',
      usedIn: ['Apollo Client', 'Type-Safe APIs', 'Edge Cache'],
    },
    {
      id: 'firebase-supabase',
      name: 'Firebase & Supabase',
      category: 'Backend',
      level: 91,
      description:
        'Real-time database synchronizations, Row Level Security (RLS), OAuth auth flows, and edge functions.',
      usedIn: ['Realtime Sync', 'Firestore Rules', 'Cloud Auth'],
    },
    {
      id: 'vite-webpack',
      name: 'Vite & Webpack',
      category: 'Tools / DevOps',
      level: 93,
      description:
        'Ultra-fast ESM build pipelines, Rollup custom plugins, code chunk splitting, and production asset tuning.',
      usedIn: ['Fast HMR', 'Bundle Optimization', 'Tree Shaking'],
    },
    {
      id: 'blender-assets',
      name: 'Blender & 3D Assets',
      category: '3D / Graphics',
      level: 86,
      description:
        'Low-poly topology modeling, UV unwrapping, normal/ambient occlusion texture baking, and GLTF Draco exports.',
      usedIn: ['GLTF Pipelines', 'Texture Baking', '3D Asset Prep'],
    },
    {
      id: 'web-performance',
      name: 'Web Performance',
      category: 'Tools / DevOps',
      level: 95,
      description:
        'Core Web Vitals tuning, 60 FPS frame-budget enforcement, memory leak audits, and GPU profiling.',
      usedIn: ['Lighthouse 100', 'INP / LCP / CLS', 'Chrome DevTools'],
    },
  ],
  projects: [
    {
      id: 'cyber-finance',
      title: 'Algorithmic Liquid Terminal',
      category: 'fintech',
      description:
        'High-frequency decentralized market intelligence and algorithmic order routing console.',
      extendedDescription:
        'Architected a real-time financial execution suite processing 10,000+ tick events per second with sub-millisecond chart rendering, custom WebGL candlestick shaders, and glassmorphic depth.',
      image: '/src/assets/images/project_cyber_finance_1791914218241.jpg',
      techTags: ['React 19', 'Three.js', 'WebSockets', 'Tailwind CSS', 'TypeScript'],
      year: '2026',
      role: 'Lead Systems Architect & 3D UI',
      metrics: '$1.2M+ Daily Volume Processed',
      liveUrl: 'https://example.com/liquid-terminal',
      githubUrl: 'https://github.com/example/liquid-terminal',
      highlights: [
        'Custom GPU-accelerated candlestick rendering at 120 FPS',
        'Instant WebSocket orderbook streaming with zero frame drops',
        'Dynamic risk telemetry visualizer with glowing vector lines',
      ],
    },
    {
      id: 'spatial-ai',
      title: 'Aether Neural Workspace',
      category: 'ai-systems',
      description:
        'Volumetric 3D node graph and spatial canvas for multi-agent generative workflow synthesis.',
      extendedDescription:
        'A revolutionary 3D spatial thinking environment enabling knowledge workers to visualize agent reasoning paths, semantic clusters, and live generative memory graphs in an infinite dark cosmic viewport.',
      image: '/src/assets/images/project_spatial_ai_1791914217654.jpg',
      techTags: ['Three.js', 'WebGL Shaders', 'Force-Directed Graph', 'TypeScript', 'Tailwind CSS'],
      year: '2025',
      role: 'Founding Engineer & Interaction Designer',
      metrics: '45k Active Nodes Clustered',
      liveUrl: 'https://example.com/aether-workspace',
      githubUrl: 'https://github.com/example/aether-workspace',
      highlights: [
        '3D spatial clustering with spatial audio cues on node activation',
        'Custom raymarching bloom shaders for volumetric node links',
        'Sub-16ms camera navigation with inertia damping',
      ],
    },
    {
      id: 'generative-synth',
      title: 'Holographic Audio Synthesis Studio',
      category: 'creative',
      description:
        'Browser-native modular sound synthesizer featuring reactive 3D harmonic waveforms.',
      extendedDescription:
        'An audiovisual production platform coupling the Web Audio API with procedural geometry deformation. Every frequency, harmonic resonance, and envelope shape dynamically sculpts a 3D holographic wireframe in real time.',
      image: '/src/assets/images/project_generative_synth_1791914218103.jpg',
      techTags: ['Web Audio API', 'Three.js', 'DSP Algorithms', 'Motion', 'Tailwind CSS'],
      year: '2025',
      role: 'Solo Creator & Sound Engineer',
      metrics: '250k+ Tracks Exported',
      liveUrl: 'https://example.com/holographic-synth',
      githubUrl: 'https://github.com/example/holographic-synth',
      highlights: [
        'Zero-latency polyphonic oscillator engine with 16 voice matrix',
        'Audio-reactive vertex displacement shader matching FFT frequencies',
        'Interactive patch-cable routing in full 3D perspective',
      ],
    },
    {
      id: 'nebula-cloud',
      title: 'Global Edge Mesh Constellation',
      category: '3d-webgl',
      description:
        'Interactive 3D planetarium and telemetry monitor for distributed edge server clusters.',
      extendedDescription:
        'A planetary-scale network monitor that visualizes worldwide traffic flow, DDoS mitigations, and fiber transit health as glowing cyber-arcs traversing an interactive 3D globe with real-time ping telemetry.',
      image: '/src/assets/images/project_nebula_cloud_1791914218276.jpg',
      techTags: ['Three.js', 'GeoJSON', 'Edge Telemetry', 'React', 'Tailwind CSS'],
      year: '2024',
      role: 'Visualization Lead',
      metrics: '99.999% Reliability Monitored',
      liveUrl: 'https://example.com/edge-constellation',
      githubUrl: 'https://github.com/example/edge-constellation',
      highlights: [
        'Interactive 3D geospatial projection with 42,000 live server pins',
        'Custom bezier curve particle flow indicating transit packets',
        'Adaptive LOD rendering dynamically scaling for mobile and desktop',
      ],
    },
  ],
  experienceSection: {
    badge: '04. Professional Trajectory',
    heading: 'Experience',
    subtitle: 'Leadership, Community Engagement & Engineering Impact',
  },
  experience: [
    {
      id: 'exp-1',
      period: '2025 – 2026',
      title: 'Executive',
      place: 'AIUB Community of Engineering of Students (ACES)',
      description:
        'Took on a leadership role in the community, helping plan and run activities for engineering students.',
    },
    {
      id: 'exp-2',
      period: '2025 – 2026',
      title: 'Executive, Graphic Design',
      place: 'AIUB Firefox',
      description:
        "Worked as a graphic design executive, creating visual content and designs for the club's activities and events.",
    },
    {
      id: 'exp-3',
      period: '2024 – 2025',
      title: 'Volunteer',
      place: 'AIUB Community of Engineering of Students (ACES)',
      description:
        "Supported the community's events and activities as a volunteer, working with the team behind the scenes.",
    },
    {
      id: 'exp-4',
      period: '2024 – Present',
      title: 'General Member',
      place: 'AIUB Computer Club',
      description:
        "Active member of the university's computer club, taking part in tech activities and learning from peers.",
    },
    {
      id: 'exp-5',
      period: '2023 – Present',
      title: 'Content Writer',
      place: 'BD Career, TeachingBD and others',
      description:
        'Wrote and published articles and web content on multiple websites, improving my research, writing, and communication skills.',
    },
  ],
  educationSection: {
    badge: '05. Academic Background',
    heading: 'Education',
    subtitle: 'Formal Computer Science Foundations & Academic Qualifications',
  },
  education: [
    {
      id: 'edu-1',
      period: '2023 – Present',
      title: 'Computer Science and Engineering (CSE)',
      place: 'American International University-Bangladesh (AIUB)',
      description:
        'Studying CSE with a focus on software engineering, building projects and learning design alongside code.',
    },
    {
      id: 'edu-2',
      period: '2020 – 2022',
      title: 'Higher Secondary Certificate (HSC)',
      place: 'Notunhut Public College, Jashore',
      description: 'Completed higher secondary education.',
    },
    {
      id: 'edu-3',
      period: '2018 – 2020',
      title: 'Secondary School Certificate (SSC)',
      place: 'Jhikargacha Badruddin Muslim High School',
      description: 'Completed secondary education.',
    },
  ],
  contact: {
    badge: '06. Initiate Transmission',
    heading: "Let's Build Something Extraordinary",
    subheading: 'TYPICAL RESPONSE TIME < 24 HOURS',
    description:
      'Have a bold product vision, upcoming WebGL exhibition, or brand re-architecture? Reach out directly or dispatch a transmission via the cyber console.',
    email: 'rahatboss015@gmail.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA / Remote',
    socials: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'LinkedIn', url: 'https://linkedin.com' },
      { label: 'Twitter / X', url: 'https://x.com' },
      { label: 'Instagram', url: 'https://instagram.com' },
    ],
    formTargetEmail: 'rahatboss015@gmail.com',
    footerCopyright: '© 2026 Crafted with WebGL & Three.js',
  },
  seo: {
    pageTitle: 'Khalid Mahmud Rahat // 3D Creative Portfolio & Web Architect',
    metaDescription:
      'Award-winning 3D interactive portfolio featuring cosmic cyber-glass aesthetics, interactive Three.js scenes, orbital skills core, and project showcase.',
  },
  theme: {
    primary: '#7C3AED',
    secondary: '#22D3EE',
    accent: '#F472B6',
    bg: '#05060F',
    text: '#F8FAFC',
  },
};
