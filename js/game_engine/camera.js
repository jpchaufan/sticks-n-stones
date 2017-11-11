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




