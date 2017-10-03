var app = app || {};

createStones = function(x, y, wf){
	 var stone =  sprite('stonePile', x, y, 28, 16);
	 stone.wf = wf;
	 stone.name = "Stone Pile";
	 stone.contents = [{name: 'Stone', amount: 1+rand(3)}, ];
	 stone.time = 0;
	 return stone;
}

app.renderStone = function(stonePile){
	var img = app.imgs.stonePile;
	app.ctx.drawImage(img, stonePile.x-app.camera.x-2, stonePile.y-app.camera.y-11);
}

app.updateStone = function(stone, dt){
	stone.time += dt*2*Math.random();
	if ( stone.time > 25 ){
		stone.time -= 25;
		manageContents(stone, 'Stone', 1);
	}
}

app.clickStonePile = function(stonePile){
	openStash(stonePile);
}

app.makeWall = function(xPos, yPos){
	var size = 10;
	var x = Math.round(xPos/ size )* size - size/2 ;
	var y = Math.round(yPos/ size )* size - size/2 ;
	var wf = app.world.wfAtPos(x, y);
	if ( !app.isWallAt(x, y, wf) && !collidesArray( {x: x, y: y, w: size, h: size}, app.world.collideables) ){
		if ( !app.gameEvents.madeWall.status ){ say( app.gameEvents.madeWall.message ); app.gameEvents.madeWall.status = true; }
		app.manageItems('Stone', -1);
		var block = sprite('block', x, y,  size ,  size , '#424242');
		wf.walls.push( block );	
	}
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
		var block = wf.walls[i];
		if (block === sprite){
			if ( !app.gameEvents.unmadeWall.status ){ say( app.gameEvents.unmadeWall.message ); app.gameEvents.unmadeWall.status = true; }
			wf.walls.splice(i, 1);
			app.manageItems('Stone', 1);
			return;
		}
	};
}
