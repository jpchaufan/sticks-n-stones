var app = app || {};

app.items = [];

function item(item, amt){
	var i = findItem(item);
	if ( i >= 0 ){
		var item = app.items[i];
		item.amount += amt;
		item.elem.innerHTML = item.amount;
		if (item.amount <= 0){
			document.body.removeChild( item.elem );
			app.items.splice(i, 1);
			// move remaining items down in UI
		}
	} else if (app.items.length <= 20) {
		var type, image, offsetX;
		var elem = createUI(80+40*app.items.length, null, 40, 40);
		elem.style.bottom = '0';
		elem.style.backgroundColor = '#e0e0e0';
		if (item == 'stones'){ elem.style.backgroundImage = "url('imgs/stone.png')"; }
		elem.style.backgroundRepeat = "no-repeat";
		elem.style.backgroundSize = '70% 70%';
		elem.style.backgroundPosition = '40% 100%';
		elem.style.alignText = 'right';
		elem.innerHTML = amt;
		
		app.items.push({ name: item, amount: amt, elem: elem })
		document.body.appendChild( elem )
	}
}

function findItem(name){
	for (var i = 0; i < app.items.length; i++) {
		var item = app.items[i];
		if (item.name == name){ return i }
	};
}

function itemStock(name){
	var i = findItem(name);
	if (i >= 0){
		return app.items[i].amount;	
	} else {
		return 0;
	}
	
}

// function showItems(){
// 	for (var i = 0; i < app.items.length; i++) {
// 		var item = app.items[i];
// 		item.x = 80 + i*40;
// 		item.y = app.canvas.height - 40;
// 		item.w = 40;
// 		item.h = 40;
// 		app.ctx.globalAlpha = 0.7;
// 		app.ctx.fillStyle = '#e0e0e0';
// 		app.ctx.fillRect(item.x, item.y, item.w, item.h);
// 		app.ctx.drawImage(item.image, item.x+5, item.y+item.offsetY);
// 		app.ctx.fillStyle = "black";
// 		app.ctx.font = "bold 14pt Arial";
// 		app.ctx.fillText(item.amount, item.x + 12,item.y + 38);
// 		app.ctx.globalAlpha = 1;
// 		item.x = item.x + app.camera.x;
// 		item.y = item.y + app.camera.y;
// 		item.index = i;
// 	};
// }

function drawItem(){ // might be better to draw items as divs

}

