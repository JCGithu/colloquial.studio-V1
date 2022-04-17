function urlBuild(settings){
  console.log(settings.url);
  if (JSONCrush != null){
    let urlCrush = encodeURIComponent(JSONCrush.crush(JSON.stringify(settings.url)));
    console.log(urlCrush);
    return `${settings.base}data=${urlCrush}`;
  }
  let urlString = settings.base;
  for (let k in settings.url){
    let newVal = settings.url[k];
    if (typeof newVal === 'string') newVal = newVal.replace('#','');
    urlString = urlString + `${k}=${newVal}&`;
  }
  return urlString
}

async function buildObject(obj, target){
  let div = document.createElement('div');
  div.classList.add('dashInput');

  // CHECKBOX
  if (obj.type === 'checkbox'){
    div.innerHTML = `
    <label class="checkContainer">${obj.title}
      <input type="checkbox" id="${obj.id}" class="urlBuild check" checked="checked">
      <span class="checkmark"></span>
    </label>`
    target.appendChild(div);
    return;
  }

  //SELECT
  if (obj.type === 'select'){
    div.innerHTML = `<h2>${obj.title}</h2>`;
    let select = document.createElement('select');
    select.classList.add('dashInput');
    select.classList.add('urlBuild');
    select.id = obj.id;
    for (let o in obj.options){
      let option = document.createElement("option");
      option.text = obj.options[o];
      option.value = obj.options[o];
      option.style.fontFamily = `${obj.options[o]} !important`;
      select.add(option);
    }
    div.appendChild(select);
    target.appendChild(div);
    return;
  }

  div.innerHTML = `<h2>${obj.title}</h2>`;
  let div2 = document.createElement('div');

  if (obj.group){
    div.classList.remove('dashInput');
    div.classList.add('collapsible');
    div2.classList.add('group');
    div2.style.display = 'none';
    //div2.innerHTML = 'nwubfni'
    for (let item in obj.group){
      buildObject(obj.group[item], div2);
    }
    target.appendChild(div);
    target.appendChild(div2);
    return;
  }

  // TEXT, NUMBER, RANGE
  div2.classList.add('dashInput');
  let el = document.createElement('input');
  el.id = obj.id;
  el.type = obj.type;
  el.classList.add('urlBuild');
  if (obj.value) el.value = obj.value;
  if (obj.min) el.min = obj.min;
  if (obj.max) el.max = obj.max;
  if (obj.required) el.classList.add('required');
  if (obj.subtitle) div.innerHTML = `${div.innerHTML} <p>${obj.subtitle}</p>`;
  if (obj.type === 'color'){
    let colourBlock = document.createElement('div');
    colourBlock.classList.add('colourBlock');
    let extraStyle = ''; 
    let hsl = hexToHSL(obj.value);
    if (hsl.l >= 70) extraStyle = ' class="invert"';
    console.log(hsl);
    colourBlock.innerHTML = `<p id="colour${obj.id}" ${extraStyle}>${obj.value}</p>`;
    div2.appendChild(colourBlock)
  }
  target.appendChild(div);
  div2.appendChild(el);
  target.appendChild(div2);
}

async function loadDashboard(settings, data){

  let pageBody = document.getElementById('show');
  let dash = document.createElement('div');
  dash.id = 'dashboard';
  pageBody.appendChild(dash);
  let dashInfo = document.createElement('div');
  dashInfo.id = 'DashTitle';
  dashInfo.classList.add('flex-items');
  dashInfo.innerHTML = `
  <span id='backlink'><a href='/streamtools'><< More stream tools</a></span>
  <h1>${settings.title}</h1>
  <h3>${settings.tag}</h3>
  <p>${settings.description}</p>
  <h2>URL will be here! ▼</h2>
  <input id='output' type="text">
  <div class="flex w-full content-center align-middle justify-center p-1">
      <button id='go'>Go!</button>
      <button id='copy'>Copy!</button>
  </div>
  `
  dash.appendChild(dashInfo);

  let dashControls = document.createElement('div');
  dashControls.id = 'dashControls';
  dashControls.classList.add('flex-items');
  for (let d in data){
    buildObject(data[d], dashControls);
  }
  dash.appendChild(dashControls);

  let trackers = document.getElementsByClassName('urlBuild');
  let output = document.getElementById('output');
  let go = document.getElementById('go');
  let copy = document.getElementById('copy');

  for (var t = 0; t < trackers.length; t++) {
    let title = trackers[t].id
    trackers[t].addEventListener('change', (evt) => {
      console.log('change and value is ' + evt.target.value);
      if (evt.target.type === 'checkbox'){
        let box = document.getElementById(evt.target.id);
        settings.url[title] = `${box.checked}`;
      } else {
        settings.url[title] = evt.target.value;
      }
      if (evt.target.type === 'color'){
        let colourText = document.getElementById(`colour${evt.target.id}`);
        let hsl = hexToHSL(evt.target.value);
        if (hsl.l > 70){
          colourText.classList.add('invert');
          console.log('this is bright!');
        } else {
          colourText.classList.remove('invert');
        }
        colourText.innerHTML = evt.target.value;
        settings.url[title] = evt.target.value.replace('#','');
      }
      output.value = urlBuild(settings);
    })
    trackers[t].addEventListener('keyup', (evt) => {
      settings.url[title] = evt.target.value;
      output.value = urlBuild(settings);
    })
    trackers[t].addEventListener('click', (evt) => {
      console.log('woah you clicked ' + evt.target.id)
    })
  }

  var coll = document.getElementsByClassName("collapsible");

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("opened");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  go.addEventListener('click', () =>{
    window.open(output.value,"_self");
  })
  copy.addEventListener('click', () =>{
    copyTextToClipboard(output.value);
    copy.innerHTML = 'Copied!';
  })
}

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {"h": h, "s":s, "l": l};
}