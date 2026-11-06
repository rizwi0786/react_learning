// Validate lesson data files. Usage: node app/scripts/validate.mjs [CODE ...]   (no args = all files)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const lessonsDir = path.join(here, '..', 'src', 'lessons');
const { MODULES } = await import(pathToFileURL(path.join(here, '..', 'src', 'data', 'curriculum.js')).href);
const ALL = new Map(MODULES.flatMap(m => m.lessons.map(l => [l.id, { ...l, module: m.code }])));

const want = process.argv.slice(2);
const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.js'))
  .filter(f => !want.length || want.includes(f.split('.')[0]));
if (!files.length) { console.log('No lesson files found for', want.join(', ') || '(all)'); process.exit(1); }

const errors = [], warns = [];
const seen = new Map();
const E = (id, msg) => errors.push(`${id}: ${msg}`);
const W = (id, msg) => warns.push(`${id}: ${msg}`);
const isStr = v => typeof v === 'string' && v.trim().length > 0;
const str = (id, name, v, max) => { if (!isStr(v)) E(id, `${name} must be a non-empty string`); else if (max && v.length > max) W(id, `${name} is ${v.length} chars (aim <= ${max})`); };
const arr = (id, name, v, min, max) => { if (!Array.isArray(v)) { E(id, `${name} must be an array`); return false; } if (v.length < min || v.length > max) E(id, `${name} needs ${min}-${max} items (has ${v.length})`); return true; };
const LEVELS = ['basic', 'intermediate', 'advanced', 'tricky'];
const LANGS = ['jsx', 'js', 'ts', 'tsx', 'html', 'css', 'bash', 'json', 'text'];

function checkVisual(id, v) {
  if (!v || typeof v !== 'object') return E(id, 'visual missing');
  str(id, 'visual.title', v.title, 80);
  switch (v.type) {
    case 'flow': case 'cycle':
      if (arr(id, 'visual.steps', v.steps, 3, 6)) v.steps.forEach((s, i) => { str(id, `visual.steps[${i}].label`, s.label, 32); str(id, `visual.steps[${i}].detail`, s.detail, 140); });
      break;
    case 'compare':
      for (const side of ['left', 'right']) {
        const s = v[side]; if (!s) { E(id, `visual.${side} missing`); continue; }
        str(id, `visual.${side}.label`, s.label, 40);
        if (s.tone && !['bad', 'good', 'neutral'].includes(s.tone)) E(id, `visual.${side}.tone invalid`);
        if (arr(id, `visual.${side}.points`, s.points, 2, 5)) s.points.forEach((p, i) => str(id, `visual.${side}.points[${i}]`, p, 110));
      }
      break;
    case 'tree': {
      let n = 0, depth = 0;
      const walk = (node, d) => { n++; depth = Math.max(depth, d); if (!isStr(node?.label)) E(id, 'tree node without label'); (node?.children || []).forEach(c => walk(c, d + 1)); };
      if (!v.root) E(id, 'visual.root missing'); else walk(v.root, 1);
      if (n > 16) W(id, `tree has ${n} nodes (aim <= 14)`); if (depth > 5) W(id, `tree depth ${depth} (aim <= 4)`);
      break;
    }
    case 'layers':
      if (arr(id, 'visual.items', v.items, 3, 7)) v.items.forEach((s, i) => { str(id, `visual.items[${i}].label`, s.label, 40); if (s.detail) str(id, `visual.items[${i}].detail`, s.detail, 120); });
      break;
    case 'timeline':
      if (arr(id, 'visual.frames', v.frames, 3, 7)) v.frames.forEach((f, i) => { str(id, `visual.frames[${i}].label`, f.label, 30); str(id, `visual.frames[${i}].state`, f.state, 80); if (f.note) str(id, `visual.frames[${i}].note`, f.note, 130); });
      break;
    default: E(id, `visual.type "${v.type}" is not one of flow, cycle, compare, tree, layers, timeline`);
  }
}

