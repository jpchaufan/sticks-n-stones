var app = app || {};

app.campfire = sprite('campfire', app.world.w/2, app.world.h/2, 20, 20);
app.campfire.anim = 0;
app.campfire.burns = 0.5;
app.campfire.update = function(){
	var player = app.player;
	if ( collides(this, player) && player.y + player.h/2 < this.y+this.h){
		player.hurt( this.burns );
		if (!app.gameEvents.investigatedFire){
			say("Ow... fire hot!");
			app.gameEvents.investigatedFire = true;
		}
	}

	// for (var i = 0; i < app.enemies.length; i++) {
	// 	var enemy = app.enemies[i]
	// 	if ( collides(this, enemy) ){
	// 		if ( !app.gameEvents.burnedEnemy ){ say('it burn!'); app.gameEvents.burnedEnemy = true; }
	// 		enemy.health -= this.burns;
	// 		if ( enemy.health <= 0 ){ app.enemies.splice(i, 1); i--; }
	// 	}
	// };

	if ( collides(this, app.camera) ){
		this.draw();
	}
}

app.campfire.draw = function(){
	var cam = app.camera;
	var c = app.ctx, img = app.imgs.campfire, x = this.x - cam.x, y = this.y - cam.y;
	this.anim++; if ( this.anim > 4*8-1 ){ this.anim = 0 }
	var frame = Math.floor(this.anim/8);
	c.drawImage(img, frame*16, 0, 16, 16, x-2, y-2, this.w, this.h);
}







