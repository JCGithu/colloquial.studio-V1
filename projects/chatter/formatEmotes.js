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
  
function formatEmotes(text, emotes, bttvEmoteCache) {
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
                `<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v2/${i}/default/light/3.0">`
                );
            }
        }
    }
    if (bttvEmoteCache.length){
      let target = htmlEntities(splitText).join('').split(' ');
      for (let i in target){
        bttvEmoteCache.forEach(element => {
          if (target[i] === element.code){
            target[i] = `<img src="https://cdn.betterttv.net/emote/${element.id}/3x"></img>`;
          }
        });
      }
      return target.join('');

    } else {
      return htmlEntities(splitText).join('');
    }
}