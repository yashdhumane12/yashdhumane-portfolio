// ─── VOID ARCHITECT — Content Database ───────────────────────────────────────
// Edit copy here. Never touch scene/component code for content changes.

export const PERSON = {
  name:     'Yash Dhumane',
  title:    'DevOps Engineer',
  tagline:  'CI/CD · Kubernetes · Bare-metal infrastructure',
  location: 'Pune, India',
  bio: [
    "I run infrastructure the way most teams don't have to anymore — on bare metal. Proxmox, a hand-built kubeadm cluster, self-hosted GitLab CE and Jenkins, no managed control plane to fall back on.",
    "My infrastructure is entirely self-hosted: a Proxmox hypervisor running a kubeadm-built Kubernetes cluster, self-hosted GitLab CE and Jenkins for CI/CD, and Nginx/HAProxy handling routing and TLS by hand. No managed Kubernetes, no managed CI — when something breaks, there's no support ticket to file, only logs to read.",
    "That constraint has made debugging the core of the job: tracing WebSocket 403s to token-validation order, chasing down nginx DNS caching, rebuilding a Jenkins pipeline around Nuitka-compiled source protection.",
  ],
  facts: [
    { key: 'location',   val: 'Pune, India' },
    { key: 'status',     val: 'Available for opportunities' },
    { key: 'focus',      val: 'CI/CD · K8s · Self-hosted infra' },
    { key: 'cluster',    val: '1 control-plane · 9 workers' },
    { key: 'education',  val: 'B.E. Information Technology' },
  ],
  email:    'yashdhumane391@gmail.com',
  phone:    '+91-7219522590',
  linkedin: 'https://www.linkedin.com/in/yash-dhumane',
  github:   'https://github.com/yashdhumane12',
  resume:   'resume.pdf',
};

export interface Job {
  period:  string;
  current: boolean;
  title:   string;
  org:     string;
  bullets: string[];
}

export const JOBS: Job[] = [
  {
    period:  'Apr 2026 → present',
    current: true,
    title:   'DevOps Engineer',
    org:     'Honcho Minds',
    bullets: [
      'Manage and maintain Jenkins CI/CD pipelines for automated deployments across multiple products.',
      'Migrated a production CI/CD pipeline from Jenkins to self-hosted GitLab CI, resolving cascading issues around git-clean file wipes, Docker socket permissions, and environment file handling.',
      'Run a self-built kubeadm Kubernetes cluster (1 control plane, 9 worker nodes) on Proxmox, plus self-hosted GitLab CE and Jenkins.',
      'Debugged recurring WebSocket 403 errors across staging environments, tracing the root cause to token validation happening before ws.accept().',
      'Built a Jenkins pipeline for a source-code protection service using Nuitka compilation, Cython, and a GitLab Container Registry push workflow.',
      'Led a security remediation effort moving plaintext secrets out of Kubernetes ConfigMaps into proper Secrets.',
      'Configured Nginx and IIS for hosting and reverse proxy, and handled Linux server administration, troubleshooting, and log monitoring.',
    ],
  },
  {
    period:  'Aug 2025 → Apr 2026',
    current: false,
    title:   'Web Content Executive',
    org:     'Future Market Insights, Pune',
    bullets: [
      'Managed and updated website content across multiple platforms, deploying to production after validation and QA checks.',
      'Monitored website performance and availability post-deployment, working with IIS and Nginx.',
      'Applied SEO techniques to improve visibility and structured content delivery.',
    ],
  },
  {
    period:  'Jul 2024 → Oct 2024',
    current: false,
    title:   'Data Science Intern',
    org:     'AI Variant',
    bullets: [
      'Built a resume classification system in Python using NLP, with preprocessing, feature engineering, and model tuning.',
      'Automated the candidate screening pipeline, reducing manual review effort.',
    ],
  },
];

export interface SkillGroup {
  category: string;
  icon:     string;
  chips:    string[];
}

