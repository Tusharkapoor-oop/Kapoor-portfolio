import type { SkillsMap, SkillLink } from './types';

export const skills: SkillsMap = {
  build: ['Python', 'C++', 'Java', 'SQL'],
  think: ['Machine Learning', 'Deep Learning', 'NLP', 'DSA'],
  train: ['TensorFlow/Keras', 'PyTorch', 'scikit-learn'],
  data: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'EDA', 'Jupyter'],
  ship: ['Flask', 'REST APIs', 'Streamlit'],
  cloud: ['AWS', 'EC2', 'S3', 'Lambda', 'IoT Core', 'IBM Cloud'],
  devops: ['Docker', 'Git/GitHub', 'Linux'],
  databases: ['MySQL', 'Oracle SQL', 'Microsoft SQL Server'],
};

export const skillGroups: { key: keyof SkillsMap; title: string; hint: string }[] = [
  { key: 'build', title: 'BUILD', hint: 'Languages I reach for' },
  { key: 'think', title: 'THINK', hint: 'How I break problems down' },
  { key: 'train', title: 'TRAIN', hint: 'Model training & inference' },
  { key: 'data', title: 'DATA', hint: 'Exploratory analysis & data hygiene' },
  { key: 'ship', title: 'SHIP', hint: 'How ideas become usable products' },
  { key: 'cloud', title: 'DEPLOY', hint: 'Where infrastructure lives' },
  { key: 'devops', title: 'RUN', hint: 'Reproducibility & version control' },
  { key: 'databases', title: 'STORE', hint: 'Relational & vector persistence' },
];

export const skillLinks: SkillLink[] = [
  { skill: 'Python', projects: ['AI-Powered Nutrition Assistant', 'EcoSphere', 'Energy-O-Thon', 'Business Data Analysis'] },
  { skill: 'TensorFlow/Keras', projects: ['AI-Powered Nutrition Assistant', 'EcoSphere', 'Energy-O-Thon'] },
  { skill: 'MySQL', projects: ['AI-Powered Nutrition Assistant', 'EcoSphere', 'Business Data Analysis'] },
  { skill: 'Flask', projects: ['Energy-O-Thon', 'Business Data Analysis', 'Edunet Intern Chatbot'] },
  { skill: 'Streamlit', projects: ['AI-Powered Nutrition Assistant', 'EcoSphere', 'Energy-O-Thon'] },
  { skill: 'AWS', projects: ['EcoSphere (IoT Core)', 'Edunet Intern Chatbot'] },
  { skill: 'IBM Cloud', projects: ['AI-Powered Nutrition Assistant (watsonx.ai)', 'Edunet Intern Chatbot'] },
  { skill: 'scikit-learn', projects: ['AI-Powered Nutrition Assistant', 'Edunet Predictive ML'] },
  { skill: 'Pandas', projects: ['Business Data Analysis (50k+ records)'] },
  { skill: 'NumPy', projects: ['Business Data Analysis'] },
];

export const leetcode = {
  username: 'tusharkapoor66',
  totalSolved: 264,
  easy: 97,
  medium: 126,
  hard: 41,
  languages: [
    { name: 'C++', solved: 192 },
    { name: 'Python3', solved: 71 },
    { name: 'MySQL', solved: 16 },
    { name: 'Java', solved: 8 },
  ],
  topics: [
    'Dynamic Programming',
    'Divide and Conquer',
    'Backtracking',
    'Hash Table',
    'Math',
    'Trees',
    'Arrays',
    'Strings',
    'Sorting',
  ],
  badges: ['50 Days', '100 Days'],
};

export const workshopRepos = [
  {
    name: 'tushar_cse-AI-and-ML-A_AI-STUDY-PLANNER',
    language: 'HTML',
    stars: 2,
    description:
      'AI study planner — upload a syllabus, get study plans and relevant videos.',
  },
  { name: 'Advance_hand_gesture', language: 'JavaScript', stars: 0, description: '' },
  { name: 'Sustainable-Agriculture-Project', language: 'Jupyter Notebook', stars: 0, description: '' },
  { name: 'IBM-Cloud-project', language: 'Jupyter Notebook', stars: 0, description: '' },
  { name: 'go-bric', language: 'TypeScript', stars: 0, description: '' },
  { name: 'PAN-HEALTH', language: '', stars: 0, description: '' },
];
