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

let grid = document.getElementByID('commandGrid');

readTextFile('../data/commands.json', (data) => {
    for (let command in data){
        let block = document.createElement('div');
        let name = document.createElement('h1');
        let description = document.createElement('p');

        name.innerHTML = command;
        description.innerHTML = data[command].d;

        block.appendChild(name);
        block.appendChild(description);
        grid.appendChild(block);
    }
})

