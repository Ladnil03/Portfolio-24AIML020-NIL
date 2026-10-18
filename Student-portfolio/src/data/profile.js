/**
 * Every value in this file is traceable to something Nil Lad has actually
 * published — the GitHub REST API for Ladnil03, or the reports committed
 * alongside the code in this repository. Nothing here is placeholder copy.
 */

export const profile = {
  name: "Nil Lad",
  handle: "Ladnil03",
  role: "AI & ML Student | React Developer",
  greeting: "Hi, I'm Nil",
  github: "https://github.com/Ladnil03",
  // Verbatim from the existing About section.
  intro:
    "Passionate about Artificial Intelligence, Web Development, Machine Learning and Competitive Programming. I enjoy building responsive websites and solving real-world problems using technology.",
  // GitHub profile bio.
  status: "AIML student",
};

/** Exactly the eight technologies the existing portfolio listed — regrouped, not invented. */
export const skillGroups = [
  {
    id: "ai",
    label: "AI / ML",
    tone: "coral",
    skills: ["Machine Learning", "Python"],
  },
  {
    id: "frontend",
    label: "Frontend",
    tone: "sky",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: "languages",
    label: "Languages",
    tone: "yellow",
    skills: ["C++", "Python"],
  },
  {
    id: "tools",
    label: "Tools",
    tone: "paper",
    skills: ["Git"],
  },
];

const GITHUB = "https://github.com/Ladnil03";

