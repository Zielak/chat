'use strict';

var format = require('util').format;

var config = require('../config');
var configDB = require('../config-database');

var url = format('%s:%s@%s:%d/%s',configDB.user, configDB.pass, configDB.host, configDB.port, configDB.name);

var db = require('monk')(url);


// var method = Database.prototype;

// function Database(url) {


//   // require('monk')(this._url).then(function(db){

//     this.db = db;

//     // this.credentials = this.db.get('credentials');
//     // this.logs = this.db.get('logs');
//     // this.messages = this.db.get('messages');
//     // this.queue = this.db.get('queue');
//     // this.users = this.db.get('users'); 

//   // }.bind(this)).catch(function(err){

//   //   console.log("error connecting to the database");

//   // }.bind(this));

// }

// var database = new Database();

module.exports = db;
