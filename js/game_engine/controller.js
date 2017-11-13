
var app = app || {};

(function(){

app.controller = {};

var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;

var KEY_A = 65;
var KEY_D = 68;
var KEY_W = 87;
var KEY_S = 83;


var KEY_SPACE = 32;
var SHIFT = 16;
var KEY_P = 80;
var KEY_T = 84;
var KEY_Q = 81;
var KEY_C = 67;

var ONE = 49;        var SIX = 54;
var TWO = 50;        var SEVEN = 55;
var THREE = 51;      var EIGHT = 56;
var FOUR = 52;       var NINE = 57;
var FIVE = 53;       var ZERO = 48;

//app.canvas.addEventListener('click', function(){ alert('hi') })

document.addEventListener('keydown', function(e){
	var ctrl = app.controller;
	if (e.keyCode == KEY_LEFT || e.keyCode == KEY_A){ ctrl.left = true; }
	if (e.keyCode == KEY_RIGHT || e.keyCode == KEY_D){ ctrl.right = true; }
	if (e.keyCode == KEY_UP || e.keyCode == KEY_W){ ctrl.up = true; }
	if (e.keyCode == KEY_DOWN || e.keyCode == KEY_S){ ctrl.down = true; }
	if (e.keyCode == KEY_SPACE){ ctrl.action = true; }
	//if (e.keyCode == KEY_T){ app.runTest() }
	if (e.keyCode == KEY_T || e.keyCode == KEY_P){ app.pauseGame() }

	if (e.keyCode == KEY_Q){ ctrl.q = true; }

	if (e.keyCode == SHIFT){ ctrl.shift = true }

	if (e.keyCode == ONE){ ctrl.one = true }
	if (e.keyCode == TWO){ ctrl.two = true }
	if (e.keyCode == THREE){ ctrl.three = true }
	if (e.keyCode == FOUR){ ctrl.four = true }
	if (e.keyCode == FIVE){ ctrl.five = true }
	if (e.keyCode == SIX){ ctrl.six = true }
	if (e.keyCode == SEVEN){ ctrl.seven = true }
	if (e.keyCode == EIGHT){ ctrl.eight = true }
	if (e.keyCode == NINE){ ctrl.nine = true }
	if (e.keyCode == ZERO){ ctrl.zero = true }

	
	//console.log(e.keyCode)
});

document.addEventListener('keyup', function(e){
	var ctrl = app.controller;
	if (e.keyCode == KEY_LEFT || e.keyCode == KEY_A){ ctrl.left = false; }
	if (e.keyCode == KEY_RIGHT || e.keyCode == KEY_D){ ctrl.right = false; }
	if (e.keyCode == KEY_UP || e.keyCode == KEY_W){ ctrl.up = false; }
	if (e.keyCode == KEY_DOWN || e.keyCode == KEY_S){ ctrl.down = false; }
	if (e.keyCode == KEY_SPACE){ ctrl.action = false; }

	if (e.keyCode == KEY_Q){ ctrl.q = false; }

	if (e.keyCode == SHIFT){ ctrl.shift = false }

	if (e.keyCode == ONE){ ctrl.one = false }
	if (e.keyCode == TWO){ ctrl.two = false }
	if (e.keyCode == THREE){ ctrl.three = false }
	if (e.keyCode == FOUR){ ctrl.four = false }
	if (e.keyCode == FIVE){ ctrl.five = false }
	if (e.keyCode == SIX){ ctrl.six = false }
	if (e.keyCode == SEVEN){ ctrl.seven = false }
	if (e.keyCode == EIGHT){ ctrl.eight = false }
	if (e.keyCode == NINE){ ctrl.nine = false }
	if (e.keyCode == ZERO){ ctrl.zero = false }
	
	//console.log(e.keyCode)
});

document.addEventListener('mousemove', function(e){
	if ( !(e.which == 1 || e.button == 0 || ctrl.action ) ){ return }
	var ctrl = app.controller;
	var stretchX = app.canvas.offsetWidth / app.canvas.width
	var stretchY = app.canvas.offsetHeight / app.canvas.height
	var x = ( e.pageX - app.canvas.offsetLeft ) / stretchX ;
	var y = ( e.pageY - app.canvas.offsetTop ) / stretchY ;

	ctrl.x = x + app.camera.x;
	ctrl.y = y + app.camera.y;
	ctrl.draggedOn = spriteAtPos(ctrl.x, ctrl.y);
	ctrl.status = 'dragging';
});
document.addEventListener('mousedown', function(e){
	var ctrl = app.controller;
	if ( !(e.which == 1 || e.button == 0 || ctrl.action ) ){ return }
	var ctrl = app.controller;
	if (ctrl.action){
		ctrl.rightClick(e);
	} else {
		ctrl.mousedown = true;
		var stretchX = app.canvas.offsetWidth / app.canvas.width
		var stretchY = app.canvas.offsetHeight / app.canvas.height
		var x = ( e.pageX - app.canvas.offsetLeft ) / stretchX ;
		var y = ( e.pageY - app.canvas.offsetTop ) / stretchY ;

		ctrl.x = x + app.camera.x;
		ctrl.y = y + app.camera.y;
		ctrl.clickedOn = spriteAtPos(ctrl.x, ctrl.y);
		ctrl.status = 'click';
	}
})
document.addEventListener('contextmenu', function(e){
	e.preventDefault();

	app.controller.rightClick(e);
})
document.addEventListener('mouseup', function(e){
	var ctrl = app.controller;
	ctrl.mousedown = false;
	ctrl.clickedOn = null;
	ctrl.draggedOn = null;
	ctrl.status = null;
})

app.controller.rightClick = function(e){
	var ctrl = app.controller;
	var stretchX = app.canvas.offsetWidth / app.canvas.width
	var stretchY = app.canvas.offsetHeight / app.canvas.height
	var x = ( e.pageX - app.canvas.offsetLeft ) / stretchX ;
	var y = ( e.pageY - app.canvas.offsetTop ) / stretchY ;

	ctrl.x = x + app.camera.x;
	ctrl.y = y + app.camera.y;
	ctrl.clickedOn = spriteAtPos(ctrl.x, ctrl.y);
	ctrl.status = 'rightclick';
}




})();