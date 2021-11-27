const urlParams = new URLSearchParams(window.location.search);
const u = urlParams.get('channel');
let badgeData = {};

async function loadJSON(file) {
    return new Promise(function(resolve, reject){
        var xml = new XMLHttpRequest();
        xml.overrideMimeType("application/json");
        xml.open('GET', file, true);
        xml.onreadystatechange = function() {
            if (xml.readyState == 4 && xml.status == "200") resolve(xml.responseText);
        }
        xml.onerror = () => reject(xml.statusText);
        xml.send();
    })
}
'https://badges.twitch.tv/v1/badges/channels/509037856/display'

async function runBadges(files){
    for (let f in files){
        let URL = `./projects/chatter/${files[f].path}.json`
        if (files[f].site) URL = files[f].path
        let data = await loadJSON(URL);
        data = JSON.parse(data)['badge_sets'];
        Object.keys(data).forEach((k) => {
            badgeData[k] = data[k];
        })
        console.log('Badge data updated!');
    }
}

let badgeList = [{"path": 'badges'}, {"path":'https://badges.twitch.tv/v1/badges/channels/509037856/display', "site": true}];
//if (u === 'colloquialowl') badgeList.push('colloquialowl');

runBadges(badgeList);

const userData = {
    'lydiapancakes': {"colour": "#FFC2A9"},
    "hellovonnie": {"colour": "#bf94ff"},
    "astoldbyangela": {"colour": "teal"},
    "colloquialowl": {"colour": "#fe5f55"},
    "kiwi_fruitbird": {"colour": "#00B160"},
    'arcasian': {"colour": "#94588c"},
    'theyeteedotcom': {"colour": "#3f4be4"}
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

let firstM = true;

function postBox(channel, tags, message, self, italics){
    if (firstM){
        let badgeURL = `https://badges.twitch.tv/v1/badges/channels/${tags['room-id']}/display`
        runBadges([{"path": badgeURL, "site": true}]);
        firstM = false;
    }
    if (tags.username === 'colloquialbot') return;
    let toAdd = document.createElement('div');
    let emotes = formatEmotes(message,tags.emotes);
    let chatName = document.createElement('span');
    chatName.innerHTML = `<b>${tags.username}: </b>`;
    for (let u in userData){
        if (u === tags.username) {
            toAdd.style.backgroundColor = userData[u].colour;
        }
    }
    if (tags.badges){
        Object.keys(tags.badges).forEach((k) => {
            if (badgeData[k]){
                let v = tags.badges[k];
                if (badgeData[k].versions[v]){
                    chatName.innerHTML = `<img src=${badgeData[k].versions[v]['image_url_4x']}></img> ${chatName.innerHTML}`;
                }
            }
            
        })
    }
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
        if (tags['custom-reward-id'] === '62dbe65f-de95-48db-a985-734f5eb761a3') userData[tags.username].colour = message;
    }
    postBox(channel, tags, message, self, false);
});
client.on('action', (channel, tags, message, self) => {postBox(channel, tags, message, self, false)});	