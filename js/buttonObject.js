/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

ButtonObject = function(ctx, args)
{
    /* General */
    this.name = args.name;
    this.keycode = args.keycode;
    this.type = "button";
    this.img = args.image;
    this.xLoc = args.xLoc;
    this.yLoc = args.yLoc;
    this.zLoc = args.zLoc == undefined ? 0 : args.zLoc;
    this.width = args.width;
    this.height = args.height;
    this.ctx = ctx;
    this.visible = args.visible == undefined ? true : args.visible;
    this.value = args.value;
    this.textObj = args.text !== undefined ? new TextObject(this.ctx,{"text" : args.text, "xLoc" : (this.xLoc + (this.width / 2)), "yLoc" : (this.yLoc + (this.height / 2)), "zLoc" : (this.zLoc + 1), "template" : args.textTemplate}) : undefined;
    this.icon = args.icon ? new ImageObject(this.ctx,{"name" : this.name + "Icon", "image" : args.icon, "xLoc" : (this.xLoc + ((this.width / 2) - (args.iconWidth / 2))), "yLoc" : (this.yLoc + (this.height / 2) - (args.iconHeight /2)), "zLoc" : (this.zLoc + 1), "width" : args.iconWidth, "height" : args.iconHeight, "template" : args.textTemplate}) : undefined;
    this.onClick = args.onClick;	
    this.onHold = args.onHold;
    this.onMove = args.onMove;

    /* Img shadow styles */
    this.shadowOffsetX = args.shadowOffsetX;
    this.shadowOffsetY = args.shadowOffsetY; 
    this.shadowBlur = args.shadowBlur;
    this.shadowColor = args.shadowColor;  
}

ButtonObject.prototype.update = function(args)
{
    if (args.name) {this.name = args.name;}
    if (args.keycode) {this.keycode = args.keycode;}
    if (args.img) {this.img = args.img;}   
    if (args.text) {this.textObj.update({"text" : args.text, "xLoc" : (args.xLoc + (args.width / 2)), "yLoc" : (args.yLoc + (args.height / 2)), "zLoc" : (args.zLoc + 1), "template" : args.textTemplate})}
    if (args.icon) {this.icon.update({"image" : args.icon, "xLoc" : (args.xLoc + ((args.width / 2) - (args.iconWidth / 2))), "yLoc" : (args.yLoc + (args.height / 2) - (args.iconHeight /2)), "zLoc" : (args.zLoc + 1), "width" : args.iconWidth, "height" : args.iconHeight, "template" : args.textTemplate})}
    if (args.xLoc) {this.xLoc = args.xLoc;}
    if (args.yLoc) {this.yLoc = args.yLoc;}
    if (args.zLoc) {this.zLoc = args.zLoc;}	
    if (args.width) {this.width = args.width;}
    if (args.height) {this.height = args.height;}
    if (args.ctx) {this.ctx = ctx;}
    if (args.visible) {this.visible = args.visible;}
    if (args.onClick) {this.onClick = args.onClick;}	
    if (args.onHold) {this.onHold = args.onHold;}	
    if (args.onMove) {this.onMove = args.onMove;}	

    /* Img shadow styles */
    if (args.shadowOffsetX) {this.shadowOffsetX = args.shadowOffsetX;}
    if (args.shadowOffsetY) {this.shadowOffsetY = args.shadowOffsetY;} 
    if (args.shadowBlur) {this.shadowBlur = args.shadowBlur;}
    if (args.shadowColor) {this.shadowColor = args.shadowColor;}
}

ButtonObject.prototype.drawObj = function()
{
    if (this.visible)
    {		
	this.ctx.save();

	this.ctx.shadowBlur = this.shadowBlur;   
	this.ctx.shadowColor = this.shadowColor;   
	this.ctx.shadowOffsetX = this.shadowOffsetX;   
	this.ctx.shadowOffsetY = this.shadowOffsetY;

	this.ctx.drawImage(this.img, this.xLoc, this.yLoc, this.width, this.height);

	this.ctx.restore();

	if (this.textObj != undefined)
	    this.textObj.drawObj();

	if (this.icon != undefined)
	    this.icon.drawObj();
    }
}

ButtonObject.prototype.addText = function(txt, template)
{
    this.textObj = new TextObject(this.ctx,{"text" : txt, "xLoc" : (this.xLoc + (this.width / 2)), "yLoc" : (this.yLoc + (this.height / 2)), "zLoc" : (this.zLoc + 1)});
    this.textObj.applyTemplate(template);	
}
