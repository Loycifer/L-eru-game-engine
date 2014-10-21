var L;
L.transitions = {};

L.transitions.instant = {};

L.transitions.instant.play = function(lastScene, nextScene, callback)
{
    if (lastScene.exit) {
	lastScene.exit();
    }
    if (callback) {
	callback(nextScene);
    }

    L.system.currentScene = nextScene;
};




L.transitions.fadeToColor =
{
    lastScene: {},
    nextScreen: {},
    timer: 0,
    state: "start"
};
L.transitions.fadeToColor.play = function(lastScene, nextScene, fadeOut, pause, fadeIn, color, callback)
{
    this.lastScene = lastScene;
    this.nextScene = nextScene;
    this.camera = lastScene.camera;
    this.currentScene = lastScene;
    this.activeLayer = lastScene.activeLayer;
    this.fadeOut = fadeOut;
    this.pause = pause;
    this.fadeIn = fadeIn;
    this.timer = fadeOut;
    this.state = "start";
    this.color = color || "#000000";
    this.callback = callback || function() {
    };
    L.system.currentScene = this;


};

L.transitions.fadeToColor.update = function(dt)
{
    switch (this.state)
    {
	case "start":
	    this.timer = this.fadeOut;
	    this.lastScene.update(dt);
	    this.state = "fadeOut";
	    break;
	case "fadeOut":
	    this.timer -= dt;
	    this.lastScene.update(dt);
	    if (this.timer <= 0)
	    {
		this.timer = this.pause;
		this.callback(this.nextScene);
		this.state = "pause";
	    }
	    break;
	case "pause":
	    this.timer -= dt;
	    if (this.timer <= 0)
	    {
		this.camera = this.nextScene.camera;
		this.timer = this.fadeIn;
		this.state = "fadeIn";
	    }
	    break;
	case "fadeIn":
	    this.timer -= dt;
	    this.nextScene.update(dt);
	    if (this.timer <= 0)
	    {
		L.system.currentScene = this.nextScene;
	    }
	    break;
	default:
	    alert("Hey!");
	    break;
    }
};

L.transitions.fadeToColor.draw = function()
{
    switch (this.state)
    {
	case "start":
	case "fadeOut":
	    this.lastScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1 - this.timer / this.fadeOut;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "pause":
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "fadeIn":
	    this.nextScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = this.timer / this.fadeIn;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	default:
	    alert("hey!");
	    break;

    }
};