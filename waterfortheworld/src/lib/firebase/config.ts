// This file is kept for backward compatibility
// New code should import from './init' instead

export * from './init';

export interface QuizStats {
  correctAnswers: number;
  incorrectAnswers: number;
  lastUpdated: Date;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  dropletCount: number;
  quizStats?: QuizStats;
  createdAt: Date;
  updatedAt: Date;
}
