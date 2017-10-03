var app = app || {};







function clickItemIcon(elem){
	var stash = app.stash, player = app.player, items = app.player.items;
	if (stash.isOpen){
		for (var i = 0; i < items.length; i++) {
			if (items[i] == elem){
				if ( player.selecting == elem ){
					player.selecting = null;
				}
				items.splice(i, 1);
				// add item to stash here
				manageContents(app.stash.obj, elem.name, elem.amount);
				app.stash.showItems();
				document.body.removeChild( elem );
				
				break;
			}
		};
		for (var i = i; i < items.length; i++) {
			var elem = items[i];
			elem.style.left = +elem.style.left.replace('px', '')-40+'px';
		};
	} else {
		deselectAll();
		selectItem(elem);
		say('It '+elem.name+'...');
	}
	
	
}

function selectItem(elem){
	if (!elem.selected){
		app.player.selecting = elem;
		elem.selected = true;
		elem.style.backgroundColor = 'yellow';
		//elem.style.color = '#eeee77';	

	} else {
		app.player.selecting = null;
		deselect(elem);
	}
}

app.player.items = [];
app.player.selecting = null;

function deselect(item){
	item.selected = false;
	item.style.backgroundColor = '#e0e0e0';	
	//item.style.color = '#000';
}

function deselectAll(){
	var player = app.player;
	player.selecting = null;
	for (var i = 0; i < player.items.length; i++) {
		deselect( player.items[i] );
	};
}

app.manageItems = function(item, amt){
	var i = findItem(item), items = app.player.items;
	if ( i >= 0 ){
		var item = items[i];
		item.amount += amt;
		item.innerHTML = item.amount;
		if (item.amount <= 0){
			if (app.player.selecting == item){ app.player.selecting = null; }
			document.body.removeChild( item );
			items.splice(i, 1);
			// move remaining items down in UI
		}
	} else if (items.length <= 20) {
		var image, offsetX;
		var elem = createUI(80+40*items.length, null, 40, 40);
		elem.style.bottom = '0';
		elem.style.backgroundColor = '#e0e0e0';
		if (item == 'Stone'){ elem.style.backgroundImage = "url('imgs/stone.png')"; }
		if (item == 'Stick'){ elem.style.backgroundImage = "url('imgs/stick.png')"; }
		if (item == 'Pear'){ elem.style.backgroundImage = "url('imgs/pear.png')"; }
		if (item == 'Leaf'){ elem.style.backgroundImage = "url('imgs/leaf.png')"; }
		elem.style.backgroundRepeat = "no-repeat";
		elem.style.backgroundSize = '70% 70%';
		elem.style.backgroundPosition = '40% 100%';
		elem.style.alignText = 'right';
		elem.innerHTML = amt;
		elem.addEventListener('click', function(){ clickItemIcon(elem) } )
		elem.name = item;
		elem.amount = amt;
		elem.zIndex = 10;
		items.push(elem)
		document.body.appendChild( elem );
		if (!app.player.selecting) { selectItem( elem ); }
	}
}

function findItem(name){
	for (var i = 0; i < app.player.items.length; i++) {
		var item = app.player.items[i];
		if (item.name == name){ return i }
	};
}

function itemStock(name){
	var i = findItem(name);
	if (i >= 0){
		return app.player.items[i].amount;	
	} else {
		return 0;
	}
	
}

// Stash Window //

app.stash = createUI(0, 0, 200, 200, '#666');
app.stash.style.border = '4px solid #333';
app.stash.style.borderRadius = '5px';
app.stash.style.left = window.innerWidth*2/3 + 'px';
app.stash.style.top = window.innerHeight/2+'px';
app.stash.zIndex = 10;
app.stash.header = document.createElement('h3');
app.stash.header.style.backgroundColor = '#99bb66';
enableDnD(app.stash)
app.stash.appendChild( app.stash.header );
app.stash.contentDisplay = document.createElement('div');
app.stash.contentDisplay.style.height = '150px';
app.stash.contentDisplay.style.margin = '4px';
app.stash.contentDisplay.style.backgroundColor = '#e4e4e4';
app.stash.appendChild( app.stash.contentDisplay );
app.stash.closeBtn = document.createElement('button');
app.stash.closeBtn.style.padding = '3px 12px';
app.stash.closeBtn.innerText = 'close';
app.stash.closeBtn.addEventListener( 'click', closeStash );
app.stash.appendChild( app.stash.closeBtn );

function manageContents(obj, name, amt){
	for (var i = 0; i < obj.contents.length; i++) {
		var item = obj.contents[i];
		//console.log('comparing ', item.name, name, '...');
		if (item.name == name){
			item.amount += amt;
			// console.log('altering', item.name, item.amount);
			if (item.amount <= 0){ obj.contents.splice(i, 1); }
			// console.log('obj.contents', obj.contents);
			// console.log('app.player.items', app.player.items);
			return;
		}
	};
	// console.log('adding', name);
	obj.contents.push( {name: name, amount: amt} );
	// console.log('obj.contents', obj.contents);
	// console.log('app.player.items', app.player.items);
}

function openStash(obj){
	var stash = app.stash;
	stash.isOpen = true;
	stash.obj = obj;
	document.body.appendChild( stash );
	stash.header.innerText = obj.name;
	stash.showItems();
	app.player.noMove = true;
}
app.stash.showItems = function(){
	var stash = app.stash;
	var obj = stash.obj;
	stash.contentDisplay.innerHTML = '';
	for (var i = 0; i < obj.contents.length; i++) {
		var item = obj.contents[i];
		var btn = document.createElement('button');
		btn.innerText = item.name + ' x'+item.amount;
		btn.style.width = '100%';
		btn.style.textAlign = 'center';
		btn.style.padding = '3px';
		btn.i = i;
		btn.onclick = function(){
			var item = obj.contents[this.i]; // console.log('j, contents', j, obj.contents)
			if ( !app.gameEvents.pickedStones.status && item.name == 'Stones' ){ say( app.gameEvents.pickedStones.message ); app.gameEvents.pickedStones.status = true; }
			if ( !app.gameEvents.gotSticks.status && item.name == 'Sticks' ){ say( app.gameEvents.gotSticks.message ); app.gameEvents.gotSticks.status = true; }
			app.manageItems(item.name, item.amount);
			manageContents(obj, item.name, -item.amount);
			stash.contentDisplay.removeChild(this);
			if (obj.contents.length == 0){ closeStash() }
			else { stash.showItems(); }
			// console.log( 'removing', item.name, item.amount, ' stash size: ', obj.contents.length );
			// console.log( "=========" );
		}
		stash.contentDisplay.appendChild(btn);
	};
}

function removeFromStash(){}

function closeStash(){
	var stash = app.stash;
	stash.isOpen = false;
	stash.obj = null;
	document.body.removeChild( stash );
	stash.contentDisplay.innerHTML = '';
	app.player.noMove = false;
}



function runTest(){
	console.log( app.player.items.map( function(el){ return el.name+', '+el.selected } ) );
	console.log( app.stash.obj.contents )
	// for (var i = 0; i < app.player.items.length; i++) {
	// 	console.log(
	// 		app.player.items[i].name
	// 	)
	// };
}

