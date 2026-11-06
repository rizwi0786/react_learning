import { useState } from 'react';
import { Md } from '../lib/md.jsx';
import { CodeBlock } from './Code.jsx';
import { quizStore } from '../lib/store.js';

export function Quiz({ items, id }) {
  const [picked, setPicked] = useState({});
  const answered = Object.keys(picked).length;
  const score = items.filter((q, i) => picked[i] === q.answer).length;
  const pick = (qi, oi) => {
    if (picked[qi] !== undefined) return;
    const next = { ...picked, [qi]: oi };
    setPicked(next);
    if (Object.keys(next).length === items.length) {
      const s = items.filter((q, i) => next[i] === q.answer).length;
      quizStore.set(all => ({ ...all, [id]: Math.max(all[id] ?? 0, s) }));
    }
  };
  return (
    <div className="quiz">
      {items.map((q, qi) => {
        const p = picked[qi];
        return (
          <div className={`q ${p !== undefined ? (p === q.answer ? 'right' : 'wrong') : ''}`} key={qi}>
            <p className="q-text"><span className="q-n">Q{qi + 1}</span> <Md text={q.q} /></p>
            <div className="opts">
              {q.options.map((o, oi) => (
                <button type="button" key={oi} disabled={p !== undefined}
                  className={p === undefined ? '' : oi === q.answer ? 'correct' : oi === p ? 'picked' : 'off'}
                  onClick={() => pick(qi, oi)}>
                  <span className="opt-l">{String.fromCharCode(65 + oi)}</span> <Md text={o} />
                </button>
              ))}
            </div>
            {p !== undefined && <p className="why">{p === q.answer ? '✅ Correct. ' : '❌ Not quite. '}<Md text={q.why} /></p>}
          </div>
        );
      })}
      {answered === items.length && (
        <div className="score pop">
          <b>{score} / {items.length}</b> {score === items.length ? '🎉 Perfect!' : score >= items.length - 1 ? '👍 Nearly there' : '🔁 Re-read the key points and try again'}
          <button type="button" onClick={() => setPicked({})}>Retry</button>
        </div>
      )}
    </div>
  );
}

const LV = { basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced', tricky: 'Tricky' };

// Flip cards: question on the front, answer on the back. Tracks "got it" per session.
export function Flashcards({ items }) {
  const [flip, setFlip] = useState({});
  const [known, setKnown] = useState({});
  const [filter, setFilter] = useState('all');
  const levels = [...new Set(items.map(q => q.level))];
  const list = items.map((q, i) => ({ ...q, i })).filter(q => filter === 'all' || q.level === filter);
  return (
    <div>
      <div className="chips">
        <button type="button" className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>All {items.length}</button>
        {levels.map(l => <button type="button" key={l} className={`${filter === l ? 'on' : ''} lv-${l}`} onClick={() => setFilter(l)}>{LV[l]}</button>)}
        <span className="chips-note">{Object.values(known).filter(Boolean).length} / {items.length} known</span>
      </div>
      <div className="cards">
        {list.map(q => (
          <div key={q.i} className={`card ${flip[q.i] ? 'flipped' : ''} ${known[q.i] ? 'known' : ''}`}>
            <button type="button" className="card-inner" onClick={() => setFlip(f => ({ ...f, [q.i]: !f[q.i] }))} aria-label={flip[q.i] ? 'Show question' : 'Show answer'}>
              <span className="face front">
                <span className={`lv lv-${q.level}`}>{LV[q.level]}</span>
                <Md text={q.q} />
                <small>Tap to flip</small>
              </span>
              <span className="face back">
                <span className={`lv lv-${q.level}`}>Answer</span>
                <Md text={q.a} />
              </span>
            </button>
            {flip[q.i] && (
              <label className="gotit"><input type="checkbox" checked={!!known[q.i]} onChange={e => setKnown(k => ({ ...k, [q.i]: e.target.checked }))} /> I know this</label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Reveal({ label = 'Show answer', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`reveal ${open ? 'open' : ''}`}>
      <button type="button" className="reveal-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>{open ? 'Hide' : label}</button>
      {open && <div className="reveal-body">{children}</div>}
    </div>
  );
}

export function Mistakes({ items, lang }) {
  return (
    <div className="mistakes">
      {items.map((m, i) => (
        <div className="mistake" key={i}>
          <div className="mk-grid">
            <div><span className="tag bad">✗ Wrong</span><CodeBlock src={m.bad} lang={lang} tone="bad" compact /></div>
            <div><span className="tag good">✓ Right</span><CodeBlock src={m.good} lang={lang} tone="good" compact /></div>
          </div>
          <p className="mk-why">💡 <Md text={m.why} /></p>
        </div>
      ))}
    </div>
  );
}

const PL = { B: ['Beginner', 'b'], I: ['Intermediate', 'i'], C: ['Challenge', 'a'] };
export function Practice({ items, lang }) {
  return (
    <ol className="practice">
      {items.map((p, i) => (
        <li key={i}>
          <span className={`pill ${PL[p.level][1]}`}>{PL[p.level][0]}</span>
          <Md text={p.q} as="p" />
          <Reveal label="Show solution">
            <Md text={p.a} as="p" />
            {p.code && <CodeBlock src={p.code} lang={lang} compact />}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function Predict({ items, lang }) {
  return items.map((p, i) => (
    <div className="predict" key={i}>
      <CodeBlock src={p.code} lang={lang} compact />
      <Reveal label="🤔 What happens? Reveal">
        <p className="ans"><b>→ <Md text={p.answer} /></b></p>
        <Md text={p.why} as="p" />
      </Reveal>
    </div>
  ));
}

export function Debug({ items, lang }) {
  return items.map((d, i) => (
    <div className="predict" key={i}>
      <span className="tag bad">🐞 Find the bug</span>
      <CodeBlock src={d.code} lang={lang} tone="bad" compact />
      <Reveal label="Show the fix">
        <CodeBlock src={d.fix} lang={lang} tone="good" compact />
        <Md text={d.why} as="p" />
      </Reveal>
    </div>
  ));
}

export function Table({ t }) {
  return (
    <div className="tablewrap">
      <table>
        <thead><tr>{t.cols.map((c, i) => <th key={i}><Md text={c} /></th>)}</tr></thead>
        <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j}><Md text={c} /></th> : <td key={j}><Md text={c} /></td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}
