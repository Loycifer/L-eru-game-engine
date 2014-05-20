var L;




L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    var aspectRatio = L.system.aspectRatio = width / height;

    if (screen !== undefined & screen.lockOrientation) {
	screen.lockOrientation(L.system.orientation);
    }
    ;


    L.system.renderCanvas[0] = document.createElement("canvas");
    L.system.renderCanvas[0].width = width;
    L.system.renderCanvas[0].height = height;

    L.system.canvasLocation.appendChild(L.system.renderCanvas[0]);
    L.system.renderContext[0] = L.system.renderCanvas[0].getContext("2d");
    // L.system.renderCanvas[0].mozRequestFullscreen();
    //L.system.canvasLocation.firstElementChild.requestFullscreen();
    // L.system.renderCanvas[0].style.width = "100%";



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




    //L.system.canvasX = L.system.renderCanvas[0].offsetLeft;
    //L.system.canvasY = L.system.renderCanvas[0].offsetTop;
    Object.defineProperty(L.system, "canvasX", {
	get: function() {
	    return L.system.renderCanvas[0].offsetLeft;
	}
    });
    Object.defineProperty(L.system, "canvasY", {
	get: function() {
	    return L.system.renderCanvas[0].offsetTop;
	}
    });


    L.system.handleClick = function(e)
    {

	var mouseX = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	var mouseY = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
	L.system.currentScene.isClicked(mouseX, mouseY);
    };

    L.system.setMouseCoords = function(e)
    {
	L.system.mouseX = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	L.system.mouseY = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
    };

    L.system.renderCanvas[0].addEventListener
    (
    'click',
    L.system.handleClick
    );

    L.system.renderCanvas[0].addEventListener
    (
    'mousemove',
    L.system.setMouseCoords
    );

    window.addEventListener("keydown", doKeyDown, true);
    function doKeyDown(event) {
	L.system.currentScene.doKeyDown(event);
    }

    if (L.system.fullscreen) {
	L.display.autoResize();
	window.addEventListener('resize', L.display.autoResize, true);
    }


};