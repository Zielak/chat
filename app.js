'use strict';

// Chat configuration
var config = require('./config');
var configDB = require('./config-database');

// Load NODE stuff
var format = require('util').format;

var express = require('express');
var app = express();
var port = config.app.port;

// TODO: Remove credentials and use `db` instead
//var credentials = require('./credentials');

var credentials = require('./controllers/Credentials');
var mongo = require('mongodb').MongoClient;

mongo.connect(format('mongodb://%s:%s@%s:%d/%s',configDB.user, configDB.pass, configDB.host, configDB.port, configDB.name), function(err, db) {
  if(err) throw err;

  var col = db.collection('credentials');
  var admin = config.app.admin;
  col.findOne({name: admin.name}, function(err, docs){
    
    if(docs === null){
      console.warn("MONGO: Can't find default admin! I\'m gonna create one from config.js");

      var creds = credentials.storeCreds(admin.name, 'admins', admin.pass);

      col.insert(creds, function(err, docs){
        console.log("MONGO: Chat Admin created.");
      })
    }
  });

  console.log("MONGO: Init complete");
  

})






var routes = require('./routes');
 
var socket = require('./controllers/socket.js');
var users = require('./controllers/User.js');
var messages = require('./controllers/Message.js');





// Hook Socket.io into Express
var io = require('socket.io').listen(app.listen(port));

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
// fix from http://stackoverflow.com/questions/15054987/express-and-angularjs-web-page-freezes-when-attempting-to-open-home-page
/*app.get('partials/:name', function(request, response) {
  var name = request.params.name;
  response.render('partials/' + name);
});*/

// JSON API
//app.get('/api/name', api.name);


/*  THIS THING BROKE CLIENT,
    browser freezes when trying to get 404 document
    infinite loop of redirection.
app.get('*', routes.index);
*/

// Socket.io Communication
io.sockets.on('connection', socket );
