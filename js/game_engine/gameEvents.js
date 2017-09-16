app.gameEvents = {
	investigatedFire: false,
	madeWall: false,
	burnedEnemy: false,
	pickedStones: false
}
app.playTime;
app.startTime = Date.now();
app.updatePlayTime = function(){
	var now = Date.now();
	app.playTime = (now - app.startTime) / 1000;

}


