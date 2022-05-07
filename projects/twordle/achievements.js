let awards = {
  '1Round': {
    title: "Predictable?",
    subtitle: "Chat won in a single round. Clearly you are verrrry hard to read.",
    icon: "../projects/twordle/square.svg",
    status: 0
  },
  '2Round': {
    title: "Two-timer",
    subtitle: "Chat guessed the word in two turns",
    icon: "",
    status: 0
  },
  '3Round': {
    title: "",
    subtitle: "",
    icon: "",
    status: 0
  },
  '4Round': {
    title: "",
    subtitle: "",
    icon: "",
    status: 0
  },
  '5Round': {
    title: "",
    subtitle: "",
    icon: "",
    status: 0
  },
  '6Round': {
    title: "Clutch",
    subtitle: "Chat just eeked out a win on round 6",
    icon: "",
    status: 0
  },
  'UniqueWord': {
    title: "",
    subtitle: "",
    icon: "",
    status: 0
  },
  'AllSameLetter': {
    title: "Helpful",
    subtitle: "Chat picked the same letter 5 times",
    icon: "",
    status: 0
  },
  'SpeedRun': {
    title: "Twordle Any%",
    subtitle: "Beat the game with a timer under 5 seconds",
    icon: "",
    status: 0
  },
  '100Votes': {
    title: "Triple Digits",
    subtitle: "Get over 100 votes total",
    icon: "",
    status: 0
  },
  '1000Votes': {
    title: "Big Leagues",
    subtitle: "Get 1000 votes from chat",
    icon: "",
    status: 0
  },
  '10000Votes': {
    title: "MVP",
    subtitle: "Get 10000 votes from chat. I honestly don't expect anyone to get this.",
    icon: "",
    status: 0
  },
  '10Games': {
    title: "Gamer",
    subtitle: "Played 10 games of Twordle. This automatically bestows the title of 'gamer' upon thee.",
    icon: "",
    status: 0
  },
};

if (localStorage.getItem('awards')){
  awards = JSON.parse(localStorage.getItem('awards'));
} else {
  localStorage.setItem('awards', JSON.stringify(awards));
}

let cup = document.createElement('img');
cup.src = '../projects/twordle/cup.svg';
cup.id = 'cup';

let trophies = document.createElement('div');
trophies.id = 'trophies';
trophies.className = 'menu'
trophies.innerHTML = `
<div class='innerMenu'>
  <h1>Achievements!</h1>
  <div>
  </div>
  <button onclick="closeTrophies()">Close</button>
  </div>
`

function closeTrophies(){
  document.getElementById('trophies').classList.remove('openMenu');
}

document.body.appendChild(trophies);

cup.addEventListener('click', () => {
  console.log('opening!')
  trophies.classList.add('openMenu');
})

titleSelect[0].appendChild(cup);