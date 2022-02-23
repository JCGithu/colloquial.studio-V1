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

//localStorage.setItem('stats', JSON.stringify(stats));

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
  console.log('localDark' + localDark);
}
if (localStorage.getItem("keyboard")) {
  localKeyboard = (localStorage.getItem('keyboard') === 'true');
}
if (localStorage.getItem("volume")) {
  localVolume = parseInt(localStorage.getItem('volume'));
}

function reloadTimer(){
  if (localStorage.getItem("timer")) {
    localTimer = parseInt(localStorage.getItem('timer'));
  }
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
    toast.innerHTML = `Connected to ${user} chat`;
    toast.style.visibility = 'visible';
    toast.style.transform = "scale(1)";
    setTimeout(()=>{
      toast.style.transform = "scale(0)";
    }, 5000)
  })
  client.connect();
  client.on('message', (channel, tags, message, self) => {
    if (message.length > 1) return;
    let upper = message.toUpperCase();
    if (usersVoted.includes(tags.username)){
      console.log(`${tags.username} has already voted!`);
      return
    }
    let characterCode = upper.charCodeAt(0);
    if (characterCode >= 65 && characterCode <= 91){
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
console.log(poll);

//GRID GENERATION
let newBody = document.createElement('div');
newBody.id = 'twordleBody';
let twordleHTML = document.createElement('div');
twordleHTML.id = 'twordle';
let title = document.createElement('div');
title.innerHTML = `<h1>Twordle</h1><p>Made by <a href='https://www.twitch.tv/colloquialowl'>ColloquialOwl</a>, Inspired by <a href='https://www.powerlanguage.co.uk/wordle/'>Wordle</a>.</p><button onclick='howTo()'>How to Play</button>`
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
  "coollike" : "https://static-cdn.jtvnw.net/emoticons/v2/304037430/default/light/3.0",
  "lbx0": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_44ede65082fb45ef9473c9966c3cd9ea/default/light/3.0",
  "letsbrock": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_7d127fea0d5d481e886c7161d45b4d78/default/light/3.0",
  "arcasian": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_e79955dcfb654887bd08f4d551583d97/default/light/3.0",
  "certainlylaz": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0f82cf9b2bcb41d3823ab0273c122208/default/dark/3.0"
}

if (personalised.hasOwnProperty(localStorage.getItem("channel"))){
  let streamerIcon = document.createElement('img');
  streamerIcon.src = personalised[user];
  streamerIcon.id = 'charlie';
  eventbox.appendChild(streamerIcon);
}

//SOUNDS
let roundStartSound = new Audio('../projects/twordle/race.mp3');
roundStartSound.volume = localVolume/10;

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

let votedBubble = document.createElement('div');
votedBubble.id = 'voted';
let gridPos = grid.getBoundingClientRect();
votedBubble.innerHTML = '';
votedBubble.style.left = `${gridPos.right}px`;
votedBubble.style.top = `${gridPos.top}px`;
document.body.appendChild(votedBubble);
console.log(gridPos);

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
  console.log(wordsGuessed);
  if (localAuto){
    setTimeout(()=>{
      if (document.getElementById('enter') && !playing) document.getElementById('enter').click();
    }, 5000)
  }
}

function gridCheck(finishedRow){
  let row = grid.firstChild;
  console.log(`playing gridCheck for ${guess}`);
  wordsGuessed.forEach((e, i) => {
    //addLetters(row, e, false);
    row = row.nextSibling;
  })
  addLetters(row, guess, finishedRow, true);
}

async function addLetters(row, input, finishedRow, testing){
  if (testing) console.log(`fill in playing for ${input}`);
  correct = 0;
  maybe = 0;
  for (let p = 0; p < 5; p++){
    let block = row.children[p];
    if (input[p] === undefined) {
      block.innerHTML = '';
      return;
    }
    block.innerHTML = input[p];
    if (finishedRow){
      colourIn(p, block);
    }
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

function runRound(){
  console.log('Starting a round!');
  reloadTimer();
  let timeLeft = localTimer + 1;
  roundStartSound.play();
  var roundClock = setInterval(function() {
    //if (usersVoted.length > 0) votedBubble.style.visibility = 'visible';
    --timeLeft;
    eventbox.innerHTML =  `<h2>${timeLeft}</h2><p>${usersVoted.length} votes</p>`;
    votedBubble.innerHTML = `${usersVoted.join(' voted!<br>')} voted!`;
    //if (usersVoted.length === 1) votedBubble.innerHTML = `${usersVoted[0]} voted!`;
    if (timeLeft === 0) {
      //votedBubble.style.visibility = 'hidden';
      clearInterval(roundClock);
      console.log('run finishRound');
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
  refreshPoll();
  saveStats();
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
  setTimeout(newRound, 3000);
}

function addKeyboard(){
  let keyboard = document.createElement('div');
  keyboard.classList = 'keyboard';
  keyboard.id = 'keyboard';
  let qwerty = [['Q','W','E','R','T','Y','U','I','O','P'], ['A','S','D','F','G','H','J','K','L'], ['Z','X','C','V','B','N','M']];
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
}

if (localKeyboard) addKeyboard();

let scaleX = 1;
let scaleY = 1;


function scaleCheck(){
  let wordleheight = (window.innerHeight * 0.96);
  if (window.innerHeight < 900) wordleheight = window.innerHeight;
  let bottomHeight = Math.round(wordleheight * 0.2);
  console.log(bottomHeight);
  let titleGrab = title.getBoundingClientRect();
  let titleSize = titleGrab.height;
  let keyHeight = bottomHeight * 0.5;
  console.log(bottomHeight);
  console.log(keyHeight);

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
    console.log(keyHeight);
    keyboard.style.height = `${keyHeight}px`;
    if (Math.round(bottomHeight * 0.1) < 13) keyboard.style.fontSize = `${Math.round(bottomHeight * 0.1)}px`;
    let keyRows = document.getElementsByClassName('keyRow');
    let keyLetters = document.getElementsByClassName('keyLetter');
    //max font size 15px 
    for (let r2 = 0; r2 < keyRows.length; r2++ ){
      let targetSize = Math.round(bottomHeight * 0.2);
      console.log('target size ' + targetSize)
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

function success(){
  // Remove navigation prompt
  window.onbeforeunload = null;
  refreshGame = false;
  ++stats.won;
  saveStats();
  jsConfetti.addConfetti();
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
    document.get
    document.getElementById("enter").click();
  }
});

//TEST INPUTS

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
