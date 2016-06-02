$(document).ready(function () {
	var href = window.location.href;
	var splitString = href.split("/");
	var gameID = splitString[splitString.length -1];
	getGameObject(gameID);
})

function getGameObject(gameID) {
	$.getJSON("/getGame/" + gameID, function (data) {
		console.log(data[0]);
		
	});
}