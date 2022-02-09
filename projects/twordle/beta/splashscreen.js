if (localStorage.getItem("autoMode") === null) {
  let userpopup = document.createElement('div');
  let innerPopUp = document.createElement('div');
  let targetUser = '';

  userpopup.id = 'popup';
  innerPopUp.id = 'innerPopUp';
  innerPopUp.innerHTML = `
    <h1>Input a username!</h1>
    <p>If you want to play with chat, put in your username below</p>
    <input placeholder = "[Channel Name Here]" id="channel"></input>
    <div id='thebuttons'>
      <label class="checkContainer">Dark Mode
        <input type="checkbox" id="Dark Mode" class="check">
        <span class="checkmark"></span>
      </label>
      <label class="checkContainer">Auto Mode
        <input type="checkbox" id="Auto Mode" class="check">
        <span class="checkmark"></span>
      </label>
      ${onMobile ? '':'<label class="checkContainer">Keyboard<input type="checkbox" id="Keyboard" class="check"><span class="checkmark"></span>'}
    </label>
    </div>

    <div>
      Round Timer
      <input type='number' value="25" id="Round Timer"></input>
    </div>
    <button id='newURL'>Go!</button>
  `;

  userpopup.appendChild(innerPopUp);
  document.body.appendChild(userpopup);
  
  let userInput = document.getElementById('channel');
  let submit = document.getElementById('newURL');
  let autoMode = document.getElementById('Auto Mode');
  let darkMode = document.getElementById('Dark Mode');
  let keyboard = null;
  if (!onMobile) keyboard = document.getElementById('keyboard');

  userInput.addEventListener('keyup', ()=>{
    targetUser = userInput.value;
  });

  submit.addEventListener('click', () => {
    localStorage.setItem('channel', targetUser);
    localStorage.setItem('autoMode', autoMode.checked);
    localStorage.setItem('darkMode', darkMode.checked);
    if (!onMobile) localStorage.setItem('keyboard', keyboard.checked);
    localStorage.setItem('timer', document.getElementById('Round Timer').value)
    location.reload();
  })
}