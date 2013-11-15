'use strict';

var express = require('express');
var app = express();
var port = 1991;

// var nano = require('nano')('http://localhost:5984');
var config = require('./config');
var credentials = require('./credentials');

var routes = require('./routes');

var socket = require('./controllers/socket.js');
var users = require('./controllers/User.js');
var messages = require('./controllers/Message.js');





// Hook Socket.io into Express
var io = require('socket.io').listen(app.listen(port));

//console.log("Listening on port " + port);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/client'));
  app.use(app.router);
});

/* Not needed for now, I alwasy want errors
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
*/

/* =============================================
 *                   Routes
 * ===========================================*/

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
//app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', socket );







/* =============================================
 *              Credentials Init
 * ===========================================*/
for (var i = credentials.length - 1; i >= 0; i--) {
  var u = credentials[i];
  users.registerUser({
    id: false,
    name: u.name,
    group: u.group,
    pass: u.pass
  })
};
