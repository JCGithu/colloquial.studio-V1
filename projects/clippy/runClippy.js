console.log('CLIPPY IS HERE');

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
    if (tags['custom-reward-id'] === "d3a31e75-d348-45db-bcb6-3fe431917b05"){
      theBoy.animate();
      theBoy.speak(`${message}               .`);
    }
    if (tags.badges.broadcaster || tags.badges.moderator && message === '!clippy') {
      console.log('animation runs');
      theBoy.animate();
    }
  });
});
