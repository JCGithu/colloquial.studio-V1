const urlParams = new URLSearchParams(window.location.search);
const params = {
  u: urlParams.get('channel'),
  b: urlParams.get('bounce'),
  s: urlParams.get('emoteSize'),
  e: urlParams.get('ballSize'),
  l: urlParams.get('limit'),
  t: urlParams.get('expire')
}

const settings = {
  base: 'https://colloquial.studio/streamtools/emotedrop?',
  url: {
    channel: "",
    bounce: "6",
    emoteSize: "2",
    ballLimit: "150",
    expire: "30",
    ballSize: "20"
  },
  title: "Emote Drop!",
  tag: `Made on stream over at <a class="underline" href="https://twitch.tv/colloquialowl">ColloquialOwl</a>.`,
  description: `Please input the channel of the Twitch chat you want to pull the emotes from.<br><br> Streamers and mods can wipe the screen with the <code>!emotewipe</code> command, or delete a set number e.g. <code>!emotewipe 5</code>. <br><br>After picking your settings you can find the URL to put into OBS at the bottom!</p>`,
}

const data = [
  {
    title: 'Channel Name',
    placeholder: "[Channel Name Here]",
    id: "channel",
    type: "text",
  },
  {
    title: "Ball Limit",
    id: "limit",
    value: 250,
    type: "number"
  },
  {
    title: "Ball Size",
    subtitle: "(pixels)",
    id: "ballSize",
    value: 20,
    type: "number"
  },
  {
    title: "Emote Size",
    type: "range",
    min: 1,
    max: 3,
    value: 2,
  },
  {
    title: "Bounce",
    id: "bounce",
    type: "range",
    min: 0,
    max: 10,
    value: 6
  },
  {
    title: "Expiration Time",
    subtitle: "(seconds)",
    id: "expire",
    type: "number",
    value: 60,
  }
]

if (params.u) {
  loadScript('./emotedrop/emotedrop.js').then(()=>{
    runDrop(params);
  })
} else {
  loadScript('./dashboard.js').then(()=>{
    loadDashboard(settings,data)
  })
}