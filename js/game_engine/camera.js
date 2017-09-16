var app = app || {};

app.world = { w: app.canvas.width+30, h: app.canvas.height+30, nw: -30, nh: -30};

// app.world.update = function(){
// 	var cam = app.camera;
// 	if ( cam.x < this.nw ){
// 		this.nw -= app.canvas.width;
// 		this.populate(cam.x - cam.w, cam.y, cam.w, cam.h);
// 	}
// 	if ( cam.x + cam.w > this.w ){
// 		this.w += app.canvas.width;
// 		this.populate(cam.x + cam.w, cam.y, cam.w, cam.h);
// 	}
// 	if ( cam.y < this.nh ){
// 		this.nh -= app.canvas.height;
// 		this.populate(cam.x, cam.y - cam.h, cam.w, cam.h);
// 	}
// 	if ( cam.y + cam.h > this.h ){
// 		this.h += app.canvas.height;
// 		this.populate(cam.x, cam.y + cam.h, cam.w, cam.h);
// 	}
// }

app.camera = {
	x: 0,
	y: 0, 
	w: app.canvas.width,
	h: app.canvas.height
};

app.camera.setTo = function(sprite){
	this.x = sprite.x+sprite.w/2 - this.w/2;
	this.y = sprite.y+sprite.h/2 - this.h/2;
}

app.world.populate = function(x, y, w, h){
	console.log('pop');
	var numOfStonePiles = Math.round( Math.random()*8 );
	var numOfTrees = Math.round( Math.random()*8 );
	var itemsToAdd = [];
	for (var i = 0; i < numOfStonePiles; i++) {
		var possible = { kind: 'stonePile', x: x+rand(w), y: rand(h), w: 40, h: 40 };
		if ( !collidesArray(possible, itemsToAdd) ){
			itemsToAdd.push( possible );
		}
	};
	for (var i = 0; i < numOfTrees; i++) {
		var possible = { kind: 'tree', x: x+rand(w), y: y+rand(h), w: 50, h: 50 };
		if ( !collidesArray(possible, itemsToAdd) ){
			itemsToAdd.push( possible );
		}
	};
	for (var i = 0; i < itemsToAdd.length; i++) {
		var item = itemsToAdd[i];
		if (item.kind == 'stonePile'){
			createStones(item.x, item.y);	
		} else if (item.kind == 'tree'){
			createTree(item.x, item.y);
		}
		
	};
	createTree(x+30, y+30);
	createTree(x+w-30, y+30);
	createTree(x+30, y+h-30);
	createTree(x+w-30, y+h-30);
}	

function pointHome(){
	var rot = angleTo(app.player, app.startPoint.x, app.startPoint.y)-0.5*3.14;
	var deg = rot * 180 / 3.1418;
	app.compass.elem.style.transform = 'rotate('+deg+'deg)';
}

app.compass = {};
app.compass.create = function(){
	var size = app.canvas.width / 5;
	this.elem = createUI(10, 10, size, size, '#fff');
	this.elem.style.borderRadius = '50%';
	this.elem.style.backgroundImage = "url('imgs/arrow.png')";
	this.elem.style.backgroundRepeat = 'no-repeat';
	this.elem.style.backgroundSize = '100%';

	document.body.appendChild( this.elem );	
}
app.compass.create();









