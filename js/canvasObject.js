/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var cancelAudioGlowInterval = undefined;

function objectsAtLocation(pageObj, xLoc, yLoc)
{	
    var currItem;
    var prevItem;

    for (i = 0; i < pageObj.canvasObjs.length; i++)
    {
		if (pageObj.canvasObjs[i] != undefined && pageObj.canvasObjs[i].visible != false)
		{
		    currItem = pageObj.canvasObjs[i];
		    
		     if (xLoc > currItem.xLoc && xLoc < (currItem.xLoc + currItem.width))
			 {
				if (yLoc > currItem.yLoc && yLoc < (currItem.yLoc + currItem.height))
				{	    	    
		    		if (prevItem == undefined || (currItem.ctx.canvas.style.zIndex > prevItem.ctx.canvas.style.zIndex) || 
		    		((currItem.ctx.canvas.style.zIndex === prevItem.ctx.canvas.style.zIndex) && (currItem.zLoc > prevItem.zLoc)))
		    			prevItem = currItem;
		    	}
		   }
		}
    }
	if (prevItem)
		return prevItem;
		
    return undefined;
}

function clearCanvas()
{
    buttonCtx.clearRect(0,0, screenWidth, screenHeight);
    mainCtx.clearRect(0,0, screenWidth, screenHeight);   
}

function drawRoundedRectangle(ctx, xLoc, yLoc, width, height, cornerRadius, strokeStyle, fillStyle, lineWidth)
{
	ctx.save();
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.moveTo(xLoc + cornerRadius, yLoc);
	ctx.lineTo(xLoc + width - cornerRadius, yLoc);
	ctx.quadraticCurveTo(xLoc + width, yLoc, xLoc + width, yLoc + cornerRadius);
	ctx.lineTo(xLoc + width, yLoc + height - cornerRadius);
	ctx.quadraticCurveTo(xLoc + width, yLoc + height, xLoc + width - cornerRadius, yLoc + height);
	ctx.lineTo(xLoc + cornerRadius, yLoc + height);
	ctx.quadraticCurveTo(xLoc, yLoc + height, xLoc, yLoc + height - cornerRadius);
	ctx.lineTo(xLoc, yLoc + cornerRadius);
	ctx.quadraticCurveTo(xLoc, yLoc, xLoc + cornerRadius, yLoc);
	ctx.closePath();
  	ctx.stroke();
  	ctx.fill();
	ctx.restore();
}
