var app = app || {};

app.createStones = function(x, y, wf){
	 var stone =  sprite('stonePile', x, y, 28, 16);
	 stone.wf = wf;
	 stone.name = "Stone Pile";
	 stone.contents = [{data: app.items.stone, amount: 1+rand(3)}, ];
	 stone.time = 0;
	 stone.inspect = app.inspectStone;
	 return stone;
}

app.inspectStone = function(player, stone){
	if (stone.contents.length > 0){
		say('This rock has something behind it...');	
	} else {
		say('A sturdy rock.')
	}
}

app.renderStone = function(stonePile){
	var img = app.imgs.stonePile, c = app.ctx;
	c.drawImage(img, stonePile.x-app.camera.x-2, stonePile.y-app.camera.y-11);
}

app.updateStone = function(stone, dt){
	stone.time += dt*2*Math.random();
	if ( stone.time > 25 ){
		stone.time -= 25;
		app.manageContents(stone, app.items.stone, 1);
	}
}

app.clickStonePile = function(stonePile){
	app.openStash(stonePile);
}

app.makeWall = function(xPos, yPos){
	var size = 10;
	var x = Math.round(xPos/ size )* size - size/2 ;
	var y = Math.round(yPos/ size )* size - size/2 ;
	var wf = app.world.wfAtPos(x, y);
	if ( !app.isWallAt(x, y, wf) && !collidesArray( {x: x, y: y, w: size, h: size}, app.world.collideables) ){
		if ( !app.gameEvents.madeWall.status ){ say( app.gameEvents.madeWall.message ); app.gameEvents.madeWall.status = true; }
		app.manageItems(app.items.stone, -1);
		var block = sprite('block', x, y,  size ,  size , '#424242');
		block.durability = 1;
		wf.walls.push( block );	
	}
}

app.renderWall = function(wall){
	var c =app.ctx;
	c.fillStyle = wall.color;
	c.globalAlpha = 0.4 + 0.6*wall.durability/5;
	c.fillRect(wall.x - app.camera.x, wall.y - app.camera.y, wall.w, wall.h);
	c.globalAlpha = 1;
}

app.isWallAt = function(x, y, wf){
	for (var i = 0; i < wf.walls.length; i++) {
		if ( wf.walls[i].x == x && wf.walls[i].y == y ){
			return true;
		}
	};
}

app.destroyWall = function(sprite){

	if (!sprite){ return; }
	var wf = app.world.wfAtPos(sprite.x, sprite.y);
	for (var i = 0; i < wf.walls.length; i++) {
		var wall = wf.walls[i];
		if (wall === sprite){
			wall.durability -= 0.5;
			say('Take down wall...');
			//if ( !app.gameEvents.unmadeWall.status ){ say( app.gameEvents.unmadeWall.message ); app.gameEvents.unmadeWall.status = true; }
			return;
		}
	};
}
