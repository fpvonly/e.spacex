var express = require('express');
var path = require('path');

var app = express();
var server = app.listen(31, function() {
  console.log('e.spaceX game server started');
});

app.use('/assets', express.static( path.resolve('assets')));
app.use('/build', express.static( path.resolve('build')));

app.get('/', function(req, res) {
  res.sendFile(  __dirname + '/index.html' );
});
