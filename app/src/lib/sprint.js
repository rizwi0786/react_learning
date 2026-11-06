import { BLOCKS } from '../data/sprint.js';
import { createStore } from './store.js';

// Flat, ordered list of every lesson in the sprint: { id, mode, block, k }
export const SEQ = BLOCKS.flatMap(b => b.items.map(([id, mode], k) => ({ id, mode, block: b, k })));

// { on, start: {1:'09:00', 2:'09:00'}, say: ['d1-js:0', ...], rapid: { [index]: 'ok' | 'again' } }
export const sprintStore = createStore('rm-sprint', { on: false, start: { 1: '09:00', 2: '09:00' }, say: [], rapid: {} });

export const patchSprint = p => sprintStore.set(s => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));

export function sprintPos(id, rev) {
  const mode = rev ? 'r' : 'd';
  const i = SEQ.findIndex(x => x.id === id && x.mode === mode);
  return i < 0 ? null : { i, item: SEQ[i], next: SEQ[i + 1] || null };
}

export const itemHref = x => (x.mode === 'r' ? `lesson/${x.id}/rev` : `lesson/${x.id}`);
