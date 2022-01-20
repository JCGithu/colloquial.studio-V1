const urlParams = new URLSearchParams(window.location.search);
const params = {
  u: urlParams.get('channel'),
  pointID: urlParams.get('pointID'),
  welcome: urlParams.get('welcome'),
  animate: urlParams.get('animate'),
}
if (params.pointID) params.pointID = params.pointID.replace(/_/g, '-');

const settings = {
  base: 'https://colloquial.studio/streamtools/clippy?',
  url: {
    channel: "",
    pointID: '',
    welcome: 'true',
    animate: 'true'
  },
  title: "Clock",
  tag: `Made on stream over at <a class="underline" href="https://twitch.tv/colloquialowl">ColloquialOwl</a>.`,
  description: `
  Just a clock! <br><br>
  You format the style by text
  `,
}

/* bg: StringParam,
bghex: StringParam,
text: StringParam,
texthex: StringParam,
font: StringParam,
align: StringParam,
format: StringParam,
time: StringParam,
scale: NumberParam,
padding: NumberParam,
paddingTop: NumberParam,
paddingBottom: NumberParam,
paddingLeft: NumberParam,
paddingRight: NumberParam,
timePadding: NumberParam */

const data = [
  {
    title: "Time Format",
    subtitle: "Guide on the left. Default is H:mm P",
    id: "time",
    type: "text",
  },
  {
    title: "Date Format",
    subtitle: "Leave blank to not include. Guide on the left.",
    id: "format",
    type: "text",
  },
  {
    title: 'Background Colour',
    id: "bgcol",
    type: "color",
    value: '#2f3437',
  },
  {
    title: "Background Opacity",
    id: "bgopacity",
    type: "range",
    min: 0,
    max: 10,
    value: 10,
  },
  {
    title: "Font Colour",
    id: "fontcol",
    type: "color"
  },
  {
    title: 'Align',
    id: 'align',
    type: 'select',
    options: ['Left', 'Center', 'Right'],
  },
  {
    title: 'Scale',
    id: "scale",
    value: 1,
    type: 'number'
  },
  {
    title: 'Padding',
    subtitle: 'Write like CSS. Write one pixel value to apply to all axis e.g. 10, or custom with css e.g. 10px 1rem 10px 1rem',
    id: 'padding',
    type: 'text',
  },
  {
    title: 'Time Padding',
    subtitle: 'Same as above, but for the time only!',
    id: 'timePadding',
    type: 'text'
  }
]


if (params.u) {
  loadScript('./clock/clock.js').then(()=>{
    console.log('laoding clock');
  })
} else {
  loadScript('./dashboard.js').then(()=>{
    loadDashboard(settings,data);
  })
};