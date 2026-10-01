// Projects shown on the home page and the Projects page.
// Only list work that exists. Set `hidden: true` to keep an entry out of the site until it is real.

export type ProjectStatus = 'shipped' | 'in-progress' | 'write-up';

export interface Project {
  title: string;
  status: ProjectStatus;
  category: 'ai' | 'earlier';
  summary: string; // one line, used on cards and lists
  description: string; // longer, used on the Projects page
  stack: string[];
  links: { label: string; url: string }[];
  team?: string; // e.g. "Team of 3". Omit for solo work.
  year?: number;
  note?: string; // small print shown on the Projects page
  wake?: string; // backend URL on a sleeping free tier; pinged when a project page loads so the demo is warm by the time someone clicks
  featured?: boolean; // show on the home page
  hidden?: boolean;
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  'write-up': 'Write-up',
};

export const projects: Project[] = [
  // AI projects from the design. Hidden until they exist: set `hidden: false` and add real links when you start.
  {
    title: 'Agent evaluation harness',
    status: 'in-progress',
    category: 'ai',
    summary: 'Regression-tests tool-using agents across task completion, evidence, latency, and cost.',
    description:
      'A reproducible test harness for tool-using agents. Measures task completion, grounded evidence, failure modes, latency, and cost across versioned cases.',
    stack: ['Python', 'pytest', 'SQLite'],
    links: [],
    featured: true,
    hidden: true,
  },
  {
    title: 'Requirements-to-test-case generator',
    status: 'in-progress',
    category: 'ai',
    summary: 'Turns structured requirements into traceable test cases, routing ambiguity to a human reviewer.',
    description:
      'A human-reviewed workflow that turns structured requirements into traceable positive, negative, and edge-case tests without hiding ambiguity.',
    stack: ['TypeScript', 'JSON Schema', 'LLM evals'],
    links: [],
    featured: true,
    hidden: true,
  },
  // Current AI work. Keep every claim true today: update the summary as milestones land (prototype, test set, shipping).
  {
    title: 'LLM validation agent for AI-generated lessons',
    status: 'in-progress',
    category: 'ai',
    year: 2026,
    summary:
      'Mapped and audited the existing AI generation pipeline. Next: a shadow-mode prototype measured against a labeled test set.',
    description:
      'I own the design of an LLM validation agent that checks AI-generated lessons. So far I have mapped and audited the existing AI generation pipeline and written the design plan for the agent. Next: a shadow-mode prototype, measured against a labeled test set.',
    stack: ['LLM-as-judge', 'Evaluation design', 'Pipeline audit'],
    links: [],
    note: 'Work in progress at Cocoa Classroom. The code is private.',
    featured: true,
  },
  // Earlier work, from Antonio's resume and the project READMEs on GitHub.
  {
    title: 'InvoiceNow',
    status: 'shipped',
    category: 'earlier',
    year: 2023,
    team: 'Team of 3',
    summary: 'An invoicing app for small businesses and freelancers: create, send, track, and collect payment on invoices.',
    description:
      'An invoicing platform for small businesses and freelancers. Users generate, send, and track invoices, manage clients, and collect payment through Stripe, with notifications through Twilio.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Stripe API', 'Twilio API'],
    links: [
      { label: 'Live demo', url: 'https://antonio-invoice-now.netlify.app/' },
      { label: 'Repo', url: 'https://github.com/ascotlan/invoice-now' },
    ],
    note: 'The demo backend runs on a free hosting tier and can take a minute to wake up.',
    wake: 'https://antonio-invoice-now.onrender.com/',
    featured: true,
  },
  {
    title: 'OmniEats',
    status: 'shipped',
    category: 'earlier',
    year: 2023,
    team: 'Team of 4',
    summary: 'A food ordering platform with real-time order tracking and SMS updates.',
    description:
      'A food ordering platform that connects customers with restaurants: menu selection with running totals, order placement, real-time order tracking, and SMS updates through Twilio.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'EJS', 'jQuery', 'Twilio'],
    links: [
      { label: 'Live demo', url: 'https://antonio-omnieats.onrender.com/' },
      { label: 'Repo', url: 'https://github.com/ascotlan/food-ordering-app' },
    ],
    note: 'The demo runs on a free hosting tier and can take a minute to wake up.',
    wake: 'https://antonio-omnieats.onrender.com/',
    featured: true,
  },
];

export const visibleProjects = projects.filter((p) => !p.hidden);
