import { identity } from './identity';

// Public CV, transcribed from data/CV/CV.pdf for the page at the Lead's request (2026-11-15).
// Left out on purpose: the phone number (never published) and the placeholder photo box.
// The original file is never linked or shipped. Text is verbatim; do not add or embellish.

/** Lead decision pending in the module doc: set to false to hide the GPA and course grades. */
export const SHOW_GRADES = true;

export const cv = {
  name: identity.profile.fullName,
  focus: 'AI / Software Engineering',
  standing: 'Information Technology Undergraduate',
  school: 'UET · Vietnam National University, Hanoi',
  contact: [
    { label: 'Email', value: identity.publicContacts.email, href: `mailto:${identity.publicContacts.email}` },
    { label: 'GitHub', value: 'github.com/august0362', href: identity.publicContacts.github },
    { label: 'Location', value: 'Hanoi, Vietnam' },
  ],
  education: {
    institution: 'University of Engineering and Technology',
    university: 'Vietnam National University, Hanoi',
    program: 'Information Technology',
    expected: 'Expected 2028',
    gpa: '3.47 / 4.00',
  },
  skills: [
    { group: 'Programming', items: ['Python', 'TypeScript', 'Java', 'SQL'] },
    { group: 'AI / ML', items: ['PyTorch', 'DQN', 'Self-play'] },
    { group: 'Software', items: ['React', 'FastAPI', 'Pydantic', 'REST'] },
    { group: 'Tools', items: ['Git', 'Pygame', 'Three.js'] },
  ],
  coursework: [
    { course: 'Advanced Programming', grade: '9.5 / A+' },
    { course: 'Data Structures & Algo.', grade: '8.7 / A' },
    { course: 'Object-Oriented Prog.', grade: '8.6 / A' },
    { course: 'Computer Networks', grade: '8.8 / A' },
  ],
  languages: ['English: intermediate (self-assessed)'],
  summary:
    'Information Technology undergraduate (expected 2028) focused on AI and software engineering. Experience architecting student projects, developing a Deep Q-Network chess agent, and coordinating AI coding agents to build modular software systems.',
  projects: [
    {
      title: 'Chess AI Tournament',
      role: 'Team Lead / Deep Reinforcement Learning Developer',
      stack: ['Python', 'PyTorch', 'DQN', 'Pygame', 'python-chess'],
      points: [
        'Designed and built the chess application architecture, modular bot interfaces, integration workflow and shared systems as team lead.',
        'Developed the Deep Reinforcement Learning (DQN) chess bot, including self-play training and benchmark evaluation.',
        'Coordinated AI coding agents during implementation; integrated player-vs-bot and bot-vs-bot modes, Elo rankings and match history.',
      ],
    },
    {
      title: 'AI Asset Studio',
      role: 'Personal Project / Under Development',
      stack: ['React', 'TypeScript', 'Three.js', 'FastAPI', 'Pydantic'],
      points: [
        'Architected and built the local-first game-asset application, defining frontend/backend modules, APIs and model contracts.',
        'Directed multiple AI coding agents to implement mock-mode workflows, validation, job management and PNG / 3D GLB previews.',
        'Current status: mock workflows implemented; live Kaggle integration and production generative models are not yet complete.',
      ],
    },
  ],
  recognition: [{ title: 'Second Prize', detail: 'Provincial Mathematics Competition (Grade 12)' }],
} as const;
