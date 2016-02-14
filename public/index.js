//PIXI.js stuff
var renderer = new PIXI.autoDetectRenderer(300, 300, { antialias: true });

var stage  = new PIXI.Container();
// stage.pivot(new PIXI.Point(150, 150));
var compassDir = 0;
var compassOffset = 0;

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
		// console.log(graphics["source" + i].position.x);
		stage.rotation = (compassDir + compassOffset)/180 * Math.PI;
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
			document.getElementById(key).innerHTML = entryToHtml(message.sources[key]);
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
	// console.log("input is " + input);
	var output = (input + 1) * windowWidth / 2;
	// console.log("output is " + output);
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
if(window.DeviceOrientationEvent) {
	window.addEventListener("deviceorientation", function(event) {
		if(event.webkitCompassHeading) {
			compassDir = event.webkitCompassHeading;
		}
		else compassDir = event.alpha;
	}, false);
}


// var testJson = { _id: 5381,

//   note: ' NOTES:  Range status: INTRODUCED;  Breeding status: UNKNOWN;  Frequency of sound: NORMAL;  General climate: HUMID;   Age: UNKNOWN AGE; Sex: UNKNOWN',

//   taxonomy: 

//    { kingdom: 'Metazoa',

//      species: [ 'Eclectus roratus' ],

//      genus: [ 'Eclectus' ],

//      family: [ 'Psittacidae' ],

//      order: [ 'Psittaciformes' ],

//      class: [ 'Aves' ],

//      phylum: [ 'Chordata' ] },

//   subject: 

//    { common_name: 'Eclectus Parrot',

//      stimulus: 'Natural',

//      behavior: 'advertise; call',

//      background_species: 'Ducula oceanica -- Micronesian Imperial-Pigeon; Platymantis pelewensis -- Palau Ground Frog; Onychoprion anaethetus -- Bridled Tern',

//      how_identified: 'Sight',

//      id_confidence: 'Certain',

//      red_list: [ 'Least Concern' ],

//      age_sex: [] },

//   recording: 

//    { recordist: 'Pratt, H. Douglas ',

//      accessory: 'Parabola 45.7cm (18in)',

//      recorder: 'UHER 4200',

//      channels: 'Mono',

//      cut_length_s: 84 },

//   environment: { physical_feature: 'Island; Rocky', habitat: 'Lagoon' },

//   date: 

//    { month: 7,

//      day: 4,

//      time: 1800,

//      timestamp: [ 'Tue Jul 04 1978 18:00:00 GMT-0400 (EDT)' ],

//      year: [ 1978 ] },

//   location: 

//    { coordinates: [ 134.54205322265625, 7.441900730133057 ],

//      type: 'Point' },

//   geo: 

//    { country: 'Palau',

//      locality: 'URUKTHAPEL; W. END OF ISLAND',

//      geoApprox: true,

//      falseGeo: false,

//      longitude: null,

//      latitude: null },

//   quality: [ 1 ],

//   __v: 0 };

