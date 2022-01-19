const urlParams = new URLSearchParams(window.location.search);
const params = {
  u: urlParams.get('channel'),
  font: urlParams.get('font'),
  align: urlParams.get('align'),
  fontsize: urlParams.get('fontsize'),
  chatcolour: urlParams.get('chatcolour'),
  highcolour: urlParams.get('highcolour'),
  bgcolour: urlParams.get('bgcolour'),
  fontcolour: urlParams.get('fontcolour'),
  bgopacity: urlParams.get('bgopacity'),
  togglecol: urlParams.get('togglecol'),
  badges: urlParams.get('badges'),
  bttv: urlParams.get('bttv'),
  hidebot: urlParams.get('hidebot'),
  hidecom: urlParams.get('hidecom'),
}
const badgeData = {};
var bttvEmoteCache = [];

const settings = {
  base: 'https://colloquial.studio/streamtools/chatter?',
  url: {
    channel: "na",
    font: 'Poppins',
    fontsize: 2,
    align: 'left',
    chatcolour: '262d36',
    highcolour: '525be1',
    bgcolour: '262d36',
    fontcolour: 'f7f7ff',
    bgopacity: 2,
    togglecol: true,
    badges: true,
    bttv: true,
    hidebot: '',
    hidecom: ''
  },
  title: "Chatter!",
  tag: `Made on stream over at <a class="underline" href="https://twitch.tv/colloquialowl">ColloquialOwl</a>.`,
  description: `
    Please input the channel of the Twitch chat you want to read.<br>
    After picking your settings you can find the URL to put into OBS at the bottom!<br><br>
    <i>Channel Name is the only info required for it to work!</i>
    `,
}

const data = [
  {
    title: 'Channel Name *',
    placeholder: "[Channel Name Here]",
    id: "channel",
    type: "text",
  },
  {
    title: 'Custom Font',
    subtitle: 'Currently: Poppins. You will need to put the exact font name installed on your computer',
    placeholder: 'Poppins',
    id: "font",
    type: "text",
  },
  {
    title: 'Align',
    id: 'align',
    type: 'select',
    options: ['Left', 'Center', 'Right'],
  },
  {
    title: "Font Size",
    id: "fontsize",
    type: 'range',
    min: 0,
    max: 7,
    value: 2,
  },
  {
    title: 'Default chat bubble colour',
    id: 'chatcolour',
    type: 'color',
    value: '#262d36'
  },
  {
    title: 'Font colour',
    id: 'fontcolour',
    type: 'color',
    value: '#f7f7ff'
  },
  {
    title: 'Default chat highlight colour',
    id: 'highcolour',
    type: 'color',
    value: '#525be1'
  },
  {
    title: 'Background colour',
    id: 'bgcolour',
    type: 'color',
    value: '#262d36'
  },
  {
    title: 'Background opacity',
    id: 'bgopacity',
    type: 'range',
    min: 0,
    max: 10,
    value: 2
  },
  {
    title: 'Hidden bots',
    subtitle: 'Split accounts with commas e.g. Nightbot, Streamelements',
    id: 'hidebot',
    type: 'text'
  },
  {
    title: 'Hidden commands',
    subtitle: 'Split with commas and write full command e.g. !play', 
    id: 'hidecom',
    type: 'text'
  },
  {
    title: 'Use Twitch user colours for chat highlights',
    id: 'togglecol',
    type: 'checkbox'
  },
  {
    title: 'Show badges',
    id: 'badges',
    type: 'checkbox'
  },
  {
    title: 'Show BTTV emotes',
    id: 'bttv',
    type: 'checkbox',
  }

]


if (params.u) {
  loadScript('./chatter/formatEmotes.js').then(()=>{
    loadScript('./chatter/chatter.js').then(()=>{
      console.log('loading Chatter!')
    })
  })
} else {
  loadScript('./dashboard.js').then(()=>{
    loadDashboard(settings,data);
  })
}