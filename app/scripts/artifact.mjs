// Turns dist/index.html into dist/artifact.html: the same page without <html>/<head>/<body>,
// because the artifact host adds its own skeleton. Assets stay as separate files in dist/assets.
import fs from 'node:fs';
const html = fs.readFileSync('dist/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const keep = head.split('\n').map(l => l.trim()).filter(l => l && !/<meta charset|<meta name="viewport"/.test(l));
const out = [...keep, '<meta name="claude:viewport-fit-sides" content="cover">', body.trim()].join('\n');
fs.writeFileSync('dist/artifact.html', out + '\n');
const assets = fs.readdirSync('dist/assets');
fs.writeFileSync('dist/artifact-files.json', JSON.stringify(Object.fromEntries(assets.map(a => [`assets/${a}`, `app/dist/assets/${a}`])), null, 1));
console.log(`artifact.html written; ${assets.length} asset files`);
