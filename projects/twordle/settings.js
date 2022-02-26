let cog = document.createElement('img');
cog.src = '../projects/twordle/cog.svg';
cog.id = 'cog';

let settings = document.createElement('div');
settings.id = 'settings';
settings.className = 'menu';
settings.innerHTML = `
<div class='innerMenu'>
  <h1>Settings!</h1>
  <p>Change channel</p>
  <div class='stackHorz'>
    <input placeholder = "[Channel Name Here]" id="channel"></input>
    <button onclick="localStorage.setItem('channel', document.getElementById('channel').value);location.reload();">Refresh!</button>
  </div>
  <div class='stackHorz'>
    <p id='volText'>Volume 🔊 </p>
    <input id='volume' type='range' max='10' min='0'></input>
  </div>
  <div id='thebuttons'>
    <label class="checkContainer">Dark Mode
      <input type="checkbox" id="Dark Mode" class="check">
      <span class="checkmark"></span>
    </label>
    <label class="checkContainer">Auto Mode
      <input type="checkbox" id="Auto Mode" class="check">
      <span class="checkmark"></span>
    </label>
  ${onMobile ? '':'<label class="checkContainer">Keyboard<input type="checkbox" id="Keyboard" class="check"><span class="checkmark"></span></label>'}
  </div>
  <div class='stackVert'>
    Round Timer
    <input type='number' value="25" id="Round Timer"></input>
  </div>
  <div id='stats' class='stackVert'>
    <p>Total Votes: ${stats.votes}</p>
    <p>Games Played: ${stats.play}</p>
    <p>Games Won: ${stats.won}</p>
    <p class='version'><a href='https://discord.gg/Svw7utAyNr'>For updates/issues check Discord</a></p>
  </div>
  <button onclick="undoMove()">Undo Move</button>
  <button onclick="closeSettings()">Close</button>
  </div>
`

function closeSettings(){
  document.getElementById('settings').classList.remove('openMenu');
  if (roundStartSound) roundStartSound.volume = localVolume/10;
  if (winSound) winSound.volume = localVolume/10;
}


document.body.appendChild(settings);

let channelCheck = document.getElementById('channel');
let darkModeCheck = document.getElementById('Dark Mode');
darkModeCheck.checked = localDark;
let autoCheck = document.getElementById('Auto Mode');
autoCheck.checked = localAuto;
let keyboardCheck = document.getElementById('Keyboard') || null;
keyboardCheck.checked = localKeyboard;
let timerCheck = document.getElementById('Round Timer');
timerCheck.value = localTimer;
let volumeCheck = document.getElementById('volume');
volumeCheck.value = localVolume;

let statBox = document.getElementById('stats');


darkModeCheck.addEventListener('change', () => {
  console.log(darkModeCheck.checked);
  localStorage.setItem("darkMode", darkModeCheck.checked);
  localDark = darkModeCheck.checked;
  darkMode();
})

keyboardCheck.addEventListener('change', () => {
  console.log(keyboardCheck.checked);
  localStorage.setItem("keyboard", keyboardCheck.checked);
  localKeyboard = keyboardCheck.checked;
  if (localKeyboard) {
    addKeyboard();
  } else {
    Bottom.removeChild(document.getElementById('keyboard'));
  }
})

autoCheck.addEventListener('change', () => {
  localStorage.setItem("autoMode", autoCheck.checked);
  localAuto = autoCheck.checked;
})

timerCheck.addEventListener('change', () => {
  localStorage.setItem("timer", timerCheck.value);
  localTimer = timerCheck.value;
})

if (volumeCheck.value == 0) {
  volText.innerText = 'Volume 🔇'
  volumeCheck.classList.add('volRed');
}

volumeCheck.addEventListener('change', () => {
  localStorage.setItem('volume', volumeCheck.value);
  let volText = document.getElementById('volText');
  volumeCheck.classList.remove('volRed');
  volText.innerText = 'Volume 🔊 '
  if (volumeCheck.value == 0) {
    volText.innerText = 'Volume 🔇'
    volumeCheck.classList.add('volRed');
  }
  localVolume = volumeCheck.value;
});

function undoMove(){
  if (guess) guess = guess.slice(0, -1);
  gridCheck(false);
  if (document.getElementById('enter').innerText === 'Check Word'){
    let buttonTarget = document.getElementById('enter')
    buttonTarget.onclick = newRound;
    buttonTarget.innerText = 'Next Letter';
  }
}


cog.addEventListener('click', () => {
  if (localStorage.getItem('channel')) channelCheck.placeholder = localStorage.getItem('channel');
  console.log('opening!')
  settings.classList.add('openMenu');
})

/* let twordleSize = twordleHTML.getBoundingClientRect();
console.log(); */
let titleSelect = document.getElementsByClassName('Title');
console.log(titleSelect);
titleSelect[0].appendChild(cog);