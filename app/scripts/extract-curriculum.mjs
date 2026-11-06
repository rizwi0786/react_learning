import fs from 'node:fs';
const html = fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const s = html.indexOf('const MODULES = ['), e = html.indexOf('const API_LABEL');
const code = html.slice(s, e) + '\nreturn {MODULES,PROJ_STAGE,PROJ_AFTER,STAGES,WEEKS,CHECKLIST};';
const d = new Function(code.replace('const READY', 'const _READY'))();
const MODULES = d.MODULES.map(m => ({
  code: m.c, n: m.n, stage: m.s, name: m.name, pre: m.pre, note: m.note || '',
  lessons: m.L.split('\n').map(x => x.trim()).filter(Boolean).map((line, i) => {
    const [t, o, lv, f, api] = line.split('|');
    return { id: m.c + '-' + String(i + 1).padStart(3, '0'), title: t, objective: o, level: lv, freq: f || 'M', api: api || '' };
  })
}));
const out = `// Generated from index.html by scripts/extract-curriculum.mjs. Never reorder lessons: IDs come from position.
export const MODULES = ${JSON.stringify(MODULES, null, 1)};
export const PROJ_STAGE = ${JSON.stringify(d.PROJ_STAGE)};
export const PROJ_AFTER = ${JSON.stringify(d.PROJ_AFTER)};
export const STAGES = ${JSON.stringify(d.STAGES, null, 1)};
export const WEEKS = ${JSON.stringify(d.WEEKS, null, 1)};
export const CHECKLIST = ${JSON.stringify(d.CHECKLIST)};
`;
fs.writeFileSync(new URL('../src/data/curriculum.js', import.meta.url), out);
console.log(MODULES.map(m => `${m.code}(${m.n}) ${m.lessons.length} pre=${m.pre.join(',')}`).join('\n'));
console.log('total', MODULES.reduce((a, m) => a + m.lessons.length, 0));
