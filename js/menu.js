var app = app || {};

app.pauseGame = function(){
	if (app.gameStarted && !app.helpMenu.isShowing){
		app.isPaused = !app.isPaused;
		if (app.isPaused){
			//pause
			app.pauseMenu.style.display = 'block';
		} else {
			// unpause
			app.pauseMenu.style.display = 'none';
			app.lastFrame = Date.now();
		}
	}
}

app.setupPauseMenu = function(){
	var w = window.innerWidth, h = window.innerHeight;
	app.pauseMenu = createUI(w*0.3, h*0.2, w*0.4, h*0.5, app.color4);
	app.pauseMenu.style.border = '12px solid ' + app.color1;
	app.pauseMenu.style.borderRadius = '20px';
	app.pauseMenu.style.fontSize = '22px';
	app.pauseMenu.style.padding = '16px';
	app.pauseMenu.innerHTML = '<h1 style="margin-bottom: 10px; font-variant: small-caps">Paused</h1>';
	app.pauseMenu.style.display = 'none';
	app.window.appendChild(app.pauseMenu);

	// Help
	var helpBtn = document.createElement('div');
	helpBtn.style.backgroundColor = app.color5;
	helpBtn.style.padding = '10px';
	helpBtn.style.color =  app.color3 //"#583E23"
	helpBtn.innerText = 'How To Play';
	helpBtn.addEventListener('click', function(){
		if ( !app.helpMenu.isShowing ){
			app.helpMenu.isShowing = true;
			app.helpMenu.style.display = 'block';
		}
	})
	app.pauseMenu.appendChild(helpBtn);

	// close btn
	var closeBtn = document.createElement('div');
	closeBtn.style.backgroundColor = app.color5;
	closeBtn.style.padding = '10px';
	closeBtn.style.color =  app.color3;
	closeBtn.style.marginTop = '20px';
	closeBtn.innerText = 'Unpause (P)';
	closeBtn.addEventListener('click', function(){
		app.pauseGame();
	})
	app.pauseMenu.appendChild(closeBtn);

}


app.createStartMenu = function(){
	var w = window.innerWidth, h = window.innerHeight;
	app.startMenu = createUI(w*0.2, h*0.1, w*0.6, h*0.6, app.color4);
	app.startMenu.style.border = '20px solid ' + app.color1;
	app.startMenu.style.borderRadius = '20px';
	app.startMenu.style.fontSize = '24px';
	app.startMenu.style.padding = '20px';
	app.startMenu.innerHTML = '<h1 style="font-variant: small-caps">Sticks and Stones</h1><small>version '+app.version+' '+app.versionTag+'</small>';

	// New Game
	var newGameBtn = document.createElement('div');
	newGameBtn.style.backgroundColor = app.color5;
	newGameBtn.style.padding = '10px';
	newGameBtn.style.color =  app.color3 //"#583E23"
	newGameBtn.style.marginTop = '20px';
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
	helpBtn.style.marginTop = '20px';
	helpBtn.innerText = 'How To Play';
	helpBtn.addEventListener('click', function(){
		if ( !app.helpMenu.isShowing ){
			app.helpMenu.isShowing = true;
			app.helpMenu.style.display = 'block';
		}
	})
	app.startMenu.appendChild(helpBtn)

	// Credits
	var creditsBtn = document.createElement('div');
	creditsBtn.style.backgroundColor = app.color5;
	creditsBtn.style.padding = '10px';
	creditsBtn.style.color =  app.color3 //"#583E23"
	creditsBtn.style.marginTop = '20px';
	creditsBtn.innerText = 'Credits';
	creditsBtn.addEventListener('click', function(){
		if ( !app.creditsMenu.isShowing ){
			app.creditsMenu.isShowing = true;
			app.creditsMenu.style.display = 'block';
		}
	})
	app.startMenu.appendChild(creditsBtn)

	app.window.appendChild(app.startMenu);
}

