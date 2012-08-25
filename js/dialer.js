/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var mainCanvas, bgCanvas, buttonCanvas;
var mainCtx, bgCtx, buttonCtx, mouseCtx;
var drawn = false;
var screenHeight;
var screenWidth;
var images = [];
var objects = [];
var mouseDrag = false, mouseDown = false;
var prevXMouse, prevYMouse;
var clicksDisabled = true;

var mainPageTitleTemplate = {"font" : "bold 40pt Arial", "lineWidth" : 2.5, "fillStyle" : "black", "strokeStyle" : "white", "textAlign" : "center",  
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 32, "shadowColor" : "rgba(0, 0, 110, 1.0)"};	

var mainPageButtonTemplate = {"font" : "bold 20pt Arial", "lineWidth" : 1.5, "strokeStyle" : "white", "textAlign" : "center", "textBaseline" : "middle", 
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 10, "shadowColor" : "black"};	

var buttonTextTemplate = {"font" : "bold 30pt Arial", "fillStyle" : "white", "textAlign" : "center", "textBaseline" : "middle",
    "shadowOffsetX" : 0, "shadowOffsetY" : 0, "shadowBlur" : 12, "shadowColor" : "rgba(50, 50, 50, 1.0)"};

var mainPage = new MenuObject({"name" : "main", "xLoc" : 0, "yLoc" : 0, "visible" : true});
var callPage = new MenuObject({"name" : "incomingCall", "xLoc" : 0, "yLoc" : 0, "visible" : true});

var currentPage = mainPage;
var currentNumber = " ";
var currentState = "idle";

var activeCall = null;
var activeService = null;
var noModems = false;

function onMouseDown(event) 
{	
    if (!clicksDisabled)
    {
	var selectedObj = objectsAtLocation(currentPage, event.clientX, event.clientY);		

	if (selectedObj && selectedObj.onClick)
	    selectedObj.onClick(event);

	prevXMouse = event.clientX;
	prevYMouse = event.clientY;
    }
}

function onMouseMove(event) 
{
    var selectedObj = objectsAtLocation(currentPage, event.clientX, event.clientY);		
    if (selectedObj && selectedObj.onMove)
	selectedObj.onMove(event);

    prevXMouse = event.clientX;
    prevYMouse = event.clientY; 	
}

function onMouseUp(event) 
{	

}

function resizeCanvas() 
{   
    screenWidth = $(window).width();
    screenHeight = $(window).height();

    $(mainCanvas).attr('width', screenWidth);
    $(mainCanvas).attr('height', screenHeight);
    $(bgCanvas).attr('width', screenWidth);
    $(bgCanvas).attr('height', screenHeight);
    $(buttonCanvas).attr('width', screenWidth);
    $(buttonCanvas).attr('height', screenHeight);
    $(mouseClicksLayer).attr('width', screenWidth);
    $(mouseClicksLayer).attr('height', screenHeight);

    if (currentPage)
	initPages();   
}

function loadImages(sources, callback)
{
    var loadedImages = 0;
    var numImages = 0;

    for (var src in sources) 
    {
	numImages++;
    }
    for (var src in sources) 
    {
	images[src] = new Image();
	images[src].onload = function(){
	    if (++loadedImages >= numImages) {		
		callback(images);
	    }
	};
	images[src].src = sources[src];
    }
}

