import { PortfolioData, Project, SkillItem, TimelineItem } from '../types/portfolio';

export const initialProfileData: PortfolioData = {
  name: "KM RAHAT",
  title: "Creative Technologist & 3D Web Architect",
  tagline: "Engineering immersive digital realities at the intersection of WebGL, generative algorithms, and fluid interface design.",
  roles: [
    "Creative Technologist",
    "3D WebGL Architect",
    "Full-Stack Engineer",
    "Interactive UI/UX Designer",
    "Generative Systems Developer"
  ],
  bio: [
    "I craft award-winning digital experiences that bridge sculptural aesthetics and high-performance computing.",
    "Specialized in interactive Three.js environments, reactive shader design, and scalable frontend architectures that captivate audiences and elevate brand presence.",
    "Driven by typographic rigor, 60 FPS motion fidelity, and creating software that feels like touching the future."
  ],
  location: "San Francisco, CA / Remote",
  email: "kaelen.voss@aetheris.dev",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://x.com",
  instagram: "https://instagram.com",
  stats: [
    { label: "Engineering Experience", value: 6, suffix: "+ Yrs", subtext: "Production Web & 3D" },
    { label: "Products Shipped", value: 38, suffix: "+", subtext: "Commercial Releases" },
    { label: "Performance Benchmark", value: 60, suffix: " FPS", subtext: "Zero-Jank Guarantee" },
    { label: "Design & Dev Awards", value: 14, suffix: " Global", subtext: "Awwwards, FWA, CSSDA" }
  ]
};

export const initialProjects: Project[] = [
  {
    id: "cyber-finance",
    title: "Algorithmic Liquid Terminal",
    category: "fintech",
    description: "High-frequency decentralized market intelligence and algorithmic order routing console.",
    extendedDescription: "Architected a real-time financial execution suite processing 10,000+ tick events per second with sub-millisecond chart rendering, custom WebGL candlestick shaders, and glassmorphic depth.",
    image: "/src/assets/images/project_cyber_finance_1791914218241.jpg",
    tags: ["React 19", "Three.js", "WebSockets", "Tailwind CSS", "TypeScript"],
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
    tags: ["Three.js", "WebGL Shaders", "Force-Directed Graph", "TypeScript", "Tailwind CSS"],
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
    tags: ["Web Audio API", "Three.js", "DSP Algorithms", "Motion", "Tailwind CSS"],
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
    tags: ["Three.js", "GeoJSON", "Edge Telemetry", "React", "Tailwind CSS"],
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
];

export const initialSkills: SkillItem[] = [
  {
    id: "threejs",
    name: "Three.js / WebGL",
    category: "graphics",
    level: 96,
    years: 5,
    highlight: "Custom GLSL Shaders, Geometry Distortion, 60 FPS Particle Systems",
    color: "#22D3EE"
  },
  {
    id: "react",
    name: "React 19 / Modern Hooks",
    category: "frontend",
    level: 98,
    years: 6,
    highlight: "Concurrent Mode, Server State, Modular Component Architecture",
    color: "#7C3AED"
  },
  {
    id: "typescript",
    name: "TypeScript (Strict)",
    category: "frontend",
    level: 95,
    years: 6,
    highlight: "Type-Level Programming, Generics, Resilient Production Systems",
    color: "#3B82F6"
  },
  {
    id: "shaders",
    name: "GLSL / Vertex & Fragment Shaders",
    category: "graphics",
    level: 91,
    years: 4,
    highlight: "Simplex Noise, Raymarching, Holographic Blending, Post-Processing",
    color: "#F472B6"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS & Design Systems",
    category: "frontend",
    level: 97,
    years: 5,
    highlight: "Cyber-Glass Tokens, Fluid Typography, Micro-Interactions",
    color: "#06B6D4"
  },
  {
    id: "motion",
    name: "Motion & Choreography",
    category: "frontend",
    level: 94,
    years: 5,
    highlight: "Spring Physics, Gesture Damping, Cinematic Page Transitions",
    color: "#EC4899"
  },
  {
    id: "nodejs",
    name: "Node.js / Express & APIs",
    category: "backend",
    level: 89,
    years: 5,
    highlight: "WebSocket Engines, Microservices, Edge Middleware",
    color: "#10B981"
  },
  {
    id: "uiux",
    name: "UI/UX & Spatial Design",
    category: "creative",
    level: 93,
    years: 6,
    highlight: "Spatial Hierarchy, Glassmorphic Lighting, Typography Contrast",
    color: "#8B5CF6"
  }
];

export const initialTimeline: TimelineItem[] = [
  {
    id: "lead-technologist",
    period: "2024 — Present",
    role: "Lead Creative Technologist",
    organization: "Aetheris Spatial Studios",
    location: "San Francisco, CA",
    type: "experience",
    description: "Directing the 3D WebGL department, engineering flagship interactive websites and spatial product experiences for Fortune 500 tech pioneers.",
    achievements: [
      "Pioneered a proprietary WebGL rendering pipeline boosting mobile frame rates by 42%",
      "Led design & engineering for 12 international launch campaigns with 4M+ unique impressions",
      "Won 4 Awwwards Site of the Day honors and 2 FWA of the Day awards"
    ],
    tech: ["Three.js", "GLSL Shaders", "React", "TypeScript", "Web Audio"]
  },
  {
    id: "senior-interactive",
    period: "2022 — 2024",
    role: "Senior Interactive WebGL Engineer",
    organization: "Nexus Hypermedia Labs",
    location: "New York / Remote",
    type: "experience",
    description: "Developed real-time canvas architectures, audio-reactive visualizers, and high-conversion editorial experiences with zero-latency physics.",
    achievements: [
      "Built custom physics-based cursor interactions and 3D card tilt engines used across 30+ production sites",
      "Reduced bundle footprint by 38% through custom shader tree-shaking and GLTF compression",
      "Mentored 6 junior and mid-level creative developers in 3D scene optimization"
    ],
    tech: ["React", "Three.js", "Tailwind CSS", "Motion", "Vite"]
  },
  {
    id: "creative-developer",
    period: "2020 — 2022",
    role: "Full-Stack Creative Developer",
    organization: "Vanguard Studio Collective",
    location: "Austin, TX",
    type: "experience",
    description: "Crafted bespoke web applications, interactive landing pages, and motion-heavy brand sites for high-growth tech ventures.",
    achievements: [
      "Engineered full-stack responsive web apps with sub-second page loads and WCAG AA compliance",
      "Integrated real-time WebSockets and animated telemetry charts for financial dashboards"
    ],
    tech: ["TypeScript", "Next.js", "Express", "Node.js", "Figma"]
  },
  {
    id: "education-degree",
    period: "2016 — 2020",
    role: "B.S. in Computer Science & Digital Arts",
    organization: "University of California, Berkeley",
    location: "Berkeley, CA",
    type: "education",
    description: "Dual focus on Computer Graphics, Real-Time Rendering Algorithms, Human-Computer Interaction, and Computational Aesthetics.",
    achievements: [
      "Graduated Magna Cum Laude with Honors Capstone in Real-Time Raymarching",
      "President of Interactive Media & ACM Graphics Student SIG"
    ],
    tech: ["OpenGL / C++", "Linear Algebra", "WebGL", "Algorithms", "HCI"]
  }
];
