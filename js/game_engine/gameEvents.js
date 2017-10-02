app.gameEvents = {
	investigatedFire: {status: false, message: 'Ow... fire hot!' },
	madeWall: {status: false, message: 'Ug build, BUILD GOOD!!' },
	unmadeWall: {status: false, message: 'Ug not build...' },
	nightComes: {status: false, message: 'Get Dark...' },
	pickedStones: {status: false, message: 'Stone... good!' },
	gotSticks: {status: false, message: 'Ug find stick!' },
	madeFire: {status: false, message: 'Ug make fire!' }
}
app.playTime;
app.startTime = Date.now();
app.updatePlayTime = function(){
	var now = Date.now();
	app.playTime = (now - app.startTime) / 1000;
}


