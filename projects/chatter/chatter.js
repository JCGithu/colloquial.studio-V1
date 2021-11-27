const urlParams = new URLSearchParams(window.location.search);
const u = urlParams.get('channel');

const badgeData = document.createElement('script');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://badges.twitch.tv/v1/badges/global/display', true);
xhr.withCredentials = true;
xhr.setRequestHeader('Accept', 'application/json');
xhr.setRequestHeader('access-control-allow-origin', 'https://colloquial.studio');
xhr.send();

console.log(xhr);


const userData = {
    'lydiapancakes': "#FFC2A9",
    "hellovonnie": '#bf94ff',
    "astoldbyangela": "teal",
    "colloquialowl": "#fe5f55",
    "kiwi_fruitbird": "#00B160",
    'arcasian': '#94588c',
    'theyeteedotcom': '#3f4be4',
}

const client = new tmi.Client({
    channels: [u]
});

client.on("connected", () => {
    console.log('Reading from Twitch! ✅');
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

client.connect();

function removeTop(chatDiv) {
    let display = chatDiv.getBoundingClientRect();
    if (display.y + display.height > window.innerHeight - 10) {
      document.querySelector('#chatbox').remove();
      removeTop(chatDiv);
    }
}

function postBox(channel, tags, message, self, italics){
    console.log(tags);
    if (tags.username === 'colloquialbot') return;
    let toAdd = document.createElement('div');
    for (let u in userData){
        if (u === tags.username) toAdd.style.backgroundColor = userData[u];
    }
    let emotes = formatEmotes(message,tags.emotes);
    let chatName = document.createElement('b');
    chatName.innerHTML = `${tags.username}: `;
    let chatText = document.createElement('span');
    chatText.innerHTML = emotes;
    toAdd.id = 'chatbox';
    toAdd.appendChild(chatName);
    toAdd.appendChild(chatText);
    document.body.appendChild(toAdd);
    removeTop(toAdd);
}

client.on('chat', (channel, tags, message, self) => {
    if (tags['custom-reward-id']){
        if (tags['custom-reward-id'] === '62dbe65f-de95-48db-a985-734f5eb761a3') userData[tags.username] = message;
    }
    postBox(channel, tags, message, self, false);
});
client.on('action', (channel, tags, message, self) => {postBox(channel, tags, message, self, false)});	