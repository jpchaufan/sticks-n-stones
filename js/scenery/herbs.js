var app = app || {};

createHerb = function(x, y, wf){
	var herb =  sprite('herb', x, y, 11, 10);
	herb.wf = wf;
	herb.name = "Herb";
	herb.contents = [{name: 'Leaf', amount: 1+rand(1)}, ];
	herb.time = 0;
	return herb;
}

app.renderHerb = function(herb){
	var img = app.imgs.herb;
	if ( collides(herb, app.camera) ){
		app.ctx.drawImage(img, herb.x-app.camera.x-6, herb.y-app.camera.y-13);
	}
}

app.updateHerb = function(herb, dt){
	var fertility = herb.wf.getTileAt(herb.x, herb.y).fertility;
	herb.time += dt*fertility/10*Math.random();
	if ( herb.time > 25 ){
		herb.time -= 25;
		manageContents(herb, 'Leaf', 1);
	}
}

app.clickHerb = function(herb){
	openStash(herb);
}





