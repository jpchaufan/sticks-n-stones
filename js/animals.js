var app = app || {};


(function(){
var c = app.ctx, cam = app.camera, world = app.world, frame;

app.animalController = function(){ // should run once each day
	var animals = app.deer, animal, dist;

	// remove animals really far from player
	for (var i = 0; i < animals.length; i++) {
		animal = animals[i];
		dist = distanceBetween(app.player, animal);
		if (dist > 600){ animal.remove = true; }
	};

	// for each world fragment, spawn animals
	for (var i = 0; i < world.array.length; i++) {
		app.animalSpawner( world.array[i] );
	};

}

app.animalSpawner = function(wf){
	var animal = wf.animalType;
	console.log('animals spawning - '+animal.type)
	if (animal.type == 'deer'){
		for (var i = 0; i < animal.population; i++) {
			if ( Math.random() < animal.chance ){
				var x = wf.x + rand(wf.w);
				var y = wf.y + rand(wf.h);
				var inCamera = isPosInSprite(cam, x, y);
				var inWater = isPosInSprites(wf.water, x, y);
				if ( !inCamera && ! inWater ){
					app.newDeer( x, y, (i == 1 ? 'male' : 'female' ) );
				}
			}
		};
	} else if (animal.type == 'rodent'){
		for (var i = 0; i < animal.population; i++) {
			if ( Math.random() < animal.chance ){
				var x = wf.x + rand(wf.w);
				var y = wf.y + rand(wf.h);
				var inCamera = isPosInSprite(cam, x, y);
				var inWater = isPosInSprites(wf.water, x, y);
				if ( !inCamera && ! inWater ){
					app.newRodent( x, y );
				}
			}
		};
	}
}

app.updateAnimals = function(dt){
	app.updateDeer(dt);
	app.updateRodents(dt);
}


app.stealthMod = function(stalker, prey){
	// if prey is moving or is not alert, their perception rating is reduced to 75%
	// if the stalker is not stalking, their stalking rating is reduced to 50%
	// also an extra 25% penalty for perception at night
	return 320 * (prey.isMoving == false || prey.status == 'alert' ? prey.perception : prey.perception * 0.75) / (stalker.isStalking ? stalker.stalking : stalker.stalking/2) * ( app.time == 'day' ? 1 : 0.75 );

}

app.preyRunFrom = function(prey, danger, dt){
	var vel = getVelocities(danger, prey.x, prey.y, prey.speed*0.3 + 0.7*prey.speed*prey.health); 
	var vx = vel[0], vy = vel[1];
	prey.direction = vel[2];
	prey.x += vx*dt;
	prey.y += vy*dt;
}

app.animalCheckHit = function(animal){
	for (var j = 0; j < app.thrownItems.length; j++) {
		var item = app.thrownItems[j];
		if ( collides(animal, item) ){
			app.thrownItems.splice(j, 1); j--;
			animal.health -= animal.damageOnHit;
		}
	};
	if (animal.health < 0){
		say('Hya!')
		animal.status = 'dead';
	}
}



app.deer = [];

app.newDeer = function(x, y, gender){
	var deer = sprite('deer', x, y, 42, 42);
	deer.gender = gender || (Math.random() > 0.5 ? 'male' : 'female');

	deer.inspect = app.inspectDeer;

	deer.status = 'eating';
	deer.anim = 0;
	deer.staggardCycle = 135+rand(40);
	deer.steadyCycle = 5*5;
	deer.speed = 150;
	deer.perception = 1.5;
	deer.runTimer = 0;
	deer.runsFor = 0.6;

	deer.damageOnHit = 0.4;

	deer.health = 1;

	app.deer.push( deer );
	console.log('new deer. ( '+ app.deer.length +' total )');
}



app.updateDeer = function(dt){
	for (var i = 0; i < app.deer.length; i++) {
		var deer = app.deer[i];

		if (deer.remove){ app.deer.splice(i, 1); i--; }

		if ( deer.status != 'dead' ){
			app.animalCheckHit(deer);

			if (deer.runTimer > 0){
				app.preyRunFrom(deer, app.player, dt);
				deer.runTimer -= dt;
				if (deer.runTimer <= 0){ deer.status = 'alert' }
			}	
		}
			

		if ( collides(deer, cam) ){

			if (deer.status != 'dead'){ // behavior tree

				if ( deer.health < 1  ){ deer.health += dt/200; }

				var dist = distanceBetween(deer, app.player);

				var mod = app.stealthMod(app.player, deer);

				var alertLevel = (mod - dist) / mod;
				
				if (alertLevel < 0.4 && deer.runTimer <= 0 && deer.health > 0.8){
					deer.status = 'eating';
				}
				else if (alertLevel < 0.6 && deer.runTimer <= 0 && deer.health > 0.8){
					deer.status = 'alert';
				} else {
					deer.status = 'running';
					deer.runTimer = deer.runsFor;
				}

			}

			app.drawDeer( deer );

		}

		//console.log(alertLevel)

	};
}


app.inspectDeer = function(player, deer){
	say('This '+(deer.gender == 'male' ? 'buck' : 'doe')+ ' looks like it is '+deer.status );
}


app.drawDeer = function(deer){
	deer.anim++;
	if ( deer.status == 'eating' ){ 
		if ( deer.anim >= deer.staggardCycle ){ deer.anim = 0 }
		if (deer.anim < 5){ frame = 0 }
		else if (deer.anim < 10){ frame = 1 }
		else if (deer.anim < 40){ frame = 2 }
		else if (deer.anim < 50){ frame = 1 }
		else if (deer.anim < 100){ frame = 2 }
		else if (deer.anim < 105){ frame = 3 }
		else if (deer.anim < 110){ frame = 4 }
		c.drawImage(app.imgs['deer-'+deer.gender], 32*frame, 32, 32, 32, deer.x-cam.x, deer.y-cam.y, deer.w, deer.h);
	}
	else if ( deer.status == 'alert'){ 
		if ( deer.anim >= deer.staggardCycle ){ deer.anim = 0 }
		if (deer.anim < 5){ frame = 0 }
		else if (deer.anim < 10){ frame = 1 }
		else if (deer.anim < 40){ frame = 2 }
		else if (deer.anim < 50){ frame = 1 }
		else if (deer.anim < 100){ frame = 2 }
		else if (deer.anim < 105){ frame = 3 }
		else if (deer.anim < 110){ frame = 4 }
		c.drawImage(app.imgs['deer-'+deer.gender], 32*frame, 0, 32, 32, deer.x-cam.x, deer.y-cam.y, deer.w, deer.h);
	}
	else if ( deer.status == 'running' ){ 
		if ( deer.anim >= deer.steadyCycle ){ deer.anim = 0 }
		frame = Math.floor(deer.anim / (deer.steadyCycle/5));

		if (deer.direction == 'right'){
			c.drawImage(app.imgs['deer-'+deer.gender], 32*frame, 2*32, 32, 32, deer.x-cam.x, deer.y-cam.y, deer.w, deer.h);	
		}
		else if (deer.direction == 'left'){
			c.save();
			c.translate(deer.x - cam.x+deer.w, deer.y - cam.y);
			c.scale(-1, 1);
			c.drawImage(app.imgs['deer-'+deer.gender], 32*frame, 2*32, 32, 32, 0, 0, deer.w, deer.h);	
			c.restore();
		}
		else if (deer.direction == 'down'){
			c.drawImage(app.imgs['deer-'+deer.gender], 32*frame, 3*32, 32, 32, deer.x-cam.x, deer.y-cam.y, deer.w, deer.h);	
		}
		else if (deer.direction == 'up'){
			c.drawImage(app.imgs['deer-'+deer.gender], 32*frame, 4*32, 32, 32, deer.x-cam.x, deer.y-cam.y, deer.w, deer.h);	
		}
		
	} else if ( deer.status == 'dead'){
		c.drawImage(app.imgs['deer-'+deer.gender], 0, 5*32, 32, 32, deer.x-cam.x, deer.y-cam.y, deer.w, deer.h);		
	}
	
}


///////////////////////////////////////

/// RAT //

app.rodents = [];
app.newRodent = function(x, y){
	var rodent = sprite('rodent', x, y, 18, 18);

	rodent.status = 'pause';
	rodent.direction = 'down';

	rodent.damageOnHit = 2;
	rodent.health = 1;
	rodent.statusTimer = 0;

	rodent.perception = 1.3;
	rodent.speed = 120;
	rodent.anim = 0;
	rodent.wanderTime = 1;
	rodent.pauseTime = 0.7;

	//rodent.inspect = app.inspectRodent;

	// rodent.status = 'eating';
	// 
	// rodent.staggardCycle = 135+rand(40);
	// rodent.steadyCycle = 5*5;
	// ;
	// rodent.runTimer = 0;
	// rodent.runsFor = 0.6;

	rodent.health = 1;

	app.rodents.push( rodent );
	console.log('new rodent. ( '+ app.rodents.length +' total )');
}

app.updateRodents = function(dt){
	for (var i = 0; i < app.rodents.length; i++) {
		var rodent = app.rodents[i];
		if (rodent.remove){ app.rodents.splice(i, 1); i--;}

		var inView = collides(rodent, cam);

		if (rodent.status != 'dead'){
			app.animalCheckHit(rodent);
			//rodent.statusTimer = (rodent.statusTimer -= dt < 0 ?  0 : rodent.statusTimer );
			rodent.statusTimer -= dt;
			//console.log(rodent.statusTimer)

			var rodentIsActive = rodent.statusTimer > 0 || inView;

			if (rodentIsActive){
				//console.log('active rodent: dt', dt)
				// console.log(rodent.statusTimer, dt)
				if ( rodent.statusTimer > 0 ){ 
					//console.log('timer > 0, do behavior - ', rodent.statusTimer);
					if (rodent.status == 'running'){
						app.preyRunFrom(rodent, app.player, dt);
					} else if ( rodent.status == 'wander' ){
						//console.log('rodent should be wandering here')
						if (rodent.direction == 'right'){ rodent.x += rodent.speed/6*dt; }
						if (rodent.direction == 'left'){ rodent.x -= rodent.speed/6*dt; }
						if (rodent.direction == 'down'){ rodent.y += rodent.speed/6*dt; }
						if (rodent.direction == 'up'){ rodent.y -= rodent.speed/6*dt; }
					}
				}
				else { // timer is 0. reassess behavior
					//console.log('timer <= 0, reassess')
					
					rodent.anim = 0;

					var dist = distanceBetween(rodent, app.player);

					var mod = app.stealthMod(app.player, rodent);

					var alertLevel = (mod - dist) / mod;

					if (alertLevel < 0.6){
						// wander and pause pattern
						if (rodent.status == 'pause'){
							rodent.status = 'wander';
							var possible = ['up', 'down', 'left', 'right'];
							rodent.direction = possible[ rand(3) ];
							rodent.statusTimer = rodent.wanderTime;
						} else {
							rodent.status = 'pause';
							rodent.statusTimer = rodent.pauseTime;
						}
						
					}
					else {
						//console.log('start running')
						// start running
						rodent.status = 'running';
						rodent.statusTimer = 1;
					}
					//console.log('behavior reassessed: ', rodent.status, rodent.statusTimer)
				}

			}
		}

		if (inView){

			app.drawRodent(rodent);
		}
	};
}


app.drawRodent = function(rodent){
	if (rodent.status == 'dead'){
		c.drawImage(app.imgs.rodent, 0, 0, 32, 32, rodent.x - cam.x, rodent.y - cam.y, rodent.w, rodent.h);
		return;
	}
	rodent.anim++;
	var animSpeed = rodent.status == 'running' ? 4 : 8;
	if (rodent.anim >= animSpeed*4){ rodent.anim = 0 }

	var yMod = ['down', 'right', 'up', 'left'].indexOf(rodent.direction);
	var frame = Math.floor(rodent.anim / animSpeed);
	
	c.drawImage(app.imgs.rodent, 32*frame, 32*yMod, 32, 32, rodent.x - cam.x, rodent.y - cam.y, rodent.w, rodent.h);
}





app.skinAnimal = function(player, animal){
	animal.name = 'dead '+animal.type;
	if (animal.type == 'deer'){
		animal.contents = [ {data: app.items.rawMeat, amount: 6+rand(5)} ];	
	} else if (animal.type == 'rodent'){
		animal.contents = [ {data: app.items.rawMeat, amount: 1} ];
	}
	
	app.openStash(animal, true, true);
}















})();


