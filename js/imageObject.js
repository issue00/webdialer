/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

ImageObject = function(ctx, args)
{
    /* General */
    this.name = args.name;
    this.type = "image";
    this.img = args.image;
    this.xLoc = args.xLoc;
    this.yLoc = args.yLoc;
    this.zLoc = args.zLoc == undefined ? 0 : args.zLoc;
    this.width = args.width;
    this.height = args.height;    
    this.ctx = ctx;
    this.textObj = args.text !== undefined ? new TextObject(this.ctx,{"text" : args.text, "xLoc" : (this.xLoc + (this.width / 2)), "yLoc" : (this.yLoc + (this.height / 2)), "zLoc" : (this.zLoc + 1), "template" : args.textTemplate}) : undefined;
    this.visible = args.visible == undefined ? true : args.visible;
    this.onClick = undefined;		

    /* Img shadow styles */
    this.imgShadowOffsetX = args.imgShadowOffsetX;
    this.imgShadowOffsetY = args.imgShadowOffsetY  
	this.imgShadowBlur = args.imgShadowBlur;
    this.imgShadowColor = args.imgShadowColor;  
}

ImageObject.prototype.update = function(args)
{
    if (args.name) {this.name = args.name;}    
    if (args.img) {this.img = args.img;}
    if (args.xLoc) {this.xLoc = args.xLoc;}
    if (args.yLoc) {this.yLoc = args.yLoc;}
    if (args.zLoc) {this.zLoc = args.zLoc;}	
    if (args.width) {this.width = args.width;}
    if (args.height) {this.height = args.height;}

    if (args.ctx) {this.ctx = ctx;}
    if (args.text !== undefined) {this.textObj.update({"text" : args.text, "xLoc" : (args.xLoc + (args.width / 2)), "yLoc" : (args.yLoc + (args.height / 2)), "zLoc" : (args.zLoc + 1), "template" : args.textTemplate})}
    if (args.visible) {this.visible = args.visible;}
    if (args.onClick) {this.onClick = args.onClick;}	

    /* Img shadow styles */
    if (args.shadowOffsetX) {this.shadowOffsetX = args.shadowOffsetX;}
    if (args.shadowOffsetY) {this.shadowOffsetY = args.shadowOffsetY;} 
    if (args.shadowBlur) {this.shadowBlur = args.shadowBlur;}
    if (args.shadowColor) {this.shadowColor = args.shadowColor;}
}

ImageObject.prototype.drawObj = function()
{
    if (this.visible)
    {				
	this.ctx.drawImage(this.img, this.xLoc, this.yLoc, this.width, this.height);	

	if (this.textObj != undefined)
	    this.textObj.drawObj();				
    }
}
