const urlParams = new URLSearchParams(window.location.search);
const params = {
  time: urlParams.get('time'),
  format: urlParams.get('format'),
  bg: urlParams.get('bg'),
  bgopacity: urlParams.get('bgopacity'),
  font: urlParams.get('font'),
  fontcol: urlParams.get('fontcol'),
  align: urlParams.get('align'),
  scale: urlParams.get('scale'),
  padding: urlParams.get('padding'),
  timePadding: urlParams.get('timePadding'),
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
    id: "bg",
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
    title: "Font",
    subtitle: 'Must be the exact name of font family installed on your computer',
    id: "font",
    type: 'text'
  },
  {
    title: "Font Colour",
    id: "fontcol",
    type: "color",
    value: '#2f3437',
  },
  {
    title: 'Align',
    id: 'align',
    type: 'select',
    options: ['Left', 'Center', 'Right'],
  },
  {
    title: 'Scale',
    subtitle: 'The number will be a multiplier, so 2 will double the size.',
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