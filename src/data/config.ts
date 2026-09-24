import { profile } from './profile';
import { projects } from './projects';
import { experience } from './experience';
import { skills, leetcode, workshopRepos } from './skills';
import { education, certifications, achievements } from './credentials';

// Legacy single-object export — kept so existing sections keep working.
// New code should import from './profile', './projects', etc. directly.
export const PORTFOLIO_DATA = {
  name: profile.name,
  email: profile.email,
  location: profile.location,
  status: profile.status,
  social: profile.social,
  education: {
    degree: education.degree,
    institution: education.institution,
    duration: education.duration,
    cgpa: education.cgpa,
    sgpa: education.sgpa,
  },
  experience: experience.map((e) => ({
    role: e.role,
    company: e.company,
    duration: e.duration,
    details: [...e.stack, ...e.bullets.slice(0, 2)],
  })),
  projects: projects.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    role: p.role,
    duration: p.duration,
    dataset: p.dataset,
    stack: p.stack,
    description: p.description,
    architecture: p.architecture,
  })),
  skills,
  leetcode,
  certifications,
  achievements,
  github_projects: workshopRepos.map((r) => r.name),
};
