
const client = new tmi.Client({
  channels: ['hellovonnie']
});

client.on("connected", () => {console.log('Reading from Twitch! ✅')});
client.connect();

let i = 0;

client.on('message', (channel, tags, message) => {
  if (message === 'rawr') {
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