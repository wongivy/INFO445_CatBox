var showAllGamesBtn = $('#btn-showAllGames');
console.log(showAllGamesBtn);
showAllGamesBtn.click(function (event) {
  console.log("button pressed")
  getGames();
});

function getGames() {
  $.getJSON("/games/all", function (data) {
    var table = $("#resultsTable");
    $.each(data, function (ID, gameObject) {
      var rowData = $('<tr></tr>');
      rowData.append("<td>" + gameObject.GameName + "<td>");
      rowData.append("<td>" + gameObject.GameTypeID + "<td>");
      rowData.append("<td>" + gameObject.StudioID + "<td>");
      rowData.append("<td>" + gameObject.GameDescr + "<td>");
      rowData.append("<button type='submit' class='btn btn-info' onclick='editGame(" + gameObject.GameID + ")'>Edit</button>");
      rowData.append("<button type='submit' class='btn btn-info'>Delete</button>");
      table.append(rowData);
    });
  });
}

function editGame(gameID) {
  window.location.href = "/edit/" + gameID;
}
