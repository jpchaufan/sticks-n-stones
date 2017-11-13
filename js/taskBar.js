var app = app || {};



app.setupTaskbar = function(){
	var w = window.innerWidth, h = window.innerHeight;
	app.taskbar = createUI(w/2-20, h/2-40, 40, 8, app.color3);
	app.taskbar.style.display = 'none';
	app.taskbar.meter = createUI(1, 1, 38, 6, app.color1);
	app.taskbar.appendChild(app.taskbar.meter);
	app.window.appendChild(app.taskbar);

	app.taskbar.close = function(){
		app.taskbar.active = false;
		app.taskbar.style.display = 'none';
	}

}

app.task = function(callback, time){
	app.taskbar.timer = time || 1;
	app.taskbar.totalTime = time || 1;
	app.taskbar.callback = callback;
	app.taskbar.style.display = 'block';
	app.taskbar.active = true;
}

app.updateTaskbar = function(dt){
	if (app.taskbar.active){
		app.taskbar.timer -= dt;
		app.taskbar.meter.style.width = 38 * (1 - app.taskbar.timer / app.taskbar.totalTime);
		if (app.taskbar.timer <= 0){
			app.taskbar.close();
			app.taskbar.callback();
		}
	}
}


app.runTest = function(){
	app.pauseGame();
}





