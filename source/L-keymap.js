var L;
L.input = {};
L.keyboard = L.input;
L.keyboard.keyCodeFromString = function(string)
{
    var upString = string.toUpperCase().replace(" ", "");
    if (upString.match(/^[A-Z0-9]$/))
    {
	return upString.charCodeAt(0);
    }

    if (upString.indexOf("NUMPAD") === 0)
    {
	return 96 + parseInt(upString.charAt(upString.length - 1));
    }

    if (upString.indexOf("F") === 0)
    {
	return 111 + parseInt(upString.replace("F", ""));
    }

    switch (upString)
    {
	case "ANY":
	case "ALL":
	    return 0;
	    break;

	case "MULTIPLY":
	    return 106;
	    break;

	case "ADD":
	    return 107;
	    break;

	case "ENTER":
	    return 13;
	    break;

	case "SUBTRACT":
	    return 109;
	    break;

	case "DECIMAL":
	    return 110;
	    break;

	case "DIVIDE":
	    return 111;
	    break;

	case "BACKSPACE":
	case "BACK":
	    return 8;
	    break;

	case "TAB":
	    return 9;
	    break;

	case "SHIFT":
	    return 16;
	    break;

	case "CONTROL":
	case "CTRL":
	    return 17;
	    break;

	case "CAPS":
	case "CAPSLOCK":
	    return 20;
	    break;

	case "ESC":
	case "ESCAPE":
	    return 27;
	    break;

	case "SPACE":
	case "SPACEBAR":
	    return 32;
	    break;

	case "PGUP":
	case "PAGEUP":
	    return 33;
	    break;

	case "PGDN":
	case "PAGEDOWN":
	    return 34;
	    break;

	case "END":
	    return 35;
	    break;

	case "HOME":
	    return 36;
	    break;

	case "LEFT":
	case "LEFTARROW":
	    return 37;
	    break;

	case "UP":
	case "UPARROW":
	    return 38;
	    break;

	case "RIGHT":
	case "RIGHTARROW":
	    return 39;
	    break;

	case "DOWN":
	case "DOWNARROW":
	    return 40;
	    break;

	case "INSERT":
	    return 45;
	    break;

	case "DELETE":
	    return 46;
	    break;

	case "NUMLOCK":
	    return 144;
	    break;

	case "SCRLK":
	case "SCROLLLOCK":
	    return 145;
	    break;

	case "PAUSE":
	case "PAUSEBREAK":
	    return 19;
	    break;

	case ";":
	case ":":
	    return 186;
	    break;

	case "=":
	case "+":
	    return 187;
	    break;

	case "-":
	case "_":
	    return 198;
	    break;

	case "/":
	case "?":
	    return 191;
	    break;

	case "~":
	case "`":
	    return 192;
	    break;

	case "[":
	case "{":
	    return 219;
	    break;

	case "\\":
	case "|":
	case "BACKSLASH":
	    return 220;
	    break;

	case "]":
	case "}":
	    return 221;
	    break;

	case "'":
	case '"':
	case "QUOTE":
	case "QUOTES":
	    return 222;
	    break;

	case ",":
	case "<":
	    return 188;
	    break;

	case ".":
	case ">":
	    return 190;
	    break;

	default:
	    alert("'" + string + "' is not a valid key identifier.");
	    break;
    }
};

L.keyboard.state = [];

L.keyboard.isKeyDown = function(keyString)
{
    var keyboard = L.keyboard;
    var keyCode = keyboard.keyCodeFromString(keyString);
    return (keyboard.state.indexOf(keyCode) !== -1);

};

L.keyboard.clearState = function()
{
    L.keyboard.state.length = 0;
};

L.keyboard.Keymap = function()
{
    this.bindings = {};
};

L.keyboard.Keymap.prototype.doKeyDown = function(event)
{
    var keyCode = event.keyCode;
    var bindings = this.bindings;
    var keyboard = L.keyboard;
    if (keyboard.state.indexOf(keyCode) === -1)
    {
	keyboard.state.push(keyCode);
    }
    if (bindings[keyCode] && bindings[keyCode]["keydown"])
    {
	bindings[keyCode]["keydown"]();
    }
    else if (bindings[0] && bindings[0]["keydown"])
    {
	bindings[0]["keydown"]();
    }
};

L.keyboard.Keymap.prototype.doKeyUp = function(event)
{
    var keyCode = event.keyCode;
    var bindings = this.bindings;
    var keyboard = L.keyboard;
    var indexOfKeyCode = keyboard.state.indexOf(keyCode);
    if (indexOfKeyCode !== -1)
    {
	keyboard.state.splice(indexOfKeyCode, 1);
    }
    if (bindings[keyCode] && bindings[keyCode]["keyup"])
    {
	bindings[keyCode]["keyup"]();
    }
    else if (bindings[0] && bindings[0]["keyup"])
    {
	bindings[0]["keyup"]();
    }
};

L.keyboard.Keymap.prototype.bindKey = function(key, event, callback)
{
    this.bindKeyCode(L.input.keyCodeFromString(key), event, callback);
};

L.keyboard.Keymap.prototype.bindKeyCode = function(keyCode, event, callback)
{
    if (!this.bindings[keyCode])
    {
	this.bindings[keyCode] = {};
    }
    this.bindings[keyCode][event.toLowerCase()] = callback;
};