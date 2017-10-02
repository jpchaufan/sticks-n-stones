var app = app || {};

var lastFrame = Date.now();
app.loop = function(){
	var newFrame = Date.now();
	var dt = (newFrame - lastFrame)/1000;
	app.playerUpdated = false;
	app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);

	app.world.update(dt);

	app.player.health.draw();

	app.updateTime(dt);
	app.darkness.update();
	lastFrame = newFrame;
}
app.slowLoop = function(){
	pointHome();
	app.dayDisplay.update();
	app.temp.update();
	
}
app.startGame = function(){
	setInterval( app.loop, 1000/30 );
	setInterval( app.slowLoop, 250);
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
// run loader
addImages([
	{name: 'grass', src: 'imgs/grass1.png'},
	{name: 'dirt', src: 'imgs/dirt1.png'},
	{name: 'water', src: 'imgs/water3.png'},
	{name: 'stonePile', src: 'imgs/BaseRock.png'},
	{name: 'stone', src: 'imgs/stone.png'},
	{name: 'tree', src: 'imgs/tree2.png'},
	{name: 'stick', src: 'imgs/stick.png'},
	{name: 'arrow', src: 'imgs/arrow.png'},
	{name: 'campfire', src: 'imgs/campfire_16x16.png'},
	{name: 'player', src: 'imgs/hero-'+skinColor+'.png'},
	{name: 'pear', src: 'imgs/pear.png'},
	{name: 'herb', src: 'imgs/herb.png'},
	{name: 'leaf', src: 'imgs/leaf.png'}
]);





