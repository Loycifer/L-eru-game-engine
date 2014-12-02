var L;
L.mouse = {};
L.mouse.x = 0;
L.mouse.y = 0;
L.mouse.buttons = [];
L.mouse.buttons[0] = {
    name: 'left',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.buttons[1] = {
    name: 'middle',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.buttons[2] = {
    name: 'right',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.touchEnabled = false;
L.mouse.reset = function()
{
  for (var i = 0; i < 3; i++)
  {
      var currentButton = this.buttons[i];
      currentButton.isDown = false;
      currentButton.lastDown.x = 0;
      currentButton.lastDown.y = 0;
  }
};

L.system.handleClick = function(e)
{
var mouseX = 0;
var mouseY = 0;
    if (e.targetTouches) {

	mouseX = (e.targetTouches[0].pageX - L.system.canvasX) / L.system.canvasRatio;
	mouseY = (e.targetTouches[0].pageY - L.system.canvasY) / L.system.canvasRatio;
    } else
    {
	var type = e.type;
	var targetButton = L.mouse.buttons[e.button];
	mouseX = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	mouseY = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
	if (type === 'mousedown')
	{
	    targetButton.isDown = true;
	    targetButton.lastDown.x = mouseX;
	    targetButton.lastDown.y = mouseY;
	}
	if (type === 'mouseup')
	{
	    targetButton.isDown = false;
	}

    }

    if (L.system.currentScene.handleClick && targetButton.name === 'left')
    {
	L.system.currentScene.handleClick(mouseX, mouseY, e);
    }

    e.preventDefault();
};

L.system.setMouseCoords = function(e)
{
    if (e.type !== 'touchmove')
    {
	L.mouse.x = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	L.mouse.y = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
    } else {
	L.mouse.x = (e.targetTouches[0].pageX - L.system.canvasX) / L.system.canvasRatio;
	L.mouse.y = (e.targetTouches[0].pageY - L.system.canvasY) / L.system.canvasRatio;
    }

};

L.mouse.setupEventListeners = function()
{
    if ('ontouchstart' in document.documentElement)
    {
	L.mouse.touchEnabled = true;
	L.system.renderCanvas[0].addEventListener
	(
	'touchstart',
	L.system.handleClick
	);

	L.system.renderCanvas[0].addEventListener
	(
	'touchmove',
	L.system.setMouseCoords
	);

	L.system.renderCanvas[0].addEventListener
	(
	'touchend',
	L.system.handleClick
	);

    } else {
	L.system.renderCanvas[0].addEventListener
	(
	'mousedown',
	L.system.handleClick
	);

	L.system.renderCanvas[0].addEventListener
	(
	'mousemove',
	L.system.setMouseCoords
	);

	L.system.renderCanvas[0].addEventListener
	(
	'mouseup',
	L.system.handleClick
	);
    }
};
