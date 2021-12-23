let guilds = {
  "916094352990830633": {
    src: "./Stylomancer.png",
    name: "Stylomancer",
  },
  "916093730816143451": {
    src: "./brushbarian.png",
    name: "Brushbarian",
  },
  "916094509400612875": {
    src: "./RightClickNinja.png",
    name: "Right Click Ninja",
  },
  "916094203438706739": {
    src: "./VectorKnight.png",
    name: 'Vector Knight',
  },
  "916094031178661920": {
    src: "./PixelMage.png",
    name: "PixelMage",
  },
  "916096784919593000": {
    src:"./PixelMage.png",
    name: "He/Him",
  },
  "401448428284018709": {
    src:"./RightClickNinja.png",
    name: 'Yetee Artist!'
  }
}

async function callAPI(){
  var response = await fetch(`https://yeetee-discord.herokuapp.com/`);
  var body = await response.json();
  return body;
}

const dom = {
  gallery: document.getElementById('gallery')
}

function addBlock(role){
  let block = document.createElement('div');
  block.id = role;
  block.classList.add('roleBlock');
  let blockNum = document.createElement('div');
  blockNum.id = `num${role}`;
  blockNum.classList.add('blockNum');
  block.appendChild(blockNum);
  dom.gallery.appendChild(block);
}

function roleBlockUpdate(role, roleUsers){
  let roleBox = document.getElementById(role);
  let spriteCount = roleBox.querySelectorAll('.spriteBox').length;
  roleBox.style.width = `${150+ ((spriteCount -1) * 40)}px`;
  roleBox.getElementsByClassName("blockNum")[0].innerHTML = `<h1>${roleUsers}</h1><p>${guilds[role].name}</p>`;
  console.log(`there are ${spriteCount} elements`);
}

function addSprite(roleData, user, role, roleUsers){
  if (document.getElementById(role).querySelectorAll('.spriteBox').length > 10) {
    roleBox.getElementsByClassName("blockNum")[0].innerHTML = `<h1>${roleUsers}</h1><p>${guilds[role].name}</p>`;
    return;
  }
  let spriteBox = document.createElement('span');
  spriteBox.innerHTML = `<div class='spriteName'>${user}</div>`
  spriteBox.id = roleData[user].id;
  spriteBox.classList.add('spriteBox');
  spriteBox.classList.add(role);
  let sprite = document.createElement('img');
  sprite.alt = user;
  sprite.classList.add('sprite');
  sprite.src = guilds[role].src;
  spriteBox.appendChild(sprite);
  let roleBox = document.getElementById(role)
  roleBox.appendChild(spriteBox);
  console.log(`Added ${user}, their status is now ${roleData[user].status}`);
  roleBlockUpdate(role, roleUsers);
}

function removeSprite(user, roleData, role, roleUsers){
  if (!document.getElementById(roleData[user].id)) return;
  let targetUser = document.getElementById(roleData[user].id);
  let removeTime = 1000;
  targetUser.animate([
    { transform: 'scaleY(1) scaleX(1) translateY(0)'},
    { transform: 'scaleY(1.1) scaleX(0.9) translateY(-10%)'},
    { transform: 'scaleY(0.9) scaleX(1.1) translateY(100%)'},
    { transform: 'scaleY(0.8) scaleX(1.2) translateY(200%)'}
  ],
    { duration: removeTime, fill: 'forwards' }
  );
  console.log(`Removing ${user}, their status is now ${roleData[user].status}`);
  setTimeout(() => {
    let roleBox = document.getElementById(role);
    roleBox.removeChild(targetUser);
    roleBlockUpdate(role, roleUsers);
  }, removeTime + 200);
}

async function dataUpdate(){
  let data = await callAPI();
  console.log(data);
  for (let role in data){
    let roleData = data[role];
    let roleUsers = Object.keys(roleData).length
    if (roleUsers == 0){
      if(document.getElementById(role)) {
        dom.gallery.removeChild(document.getElementById(role));
      }
      continue;
    }
    if(!document.getElementById(role)) addBlock(role);
    for (let user in roleData){
      let showing = false;
      if (document.getElementById(roleData[user].id)) showing = true;
      if (showing && roleData[user].status != 'online'){
        removeSprite(user, roleData, role);
        continue;
      }
      if (roleData[user].status === 'online' && !showing) addSprite(roleData, user, role, roleUsers);
    }
  }
}

dataUpdate();

setInterval(async() => {
  dataUpdate();
}, 10000);