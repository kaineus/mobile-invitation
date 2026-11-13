import { announcement as data } from './invitation.js';
import { playWelcomeConfetti, studioConfetti, skyConfetti } from './confetti.js';
import { motion, onEnter, releaseBalloons, addEffect, drift } from './motion.js';

// Always open at the top, where the greeting is, even on a reload or when coming back to the tab's
// history. (index.html also turns off the browser's own scroll restoration as early as it can.)
function toTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
toTop();
window.addEventListener('pageshow', (event) => { if (event.persisted) toTop(); });

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
text('[data-date]', dateLabel);
text('[data-signature]', `${couple} 드림`);
text('#english-names', `${data.groom.english} & ${data.bride.english}`);
text('#closing-title', data.closing.title);
text('#closing-line', data.closing.line);
// Each line of the headline and the letter is its own piece so it can arrive on its own beat.
$('#headline').replaceChildren(...data.headline.flatMap((line, index) => {
  const span = make('span', '', line);
  span.style.setProperty('--i', index);
  return index ? [document.createTextNode(' '), span] : [span];
}));
$('#letter-message').replaceChildren(...data.message.map((line, index) => {
  const span = make('span', 'rise', line || '\u00a0');
  span.style.setProperty('--i', index + 1);
  return span;
}));

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
const halfWidth = '(min-width: 480px) 240px, 50vw';
const stripWidth = '(min-width: 480px) 260px, 54vw';
function makeStrip(photos, label, speed) {
  const strip = make('div', 'strip');
  strip.setAttribute('role', 'group');
  strip.setAttribute('aria-label', label);
  strip.append(...photos.map((photo) => photoButton(photo, 'strip-photo', stripWidth)));
  drift(strip, speed);
  return strip;
}

for (const role of ['bride', 'groom']) {
  text(`[data-${role}]`, data[role].name);
  text(`[data-${role}-english]`, data[role].english);
  if (data[role].family) {
    text(`[data-${role}-family]`, data[role].family);
    $(`[data-${role}-family]`).hidden = false;
  }
}

// Introductions: the portraits turn over to the same two people in sunglasses, on a tap
// and once by themselves shortly after they come into view. The two always change together,
// because one person alone in sunglasses just looks odd.
function portrait(person) {
  if (!person.shades) return { button: photoButton(person.portrait, 'portrait-photo', halfWidth), wear() {} };
  const button = make('button', 'portrait-photo');
  const shades = photoImage(person.shades, halfWidth);
  shades.className = 'shades';
  button.type = 'button';
  button.append(photoImage(person.portrait, halfWidth), shades);
  const wear = (on) => {
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', on);
    button.setAttribute('aria-label', `${(on ? person.shades : person.portrait).alt}. 누르면 두 사람 사진이 함께 바뀝니다`);
    // Restart the turn even when it is already mid-way.
    button.classList.remove('turn');
    void button.offsetWidth;
    button.classList.add('turn');
  };
  wear(false);
  button.classList.remove('turn');
  return { button, wear };
}
const portraits = ['bride', 'groom'].map((role) => {
  const made = portrait(data[role]);
  $(`#portrait-${role}`).replaceWith(made.button);
  return made;
});
let wearing = false;
function wearTogether(on, first = portraits[0]) {
  wearing = on;
  first.wear(on);
  // The other follows a beat later, like a glance and then "me too".
  for (const other of portraits) if (other !== first) setTimeout(() => other.wear(wearing), 260);
}
for (const made of portraits) made.button.addEventListener('click', () => wearTogether(!wearing, made));
onEnter($('.portraits'), 0.6, () => setTimeout(() => wearTogether(true), 1300));

if (data.intro.lead) {
  const lead = photoButton(data.intro.lead, 'lead', fullWidth);
  onEnter(lead, 0.9);
  $('#intro-lead').replaceWith(lead);
}
$('#intro-strip').replaceWith(makeStrip(data.intro.photos, '사진관에서 찍은 사진', 20));

// Each group: one large photo with its own small effect, two prints tossed below it, then a drifting row.
data.gallery.forEach((group, index) => {
  const block = make('div', 'gallery-group');
  const lead = photoButton(group.lead, group.lead.wide ? 'lead lead-wide' : 'lead', fullWidth);
  addEffect(lead, group.lead.effect, group.lead.at);
  onEnter(lead, 0.9);
  const prints = make('div', 'prints');
  prints.append(...group.photos.slice(0, 2).map((photo) => photoButton(photo, 'print', halfWidth)));
  onEnter(prints, 0.82);
  block.append(lead, prints, makeStrip(group.photos.slice(2), `사진 묶음 ${index + 1}`, index % 2 ? 24 : -24));
  $('#gallery').append(block);
});
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

