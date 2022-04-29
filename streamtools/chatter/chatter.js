let show = document.getElementById('show');
document.body.removeChild(show);
let bound = document.createElement('div');
bound.id = 'chatBoundary';
document.body.appendChild(bound);
let bg = document.createElement('div');
bg.id = 'chatBackground';
document.body.appendChild(bg);

function trueCheck(val) {return (val === 'true')};
function splitList(val) {
  val = val.toLowerCase().replace(/\s/g, '');
  return val.split(',');
};

// TRUE/FALSE CONVERT
if (params.highlight) {
  params.highlight = trueCheck(params.highlight)
} else {
  params.highlight = true;
};
if (params.badges) params.badges = trueCheck(params.badges);
if (params.bttv) params.bttv = trueCheck(params.bttv);
if (params.gradient) params.gradient = trueCheck(params.gradient);
if (params.pronouns) params.pronouns = trueCheck(params.pronouns);
if (params.scroll) params.scroll = trueCheck(params.scroll);
if (params.togglecol) params.togglecol = trueCheck(params.togglecol);

//SPLIT LISTS
if (params.hidebot) params.hidebot = splitList(params.hidebot);
if (params.hidecom) params.hidecom = splitList(params.hidecom);

// BGCOLOUR AND OPACITY
function addAlpha(color, opacity) {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

if (params.bgcolour) bg.style.backgroundColor = `#${params.bgcolour}`;
if (params.bgopacity) {
  if (params.bgopacity === '0') {
    bg.style.backgroundColor = `rgba(0,0,0,0)`;
  } else {
    let alpha_ed = addAlpha(params.bgcolour, (parseInt(params.bgopacity) * 0.1))
    bg.style.backgroundColor = `#${alpha_ed}`;
  }
}
if (!params.chatopacity) params.chatopacity = 10;
if (params.chatopacity === '0') {
  params.chatcolour = `rgba(0,0,0,0)`;
} else {
  let alpha_ed = addAlpha(params.chatcolour, (parseInt(params.chatopacity) * 0.1))
  params.chatcolour = `#${alpha_ed}`;
}

if (params.highcolour) params.highcolour = `#${params.highcolour}`;
if (params.fontcolour) params.fontcolour = `#${params.fontcolour}`;

if (params.align) {
  if (params.align === 'Left' || params.align === 'left') params.align = 'flex-start';
  if (params.align === 'Right' || params.align === 'right') params.align = 'flex-end';
  bound.style.alignItems = params.align;
}

if (params.font) bound.style.fontFamily = params.font;

if (params.fontsize) {
  let hmm = document.querySelector('html');
  let fontRange = ['smaller', 'small', 'regular', 'large', 'larger', 'x-large', 'xx-large', 'xxx-large']
  hmm.style.fontSize = fontRange[params.fontsize];
}

//

function updateGradient(){
  let percent = 100 - (Math.round((17/window.innerHeight)*10000) / 100)
  console.log(percent);
  let gradientObject = {
    '-webkit-mask-image': `-webkit-gradient(linear, left bottom, left top, from(black), color-stop(${percent}%, black), color-stop(101%, rgba(0, 0, 0, 0)))`,
    '-webkit-mask-image': `linear-gradient(0deg, black 0%, black ${percent}%, rgba(0, 0, 0, 0) 101%)`,
    'mask-image': `-webkit-gradient(linear, left bottom, left top, from(black), color-stop(${percent}%, black), color-stop(101%, rgba(0, 0, 0, 0)))`,
    'mask-image': `linear-gradient(0deg, black 0%, black ${percent}%, rgba(0, 0, 0, 0) 101%)`,
  }
  Object.assign(bound.style, gradientObject);
}

if (params.gradient){
  updateGradient();
  window.addEventListener('resize', updateGradient);
}


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

const pronouns = {
  "aeaer": "Ae/Aer",
  "any": "Any",
  "eem": "E/Em",
  "faefaer": "Fae/Faer",
  "hehim": "He/Him",
  "heshe": "He/She",
  "hethem": "He/They",
  "itits": "It/Its",
  "other": "Other",
  "perper": "Per/Per",
  "sheher": "She/Her",
  "shethem": "She/They",
  "theythem": "They/Them",
  "vever": "Ve/Ver",
  "xexem": "Xe/Xem",
  "ziehir": "Zie/Hir"
}

let userPronouns = new Map();

const client = new tmi.Client({
  channels: [params.channel]
});

client.on("connected", () => {
  console.log('Reading from Twitch! ✅');
});

client.connect();

let topMessageValue = 0;

function scrolling(element, duration, easingFunc) {
  if (!params.scroll) {
    bound.scrollTop = bound.scrollHeight;
    return;
  }

  let startTime;
  let startPos = element.scrollTop;
  let elementSize = element.getBoundingClientRect();
  let scrollEndValue = element.scrollHeight - elementSize.height;
  let hideDuration = duration / 5;

  //IF DELETION
  let startingHeight = element.scrollHeight;

  let scroll = function(timestamp) {
    startTime = startTime || timestamp;
    let elapsed = timestamp - startTime;
    if (bound.scrollHeight < startingHeight) {
      let difference = startingHeight - bound.scrollHeight;
      console.log(difference);
      startPos = startPos - difference;
      scrollEndValue = scrollEndValue - difference;
      startingHeight = bound.scrollHeight;
    }
    let easedFunction = Math.round((easingFunc(elapsed/duration)*100))/100;
    let quickEased = Math.round((easingFunc(elapsed/hideDuration)*100))/100;
    if (quickEased > 1) quickEased = 1;
    element.scrollTop = startPos + (scrollEndValue - startPos) * easedFunction;
    if (element.scrollTop === scrollEndValue) return;
    if (elapsed <= duration) window.requestAnimationFrame(scroll)
  };
  if (startPos != scrollEndValue) window.requestAnimationFrame(scroll);
}

function depacify(target){
  if (target.classList.contains('depacify')) return
  console.log('running depacify');
  let startTime;
  let duration = 1000;
  target.classList.add('depacify');
  let hiding = function(timestamp) {
    console.log('hiding');
    startTime = startTime || timestamp;
    let elapsed = timestamp - startTime;
    let amount = easeOutCubic(elapsed/duration);
    if (amount > 1) amount = 1;
    target.style.opacity = 1 - amount;
    if (amount != 1) window.requestAnimationFrame(hiding);
  };
  window.requestAnimationFrame(hiding);
}

function runDelete(){
  if (!document.querySelector('.chatbox') || !topMessageValue) return;
  let deleteList = document.querySelectorAll('.chatbox');
  for (let d = 0; d < deleteList.length; d++) {
    let boundingBox = deleteList[d].getBoundingClientRect();
    let boundSize = bound.getBoundingClientRect();
    if (boundingBox.bottom < -(window.innerHeight * 3)) {
      console.log('commense delete!');
      deleteList[d].remove();
      scrollDown();
    }
    if (boundingBox.bottom <= topMessageValue + 10 && params.gradient) depacify(deleteList[d]);
  }
}

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === 'visible') bound.scrollTop = bound.scrollHeight;
});

