// var app = app || {};

// app.enemies = [];

// app.makeEnemy = function(x, y, color, health, speed, damage){
// 	var enemy = sprite('enemy', x, y, 20, 20, color);
// 	enemy.health = health;
// 	enemy.speed = speed;
// 	enemy.damage = damage;
// 	app.enemies.push( enemy );
// }

// app.updateEnemies = function(){
// 	if (app.playTime < 3){ return }
// 	app.enemySpawner();
// 	for (var i = 0; i < app.enemies.length; i++) {
// 		var enemy = app.enemies[i];
// 		app.updateEnemy(enemy);
// 		if ( collides(enemy, app.camera) ){ 
// 			enemy.draw();
// 			if ( app.player.alive && collides(enemy, app.player) ){
// 				app.player.hurt(enemy.damage);
// 			}
// 		}
// 	};
// }

// app.updateEnemy = function(enemy){
// 	var player = app.player;
// 	var dist = distanceTo( enemy, player.x+player.w/2, player.y+player.h/2 );
// 	if ( dist > 30 ){
// 		app.moveToPlayer(enemy);
// 	}
// }

// app.moveToPlayer = function(sprite){
// 	var player = app.player;
// 	if (sprite.x > player.x + 2){
// 		var possible = {x: sprite.x-sprite.speed, y: sprite.y, w: sprite.w, h: sprite.h}
// 		if ( !collidesArray(possible, app.blocks) ){
// 			sprite.x -= sprite.speed;	
// 		}
// 	} else if (sprite.x < player.x - 2){
// 		var possible = {x: sprite.x+sprite.speed, y: sprite.y, w: sprite.w, h: sprite.h}
// 		if ( !collidesArray(possible, app.blocks) ){
// 			sprite.x += sprite.speed;	
// 		}
// 	}
// 	if (sprite.y > player.y + 2){
// 		var possible = {x: sprite.x, y: sprite.y-sprite.speed, w: sprite.w, h: sprite.h}
// 		if ( !collidesArray(possible, app.blocks) ){
// 			sprite.y -= sprite.speed;	
// 		}
// 	} else if (sprite.y < player.y - 2){
// 		var possible = {x: sprite.x, y: sprite.y+sprite.speed, w: sprite.w, h: sprite.h}
// 		if ( !collidesArray(possible, app.blocks) ){
// 			sprite.y += sprite.speed;	
// 		}
// 	}
// }
// app.spawnChance = 0.99;
// app.enemySpawner = function(){
// 	if (Math.random()>app.spawnChance){
// 		var x = Math.random()*app.world.w;
// 		var y = Math.random()*app.world.h;
// 		if ( !isPosInSprite(app.camera, x, y) ){
// 			app.spawnChance = 0.999999;
// 			console.log('spawned enemy')
// 			app.makeEnemy(x, y, 'green', 120, 0.2, 1);
// 		}
// 	} else { app.spawnChance*=0.999999; }
// 	//console.log(app.spawnChance);
// }





