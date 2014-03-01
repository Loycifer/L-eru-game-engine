/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



Array.prototype.mapQuick = function(callback)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	callback(this[i], i);
    }
    //return this;
};

Array.prototype.sortBy = function(sorter)
{
    var sortBy = sorter;
    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i] instanceof Array)
	{
	    this[i].sortBy(sortBy);
	}
    }

    this.sort(function(a, b) {

	return a[sortBy] - b[sortBy];


    });
};

Array.prototype.draw = function(targetContext)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i].draw)
	{
	    this[i].draw(targetContext);
	}
    }
    //return this;
};
Array.prototype.update = function()
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i].update)
	{
	    this[i].update();
	}
    }
    //return this;
};
Array.prototype.isClicked = function(mouseX, mouseY)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	
	this[i].isClicked(mouseX, mouseY);
    }
    //return this;
};

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

Number.prototype.isBetween = function (min, max)
{
  return (this === this.clamp(min,max));  
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
