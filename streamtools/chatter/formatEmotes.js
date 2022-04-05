function htmlEntities(html) {
  function it() {
    return html.map(function (n, i, arr) {
      if (n.length === 1) {
        return n.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
          return '&#' + i.charCodeAt(0) + ';';
        });
      }
      return n;
    });
  }
  var isArray = Array.isArray(html);
  if (!isArray) html = html.split('');
  html = it(html);
  if (!isArray) html = html.join('');
  return html;
}

const cheerList = [
  {minBit: 1, url: 'https://static-cdn.jtvnw.net/bits/dark/animated/gray/2'},
  {minBit: 100, url: 'https://static-cdn.jtvnw.net/bits/dark/animated/purple/2'},
  {minBit: 1000, url: 'https://static-cdn.jtvnw.net/bits/dark/animated/green/2'},
  {minBit: 5000, url: 'https://static-cdn.jtvnw.net/bits/dark/animated/blue/2'},
  {minBit: 10000, url: 'https://static-cdn.jtvnw.net/bits/dark/animated/red/2'},
  {minBit: 100000, url: 'https://static-cdn.jtvnw.net/bits/dark/animated/gold/2'}
]
const cheerTiers = [1, 100, 1000, 5000, 10000, 100000];
const otherCheers = ['cheer', 'biblethump', 'cheerwhal', 'corgo', 'uni', 'showlove', 'party', 'seemsgood', 'pride', 'kappa', 'frankerz', 'heyguys', 'dansgame', 'elegiggle', 'trihard', 'kreygasm', '4head', 'swiftrage','notlikethis', 'failfish', 'vohiyo', 'pjsalt', 'mrdestructoid', 'bday', 'ripcheer', 'shamrock'];
const cheerRex = new RegExp(otherCheers.join('\\d+|') + `\\d+`, 'gi');
const allCheers = [];

otherCheers.forEach(other => {
  let cheerData = [];
  
})
  
function formatEmotes(text, emotes, bttvEmoteCache, bits) {
  var splitText = text.split('');
  for (var i in emotes) {
    var e = emotes[i];
    for (var j in e) {
      var mote = e[j];
      if (typeof mote == 'string') {
        mote = mote.split('-');
        mote = [parseInt(mote[0]), parseInt(mote[1])];
        var length = mote[1] - mote[0],
        empty = Array.apply(null, new Array(length + 1)).map(function () {
            return '';
        });
        splitText = splitText
        .slice(0, mote[0])
        .concat(empty)
        .concat(splitText.slice(mote[1] + 1, splitText.length));
        splitText.splice(
        mote[0],
        1,
        `<img class="emote" src="http://static-cdn.jtvnw.net/emoticons/v2/${i}/default/light/3.0">`
        );
      }
    }
  }
  let resplit = htmlEntities(splitText).join('').split(' ');
  if (bits){
    console.log('bits are found');
    resplit.forEach((chunk, index) => {
      if (!cheerRex.test(chunk)) return;
      let title = chunk.match(/[a-zA-z]+/g)[0];
      let num = parseInt(chunk.match(/\d+/g)[0]);
      cheerTiers.forEach(rank => {
        if (num >= rank){
          resplit[index] = `<img class="emote" src="https://d3aqoihi2n8ty8.cloudfront.net/actions/${title}/dark/animated/${rank}/2.gif"> <b>${num}</b>`
        } else {
          return
        };
      })
    })
  }
  if (bttvEmoteCache.length){
    let target = htmlEntities(splitText).join('').split(' ');
    for (let i in resplit){
      bttvEmoteCache.forEach(element => {
        if (resplit[i] === element.code){
          resplit[i] = `<img class='emote' src="https://cdn.betterttv.net/emote/${element.id}/3x"></img>`;
        }
      });
    }
    
  }
  return resplit.join(' ');
}