/** "Vidsnap-AI-reel-generator" -> "Vidsnap AI Reel Generator" */
export function humanize(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatMonth(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Repos from api.github.com/users/Ladnil03/repos (retrieved 2026-10-06).
 * `description` is GitHub's own field and is null for most of these — the card
 * falls back to factual metadata instead of invented prose.
 *
 * `layout` drives the varied editorial grid on the home page.
 */
export const projects = [
  {
    id: "vidsnap",
    repo: "Vidsnap-AI-reel-generator",
    language: "Python",
    url: `${GITHUB}/Vidsnap-AI-reel-generator`,
    description: null,
    updated: "2026-09-23T07:10:21Z",
    layout: "feature",
    tone: "coral",
    tags: ["Python", "AI"],
  },
  {
    id: "student-backend",
    repo: "Portfolio-24AIML020-NIL",
    language: "Node.js / Express / MongoDB",
    url: GITHUB,
    // Summarised from MATURITY.md and CACHING_REPORT.md in this repository.
    description:
      "REST Task Management API taken to Richardson Maturity Model Level 3 with HATEOAS _links, JWT auth, validation middleware and a benchmarked in-memory cache.",
    updated: "2026-10-06T04:02:06Z",
    layout: "tall",
    tone: "sky",
    tags: ["Node.js", "Express", "MongoDB", "REST"],
  },
  {
    id: "rag",
    repo: "rag-document-intelligence",
    language: "Python",
    url: `${GITHUB}/rag-document-intelligence`,
    description: null,
    updated: "2026-09-25T17:55:14Z",
    layout: "tall",
    tone: "paper",
    tags: ["Python", "RAG"],
  },
  {
    id: "insider",
    repo: "Insider-threat-detection",
    language: "Python",
    url: `${GITHUB}/Insider-threat-detection`,
    description: null,
    updated: "2026-09-16T03:51:37Z",
    layout: "offset",
    tone: "yellow",
    tags: ["Python", "Security"],
  },
  {
    id: "horsemen",
    repo: "bob-ai-hackathon-TheFourHorsemen",
    language: "JavaScript",
    url: `${GITHUB}/bob-ai-hackathon-TheFourHorsemen`,
    description: null,
    updated: "2026-09-25T12:52:09Z",
    layout: "wide",
    tone: "ink",
    tags: ["JavaScript", "Hackathon"],
  },
  {
    id: "nagarseva",
    repo: "Nagarseva",
    language: "TypeScript",
    url: `${GITHUB}/Nagarseva`,
    // GitHub's own repository description.
    description:
      "It is about the problem people faces and they can report it to municipal",
    updated: "2026-06-27T06:34:53Z",
    layout: "tall",
    tone: "paper",
    tags: ["TypeScript", "Civic Tech"],
  },
  {
    id: "heart",
    repo: "Heart-Disease-Prediction",
    language: "CSS",
    url: `${GITHUB}/Heart-Disease-Prediction`,
    description: null,
    updated: "2026-05-02T02:13:50Z",
    layout: "tall",
    tone: "sky",
    tags: ["CSS", "Prediction"],
  },
  {
    id: "portfolio",
    repo: "Portfolio-24AIML020-NIL",
    language: "JavaScript",
    url: `${GITHUB}/Portfolio-24AIML020-NIL`,
    description: null,
    updated: "2026-10-06T04:02:06Z",
    layout: "tall",
    tone: "paper",
    tags: ["JavaScript", "React"],
  },
  {
    id: "itachi",
    repo: "Assistant_itachi",
    language: "Python",
    url: `${GITHUB}/Assistant_itachi`,
    description: null,
    updated: "2025-12-12T06:59:23Z",
    layout: "tall",
    tone: "paper",
    tags: ["Python"],
  },
  {
    id: "odoo",
    repo: "Odoo_LDCE",
    language: "TypeScript",
    url: `${GITHUB}/Odoo_LDCE`,
    description: null,
    updated: "2026-08-23T16:44:17Z",
    layout: "tall",
    tone: "paper",
    tags: ["TypeScript", "Odoo"],
  },
  {
    id: "ab-talks",
    repo: "AB-talks",
    language: "TypeScript",
    url: `${GITHUB}/AB-talks`,
    description: null,
    updated: "2026-08-08T08:04:49Z",
    layout: "tall",
    tone: "paper",
    tags: ["TypeScript"],
  },
  {
    id: "photo",
    repo: "Photography-portfolio",
    language: "JavaScript",
    url: `${GITHUB}/Photography-portfolio`,
    description: null,
    updated: "2026-07-21T13:59:48Z",
    layout: "tall",
    tone: "paper",
    tags: ["JavaScript"],
  },
  {
    id: "mysite",
    repo: "My-site",
    language: "JavaScript",
    url: `${GITHUB}/My-site`,
    description: null,
    updated: "2026-06-27T08:39:31Z",
    layout: "tall",
    tone: "paper",
    tags: ["JavaScript"],
  },
  {
    id: "smart-business",
    repo: "Smart-Business",
    language: "TypeScript",
    url: `${GITHUB}/Smart-Business`,
    description: null,
    updated: "2026-04-10T07:00:21Z",
    layout: "tall",
    tone: "paper",
    tags: ["TypeScript"],
  },
  {
    id: "dayflow",
    repo: "Dayflow",
    language: "JavaScript",
    url: `${GITHUB}/Dayflow`,
    description: null,
    updated: "2026-03-03T17:04:46Z",
    layout: "tall",
    tone: "paper",
    tags: ["JavaScript"],
  },
  {
    id: "metis-hire",
    repo: "metis-hire",
    language: "TypeScript",
    url: `${GITHUB}/metis-hire`,
    description: null,
    updated: "2026-03-22T04:45:19Z",
    fork: true,
    layout: "tall",
    tone: "paper",
    tags: ["TypeScript", "Fork"],
  },
  {
    id: "mvp",
    repo: "mvp-472a0d91",
    language: null,
    // GitHub's own repository description.
    description: "Auto-generated MVP by AI Solution Builder",
    updated: "2026-09-25T05:37:11Z",
    layout: "tall",
    tone: "paper",
    tags: ["MVP"],
  },
  {
    id: "exam",
    repo: "itue301-exam-24aiml020-B",
    language: "JavaScript",
    url: `${GITHUB}/itue301-exam-24aiml020-B`,
    description: null,
    updated: "2026-08-24T08:08:29Z",
    layout: "tall",
    tone: "paper",
    tags: ["JavaScript", "Exam"],
  },
  {
    id: "profile-repo",
    repo: "Ladnil03",
    language: null,
    url: `${GITHUB}/Ladnil03`,
    description: null,
    updated: "2026-07-10T13:34:08Z",
    layout: "tall",
    tone: "paper",
    tags: ["Profile"],
  },
];

/** The six that lead the home page, in editorial order. */
export const featuredProjects = projects.filter((p) =>
  ["feature", "tall", "offset", "wide"].includes(p.layout)
);

/** Dated from this repository's own commit history and reports. */
export const experience = [
  {
    period: "Aug 2026",
    role: "Task Management REST API",
    org: "student-backend",
    summary:
      "Took a practical CRUD API to Richardson Maturity Model Level 3 — added hypermedia _links, a Location header on create, separated PUT from PATCH semantics, and added collection filtering.",
    points: [
      "RMM Level 3 via HATEOAS hypermedia controls",
      "JWT auth, bcrypt, express-validator middleware",
      "201 Created with Location header on POST",
    ],
  },
  {
    period: "Aug 2026",
    role: "In-Memory Caching Layer",
    org: "student-backend",
    summary:
      "Added node-cache in front of MongoDB to cut round-trips and latency, with write-through invalidation and a benchmark harness to prove the win.",
    points: [
      "60s TTL with invalidation on every mutating verb",
      "X-Cache: HIT / MISS response headers",
      "Cache debug endpoint + benchmark.js",
    ],
  },
  {
    period: "Jul – Oct 2026",
    role: "React Portfolio & Task Dashboard",
    org: "Portfolio-24AIML020-NIL",
    summary:
      "Built this portfolio and the task dashboard that fronts the API — React 19 on Vite, route-level code splitting, optimistic UI, and lazy-loaded analytics.",
    points: [
      "Practicals 1 through 7, one commit per milestone",
      "Optimistic create with rollback on failure",
      "Recharts analytics split into its own lazy chunk",
    ],
  },
];

/** Course codes taken from published repository names — no institution is claimed. */
export const education = [
  {
    code: "24AIML020",
    title: "Artificial Intelligence & Machine Learning",
    note: "Course code used across this account's coursework and exam repositories.",
    url: `${GITHUB}?tab=repositories&q=24AIML020`,
  },
  {
    code: "ITUE301",
    title: "Examination Project",
    note: "Exam submission published as itue301-exam-24aiml020-B.",
    url: `${GITHUB}/itue301-exam-24aiml020-B`,
  },
];

export const achievements = [
  { label: "Pull Shark", detail: "×2", tone: "yellow" },
  { label: "Quickdraw", detail: "", tone: "sky" },
  { label: "YOLO", detail: "", tone: "coral" },
];

export const stats = [
  { value: "18", label: "Public repos", tone: "coral" },
  { value: "3", label: "Stars earned", tone: "yellow" },
  { value: "6", label: "Followers", tone: "sky" },
];