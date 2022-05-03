const urlParams = new URLSearchParams(window.location.search);

const badgeData = {};
var bttvEmoteCache = [];
/* 
const fontCheck = new Set([
  // Windows 10
'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
  // macOS
  'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
].sort());

(async() => {
  await document.fonts.ready;

  const fontAvailable = new Set();

  for (const font of fontCheck.values()) {
    if (document.fonts.check(`12px "${font}"`)) {
      fontAvailable.add(font);
      console.log(font);
    }
  }

  console.log('Available Fonts:', [...fontAvailable.values()]);
})(); */

const settings = {
  base: 'https://colloquial.studio/streamtools/chatter?',
  url: {
    channel: "",
    font: 'Poppins',
    fontsize: 2,
    align: 'left',
    chatcolour: '262d36',
    highcolour: '525be1',
    bgcolour: '262d36',
    fontcolour: 'f7f7ff',
    bgopacity: 2,
    togglecol: 'true',
    gradient: 'true',
    animation: 'Pop In',
    scroll: 'true',
    badges: 'true',
    bttv: 'true',
    hidebot: '',
    hidecom: '',
    pronouns: 'false',
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
    title: 'Align',
    id: 'align',
    type: 'select',
    options: ['Left', 'Center', 'Right'],
  },
  {
    title: 'Font Settings',
    group: [
      {
        title: 'Custom Font',
        subtitle: 'Currently: Poppins. You will need to put the exact font name installed on your computer',
        placeholder: 'Poppins',
        id: "font",
        type: "text",
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
        title: 'Font colour',
        id: 'fontcolour',
        type: 'color',
        value: '#f7f7ff'
      },
    ]
  },
  {
    title: 'Chat Bubble Colour',
    group: [
      {
        title: 'Default chat bubble colour',
        id: 'chatcolour',
        type: 'color',
        value: '#262d36'
      },
      {
        title: 'Chat bubble opacity',
        id: 'chatopacity',
        type: 'range',
        min: 0,
        max: 10,
        value: 10,
      },
    ]
  },
  {
    title: 'Chat Bubble Shadow Settings',
    group: [
      {
        title: 'Show Bubble Shadow',
        id: 'highlight',
        type: 'checkbox'
      },
      {
        title: 'Custom Name Colours',
        subtitle: 'Users names will take their twitch colours',
        id: 'togglecol',
        type: 'checkbox'
      },
      {
        title: 'Default Name Colour',
        subtitle: "This will be used if a user hasn't set a custom colour on Twitch",
        id: 'highcolour',
        type: 'color',
        value: '#525be1'
      },
    ]
  },
  {
    title: 'Background Settings',
    group: [
      {
        title: 'Fade Chat at top',
        subtitle: "A gradient fade at the top of the chatbox",
        id: 'gradient',
        type: 'checkbox',
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
    ]
  },
  {
    title: 'Animation',
    group: [
      {
        title: 'Smooth Scroll',
        id: 'scroll',
        type: 'checkbox',
      },
      {
        title: 'Animation',
        id: 'animation',
        type: 'select',
        options: ['Pop In', 'Slide In', 'Fade In', 'Grow'],
      },
    ]
  },
  {
    title: 'Hide these bots',
    subtitle: 'Split accounts with commas e.g. Nightbot, Streamelements',
    id: 'hidebot',
    type: 'text'
  },
  {
    title: 'Hide these commands',
    subtitle: 'Split with commas and write full command e.g. !play', 
    id: 'hidecom',
    type: 'text'
  },
  {
    title: 'Show Badges',
    id: 'badges',
    type: 'checkbox'
  },
  {
    title: 'Show BTTV emotes',
    id: 'bttv',
    type: 'checkbox',
  },
  {
    title: 'Show Pronouns',
    id: 'pronouns',
    type: 'checkbox',
    false: true
  }

]

function getParams(){
  if (!urlParams.get('data')) return {};
  let data = urlParams.get('data');
  let example = JSONCrush.uncrush(data);
  return JSON.parse(example);
}
const params = getParams();

if (urlParams.get('data') || urlParams.get('channel')) {
  loadScript('./chatter/formatEmotes.js').then((params)=>{
    loadScript('./chatter/chatter.js').then(()=>{
      console.log('loading Chatter!')
    })
  })
} else {
  loadScript('./dashboard.js').then(()=>{
    loadDashboard(settings,data);
  })
}