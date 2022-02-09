let cog = document.createElement('img');
cog.src = '../projects/twordle/cog.svg';
cog.id = 'cog';

let settings = document.createElement('div');
settings.id = 'popup';
settings.innerHTML = `
<div id='settings'>
  <h1>Settings!</h1>
  <p>Change channel</p>
  <input placeholder = "[Channel Name Here]" id="channel"></input>
  <button onclick="localStorage.setItem('channel', document.getElementById('channel').value);location.reload();">Refresh!</button>
  <br>
  <label class="checkContainer">Dark Mode
    <input type="checkbox" id="Dark Mode" class="check">
    <span class="checkmark"></span>
  </label>
  <label class="checkContainer">Auto Mode
    <input type="checkbox" id="Auto Mode" class="check">
    <span class="checkmark"></span>
  </label>
  ${onMobile ? '':'<label class="checkContainer">Keyboard<input type="checkbox" id="Keyboard" class="check"><span class="checkmark"></span></label>'}
  Round Timer
  <input type='number' value="25" id="Round Timer"></input>
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