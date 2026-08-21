
export enum View {
  DASHBOARD = 'dashboard',
  APTITUDE = 'aptitude',
  RESUME = 'resume',
  INTERVIEW = 'interview',
  MOCK_EXAM = 'mock_exam'
}

export enum GlobalTheme {
  MIDNIGHT = 'midnight',
  EMERALD = 'emerald',
  ROSE = 'rose',
  AMBER = 'amber'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AcademicRecord {
  course: string;
  institution: string;
  board: string;
  year: string;
  score: string;
}

export interface ResumeData {
  fullName: string;
  mobile: string;
  email: string;
  socialLinks: string; // Used for Profile Links
  portfolioIds?: string; 
  address?: string;
  gender?: string;
  objective: string;
  skills: string;
  coreCompetence: string;
  projects: string; // Technical Projects
  experience: string;
  achievements: string;
  birthDate: string;
  martialStatus: string;
  languages: string;
  academics: AcademicRecord[];
}

export interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  formattingFeedback: string[];
  suggestedImprovements: string[];
}

export interface CriticReview {
  rating: number;
  accessibilityScore: number;
  positives: string[];
  improvements: string[];
  summary: string;
}

export interface ColorPalette {
  colors: {
    hex: string;
    label: string;
  }[];
  usage: string;
}

export enum ResumeTheme {
  CLASSIC = 'classic',
  MODERN = 'modern',
  MINIMAL = 'minimal'
}

// Interface for Market Trend analysis results with web grounding sources
export interface TrendsResult {
  text: string;
  sources: any[];
}
