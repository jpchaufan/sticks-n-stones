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

app.darkness = createUI(0, 0, app.canvas.width, app.canvas.height);
app.darkness.style.width = '100vw';
app.darkness.style.height = '100vh';
document.body.appendChild(app.darkness);
app.day = 1;
app.hour = 6;

app.hoursPerSecond = 1 / 15;

app.updateTime = function(dt){
	app.hour += app.hoursPerSecond*dt;
	if ( app.hour > 24 ){ app.nextDay() }
}

app.hourToDarkness = function(hour){
	var intensity = 30;

	if (hour > 6 && hour < 22){ return [5, 0]; } // day
	else if (hour > 22 && hour < 23){ // dusk
		if ( !app.gameEvents.nightComes.status ){ say( app.gameEvents.nightComes.message ); app.gameEvents.nightComes.status = true; }
		var factor = hour-22;
		return [ 5+5*factor, intensity*factor ];
	} 
	else if (hour > 23 || hour < 5){ return [10, intensity] } // night
	else if (hour > 5 && hour < 6){ // dawn
		var factor = hour-5;
		return [ 10 - 5*factor, intensity - intensity*factor ];
	} 
}

app.darkness.update = function(){
	var darkness = app.hourToDarkness( app.hour );
	app.darkness.style.boxShadow = 'inset 0 0 '+darkness[0]+'vw '+darkness[1]+'vh black';	
}

app.temp = {}
app.temp.hi = 25;
app.temp.low = 20;
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


app.nextDay = function(){
	this.hour -= 24; this.day++;
	if (this.temp.hi > 34){ this.temp.hi -= 1; } // really high, sure down
	else if (this.temp.hi > 30){ this.temp.hi += ( Math.random() < 0.3 ? 1 : -1 ); } // high, probably down
	else if (this.temp.hi < -3){ this.temp.hi += 1; } // really low, sure up
	else if (this.temp.hi < 4){ this.temp.hi += ( Math.random() < 0.3 ? -1 : 1 ); } // low, probably up
	else { this.temp.hi += ( Math.random() < 0.5 ? -1 : 1 ); } // 50 / 50
	this.temp.low = this.temp.hi - 5 - rand(2);

	console.log('hi / lo', this.temp.hi, this.temp.low);
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








