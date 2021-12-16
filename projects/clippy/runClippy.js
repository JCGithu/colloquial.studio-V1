console.log('CLIPPY IS HERE');
document.body.style.backgroundColor = 'rgba(0,0,0,0)';
let show = document.getElementById('menu');
document.body.removeChild(show);

clippy.load('Clippy', function(theBoy) {
  theBoy.show();
  theBoy.moveTo(window.innerWidth,200)
  theBoy.moveTo(200,200);
  let clipBox = document.getElementById('clippy');
  setTimeout(function (){
    theBoy.speak(`Hi ${u}!`);
    theBoy.animate();
  }, 1000);

  const client = new tmi.Client({
    channels: [u]
  });
  
  client.on("connected", () => {console.log('Reading from Twitch! ✅')});
  
  client.connect();
  client.on('message', (channel, tags, message) => {
    console.log(tags['custom-reward-id']);
    if (pointID){
      if (tags['custom-reward-id'] === pointID){
        theBoy.animate();
        theBoy.speak(`${message}               .`);
      }
    }
    if (tags.badges.broadcaster || tags.badges.moderator && message === '!clippy') {
      console.log('animation runs');
      theBoy.animate();
    }
  });
});
