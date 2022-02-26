const urlParams = new URLSearchParams(window.location.search);
const params = {
  demo: urlParams.get('demo')
}

console.log(localStorage);

let stats = {
  play: 0,
  won: 0,
  votes: 0,
  lastWord: ''
}

if (localStorage.getItem('stats')) stats = JSON.parse(localStorage.getItem('stats'));
if (!localStorage.getItem("stats")) localStorage.setItem('stats', JSON.stringify(stats));

function saveStats() {
  localStorage.setItem('stats', JSON.stringify(stats));
  if (statBox){
    statBox.innerHTML = `
      <p>Total Votes: ${stats.votes}</p>
      <p>Games Played: ${stats.play}</p>
      <p>Games Won: ${stats.won}</p>`;
  }
  return;
  let achievements = undefined;
  if (!achievements) {
    return;
  }
  localStorage.setItem('achievements', JSON.stringify(achievements));
  let achievementList = Object.keys(achievements);
  for (let a = 0; a < achievementList.length; a++){
    if (achievements[achievementList[a]] === 1){
      // TRIGGER ANIMATION
        //Achievement Title, subtitle, icon, status.
      // ADD ICON TO LIST
      achievements[achievementList[a]] = 2;
    }
  }
}

localAuto = false;
localDark = false;
localKeyboard = false;
localVolume = 3;
localTimer = 25;
user = null;

if (localStorage.getItem("channel")) user = localStorage.getItem('channel');

if (localStorage.getItem("autoMode")) {
  localAuto = (localStorage.getItem('autoMode') === 'true');
}
if (localStorage.getItem("darkMode")) {
  localDark = (localStorage.getItem('darkMode') === 'true');
  console.log(`localDark: ${localDark}`);
}
if (localStorage.getItem("keyboard")) {
  localKeyboard = (localStorage.getItem('keyboard') === 'true');
}
if (localStorage.getItem("volume")) {
  localVolume = parseInt(localStorage.getItem('volume'));
}

function reloadTimer(){
  if (!localStorage.getItem('timer')) return;
  localTimer = parseInt(localStorage.getItem('timer'));
}

reloadTimer();
if (onMobile) localKeyboard = false;

//USERNAME POP UP

let toast = document.createElement('div');
toast.style.transform = "scale(0)"
toast.id = 'toast';
document.body.appendChild(toast);

if (user){
  const client = new tmi.Client({
    channels: [user]
  });
  client.on("connected", () => {
    console.log('Reading from Twitch! ✅');
    toast.innerText = `Connected to ${user} chat`;
    toast.style.visibility = 'visible';
    toast.style.transform = "scale(1)";
    setTimeout(()=> {
      toast.style.transform = "scale(0)";
    }, 7000);
    if (gtag){
      gtag('event', 'user_logged', {
        'event_label': 'user_logged',
        'username': user
      });
    }
  })
  client.connect();
  client.on('message', (channel, tags, message, self) => {
    if (message.length > 1) return;
    let upper = message.toUpperCase();
    if (usersVoted.includes(tags.username)) return;
    let characterCode = upper.charCodeAt(0);
    if (characterCode >= 65 && characterCode <= 91 || characterCode >= 192 && characterCode <= 221){
      if (!poll[upper]) poll[upper] = 0;
      ++poll[upper];
      usersVoted.push(tags.username);
      console.log(`${tags.username} has voted!`);
    }
    
  });
}
let THEWORD = '';

//Create Poll
let poll = {};
let usersVoted = [];
for (let m = 0; m < 26; m++){
  poll[String.fromCharCode(m + 65)] = 0;
}
let pollRunning = false; 

