import { useMemo, useState, useEffect, useRef } from 'react';
import { highlight } from '../lib/highlight.js';
import { Md } from '../lib/md.jsx';

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="copy" type="button" onClick={async () => {
      try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200); } catch { /* clipboard blocked */ }
    }}>{ok ? '✓ Copied' : 'Copy'}</button>
  );
}

// Plain highlighted block. `mark` = set of 1-based line numbers to highlight.
export function CodeBlock({ src, lang = 'jsx', file, mark, tone, compact }) {
  const lines = useMemo(() => highlight(String(src ?? '').replace(/\s+$/, ''), lang), [src, lang]);
  return (
    <div className={`code ${tone || ''} ${compact ? 'compact' : ''}`}>
      {(file || !compact) && (
        <div className="code-bar">
          <span className="dots"><i /><i /><i /></span>
          <span className="file">{file || lang}</span>
          <CopyBtn text={src} />
        </div>
      )}
      <pre><code>{lines.map((ln, i) => (
        <span key={i} className={`ln ${mark?.has(i + 1) ? 'on' : ''} ${mark && mark.size && !mark.has(i + 1) ? 'dim' : ''}`}>
          <span className="no">{i + 1}</span>
          <span className="lc">{ln.length ? ln.map((t, j) => <span key={j} className={t.c ? 't-' + t.c : undefined}>{t.t}</span>) : ' '}</span>
        </span>
      ))}</code></pre>
    </div>
  );
}

function lineLabel(lines) {
  const sorted = [...lines].sort((a, b) => a - b);
  const contiguous = sorted.every((n, i) => i === 0 || n === sorted[i - 1] + 1);
  if (sorted.length === 1) return `line ${sorted[0]}`;
  return contiguous ? `lines ${sorted[0]}–${sorted.at(-1)}` : `lines ${sorted.join(', ')}`;
}

// Code with a step-by-step walkthrough: each step highlights lines and shows a note.
export function CodeWalk({ code }) {
  const steps = code.walk || [];
  const [step, setStep] = useState(-1); // -1 = overview (no highlight)
  const [playing, setPlaying] = useState(false);
  const timer = useRef();
  useEffect(() => {
    if (!playing) return;
    timer.current = setTimeout(() => {
      setStep(s => { if (s + 1 >= steps.length) { setPlaying(false); return s; } return s + 1; });
    }, step === -1 ? 300 : 2600);
    return () => clearTimeout(timer.current);
  }, [playing, step, steps.length]);
  const mark = step >= 0 ? new Set(steps[step].lines) : null;
  return (
    <div className="walk">
      <CodeBlock src={code.src} lang={code.lang} file={code.file} mark={mark} />
      <div className="walk-panel">
        <div className="walk-ctl">
          <button type="button" onClick={() => { setPlaying(false); setStep(s => Math.max(-1, s - 1)); }} disabled={step < 0} aria-label="Previous step">←</button>
          <button type="button" className="play" onClick={() => { if (step >= steps.length - 1) setStep(-1); setPlaying(p => !p); }}>
            {playing ? '❚❚ Pause' : step < 0 ? '▶ Walk me through' : step >= steps.length - 1 ? '↺ Replay' : '▶ Play'}
          </button>
          <button type="button" onClick={() => { setPlaying(false); setStep(s => Math.min(steps.length - 1, s + 1)); }} disabled={step >= steps.length - 1} aria-label="Next step">→</button>
          <span className="walk-count">{step < 0 ? `${steps.length} steps` : `Step ${step + 1} / ${steps.length}`}</span>
        </div>
        <div className="walk-steps">
          {steps.map((s, i) => (
            <button type="button" key={i} className={`walk-step ${i === step ? 'on' : ''} ${i < step ? 'past' : ''}`} onClick={() => { setPlaying(false); setStep(i); }}>
              <span className="badge">{i + 1}</span>
              <span><span className="lines">{lineLabel(s.lines)}</span> <Md text={s.note} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
