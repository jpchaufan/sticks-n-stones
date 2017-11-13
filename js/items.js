var app = app || {};

(function(){
var player = app.player;

app.clickItemIcon = function(elem){
	var items = player.items;
	if (stash.isOpen){
		if (stash.limit){ say('No put this here...'); return; }
		for (var i = 0; i < items.length; i++) {
			if (items[i] == elem){
				if ( player.selecting == elem ){
					player.selecting = null;
				}
				items.splice(i, 1);
				// add item to stash here
				app.manageContents(stash.obj, elem.data, elem.amount);
				stash.showItems();
				app.window.removeChild( elem );
				
				break;
			}
		};
		for (var i = i; i < items.length; i++) {
			var elem = items[i];
			elem.style.left = +elem.style.left.replace('px', '')-40+'px';
		};
	} else if (!elem.selected){
		app.deselectAll();
		app.selectItem(elem);
		say('It '+elem.data.name+'...');
	} else {
		app.deselectAll();
	}
	
	
}

app.selectItem = function(elem){
	if (!elem.selected){
		player.selecting = elem;
		elem.selected = true;
		elem.style.backgroundColor = 'yellow';
		//elem.style.color = '#eeee77';	

	} else {
		player.selecting = null;
		app.deselect(elem);
	}
}

player.items = [];
player.selecting = null;

app.deselect = function(item){
	item.selected = false;
	item.style.backgroundColor = '#e0e0e0';	
	//item.style.color = '#000';
}

app.deselectAll = function(){	player.selecting = null;
	for (var i = 0; i < player.items.length; i++) {
		app.deselect( player.items[i] );
	};
}

app.manageItems = function(itemData, amt){ // manage player items in inventory
	var i = app.findItem(itemData), items = player.items, leftovers = 0;
	if ( i >= 0 ){
		var item = items[i];
		
		item.amount += amt;
		if ( item.amount > item.data.maxHold ){
			leftovers = item.amount - item.data.maxHold;
			item.amount = item.data.maxHold;
		}

		item.innerHTML = item.amount;
		if (item.amount <= 0){
			if (player.selecting == item){ player.selecting = null; }
			app.window.removeChild( item );
			items.splice(i, 1);
			for (var j = i; j < items.length; j++) {
				var item = items[j];
				item.style.left = +item.style.left.replace('px', '')-40+'px';
			};
		}
	} else if (items.length <= 20) {
		var image, offsetX;
		var elem = createUI(130+40*items.length, null, 40, 40);
		elem.style.bottom = '0';
		elem.style.backgroundColor = '#e0e0e0';
		elem.style.backgroundImage = "url("+itemData.img+")";
		elem.style.backgroundRepeat = "no-repeat";
		elem.style.backgroundSize = '70% 70%';
		elem.style.backgroundPosition = '40% 100%';
		elem.style.alignText = 'right';

		if ( amt > itemData.maxHold ){
			leftovers = amt - itemData.maxHold;
			amt = itemData.maxHold;
		}

		elem.innerHTML = amt;
		elem.addEventListener('click', function(){ app.clickItemIcon(elem) } )
		elem.data = itemData;
		elem.amount = amt;
		elem.zIndex = 10;
		items.push(elem)
		app.window.appendChild( elem );
		//if (!player.selecting) { selectItem( elem ); }
	}
	if (leftovers){ say('Full!') }
	return leftovers;
}

app.findItem = function(data){
	for (var i = 0; i < player.items.length; i++) {
		var item = player.items[i];
		if (item.data.name == data.name){ return i }
	};
}

app.itemStock = function(name){
	throw "itemStock function is being deleted soon"
	// var i = app.findItem(name);
	// if (i >= 0){
	// 	return player.items[i].amount;	
	// } else {
	// 	return 0;
	// }
	
}

// Stash Window //

app.stash = createUI(0, 0, 200, 200, '#666');
var stash = app.stash;
stash.style.border = '4px solid #333';
stash.style.borderRadius = '5px';
stash.style.left = window.innerWidth*2/3 + 'px';
stash.style.top = window.innerHeight/2+'px';
stash.zIndex = 10;
stash.header = document.createElement('h3');
stash.header.style.backgroundColor = '#99bb66';
enableDnD(stash)
stash.appendChild( stash.header );
stash.contentDisplay = document.createElement('div');
stash.contentDisplay.style.height = '150px';
stash.contentDisplay.style.margin = '4px';
stash.contentDisplay.style.backgroundColor = '#e4e4e4';
stash.appendChild( stash.contentDisplay );
stash.closeBtn = document.createElement('button');
stash.closeBtn.style.padding = '3px 12px';
stash.closeBtn.innerText = 'Close (Q)';
stash.closeBtn.addEventListener( 'click', function(){ app.closeStash() } );
stash.appendChild( stash.closeBtn );

app.manageContents = function(obj, data, amt, setTo){ // manage contents of a world stash typeobject (like a rock or tree)
	for (var i = 0; i < obj.contents.length; i++) {
		var item = obj.contents[i];
		//console.log('comparing ', item.name, name, '...');
		if (item.data.name == data.name){
			if (setTo){
				item.amount = amt;
			}
			else { item.amount += amt; }
			// console.log('altering', item.name, item.amount);
			if (item.amount <= 0){ obj.contents.splice(i, 1); }
			// console.log('obj.contents', obj.contents);
			// console.log('player.items', player.items);
			return;
		}
	};
	// console.log('adding', name);
	obj.contents.push( {data: data, amount: amt} );
	// console.log('obj.contents', obj.contents);
	// console.log('player.items', player.items);
}

app.openStash = function(obj, limit, destroyOnTake){
	stash.limit = limit;
	stash.isOpen = true;
	stash.obj = obj;
	app.window.appendChild( stash );
	stash.header.innerText = obj.name;
	stash.showItems(destroyOnTake);
	player.noMove = true;
}
stash.showItems = function(destroyOnTake){
	var obj = stash.obj;
	stash.contentDisplay.innerHTML = '';
	for (var i = 0; i < obj.contents.length; i++) {
		var item = obj.contents[i];
		var btn = document.createElement('button');
		btn.innerText = item.data.name + ' x'+item.amount;
		btn.style.width = '100%';
		btn.style.textAlign = 'center';
		btn.style.padding = '3px';
		btn.i = i;
		btn.onclick = function(){
			var item = obj.contents[this.i]; // console.log('j, contents', j, obj.contents)
			if ( !app.gameEvents.pickedStones.status && item.data.name == 'Stone' ){ say( app.gameEvents.pickedStones.message ); app.gameEvents.pickedStones.status = true; }
			if ( !app.gameEvents.gotSticks.status && item.data.name == 'Stick' ){ say( app.gameEvents.gotSticks.message ); app.gameEvents.gotSticks.status = true; }
			var leftovers = app.manageItems(item.data, item.amount);
			app.manageContents(obj, item.data, -(item.amount-leftovers));
			stash.contentDisplay.removeChild(this);
			if (obj.contents.length == 0){ 
				app.closeStash();
				if (destroyOnTake){
					obj.remove = true;
				}
			}
			else { stash.showItems(); }
			// console.log( 'removing', item.name, item.amount, ' stash size: ', obj.contents.length );
			// console.log( "=========" );
		}
		stash.contentDisplay.appendChild(btn);
	};
}

app.removeFromStash = function(){}

app.closeStash = function(){
	stash.isOpen = false;
	stash.obj = null;
	app.window.removeChild( stash );
	stash.contentDisplay.innerHTML = '';
	player.noMove = false;
}

app.runTest = function(){
	console.log( 'no test to run right now' );
}

})();

