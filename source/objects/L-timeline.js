var L;
L.objects.Timeline = function()
{
    this.paused = true;
    this.timer = 0;
    this.eventList = [];
    this.nextEvent = 0;
    this.preserveEvents = true;
    this.autoSort = true;
};

L.objects.Timeline.prototype.update = function(dt)
{
    if (!this.paused)
    {
	var eventListLength = this.eventList.length;
	this.timer += dt;
	while ((this.nextEvent < eventListLength) && (this.timer >= this.eventList[this.nextEvent][0]))
	{
	    this.eventList[this.currentEvent][1]();
	    this.nextEvent++;
	}
    }
};

L.objects.Timeline.prototype.addEvent = function(time, callback)
{
    var eventListLength = this.eventList.length;
    for (var i = 0; i < eventListLength; i++)
    {
	if (time > this.eventList[i][0])
	{
	    this.eventList.splice(i+1,0,[time, callback]);
	}
    }
    this.eventlist.push([time, callback]);

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
