var app = app || {};

app.controller = {};

var KEY_LEFT = 37;   var KEY_A = 65;
var KEY_RIGHT = 39;  var KEY_D = 68;
var KEY_UP = 38;	 var KEY_W = 87;
var KEY_DOWN = 40;   var KEY_S = 83;
var KEY_SPACE = 32;
var KEY_P = 80;
var KEY_T = 84;

document.addEventListener('keydown', function(e){
	var ctrl = app.controller;
	if (e.keyCode == KEY_LEFT || e.keyCode == KEY_A){ ctrl.left = true; }
	if (e.keyCode == KEY_RIGHT || e.keyCode == KEY_D){ ctrl.right = true; }
	if (e.keyCode == KEY_UP || e.keyCode == KEY_W){ ctrl.up = true; }
	if (e.keyCode == KEY_DOWN || e.keyCode == KEY_S){ ctrl.down = true; }
	//if (e.keyCode == KEY_SPACE){ ctrl.action = true; }
	if (e.keyCode == KEY_T){ runTest() }
	
	//console.log(e.keyCode)
});

document.addEventListener('keyup', function(e){
	var ctrl = app.controller;
	if (e.keyCode == KEY_LEFT || e.keyCode == KEY_A){ ctrl.left = false; }
	if (e.keyCode == KEY_RIGHT || e.keyCode == KEY_D){ ctrl.right = false; }
	if (e.keyCode == KEY_UP || e.keyCode == KEY_W){ ctrl.up = false; }
	if (e.keyCode == KEY_DOWN || e.keyCode == KEY_S){ ctrl.down = false; }
	//if (e.keyCode == KEY_SPACE){ ctrl.action = false; }
	
	//console.log(e.keyCode)
});

document.addEventListener('mousemove', function(e){
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
	ctrl.mousedown = true;
	var stretchX = app.canvas.offsetWidth / app.canvas.width
	var stretchY = app.canvas.offsetHeight / app.canvas.height
	var x = ( e.pageX - app.canvas.offsetLeft ) / stretchX ;
	var y = ( e.pageY - app.canvas.offsetTop ) / stretchY ;

	ctrl.x = x + app.camera.x;
	ctrl.y = y + app.camera.y;
	ctrl.clickedOn = spriteAtPos(ctrl.x, ctrl.y);
	ctrl.status = 'click';
})
document.addEventListener('mouseup', function(e){
	var ctrl = app.controller;
	ctrl.mousedown = false;
	ctrl.clickedOn = null;
	ctrl.draggedOn = null;
	ctrl.status = null;
})



