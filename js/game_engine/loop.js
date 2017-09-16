var app = app || {};

var lastFrame = Date.now();
app.loop = function(){
	var newFrame = Date.now();
	var dt = (newFrame - lastFrame)/1000;
	//console.log(dt);
	//app.updatePlayTime(dt);
	app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);
	// app.world.update();
	//app.drawBackground();
	
	app.updateBlocks();
	//app.updateEnemies();	
	if (app.player.y < app.campfire.y){
		app.player.update(dt);
		app.campfire.update();
	} else {
		app.campfire.update();
		app.player.update(dt);
	}
	app.drawStonePiles();
	app.drawTrees();

	//app.shade();

	app.player.health.draw();
	//showItems();
	
	lastFrame = newFrame;
}
app.slowLoop = function(){
	pointHome();
	console.log(app.player.x, app.player.y);
}
app.startGame = function(){
	setInterval( app.loop, 1000/30 );
	setInterval( app.slowLoop, 250);
}

// run loader
addImages([
	{name: 'grass', src: 'imgs/farm/grass1.png'},
	{name: 'stonePile', src: 'imgs/BaseRock.png'},
	{name: 'stone', src: 'imgs/stone.png'},
	{name: 'tree', src: 'imgs/tree2.png'},
	{name: 'arrow', src: 'imgs/arrow.png'},
	{name: 'campfire', src: 'imgs/campfire_16x16.png'},
	{name: 'player', src: 'imgs/Hero.png'}
]);