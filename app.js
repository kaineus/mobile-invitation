import { announcement as data } from './invitation.js';

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
text('[data-groom]', data.groom.name);
text('[data-bride]', data.bride.name);
text('[data-date]', dateLabel);
text('#stamp-month', new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'Asia/Seoul' }).format(date));
text('#stamp-day', day);
text('#stamp-year', year);
text('#letter-message', data.message.join('\n'));
text('[data-signature]', `${couple} 드림`);
$('.monogram').replaceChildren(
  document.createTextNode(data.groom.english.charAt(0).toLowerCase()),
  make('span', '', '&'),
  document.createTextNode(data.bride.english.charAt(0).toLowerCase())
);

const placeholderTemplate = $('#cover .placeholder-caption').cloneNode(true);
placeholderTemplate.querySelector('span').textContent = '사진 준비 중';
function fillPhoto(container, photo, eager = false) {
  const img = new Image();
  img.alt = photo.alt;
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => {
    container.replaceChildren(placeholderTemplate.cloneNode(true));
    container.classList.add('photo-placeholder');
    if (container instanceof HTMLButtonElement) {
      container.disabled = true;
      container.setAttribute('aria-label', `${photo.alt} — 사진을 불러올 수 없습니다`);
    }
  });
  img.src = photo.src;
  container.replaceChildren(img);
  container.classList.remove('photo-placeholder');
}
if (data.cover.src) fillPhoto($('#cover'), data.cover, true);
else {
  $('#cover').setAttribute('role', 'img');
  $('#cover').setAttribute('aria-label', '두 사람의 사진이 들어갈 자리');
}
data.photos.forEach((photo, index) => {
  const slot = make(photo.src ? 'button' : 'div', 'gallery-slot photo-placeholder');
  if (photo.src) {
    slot.type = 'button';
    slot.setAttribute('aria-label', `${photo.alt} 크게 보기`);
    fillPhoto(slot, photo);
    slot.addEventListener('click', () => {
      $('#dialog-image').src = photo.src;
      $('#dialog-image').alt = photo.alt;
      text('#dialog-caption', photo.alt);
      $('#photo-dialog').showModal();
    });
  } else {
    const caption = placeholderTemplate.cloneNode(true);
    caption.querySelector('span').textContent = `사진 ${String(index + 1).padStart(2, '0')}`;
    slot.append(caption);
    slot.setAttribute('role', 'img');
    slot.setAttribute('aria-label', `${index + 1}번째 사진이 들어갈 자리`);
  }
  $('#gallery').append(slot);
});
$('#gallery-note').hidden = data.photos.some((photo) => photo.src);
$('#close-photo').addEventListener('click', () => $('#photo-dialog').close());
$('#photo-dialog').addEventListener('click', (event) => {
  if (event.target === $('#photo-dialog')) $('#photo-dialog').close();
});

text('#calendar-month', `${year}. ${String(month).padStart(2, '0')}`);
const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
let row;
for (let cell = 0; cell < Math.ceil((firstWeekday + daysInMonth) / 7) * 7; cell++) {
  if (cell % 7 === 0) { row = make('tr'); $('#calendar-days').append(row); }
  const td = make('td');
  const value = cell - firstWeekday + 1;
  if (value > 0 && value <= daysInMonth) {
    const span = make('span', value === day ? 'wedding-day' : '', value);
    if (value === day) span.setAttribute('aria-label', `${month}월 ${day}일 결혼기념일`);
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
  toast('다운로드한 기념일을 캘린더 앱에서 열어 주세요.');
});

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  text('#toast', message);
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
}
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
    toast('결혼 알림장 링크를 복사했습니다.');
  } catch {
    $('#copy-value').value = value;
    $('#copy-dialog').showModal();
    $('#copy-value').select();
  }
}
$('#close-copy').addEventListener('click', () => $('#copy-dialog').close());
$('#share').addEventListener('click', async () => {
  const url = new URL(window.location.href);
  url.hash = '';
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text: '소중한 분들께 저희의 결혼 소식을 전합니다.', url: url.href });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  await copy(url.href);
});
