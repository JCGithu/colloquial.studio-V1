document.body.style.backgroundColor = 'rgba(0,0,0,0)';

function runDrop({u,b,s,e,l,t}){
  let show = document.getElementById('show');
  document.body.removeChild(show);
  const client = new tmi.Client({
      channels: [u]
  });

  client.on("connected", () => {console.log('Reading from Twitch! ✅')});

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;

  // create engine
  var engine = Engine.create(),
  world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: innerWidth,
      height: innerHeight,
      wireframes: false,
      background: 'transparent',
      wireframeBackground: 'transparent',
    }
  });

  Render.run(render);
  var runner = Runner.create();
  Runner.run(runner, engine);

  let halfHeight = innerHeight * 0.5;
  let halfWidth = innerWidth * 0.5;

  Composite.add(world, [
    Bodies.rectangle(halfWidth, innerHeight, innerWidth, 1, { isStatic: true }),
    Bodies.rectangle(0, halfHeight, 1, innerHeight, { isStatic: true }),
    Bodies.rectangle(innerWidth, halfHeight, 1, innerHeight, { isStatic: true }),
  ]);

  //Animation Variables
  let scale = '2.0'
  let ball =  20;
  let limit = parseInt(l) || 100;
  let time = parseInt(t)*1000 || 30000;
  let bounce = b * 0.1 || 0.5;
  
  if (innerWidth > 1920) {
    scale = '3.0';
    ball = 30;
  }
  if (innerWidth < 720) {
    scale = '1.0';
    ball = 10;
  }
  if (s) scale = `${s}.0`;
  if (e) ball = parseInt(e);

  client.connect();
  client.on('message', (channel, tags, message, self) => {
    
    if (tags.badges.broadcaster && message.startsWith('!emotewipe') || tags.badges.moderator && message.startsWith('!emotewipe')){
      let bodyList = Composite.allBodies(world);
      if (message === '!emotewipe'){
        console.log('deleting all!');
        bodyList.forEach((body)=>{
          if (body.label === 'Circle Body'){
            Composite.remove(world, body);
          }
        });
        return;
      }
      console.log('got here');
      let num = message.split(' ')[1];
      if (!+num) return;
      for (let numDel = 1; numDel <= num; numDel++){
        Composite.remove(world, bodyList[numDel+3]);
      }
      return;
    } 

    
    
    let batch = [];

    for (let i in tags.emotes){
      for(let k in tags.emotes[i]){
        let newCircle = Bodies.circle(getRandomInt(innerWidth * 0.9), 0, ball, {
          restitution: bounce,
          render: {
            sprite: {
              texture: `http://static-cdn.jtvnw.net/emoticons/v2/${i}/default/light/${scale}`
            }
          }
        });
        Composite.add(world, [newCircle]);
        batch.push(newCircle);
      }
    }
    
    let data = Matter.Composite.allBodies(world);

    if (data.length > (limit + 3)) {
      for (let i in data){
        if (data.length > (limit + 3)) {
          Composite.remove(world, data[3]);
        } else {
          break;
        }
      }
    }

    setInterval(function(){
      Composite.remove(world, batch);
    }, time);



  });	
}