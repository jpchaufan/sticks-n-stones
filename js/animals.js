var app = app || {};


(function(){
var c = app.ctx, cam = app.camera, world = app.world, frame;


app.stealthMod = function(stalker, prey){
	// if prey is moving or is not alert, their perception rating is reduced to 75%
	// if the stalker is not stalking, their stalking rating is reduced to 50%
	return 320 * (prey.isMoving == false || prey.status == 'alert' ? prey.perception : prey.perception * 0.75) / (stalker.isStalking ? stalker.stalking : stalker.stalking/2) * ( app.time == 'day' ? 1 : 0.75 );

}

app.updateAnimals = function(dt){
	app.updateDeer(dt);
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

	deer.health = 1;

	app.deer.push( deer );
}



app.updateDeer = function(dt){
	for (var i = 0; i < app.deer.length; i++) {
		var deer = app.deer[i];

		if (deer.kill){ app.deer.splice(i, 1); i--; }

		if ( deer.status != 'dead' ){
			for (var j = 0; j < app.thrownItems.length; j++) {
				var item = app.thrownItems[j];
				if ( collides(deer, item) ){
					app.thrownItems.splice(j, 1); j--;
					deer.health -= 0.4;
				}
			};
			if (deer.health < 0){
				say('Hya!')
				deer.status = 'dead';
			}

			if (deer.runTimer > 0){
				app.deerRunFrom(deer, app.player, dt);
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

app.deerRunFrom = function(deer, danger, dt){
	var vel = getVelocities(danger, deer.x, deer.y, deer.speed*0.3 + 0.7*deer.speed*deer.health); 
	var vx = vel[0], vy = vel[1];
	deer.direction = vel[2];
	deer.x += vx*dt;
	deer.y += vy*dt;
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
		console.log('drawing dead deer')
		c.drawImage(app.imgs['deer-'+deer.gender], 0, 5*32, 32, 32, deer.x-cam.x, deer.y-cam.y, deer.w, deer.h);		
	}
	
}


//app.newDeer( app.startPoint.x+160, app.startPoint.y + 160 );



app.skinAnimal = function(player, animal){
	animal.name = 'dead '+animal.type;
	animal.contents = [ {data: app.items.rawMeat, amount: 4+rand(4)} ];
	app.openStash(animal, true, true);
}















})();


