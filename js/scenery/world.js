var app = app || {};
app.assetsToLoad ++;

app.biomes = {
	rocky: {
		name: 'rocky',
		chance: 0.245,
		tileType: 'dirt',
		stoneChance: 0.015,
		treeChance: 0,
		herbChance: 0
	},
	meadow: {
		name: 'meadow',
		chance: 0.245,
		tileType: 'grass',
		stoneChance: 0.0002,
		treeChance: 0,
		herbChance: 0.0005
	},
	oaks: {
		name: 'oaks',
		chance: 0.245,
		tileType: 'grass',
		stoneChance: 0,
		treeChance: 0.02,
		herbChance: 0
	},
	pines: {
		name: 'pines',
		chance: 0.245,
		tileType: 'dirt',
		stoneChance: 0.002,
		treeChance: 0,
		herbChance: 0
	},
	water: { 
		name: 'water',
		chance: 0.02,
		tileType: 'water',
		stoneChance: 0,
		treeChance: 0,
		herbChance: 0
	}
}

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
	//this.caves = map[5];
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
			if (square.biome.tileType == 'dirt') {
				c.drawImage(dirt, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			} else if (square.biome.tileType == 'water') {
				c.drawImage(water, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			} else if (square.biome.tileType == 'grass') {
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
		var val, fertility, distance, nearestCenter;
		for (var i = 0; i < centers.length; i++) {
			var center = centers[i];
			var thisDist = distanceToCenter(w, h, center);
			if (!distance || distance > thisDist){
				distance = thisDist;
				biome = center.biome;
				fertility = center.fertility;
				centerTile = center.tile;
			}
		};
		return {biome: biome, fertility: fertility, center: centerTile}; 
	}


	var tileSize = 20, map = [], centers = [], centerChance = 0.02; water = []; //, caveChance = 0.01, caves = [];
	// set center points //
	var biomes = app.biomes;
	for (var h = 0; h < height; h++) {
		map.push( [] );
		for (var w = 0; w < width; w++) {

			if ( Math.random() < centerChance || w == 0 && h == 0 ){
				var biome, chance = Math.random();
				if ( chance < biomes.rocky.chance ){
					biome = biomes.rocky;
				} else if ( chance < biomes.rocky.chance + biomes.meadow.chance  ){
					biome = biomes.meadow;
				} else if ( chance < biomes.rocky.chance + biomes.meadow.chance + biomes.oaks.chance  ){
					biome = biomes.oaks;
				} else if ( chance < biomes.rocky.chance + biomes.meadow.chance + biomes.oaks.chance + biomes.pines.chance  ){
					biome = biomes.pines;
				} else if ( chance < biomes.rocky.chance + biomes.meadow.chance + biomes.oaks.chance + biomes.pines.chance + biomes.water.chance ){
					biome = biomes.water;
				} else {
					console.log('ERROR HERE')
				}

				var fertility = 1+rand(9);
				var tile = {biome: biome, fertility: fertility, x: x+w*20, y: y+h*20, w: 20, h: 20, magnitude: 1}
				centers.push({x: w, y: h, biome: biome, fertility: fertility, tile: tile});
				map[h].push( tile );
				if ( biome.tileType == 'water' ){ water.push( {x: x+w*20, y: y+h*20, w: 20, h: 20} ) }
				if ( biome.name == 'meadow' && app.startPoint.x == undefined && w > 25 && w < 35 && h > 25 && h < 35 ){
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
	stones = [], treeChance = 0.005, trees = [], herbChance = 0.0001, herbs = [];
	for (var h = 0; h < height; h++) {
		for (var w = 0; w < width; w++) {
			if ( !map[h][w] ){
				var data = nearestCenterData(w, h);
				var biome = data.biome;
				var fertility = data.fertility;
				data.center.magnitude++;

				map[h][w] = {biome: biome, fertility: fertility, center: data.center, x: x+w*20, y: y+h*20, w: 20, h: 20};
				if ( biome.tileType == 'water' ){
					water.push( {x: x+w*20, y: y+h*20, w: 20, h: 20} );
				} else if ( biome.stoneChance && Math.random() < biome.stoneChance ){
					stones.push( createStones(x+w*20, y+h*20, wf) );
				} else if ( biome.treeChance && Math.random() < biome.treeChance ){
					trees.push( createTree(x+w*20, y+h*20, wf) );
				} else if ( biome.herbChance && Math.random() < fertility*fertility*biome.herbChance ){
					herbs.push( createHerb(x+w*20, y+h*20, wf) );
				}
			}
		};
	};
	return [map, water, stones, trees, herbs]; //, caves];
}

// ensure player has a starting spot
while ( app.startPoint.x == undefined || collidesArray(app.startPoint, app.world.array[0].water.concat( app.world.array[0].stones )
											.concat( app.world.array[0].herbs
											.concat( app.world.array[0].trees ) )  ) ){
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