function checkLesson(id, L, file) {
  const meta = ALL.get(id);
  if (!meta) return E(id, `not a curriculum ID (file ${file})`);
  if (!file.startsWith(meta.module + '.')) E(id, `belongs to module ${meta.module} but is in ${file}`);
  str(id, 'tldr', L.tldr, 260);
  if (!L.analogy) E(id, 'analogy missing'); else { str(id, 'analogy.icon', L.analogy.icon, 8); str(id, 'analogy.text', L.analogy.text, 240); }
  checkVisual(id, L.visual);
  if (arr(id, 'points', L.points, 3, 6)) L.points.forEach((p, i) => str(id, `points[${i}]`, p, 220));
  const c = L.code;
  if (!c) E(id, 'code missing'); else {
    str(id, 'code.file', c.file); str(id, 'code.src', c.src);
    if (!LANGS.includes(c.lang)) E(id, `code.lang "${c.lang}" invalid`);
    const nLines = isStr(c.src) ? c.src.split('\n').length : 0;
    const maxLines = meta.module === 'PROJ' ? 90 : 50;
    if (nLines > maxLines) W(id, `code.src has ${nLines} lines (aim <= ${maxLines - 5})`);
    if (arr(id, 'code.walk', c.walk, 2, 7)) c.walk.forEach((w, i) => {
      if (!Array.isArray(w.lines) || !w.lines.length || w.lines.some(n => !Number.isInteger(n) || n < 1 || n > nLines)) E(id, `code.walk[${i}].lines must be 1..${nLines}`);
      str(id, `code.walk[${i}].note`, w.note, 180);
    });
  }
  if (L.output !== undefined) str(id, 'output', L.output, 450);
  if (arr(id, 'mistakes', L.mistakes, 1, 3)) L.mistakes.forEach((m, i) => { str(id, `mistakes[${i}].bad`, m.bad); str(id, `mistakes[${i}].good`, m.good); str(id, `mistakes[${i}].why`, m.why, 220); });
  if (arr(id, 'practice', L.practice, 3, 5)) L.practice.forEach((p, i) => { if (!['B', 'I', 'C'].includes(p.level)) E(id, `practice[${i}].level must be B, I or C`); str(id, `practice[${i}].q`, p.q); str(id, `practice[${i}].a`, p.a); if (p.code !== undefined) str(id, `practice[${i}].code`, p.code); });
  if (arr(id, 'quiz', L.quiz, 3, 3)) L.quiz.forEach((q, i) => {
    str(id, `quiz[${i}].q`, q.q); str(id, `quiz[${i}].why`, q.why);
    if (arr(id, `quiz[${i}].options`, q.options, 2, 4)) { q.options.forEach((o, j) => str(id, `quiz[${i}].options[${j}]`, o)); if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) E(id, `quiz[${i}].answer out of range`); }
  });
  const r = L.rev;
  if (!r) E(id, 'rev missing'); else {
    str(id, 'rev.sec30', r.sec30, 450);
    if (arr(id, 'rev.interview', r.interview, 4, 6)) {
      r.interview.forEach((q, i) => { if (!LEVELS.includes(q.level)) E(id, `rev.interview[${i}].level invalid`); str(id, `rev.interview[${i}].q`, q.q); str(id, `rev.interview[${i}].a`, q.a); });
      if (new Set(r.interview.map(q => q.level)).size < 3) E(id, 'rev.interview needs at least 3 different levels');
    }
    if (r.predict !== undefined && arr(id, 'rev.predict', r.predict, 0, 2)) r.predict.forEach((p, i) => { str(id, `rev.predict[${i}].code`, p.code); str(id, `rev.predict[${i}].answer`, p.answer); str(id, `rev.predict[${i}].why`, p.why); });
    if (r.debug !== undefined && arr(id, 'rev.debug', r.debug, 0, 2)) r.debug.forEach((p, i) => { str(id, `rev.debug[${i}].code`, p.code); str(id, `rev.debug[${i}].fix`, p.fix); str(id, `rev.debug[${i}].why`, p.why); });
    if (r.scenario !== undefined && arr(id, 'rev.scenario', r.scenario, 0, 2)) r.scenario.forEach((p, i) => { str(id, `rev.scenario[${i}].q`, p.q); str(id, `rev.scenario[${i}].a`, p.a); });
    if (r.compare !== undefined) {
      if (!Array.isArray(r.compare.cols) || !Array.isArray(r.compare.rows)) E(id, 'rev.compare needs cols and rows arrays');
      else r.compare.rows.forEach((row, i) => { if (!Array.isArray(row) || row.length !== r.compare.cols.length) E(id, `rev.compare.rows[${i}] must have ${r.compare.cols.length} cells`); });
    }
    if (arr(id, 'rev.cheat', r.cheat, 5, 8)) r.cheat.forEach((p, i) => str(id, `rev.cheat[${i}]`, p, 160));
  }
  if (arr(id, 'related', L.related, 2, 4)) L.related.forEach(x => { if (!ALL.has(x)) E(id, `related "${x}" is not a curriculum ID`); if (x === id) E(id, 'related lists itself'); });
  if (meta.module === 'PROJ') {
    const b = L.build;
    if (!b) E(id, 'build missing (required for PROJ)'); else {
      if (arr(id, 'build.features', b.features, 4, 8)) b.features.forEach((f, i) => str(id, `build.features[${i}]`, f));
      str(id, 'build.folders', b.folders);
      if (arr(id, 'build.steps', b.steps, 4, 8)) b.steps.forEach((s, i) => { str(id, `build.steps[${i}].title`, s.title); str(id, `build.steps[${i}].detail`, s.detail); });
      if (arr(id, 'build.stretch', b.stretch, 2, 4)) b.stretch.forEach((s, i) => str(id, `build.stretch[${i}]`, s));
    }
  }
  const textAll = JSON.stringify(L);
  if (/react-router-dom/.test(textAll)) E(id, 'imports react-router-dom; use "react-router" (v7)');
  if (/create-react-app|npx create-react-app/i.test(textAll) && !/deprecated/i.test(textAll)) E(id, 'mentions Create React App without calling it deprecated');
  if (/ReactDOM\.render\(/.test(textAll) && !/legacy|removed|old|deprecated/i.test(textAll)) E(id, 'uses ReactDOM.render without labelling it legacy/removed');
}

