let guilds = {
  "916094352990830633": {
    src: "/Stylomancer.png",
    name: "Stylomancer",
    color: '#E67E23'
  },
  "916093730816143451": {
    src: "/brushbarian.png",
    name: "Brushbarian",
    color: '#E74B3C',
  },
  "916094509400612875": {
    src: "/RightClickNinja.png",
    name: "Right Click Ninja",
    color: '#607D8B',
  },
  "916094203438706739": {
    src: "/VectorKnight.png",
    name: 'Vector Knight',
    color: '#1ABC9C',
  },
  "916094031178661920": {
    src: "/PixelMage.png",
    name: "PixelMage",
    color: '#3498DB',
  },
  "916096784919593000": {
    src:"/PixelMage.png",
    name: "He/Him",
    color: '#98A6EF',
  },
  "401448428284018709": {
    src:"/RightClickNinja.png",
    name: 'Yetee Artist!',
    color: '#98A6EF'
  },
  "772498414553792522": {
    src: "/VectorKnight.png",
    name: 'JACK TEST',
    color: '#1ABC9C'
  },
  "776048148313014312": {
    src: "/RightClickNinja.png",
    name: "Jack Bots",
    color: '#3F4BE4',
  },
}

//const socket = io('ws://localhost:500');
const socket = io('https://yeetee-discord.herokuapp.com/');

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

const gallery = document.getElementById('gallery')

function addBlock(role, colour){
  console.log(`adding block for ${guilds[role].name}`);
  let block = document.createElement('div');
  block.id = role;
  block.classList.add('roleBlock');
  let blockNum = document.createElement('div');
  blockNum.id = `num${role}`;
  blockNum.classList.add('blockNum');

  let blockBanner = document.createElement('div');
  blockBanner.style.backgroundColor = colour;
  blockBanner.classList.add('bottomBanner');

  block.appendChild(blockNum);
  block.appendChild(blockBanner);
  gallery.appendChild(block);
}

function roleBlockUpdate(role, roleUsers){
  let roleBox = document.getElementById(role);
  let roleBoxBanner = roleBox.querySelectorAll('.bottomBanner');
  roleBox.removeChild(roleBoxBanner[0]);
  roleBox.appendChild(roleBoxBanner[0]);
  let spriteCount = roleBox.querySelectorAll('.spriteBox').length;
  roleBox.style.setProperty('--shadow', guilds[role].color);
  roleBox.style.width = `${150+ ((spriteCount -1) * 40)}px`;
  roleBox.getElementsByClassName("blockNum")[0].innerHTML = `<h1>${roleUsers}</h1><p>${guilds[role].name}</p>`;
}

function addSprite(roleData, user, role, roleUsers){
  let roleBox = document.getElementById(role);
  if (roleBox.querySelectorAll('.spriteBox').length >= 5) {
    roleBox.getElementsByClassName("blockNum")[0].innerHTML = `<h1>${roleUsers}</h1><p>${guilds[role].name}</p>`;
    return;
  }
  let spriteBox = document.createElement('span');
  spriteBox.innerHTML = `<div class='spriteName'>${user}</div>`
  spriteBox.id = role + roleData[user].id;
  spriteBox.classList.add('spriteBox');
  spriteBox.classList.add(role);
  let sprite = document.createElement('img');
  sprite.alt = user;
  sprite.style.filter = '';
  sprite.classList.add('sprite');
  sprite.src = `./yetee/${guilds[role].src}`;
  spriteBox.appendChild(sprite);
  roleBox.appendChild(spriteBox);
  console.log(`Added ${user}, their status is now ${roleData[user].status}`);
  roleBlockUpdate(role, roleUsers);
}

function removeSprite(user, roleData, role, roleUsers){
  if (!document.getElementById(role + roleData[user].id)) return;
  let targetUser = document.getElementById(role + roleData[user].id);
  let removeTime = 1000;
  targetUser.animate([
    { transform: 'scaleY(1) scaleX(1) translateY(0)'},
    { transform: 'scaleY(1.1) scaleX(0.9) translateY(-10%)'},
    { transform: 'scaleY(0.9) scaleX(1.1) translateY(100%)'},
    { transform: 'scaleY(0.8) scaleX(1.2) translateY(200%)'}
  ],
    { duration: removeTime, fill: 'forwards' }
  );
  console.log(`Removing ${user}, their status is now ${roleData[user].status}, ${roleUsers} left!`);
  setTimeout(() => {
    let roleBox = document.getElementById(role);
    roleBox.removeChild(targetUser);
    roleBlockUpdate(role, roleUsers);
  }, removeTime + 200);
}

async function countUsers(data){
  let roleUsers = 0;
  for (let user in data){
    if(data[user].status === 'online') roleUsers = roleUsers + 1;
  }
  return roleUsers;
}

function roleGlow(role, roleUsers){
  let glow = 'filter: drop-shadow(5px 5px 5px rgba(34, 34, 34, 0.5))'
  if (roleUsers >= 5) glow = 'filter: drop-shadow(0px 0px 9px #01BFFF)';
  let roleBox = document.getElementById(role);
  let imgs = roleBox.querySelectorAll('.sprite');
  for (img in imgs) {
    if(imgs[img]) imgs[img].style = glow;
  }
}

async function dataUpdate(data){
  for (let role in data){
    let roleData = data[role];
    let roleUsers = await countUsers(roleData);
    if (roleUsers === 0){
      if(document.getElementById(role)) gallery.removeChild(document.getElementById(role));
      continue;
    }
    if(!document.getElementById(role)) addBlock(role, guilds[role].color);
    for (let user in roleData){
      let showing = false;
      if (document.getElementById(role + roleData[user].id)) showing = true;
      if (showing && roleData[user].status != 'online'){
        removeSprite(user, roleData, role, roleUsers);
        roleGlow(role, roleUsers);
        continue;
      }
      if (roleData[user].status === 'online' && !showing) {
        addSprite(roleData, user, role, roleUsers);
        roleGlow(role, roleUsers);
        continue;
      }
    }
  }
}

socket.on('message', event => dataUpdate(event));