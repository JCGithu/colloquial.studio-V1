
let show = document.getElementById('show');
document.body.removeChild(show);
let bound = document.createElement('div');
bound.id = 'chatBoundary';
document.body.appendChild(bound);

// BGCOLOUR AND OPACITY
function addAlpha(color, opacity) {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

if (params.bgcolour) bound.style.backgroundColor = `#${params.bgcolour}`;
if (params.bgopacity) {
  let alpha_ed = addAlpha(params.bgcolour, (parseInt(params.bgopacity) * 0.1))
  bound.style.backgroundColor = `#${alpha_ed}`;
}

if (params.highcolour) params.highcolour = `#${params.highcolour}`;
if (params.chatcolour) params.chatcolour = `#${params.chatcolour}`;
if (params.fontcolour) params.fontcolour = `#${params.fontcolour}`;

function trueCheck(val) {return (val === 'true')};
function splitList(val) {
  val = val.toLowerCase().replace(/\s/g, '');
  return val.split(',');
};

// TRUE/FALSE CONVERT
if (params.badges) params.badges = trueCheck(params.badges);
if (params.bttv) params.bttv = trueCheck(params.bttv);

//SPLIT LISTS
if (params.hidebot) params.hidebot = splitList(params.hidebot);
if (params.hidecom) params.hidecom = splitList(params.hidecom);

if (params.align) {
  if (params.align === 'Left' || params.align === 'left') params.align = 'flex-start';
  if (params.align === 'Right' || params.align === 'right') params.align = 'flex-end';
  bound.style.alignItems = params.align;
}

//document.body.style.fontSize = 'xx-large'

/*
font: urlParams.get('font'),
align: urlParams.get('align'),
togglecol: urlParams.get('togglecol'),
*/

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

async function runBadges(files){
  for (let f in files){
    let URL = `./chatter/${files[f].path}.json`
    if (files[f].site) URL = files[f].path
    let data = await loadJSON(URL);
    data = JSON.parse(data)['badge_sets'];
    Object.keys(data).forEach((k) => {
      badgeData[k] = data[k];
    })
    console.log('Badge data updated!');
  }
}

loadJSON(`https://api.betterttv.net/3/cached/emotes/global`).then((data) => {
  bttvEmoteCache = JSON.parse(data); 
})

function getBTTVEmotes(channel, id) {
  return loadJSON(`https://api.betterttv.net/3/cached/users/twitch/${id}`).then((data) => {
    data = JSON.parse(data);
    for (let i in data.channelEmotes){
      bttvEmoteCache.push(data.channelEmotes[i]);
    }
    for (let i in data.sharedEmotes){
      bttvEmoteCache.push(data.sharedEmotes[i]);
    }
  });
}

let badgeList = [{"path": 'badges'}, {"path":'https://badges.twitch.tv/v1/badges/channels/509037856/display', "site": true}];

runBadges(badgeList);

const client = new tmi.Client({
  channels: [params.u]
});

client.on("connected", () => {
  console.log('Reading from Twitch! ✅');
});

client.connect();

function removeTop(chatDiv) {
  let display = chatDiv.getBoundingClientRect();
  if (display.y + display.height > window.innerHeight - 60) {
    document.querySelector('.chatbox').remove();
    removeTop(chatDiv);
  }
}

let firstM = true;
console.log(params);


function postBox(channel, tags, message, self, italics){
  console.log(tags);
  if (firstM){
    let badgeURL = `https://badges.twitch.tv/v1/badges/channels/${tags['room-id']}/display`
    runBadges([{"path": badgeURL, "site": true}]);
    if (params.bttv) getBTTVEmotes(channel, tags['room-id']);
    firstM = false;
  }
  if (params.hidebot){
    for (let h in params.hidebot){
      if (tags.username === params.hidebot[h]) return;
    }
  }
  if (params.hidecom){
    for (let h in params.hidecom){
      if (message === params.hidebot[h]) return;
    }
  }
  
  let chatBubble = document.createElement('div');
  if (params.chatcolour) chatBubble.style.backgroundColor = `#${params.chatcolour}`
  let emotes = formatEmotes(message, tags.emotes, bttvEmoteCache);
  let chatName = document.createElement('span');
  chatName.innerHTML = `<b>${tags.username}: </b>`;

  if (!tags.color || tags.color === '#FFFFFF' || !params.togglecol) tags.color = params.highcolour;

  chatName.style.color = tags.color;
  chatName.classList.add('chatName');
  chatBubble.style.color = tags.color;
  chatBubble.style.backgroundColor = params.chatcolour;

  if (tags.badges && params.badges){
    Object.keys(tags.badges).forEach((k) => {
      if (badgeData[k]){
        let v = tags.badges[k];
        if (badgeData[k].versions[v]){
          chatName.innerHTML = `<img src=${badgeData[k].versions[v]['image_url_4x']} class='twitchBadge'></img> ${chatName.innerHTML}`;
        }
      }
    })
  }

  let chatText = document.createElement('span');
  chatText.style.color = params.fontcolour;
  chatText.style.fontFamily = 'Poppins';
  chatText.innerHTML = emotes;
  chatBubble.classList.add('chatbox');
  chatBubble.appendChild(chatName);
  chatBubble.appendChild(chatText);
  bound.appendChild(chatBubble);
  removeTop(chatBubble);
}

client.on('chat', (channel, tags, message, self) => {postBox(channel, tags, message, self, false)});
client.on('action', (channel, tags, message, self) => {postBox(channel, tags, message, self, false)});