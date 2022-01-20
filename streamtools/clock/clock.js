let frame = document.createElement('div');
frame.id = 'frame';
frame.style.height = '100vh',
frame.style.backgroundColor = '#2f3437';

let clock = document.createElement('div');
clock.id = 'clock'
let timeText = document.createElement('span');
timeText.id = 'time';
let dateText = document.createElement('date');
dateText.id = 'date'
clock.appendChild(time);
clock.appendChild(date);
frame.appendChild(clock);

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return i + 'st';
  if (j === 2 && k !== 12) return i + 'nd';
  if (j === 3 && k !== 13) return i + 'rd';
  return i + 'th';
}
  
function formatAMPM(date) {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

function formatEmoji(date) {
  if (date.getHours() > 19 || date.getHours() < 5) {
    return '🌙';
  }
  return '☀️';
}
  
function clockConvert(hours, double) {
  hours = hours > 12 ? hours - 12 : hours;
  if (double) return hours.toLocaleString('default', { minimumIntegerDigits: 2 });
  return hours;
}
  
function timeFormatter(formatTime, timeNow) {
  if (!formatTime) formatTime = 'H:mm P';

  const map = {
    h: timeNow.getHours().toLocaleString('default'),
    hh: timeNow.getHours().toLocaleString('default', { minimumIntegerDigits: 2 }),
    H: clockConvert(timeNow.toLocaleString('default', { hour: 'numeric' }).replace(/\D/g,'')),
    HH: clockConvert(timeNow.toLocaleString('default', { hour: '2-digit', minimumIntegerDigits: 2 }).replace(/\D/g,''), true),
    m: timeNow.getMinutes().toLocaleString('default'),
    mm: timeNow.getMinutes().toLocaleString('default', { minimumIntegerDigits: 2 }),
    s: timeNow.getSeconds().toLocaleString('default'),
    ss: timeNow.getSeconds().toLocaleString('default', { minimumIntegerDigits: 2 }),
    P: formatAMPM(timeNow),
    E: formatEmoji(timeNow),
  };

  let finalTime = formatTime.replace(/h(?!h)|h{2}|H(?!H)|H{2}|m(?!m)|m{2}|s(?!s)|s{2}|P|E/g, (matched) => {
    return map[matched];
  });
  return finalTime;
}

function dateFormatter(formatCode, timeNow) {
  if (!formatCode) formatCode = 'DDD, ds MMM, yyyy';

  const map = {
    m: timeNow.toLocaleString('default', { month: 'numeric' }),
    mm: timeNow.toLocaleString('default', { month: '2-digit' }),
    M: timeNow.toLocaleString('default', { month: 'narrow' }),
    MM: timeNow.toLocaleString('default', { month: 'short' }),
    MMM: timeNow.toLocaleString('default', { month: 'long' }),
    d: timeNow.toLocaleString('default', { day: 'numeric' }),
    dd: timeNow.toLocaleString('default', { day: '2-digit' }),
    ds: ordinal_suffix_of(timeNow.toLocaleString('default', { day: 'numeric' })),
    dds: ordinal_suffix_of(timeNow.toLocaleString('default', { day: '2-digit' })),
    D: timeNow.toLocaleString('default', { weekday: 'narrow' }),
    DD: timeNow.toLocaleString('default', { weekday: 'short' }),
    DDD: timeNow.toLocaleString('default', { weekday: 'long' }),
    yy: timeNow.toLocaleString('default', { year: '2-digit' }),
    yyyy: timeNow.getFullYear(),
    E: formatEmoji(timeNow),
  };

  let finalDate = formatCode.replace(
    /m(?!m)|m{2}|M(?!M)|MM(?!M)|M{3}|d(?![ds])|dd{2}(?!s)|(?<!d)ds|dds|D(?!D)|DD(?!D)|D{3}|yy(?!y)|y{4}|E/g,
    (matched) => {
      return map[matched];
    }
  );
  return finalDate;
}
  
function clockUpdate(formatCode, formatTime) {
  let timeNow = new Date();
  let formattedTime = timeFormatter(formatTime, timeNow);
  timeText.innerHTML = formattedTime;
  let formattedDate = dateFormatter(formatCode, timeNow);
  dateText = formattedDate;
}
  
/* {
  bg: StringParam,
  bghex: StringParam,
  text: StringParam,
  texthex: StringParam,
  font: StringParam,
  align: StringParam,
  format: StringParam,
  time: StringParam,
  scale: NumberParam,
  padding: NumberParam,
  paddingTop: NumberParam,
  paddingBottom: NumberParam,
  paddingLeft: NumberParam,
  paddingRight: NumberParam,
  timePadding: NumberParam
}; */

let timeStyle = {
  fontWeight: 'bold',
  fontSize: '1.8rem',
  lineHeight: '1.8rem',
};

let clockStyle = {
  width: '100%',
  overflow: 'hidden',
  padding: '0.5rem',
  display: 'flex',
  textAlign: 'left',
  justifyContent: 'start',
  fontFamily: 'Poppins',
  flexDirection: 'column',
  color: 'white',
  lineHeight: '1rem',
};

  // 24 Hour clock
let formatCode,
  formatTime = '';

function styleUpdate(clock, frame, timeText) {
  if (params.bg) frame.style.backgroundColor = params.bg;
  if (params.bghex) frame.style.backgroundColor = `#${params.bghex}`;
  if (params.text) clock.style.color = params.text;
  if (params.texthex) clock.style.color = `#${params.texthex}`;
  if (params.font) clock.style.fontFamily = params.font;
  if (params.format) formatCode = params.format;
  if (params.time) formatTime = params.time;
  if (params.scale) {
    clock.style.fontSize = `${params.scale}rem`;
    clock.style.lineHeight = `${params.scale}rem`;
    timeText.style.fontSize = `${params.scale * 1.8}rem`;
    timeText.style.lineHeight = `${params.scale * 1.8}rem`;
  }
  if (params.align === 'right') {
    clock.style.textAlign = 'right';
    clock.style.justifyContent = 'flex-end';
  }
  if (params.align === 'center') {
    clock.style.textAlign = 'center';
    clock.style.justifyContent = 'center';
  }
  if (params.padding){
    if (typeof(params.padding) === 'integer') {
      clock.style.padding = `${params.padding}px`
    } else {
      clock.style.padding = params.padding;
    }
  }
  if (params.timePadding){
    if (typeof(params.timePadding) === 'integer') {
      clock.style.padding = `${params.timePadding}px`
    } else {
      clock.style.padding = params.timePadding;
    }
  }
}

styleUpdate(clock, frame, timeText);
const timer = setTimeout(() => {
  timeReset(clockUpdate(formatCode, formatTime));
}, 1000);

