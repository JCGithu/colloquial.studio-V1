const urlParams = new URLSearchParams(window.location.search);
const u = urlParams.get('channel');
const b = urlParams.get('bounce');
const s = urlParams.get('emoteSize');
const e = urlParams.get('ballSize');
const l = urlParams.get('limit');
const t = urlParams.get('expire');

let urlInfo = {
    channel: "",
    bounce: "6",
    emoteSize: "2",
    ballLimit: "150",
    expire: "30",
    ballSize: "20"
}

if (u) {
    runDrop();
} else {
    runMenu()
}

function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
}

function urlBuild(){
    let urlString = 'https://colloquial.studio/emotedrop?';
    for (let k in urlInfo){
        urlString = urlString + `${k}=${urlInfo[k]}&`;
    }
    return urlString
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

function runMenu(){
    //let id = ['channelName', 'emoteSize', 'bounce', 'expire', 'ballSize', 'ballLimit', 'output'];
    let trackers = document.getElementsByClassName('track');
    let output = document.getElementById('output');
    let go = document.getElementById('go');
    let copy = document.getElementById('copy');
    for (var t = 0; t < trackers.length; t++) {
        let title = trackers[t].id
        trackers[t].addEventListener('change', (evt) => {
            urlInfo[title] = evt.target.value;
            output.value = urlBuild();
        })
        trackers[t].addEventListener('keyup', (evt) => {
            urlInfo[title] = evt.target.value;
            output.value = urlBuild();
        })
    }
    go.addEventListener('click', () =>{
        window.open(output.value,"_self");
    })
    copy.addEventListener('click', () =>{
        copyTextToClipboard(output.value);
        copy.innerHTML = 'Copied!';
    })
}


function runDrop(){
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