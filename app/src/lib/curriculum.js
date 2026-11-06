import { MODULES } from '../data/curriculum.js';

export const ALL = MODULES.flatMap(m => m.lessons.map((l, i) => ({ ...l, module: m, index: i })));
export const BY_ID = new Map(ALL.map(l => [l.id, l]));
export const BY_CODE = new Map(MODULES.map(m => [m.code, m]));
export const VALID_IDS = new Set(ALL.map(l => l.id));
export const LEVEL = { B: 'Beginner', I: 'Intermediate', A: 'Advanced' };
export const FREQ = { H: 'High', M: 'Medium', L: 'Low' };
export const MINUTES = { B: 20, I: 30, A: 40 };
export const API_LABEL = { s18: 'Stable 18+', s19: 'React 19+', s192: 'React 19.2+', leg: 'Legacy' };

export function neighbours(id) {
  const i = ALL.findIndex(l => l.id === id);
  return { prev: ALL[i - 1] || null, next: ALL[i + 1] || null };
}
export function prereq(l) {
  if (l.index > 0) return [l.module.lessons[l.index - 1].id];
  return l.module.pre.filter(c => BY_CODE.has(c)).map(c => `${c} module`);
}
