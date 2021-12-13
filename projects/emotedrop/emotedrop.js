const urlParams = new URLSearchParams(window.location.search);
const u = urlParams.get('channel');
const b = urlParams.get('bounce');
const s = urlParams.get('emoteSize');
const e = urlParams.get('ballSize');
const l = urlParams.get('limit');
const t = urlParams.get('expire');

if (u) {
  loadScript('./projects/emotedrop/runDrop.js').then(()=>{
    runDrop(u, b,s,e,l,t);
  })
} else {
  loadScript('./projects/emotedrop/runMenu.js').then(()=>{
    runMenu();
  })
}