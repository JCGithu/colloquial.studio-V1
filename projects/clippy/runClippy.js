console.log('CLIPPY IS HERE');
document.body.style.backgroundColor = 'rgba(0,0,0,0)';
let show = document.getElementById('menu');
document.body.removeChild(show);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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
    theBoy.speak(`Hi ${u}!`);
    theBoy.animate();
  }, 1000);

  const client = new tmi.Client({
    channels: [u]
  });
  
  client.on("connected", () => {console.log('Reading from Twitch! ✅')});
  
  client.connect();
  client.on('message', (channel, tags, message) => {
    if (!userList.get(tags.username)){
      console.log(`New user in chat! ${tags.username} said ${message}`);
      theBoy.speak(`${hi[getRandomInt(hi.length)]} ${tags.username} ${outro[getRandomInt(outro.length)]}`);
      userList.set(tags.username, true);
    }
    console.log(tags['custom-reward-id']);
    if (pointID){
      if (tags['custom-reward-id'] === pointID){
        theBoy.animate();
        theBoy.speak(`${message}               .`);
      }
    }
    if (tags.badges.broadcaster || tags.badges.moderator && message === '!clippy') {
      console.log('animation runs');
      theBoy.animate();
    }
  });
});
