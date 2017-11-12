var app = app || {};

app.worldFragSize = 1000;

app.assetsToLoad ++;

// there is a world, which has a grid, holding world fragments
app.startPoint = {w: 24, h: 24};
app.world = {
	array: [new WorldFragment( -app.worldFragSize/2, -app.worldFragSize/2 )],
	x: -app.worldFragSize/2,
	y: -app.worldFragSize/2,
	w: app.worldFragSize/2,
	h: app.worldFragSize/2,
	update: function(dt){
		this.clickables = [app.player].concat(app.deer);
		this.collideables = [];
		// update only world fragments colliding with camera
		for (var i = 0; i < this.array.length; i++) {
			var worldFrag = this.array[i], intensity;

			// // update all campfires and walls
			// for (var i = 0; i < worldFrag.campfires.length; i++) {
			// 	intensity = worldFrag.campfires[i].intensity;
			// 	intensity -= 1*dt;
			// 	console.log(intensity);
			// 	if (intensity <= 0){
			// 		worldFrag.campfires.splice(i, 1); i--;
			// 	}
			// };


			if ( collides(app.camera, worldFrag) ){ worldFrag.updateBefore(dt) }
		};
		//////////////////////////

		app.player.update(dt);

		app.updateThrown(dt);

		app.updateAnimals(dt);

		/////////////////////////
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
			var x = Math.floor( (cam.x+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			var y = Math.floor( (cam.y+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			console.log('top left', x, y)
			this.array.push( new WorldFragment(x, y) )
		}
		// top right
		if ( !isPosInSprites(this.array, cam.x+cam.w, cam.y) ){
			var x = Math.ceil( (cam.x+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			var y = Math.floor( (cam.y+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			console.log('top right', x, y)
			this.array.push( new WorldFragment(x, y) )
		}
		// bottom left
		if ( !isPosInSprites(this.array, cam.x, cam.y+cam.h) ){
			var x = Math.floor( (cam.x+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			var y = Math.ceil( (cam.y+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			console.log('bottom left', x, y)
			this.array.push( new WorldFragment(x, y) )
		}
		// bottom right
		if ( !isPosInSprites(this.array, cam.x+cam.w, cam.y+cam.h) ){
			var x = Math.ceil( (cam.x+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			var y = Math.ceil( (cam.y+app.worldFragSize/2)/app.worldFragSize )*app.worldFragSize-app.worldFragSize/2;
			console.log('bottom right', x, y)
			this.array.push( new WorldFragment(x, y) )
		}
	}
	

};






function WorldFragment(x, y){
	this.x = x;
 	this.y = y;
 	this.w = app.worldFragSize;
 	this.h = app.worldFragSize;
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
						.concat(this.stones).concat(this.walls).concat(this.trees);//.concat(this.herbs);
	world.clickables = world.clickables.concat(this.stones).concat(this.walls).concat(this.trees).concat(this.campfires).concat(this.herbs).concat(this.water);

	var c = app.ctx, cam = app.camera, dirt = app.imgs.dirt, 
	   water = app.imgs.water, grass = app.imgs.grass, snow = app.imgs.snow;
	for (var h = 0; h < this.map.length; h++) {
		for (var w = 0; w < this.map.length; w++) {
			var square = this.map[h][w];
			if (square.biome.tileType == 'water') {
				c.drawImage(water, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			}
			else if (app.temp.current <= 0 ){
				c.drawImage(snow, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			}
			else if (square.biome.tileType == 'grass' || square.biome.name == 'rocky' && app.season.current == 'summer' ) {
				c.drawImage(grass, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			}
			else if (square.biome.tileType == 'dirt') {
				c.drawImage(dirt, 0, 0, 32, 32, this.x + w*20 - cam.x, this.y + h*20 - cam.y, 20, 20);
			}
		};
	};
	for (var i = 0; i < this.herbs.length; i++) {
		var herb = this.herbs[i];
		if ( herb.kill ){
			herb.sq.obj = null;
			var center = herb.sq.center || herb.sq;
			center.herbCount--;
			this.herbs.splice(i, 1);
			i--;
		} 
		else if ( collides(herb, cam) ){
			app.renderHerb(herb);
		}
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
	for (var i = 0; i < this.walls.length; i++) {
		var wall = this.walls[i];
		if ( collides(wall, cam) ){
			wall.durability -= dt*0.02;
			if (wall.durability <= 0){
				this.walls.splice(i, 1);
			}
			app.renderWall(wall);
		}
	};
	for (var i = 0; i < this.campfires.length; i++) {
		var campfire = this.campfires[i];
		if ( collides(campfire, cam) ){
			campfire.intensity -= dt*0.07;
			if (campfire.intensity <= 0){
				this.campfires.splice(i, 1);
			}
			app.renderCampfire(campfire);
		}
	};
	for (var i = 0; i < this.trees.length; i++) {
		var tree = this.trees[i];
		//app.updateTree(tree, dt);
		if ( collides(tree, cam) ){
			app.renderTree(tree);
		}
	};
}

WorldFragment.prototype.biomeHerbDensityFactor = function(sq){
	var center = sq.center || sq;
	var ratio = center.herbCount / center.magnitude;
	if (ratio >= 0.7){ return 0 }
	if (ratio > 0.35){ return ( (0.7 - ratio) / 0.35 ) };
	if (ratio < 0.35){ return Math.abs(2 - (0.75 - ratio) / 0.35) }
	return 1;

}

WorldFragment.prototype.herbsSpawn = function(){
	for (var h = 0; h < this.map.length; h++) {
		for (var w = 0; w < this.map[h].length; w++) {
			var sq = this.map[h][w];
			if (!sq.obj && sq.biome.herbChance && sq.biome.herbChance*sq.fertility*sq.fertility*this.biomeHerbDensityFactor(sq) > Math.random() ){
				var center = sq.center || sq;
				//console.log('ratio, factor', center.herbCount / center.magnitude, this.biomeHerbDensityFactor(sq))
				var DGGboost = app.day % 84 * 5 * Math.random();
				this.herbs.push( app.createHerb(this.x+w*20, this.y+h*20, this, sq.biome.herbType, sq, DGGboost) );
				center.herbCount++;
			}
		};
	};
}

function generateMap(x, y, wf){
	var start = Date.now();
	var width = app.worldFragSize/20, height = app.worldFragSize/20; // if tilseSize == 20, map w and h == app.worldFragSize px
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


	var tileSize = 20, map = [], centers = [], centerChance = 0.015; water = []; //, caveChance = 0.01, caves = [];
	// set center points //
	var biomes = app.biomes;
	while (centers.length == 0){
		for (var h = 0; h < height; h++) {
			map.push( [] );
			for (var w = 0; w < width; w++) {

				if ( Math.random() < centerChance || w == 0 && h == 0 ){
					var biome, chance = Math.random();
					if ( chance < biomes.rocky.chance ){
						biome = biomes.rocky;
					} else if ( chance < biomes.rocky.chance + biomes.meadow.chance  ){
						biome = biomes.meadow;
						biome.herbType = app.plantTypes[rand(6)];
					} else if ( chance < biomes.rocky.chance + biomes.meadow.chance + biomes.fruitTrees.chance  ){
						biome = biomes.fruitTrees;
					} else if ( chance < biomes.rocky.chance + biomes.meadow.chance + biomes.fruitTrees.chance + biomes.pines.chance  ){
						biome = biomes.pines;
					} else if ( chance < biomes.rocky.chance + biomes.meadow.chance + biomes.fruitTrees.chance + biomes.pines.chance + biomes.water.chance ){
						biome = biomes.water;
					} else {
						console.log('ERROR');
					}

					var fertility = 7;//1+rand(9);
					var tile = {biome: biome, fertility: fertility, x: x+w*20, y: y+h*20, w: 20, h: 20, magnitude: 1, herbCount: 0}
					centers.push({x: w, y: h, biome: biome, fertility: fertility, tile: tile});
					map[h].push( tile );
					if ( biome.tileType == 'water' ){ water.push( {x: x+w*20, y: y+h*20, w: 20, h: 20, type: 'water'} ) }
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
	}
	// set polygon values
	var stones = [], trees = [], herbs = [];
	for (var h = 0; h < height; h++) {
		for (var w = 0; w < width; w++) {
			if ( !map[h][w] ){
				var data = nearestCenterData(w, h);
				var biome = data.biome;
				var fertility = data.fertility;
				data.center.magnitude++;

				map[h][w] = {biome: biome, fertility: fertility, center: data.center, x: x+w*20, y: y+h*20, w: 20, h: 20};
				if ( biome.tileType == 'water' ){
					water.push( {x: x+w*20, y: y+h*20, w: 20, h: 20, type: 'water'} );
				}
				else if ( biome.stoneChance && Math.random() < biome.stoneChance ){
					stones.push( app.createStones(x+w*20, y+h*20, wf) );
				}
				else if ( biome.fruitTreeChance && Math.random() < biome.fruitTreeChance ){
					trees.push( app.createTree(x+w*20, y+h*20, wf, 'Fruit Tree') );
				}
				else if ( biome.pineTreeChance && Math.random() < biome.pineTreeChance ){
					trees.push( app.createTree(x+w*20, y+h*20, wf, 'Pine Tree') );
				}
				else if ( biome.herbChance && app.temp.current >= biome.herbType.diesAt && Math.random() < fertility*fertility*biome.herbChance ){
					var herb = app.createHerb(x+w*20, y+h*20, wf, biome.herbType, map[h][w], Math.random()*30 + app.day % 84 * 10 * Math.random());
					herbs.push( herb );
					map[h][w].obj = herb;
					data.center.herbCount++;
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
	app.world.array = [new WorldFragment( -app.worldFragSize/2, -app.worldFragSize/2 )];
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






app.assetWasLoaded();


