/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

TextObject = function(ctx, args)
{
    /* General */
    this.name = args.name;
    this.type = "text";	
    this.text = args.text !== undefined? args.text : "";
    this.xLoc = args.xLoc;
    this.yLoc = args.yLoc;
    this.zLoc = args.zLoc == undefined ? 0 : args.zLoc;	
    this.width = args.width;
    this.height = args.height;
    this.lineHeight = args.lineHeight;
    this.wordWrap = args.wordWrap;
    this.drawVertical = args.drawVertical;
    this.largeShadow = args.largeShadow;
    this.ctx = ctx;
    this.visible = args.visible == undefined ? true : args.visible;
    this.onClick = undefined;		

    /* Text styles */
    this.font = args.font;
    this.fillStyle = args.fillStyle;
    this.lineWidth = args.lineWidth;
    this.strokeStyle = args.strokeStyle;
    this.textAlign = args.textAlign;
    this.textBaseline = args.textBaseline;
    this.shadowOffsetX = args.shadowOffsetX;
    this.shadowOffsetY = args.shadowOffsetY; 
    this.shadowBlur = args.shadowBlur;
    this.shadowColor = args.shadowColor;

    if (args.template)
	this.applyTemplate(args.template);
}

TextObject.prototype.update = function(args)
{
    /* General */
    if (args.name) {this.name = args.name;}      	
    if (args.text) {this.text = args.text;}
    if (args.xLoc) {this.xLoc = args.xLoc;}
    if (args.yLoc) {this.yLoc = args.yLoc;}
    if (args.zLoc) {this.zLoc = args.zLoc;}	
    if (args.width) {this.width = args.width;}
    if (args.lineHeight) {this.height = args.lineHeight;}
    if (args.lineHeight) {this.lineHeight = args.lineHeight;}
    if (args.wordWrap) {this.wordWrap = args.wordWrap;}
    if (args.drawVertical) {this.drawVertical = args.drawVertical;}
    if (args.largeShadow) {this.largeShadow = args.largeShadow;}
    if (args.ctx) {this.ctx = ctx;}
    if (args.visible != undefined) {this.visible = args.visible;}
    if (args.onClick) {this.onClick = args.onClick;}		

    /* Text styles */
    if (args.font) {this.font = args.font;}
    if (args.fillStyle) {this.fillStyle = args.fillStyle;}
    if (args.lineWidth) {this.lineWidth = args.lineWidth;}
    if (args.strokeStyle) {this.strokeStyle = args.strokeStyle;}
    if (args.textAlign) {this.textAlign = args.textAlign;}
    if (args.textBaseline) {this.textBaseline = args.textBaseline;}
    if (args.shadowOffsetX) {this.shadowOffsetX = args.shadowOffsetX;}
    if (args.shadowOffsetY) {this.shadowOffsetY = args.shadowOffsetY;} 
    if (args.shadowBlur) {this.shadowBlur = args.shadowBlur;}
    if (args.shadowColor) {this.shadowColor = args.shadowColor;}

    if (args.template)
	this.applyTemplate(args.template);
}

TextObject.prototype.drawObj = function()
{
    if (this.visible)
    {		
	this.ctx.save();

	this.ctx.font = this.font;
	this.ctx.fillStyle = this.fillStyle;
	this.ctx.lineWidth = this.lineWidth ;
	this.ctx.strokeStyle = this.strokeStyle;
	this.ctx.textAlign = this.textAlign;
	this.ctx.textBaseline = this.textBaseline;
	this.ctx.shadowOffsetX = this.shadowOffsetX;   
	this.ctx.shadowOffsetY = this.shadowOffsetY;   
	this.ctx.shadowBlur = this.shadowBlur;   
	this.ctx.shadowColor = this.shadowColor;   

	if (this.drawVertical)
	{
	    var nextChar;
	    var tmpStr = this.text;
	    var vertYLoc = this.yLoc;
	    for (var i = 0; i < this.text.length; i++)
	    {
		nextChar = tmpStr.charAt(0);
		if (this.fillStyle)
		    this.ctx.fillText(nextChar, this.xLoc, vertYLoc);  	

		if (this.strokeStyle)
		    this.ctx.strokeText(nextChar, this.xLoc, vertYLoc);

		vertYLoc += 110;	
		tmpStr = tmpStr.slice(1);							
	    }
	}
	else if (this.wordWrap)
	    this.wrapText();
	else
	{
	    if (this.fillStyle)
		this.ctx.fillText(this.text, this.xLoc, this.yLoc);  	

	    if (this.strokeStyle)
		this.ctx.strokeText(this.text, this.xLoc, this.yLoc);	
	}	

	this.ctx.restore();
    }
}

TextObject.prototype.applyTemplate = function(template)
{
    this.font = template.font;
    this.fillStyle = template.fillStyle;
    this.lineWidth = template.lineWidth;
    this.strokeStyle = template.strokeStyle;
    this.textAlign = template.textAlign;
    this.textBaseline = template.textBaseline;
    this.largeShadow = template.largeShadow;
    this.shadowOffsetX = template.shadowOffsetX;
    this.shadowOffsetY = template.shadowOffsetY;
    this.shadowBlur = template.shadowBlur;
    this.shadowColor = template.shadowColor;
    this.drawVertical = template.drawVertical !== undefined ? template.drawVertical : undefined;
    this.wordWrap = template.wordWrap !== undefined ? template.wordWrap : undefined;
}

TextObject.prototype.drawLargeShadow = function() 
{
    var origX = this.shadowOffsetX;
    var origY = this.shadowOffsetY;

    this.shadowOffsetX = this.largeShadow;   
    this.shadowOffsetY = 0;
    this.drawObj();
    this.shadowOffsetY = this.largeShadow;
    this.drawObj();
    this.shadowOffsetX = 0;   
    this.drawObj();
    this.shadowOffsetX = -this.largeShadow;   
    this.drawObj();
    this.shadowOffsetY = 0;
    this.drawObj();	 
    this.shadowOffsetY = -this.largeShadow;
    this.drawObj();
    this.shadowOffsetX = -0;   
    this.drawObj();
    this.shadowOffsetX = -this.largeShadow;   
    this.drawObj();

    this.shadowOffsetX = origX;
    this.shadowOffsetY = origY;	   	   	   
}

TextObject.prototype.wrapText = function()
{
    var words = this.text.split(" ");
    var line = "";
    var tmpYloc = this.yLoc;

    for(var i = 0; i < words.length; i++) 
    {
	var testLine = line + words[i] + " ";
	var metrics = this.ctx.measureText(testLine);
	var testWidth = metrics.width;
	if(testWidth > this.width) 
	{
	    if (this.fillStyle)
		this.ctx.fillText(line, this.xLoc, tmpYloc);  	

	    if (this.strokeStyle)
		this.ctx.strokeText(line, this.xLoc, tmpYloc);	

	    var pxLoc = this.font.search("px");
	    var fsStart = pxLoc;
	    var fontSize = 0;

	    while (pxLoc > 0 && this.font[fsStart] !== ' ')
		fsStart--;

	    if (fsStart !== 0)
		fsStart++;

	    while (fsStart != pxLoc)
	    {
		fontSize += this.font[fsStart];
		fsStart++;
	    }

	    fontSize = Number(fontSize);
	    line = words[i] + " ";
	    tmpYloc += fontSize;
	    this.height += fontSize;
	}
	else 
	{
	    line = testLine;
	}
    }

    if (this.fillStyle)
	this.ctx.fillText(line, this.xLoc, tmpYloc);  	

    if (this.strokeStyle)
	this.ctx.strokeText(line, this.xLoc, tmpYloc);	
}