app.setupHelpMenu = function(){
	var w = window.innerWidth, h = window.innerHeight;
	app.helpMenu = createUI(w*0.3, h*0.2, w*0.4, h*0.5, app.color5);
	app.helpMenu.style.zIndex = '2';
	app.helpMenu.style.border = '12px solid ' + app.color1;
	app.helpMenu.style.borderRadius = '20px';
	app.helpMenu.style.fontSize = '22px';
	app.helpMenu.style.padding = '16px';
	app.helpMenu.style.overflow="scroll";

	var content = '<h1 style="margin-bottom: 10px; font-variant: small-caps">How To Play</h1>'+
				' <h2 style="font-variant: small-caps" >  Controls  </h2> '+
				' <div style="text-align: left; padding: 10px;"><p>  <b>WASD or Arrow Keys</b> to move  </p> '+
				' <p>  <b>Left Click</b> to interact </p> '+
				' <p>  <b>Right Click or Space + Click</b> for secondary interaction </p> '+
				' <p>  <b>shift</b> to stalk </p> '+
				' <p>  <b>number keys</b> to quick-select items </p> '+
				' <p>  <b>Q</b> to quick-close item stashes </p> '+
				' <p>  <b>T or P</b> to pause / unpause </p></div> '+
				' <h2 style="font-variant: small-caps" >  Test Version  </h2> '+
				' <div style="text-align: left; padding: 10px;">'+
				'<p> Thanks for trying out my game! It is far from complete and I appreciate any comments, ideas, or bug reports you have. </p><br/> '+
				'<p> Some additional features that I plan to include are: </p> '+
				'<ul style="margin: 5px 5px 5px 10px">'+
				'<li>gardening and herbalism, medicines and poisons</li>'+
				'<li>more animals, and animals that hunt the player at night</li>'+
				'<li>crafting system with bones, animal hides, and plant fibers</li>'+
				'<li>fishing</li>'+
				'<li>skills system including skills like tracking, firemaking, and plant knowledge</li>'+
				'<li>saving and loading</li>'+
				'</ul>'+
				'<p>If anybody wants to provide artwork for this game, you can contact me about it. All the artwork has been taken as-is or modified from <a href="https://opengameart.org/" target="_blank" >opengameart.com</a> </p>'+
				'</div>';

	app.helpMenu.innerHTML = content;

	var closeBtn = document.createElement('div');
	closeBtn.style.backgroundColor = app.color4;
	closeBtn.style.padding = '10px';
	closeBtn.style.color =  app.color3;
	closeBtn.style.margin = '20px 0';
	closeBtn.innerText = 'OK';
	closeBtn.addEventListener('click', function(){
		app.helpMenu.isShowing = false;
		app.helpMenu.style.display = 'none';
	})
	app.helpMenu.appendChild(closeBtn);
	app.helpMenu.style.display = 'none';
	app.helpMenu.isShowing = false;
	app.window.appendChild(app.helpMenu);
}


app.setupCreditsMenu = function(){
	var w = window.innerWidth, h = window.innerHeight;
	app.creditsMenu = createUI(w*0.3, h*0.2, w*0.4, h*0.5, app.color5);
	app.creditsMenu.style.zIndex = '2';
	app.creditsMenu.style.border = '12px solid ' + app.color1;
	app.creditsMenu.style.borderRadius = '20px';
	app.creditsMenu.style.fontSize = '22px';
	app.creditsMenu.style.padding = '16px';
	app.creditsMenu.style.overflow="scroll";

	var content = '<h1 style="margin-bottom: 10px; font-variant: small-caps">Credits</h1>'+
				'<p> Game designed and created by JP </p>'+
				'<p> A huge thanks to <a target="_blank" href="http://www.opengameart.com">opengamneart.com</a>. Almost all of the art in this game was provided by opengameart.com and its users. This game would hardly be possible without them. This includes:</p><br/>'+

				'<p>Daniel Eddeland</p>'+
				'<p>https://opengameart.org/content/lpc-farming-tilesets-magic-animations-and-ui-elements</p><br/>'+

				'<p>Tree trunk by Johann C. Shoot\'em up graphic kit: http://opengameart.org/content/lpc-a-shootem-up-complete-graphic-kit</p>'+
				'<p>https://opengameart.org/content/lpc-all-seasons-apple-tree</p><br/>'+

				'<p>Deer by Calciumtrice, usable under Creative Commons Attribution 3.0 license.</p>'+
				'<p>https://opengameart.org/content/deer</p><br/>'+

				'<p>Skylar1146</p>'+
				'<p>https://opengameart.org/content/base-character-spritesheet-16x16</p><br/>'+

				'<p>krial</p>'+
				'<p>https://opengameart.org/content/16x16-animated-campfire</p><br/>'+

				'<p>and many others.</p>'+

				'<p>If you are interested in helping with the art or music for this game, I am open to collaboration.</p>';

	app.creditsMenu.innerHTML = content;

	var closeBtn = document.createElement('div');
	closeBtn.style.backgroundColor = app.color4;
	closeBtn.style.padding = '10px';
	closeBtn.style.color =  app.color3;
	closeBtn.style.margin = '20px 0';
	closeBtn.innerText = 'OK';
	closeBtn.addEventListener('click', function(){
		app.creditsMenu.isShowing = false;
		app.creditsMenu.style.display = 'none';
	})
	app.creditsMenu.appendChild(closeBtn);
	app.creditsMenu.style.display = 'none';
	app.creditsMenu.isShowing = false;
	app.window.appendChild(app.creditsMenu);
}


