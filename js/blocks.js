var app = app || {};

app.blocks = [];

app.makeBlock = function(xPos, yPos){
	var size = 10;
	var x = Math.round(xPos/ size )* size - size/2 ;
	var y = Math.round(yPos/ size )* size - size/2 ;
	if ( !app.isBlockAt(x, y) && !isPosInSprite(app.campfire, x, y) ){
		item('stones', -1);
		var block = sprite('block', x, y,  size ,  size , '#424242');
		app.blocks.push( block );
		if ( !app.gameEvents.madeWall ){ say('wall... good!'); app.gameEvents.madeWall = true; }
	}
}

app.updateBlocks = function(){
	for (var i = 0; i < app.blocks.length; i++) {
		var block = app.blocks[i];
		if ( collides(block, app.camera) ){ block.draw(); }
	};
}

app.isBlockAt = function(x, y){
	for (var i = 0; i < app.blocks.length; i++) {
		if ( app.blocks[i].x == x && app.blocks[i].y == y ){
			return true;
		}
	};
}

app.destroyBlock = function(sprite){
	for (var i = 0; i < app.blocks.length; i++) {
		var block = app.blocks[i];
		if (block === sprite){
			app.blocks.splice(i, 1);
			item('stones', 1);
			return;
		}
	};
}