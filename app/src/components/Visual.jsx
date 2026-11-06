import { useEffect, useRef, useState } from 'react';
import { Md } from '../lib/md.jsx';

// Steps through 0..n-1 automatically once the diagram scrolls into view.
function useStepper(n, ms = 1700) {
  const ref = useRef(null);
  const [i, setI] = useState(n - 1); // complete at rest; replays from step 1 when scrolled into view
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; setI(0); setPlaying(true); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [n]);
  useEffect(() => {
    if (!playing) return;
    if (i >= n - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setI(x => x + 1), ms);
    return () => clearTimeout(t);
  }, [playing, i, n, ms]);
  const ctl = {
    i, n, playing,
    prev: () => { setPlaying(false); setI(x => Math.max(0, x - 1)); },
    next: () => { setPlaying(false); setI(x => Math.min(n - 1, x + 1)); },
    toggle: () => { if (i >= n - 1) { setI(0); setPlaying(true); } else setPlaying(p => !p); },
    jump: k => { setPlaying(false); setI(k); },
  };
  return [ref, ctl];
}

function Controls({ ctl }) {
  return (
    <div className="v-ctl">
      <button type="button" onClick={ctl.prev} disabled={ctl.i <= 0} aria-label="Previous step">←</button>
      <button type="button" className="play" onClick={ctl.toggle} aria-label={ctl.playing ? 'Pause' : 'Play'}>
        {ctl.playing ? '❚❚' : ctl.i >= ctl.n - 1 ? '↺' : '▶'}
      </button>
      <button type="button" onClick={ctl.next} disabled={ctl.i >= ctl.n - 1} aria-label="Next step">→</button>
      <span className="v-dots">
        {Array.from({ length: ctl.n }, (_, k) => (
          <button type="button" key={k} className={k === ctl.i ? 'on' : k < ctl.i ? 'past' : ''} onClick={() => ctl.jump(k)} aria-label={`Step ${k + 1}`} />
        ))}
      </span>
    </div>
  );
}

const st = (k, i) => (k === i ? 'on' : k < i ? 'past' : 'future');

function Flow({ v }) {
  const [ref, ctl] = useStepper(v.steps.length);
  const i = Math.max(0, ctl.i);
  const cur = v.steps[i];
  return (
    <div ref={ref}>
      <ol className="flow">
        {v.steps.map((s, k) => (
          <li key={k} className={st(k, ctl.i)} onClick={() => ctl.jump(k)}>
            <span className="n">{k + 1}</span>
            <span className="lbl"><Md text={s.label} /></span>
          </li>
        ))}
      </ol>
      <div className="v-detail" key={i}><b>{i + 1}. <Md text={cur.label} /></b> <Md text={cur.detail} /></div>
      <Controls ctl={ctl} />
    </div>
  );
}

function Cycle({ v }) {
  const n = v.steps.length;
  const [ref, ctl] = useStepper(n, 1900);
  const i = Math.max(0, ctl.i);
  const cur = v.steps[i];
  return (
    <div ref={ref} className="cycle-wrap">
      <div className="cycle">
        <svg viewBox="0 0 200 200" className="ring" aria-hidden="true">
          <circle cx="100" cy="100" r="78" />
          <circle cx="100" cy="100" r="78" className="arc" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - (ctl.i < 0 ? 0 : ((i + 0.5) / n) * 100)} />
        </svg>
        {v.steps.map((s, k) => {
          const a = (k / n) * 2 * Math.PI - Math.PI / 2;
          return (
            <button type="button" key={k} className={`node ${st(k, ctl.i)}`} onClick={() => ctl.jump(k)}
              style={{ left: `${50 + 39 * Math.cos(a)}%`, top: `${50 + 39 * Math.sin(a)}%` }}>
              <span className="n">{k + 1}</span><Md text={s.label} />
            </button>
          );
        })}
        <div className="hub" aria-hidden="true">↻</div>
      </div>
      <div className="v-detail" key={i}><b>{i + 1}. <Md text={cur.label} /></b> <Md text={cur.detail} /></div>
      <Controls ctl={ctl} />
    </div>
  );
}

