import { useEffect, useState } from 'react';
import { DAYS, BLOCKS, SPRINT_MIN, DRILLS, ANSWER_FRAME, RAPID, LAST_NIGHT } from '../data/sprint.js';
import { BY_ID } from '../lib/curriculum.js';
import { href } from '../lib/router.js';
import { useStore, useDone, toggleDone } from '../lib/store.js';
import { SEQ, sprintStore, patchSprint, itemHref } from '../lib/sprint.js';
import { Md } from '../lib/md.jsx';

const BREAK = 10, LUNCH = 45, LUNCH_AFTER = 4; // lunch after the 4th block of each day
const toMin = t => { const [h, m] = (t || '09:00').split(':').map(Number); return (h || 0) * 60 + (m || 0); };
const toRapid = () => document.getElementById('rapid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
const clock = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

// Builds the day's timetable: blocks with start/end, plus breaks between them.
function schedule(day, start) {
  let t = toMin(start);
  const out = [];
  BLOCKS.filter(b => b.day === day).forEach((b, k, arr) => {
    out.push({ kind: 'block', b, from: t, to: t + b.mins });
    t += b.mins;
    if (k < arr.length - 1) {
      const len = k === LUNCH_AFTER - 1 ? LUNCH : BREAK;
      out.push({ kind: 'break', len, from: t, lunch: len === LUNCH });
      t += len;
    }
  });
  return { rows: out, end: t };
}

function Ring({ value, total }) {
  const r = 38, c = 2 * Math.PI * r, p = total ? value / total : 0;
  return (
    <svg className="ring-p" width="108" height="108" viewBox="0 0 100 100" role="img" aria-label={`Sprint progress: ${value} of ${total}`}>
      <circle cx="50" cy="50" r={r} className="bg" />
      <circle cx="50" cy="50" r={r} className="fg" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
      <text x="50" y="48" textAnchor="middle">{Math.round(p * 100)}%</text>
      <text x="50" y="64" textAnchor="middle" className="sm">{value}/{total}</text>
    </svg>
  );
}

// ---------- focus timer (fixed bar at the bottom) ----------
function useTimer() {
  const [t, setT] = useState(null); // { label, total, left, endAt|null }
  useEffect(() => {
    if (!t?.endAt) return;
    const id = setInterval(() => {
      setT(x => {
        if (!x?.endAt) return x;
        const left = Math.max(0, Math.round((x.endAt - Date.now()) / 1000));
        return left === 0 ? { ...x, left: 0, endAt: null, over: true } : { ...x, left };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [t?.endAt]);
  return {
    t,
    start: (label, mins) => setT({ label, total: mins * 60, left: mins * 60, endAt: Date.now() + mins * 60000 }),
    toggle: () => setT(x => (x.endAt ? { ...x, endAt: null } : x.left > 0 ? { ...x, endAt: Date.now() + x.left * 1000 } : x)),
    add: m => setT(x => ({ ...x, over: false, left: x.left + m * 60, total: x.total + m * 60, endAt: x.endAt ? x.endAt + m * 60000 : x.left === 0 ? Date.now() + m * 60000 : null })),
    stop: () => setT(null),
  };
}

function TimerBar({ timer }) {
  const { t } = timer;
  if (!t) return null;
  const mm = String(Math.floor(t.left / 60)).padStart(2, '0'), ss = String(t.left % 60).padStart(2, '0');
  return (
    <div className={`sp-timer ${t.over ? 'over' : ''}`} role="timer" aria-live="off">
      <div className="sp-timer-fill" style={{ width: `${100 - (t.left / t.total) * 100}%` }} />
      <div className="wrap sp-timer-in">
        <span className="sp-timer-lbl">{t.over ? '⏰ Time’s up:' : t.endAt ? '⏱ Focus:' : '⏸ Paused:'} <b>{t.label}</b></span>
        <span className="sp-timer-clock">{mm}:{ss}</span>
        <span className="sp-timer-btns">
          {!t.over && <button type="button" className="btn" onClick={timer.toggle}>{t.endAt ? 'Pause' : 'Resume'}</button>}
          <button type="button" className="btn" onClick={() => timer.add(5)}>+5 min</button>
          <button type="button" className="btn" onClick={timer.stop} aria-label="Stop timer">✕</button>
        </span>
      </div>
    </div>
  );
}

// ---------- one block ----------
function Block({ row, idx, doneD, doneR, say, timer }) {
  const { b, from, to } = row;
  const isDone = x => (x.mode === 'r' ? doneR : doneD).includes(x.id);
  const items = b.items.map(([id, mode]) => ({ id, mode }));
  const n = items.filter(isDone).length;
  const sayDone = b.say.filter((_, k) => say.includes(`${b.id}:${k}`)).length;
  const complete = b.drills ? sayDone === b.say.length : items.length > 0 && n === items.length;
  const firstOpen = items.find(x => !isDone(x));
  return (
    <li className={`sp-block ${complete ? 'complete' : ''}`} id={b.id} style={{ '--d': idx }}>
      <div className="sp-time"><b>{clock(from)}</b><span>{clock(to)}</span></div>
      <div className="sp-card">
        <header className="sp-head">
          <span className="sp-icon" aria-hidden="true">{complete ? '✓' : b.icon}</span>
          <div className="sp-ttl">
            <h3>{b.title}</h3>
            <p>{b.goal}</p>
          </div>
          <span className="pill ghost">⏱ {b.mins} min</span>
        </header>
        {items.length > 0 && (
          <>
            <div className="sp-bar" aria-hidden="true"><span style={{ width: `${(n / items.length) * 100}%` }} /></div>
            <ul className="sp-items">
              {items.map(x => {
                const l = BY_ID.get(x.id), d = isDone(x);
                return (
                  <li key={x.id} className={d ? 'done' : ''}>
                    <input type="checkbox" id={`sp-${b.id}-${x.id}`} checked={d} onChange={e => toggleDone(x.mode, x.id, e.target.checked)} aria-label={`Done: ${l.title}`} />
                    <a href={href(itemHref(x))} onClick={() => patchSprint({ on: true })}>
                      <span className="idtag">{x.id}</span> <span className="sp-it">{l.title}</span>
                    </a>
                    <span className={`pill ${x.mode === 'r' ? 'sp-rev' : 'sp-learn'}`}>{x.mode === 'r' ? '🎯 Interview' : '📘 Learn'} · {SPRINT_MIN[x.mode]}m</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {b.drills && <Drills timer={timer} />}
        <div className="sp-say">
          <span className="sp-say-h">Say it out loud ({sayDone}/{b.say.length})</span>
          {b.say.map((s, k) => {
            const key = `${b.id}:${k}`, on = say.includes(key);
            return (
              <button type="button" key={k} className={`sp-say-chip ${on ? 'on' : ''}`} aria-pressed={on}
                onClick={() => patchSprint(st => ({ say: on ? st.say.filter(x => x !== key) : [...st.say, key] }))}>
                {on ? '✓' : '○'} {s}
              </button>
            );
          })}
        </div>
        <div className="sp-actions">
          {firstOpen && <a className="btn primary" href={href(itemHref(firstOpen))} onClick={() => patchSprint({ on: true })}>▶ {n ? 'Continue' : 'Start'} block</a>}
          <button type="button" className="btn" onClick={() => timer.start(b.title, b.mins)}>⏱ Start {b.mins}-min timer</button>
          {b.drills && <button type="button" className="btn" onClick={toRapid}>⚡ Rapid-fire</button>}
        </div>
      </div>
    </li>
  );
}

function Drills({ timer }) {
  return (
    <div className="sp-drills">
      {DRILLS.map(d => (
        <div className="sp-drill" key={d.title}>
          <div className="sp-drill-h"><b>{d.title}</b><span className="pill i">{d.mins} min</span></div>
          <p>{d.spec}</p>
          <p className="muted"><b>They check:</b> {d.tests}</p>
          <div className="sp-drill-f">
            <button type="button" className="btn" onClick={() => timer.start(`Drill: ${d.title}`, d.mins)}>⏱ Start</button>
            <a href={href(`lesson/${d.link}`)} className="idtag">{d.link}</a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- rapid-fire ----------
function Rapid({ rapid }) {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(() => new Set());
  const ok = Object.values(rapid).filter(v => v === 'ok').length;
  const list = RAPID.map((q, i) => ({ q, i })).filter(({ i }) =>
    filter === 'all' ? true : filter === 'todo' ? !rapid[i] : rapid[i] === 'again');
  const mark = (i, v) => patchSprint(s => ({ rapid: { ...s.rapid, [i]: v } }));
  const flip = i => setOpen(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <section className="block" id="rapid">
      <h2>⚡ Rapid-fire: {RAPID.length} questions</h2>
      <p className="muted">Say your answer out loud first, then reveal. Use this in the last hour and on interview morning.</p>
      <div className="chips">
        {[['all', 'All'], ['todo', 'Not tried'], ['again', 'Need again']].map(([k, l]) => (
          <button type="button" key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>
        ))}
        <span className="chips-note">{ok}/{RAPID.length} confident</span>
        {Object.keys(rapid).length > 0 && <button type="button" onClick={() => patchSprint({ rapid: {} })}>Reset</button>}
      </div>
      {list.length === 0 && <p className="muted">Nothing here. {filter === 'again' ? 'No questions marked “again”.' : 'You have tried them all.'}</p>}
      <ol className="sp-rapid">
        {list.map(({ q: [question, answer, link], i }) => (
          <li key={i} className={`${rapid[i] || ''} ${open.has(i) ? 'open' : ''}`}>
            <button type="button" className="sp-q" onClick={() => flip(i)} aria-expanded={open.has(i)}>
              <span className="sp-qn">{i + 1}</span><span>{question}</span><span className="sp-chev" aria-hidden="true">▾</span>
            </button>
            {open.has(i) && (
              <div className="sp-a">
                <p><Md text={answer} /></p>
                <div className="sp-a-f">
                  <button type="button" className={`btn ${rapid[i] === 'ok' ? 'primary' : ''}`} onClick={() => mark(i, 'ok')}>✓ Got it</button>
                  <button type="button" className={`btn ${rapid[i] === 'again' ? 'danger' : ''}`} onClick={() => mark(i, 'again')}>↺ Again</button>
                  <a className="idtag" href={href(`lesson/${link}/rev`)}>Deeper: {link}</a>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------- page ----------
export default function Sprint() {
  const sp = useStore(sprintStore);
  const doneD = useDone('d'), doneR = useDone('r');
  const timer = useTimer();
  const isDone = x => (x.mode === 'r' ? doneR : doneD).includes(x.id);
  const nDone = SEQ.filter(isDone).length;
  const next = SEQ.find(x => !isDone(x));
  const [day, setDay] = useState(next ? next.block.day : 1);
  const start = sp.start || { 1: '09:00', 2: '09:00' };
  const { rows, end } = schedule(day, start[day]);
  const D = DAYS[day - 1];
  const dayItems = SEQ.filter(x => x.block.day === day);

  return (
    <div className="wrap sprint">
      <nav className="crumbs"><a href={href('')}>Course</a> / Interview sprint</nav>

      <section className="sp-hero">
        <div>
          <span className="sp-kicker">Interview in 2 days?</span>
          <h1>15-hour <em>React sprint</em></h1>
          <p className="lead">Two days of 7.5 hours each. {SEQ.length} hand-picked topics, mostly the ones interviewers ask most, in the order that builds on itself. Each topic opens in the right tab: <b>🎯 Interview</b> for a quick revision (~6 min) or <b>📘 Learn</b> for the core ideas (~12 min).</p>
          <div className="hero-cta">
            {next
              ? <a className="btn primary" href={href(itemHref(next))} onClick={() => patchSprint({ on: true })}>▶ {nDone ? 'Continue' : 'Start'}: {next.id} {BY_ID.get(next.id).title}</a>
              : <button type="button" className="btn primary" onClick={toRapid}>🎉 All topics done: go to rapid-fire</button>}
            <button type="button" className="btn" onClick={toRapid}>⚡ Rapid-fire questions</button>
          </div>
        </div>
        <div className="hero-progress">
          <Ring value={nDone} total={SEQ.length} />
          <small className="muted">topics done</small>
        </div>
      </section>

      <section className="block">
        <h2>🗣 Answer every question in 4 beats</h2>
        <ol className="sp-frame">
          {ANSWER_FRAME.map(([h, t], k) => <li key={h} style={{ '--d': k }}><b>{h}</b><span>{t}</span></li>)}
        </ol>
      </section>

      <section className="block">
        <div className="sp-dayhead">
          <div className="seg" role="tablist">
            {DAYS.map(d => {
              const its = SEQ.filter(x => x.block.day === d.n), k = its.filter(isDone).length;
              return (
                <button type="button" role="tab" aria-selected={d.n === day} key={d.n} className={d.n === day ? 'on' : ''} onClick={() => setDay(d.n)}>
                  Day {d.n}: {d.title} <small>{k}/{its.length}</small>
                </button>
              );
            })}
          </div>
          <label className="sp-start" htmlFor="sp-start">Start at
            <input id="sp-start" type="time" value={start[day]} onChange={e => patchSprint(s => ({ start: { ...(s.start || {}), [day]: e.target.value || '09:00' } }))} />
            <span className="muted">→ done by <b>{clock(end)}</b></span>
          </label>
        </div>
        <p className="sp-daygoal">🎯 <b>Goal:</b> {D.goal} <span className="muted">({dayItems.filter(isDone).length}/{dayItems.length} topics · 7.5 h study + breaks)</span></p>

        <ol className="sp-plan" key={day}>
          {rows.map((r, k) => r.kind === 'block'
            ? <Block key={r.b.id} row={r} idx={k} doneD={doneD} doneR={doneR} say={sp.say || []} timer={timer} />
            : (
              <li key={`br${k}`} className={`sp-break ${r.lunch ? 'lunch' : ''}`}>
                <div className="sp-time"><b>{clock(r.from)}</b></div>
                <div>{r.lunch ? '🍽 Lunch' : '☕ Break'}: {r.len} min. {r.lunch ? 'Walk, eat, no screens.' : 'Stand up, water, look away from the screen.'}</div>
              </li>
            ))}
        </ol>
        {day === 1 && <button type="button" className="btn" onClick={() => { setDay(2); window.scrollTo({ top: 0 }); }}>Day 2 plan →</button>}
      </section>

      <Rapid rapid={sp.rapid || {}} />

      <section className="block">
        <h2>🌙 Night before &amp; interview morning</h2>
        <ul className="ticks">{LAST_NIGHT.map(t => <li key={t}>{t}</li>)}</ul>
      </section>

      <TimerBar timer={timer} />
    </div>
  );
}
