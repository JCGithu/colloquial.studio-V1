function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

let grid = document.getElementById('commandGrid');

readTextFile('../data/commands.json', (data) => {
    data = JSON.parse(data);
    for (let command in data){
        let block1 = document.createElement('div');
        let block2 = document.createElement('div');
        let name = document.createElement('h2');
        let description = document.createElement('p');

        name.innerHTML = command;
        name.classList.add('commandTitle');
        description.innerHTML = data[command].d;

        block1.appendChild(name);
        block2.appendChild(description);
        grid.appendChild(block1);
        grid.appendChild(block2);
    }
})

