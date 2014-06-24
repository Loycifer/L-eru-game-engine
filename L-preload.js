/*
 * Monkeypatches. Ook ook.
 */

//window.performance.now() polyfill
if (!window.performance)
{
    window.performance = {};
}

if (!window.performance.now)
{
    window.performance.now = function() {
	return Date.now();
    };
}

//Array extended methods
//Array.prototype.copy = function()
//{
//    return this.slice(0);
//};
//
//Array.prototype.copy2 = function()
//{
//    var length = this.length;
//    var arrayCopy = [];
//    for (var i = 0; i < length; i++)
//    {
//	if (this[i].isArray)
//	{
//	    arrayCopy[i] = this[i].copy2();
//	}
//    }
//    return arrayCopy.slice(0);
//};

Array.prototype.mapQuick = function(callback)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	callback(this[i], i);
    }
    //return this;
};

Array.prototype.sortBy = function(sorter, order)
{
    var length = this.length;
    if (order === undefined)
    {
	order = 1;
    }

    for (var i = 0; i < length; i++)
    {
	if (this[i] instanceof Array)
	{
	    this[i].sortBy(sorter, order);
	}
    }

    this.sort(function(a, b) {
	var current = +a[sorter];
	var next = +b[sorter];
	return order * (current - next);
    });
};

Array.prototype.getRandomElement = function()
{
    return Math.floor(Math.random() * this.length);
};

Array.prototype.removeElement = function(element)
{
    alert(2);
    var targetIndex = this.indexOf(element);

    if (targetIndex !== -1)
    {
	alert("removed " + this[targetIndex]);
	this.splice(targetIndex, 1);
    }
    return this;
};

Array.prototype.draw = function(targetContext)
{
    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i] && this[i].draw)
	{
	    this[i].draw(targetContext);
	}
    }
};

Array.prototype.update = function(dt)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i] && this[i].update)
	{
	    this[i].update(dt);
	}
    }
};

Array.prototype.handleClick = function(mouseX, mouseY)
{
    var length = this.length;

    for (var i = length - 1; i >= 0; i--)
    {

	if (this[i].handleClick && this[i].handleClick(mouseX, mouseY))
	{
	    return true;
	}
    }
};
/*
 Number.prototype.clamp = function(min, max) {
 return Math.min(Math.max(this, min), max);
 };

 Number.prototype.isBetween = function (min, max)
 {
 return (this === this.clamp(min,max));
 };

 */

//Math extended methods

Math.jordanCurve = function(x, y, vertices)
{

    var isInPoly = false;
    //var vertices = this.getVertices();
    var length = vertices.length;
    //alert(vertices);
    for (var i = 0, j = length - 1; i < length; j = i++)
    {
	if ((vertices[i][1] > y) !== (vertices[j][1] > y))
	{
	    if (x < ((vertices[j][0] - vertices[i][0]) * (y - vertices[i][1]) / (vertices[j][1] - vertices[i][1]) + vertices[i][0]))
	    {
		isInPoly = !isInPoly;
	    }

	}
    }
    return isInPoly;
};

Math.degToRad = function(deg)
{
    return (deg * (Math.PI / 180));
};

Math.radToDeg = function(rad)
{
    return (rad * (180 / Math.PI));
};

Math.vectorX = function(speed, direction)
{
    switch (direction)
    {
	case 0:
	    return speed;
	    break;
	case 180:
	    return -speed;
	    break;
	case 90:
	case -90:
	    return 0;
	    break;
	default:
	    return Math.cos(Math.degToRad(direction)) * speed;
	    break;
    }
};

Math.vectorY = function(speed, direction)
{
    switch (direction)
    {
	case 0:
	case 180:
	    return 0;
	    break;
	case 90:
	    return -speed;
	    break;
	case -90:
	    return speed;
	    break;
	default:
	    return Math.sin(Math.degToRad(direction)) * speed;
	    break;
    }
};

Math.Vector = function(magnitude, direction)
{
    this.magnitude = magnitude;
    this.direction = direction;
};

Math.Vector.prototype.addVector = function(vector)
{
    var d1 = Math.degToRad(this.direction);
    var d2 = Math.degToRad(vector.direction);

    var x1 = Math.cos(d1) * this.magnitude;
    var x2 = Math.cos(d2) * vector.magnitude;

    var y1 = -Math.sin(d1) * this.magnitude;
    var y2 = -Math.sin(d2) * vector.magnitude;

    var adj = x1 + x2;
    var opp = y1 + y2;

    var newDirection = Math.atan(opp / adj);
    var newMagnitude = Math.sqrt((Math.pow(adj, 2) + Math.pow(opp, 2)));

    this.magnitude = newMagnitude;
    this.direction = newDirection;
};
