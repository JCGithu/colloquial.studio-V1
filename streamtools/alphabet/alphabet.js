const urlParams = new URLSearchParams(window.location.search);
const current = document.getElementById('current');
const extra = document.getElementById('extra');
const userCount = document.getElementById('users');

let channels = urlParams.get('channel')
if(!urlParams.get('channel')) {
  channels = 'colloquialowl';
  extra.innerText = 'No channel selected in URL. Please put ?channel=[CHANNELNAME] at the end!';
}

const client = new tmi.Client({channels: [channels]});
client.on("connected", () => {console.log('Reading from Twitch! ✅')});

let startNum = 65;
let currNum = 64;
let done = false;
let userList = [];

if (channels === 'elliotisacoolguy') current.style.fontFamily = 'Haus';

const canvas = document.getElementById('your_custom_canvas_id');
const jsConfetti = new JSConfetti({ canvas });

function fail(username){
  current.innerText = '...';
  userList = [];
  if (currNum > 64) extra.innerText = `${username} broke it!`;
  currNum = startNum - 1;
}

function success(){
  current.innerText = 'Z';
  extra.innerText = 'ALPHABET COMPLETE!';
  userCount = "Thanks to the work of " + userList.join(', ');
  jsConfetti.addConfetti();
  done = true;
}

client.on('message', (channel, tags, message, self) => {
  if (done) return;
  if (message.length > 1) {
    fail(tags.username);
    return;
  }
  message = message.toUpperCase();
  if (currNum === 64 && message === 'A') {
    if (!userList.includes(tags.username)) userList.push(tags.username);
    current.innerText = 'A';
    currNum++;
    extra.innerText = '';
    return;
  }
  let target = currNum + 1;
  if (message.charCodeAt(0) == target){
    currNum++;
    current.innerText = String.fromCharCode(currNum);
    if (currNum === 90) success();
  } else fail(tags.username);
});

client.connect();