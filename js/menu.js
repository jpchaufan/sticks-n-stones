var app = app || {};

app.pauseGame = function(){
	if (app.gameStarted){
		app.isPaused = !app.isPaused;
		if (app.isPaused){
			//pause
			
		} else {
			// unpause
			app.lastFrame = Date.now();
		}
	}
}

app.setupPauseMenu = function(){
	
}


app.createStartMenu = function(){
	var w = window.innerWidth, h = window.innerHeight;
	app.startMenu = createUI(w*0.2, h*0.1, w*0.6, h*0.6, app.color4);
	app.startMenu.style.border = '20px solid ' + app.color1;
	app.startMenu.style.borderRadius = '20px';
	app.startMenu.style.fontSize = '24px';
	app.startMenu.style.padding = '20px';
	app.startMenu.innerHTML = '<h1 style="margin-bottom: 10px; font-variant: small-caps">Sticks and Stones</h1>'

	// New Game
	var newGameBtn = document.createElement('div');
	newGameBtn.style.backgroundColor = app.color5;
	newGameBtn.style.padding = '10px';
	newGameBtn.style.color =  app.color3 //"#583E23"
	newGameBtn.style.marginBottom = '20px';
	newGameBtn.innerText = 'New Game';
	newGameBtn.addEventListener('click', function(){
		app.window.removeChild(app.startMenu);
		app.startGame();
	})
	app.startMenu.appendChild(newGameBtn)

	// Help
	var helpBtn = document.createElement('div');
	helpBtn.style.backgroundColor = app.color5;
	helpBtn.style.padding = '10px';
	helpBtn.style.color =  app.color3 //"#583E23"
	helpBtn.innerText = 'How To Play';
	helpBtn.addEventListener('click', function(){
		
	})
	app.startMenu.appendChild(helpBtn)

	app.window.appendChild(app.startMenu);
}