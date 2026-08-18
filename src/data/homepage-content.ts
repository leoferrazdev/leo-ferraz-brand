export interface HomepageConcept {
  id: string;
  label: string;
  category: string;
  status: string;
  title: string;
  description: string;
  artifactLabel: string;
  artifactLines: string[];
  evidence: string[];
  destination?: string;
}

export const featuredConcept: HomepageConcept = {
  id: 'project-001',
  label: 'PROJECT 001',
  category: 'SAAS CONCEPT',
  status: 'FICTIONAL CONTENT · REVIEW ONLY',
  title: 'PRODUCT WORKSPACE CONCEPT',
  description: 'A temporary SaaS concept for organizing product notes, build context and release review.',
  artifactLabel: 'MOCK PRODUCT ARTIFACT',
  artifactLines: ['PRODUCT NOTES', 'BUILD CONTEXT', 'REVIEW BOARD'],
  evidence: ['REVIEW ONLY', 'NO LIVE METRICS', 'REPLACE WITH REAL DATA'],
};

export const secondaryConcepts: HomepageConcept[] = [
  {
    id: 'project-002',
    label: 'PROJECT 002',
    category: 'APP CONCEPT',
    status: 'CONCEPT SLOT',
    title: 'Reserved for a real app artifact.',
    description: 'Temporary space for a future product with a verifiable artifact.',
    artifactLabel: 'ARTIFACT SLOT',
    artifactLines: ['APP', 'CONCEPT', 'REVIEW ONLY'],
    evidence: ['NO LIVE DATA'],
  },
  {
    id: 'project-003',
    label: 'PROJECT 003',
    category: 'GAME CONCEPT',
    status: 'CONCEPT SLOT',
    title: 'Reserved for a real game artifact.',
    description: 'Temporary space for a future experiment with a verifiable playable result.',
    artifactLabel: 'ARTIFACT SLOT',
    artifactLines: ['GAME', 'CONCEPT', 'REVIEW ONLY'],
    evidence: ['NO LIVE DATA'],
  },
];
