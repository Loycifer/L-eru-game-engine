var L;




L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    var aspectRatio = L.system.aspectRatio = width / height;

    try {
	screen.lockOrientation(L.system.orientation);
    }
    catch (e)
    {
	L.log("Warning: Screen orientation could not be locked.");
    }



    L.system.renderCanvas[0] = document.createElement("canvas");
    L.system.renderCanvas[0].width = width;
    L.system.renderCanvas[0].height = height;
    L.system.canvasLocation.appendChild(L.system.renderCanvas[0]);
    L.system.renderContext[0] = L.system.renderCanvas[0].getContext("2d");
//    L.system.renderContext[0].imageSmoothingEnabled = false;
//    L.system.renderContext[0].webkitImageSmoothingEnabled = false;
//    L.system.renderContext[0].mozImageSmoothingEnabled = false;




    L.system.bufferCanvas[0] = document.createElement('canvas');
    L.system.bufferCanvas[0].width = width;
    L.system.bufferCanvas[0].height = height;
    L.system.bufferContext[0] = L.system.bufferCanvas[0].getContext("2d");
//    L.system.bufferContext[0].imageSmoothingEnabled = false;
//    L.system.bufferContext[0].webkitImageSmoothingEnabled = false;
//    L.system.bufferContext[0].mozImageSmoothingEnabled = false;


    L.system.fxCanvas[0] = document.createElement('canvas');
    L.system.fxCanvas[0].width = width;
    L.system.fxCanvas[0].height = height;
    L.system.fxContext[0] = L.system.fxCanvas[0].getContext("2d");

    L.system.pixelCanvas[0] = document.createElement('canvas');
    L.system.pixelCanvas[0].width = 1;
    L.system.pixelCanvas[0].height = 1;
    L.system.pixelContext[0] = L.system.pixelCanvas[0].getContext("2d");




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
	if (e.targetTouches) {
	    var isTouch = true;
	}

	var mouseX = ((isTouch ? e.targetTouches[0].pageX : e.pageX) - L.system.canvasX) / L.system.canvasRatio;
	var mouseY = ((isTouch ? e.targetTouches[0].pageY : e.pageY) - L.system.canvasY) / L.system.canvasRatio;
	if (L.system.currentScene.isClicked)
	{
	    L.system.currentScene.isClicked(mouseX, mouseY, e);
	}
	e.preventDefault();
    };

    L.system.setMouseCoords = function(e)
    {
	L.system.mouseX = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	L.system.mouseY = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
    };


    if ('ontouchstart' in document.documentElement)
    {
	L.system.renderCanvas[0].addEventListener
	(
	'touchstart',
	L.system.handleClick
	);
//
//         jQueryDocument.on("touchstart", onTouchEvent);
//        jQueryDocument.on("touchmove", onTouchEvent);
//        jQueryDocument.on("touchend", onTouchEvent);
    } else {





	L.system.renderCanvas[0].addEventListener
	(
	'mousedown',
	L.system.handleClick
	);
    }

    L.system.renderCanvas[0].addEventListener
    (
    'mousemove',
    L.system.setMouseCoords
    );

    window.addEventListener("keydown", doKeyDown, true);
    function doKeyDown(event) {
	if (L.system.currentScene.doKeyDown !== undefined)
	{
	    L.system.currentScene.doKeyDown(event);
	}
    }

    if (L.system.fullscreen) {
	//var CSSOptions = "margin: 0px; padding: 0px; border-width: 0px;	overflow:hidden;";
	//document.body.style = CSSOptions;
	//document.getElementsByTagName("html")[0].style = CSSOptions;
	//L.system.renderCanvas[0].style = "margin:0px auto; transition-property: all; transition-duration: 1s; transition-timing-function: ease;" + CSSOptions;
	L.display.autoResize();
	window.addEventListener('resize', L.display.autoResize, true);
    }


};