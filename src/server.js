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
const port = process.env.PORT || 8000;
const server = require('http').Server(app);

app.use(express.static(__dirname, 'dist', {index: false}));


server.listen(port, function() {
    console.log("App running on port " + port);
})

// PathLocationStrategy

app.get('', function(req, res) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
const server = require('http').Server(app);

const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();

const dist_dir = "/../dist/scrume-front";

const back = "https://api-scrume.cleverapps.io/api";
const front = "https://scrume-brand.herokuapp.com";
const corsName = "Access-Control-Allow-Origin";

var cors = require('cors');

app.use(express.static(__dirname + dist_dir));

server.listen(port, function() {
    console.log("App running on port " + port);
    console.log("Current dir: "+__dirname + dist_dir);
})

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("habilitado cors");
    console.log("headers: "+res.header);
    next();
});

app.use(cors());


// PathLocationStrategy

app.get('', function(req, res) {

    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});

app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});
