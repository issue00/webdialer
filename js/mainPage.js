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
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 52, "shadowColor" : "rgba(0, 0, 110, 1.0)", "wordWrap" : true};	

var errorTextTemplate = {"font" : "bold 50px Arial", "lineWidth" : 2.5, "fillStyle" : "red", "strokeStyle" : "rgba(150, 0, 0, 1.0)", "textAlign" : "center",  "textBaseline" : "middle",
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 52, "shadowColor" : "rgba(0, 0, 0, 1.0)", "wordWrap" : true};	

var dialNumber = "";

function addDashes()
{   
    if (dialNumber.length === 10)
    {
	var number = mainPage.getObj("textArea").textObj.text
	    number = number.slice(0,3) + '-' + number.slice(3,6) + '-' + number.slice(6,10);
	mainPage.getObj("textArea").textObj.text = number;
    }   
    else
	mainPage.getObj("textArea").textObj.text = dialNumber;		
}

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
	    this.img = images.numberButtonActive;
	    dialNumber += this.name;
	    mainPage.getObj("textArea").textObj.text += this.name;	    
	    addDashes();	  
	    mainPage.drawMenu();				
	};

	button.onRelease = function() {
	    this.img = images.numberButton;
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
	this.img = images.deleteButtonActive;
	this.holdTimeOut = setTimeout(function() {dialNumber = ""; mainPage.getObj("textArea").textObj.text = ""; mainPage.drawMenu();}, 600);
	dialNumber = dialNumber.slice(0,-1);  
	mainPage.getObj("textArea").textObj.text = mainPage.getObj("textArea").textObj.text.slice(0,-1);
	addDashes();		  	    	
	mainPage.drawMenu();
    };

    button.onRelease = function() {
	clearTimeout(this.holdTimeOut);
	this.img = images.deleteButton;
	mainPage.drawMenu();
    };

    buttonNum = 14;    	
    button = mainPage.addObject(buttonCtx, "button", {"name" : "call", "image": images.callButton, "icon": images.callIcon, "iconWidth" : iconHeight * 0.9, "iconHeight" : iconHeight * 0.9, 
	    "xLoc" : iconXPosition, "yLoc" : iconYPosition, "width" : iconWidth * 2 + spacer, "height" : iconHeight} );

    button.onClick = function(){			    
	this.img = images.callButtonActive;
	try {
	    activeService.makeCall(dialNumber);
	} catch (err) {
	    console.log("Attempting to make call without an available modem");
	    return;
	}
	initCallPage("dialing");
	updateNumber(dialNumber);
	updateCallStateText("Dialing...");
	switchMenu(callPage);		
	currentState = "dialing";	
    };

    button.onRelease = function() {
	this.img = images.callButton;
	mainPage.drawMenu();
    };		
}

function initMainPage()
{
    var textAreaHeight = screenHeight / 4;
    var buttonPadWidth = screenWidth * 0.75;
    var buttonPadHeight = screenHeight - textAreaHeight - 60;
    errorTextTemplate.font = "bold " + ((screenHeight * 0.6) / 6) + "px Arial";

    addButtonGrid(20, textAreaHeight + 40, buttonPadWidth, buttonPadHeight);   
    mainPage.addObject(mainCtx, "image", {"name" : "textArea", "image": images.textArea, "text" : "", "textTemplate" : phoneNumberTextTemplate, "xLoc" : 20, "yLoc" : 20, "width" : buttonPadWidth, "height" : textAreaHeight} );	 

    mainPage.addObject(mainCtx, "image", {"name" : "buttonBG","image": images.buttonBG, "xLoc" : 20, "yLoc" : textAreaHeight + 40, "width" : buttonPadWidth, "height" : buttonPadHeight} );	

    var myobj = mainPage.addObject(mainCtx, "shape", {"name" : "optionsBG", "xLoc" : 40 + buttonPadWidth, "yLoc" : 0, "width" : (screenWidth * 0.25) - 60, "height" : screenHeight, 
	    "fillStyle" : "#51504F", "strokeStyle" : "#373736", "lineWidth" : 5});    

    var myobj = mainPage.addObject(mainCtx, "shape", {"name" : "optionsBG", "xLoc" : 40 + buttonPadWidth, "yLoc" : 0, "width" : (screenWidth * 0.25) - 60, "height" : screenHeight, 
	    "fillStyle" : "#51504F", "strokeStyle" : "#373736", "lineWidth" : 5});

    /************************************** Lock Screen Objects *************************************/

    var fog = mainPage.addObject(mouseCtx, "shape", {"name" : "fog", "xLoc" : 0, "yLoc" : 0, "zLoc" : 3, "width" : screenWidth, 
	    "height" : screenHeight, "fillStyle" : "rgba(100,100,100,0.7)", "visible" : noModems}); 

    var textBox = mainPage.addObject(mouseCtx, "shape", {"name" : "textBox", "rounded" : true, "xLoc" : screenWidth * 0.1, "yLoc" : screenHeight * 0.2, "zLoc" : 4, "width" : screenWidth * 0.8, 
	    "height" : screenHeight * 0.6, "fillStyle" : "white", "strokeStyle" : "#85322A", "lineWidth" : 35, "visible" : noModems, "text" : "No modems available!", "textTemplate" : errorTextTemplate});    

}
