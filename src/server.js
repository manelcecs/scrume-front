/*const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/'));

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(process.env.PORT || 3000);
*/
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
const server = require('http').Server(app);

const dist_dir = "/../dist/scrume-front";

app.use(express.static(__dirname + dist_dir));

server.listen(port, function() {
    console.log("App running on port " + port);
    console.log("Current dir: "+__dirname + dist_dir);
})

// PathLocationStrategy

app.get('', function(req, res) {
    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});