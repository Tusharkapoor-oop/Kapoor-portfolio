import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'nutrition-assistant',
    title: 'AI-Powered Nutrition Assistant',
    type: 'Agentic AI',
    categories: ['AGENTIC AI', 'AI / ML', 'CLOUD', 'DATA'],
    dataset: 'USDA — 10,000+ records',
    stack: ['Python', 'TensorFlow', 'Streamlit', 'scikit-learn', 'MySQL', 'IBM watsonx.ai', 'Llama LLM'],
    description:
      'Personalised dietary recommendations using location, weather, and user preferences.',
    architecture: [
      'USER',
      'PREFERENCES',
      'LOCATION + WEATHER',
      'NUTRITION DATA',
      'LLM / AGENT',
      'RECOMMENDATION',
    ],
    featured: true,
    links: {},
    learningsPlaceholder: 'Add what you learned building the agent workflow.',
  },
  {
    id: 'ecosphere',
    title: 'EcoSphere — Environmental Intelligence Platform',
    type: 'IoT & Machine Learning',
    categories: ['AI / ML', 'IOT', 'CLOUD', 'DATA'],
    role: 'Team Lead (5 members)',
    duration: 'Jan 2025 – Mar 2025',
    stack: ['Python', 'TensorFlow', 'AWS IoT Core', 'Streamlit', 'MySQL'],
    description:
      'IoT sensor streams with TensorFlow anomaly detection and real-time dashboard. Presented at KRMU AI Showcase Mar 2025.',
    architecture: [
      'AIR QUALITY / TEMP / HUMIDITY',
      'AWS IoT CORE',
      'TENSORFLOW ANOMALY DETECTION',
      'MYSQL',
      'STREAMLIT',
    ],
    links: {},
  },
  {
    id: 'energy-o-thon',
    title: 'Energy-O-Thon',
    type: 'International AI Hackathon',
    categories: ['AI / ML', 'HACKATHON', 'CLOUD'],
    role: 'International Team Lead',
    duration: 'Nov 2025',
    stack: ['Python', 'TensorFlow', 'Flask', 'Streamlit', 'REST APIs'],
    description:
      'Energy optimisation tool + dashboard, built with an international team across time zones.',
    architecture: ['ENERGY DATA', 'ANALYSIS', 'OPTIMIZATION', 'RECOMMENDATIONS'],
    links: {},
  },
  {
    id: 'business-data',
    title: 'Business Data Analysis',
    type: 'Data Engineering & Analytics',
    categories: ['DATA'],
    dataset: 'UCI ML Repository — 50,000+ records, 3 datasets',
    stack: ['Python', 'R', 'Pandas', 'NumPy', 'Flask', 'MySQL'],
    description:
      'Cleaned 3 business datasets, Flask app surfacing 12 insights + inventory recommendation.',
    architecture: ['RAW DATA', 'CLEANING', 'ANALYSIS', '12 INSIGHTS', 'INVENTORY RECOMMENDATION'],
    links: {},
  },
];

export const projectFilters = [
  'ALL',
  'AI / ML',
  'AGENTIC AI',
  'DATA',
  'CLOUD',
  'IOT',
  'HACKATHON',
] as const;
