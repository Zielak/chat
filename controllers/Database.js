'use strict';

var format = require('util').format;

var config = require('../config');
var configDB = require('../config-database');

var db = require('monk')(format('mongodb://%s:%s@%s:%d/%s',configDB.user, configDB.pass, configDB.host, configDB.port, configDB.name));
var credentials = db.get('credentials');
var logs = db.get('logs');
var messages = db.get('messages');
var queue = db.get('queue');
var users = db.get('users');

var database = (function(){

    // Create new collections if they don't exist
    // Do I need to? Or are they created on first inserted codument?

    return {
        credentials: credentials,
        logs: logs,
        messages: messages,
        queue: queue,
        users: users
    }

})();





module.exports = database;
