const urlParams = new URLSearchParams(window.location.search);
const params = {
  u: urlParams.get('channel'),
}

//USERNAME POP UP
if (!params.u){
  
  let userpopup = document.createElement('div');
  let innerPopUp = document.createElement('div');
  let userInput = document.createElement('input');
  let submit = document.createElement('button');
  let targetUser = '';

  userpopup.id = 'popup';
  innerPopUp.id = 'innerPopUp';
  innerPopUp.innerHTML = "<h1>Input a username!</h1><p>If you want to play with chat, put in your username below</p>";
  userInput.placeholder = "[Channel Name Here]";
  userInput.id = 'channel';
  submit.innerHTML = 'Go!';

  innerPopUp.appendChild(userInput);
  innerPopUp.appendChild(submit);
  userpopup.appendChild(innerPopUp);
  document.body.appendChild(userpopup);

  userInput.addEventListener('keyup', ()=>{
    targetUser = userInput.value;
  })
  submit.addEventListener('click', () =>{
    window.open(`http://colloquial.studio/twordle?channel=${targetUser}`,"_self");
  })
}

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
}
let THEWORD = '';

//Create Poll
let poll = {};
let usersVoted = [];
for (let i = 0; i < 26; i++){
  poll[String.fromCharCode(i + 65)] = 0;
}
let pollRunning = false; 
console.log(poll);

//GRID GENERATION
let newBody = document.createElement('div');
newBody.id = 'twordleBody';
let twordleHTML = document.createElement('div');
twordleHTML.id = 'twordle';
let title = document.createElement('div');
title.innerHTML = "<h1>Twordle</h1><p>Made by <a href='https://www.twitch.tv/colloquialowl'>ColloquialOwl</a>, Inspired by <a href='https://www.powerlanguage.co.uk/wordle/'>Wordle</a>.</p>"
title.classList.add('Title');
twordleHTML.appendChild(title);
let grid = document.createElement('div');
for (let i = 1; i <= 6; i++){
  let row = document.createElement('div');
  row.id = `row${i}`;
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
eventbox.appendChild(startButton);
twordleHTML.appendChild(eventbox);
// POTENTIAL RANDOM WORD GEN
/* let extraButton = document.createElement('button');
extraButton.innerHTML ='Random Word!';
eventbox.appendChild(extraButton); */
let letStart = false;

//SOUNDS
let roundStartSound = new Audio('./projects/twordle/race.mp3');

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
    eventbox.innerHTML = `<h2>${rowMessage[getRandomInt(rowMessage.length)]}</h2><button id="enter" onclick="newRound()">Next Letter</button>`;
    console.log(wordsGuessed);
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
    console.log('getting here');
    if (guess === THEWORD) return success();
    if (wordsGuessed.length === 6) return fail();
  }
}

async function colourIn(i, block){
  if (THEWORD.indexOf(guess[i]) === -1) {
    block.classList.add('wrong');
    return;
  }
  if (THEWORD[i] === guess[i]) {
    block.classList.add('correct');
    return;
  }
  block.classList.add('maybe');
  return;
}

function newRound(){
  Object.keys(poll).forEach(key => {
    poll[key] = 0;
  });
  usersVoted = [];
  let i = 4;
  var preroundTimer = setInterval(function() {
    --i;
    eventbox.innerHTML =  `<h2>Round Opening in... ${i}</h2>`;
    if (i === 1) {
      clearInterval(preroundTimer);
      runRound();
    };
  }, 1000);
}

let roundTimer = 30;

function runRound(){
  let i = roundTimer + 1;
  roundStartSound.play();
  var roundClock = setInterval(function() {
    //if (usersVoted.length > 0) votedBubble.style.visibility = 'visible';
    --i;
    eventbox.innerHTML =  `<h2>${i}</h2><p>${usersVoted.length} votes</p>`;
    votedBubble.innerHTML = `${usersVoted.join(' voted!<br>')} voted!`;
    //if (usersVoted.length === 1) votedBubble.innerHTML = `${usersVoted[0]} voted!`;
    if (i === 0) {
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
  let finalPoll = poll;
  let finalResult = getMax(finalPoll);
  let printText; 
  let buttonText = 'Retry?';
  console.log('== ROUND BREAKDOWN ==');
  console.log(finalPoll);
  console.log(finalResult);
  console.log("votes: " + finalPoll[finalResult[0]]);
  if (finalPoll[finalResult[0]] === 0) {printText = 'No one entered!'}
  else if (finalResult.length > 1) printText = `<h2>Draw!</h2><br>${finalResult} with ${finalPoll[finalResult[0]]} votes.`;
  if (finalResult.length === 1) {
    guess = guess + finalResult;
    buttonText = 'Next Letter';
    printText = finalResult[0];
  }
  eventbox.innerHTML = `<h2>${printText}</h2><h4>(${finalPoll[finalResult]} votes)</h4><button id="enter" onClick="newRound()">${buttonText}</button>`;
  if (guess.length === 5){
    eventbox.innerHTML = `<h2>${finalResult}</h2><h4>(${finalPoll[finalResult]} votes)</h4><button id="enter" onClick="runRow()">Check Word</button>`;
    if (wordsGuessed.length === 5) eventbox.innerHTML = `<h2>${finalResult}</h2><br><p>Final chance! Good Luck!</p><button id="enter" onClick="runRow()">Fingers Crossed!</button>`;
  } 
  gridCheck(false);
}

function beginGame(){
  setTimeout(newRound, 3000);
}

function success(){
  jsConfetti.addConfetti();
  eventbox.innerHTML = '<h1>CONGRATS!</h1><button id="enter" onclick="location.reload()">Play again?</button>';
}

function fail(){
/*   var rows = document.getElementsByClassName('row');
  for (var i = 0; i < rows.length; i++) {
    rows[i].style.backgroundColor = 'red';
  } */
  eventbox.innerHTML = '<h1>FAILED!</h1><button id="enter" onclick="location.reload()">Play again?</button>';
}

if (params.u){
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
  ++poll['D'];
  ++poll[targetLetter];
  ++poll[testingLetters[getRandomInt(3)]]
}, 2000); */