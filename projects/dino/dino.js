
const client = new tmi.Client({
  channels: ['hellovonnie']
});

client.on("connected", () => {console.log('Reading from Twitch! ✅')});
client.connect();

let i = 0;

let req = new XMLHttpRequest();
req.open('GET', './projects/dino/dino.webm', true);
req.responseType = 'blob';

req.onload = () =>{
  console.log('loaded!');
  let screen = document.getElementById('load');
  document.body.removeChild(screen);
}
req.onerror = (err) => {
  console.log(err)
}

req.send();

client.on('message', (channel, tags, message) => {
  if (message === 'rawr') {
    console.log('order recieved');
    let vid = document.createElement('video');
    vid.src = './projects/dino/dino.webm';
    vid.setAttribute('autoplay', true);
    vid.setAttribute('type', "video/webm");
    vid.id = i;
    document.body.appendChild(vid);
    let target = document.getElementById(i);
    i++;
    target.addEventListener('ended', ()=>{
      console.log('video ended');
      document.body.removeChild(target);
    })
  }
});