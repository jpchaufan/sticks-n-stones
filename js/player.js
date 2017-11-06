var app = app || {};

(function(){

app.player = sprite('player', app.startPoint.x, app.startPoint.y, 24, 24);
var player = app.player, cam = app.camera, world = app.world;


cam.setTo(player);

player.speed = 300;
player.direction = 'down';
player.isMoving = false;
player.anim = 0;

player.move = function(dt){
	if ( !this.alive || this.noMove){ return }
	this.isMoving = false;
	var currentSpeed = this.speed*dt*0.2 + 0.8*this.speed*this.vitality*dt
	if (app.controller.left){ 
		var possible = { x: this.x-currentSpeed, y: this.y, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.x -= currentSpeed; cam.x -= currentSpeed; this.direction = 'left'; this.isMoving = true;
		}
	}
	if (app.controller.right){ 
		var possible = { x: this.x+currentSpeed, y: this.y, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.x += currentSpeed; cam.x += currentSpeed; this.direction = 'right'; this.isMoving = true;
		}
	}
	if (app.controller.up){ 
		var possible = { x: this.x, y: this.y-currentSpeed, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.y -= currentSpeed; cam.y -= currentSpeed; this.direction = 'up'; this.isMoving = true;
		}
	}
	if (app.controller.down){ 
		var possible = { x: this.x, y: this.y+currentSpeed, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.y += currentSpeed; cam.y += currentSpeed; this.direction = 'down'; this.isMoving = true;
		}
	}
}

player.mouse = function(){
	if (this.noMove){ return }
	var ctrl = app.controller;
	if ( ctrl.mousedown ){
		var x = ctrl.x;
		var y = ctrl.y;
		// for testing
		// if (ctrl.status == 'click'){
		// 	var wf = isPosInSprites( app.world.array, x, y );
		// if (!wf){ return }
		// 	var tile = wf.getTileAt(x, y);
		// 	console.log( tile );
		// }
		//
		var dist = distanceTo(this, x, y);
		var clickedOn = ctrl.clickedOn;
		if ( clickedOn ){ // console.log(clickedOn.type)
			if (clickedOn.type == 'campfire' && ctrl.status == 'click'){
				if ( this.selecting && this.selecting.data.name == 'Stick' ) {
					if (clickedOn.intensity < 4){
						say("Add wood.");
						clickedOn.intensity += 1;
						app.manageItems(app.items.stick, -1);
					}
					else {
						say("Enough wood...");
					}	
				}
				else {
					say('Mmm... Fire warm.');
				}
			} 
			else if (clickedOn.type == 'player'){
				if ( ctrl.status == 'click' ){
					if (this.selecting){
						var data = this.selecting.data;
						if (data.edible){ 
							this.eat(data);
						}
					}
					else { say('Ug!'); }
					 
				}
			} 
			else if (clickedOn.type == 'stonePile'){
				if (ctrl.status == 'click'){
					if (dist < 100){ app.clickStonePile(clickedOn); } 
					else { say('too far!'); }	
				}
			}
			else if (clickedOn.type == 'tree'){
				if (ctrl.status == 'click'){
					if (dist < 100){ app.clickTree(clickedOn); } 
					else { say('too far!'); }	
				}
			}
			else if (clickedOn.type == 'herb'){
				if (ctrl.status == 'click'){
					if (dist < 100){ app.clickHerb(clickedOn); } 
					else { say('too far!'); }	
				}
			}
			else if ( clickedOn.type == 'block'){
				if ( dist < 80 ){
					if (this.selecting){
						if ( this.selecting.data.name == 'Stone' ){
							if ( ctrl.status == 'click' ){
								if (clickedOn.durability < 5){
									say("Add stone.");
									clickedOn.durability += 1;
									app.manageItems(app.items.stone, -1);
								} else {
									say("Enough stone...");
								}
							}
							else if ( ctrl.status == 'dragging' ){ app.destroyWall(ctrl.draggedOn); }	
						}
						else if ( this.selecting.data.name == 'Stick' ){
							app.destroyWall(clickedOn);
						}
					}
				}
				else { say('too far!'); }
			}
			else if ( clickedOn.type == 'water' && ctrl.status == 'click' ){
				say("Ug drink.");
				this.thirst = 1;
			}
		} else if ( (dist > 20 && dist < 85) ){
			if ( this.selecting ){
				if ( this.selecting.data.name == 'Stone' ){
					app.makeWall( x, y );	
				} else if ( this.selecting.data.name == 'Stick' && ctrl.status == 'click' ){
					app.makeFire( x, y );	
				}
			}
		}
	}
	ctrl.status = 'holding';
}

player.eat = function(data){
	this.hunger += data.edible/100;
	if ( this.hunger >= 1 ){ this.hunger = 1; }
	app.manageItems(data, -1);
	if (data.eatMessage){ say(data.eatMessage) }
	else { say( 'Mmm, tasty '+data.name.toLowerCase()+ '!' ) }
}

player.action = function(){
	//  if ( app.controller.action ){
	// 	var x = app.controller.x, y = app.controller.y;
	// 	//var angle = angleTo(this, x, y);
	// 	var spriteHere = spriteAtPos(x, y);
	// 	if (spriteHere){
	// 		if ( spriteHere.type == 'block' && distanceTo(this, x, y) < 80 ){
	// 			app.destroyWall(spriteHere);
	// 		}
	// 	}
	// }
}

player.draw = function(){
	var c = app.ctx, img = app.imgs.player;
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

// Condition

player.health = 1;
player.baseRecover = 0.0001;
player.temp = 1;
player.hunger = 1;
player.thirst = 1;
player.vitality = 1;
player.getVit = function(){
	this.vitality = this.health * ( this.temp <= 1 ? this.temp : 2 - this.temp) * this.thirst * this.hunger;
}
player.monitorCondition = function(dt){
	var temp = app.temp.current, x = dt / 1000;
	if (this.isMoving){
		this.hunger -= x;
		this.thirst -= 3*x;
		this.temp += x;
	} else {
		this.hunger -= x/2;
		this.thirst -= x;
	}
	if (temp > 25){
		this.temp += ( temp - 25 ) * x/2;
	} else if (temp < 15) {
		this.temp -= Math.abs( temp - 15 ) * x/2;
	}
	if (this.temp > 2){ this.temp = 2 }
	this.getVit();
	this.healthMeter.style.width = this.health * 100 + 'px';
	this.hungerMeter.style.width = this.hunger * 100 + 'px';
	this.thirstMeter.style.width = this.thirst * 100 + 'px';
	this.tempMeter.style.width = ( this.temp <= 1 ? this.temp : 2 - this.temp ) * 100 + 'px';
	//console.log( Math.round(this.vitality * 1000)/1000 )
}

// HEALTH
player.healthBar = createUI(7, undefined, 106, 18, '#000000');
var healthBar = player.healthBar;
healthBar.style.bottom = '70px';
document.body.appendChild(player.healthBar);
player.healthMeter = createUI(10, undefined, 100, 12, '#ff0000');
var healthMeter = player.healthMeter;
healthMeter.style.bottom = '73px';
document.body.appendChild(player.healthMeter);

// HUNGER
player.hungerBar = createUI(7, undefined, 106, 18, '#000000');
var hungerBar = player.hungerBar;
hungerBar.style.bottom = '50px';
document.body.appendChild(player.hungerBar);
player.hungerMeter = createUI(10, undefined, 100, 12, '#99bb55');
var hungerMeter = player.hungerMeter;
hungerMeter.style.bottom = '53px';
document.body.appendChild(player.hungerMeter);

// Thirst
player.thirstBar = createUI(7, undefined, 106, 18, '#000000');
var thirstBar = player.thirstBar;
thirstBar.style.bottom = '30px';
document.body.appendChild(player.thirstBar);
player.thirstMeter = createUI(10, undefined, 100, 12, '#8888bb');
var thirstMeter = player.thirstMeter;
thirstMeter.style.bottom = '33px';
document.body.appendChild(player.thirstMeter);

// Temp
player.tempBar = createUI(7, undefined, 106, 18, '#000000');
var tempBar = player.tempBar;
tempBar.style.bottom = '10px';
document.body.appendChild(player.tempBar);
player.tempMeter = createUI(10, undefined, 100, 12, '#aa4444');
var tempMeter = player.tempMeter;
tempMeter.style.bottom = '13px';
document.body.appendChild(player.tempMeter);

player.hurt = function(amt){
	if ( !this.alive ){ return }
	this.health -= amt;
}

player.checkDeath = function(){
	if (this.health <= 0){
		say('you died of injury!');
		this.alive = false;
	} else if (this.temp <= 0){
		say('you froze!');
		this.alive = false;
	} else if (this.temp >= 2){
		say('you over-heated');
		this.alive = false;
	} else if (this.thirst <= 0){
		say('you died of thirst!');
		this.alive = false;
	} else if (this.hunger <= 0){
		say('you starved!');
		this.alive = false;
	}
}

player.recover = function(amt){
	this.health += amt;
	if ( this.health > 1 ){
		this.health = 1;
	}
}

player.update = function(dt){
	if ( !this.alive ){ return }
	this.checkDeath();
	this.monitorCondition(dt);
	this.move(dt);
	this.mouse();
	//this.action();
	this.draw();
	this.recover(this.baseRecover);
}


// // Health Bar
// player.health = {};
// player.health.w = 20;
// player.health.h = 100;
// player.health.x = 10;
// player.health.y = app.canvas.height - player.health.h - 10;
// player.health.margin = 3;
// player.health.max = 100;
// player.health.current = 100;
// player.health.recover = 0.05;

// player.hurt = function(amt){
// 	if ( !this.alive ){ return }
// 	this.health.current -= amt;
// 	if (this.health.current <= 0){
// 		this.health.current = 0;
// 		say('you died!');
// 		this.alive = false;
// 	}
// }
// player.heal = function(amt){
// 	this.health.current += amt;
// 	if ( this.health.current > this.health.max ){
// 		this.health.current = this.health.max;
// 	}
// }

// player.health.draw = function(){
// 	var c = app.ctx;
// 	c.fillStyle = 'black';
// 	c.fillRect( this.x - this.margin,
// 					  this.y - this.margin,
// 					  this.w + 2*this.margin,
// 					  this.h + 2*this.margin
// 					);
// 	c.fillStyle = 'red';
// 	c.fillRect( this.x,
// 					  this.y + this.h * (this.max - this.current) / this.max,
// 					  this.w,
// 					  this.h * this.current / this.max
// 					);
// }


})();






