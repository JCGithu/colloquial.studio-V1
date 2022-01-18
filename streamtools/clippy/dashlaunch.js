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
  title: "Clippy!",
  tag: `Made on stream over at <a class="underline" href="https://twitch.tv/colloquialowl">ColloquialOwl</a>.`,
  description: `
    Put clippy on your stream!
    If you input the channel of the Twitch chat he will respond to new users and animate when mods write <code>!clippy</code> in chat. <br><br>
    You can also set a channel point redeem that lets users show messages on stream through Clippy.
    You can use <a href="https://www.instafluff.tv/TwitchCustomRewardID/?channel=YOURTWITCHCHANNEL">this website</a> to grab your channel point ID, by setting your channel name in the URL and triggering the event. <br><br>
    After picking your settings you can find the URL to put into OBS at the bottom!
  `,
}

const data = [
  {
    title: 'Channel Name*',
    placeholder: "[Channel Name Here]",
    id: "channel",
    type: "text",
    required: true,
  },
  {
    title: "Custom Point Redeem",
    id: "pointID",
    type: "text"
  },
  {
    title: "Welcome New Users",
    id: "welcome",
    type: "checkbox"
  },
  {
    title: "Animate on Command",
    id: "animate",
    type: "checkbox"
  }
]


if (params.u) {
  loadScript('./clippy/clippyManager.js').then(()=>{
    console.log('set clippyManager.js to load');
  })
} else {
  loadScript('./dashboard.js').then(()=>{
    loadDashboard(settings,data);
  })
};