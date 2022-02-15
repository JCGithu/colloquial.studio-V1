let cog = document.createElement('img');
cog.src = '../projects/twordle/cog.svg';
cog.id = 'cog';

let settings = document.createElement('div');
settings.id = 'settings';
settings.innerHTML = `
<div id='innerSettings'>
  <h1>Settings!</h1>
  <p>Change channel</p>
  <input placeholder = "[Channel Name Here]" id="channel"></input>
  <button onclick="localStorage.setItem('channel', document.getElementById('channel').value);location.reload();">Refresh!</button>
  <br>
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
  Round Timer
  <input type='number' value="25" id="Round Timer"></input>
  <div id='stats'>
    <p>Total Votes: ${stats.votes}</p>
    <p>Games Played: ${stats.play}</p>
    <p>Games Won: ${stats.won}</p>
  </div>
  <button onclick="console.log('worked!');document.getElementById('settings').classList.remove('openSettings')">Close</button>
  </div>
`
document.body.appendChild(settings);

let darkModeCheck = document.getElementById('Dark Mode');
darkModeCheck.checked = localDark;
let autoCheck = document.getElementById('Auto Mode');
autoCheck.checked = localAuto;
let keyboardCheck = document.getElementById('Keyboard') || null;
keyboardCheck.checked = localKeyboard;
let timerCheck = document.getElementById('Round Timer');
timerCheck.value = localTimer;

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

cog.addEventListener('click', () => {
  console.log('opening!')
  settings.classList.add('openSettings');
})

document.body.appendChild(cog);