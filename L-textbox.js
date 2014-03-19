var L;
L.objects.Textbox = function(text, options)
{
  this.text = text || "Textbox";
  this.x = 0;
  this.y = 0;
  this.alpha = 1;
  
  this.color = "#000000";
  this.wrap = false;
  this.alignment = 'left';
};

L.objects.Textbox.prototype.draw = function(layer)
{
  this.autoDraw(layer);  
  
};

L.objects.Textbox.prototype.autoDraw = function(layer)
{
   
    layer.globalAlpha = this.alpha;
    layer.fillStyle = this.color;
    layer.font = "30px Times";
    layer.fillText(this.text, this.x, this.y);
};

