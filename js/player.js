var app = app || {};

app.startPoint = {x: app.world.w/2-50,  y: app.world.h/2-50}

app.player = sprite('player', app.startPoint.x, app.startPoint.y, 24, 24);
app.camera.setTo(app.player);

app.player.speed = 100;
app.player.direction = 'down';
app.player.isMoving = false;
app.player.anim = 0;

app.player.move = function(dt){

	var cam = app.camera;
	if ( !this.alive ){ return }
	this.isMoving = false;
	if (app.controller.left){ 
		var possible = { x: this.x-this.speed*dt, y: this.y, w: this.w, h: this.h }
		if ( !collidesArray( possible, blockingSprites() ) ){
			this.x -= this.speed*dt; cam.x -= this.speed*dt; this.direction = 'left'; this.isMoving = true;
		}
	}
	if (app.controller.right){ 
		var possible = { x: this.x+this.speed*dt, y: this.y, w: this.w, h: this.h }
		if ( !collidesArray( possible, blockingSprites() ) ){
			this.x += this.speed*dt; cam.x += this.speed*dt; this.direction = 'right'; this.isMoving = true;
		}
	}
	if (app.controller.up){ 
		var possible = { x: this.x, y: this.y-this.speed*dt, w: this.w, h: this.h }
		if ( !collidesArray( possible, blockingSprites() ) ){
			this.y -= this.speed*dt; cam.y -= this.speed*dt; this.direction = 'up'; this.isMoving = true;
		}
	}
	if (app.controller.down){ 
		var possible = { x: this.x, y: this.y+this.speed*dt, w: this.w, h: this.h }
		if ( !collidesArray( possible, blockingSprites() ) ){
			this.y += this.speed*dt; cam.y += this.speed*dt; this.direction = 'down'; this.isMoving = true;
		}
	}
}

app.player.mouse = function(){
	var ctrl = app.controller;
	if ( ctrl.mousedown ){
		var x = ctrl.x;
		var y = ctrl.y;
		var dist = distanceTo(this, x, y);
		var clickedOn = ctrl.clickedOn;
		if ( clickedOn ){
			if (clickedOn.type == 'campfire'){
				if ( ctrl.status == 'click' ) { say('mmm... fire warm'); }
			} 
			else if (clickedOn.type == 'player'){
				if ( ctrl.status == 'click' ) { say('ug!'); }
			} 
			else if (clickedOn.type == 'stonePile'){
				if (ctrl.status == 'click'){
					if (dist < 100){ app.clickStonePile(clickedOn); } 
					else { say('too far!'); }	
				}
			}
			else if ( clickedOn.type == 'block' && dist < 80){
				if ( ctrl.status == 'click' ){ app.destroyBlock(clickedOn); }
				else if ( ctrl.status == 'dragging' ){ app.destroyBlock(ctrl.draggedOn); }
				
			}
		} else if ( (dist > 20 && dist < 72) ){
			if ( findItem('stones') >= 0 ){
				app.makeBlock( x, y );	
			}
		}
	}
	ctrl.status = 'holding';
}

app.player.action = function(){
	//  if ( app.controller.action ){
	// 	var x = app.controller.x, y = app.controller.y;
	// 	//var angle = angleTo(this, x, y);
	// 	var spriteHere = spriteAtPos(x, y);
	// 	if (spriteHere){
	// 		if ( spriteHere.type == 'block' && distanceTo(this, x, y) < 80 ){
	// 			app.destroyBlock(spriteHere);
	// 		}
	// 	}
	// }
}

app.player.draw = function(){
	var c = app.ctx, img = app.imgs.player, cam = app.camera;
	if (this.isMoving){ 
		if ( this.anim == 0 ){ this.anim = 4*8-1 } else { this.anim--; }
	} else { this.anim = 0 }
	var frame = Math.floor(this.anim/8);
	if (this.direction == 'down'){
		c.drawImage(img, (4+frame)*16, 0, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	} else if (this.direction == 'up'){
		c.drawImage(img, frame*16, 0, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	} else if (this.direction == 'left'){
		c.drawImage(img, frame*16, 16, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	} else if (this.direction == 'right'){
		c.drawImage(img, (4+frame)*16, 16, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	}
	
}

app.player.update = function(dt){
	if ( !this.alive ){ return }
	this.move(dt);
	this.mouse();
	//this.action();

	this.draw();
	this.heal( this.health.recover );
}


// Health Bar
app.player.health = {};
app.player.health.w = 20;
app.player.health.h = 100;
app.player.health.x = 10;
app.player.health.y = app.canvas.height - app.player.health.h - 10;
app.player.health.margin = 3;
app.player.health.max = 100;
app.player.health.current = 100;
app.player.health.recover = 0.05;

app.player.hurt = function(amt){
	if ( !this.alive ){ return }
	this.health.current -= amt;
	if (this.health.current <= 0){
		this.health.current = 0;
		say('you died!');
		this.alive = false;
	}
}
app.player.heal = function(amt){
	this.health.current += amt;
	if ( this.health.current > this.health.max ){
		this.health.current = this.health.max;
	}
}

app.player.health.draw = function(){
	var c = app.ctx;
	c.fillStyle = 'black';
	c.fillRect( this.x - this.margin,
					  this.y - this.margin,
					  this.w + 2*this.margin,
					  this.h + 2*this.margin
					);
	c.fillStyle = 'red';
	c.fillRect( this.x,
					  this.y + this.h * (this.max - this.current) / this.max,
					  this.w,
					  this.h * this.current / this.max
					);
}






