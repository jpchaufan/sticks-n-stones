var app = app || {};

app.shade = function(){

	var w = 4, h = 4, c = app.ctx, cw = app.canvas.width, ch = app.canvas.height, player = app.player, cam = app.camera, light = app.campfire, min = Math.min;
	var numW = cw / w;
	var numH = ch / h;
	c.fillStyle = '#000';
	var mod = (Math.sin(app.playTime/2)+1);
	for (var nw = 0; nw < numW; nw++) {
		for (var nh = 0; nh < numH; nh++) {
			var x = w*nw+cam.x, y = h*nh+cam.y;
			var dayTimeMod = ( distanceTo(cam, x, y)*mod*mod*mod/2 / cw ); 
			var lightSourceMod = min(1, distanceTo(light, x, y) / cw*3);
			c.globalAlpha = min(dayTimeMod, lightSourceMod);
			c.fillRect(w*nw, h*nh, w, h);
		};	
	};
	c.globalAlpha = 1;
}