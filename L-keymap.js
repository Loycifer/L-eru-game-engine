var L;
L.input = {};

L.input.keyCodeFromString = function(string)
{
    var upString = string.toUpperCase();
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
	case "MULTIPLY":
	    return 106;

	case "ADD":
	    return 107;

	case "ENTER":
	    return 13;

	case "SUBTRACT":
	    return 109;

	case "DECIMAL":
	    return 110;

	case "DIVIDE":
	    return 111;

	case "BACKSPACE":
	case "BACK":
	    return 8;

	case "TAB":
	    return 9;

	case "SHIFT":
	    return 16;

	case "CONTROL":
	case "CTRL":
	    return 17;

	case "CAPS":
	case "CAPSLOCK":
	case "CAPS LOCK":
	    return 20;

	case "ESC":
	case "ESCAPE":
	    return 27;

	case "SPACE":
	case "SPACEBAR":
	    return 32;

	case "PGUP":
	case "PAGEUP":
	case "PAGE UP":
	    return 33;

	case "PGDN":
	case "PAGEDOWN":
	case "PAGE DOWN":
	    return 34;

	case "END":
	    return 35;

	case "HOME":
	    return 36;

	case "LEFT":
	case "LEFTARROW":
	case "LEFT ARROW":
	    return 37;

	case "UP":
	case "UPARROW":
	case "UP ARROW":
	    return 38;

	case "RIGHT":
	case "RIGHTARROW":
	case "RIGHT ARROW":
	    return 39;

	case "DOWN":
	case "DOWNARROW":
	case "DOWN ARROW":
	    return 40;

	case "INSERT":
	    return 45;

	case "DELETE":
	    return 46;

	case "NUMLOCK":
	case "NUM LOCK":
	    return 144;

	case "SCRLK":
	case "SCROLLLOCK":
	case "SCROLL LOCK":
	    return 145;

	case "PAUSE":
	case "PAUSEBREAK":
	case "PAUSE BREAK":
	    return 19;

	case ";":
	case ":":
	    return 186;

	case "=":
	case "+":
	    return 187;

	case "-":
	case "_":
	    return 198;

	case "/":
	case "?":
	    return 191;
	    
	case "~":
	case "`":
	    return 192;
	    
	case "[":
	case "{":
	    return 219;
		    
		case "\"":
	case "|":
	case "BACKSLASH":
	    return 220;
	    
	case "]":
	case "}":
	    return 221;
	    
	case "'":
	case '"':
	case "QUOTE":
	case "QUOTES":
	    return 222;
	    
	case ",":
	case "<":
	    return 188;
	    
	case ".":
	case ">":
	    return 190;
	    
	default:
	    alert("'" + string + "' is not a valid key identifier.");
	    break;
    }
};

L.input.Keymap = function()
{
    this.bindings = {};
};

L.input.Keymap.prototype.doKeyDown = function(event)
{
    var keyCode = event.keyCode;
    if (this.bindings[keyCode])
    {
	this.bindings[keyCode]();
    }
};

L.input.Keymap.prototype.bindKey = function(key, callback)
{

};

L.input.Keymap.prototype.bindKeyCode = function(keyCode, callback)
{

};