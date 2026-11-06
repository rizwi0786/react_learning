import { useEffect, useState, use, Suspense } from 'react';
import { BY_ID, LEVEL, FREQ, MINUTES, API_LABEL, neighbours, prereq } from '../lib/curriculum.js';
import { loadModule } from '../lib/lessons.js';
import { href, go } from '../lib/router.js';
import { useDone, toggleDone, lastStore, useStore } from '../lib/store.js';
import { sprintStore, sprintPos, patchSprint, itemHref, SEQ } from '../lib/sprint.js';
import { Md } from '../lib/md.jsx';
import Visual from '../components/Visual.jsx';
import { CodeWalk, CodeBlock } from '../components/Code.jsx';
import { Quiz, Flashcards, Mistakes, Practice, Predict, Debug, Table } from '../components/Study.jsx';

function Section({ id, icon, title, children, className = '' }) {
  return (
    <section className={`ls ${className}`} id={id}>
      <h2><span className="ls-icon" aria-hidden="true">{icon}</span>{title}</h2>
      {children}
    </section>
  );
}

function Learn({ L, meta }) {
  const lang = L.code?.lang || 'jsx';
  return (
    <>
      <Section id="idea" icon="💡" title="The big idea">
        <p className="tldr"><Md text={L.tldr} /></p>
        <div className="analogy"><span className="an-icon">{L.analogy.icon}</span><Md text={L.analogy.text} as="p" /></div>
      </Section>
      <Section id="see" icon="🎬" title="See it"><Visual v={L.visual} /></Section>
      <Section id="points" icon="🔑" title="Key points">
        <ul className="points">{L.points.map((p, i) => <li key={i} style={{ '--d': i }}><Md text={p} /></li>)}</ul>
      </Section>
      <Section id="code" icon="💻" title="Code walkthrough">
        <CodeWalk code={L.code} />
        {L.output && <div className="output"><span className="out-tag">▶ Output</span><Md text={L.output} as="p" /></div>}
      </Section>
      {L.build && (
        <Section id="build" icon="🧱" title="Build plan">
          <div className="build">
            <div><h3>Features</h3><ul className="ticks">{L.build.features.map((f, i) => <li key={i}><Md text={f} /></li>)}</ul></div>
            <div><h3>Folders</h3><CodeBlock src={L.build.folders} lang="text" compact /></div>
          </div>
          <ol className="milestones">{L.build.steps.map((s, i) => (
            <li key={i}><b><Md text={s.title} /></b> <Md text={s.detail} />{s.code && <CodeBlock src={s.code} lang={lang} compact />}</li>
          ))}</ol>
          <p className="stretch"><b>Stretch goals:</b> {L.build.stretch.map((s, i) => <span key={i} className="chip"><Md text={s} /></span>)}</p>
        </Section>
      )}
      <Section id="mistakes" icon="⚠️" title="Common mistakes"><Mistakes items={L.mistakes} lang={lang} /></Section>
      <Section id="practice" icon="🏋️" title="Practice"><Practice items={L.practice} lang={lang} /></Section>
      <Section id="quiz" icon="✅" title="Quick check"><Quiz items={L.quiz} id={meta.id} /></Section>
    </>
  );
}

