let textWrapper = document.querySelector('.title');
let message = document.getElementById('message');
let img = document.getElementById('img');
let box = document.getElementById('theBox');
const urlParams = new URLSearchParams(window.location.search);
const t = urlParams.get('target');
const m = urlParams.get('message');
const i = urlParams.get('gif');
const c = urlParams.get('colour');

const r = urlParams.get('r');
const g = urlParams.get('g');
const b = urlParams.get('b');

img.src = './eventBox/ewok.gif';

if (t) {
  textWrapper.innerHTML = t;
  let space = 1 - (t.length * 0.05);
  console.log(space);
  textWrapper.style.letterSpacing = `${space}rem`
}
//if (r) textWrapper.style.backgroundColor = `rgba(${r},${g},${b},1)`;
if (m) message.innerHTML = m;
if (i) img.src = `./eventBox/${i}.gif`;
if (r) {
  box.style.setProperty('--user', `rgba(${r},${g},${b},1)`);
} else {
  box.style.setProperty('--user', '#fe5f55');
}
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");



anime.timeline({loop: true})
  .add({
    targets: '.title .letter',
    translateY: [0, -12, 0],
    duration: 1500,
    easing: "easeInOutQuad",
    delay: (el, i) => (55 * i) + 500
  })

anime.timeline()
  .add({
    targets: '#theBox',
    translateY: "-200%",
    duration: 10,
    easing: "easeOutElastic",
  })
  .add({
    targets: '#theBox',
    translateY: "30%",
    duration: 2000,
    delay: 1000,
    easing: "easeOutElastic",
  })
  .add({
  targets: '#theBox',
  translateY: "-200%",
  duration: 1000,
  delay: 7000,
  easing: "easeOutExpo",
})





