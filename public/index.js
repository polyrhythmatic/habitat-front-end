//PIXI.js stuff
var renderer = new PIXI.autoDetectRenderer(300, 300, { antialias: true });

var stage  = new PIXI.Container();

var graphics = {};
for(var i = 1; i < 7; i ++){
	graphics["source" + i] = new PIXI.Graphics();
	graphics["source" + i].beginFill(0xFFFF0B, 0.5);
	graphics["source" + i].drawCircle(0, 0, 20);
	graphics["source" + i].endFill();
	stage.addChild(graphics["source" + i]);
}

function animate() {
	for(var i = 1; i < 7; i ++) {
		graphics["source" + i].position.x = scaledPositions["source" + i].x;
		graphics["source" + i].position.y = scaledPositions["source" + i].y;
		console.log(graphics["source" + i].position.x);
	}
	renderer.render(stage);
	requestAnimationFrame(animate);
}

$(document).ready(function() {
	$('.your-class').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		adaptiveHeight: true,
		appendDots: ".button-holder"
	});
	document.getElementById("main-canvas").appendChild(renderer.view);
	sizeCanvas();
	animate();
});

var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

var lastMessage;
ws.onmessage = function(event) {
	var message = JSON.parse(event.data);
	for (var key in message.sources) {
		if(lastMessage && message.sources[key] != lastMessage.sources[key]){
			document.getElementById(key).innerHTML = JSON.stringify(message.sources[key]);
			// console.log("changing " + key);
		}
	}
	if(lastMessage && message.positions != lastMessage.positions){
		copyPositions(message.positions.content.split(","));
	}

	lastMessage = message;
	// var li = document.createElement('li');
	// li.innerHTML = JSON.parse(event.data);
	// document.querySelector('#pings').appendChild(li);
};

var scaledPositions = {};
for(var i = 1; i < 7; i ++){
	scaledPositions["source" + i] = {
		"x": 0,
		"y": 0,
		"z": 0
	};
}
function copyPositions(positions){
	for(var i = 0; i < 6; i ++){
		var tempPos = {};
		tempPos.z = scalePosition(positions[i * 3]);
		tempPos.y = scalePosition(positions[i * 3 + 1]);
		tempPos.x = scalePosition(positions[i * 3 + 2]);
		var index = i + 1;
		scaledPositions["source" + index] = tempPos;
	}
}
function scalePosition(input){
	input = parseFloat(input);
	console.log("input is " + input);
	var output = (input + 1) * windowWidth / 2;
	console.log("output is " + output);
	return output;
}

window.onresize = function(event) {
	sizeCanvas();
};

var windowWidth;
function sizeCanvas(){
	windowWidth = $(window).width();
	renderer.view.style.width = windowWidth + "px";
	renderer.view.style.height = windowWidth + "px"; //this part adjusts the ratio:    
	renderer.resize(windowWidth, windowWidth);
}

//device orientation stuff
var compassDir;
if(window.DeviceOrientationEvent) {
	window.addEventListener("deviceorientation", function(event) {
		if(event.webkitCompassHeading) {
			compassDir = event.webkitCompassHeading;
		}
		else compassDir = event.alpha;
	}, false);
}
