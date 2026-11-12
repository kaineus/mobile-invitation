import { announcement as data } from './invitation.js';
import { playWelcomeConfetti } from './confetti.js';

const $ = (selector) => document.querySelector(selector);
const text = (selector, value) => document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
const make = (tag, className, value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
};
const [year, month, day] = data.date.split('-').map(Number);
const date = new Date(`${data.date}T00:00:00+09:00`);
const dateLabel = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
}).format(date);
const couple = `${data.groom.name} · ${data.bride.name}`;

document.title = `${couple}, 부부가 됩니다`;
text('#headline', data.headline);
text('#subline', data.subline);
text('[data-date]', dateLabel);
text('#letter-message', data.message.join('\n'));
text('[data-signature]', `${couple} 드림`);
text('#english-names', `${data.groom.english} & ${data.bride.english}`);
text('#dawn', data.dawn);
text('#closing-title', data.closing.title);
text('#closing-line', data.closing.line);
for (const role of ['groom', 'bride']) {
  text(`[data-${role}]`, data[role].name);
  text(`[data-${role}-english]`, data[role].english);
  if (data[role].family) {
    text(`[data-${role}-family]`, data[role].family);
    $(`[data-${role}-family]`).hidden = false;
  }
}

// Photos: every id has a 640px and a 1280px WebP (see scripts/photos.mjs).
const photoUrl = (id, width) => `./assets/photos/${id}-${width}.webp`;
function photoImage(photo, sizes) {
  const img = new Image();
  img.alt = photo.alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.sizes = sizes;
  img.srcset = `${photoUrl(photo.id, 640)} 640w, ${photoUrl(photo.id, 1280)} 1280w`;
  img.src = photoUrl(photo.id, 1280);
  return img;
}
const album = [];
function photoButton(photo, className, sizes) {
  const index = album.push(photo) - 1;
  const button = make('button', className);
  const img = photoImage(photo, sizes);
  button.type = 'button';
  img.addEventListener('error', () => {
    button.disabled = true;
    button.classList.add('photo-missing');
    button.replaceChildren(make('span', '', '사진을 불러오지 못했습니다'));
  });
  button.append(img);
  button.addEventListener('click', () => openViewer(index));
  return button;
}
const fullWidth = '(min-width: 480px) 480px, 100vw';
const stripWidth = '(min-width: 480px) 260px, 54vw';
const fillStrip = (strip, photos) => strip.append(...photos.map((photo) => photoButton(photo, 'strip-photo', stripWidth)));

$('#intro-photo').replaceWith(photoButton(data.intro.photo, 'lead lead-intro', fullWidth));
fillStrip($('#intro-strip'), data.intro.photos);
for (const chapter of data.chapters) {
  const article = make('article', `chapter chapter-${chapter.tone}`);
  const strip = make('div', 'strip');
  strip.setAttribute('role', 'group');
  strip.setAttribute('aria-label', `${chapter.time}의 사진`);
  article.append(
    make('h3', 'chapter-time', chapter.time),
    make('p', 'chapter-line', chapter.line),
    photoButton(chapter.lead, chapter.lead.wide ? 'lead lead-wide' : 'lead', fullWidth),
    strip
  );
  fillStrip(strip, chapter.photos);
  $('#chapters').append(article);
}
$('#closing-photo').replaceWith(photoImage(data.closing, fullWidth));

// Full-screen viewer: arrows, swipe, and keyboard move through every photo in page order.
const viewer = $('#viewer');
const viewerImage = $('#viewer-image');
let current = 0;
function showPhoto(index) {
  current = (index + album.length) % album.length;
  viewerImage.src = photoUrl(album[current].id, 1280);
  viewerImage.alt = album[current].alt;
  text('#viewer-count', `${current + 1} / ${album.length}`);
}
function openViewer(index) {
  showPhoto(index);
  viewer.showModal();
  document.documentElement.classList.add('viewer-open');
}
viewer.addEventListener('close', () => {
  document.documentElement.classList.remove('viewer-open');
  viewerImage.removeAttribute('src');
});
viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPhoto(current - 1);
  if (event.key === 'ArrowRight') showPhoto(current + 1);
});
$('#viewer-close').addEventListener('click', () => viewer.close());
$('#viewer-prev').addEventListener('click', () => showPhoto(current - 1));
$('#viewer-next').addEventListener('click', () => showPhoto(current + 1));
let touchStart;
viewer.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0]; }, { passive: true });
viewer.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.clientX;
  const dy = event.changedTouches[0].clientY - touchStart.clientY;
  touchStart = undefined;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showPhoto(current + (dx < 0 ? 1 : -1));
}, { passive: true });

