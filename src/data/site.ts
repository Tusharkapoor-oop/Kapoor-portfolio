import type { SiteNav, NowItem } from './types';

export const site = {
  title: 'Tushar Kapoor — AI/ML Engineering Student',
  description:
    'Tushar Kapoor builds AI/ML systems — agentic assistants, IoT pipelines, cloud apps — and leads technical teams. Based in New Delhi.',
  canonical: 'ADD_CANONICAL_URL',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Experience', href: '#experience' },
    { label: 'About', href: '#about' },
    { label: 'Lab', href: '#lab' },
    { label: 'Connect', href: '#connect' },
  ] as SiteNav[],
};

export const nowItems: NowItem[] = [
  {
    label: 'LEARNING',
    items: [
      'Advanced Deep Learning architectures & Transformers',
      'System design & Distributed pipelines',
      'Complex algorithmic patterns on LeetCode',
    ],
  },
  {
    label: 'BUILDING',
    items: [
      'Agentic AI workflows on watsonx.ai and Llama',
      'Real-time IoT anomaly detection systems',
      'Full-stack ML microservices with Flask & REST APIs',
    ],
  },
  {
    label: 'EXPLORING',
    items: [
      'Autonomous agent decision loops & memory systems',
      'Vector similarity search & Oracle embeddings',
      'Edge inference on lightweight sensor hardware',
    ],
  },
];

export const lab = [
  { title: 'DSA_PYTHON', note: 'Problem-solving practice, ongoing.' },
  { title: 'OS_LAB_Linux_Ubantu', note: 'Operating systems coursework in Python.' },
];
