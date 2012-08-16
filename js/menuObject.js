/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

MenuObject = function(args) 
{	
    this.name = args.name;
    this.visible = args.visible !== undefined ? args.visible : true;
    this.xLoc = args.xLoc;
    this.yLoc = args.yLoc;	
    this.canvasObjs = [];		
}

MenuObject.prototype.clearObjects = function ()
{
    this.canvasObjs = [];
}

MenuObject.prototype.addObject = function(ctx, objType, args)
{
    if (ctx && objType)
    {
		var tmpObj;
		var index = -1;
		
		for (var i = 0; i < this.canvasObjs.length; i++)
		{
			if (this.canvasObjs[i].name === args.name)
			{
				index = i;
				break;
			}					
		}
		
		if (index !== -1)
		{
			this.canvasObjs[index].update(args);	
		}	
		else
		{	
			switch(objType)
			{
			    case "button":
				tmpObj = new ButtonObject(ctx, args);
				if (tmpObj)
				    this.canvasObjs.push(tmpObj);
				break;
			    case "text":
				tmpObj = new TextObject(ctx, args);
				if (tmpObj)
				    this.canvasObjs.push(tmpObj);
				break;
			    case "image":
				tmpObj = new ImageObject(ctx, args);
				if (tmpObj)
				    this.canvasObjs.push(tmpObj);
				break;
			    case "shape":
				tmpObj = new ShapeObject(ctx, args);
				if (tmpObj)
				    this.canvasObjs.push(tmpObj);
				break;
				default:
				console.log("Error: Unknown object type = " + objType);
				break;			
			}
		}
    }
    if (tmpObj)
		return this.canvasObjs[this.canvasObjs.length - 1];
	else if (index > -1)
		return this.canvasObjs[index];
}

MenuObject.prototype.addIconGrid = function(iconNames, iconImages, iconWidth, iconHeight, spacer, minXSpace, gridYPosition)
{	
    var iconsPerRow = Math.floor((screenWidth - (minXSpace * 2)) / (iconWidth + spacer));
    var iconsPerRow = iconsPerRow > iconImages.length ? iconImages.length : iconsPerRow;  
    var iconXPosition = iconsPerRow > 1 ? ( (screenWidth) - (iconsPerRow * (iconWidth + spacer)) ) / 2 : (screenWidth / 2) - (iconWidth / 2);
    var iconYPosition = gridYPosition; 
    var firstIconXPosition = iconXPosition;	

    for (var i = 0; i < iconImages.length; i++)	
    {
		this.addObject(buttonCtx, "button", {"name" : iconNames[i], "image": iconImages[i], "xLoc" : iconXPosition, "yLoc" : iconYPosition, "width" : iconWidth, "height" : iconHeight} );		
	
		iconXPosition += (iconWidth + spacer);
	
		if ((i + 1) % iconsPerRow === 0)
		{
		    iconYPosition += (iconHeight + spacer);
		    iconXPosition = firstIconXPosition;
		}					
    }	
}

function addBackButton(menuObj, xLoc, yLoc, width, height)
{
    menuObj.addObject(buttonCtx, "button", {"name" : "back", "image": images.home, "xLoc" : xLoc, "yLoc" : yLoc, "width" : width, "height" : height, "shadowOffsetX" : 0, "shadowOffsetY" : 0,	
	    "shadowBlur" : 12,	"shadowColor" : "black",
	    "onClick" : function(){switchMenu(mainMenu); send({"type": "command","command": "app_change","key_id": "mainMenu"});}
	    });
}

MenuObject.prototype.drawMenu = function()
{
    if (this.visible != false)
    {		
	    clearCanvas();
	    for (var canvObjIter = 0; canvObjIter < this.canvasObjs.length; canvObjIter++)			
	    {
			if (this.canvasObjs[canvObjIter].visible != false)
			{
				if (this.canvasObjs[canvObjIter].largeShadow)
				    this.canvasObjs[canvObjIter].drawLargeShadow();
				else
				    this.canvasObjs[canvObjIter].drawObj();
			}
	    }
    }
}

MenuObject.prototype.editText= function(objName, newData)
{
    for (var i = 0; i < this.canvasObjs.length; i++)
    {
		if (this.canvasObjs[i].name === objName)
		{
		    this.canvasObjs[i].text = newData;
		    i = this.canvasObjs.length;
		}
    }	
}

MenuObject.prototype.getObj= function(objName)
{
    for (var i = 0; i < this.canvasObjs.length; i++)
    {
		if (this.canvasObjs[i].name === objName)
		{
		    return this.canvasObjs[i];
		}
    }	
}