//GRID GENERATION
let newBody = document.createElement('div');
newBody.id = 'twordleBody';
let twordleHTML = document.createElement('div');
twordleHTML.id = 'twordle';
let title = document.createElement('div');
title.innerHTML = `<span><h1>Twordle</h1></span><p>Made by <a href='https://www.twitch.tv/colloquialowl'>ColloquialOwl</a>, Inspired by <a href='https://www.powerlanguage.co.uk/wordle/'>Wordle</a>.</p><button onclick='howTo()'>How to Play</button>`
title.classList.add('Title');
twordleHTML.appendChild(title);
let grid = document.createElement('div');
grid.id = 'grid';
for (let rowCount = 1; rowCount <= 6; rowCount++){
  let row = document.createElement('div');
  row.id = `row${rowCount}`;
  row.className = 'row';
  for (let j = 1; j <= 5; j++){
    let num = document.createElement('div');
    num.innerHTML = '';
    num.classList.add('num');
    row.appendChild(num);
  }
  grid.appendChild(row);
}
twordleHTML.appendChild(grid);

//EVENT BOX GENERATION
let Bottom = document.createElement('div');
Bottom.id = 'bottom';
let eventbox = document.createElement('div');
eventbox.className = 'eventbox';
eventbox.innerHTML = `<h2>Pick a 5 letter word</h2>`;
let wordInput = document.createElement('input');
wordInput.type = 'password';
wordInput.placeholder = "I'll hide it, promise!";
wordInput.maxLength = 5;
eventbox.appendChild(wordInput);
let startButton = document.createElement('button');
startButton.id = 'start';
startButton.innerHTML = "Start!";
startButton.id = 'enter';
eventbox.appendChild(startButton);
Bottom.appendChild(eventbox);
twordleHTML.appendChild(Bottom);
let letStart = false;

let personalised = {
  "coollike" : "https://static-cdn.jtvnw.net/emoticons/v2/305274770/default/light/3.0",
  "lbx0": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_44ede65082fb45ef9473c9966c3cd9ea/default/light/3.0",
  "colloquialowl": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_607ddb2a873f4606b5397997c33b6bbf/default/light/3.0",
  "letsbrock": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_7d127fea0d5d481e886c7161d45b4d78/default/light/3.0",
  "arcasian": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_c889ae6320e74a29baa2e46bd6a6d0d6/default/light/3.0",
  "certainlylaz": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0f82cf9b2bcb41d3823ab0273c122208/default/dark/3.0",
  "geo_master": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_46ac106df68b4a5ba4907317b2b0aafa/default/dark/3.0",
  "sskarrlett": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9860c508ac1843f6a7f84345f97b9cd6/default/dark/3.0",
  "astoldbyangela": "https://cdn.discordapp.com/emojis/839227716720132126.webp",
  "cozygamerkat": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_75fa29d856ed4c1a979edcfe68c54448/default/light/3.0",
  "hellovonnie": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4020d73b73714c58aa091c82eb71a4b0/default/light/3.0",
  "elliotisacoolguy": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_6e7b14137a824c1fa175ff2d54d3414c/default/light/3.0",
  "gamesarehaunted": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b64a784799524986894c9b6110dee173/default/light/3.0",
}

if (personalised.hasOwnProperty(localStorage.getItem("channel"))){
  let titleText = title.getElementsByTagName("span")[0];
  titleText.classList.add('personalised');
  titleText.innerHTML = `<h1>Tw</h1><img style='height:2em' src='${personalised[user]}'></img><h1>rdle</h1>`
}

//SOUNDS
let roundStartSound = new Audio('../projects/twordle/round.mp3');
let winSound = new Audio('../projects/twordle/win.mp3');
roundStartSound.volume = localVolume/10;
winSound.volume = localVolume/10;

//WORD INPUT AND STARTING
wordInput.addEventListener('keyup', ()=>{
  if (wordInput.value.length === 5) {
    wordInput.classList.add('correct');
    startButton.style.opacity = 1;
    letStart = true;
    return;
  }
  wordInput.classList.remove('correct');
  startButton.style.opacity = 0.2;
})

startButton.addEventListener('click', ()=> {
  if (!letStart) return;
  THEWORD = wordInput.value.toUpperCase(); 
  ++stats.play
  saveStats();
  eventbox.innerHTML = '<h2>Starting round!</h2>';
  console.log('Starting!');
  setTimeout(()=>{
    beginGame();
  },1000);
})

