

// Initialize //

var app = app || {};

app.canvas = document.getElementById('canvas');
app.canvas.width = Math.min(500, window.innerWidth);
app.canvas.height = Math.min(300, window.innerHeight);
var canvasW = app.canvas.width;
var canvasH = app.canvas.height;

app.ctx = canvas.getContext('2d'); 

// Sprites //

function Sprite(type, x, y, w, h, color){
	this.type = type;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;

	this.alive = true;
}

function sprite(type, x, y, w, h, color){
	return new Sprite(type, x, y, w, h, color);
}

Sprite.prototype.draw = function(){
	app.ctx.fillStyle = this.color;
	app.ctx.fillRect(this.x - app.camera.x, this.y - app.camera.y, this.w, this.h);
}

// DOM UI //

function createUI(x, y, w, h, bgColor){
	var elem = document.createElement('div');
	elem.style.backgroundColor = bgColor;
	elem.style.position = 'absolute';
	elem.style.left = x + 'px';
	elem.style.top = y + 'px';
	elem.style.width = w + 'px';
	elem.style.height = h + 'px';
	return elem;
}

function enableDnD(elem){
	elem.draggable = true;
	elem.addEventListener('dragend', function(e){
		elem.style.left = (+elem.style.left.replace('px', ''))+e.offsetX+'px';
		elem.style.top = (+elem.style.top.replace('px', ''))-200+e.offsetY+'px';
	});
}

// Text //

function createText(message, duration, x, y, style){
	var oldTexts = document.getElementsByClassName('game-text');
	if (oldTexts.length){
		for (var i = 0; i < oldTexts.length; i++) {
			oldTexts[i].style.bottom = +oldTexts[i].style.bottom.replace('px', '') + 30 + 'px';
		};
	}

	var text = document.createElement('div');
	text.className = 'game-text'
	text.innerText = message;
	text.style.position = 'absolute';
	text.style.left = x+'px';
	text.style.bottom = y+'px';
	if (style){
		for (var prop in style){
			text.style[prop] = style[prop];
		}	
	}

	document.body.appendChild(text);
	if (!duration){ return text }
	setTimeout( function(){
		text.style.opacity = 1;
		function fade() {
		    if ((text.style.opacity -= .05) < 0) {
		      document.body.removeChild(text); 
		    } else {
		      requestAnimationFrame(fade);
		    }
	    }; fade();
	}, duration );
}
function say(message){
	createText(message, 2700,
			window.innerWidth*0.5 - 6*message.length,
			window.innerHeight/1.6,
			{ color: "#3e3e3e", fontSize: "30px" });
}
createText('Sticks and Stones', 2700,
			window.innerWidth*0.3,
			window.innerHeight/1.5,
			{
				color: "#3e3e3e",
				fontSize: "40px",
				fontVariant: "small-caps",
				backgroundColor: 'rgba(255, 255, 255, 0.5)',
				boxShadow: '0 0 5px 5px rgba(255, 255, 255, 0.5',
				borderRadius: '10px'
			});

// Utility Functions //

function collides(a, b){
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function collidesArray(sprite, array){
	// checks collisions between a sprite and an array of sprites
	for (var i = 0; i < array.length; i++) {
		if ( collides( sprite, array[i] ) ){
			return true;
		}
	};
}

function isPosInSprite(sprite, x, y){
	return sprite.x <= x && x <= sprite.x+sprite.w && 
					   sprite.y <= y && y <= sprite.y+sprite.h;
}

function isPosInSprites(array, x, y){
	for (var i = 0; i < array.length; i++) {
		if ( isPosInSprite(array[i], x, y) ){ return array[i]; }
	};
}

function distanceTo(sprite, x, y){
	// get distance between a sprite and a point
	var centerX = sprite.x + sprite.w/2;
	var centerY = sprite.y + sprite.h/2;

	var sideX = Math.abs( centerX - x ); // dist^2 = x^2 + y^2
	var sideY = Math.abs( centerY - y );
	return Math.sqrt( sideX*sideX + sideY*sideY );
}

function angleTo(sprite, x, y){
	// get angle between a sprite and a point
	var centerX = sprite.x + sprite.w/2;
	var centerY = sprite.y + sprite.h/2;

	var sideX = centerX - x;
	var sideY = centerY - y;

	return Math.atan2(sideY, sideX);
}

function rand(n){
	return Math.round( Math.random()*n );
}

// Unused //

// function allSprites(){
// 	return [app.player, app.campfire]
// 			.concat(app.items)
// 			//.concat(app.enemies)
// 			.concat(app.blocks)
// 			.concat(app.stonePiles);
// }

// function blockingSprites(){
// 	return app.stonePiles.concat(app.blocks).concat(app.trees);
// }

// function spriteAtPos(x, y){
// 	var sprites = allSprites();
// 	for (var i = 0; i < sprites.length; i++) {
// 		var sprite = sprites[i];
// 		if ( isPosInSprite(sprite, x, y) ){
// 			return sprite;
// 		}
// 	};
// }