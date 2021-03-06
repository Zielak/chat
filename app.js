'use strict';

// Chat configuration
var config = require('./config');
var configDB = require('./config-database');

// Load NODE stuff
var express = require('express');
var app = express();
var port = config.app.port;

var bodyParser = require('body-parser');
var serveFavicon = require('serve-favicon');
var methodOverride = require('method-override');

// Database stuff
var db = require('./controllers/Database');
var credentials = require('./controllers/Credentials');

// HTTP stuff
var routes = require('./routes');
var socket = require('./controllers/socket.js');

// APP stuff
var users = require('./controllers/User.js');
var messages = require('./controllers/Message.js');





// Hook Socket.io into Express
var io = require('socket.io').listen(app.listen(port));

// app.configure(function(){
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});
app.use(bodyParser.json());
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method'));
app.use(express.static(__dirname + '/client'));
// });

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
