var app = app || {};

createTree = function(x, y, wf){
	var tree =  sprite('tree', x, y, 30, 28);
	tree.wf = wf;
	tree.name = "Tree";
	tree.contents = [{name: 'Stick', amount: 1+rand(3)}, ];
	tree.time = 0;
	return tree;
}

app.renderTree = function(tree){
	var img = app.imgs.tree;
	if ( collides(tree, app.camera) ){
		app.ctx.drawImage(img, tree.x-app.camera.x-16, tree.y-app.camera.y-30);
	}
}

app.updateTree = function(tree, dt){
	tree.time += dt*2*Math.random();
	if ( tree.time > 25 ){
		tree.time -= 25;
		manageContents(tree, 'Stick', 1);
		var fertility = tree.wf.getTileAt(tree.x, tree.y).fertility;
		var fruitChance = fertility/10;
		if (Math.random() < fruitChance){
			manageContents(tree, 'Pear', 1);
		}
	}
}

app.clickTree = function(tree){
	openStash(tree);
}

app.makeFire = function(xPos, yPos){
	var x = Math.round(xPos);
	var y = Math.round(yPos);
	var wf = app.world.wfAtPos(x, y);
	if ( !collidesArray( {x: x, y: y, w: 20, h: 20}, app.world.collideables.concat([app.player]).concat(wf.campfires)) ){
		if ( !app.gameEvents.madeFire.status ){ say(app.gameEvents.madeFire.message); app.gameEvents.madeFire.status = true; }
		app.manageItems('Stick', -1);
		var campfire = sprite('campfire', x, y,  20 ,  20);
		campfire.anim = 0;
		wf.campfires.push( campfire );	
	}
}

app.renderCampfire = function(campfire){
	var cam = app.camera, player = app.player;
	var c = app.ctx, img = app.imgs.campfire, x = campfire.x - cam.x, y = campfire.y - cam.y;
	campfire.anim++; if ( campfire.anim > 4*8-1 ){ campfire.anim = 0 }
	var frame = Math.floor(campfire.anim/8);
	c.drawImage(img, frame*16, 0, 16, 16, x-2, y-2, campfire.w, campfire.h);

	if ( collides(campfire, player) && player.y + player.h/2 < campfire.y+campfire.h){
		player.hurt( 0.5 );
		if (!app.gameEvents.investigatedFire.status){ say( app.gameEvents.investigatedFire.message ); app.gameEvents.investigatedFire.status = true;
		}
	}
}
