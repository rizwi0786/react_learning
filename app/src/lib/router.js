import { useSyncExternalStore } from 'react';

// Hash router using plain names only (letters, digits, hyphens), so links survive being shared:
//   ''              course home
//   #roadmap        roadmap page
//   #HOOKS-005      lesson, Learn tab
//   #HOOKS-005-rev  lesson, Interview & Revision tab
//   #m-HOOKS        course home, scrolled to a module
// Internally the app still thinks in paths ('lesson/ID', 'lesson/ID/rev', 'roadmap', '?m=CODE').
const subscribe = cb => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb); };
const getHash = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));

function parse(hash) {
  const lesson = hash.match(/^([A-Z]+-\d{3})(-rev|-REV)?$/);
  if (lesson) return { parts: ['lesson', lesson[1], ...(lesson[2] ? ['rev'] : [])], query: new URLSearchParams() };
  const mod = hash.match(/^m-([A-Z]+)$/);
  if (mod) return { parts: [], query: new URLSearchParams({ m: mod[1] }) };
  if (hash === 'roadmap') return { parts: ['roadmap'], query: new URLSearchParams() };
  // legacy "#/lesson/ID/rev" style links
  const [path, q = ''] = hash.split('?');
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(q) };
}

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, getHash, () => '');
  return parse(hash);
}

function toHash(to) {
  const t = to.replace(/^\/+/, '');
  let m;
  if ((m = t.match(/^lesson\/([A-Z]+-\d{3})(\/rev)?$/))) return m[1] + (m[2] ? '-rev' : '');
  if ((m = t.match(/^\?m=([A-Z]+)$/))) return 'm-' + m[1];
  return t;
}

export const href = to => { const h = toHash(to); return h ? '#' + h : '#'; };
export const go = to => { window.location.hash = toHash(to); };