function scrollDown() {
  if (bound.scrollHeight < window.innerHeight) return;
  let hideAll = document.querySelectorAll('.chatbox');
  let hide = hideAll[0];
  for (let h=0; h < hideAll.length; h++){
    if (hide.style.opacity) hide = hideAll[h + 1]; 
  }
  if (hide.style) {
    console.log(hide.style);
    hide.style.opacity = 1;
  }
  scrolling(bound, 1000, easeOutCubic);
  setTimeout(runDelete, 1500);
}

const easeInOutCubic = function(t) {
  return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

const easeOutCubic = function(t){
  return (--t)*t*t+1
}


let scrollTimer = null;
bound.addEventListener('scroll', function() {
  if (scrollTimer) clearTimeout(scrollTimer);        
  scrollTimer = setTimeout(function() {
    //DO STUFF
  }, 1500);
}, false);

let firstM = true;
console.log(params);

function postBox(channel, tags, message, self, italics){
  console.log(tags);
  if (firstM){
    let badgeURL = `https://badges.twitch.tv/v1/badges/channels/${tags['room-id']}/display`
    runBadges([{"path": badgeURL, "site": true}]);
    if (params.BTTV) getBTTVEmotes(channel, tags['room-id']);
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
  if (params.animation) {
    let newName = params.animation.replaceAll(" ", "");
    chatBubble.className = newName;
  }
  if (params.chatcolour) chatBubble.style.backgroundColor = `#${params.chatcolour}`
  let emotes = formatEmotes(message, tags.emotes, bttvEmoteCache, tags.bits);
  let chatName = document.createElement('p');
  chatName.innerHTML = `<b>${tags.username}: </b>`;
  if (italics) chatName.innerHTML = tags.username + ' ';

  
  if (!tags.color || tags.color === '#FFFFFF' || !params.togglecol) tags.color = params.highcolour;

  if (params.pronouns){
    let lowerCaseUser = tags.username.toLowerCase();
    if (userPronouns.get(lowerCaseUser)){
      //chatName.innerHTML = `<b>${tags.username} <code>${userPronouns.get(lowerCaseUser)}</code>: </b>`;
      let pronounBlock = document.createElement('span');
      pronounBlock.className = 'pronoun';
      pronounBlock.style.border = `0.15rem solid ${tags.color}`;
      pronounBlock.style.color = params.fontcolour;
      pronounBlock.innerText = userPronouns.get(lowerCaseUser);
      chatName.innerHTML = `<b>${tags.username}</b> `
      chatName.appendChild(pronounBlock);
      chatName.innerHTML = chatName.innerHTML + " <b>: </b>"
    }
  }

  chatName.style.color = tags.color;
  chatBubble.style.color = tags.color;
  chatBubble.style.backgroundColor = params.chatcolour;
  chatBubble.style.transform = "scaleY(1)";
  if (italics) chatName.style.fontStyle = 'italic';
  if (!params.highlight) chatBubble.style.color = 'rgba(0,0,0,0)';

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
  let messageSpan = document.createElement('span');
  messageSpan.innerHTML = emotes;
  messageSpan.style.color = params.fontcolour;
  if (italics) messageSpan.style.color = tags.color;
  chatName.appendChild(messageSpan);
  chatBubble.classList.add('chatbox');
  chatBubble.appendChild(chatName);
  bound.appendChild(chatBubble);
  if (!topMessageValue) topMessageValue = chatBubble.getBoundingClientRect().top;
  scrollDown();
}

function removeChatsFromUser(username){
  let bubbles = document.querySelectorAll('.chatbox');
  bubbles.forEach((value, i, obj) => {
    let innerText = value.innerText;
    if (innerText.includes(username)) bound.removeChild(bubbles[i]);
  })
}

function getPronouns(username){
  if (!params.pronouns) return;
  let lowerCase = username.toLowerCase();
  if (userPronouns.get(lowerCase)) return;
  fetch(`https://pronouns.alejo.io/api/users/${lowerCase}`)
  .then(res => res.json())
  .then((proData) => {
    if (!proData.length) return;
    userPronouns.set(lowerCase, pronouns[proData[0].pronoun_id]);
  });
}

client.on('chat', (channel, tags, message, self) => {
  postBox(channel, tags, message, self, false)
  getPronouns(tags.username);
  let msgI = 0;
  if (tags.username === 'colloquialowl' && message === '!test'){
    setInterval(()=>{
      if (msgI < 100) postBox(channel, tags, `${msgI}`, self, false);
      msgI++
    }, 300)
  }
})
client.on('action', (channel, tags, message, self) => {postBox(channel, tags, message, self, true)})
client.on('cheer', (channel, tags, message) => {
  console.log(tags);
  postBox(channel, tags, message, false, false)
});
client.on('clearchat', (channel) => {bound.innerHTML = ''});
client.on("join", (channel, username, self) => getPronouns(username));

client.on("resub", (channel, username, months, message, userstate, methods) => {
  postBox(channel, tags, message, false, false);
});

client.on("subscription", (channel, username, method, message, userstate) => {
  postBox(channel, tags, message, false, false);
});

//ANNOUNCEMENTS
client.on('announcement', (channel, tags, message, self, colour) => {
  tags.username = 'ANNOUNCEMENT 🎉';
  tags.color = '#9147FF';
  if (colour){
    if (colour === 'PRIMARY') colour = '#9147FF';
    tags.color = colour;
  }
  tags.badges = '';
  postBox(channel, tags, message, false, false);
});

client.on("ban", (channel, username, reason, tags) => {
  removeChatsFromUser(username);
});

client.on("timeout", (channel, username, reason, duration, userstate) => {
  removeChatsFromUser(username);
});

if (!params.animation){
  params.chatcolour = '#9147FF'
  params.fontcolour = '#ffffff'
  postBox(null, {
    username: 'UPDATE 🎉',
    color: '#9147FF',
    badges: ''
  }, 'Chatter has been updated. Please get a new URL from https://colloquial.studio/streamtools/chatter', false, false)
} else if (!params.channel){
  postBox(null, {
    username: 'ERROR',
    color: '#9147FF',
    badges: ''
  }, 'NO CHANNEL SELECTED', false, false)
}