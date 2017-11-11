var app = app || {};



app.thrownItems = [];
app.throw = function(thrower, x, y, itemData){
	console.log('throw', itemData.name)
	var cam = app.camera;
	var projectile = {};
	projectile.data = itemData;
	projectile.thrower = thrower;
	projectile.w = 12;
	projectile.h = 12;
	projectile.x = thrower.x - thrower.w/2 + projectile.w;
	projectile.y = thrower.y - thrower.h/2 + projectile.h;
	var velocities = getVelocities(thrower, x, y, thrower.throwPower*itemData.throwSpeed || 200*itemData.throwSpeed);
	projectile.vx = velocities[0];
	projectile.vy = velocities[1];
	projectile.age = 0;
	projectile.rotation = 0;
	app.thrownItems.push( projectile );
	// return direction thrown
	return velocities[2];
}

app.updateThrown = function(dt){
	var ctx = app.ctx;
	var cam = app.camera;
	for (var i = 0; i < app.thrownItems.length; i++) {
		var projectile = app.thrownItems[i];
		projectile.age += dt;
		if ( projectile.age <= 0.75 ){
			projectile.x += projectile.vx*dt;
			projectile.y += projectile.vy*dt;
			ctx.save();
			ctx.translate(projectile.x - cam.x+6, projectile.y - cam.y+6);
			ctx.rotate( projectile.rotation += dt*15 );
			ctx.drawImage(app.imgs[projectile.data.throwImgName], 0, 0, projectile.data.throwW, projectile.data.throwH, -6, -6, projectile.w, projectile.h);	
			ctx.restore();
		} 
		else {
			app.thrownItems.splice(i, 1); i--;
		}
	};
}



