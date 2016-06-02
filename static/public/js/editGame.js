$(document).ready(function () {
	var href = window.location.href;
	var splitString = href.split("/");
	var gameID = splitString[splitString.length -1];
	getGameObject(gameID);
})

function getGameObject(gameID) {
	$.getJSON("/getGame/" + gameID, function (data) {
		var gameObject = data[0];
		$("#gameID").val(gameObject.GameID);
		$("#gameName").val(gameObject.GameName);
		$("#gameType").val(gameObject.GameTypeID);
		$("#studioName").val(gameObject.StudioID);
		$("#gameDes").val(gameObject.GameDescr);
	});
}