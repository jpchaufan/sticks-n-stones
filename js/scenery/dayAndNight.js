var app = app || {};

(function(){



// app.shade = function(){

// 	var w = 4, h = 4, c = app.ctx, cw = app.canvas.width, ch = app.canvas.height, player = app.player, cam = app.camera, light = app.campfire, min = Math.min;
// 	var numW = cw / w;
// 	var numH = ch / h;
// 	c.fillStyle = '#000';
// 	var mod = (Math.sin(app.playTime/2)+1);
// 	for (var nw = 0; nw < numW; nw++) {
// 		for (var nh = 0; nh < numH; nh++) {
// 			var x = w*nw+cam.x, y = h*nh+cam.y;
// 			var dayTimeMod = ( distanceTo(cam, x, y)*mod*mod*mod/2 / cw ); 
// 			var lightSourceMod = min(1, distanceTo(light, x, y) / cw*3);
// 			c.globalAlpha = min(dayTimeMod, lightSourceMod);
// 			c.fillRect(w*nw, h*nh, w, h);
// 		};	
// 	};
// 	c.globalAlpha = 1;
// }

app.day = 1;
app.hour = 7;

app.hoursPerSecond = 1 / 10;

app.updateTime = function(dt){
	app.hour += app.hoursPerSecond*dt;
	if ( app.hour > 24 ){ app.nextDay() }
}

app.season = {};
var season = app.season;
season.array = ['winter', 'spring', 'summer', 'fall'];
season.current;
season.i = 0;
season.veryHot;
season.hot;
season.cold;
season.veryCold;
season.dawn;
season.dusk;
season.update = function(){
	if ( app.day % 21 == 0 || app.day == 1 ){
		this.i = (this.i+1)%4;
		this.current = this.array[this.i];
	}
	if ( this.current == 'spring' ){
		this.veryHot = 23;
		this.hot = 19;
		this.cold = 12;
		this.veryCold = 5;
		this.dusk = 21;
		this.dawn = 6;
	} else if ( this.current == 'winter' ){
		this.veryHot = 5;
		this.hot = 0;
		this.cold = -14;
		this.veryCold = -24;
		this.dusk = 20;
		this.dawn = 7;
	} else if ( this.current == 'fall' ){
		this.veryHot = 18;
		this.hot = 13;
		this.cold = 8;
		this.veryCold = 2;
		this.dusk = 21;
		this.dawn = 6;
	} else if ( this.current == 'summer' ){
		this.veryHot = 37;
		this.hot = 33;
		this.cold = 26;
		this.veryCold = 18;
		this.dusk = 22;
		this.dawn = 5;
	}
}
season.update();

app.temp = {};
var temp = app.temp;
temp.hi = 20;
temp.low = 15;
temp.current;
temp.calculate = function(hi, drop, time){
	var factor = Math.abs( time/12-1 );
	return hi - drop*factor;
}
temp.update = function(){
	this.current = this.calculate(this.hi, this.hi - this.low, app.hour);
	//console.log('temp:', this.current);
}
temp.update();

app.darkness = createUI(0, 0, app.canvas.width, app.canvas.height);
app.darkness.style.pointerEvents = 'none';
app.darkness.style.backgroundColor = 'transparent';
app.darkness.style.width = '100vw';
app.darkness.style.height = '100vh';
app.window.appendChild(app.darkness);

app.hourToDarkness = function(hour){
	var intensity = 30;

	if (hour > season.dawn+1 && hour < season.dusk){ 
		app.time = 'day';
		return [5, 0];
	}
	else if (hour > season.dusk && hour < season.dusk+1){
		if ( !app.gameEvents.nightComes.status ){ say( app.gameEvents.nightComes.message ); app.gameEvents.nightComes.status = true; }
		var factor = hour-season.dusk;
		app.time = 'dusk';
		return [ 5+5*factor, intensity*factor ];
	} 
	else if (hour > season.dusk+1 || hour < season.dawn){
		app.time = 'night';
		return [10, intensity];
	}
	else if (hour > season.dawn && hour < season.dawn+1){
		var factor = hour-season.dawn;
		app.time = 'dawn';
		return [ 10 - 5*factor, intensity - intensity*factor ];
	} 
}

app.darkness.update = function(){
	var darkness = app.hourToDarkness( app.hour ) || [5, 0];
	app.darkness.style.boxShadow = 'inset 0 0 '+darkness[0]+'vw '+darkness[1]+'vh black';	
}

app.plantGrowth = function(){
	for (var i = 0; i < app.world.array.length; i++) {
		var wf = app.world.array[i];
		for (var j = 0; j < wf.herbs.length; j++) {
			var herb = wf.herbs[j];
			app.growHerb(herb);
		};
		for (var k = 0; k < wf.trees.length; k++) {
			var tree = wf.trees[k];
			app.growTree(tree);
		};
	};
}


app.nextDay = function(){
	app.plantGrowth();
	for (var i = 0; i < app.world.array.length; i++) {
		var wf = app.world.array[i];
		wf.herbsSpawn();
	};
	this.hour -= 24; this.day++;
	if (temp.hi > season.veryHot){ temp.hi -= 3; } // really high, sure down
	else if (temp.hi > season.hot){ temp.hi += ( Math.random() < 0.2 ? 1 : -2 ); } // high, probably down
	else if (temp.hi < season.veryCold){ temp.hi += 3; } // really low, sure up
	else if (temp.hi < season.cold){ temp.hi += ( Math.random() < 0.2 ? -1 : 2 ); } // low, probably up
	else { temp.hi += ( Math.random() < 0.5 ? -1 : 1 ); } // 50 / 50
	temp.low = temp.hi - 5 - rand(2);
	season.update();
	//console.log(app.day, season.current, temp.hi, temp.low);
}

app.dayDisplay = createUI(undefined, 10);
var dayDisplay = app.dayDisplay;
dayDisplay.style.left = undefined;
dayDisplay.style.right = '10px';
dayDisplay.style.fontSize = '18px';
dayDisplay.style.color = '#fff';
document.body.appendChild( dayDisplay );
dayDisplay.update = function(){
	dayDisplay.innerHTML = 'DAY '+ app.day + '<br/>'+ 
		( app.hour < 13 ? Math.floor(app.hour)+' AM' : Math.floor(app.hour-12)+' PM' ) + '<br>' +
		Math.round(temp.current)+' &deg;C';
}
dayDisplay.update();





})();