// Calendar of the month. The day itself is a heart balloon; tapping it lets more balloons go.
const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
let row;
for (let cell = 0; cell < Math.ceil((firstWeekday + daysInMonth) / 7) * 7; cell++) {
  if (cell % 7 === 0) { row = make('tr'); $('#calendar-days').append(row); }
  const td = make('td');
  const value = cell - firstWeekday + 1;
  if (value === day) {
    const heart = make(motion ? 'button' : 'span', 'wedding-day', value);
    heart.setAttribute('aria-label', `${month}월 ${day}일, 부부가 되는 날`);
    if (motion) {
      heart.type = 'button';
      heart.addEventListener('click', () => releaseBalloons(7));
    }
    td.append(heart);
  } else if (value > 0 && value <= daysInMonth) {
    td.append(make('span', '', value));
  }
  row.append(td);
}

// Counts down to midnight in Korea, wherever the visitor is, then counts the days since.
const units = Object.fromEntries([...document.querySelectorAll('#ticker [data-unit]')].map((node) => [node.dataset.unit, node]));
const pad = (value) => String(value).padStart(2, '0');
function updateCountdown() {
  const remaining = date.getTime() - Date.now();
  const label = $('#countdown');
  if (remaining > 0) {
    const seconds = Math.floor(remaining / 1000);
    const days = Math.floor(seconds / 86400);
    units.days.textContent = days;
    units.hours.textContent = pad(Math.floor(seconds / 3600) % 24);
    units.minutes.textContent = pad(Math.floor(seconds / 60) % 60);
    units.seconds.textContent = pad(seconds % 60);
    const spoken = `부부가 되는 날까지 ${days + 1}일`;
    if (label.dataset.spoken !== spoken) {
      label.dataset.spoken = spoken;
      label.replaceChildren(document.createTextNode('부부가 되는 날까지'), make('span', 'sr-only', ` ${days + 1}일`));
    }
    return;
  }
  $('#ticker').hidden = true;
  const since = Math.floor(-remaining / 86400000);
  label.textContent = since === 0 ? '오늘, 저희 부부가 되었습니다.' : `부부로 함께한 지 ${since + 1}일째`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

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

// Two links, one page: the accounts appear only when the address carries ?mode=<gift.mode>.
const gift = data.gift ?? {};
if (gift.accounts?.length && new URLSearchParams(window.location.search).get('mode') === gift.mode) {
  text('#gift-title', gift.title);
  text('#gift-note', gift.note);
  for (const account of gift.accounts) {
    const item = make('li');
    const copyButton = make('button', 'account-copy', '복사');
    copyButton.type = 'button';
    copyButton.setAttribute('aria-label', `${account.label} 계좌번호 복사`);
    copyButton.addEventListener('click', () => copy(`${account.bank} ${account.number}`, '계좌번호를 복사했습니다.'));
    item.append(
      make('span', 'account-label', account.label),
      make('span', 'account-number', `${account.bank} ${account.number}`),
      copyButton
    );
    if (account.holder) item.append(make('span', 'account-holder', `예금주 ${account.holder}`));
    $('#account-list').append(item);
  }
  $('#gift').hidden = false;
}

// Sections arrive as they are scrolled to. The day sends up balloons; the last bow gets its own confetti.
const confetti = data.welcomeConfetti !== false;
for (const node of document.querySelectorAll('.reveal')) {
  if (node.matches('.date')) onEnter(node, 0.7, () => setTimeout(() => releaseBalloons(6), 900));
  else if (node.matches('.closing')) onEnter(node, 0.5, () => { if (confetti && !$('.welcome-confetti')) playWelcomeConfetti(skyConfetti); });
  else onEnter(node, node.matches('.letter') ? 0.72 : 0.86);
}

// Opening: confetti, round like the pieces in the photo, goes off the moment the page opens,
// and the greeting is written above the two as soon as the brush lettering has loaded.
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const cover = $('#cover-photo');
const photoReady = cover.complete ? Promise.resolve() : new Promise((resolve) => {
  cover.addEventListener('load', resolve, { once: true });
  cover.addEventListener('error', resolve, { once: true });
});
const letteringReady = document.fonts?.load ? document.fonts.load('1em "Nanum Brush Script"', data.headline.join('')).catch(() => {}) : Promise.resolve();
if (confetti) {
  // The burst belongs with the photo, so give the photo a blink to arrive, but no longer than that.
  // A page opened in a background tab saves it for when the tab is first looked at.
  const seen = document.hidden
    ? new Promise((resolve) => document.addEventListener('visibilitychange', resolve, { once: true }))
    : Promise.resolve();
  Promise.all([seen, Promise.race([photoReady, pause(350)])]).then(() => {
    if (window.scrollY < window.innerHeight / 2) playWelcomeConfetti(studioConfetti);
  });
}
Promise.race([Promise.all([photoReady, letteringReady]), pause(2500)]).then(() => $('.cover').classList.add('ready'));

// Everything is set up; index.html's fallback timer can stand down.
document.documentElement.classList.add('started');
