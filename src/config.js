/* =====================================================================
   ALL YOUR CONTENT LIVES HERE. Edit this file, not the components.
   Every claim is a draft. Make sure each one is true before a fair:
   recruiters will ask about anything they read.
   ===================================================================== */

export const PROFILE = {
  name: 'Pranav',
  fullName: 'Pranav Dulam',
  headline: 'MS IT @ UNC Charlotte · graduating May 2027',
  links: {
    resume: '/resume.pdf', // put resume.pdf in /public
    linkedin: 'https://www.linkedin.com/in/pranav-dulam-98b031235/',
    github: 'https://github.com/Pranav-Dulam',
    email: 'pranav7032002@gmail.com',
    vcard: '/contact.vcf', // edit /public/contact.vcf too
  },
}

export const PROJECTS = {
  backend: {
    name: 'Secure Go + AWS backend services',
    desc: 'About a year building and hardening backend services in Go on AWS.',
  },
  fsi: {
    name: 'Fragile States Index: mining action rules',
    desc: 'Group project: classification models plus action rules that suggest which changes would move a country toward stability.',
  },
  library: {
    name: 'Atkins Library mobile app redesign',
    desc: "Figma redesign of UNC Charlotte's library app, focused on how students actually use it.",
  },
  awslabs: {
    name: 'AWS architecture challenge labs',
    desc: "Hands-on labs taking a café's web app from one server to a scalable, secured AWS setup.",
  },
  saa: {
    name: 'AWS Solutions Architect, Associate',
    desc: 'Certification in progress.',
  },
}

// Default phosphor color before a role is picked (each role below has its own)
export const DEFAULT_THEME = { accent: '#39ff7a', accent2: '#b6ffcf' }

// One entry per role. `id` must match a demo in src/demos/index.js
export const ROLES = [
  {
    id: 'security',
    label: 'Cybersecurity',
    sub: 'SOC · AppSec · GRC',
    icon: 'shield',
    accent: '#39ff7a',
    accent2: '#b6ffcf',
    title: 'Try to break in.',
    desc: 'A real login defense is running in your browser. Attack it both ways.',
    takeaway: {
      bold: 'Rate limiting, lockouts, parameterized queries, alerting.',
      rest: 'These are the safeguards I build into Go/AWS backend services. I think about the attacker first.',
    },
    fitWord: 'security',
    proof: [
      'About a year building secure backend services in Go on AWS',
      'I build defenses by thinking like the attacker, as in the demo you just tried',
      'Studying for AWS Solutions Architect, with security as the core of every design',
    ],
    projects: ['backend', 'awslabs', 'saa'],
    skills: ['Go', 'AWS IAM', 'Secure APIs', 'Logging & alerting', 'Network security'],
  },
  {
    id: 'software',
    label: 'Software Dev',
    sub: 'Go · Node · Python',
    icon: 'code',
    accent: '#7cc4ff',
    accent2: '#d0eaff',
    title: 'Ship it to production.',
    desc: 'Deploy a release, then hit it with real traffic.',
    takeaway: {
      bold: 'Tested, automated, fast under load.',
      rest: "I write backend code that's built to ship, not just to pass a class.",
    },
    fitWord: 'software',
    proof: [
      'About a year shipping backend services in Go on AWS',
      'Comfortable across Go, Node and Python',
      'I care about the boring parts: tests, CI, latency and errors',
    ],
    projects: ['backend', 'awslabs', 'library'],
    skills: ['Go', 'Node.js', 'Python', 'REST APIs', 'AWS', 'Git / CI'],
  },
  {
    id: 'data',
    label: 'Data / Analyst',
    sub: 'Analytics · BI · Mining',
    icon: 'chart',
    accent: '#ffb000',
    accent2: '#ffe2a0',
    title: 'Clean it. Find the story.',
    desc: "Here's a messy export. Two taps turn it into a decision.",
    takeaway: {
      bold: 'Messy data in, decision out.',
      rest: 'Clean it, model it, and say what it means in one sentence a manager can act on.',
    },
    fitWord: 'data & analytics',
    proof: [
      'Mined classification and action rules from Fragile States Index data',
      'I turn results into recommendations, not just charts',
      'Backend experience, so I can get to the data myself',
    ],
    projects: ['fsi', 'backend', 'library'],
    skills: ['Python', 'SQL', 'Classification', 'Action rules', 'Visualization'],
  },
  {
    id: 'cloud',
    label: 'Cloud / IT',
    sub: 'Infra · Ops · Support',
    icon: 'cloud',
    accent: '#3ef0ff',
    accent2: '#c2fbff',
    title: 'Kill a server. Watch.',
    desc: 'Live users are on this system. Try to take it down.',
    takeaway: {
      bold: 'Designed to fail without anyone noticing.',
      rest: 'Health checks, load balancing and auto-scaling are how I build on AWS.',
    },
    fitWord: 'cloud & IT',
    proof: [
      'About a year running backend services on AWS',
      'Hands-on AWS architecture labs: scaling and securing a real web app',
      'Studying for AWS Solutions Architect, Associate',
    ],
    projects: ['awslabs', 'backend', 'saa'],
    skills: ['AWS', 'EC2 / VPC', 'Load balancing', 'Auto-scaling', 'Linux'],
  },
  {
    id: 'supply',
    label: 'SAP / Supply Chain',
    sub: 'Ops · ERP · Logistics',
    icon: 'truck',
    accent: '#ff8a3d',
    accent2: '#ffd1b0',
    title: 'Your port just shut down.',
    desc: 'A shipment is stuck. Keep the shelves stocked.',
    takeaway: {
      bold: 'Systems thinking for operations.',
      rest: 'Spot the disruption, quantify it, reroute it. I like the space where data, ERP and real-world logistics meet.',
    },
    fitWord: 'SAP & supply chain',
    proof: [
      'I build the data and backend systems that ops teams depend on',
      'Data mining experience: spotting the pattern before it turns into a problem',
      'Eager to go deep on ERP. I learn systems fast',
    ],
    projects: ['fsi', 'backend', 'awslabs'],
    skills: ['Data analysis', 'Process thinking', 'Python', 'SQL', 'ERP-ready'],
  },
  {
    id: 'risk',
    label: 'Risk Management',
    sub: 'GRC · Audit · Controls',
    icon: 'risk',
    accent: '#ff6bd6',
    accent2: '#ffc8ef',
    title: 'Bring the risk down.',
    desc: 'Three live risks. Tap each one to apply a control.',
    takeaway: {
      bold: 'Identify, score, control, measure.',
      rest: "I've built the technical controls myself, so I know which ones actually reduce risk.",
    },
    fitWord: 'risk',
    proof: [
      "I've built technical security controls, not just documented them",
      'I quantify risk and show what moved it',
      'Comfortable explaining technical risk to non-technical people',
    ],
    projects: ['backend', 'fsi', 'saa'],
    skills: ['Risk scoring', 'Security controls', 'Cloud security', 'Data analysis'],
  },
]

// Shown when the recruiter picks "Not sure yet"
export const GENERAL_FIT = {
  title: 'One person, many angles',
  proof: [
    'About a year building secure Go/AWS backend services',
    'Data mining and analytics: classification and action rules',
    'Open to security, software, data, cloud/IT, SAP/supply chain and risk roles',
  ],
  projects: ['backend', 'fsi', 'awslabs', 'library'],
  skills: ['Go', 'Python', 'Node.js', 'AWS', 'SQL', 'Security', 'Figma'],
}