function entryToHtml(inputJson) {
  var htmlString = '<ul class="entry-list">';
  if (inputJson.note) {
  	htmlString += '<li><span class="label">Note:</span>' + inputJson.note + '</li>';
  }
  if (inputJson.date) {
  	if (inputJson.date.timestamp[0]) {
  		var dateString = moment(new Date(inputJson.date.timestamp[0])).format("MMMM Mo, YYYY, h:mm A")
  		htmlString += '<li><span class="label">Date:</span>' + dateString +'</li>';
  	}
  }
  if (inputJson.subject) {
  	htmlString += '<li><span class="label">Subject:</span><ul class="entry-list">';
  	if (inputJson.subject.common_name) {
			htmlString += '<li><span class="label">Common Name:</span>' + inputJson.subject.common_name +'</li>';
  	}
  	if (inputJson.subject.stimulus) {
  		htmlString += '<li><span class="label">Stimulus:</span>' + inputJson.subject.stimulus +'</li>';
  	}
  	if (inputJson.subject.behavior) {
  		htmlString += '<li><span class="label">Behavior:</span>' + inputJson.subject.behavior +'</li>';
  	}
  	if (inputJson.subject.how_identified) {
  		htmlString += '<li><span class="label">How Identified:</span>' + inputJson.subject.how_identified +'</li>';
  	}
  	if (inputJson.subject.id_confidence) {
  		htmlString += '<li><span class="label">Identification Confidence:</span>' + inputJson.subject.id_confidence +'</li>';
  	}
  	if (inputJson.subject.red_list[0]) {
  		htmlString += '<li><span class="label">IUCN Red List:</span>' + inputJson.subject.red_list[0] +'</li>';
  	}
  	if (inputJson.subject.age_sex[0]) {
  		htmlString += '<li><span class="label">Age and Sex:</span>' + inputJson.subject.age_sex[0] +'</li>';
  	}
  	if (inputJson.subject.background_species) {
  		htmlString += '<li><span class="label">Background Species:</span>' + inputJson.subject.background_species +'</li>';
  	}
  	htmlString += '</ul></li>';
  }
  if (inputJson.taxonomy) {
  	htmlString += '<li><span class="label">Taxonomy:</span><ul class="entry-list">';
  	if (inputJson.taxonomy.kingdom) {
  		htmlString += '<li><span class="label">Kingdom:</span>' + inputJson.taxonomy.kingdom +'</li>';
  	}
  	if (inputJson.taxonomy.phylum[0]) {
  		htmlString += '<li><span class="label">Phylum:</span>' + inputJson.taxonomy.phylum[0] +'</li>';
  	}
  	if (inputJson.taxonomy.class[0]) {
  		htmlString += '<li><span class="label">Class:</span>' + inputJson.taxonomy.class[0] +'</li>';
  	}
  	if (inputJson.taxonomy.order[0]) {
  		htmlString += '<li><span class="label">Order:</span>' + inputJson.taxonomy.order[0] +'</li>';
  	}
  	if (inputJson.taxonomy.family[0]) {
  		htmlString += '<li><span class="label">Family:</span>' + inputJson.taxonomy.family[0] +'</li>';
  	}
  	if (inputJson.taxonomy.genus[0]) {
  		htmlString += '<li><span class="label">Genus:</span>' + inputJson.taxonomy.genus[0] +'</li>';
  	}
  	if (inputJson.taxonomy.species[0]) {
  		htmlString += '<li><span class="label">Species:</span>' + inputJson.taxonomy.species[0] +'</li>';
  	}
  	htmlString += '</ul></li>';
  }
  if (inputJson.geo) {
  	htmlString += '<li><span class="label">Location:</span>' + inputJson.geo.country + ', ' + inputJson.geo.locality + '</li>';
  }
  if (inputJson.environment) {
  	htmlString += '<li><span class="label">Environment:</span><ul class="entry-list">';
  	if (inputJson.environment.physical_feature) {
  		htmlString += '<li><span class="label">Physical Feature:</span>' + inputJson.environment.physical_feature +'</li>';
  	}
  	if (inputJson.environment.habitat) {
  		htmlString += '<li><span class="label">Habitat:</span>' + inputJson.environment.habitat +'</li>';
  	}
  	htmlString += '</ul></li>';
  }
  if (inputJson.recording) {
		htmlString += '<li><span class="label">Recording:</span><ul class="entry-list">';
		if (inputJson.recording.recordist) {
			htmlString += '<li><span class="label">Recordist:</span>' + inputJson.recording.recordist +'</li>';
		}
		if (inputJson.recording.accessory) {
			htmlString += '<li><span class="label">Accessory:</span>' + inputJson.recording.accessory +'</li>';
		}
		if (inputJson.recording.recorder) {
			htmlString += '<li><span class="label">Recorder:</span>' + inputJson.recording.recorder +'</li>';
		}
		if (inputJson.recording.channels) {
			htmlString += '<li><span class="label">Channels:</span>' + inputJson.recording.channels +'</li>';
		}
		if (inputJson.recording.cut_length_s) {
			htmlString += '<li><span class="label">Length:</span>' + inputJson.recording.cut_length_s +' seconds</li>';
		}
		htmlString += '</ul></li>';
  }

	htmlString += '</ul>';
  return htmlString;
}

// $(function() {
// 	$("#source1").html(entryToHtml(testJson));
// });
