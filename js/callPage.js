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

var incomingTextTemplate = {"font" : "bold 80pt Arial", "fillStyle" : "white", "textAlign" : "center",  "textBaseline" : "middle",
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 0, "shadowColor" : "rgba(0, 0, 0, 1.0)"};	

var callTimeTextTemplate = {"font" : "bold 30pt Arial", "fillStyle" : "white", "textAlign" : "left",  "textBaseline" : "top",
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 0, "shadowColor" : "rgba(0, 0, 0, 1.0)"};	

var startTime = 0;
var callTime = 0;
var timerInterval;

function updateNumber(number)
{
    currentNumber = number;

    if (number.length === 10)
    {
	number = number.slice(0,3) + '-' + number.slice(3,6) + '-' + number.slice(6,10);		
    }

    callPage.getObj("displayedNumber").text = number;		
}

function startTimer(timeText)
{
    var today = new Date();
    startTime = today.getTime();

    timerInterval = setInterval( function() {
	    var today = new Date();
	    var currentTime = today.getTime();
	    callTime = Math.floor((currentTime - startTime) / 1000);
	
		var hours = Math.floor(callTime / 3600);
		callTime -= hours * 3600;
		var mins = Math.floor(callTime / 60);
		var secs = callTime - (mins * 60) < 10 ? "0" + (callTime - (mins * 60)).toString() : (callTime - (mins * 60)).toString();
		
		hours = hours > 10 ? hours : "0" + hours.toString();
		mins = mins > 10 ? mins : "0" + mins.toString();
		
	    callPage.getObj("callTime").text = hours + ":" + mins + ":" + secs;		
	    callPage.drawMenu();
	    }, 1000);
}

function stopTimer()
{
    clearInterval(timerInterval);
}

function initCallPage(initState)
{	   
    if (initState == "dialing" || initState == "inCall")
	var buttonWidth = screenWidth * 0.6;
    else
	var buttonWidth = (screenWidth * 0.8) / 2;

    var buttonHeight = screenHeight * 0.15;


    var incomingBar = callPage.addObject(mainCtx, "shape", {"name" : "incomingBar", "xLoc" : -20, "yLoc" : screenHeight * 0.2, "width" : screenWidth + 40, 
	    "height" : screenHeight * 0.6, "fillStyle" : "#51504F", "strokeStyle" : "#B3BF3C", "lineWidth" : 5}); 

    var displayedNumber = callPage.addObject(mainCtx, "text", {"name" : "displayedNumber", "xLoc" : screenWidth / 2, "yLoc" : incomingBar.yLoc + incomingBar.height * 0.4, "width" : screenWidth * 0.75, 
	    "height" : screenHeight * 0.4, "text" : currentNumber, "template" : incomingTextTemplate});

    var clockIcon = callPage.addObject(mainCtx, "image", {"name" : "clock", "image": images.clockIcon, "xLoc" : screenWidth * 0.7, 
	    "yLoc" : incomingBar.yLoc + 30, "width" : 50, "height" : 50} );

    var callTime = callPage.addObject(mainCtx, "text", {"name" : "callTime", "xLoc" : clockIcon.xLoc + clockIcon.width + 10, "yLoc" : clockIcon.yLoc, "width" : screenWidth * 0.2, 
	    "height" : 100, "text" : "00:00:00", "template" : callTimeTextTemplate});

    var endCallButton;

    if (initState == "dialing" || initState == "inCall")
    {
	endCallButton = callPage.addObject(buttonCtx, "button", {"name" : "endCallButton", "image": images.incomingDeclineButton, "icon": images.endCallIcon, "iconWidth" : 100, "iconHeight" : 100, "xLoc" : screenWidth * 0.2, 
		"yLoc" : incomingBar.yLoc + incomingBar.height - buttonHeight - 50, "width" : buttonWidth, "height" : buttonHeight} );

	callPage.getObj("acceptCallButton").visible = false;												
    }
    else
    {
	acceptCallButton = callPage.addObject(buttonCtx, "button", {"name" : "acceptCallButton", "image": images.incomingAcceptButton, "icon": images.callIcon, "iconWidth" : 100, "iconHeight" : 100, "xLoc" : screenWidth * 0.1, 
		"yLoc" : incomingBar.yLoc + incomingBar.height - buttonHeight - 50, "width" : buttonWidth, "height" : buttonHeight, "visible" : true} );	

	endCallButton = callPage.addObject(buttonCtx, "button", {"name" : "endCallButton", "image": images.incomingDeclineButton, "icon": images.endCallIcon, "iconWidth" : 100, "iconHeight" : 100, 
		"xLoc" : acceptCallButton.xLoc + acceptCallButton.width + 20, "yLoc" : incomingBar.yLoc + incomingBar.height - buttonHeight - 50, "width" : buttonWidth, "height" : buttonHeight} );													
    }		

    endCallButton.onClick = function(){			    
	send({
		"api_namespace" : "tizen.ivi.dialer",
		"type": "method",
		"command": "hangup"					
		});	
	currentState = "idle";
	switchMenu(mainPage);			
	stopTimer();
    };
}




