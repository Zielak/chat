'use strict';

var express = require('express');
var app = express();
var port = 1991;

// var nano = require('nano')('http://localhost:5984');
var config = require('./config');

var routes = require('./routes');

var socket = require('./controllers/socket.js');
var users = require('./controllers/User.js');
users.addUser({ id: 'server', name: 'Server', group:'admin'} );

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

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
//app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', socket );

/**
 * Start Server
 */


/*app.get("/users", function(req, res){
  /*
  for(var i=0; i < clients.length; i++){
    users.push({
      id: clients[i].id,
      storeData: clients[i].store.data
      //name: clients[i].get('name')
    });
  }/
  
  res.header('Content-Type', 'application/json');
  res.header('Charset', 'utf-8');
  res.json(users.list());
})*/

