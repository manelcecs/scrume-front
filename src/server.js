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
const cors = "Access-Control-Allow-Origin";

app.use(express.static(__dirname + dist_dir));

server.listen(port, function() {
    console.log("App running on port " + port);
    console.log("Current dir: "+__dirname + dist_dir);
})
app.use((req, res, next)=>{
    res.header(cors, "*");
    next();
});

app.all("/api/*", function(req, res){
    console.log("Petición al back");
    let url = req.originalUrl.split(front)[0];
    console.log(url);
    apiProxy.web(req, res, {target: front+url});
});
// PathLocationStrategy

app.get('', function(req, res) {

    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});

app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});
