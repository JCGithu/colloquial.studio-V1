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

let table = document.getElementById('table');

readTextFile('../data/commands.json', (data) => {
    data = JSON.parse(data);
    for (let command in data){
        let block = document.createElement('tr');
        let name = document.createElement('td');
        name.className = 'name';
        let description = document.createElement('td');

        name.innerHTML = command;
        description.innerHTML = data[command].d;

        block.appendChild(name);
        block.appendChild(description);
        table.appendChild(block);
    }
})

function searching() {
    // Declare variables
    let input = document.getElementById("searchbar");
    let filter = input.value.toUpperCase();
    let tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        let txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }