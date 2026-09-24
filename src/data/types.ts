export interface SocialLinks {
  github: string;
  linkedin: string;
  leetcode: string;
}

export interface Profile {
  name: string;
  initials: string;
  headline: string;
  positioning: string;
  location: string;
  email: string;
  phone: string;
  status: string;
  resumeUrl: string;
  social: SocialLinks;
}

export type ProjectCategory =
  | 'AI / ML'
  | 'AGENTIC AI'
  | 'DATA'
  | 'CLOUD'
  | 'IOT'
  | 'HACKATHON';

export interface Project {
  id: string;
  title: string;
  type: string;
  categories: ProjectCategory[];
  role?: string;
  duration?: string;
  dataset?: string;
  stack: string[];
  description: string;
  architecture: string[];
  featured?: boolean;
  links: { github?: string; demo?: string; caseStudy?: string };
  learningsPlaceholder?: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  location?: string;
  stack: string[];
  bullets: string[];
}

export type SkillGroupKey =
  | 'build'
  | 'think'
  | 'train'
  | 'data'
  | 'ship'
  | 'cloud'
  | 'devops'
  | 'databases';

export type SkillsMap = Record<SkillGroupKey, string[]>;

export interface SkillLink {
  skill: string;
  projects: string[];
}

export interface SiteNav {
  label: string;
  href: string;
}

export interface NowItem {
  label: 'LEARNING' | 'BUILDING' | 'EXPLORING';
  items: string[];
}
