/* global L*/

/**
 *
 * A namespace for keyboard controls
 * @namespace L.keyboard
 */
L.keyboard = {};

/**
 * In place for backwards compatibility
 * @deprecated
 * @type @exp;L@pro;keyboard
 */
L.input = L.keyboard;

/**
 *
 * Takes a string representing a keyboard button and resturns the corresponding key code.
 * @function
 * @param {string} keyString
 * @returns {Number} Keyboard keycode
 */
L.keyboard.keyCodeFromString = function(keyString)
{
    var upString = keyString.toUpperCase().replace(" ", "");
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
	    alert("'" + keyString + "' is not a valid key identifier.");
	    break;
    }
};

/**
 * Holds an array of pressed keyboard buttons
 * @type Array
 */
L.keyboard.state = [];


/**
 * Checks L.keyboard.state to see if a specific key is down
 * @function
 * @param {type} keyString
 * @returns {Boolean}
 */
L.keyboard.isKeyDown = function(keyString)
{
    var keyboard = L.keyboard;
    var keyCode = keyboard.keyCodeFromString(keyString);
    return (keyboard.state.indexOf(keyCode) !== -1);

};

/**
 * Resets the state of the keyboard, unpressing all buttons
 * @function
 * @returns {L.keyboard}
 */
L.keyboard.reset = function()
{
    L.keyboard.state.length = 0;
    return this;
};

/**
 * Creates a Keymap instance, a keyboard control scheme
 * @constructor
 * @returns {L.keyboard}
 */
L.keyboard.Keymap = function()
{
    this.bindings = {};
    return this;
};

/**
 * This method is called by keymap's parent scene on a keydown event
 * @method
 * @param {event} event
 */
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

/**
 * This method is called by keymap's parent scene on a keyup event
 * @method
 * @param {event} event
 */
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

/**
 * Binds a function to the keyup or keydown event of a keyboard key, specified by name
 * @method
 * @param {string} key
 * @param {string} event
 * @param {function} callback
 * @returns {L.keyboard.Keymap}
 */
L.keyboard.Keymap.prototype.bindKey = function(key, event, callback)
{
    this.bindKeyCode(L.input.keyCodeFromString(key), event, callback);
    return this;
};

/**
 * Binds a function to the keyup or keydown event of a keyboard key, specified by key code
 * @method
 * @param {number} keyCode
 * @param {string} event
 * @param {function} callback
 * @returns {L.keyboard.Keymap}
 */
L.keyboard.Keymap.prototype.bindKeyCode = function(keyCode, event, callback)
{
    if (!this.bindings[keyCode])
    {
	this.bindings[keyCode] = {};
    }
    this.bindings[keyCode][event.toLowerCase()] = callback;
    return this;
};