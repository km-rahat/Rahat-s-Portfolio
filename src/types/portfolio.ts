export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  extendedDescription: string;
  image: string;
  tags?: string[];
  techTags?: string[];
  year: string;
  role: string;
  metrics?: string;
  liveUrl: string;
  githubUrl: string;
  highlights: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'graphics' | 'frontend' | 'backend' | 'creative';
  level: number; // 0 - 100
  years: number;
  highlight: string;
  color: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  type: 'experience' | 'education';
  description: string;
  achievements: string[];
  tech: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  roles: string[];
  bio: string[];
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  stats: {
    label: string;
    value: number;
    suffix: string;
    subtext: string;
  }[];
}