function Compare({ v }) {
  const total = Math.max(v.left.points.length, v.right.points.length);
  const [ref, ctl] = useStepper(total, 1100);
  const side = (s, fallback) => (
    <div className={`cmp-side ${s.tone || fallback}`}>
      <h4><Md text={s.label} /></h4>
      <ul>{s.points.map((p, k) => <li key={k} className={k <= ctl.i ? 'in' : ''}><Md text={p} /></li>)}</ul>
    </div>
  );
  return (
    <div ref={ref}>
      <div className="cmpv">{side(v.left, 'neutral')}<div className="vs">vs</div>{side(v.right, 'neutral')}</div>
      <Controls ctl={ctl} />
    </div>
  );
}

function bfs(root) {
  const order = [];
  const q = [root];
  while (q.length) { const node = q.shift(); order.push(node); (node.children || []).forEach(c => q.push(c)); }
  return order;
}

function TreeNode({ node, shown, active }) {
  return (
    <li className={shown.has(node) ? 'in' : ''}>
      <span className={`tnode ${active === node ? 'on' : ''}`}>
        <Md text={node.label} />
        {node.note && <small><Md text={node.note} /></small>}
      </span>
      {node.children?.length > 0 && (
        <ul>{node.children.map((c, k) => <TreeNode key={k} node={c} shown={shown} active={active} />)}</ul>
      )}
    </li>
  );
}

function Tree({ v }) {
  const order = bfs(v.root);
  const [ref, ctl] = useStepper(order.length, 650);
  const shown = new Set(order.slice(0, ctl.i + 1));
  return (
    <div ref={ref}>
      <div className="tree"><ul><TreeNode node={v.root} shown={shown} active={order[ctl.i]} /></ul></div>
      <Controls ctl={ctl} />
    </div>
  );
}

function Layers({ v }) {
  const n = v.items.length;
  const [ref, ctl] = useStepper(n, 1200);
  // items are listed top first; the stack builds from the bottom up
  return (
    <div ref={ref}>
      <div className="layers">
        {v.items.map((it, k) => {
          const order = n - 1 - k;
          return (
            <div key={k} className={`layer ${order <= ctl.i ? 'in' : ''} ${order === ctl.i ? 'on' : ''}`} style={{ '--k': k, '--n': n }}>
              <b><Md text={it.label} /></b>
              {it.detail && <span><Md text={it.detail} /></span>}
            </div>
          );
        })}
      </div>
      <Controls ctl={ctl} />
    </div>
  );
}

function Timeline({ v }) {
  const n = v.frames.length;
  const [ref, ctl] = useStepper(n, 1800);
  const i = Math.max(0, ctl.i);
  const f = v.frames[i];
  return (
    <div ref={ref}>
      <div className="tl">
        <div className="tl-track"><div className="tl-fill" style={{ width: `${n > 1 ? (i / (n - 1)) * 100 : 100}%` }} /></div>
        <div className="tl-frames">
          {v.frames.map((fr, k) => (
            <button type="button" key={k} className={st(k, ctl.i)} onClick={() => ctl.jump(k)}>
              <span className="pin" /><Md text={fr.label} />
            </button>
          ))}
        </div>
      </div>
      <div className="tl-box" key={i}>
        <span className="tl-tag">now</span>
        <code><Md text={f.state} /></code>
        {f.note && <p><Md text={f.note} /></p>}
      </div>
      <Controls ctl={ctl} />
    </div>
  );
}

const TYPES = { flow: Flow, cycle: Cycle, compare: Compare, tree: Tree, layers: Layers, timeline: Timeline };
const ICON = { flow: '⟶', cycle: '↻', compare: '⇆', tree: '⌥', layers: '☰', timeline: '⏱' };

export default function Visual({ v }) {
  const C = v && TYPES[v.type];
  if (!C) return null;
  return (
    <figure className={`visual v-${v.type}`}>
      <figcaption><span className="v-icon" aria-hidden="true">{ICON[v.type]}</span> <Md text={v.title} /></figcaption>
      <C v={v} />
    </figure>
  );
}