function darkMode(){
  document.documentElement.setAttribute('data-theme', 'light');
  if (localDark){
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

darkMode();

newBody.appendChild(twordleHTML);
document.body.appendChild(newBody);

const canvas = document.getElementById('your_custom_canvas_id')
const jsConfetti = new JSConfetti({ canvas });

// GAMEPLAY

let wordsGuessed = [];
let guess = '';
let playing = false;
let refreshGame = false;
let correct = 0;
let maybe = 0;
let roundCount = 1;

let rowMessage = [
  'How did it go?',
  'I believe in you!',
  'Looking good!',
  'Wow!',
  'Nice one.',
  'That was close!',
  'Ooh, almost... maybe'
]

function finishRow(){
  roundCount = 1;
  gridCheck(true);
  wordsGuessed.push(guess);
  if (guess === THEWORD) return success();
  if (wordsGuessed.length === 6) return fail();
  guess = '';
  let secondLine = ``;
  if (maybe || correct) {
    let maybeText = ` letter${maybe > 1 ? 's' : '' } in the word,`;
    let correctText = ` letter${correct > 1 ? 's':''} correct!`;
    secondLine = `<p>${maybe ? maybe + maybeText + '<br>' : ''} ${correct ? correct + correctText : ''}</p>`
  }
  if (localKeyboard) secondLine = '';
  eventbox.innerHTML = `<h2>${rowMessage[getRandomInt(rowMessage.length)]}</h2>${secondLine}<button id="enter" onclick="newRound()">Next Letter</button>`;
  if (localAuto){
    setTimeout(()=>{
      if (document.getElementById('enter') && !playing) document.getElementById('enter').click();
    }, 5000)
  }
}

function gridCheck(finishedRow){
  let row = grid.firstChild;
  wordsGuessed.forEach((e, i) => {
    row = row.nextSibling;
  })
  addLetters(row, guess, finishedRow);
}

async function addLetters(row, input, finishedRow){
  correct = 0;
  maybe = 0;
  if (input.length < 5) {
    console.log('add highlight');
    row.children[input.length].classList.add('highlight');
  }
  row.children[input.length - 1].classList.remove('highlight');
  for (let p = 0; p < 5; p++){
    let block = row.children[p];
    if (input[p] === undefined) {
      block.innerHTML = '';
      return;
    }
    block.innerHTML = input[p];
    if (finishedRow) colourIn(p, block);
  }
  if (finishedRow){
    if (guess === THEWORD) return success();
    if (wordsGuessed.length === 6) return fail();
  }
}

async function colourIn(i, block){
  if (THEWORD.indexOf(guess[i]) === -1) {
    block.classList.add('wrong');
    if (document.getElementById(guess[i])){
      document.getElementById(guess[i]).classList.add('wrong');
    }
    return;
  }
  if (THEWORD[i] === guess[i]) {
    block.classList.add('correct');
    if (document.getElementById(guess[i])){
      document.getElementById(guess[i]).classList.add('correct');
    }
    ++correct;
    return;
  }
  block.classList.add('maybe');
  if (document.getElementById(guess[i])){
    let guesser = document.getElementById(guess[i]);
    guesser.classList.add('maybe');
  }
  ++maybe;
  return;
}

function newRound(){
  gridCheck(false);
  console.log('Starting a round!');
  playing = true;
  usersVoted = [];
  let untilRound = 4;
  var preroundTimer = setInterval(function() {
    --untilRound;
    eventbox.innerHTML =  `<h2>Round Opening in... ${untilRound}</h2>`;
    if (untilRound === 1) {
      clearInterval(preroundTimer);
      runRound();
    };
  }, 1000);
}

// This is to prevent random double rounds running
let roundRunning = false;

function runRound(){
  if (roundRunning) return;
  roundRunning = true;
  console.log('Round running!');
  reloadTimer();
  let timeLeft = localTimer + 1;
  roundStartSound.play();
  var roundClock = setInterval(function() {
    --timeLeft;
    eventbox.innerHTML =  `<h2>${timeLeft}</h2><p>${usersVoted.length} votes</p>`;
    if (timeLeft === 0) {
      clearInterval(roundClock);
      roundRunning = false;
      finishRound();
    };
  }, 1000);
}

const getMax = object => {
  return Object.keys(object).filter(x => {
    return object[x] == Math.max.apply(null, Object.values(object));
  }).map(x => x.toUpperCase());
};

function refreshPoll(){
  Object.keys(poll).forEach(key => {
    poll[key] = 0;
  });
}

function finishRound(){
  playing = false;
  let finalPoll = poll;
  let finalResult = getMax(finalPoll);
  let mainText, subText;
  let buttonText = 'Retry?';
  console.log(`== ROUND BREAKDOWN ==`)
  console.log(`${finalResult}`);
  console.log(`${finalPoll[finalResult[0]]}`);
  console.log(finalPoll);
  console.log('END BREAKDOWN');
  console.log('==========================');
  if (finalPoll[finalResult[0]] === 0) {mainText = 'No one entered!'; subText = ''}
  else if (finalResult.length > 1) {
    mainText = `Draw!`
    subText = `${finalResult.join(', ')} with ${finalPoll[finalResult[0]]} votes.`;
  };
  if (finalResult.length === 1) {
    guess = guess + finalResult;
    if (guess.length > roundCount) guess = guess.slice(0, -1);
    ++roundCount;
    buttonText = 'Next Letter';
    mainText = finalResult[0];
    subText = `(${finalPoll[finalResult]} votes)`;
  }
  eventbox.innerHTML = `<h2>${mainText}</h2><h4>${subText}</h4><button id="enter" onClick="newRound()">${buttonText}</button>`;
  
  if (guess.length === 5){
    eventbox.innerHTML = `<h2>${finalResult}</h2><h4>(${finalPoll[finalResult]} votes)</h4><button id="enter" onClick="finishRow()">Check Word</button>`;
    if (wordsGuessed.length === 5) eventbox.innerHTML = `<h2>${finalResult}</h2><p>Final chance! Good Luck!</p><button id="enter" onClick="finishRow()">Fingers Crossed!</button>`;
  }
  if (localAuto){
    setTimeout(()=>{
      if (document.getElementById('enter') && !playing) document.getElementById('enter').click();
    }, 5000)
  }
  stats.votes = stats.votes + usersVoted.length;
  saveStats();
  refreshPoll();
  // Don't gridcheck on draw.
  if (finalResult.length > 1) return;
  finalResult = [];
  gridCheck(false);
}

window.onunload = function() {
  if(refreshGame) --stats.play;
  saveStats();
}

function beginGame(){
  // Enable navigation prompt
  window.onbeforeunload = function() {
    return true;
  };
  refreshGame = true;

  if (spanishLangCheck()){
    Bottom.removeChild(document.getElementById('keyboard'));
    addKeyboard();
  }

  setTimeout(newRound, 3000);
}

function success(){
  // Remove navigation prompt
  window.onbeforeunload = null;
  refreshGame = false;
  ++stats.won;
  saveStats();
  jsConfetti.addConfetti();
  winSound.play();
  eventbox.innerHTML = '<h1>CONGRATS!</h1><button id="enter" onclick="location.reload()">Play again?</button>';
}

function fail(){
  // Remove navigation prompt
  window.onbeforeunload = null;
  refreshGame = false;
  eventbox.innerHTML = `<h1>FAILED!</h1><p>The word was ${THEWORD}</p><button id="enter" onclick="location.reload()">Play again?</button>`;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
} 

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("enter").click();
  }
});

