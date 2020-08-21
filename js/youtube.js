/* Light YouTube Embeds by @labnol */
if (document.readyState !== 'loading') {
    console.log('Youtube.js logs loading state')
    InitCode();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        InitCode();
        console.log('Youtube.js logs DOMContentLoaded')
    });
}

function InitCode(){
    var div, n, v = document.getElementsByClassName("video-player");
    for (n = 0; n < v.length; n++) {
        div = document.createElement("div");
        div.setAttribute("data-id", v[n].dataset.id);
        div.innerHTML = labnolThumb(v[n].dataset.id);
        div.onclick = labnolIframe;
        v[n].appendChild(div);
    }
};

function labnolThumb(id) {
    var thumb = '<img src="https://i.ytimg.com/vi/ID/maxresdefault.jpg" >';
    return thumb.replace("ID", id);
}
function labnolIframe() {
    var iframe = document.createElement("iframe");
    var embed = "https://www.youtube.com/embed/ID?autoplay=1";
    iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "1");
    this.parentNode.replaceChild(iframe, this);
};