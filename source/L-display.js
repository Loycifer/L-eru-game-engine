var L;
L.display = {
    get width() {
	return L.system.renderCanvas[0].style.offsetWidth;
    },
    set width(x) {
	L.system.renderCanvas[0].style.width = x;
    },
    get height() {
	return L.system.renderCanvas[0].style.height;
    },
    set height(x) {
	L.system.renderCanvas[0].style.height = x;
    }
};

L.display.autoResize = function()
{
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var canvasWidth = L.system.width;
    var canvasHeight = L.system.height;
    var windowAspect = windowWidth / windowHeight;

    if (windowAspect >= L.system.aspectRatio)
    {
	L.system.canvasRatio = windowHeight / canvasHeight;
	//L.system.renderCanvas[0].style.width = (windowWidth * (windowHeight * L.system.aspectRatio)) + "px";
	//L.system.renderCanvas[0].style.height = (windowHeight) + "px";
	//document.body.style.height = L.system.renderCanvas[0].style.height;
    }
    else if (windowAspect < L.system.aspectRatio)
    {
	L.system.canvasRatio = windowWidth / canvasWidth;
	//L.system.renderCanvas[0].style.width = (windowWidth) + "px";
	//L.system.renderCanvas[0].style.height = (windowHeight / L.system.aspectRatio) + "px";
	//document.body.style.width = L.system.renderCanvas[0].style.width;
    }
    L.system.renderCanvas[0].style.width = canvasWidth * L.system.canvasRatio + "px";
    L.system.renderCanvas[0].style.height = canvasHeight * L.system.canvasRatio + "px";
    document.body.style.width = "100%";//L.system.renderCanvas[0].style.width;
    //document.body.style.height = canvasHeight * L.system.canvasRatio - 0 + "px";
    document.body.style.height = Math.floor(windowHeight) + "px";
};
