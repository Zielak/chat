var crypto = require('crypto');

var config = require('../config');

var db = require('./Database');


function Credentials(name, group, pass){
  this.name = name;
  this.salt = Math.round((new Date().valueOf() * Math.random()))+'';
  this.pass = crypto.createHash('sha256').update(pass + this.salt).digest('hex') || false;
  this.group = group || 'guests';
}
Credentials.prototype = {
  constructor: Credentials
}




var credentials = (function () {

  var col = db.get('credentials');

  // Will contain every registered username
  var _all = [];
  col.find({}, function(err, docs){
    _all = docs;
    console.log('CREDENTIALS: docs = ',docs);
  });
  console.log('CREDENTIALS: _all contains: ',_all);

  // One time init, create ADMIN user if nonexistent
  var admin = config.app.admin;
  col.findOne({name: admin.name}, function(err, docs){
    if(docs === null){
      console.warn("CREDENTIALS: Can't find default admin! I\'m gonna create one from config.js");

      var creds = credentials.storeCreds({
        name:admin.name,
        group:'admins',
        pass:admin.pass
      });

      console.log("CREDENTIALS: Chat Admin created.");
    }
  });

  var storeCreds = function(o){
    var creds = new Credentials(o.name, o.group, o.pass);
    var col = db.get('credentials');
    col.insert(creds);
    _all.push(creds);

    return { status:'ok', data:creds }
  }


  return {
    all: _all,

    storeCreds: storeCreds,
  }
})();

module.exports = credentials;
