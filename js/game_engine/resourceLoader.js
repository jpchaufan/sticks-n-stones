var app = app || {};

app.assetsToLoad = 0;
app.assetsLoaded = 0;

app.assetWasLoaded = function(){ 
	app.assetsLoaded++;
	app.loadingBar.innerHTML = Math.round(app.assetsLoaded / app.assetsToLoad * 100)+'%';

	//console.log('assets loaded:', app.assetsLoaded, '/', app.assetsToLoad);
	if ( app.assetsLoaded == app.assetsToLoad && app.startGame ){
		app.window.removeChild(app.loadingText);
		app.window.removeChild(app.loadingBar);
		app.setupHelpMenu();
		app.setupCreditsMenu();
		//app.createStartMenu();
		app.startGame();
	}
}

app.imgs = {};
app.addImages = function(array){ // array of objects which have a name and a src
	app.assetsToLoad += array.length;
	for (var i = 0; i < array.length; i++) {
		var data = array[i];
		var img = new Image();
		img.src = data.src;
		app.imgs[data.name] = img;
		img.onload = app.assetWasLoaded();
	};
}

//** version with fake loading time  **//
// app.addImages = function(array){ // array of objects which have a name and a src
// 	app.assetsToLoad += array.length;
// 	for (var i = 0; i < array.length; i++) {
// 		setTimeout(
// 			function(x){
// 				return function(){
// 					var data = array[x];
// 					var img = new Image();
// 					img.src = data.src;
// 					app.imgs[data.name] = img;
// 					img.onload = app.assetWasLoaded();
// 				}
// 			}(i), Math.random()*2000
// 		)
// 	};
// }



// app.img = function(name){
// 	return app.imgs[name];
// }




