var showAllGamesBtn = document.getElementById('btn-showAllGames');

showAllGamesBtn.addEventListener('click', function (event) {
  console.log("button pressed")
  getGames();
});

function getGames() {
  var xmlhttp = new XMLHttpRequest();
  var url = '/games/all';
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var myArr = JSON.parse(xmlhttp.responseText);
      parse(myArr);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function parse(data) {
  document.writeln((JSON.stringify(data).split("\"}").join("\"}<br>")));
}