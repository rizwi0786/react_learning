// Small, dependency-free highlighter. Returns lines: [[{t: text, c: class}, ...], ...].
const KW = new Set('import export default from as const let var function return if else for while do switch case break continue new class extends super this typeof instanceof in of await async yield try catch finally throw delete void null undefined true false interface type enum implements readonly public private protected static declare keyof satisfies'.split(' '));
const RULES = {
  js: [
    ['com', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['str', /`(?:\[\s\S]|\$\{[^}]*\}|[^`\])*`|"(?:\.|[^"\\n])*"|'(?:\.|[^'\\n])*'/y],
    ['tag', /<\/?[A-Za-z][\w.:-]*|\/?>/y],
    ['num', /\b\d[\d_.]*(?:n|px|ms|s|%)?\b/y],
    ['id', /[A-Za-z_$][\w$]*/y],
    ['pun', /[{}()[\];,.=+\-*/%!?:&|^~<>@#]+/y],
    ['ws', /\s+/y],
  ],
  html: [
    ['com', /<!--[\s\S]*?-->/y],
    ['tag', /<\/?[A-Za-z][\w-]*|\/?>/y],
    ['str', /"[^"]*"|'[^']*'/y],
    ['attr', /[A-Za-z-:@]+(?==)/y],
    ['ws', /\s+/y],
    ['txt', /[^<"'\s]+/y],
  ],
  css: [
    ['com', /\/\*[\s\S]*?\*\//y],
    ['str', /"[^"]*"|'[^']*'/y],
    ['attr', /[a-z-]+(?=\s*:)/y],
    ['num', /-?\d[\d.]*(?:px|rem|em|%|vh|vw|fr|s|ms|deg)?/y],
    ['kw', /@[a-z-]+|!important/y],
    ['ws', /\s+/y],
    ['txt', /[^\s"';:{}]+|[;:{}]/y],
  ],
  bash: [
    ['com', /#[^\n]*/y],
    ['str', /"[^"]*"|'[^']*'/y],
    ['kw', /\b(?:npm|npx|pnpm|yarn|node|git|cd|mkdir|curl|vite|tsc)\b/y],
    ['attr', /--?[\w-]+/y],
    ['ws', /\s+/y],
    ['txt', /[^\s"'#]+/y],
  ],
};
RULES.json = RULES.js; RULES.ts = RULES.js; RULES.tsx = RULES.js; RULES.jsx = RULES.js; RULES.text = [['txt', /[\s\S]+/y]];

export function highlight(src, lang = 'js') {
  const rules = RULES[lang] || RULES.js;
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    let hit = false;
    for (const [c, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(src);
      if (m && m[0].length) {
        let cls = c;
        if (c === 'id') {
          const w = m[0];
          cls = KW.has(w) ? 'kw' : /^[A-Z]/.test(w) ? 'typ' : /^use[A-Z]/.test(w) ? 'hook' : src[i + w.length] === '(' ? 'fn' : '';
        }
        if (c === 'ws' || c === 'txt' || c === 'pun') cls = c === 'pun' ? 'pun' : '';
        tokens.push({ t: m[0], c: cls });
        i += m[0].length; hit = true; break;
      }
    }
    if (!hit) { tokens.push({ t: src[i], c: '' }); i++; }
  }
  const lines = [[]];
  for (const tok of tokens) {
    const parts = tok.t.split('\n');
    parts.forEach((p, j) => { if (j > 0) lines.push([]); if (p) lines[lines.length - 1].push({ t: p, c: tok.c }); });
  }
  return lines;
}
