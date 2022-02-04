if (!params.u){
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

  userInput.addEventListener('keyup', ()=>{
    targetUser = userInput.value;
  });

  submit.addEventListener('click', () =>{
    let urlArray = [`channel=${targetUser}`];
    urlArray.push(`dark=${darkMode.checked}`);
    urlArray.push(`auto=${autoMode.checked}`);
    if (onMobile) {
      let keyboard = document.getElementById('Keyboard');
      urlArray.push(`keyboard=${keyboard.checked}`);
    }
    urlArray.push(`round=${document.getElementById('Round Timer').value}`)
    window.open(`http://colloquial.studio/twordle/beta?${urlArray.join('&')}`,"_self");
  })
}