export const SKILLS: SkillGroup[] = [
  { category: 'CI/CD & Version Control',       icon: '⬡', chips: ['Jenkins', 'GitLab CE', 'Git', 'GitHub', 'SonarQube'] },
  { category: 'Containers & Orchestration',    icon: '◈', chips: ['Docker', 'Kubernetes (kubeadm)', 'Harbor'] },
  { category: 'Infrastructure & Networking',   icon: '◉', chips: ['Proxmox', 'Nginx', 'HAProxy', 'pfSense', 'IIS'] },
  { category: 'Cloud & OS',                    icon: '◎', chips: ['AWS', 'Linux', 'Windows Server'] },
  { category: 'Languages & Data',              icon: '◇', chips: ['Python', 'JavaScript', 'MySQL'] },
];

export interface Project {
  tag:   'production' | 'staging' | 'personal';
  name:  string;
  desc:  string;
  stack: string;
}

export const PROJECTS: Project[] = [
  {
    tag:   'production',
    name:  'Agentis — AI ITSM Platform',
    desc:  'React + Django/FastAPI service desk platform. Migrated its CI/CD from Jenkins to GitLab CI, deployed SSO end-to-end (SSL, migrations, HAProxy), and wrote the pipeline docs the team now works from.',
    stack: 'GitLab CI · Docker · HAProxy · WebSockets',
  },
  {
    tag:   'production',
    name:  'bharatnyay.ai',
    desc:  'Django + React legal-AI product deployed on Kubernetes with MetalLB and ingress-nginx, backed by external Postgres, Redis, and Qdrant. Led the effort to move secrets out of ConfigMaps into proper Kubernetes Secrets.',
    stack: 'Kubernetes · MetalLB · Qdrant · Redis',
  },
  {
    tag:   'production',
    name:  'ConfgNow / ConfgSecurity',
    desc:  'Source-code protection service for client deployments. Built the Jenkins pipeline around Nuitka compilation, Cython-based protection, and license gating.',
    stack: 'Nuitka · Cython · Jenkins · Docker',
  },
  {
    tag:   'staging',
    name:  'ME-AgentX',
    desc:  'Debugged staging environment end-to-end — a persistent WebSocket 403 traced to connection close happening before accept in the ASGI handler, and Jenkins workspace cleanup failures from Docker bind-mount ownership mismatches.',
    stack: 'Jenkins · Docker · ASGI',
  },
  {
    tag:   'personal',
    name:  'Resume Classification System',
    desc:  'ML model in Python/Scikit-learn for automated resume screening, with preprocessing and feature selection. Containerized with Docker and deployed on AWS.',
    stack: 'Python · Scikit-learn · Docker · AWS',
  },
  {
    tag:   'personal',
    name:  'Driver Safety App',
    desc:  'Mobile app built with Flutter and Dart, integrating GPS tracking with a real-time alert system for driver safety.',
    stack: 'Flutter · Dart · GPS',
  },
];

export const HOMELAB_LOGS = [
  { ts: '2026-08-14', entry: 'nginx startup race condition — fixed with lazy DNS resolution instead of resolving upstreams at boot.' },
  { ts: '2026-07-22', entry: 'Jenkins GPG key rotation breaking package installs — pinned to the current signing key.' },
  { ts: '2026-06-09', entry: 'Proxmox network bridge migration from vmbr0 → vmbr1 after a physical NIC failure, with zero downtime for running VMs.' },
  { ts: '2026-05-30', entry: 'Alembic migration revision mismatches traced back to git clean silently removing uncommitted migration files.' },
  { ts: '2026-04-17', entry: 'nginx stale DNS caching on container restarts — resolved via Docker embedded DNS resolver and variable-based proxy_pass.' },
  { ts: '2026-03-05', entry: 'pfSense + HAProxy subdomain routing set up for clean per-service TLS termination.' },
];
