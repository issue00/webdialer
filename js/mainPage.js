/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var phoneNumberTextTemplate = {"font" : "bold 40pt Arial", "lineWidth" : 2.5, "fillStyle" : "black", "strokeStyle" : "white", "textAlign" : "center",  "textBaseline" : "middle",
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 32, "shadowColor" : "rgba(0,100,150, 0.6)"};	


var sideTextTemplate = {"font" : "bold 40pt Arial", "lineWidth" : 2.5, "fillStyle" : "grey", "strokeStyle" : "white", "textAlign" : "center",  "textBaseline" : "middle",
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 52, "shadowColor" : "rgba(0, 0, 110, 1.0)"};	

function addButtonGrid (gridX, gridY, gridWidth, gridHeight)
{		
    var spacer = 5;
    var iconWidth = ((gridWidth - (spacer * 4)) / 3);
    var iconHeight = ((gridHeight - (spacer * 6)) / 5);

    var iconXPosition = gridX + spacer; 
    var iconYPosition = gridY + spacer; 
    var firstIconXPosition = iconXPosition;	
    var buttonNum = 1;
    var buttonText = "";

    for (var i = 0; i < 12; i++)	
    {   
	if (buttonNum > 9) 	
	{
	    switch (buttonNum)
	    {
		case 10: 
		    buttonText = "*";
		    break;
		case 11: 
		    buttonText = "0";
		    break;
		case 12: 
		    buttonText = "#";
		    break;
	    }
	}
	else
	    buttonText = buttonNum.toString();

	var button = mainPage.addObject(buttonCtx, "button", {"name" : buttonText, "image": images.numberButton, "text" : buttonText, "textTemplate" : buttonTextTemplate, "xLoc" : iconXPosition, 
		"yLoc" : iconYPosition, "width" : iconWidth, "height" : iconHeight} );		

	button.onClick = function(){			    
	    mainPage.getObj("textArea").textObj.text += this.name;
	    mainPage.drawMenu();				
	};

	iconXPosition += (iconWidth + spacer);

	if ((i + 1) % 3 === 0)
	{
	    iconYPosition += (iconHeight + spacer);
	    iconXPosition = firstIconXPosition;
	}				

	buttonNum += 1;	
    }	

    buttonNum = 13;
    button = mainPage.addObject(buttonCtx, "button", {"name" : "del", "image": images.deleteButton, "icon": images.deleteIcon, "iconWidth" : iconHeight * 0.9, "iconHeight" : iconHeight * 0.9, 
	    "xLoc" : iconXPosition, "yLoc" : iconYPosition, "width" : iconWidth, "height" : iconHeight} );
    iconXPosition += (iconWidth + spacer);
    button.onClick = function(){			    
	mainPage.getObj("textArea").textObj.text = mainPage.getObj("textArea").textObj.text.slice(0,-1);
	mainPage.drawMenu();
    };			    	
    buttonNum = 14;    	
    button = mainPage.addObject(buttonCtx, "button", {"name" : "call", "image": images.callButton, "icon": images.callIcon, "iconWidth" : iconHeight * 0.9, "iconHeight" : iconHeight * 0.9, 
	    "xLoc" : iconXPosition, "yLoc" : iconYPosition, "width" : iconWidth * 2 + spacer, "height" : iconHeight} );

    button.onClick = function(){			    
	var dialNumber = mainPage.getObj("textArea").textObj.text;
	
	send({
		"api_namespace" : "tizen.ivi.dialer",
		"type": "method",
		"command": "dial_number",
		"number": dialNumber
		});								
	
	initCallPage("dialing");
	updateNumber(dialNumber);
	switchMenu(callPage);		
	currentState = "dialing";	    
	startTimer(callTime);
    };		
}

function initMainPage()
{
    var textAreaHeight = screenHeight / 4;
    var buttonPadWidth = screenWidth * 0.75;
    var buttonPadHeight = screenHeight - textAreaHeight - 60;

    addButtonGrid(20, textAreaHeight + 40, buttonPadWidth, buttonPadHeight);   
    mainPage.addObject(mainCtx, "image", {"name" : "textArea", "image": images.textArea, "text" : "", "textTemplate" : phoneNumberTextTemplate, "xLoc" : 20, "yLoc" : 20, "width" : buttonPadWidth, "height" : textAreaHeight} );	 

    mainPage.addObject(mainCtx, "image", {"name" : "buttonBG","image": images.buttonBG, "xLoc" : 20, "yLoc" : textAreaHeight + 40, "width" : buttonPadWidth, "height" : buttonPadHeight} );	

    var myobj = mainPage.addObject(mainCtx, "shape", {"name" : "optionsBG", "xLoc" : 40 + buttonPadWidth, "yLoc" : 0, "width" : (screenWidth * 0.25) - 60, "height" : screenHeight, 
	    "fillStyle" : "#51504F", "strokeStyle" : "#373736", "lineWidth" : 5})    


}
