import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { MODULES, STAGES } from '../data/curriculum.js';
import { READY } from '../data/ready.js';
import { ALL, BY_ID, BY_CODE, LEVEL, FREQ, API_LABEL, MINUTES, VALID_IDS } from '../lib/curriculum.js';
import { href } from '../lib/router.js';
import { useDone, useStore, toggleDone, modeStore, lastStore, backup, restore, doneStores, quizStore } from '../lib/store.js';

function Ring({ value, total, size = 92, label }) {
  const r = 38, c = 2 * Math.PI * r, p = total ? value / total : 0;
  return (
    <svg className="ring-p" width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value} of ${total}`}>
      <circle cx="50" cy="50" r={r} className="bg" />
      <circle cx="50" cy="50" r={r} className="fg" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
      <text x="50" y="48" textAnchor="middle">{Math.round(p * 100)}%</text>
      <text x="50" y="64" textAnchor="middle" className="sm">{value}/{total}</text>
    </svg>
  );
}

function ProgressPanel({ onClose }) {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [how, setHow] = useState('merge');
  const [arm, setArm] = useState(false); // two-step reset (no confirm() dialogs)
  const d = useDone('d'), r = useDone('r');
  const copy = async () => {
    const json = JSON.stringify(backup());
    try { await navigator.clipboard.writeText(json); setMsg('Backup copied to the clipboard.'); }
    catch { setText(json); setMsg('Copy blocked. Select the text in the box and copy it.'); }
  };
  const doImport = () => {
    try { const n = restore(JSON.parse(text), how, VALID_IDS); setMsg(`Imported ${n} ticks (${how}).`); }
    catch { setMsg('That doesn’t look like a React Mastery backup.'); }
  };
  return (
    <div className="panel pop" role="dialog" aria-label="My progress">
      <div className="panel-head"><h3>My progress</h3><button type="button" className="x" onClick={onClose} aria-label="Close">✕</button></div>
      <p>📘 Learn: <b>{d.length}</b> · 🎯 Revision: <b>{r.length}</b> of {ALL.length} each. Saved in this browser.</p>
      <div className="row">
        <button type="button" className="btn" onClick={copy}>📋 Copy backup</button>
        <label className="btn file">📂 Load file<input type="file" accept=".json,application/json,text/plain" onChange={e => {
          const f = e.target.files[0]; if (!f) return;
          f.text().then(t => { setText(t); setMsg(`Loaded ${f.name}. Choose merge or replace, then Import.`); });
          e.target.value = '';
        }} /></label>
      </div>
      <textarea id="backup-text" value={text} onChange={e => setText(e.target.value)} placeholder="Paste backup text here to import" rows={3} />
      <div className="row">
        <select id="import-how" value={how} onChange={e => setHow(e.target.value)}><option value="merge">Merge with current</option><option value="replace">Replace current</option></select>
        <button type="button" className="btn primary" onClick={doImport} disabled={!text.trim()}>Import</button>
        {!arm && <button type="button" className="btn danger" onClick={() => setArm(true)}>Reset…</button>}
        {arm && <>
          <button type="button" className="btn danger" onClick={() => { doneStores.d.set([]); doneStores.r.set([]); quizStore.set({}); setArm(false); setMsg('Progress cleared.'); }}>Yes, clear all progress</button>
          <button type="button" className="btn" onClick={() => setArm(false)}>Keep it</button>
        </>}
      </div>
      {msg && <p className="msg">{msg}</p>}
    </div>
  );
}

export default function Home({ query }) {
  const mode = useStore(modeStore);
  const done = useDone(mode);
  const doneSet = useMemo(() => new Set(done), [done]);
  const last = useStore(lastStore);
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q.trim().toLowerCase());
  const [lv, setLv] = useState('');
  const [fq, setFq] = useState('');
  const [stage, setStage] = useState(0);
  const [open, setOpen] = useState(() => new Set([query.get('m') || 'INTRO']));
  const [panel, setPanel] = useState(false);
  const rev = mode === 'r';

  const mParam = query.get('m');
  useEffect(() => {
    if (mParam && BY_CODE.has(mParam)) {
      setOpen(o => new Set([...o, mParam]));
      requestAnimationFrame(() => document.getElementById('mod-' + mParam)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [mParam]);

  const filtering = !!(dq || lv || fq);
  const match = l => (!lv || l.level === lv) && (!fq || l.freq === fq) &&
    (!dq || `${l.id} ${l.title} ${l.objective}`.toLowerCase().includes(dq));
  const mods = MODULES.filter(m => !stage || m.stage === stage);
  const ready = ALL.filter(l => READY.has(l.id)).length;
  const firstUndone = ALL.find(l => READY.has(l.id) && !doneSet.has(l.id));
  const lastMeta = last && BY_ID.get(last.split('/')[0]);
  const hours = Math.round(ALL.reduce((a, l) => a + MINUTES[l.level], 0) / 60);

  return (
    <div className="wrap home">
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">Beginner → Advanced · React 19.2 · Vite 8 · Router 7</p>
          <h1>React <em>Mastery</em></h1>
          <p className="lede">{MODULES.length} modules, {ALL.length} bite-sized lessons. Every topic has an animated <b>Learn</b> lesson and a fast <b>Interview &amp; Revision</b> version.</p>
          <div className="hero-cta">
            {lastMeta && <a className="btn primary" href={href('lesson/' + last)}>▶ Continue: {lastMeta.title}</a>}
            {!lastMeta && firstUndone && <a className="btn primary" href={href(`lesson/${firstUndone.id}${rev ? '/rev' : ''}`)}>▶ Start: {firstUndone.title}</a>}
            {lastMeta && firstUndone && firstUndone.id !== lastMeta.id && <a className="btn" href={href(`lesson/${firstUndone.id}${rev ? '/rev' : ''}`)}>Next unfinished: {firstUndone.id}</a>}
            <a className="btn sprint-cta" href={href('sprint')}>⚡ Interview in 2 days? 15-hour sprint</a>
            <a className="btn" href={href('roadmap')}>🗺 Interview roadmap</a>
          </div>
          <div className="stats">
            <span><b>{ALL.length}</b> lessons</span><span><b>{ready}</b> ready</span><span><b>18</b> projects</span><span><b>~{hours}h</b> learning</span>
          </div>
        </div>
        <div className="hero-progress">
          <Ring value={done.length} total={ALL.length} size={132} label={rev ? 'Revision progress' : 'Learn progress'} />
          <div className="mode-switch" role="radiogroup" aria-label="Track">
            <button type="button" role="radio" aria-checked={!rev} className={!rev ? 'on' : ''} onClick={() => modeStore.set('d')}>📘 Learn</button>
            <button type="button" role="radio" aria-checked={rev} className={rev ? 'on rev' : ''} onClick={() => modeStore.set('r')}>🎯 Interview</button>
          </div>
          <button type="button" className="link" onClick={() => setPanel(p => !p)} aria-expanded={panel}>My progress ▾</button>
          {panel && <ProgressPanel onClose={() => setPanel(false)} />}
        </div>
      </header>

      <section className="stages">
        {STAGES.map(s => {
          const ls = MODULES.filter(m => m.stage === s.n).flatMap(m => m.lessons);
          const n = ls.filter(l => doneSet.has(l.id)).length;
          return (
            <button type="button" key={s.n} className={`stage s${s.n} ${stage === s.n ? 'on' : ''}`} onClick={() => setStage(stage === s.n ? 0 : s.n)}>
              <span className="stage-n">Stage {s.n}</span>
              <b>{s.name}</b><small>{s.sub}</small>
              <span className="bar"><i style={{ width: `${(n / ls.length) * 100}%` }} /></span>
              <small>{n}/{ls.length} done</small>
            </button>
          );
        })}
      </section>

      <div className="toolbar">
        <input id="lesson-search" type="search" placeholder="Search lessons, e.g. useEffect, keys, JWT…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search lessons" />
        <select id="filter-level" value={lv} onChange={e => setLv(e.target.value)} aria-label="Level"><option value="">All levels</option>{Object.entries(LEVEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select id="filter-freq" value={fq} onChange={e => setFq(e.target.value)} aria-label="Interview frequency"><option value="">Any interview frequency</option>{Object.entries(FREQ).map(([k, v]) => <option key={k} value={k}>{v} in interviews</option>)}</select>
        <button type="button" className="btn" onClick={() => setOpen(new Set(mods.map(m => m.code)))}>Expand all</button>
        <button type="button" className="btn" onClick={() => setOpen(new Set())}>Collapse</button>
      </div>

      <section className="modules">
        {mods.map(m => {
          const ls = m.lessons.filter(match);
          if (filtering && !ls.length) return null;
          const n = m.lessons.filter(l => doneSet.has(l.id)).length;
          const isOpen = filtering || open.has(m.code);
          return (
            <div key={m.code} id={'mod-' + m.code} className={`mod s${m.stage} ${isOpen ? 'open' : ''}`}>
              <button type="button" className="mod-head" aria-expanded={isOpen} onClick={() => setOpen(o => { const s = new Set(o); s.has(m.code) ? s.delete(m.code) : s.add(m.code); return s; })}>
                <span className="mod-n">{String(m.n).padStart(2, '0')}</span>
                <span className="mod-t"><b>{m.name}</b><small>{m.code} · {m.lessons.length} lessons · Stage {m.stage}{m.pre.length ? ` · after ${m.pre.join(', ')}` : ''}</small></span>
                <span className="mod-p"><span className="bar"><i style={{ width: `${(n / m.lessons.length) * 100}%` }} /></span>{n}/{m.lessons.length}</span>
                <span className="chev" aria-hidden="true">▾</span>
              </button>
              {isOpen && (
                <div className="mod-body">
                  {m.note && <p className="mod-note">{m.note}</p>}
                  <ul className="rows">
                    {ls.map(l => {
                      const has = READY.has(l.id);
                      return (
                        <li key={l.id} className={doneSet.has(l.id) ? 'done' : ''}>
                          <input type="checkbox" checked={doneSet.has(l.id)} onChange={e => toggleDone(mode, l.id, e.target.checked)} aria-label={`Mark ${l.id} done`} />
                          <span className="idtag">{rev ? l.id + '-REV' : l.id}</span>
                          <span className="row-t">
                            {has ? <a href={href(`lesson/${l.id}${rev ? '/rev' : ''}`)}>{l.title}</a> : <span className="muted">{l.title}</span>}
                            <small>{l.objective}</small>
                          </span>
                          <span className="row-tags">
                            <span className={`pill ${l.level.toLowerCase()}`}>{LEVEL[l.level]}</span>
                            {l.freq === 'H' && <span className="pill freq-H">🎯 High</span>}
                            {l.api && <span className={`pill api ${l.api}`}>{API_LABEL[l.api]}</span>}
                            {!has && <span className="pill ghost">Soon</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
