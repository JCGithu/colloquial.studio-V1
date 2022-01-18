let textWrapper = document.querySelector('.title');
let message = document.getElementById('message');
let img = document.getElementById('img');
let box = document.getElementById('theBox');
const urlParams = new URLSearchParams(window.location.search);
const params = {
  t: urlParams.get('target'),
  m: urlParams.get('message'),
  i: urlParams.get('gif'),
  c: urlParams.get('colour') || 'fe5f55'
}

img.src = params.i || './eventBox/ewok.gif';

if (params.t) {
  textWrapper.innerHTML = params.t;
  let space = 1 - (params.t.length * 0.05); 
  console.log(space);
  textWrapper.style.letterSpacing = `${space}rem`
}
//if (r) textWrapper.style.backgroundColor = `rgba(${r},${g},${b},1)`;
if (params.m) message.innerHTML = params.m;
if (params.i) img.src = `./eventBox/${params.i}.gif`;
box.style.setProperty('--user', `#${params.c}`);
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





