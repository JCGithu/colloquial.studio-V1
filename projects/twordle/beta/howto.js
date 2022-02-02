
function howTo(){
  let howTopopup = document.createElement('div');
  let innerPopUp = document.createElement('div');
  let htmlEntry = `
  <h2>How to Play!</h2>
  <p>
    Twordle is a word game to play with Twitch chat. <br><br>
    The streamer enters a 5 letter secret word. Each round chat must guess, one letter at a time, what the word is. <br><br>
    When a round starts any single letters written in chat count as a vote. The letter with the most votes gets put on the grid. <br> Example: <code>e</code><code>P</code><br><br>
    At the end of each row the blocks will colour in to reveal how close chat is to the secret word. Beige means the letter is not in the word, Orange means it is in the word, and green means that the letter is in the correct place. <br>
  </p>
  <div id='boxbox'>
    <span style='opacity: 0.6'>X</span>
    <span>O</span>
    <span>✓</span>
  </div>
  <p>
    It's advised that chat <i>try</i> to write <i>actual</i> words. <br>
    If you want to use this as a handsfree BRB screen, click 'auto mode'!
  </p>
  <div>
    <button id='closehow'>I get it!</button>
  </div>
  `; 

  howTopopup.id = 'popup';
  innerPopUp.id = 'howTo';
  innerPopUp.innerHTML = htmlEntry;
  howTopopup.appendChild(innerPopUp);
  document.body.appendChild(howTopopup);

  let closeButton = document.getElementById('closehow');
  closeButton.addEventListener('click', ()=>{
    document.body.removeChild(document.getElementById('popup'));
  })

}