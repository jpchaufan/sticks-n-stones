var app = app || {};

app.lastFrame;
app.loop = function(){
	if ( app.isPaused){ return; }
	var newFrame = Date.now();
	var dt = (newFrame - app.lastFrame)/1000;
	
	app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);

	app.world.update(dt);
	app.updateTaskbar(dt);
	
	app.updateTime(dt);
	app.darkness.update();
	app.lastFrame = newFrame;
}
app.slowLoop = function(){
	if ( app.isPaused){ return; }
	app.compass.pointHome();
	app.dayDisplay.update();
	app.temp.update();
	app.checkForPlantDeath();
	
}
app.startGame = function(){
	app.player.setupBars();
	app.setupDayDisplay();
	app.setupCompass();
	app.setupTaskbar();
	app.setupPauseMenu();
	app.lastFrame = Date.now();
	setInterval( app.loop, 1000/30 );
	setInterval( app.slowLoop, 250);

	createText('Sticks and Stones', 2700,
		window.innerWidth*0.3,
		window.innerHeight/1.5,
		{
			color: "#3e3e3e",
			fontSize: "40px",
			fontVariant: "small-caps",
			backgroundColor: 'rgba(255, 255, 255, 0.5)',
			boxShadow: '0 0 5px 5px rgba(255, 255, 255, 0.5',
			borderRadius: '10px'
		});
	app.gameStarted = true;
	app.isPaused = false;
}

var skinColor = (function(){
	var rand = Math.random();
	if (rand < 0.33){
		return 'white';
	} else if (rand < 0.67){
		return 'brown';
	} else {
		return 'black';
	}
})();

// setup loading sequence

(function(){
	app.loadingText = createUI(0, window.innerHeight*0.35, window.innerWidth, canvasH);
	app.loadingText.style.fontSize = '120%'; //E9E6FF
	app.loadingText.style.color = "#E9E6FF";
	app.loadingText.innerHTML = '<h1 style="font-variant: small-caps; ">Sticks and Stones</h1><small>version '+app.version+' '+app.versionTag+'</small>';
	app.window.appendChild(app.loadingText);
	app.loadingBar = createUI(0, window.innerHeight*0.7, window.innerWidth, canvasH);
	app.loadingBar.style.fontSize = '120%';
	app.loadingBar.style.color = "#E9E6FF";
	app.loadingBar.innerHTML = ''
	app.window.appendChild(app.loadingBar);

})();

// run loader
app.addImages([
	{name: 'grass', src: 'imgs/grass1.png'},
	{name: 'dirt', src: 'imgs/dirt1.png'},
	{name: 'snow', src: 'imgs/snow.png'},
	{name: 'water', src: 'imgs/water3.png'},
	{name: 'stonePile', src: 'imgs/BaseRock.png'},
	{name: 'stone', src: 'imgs/stone.png'},
	{name: 'pine', src: 'imgs/pine-tree.png'},
	{name: 'pineSnow', src: 'imgs/pine-tree-snowy.png'},
	{name: 'fruitTree', src: 'imgs/fruit-tree.png'},
	{name: 'stick', src: 'imgs/stick.png'},
	{name: 'arrow', src: 'imgs/arrow.png'},
	{name: 'campfire', src: 'imgs/campfire_16x16.png'},
	{name: 'player', src: 'imgs/hero-'+skinColor+'.png'},
	{name: 'pear', src: 'imgs/pear.png'},
	{name: 'herb', src: 'imgs/herb.png'},
	{name: 'plants', src: 'imgs/plants.png'},
	{name: 'leaf', src: 'imgs/leaf2.png'},
	{name: 'bud', src: 'imgs/bud.png'},
	{name: 'egg', src: 'imgs/egg.png'},
	{name: 'tomato', src: 'imgs/tomato.png'},
	{name: 'potato', src: 'imgs/potato.png'},
	{name: 'carrots', src: 'imgs/carrots.png'},
	{name: 'artichoke', src: 'imgs/artichoke.png'},
	{name: 'peppers', src: 'imgs/peppers.png'},
	{name: 'eggplant', src: 'imgs/eggplant.png'},
	{name: 'corn', src: 'imgs/corn.png'},
	{name: 'deer-male', src: 'imgs/deer-male.png'},
	{name: 'deer-female', src: 'imgs/deer-female.png'},
	{name: 'raw-meat', src: 'imgs/item_meat.png'},
	{name: 'rodent', src: 'imgs/rat_0.png'},
	{name: 'mushrooms', src: 'imgs/mushrooms.png'}

]);



