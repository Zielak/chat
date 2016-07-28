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

  // Will contain every registered username
  var _all = [];

  var _creds = db.get('credentials');
  // console.log(_creds);

  // Promise!
  _creds.find({}, function(docs){
    _all = docs;
    console.log('CREDENTIALS: _all contains: ',_all);
  });


  // One time init, create ADMIN user if nonexistent
  var admin = config.app.admin;
  _creds.findOne({name: admin.name}, function(docs){
    if(docs === null){
      console.warn("CREDENTIALS: Can't find default admin! I'm gonna create one from config.js");

      var creds = credentials.storeCreds({
        name:admin.name,
        group:'admins',
        pass:admin.pass
      });

      console.log("CREDENTIALS: Chat Admin created.");
    }
  });

  var storeCreds = function(o){
    var item = new Credentials(o.name, o.group, o.pass);
    _creds.insert(item);
    _all.push(_creds);

    return { status:'ok', data:_creds }
  }


  return {
    all: _all,

    storeCreds: storeCreds,
  }
})();

module.exports = credentials;
