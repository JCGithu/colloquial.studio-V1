const urlParams = new URLSearchParams(window.location.search);
const u = urlParams.get('channel');

if (u) {
  loadScript('./runClippy.js').then(()=>{
    console.log('');
  })
} else {
  loadScript('./runMenu.js').then(()=>{
    console.log('run menu')
  })
};