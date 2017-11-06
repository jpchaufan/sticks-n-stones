var app = app || {};

var lastFrame = Date.now();
app.loop = function(){
	var newFrame = Date.now();
	var dt = (newFrame - lastFrame)/1000;
	app.playerUpdated = false;
	app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);

	app.world.update(dt);
	
	app.updateTime(dt);
	app.darkness.update();
	lastFrame = newFrame;
}
app.slowLoop = function(){
	app.pointHome();
	app.dayDisplay.update();
	app.temp.update();
	app.checkForPlantDeath();
	
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
	{name: 'corn', src: 'imgs/corn.png'}
]);