// TESTING

if (params.demo){
  setInterval(() => {
    let keys = Object.keys(poll);
    let targetLetter = keys[getRandomInt(26)];
    let testingLetters = ['C','B','D'];
    //++poll['D'];
    //++poll[targetLetter];
    ++poll[testingLetters[getRandomInt(3)]]
  }, 2000);
}

// GRAPHICS & SCALING

function spanishLangCheck(){
  if (THEWORD){
    for (let otherCheck = 0; otherCheck < 5; otherCheck++){
      let characterCode = THEWORD.charCodeAt(otherCheck);
      if (characterCode >= 192 && characterCode <= 221){
        return true;
      }
    }
    return false;
  }
}

function addKeyboard(){
  let keyboard = document.createElement('div');
  keyboard.classList = 'keyboard';
  keyboard.id = 'keyboard';
  let qwerty = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];

  if (spanishLangCheck()) qwerty = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','Ñ'],
    ['Z','X','C','V','B','N','M']
  ]

  for (let line in qwerty){
    let row = document.createElement('div');
    row.className = 'keyRow';
    let letterLine = qwerty[line];
    for (let letter in letterLine){
      let key = document.createElement('div');
      key.id = letterLine[letter];
      key.classList = 'keyLetter';
      key.innerHTML = letterLine[letter];
      row.appendChild(key);
    }
    keyboard.appendChild(row);
  }
  Bottom.prepend(keyboard);
  scaleCheck();
}

