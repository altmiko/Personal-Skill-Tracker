import { z } from 'zod';
import type { AppData } from './types';

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'forge12-data';

const text = z.string();
const date = text.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date in YYYY-MM-DD format').refine(value => {
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
}, 'Invalid calendar date');
const optionalDate = z.union([date, z.literal('')]);
const minutes = z.number().finite().nonnegative();
const strings = z.array(text);
const schema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  settings: z.object({ name: text, startDate: date, weeklyHourGoal: z.number().finite().positive(), dailyHourGoal: z.number().finite().positive(), studyDays: z.array(z.number().int().min(0).max(6)), theme: z.enum(['light', 'dark', 'system']) }),
  roadmap: z.record(z.object({ completedTaskIds: strings, milestoneStatus: text, milestoneEvidenceUrl: text, milestoneNotes: text, delayed: z.boolean() })),
  dailyTasks: z.array(z.object({ id: text, date, title: text, category: text, estimatedMinutes: minutes, completed: z.boolean(), sourceWeek: z.number().int().min(1).max(12).optional() })),
  generatedDates: z.array(date),
  timeLogs: z.array(z.object({ id: text, date, category: text, minutes, note: text })),
  journals: z.record(z.object({ built: text, learned: text, blocker: text, next: text, done: z.boolean() })),
  projectProgress: z.record(z.object({ completedFeatureIds: strings, repoUrl: text, demoUrl: text, evidenceUrls: strings, notes: text })),
  dsaEntries: z.array(z.object({ id: text, date: optionalDate, name: text, pattern: text, difficulty: text, url: text, minutes, status: text, notes: text, nextReviewDate: optionalDate, confidence: text, bigO: text })),
  applications: z.array(z.object({ id: text, company: text, role: text, track: text, location: text, workMode: text, url: text, appliedDate: optionalDate, stage: text, nextActionDate: optionalDate, notes: text, salary: text })),
  mockInterviews: z.array(z.object({ id: text, date: optionalDate, topic: text, feedback: text, nextSteps: text })),
  skills: z.record(text),
});

function localDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function createDefaultData(): AppData {
  return { schemaVersion: SCHEMA_VERSION, settings: { name: '', startDate: localDate(), weeklyHourGoal: 42, dailyHourGoal: 7, studyDays: [1, 2, 3, 4, 5, 6], theme: 'system' }, roadmap: {}, dailyTasks: [], generatedDates: [], timeLogs: [], journals: {}, projectProgress: {}, dsaEntries: [], applications: [], mockInterviews: [], skills: {} };
}
export const initialData = createDefaultData;

/** Validate before accepting any backup or persisted state; unknown future versions are never silently downgraded. */
function validate(value: unknown): AppData {
  if (typeof value !== 'object' || value === null || !('schemaVersion' in value)) throw new Error('Backup is missing its schema version.');
  const version = value.schemaVersion;
  if (version !== SCHEMA_VERSION) throw new Error(`Unsupported data schema version: ${String(version)}.`);
  const result = schema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`Invalid data at ${issue.path.join('.') || 'root'}: ${issue.message}`);
  }
  return result.data;
}

export function importData(json: string): AppData {
  let parsed: unknown;
  try { parsed = JSON.parse(json); } catch { throw new Error('The selected file is not valid JSON.'); }
  return validate(parsed);
}
export function exportData(data: AppData): string {
  return JSON.stringify({ ...validate(data), exportedAt: new Date().toISOString() }, null, 2);
}
export function loadData(): AppData {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? createDefaultData() : importData(stored);
}
export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validate(data)));
}
