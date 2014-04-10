var L;


L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];
L.system.fxCanvas = [];
L.system.fxContext = [];
L.system.pixelCanvas = [];
L.system.pixelContext = [];

L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    L.system.renderCanvas[0] = document.createElement("canvas");
    L.system.renderCanvas[0].width = width;
    L.system.renderCanvas[0].height = height;
    L.system.canvasLocation.appendChild(L.system.renderCanvas[0]);
    L.system.renderContext[0] = L.system.renderCanvas[0].getContext("2d");

    L.system.bufferCanvas[0] = document.createElement('canvas');
    L.system.bufferCanvas[0].width = width;
    L.system.bufferCanvas[0].height = height;
    L.system.bufferContext[0] = L.system.bufferCanvas[0].getContext("2d");

    L.system.fxCanvas[0] = document.createElement('canvas');
    L.system.fxCanvas[0].width = width;
    L.system.fxCanvas[0].height = height;
    L.system.fxContext[0] = L.system.bufferCanvas[0].getContext("2d");

    L.system.pixelCanvas[0] = document.createElement('canvas');
    L.system.pixelCanvas[0].width = 1;
    L.system.pixelCanvas[0].height = 1;
    L.system.pixelContext[0] = L.system.bufferCanvas[0].getContext("2d");




    L.system.canvasX = L.system.renderCanvas[0].offsetLeft;
    L.system.canvasY = L.system.renderCanvas[0].offsetTop;


    L.system.handleClick = function(e)
    {

	var mouseX = e.pageX - L.system.canvasX;
	var mouseY = e.pageY - L.system.canvasY;
	L.system.currentScene.isClicked(mouseX, mouseY);
    };

    L.system.renderCanvas[0].addEventListener
	    (
		    'click',
		    L.system.handleClick

		    );

    window.addEventListener("keydown", doKeyDown, true);
    function doKeyDown(event) {
	L.system.currentScene.doKeyDown(event);
    }

};