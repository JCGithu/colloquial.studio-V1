console.log('menu logged')

let urlInfo = {
  channel: "",
  bounce: "6",
  emoteSize: "2",
  ballLimit: "150",
  expire: "30",
  ballSize: "20"
}


function urlBuild(){
  let urlString = 'https://colloquial.studio/emotedrop?';
  for (let k in urlInfo){
    urlString = urlString + `${k}=${urlInfo[k]}&`;
  }
  return urlString
}

function runMenu(){
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
}
