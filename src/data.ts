// Single source of truth for every string on the site.
// Sections never hardcode copy — they read from here.

export const SCENES = [
  { id: 'hero', label: 'Hello', height: '230vh' },
  { id: 'about', label: 'About', height: '280vh' },
  { id: 'work', label: 'Work', height: '460vh' },
  { id: 'journey', label: 'Journey', height: '240vh' },
  { id: 'skills', label: 'Toolkit', height: '280vh' },
  { id: 'awards', label: 'Awards', height: '320vh' },
  { id: 'contact', label: 'Contact', height: '240vh' },
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

export const sceneHeight = (id: SceneId): string => SCENES.find((s) => s.id === id)!.height;

export const SECTION_LABELS: Record<SceneId, { n: string; name: string } | null> = {
  hero: null,
  about: { n: '01', name: 'About me' },
  work: { n: '02', name: 'Work' },
  journey: { n: '03', name: 'Journey' },
  skills: { n: '04', name: 'Toolkit' },
  awards: { n: '05', name: 'Awards' },
  contact: { n: '06', name: 'Contact' },
};

export interface ManifestoToken {
  t: string;
  red?: boolean;
}

export const IDENTITY = {
  first: 'TUSHAR',
  name: 'Tushar Kapoor',
  role1: 'APPLIED AI',
  role2: 'ENGINEER.',
  email: 'tusharkapoor052@gmail.com',
  emailUser: 'tusharkapoor052',
  emailDomain: '@gmail.com',
  location: 'New Delhi, India',
  github: 'https://github.com/Tusharkapoor-oop',
  linkedin: 'https://www.linkedin.com/in/tushar-kapoor-143484333/',
  leetcode: 'https://leetcode.com/u/tusharkapoor66/',
  resumeUrl: 'Tushar_Kapoor_Resume.pdf',
};

export const HERO = {
  greetPre: "Hi, I’m",
  greetPost: '—',
  desc: 'CSE (AI & ML) student who learns by building — agentic assistants, IoT pipelines, and cloud-backed ML systems that turn volatile data into dependable action.',
  primaryCta: 'See my work ↘',
  secondaryCta: 'Download résumé',
};

export const MANIFESTO: ManifestoToken[][] = [
  [{ t: 'Deterministic software only solves the problems ' }, { t: 'already predicted.', red: true }],
  [{ t: 'Wellness, power grids, sensor streams — real systems are probabilistic and volatile.' }],
  [{ t: 'The craft is building architectures that ' }, { t: 'observe, adapt and act.', red: true }],
  [{ t: 'Proof over adjectives.', red: true }, { t: ' Systems over screenshots.' }],
  [{ t: 'Learn by building. ' }, { t: 'Lead by shipping.', red: true }],
];

export const STATS = [
  { label: 'CGPA', value: 8.6, decimals: 1, caption: 'B.Tech CSE (AI & ML) — KRMU' },
  { label: 'PROBLEMS SOLVED', value: 264, decimals: 0, caption: 'LeetCode — 41 hard' },
  { label: 'TEAMS LED', value: 3, decimals: 0, caption: 'Edunet · EcoSphere · GO-BRICS' },
];

export interface Project {
  num: string;
  category: string;
  name: string;
  desc: string;
  chips: string[];
  visual: 'chat' | 'gauge' | 'heatmap';
  repo?: string;
}

export const PROJECTS: Project[] = [
  {
    num: '01',
    category: 'AGENTIC AI',
    name: 'NUTRITION ASSISTANT',
    desc: 'LLM agent turning location, weather and user context into personalised dietary guidance.',
    chips: ['Python', 'TensorFlow', 'watsonx.ai', 'MySQL'],
    visual: 'chat',
  },
  {
    num: '02',
    category: 'IOT · MACHINE LEARNING',
    name: 'ECOSPHERE',
    desc: 'IoT sensor streams with TensorFlow anomaly detection and a real-time dashboard.',
    chips: ['Python', 'TensorFlow', 'AWS IoT Core', 'Streamlit'],
    visual: 'gauge',
  },
  {
    num: '03',
    category: 'INTERNATIONAL HACKATHON',
    name: 'ENERGY-O-THON',
    desc: 'Energy optimisation engine and dashboard, built with an international team across time zones.',
    chips: ['Python', 'Flask', 'REST APIs', 'Streamlit'],
    visual: 'heatmap',
  },
];

export const JOURNEY = {
  fromYear: 2024,
  toYear: 2028,
  items: [
    {
      year: '2026',
      title: 'APPLIED AI RESEARCH',
      org: 'GO-BRICS Business Lab — international product research, ops automation',
    },
    {
      year: '2025',
      title: 'AI & CLOUD ENGINEER',
      org: 'Edunet Foundation (IBM · Shell · VOIS · VI) — tech lead, chatbot + predictive ML on IBM Cloud & AWS',
    },
    {
      year: '2024',
      title: 'B.TECH CSE (AI & ML)',
      org: "K.R. Mangalam University — CGPA 8.6, Dean’s Honour Award",
    },
  ],
};

export const SKILLS = [
  'Python',
  'C++',
  'Java',
  'SQL',
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'TensorFlow',
  'PyTorch',
  'scikit-learn',
  'Pandas',
  'NumPy',
  'Flask',
  'Streamlit',
  'AWS',
  'Docker',
  'MySQL',
  'Git',
];

export const CODING = [
  { value: '264', suffix: '★', label: 'PROBLEMS SOLVED', note: 'LeetCode' },
  { value: '192', suffix: '+', label: 'IN C++', note: 'LeetCode' },
  { value: '71', suffix: '+', label: 'IN PYTHON', note: 'LeetCode' },
  { value: '16', suffix: '+', label: 'IN SQL', note: 'MySQL' },
];

export const CERTS = [
  { title: 'MICROSOFT CERTIFIED', sub: 'Azure AI Fundamentals', year: '2025' },
  { title: 'IBM JOURNEY TO CLOUD', sub: 'SkillsBuild', year: '2025' },
  { title: 'ORACLE VECTOR SEARCH', sub: 'Foundations', year: '2025' },
  { title: 'ORACLE SQL', sub: 'Certification', year: '2024' },
  { title: 'EDUNET FOUNDATION', sub: 'AI & Cloud Internship', year: '2025' },
];

export const CONTACT = {
  headline1: "LET’S",
  headline2: 'TALK',
  links: [
    { label: 'GITHUB', href: IDENTITY.github, cursor: 'Open' },
    { label: 'LINKEDIN', href: IDENTITY.linkedin, cursor: 'Open' },
    { label: 'RÉSUMÉ', href: IDENTITY.resumeUrl, cursor: 'PDF' },
  ],
};
