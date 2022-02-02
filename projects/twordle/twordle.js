const urlParams = new URLSearchParams(window.location.search);
const params = {
  u: urlParams.get('channel'),
  round: urlParams.get('round'),
  levi: urlParams.get('levi'),
  auto: urlParams.get('auto'),
  dark: urlParams.get('dark'),
  keyboard: urlParams.get('keyboard')
}

if (params.levi) params.dark = params.levi;
params.dark = (params.dark === 'true');
console.log(params.dark);
params.auto = (params.auto === 'true');
params.keyboard = (params.keyboard === 'true');

//USERNAME POP UP

let toast = document.createElement('div');
toast.style.transform = "scale(0)"
toast.id = 'toast';
document.body.appendChild(toast);

if (params.u){
  const client = new tmi.Client({
    channels: [params.u]
  });
  client.on("connected", () => {
    console.log('Reading from Twitch! ✅');
    toast.innerHTML = `Connected to ${params.u} chat`;
    toast.style.visibility = 'visible';
    toast.style.transform = "scale(1)";
    setTimeout(()=>{
      toast.style.transform = "scale(0)";
    }, 5000)
  })
  client.connect();
  client.on('message', (channel, tags, message, self) => {
    let upper = message.toUpperCase();
    if (message.length === 1 && !usersVoted.includes(tags.username)){
      let characterCode = upper.charCodeAt(0);
      if (characterCode >= 65 && characterCode <= 91){
        ++poll[upper];
        usersVoted.push(tags.username);
        console.log(`${tags.username} has voted!`);
        console.log(poll);
      }
    } else if (message.length === 1 && usersVoted.includes(tags.username)){
      console.log(`${tags.username} has already voted!`);
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
title.innerHTML = "<h1>Twordle</h1><p>Made by <a href='https://www.twitch.tv/colloquialowl'>ColloquialOwl</a>, Inspired by <a href='https://www.powerlanguage.co.uk/wordle/'>Wordle</a>.</p><button onclick='howTo()'>How to Play</button>"
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

//SOUNDS
let roundStartSound = new Audio('./projects/twordle/race.mp3');
roundStartSound.volume = 0.3;

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
  eventbox.innerHTML = '<h2>Starting round!</h2>';
  console.log('Starting!');
  setTimeout(()=>{
    beginGame();
  },1000);
})

function darkMode(){
  document.documentElement.setAttribute('data-theme', 'light');
  if (params.dark){
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


let wordsGuessed = [];
let guess = '';
let playing = false;
let correct = 0;
let maybe = 0;

let rowMessage = [
  'How did it go?',
  'I believe in you!',
  'Looking good!',
  'Wow!',
  'Nice one.',
]

function runRow(){
  
  gridCheck(true);
  wordsGuessed.push(guess);
  if (guess === THEWORD){
    return success();
  } else if (wordsGuessed.length === 6) {
    return fail(); 
  } else {
    guess = '';
    let secondLine = ``;
    if (maybe || correct) {
      let maybeText = ` letter${maybe > 1 ? 's' : '' } in the word,`;
      let correctText = ` letter${correct > 1 ? 's':''} correct!`;
      secondLine = `<p>${maybe ? maybe + maybeText + '<br>' : ''} ${correct ? correct + correctText : ''}</p>`
    }
    if (params.keyboard) secondLine = '';
    eventbox.innerHTML = `<h2>${rowMessage[getRandomInt(rowMessage.length)]}</h2>${secondLine}<button id="enter" onclick="newRound()">Next Letter</button>`;
    console.log(wordsGuessed);
  }
  if (params.auto){
    setTimeout(()=>{
      if (document.getElementById('enter') && !playing) document.getElementById('enter').click();
    }, 5000)
  }
}

function gridCheck(finishedRow){
  
  let row = grid.firstChild;
  wordsGuessed.forEach((e, i) => {
    fillIn(row, e, false);
    row = row.nextSibling;
    console.log(row);
  })
  fillIn(row, guess, finishedRow);
}

async function fillIn(row, input,  finishedRow){
  correct = 0;
  maybe = 0;
  for (let p = 0; p < 5; p++){
    console.log(input);
    let block = row.children[p];
    if (input[p] === undefined) return;
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
    if (!guesser.contains('correct')) guesser.classList.add('maybe');
  }
  ++maybe;
  return;
}

function newRound(){
  playing = true;
  Object.keys(poll).forEach(key => {
    poll[key] = 0;
  });
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

let roundTimer = parseInt(params.round) || 30;

function runRound(){

  playing = true;
  let timeLeft = roundTimer + 1;
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
      finishRound();
    };
  }, 1000);
}

const getMax = object => {
  return Object.keys(object).filter(x => {
    return object[x] == Math.max.apply(null, Object.values(object));
  }).map(x => x.toUpperCase());
};

function finishRound(){
  playing = false;
  let finalPoll = poll;
  let finalResult = getMax(finalPoll);
  let mainText, subText;
  let buttonText = 'Retry?';
  console.log('== ROUND BREAKDOWN ==');
  console.log(finalPoll);
  console.log(finalResult);
  console.log("votes: " + finalPoll[finalResult[0]]);
  if (finalPoll[finalResult[0]] === 0) {mainText = 'No one entered!'; subText = ''}
  else if (finalResult.length > 1) {
    mainText = `Draw!`
    subText = `${finalResult.join(', ')} with ${finalPoll[finalResult[0]]} votes.`;
  };
  if (finalResult.length === 1) {
    guess = guess + finalResult;
    buttonText = 'Next Letter';
    mainText = finalResult[0];
    subText = `(${finalPoll[finalResult]} votes)`
  }
  eventbox.innerHTML = `<h2>${mainText}</h2><h4>${subText}</h4><button id="enter" onClick="newRound()">${buttonText}</button>`;
  
  if (guess.length === 5){
    eventbox.innerHTML = `<h2>${finalResult}</h2><h4>(${finalPoll[finalResult]} votes)</h4><button id="enter" onClick="runRow()">Check Word</button>`;
    if (wordsGuessed.length === 5) eventbox.innerHTML = `<h2>${finalResult}</h2><br><p>Final chance! Good Luck!</p><button id="enter" onClick="runRow()">Fingers Crossed!</button>`;
  }
  if (params.auto){
    setTimeout(()=>{
      if (document.getElementById('enter') && !playing) document.getElementById('enter').click();
    }, 5000)
  }
  gridCheck(false);
}

function beginGame(){
  setTimeout(newRound, 3000);
}

if (params.keyboard){
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
  //Bottom.prependChild(keyboard);
} else {
  Bottom.style.height = '17vh';
  title.style.height = '21vh';
  twordleHTML.style.transform = 'scale(1.2)';
}

let scaleX = 1;
let scaleY = 1;


/* function scaleCheck(){
  let twordlePlace = twordleHTML.getBoundingClientRect();
  //let scale = (window.innerHeight / twordlePlace.height) - 0.1;
  scaleX = window.innerWidth / (twordlePlace.width / scaleX);
  scaleY = window.innerHeight / (twordlePlace.height /scaleY);
  scaleX = Math.min(scaleX, scaleY);
  scaleY = scaleX;

  //console.log(twordlePlace);
  console.log(scaleY);
  //console.log(scale);
  twordleHTML.style.transform = `scale(${scaleX})`;
}

scaleCheck(); */

function success(){
  jsConfetti.addConfetti();
  eventbox.innerHTML = '<h1>CONGRATS!</h1><button id="enter" onclick="location.reload()">Play again?</button>';
}

function fail(){
  eventbox.innerHTML = '<h1>FAILED!</h1><button id="enter" onclick="location.reload()">Play again?</button>';
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
/* setInterval(() => {
  let keys = Object.keys(poll);
  let targetLetter = keys[getRandomInt(26)];
  let testingLetters = ['C','B','D'];
  //++poll['D'];
  //++poll[targetLetter];
  ++poll[testingLetters[getRandomInt(3)]]
}, 2000); */