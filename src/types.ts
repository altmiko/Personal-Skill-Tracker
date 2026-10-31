export interface Settings {
  name: string;
  startDate: string;
  weeklyHourGoal: number;
  dailyHourGoal: number;
  studyDays: number[];
  theme: 'light' | 'dark' | 'system';
}

export interface DailyTask {
  id: string;
  date: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  completed: boolean;
  sourceWeek?: number;
}

export interface TimeLog { id: string; date: string; category: string; minutes: number; note: string }
export interface Journal { built: string; learned: string; blocker: string; next: string; done: boolean }
export interface RoadmapProgress {
  completedTaskIds: string[];
  milestoneStatus: string;
  milestoneEvidenceUrl: string;
  milestoneNotes: string;
  delayed: boolean;
}
export interface ProjectProgress {
  completedFeatureIds: string[];
  repoUrl: string;
  demoUrl: string;
  evidenceUrls: string[];
  notes: string;
}
export interface DsaEntry {
  id: string; date: string; name: string; pattern: string; difficulty: string; url: string;
  minutes: number; status: string; notes: string; nextReviewDate: string; confidence: string; bigO: string;
}
export interface Application {
  id: string; company: string; role: string; track: string; location: string; workMode: string;
  url: string; appliedDate: string; stage: string; nextActionDate: string; notes: string; salary: string;
}
export interface MockInterview { id: string; date: string; topic: string; feedback: string; nextSteps: string }
export interface AppData {
  schemaVersion: number;
  settings: Settings;
  roadmap: Record<string, RoadmapProgress>;
  dailyTasks: DailyTask[];
  generatedDates: string[];
  timeLogs: TimeLog[];
  journals: Record<string, Journal>;
  projectProgress: Record<string, ProjectProgress>;
  dsaEntries: DsaEntry[];
  applications: Application[];
  mockInterviews: MockInterview[];
  skills: Record<string, string>;
}
