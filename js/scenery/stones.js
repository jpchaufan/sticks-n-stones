var app = app || {};

app.stonePiles = [];

createStones = function(x, y){
	app.stonePiles.push( sprite('stonePile', x, y, 28, 16) );
}

app.drawStonePiles = function(){
	var img = app.imgs.stonePile;
	for (var i = 0; i < app.stonePiles.length; i++) {
		var stonePile = app.stonePiles[i];
		if ( collides(stonePile, app.camera) ){
			app.ctx.drawImage(img, stonePile.x-app.camera.x-2, stonePile.y-app.camera.y-11);
		}
	};
}

app.clickStonePile = function(clickedOn){
	if ( !app.gameEvents.pickedStones ){ say('stones... good!'); app.gameEvents.pickedStones = true; }
		for (var i = 0; i < app.stonePiles.length; i++) {
			var stonePile = app.stonePiles[i];
			if ( stonePile === clickedOn ){
				if ( itemStock('stones') < 200 ){
					app.stonePiles.splice(i, 1); i--;
					item('stones', Math.round( Math.random()*20+10 ))	
				} else {
					say('too many stones!');
				}
				
			}
		};
}

// initial stone piles:
createStones(app.world.w/2+80+rand(20), app.world.h/2-70+rand(20) );
createStones(app.world.w/2-120+rand(20), app.world.h/2+rand(30));