function Revise({ L, meta }) {
  const r = L.rev;
  const lang = L.code?.lang || 'jsx';
  return (
    <>
      <Section id="sec30" icon="⏱" title="In 30 seconds" className="rev">
        <p className="tldr"><Md text={r.sec30} /></p>
      </Section>
      <Section id="cheat" icon="📋" title="Cheat sheet" className="rev">
        <ul className="cheat">{r.cheat.map((c, i) => <li key={i} style={{ '--d': i }}><Md text={c} /></li>)}</ul>
      </Section>
      <Section id="cards" icon="🃏" title="Interview questions" className="rev"><Flashcards items={r.interview} /></Section>
      {r.predict?.length > 0 && <Section id="predict" icon="🔮" title="Predict the output" className="rev"><Predict items={r.predict} lang={lang} /></Section>}
      {r.debug?.length > 0 && <Section id="debug" icon="🐞" title="Debug it" className="rev"><Debug items={r.debug} lang={lang} /></Section>}
      {r.scenario?.length > 0 && (
        <Section id="scenario" icon="🧭" title="Scenarios" className="rev">
          {r.scenario.map((s, i) => (
            <details className="scn" key={i}><summary><Md text={s.q} /></summary><Md text={s.a} as="p" /></details>
          ))}
        </Section>
      )}
      {r.compare && <Section id="compare" icon="⚖️" title="Compare" className="rev"><Table t={r.compare} /></Section>}
      <Section id="code" icon="💻" title="Code to remember" className="rev"><CodeBlock src={L.code.src} lang={lang} file={L.code.file} /></Section>
      <Section id="quiz" icon="✅" title="Rapid quiz" className="rev"><Quiz items={L.quiz} id={meta.id} /></Section>
    </>
  );
}

function LessonBody({ meta, rev, promise }) {
  const data = use(promise);
  const L = data[meta.id];
  if (!L) {
    return (
      <div className="soon">
        <p className="soon-icon">✍️</p>
        <h2>This lesson is being written</h2>
        <p><b>You'll learn to:</b> {meta.objective}</p>
      </div>
    );
  }
  return (
    <>
      {rev ? <Revise L={L} meta={meta} /> : <Learn L={L} meta={meta} />}
      <Section id="related" icon="🔗" title="Related lessons">
        <div className="related">
          {L.related.filter(id => BY_ID.has(id)).map(id => (
            <a key={id} href={href(`lesson/${id}${rev ? '/rev' : ''}`)}><span className="idtag">{id}</span> {BY_ID.get(id).title}</a>
          ))}
        </div>
      </Section>
    </>
  );
}

function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => { const h = document.documentElement; setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)); };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div className="readbar" style={{ transform: `scaleX(${p})` }} />;
}

