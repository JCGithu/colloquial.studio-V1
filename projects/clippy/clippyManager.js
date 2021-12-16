const urlParams = new URLSearchParams(window.location.search);
const u = urlParams.get('channel');
let pointID = urlParams.get('pointID');

if (pointID) pointID = pointID.replace(/_/g, '-');

if (u) {
  loadScript('./projects/clippy/runClippy.js').then(()=>{
    console.log('');
  })
} else {
  loadScript('./projects/clippy/runMenu.js').then(()=>{
    console.log('run menu')
  })
};