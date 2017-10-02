var app = app || {};
app.assetsToLoad ++;

// there is a world, which has a grid, holding world fragments
app.startPoint = {w: 24, h: 24};
app.world = {
	array: [new WorldFragment( -500, -500 )],
	x: -500,
	y: -500,
	w: 500,
	h: 500,
	update: function(dt){
		this.clickables = [app.player];
		this.collideables = [];
		// update only world fragments colliding with camera
		for (var i = 0; i < this.array.length; i++) {
			var worldFrag = this.array[i];
			if ( collides(app.camera, worldFrag) ){ worldFrag.updateBefore(dt) }
		};
		app.player.update(dt)
		for (var i = 0; i < this.array.length; i++) {
			var worldFrag = this.array[i];
			if ( collides(app.camera, worldFrag) ){ worldFrag.updateAfter(dt) }
		};


		this.checkCorners();

	},
	clickables: [],
	collideables: [],
	wfAtPos: function(x, y){
		for (var i = 0; i < this.array.length; i++) {
			var wf = this.array[i];
				if ( isPosInSprite( wf, x, y ) ){
					return wf;
				}
		};	
	},
	checkCorners: function(){ // check corners for no wf, to check if need to expand
		var cam = app.camera;
		// top left
		if ( !isPosInSprites(this.array, cam.x, cam.y) ){
			var x = Math.floor( (cam.x+500)/1000 )*1000-500;
			var y = Math.floor( (cam.y+500)/1000 )*1000-500;
			console.log('top left', x, y)
			this.array.push( new WorldFragment(x, y) )
		}
		// top right
		if ( !isPosInSprites(this.array, cam.x+cam.w, cam.y) ){
			var x = Math.ceil( (cam.x+500)/1000 )*1000-500;
			var y = Math.floor( (cam.y+500)/1000 )*1000-500;
			console.log('top right', x, y)
			this.array.push( new WorldFragment(x, y) )
		}
		// bottom left
		if ( !isPosInSprites(this.array, cam.x, cam.y+cam.h) ){
			var x = Math.floor( (cam.x+500)/1000 )*1000-500;
			var y = Math.ceil( (cam.y+500)/1000 )*1000-500;
			console.log('bottom left', x, y)
			this.array.push( new WorldFragment(x, y) )
		}
		// bottom right
		if ( !isPosInSprites(this.array, cam.x+cam.w, cam.y+cam.h) ){
			var x = Math.ceil( (cam.x+500)/1000 )*1000-500;
			var y = Math.ceil( (cam.y+500)/1000 )*1000-500;
			console.log('bottom right', x, y)
			this.array.push( new WorldFragment(x, y) )
		}


	}

};


//function tile(type, )