if (localKeyboard) addKeyboard();

let scaleX = 1;
let scaleY = 1;

function scaleCheck(){
  let wordleheight = (window.innerHeight * 0.96);
  if (window.innerHeight < 900) wordleheight = window.innerHeight;
  let bottomHeight = Math.round(wordleheight * 0.2);
  let titleGrab = title.getBoundingClientRect();
  let titleSize = titleGrab.height;
  let keyHeight = bottomHeight * 0.5;

  let maxKeyboardHeight = 125
  let maxKeyRowHeight = 40;

  eventbox.style.maxHeight = `${bottomHeight}px`;
  if (localKeyboard) {
    bottomHeight = Math.round(wordleheight * 0.3);
    eventbox.style.maxHeight = `${bottomHeight - keyHeight}px`;
  }
  Bottom.style.height = `${bottomHeight}px`;
  if (window.innerHeight >= 1000) Bottom.style.height = 'max-content'

  //KEYBOARD
  if(localKeyboard){
    //if ((bottomHeight * 0.5) > maxKeyboardHeight) 
    keyHeight = maxKeyboardHeight;
    keyboard.style.height = `${keyHeight}px`;
    if (Math.round(bottomHeight * 0.1) < 13) keyboard.style.fontSize = `${Math.round(bottomHeight * 0.1)}px`;
    let keyRows = document.getElementsByClassName('keyRow');
    let keyLetters = document.getElementsByClassName('keyLetter');
    //max font size 15px 
    for (let r2 = 0; r2 < keyRows.length; r2++ ){
      let targetSize = Math.round(bottomHeight * 0.2);
      if (targetSize > maxKeyRowHeight) targetSize = maxKeyRowHeight;
      keyRows[r2].style.height = `${targetSize}px`
    }
    for (let l2 = 0; l2 < keyLetters.length; l2++ ){
      if (Math.round(bottomHeight * 0.1) < 13) {
        keyLetters[l2].style.padding = `0px ${Math.round(bottomHeight*0.1)}px`
      } else {
        keyLetters[l2].style.padding = `0px 13px`
      }
    }
  }

  //Grid
  let gridSize = wordleheight - bottomHeight - titleSize;
  if (gridSize > 420) gridSize = 420;
  grid.style.height = `${gridSize}px`;
  grid.style.width = `${gridSize * (5/6)}px`;
  Bottom.style.minWidth = `${gridSize * (5/6)}px`;
  eventbox.style.minWidth = `${gridSize * (25/27)}px`;
  let rows = document.getElementsByClassName('row');
  let numbs = document.getElementsByClassName('num');
  for (let r = 0; r < rows.length; r++ ){
    rows[r].style.height = `${gridSize / 6}px`;
    rows[r].style.width = `${gridSize * (5/6)}px`
  }
  for (let n = 0; n < numbs.length; n++){
    numbs[n].style.height = `${gridSize / 7}px`;
    numbs[n].style.width = `${gridSize / 7}px`;
  }
}

scaleCheck();
window.addEventListener('resize', () => {
  scaleCheck();
  setTimeout(scaleCheck(), 500);
});
