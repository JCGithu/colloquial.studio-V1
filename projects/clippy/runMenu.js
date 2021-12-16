let urlInfo = {
  channel: "",
  pointID: "",
}
function urlBuild(){
  let urlString = 'https://colloquial.studio/clippy?';
  for (let k in urlInfo){
    urlString = urlString + `${k}=${urlInfo[k]}&`;
  }
  return urlString
}
let trackers = document.getElementsByClassName('urlBuild');
let output = document.getElementById('output');
let go = document.getElementById('go');
let copy = document.getElementById('copy');
for (var t = 0; t < trackers.length; t++) {
  let title = trackers[t].id
  trackers[t].addEventListener('change', (evt) => {
    urlInfo[title] = evt.target.value;
    output.value = urlBuild();
  })
  trackers[t].addEventListener('keyup', (evt) => {
    urlInfo[title] = evt.target.value;
    output.value = urlBuild();
  })
}
go.addEventListener('click', () =>{
  window.open(output.value,"_self");
})
copy.addEventListener('click', () =>{
  copyTextToClipboard(output.value);
  copy.innerHTML = 'Copied!';
})