for (const f of files) {
  let mod;
  try { mod = await import(pathToFileURL(path.join(lessonsDir, f)).href + '?t=' + Date.now()); }
  catch (e) { errors.push(`${f}: cannot import (syntax error?): ${e.message}`); continue; }
  const data = mod.default;
  if (!data || typeof data !== 'object') { errors.push(`${f}: no default export object`); continue; }
  for (const [id, L] of Object.entries(data)) {
    if (seen.has(id)) E(id, `duplicate (also in ${seen.get(id)})`); seen.set(id, f);
    checkLesson(id, L, f);
  }
}

// Coverage per requested module
const codes = want.length ? want : MODULES.map(m => m.code);
const missing = [];
for (const code of codes) { const m = MODULES.find(x => x.code === code); if (!m) continue; for (const l of m.lessons) if (!seen.has(l.id)) missing.push(l.id); }

if (warns.length) console.log(`Warnings (${warns.length}):\n  ` + warns.join('\n  '));
if (missing.length) console.log(`Missing lessons (${missing.length}): ${missing.join(', ')}`);
if (errors.length) { console.log(`ERRORS (${errors.length}):\n  ` + errors.join('\n  ')); process.exit(1); }
console.log(`OK: ${seen.size} lessons valid in ${files.length} file(s)${missing.length ? `, ${missing.length} missing` : ''}.`);
