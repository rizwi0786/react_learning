import { useState } from 'react';
import { STAGES, WEEKS, PROJ_STAGE, PROJ_AFTER, CHECKLIST } from '../data/curriculum.js';
import { READY } from '../data/ready.js';
import { BY_CODE, LEVEL } from '../lib/curriculum.js';
import { href } from '../lib/router.js';

// Turns "WEB-018 → WEB-024 scope..." into text with clickable IDs.
function Linked({ text }) {
  const parts = text.split(/(\b[A-Z]+-\d{3}\b)/g);
  return parts.map((p, i) => (/^[A-Z]+-\d{3}$/.test(p) && READY.has(p) ? <a key={i} className="idtag" href={href(`lesson/${p}/rev`)}>{p}</a> : p));
}

export default function Roadmap() {
  const [stage, setStage] = useState(1);
  const s = STAGES.find(x => x.n === stage);
  const projects = BY_CODE.get('PROJ').lessons;
  return (
    <div className="wrap roadmap">
      <nav className="crumbs"><a href={href('')}>Course</a> / Roadmap</nav>
      <h1>Roadmap &amp; projects</h1>

      <section className="block">
        <h2>🪜 Four stages</h2>
        <div className="seg" role="tablist">
          {STAGES.map(x => <button type="button" role="tab" aria-selected={x.n === stage} key={x.n} className={x.n === stage ? 'on' : ''} onClick={() => setStage(x.n)}>{x.n}. {x.name}</button>)}
        </div>
        <div className="stage-detail pop" key={stage}>
          <div><h3>You will be able to</h3><ul className="ticks">{s.obj.map((o, i) => <li key={i}>{o}</li>)}</ul></div>
          <div><h3>Before you start</h3><ul>{s.check.map((o, i) => <li key={i}>{o}</li>)}</ul>
            <h3>Assignments</h3><ul>{s.assign.map((o, i) => <li key={i}>{o}</li>)}</ul></div>
          <div><h3>Stage project</h3><p><Linked text={s.project} /></p><h3>Assessment</h3><p>{s.assess}</p></div>
        </div>
      </section>

      <section className="block">
        <h2>🎯 6-week interview plan</h2>
        <ol className="weeks">
          {WEEKS.map((w, i) => (
            <li key={i} style={{ '--d': i }}>
              <span className="wk">{w.w}</span><b>{w.t}</b>
              <ul>{w.items.map((it, j) => <li key={j}><Linked text={it} /></li>)}</ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h2>🛠 18 real-world projects</h2>
        <p className="muted">Each project covers: {CHECKLIST.join(' · ')}.</p>
        <div className="projects">
          {projects.map((p, i) => (
            <a key={p.id} className={`proj s${PROJ_STAGE[i]}`} href={READY.has(p.id) ? href(`lesson/${p.id}`) : undefined}>
              <span className="idtag">{p.id}</span>
              <b>{p.title}</b>
              <small>{p.objective}</small>
              <span className="proj-foot"><span className={`pill ${p.level.toLowerCase()}`}>{LEVEL[p.level]}</span> Stage {PROJ_STAGE[i]} · after {PROJ_AFTER[i]}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
