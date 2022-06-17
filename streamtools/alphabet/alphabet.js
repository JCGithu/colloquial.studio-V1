const urlParams = new URLSearchParams(window.location.search);

let channels = urlParams.get('channel')
if(!urlParams.get('channel')){
  channels = 'colloquialowl';
};

console.log(urlParams);
const client = new tmi.Client({
  channels: [channels]
});

let startNum = 65;
let currNum = startNum;
let streak = 0;
let current = document.getElementById('current');
let extra = document.getElementById('extra');
let done = false;

const canvas = document.getElementById('your_custom_canvas_id')
const jsConfetti = new JSConfetti({ canvas });

client.on("connected", () => {console.log('Reading from Twitch! ✅')});

function fail(username){
  current.innerText = '...';
  extra.innerText = `${username} broke it!`;
  currNum = startNum;
}

function success(){
  current.innerText = 'Z';
  extra.innerText = 'ALPHABET COMPLETE!';
  jsConfetti.addConfetti();
  done = true;
}

client.on('message', (channel, tags, message, self) => {
  if (done) return;
  console.log(message);
  if (message.length > 1) {
    fail(tags.username);
    return;
  }
  message = message.toUpperCase();
  console.log('got');
  if (currNum === 65 && message === 'A') {
    console.log('woo');
    current.innerText = 'A';
    extra.innerText = '';
    return;
  }
  console.log(message.charCodeAt(0));
  let target = currNum + 1;
  if (message.charCodeAt(0) == target){
    console.log('WEE');
    currNum++;
    current.innerText = String.fromCharCode(currNum);
  } else {
    console.log(target, message.charCodeAt(0));
    fail(tags.username);
    return;
  }
  if (currNum === 90) success();
});

function characterChecker(input){
  if (input >= 65 && input <= 91) return true;
  if (input >= 192 && input <= 221) return true;
  if (input === 338 || input === 7838) return true;
  return false;
}

client.connect();