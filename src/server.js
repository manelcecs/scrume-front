const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
const server = require('http').Server(app);
const httpProxy = require('http-proxy');

const proxy = new httpProxy.RoutingProxy();


const dist_dir = "/../dist/scrume-front";

const back = "https://api-scrume.cleverapps.io/api";
const front = "https://scrume-brand.herokuapp.com";
const cors = "Access-Control-Allow-Origin";

app.use(express.static(__dirname + dist_dir));

server.listen(port, function() {
    console.log("App running on port " + port);
    console.log("Current dir: "+__dirname + dist_dir);
})


function apiProxy(host, port) {
    return function(req, res, next) {
      if(req.url.match(new RegExp('^\/api\/'))) {
        proxy.proxyRequest(req, res, {host: host, port: port});
      } else {
        next();
      }
    }
  }
  
  app.configure(function() {
    app.use(express.static(process.cwd() + "/generated"));
    app.use(apiProxy(back));
    app.use(express.bodyParser());
    app.use(express.errorHandler());
  });

// PathLocationStrategy

app.get('', function(req, res) {

    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});

app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname + dist_dir+'/index.html'));
});