export default function Lesson({ id, rev }) {
  const meta = BY_ID.get(id);
  const mode = rev ? 'r' : 'd';
  const done = useDone(mode);
  const sprint = useStore(sprintStore);
  const sp = sprint.on ? sprintPos(id, rev) : null; // only when the learner is following the sprint
  const promise = meta ? loadModule(meta.module.code) : null; // cached per module, so stable
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    if (!meta) return;
    lastStore.set(id + (rev ? '/rev' : ''));
    window.scrollTo({ top: 0 });
    setSideOpen(false);
  }, [id, rev, meta]);

  const { prev, next } = neighbours(id);
  useEffect(() => {
    const onKey = e => {
      if (e.target.closest('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowLeft' && prev) go(`lesson/${prev.id}${rev ? '/rev' : ''}`);
      if (e.key === 'ArrowRight' && next) go(`lesson/${next.id}${rev ? '/rev' : ''}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, rev]);

  if (!meta) return <div className="wrap soon"><h2>Lesson not found</h2><a href={href('')}>Back to the course</a></div>;
  const m = meta.module;
  const isDone = done.includes(id);
  const pre = prereq(meta);

  return (
    <div className={`lesson-page ${rev ? 'is-rev' : ''}`}>
      <ScrollBar />
      <div className="wrap lesson-grid">
        <aside className={`side ${sideOpen ? 'open' : ''}`}>
          <button type="button" className="side-toggle" onClick={() => setSideOpen(o => !o)} aria-expanded={sideOpen}>
            ☰ M{m.n} {m.name} <span>{m.lessons.filter(l => done.includes(l.id)).length}/{m.lessons.length}</span>
          </button>
          <nav className="side-list">
            {m.lessons.map(l => (
              <a key={l.id} href={href(`lesson/${l.id}${rev ? '/rev' : ''}`)} className={`${l.id === id ? 'cur' : ''} ${done.includes(l.id) ? 'done' : ''}`}>
                <span className="tick">{done.includes(l.id) ? '✓' : l.id.slice(-3)}</span>{l.title}
              </a>
            ))}
          </nav>
        </aside>

        <main className="lesson">
          {sp && (
            <div className="sp-strip">
              <a href={href('sprint')} className="sp-strip-l">⚡ <b>Sprint</b> · Day {sp.item.block.day} · {sp.item.block.title} <span>{sp.i + 1}/{SEQ.length}</span></a>
              {sp.next && <a className="btn primary" href={href(itemHref(sp.next))}>Next in sprint →</a>}
              <button type="button" className="sp-strip-x" onClick={() => patchSprint({ on: false })} aria-label="Hide sprint bar" title="Hide sprint bar">✕</button>
            </div>
          )}
          <nav className="crumbs"><a href={href('')}>Course</a> / <a href={href(`?m=${m.code}`)}>M{m.n} {m.name}</a></nav>
          <header className="lesson-head">
            <div className="meta-row">
              <span className="idtag big">{rev ? id + '-REV' : id}</span>
              <span className={`pill ${meta.level.toLowerCase()}`}>{LEVEL[meta.level]}</span>
              <span className="pill ghost">⏱ {rev ? Math.round(MINUTES[meta.level] / 2) : MINUTES[meta.level]} min</span>
              <span className={`pill freq-${meta.freq}`}>🎯 Interview: {FREQ[meta.freq]}</span>
              {meta.api && <span className={`pill api ${meta.api}`}>{API_LABEL[meta.api]}</span>}
            </div>
            <h1>{meta.title}</h1>
            <p className="objective">{meta.objective}</p>
            {pre.length > 0 && (
              <p className="pre">Before this: {pre.map(p => BY_ID.has(p)
                ? <a key={p} href={href(`lesson/${p}${rev ? '/rev' : ''}`)} className="idtag">{p}</a>
                : <span key={p} className="idtag">{p}</span>)}</p>
            )}
            <div className="tabs" role="tablist">
              <a role="tab" aria-selected={!rev} className={!rev ? 'on' : ''} href={href(`lesson/${id}`)}>📘 Learn</a>
              <a role="tab" aria-selected={rev} className={rev ? 'on rev' : ''} href={href(`lesson/${id}/rev`)}>🎯 Interview &amp; Revision</a>
            </div>
          </header>

          <Suspense fallback={<div className="loading"><span /><span /><span /></div>}>
            {promise && <LessonBody key={id + rev} meta={meta} rev={rev} promise={promise} />}
          </Suspense>

          <div className="finish">
            <label className={`done-toggle ${isDone ? 'on' : ''}`}>
              <input type="checkbox" checked={isDone} onChange={e => toggleDone(mode, id, e.target.checked)} />
              <span>{isDone ? '✓ Completed' : `Mark ${rev ? 'revision' : 'lesson'} as done`}</span>
            </label>
            {sp && !isDone && (
              <button type="button" className="btn primary" onClick={() => { toggleDone(mode, id, true); go(sp.next ? itemHref(sp.next) : 'sprint'); }}>
                {sp.next ? 'Done, next in sprint →' : 'Done, back to sprint ✓'}
              </button>
            )}
            {!sp && !isDone && next && (
              <button type="button" className="btn primary" onClick={() => { toggleDone(mode, id, true); go(`lesson/${next.id}${rev ? '/rev' : ''}`); }}>
                Done, next lesson →
              </button>
            )}
          </div>
          <nav className="pager">
            {prev ? <a href={href(`lesson/${prev.id}${rev ? '/rev' : ''}`)}><small>← {prev.id}</small>{prev.title}</a> : <span />}
            {next ? <a className="nx" href={href(`lesson/${next.id}${rev ? '/rev' : ''}`)}><small>{next.id} →</small>{next.title}</a> : <span />}
          </nav>
          <p className="kbd-hint">Tip: use ← → keys to move between lessons.</p>
        </main>
      </div>
    </div>
  );
}
