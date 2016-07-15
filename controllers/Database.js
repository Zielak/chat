'use strict';

var format = require('util').format;

var config = require('../config');
var configDB = require('../config-database');

var monk = require('monk');
var url = format('%s:%s@%s:%d/%s',configDB.user, configDB.pass, configDB.host, configDB.port, configDB.name);

var db = monk(url);



var database = (function(){

  var ready = false;
  var credentials;
  var logs;
  var messages;
  var queue;
  var users;

  db.then(function(){
    ready = true;

    credentials = db.get('credentials');
    logs = db.get('logs');
    messages = db.get('messages');
    queue = db.get('queue');
    users = db.get('users');

    console.log('Connected correctly to server')
  });


  // Create new collections if they don't exist
  // Do I need to? Or are they created on first inserted codument?

  return {
    redy: ready,
    credentials: credentials,
    logs: logs,
    messages: messages,
    queue: queue,
    users: users
  }

})(); 



console.log('out Database');


module.exports = database;
