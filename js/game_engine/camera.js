var app = app || {};

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









