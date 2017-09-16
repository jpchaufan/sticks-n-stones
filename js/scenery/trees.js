var app = app || {};

app.trees = [];

createTree = function(x, y){
	app.trees.push( sprite('tree', x, y, 30, 28) );
}

app.drawTrees = function(){
	var img = app.imgs.tree;
	for (var i = 0; i < app.trees.length; i++) {
		var tree = app.trees[i];
		if ( collides(tree, app.camera) ){
			app.ctx.drawImage(img, tree.x-app.camera.x-16, tree.y-app.camera.y-30);
		}
	};
}


// initial trees:
createTree(app.world.w/2-220+rand(20), app.world.h/2-150+rand(20) );

