// Compass

app.setupCompass = function(){
	app.compass = createUI(10, 10, app.canvas.width / 5, app.canvas.width / 5, '#fff');
	var compass = app.compass;
	compass.style.borderRadius = '50%';
	compass.style.backgroundImage = "url('imgs/arrow.png')";
	compass.style.backgroundRepeat = 'no-repeat';
	compass.style.backgroundSize = '100%';
	app.window.appendChild( compass );

	compass.addEventListener('click', function(){ 

		// if confirm...

		say ('This home now.')
		app.startPoint.x = app.player.x;
		app.startPoint.y = app.player.y;	
	});

	compass.pointHome = function(){
	var rot = angleTo(app.player, app.startPoint.x, app.startPoint.y)-0.5*3.141592653589793;
	var deg = rot * 180 / 3.1418;
	this.style.transform = 'rotate('+deg+'deg)';
}
}

