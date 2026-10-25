// =========================================================================
// SITE CONTENT CONFIGURATION & MASTER DATA SOURCE
// All text, images, links, projects, skills, experience, education & theme colors
// are centralized in this single file. No hardcoded content anywhere else.
// =========================================================================

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
  timeline?: any[];
}

export const SITE_CONTENT: SiteContent = {
  profile: {
    name: "KHALID MAHMUD RAHAT",
    shortName: "KM RAHAT",
    roles: [
      "Software Engineering Student",
      "Web Developer",
      "Full-Stack Engineer",
      "UI/UX Designer",
      "Learning Mobile App Developer",
      "Coffee-Powered Coder "
    ],
    tagline: "I build fast, modern websites and web apps that look great and work smoothly on every device.",
    availabilityText: "AVAILABLE FOR SELECTIVE COMMISSIONS",
    resumeUrl: "#",
    photoUrl: "https://i.postimg.cc/9XqD9rG1/me.png",
    location: "Dhaka, Bangladesh / Remote"
  },
  hero: {
    kicker: "CREATIVE  WEB DEVELOPER & INNOVETOR",
    greeting: "Hello, I am",
    description: "I build fast, modern websites and web apps that look great and work smoothly on every device.",
    primaryButtonLabel: "View My Work",
    primaryButtonTarget: "#projects",
    secondaryButtonLabel: "Contact Me",
    secondaryButtonTarget: "#contact",
    statusPeriod: "Q1–Q4 2026"
  },
  about: {
    badge: "01. Background & Philosophy",
    heading: "Engineering Visual Singularities",
    paragraphs: [
      "I believe technology should make people's lives easier, not more complicated. I want to combine creativity and code to build solutions that are simple, useful, and thoughtfully designed, and to lead by learning, helping others, and always improving."
    ],
    counters: [
      {
        label: "Engineering Experience",
        value: 3,
        suffix: "+ Yrs",
        subtext: "Production Web & 3D"
      },
      {
        label: "Clubs & Organizations",
        value: 4,
        suffix: "+",
        subtext: ""
      },
      {
        label: "Events Managed",
        value: 8,
        suffix: "+",
        subtext: ""
      },
      {
        label: "Project",
        value: 7,
        suffix: "+",
        subtext: ""
      }
    ],
    photoUrl: "https://i.postimg.cc/9XqD9rG1/me.png",
    methodologyNotes: {
      leftTitle: "Deterministic WebGL",
      leftSubtitle: "SHADER PIPELINES",
      leftText: "Profiling draw calls, optimizing buffer geometries, and authoring modular GLSL shaders to guarantee rock-solid 60 FPS across low-power mobile devices.",
      rightTitle: "Tactile Micro-Physics",
      rightSubtitle: "ERGONOMIC UX",
      rightText: "Every transition utilizes spring physics curves, subtle cursor parallax, and typographic restraint so interactions feel grounded and organic."
    }
  },
  skills: [
    {
      id: "react-next",
      name: "React / Next.js",
      category: "Frontend",
      level: 95,
      description: "Modern component architecture, SSR/SSG, App Router, and high-performance reactive web applications.",
      usedIn: [
        "Next.js App Router",
        "React 19",
        "Server Actions"
      ]
    },
    {
      id: "typescript",
      name: "Frontend Development",
      category: "Frontend",
      level: 90,
      description: "Building responsive websites with clean, well-structured code.",
      usedIn: [
        "Websites",
        "Portfolios",
        "Web apps"
      ]
    },
    {
      id: "tailwind",
      name: "Backend Development\t",
      category: "Backend",
      level: 98,
      description: "Building the server-side logic that powers web applications.",
      usedIn: [
        "Web apps",
        "Projects"
      ]
    },
    {
      id: "html-canvas",
      name: "HTML and CSS",
      category: "Frontend",
      level: 94,
      description: "Writing semantic, responsive layouts and styling them cleanly.\t",
      usedIn: [
        "Websites",
        "Landing pages"
      ]
    },
    {
      id: "threejs",
      name: "JavaScript",
      category: "Core / Languages",
      level: 92,
      description: "Adding interactivity and logic to web pages.",
      usedIn: [
        "Web apps",
        "Animations"
      ]
    },
    {
      id: "r3f",
      name: "Java / C / C++",
      category: "Core / Languages",
      level: 94,
      description: "Writing programs and solving problems with core programming languages.",
      usedIn: [
        "Coursework",
        "Algorithms"
      ]
    },
    {
      id: "glsl",
      name: "UI/UX Design",
      category: "Frontend",
      level: 90,
      description: "Designing simple, user-friendly interfaces that are easy and enjoyable to use.",
      usedIn: [
        "Wireframes",
        "Prototypes",
        "Web design"
      ]
    },
    {
      id: "framer-motion",
      name: "Figma",
      category: "Tools / DevOps",
      level: 92,
      description: "Designing screens, prototypes, and design systems collaboratively.",
      usedIn: [
        "UI design",
        "Prototyping"
      ]
    },
    {
      id: "gsap",
      name: "SQL and Databases",
      category: "Backend",
      level: 91,
      description: "Designing tables and querying data for applications.",
      usedIn: [
        "Coursework",
        "Projects"
      ]
    },
    {
      id: "node-express",
      name: "Git and GitHub",
      category: "Backend",
      level: 90,
      description: "Tracking changes and collaborating on code with a team.",
      usedIn: [
        "Version control",
        "Team projects"
      ]
    },
    {
      id: "firebase-supabase",
      name: "Firebase & Supabase",
      category: "Backend",
      level: 91,
      description: "Real-time database synchronizations, Row Level Security (RLS), OAuth auth flows, and edge functions.",
      usedIn: [
        "Realtime Sync",
        "Firestore Rules",
        "Cloud Auth"
      ]
    },
    {
      id: "web-performance",
      name: "Web Performance",
      category: "Tools / DevOps",
      level: 95,
      description: "Core Web Vitals tuning, 60 FPS frame-budget enforcement, memory leak audits, and GPU profiling.",
      usedIn: [
        "Lighthouse 100",
        "INP / LCP / CLS",
        "Chrome DevTools"
      ]
    }
  ],
  projects: [
    {
      id: "cyber-finance",
      title: "Algorithmic Liquid Terminal",
      category: "fintech",
      description: "High-frequency decentralized market intelligence and algorithmic order routing console.",
      extendedDescription: "Architected a real-time financial execution suite processing 10,000+ tick events per second with sub-millisecond chart rendering, custom WebGL candlestick shaders, and glassmorphic depth.",
      image: "/src/assets/images/project_cyber_finance_1791914218241.jpg",
      techTags: [
        "React 19",
        "Three.js",
        "WebSockets",
        "Tailwind CSS",
        "TypeScript"
      ],
      year: "2026",
      role: "Lead Systems Architect & 3D UI",
      metrics: "$1.2M+ Daily Volume Processed",
      liveUrl: "https://example.com/liquid-terminal",
      githubUrl: "https://github.com/example/liquid-terminal",
      highlights: [
        "Custom GPU-accelerated candlestick rendering at 120 FPS",
        "Instant WebSocket orderbook streaming with zero frame drops",
        "Dynamic risk telemetry visualizer with glowing vector lines"
      ]
    },
    {
      id: "spatial-ai",
      title: "Aether Neural Workspace",
      category: "ai-systems",
      description: "Volumetric 3D node graph and spatial canvas for multi-agent generative workflow synthesis.",
      extendedDescription: "A revolutionary 3D spatial thinking environment enabling knowledge workers to visualize agent reasoning paths, semantic clusters, and live generative memory graphs in an infinite dark cosmic viewport.",
      image: "/src/assets/images/project_spatial_ai_1791914217654.jpg",
      techTags: [
        "Three.js",
        "WebGL Shaders",
        "Force-Directed Graph",
        "TypeScript",
        "Tailwind CSS"
      ],
      year: "2025",
      role: "Founding Engineer & Interaction Designer",
      metrics: "45k Active Nodes Clustered",
      liveUrl: "https://example.com/aether-workspace",
      githubUrl: "https://github.com/example/aether-workspace",
      highlights: [
        "3D spatial clustering with spatial audio cues on node activation",
        "Custom raymarching bloom shaders for volumetric node links",
        "Sub-16ms camera navigation with inertia damping"
      ]
    },
    {
      id: "generative-synth",
      title: "Holographic Audio Synthesis Studio",
      category: "creative",
      description: "Browser-native modular sound synthesizer featuring reactive 3D harmonic waveforms.",
      extendedDescription: "An audiovisual production platform coupling the Web Audio API with procedural geometry deformation. Every frequency, harmonic resonance, and envelope shape dynamically sculpts a 3D holographic wireframe in real time.",
      image: "/src/assets/images/project_generative_synth_1791914218103.jpg",
      techTags: [
        "Web Audio API",
        "Three.js",
        "DSP Algorithms",
        "Motion",
        "Tailwind CSS"
      ],
      year: "2025",
      role: "Solo Creator & Sound Engineer",
      metrics: "250k+ Tracks Exported",
      liveUrl: "https://example.com/holographic-synth",
      githubUrl: "https://github.com/example/holographic-synth",
      highlights: [
        "Zero-latency polyphonic oscillator engine with 16 voice matrix",
        "Audio-reactive vertex displacement shader matching FFT frequencies",
        "Interactive patch-cable routing in full 3D perspective"
      ]
    },
    {
      id: "nebula-cloud",
      title: "Global Edge Mesh Constellation",
      category: "3d-webgl",
      description: "Interactive 3D planetarium and telemetry monitor for distributed edge server clusters.",
      extendedDescription: "A planetary-scale network monitor that visualizes worldwide traffic flow, DDoS mitigations, and fiber transit health as glowing cyber-arcs traversing an interactive 3D globe with real-time ping telemetry.",
      image: "/src/assets/images/project_nebula_cloud_1791914218276.jpg",
      techTags: [
        "Three.js",
        "GeoJSON",
        "Edge Telemetry",
        "React",
        "Tailwind CSS"
      ],
      year: "2024",
      role: "Visualization Lead",
      metrics: "99.999% Reliability Monitored",
      liveUrl: "https://example.com/edge-constellation",
      githubUrl: "https://github.com/example/edge-constellation",
      highlights: [
        "Interactive 3D geospatial projection with 42,000 live server pins",
        "Custom bezier curve particle flow indicating transit packets",
        "Adaptive LOD rendering dynamically scaling for mobile and desktop"
      ]
    }
  ],
  experienceSection: {
    badge: "04. Professional Trajectory",
    heading: "Experience",
    subtitle: "Leadership, Community Engagement & Engineering Impact"
  },
  experience: [
    {
      id: "senior-interactive",
      period: "2025 – 2026",
      title: "Graphic Design Executive",
      place: "AIUB Firefox",
      description: "Worked as a graphic design executive, creating visual content and designs for the club's activities and events."
    },
    {
      id: "lead-technologist",
      period: "2022 — Present",
      title: "Content Writer",
      place: "BD Career, TeachingBD, Shoutmecrunch and others",
      description: "Wrote and published articles and web content on multiple websites, improving my research, writing, and communication skills."
    },
    {
      id: "creative-developer",
      period: "2025 – 2026",
      title: "Executive, ACES",
      place: "AIUB Community of Engineering of Students (ACES)",
      description: "Took on a leadership role in the community, helping plan and run activities for engineering students."
    },
    {
      id: "education-degree",
      period: "2024 — present",
      title: "General Member, AIUB Computer Club",
      place: "AIUB Computer Club (ACC)",
      description: "Active member of the university's computer club, taking part in tech activities and learning from peers."
    }
  ],
  educationSection: {
    badge: "05. Academic Background",
    heading: "Education",
    subtitle: "Formal Computer Science Foundations & Academic Qualifications"
  },
  education: [
    {
      id: "timeline-1792775835874",
      period: "2023 — Present",
      title: "Computer Science and Engineering (CSE)",
      place: "American International University-Bangladesh (AIUB)",
      description: "Studying CSE with a focus on software engineering, building projects and learning design alongside code."
    },
    {
      id: "timeline-1792775975462",
      period: "2020 – 2022",
      title: "Higher Secondary Certificate (HSC)",
      place: "Notunhut Public College, Jashore",
      description: "Completed higher secondary education."
    },
    {
      id: "timeline-1792776030279",
      period: "2018 – 2020",
      title: "Secondary School Certificate (SSC)",
      place: "Jhikargacha Badruddin Muslim High School",
      description: "Completed secondary education."
    }
  ],
  contact: {
    badge: "05. Initiate Transmission",
    heading: "Let's Build Something Extraordinary",
    subheading: "TYPICAL RESPONSE TIME < 24 HOURS",
    description: "Have a bold product vision, upcoming WebGL exhibition, or brand re-architecture? Reach out directly or dispatch a transmission via the cyber console.",
    email: "rahatboss015@gmail.com",
    phone: "+8801521-757651",
    location: "San Francisco, CA / Remote",
    socials: [
      {
        label: "GitHub",
        url: "https://github.com/km-rahat"
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/km-rahat-5b37b2306/"
      },
      {
        label: "Twitter / X",
        url: "https://x.com/km_rahat1199"
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/km_raha_ttt/"
      }
    ],
    formTargetEmail: "rahatboss015@gmail.com",
    footerCopyright: "Developed By Khalid Mahmud Rahat"
  },
  seo: {
    pageTitle: "Khalid Mahmud Rahat | Portfolio",
    metaDescription: "Portfolio of Khalid Mahmud Rahat, a CSE student at AIUB. UI/UX design, web development, and technology built to help people. View my projects."
  },
  theme: {
    primary: "#7C3AED",
    secondary: "#22D3EE",
    accent: "#F472B6",
    bg: "#05060F",
    text: "#F8FAFC"
  }
};