// Calendar of the month, with the day itself marked by a heart balloon.
const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
let row;
for (let cell = 0; cell < Math.ceil((firstWeekday + daysInMonth) / 7) * 7; cell++) {
  if (cell % 7 === 0) { row = make('tr'); $('#calendar-days').append(row); }
  const td = make('td');
  const value = cell - firstWeekday + 1;
  if (value > 0 && value <= daysInMonth) {
    const span = make('span', value === day ? 'wedding-day' : '', value);
    if (value === day) span.setAttribute('aria-label', `${month}월 ${day}일, 부부가 되는 날`);
    td.append(span);
  }
  row.append(td);
}
function updateCountdown() {
  const todayParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric'
  }).formatToParts(new Date()).map(({ type, value }) => [type, value]));
  const difference = Math.round((Date.UTC(year, month - 1, day) - Date.UTC(+todayParts.year, +todayParts.month - 1, +todayParts.day)) / 86400000);
  const node = $('#countdown');
  if (difference > 0) {
    node.replaceChildren(document.createTextNode('부부로 함께할 날까지 '), make('strong', '', difference), document.createTextNode('일'));
  } else if (difference === 0) {
    node.textContent = '오늘, 저희 부부가 되었습니다.';
  } else {
    node.replaceChildren(document.createTextNode('부부로 함께한 지 '), make('strong', '', -difference + 1), document.createTextNode('일째'));
  }
}
updateCountdown();
setInterval(updateCountdown, 60000);

// RFC 5545: all-day event, exclusive end date, UTF-8 lines folded at 75 octets.
const icsEscape = (value) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
function foldLine(line) {
  let folded = '', bytes = 0;
  for (const character of line) {
    const size = new TextEncoder().encode(character).length;
    if (bytes + size > 75) { folded += '\r\n '; bytes = 1; }
    folded += character;
    bytes += size;
  }
  return folded;
}
$('#save-calendar').addEventListener('click', () => {
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10).replace(/-/g, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Announcement//KO',
    'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${data.date}-${encodeURIComponent(couple)}@wedding-announcement`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${data.date.replace(/-/g, '')}`,
    `DTEND;VALUE=DATE:${nextDay}`,
    `SUMMARY:${icsEscape(`${couple} 결혼기념일`)}`,
    `DESCRIPTION:${icsEscape('두 사람이 부부가 되는 날입니다. 별도의 결혼식은 진행하지 않습니다.')}`,
    'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR'
  ];
  const url = URL.createObjectURL(new Blob([lines.map(foldLine).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' }));
  const a = make('a');
  a.href = url;
  a.download = 'our-anniversary.ics';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  toast('내려받은 기념일 파일을 캘린더 앱에서 열어 주세요.');
});

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  text('#toast', message);
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
}
async function copy(value, message) {
  try {
    await navigator.clipboard.writeText(value);
    toast(message);
  } catch {
    $('#copy-value').value = value;
    $('#copy-dialog').showModal();
    $('#copy-value').select();
  }
}
$('#close-copy').addEventListener('click', () => $('#copy-dialog').close());
function pageUrl() {
  const url = new URL(window.location.href);
  url.hash = '';
  return url.href;
}
$('#copy-link').addEventListener('click', () => copy(pageUrl(), '링크를 복사했습니다.'));
$('#share').addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text: '소중한 분들께 저희의 결혼 소식을 전합니다.', url: pageUrl() });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  await copy(pageUrl(), '링크를 복사했습니다.');
});

// Optional: accounts appear only when invitation.js lists them.
for (const account of data.accounts ?? []) {
  const item = make('li');
  const copyButton = make('button', 'account-copy', '계좌번호 복사');
  copyButton.type = 'button';
  copyButton.addEventListener('click', () => copy(`${account.bank} ${account.number}`, '계좌번호를 복사했습니다.'));
  item.append(make('span', 'account-label', account.label), make('span', 'account-number', `${account.bank} ${account.number}`), copyButton);
  $('#account-list').append(item);
  $('#accounts').hidden = false;
}

// Greet with confetti once the bowing photo is on screen, not over an empty sky.
if (data.welcomeConfetti !== false) {
  const cover = $('#cover-photo');
  const loaded = cover.complete ? Promise.resolve() : new Promise((resolve) => {
    cover.addEventListener('load', resolve, { once: true });
    cover.addEventListener('error', resolve, { once: true });
  });
  Promise.race([loaded, new Promise((resolve) => setTimeout(resolve, 2500))]).then(() => {
    if (window.scrollY < window.innerHeight / 2) playWelcomeConfetti();
  });
}
