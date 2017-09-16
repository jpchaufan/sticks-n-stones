var app = app || {};
app.assetsToLoad ++;

// there is a world, which has a grid, holding world fragments

this.world = {
	array: [[ new WorldFragment( -500, -500 ) ]],
	x: -500,
	y: -500,
	w: 500,
	h: 500
};




function WorldFragment(x, y){
	this.x = x;
	this.y = y;
	var map = generateMap();
	this.map = map[0];
	this.caves = map[1];
}

function generateMap(){
	var start = Date.now();
	var width = 50, height = 50; // if tilseSize == 20, map w and h == 1000 px
	function distanceToCenter(w, h, center){
		var x = Math.abs( w - center.x );
		var y = Math.abs( h - center.y );
		return Math.sqrt(x*x+y*y);
	}
	function nearestCenterValue(w, h){
		var val, distance;
		for (var i = 0; i < centers.length; i++) {
			var center = centers[i];
			var thisDist = distanceToCenter(w, h, center);
			if (!distance || distance > thisDist){
				distance = thisDist;
				val = center.val;
			}
		};
		return val;
	}


	var tileSize = 20, map = [], centers = [], centerChance = 0.02; grassChance = 0.5, waterChance = 0.01, caveChance = 0.01, caves = [];
	// set center points
	for (var h = 0; h < height; h++) {
		map.push( [] );
		for (var w = 0; w < width; w++) {
			var value = '^', chance = Math.random();
			if ( chance < grassChance ){
				value = '#';

			} else if ( chance < grassChance + waterChance ){
				value = ' ';
				if ( Math.random() < caveChance ){
					caves.push( {x: w, y: h} );
				}
			}

			if ( Math.random() < centerChance ){
				centers.push({x: w, y: h, val: value});
				map[h].push( value );
			} else {
				map[h].push( null ); 
			}
		};
		//console.log(map[h].toString());
	};
	// set polygon values
	for (var h = 0; h < height; h++) {
		for (var w = 0; w < width; w++) {
			if ( !map[h][w] ){
				map[h][w] = nearestCenterValue(w, h);
			}
		};
		console.log(map[h].toString(), Math.random());
	};
	console.log(caves);
	console.log( (Date.now() - start)/1000 );
	return [map, caves];
}













assetWasLoaded();


