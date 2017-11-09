var app = app || {};

app.plantTypes = [
	{
		name: 'tomato',
		GDDbase: 11,
		GDDpoints: [75, 150, 225],
		diesAt: 2,
		frameX: 0,
		dig: false,
		regrowGDD: 15,
		yield: function(){ return 3+rand(3) }
	},
	{
		name: 'potato',
		GDDbase: 4,
		GDDpoints: [75, 150, 225],
		diesAt: -8,
		frameX: 1,
		dig: true,
		regrowGDD: 0,
		yield: function(){ return 6+rand(3) }
	},
	{
		name: 'carrot',
		GDDbase: 3,
		GDDpoints: [75, 150, 225],
		diesAt: -8,
		frameX: 2,
		dig: true,
		regrowGDD: 0,
		yield: function(){ return 6+rand(6) }
	},
	{
		name: 'artichoke',
		GDDbase: 12,
		GDDpoints: [75, 150, 225],
		diesAt: 2,
		frameX: 3,
		dig: false,
		regrowGDD: 0,
		yield: function(){ return 1 }
	},
	{
		name: 'pepper',
		GDDbase: 10,
		GDDpoints: [75, 150, 225],
		diesAt: 2,
		frameX: 4,
		dig: false,
		regrowGDD: 15,
		yield: function(){ return 3+rand(6) }
	},
	{
		name: 'eggplant',
		GDDbase: 15,
		GDDpoints: [75, 150, 225],
		diesAt: 2,
		frameX: 5,
		dig: false,
		regrowGDD: 15,
		yield: function(){ return 3+rand(3) }
	},
	{
		name: 'corn',
		GDDbase: 9,
		GDDpoints: [75, 150, 225],
		diesAt: 2,
		frameX: 6,
		dig: false,
		regrowGDD: 0,
		yield: function(){ return 1+rand(1) }
	},
];

app.createHerb = function(x, y, wf, variety, sq, GDD){
	var herb, items = app.items;
	herb = sprite('herb', x, y, 10, 10);
	herb.sq = sq;
	herb.GDD = GDD || 0;
	herb.stage = 0;
	herb.reharvestable = false;
	if ( !variety.dig ){ herb.regrowthGDD = 0; }
	if (GDD > 0){
		for (var i = 0; i < variety.GDDpoints.length; i++) {
			var GDDpoint = variety.GDDpoints[i];
			if ( GDD >= GDDpoint ){ herb.stage = i+1 }
			else { break; }
		};
	}
	switch(herb.stage){
		case 0:
			herb.contents = [{data: items.leaf, amount: 1}, ];
			break;
		case 1: 
			herb.contents = [{data: items.leaf, amount: 2}, ];
			break;
		case 2: 
			herb.contents = [{data: items.leaf, amount: 2}, ];
			herb.reharvestable = true;
			break;
		case 3: 
			herb.contents = [{data: app.items[variety.name], amount: variety.yield()} ];
			herb.reharvestable = !variety.dig;
			break;
	}
	herb.variety = variety;
	herb.wf = wf;
	herb.name = "Herb";
	herb.time = 0;
	herb.inspect = app.inspectHerb;
	return herb;
}

app.inspectHerb = function(player, herb){
	switch(herb.stage){
		case 0:
			say("A tender young sprout.");
			break;
		case 1: 
			say("A growing plant.");
			break;
		case 2: 
			say("It must be a "+herb.name+" plant, it's almost ready!");
			break;
		case 3: 
			say("A fully grown "+herb.name+" plant.");
			break;
	}
}

app.renderHerb = function(herb){
	var img = app.imgs.plants;
	if ( collides(herb, app.camera) ){
		app.ctx.drawImage(img, herb.variety.frameX*32, herb.stage*64, 32, 64, herb.x-app.camera.x-5, herb.y-app.camera.y-30, 20, 40);
	}
}

app.updateHerb = function(herb, dt){
	// var fertility = herb.wf.getTileAt(herb.x, herb.y).fertility;
	// herb.time += dt*fertility/10*Math.random();
	// if ( herb.time > 25 ){
	// 	herb.time -= 25;
	// 	app.manageContents(herb, items.leaf, 1);
	// }
}

app.clickHerb = function(herb){
	//console.log(herb.GDD, herb.stage);
	app.openStash(herb, true, !herb.reharvestable);
}

app.growHerb = function(herb){
	var temp = app.temp, variety = herb.variety, GDDgain = 0, items = app.items;
	if (temp.hi > variety.GDDbase){
		GDDgain = ((temp.hi + Math.max(temp.low, variety.GDDbase))/2 - variety.GDDbase)*(0.75+Math.random()*0.75);
		herb.GDD += GDDgain;
		if (herb.stage >= 3 && herb.regrowthGDD >= 0){ herb.regrowthGDD += GDDgain; }
	}
	if ( herb.GDD > variety.GDDpoints[herb.stage]){
		herb.stage++;
		if (herb.stage == 1){
			app.manageContents(herb, items.leaf, 1);
		} else if (herb.stage == 2){
			herb.reharvestable = true;
		} else if (herb.stage == 3){
			if (variety.dig){ herb.reharvestable = false; }
			if (variety.regrowGDD > 0){ herb.regrowthGDD = herb.GDD - variety.GDDpoints[2]; }
			app.manageContents(herb, items.leaf, 0, true);
			app.manageContents( herb, items[variety.name], variety.yield());
		} 
	}
	if (herb.regrowthGDD >= variety.regrowGDD){
		herb.regrowthGDD -= variety.regrowGDD;
		app.manageContents( herb, items[variety.name], Math.round(variety.yield()/2) );
	}
}
app.checkForPlantDeath = function(){
	var temp = app.temp.current;
	if (temp <= 2)
	var plants = [];
	for (var i = 0; i < app.world.array.length; i++) {
		var wf = app.world.array[i];
		for (var j = 0; j < wf.herbs.length; j++) {
			var plant = wf.herbs[j];
			//console.log('CFPD temp', temp, plant.variety.diesAt)
			if ( plant.variety.diesAt >= temp ){
				//console.log(plant.variety.diesAt, temp, 'DEAD');
				var center = plant.sq.center || plant.sq;
				center.herbCount--;
				plant.sq.obj = null;
				wf.herbs.splice(j, 1);
				j--;
			}
		};
	};
}


