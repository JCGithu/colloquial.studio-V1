const urlParams = new URLSearchParams(window.location.search);
const u = urlParams.get('channel');
let pointID = urlParams.get('pointID');

pointID = pointID.replace(/_/g, '-');

if (u) {
  loadScript('./runClippy.js').then(()=>{
    console.log('');
  })
} else {
  loadScript('./runMenu.js').then(()=>{
    console.log('run menu')
  })
};