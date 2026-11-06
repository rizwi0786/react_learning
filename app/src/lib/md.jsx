// Inline markup for lesson strings: **bold**, `code`, and line breaks. Nothing else, no HTML.
export function Md({ text, as: Tag = 'span', className }) {
  if (text == null) return null;
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\n)/g;
  let last = 0, m, k = 0;
  const s = String(text);
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    if (t === '\n') out.push(<br key={k++} />);
    else if (t.startsWith('**')) out.push(<strong key={k++}>{t.slice(2, -2)}</strong>);
    else out.push(<code className="ic" key={k++}>{t.slice(1, -1)}</code>);
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return <Tag className={className}>{out}</Tag>;
}
