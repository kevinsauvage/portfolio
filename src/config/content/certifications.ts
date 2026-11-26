export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  credentialUrl?: string;
};

export const certifications: Certification[] = [
  {
    id: 'now-learning-accessibility-2026',
    title: 'Deepening Web Accessibility',
    issuer: 'Self-directed · In Progress',
    date: '2026',
    description:
      'Learning more about WCAG 2.2, ARIA authoring practices and screen reader testing, and using it in my work at Keolis.',
  },
  {
    id: 'now-learning-ai-engineering-2026',
    title: 'AI & LLM Engineering',
    issuer: 'Self-directed · In Progress',
    date: '2026',
    description:
      'Learning how LLMs work and how to build with them: prompting, tool use, retrieval and agents, with small projects to practise.',
  },
  {
    id: 'ef-set-c1-english-certificate-2024',
    title: 'C1 English Certificate',
    issuer: 'EF SET',
    date: 'March 2024',
    description:
      'Official C1 Advanced English certification for professional communication in international environments.',
    credentialUrl: 'https://cert.efset.org/W8vpXL',
  },
  {
    id: 'linkedin-react-using-typescript-2023',
    title: 'React: Using TypeScript',
    issuer: 'LinkedIn Learning',
    date: 'November 2023',
    credentialUrl:
      'https://www.linkedin.com/learning/certificates/40fd79658af09c1bdbf16e99974debccb5b541758ce2d58f71bdb0dfc323722e',
  },
  {
    id: 'udemy-advanced-javascript-2021',
    // eslint-disable-next-line no-restricted-syntax
    title: 'JavaScript: The Advanced Concepts',
    issuer: 'Udemy',
    date: '2021',
    credentialUrl: 'https://www.udemy.com/certificate/UC-833af855-7179-4c4e-903a-98172c7e4964/',
  },
  {
    id: 'le-wagon-full-stack-web-developer-2020',
    title: 'Full-Stack Web Developer Bootcamp',
    issuer: 'Le Wagon',
    date: '2020',
    credentialUrl: '/fullstack-certificate-Kevin-sauvage.pdf',
  },
];

export default certifications;
