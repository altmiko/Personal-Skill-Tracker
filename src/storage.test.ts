import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultData, exportData, importData, loadData, saveData, STORAGE_KEY } from './storage';

const values = new Map<string, string>();
beforeEach(() => {
  values.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  });
});

describe('local data', () => {
  it('round trips complete data through export and import', () => {
    const data = createDefaultData();
    data.settings.name = 'Learner';
    data.generatedDates.push(data.settings.startDate);
    data.journals[data.settings.startDate] = { built: 'API', learned: 'HTTP', blocker: '', next: 'Tests', done: true };
    data.dailyTasks.push({ id: '1', date: data.settings.startDate, title: 'Build', category: 'build', estimatedMinutes: 30, completed: true });
    expect(importData(exportData(data))).toEqual(data);
    expect(JSON.parse(exportData(data)).exportedAt).toBeTruthy();
  });
  it('persists and reloads progress', () => {
    const data = createDefaultData();
    data.timeLogs.push({ id: '1', date: data.settings.startDate, category: 'build', minutes: 35, note: '' });
    saveData(data);
    expect(loadData()).toEqual(data);
  });
  it('rejects invalid JSON, future versions and invalid field shapes', () => {
    expect(() => importData('{')).toThrow('valid JSON');
    expect(() => importData(JSON.stringify({ ...createDefaultData(), schemaVersion: 99 }))).toThrow('Unsupported');
    expect(() => importData(JSON.stringify({ ...createDefaultData(), dailyTasks: 'broken' }))).toThrow('dailyTasks');
  });
  it('does not replace corrupt stored data with defaults', () => {
    values.set(STORAGE_KEY, '{bad');
    expect(() => loadData()).toThrow();
    expect(values.get(STORAGE_KEY)).toBe('{bad');
  });
});
