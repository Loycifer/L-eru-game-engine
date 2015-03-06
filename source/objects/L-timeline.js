var L;
L.objects.Timeline = function()
{
    this.paused = true;
    this.timer = 0;
    this.length = 0;
    this.eventList = [];
    this.nextEvent = 0;
    this.preserveEvents = true;
    this.stopAfterEvent = 6;
    this.stopAtTime = 0;
};

L.objects.Timeline.prototype.update = function(dt)
{
    if (!this.paused)
    {
	var eventListLength = this.eventList.length;
	this.timer += dt;
	while ((this.nextEvent < eventListLength) && (this.timer >= this.eventList[this.nextEvent][0]))
	{
	    this.eventList[this.nextEvent][1]();
	    this.nextEvent++;
	    if (this.stopAfterEvent !== 0 && this.nextEvent > this.stopAfterEvent-1)
	    {
		this.paused=true;
	    }
	}
    }
};

L.objects.Timeline.prototype.addEvent = function(time, callback)
{
    var eventList = this.eventList;
    var eventListLength = this.eventList.length;
    if (eventListLength === 0 || eventList[eventListLength-1][0] <= time)
    {
	eventList.push([time, callback]);
	return this;
    }
    else
    {
	for (var i = eventListLength-1; i >= 0; i--)
	{
	    if (i === 0)
	    {
		eventList.unshift([time,callback]);
		return this;
	    }
	    if (time < eventList[i][0] && time >= eventList[i-1][0])
	    {
		eventList.splice(i,0,[time, callback]);
		return this;
	    }
	}
    }

};

L.objects.Timeline.prototype.play = function()
{
  this.paused = false;
};

L.objects.Timeline.prototype.pause = function()
{
  this.paused = true;
};

L.objects.Timeline.prototype.togglePause = function()
{
  this.paused = !this.paused;
};

L.objects.Timeline.prototype.reset = function()
{
  this.paused=true;
  this.timer = 0;
  this.nextEvent=0;

};