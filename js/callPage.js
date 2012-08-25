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

var callTimeTextTemplate = {"font" : "bold 40px Arial", "fillStyle" : "white", "textAlign" : "left",  "textBaseline" : "top",
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 0, "shadowColor" : "rgba(0, 0, 0, 1.0)"};

var startTime = 0;
var callTime = 0;
var timerInterval;
var stateText = " ";

function updateNumber(number)
{
    currentNumber = number;

    if (number.length === 10)
    {
	number = number.slice(0,3) + '-' + number.slice(3,6) + '-' + number.slice(6,10);		
    }

    callPage.getObj("displayedNumber").text = number;		
}

function updateCallStateText(newState)
{
    stateText = newState;
    var callStateTextObj = callPage.getObj("callStateText")
	callStateTextObj.text = newState;

    switch(newState)
    {
	case "Dialing..." :
	    callStateTextObj.fillStyle = "white";
	    callStateTextObj.strokeStyle = "grey";
	    callStateTextObj.shadowColor = "rgba(0,0,0,1.0)";
	    break;
	case "Incoming Call..." :
	    callStateTextObj.fillStyle = "red";
	    callStateTextObj.strokeStyle = "#B30000";
	    callStateTextObj.lineWidth = 1;
	    callStateTextObj.shadowColor = "rgba(200,0,0,0.7)";
	    break;
	case "Active" :
	    callStateTextObj.fillStyle = "#3CBF48";
	    callStateTextObj.strokeStyle = "green";
	    callStateTextObj.lineWidth = 1;
	    callStateTextObj.shadowColor = "rgba(0,200,0,0.7)";
	    break;		
    }

    callStateTextObj.shadowBlur = 30;	
}

function startTimer()
{
    var today = new Date();
    startTime = today.getTime();

    if (timerInterval)
	clearInterval(timerInterval);

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
    timerInterval = undefined;
    startTime = 0;
    callTime = 0;
}

function initButtons(initState)
{
    var incomingBar = callPage.getObj("incomingBar");

    if (initState == "dialing" || initState == "activeCall")
	var buttonWidth = screenWidth * 0.6;
    else
	var buttonWidth = (screenWidth * 0.8) / 2;

    var buttonHeight = screenHeight * 0.15;

    var endCallButton;

    if (initState == "dialing" || initState == "activeCall")
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

	acceptCallButton.onClick = function(){
	    try {
		console.log("Accepting call")
		    activeCall.accept();
	    } catch (err) {
		console.log("Failed to accept call");
	    }

	    currentState = "activeCall";		   	
	    initButtons("activeCall");
	    callPage.drawMenu();
	    activeCall.accept();
	};

    }		

    endCallButton.onClick = function(){			    
	try {
	    activeCall.end();
	} catch (err) {
	    console.log("Attempting to hangup a non-active call");
	}
	currentState = "idle";
	switchMenu(mainPage);			
	stopTimer();
    };

}

function initCallPage(initState)
{	   

    var incomingBar = callPage.addObject(mainCtx, "shape", {"name" : "incomingBar", "xLoc" : -20, "yLoc" : screenHeight * 0.2, "width" : screenWidth + 40, 
	    "height" : screenHeight * 0.6, "fillStyle" : "#51504F", "strokeStyle" : "#B3BF3C", "lineWidth" : 5}); 

    var displayedNumber = callPage.addObject(mainCtx, "text", {"name" : "displayedNumber", "xLoc" : screenWidth / 2, "yLoc" : incomingBar.yLoc + incomingBar.height * 0.4, "width" : screenWidth * 0.75, 
	    "height" : screenHeight * 0.4, "text" : currentNumber, "template" : incomingTextTemplate});

    var clockIcon = callPage.addObject(mainCtx, "image", {"name" : "clock", "image": images.clockIcon, "xLoc" : screenWidth * 0.7, 
	    "yLoc" : incomingBar.yLoc + 30, "width" : 50, "height" : 50} );

    var callStateText = callPage.addObject(mainCtx, "text", {"name" : "callStateText", "xLoc" : 15, "yLoc" : clockIcon.yLoc, "width" : screenWidth * 0.2, 
	    "height" : 100, "text" : stateText, "template" : callTimeTextTemplate});

    var callTime = callPage.addObject(mainCtx, "text", {"name" : "callTime", "xLoc" : clockIcon.xLoc + clockIcon.width + 10, "yLoc" : clockIcon.yLoc, "width" : screenWidth * 0.2, 
	    "height" : 100, "text" : "00:00:00", "template" : callTimeTextTemplate});

    initButtons(initState);   
}