function init() 
{   
    var activeAccount = null;
    var listener = {
	"onAccountUpdated": function(account) {}, 
	"onAccountAdded": function(account) { 
	    if (activeService == null) {
		activeAccount = account;
		activeService = tizen.call.getCallService(activeAccount.id);
	    }

	    noModems = false;
	    initMainPage();
	    switchMenu(mainPage);        	
	    clicksDisabled = false;


	    console.log("Modem available for account: " + activeAccount.id);
	}, 
	"onAccountRemoved": function(id) {
	    if (activeAccount && activeAccount.id == id) {
		// grab any account available
		activeAccount = tizen.account.findServices('')[0];
		try {
		    activeService = tizen.call.getCallService(activeAccount.id);
		} catch (err) {
		    noModems = true;
		    initMainPage();
		    switchMenu(mainPage);		        	    
		    console.log("No available modems!");
		}
	    }
	}
    }
    mainCanvas = document.getElementById("mainCanvas");
    bgCanvas = document.getElementById("bgCanvas");
    buttonCanvas = document.getElementById("buttonCanvas");
    mouseClicksLayer = document.getElementById("mouseClicks");

    mainCtx = mainCanvas.getContext("2d");
    bgCtx = bgCanvas.getContext("2d");
    buttonCtx = buttonCanvas.getContext("2d");
    mouseCtx = mouseClicksLayer.getContext("2d");

    var sources = {
phoneIcon: "images/bluetooth-smartphone.png",
	   callButton: "images/ivi_btn-call.png",
	   callButtonPressed: "images/ivi_btn-call-active.png",
	   closeButton: "images/ivi_btn-close.png",
	   deleteButton: "images/ivi_btn-delete.png",
	   deleteButtonActive: "images/ivi_btn-delete-active.png",
	   endCallButton: "images/ivi_btn-endcall.png",
	   endCallButtonActive: "images/ivi_btn-endcall-active.png",
	   incomingAcceptButton: "images/ivi_btn-incomingcall-accept.png",
	   incomingAcceptButtonActive: "images/ivi_btn-incomingcall-accept-active.png",
	   incomingDeclineButton: "images/ivi_btn-incomingcall-decline.png",
	   incomingDeclineButtonActive: "images/ivi_btn-incomingcall-decline-active.png",
	   listItem: "images/ivi_btn-list.png",
	   listItemActive: "images/ivi_btn-list-active.png",
	   numberButton: "images/ivi_btn-numbers.png",
	   numberButtonActive: "images/ivi_btn-numbers-active.png",
	   buttonBG: "images/ivi_buttonarea.png",
	   callIcon: "images/ivi_icon-call.png",
	   deleteIcon: "images/ivi_icon-delete.png",
	   endCallIcon: "images/ivi_icon-endcall.png",
	   deleteListItemIcon: "images/ivi_icon-list-delete.png",
	   deleteListItemIconActive: "images/ivi_icon-list-delete-active.png",
	   clockIcon: "images/ivi_icon-time.png",
	   textArea: "images/ivi_textarea.png",
	   bgImage: "images/ivi-v1_ivi-background.jpg" 
    };

    loadImages(sources, resizeCanvas);

    resizeCanvas();
    resizeCanvas();	

    $(window).bind('resize', resizeCanvas);

    mouseClicksLayer.addEventListener('mousedown', onMouseDown);
    mouseClicksLayer.addEventListener('mousemove', onMouseMove);
    mouseClicksLayer.addEventListener('mouseup', onMouseUp);

    tizen.account.addAccountListener(listener);
    setTimeout(function(){
	    if (tizen.account.findServices('').length == 0) 
	    {
	    noModems = true;
	    initMainPage();
	    switchMenu(mainPage);
	    console.log("No available modems!");       
	    }
	    },1000);

    var handler = {
onIncoming: function(call) {
		activeCall = call;
		currentState = "incomingCall";		
		initCallPage(currentState);    
		updateNumber(call.callData.LineIdentification);
		updateCallStateText("Incoming Call...");
		switchMenu(callPage);
	    },
onDialing: function(call) {
	       activeCall = call;
	   },
onAlerting: function(call) {
		activeCall = call;
	    },
onDisconnected: function(call, disconnectReason) {
		    activeCall = null;
		    stopTimer();
		    switchMenu(mainPage);
		},
onDisconnecting: function(call) {
		     stopTimer();
		     switchMenu(mainPage);
		 },
onAccepted: function(call) {
		startTimer();
		updateCallStateText("Active");
		activeCall = call;
	    },
onActivated: function(call) {
		 updateCallStateText("Active");
		 startTimer();
	     },
onError: function(call){
	     console.log("onError: "); console.log(call);
	 }
    };
    tizen.call.addCallHandler(handler);
}

function switchMenu(nextMenu)
{   
    currentPage.visible = false;		
    currentPage = nextMenu; 
    currentPage.visible = true;
    currentPage.drawMenu();	
}

function initPages()
{
    initMainPage();
    initCallPage(currentState);
    // initDisabledPage();

    bgCtx.drawImage(images.bgImage, 0, 0, screenWidth, screenHeight);
    currentPage.drawMenu();
}

$(document).ready(function () {
	init();
	});
