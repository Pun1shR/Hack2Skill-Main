export interface User {
  id: string;
  preferredName: string;
  exams: string[];
}

export const USERS: Record<string, User> = {
  'med': {
    id: 'med',
    preferredName: 'Aarav (Medical Candidate)',
    exams: ['NEET']
  },
  'eng': {
    id: 'eng',
    preferredName: 'Vikram (Engineering Candidate)',
    exams: ['JEE', 'GATE']
  }
};

export const MOCK_PASSWORDS: Record<string, string> = {
  'med': 'med',
  'eng': 'eng'
};
