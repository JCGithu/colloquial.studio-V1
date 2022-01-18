console.log('clippyManager.js loaded');
document.body.style.backgroundColor = 'rgba(0,0,0,0)';
let show = document.getElementById('show');
document.body.removeChild(show);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
} 

if (!params.welcome) params.welcome = 'true';
if (params.animate) params.animate = 'true';
let isWelcome = (params.welcome === 'true');
let isAnimate = (params.animate === 'true');

const hi = [
  'Hi',
  'Hello',
  'Sup',
  'Oh hi',
  'Howdy',
  'Ahoy',
  'Ahoy-hoy',
  "*Tips hat* Well hello",
  "What's cookin' good lookin'",
  "Alrighty",
  "There you are!",
  "Ciao",
  "Peek-a-boo",
  "'Ello Gov'ner",
  "What's craic"
];
const outro = [
  'looking good today!',
  'nice haircut!',
  "how's it going?",
  "hope you're having a great day",
  "don't tell the others but you are my favourite ;)",
  "how's tricks?",
  "it's been so long!",
  "I've missed you",
  "uwu wook weawwy nice today *snuggles closer*",
];
const userList = new Map();

clippy.load('Clippy', function(theBoy) {
  theBoy.show();
  theBoy.moveTo(window.innerWidth,200)
  theBoy.moveTo(200,200);

  let clipBox = document.getElementById('clippy');
  setTimeout(function (){
    theBoy.speak(`Hi ${params.u}!`);
    theBoy.animate();
  }, 1000);
  
  const client = new tmi.Client({
    channels: [params.u]
  });
  
  client.on("connected", () => {console.log('Reading from Twitch! ✅')});
  
  client.connect();
  client.on('message', (channel, tags, message) => {
    if (!userList.get(tags.username) && isWelcome){
      console.log(`New user in chat! ${tags.username} said ${message}`);
      userList.set(tags.username, true);
      theBoy.speak(`${hi[getRandomInt(hi.length)]} ${tags.username} ${outro[getRandomInt(outro.length)]}`);
    }
    if (params.pointID){
      if (tags['custom-reward-id'] === params.pointID){
        theBoy.animate();
        theBoy.speak(`${message}               .`);
      }
    }
    if (tags.badges.broadcaster || tags.badges.moderator && message === '!clippy' && isAnimate) {
      console.log('Animating!');
      theBoy.animate();
    }
    if (message === '!clippit' && isAnimate) {
      theBoy.speak(`${hi[getRandomInt(hi.length)]} ${tags.username}! You know my real name!`)
      theBoy.animate();
    }
  });
});