function WorldFragment(x, y){
	this.x = x;
 	this.y = y;
 	this.w = 1000;
 	this.h = 1000;
	var map = generateMap(x, y, this);
	this.map = map[0];
	this.water = map[1];
	this.stones = map[2];
	this.walls = [];
	this.trees = map[3];
	this.campfires = [];
	this.herbs = map[4];
	this.caves = map[5];
}
WorldFragment.prototype.getTileAt = function(x, y){
	var tile, h, w;
	for (h = 0; h < this.map.length; h++) {
		for (w = 0; w < this.map.length; w++) {
			tile = this.map[h][w];
			if ( isPosInSprite(tile, x, y) ){
				return tile;
			}
		};
	};
}
WorldFragment.prototype.updateBefore = function(dt){
	var world = app.world;
	world.collideables = world.collideables.concat(this.water)
						.concat(this.stones).concat(this.walls).concat(this.trees).concat(this.herbs);
	world.clickables = world.clickables.concat(this.stones).concat(this.walls).concat(this.trees).concat(this.campfires).concat(this.herbs);

	var c = app.ctx, cam = app.camera, dirt = app.imgs.dirt, 
	   water = app.imgs.water, grass = app.imgs.grass;
	for (var h = 0; h < this.map.length; h++) {
		for (var w = 0; w < this.map.length; w++) {
			var square = this.map[h][w];
			if (square.type == 'dirt') {
				c.drawImage(dirt, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			} else if (square.type == 'water') {
				c.drawImage(water, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			} else if (square.type == 'grass') {
				c.drawImage(grass, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			}
			
		};
	};
}

WorldFragment.prototype.updateAfter = function(dt){
	var cam = app.camera;
	for (var i = 0; i < this.stones.length; i++) {
		var stone = this.stones[i];
		app.updateStone(stone, dt);
		if ( collides(stone, cam) ){
			app.renderStone(stone);
		}
	};
	for (var i = 0; i < this.trees.length; i++) {
		var tree = this.trees[i];
		app.updateTree(tree, dt);
		if ( collides(tree, cam) ){
			app.renderTree(tree);
		}
	};
	for (var i = 0; i < this.herbs.length; i++) {
		var herb = this.herbs[i];
		app.updateHerb(herb, dt);
		if ( collides(herb, cam) ){
			app.renderHerb(herb);
		}
	};
	for (var i = 0; i < this.walls.length; i++) {
		var wall = this.walls[i];
		if ( collides(wall, cam) ){
			wall.draw();
		}
	};
	for (var i = 0; i < this.campfires.length; i++) {
		var campfire = this.campfires[i];
		if ( collides(campfire, cam) ){
			app.renderCampfire(campfire);
		}
	};
}

function generateMap(x, y, wf){
	var start = Date.now();
	var width = 50, height = 50; // if tilseSize == 20, map w and h == 1000 px
	function distanceToCenter(w, h, center){
		var x = Math.abs( w - center.x );
		var y = Math.abs( h - center.y );
		return Math.sqrt(x*x+y*y);
	}
	function nearestCenterData(w, h){
		var val, fertility, distance;
		for (var i = 0; i < centers.length; i++) {
			var center = centers[i];
			var thisDist = distanceToCenter(w, h, center);
			if (!distance || distance > thisDist){
				distance = thisDist;
				val = center.val;
				fertility = center.fertility;
			}
		};
		//modifiedFertility = Math.max(0, fertility/(distance/2));
		//console.log(distance, fertility, modifiedFertility);
		return [val, fertility]; // returns value and fertility modified by distance
	}


	var tileSize = 20, map = [], centers = [], centerChance = 0.02; grassChance = 0.5, waterChance = 0.02, water = [], caveChance = 0.01, caves = [];
	// set center points
	for (var h = 0; h < height; h++) {
		map.push( [] );
		for (var w = 0; w < width; w++) {
			var value = 'dirt', chance = Math.random();
			if ( chance < grassChance ){
				value = 'grass';
			} else if ( chance < grassChance + waterChance ){
				value = 'water';
			}
			// else if ( Math.random() < caveChance ){
			// 	caves.push( {x: w, y: h} );
			// }

			if ( Math.random() < centerChance || w == 0 && h == 0 ){
				// if ( w == 0 && h == 0 ){ value = 'water'; }
				var fertility = 1+rand(9)
				centers.push({x: w, y: h, val: value, fertility: fertility});
				map[h].push( {type: value, fertility: fertility, x: x+w*20, y: y+h*20, w: 20, h: 20} );
				if ( value == 'water' ){ water.push( {x: x+w*20, y: y+h*20, w: 20, h: 20} ) }
				if ( value == 'grass' && app.startPoint.x == undefined && w > 25 && w < 35 && h > 25 && h < 35 ){
					app.startPoint.x = x + w*20;
					app.startPoint.y = y + h*20;
					//console.log('app.startPoint', app.startPoint.x, app.startPoint.y, w, h)
				}
			} else {
				map[h].push( null ); 
			}
		};
	};
	// set polygon values
	var stoneChance = 0.015, stones = [], treeChance = 0.005, trees = [], herbChance = 0.0001, herbs = [];
	for (var h = 0; h < height; h++) {
		for (var w = 0; w < width; w++) {
			if ( !map[h][w] ){
				var data = nearestCenterData(w, h);
				var val = data[0];
				var fertility = data[1]
				map[h][w] = {type: val, fertility: data[1], x: x+w*20, y: y+h*20, w: 20, h: 20};
				if ( val == 'water' ){
					water.push( {x: x+w*20, y: y+h*20, w: 20, h: 20} );
				} else if ( val == 'grass' && Math.random() < stoneChance ){
					stones.push( createStones(x+w*20, y+h*20, wf) );
				} else if ( val == 'dirt' && Math.random() < treeChance ){
					trees.push( createTree(x+w*20, y+h*20, wf) );
				} else if ( val == 'grass' && Math.random() < fertility*fertility*herbChance ){
					herbs.push( createHerb(x+w*20, y+h*20, wf) )
				}
			}
		};
	};
	return [map, water, stones, trees, herbs, caves];
}

// ensure player has a starting spot
while ( app.startPoint.x == undefined || collidesArray(app.startPoint, app.world.array[0].water.concat( app.world.array[0].stones )  ) ){
	app.world.array = [new WorldFragment( -500, -500 )];
	console.log('recreating failed starting world');
}



function spriteAtPos(x, y){
	var sprites = app.world.clickables;
	for (var i = 0; i < sprites.length; i++) {
		var sprite = sprites[i];
		if ( isPosInSprite(sprite, x, y) ){
			return sprite;
		}
	};
}






assetWasLoaded();


