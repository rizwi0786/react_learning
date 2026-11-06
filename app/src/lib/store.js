import { useSyncExternalStore } from 'react';

// localStorage-backed stores. Keys match the original curriculum page (rm-done-d / rm-done-r)
// so existing progress carries over. Every access is wrapped: storage can be blocked.
const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

export function createStore(key, initial) {
  let value = read(key, initial);
  const subs = new Set();
  return {
    get: () => value,
    set(next) { value = typeof next === 'function' ? next(value) : next; write(key, value); subs.forEach(f => f()); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
}

export const doneStores = { d: createStore('rm-done-d', []), r: createStore('rm-done-r', []) };
export const modeStore = createStore('rm-mode', 'd');
export const themeStore = createStore('rm-theme', 'auto');
export const quizStore = createStore('rm-quiz', {}); // { [lessonId]: correctCount }
export const lastStore = createStore('rm-last', '');

export function useStore(store) { return useSyncExternalStore(store.subscribe, store.get, store.get); }

export function useDone(mode) {
  const list = useStore(doneStores[mode]);
  return list;
}
export function toggleDone(mode, id, on) {
  doneStores[mode].set(list => {
    const s = new Set(list); (on ?? !s.has(id)) ? s.add(id) : s.delete(id); return [...s];
  });
}

export function backup() {
  return { app: 'react-mastery', version: 2, exported: new Date().toISOString(), detailed: doneStores.d.get(), revision: doneStores.r.get(), quiz: quizStore.get() };
}
export function restore(data, how, validIds) {
  const pick = a => (Array.isArray(a) ? a : []).filter(id => validIds.has(id));
  const d = pick(data.detailed ?? data.d ?? data['rm-done-d']);
  const r = pick(data.revision ?? data.r ?? data['rm-done-r']);
  if (how === 'replace') { doneStores.d.set(d); doneStores.r.set(r); }
  else { doneStores.d.set(x => [...new Set([...x, ...d])]); doneStores.r.set(x => [...new Set([...x, ...r])]); }
  if (data.quiz && typeof data.quiz === 'object') quizStore.set(q => ({ ...q, ...data.quiz }));
  return d.length + r.length;
}
