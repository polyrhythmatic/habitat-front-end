var WebSocketServer = require("ws").Server;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http");
var port = process.env.PORT || 5000;
// var lib = require("library.json");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// app.get("/", function(req, res) {
//     res.sendfile("index.html");
// });

var sourceData = {
	"sources": {
		"source1" : "placeholder",
		"source2" : "placeholder",
		"source3" : "placeholder",
		"source4" : "placeholder",
		"source5" : "placeholder",
		"source6" : "placeholder"
	},
	"positions" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

app.post("/source1", function(req, res) {
    console.log(req.body);
    sourceData.sources.source1 = req.body;
    res.end("yes");
});

app.post("/source2", function(req, res) {
    console.log(req.body);
    sourceData.sources.source2 = req.body;
    res.end("yes");
});
app.post("/source3", function(req, res) {
    console.log(req.body);
    sourceData.sources.source3 = req.body;
    res.end("yes");
});
app.post("/source4", function(req, res) {
    console.log(req.body);
    sourceData.sources.source4 = req.body;
    res.end("yes");
});
app.post("/source5", function(req, res) {
    console.log(req.body);
    sourceData.sources.source5 = req.body;
    res.end("yes");
});
app.post("/source6", function(req, res) {
    console.log(req.body);
    sourceData.sources.source6 = req.body;
    res.end("yes");
});
app.post("/positions", function(req, res) {
    console.log(req.body);
    sourceData.positions = req.body;
    res.end("yes");
});

var server = http.createServer(app);
server.listen(port);

app.use(express.static('public'));

var wss = new WebSocketServer({
    server: server
});
console.log("websocket server created");

wss.on("connection", function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(sourceData), function() {});
    }, 16);

    console.log("websocket connection open");

    ws.on("close", function() {
        console.log("websocket connection close");
        clearInterval(id);
    });
});
