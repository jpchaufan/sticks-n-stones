var app = app || {};

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
app.hour = 6;

app.hoursPerSecond = 1 / 10;

app.updateTime = function(dt){
	app.hour += app.hoursPerSecond*dt;
	if ( app.hour > 24 ){ app.nextDay() }
}

app.season = {};
app.season.array = ['winter', 'spring', 'summer', 'fall'];
app.season.current;
app.season.i = 0;
app.season.veryHot;
app.season.hot;
app.season.cold;
app.season.veryCold;
app.season.dawn;
app.season.dusk;
app.season.update = function(){
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
		this.cold = -10;
		this.veryCold = -20;
		this.dusk = 20;
		this.dawn = 7;
	} else if ( this.current == 'fall' ){
		this.veryHot = 20;
		this.hot = 15;
		this.cold = 10;
		this.veryCold = 5;
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
app.season.update();

app.temp = {}
app.temp.hi = 20;
app.temp.low = 15;
app.temp.current;
app.temp.calculate = function(hi, drop, time){
	var factor = Math.abs( time/12-1 );
	return hi - drop*factor;
}
app.temp.update = function(){
	this.current = this.calculate(this.hi, this.hi - this.low, app.hour);
	//console.log('temp:', this.current);
}
app.temp.update();

app.darkness = createUI(0, 0, app.canvas.width, app.canvas.height);
app.darkness.style.width = '100vw';
app.darkness.style.height = '100vh';
document.body.appendChild(app.darkness);

app.hourToDarkness = function(hour){
	var intensity = 30, season = app.season;

	if (hour > 6 && hour < season.dusk){ return [5, 0]; } // day
	else if (hour > season.dusk && hour < season.dusk+1){ // dusk
		if ( !app.gameEvents.nightComes.status ){ say( app.gameEvents.nightComes.message ); app.gameEvents.nightComes.status = true; }
		var factor = hour-season.dusk;
		return [ 5+5*factor, intensity*factor ];
	} 
	else if (hour > season.dusk+1 || hour < season.dawn){ return [10, intensity] } // night
	else if (hour > season.dawn && hour < season.dawn+1){ // dawn
		var factor = hour-season.dawn;
		return [ 10 - 5*factor, intensity - intensity*factor ];
	} 
}

app.darkness.update = function(){
	var darkness = app.hourToDarkness( app.hour ) || [5, 0];
	app.darkness.style.boxShadow = 'inset 0 0 '+darkness[0]+'vw '+darkness[1]+'vh black';	
}


app.nextDay = function(){
	var season = this.season;
	this.hour -= 24; this.day++;
	if (this.temp.hi > season.veryHot){ this.temp.hi -= 3; } // really high, sure down
	else if (this.temp.hi > season.hot){ this.temp.hi += ( Math.random() < 0.2 ? 1 : -2 ); } // high, probably down
	else if (this.temp.hi < season.veryCold){ this.temp.hi += 3; } // really low, sure up
	else if (this.temp.hi < season.cold){ this.temp.hi += ( Math.random() < 0.2 ? -1 : 2 ); } // low, probably up
	else { this.temp.hi += ( Math.random() < 0.5 ? -1 : 1 ); } // 50 / 50
	this.temp.low = this.temp.hi - 5 - rand(2);
	app.season.update();
	console.log(app.day, app.season.current, this.temp.hi, this.temp.low);
}

app.dayDisplay = createUI(undefined, 10);
app.dayDisplay.style.left = undefined;
app.dayDisplay.style.right = '10px';
app.dayDisplay.style.fontSize = '18px';
app.dayDisplay.style.color = '#fff';
document.body.appendChild( app.dayDisplay );
app.dayDisplay.update = function(){
	app.dayDisplay.innerHTML = 'DAY '+ app.day + '<br/>'+ 
		( app.hour < 13 ? Math.floor(app.hour)+' AM' : Math.floor(app.hour-12)+' PM' ) + '<br>' +
		Math.round(app.temp.current)+' &deg;C';
}
app.dayDisplay.update();








