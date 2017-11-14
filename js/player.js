var app = app || {};

(function(){

app.player = sprite('player', app.startPoint.x, app.startPoint.y, 24, 24);
var player = app.player, cam = app.camera, world = app.world, ctrl = app.controller;


cam.setTo(player);

player.speed = 120;
player.direction = 'down';
player.isMoving = false;
player.walkingAnimationStep = 0;
player.throwTime = 0.5;
player.throwPower = 350;
player.throwingAnimationStep = 0;
player.isStalking = false;

player.stalking = 1.5;
player.perception = 1.5;

player.move = function(dt){
	this.isMoving = false;
	if ( !this.alive || this.noMove || this.isThrowing ){ return }
	var currentSpeed;
	if (this.isStalking){ 
		currentSpeed = this.speed * dt * 0.4;
	}
	else {
		currentSpeed = this.speed*dt*0.3 + 0.7*this.speed*this.vitality*dt;
	}
	if (ctrl.left){ 
		app.taskbar.close();
		this.direction = 'left';
		var actualSpeed = Math.floor( ctrl.up || ctrl.down ? currentSpeed : currentSpeed * 1.2);
		var possible = { x: this.x-actualSpeed, y: this.y, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.x -= actualSpeed; cam.x -= actualSpeed; this.isMoving = true;
		}
	}
	if (ctrl.right){ 
		app.taskbar.close();
		this.direction = 'right';
		var actualSpeed = Math.floor( ctrl.up || ctrl.down ? currentSpeed : currentSpeed * 1.2);
		var possible = { x: this.x+actualSpeed, y: this.y, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.x += actualSpeed; cam.x += actualSpeed; this.isMoving = true;
		}
	}
	if (ctrl.up){ 
		app.taskbar.close();
		this.direction = 'up';
		var actualSpeed = Math.floor( ctrl.left || ctrl.right ? currentSpeed : currentSpeed * 1.2);
		var possible = { x: this.x, y: this.y-actualSpeed, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.y -= actualSpeed; cam.y -= actualSpeed; this.isMoving = true;
		}
	}
	if (ctrl.down){ 
		app.taskbar.close();
		this.direction = 'down';
		var actualSpeed = Math.floor( ctrl.left || ctrl.right ? currentSpeed : currentSpeed * 1.2);
		var possible = { x: this.x, y: this.y+actualSpeed, w: this.w, h: this.h }
		if ( !collidesArray( possible, world.collideables ) ){
			this.y += actualSpeed; cam.y += actualSpeed; this.isMoving = true;
		}
	}
}

player.throw = function(itemData){
	this.isStalking = false;
	this.walkingAnimationStep = 0;

	this.isThrowing = true;
	this.throwingAnimationStep = this.throwTime;
	app.manageItems(itemData, -1);
	this.direction = app.throw(this, ctrl.x, ctrl.y, itemData);
}

player.shift = function(){

	if (ctrl.shift){
		ctrl.shift = false;
		this.isStalking = !this.isStalking;
		this.walkingAnimationStep = 0;
	}
}



///////////

player.mouse = function(){
	if (this.noMove){ return }
	if (ctrl.status == 'rightclick'){
		app.taskbar.close();
		if (this.selecting){
			var itemData = this.selecting.data;
			if (itemData.throwable){
				if (!this.isThrowing){
					this.throw(itemData);
				}
			}
			else if (itemData.edible){
				app.task(function(){ app.player.eat(itemData); }, 1);
				//say('selecting '+sel);
			}
		} else if (ctrl.clickedOn) {
			this.doInspect(ctrl.clickedOn);
		}


		ctrl.status = '';
	} else if ( ctrl.mousedown && ctrl.status == 'click' ){ // test a bit before removing the click conditionals made redundant by this one here
		app.taskbar.close();
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
			if (clickedOn.type == 'campfire'){
				if ( this.selecting && this.selecting.data.name == 'Stick' ) {
					if (clickedOn.intensity < 4){
						say("Adding wood.");
						clickedOn.intensity += 1;
						app.manageItems(app.items.stick, -1);
					}
					else {
						say("Enough wood...");
					}	
				}
				else if ( this.selecting && this.selecting.data.cooked ){
					app.task(function(){
						if (clickedOn.intensity < 2){
							say('The fire is not hot enough to cook');
						} else if (clickedOn.intensity < 4){
							var product = app.items[app.player.selecting.data.cooked];
							app.manageItems(app.player.selecting.data, -1);
							app.manageItems(product, 1);
							say(product.name+'!');
						} else {
							app.manageItems(app.player.selecting.data, -1);
							say('The fire was way too hot... it burned...')
						}
					}, 1);
					
				}
				else if (this.selecting ){
					say('I\'m not putting this in the fire.');
				} else {
					say('Mmm... warm fire.');
				}
			} 
			else if (clickedOn.type == 'herb'){
				if (ctrl.status == 'click'){
					if (dist < 100){
						app.task(function(){ app.clickHerb(clickedOn); }, 1);
					} 
					else { say('too far!'); }	
				}
			}
			else if (clickedOn.type == 'deer' || clickedOn.status == 'dead'){
				if (ctrl.status == 'click'){
					if (dist < 100){
						app.task( function(){ app.skinAnimal(app.player, clickedOn); }, 1 );
					} 
					else { say('too far!'); }	
				}
			}
			else if (clickedOn.type == 'stonePile'){
				if (ctrl.status == 'click'){
					if (dist < 100){
						app.task( function(){ app.clickStonePile(clickedOn); }, 1 );
					} 
					else { say('too far!'); }	
				}
			}
			else if (clickedOn.type == 'tree'){
				if (ctrl.status == 'click'){
					if (dist < 100){
						app.task(function(){ app.clickTree(clickedOn); }, 1);
					} 
					else { say('too far!'); }	
				}
			}
			else if (clickedOn.type == 'herb'){
				if (ctrl.status == 'click'){
					if (dist < 100){
						app.task(function(){ app.clickHerb(clickedOn); }, 1);
					} 
					else { say('too far!'); }	
				}
			}
			else if ( clickedOn.type == 'block'){
				if ( dist < 80 ){
					if (this.selecting){
						if ( this.selecting.data.name == 'Stone' ){
							if ( ctrl.status == 'click' ){
								if (clickedOn.durability < 5){
									say("Adding stone.");
									clickedOn.durability += 1;
									app.manageItems(app.items.stone, -1);
								} else {
									say("Enough stone...");
								}
							}
							//else if ( ctrl.status == 'dragging' ){ app.destroyWall(ctrl.draggedOn); }	
						}
						else if ( this.selecting.data.name == 'Stick' ){
							app.task(function(){ app.destroyWall(clickedOn); }, 1);
						}
					}
				}
				else { say('too far!'); }
			}
			else if ( clickedOn.type == 'water' && ctrl.status == 'click' ){
				app.task(function(){
					say("Ug drink.");
					app.player.thirst = 1;
				}, 1);
			}
			else if (clickedOn.type == 'player'){
				if ( ctrl.status == 'click' ){
					if (this.selecting){
						var itemData = this.selecting.data;
						if (itemData.edible){ 
							app.task(function(){ app.player.eat(itemData); }, 1);
						}
					}
					else { say('Ug!'); }
					 
				}
			} 
		} else if ( (dist > 20 && dist < 85) ){
			if ( this.selecting ){
				if ( this.selecting.data.name == 'Stone' ){
					app.task(function(){ app.makeWall( x, y ); }, 1);
				} else if ( this.selecting.data.name == 'Stick' && ctrl.status == 'click' ){
					app.task(function(){ app.makeFire( x, y ); }, 1);
				}
			}
		}
		ctrl.status = 'holding';
	}
}

player.eat = function(data){
	this.hunger += data.edible/100;
	if ( this.hunger >= 1 ){ this.hunger = 1; }
	app.manageItems(data, -1);
	if (data.eatMessage){ say(data.eatMessage) }
	else { say( 'Mmm, tasty '+data.name.toLowerCase()+ '!' ) }
}

player.doInspect = function(sprite){

	if (sprite.inspect){ sprite.inspect(this, sprite) }
	else { 
		if (sprite.type == 'water'){
			say("Fresh water.")
		} else {
			say('this thing doesn\'t have an inspect - '+sprite.type);
			console.log(sprite);
		}

		
	}
}
player.inspect = function(){
	say("It's me.")
}

player.draw = function(dt){
	var c = app.ctx, img = app.imgs.player;
	if (this.isStalking){ c.globalAlpha = 0.6 }
	if (this.isThrowing){ // throwing
		var frame = this.throwingAnimationStep <= this.throwTime*0.7 ? 1 : 0;
		var position = ['left', 'right', 'up', 'down'].indexOf(this.direction);
		c.drawImage(img, (frame+2*position)*16, 32, 16, 16, this.x-2 - cam.x, this.y - cam.y, this.w, this.h);	
		this.throwingAnimationStep -= dt;
		if ( this.throwingAnimationStep <= 0 ){
			this.isThrowing = false;
		}
		c.globalAlpha = 1; return;
	}
	if (this.isMoving){ // walking
		var animSpeed = this.isStalking ? 18 : 8;
		if ( this.walkingAnimationStep <= 0 ){ this.walkingAnimationStep = 4*animSpeed-1 } else { this.walkingAnimationStep--; }
		var frame = Math.floor(this.walkingAnimationStep/animSpeed);
		if (this.direction == 'down'){
			c.drawImage(img, (4+frame)*16, 0, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
		} else if (this.direction == 'up'){
			c.drawImage(img, frame*16, 0, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
		} else if (this.direction == 'left'){
			c.drawImage(img, frame*16, 16, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
		} else if (this.direction == 'right'){
			c.drawImage(img, (4+frame)*16, 16, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
		}
		//console.log( 'walking', this.walkingAnimationStep, frame );
		c.globalAlpha = 1; return;
	} else { this.walkingAnimationStep = 0 }
	// idle
	if (this.direction == 'down'){
		c.drawImage(img, 4*16, 0, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	} else if (this.direction == 'up'){
		c.drawImage(img, 0, 0, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	} else if (this.direction == 'left'){
		c.drawImage(img, 0, 16, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	} else if (this.direction == 'right'){
		c.drawImage(img, 4*16, 16, 16, 16, this.x - cam.x, this.y - cam.y, this.w, this.h);	
	}
	c.globalAlpha = 1;
}

// Condition

player.health = 1;
player.baseRecover = 0.0001;
player.temp = 1;
player.hunger = 1;
player.thirst = 1;
player.vitality = 1;
player.getVit = function(){
	this.vitality = 0.25 + 0.75 * this.health * ( this.temp <= 1 ? this.temp : 2 - this.temp) * this.thirst * this.hunger;
}

player.monitorTemp = function(dt){
	var bottomThreshhold = 10;
	var topThreshhold = 30;
	var effectiveTemp = this.effectiveTemperature();
	var expectedTemp; // this is the temp that the player temp wants to move to.
	if ( effectiveTemp < bottomThreshhold ){ 
		var difference = bottomThreshhold - effectiveTemp;
		var expectedTemp = 1 - difference*0.1;
	} else if ( effectiveTemp > topThreshhold ){ 
		var difference = effectiveTemp - topThreshhold;
		var expectedTemp = 1 + difference*0.1;
	} else {
		expectedTemp = 1;
	}
	if ( this.temp > 0.01+expectedTemp ){
		this.temp -= dt/3;
	} else if ( this.temp < expectedTemp-0.01 ){
		this.temp += dt/3;
	} else {
		this.temp = expectedTemp;
	}
}

player.effectiveTemperature = function(){
	// creates a 'box' around the player, which checks for collisions with heat sources like campfires
	var box = {x: this.x-100, y: this.y-100, w: 200+this.w, h: 200+this.h};
	// get campfires
	var clickables = app.world.clickables;
	var campfires = [];
	for (var i = 0; i < clickables.length; i++) {
		clickable = clickables[i]
		if (clickable.type == 'campfire'){
			if ( collides(clickable, box) ){
				campfires.push( clickable );
			}
		}
	};
	var hottestFire = 0;
	for (var i = 0; i < campfires.length; i++) {
		var fire = campfires[i];
		if (fire.intensity > hottestFire){
			hottestFire = fire.intensity;
		}
	};
	var effectiveTemp = app.temp.current + hottestFire*2;
	// if (hottestFire){
	// 	console.log('extra warmth from fire', app.temp.current, effectiveTemp)	
	// }
	return effectiveTemp;
}
player.monitorCondition = function(dt){
	var temp = app.temp.current, x = dt / 1000;
	if (this.isMoving){
		this.hunger -= x;
		this.thirst -= 3*x;
	} else {
		this.hunger -= x/2;
		this.thirst -= x;
	}
	if (temp > 30){
		var diff = temp - 30;
		this.thirst -= x * diff;
	}
	player.monitorTemp(dt);
	this.getVit();
	this.healthMeter.style.width = this.health * 100 + 'px';
	this.hungerMeter.style.width = this.hunger * 100 + 'px';
	this.thirstMeter.style.width = this.thirst * 100 + 'px';
	this.tempMeter.style.width = ( this.temp <= 1 ? this.temp : 2 - this.temp ) * 100 + 'px';
	//console.log( Math.round(this.vitality * 1000)/1000 )
}


player.setupBars = function(){
	// HEALTH
	player.healthBar = createUI(7, undefined, 106, 18, '#000000');
	var healthBar = player.healthBar;
	healthBar.style.bottom = '70px';
	app.window.appendChild(player.healthBar);
	player.healthMeter = createUI(10, undefined, 100, 12, '#ff0000');
	var healthMeter = player.healthMeter;
	healthMeter.style.bottom = '73px';
	app.window.appendChild(player.healthMeter);

	// HUNGER
	player.hungerBar = createUI(7, undefined, 106, 18, '#000000');
	var hungerBar = player.hungerBar;
	hungerBar.style.bottom = '50px';
	app.window.appendChild(player.hungerBar);
	player.hungerMeter = createUI(10, undefined, 100, 12, '#99bb55');
	var hungerMeter = player.hungerMeter;
	hungerMeter.style.bottom = '53px';
	app.window.appendChild(player.hungerMeter);

	// Thirst
	player.thirstBar = createUI(7, undefined, 106, 18, '#000000');
	var thirstBar = player.thirstBar;
	thirstBar.style.bottom = '30px';
	app.window.appendChild(player.thirstBar);
	player.thirstMeter = createUI(10, undefined, 100, 12, '#8888bb');
	var thirstMeter = player.thirstMeter;
	thirstMeter.style.bottom = '33px';
	app.window.appendChild(player.thirstMeter);

	// Temp
	player.tempBar = createUI(7, undefined, 106, 18, '#000000');
	var tempBar = player.tempBar;
	tempBar.style.bottom = '10px';
	app.window.appendChild(player.tempBar);
	player.tempMeter = createUI(10, undefined, 100, 12, '#aa4444');
	var tempMeter = player.tempMeter;
	tempMeter.style.bottom = '13px';
	app.window.appendChild(player.tempMeter);
}

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

// Select items

player.selectHotkeysUpdate = function(){
	var nums = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero'];
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if (ctrl[ nums[i] ] && item ){
			if (item.selected){
				app.deselectAll();
			} else {
				app.deselectAll();
				app.selectItem( item );	
			}
			ctrl[ nums[i] ] = false;
		}
	};
}






player.update = function(dt){
	if ( !this.alive ){ return }
	this.checkDeath();
	this.monitorCondition(dt);
	this.shift();
	this.move(dt);
	this.mouse();
	this.selectHotkeysUpdate();
	this.draw(dt);
	this.recover(this.baseRecover);

	if (ctrl.q && app.stash.isOpen){ app.closeStash(); ctrl.q = false; }
}



})();

