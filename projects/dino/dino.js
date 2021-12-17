
const client = new tmi.Client({
  channels: ['hellovonnie']
});

client.on("connected", () => {console.log('Reading from Twitch! ✅')});
client.connect();

let i = 0;
let dino = './projects/dino/dino.webm';
let dinoLoaded;

let xhr = new XMLHttpRequest();
xhr.open('GET', dino, true);
xhr.responseType = 'arraybuffer';

xhr.onload = (res) => {
  let blob = new Blob([res.target.response], {type: 'video/webm'});
  dinoLoaded = URL.createObjectURL(blob);
  playDino(true);
  console.log('init loaded');
}

xhr.onprogress = (ev) => {
  if (ev.lengthComputable){
    console.log(`${ev.loaded} out of ${ev.total}`);
  }
}

xhr.send();

function playDino(start){
  let vid = document.createElement('video');
  vid.src = dinoLoaded;
  vid.autoplay = true;
  vid.muted = true;
  vid.setAttribute('type', "video/webm");
  vid.id = i;
  vid.addEventListener('canplaythrough', function() {
    if (start){
      let screen = document.getElementById('load');
      document.body.removeChild(screen);
    }
    document.body.appendChild(vid);
    vid.play();
    let target = document.getElementById(i);
    i++;
    target.addEventListener('ended', ()=>{
      console.log('video ended');
      document.body.removeChild(target);
    })
  })
  vid.addEventListener('error', function (event) {
    console.log(event);
  })
}

client.on('message', (channel, tags, message) => {
  if (message === 'rawr') {
    console.log('order recieved');
    playDino(false);
  }
});