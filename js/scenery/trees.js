var app = app || {};

app.createTree = function(x, y, wf, name){
	var tree, items = app.items;
	if (name == 'Fruit Tree'){ 
		tree = sprite('tree', x, y, 24, 24);
		tree.contents = [{data: items.stick, amount: 1+rand(3)}, ];
	}
	else if (name == 'Pine Tree'){
		tree = sprite('tree', x, y, 12, 16);
		tree.contents = [{data: items.stick, amount: 5+rand(5)}, ];
	}
	tree.wf = wf;
	tree.GDD = 0;
	tree.frame = 0;
	tree.name = name;
	tree.inspect = app.inspectTree;
	//tree.time = 0;
	return tree;
}

app.inspectTree = function(player, tree){
	if (tree.name == 'Fruit Tree'){
		say("It looks to be a fruit tree.")
	} else if (tree.name == 'Pine Tree'){
		say("It's a pine tree.")
	}
}

app.renderTree = function(tree){
	var temp = app.temp;
	if ( collides(tree, app.camera) ){
		if (tree.name == 'Fruit Tree'){
			app.ctx.drawImage(app.imgs.fruitTree, tree.frame*96, 0, 96, 96, tree.x-app.camera.x-36, tree.y-app.camera.y-68, 96, 96);	
		}
		else if (tree.name == 'Pine Tree'){
			if (temp.low <= 0){
				app.ctx.drawImage(app.imgs.pineSnow, 0, 0, 256, 256, tree.x-app.camera.x-122, tree.y-app.camera.y-240, 256, 256);
			}
			else {
				app.ctx.drawImage(app.imgs.pine, 0, 0, 256, 256, tree.x-app.camera.x-122, tree.y-app.camera.y-240, 256, 256);	
			}
		}
	}
}


// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
app.growTree = function(tree){ // FIX IT !!!!!!!!!!!!!!!!!!!
	var GDDbase, temp = app.temp, items = app.items, season = app.season.current;
	if (tree.name == 'Pine Tree'){ GDDbase = -8 }
	else if (tree.name == 'Fruit Tree'){ GDDbase = 0 }
	tree.GDD += ((temp.hi + Math.max(temp.low, GDDbase))/2 - GDDbase)*(0.75+Math.random()*0.75);
	if (tree.name == 'Fruit Tree'){
		if ( temp.low <= 0){
			tree.GDD = 0;
			if ( tree.frame != 1 ){
				tree.contents = [{data: items.stick, amount: 5+rand(5)}, ];
				tree.frame = 1;
			}
		}
		else if (tree.GDD >= 1 && tree.frame == 1 ){
			tree.frame = 0; // spring
			app.manageContents(tree, items.stick, 5+rand(5));
		}
		else if (tree.GDD >= 120 && tree.frame == 0){
			tree.frame = 3; // summer
			app.manageContents(tree, items.stick, 5+rand(5));
		}
		else if (tree.GDD >= 300 && tree.frame == 3 && temp.hi > 12){
			tree.frame = 4; // fruiting
			app.manageContents(tree, app.items.pear, 5+rand(5));
		}
		else if ( temp.hi <= 12 && (tree.frame == 3 || tree.frame == 4) && (season == 'fall' || season == 'winter') ){
			tree.frame = 2; // fall
		}
		if (tree.GDD >= 330 && tree.frame == 3 && temp.hi > 15){
			tree.GDD -= 15;
			app.manageContents(tree, app.items.pear, 5+rand(5));
		}	
	}
	else if (tree.name == 'Pine Tree'){
		if (tree.GDD >= 30){
			tree.GDD -= 30;
			app.manageContents(tree, items.stick, 5+rand(5));
		}
	}

}

// app.updateTree = function(tree, dt){
// 	tree.time += dt*2*Math.random();
// 	if ( tree.time > 25 ){
// 		tree.time -= 25;
// 		app.manageContents(tree, app.items.stick, 1);
// 		var fertility = tree.wf.getTileAt(tree.x, tree.y).fertility;
// 		var fruitChance = fertility/10;
// 		if (Math.random() < fruitChance){
// 			app.manageContents(tree, app.items.pear, 1);
// 		}
// 	}
// }

app.clickTree = function(tree){
	app.openStash(tree);
}

app.makeFire = function(xPos, yPos){
	var x = Math.round(xPos);
	var y = Math.round(yPos);
	var wf = app.world.wfAtPos(x, y);
	if ( !collidesArray( {x: x, y: y, w: 20, h: 20}, app.world.collideables.concat([app.player]).concat(wf.campfires)) ){
		if ( !app.gameEvents.madeFire.status ){ say(app.gameEvents.madeFire.message); app.gameEvents.madeFire.status = true; }
		app.manageItems(app.items.stick, -1);
		var campfire = sprite('campfire', x, y,  20 ,  20);
		campfire.anim = 0;
		campfire.intensity = 1;
		wf.campfires.push( campfire );	
	}
}

app.renderCampfire = function(campfire){
	var cam = app.camera, player = app.player;
	var c = app.ctx, img = app.imgs.campfire, x = campfire.x - cam.x, y = campfire.y - cam.y;
	campfire.anim++; if ( campfire.anim > 4*8-1 ){ campfire.anim = 0 }
	var frame = Math.floor(campfire.anim/8);
	c.globalAlpha = 0.4 + 0.6*campfire.intensity/5;
	c.drawImage(img, frame*16, 0, 16, 16, x-2, y-2, campfire.w, campfire.h);
	c.globalAlpha = 1;
	if ( collides(campfire, player) && player.y + player.h/2 < campfire.y+campfire.h){
		player.hurt( 0.016 );
		if (!app.gameEvents.investigatedFire.status){ say( app.gameEvents.investigatedFire.message ); app.gameEvents.investigatedFire.status = true; }
	}
}




