import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { announcement } from '../invitation.js';

const day = new Date(`${announcement.date}T00:00:00Z`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(announcement.date) || !Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== announcement.date) {
  throw new Error('올바른 결혼 날짜를 YYYY-MM-DD 형식으로 입력하세요.');
}
if (!announcement.groom.name || !announcement.bride.name) throw new Error('두 사람의 이름을 입력하세요.');
await mkdir('dist', { recursive: true });
for (const file of ['styles.css', 'app.js', 'confetti.js', 'invitation.js', 'assets']) await cp(file, `dist/${file}`, { recursive: true });
// Keep HTML, configuration, and animation in sync when a previous visit is cached.
const sources = await Promise.all(['app.js', 'confetti.js', 'invitation.js', 'styles.css'].map((file) => readFile(file, 'utf8')));
const version = createHash('sha256').update(sources.join('\n')).digest('hex').slice(0, 12);
await writeFile('dist/app.js', sources[0].replace(/from '(\.\/(?:invitation|confetti)\.js)'/g, (_, path) => `from '${path}?v=${version}'`));
const escape = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const title = escape(`${announcement.groom.name} · ${announcement.bride.name}, 부부가 됩니다`);
const description = escape(`${new Intl.DateTimeFormat('ko-KR', { timeZone: 'UTC', dateStyle: 'long' }).format(day)}, 소중한 분들께 저희의 결혼 소식을 전합니다. 별도의 결혼식은 진행하지 않습니다.`);
const html = (await readFile('index.html', 'utf8'))
  .replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`)
  .replace(/(<meta property="og:title" content=")[^"]*/, (_, prefix) => `${prefix}${title}`)
  .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, (_, prefix) => `${prefix}${description}`)
  .replace('href="./styles.css"', `href="./styles.css?v=${version}"`)
  .replace('src="./app.js"', `src="./app.js?v=${version}"`);
await writeFile('dist/index.html', html);
await writeFile('dist/.nojekyll', '');
console.log('Built wedding announcement in dist/');
